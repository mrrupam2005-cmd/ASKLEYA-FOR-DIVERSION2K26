'use client';
import { useState, useEffect, useCallback } from 'react';
import { Bell, Trash2 } from 'lucide-react';

interface Reminder {
    id: number;
    medicine: string;
    time: string;
    lastNotified?: string; // Date string to prevent duplicate notifications
}

export default function MedicineReminder() {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [medicine, setMedicine] = useState('');
    const [time, setTime] = useState('');

    const syncToSW = useCallback((list: Reminder[]) => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                if (registration.active) {
                    registration.active.postMessage({
                        type: 'SYNC_REMINDERS',
                        reminders: list
                    });
                }
            });
        }
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem('medicineReminders');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setReminders(parsed);
                // Initial sync when SW is ready
                syncToSW(parsed);
            } catch (e) {
                console.error("Failed to parse reminders", e);
            }
        }

        if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    }, [syncToSW]);

    const addReminder = () => {
        if (medicine && time) {
            const newReminder = { id: Date.now(), medicine, time };
            const updated = [...reminders, newReminder];
            setReminders(updated);
            localStorage.setItem('medicineReminders', JSON.stringify(updated));
            syncToSW(updated);
            setMedicine('');
            setTime('');
        }
    };

    const removeReminder = (id: number) => {
        const updated = reminders.filter(r => r.id !== id);
        setReminders(updated);
        localStorage.setItem('medicineReminders', JSON.stringify(updated));
        syncToSW(updated);
    };

    return (
        <div className="glass-panel holographic-border p-6 rounded-[2.5rem] animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-white neon-text-glow flex items-center gap-3">
                    <Bell className="text-[#22D3EE]" size={28} /> Bio-Schedule
                </h3>
            </div>

            <div className="grid gap-4 mb-8">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 ml-1">Medicine Name</label>
                    <input
                        type="text"
                        placeholder="Neural ID: e.g. Paracetamol"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent outline-none transition-all text-white font-medium"
                        value={medicine}
                        onChange={(e) => setMedicine(e.target.value)}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 ml-1">Time</label>
                    <input
                        type="time"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm font-medium"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </div>
                <button
                    onClick={addReminder}
                    className="w-full bg-[#22D3EE] text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] mt-2"
                >
                    Initialize Reminder
                </button>
            </div>

            <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">My Schedule</h4>
                {reminders.map(r => (
                    <div key={r.id} className="flex justify-between items-center glass-panel holographic-border p-5 rounded-3xl group hover:scale-[1.02] transition-transform">
                        <div className="flex flex-col">
                            <span className="font-bold text-white mb-1">{r.medicine}</span>
                            <span className="text-[10px] font-black text-[#22D3EE] bg-[#22D3EE]/10 px-3 py-1 rounded-full border border-[#22D3EE]/20 w-fit">
                                SYNC: {r.time}
                            </span>
                        </div>
                        <button onClick={() => removeReminder(r.id)} className="text-gray-300 hover:text-red-500 p-2 transition-colors rounded-full hover:bg-red-50">
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
                {reminders.length === 0 && (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-400 text-sm font-medium italic">Your schedule is empty.</p>
                    </div>
                )}
            </div>

            <button
                onClick={() => {
                    if ("Notification" in window) {
                        Notification.requestPermission().then(permission => {
                            if (permission === "granted") {
                                new Notification("AI Doctor Reminders", {
                                    body: "Notification system is active! You will receive medicine alerts even when the app is closed.",
                                    icon: "/favicon.ico"
                                });
                            }
                        });
                    }
                }}
                className="w-full mt-4 text-[10px] text-[#8D7B68] font-bold hover:underline"
            >
                Test Notification System
            </button>

            <p className="mt-2 text-[10px] text-gray-400 leading-relaxed text-center px-4">
                Tip: Reminders work in the background. Keep your browser notifications enabled for this site.
            </p>
        </div>
    );
}
