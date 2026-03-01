'use client';
import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInputProps {
    onTranscript: (text: string) => void;
    disabled?: boolean;
}

interface SpeechRecognitionEvent extends Event {
    results: {
        [key: number]: {
            [key: number]: {
                transcript: string;
            };
        };
    };
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
    start: () => void;
    stop: () => void;
}

interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition;
    SpeechRecognition?: new () => SpeechRecognition;
}

export default function VoiceInput({ onTranscript, disabled = false }: VoiceInputProps) {
    const [isListening, setIsListening] = useState(false);
    const [lang, setLang] = useState<'en-US' | 'hi-IN'>('en-US');
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            const SpeechRecognitionConstructor = (window as unknown as Window).webkitSpeechRecognition || (window as unknown as Window).SpeechRecognition;
            if (SpeechRecognitionConstructor) {
                const recognition = new SpeechRecognitionConstructor();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = lang;

                recognition.onresult = (event: SpeechRecognitionEvent) => {
                    const transcript = event.results[0][0].transcript;
                    onTranscript(transcript);
                    setIsListening(false);
                };

                recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                    console.error("Speech recognition error", event.error);
                    setIsListening(false);
                };

                recognition.onend = () => {
                    setIsListening(false);
                };

                recognitionRef.current = recognition;
            }
        }
    }, [onTranscript, lang]);

    const toggleListening = () => {
        if (disabled) return;
        if (!recognitionRef.current) {
            alert("Voice recognition not supported in this browser.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const toggleLanguage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (disabled) return;
        setLang(prev => prev === 'en-US' ? 'hi-IN' : 'en-US');
    };

    if (typeof window !== 'undefined' && !('webkitSpeechRecognition' in window)) return null;

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={toggleLanguage}
                disabled={disabled}
                className="text-[9px] font-black tracking-[0.2em] glass-panel border-[#22D3EE]/20 text-[#22D3EE] px-2 py-1 rounded-full hover:bg-[#22D3EE]/10 transition-colors uppercase"
                title="Switch Language Cluster"
            >
                {lang === 'en-US' ? 'LOGIC_EN' : 'LOGIC_HI'}
            </button>
            <button
                onClick={toggleListening}
                disabled={disabled}
                className={`group relative h-12 w-12 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 ${isListening
                        ? 'bg-red-500/20 text-red-500 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                        : 'glass-panel holographic-border text-[#22D3EE] hover:bg-[#22D3EE]/10'
                    }`}
                title={`Neural Input (${lang === 'en-US' ? 'English' : 'Hindi'})`}
            >
                {isListening && (
                    <div className="absolute inset-0 rounded-full animate-ping bg-red-500/20" />
                )}
                {isListening ? <MicOff size={20} /> : <Mic size={20} className="group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all" />}
            </button>
        </div>
    );
}
