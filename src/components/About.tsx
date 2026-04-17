"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Mail,
  ShieldCheck,
  Zap,
  Globe,
  Code2,
  Heart,
  ExternalLink,
} from "lucide-react";

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="min-h-screen bg-[#0A0A0F] text-white overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-violet-700/6 blur-[160px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-indigo-800/5 blur-[120px] rounded-full" />
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 py-3 px-6 md:px-10 flex justify-between items-center bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold tracking-tight text-white">
            Send<span className="text-violet-500">My</span>Form
          </Link>
          <span className="hidden sm:block text-[10px] text-slate-600 font-medium tracking-wider uppercase border border-slate-800 px-2 py-0.5 rounded">
            by Achaia Labs
          </span>
        </div>
        <div className="flex gap-3 md:gap-6 items-center">
          <Link href="/docs" className="hidden sm:inline text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Documentation
          </Link>
          <Link href="/dashboard" className="px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-500 transition-all shadow-lg shadow-violet-900/30">
            Open Dashboard
          </Link>
        </div>
      </nav>

      <main className="relative z-10 pt-28">

        {/* ── HERO ── */}
        <section className="max-w-4xl mx-auto px-6 md:px-10 pb-24 md:pb-32">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/8 text-violet-400 text-xs font-medium tracking-wide mb-10">
            About SendMyForm
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.07] mb-8 max-w-3xl">
            We built the backend<br />
            so you{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
              don't have to.
            </span>
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
            SendMyForm is a form submission service built by{" "}
            <a
              href="https://achaialabs.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-violet-400 transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-violet-400/40"
            >
              Achaia Labs
            </a>
            . We handle everything that happens after a user clicks "Submit" — so
            you can focus on building the product, not the plumbing.
          </p>
        </section>

        {/* ── DIVIDER ── */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        {/* ── STORY ── */}
        <section className="max-w-4xl mx-auto px-6 md:px-10 py-24 md:py-32 grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-4">The problem we solved</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-0">
              Every project needs a contact form. Almost none need to build one from scratch.
            </h2>
          </div>
          <div className="space-y-5 text-slate-400 text-sm leading-relaxed pt-1">
            <p>
              Setting up form submissions sounds simple. But in practice it means spinning up a server,
              configuring SMTP, writing validation logic, dealing with spam, handling file uploads,
              and maintaining all of it indefinitely.
            </p>
            <p>
              We've seen this loop play out hundreds of times across projects of every size — from
              indie portfolios to agency client sites. The work is repetitive, undifferentiated, and
              takes time away from things that actually matter.
            </p>
            <p>
              SendMyForm collapses all of that into a single endpoint. You get spam filtering,
              email delivery, file support, and zero storage — out of the box, immediately.
            </p>
          </div>
        </section>

        {/* ── DIVIDER ── */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        {/* ── VALUES / PRINCIPLES ── */}
        <section className="max-w-4xl mx-auto px-6 md:px-10 py-24 md:py-32">
          <div className="mb-14">
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">What we stand for</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Built on a few clear principles</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: Zap,
                title: "Developer time is valuable",
                desc: "Every minute you spend writing form-handling boilerplate is a minute not spent on the actual product. We believe infrastructure should get out of the way.",
              },
              {
                icon: ShieldCheck,
                title: "Privacy should be the default",
                desc: "We don't store submission data on our servers. Data comes in, gets delivered to your inbox, and is discarded. Your users' information stays between you and them.",
              },
              {
                icon: Globe,
                title: "Works everywhere, no lock-in",
                desc: "An HTTP endpoint works with any language, any framework, any platform. We don't ask you to install an SDK or commit to our ecosystem.",
              },
              {
                icon: Code2,
                title: "Simple things should stay simple",
                desc: "A contact form is not a complex problem. We keep our API surface small and our integration story to a single line of HTML.",
              },
            ].map((v, i) => (
              <div
                key={i}
                className="p-7 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-violet-500/20 transition-all group"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="p-2.5 bg-violet-600/10 border border-violet-500/20 rounded-xl w-fit mb-5">
                  <v.icon size={17} className="text-violet-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{v.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── DIVIDER ── */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        {/* ── ACHAIA LABS ── */}
        <section className="max-w-4xl mx-auto px-6 md:px-10 py-24 md:py-32 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-4">The team</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-6">
              Made by Achaia Labs
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Achaia Labs is a development studio focused on building practical tools and products
              for the web. We ship things that developers and creators actually need — without
              unnecessary complexity.
            </p>
            <a
              href="https://achaialabs.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-violet-400 transition-colors group"
            >
              Visit Achaia Labs
              <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { val: "99.98%", label: "Uptime" },
              { val: "< 2s", label: "Avg. delivery time" },
              { val: "Zero", label: "Data stored" },
              { val: "Any", label: "Framework support" },
            ].map((s, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.12] transition-all"
              >
                <p className="text-2xl font-bold text-white mb-1">{s.val}</p>
                <p className="text-xs text-slate-600 font-medium uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── DIVIDER ── */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        {/* ── CTA ── */}
        <section className="py-28 md:py-40 px-4 relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-violet-700/10 blur-[100px] rounded-full" />
          </div>
          <div className="relative text-center max-w-xl">
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-4">
              Ready to try it?
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Your form. Our infrastructure.
            </h2>
            <p className="text-slate-400 text-base mb-10 leading-relaxed">
              Free to start. No credit card required. Live on any website in under a minute.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-violet-600 text-white font-semibold text-sm rounded-xl hover:bg-violet-500 transition-all shadow-2xl shadow-violet-900/40 group"
              >
                Get started free
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/5 border border-white/10 text-white font-semibold text-sm rounded-xl hover:bg-white/8 transition-all"
              >
                Read the docs
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] px-6 md:px-16 py-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-700">© 2026 <a href="https://achaialabs.tech" target="_blank" rel="noopener noreferrer" className="hover:text-violet-400 transition-colors">Achaia Labs</a>. All rights reserved.</p>
        <div className="flex gap-5 text-sm text-slate-600">
          <a href="https://x.com/achaialabs" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
          <a href="https://www.linkedin.com/company/achaia-labs/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0A0A0F; }
        ::-webkit-scrollbar-thumb { background: #1e1e2e; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #6d28d9; }
      `}</style>
    </div>
  );
}