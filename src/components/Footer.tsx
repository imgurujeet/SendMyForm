"use client";

import { useState } from "react";
import Link from "next/link";
import TermsModal from "@/components/TermsModal";
import PrivacyModal from "@/components/PrivacyModal";
import KoFiWidget from "@/components/KoFiWidget";

/**
 * Footer
 *
 * Changes vs original:
 *  1. Ko-fi banner section added ABOVE the link grid
 *  2. Ko-fi minimal button added in the bottom bar alongside social links
 *  3. "© YourBrand" updated to SendMyForm / Achaia Labs
 *  4. Pricing link removed (free service — no pricing page needed)
 *  5. Added /free-forever and /open pages to Product column
 */
export default function Footer() {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setMsg("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(data.message);
        setEmail("");
      } else {
        setMsg(data.error || "Subscription request failed.");
      }
    } catch (err) {
      setMsg("Connection error. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <>
      <footer className="border-t border-white/5 px-6 md:px-20 py-12 md:py-16 flex flex-col gap-12">

        {/* ── Ko-fi banner — top of footer, high visibility ─────────────────── */}
        <KoFiWidget variant="banner" />

        {/* --- Newsletter Signup Widget --- */}
        <div className="max-w-md mx-auto w-full p-8 rounded-[32px] bg-slate-950/40 border border-white/5 text-center space-y-4">
          <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] italic">Product updates & release logs</p>
          <h4 className="text-lg font-black text-white uppercase italic tracking-tight">Join the developer newsletter</h4>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@example.com"
              className="flex-1 bg-slate-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs outline-none text-slate-100 font-bold placeholder-slate-600 focus:border-rose-500/30"
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-black uppercase text-[10px] tracking-widest px-5 py-2.5 rounded-xl transition-all"
            >
              {submitting ? "Joining..." : "Subscribe"}
            </button>
          </form>
          {msg && <p className="text-[10px] text-rose-500 font-bold uppercase italic mt-1">{msg}</p>}
        </div>

        {/* ── Tagline ───────────────────────────────────────────────────────── */}
        <div className="text-center">
          <p className="text-[10px] md:text-xs font-black text-slate-700 uppercase tracking-[0.4em] md:tracking-[0.8em] italic">
            Zero Persistence • Maximum Privacy • Dev First • Always Free
          </p>
        </div>

        {/* ── Link grid ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center md:text-left">

          <div className="flex flex-col gap-3">
            <p className="text-white text-xs font-black uppercase tracking-widest">Product</p>
            <Link href="/dashboard" className="footer-link">Dashboard</Link>
            <Link href="/docs" className="footer-link">Documentation</Link>
            <Link href="/tools/form-generator" className="footer-link">Form Generator</Link>
            <Link href="/free-forever" className="footer-link">
              Free Forever
              <span className="ml-1.5 inline-block px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500/15 text-emerald-400 uppercase tracking-wide">
                New
              </span>
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-white text-xs font-black uppercase tracking-widest">Developers</p>
            <Link href="/docs" className="footer-link">Getting Started</Link>
            <Link href="/integrations" className="footer-link">Integrations</Link>
            <Link href="/docs/api-reference" className="footer-link">API Reference</Link>
            <Link href="/status" className="footer-link">System Status</Link>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-white text-xs font-black uppercase tracking-widest">Company</p>
            <Link href="/about" className="footer-link">About</Link>
            <Link href="/blog" className="footer-link">Blog</Link>
            <Link href="/contact" className="footer-link">Contact</Link>
            {/* Ko-fi link in nav — easy to find for supporters */}
            <a
              href="https://ko-fi.com/achaialabs"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link flex items-center gap-1.5"
            >
              ☕ Support Us
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-white text-xs font-black uppercase tracking-widest">Support</p>
            <Link href="/help" className="footer-link">Help Center</Link>
            <Link href="/support" className="footer-link">Support</Link>
            <button
              onClick={() => setShowPrivacy(true)}
              className="footer-link text-left bg-transparent border-none p-0 cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setShowTerms(true)}
              className="footer-link text-left bg-transparent border-none p-0 cursor-pointer"
            >
              Terms & Conditions
            </button>
          </div>

        </div>

        {/* ── Bottom bar ────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 pt-6">
          <p className="text-xs text-slate-600 font-bold">
            © 2026 Achaia Labs · SendMyForm · All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-slate-500">
            <a href="https://twitter.com/achaialabs" target="_blank" rel="noopener noreferrer" className="hover:text-white transition text-sm">Twitter</a>
            <a href="https://github.com/imgurujeet" target="_blank" rel="noopener noreferrer" className="hover:text-white transition text-sm">GitHub</a>
            {/* Ko-fi minimal button in bottom bar */}
            <KoFiWidget variant="minimal" />
          </div>
        </div>

      </footer>

      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </>
  );
}