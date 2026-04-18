"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import TermsModal from "@/components/TermsModal";
import PrivacyModal from "@/components/PrivacyModal";
import ThemeToggle from "@/components/ThemeToggle";
import { trackCTAClick } from "@/lib/analytics";
import {
  Code2,
  ShieldCheck,
  Zap,
  Mail,
  Activity,
  CheckCircle2,
  Lock,
  ChevronRight,
  Terminal,
  Globe,
  ArrowRight,
  Layers,
  FileJson,
  UploadCloud,
} from "lucide-react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

      {/* Subtle background gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-700/8 blur-[140px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-indigo-800/6 blur-[120px] rounded-full"></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 py-3 px-6 md:px-10 flex justify-between items-center backdrop-blur-xl" style={{ background: 'var(--nav-bg)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold tracking-tight text-white">
            Send<span className="text-violet-500">My</span>Form
          </Link>
          <span className="hidden sm:block text-[10px] text-slate-600 font-medium tracking-wider uppercase border border-slate-800 px-2 py-0.5 rounded">
            by <a href="https://achaialabs.tech" target="_blank" rel="noopener noreferrer" className="hover:text-violet-400 transition-colors">Achaia Labs</a>
          </span>
        </div>

        <div className="flex gap-3 md:gap-6 items-center">
          <Link href="/docs" className="hidden sm:inline text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Documentation
          </Link>
          <ThemeToggle />
          <Link href="/dashboard" className="px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-500 transition-all shadow-lg shadow-violet-900/30">
            Login
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen pt-28 flex flex-col items-center justify-center text-center px-4 md:px-6">

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/8 text-violet-400 text-xs font-medium tracking-wide mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></span>
          Form submissions, handled instantly
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6 max-w-4xl">
          The simplest way to handle{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">form submissions</span>
        </h1>

        <p className="max-w-xl text-slate-400 text-base md:text-lg font-normal mb-10 leading-relaxed">
          Point your HTML form at a single endpoint. We validate, filter spam, and deliver every submission straight to your inbox — no backend required.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-4 sm:px-0">
          <Link href="/dashboard" onClick={() => trackCTAClick("get_started", "hero")} className="px-6 py-3 bg-violet-600 text-white font-semibold text-sm rounded-lg hover:bg-violet-500 transition-all shadow-lg shadow-violet-900/30 flex items-center justify-center gap-2 group">
            Get started free <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link href="/docs" onClick={() => trackCTAClick("view_docs", "hero")} className="px-6 py-3 bg-white/5 border border-white/10 text-white font-semibold text-sm rounded-lg hover:bg-white/8 transition-all flex items-center justify-center gap-2">
            <Terminal size={15} /> View docs
          </Link>
        </div>

        {/* Stats bar */}
        <div className="mt-20 w-full max-w-2xl grid grid-cols-3 gap-4 px-2">
          {[
            { label: "Uptime", val: "99.98%", icon: Activity },
            { label: "Avg. Delivery", val: "< 2s", icon: Zap },
            { label: "Data Stored", val: "Zero", icon: Lock },
          ].map((item, i) => (
            <div key={i} className="p-5 md:p-7 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-left hover:border-white/[0.12] transition-all">
              <item.icon size={16} className="text-violet-400 mb-3" />
              <p className="text-[11px] font-medium text-slate-600 uppercase tracking-wider mb-1">{item.label}</p>
              <p className="text-lg md:text-xl font-bold text-white">{item.val}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 md:py-32 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Three steps. That's it.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">

          {/* Connector line — sits behind the badges, spans badge centers */}
          <div className="hidden md:block absolute top-[20px] left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-px bg-gradient-to-r from-violet-500/40 via-violet-500/60 to-violet-500/40"></div>

          {[
            { step: "01", title: "Create your endpoint", desc: "Sign in and create a project. You'll get a unique form endpoint URL in seconds." },
            { step: "02", title: "Connect your form", desc: "Set your form's action attribute to your endpoint. Works with HTML, React, Vue — any frontend." },
            { step: "03", title: "Receive submissions", desc: "Every submission is validated, spam-filtered, and delivered directly to your inbox." },
          ].map((item, i) => (
            <div key={i} className="relative p-8 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-violet-500/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 font-bold text-sm mb-6 relative z-10">
                {item.step}
              </div>
              <h3 className="text-base font-semibold text-white mb-3">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section className="py-24 md:py-32 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything your forms need</h2>
          <p className="text-slate-500 mt-4 max-w-lg mx-auto text-sm leading-relaxed">Built for developers who want reliable form handling without the overhead of a custom backend.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: Zap,
              color: "violet",
              title: "Instant Setup",
              desc: "Connect any HTML form in under 60 seconds. Just point your form's action attribute at your endpoint — no code changes needed."
            },
            {
              icon: ShieldCheck,
              color: "emerald",
              title: "Spam & Bot Protection",
              desc: "Built-in honeypot fields, rate limiting, and input validation protect your inbox from spam and automated abuse."
            },
            {
              icon: Mail,
              color: "blue",
              title: "Email Delivery",
              desc: "Every submission is delivered directly to your inbox with a clean, readable email. Supports multiple recipients and custom themes."
            },
            {
              icon: FileJson,
              color: "amber",
              title: "Multipart & JSON Support",
              desc: "Accept file uploads, images, videos, and structured JSON in the same form. No schema required — we handle any field dynamically."
            },
            {
              icon: Globe,
              color: "pink",
              title: "Framework Agnostic",
              desc: "Works with any frontend — vanilla HTML, React, Vue, Svelte, WordPress, Framer, Webflow. If it can send a POST request, it works."
            },
            {
              icon: Lock,
              color: "slate",
              title: "Privacy by Default",
              desc: "Submission data is never stored on our servers. It's processed, delivered, and discarded — keeping your users' data private."
            },
          ].map((f, i) => {
            const colorMap: Record<string, string> = {
              violet: "bg-violet-600/10 border-violet-500/20 text-violet-400",
              emerald: "bg-emerald-600/10 border-emerald-500/20 text-emerald-400",
              blue: "bg-blue-600/10 border-blue-500/20 text-blue-400",
              amber: "bg-amber-600/10 border-amber-500/20 text-amber-400",
              pink: "bg-pink-600/10 border-pink-500/20 text-pink-400",
              slate: "bg-slate-600/10 border-slate-500/20 text-slate-400",
            };
            return (
              <div key={i} className="p-7 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.12] transition-all group">
                <div className={`p-3 rounded-xl border w-fit mb-5 ${colorMap[f.color]}`}>
                  <f.icon size={18} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- CODE SNIPPET SECTION --- */}
      <section className="py-24 md:py-32 px-4 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Quick integration</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Add it to any form</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              No SDKs, no config files, no npm packages. Just a URL. Replace your form's action attribute and you're done.
            </p>
            <div className="space-y-3">
              {[
                "HTML forms with no JavaScript",
                "Fetch API and XMLHttpRequest",
                "React Hook Form, Formik, and more",
                "cURL, Postman, and server-side calls",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-400">
                  <CheckCircle2 size={15} className="text-violet-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-[#0D0D16] border border-white/[0.08] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60"></div>
              <span className="text-[10px] text-slate-600 ml-2 font-mono">contact.html</span>
            </div>
            <pre className="p-5 text-[13px] font-mono leading-relaxed overflow-x-auto text-slate-300">
              {`<form
  action="https://sendmyform.vercel.app/api/f/YOUR_ID"
  method="POST"
  enctype="multipart/form-data"
>
  <input name="name" type="text" required />
  <input name="email" type="email" required />
  <input name="attachment" type="file" />
  <textarea name="message"></textarea>
  <button type="submit">Send</button>
</form>`}
            </pre>
          </div>
        </div>
      </section>

      {/* --- TOOL CTA --- */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <div className="p-1 w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 rounded-3xl">
          <div className="bg-[#0A0A0F] rounded-[22px] px-8 py-12 md:px-16 md:py-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Don't want to code? <span className="text-violet-400">Generate it.</span></h2>
              <p className="text-slate-400 mb-6">Use our free visual builder to create your form and get the HTML code instantly. One click to connect, no backend skills required.</p>
              <Link href="/tools/form-generator" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold text-sm rounded-xl hover:bg-slate-200 transition-all">
                Try the Form Generator <ArrowRight size={16} />
              </Link>
            </div>
            <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
              <div className="absolute inset-0 bg-violet-600/20 blur-[60px] rounded-full animate-pulse"></div>
              <div className="relative z-10 p-6 bg-white/[0.03] border border-white/10 rounded-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500">
                <Code2 className="text-violet-400 w-16 h-16 mb-4" />
                <div className="space-y-2">
                  <div className="h-2 w-32 bg-white/10 rounded"></div>
                  <div className="h-2 w-24 bg-white/10 rounded"></div>
                  <div className="h-2 w-40 bg-white/10 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- COMPARISON --- */}
      <section className="py-24 md:py-32 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Why SendMyForm</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">No backend. No config. Just results.</h2>
        </div>

        <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/[0.06]">
                <th className="text-left px-6 py-4 text-slate-500 font-medium">Capability</th>
                <th className="text-center px-6 py-4 text-slate-500 font-medium">Custom backend</th>
                <th className="text-center px-6 py-4 text-violet-400 font-semibold">SendMyForm</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Setup time", "Hours to days", "< 60 seconds"],
                ["File & media uploads", "Requires S3/cloud config", "Built-in"],
                ["Spam protection", "Build it yourself", "Automatic"],
                ["Email delivery", "Configure SMTP + templates", "Ready out of the box"],
                ["Framework support", "Language-specific", "Any frontend or language"],
                ["Data privacy", "Depends on your setup", "Never stored"],
              ].map(([cap, them, us], i) => (
                <tr key={i} className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-slate-300 font-medium">{cap}</td>
                  <td className="px-6 py-4 text-center text-slate-500">{them}</td>
                  <td className="px-6 py-4 text-center text-emerald-400 font-medium">{us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- DIRECT ANSWER FOR AEO --- */}
      <section className="py-24 px-4 max-w-4xl mx-auto border-t border-white/[0.05]">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">What is a No-Backend Form?</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              A no-backend form allows you to collect data from your website's visitors without setting up a database or writing server-side code (Node.js, PHP, Python).
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              By using <strong>SendMyForm</strong>, you simply point your HTML form's action attribute to our secure endpoint. We handle the heavy lifting: receiving data, filtering spam, and delivering it instantly to your email.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-violet-600/5 border border-violet-500/10">
            <h3 className="text-lg font-semibold mb-2 text-violet-400">Perfect for:</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="flex gap-2"><span>✅</span> Static Site Generators (Next.js, Hugo, Jekyll)</li>
              <li className="flex gap-2"><span>✅</span> Landing Pages & Portfolios</li>
              <li className="flex gap-2"><span>✅</span> Marketing Sites (WordPress, Webflow, Framer)</li>
              <li className="flex gap-2"><span>✅</span> JAMstack Applications</li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION FOR AEO --- */}
      <section className="py-24 md:py-32 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Questions</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
        </div>
        <div className="grid gap-6">
          {[
            {
              q: "How do I use SendMyForm with React or Next.js?",
              a: "You can use a standard HTML form or the Fetch API. Simply POST your form data to your unique SendMyForm endpoint URL. It works perfectly with libraries like Formik and React Hook Form."
            },
            {
              q: "Is it really free to start?",
              a: "Yes! Our free tier includes everything you need to get started. You can create projects, handle submissions, and receive email notifications without any upfront cost."
            },
            {
              q: "Do you store my submission data?",
              a: "Privacy is our priority. We process and deliver your submissions instantly to your email, and then we discard the data. We do not store your users' sensitive information on our servers."
            },
            {
              q: "Can I use SendMyForm on Webflow or Framer?",
              a: "Absolutely. SendMyForm is framework-agnostic. In Webflow or Framer, simply set the form's action to your SendMyForm endpoint and change the method to POST."
            }
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-violet-500/20 transition-all">
              <h3 className="text-lg font-semibold text-white mb-3">{item.q}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-28 md:py-40 relative overflow-hidden flex flex-col items-center px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-700/10 blur-[100px] rounded-full"></div>
        </div>
        <div className="relative text-center max-w-2xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Your next form submission<br />is one endpoint away.
          </h2>
          <p className="text-slate-400 text-base mb-10">
            No credit card required. Free to start. Works on any website in under a minute.
          </p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-violet-600 text-white font-semibold text-sm rounded-xl hover:bg-violet-500 transition-all shadow-2xl shadow-violet-900/40 group">
            Start for free <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer style={{ borderTop: '1px solid var(--border-color)' }} className="px-6 md:px-16 py-14 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <p className="text-base font-bold text-white mb-2">Send<span className="text-violet-500">My</span>Form</p>
            <p className="text-xs text-slate-600 leading-relaxed max-w-[180px]">
              Form submissions handled simply, reliably, and privately.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-white uppercase tracking-wider">Product</p>
            <Link href="/about" className="text-sm text-slate-500 hover:text-white transition-colors">About</Link>
            <Link href="/dashboard" className="text-sm text-slate-500 hover:text-white transition-colors">Dashboard</Link>
            <Link href="/docs" className="text-sm text-slate-500 hover:text-white transition-colors">Documentation</Link>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-white uppercase tracking-wider">Company</p>
            <a href="https://achaialabs.tech" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-white transition-colors">Achaia Labs</a>
            <a href="mailto:contact@sendmyform.live" className="text-sm text-slate-500 hover:text-white transition-colors">Contact</a>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-white uppercase tracking-wider">Legal</p>
            <button onClick={() => setShowPrivacy(true)} className="text-sm text-slate-500 hover:text-white transition-colors text-left">Privacy Policy</button>
            <button onClick={() => setShowTerms(true)} className="text-sm text-slate-500 hover:text-white transition-colors text-left">Terms & Conditions</button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/[0.05] pt-8">
          <p className="text-xs text-slate-700">© 2026 <a href="https://achaialabs.tech" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-700 hover:text-violet-500 transition-colors">Achaia Labs</a>. All rights reserved.</p>
          <div className="flex gap-5 text-sm text-slate-600">
            <a href="https://x.com/achaialabs" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://www.linkedin.com/company/achaia-labs/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>

      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--scrollbar-track); }
        ::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #6d28d9; }
      `}</style>
    </div>
  );
}