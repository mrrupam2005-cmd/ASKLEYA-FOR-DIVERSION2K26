'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, User, Bot, Activity, Bell, X, PlusCircle, History, MessageCircle, Scale, Trash2, ExternalLink, AlertCircle } from 'lucide-react';
import { getAIResponse, AIResponse } from '@/lib/ai-service';
import VoiceInput from '@/components/features/VoiceInput';
import ImageUploader from '@/components/features/ImageUploader';
import Image from 'next/image';
import BMICalculator from '@/components/features/BMI';
import MedicineReminder from '@/components/features/MedicineReminder';
import EmergencyAlert from '@/components/features/EmergencyAlert';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface Source {
    title: string;
    url: string;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
    image?: string; // Data URL for display
    isExpertRequired?: boolean;
    sources?: Source[];
    tavilyUnavailable?: boolean;
}

interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    timestamp: number;
}

type ViewMode = 'chat' | 'bmi' | 'reminder' | 'history';

// Basic Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() { return { hasError: true }; }
    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-screen bg-[#FBF7F4] p-6 text-center text-[#5C4D3E]">
                    <Bot size={48} className="mb-4 text-[#8D7B68] mx-auto" />
                    <h2 className="text-2xl font-bold mb-4 text-[#5C4D3E]">Something went wrong.</h2>
                    <p className="text-gray-600 mb-6 font-medium">The AI Doctor had a small hiccup. Please refresh the page.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-[#8D7B68] text-white px-8 py-3 rounded-full font-bold hover:bg-[#7D6B58] transition shadow-lg"
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default function ChatInterface() {
    return (
        <ErrorBoundary>
            <ChatContent />
        </ErrorBoundary>
    );
}

function ChatContent() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [inputText, setInputText] = useState('');
    const [pendingImage, setPendingImage] = useState<File | null>(null);
    const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('chat');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const currentSession = sessions.find(s => s.id === currentSessionId);
    const messages = currentSession?.messages || [];

    const totalMessages = sessions.reduce((sum, s) => sum + s.messages.length, 0);
    const hasExpertFlag = messages.some((m) => m.isExpertRequired);

    // Register Service Worker and Initial Sync
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js', { scope: '/' })
                .then(reg => {
                    console.log('Service Worker registered', reg);
                    // Initial sync of reminders if they exist
                    const syncReminders = () => {
                        if (reg.active) {
                            reg.active.postMessage({
                                type: 'SYNC_REMINDERS',
                                reminders: JSON.parse(localStorage.getItem('medicineReminders') || '[]')
                            });
                        }
                    };
                    if (reg.active) syncReminders();
                    else reg.addEventListener('activate', syncReminders);

                    // Heartbeat to keep SW alive while app is open
                    setInterval(() => {
                        if (reg.active) {
                            reg.active.postMessage({ type: 'HEARTBEAT' });
                        }
                    }, 20000);
                })
                .catch(err => console.error('Service Worker registration failed', err));
        }
    }, []);

    // Load sessions from localStorage on mount
    useEffect(() => {
        const savedSessions = localStorage.getItem('ai_doctor_sessions');
        const legacyHistory = localStorage.getItem('ai_doctor_chat_history');

        if (savedSessions) {
            try {
                const parsed = JSON.parse(savedSessions);
                setSessions(parsed);
                if (parsed.length > 0) {
                    setCurrentSessionId(parsed[0].id);
                }
            } catch (e) {
                console.error("Failed to parse saved sessions", e);
            }
        } else if (legacyHistory) {
            // Migrate old data to a session
            try {
                const messages = JSON.parse(legacyHistory);
                const firstSession: ChatSession = {
                    id: Date.now().toString(),
                    title: messages[0]?.content.substring(0, 30) || 'Previous Chat',
                    messages: messages,
                    timestamp: Date.now()
                };
                setSessions([firstSession]);
                setCurrentSessionId(firstSession.id);
                localStorage.removeItem('ai_doctor_chat_history');
            } catch (e) {
                console.error("Migration failed", e);
            }
        }
    }, []);

    // Save sessions to localStorage whenever they change
    useEffect(() => {
        if (sessions.length > 0) {
            localStorage.setItem('ai_doctor_sessions', JSON.stringify(sessions));
        } else {
            localStorage.removeItem('ai_doctor_sessions');
        }
    }, [sessions]);

    // Initial Greeting for New Chat
    const createNewChat = useCallback(() => {
        const newId = Date.now().toString();
        const newSession: ChatSession = {
            id: newId,
            title: 'New Conversation',
            messages: [
                {
                    role: 'assistant',
                    content: "Hi, I'm your AI doctor. (नमस्ते, मैं आपका AI डॉक्टर हूँ।)\nHow can I help you? What is your disease symptoms? (मैं आपकी कैसे मदद कर सकता हूँ? आपके लक्षण क्या हैं?)"
                }
            ],
            timestamp: Date.now()
        };
        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newId);
        setViewMode('chat');
    }, []);

    useEffect(() => {
        if (sessions.length === 0) {
            createNewChat();
        }
    }, [sessions.length, createNewChat]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, viewMode]);

    const handleSendMessage = useCallback(async (text: string = inputText, imageFile?: File) => {
        const fileToSend = imageFile || pendingImage;
        if ((!text.trim() && !fileToSend) || isLoading || !currentSessionId) return;

        let imagePreviewUrl: string | undefined = pendingImagePreview || undefined;
        if (imageFile && !imagePreviewUrl) {
            imagePreviewUrl = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(imageFile);
            });
        }

        const userMessage: Message = { role: 'user', content: text, image: imagePreviewUrl };

        setSessions(prev => prev.map(s => {
            if (s.id === currentSessionId) {
                const newMessages = [...s.messages, userMessage];
                // Smarter title generation: Use first user input, strip greetings
                let title = s.title;
                if (title === 'New Conversation' && text.trim()) {
                    const cleanText = text.replace(/^(hi|hello|hey|namaste|नमस्ते)\s*/i, '').trim();
                    title = (cleanText || text).substring(0, 30) + ((cleanText || text).length > 30 ? '...' : '');
                }
                return { ...s, messages: newMessages, title, timestamp: Date.now() };
            }
            return s;
        }));

        setInputText('');
        setPendingImage(null);
        setPendingImagePreview(null);
        setIsLoading(true);

        try {
            // Try API route (Tavily + Gemini) first when no image is sent
            let botMessage: Message;
            if (!fileToSend) {
                try {
                    const res = await fetch('/api/doctor', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ query: text }),
                    });
                    const data = await res.json();
                    if (res.ok && data.answer) {
                        botMessage = {
                            role: 'assistant',
                            content: data.answer,
                            sources: data.sources || [],
                            tavilyUnavailable: data.tavilyUnavailable || false,
                        };
                    } else {
                        throw new Error(data.error || 'API error');
                    }
                } catch {
                    // Fallback to local AI when API fails
                    const response: AIResponse = await getAIResponse(text, undefined);
                    botMessage = {
                        role: 'assistant',
                        content: response.text,
                        isExpertRequired: response.isExpertRequired,
                    };
                }
            } else {
                // Image queries use local AI (API supports text-only for now)
                const response: AIResponse = await getAIResponse(text, fileToSend);
                botMessage = {
                    role: 'assistant',
                    content: response.text,
                    isExpertRequired: response.isExpertRequired,
                };
            }
            setSessions(prev => prev.map(s =>
                s.id === currentSessionId ? { ...s, messages: [...s.messages, botMessage] } : s
            ));
        } catch {
            const errorMsg: Message = { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now. Please try again." };
            setSessions(prev => prev.map(s =>
                s.id === currentSessionId ? { ...s, messages: [...s.messages, errorMsg] } : s
            ));
        } finally {
            setIsLoading(false);
        }
    }, [inputText, isLoading, pendingImage, pendingImagePreview, currentSessionId]);

    const handleVoiceTranscript = useCallback((text: string) => {
        setInputText(text);
    }, []);

    const handleImageSelected = useCallback((file: File) => {
        setPendingImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPendingImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, []);

    const clearPendingImage = useCallback(() => {
        setPendingImage(null);
        setPendingImagePreview(null);
    }, []);

    const deleteSession = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updatedSessions = sessions.filter(s => s.id !== id);
        setSessions(updatedSessions);
        if (currentSessionId === id) {
            if (updatedSessions.length > 0) {
                setCurrentSessionId(updatedSessions[0].id);
            } else {
                setCurrentSessionId(null);
            }
        }
    };

    return (
        <div className="dashboard-shell font-sans selection:bg-[#22D3EE]/20">
            <div className="relative z-0 flex min-h-screen flex-col">
                {/* Header */}
                <header className="z-10 border-b border-white/5 bg-black/10 backdrop-blur-xl">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-8">
                        <div className="flex items-center gap-4">
                            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8D7B68] to-[#3C2A21] shadow-[0_0_20px_rgba(0,0,0,0.7)]">
                                <Bot className="text-[#E4B680]" size={24} />
                                <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/10" />
                            </div>
                            <div>
                                <h1 className="text-sm font-semibold tracking-[0.18em] text-[#E4B680]/80 uppercase">
                                    ASKLEYA AI DOCTOR
                                </h1>
                                <p className="mt-1 text-xs text-white/60">
                                    Intelligence Care, Decoded
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="hidden items-center gap-3 md:flex">
                                <div className="flex items-center gap-2 rounded-full bg-emerald-900/40 px-3 py-1 text-xs text-emerald-200 border border-emerald-500/30 shadow-[0_0_18px_rgba(16,185,129,0.2)]">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="font-semibold tracking-wide">
                                        System Active
                                    </span>
                                    <span className="text-[10px] text-emerald-200/70">
                                        Monitoring patient inputs
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-white/60">
                                    <svg
                                        className="header-heartbeat h-8 w-20 text-[#22D3EE]/70"
                                        viewBox="0 0 80 20"
                                        fill="none"
                                    >
                                        <path
                                            d="M0 10 H15 L19 4 L24 16 L29 2 L34 18 L39 8 L44 12 L49 6 L54 14 L59 10 H80"
                                            stroke="currentColor"
                                            strokeWidth="1.3"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="text-[10px] uppercase tracking-[0.18em]">
                                        Realtime Triage Line
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <ThemeToggle />
                                <button
                                    onClick={() => setViewMode('history')}
                                    className="relative hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10 md:inline-flex items-center gap-2"
                                >
                                    <History size={14} />
                                    <span>Sessions</span>
                                </button>
                                <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10">
                                    <Bell size={16} />
                                    <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                </button>
                                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
                                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#E4B680] to-[#8D7B68]" />
                                    <div className="leading-tight">
                                        <p className="text-[11px] font-semibold text-white/80">
                                            Clinical Operator
                                        </p>
                                        <p className="text-[10px] text-white/40">
                                            Authenticated access
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Body */}
                <div className="mx-auto flex h-[calc(100vh-4.25rem)] max-w-6xl flex-1 flex-col gap-4 px-3 pb-4 pt-3 sm:px-5 sm:pb-5 lg:px-8 lg:pb-6">
                    <div className="grid flex-1 grid-rows-[auto,1fr,auto] gap-4 rounded-3xl border border-white/10 bg-black/15 p-3 backdrop-blur-2xl sm:grid-cols-[220px,minmax(0,1.6fr),minmax(0,1.1fr)] sm:grid-rows-[1fr] sm:p-4">
                        {/* Sidebar */}
                        <aside className="enterprise-card hidden flex-col justify-between p-4 sm:flex">
                            <div className="space-y-1">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                                    Navigation
                                </p>
                                <nav className="mt-2 space-y-1.5 text-sm">
                                    <button
                                        onClick={() => setViewMode('chat')}
                                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-all ${viewMode === 'chat'
                                            ? 'bg-emerald-900/50 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                                            : 'border border-white/5 hover:bg-white/5'
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <MessageCircle size={16} className="text-emerald-300" />
                                            <span>Patient Chat Console</span>
                                        </span>
                                        <span className="text-[10px] text-emerald-200/80">
                                            Live
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('bmi')}
                                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-all ${viewMode === 'bmi'
                                            ? 'bg-[#1f2933]/70 border border-[#E4B680]/50'
                                            : 'border border-white/5 hover:bg-white/5'
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <Scale size={16} className="text-[#E4B680]" />
                                            <span>BMI &amp; Health Metrics</span>
                                        </span>
                                        <span className="text-[10px] text-white/40">
                                            Analyzer
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('reminder')}
                                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-all ${viewMode === 'reminder'
                                            ? 'bg-[#111827]/70 border border-sky-500/40'
                                            : 'border border-white/5 hover:bg-white/5'
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <Bell size={16} className="text-sky-300" />
                                            <span>Medicine Reminder</span>
                                        </span>
                                        <span className="text-[10px] text-white/40">
                                            Reminder
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('chat')}
                                        className="flex w-full items-center justify-between rounded-xl border border-rose-500/40 bg-rose-950/30 px-3 py-2 text-left transition-all hover:bg-rose-950/60"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Activity size={16} className="text-rose-300" />
                                            <span>Emergency Response System</span>
                                        </span>
                                        <span className="text-[10px] text-rose-200/80">
                                            Priority
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('history')}
                                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-all ${viewMode === 'history'
                                            ? 'bg-[#0b1120]/70 border border-indigo-500/40'
                                            : 'border border-white/5 hover:bg-white/5'
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <History size={16} className="text-indigo-300" />
                                            <span>Old Chats</span>
                                        </span>
                                        <span className="text-[10px] text-white/40">
                                            Sessions
                                        </span>
                                    </button>
                                </nav>
                            </div>
                            <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-3 text-[11px] text-white/50">
                                <p className="font-semibold text-white/70">
                                    Secure System Badge
                                </p>
                                <p className="mt-1">
                                    Data transmission is encrypted and monitored. This UI
                                    is designed for professional institutions and does not
                                    replace licensed medical staff.
                                </p>
                            </div>
                        </aside>

                        {/* Main Column */}
                        <main className="enterprise-card flex min-h-0 flex-1 flex-col px-3 py-3 sm:px-5 sm:py-4">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                                        Central AI Chat Interface
                                    </p>
                                    <p className="mt-1 text-xs text-white/55">
                                        Conversational triage with bilingual assistance and
                                        image intake.
                                    </p>
                                </div>
                                {isLoading && (
                                    <div className="hidden items-center gap-3 rounded-full border border-[#22D3EE]/40 bg-[#020617]/70 px-3 py-1.5 text-[11px] text-[#E5F6FF] sm:flex">
                                        <div className="relative h-1 w-20 overflow-hidden rounded-full bg-[#0b1120]">
                                            <div className="animate-light-wave absolute inset-0 bg-gradient-to-r from-[#22D3EE] via-sky-400 to-[#22D3EE]" />
                                        </div>
                                        <span className="uppercase tracking-[0.18em] text-[10px]">
                                            AI Analysis in Progress
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/5 bg-black/30">
                                <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/5 to-transparent" />
                                <div className="relative h-full overflow-y-auto px-3 pb-28 pt-4 sm:px-5 sm:pb-28 sm:pt-5">
                                    {viewMode === 'chat' && (
                                        <div className="space-y-6 pt-1 pr-1">
                                            <div className="mb-1">
                                                <EmergencyAlert />
                                            </div>

                                            {messages.length === 0 && (
                                                <div className="flex flex-col items-center justify-center py-12 text-center space-y-5">
                                                    <div className="relative">
                                                        <div className="absolute -inset-6 rounded-full bg-[#22D3EE]/15 blur-3xl animate-pulse-glow" />
                                                        <Bot
                                                            className="relative z-10 h-16 w-16 text-[#22D3EE] opacity-80 drop-shadow-[0_0_15px_rgba(34,211,238,0.55)]"
                                                            strokeWidth={1}
                                                        />
                                                    </div>
                                                    <div className="space-y-2 max-w-sm mx-auto">
                                                        <h2 className="text-lg font-semibold text-white/85">
                                                            Command Center Ready
                                                        </h2>
                                                        <p className="text-xs text-white/55 leading-relaxed">
                                                            Initiate a new consultation with your
                                                            symptoms, vital concerns, or attach
                                                            supporting images. The AI Doctor will
                                                            respond with structured guidance.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {messages.map((msg, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`flex ${msg.role === 'user'
                                                        ? 'justify-end'
                                                        : 'justify-start'
                                                        }`}
                                                >
                                                    <div
                                                        className={`group relative max-w-[82%] p-4 rounded-3xl shadow-lg transition-all hover:shadow-[0_0_30px_rgba(0,0,0,0.75)] ${msg.role === 'user'
                                                            ? 'bg-[#8D7B68]/60 border border-[#E4B680]/40 text-[#fefaf6] rounded-tr-none'
                                                            : 'bg-black/40 border border-[#22D3EE]/30 text-white/90 rounded-tl-none'
                                                            }`}
                                                    >
                                                        <div
                                                            className={`absolute top-0 ${msg.role === 'user' ? 'right-0' : 'left-0'
                                                                } h-10 w-10 rounded-full bg-[#22D3EE]/15 blur-xl opacity-0 group-hover:opacity-100 transition-opacity`}
                                                        />

                                                        <div className="flex items-center justify-between gap-2 mb-2">
                                                            {msg.role === 'user' ? (
                                                                <div className="flex w-full items-center justify-end gap-2">
                                                                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                                                                        Authorized Patient Input
                                                                    </span>
                                                                    <User size={11} className="text-[#E4B680]" />
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <Bot size={12} className="text-[#22D3EE]" />
                                                                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]/70">
                                                                        Medical Core AI
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {msg.isExpertRequired && (
                                                                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-amber-300 border border-amber-400/40">
                                                                    Escalation Advised
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="text-[14px] leading-relaxed whitespace-pre-line">
                                                            {msg.content}
                                                        </p>

                                                        {msg.tavilyUnavailable && msg.role === 'assistant' && (
                                                            <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-200">
                                                                <AlertCircle size={14} className="shrink-0" />
                                                                <span>Real-time search data was unavailable. Response uses AI knowledge only.</span>
                                                            </div>
                                                        )}

                                                        {msg.sources && msg.sources.length > 0 && msg.role === 'assistant' && (
                                                            <div className="mt-3 space-y-2">
                                                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#22D3EE]/80">
                                                                    Sources
                                                                </p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {msg.sources.map((s, i) => (
                                                                        <a
                                                                            key={i}
                                                                            href={s.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#22D3EE]/40 bg-[#22D3EE]/10 px-2.5 py-1.5 text-[11px] text-[#22D3EE] hover:bg-[#22D3EE]/20 transition-colors"
                                                                        >
                                                                            <ExternalLink size={12} />
                                                                            <span className="truncate max-w-[180px]">{s.title || s.url}</span>
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {msg.image && (
                                                            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 group-hover:border-[#22D3EE]/30 transition-colors">
                                                                <Image
                                                                    src={msg.image}
                                                                    alt="Input Data"
                                                                    width={400}
                                                                    height={260}
                                                                    className="h-52 w-full object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            {isLoading && (
                                                <div className="flex justify-start">
                                                    <div className="glass-panel holographic-border rounded-3xl rounded-tl-none px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <Bot
                                                                size={14}
                                                                className="text-[#22D3EE] animate-pulse"
                                                            />
                                                            <div className="flex flex-col gap-1.5">
                                                                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#22D3EE]/70">
                                                                    Structured analysis running
                                                                </span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <div className="h-1 w-14 overflow-hidden rounded-full bg-[#0b1120]">
                                                                        <div className="animate-light-wave h-full bg-gradient-to-r from-[#22D3EE] via-sky-400 to-[#22D3EE]" />
                                                                    </div>
                                                                    <span className="text-[10px] text-white/50">
                                                                        Reviewing inputs
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div ref={messagesEndRef} />
                                        </div>
                                    )}

                                    {viewMode === 'history' && (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h2 className="text-sm font-semibold text-white/90">
                                                        Old Chats
                                                    </h2>
                                                    <p className="text-xs text-white/50">
                                                        Session-based view of previous consultations.
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={createNewChat}
                                                    className="inline-flex items-center gap-2 rounded-full bg-[#E4B680]/20 px-3 py-1 text-[11px] font-semibold text-[#F9F3EA] hover:bg-[#E4B680]/30"
                                                >
                                                    <PlusCircle size={14} />
                                                    New Consultation
                                                </button>
                                            </div>
                                            {(() => {
                                                const now = new Date();
                                                const today = new Date(
                                                    now.getFullYear(),
                                                    now.getMonth(),
                                                    now.getDate()
                                                ).getTime();
                                                const yesterday = today - 86400000;

                                                const groups = {
                                                    Today: sessions.filter((s) => s.timestamp >= today),
                                                    Yesterday: sessions.filter(
                                                        (s) =>
                                                            s.timestamp >= yesterday &&
                                                            s.timestamp < today
                                                    ),
                                                    Older: sessions.filter(
                                                        (s) => s.timestamp < yesterday
                                                    ),
                                                };

                                                return Object.entries(groups).map(
                                                    ([label, items]) =>
                                                        items.length > 0 && (
                                                            <div key={label} className="space-y-2">
                                                                <h3 className="px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                                                                    {label}
                                                                </h3>
                                                                <div className="space-y-2">
                                                                    {items.map((s) => (
                                                                        <div
                                                                            key={s.id}
                                                                            className="relative group"
                                                                        >
                                                                            <button
                                                                                onClick={() => {
                                                                                    setCurrentSessionId(s.id);
                                                                                    setViewMode('chat');
                                                                                }}
                                                                                className={`w-full text-left rounded-xl border px-4 py-3 transition-all ${currentSessionId === s.id
                                                                                    ? 'bg-[#8D7B68] border-[#E4B680]/70 text-white shadow-lg'
                                                                                    : 'bg-black/40 border-white/10 text-white/80 hover:border-[#E4B680]/50'
                                                                                    }`}
                                                                            >
                                                                                <div className="flex items-center justify-between gap-3">
                                                                                    <div className="truncate">
                                                                                        <div className="truncate text-sm font-semibold">
                                                                                            {s.title}
                                                                                        </div>
                                                                                        <div
                                                                                            className={`mt-1 text-[11px] ${currentSessionId === s.id
                                                                                                ? 'text-[#F5E7D6]'
                                                                                                : 'text-white/45'
                                                                                                }`}
                                                                                        >
                                                                                            {new Date(
                                                                                                s.timestamp
                                                                                            ).toLocaleString([], {
                                                                                                hour: '2-digit',
                                                                                                minute: '2-digit',
                                                                                                day: '2-digit',
                                                                                                month: 'short',
                                                                                            })}
                                                                                        </div>
                                                                                    </div>
                                                                                    <span className="text-[10px] text-white/40">
                                                                                        {s.messages.length} messages
                                                                                    </span>
                                                                                </div>
                                                                            </button>
                                                                            <button
                                                                                onClick={(e) =>
                                                                                    deleteSession(s.id, e)
                                                                                }
                                                                                className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[11px] transition-colors ${currentSessionId === s.id
                                                                                    ? 'text-[#F5E7D6] hover:bg-[#7D6B58]'
                                                                                    : 'text-white/40 hover:bg-red-500/10 hover:text-red-400'
                                                                                    }`}
                                                                                title="Delete Session"
                                                                            >
                                                                                <Trash2 size={16} />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )
                                                );
                                            })()}
                                            {sessions.length === 0 && (
                                                <div className="py-10 text-center text-white/45">
                                                    <History
                                                        size={40}
                                                        className="mx-auto mb-3 opacity-30"
                                                    />
                                                    <p>No previous consultations recorded yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {viewMode === 'bmi' && (
                                        <div className="space-y-4">
                                            <h2 className="text-sm font-semibold text-white/90">
                                                BMI &amp; Health Metrics Analyzer
                                            </h2>
                                            <p className="text-xs text-white/55">
                                                Evaluate baseline body mass index and interpret
                                                ranges for general risk awareness.
                                            </p>
                                            <BMICalculator />
                                        </div>
                                    )}

                                    {viewMode === 'reminder' && (
                                        <div className="space-y-4">
                                            <h2 className="text-sm font-semibold text-white/90">
                                                Medicine Reminder
                                            </h2>
                                            <p className="text-xs text-white/55">
                                                Configure time-based reminders for medications and
                                                prescriptions from this device.
                                            </p>
                                            <MedicineReminder />
                                        </div>
                                    )}
                                </div>

                                {/* Input Area */}
                                {viewMode === 'chat' && (
                                    <footer className="pointer-events-auto absolute inset-x-0 bottom-0 px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
                                        <div className="space-y-2">
                                            {pendingImagePreview && (
                                                <div className="mb-1 inline-flex rounded-xl bg-black/50 p-2 border border-white/10">
                                                    <div className="relative h-16 w-16">
                                                        <Image
                                                            src={pendingImagePreview}
                                                            alt="Pending upload"
                                                            fill
                                                            className="rounded-lg object-cover border border-[#EADBC8]/60"
                                                        />
                                                        <button
                                                            onClick={clearPendingImage}
                                                            className="absolute -top-1 -right-1 rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="glass-panel holographic-border group flex items-center gap-2 rounded-[2rem] px-2 py-1.5 sm:px-3 sm:py-2">
                                                <div className="flex items-center gap-2 pl-1">
                                                    <ImageUploader
                                                        onImageSelected={handleImageSelected}
                                                        disabled={!!pendingImage || isLoading}
                                                    />
                                                    <div className="mx-1 h-6 w-px bg-white/10" />
                                                    <VoiceInput
                                                        onTranscript={handleVoiceTranscript}
                                                        disabled={isLoading}
                                                    />
                                                </div>

                                                <input
                                                    type="text"
                                                    value={inputText}
                                                    onChange={(e) =>
                                                        setInputText(e.target.value)
                                                    }
                                                    onKeyPress={(e) =>
                                                        e.key === 'Enter' && handleSendMessage()
                                                    }
                                                    placeholder="Describe symptoms, concerns, or observations for structured triage..."
                                                    className="flex-1 border-none bg-transparent px-2 py-2 text-sm font-medium text-white placeholder:text-white/30 outline-none"
                                                    disabled={isLoading}
                                                />

                                                <button
                                                    onClick={() => handleSendMessage()}
                                                    disabled={
                                                        isLoading ||
                                                        (!inputText.trim() && !pendingImage)
                                                    }
                                                    className={`group/btn flex items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-all ${isLoading ||
                                                        (!inputText.trim() && !pendingImage)
                                                        ? 'bg-white/5 text-white/25'
                                                        : 'bg-[#22D3EE] text-black shadow-[0_0_18px_rgba(34,211,238,0.5)] hover:shadow-[0_0_28px_rgba(34,211,238,0.7)] hover:scale-105 active:scale-95'
                                                        }`}
                                                >
                                                    <span className="hidden sm:inline">
                                                        Send Directive
                                                    </span>
                                                    <Send
                                                        size={16}
                                                        className="transition-transform group-hover/btn:translate-x-0.5"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </footer>
                                )}
                            </div>
                        </main>

                        {/* Right Panel */}
                        <aside className="enterprise-card mt-3 flex min-h-0 flex-col justify-between p-4 sm:mt-0">
                            <div className="space-y-3">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                                        Live Health Insights
                                    </p>
                                    <p className="mt-1 text-xs text-white/55">
                                        High-level view of current consultation activity.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                                        <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                                            Active Session
                                        </p>
                                        <p className="mt-2 text-lg font-semibold text-white/90">
                                            {messages.length}
                                        </p>
                                        <p className="mt-1 text-[11px] text-white/45">
                                            Messages exchanged
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                                        <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                                            All Sessions
                                        </p>
                                        <p className="mt-2 text-lg font-semibold text-white/90">
                                            {sessions.length}
                                        </p>
                                        <p className="mt-1 text-[11px] text-white/45">
                                            Records stored locally
                                        </p>
                                    </div>
                                    <div className="col-span-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3">
                                        <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-200/80">
                                            Risk Level Indicator
                                        </p>
                                        <div className="mt-2 flex items-center justify-between gap-3">
                                            <span
                                                className={`text-sm font-semibold ${hasExpertFlag
                                                    ? 'text-amber-200'
                                                    : 'text-emerald-200'
                                                    }`}
                                            >
                                                {hasExpertFlag ? 'Elevated — expert review suggested' : 'Baseline — no escalation flagged'}
                                            </span>
                                        </div>
                                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/60">
                                            <div
                                                className={`h-full rounded-full ${hasExpertFlag
                                                    ? 'w-4/5 bg-gradient-to-r from-amber-300 to-red-400'
                                                    : 'w-2/5 bg-gradient-to-r from-emerald-300 to-sky-400'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2 rounded-xl border border-sky-500/25 bg-sky-950/40 p-3">
                                        <p className="text-[10px] uppercase tracking-[0.18em] text-sky-200/80">
                                            AI Confidence Meter
                                        </p>
                                        <div className="mt-2 flex items-center justify-between gap-2">
                                            <span className="text-sm font-semibold text-sky-100">
                                                {isLoading ? 'Analyzing current input…' : 'Stable pattern recognition'}
                                            </span>
                                            <span className="text-[10px] text-sky-200/80">
                                                UI-level indicator
                                            </span>
                                        </div>
                                        <div className="mt-2 flex items-center gap-1.5">
                                            {[0, 1, 2, 3, 4].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`h-2 flex-1 rounded-full ${i < 4 ? 'bg-sky-400/80' : 'bg-sky-400/30'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 rounded-xl border border-white/10 bg-black/50 p-3 text-xs text-white/60 space-y-2">
                                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                                        Suggested Next Medical Steps
                                    </p>
                                    <p>Clarify onset time and duration of primary symptoms.</p>
                                    <p>Capture key vitals if available.</p>
                                    <p>Note any chronic conditions or current medications.</p>
                                    <p>For red-flag symptoms, prepare for escalation to a licensed clinician.</p>
                                </div>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-100">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.18em] text-rose-200/80">
                                        Emergency Response
                                    </p>
                                    <p className="mt-1 text-[11px] text-rose-100/80">
                                        Use this pathway only for severe or rapidly worsening symptoms.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setViewMode('chat')}
                                    className="rounded-full bg-rose-500 px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg hover:bg-rose-400"
                                >
                                    Open Alert Panel
                                </button>
                            </div>
                        </aside>
                    </div>

                    {/* Footer disclaimer */}
                    <footer className="mx-auto max-w-6xl text-[11px] text-white/40">
                        <p className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 leading-relaxed">
                            This AI Doctor system provides AI-assisted medical guidance and does
                            not replace licensed healthcare professionals. Always consult a
                            certified medical provider for diagnoses or treatment decisions. For
                            emergencies, contact your local emergency services or a certified
                            medical provider immediately.
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
}
