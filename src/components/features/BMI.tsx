'use client';
import React, { useState } from 'react';
import { Calculator, X, Info } from 'lucide-react';

interface BMICalculatorProps {
    onClose?: () => void;
}

export default function BMICalculator({ onClose }: BMICalculatorProps) {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [results, setResults] = useState<{ bmi: number; bmr: number; category: string } | null>(null);

    const calculateHealthMetrics = () => {
        if (!weight || !height || !age) {
            alert("Please enter weight, height, and age.");
            return;
        }

        const w = parseFloat(weight);
        const h = parseFloat(height);
        const a = parseFloat(age);
        const h_m = h / 100; // convert cm to m

        if (w <= 0 || h <= 0 || a <= 0) {
            alert("Please enter valid positive numbers for all fields.");
            return;
        }

        // BMI Calculation
        const bmiValue = w / (h_m * h_m);

        // BMR Calculation (Mifflin-St Jeor Equation)
        let bmrValue = 0;
        if (gender === 'male') {
            bmrValue = (10 * w) + (6.25 * h) - (5 * a) + 5;
        } else {
            bmrValue = (10 * w) + (6.25 * h) - (5 * a) - 161;
        }

        let category = '';
        if (bmiValue < 18.5) category = 'Underweight';
        else if (bmiValue < 25) category = 'Normal weight';
        else if (bmiValue < 30) category = 'Overweight';
        else category = 'Obese';

        setResults({ bmi: bmiValue, bmr: bmrValue, category });
    };

    const clearMetrics = () => {
        setWeight('');
        setHeight('');
        setAge('');
        setResults(null);
    };

    return (
        <div className="glass-panel holographic-border p-6 rounded-[2.5rem] animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3 text-white">
                    <Calculator className="w-8 h-8 text-[#22D3EE] drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                    <h2 className="text-2xl font-black neon-text-glow">Neuro-Metrics</h2>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={clearMetrics}
                        className="text-xs text-gray-500 hover:text-[#8D7B68] transition-colors underline"
                        type="button"
                    >
                        Clear
                    </button>
                    {onClose && (
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors" type="button">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Gender</label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setGender('male');
                                    if (results) {
                                        const w = parseFloat(weight);
                                        const h = parseFloat(height);
                                        const a = parseFloat(age);
                                        const bmrValue = (10 * w) + (6.25 * h) - (5 * a) + 5;
                                        setResults(prev => prev ? { ...prev, bmr: bmrValue } : null);
                                    }
                                }}
                                className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 flex items-center justify-center gap-2 ${gender === 'male'
                                        ? 'bg-[#22D3EE] text-black border-[#22D3EE] shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                                        : 'bg-white/5 text-white/40 border-white/10 hover:border-[#22D3EE]/30'
                                    }`}
                            >
                                MALE_CORE
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setGender('female');
                                    if (results) {
                                        const w = parseFloat(weight);
                                        const h = parseFloat(height);
                                        const a = parseFloat(age);
                                        const bmrValue = (10 * w) + (6.25 * h) - (5 * a) - 161;
                                        setResults(prev => prev ? { ...prev, bmr: bmrValue } : null);
                                    }
                                }}
                                className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 flex items-center justify-center gap-2 ${gender === 'female'
                                        ? 'bg-[#22D3EE] text-black border-[#22D3EE] shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                                        : 'bg-white/5 text-white/40 border-white/10 hover:border-[#22D3EE]/30'
                                    }`}
                            >
                                FEMALE_CORE
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Age (years)</label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-[#22D3EE] outline-none transition-all text-white font-bold"
                            placeholder="00"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Weight (kg)</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-[#22D3EE] outline-none transition-all text-white font-bold"
                            placeholder="00"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Height (cm)</label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-[#22D3EE] outline-none transition-all text-white font-bold"
                            placeholder="00"
                        />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={calculateHealthMetrics}
                    className="w-full bg-gradient-to-r from-[#22D3EE] to-[#0E7490] active:scale-95 text-black font-black uppercase tracking-[0.2em] py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] mt-4"
                >
                    Process Neural Scan
                </button>

                {results && (
                    <div className="mt-8 space-y-6 animate-in slide-in-from-bottom-4 duration-700">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="glass-panel p-5 rounded-3xl text-center holographic-border bg-[#22D3EE]/5">
                                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-[#22D3EE]/60 mb-2">Neural BMI</p>
                                <p className="text-4xl font-black text-white neon-text-glow">{results.bmi.toFixed(1)}</p>
                                <div className={`text-[10px] mt-3 font-black uppercase tracking-widest px-2 py-1 rounded-full ${results.category === 'Normal weight' ? 'text-emerald-400 bg-emerald-400/10' : 'text-amber-400 bg-amber-400/10'
                                    }`}>
                                    {results.category}
                                </div>
                            </div>
                            <div className="glass-panel p-5 rounded-3xl text-center holographic-border">
                                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/40 mb-2">Energy Base</p>
                                <p className="text-3xl font-black text-[#8D7B68]">{Math.round(results.bmr)}</p>
                                <p className="text-[10px] mt-1 text-white/20 font-bold">KCAL/SEC_REST</p>
                            </div>
                        </div>

                        <div className="glass-panel border-white/5 rounded-3xl p-5 flex gap-4 items-start relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#22D3EE]/40" />
                            <Info className="w-6 h-6 text-[#22D3EE] mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-white/60 leading-relaxed font-medium">
                                <strong className="text-white">COGNITIVE_ASSET:</strong> Basal Metabolic Rate represents dormant energy consumption. Maintenance threshold: <span className="text-[#22D3EE] font-black">{Math.round(results.bmr * 1.2)} kcal/day</span>.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
