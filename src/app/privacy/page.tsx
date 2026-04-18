"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-slate-300 py-20 px-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        
        <header className="mb-16">
          <div className="w-12 h-12 bg-violet-600/10 border border-violet-500/20 rounded-xl flex items-center justify-center mb-6">
            <Shield className="text-violet-400" size={24} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-500 text-sm">Last Updated: April 18, 2026</p>
        </header>

        <div className="space-y-10 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Introduction</h2>
            <p>
              At SendMyForm (by Achaia Labs), we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. The Data We Collect</h2>
            <p>
              We collect information that you provide directly to us when you create an account, create a project, or contact us for support. This includes:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Contact data (email address).</li>
              <li>Technical data (IP address, browser type, usage patterns).</li>
              <li>Project data (form endpoint configurations).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Data Submission Processing</h2>
            <p className="font-bold text-violet-400 mb-4">
              Our unique "Zero-Storage" Promise:
            </p>
            <p>
              Unlike many form handlers, SendMyForm does not store the content of your form submissions on our long-term database. When a submission is received, it is processed, validated, and instantly delivered to your designated email address. Once delivery is confirmed, the submission data is purged from our temporary memory.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Cookie Policy</h2>
            <p>
              We use essential cookies to manage your session and preferences. We also use Google Analytics to understand how visitors interact with our website to improve our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Contact Information</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
            </p>
            <div className="mt-4 p-6 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <p className="text-white font-medium">Achaia Labs Support</p>
              <p className="text-sm text-slate-500">Email: contact@sendmyform.live</p>
              <p className="text-sm text-slate-500">Website: https://achaialabs.tech</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
