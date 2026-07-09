"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-slate-300 py-20 px-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        
        <header className="mb-16">
          <div className="w-12 h-12 bg-violet-600/10 border border-violet-500/20 rounded-xl flex items-center justify-center mb-6">
            <Scale className="text-violet-400" size={24} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Terms & Conditions</h1>
          <p className="text-slate-500 text-sm">Last Updated: April 18, 2026</p>
        </header>

        <div className="space-y-10 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using SendMyForm ("the Service"), you agree to be bound by these terms. If you do not agree to these terms, please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
            <p>
              SendMyForm provides an API endpoint for receiving form submissions. We process these submissions and deliver them to your email address. We do not guarantee 100% uptime, although we strive for 99.9% availability.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Acceptable Use</h2>
            <p>
              You agree not to use SendMyForm for any illegal purposes or for the transmission of material that is unlawful, harassing, libelous, invasive of another's privacy, abusive, threatening, harmful, vulgar, obscene, or otherwise objectionable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Limitation of Liability</h2>
            <p>
              Achaia Labs shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or the inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Modifications to Service</h2>
            <p>
              We reserve the right to modify or discontinue the Service at any time with or without notice.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
