import React from "react";
import Link from "next/link";
import { ArrowLeft, Gift, ShieldAlert, Heart, Activity, DollarSign } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import KoFiWidget from "@/components/KoFiWidget";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Forever Form Backend — SendMyForm",
  description: "Learn why SendMyForm is 100% free forever. Discover our zero-storage architecture, privacy-first values, and how we keep the service free for developers.",
  alternates: {
    canonical: "https://sendmyform.live/free-forever",
  },
};

export default function FreeForeverPage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Subtle background gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-700/5 blur-[140px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-indigo-800/4 blur-[120px] rounded-full"></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 py-3 px-6 md:px-10 flex justify-between items-center backdrop-blur-xl" style={{ background: 'var(--nav-bg)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold tracking-tight text-white">
            Send<span className="text-violet-500">My</span>Form
          </Link>
          <span className="hidden sm:block text-[10px] text-slate-500 font-medium tracking-wider uppercase border border-slate-800 px-2 py-0.5 rounded">
            Free Forever
          </span>
        </div>

        <div className="flex gap-4 md:gap-6 items-center">
          <Link href="/docs" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Docs
          </Link>
          <ThemeToggle />
          <Link href="/dashboard" className="px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-500 transition-all shadow-lg shadow-violet-900/30">
            Login
          </Link>
        </div>
      </nav>

      {/* --- CONTENT CONTAINER --- */}
      <div className="min-h-screen pt-24 pb-16">
        <main className="max-w-3xl mx-auto py-12 px-6 md:px-10 relative z-10">
          
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors mb-12 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <header className="mb-16">
            <div className="w-12 h-12 bg-violet-600/10 border border-violet-500/20 rounded-xl flex items-center justify-center mb-6">
              <Gift className="text-violet-400" size={24} />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Why SendMyForm is <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Free Forever</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              We believe handling simple contact forms shouldn&apos;t require monthly subscriptions or credit card configurations. Here is exactly how we keep SendMyForm completely free and sustainable.
            </p>
          </header>

          <div className="space-y-12 leading-relaxed text-slate-300">
            
            <section className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-violet-500/20 transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-violet-600/10 border border-violet-500/20 rounded-xl text-violet-400">
                  <Activity size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-3">1. Our Zero-Storage Architecture</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Most form backends charge high fees because storing millions of submission payloads, files, and meta logs on SSD databases is extremely expensive. 
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed mt-3">
                    SendMyForm is built differently: **we never store your form submissions**. When a submission lands on our endpoint, we instantly process, validate, filter spam, and mail it to you. Once delivered, the data is completely erased from our system. This lean, zero-persistence model reduces our hosting costs to almost nothing, allowing us to pass the savings back to you.
                  </p>
                </div>
              </div>
            </section>

            <section className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-violet-500/20 transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-600/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                  <Heart size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-3">2. Funded by the Community</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    We rely on voluntary support from developers, freelancers, and designers who use SendMyForm. If the service saves you time, hosting fees, or backend development hassle, you can buy us a coffee on Ko-fi. 
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed mt-3">
                    This donation model covers server overhead, domain costs, and dedicated IP routing, ensuring that other developers can run contact forms on static sites without paying a dime.
                  </p>
                  <div className="mt-6 flex justify-start">
                    <KoFiWidget variant="minimal" />
                  </div>
                </div>
              </div>
            </section>

            <section className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-violet-500/20 transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                  <DollarSign size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-3">3. Non-intrusive Ad Placements</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    To maintain absolute sustainability without limiting the amount of forms or monthly submissions, we display clean, non-intrusive ads (like Google AdSense) on select public pages (such as integrations or blog guides).
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed mt-3 font-semibold text-emerald-400">
                    Important: Ads are only shown on public educational pages and help articles. We will never place ads inside your account console or the main dashboard.
                  </p>
                </div>
              </div>
            </section>

            <section className="p-8 rounded-2xl bg-rose-500/5 border border-rose-500/10">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-600/10 border border-rose-500/20 rounded-xl text-rose-400">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-3">What about limits?</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    We do not impose strict paid tier limits. You can create multiple projects and receive unlimited form submissions completely free. 
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed mt-3">
                    We only enforce fair-use rate limits (e.g. up to 10 submissions per minute per form) to protect our email routing servers from abuse and spam bot attacks.
                  </p>
                </div>
              </div>
            </section>

            {/* --- Ko-fi Banner Section --- */}
            <div className="mt-16 pt-8 border-t border-white/5">
              <KoFiWidget variant="banner" />
            </div>

          </div>
        </main>
      </div>

      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
}
