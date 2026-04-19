"use client";
import React, { useEffect } from "react";
import { X, ShieldCheck } from "lucide-react";

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
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            <div
                className="relative w-full max-w-2xl max-h-[85vh] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-modal-in"
                style={{ background: "var(--bg-secondary)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="sticky top-0 z-10 flex items-center justify-between px-7 py-5 backdrop-blur-xl"
                    style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                            <ShieldCheck size={16} className="text-violet-400" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                                Privacy Policy
                            </h2>
                            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                                Last updated: April 2026
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-white/5 transition-colors group"
                        aria-label="Close"
                    >
                        <X size={18} className="text-slate-500 group-hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-7 py-6 overflow-y-auto max-h-[calc(85vh-76px)] legal-scroll">

                    <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
                        This Privacy Policy describes how SendMyForm ("we", "us", or "our"), operated by Achaia Labs, collects, uses, and handles information when you use our form backend service at sendmyform.live.
                    </p>

                    <Section title="1. What We Collect">
                        <SubSection title="Account Information">
                            When you sign in via Google OAuth, we receive your name, email address, and profile photo from Google. This is used solely to create and manage your SendMyForm account.
                        </SubSection>
                        <SubSection title="Project Configuration">
                            We store your project settings — including project name, endpoint slug, email delivery address, and selected email theme — in our database (Firebase Firestore) to operate the service.
                        </SubSection>
                        <SubSection title="Form Submission Data">
                            When a form is submitted to your endpoint, we receive the submitted fields (text, files, etc.) temporarily in memory to process and forward to your inbox. <strong className="text-white">We do not store submission data on our servers.</strong> It is processed and immediately discarded after delivery.
                        </SubSection>
                        <SubSection title="Usage Data">
                            We collect anonymised analytics (via Google Analytics) including page views, session duration, and feature usage. This data is aggregated and does not identify individual users.
                        </SubSection>
                    </Section>

                    <Section title="2. How We Use Your Data">
                        <ul className="space-y-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            {[
                                "To authenticate you and manage your account",
                                "To route and deliver form submissions to your email address",
                                "To send you transactional emails (e.g. submission notifications)",
                                "To maintain uptime, debug issues, and improve the service",
                                "To display relevant ads on the submission success page via Google AdSense",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-violet-400 mt-1 flex-shrink-0">▸</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Section>

                    <Section title="3. Data Storage & Security">
                        <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
                            Your account and project data is stored securely in Google Firebase (Firestore), hosted on Google Cloud infrastructure with encryption at rest and in transit.
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            Form submission content is never persisted. It exists in server memory only for the duration of the delivery process (typically under 2 seconds).
                        </p>
                        <div className="mt-4 p-4 rounded-xl bg-violet-500/5 border border-violet-500/15">
                            <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">Zero Persistence Guarantee</p>
                            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                                We do not build databases of your users' form submissions. Your end-users' data is delivered to you and then gone from our infrastructure.
                            </p>
                        </div>
                    </Section>

                    <Section title="4. Third-Party Services">
                        <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
                            We use the following third-party services which may process data on our behalf:
                        </p>
                        <div className="space-y-2">
                            {[
                                { name: "Google Firebase", purpose: "Authentication and database storage" },
                                { name: "Google Analytics", purpose: "Anonymous usage analytics" },
                                { name: "Google AdSense", purpose: "Advertising across the website for service sustainability. User experience is always prioritised over ad placement." },
                                { name: "SMTP Provider", purpose: "Transactional email delivery" },
                                { name: "Vercel", purpose: "Hosting and edge infrastructure" },
                            ].map((s, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border text-sm" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
                                    <span className="font-semibold flex-shrink-0" style={{ color: "var(--text-primary)" }}>{s.name}</span>
                                    <span style={{ color: "var(--text-muted)" }}>— {s.purpose}</span>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section title="5. Cookies">
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            We use session cookies for authentication and Google Analytics cookies for usage tracking. Google AdSense may set cookies on the submission success page for ad personalisation. You can opt out of personalised ads via <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">Google Ads Settings</a>.
                        </p>
                    </Section>

                    <Section title="6. Your Rights">
                        <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
                            Depending on your jurisdiction, you may have the right to access, correct, or request deletion of your personal data. To exercise any of these rights, contact us at:
                        </p>
                        <a
                            href="mailto:contact@sendmyform.live"
                            className="text-sm font-semibold text-violet-400 hover:underline"
                        >
                            contact@sendmyform.live
                        </a>
                        <p className="text-sm leading-relaxed mt-3" style={{ color: "var(--text-secondary)" }}>
                            You may delete your account and all associated project data at any time from the Dashboard settings page.
                        </p>
                    </Section>

                    <Section title="7. Children's Privacy">
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            SendMyForm is not directed at children under 13. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, contact us at contact@sendmyform.live and we will delete it.
                        </p>
                    </Section>

                    <Section title="8. Changes to This Policy">
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            We may update this Privacy Policy from time to time. We will notify users of material changes by updating the "last updated" date at the top. Continued use of the service after changes constitutes acceptance of the updated policy.
                        </p>
                    </Section>

                    <div className="mt-8 pt-5 text-center" style={{ borderTop: "1px solid var(--border-color)" }}>
                        <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                            © 2026 Achaia Labs. sendmyform.live
                        </p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.97) translateY(16px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-modal-in { animation: modalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .legal-scroll::-webkit-scrollbar { width: 5px; }
                .legal-scroll::-webkit-scrollbar-track { background: transparent; }
                .legal-scroll::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 99px; }
                .legal-scroll::-webkit-scrollbar-thumb:hover { background: #6d28d9; }
            `}</style>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mb-7">
            <h3 className="text-sm font-bold text-white mb-4 pb-2" style={{ borderBottom: "1px solid var(--border-color)" }}>
                {title}
            </h3>
            {children}
        </section>
    );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-4 p-4 rounded-xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-violet-400">{title}</p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{children}</p>
        </div>
    );
}