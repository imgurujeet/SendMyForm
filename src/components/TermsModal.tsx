"use client";
import React, { useEffect } from "react";
import { X, FileText } from "lucide-react";

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
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
                            <FileText size={16} className="text-violet-400" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                                Terms of Service
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
                        These Terms of Service ("Terms") govern your access to and use of SendMyForm ("Service"), operated by Achaia Labs. By creating an account or using the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service.
                    </p>

                    <Section title="1. The Service">
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            SendMyForm provides a form backend service that receives HTTP POST requests from web forms, processes the submitted data, and forwards it to a user-configured email address. The Service is provided via sendmyform.live and its API endpoints.
                        </p>
                    </Section>

                    <Section title="2. Account Registration">
                        <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
                            To use the Service you must sign in with a valid Google account. You are responsible for all activity that occurs under your account. You agree to:
                        </p>
                        <ul className="space-y-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            {[
                                "Provide accurate information during sign-in",
                                "Keep your account credentials secure",
                                "Notify us immediately of any unauthorised access at achaialabs@gmail.com",
                                "Not share your account with others",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-violet-400 mt-1 flex-shrink-0">▸</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Section>

                    <Section title="3. Acceptable Use">
                        <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                            You may use SendMyForm only for lawful purposes and in accordance with these Terms. You agree <strong className="text-white">not</strong> to use the Service to:
                        </p>
                        <div className="space-y-2">
                            {[
                                "Submit, collect, or transmit spam, unsolicited messages, or malicious content",
                                "Collect sensitive personal data such as passwords, credit card numbers, or government IDs through your forms",
                                "Violate any applicable law or regulation, including data protection laws",
                                "Abuse, overload, or attempt to disrupt the Service's infrastructure",
                                "Scrape, reverse-engineer, or attempt to extract the Service's source code or data",
                                "Impersonate any person or entity or misrepresent your affiliation",
                                "Use the Service to send phishing emails or deceptive communications",
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border text-sm" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>
                                    <span className="text-red-400 mt-0.5 flex-shrink-0">✕</span>
                                    {item}
                                </div>
                            ))}
                        </div>
                        <p className="text-sm leading-relaxed mt-4" style={{ color: "var(--text-secondary)" }}>
                            We reserve the right to suspend or terminate any account that violates these rules, without prior notice.
                        </p>
                    </Section>

                    <Section title="4. Form Submissions & Data">
                        <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
                            You are solely responsible for the forms you create, the data those forms collect, and how that data is used. This includes compliance with applicable privacy laws (GDPR, CCPA, etc.) in relation to the personal data your forms collect from your end users.
                        </p>
                        <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/15">
                            <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">Data Handling</p>
                            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                                SendMyForm processes submission data only to deliver it to your configured email address. We do not store, sell, or access submission content beyond what is necessary for delivery. You must ensure your forms include appropriate consent notices for your users.
                            </p>
                        </div>
                    </Section>

                    <Section title="5. Advertising">
                        <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
                            SendMyForm displays advertisements on the website, served by Google AdSense. These ads exist solely to support the free tier of the service — there is no data sharing, targeting arrangement, or commercial relationship with advertisers beyond standard AdSense placement.
                        </p>
                        <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/15">
                            <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">Our Commitment</p>
                            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                                While ads are present across the website, user experience remains our priority. Ads are placed thoughtfully and will never compromise the quality, usability, or satisfaction of your experience on SendMyForm.
                            </p>
                        </div>
                        <p className="text-sm leading-relaxed mt-3" style={{ color: "var(--text-secondary)" }}>
                            Ad personalisation is handled entirely by Google.
                        </p>
                    </Section>

                    <Section title="6. Service Availability">
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            We aim to maintain high availability of the Service but do not guarantee uninterrupted access. The Service is provided "as is" without warranties of any kind. We may perform maintenance, updates, or experience downtime. We are not liable for any losses resulting from service interruptions.
                        </p>
                    </Section>

                    <Section title="7. Intellectual Property">
                        <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
                            All code, design, trademarks, and content of the SendMyForm platform are owned by Achaia Labs and protected by applicable intellectual property laws. You may not copy, modify, or distribute any part of the Service without our prior written consent.
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            You retain all rights to the content submitted through your forms. By using the Service, you grant us a limited licence to process that content solely for the purpose of delivering it to your inbox.
                        </p>
                    </Section>

                    <Section title="8. Limitation of Liability">
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            To the maximum extent permitted by law, Achaia Labs shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, revenue, or business, arising from your use of or inability to use the Service. Our total liability for any claim arising from these Terms shall not exceed the amount you paid us in the twelve months prior to the claim (or £50 if you have not paid anything).
                        </p>
                    </Section>

                    <Section title="9. Termination">
                        <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
                            You may delete your account at any time from the Dashboard. Upon deletion, your project configuration and account data will be permanently removed.
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            We may suspend or terminate your access at any time if you breach these Terms, abuse the Service, or if we discontinue the Service. We will provide reasonable notice where possible.
                        </p>
                    </Section>

                    <Section title="10. Governing Law">
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            These Terms are governed by the laws of India, where Achaia Labs is based. Any disputes shall be subject to the exclusive jurisdiction of the courts of India. If any provision of these Terms is found unenforceable, the remaining provisions shall remain in full effect.
                        </p>
                    </Section>

                    <Section title="11. Changes to These Terms">
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            We may update these Terms from time to time. We will notify users of material changes by updating the "last updated" date. Your continued use of the Service after changes are posted constitutes acceptance of the revised Terms. If you do not agree with the changes, you must stop using the Service.
                        </p>
                    </Section>

                    <Section title="12. Contact">
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            For any questions about these Terms, contact us at:
                        </p>
                        <a
                            href="mailto:contact@sendmyform.live"
                            className="text-sm font-semibold text-violet-400 hover:underline mt-2 inline-block"
                        >
                            contact@sendmyform.live
                        </a>
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