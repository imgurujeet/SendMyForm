"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  ArrowRight,
  Code2,
  ShieldCheck,
  Zap,
  Mail,
  Database,
  Layers,
  Globe,
  ShieldX,
  Megaphone,
  Terminal,
  Activity,
  CheckCircle2,
  Lock,
  ChevronRight,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-600/50 overflow-x-hidden font-sans">

      {/* Background Neural Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-violet-600/5 blur-[180px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[1200px] h-[1200px] bg-emerald-600/5 blur-[200px] rounded-full"></div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 py-2 md:py-3 px-4 md:px-8 flex justify-between items-center backdrop-blur-2xl border-b border-white/5">
        <div>
          <Link
            href="/#"
            className="text-lg md:text-2xl font-black italic tracking-tightest uppercase hover:text-violet-500 transition-all"
          >
            SendMyForm
          </Link>

          <span className="text-violet-600 font-bold block text-[9px] tracking-[0.5em] mt-1 italic">
            BY{" "}
            <a
              href="https://achaialabs.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-200"
            >
              Achaia Labs
            </a>
          </span>
        </div>

        <div className="flex gap-4 md:gap-10 items-center">
          <Link href="/docs" className="hidden sm:inline text-[14px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors italic">
            Documentation
          </Link>

          <Link href="/dashboard" className="px-4 md:px-10 py-2 md:py-3 bg-white text-black text-[14px] font-black uppercase tracking-widest rounded-xl hover:bg-violet-600 hover:text-white transition-all shadow-xl shadow-white/5 italic">
            Launch Console
          </Link>
        </div>

      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-36 md:pt-64 pb-16 md:pb-32 flex flex-col items-center justify-center text-center px-4 md:px-6">

        <div className="inline-flex items-center gap-3 px-4 md:px-6 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8 md:mb-12 italic">
          <ShieldX size={14} /> Zero-Persistence Gateway
        </div>

        <h1 className="text-[14vw] md:text-[12vw] font-black tracking-tightest uppercase italic leading-[0.8] mb-8 md:mb-12">
          Ingest <span className="text-violet-600">&</span> <br />
          <span className="text-white underline decoration-violet-600 decoration-[6px] md:decoration-[12px] underline-offset-[10px] md:underline-offset-[20px]">Forget.</span>
        </h1>

        <p className="max-w-2xl text-slate-500 text-sm md:text-xl font-bold uppercase tracking-widest italic mb-10 md:mb-16 leading-relaxed px-2">
          The world's most <span className="text-white">secure</span> & <span className="text-slate-300">private</span> form backend for high-end developer nodes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 md:gap-8 w-full sm:w-auto px-4 sm:px-0">
          <Link href="/dashboard" className="px-8 md:px-16 py-4 md:py-6 bg-white text-black font-black uppercase text-xs tracking-[0.3em] rounded-3xl hover:bg-violet-600 hover:text-white transition-all shadow-2xl shadow-white/10 italic flex items-center justify-center gap-4 group">
            Get Started <Zap size={18} fill="currentColor" />
          </Link>
          <Link href="/docs" className="px-8 md:px-16 py-4 md:py-6 bg-black border border-white/10 text-white font-black uppercase text-xs tracking-[0.3em] rounded-3xl hover:bg-white/5 transition-all italic flex items-center justify-center gap-4">
            API Protocol <Terminal size={18} />
          </Link>
        </div>

        {/* Global Node ID Indicator */}
        <div className="mt-16 md:mt-32 w-full max-w-4xl grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 px-2">
          {[
            { label: "Uptime", val: "99.98%", icon: Activity },
            { label: "Ingestion Latency", val: "12ms", icon: Zap },
            { label: "Data Persistence", val: "OFF", icon: Lock },
            { label: "Encryption", val: "AES-256", icon: ShieldCheck },
          ].map((item, i) => (
            <div key={i} className="p-6 md:p-10 rounded-[24px] md:rounded-[40px] bg-slate-950/20 border border-white/5 text-left group hover:border-white/20 transition-all">
              <item.icon size={22} className="text-violet-500 mb-4 md:mb-6" />
              <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-2 italic">{item.label}</p>
              <p className="text-xl md:text-2xl font-black text-white italic">{item.val}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-20 md:py-40 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">

          <div className="p-16 rounded-[4.5rem] bg-slate-950/20 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-3xl group-hover:bg-violet-600/10"></div>
            <div className="p-5 bg-violet-600 shadow-glow shadow-violet-500/50 rounded-2xl w-fit mb-10"><Code2 size={24} className="text-white" /></div>
            <h3 className="text-3xl font-black uppercase italic mb-6 tracking-tighter text-white">Instant <br /><span className="text-violet-600">Syncing</span></h3>
            <p className="text-slate-500 text-xs font-bold leading-relaxed uppercase tracking-widest italic italic">Connect any HTML form in seconds. No backend required. Just point it to your SendMyForm node.</p>
          </div>

          <div className="p-16 rounded-[4.5rem] bg-slate-950/20 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 blur-3xl group-hover:bg-emerald-600/10"></div>
            <div className="p-5 bg-emerald-600 shadow-glow shadow-emerald-500/50 rounded-2xl w-fit mb-10"><ShieldX size={24} className="text-white" /></div>
            <h3 className="text-3xl font-black uppercase italic mb-6 tracking-tighter text-white">Hardcoded <br /><span className="text-emerald-500">Privacy</span></h3>
            <p className="text-slate-500 text-xs font-bold leading-relaxed uppercase tracking-widest italic italic">Zero data storage. Ingest, Route, Purge. Your leads are delivered instantly and then erased from existence.</p>
          </div>

          <div className="p-16 rounded-[4.5rem] bg-slate-950/20 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/5 blur-3xl group-hover:bg-pink-600/10"></div>
            <div className="p-5 bg-pink-600 shadow-glow shadow-pink-500/50 rounded-2xl w-fit mb-10"><Megaphone size={24} className="text-white" /></div>
            <h3 className="text-3xl font-black uppercase italic mb-6 tracking-tighter text-white">Smart <br /><span className="text-pink-600">Monetization</span></h3>
            <p className="text-slate-500 text-xs font-bold leading-relaxed uppercase tracking-widest italic italic">AdSense and Meta monetization built-in. Earn from every submission page with global ad injection.</p>
          </div>

        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-28 md:py-60 relative overflow-hidden flex flex-col items-center px-4">
        <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-600 to-transparent"></div>
        <h2 className="text-3xl sm:text-5xl lg:text-8xl font-black italic tracking-tightest uppercase mb-8 md:mb-12 text-center">Ready <span className="text-slate-500">To Launch?</span></h2>
        <Link href="/dashboard" className="px-6 md:px-10 py-3 md:py-4 bg-white text-black font-black uppercase text-sm md:text-xl rounded-[40px] hover:scale-105 transition-all shadow-[0_0_100px_-10px_rgba(255,255,255,0.3)] italic flex items-center gap-4 md:gap-6 group">
          Launch Your First Node <ChevronRight size={22} className="group-hover:translate-x-2 transition-transform" />
        </Link>
      </section>

      {/* --- FOOTER --- */}
      <footer className="p-8 md:p-20 border-t border-white/5 flex flex-col items-center gap-6 md:gap-8">
        <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.5em] md:tracking-[1em] italic leading-none text-center">The Future of Ingestion Protocol v2.1</p>
        <div className="flex gap-8 md:gap-20 items-center flex-wrap justify-center">
          <Link href="/" className="text-xs font-black italic text-slate-500 hover:text-white transition-colors uppercase tracking-widest">Portal</Link>
          <Link href="/dashboard" className="text-xs font-black italic text-slate-500 hover:text-white transition-colors uppercase tracking-widest">Launch Pad</Link>
          <Link href="/docs" className="text-xs font-black italic text-slate-500 hover:text-white transition-colors uppercase tracking-widest">Protocol Docs</Link>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px); scale: 0.95; }
          to { opacity: 1; transform: translateY(0); scale: 1; }
        }
        .animate-fade-in { animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .tracking-tightest { letter-spacing: -0.1em; }
        .shadow-glow { box-shadow: 0 0 40px -10px currentColor; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #111; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #6d28d9; }
      `}</style>
    </div>
  );
}
