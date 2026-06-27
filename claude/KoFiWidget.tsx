"use client";

import React, { useState } from "react";
import { Heart, Zap, Coffee } from "lucide-react";

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
  const [hovered, setHovered] = useState(false);

  // ── MINIMAL: small pill button (nav, footer, sidebar) ──────────────────────
  if (variant === "minimal") {
    return (
      <a
        href={KOFI_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
          bg-[#FF5E5B] hover:bg-[#ff4441] text-white transition-all
          shadow-md hover:shadow-lg hover:scale-105 ${className}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Coffee
          size={14}
          className={`transition-transform duration-300 ${hovered ? "rotate-12" : ""}`}
        />
        Support on Ko-fi
      </a>
    );
  }

  // ── INLINE: card (docs page sidebar, dashboard) ───────────────────────────
  if (variant === "inline") {
    return (
      <div
        className={`rounded-2xl border border-[#FF5E5B]/20 bg-gradient-to-br
          from-[#FF5E5B]/5 to-rose-500/5 p-6 text-center ${className}`}
      >
        {/* animated Ko-fi icon */}
        <div className="relative inline-flex mb-4">
          <div className="absolute inset-0 rounded-full bg-[#FF5E5B]/20 animate-ping" />
          <div className="relative w-12 h-12 rounded-full bg-[#FF5E5B] flex items-center justify-center shadow-lg shadow-[#FF5E5B]/30">
            <Coffee size={22} className="text-white" />
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
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm
            bg-[#FF5E5B] hover:bg-[#ff4441] text-white transition-all hover:scale-105
            shadow-md shadow-[#FF5E5B]/25"
        >
          <Coffee size={14} />
          Support on Ko-fi
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
      className={`relative overflow-hidden rounded-3xl border border-[#FF5E5B]/20
        bg-gradient-to-r from-[#FF5E5B]/8 via-rose-500/5 to-pink-500/8 p-8 md:p-12 ${className}`}
    >
      {/* background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[500px] h-[200px] bg-[#FF5E5B]/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">

        {/* ── Left: copy ── */}
        <div className="text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
            border border-[#FF5E5B]/30 bg-[#FF5E5B]/10 text-[#FF5E5B]
            text-[10px] font-bold uppercase tracking-widest mb-4">
            <Zap size={10} className="fill-[#FF5E5B]" />
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

        {/* ── Right: CTA ── */}
        <div className="flex flex-col items-center gap-3 flex-shrink-0">
          <a
            href={KOFI_URL}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-base
              bg-[#FF5E5B] hover:bg-[#ff4441] text-white transition-all
              hover:scale-105 shadow-xl shadow-[#FF5E5B]/25 hover:shadow-[#FF5E5B]/50"
          >
            <Coffee
              size={20}
              className={`transition-all duration-300 ${hovered ? "rotate-12 scale-110" : ""}`}
            />
            Support on Ko-fi
            <Heart
              size={14}
              className="fill-white/60 text-white/60 group-hover:fill-white group-hover:text-white transition-all"
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
