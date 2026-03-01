let reminders = [];
const DB_NAME = 'MedicineRemindersDB';
const STORE_NAME = 'reminders';
let checkInterval = null;

// IDB Helper
const getDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e.target.error);
    });
};

const saveRemindersToIDB = async (list) => {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    list.forEach(r => store.put(r));
    return new Promise((resolve) => {
        tx.oncomplete = () => resolve();
    });
};

const loadRemindersFromIDB = async () => {
    try {
        const db = await getDB();
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();
        return new Promise((resolve) => {
            request.onsuccess = () => {
                reminders = request.result;
                console.log('SW: Loaded from IDB', reminders.length);
                startCheckLoop();
                resolve(request.result);
            };
        });
    } catch (e) {
        console.error('SW: IDB Load failed', e);
    }
};

const startCheckLoop = () => {
    if (checkInterval) return;
    console.log('SW: Starting background check loop');
    checkInterval = setInterval(checkReminders, 30000);
};

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            clients.claim(),
            loadRemindersFromIDB()
        ])
    );
});

// Receive reminders from the main thread
self.addEventListener('message', (event) => {
    if (event.data) {
        if (event.data.type === 'SYNC_REMINDERS') {
            reminders = event.data.reminders;
            saveRemindersToIDB(reminders).then(() => {
                startCheckLoop();
            });
            console.log('SW: Reminders synced', reminders.length);
        } else if (event.data.type === 'HEARTBEAT') {
            // Heartbeat keeps the SW active while the tab is open
            startCheckLoop();
        }
    }
});

// Background check logic
const checkReminders = () => {
    if (reminders.length === 0) return;

    const now = new Date();
    // Use local time for comparison
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const today = now.toDateString();

    let changed = false;
    reminders.forEach(r => {
        // Standard reminder check
        if (r.time === currentTime && r.lastNotified !== today) {
            triggerNotification(r);
            r.lastNotified = today;
            changed = true;
            console.log('SW: Triggered notification for', r.medicine);
        }
        // Snooze check
        if (r.isSnoozed && r.snoozeTime === currentTime) {
            triggerNotification(r);
            r.isSnoozed = false;
            changed = true;
            console.log('SW: Triggered snoozed notification for', r.medicine);
        }
    });

    if (changed) {
        saveRemindersToIDB(reminders);
    }
};

const triggerNotification = (r) => {
    self.registration.showNotification("Medicine Alert 💊", {
        body: `It's time for ${r.medicine}. Please take it now.`,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: `med-${r.id}`,
        renotify: true,
        requireInteraction: true,
        vibrate: [200, 100, 200, 100, 200, 100, 400],
        actions: [
            { action: 'take', title: '✅ Taken' },
            { action: 'snooze', title: '⏰ Snooze 5m' }
        ],
        data: { id: r.id, medicine: r.medicine }
    });
};

self.addEventListener('notificationclick', (event) => {
    const rId = event.notification.data.id;
    const medicine = event.notification.data.medicine;

    event.notification.close();

    if (event.action === 'snooze') {
        const now = new Date();
        const snoozeDate = new Date(now.getTime() + 5 * 60000);
        const snoozeTime = `${String(snoozeDate.getHours()).padStart(2, '0')}:${String(snoozeDate.getMinutes()).padStart(2, '0')}`;

        reminders = reminders.map(r => {
            if (r.id === rId) {
                return { ...r, isSnoozed: true, snoozeTime: snoozeTime };
            }
            return r;
        });
        saveRemindersToIDB(reminders);
        console.log(`SW: Snoozed ${medicine} until ${snoozeTime}`);
    } else {
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
                if (clientList.length > 0) {
                    return clientList[0].focus();
                }
                return clients.openWindow('/');
            })
        );
    }
});
