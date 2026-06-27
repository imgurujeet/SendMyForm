"use client";

import React from "react";
import { Zap } from "lucide-react";

/**
 * KoFiWidget — reusable Ko-fi support component
 *
 * Variants:
 *  "banner"  — full-width section for homepage footer, success page
 *  "inline"  — compact card for docs sidebar, dashboard
 *  "minimal" — small button for nav/footer links
 *
 * Usage:
 *  <KoFiWidget variant="banner" />
 *  <KoFiWidget variant="inline" />
 *  <KoFiWidget variant="minimal" />
 */

// ─── CONFIG — change only this line ──────────────────────────────────────────
const KOFI_URL = "https://ko-fi.com/achaialabs"; // ← replace with your Ko-fi URL
// ─────────────────────────────────────────────────────────────────────────────

interface KoFiWidgetProps {
  variant?: "banner" | "inline" | "minimal";
  className?: string;
}

export default function KoFiWidget({
  variant = "inline",
  className = "",
}: KoFiWidgetProps) {

  // ── MINIMAL: official Ko-fi badge ──────────────────────────────────────────
  if (variant === "minimal") {
    return (
      <a
        href={KOFI_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-block transition-all hover:scale-105 active:scale-95 ${className}`}
      >
        <img
          src="https://ko-fi.com/img/githubbutton_sm.svg"
          alt="Support on Ko-fi"
          style={{ height: "36px" }}
        />
      </a>
    );
  }

  // ── INLINE: card (docs page sidebar, dashboard) ───────────────────────────
  if (variant === "inline") {
    return (
      <div
        className={`rounded-2xl border border-violet-500/20 bg-gradient-to-br
          from-violet-600/5 to-indigo-600/5 p-6 text-center ${className}`}
      >
        {/* animated Ko-fi icon */}
        <div className="relative inline-flex mb-4">
          <div className="absolute inset-0 rounded-full bg-violet-500/20 animate-ping" />
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
            <img
              src="https://storage.ko-fi.com/cdn/cup-border.png"
              alt="Ko-fi"
              className="w-6 h-6 object-contain"
            />
          </div>
        </div>

        <h3 className="text-sm font-bold text-white mb-1">
          SendMyForm is 100% free
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          No plans. No limits. No credit card.
          If it saved you time, a Ko-fi keeps the lights on.
        </p>

        <a
          href={KOFI_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block transition-all hover:scale-105 active:scale-95"
        >
          <img
            src="https://ko-fi.com/img/githubbutton_sm.svg"
            alt="Support on Ko-fi"
            style={{ height: "32px" }}
          />
        </a>

        <p className="text-[10px] text-slate-700 mt-3 tracking-wide">
          One-time or monthly · No account needed
        </p>
      </div>
    );
  }

  // ── BANNER: full-width (homepage footer CTA, success page) ───────────────
  return (
    <section
      className={`relative overflow-hidden rounded-3xl border border-violet-500/20
        bg-gradient-to-r from-violet-600/8 via-indigo-600/5 to-fuchsia-600/8 p-8 md:p-12 ${className}`}
    >
      {/* background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[500px] h-[200px] bg-violet-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">

        {/* ── Left: copy ── */}
        <div className="text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
            border border-violet-500/30 bg-violet-600/10 text-violet-400
            text-[10px] font-bold uppercase tracking-widest mb-4">
            <Zap size={10} className="fill-violet-400" />
            Free Forever · No Limits
          </span>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-3">
            Enjoying SendMyForm?
          </h2>

          <p className="text-slate-400 text-sm leading-relaxed max-w-md">
            We charge nothing — zero, ever. If this tool saved you hours of backend
            work, consider buying us a coffee on Ko-fi. It keeps the servers
            running and the service free for every developer.
          </p>

          {/* social proof */}
          <div className="flex items-center gap-2 mt-4 justify-center md:justify-start">
            <div className="flex -space-x-1.5">
              {["🧑‍💻", "👩‍💻", "🧑‍🎨"].map((e, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700
                    flex items-center justify-center text-sm"
                >
                  {e}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Developers already supporting us ❤️
            </p>
          </div>
        </div>

        {/* ── Right: official Ko-fi badge ── */}
        <div className="flex flex-col items-center gap-3 flex-shrink-0">
          <a
            href={KOFI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all hover:scale-105 active:scale-95 drop-shadow-lg"
          >
            <img
              src="https://ko-fi.com/img/githubbutton_sm.svg"
              alt="Support on Ko-fi"
              style={{ height: "42px" }}
            />
          </a>

          <p className="text-[10px] text-slate-600 tracking-wider uppercase">
            via Ko-fi · One-time or monthly
          </p>
        </div>
      </div>
    </section>
  );
}
