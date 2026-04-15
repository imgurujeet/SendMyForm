"use client";
import React, { useEffect } from "react";
import { X } from "lucide-react";

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
    // Lock body scroll when modal is open
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
                        Terms <span className="text-violet-600">&</span> Conditions
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
                    {/* Introduction */}
                    <section className="mb-8">
                        <h3 className="text-sm font-black uppercase tracking-widest text-violet-500 italic mb-3">
                            Introduction
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Welcome to Achaia Labs. These Terms and Conditions govern your use
                            of our website and the AI services, consulting, and software
                            solutions provided by Achaia Labs (&ldquo;the Agency,&rdquo;
                            &ldquo;we,&rdquo; &ldquo;us&rdquo;). By accessing our services,
                            you agree to these terms.
                        </p>
                    </section>

                    {/* Scope of Services */}
                    <section className="mb-8">
                        <h3 className="text-sm font-black uppercase tracking-widest text-violet-500 italic mb-3">
                            Scope of Services
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed mb-3">
                            Achaia Labs provides specialized AI development services, including
                            but not limited to:
                        </p>
                        <ul className="space-y-2 pl-4">
                            <li className="text-sm text-slate-400 leading-relaxed flex items-start gap-2">
                                <span className="text-violet-600 mt-1">▸</span>
                                Retrieval-Augmented Generation (RAG) architectures.
                            </li>
                            <li className="text-sm text-slate-400 leading-relaxed flex items-start gap-2">
                                <span className="text-violet-600 mt-1">▸</span>
                                Autonomous Agentic Workflows and LLM fine-tuning.
                            </li>
                            <li className="text-sm text-slate-400 leading-relaxed flex items-start gap-2">
                                <span className="text-violet-600 mt-1">▸</span>
                                Custom AI software integration and automation.
                            </li>
                        </ul>
                    </section>

                    {/* Intellectual Property */}
                    <section className="mb-8">
                        <h3 className="text-sm font-black uppercase tracking-widest text-violet-500 italic mb-3">
                            Intellectual Property
                        </h3>
                        <div className="space-y-3">
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                <p className="text-xs font-black uppercase tracking-widest text-white italic mb-1">
                                    Agency IP
                                </p>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    We retain ownership of all pre-existing code, methodologies,
                                    and proprietary tools used to deliver services.
                                </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                <p className="text-xs font-black uppercase tracking-widest text-white italic mb-1">
                                    Client Deliverables
                                </p>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Upon full payment, the specific custom software or outputs
                                    created for the Client shall be transferred to the Client,
                                    subject to any third-party licenses (e.g., OpenAI, Anthropic,
                                    or Open Source licenses).
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* User Responsibilities */}
                    <section className="mb-8">
                        <h3 className="text-sm font-black uppercase tracking-widest text-violet-500 italic mb-3">
                            User Responsibilities
                        </h3>
                        <ul className="space-y-2">
                            <li className="text-sm text-slate-400 leading-relaxed flex items-start gap-2">
                                <span className="text-violet-600 mt-1">▸</span>
                                You agree not to use our AI solutions for illegal activities,
                                including generating deepfakes, malware, or discriminatory
                                content.
                            </li>
                            <li className="text-sm text-slate-400 leading-relaxed flex items-start gap-2">
                                <span className="text-violet-600 mt-1">▸</span>
                                You are responsible for the data you provide to our systems for
                                processing or training.
                            </li>
                        </ul>
                    </section>

                    {/* Limitation of Liability */}
                    <section className="mb-8">
                        <h3 className="text-sm font-black uppercase tracking-widest text-violet-500 italic mb-3">
                            Limitation of Liability
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Achaia Labs provides AI solutions &ldquo;as-is.&rdquo; We do not
                            guarantee that AI outputs will always be 100% accurate or
                            hallucination-free. We are not liable for business interruptions or
                            data inaccuracies resulting from the inherent nature of generative
                            AI.
                        </p>
                    </section>

                    {/* Termination */}
                    <section className="mb-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-violet-500 italic mb-3">
                            Termination
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            We reserve the right to terminate access to our platforms if there
                            is a breach of these terms or misuse of our API/compute resources.
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
          background: #6d28d9;
        }
      `}</style>
        </div>
    );
}
