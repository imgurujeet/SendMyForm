"use client";
import React, { useEffect } from "react";
import { X } from "lucide-react";

interface PrivacyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative w-full max-w-2xl max-h-[85vh] bg-zinc-950 border border-white/10 rounded-[2rem] shadow-2xl shadow-violet-500/5 overflow-hidden animate-modal-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-5 bg-zinc-950/95 backdrop-blur-xl border-b border-white/5">
                    <h2 className="text-lg font-black uppercase tracking-widest italic text-white">
                        Privacy <span className="text-emerald-500">Policy</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-white/5 transition-colors group"
                        aria-label="Close"
                    >
                        <X size={20} className="text-slate-500 group-hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-8 py-6 overflow-y-auto max-h-[calc(85vh-72px)] terms-scroll">
                    {/* Information We Collect */}
                    <section className="mb-8">
                        <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500 italic mb-3">
                            Information We Collect
                        </h3>
                        <div className="space-y-3">
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                <p className="text-xs font-black uppercase tracking-widest text-white italic mb-1">
                                    Client Data
                                </p>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Name, email, and business details provided during consultation.
                                </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                <p className="text-xs font-black uppercase tracking-widest text-white italic mb-1">
                                    Technical Data
                                </p>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    IP addresses and usage logs via our website.
                                </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                <p className="text-xs font-black uppercase tracking-widest text-white italic mb-1">
                                    Inference Data
                                </p>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Data uploaded to our AI agents for processing.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* How We Use Your Data */}
                    <section className="mb-8">
                        <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500 italic mb-3">
                            How We Use Your Data
                        </h3>
                        <ul className="space-y-2">
                            <li className="text-sm text-slate-400 leading-relaxed flex items-start gap-2">
                                <span className="text-emerald-500 mt-1">▸</span>
                                To provide and optimize custom AI workflows.
                            </li>
                            <li className="text-sm text-slate-400 leading-relaxed flex items-start gap-2">
                                <span className="text-emerald-500 mt-1">▸</span>
                                To communicate project updates and technical support.
                            </li>
                        </ul>
                        <div className="mt-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                            <p className="text-xs font-black uppercase tracking-widest text-emerald-400 italic mb-1">
                                Note on Training
                            </p>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                We do not use client-specific proprietary data to train our
                                general-purpose models without explicit, written consent.
                            </p>
                        </div>
                    </section>

                    {/* Data Security */}
                    <section className="mb-8">
                        <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500 italic mb-3">
                            Data Security
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            We implement industry-standard encryption and secure vector
                            database protocols to ensure your data is protected. Access to
                            client data is restricted to essential personnel only.
                        </p>
                    </section>

                    {/* Third-Party Services */}
                    <section className="mb-8">
                        <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500 italic mb-3">
                            Third-Party Services
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Our agency utilizes third-party providers (e.g., Cloud providers,
                            LLM API providers). Your data may be processed by these entities
                            under their respective privacy policies.
                        </p>
                    </section>

                    {/* Your Rights */}
                    <section className="mb-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500 italic mb-3">
                            Your Rights
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Depending on your jurisdiction, you have the right to access,
                            correct, or delete your personal data. To exercise these rights,
                            contact us at{" "}
                            <a
                                href="mailto:achaialabs@gmail.com"
                                className="text-emerald-400 hover:underline"
                            >
                                achaialabs@gmail.com
                            </a>
                            .
                        </p>
                    </section>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] italic">
                            © 2026 Achaia Labs. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modal-in {
          animation: modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .terms-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .terms-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .terms-scroll::-webkit-scrollbar-thumb {
          background: #222;
          border-radius: 99px;
        }
        .terms-scroll::-webkit-scrollbar-thumb:hover {
          background: #10b981;
        }
      `}</style>
        </div>
    );
}
