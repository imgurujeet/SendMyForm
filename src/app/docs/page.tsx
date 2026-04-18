"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Terminal,
  Code2,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Server,
  Palette,
  MailCheck,
  ArrowRight,
  FileCode,
  Globe,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { THEMES, getTheme } from "@/lib/themes";
import ThemeToggle from "@/components/ThemeToggle";
import { trackDocSection, trackCopyEndpoint, trackEmailThemePreview } from "@/lib/analytics";

export default function ApiDocsPage() {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("https://sendmyform.vercel.app");
  const [activeThemePreview, setActiveThemePreview] = useState("modern");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      trackCopyEndpoint("docs_endpoint");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const dummyData = {
    "Full Name": "James Potter",
    "Email": "james@achaialabs.tech",
    "Company": "Achaia Labs",
    "Message": "I need a reliable form backend for my portfolio. SendMyForm looks like exactly what I needed!",
    "Timestamp": "2026-04-06 14:25:33"
  };

  if (!mounted) return (
    <div className="h-screen bg-[#0A0A0F] flex items-center justify-center text-white text-sm font-medium">
      Loading...
    </div>
  );

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-700/6 blur-[140px] rounded-full"></div>
      </div>

      {/* --- DOCS NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 py-3 px-6 md:px-10 flex justify-between items-center backdrop-blur-xl" style={{ background: 'var(--nav-bg)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-slate-400 hover:text-white"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
          </button>
          <Link href="/" className="text-xl font-bold tracking-tight text-white">
            Send<span className="text-violet-500">My</span>Form
          </Link>
          <span className="hidden sm:block text-[10px] text-violet-400 font-medium tracking-wider uppercase border border-violet-500/20 bg-violet-500/8 px-2 py-0.5 rounded">
            Docs
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/dashboard" className="px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-500 transition-all shadow-lg shadow-violet-900/30">
            Login
          </Link>
        </div>
      </nav>

      {/* --- SIDEBAR (FIXED) --- */}
      {sidebarOpen && (
        <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-16 bottom-0 z-40 py-12 px-6 overflow-y-auto" style={{ background: 'var(--bg-primary)', borderRight: '1px solid var(--border-color)' }}>
          <nav className="space-y-1">
            {[
              { label: "Quick Start", href: "#quickstart" },
              { label: "Your Endpoint", href: "#endpoint" },
              { label: "Request Format", href: "#format" },
              { label: "Usage Examples", href: "#examples" },
              { label: "Email Delivery", href: "#email" },
              { label: "Security", href: "#security" },
              { label: "Response Codes", href: "#responses" },
              { label: "Email Themes", href: "#themes" },
              { label: "How It Works", href: "#workflow" },
              { label: "Why SendMyForm", href: "#why" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block text-sm transition-colors py-1.5 px-3 rounded-lg hover:bg-white/[0.04]"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>
      )}

      {/* --- MAIN CONTENT --- */}
      <div className={`min-h-screen pt-16 ${sidebarOpen ? 'lg:pl-64' : ''}`}>
        <main className="max-w-4xl mx-auto py-16 px-6 md:px-10 relative z-10">

          {/* Page Header */}
          <header className="mb-20">
            <span className="inline-flex items-center gap-2 bg-violet-600/10 border border-violet-500/20 text-violet-400 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide mb-6">
              API v2.0
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-5 text-white">
              SendMyForm <span className="text-violet-400">Documentation</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
              Integrate form submissions into any project in minutes. Just point your form at an endpoint — we handle validation, spam filtering, and email delivery.
            </p>
          </header>

          {/* --- QUICK START --- */}
          <section id="quickstart" className="mb-20 scroll-mt-20">
            <SectionHeader icon={Zap} title="Quick Start" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { step: "01", title: "Create endpoint", desc: "Log in and create a new project to get your form endpoint URL." },
                { step: "02", title: "Add to your form", desc: "Set your form's action attribute to your endpoint URL." },
                { step: "03", title: "Get submissions", desc: "Receive every submission instantly in your inbox." },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-violet-500/20 transition-all">
                  <p className="text-2xl font-bold text-white/10 mb-4">{item.step}</p>
                  <h4 className="text-sm font-semibold text-white mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <CodeBlock lang="HTML">
              {`<form action="https://sendmyform.vercel.app/api/f/contact" method="POST">
  <input name="email" type="email" required />
  <button type="submit">Submit</button>
</form>`}
            </CodeBlock>
          </section>

          {/* --- YOUR ENDPOINT --- */}
          <section id="endpoint" className="mb-20 scroll-mt-20">
            <SectionHeader icon={Terminal} title="Your Form Endpoint" />

            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.07] relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Endpoint URL</p>
                <button
                  onClick={() => copyToClipboard(`${origin || 'https://sendmyform.vercel.app'}/api/f/[YOUR_FORM_ID]`)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/[0.08] rounded-lg text-slate-400 hover:text-white transition-all text-xs font-medium"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  {copied ? "Copied!" : "Copy URL"}
                </button>
              </div>

              <CodeBlock lang="HTML">
                {`<!-- Add this to your website -->
<form
  action="${origin || 'https://sendmyform.vercel.app'}/api/f/[YOUR_FORM_ID]"
  method="POST"
  enctype="multipart/form-data"
>
  <input name="email" type="email" required />
  <button type="submit">Submit</button>
</form>`}
              </CodeBlock>
            </div>
          </section>

          {/* --- REQUEST FORMAT --- */}
          <section id="format" className="mb-20 scroll-mt-20">
            <SectionHeader icon={FileCode} title="Request Format" />

            <CodeBlock lang="JSON">
              {`{
  "email": "required",
  "name": "optional",
  "message": "any field — no strict schema required"
}`}
            </CodeBlock>

            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              {[
                "Accepts multipart/form-data",
                "Accepts JSON payloads",
                "No strict schema required",
              ].map((item, i) => (
                <FeatureChip key={i} text={item} />
              ))}
            </div>
          </section>

          {/* --- USAGE EXAMPLES --- */}
          <section id="examples" className="mb-20 scroll-mt-20">
            <SectionHeader icon={Code2} title="Usage Examples" />

            <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[140px]">Method</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Code</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5 align-top">
                      <span className="text-xs font-semibold text-white bg-white/5 px-2 py-1 rounded">HTML</span>
                    </td>
                    <td className="px-6 py-5">
                      <pre className="text-sm text-violet-300 font-mono leading-relaxed overflow-x-auto">
                        {`<form action="/api/f/contact" method="POST">
  <input name="email" />
</form>`}
                      </pre>
                    </td>
                  </tr>
                  <tr className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5 align-top">
                      <span className="text-xs font-semibold text-white bg-white/5 px-2 py-1 rounded">Fetch API</span>
                    </td>
                    <td className="px-6 py-5">
                      <pre className="text-sm text-violet-300 font-mono leading-relaxed overflow-x-auto">
                        {`fetch("/api/f/contact", {
  method: "POST",
  body: JSON.stringify({ email: "test@test.com" })
})`}
                      </pre>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5 align-top">
                      <span className="text-xs font-semibold text-white bg-white/5 px-2 py-1 rounded">cURL</span>
                    </td>
                    <td className="px-6 py-5">
                      <pre className="text-sm text-violet-300 font-mono leading-relaxed overflow-x-auto">
                        {`curl -X POST https://sendmyform.vercel.app/api/f/contact \\
  -d "email=test@test.com"`}
                      </pre>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* --- EMAIL DELIVERY --- */}
          <section id="email" className="mb-20 scroll-mt-20">
            <SectionHeader icon={MailCheck} title="Email Delivery" />

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                "Submissions sent instantly to your inbox",
                "Custom themed email templates",
                "Supports multiple fields dynamically",
              ].map((item, i) => (
                <FeatureChip key={i} icon={MailCheck} text={item} />
              ))}
            </div>
          </section>

          {/* --- SECURITY --- */}
          <section id="security" className="mb-20 scroll-mt-20">
            <SectionHeader icon={ShieldCheck} title="Security" />

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                "Spam protection via honeypot fields",
                "Rate limiting on all endpoints",
                "Input validation with Zod schemas",
              ].map((item, i) => (
                <FeatureChip key={i} icon={ShieldCheck} text={item} />
              ))}
            </div>
          </section>

          {/* --- RESPONSE CODES --- */}
          <section id="responses" className="mb-20 scroll-mt-20">
            <SectionHeader icon={CheckCircle2} title="Response Codes" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                <h5 className="text-sm font-semibold text-white mb-5">HTTP Status Codes</h5>
                <div className="space-y-3">
                  {[
                    { label: "Success", code: "200 OK", color: "text-emerald-400" },
                    { label: "Invalid Data", code: "400", color: "text-red-400" },
                    { label: "Not Found", code: "404", color: "text-red-400" },
                    { label: "Server Error", code: "500", color: "text-red-400" },
                  ].map((r, i) => (
                    <div key={i} className="flex justify-between items-center text-xs border-b border-white/[0.05] pb-3">
                      <span className="text-slate-400">{r.label}</span>
                      <span className={`font-mono font-semibold ${r.color}`}>{r.code}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                <h5 className="text-sm font-semibold text-white mb-5">Platform Compatibility</h5>
                <div className="space-y-3">
                  {["Works on WordPress", "Works on Framer / Webflow", "Works on Wix", "Works on custom sites"].map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 size={13} className="text-violet-400 flex-shrink-0" />
                      <span className="text-xs text-slate-400">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* --- REDIRECT BEHAVIOR --- */}
          <section className="mb-20">
            <SectionHeader icon={ArrowRight} title="Redirect Behavior" />
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
              <p className="text-sm text-slate-400 leading-relaxed">
                After a successful submission, users are automatically redirected to the <code className="text-violet-400 font-mono bg-violet-500/10 px-1.5 py-0.5 rounded">/success</code> page. You can customize the redirect URL in your project settings.
              </p>
            </div>
          </section>

          {/* --- EMAIL THEME PREVIEWS --- */}
          <section id="themes" className="mb-20 scroll-mt-20">
            <SectionHeader icon={Palette} title="Email Theme Previews" />
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              Every submission is delivered as a formatted email. Choose a theme that matches your brand from your dashboard settings.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {Object.values(THEMES).map((theme: any) => (
                <button
                  key={theme.id}
                  onClick={() => { trackEmailThemePreview(theme.id); setActiveThemePreview(theme.id); }}
                  className={`px-4 py-3 rounded-xl text-xs font-semibold transition-all border ${activeThemePreview === theme.id
                    ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-900/30'
                    : 'bg-white/[0.03] border-white/[0.07] text-slate-500 hover:text-white hover:border-white/[0.12]'
                    }`}
                >
                  {theme.name}
                </button>
              ))}
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60"></div>
                <span className="text-[10px] text-slate-600 ml-3 font-mono">email preview</span>
              </div>
              <div className="p-10 flex items-center justify-center min-h-[500px] animate-fade-in" key={activeThemePreview}>
                {(() => {
                  const theme = getTheme(activeThemePreview);
                  return (
                    <div
                      className="max-w-md w-full rounded-2xl p-10 shadow-2xl transition-all duration-300"
                      style={{
                        background: theme.bg,
                        color: theme.text,
                        border: `1px solid ${theme.border}`,
                      }}
                    >
                      <div className="mb-8">
                        <p style={{ color: theme.accent }} className="text-xs font-semibold uppercase tracking-widest mb-2">
                          New Submission
                        </p>
                        <h3 className="text-xl font-bold">Contact Form</h3>
                      </div>
                      <div className="space-y-4">
                        {Object.entries(dummyData).map(([key, val]) => (
                          <div key={key} style={{ borderBottom: `1px solid ${theme.border}`, paddingBottom: "12px" }}>
                            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: theme.muted }}>{key}</p>
                            <p className="text-sm font-medium">{val}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 p-5 rounded-xl text-center" style={{ background: theme.primary === theme.bg ? theme.card : theme.primary, color: '#fff' }}>
                        <p className="text-[9px] font-semibold uppercase tracking-widest mb-1" style={{ color: theme.accent }}>Achaia Labs</p>
                        <p className="text-xs font-bold">Powered by SendMyForm</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </section>

          {/* --- HOW IT WORKS --- */}
          <section id="workflow" className="mb-20 scroll-mt-20">
            <SectionHeader icon={Server} title="How It Works" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { title: "Receive", step: "01", desc: "Your form data arrives at our endpoint. It's validated instantly against expected types and checked for malformed input." },
                { title: "Filter", step: "02", desc: "Spam bots are blocked via honeypot fields. Rate limiting prevents endpoint abuse. Only genuine submissions pass through." },
                { title: "Deliver", step: "03", desc: "The submission is formatted with your chosen email theme and delivered to your inbox. Nothing is stored on our servers." },
              ].map((w, i) => (
                <div key={i} className="p-7 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-violet-500/20 transition-all group">
                  <p className="text-3xl font-bold text-white/8 mb-5 group-hover:text-white/20 transition-all">{w.step}</p>
                  <h4 className="text-base font-semibold text-white mb-3">{w.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{w.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* --- WHY SENDMYFORM --- */}
          <section id="why" className="mb-20 scroll-mt-20">
            <SectionHeader icon={Globe} title="Why SendMyForm?" />

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "Single endpoint replaces an entire backend",
                "Works with any frontend framework or language",
                "No SDK, no lock-in, no configuration files",
                "Supports multipart uploads and dynamic fields",
                "Live in under 60 seconds — zero setup",
                "Built-in email delivery with customizable themes",
              ].map((item, i) => (
                <FeatureChip key={i} text={item} />
              ))}
            </div>
          </section>

        </main>
      </div>

      {/* Footer */}
      <footer className="py-10 px-10 border-t border-white/[0.06] text-center">
        <p className="text-xs text-slate-700">
          © 2026{" "}
          <a href="https://achaialabs.tech" target="_blank" rel="noopener noreferrer" className="hover:text-violet-400 transition-colors">
            Achaia Labs
          </a>. All rights reserved.
        </p>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: var(--scrollbar-track); }
        ::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #6d28d9; }
      `}</style>
    </div>
  );
}

// --- Helper Components ---

function SectionHeader({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="p-2.5 bg-violet-600/10 rounded-xl border border-violet-500/20">
        <Icon size={18} className="text-violet-400" />
      </div>
      <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
    </div>
  );
}

function CodeBlock({ children, lang }: { children: string; lang?: string }) {
  return (
    <div className="rounded-xl bg-[#080810] border border-white/[0.08] overflow-hidden">
      {lang && (
        <div className="px-4 py-2 border-b border-white/[0.06] flex items-center gap-2">
          <span className="text-[10px] text-slate-600 font-mono uppercase">{lang}</span>
        </div>
      )}
      <pre className="p-5 text-sm font-mono text-violet-300 leading-relaxed overflow-x-auto">
        {children}
      </pre>
    </div>
  );
}

function FeatureChip({ text, icon: Icon = CheckCircle2 }: { text: string; icon?: any }) {
  return (
    <div className="flex items-start gap-3 p-5 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-violet-500/20 transition-all">
      <Icon size={14} className="text-violet-400 mt-0.5 flex-shrink-0" />
      <p className="text-xs text-slate-400 leading-relaxed">{text}</p>
    </div>
  );
}