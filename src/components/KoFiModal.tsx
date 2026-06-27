"use client";

import React, { useEffect, useState } from "react";
import { X, Zap, ArrowRight, Check } from "lucide-react";

const KOFI_URL = "https://ko-fi.com/achaialabs"; // ← replace with your Ko-fi URL

interface KoFiModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** The endpoint URL just created — shown in the modal so user sees the value they got */
  endpointUrl?: string;
  /** Project name just created */
  projectName?: string;
}

export default function KoFiModal({
  isOpen,
  onClose,
  endpointUrl,
  projectName,
}: KoFiModalProps) {
  const [visible, setVisible] = useState(false);
  const [supported, setSupported] = useState(false);

  // Animate in
  useEffect(() => {
    if (isOpen) {
      // tiny delay so CSS transition fires after mount
      const t = setTimeout(() => setVisible(true), 30);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSupport = () => {
    setSupported(true);
    window.open(KOFI_URL, "_blank", "noopener,noreferrer");
    // Auto-close after a moment so user goes back to dashboard
    setTimeout(() => onClose(), 1800);
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{
        backgroundColor: `rgba(0,0,0,${visible ? 0.75 : 0})`,
        backdropFilter: visible ? "blur(8px)" : "blur(0px)",
        transition: "background-color 0.3s ease, backdrop-filter 0.3s ease",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal panel */}
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: "var(--bg-secondary, #0f0f18)",
          border: "1px solid rgba(255,255,255,0.08)",
          transform: visible ? "scale(1) translateY(0)" : "scale(0.92) translateY(24px)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease",
        }}
      >
        {/* Glow blob */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[360px] h-[180px] pointer-events-none"
          style={{
            background: supported
              ? "radial-gradient(ellipse, rgba(52,211,153,0.15) 0%, transparent 70%)"
              : "radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 70%)",
            transition: "background 0.6s ease",
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full hover:bg-white/10 transition-colors"
          style={{ color: "var(--text-muted, #64748b)" }}
          aria-label="Skip"
        >
          <X size={16} />
        </button>

        <div className="relative px-8 pt-10 pb-8">

          {/* ── Success state ── */}
          {supported ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
                <Check size={28} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-black text-white mb-2">Thank you! ☕</h2>
              <p className="text-sm text-slate-400">
                You're awesome. Going back to your dashboard…
              </p>
            </div>

          ) : (
            <>
              {/* ── Ko-fi icon + badge ── */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <div
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{ background: "rgba(124,58,237,0.2)" }}
                  />
                  <div
                    className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-xl"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                      boxShadow: "0 8px 32px rgba(124,58,237,0.40)"
                    }}
                  >
                    <img
                      src="https://storage.ko-fi.com/cdn/cup-border.png"
                      alt="Ko-fi"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                </div>

                {/* "endpoint created" badge — makes the timing feel natural */}
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-1"
                  style={{
                    background: "rgba(52,211,153,0.1)",
                    border: "1px solid rgba(52,211,153,0.2)",
                    color: "#34d399",
                  }}
                >
                  <Zap size={9} className="fill-emerald-400" />
                  Endpoint ready
                </span>
              </div>

              {/* ── Headline ── */}
              <div className="text-center mb-5">
                <h2 className="text-2xl font-black text-white leading-tight mb-2">
                  {projectName ? (
                    <>Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">{projectName}</span> endpoint is live.</>
                  ) : (
                    <>Your endpoint is live.</>
                  )}
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  SendMyForm is 100% free — no plans, no limits, ever. If it saves you
                  hours of backend work, a coffee helps keep the servers running
                  for every developer.
                </p>
              </div>

              {/* ── Endpoint preview ── */}
              {endpointUrl && (
                <div
                  className="rounded-xl px-4 py-3 mb-6 font-mono text-xs truncate text-center"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "#a78bfa",
                  }}
                >
                  {endpointUrl}
                </div>
              )}

              {/* ── Stats row ── */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { val: "∞", label: "Submissions" },
                  { val: "Free", label: "Forever" },
                  { val: "0", label: "Stored data" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl py-3 text-center"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <p className="text-base font-black text-white">{s.val}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: "var(--text-muted, #64748b)" }}>
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* ── CTAs ── */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-center">
                  <a
                    href={KOFI_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleSupport}
                    className="transition-all hover:scale-[1.04] active:scale-[0.97] drop-shadow-lg"
                  >
                    <img
                      src="https://ko-fi.com/img/githubbutton_sm.svg"
                      alt="Support on Ko-fi"
                      style={{ height: "44px" }}
                    />
                  </a>
                </div>

                <button
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all hover:bg-white/5"
                  style={{ color: "var(--text-muted, #64748b)" }}
                >
                  Skip for now
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* ── Fine print ── */}
              <p className="text-center text-[10px] mt-4" style={{ color: "var(--text-muted, #4b5563)" }}>
                One-time or monthly · No account needed · Opens Ko-fi
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
