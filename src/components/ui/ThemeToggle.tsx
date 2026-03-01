'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            className="flex h-9 w-16 items-center rounded-full border border-white/10 bg-white/5 px-1 transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/40 focus:ring-offset-2 focus:ring-offset-transparent"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            <span
                className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 ${
                    isDark
                        ? 'translate-x-0 bg-[#22D3EE]/20 text-[#22D3EE]'
                        : 'translate-x-8 bg-amber-200/80 text-amber-800'
                }`}
            >
                {isDark ? <Moon size={14} /> : <Sun size={14} />}
            </span>
        </button>
    );
}
