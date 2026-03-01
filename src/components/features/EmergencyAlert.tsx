'use client';
import { useState } from 'react';
import { Phone, AlertTriangle } from 'lucide-react';

export default function EmergencyAlert() {
    const [showNumbers, setShowNumbers] = useState(false);

    // Mock emergency numbers - localization could assume 'World' or generic
    const emergencyNumbers = [
        { name: 'Emergency Services', number: '911 / 112' },
        { name: 'Ambulance', number: '102' }, // Common in some regions
        { name: 'Police', number: '100' },
    ];

    return (
        <div className="glass-panel border-red-500/30 bg-red-950/20 p-6 rounded-[2.5rem] animate-in fade-in duration-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            <h3 className="text-xl font-black text-red-500 mb-4 flex items-center gap-3 uppercase tracking-widest">
                <AlertTriangle className="animate-pulse" size={24} /> Critical Alert
            </h3>
            <p className="text-xs text-red-400/80 mb-6 font-medium leading-relaxed">
                IMMEDIATE_THREAT_DETECTED: Biological safety protocols required. Do not rely on AI synthesis for life-critical emergencies.
            </p>

            {!showNumbers ? (
                <button
                    onClick={() => setShowNumbers(true)}
                    className="w-full bg-gradient-to-r from-red-600 to-amber-600 text-white p-4 rounded-2xl font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse"
                >
                    INITIALIZE SOS_LINK
                </button>
            ) : (
                <div className="space-y-3">
                    {emergencyNumbers.map((e, idx) => (
                        <div key={idx} className="flex justify-between items-center glass-panel border-red-500/20 p-4 rounded-2xl group hover:bg-red-500/5 transition-colors">
                            <span className="font-bold text-red-200 text-xs uppercase tracking-wider">{e.name}</span>
                            <a href={`tel:${e.number}`} className="flex items-center gap-2 text-red-500 font-black hover:text-red-400 transition-colors">
                                <Phone size={14} /> {e.number}
                            </a>
                        </div>
                    ))}
                    <button
                        onClick={() => setShowNumbers(false)}
                        className="w-full mt-4 text-[10px] font-black uppercase tracking-widest text-red-500/40 hover:text-red-500/60 transition-colors"
                    >
                        TERMINATE SOS_OVERLAY
                    </button>
                </div>
            )}
        </div>
    );
}
