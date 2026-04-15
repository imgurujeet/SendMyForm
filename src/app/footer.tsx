// components/Footer.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import TermsModal from "@/components/TermsModal";
import PrivacyModal from "@/components/PrivacyModal";

export default function Footer() {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <>
      <footer className="border-t border-white/5 px-6 md:px-20 py-12 md:py-16 flex flex-col gap-12">

        <div className="text-center">
          <p className="text-[10px] md:text-xs font-black text-slate-700 uppercase tracking-[0.4em] md:tracking-[0.8em] italic">
            Zero Persistence • Maximum Privacy • Dev First
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center md:text-left">

          <div className="flex flex-col gap-3">
            <p className="text-white text-xs font-black uppercase tracking-widest">Product</p>
            <Link href="/dashboard" className="footer-link">Dashboard</Link>
            <Link href="/docs" className="footer-link">Documentation</Link>
            <Link href="/api" className="footer-link">API</Link>
            <Link href="/playground" className="footer-link">Playground</Link>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-white text-xs font-black uppercase tracking-widest">Developers</p>
            <Link href="/docs" className="footer-link">Getting Started</Link>
            <Link href="/examples" className="footer-link">Examples</Link>
            <Link href="/status" className="footer-link">System Status</Link>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-white text-xs font-black uppercase tracking-widest">Company</p>
            <Link href="/about" className="footer-link">About</Link>
            <Link href="/services" className="footer-link">Services</Link>
            <Link href="/contact" className="footer-link">Contact</Link>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-white text-xs font-black uppercase tracking-widest">Support</p>
            <Link href="/help" className="footer-link">Help Center</Link>
            <Link href="/support" className="footer-link">Support</Link>
            <button onClick={() => setShowPrivacy(true)} className="footer-link text-left bg-transparent border-none p-0 cursor-pointer">Privacy Policy</button>
            <button onClick={() => setShowTerms(true)} className="footer-link text-left bg-transparent border-none p-0 cursor-pointer">Terms & Conditions</button>
          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 pt-6">
          <p className="text-xs text-slate-600 font-bold">
            © 2026 YourBrand. All rights reserved.
          </p>

          <div className="flex gap-6 text-slate-500">
            <a href="#" className="hover:text-white transition">Twitter</a>
            <a href="#" className="hover:text-white transition">GitHub</a>
            <a href="#" className="hover:text-white transition">LinkedIn</a>
          </div>
        </div>

      </footer>

      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </>
  );
}