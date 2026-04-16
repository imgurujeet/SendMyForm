"use client";
import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const cycle = () => {
        const order: Array<"dark" | "light" | "system"> = ["dark", "light", "system"];
        const idx = order.indexOf(theme);
        setTheme(order[(idx + 1) % order.length]);
    };

    const icon =
        theme === "dark" ? <Moon size={16} /> :
            theme === "light" ? <Sun size={16} /> :
                <Monitor size={16} />;

    const label =
        theme === "dark" ? "Dark" :
            theme === "light" ? "Light" :
                "System";

    return (
        <button
            onClick={cycle}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white hover:border-white/[0.15] transition-all text-xs font-medium"
            aria-label={`Theme: ${label}`}
            title={`Theme: ${label}`}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
}
