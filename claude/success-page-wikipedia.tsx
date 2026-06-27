"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Coffee, Heart, Shield, Zap, Users, Globe, Code2,
         ChevronRight, X, Check, ArrowRight } from "lucide-react";
import AdSense from "@/components/AdSense";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const KOFI_URL = "https://ko-fi.com/achaialabs"; // ← your Ko-fi URL
// ─────────────────────────────────────────────────────────────────────────────

/** Thin progress bar at the very top — mimics Wikipedia's donation banner */
function DonationProgressBar({ percent = 34 }: { percent?: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(percent), 400);
    return () => clearTimeout(t);
  }, [percent]);

  return (
    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-[1800ms] ease-out"
        style={{
          width: `${width}%`,
          background: "linear-gradient(90deg, #FF5E5B 0%, #ff8a65 100%)",
        }}
      />
    </div>
  );
}

/** Animated counter — counts up from 0 to target */
function CountUp({ to, duration = 1600 }: { to: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * to));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [to, duration]);

  return <>{value.toLocaleString()}</>;
}

/** Ko-fi donation widget — the core CTA */
function DonationWidget() {
  const [supported, setSupported] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleSupport = () => {
    setSupported(true);
    window.open(KOFI_URL, "_blank", "noopener,noreferrer");
  };

  if (supported) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-4">
          <Check size={28} className="text-emerald-500" />
        </div>
        <p className="font-bold text-slate-800 text-lg mb-1">Thank you so much ☕</p>
        <p className="text-sm text-slate-500">Ko-fi opened in a new tab. You're amazing.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Amount buttons (visual only — Ko-fi handles actual amount) */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "☕ $3", sub: "One coffee" },
          { label: "☕☕ $9", sub: "Three coffees" },
          { label: "🫶 $27", sub: "Monthly" },
        ].map((opt) => (
          <button
            key={opt.label}
            onClick={handleSupport}
            className="flex flex-col items-center py-3 px-2 rounded-xl border-2 border-slate-200
              hover:border-[#FF5E5B] hover:bg-[#FF5E5B]/5 transition-all text-center group"
          >
            <span className="font-bold text-slate-800 text-sm group-hover:text-[#FF5E5B]">{opt.label}</span>
            <span className="text-[10px] text-slate-400 mt-0.5">{opt.sub}</span>
          </button>
        ))}
      </div>

      {/* Primary CTA */}
      <button
        onClick={handleSupport}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-base
          text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: "#FF5E5B",
          boxShadow: "0 8px 28px rgba(255,94,91,0.35)",
        }}
      >
        <Coffee
          size={18}
          className={`transition-transform duration-300 ${hovered ? "rotate-12" : ""}`}
        />
        Support SendMyForm on Ko-fi
        <Heart size={14} className="fill-white/60 text-white/60" />
      </button>

      <p className="text-center text-[11px] text-slate-400">
        One-time or monthly · No Ko-fi account needed · Completely optional
      </p>
    </div>
  );
}

/** Floating Wikipedia-style appeal banner — fixed at bottom on mobile, side on desktop */
function AppealBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Delay so it doesn't immediately compete with the main content
    const t = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(t);
  }, []);

  if (dismissed || !visible) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full shadow-2xl rounded-2xl overflow-hidden"
      style={{
        background: "#fff",
        border: "2px solid #FF5E5B",
        transform: visible ? "translateY(0)" : "translateY(120%)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease",
      }}
    >
      {/* Red accent top strip */}
      <div className="h-1.5 w-full" style={{ background: "#FF5E5B" }} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <p className="text-sm font-black text-slate-800 leading-tight">
            To our readers who use SendMyForm for free —
          </p>
          <button
            onClick={() => setDismissed(true)}
            className="flex-shrink-0 p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X size={14} className="text-slate-400" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          We process form submissions for thousands of developers at no charge.
          Our team is small. If this tool helped you today, please consider
          buying us a coffee — it takes 30 seconds.
        </p>

        <div className="flex gap-3">
          <a
            href={KOFI_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setDismissed(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
              font-bold text-sm text-white transition-all hover:opacity-90"
            style={{ background: "#FF5E5B" }}
          >
            <Coffee size={14} />
            Support us
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-slate-500
              border border-slate-200 hover:bg-slate-50 transition-all"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

/** Main success page */
export default function SuccessPage() {
  const [mounted, setMounted] = useState(false);
  const [adConfig, setAdConfig] = useState<any>(null);
  const [readMoreOpen, setReadMoreOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/admin/config")
      .then((r) => r.json())
      .then((d) => setAdConfig(d))
      .catch(() => {});
  }, []);

  const extractSlot = (html: string) => html?.match(/data-ad-slot="(\d+)"/)?.[1];
  const extractClient = (html: string) =>
    html?.match(/data-ad-client="([^"]+)"/)?.[1] ?? "ca-pub-9204160176455905";
  const isTestMode = (html: string) => html?.includes('data-adtest="on"');

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white font-serif text-slate-900">

      {/* ── TOP AD (Leaderboard) ──────────────────────────────────────────── */}
      <div className="w-full flex items-center justify-center py-3 border-b border-slate-100 bg-slate-50 min-h-[90px]">
        {adConfig?.topAd && extractSlot(adConfig.topAd) ? (
          <AdSense adSlot={extractSlot(adConfig.topAd)!} adClient={extractClient(adConfig.topAd)} adTest={isTestMode(adConfig.topAd)} adFormat="horizontal" />
        ) : (
          <AdSense adSlot="success_top_fallback" adFormat="horizontal" />
        )}
      </div>

      {/* ── WIKIPEDIA-STYLE HEADER BAR ────────────────────────────────────── */}
      <div className="border-b border-slate-200 px-4 py-2">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* SendMyForm wordmark in wiki style */}
            <span className="font-sans font-black text-sm tracking-tight">
              Send<span className="text-[#FF5E5B]">My</span>Form
            </span>
            <span className="text-slate-300 text-xs">|</span>
            <span className="text-xs text-slate-500 font-sans">Free Form Backend for Developers</span>
          </div>
          <nav className="hidden md:flex items-center gap-4 text-xs font-sans text-slate-500">
            <Link href="/" className="hover:text-slate-800 transition-colors">Home</Link>
            <Link href="/docs" className="hover:text-slate-800 transition-colors">Docs</Link>
            <Link href="/dashboard" className="hover:text-slate-800 transition-colors">Dashboard</Link>
            <a href={KOFI_URL} target="_blank" rel="noopener noreferrer"
              className="text-[#FF5E5B] font-bold hover:underline">
              ☕ Donate
            </a>
          </nav>
        </div>
      </div>

      {/* ── WIKIPEDIA-STYLE DONATION APPEAL BANNER ───────────────────────── */}
      <div className="border-b border-[#FF5E5B]/30 bg-gradient-to-r from-[#FF5E5B]/5 via-white to-orange-50/30">
        <div className="max-w-5xl mx-auto px-4 py-5 md:py-6">

          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">

            {/* Left: the appeal copy (Wikipedia-style personal, earnest, direct) */}
            <div className="flex-1">
              {/* Personal appeal header */}
              <div className="flex items-center gap-3 mb-4">
                {/* Founder avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-[#FF5E5B] flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-white font-black text-sm">A</span>
                </div>
                <div>
                  <p className="font-sans font-black text-slate-800 text-sm leading-tight">
                    A personal appeal from the founder of SendMyForm
                  </p>
                  <p className="font-sans text-[11px] text-slate-500">Achaia Labs · Built for developers, by developers</p>
                </div>
              </div>

              <div className="font-sans text-sm text-slate-700 leading-relaxed space-y-3">
                <p className="font-bold text-base text-slate-800">
                  Your form was delivered. Now we need a moment of your time.
                </p>

                <p>
                  SendMyForm processes form submissions for thousands of developers
                  completely free of charge — no plans, no submission limits, no credit
                  card required. We believe backend infrastructure for indie developers
                  and small teams should not cost money.
                </p>

                <p>
                  But servers cost money. Development time costs money. And unlike
                  Wikipedia, we don't have a foundation behind us. We're a small
                  team at Achaia Labs running this because we believe it's the right
                  thing to build.
                </p>

                {readMoreOpen && (
                  <div className="space-y-3">
                    <p>
                      If every developer who used SendMyForm this month bought us
                      one coffee, we could cover our infrastructure costs for the
                      entire year — and keep the service free, forever, for everyone.
                    </p>
                    <p>
                      We estimate that only about <strong>2 in every 100 users</strong> who
                      benefit from a free service take a moment to support it. If
                      you're reading this, we hope you'll be one of them today.
                    </p>
                    <p>
                      Thank you — genuinely. Whether you donate or not, your form
                      was delivered, and we're glad we could help.
                    </p>
                    <p className="text-xs text-slate-400 italic">
                      — The Achaia Labs team
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setReadMoreOpen(!readMoreOpen)}
                  className="text-[#FF5E5B] text-xs font-bold hover:underline inline-flex items-center gap-1"
                >
                  {readMoreOpen ? "Show less" : "Read more"}
                  <ChevronRight
                    size={12}
                    className={`transition-transform ${readMoreOpen ? "rotate-90" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* Right: donation widget */}
            <div className="w-full md:w-80 flex-shrink-0">
              <div className="rounded-2xl border-2 border-slate-100 p-6 shadow-sm">
                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-sans font-bold text-slate-600 uppercase tracking-wider">
                      This month's goal
                    </span>
                    <span className="text-xs font-sans font-black text-[#FF5E5B]">34%</span>
                  </div>
                  <DonationProgressBar percent={34} />
                  <p className="text-[11px] font-sans text-slate-400 mt-1.5">
                    $<CountUp to={178} /> of $520 server costs covered
                  </p>
                </div>

                <DonationWidget />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

          {/* ── Main column (2/3 width) ── */}
          <div className="md:col-span-2">

            {/* Success headline — Wikipedia article title style */}
            <div className="mb-6 pb-4 border-b border-slate-200">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                Form Submission · Confirmed
              </p>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight mb-2">
                Your message was delivered successfully.
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-sans text-[11px] font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Delivered · No data retained
                </span>
                <span className="font-sans text-[11px] text-slate-400">
                  Processed via SendMyForm by Achaia Labs
                </span>
              </div>
            </div>

            {/* Wikipedia-style info box (infobox) — right-floated on desktop */}
            <div className="float-right ml-6 mb-6 w-64 hidden md:block rounded-xl border-2 border-slate-200 overflow-hidden text-sm font-sans">
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
                <p className="font-black text-slate-700 text-xs uppercase tracking-wider">Submission info</p>
              </div>
              <table className="w-full">
                <tbody>
                  {[
                    ["Status", "✅ Delivered"],
                    ["Data stored", "❌ None"],
                    ["Spam filtered", "✅ Yes"],
                    ["Encryption", "✅ TLS/HTTPS"],
                    ["Cost to you", "🆓 Free"],
                    ["Powered by", "SendMyForm"],
                  ].map(([k, v]) => (
                    <tr key={k} className="border-b border-slate-100">
                      <td className="px-3 py-2 text-[11px] font-bold text-slate-500 whitespace-nowrap">{k}</td>
                      <td className="px-3 py-2 text-[11px] text-slate-700">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Article body — Wikipedia-style paragraphs */}
            <div className="text-sm text-slate-700 leading-relaxed space-y-4 mb-8">
              <p>
                <strong>SendMyForm</strong> is a free form backend service built by{" "}
                <a href="#" className="text-blue-600 hover:underline">Achaia Labs</a> that
                handles HTML form submissions for static websites and Jamstack applications
                without requiring any backend code. Your submission has been processed,
                validated, spam-filtered, and delivered to the form owner's inbox.
              </p>

              <p>
                Unlike traditional form services, SendMyForm does not store submission
                data on its servers after delivery. All form data is transmitted securely
                over HTTPS and permanently deleted after the notification email is sent.
                This design means your privacy — and the privacy of anyone who submits
                a form on a site powered by SendMyForm — is protected by default.
              </p>

              {/* Contents box — Wikipedia style */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 font-sans text-xs w-fit">
                <p className="font-bold text-slate-700 mb-2">Contents</p>
                <ol className="list-decimal list-inside space-y-1 text-blue-600">
                  <li><a href="#how-it-works" className="hover:underline">How SendMyForm works</a></li>
                  <li><a href="#privacy" className="hover:underline">Privacy & data handling</a></li>
                  <li><a href="#free-forever" className="hover:underline">Why it's free</a></li>
                  <li><a href="#support" className="hover:underline">How to support the project</a></li>
                </ol>
              </div>

              <h2 id="how-it-works" className="text-lg font-black text-slate-800 mt-6 mb-2 pb-1 border-b border-slate-200 font-sans">
                1. How SendMyForm works
              </h2>
              <p>
                When a user submits a form on a website that uses SendMyForm, the submission
                is sent via HTTP POST to a unique project endpoint. SendMyForm validates the
                fields, runs spam detection (honeypot fields + header analysis), and
                immediately forwards the data as a formatted email to the form owner. The
                entire process takes under 200ms.
              </p>
              <p>
                Developers integrate SendMyForm in minutes with a single{" "}
                <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-700">action</code>{" "}
                attribute change on their HTML form. No API keys in client code, no
                Node.js server, no PHP, no serverless functions.
              </p>

              <h2 id="privacy" className="text-lg font-black text-slate-800 mt-6 mb-2 pb-1 border-b border-slate-200 font-sans">
                2. Privacy & data handling
              </h2>
              <p>
                SendMyForm operates on a <strong>zero-persistence model</strong>. Submission
                data is held in memory only for the duration of the email delivery process
                — typically under one second. No database writes occur. No submission
                content is logged. IP addresses are not retained beyond the request lifecycle.
              </p>

              <h2 id="free-forever" className="text-lg font-black text-slate-800 mt-6 mb-2 pb-1 border-b border-slate-200 font-sans">
                3. Why it's free
              </h2>
              <p>
                SendMyForm is free because we believe that basic backend infrastructure
                should be accessible to every developer — including students, hobbyists,
                indie makers, and nonprofits who can't justify a monthly SaaS subscription
                for a contact form. We sustain the project through voluntary community
                support via Ko-fi and unobtrusive advertising on public pages.
              </p>

              <h2 id="support" className="text-lg font-black text-slate-800 mt-6 mb-2 pb-1 border-b border-slate-200 font-sans">
                4. How to support the project
              </h2>
              <p>
                If SendMyForm has saved you time, consider supporting the project on Ko-fi.
                A one-time coffee donation ($3–$9) or a small monthly contribution directly
                funds server costs, development time, and keeps the service free for everyone.
                You can also help by sharing SendMyForm with other developers who might find
                it useful.
              </p>

              {/* Inline Ko-fi CTA mid-article — Wikipedia style appeal */}
              <div className="my-6 p-5 rounded-xl border-l-4 border-[#FF5E5B] bg-[#FF5E5B]/5 font-sans">
                <p className="text-sm font-bold text-slate-800 mb-2">
                  ☕ This tool is free. Keeping it free isn't.
                </p>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  We rely on supporters like you. If this saved you hours of backend work,
                  please consider a small donation on Ko-fi. It takes 30 seconds.
                </p>
                <a
                  href={KOFI_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
                  style={{ background: "#FF5E5B" }}
                >
                  <Coffee size={14} />
                  Support on Ko-fi
                  <ArrowRight size={12} />
                </a>
              </div>
            </div>

            {/* Navigation footer — Wikipedia style */}
            <div className="border-t border-slate-200 pt-6 flex items-center justify-between font-sans text-xs text-slate-500">
              <Link href="/" className="text-blue-600 hover:underline flex items-center gap-1">
                ← Back to SendMyForm
              </Link>
              <Link href="/docs" className="text-blue-600 hover:underline">
                Documentation →
              </Link>
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <div className="space-y-6">

            {/* Stats box */}
            <div className="rounded-xl border border-slate-200 overflow-hidden font-sans text-sm">
              <div className="bg-slate-800 px-4 py-3">
                <p className="font-black text-white text-xs uppercase tracking-wider">By the numbers</p>
              </div>
              <div className="divide-y divide-slate-100">
                {[
                  { icon: Users, label: "Developers using SendMyForm", val: "10,000+", color: "text-violet-600" },
                  { icon: Globe, label: "Countries reached", val: "80+", color: "text-blue-600" },
                  { icon: Shield, label: "Data stored per submission", val: "Zero", color: "text-emerald-600" },
                  { icon: Zap, label: "Avg. delivery time", val: "< 200ms", color: "text-amber-600" },
                  { icon: Code2, label: "Lines of your code needed", val: "0", color: "text-rose-600" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-3 px-4 py-3">
                    <s.icon size={14} className={s.color} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-slate-500 leading-tight">{s.label}</p>
                    </div>
                    <p className={`text-sm font-black whitespace-nowrap ${s.color}`}>{s.val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Compact donation box for sidebar */}
            <div className="rounded-xl border-2 border-[#FF5E5B]/30 overflow-hidden font-sans">
              <div className="px-4 py-3" style={{ background: "#FF5E5B" }}>
                <p className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-2">
                  <Heart size={12} className="fill-white" />
                  Support this project
                </p>
              </div>
              <div className="p-4 bg-white space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  SendMyForm is free for everyone. Your support keeps it that way.
                </p>
                <DonationProgressBar percent={34} />
                <p className="text-[10px] text-slate-400">34% of monthly costs covered this month</p>
                <a
                  href={KOFI_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
                    font-bold text-sm text-white transition-all hover:opacity-90"
                  style={{ background: "#FF5E5B" }}
                >
                  <Coffee size={14} />
                  Buy us a coffee
                </a>
                <p className="text-center text-[10px] text-slate-400">
                  via Ko-fi · Takes 30 seconds
                </p>
              </div>
            </div>

            {/* BOTTOM AD — sidebar */}
            <div className="min-h-[250px] flex items-center justify-center">
              {adConfig?.bottomAd && extractSlot(adConfig.bottomAd) ? (
                <AdSense adSlot={extractSlot(adConfig.bottomAd)!} adClient={extractClient(adConfig.bottomAd)} adTest={isTestMode(adConfig.bottomAd)} adFormat="rectangle" />
              ) : (
                <AdSense adSlot="success_sidebar_fallback" adFormat="rectangle" />
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── BOTTOM AD (Leaderboard) ───────────────────────────────────────── */}
      <div className="border-t border-slate-100 bg-slate-50">
        <div className="w-full flex items-center justify-center py-4 min-h-[90px]">
          {adConfig?.bottomAd && extractSlot(adConfig.bottomAd) ? (
            <AdSense adSlot={extractSlot(adConfig.bottomAd)!} adClient={extractClient(adConfig.bottomAd)} adTest={isTestMode(adConfig.bottomAd)} adFormat="horizontal" />
          ) : (
            <AdSense adSlot="success_bottom_fallback" adFormat="horizontal" />
          )}
        </div>
      </div>

      {/* ── WIKIPEDIA FOOTER ─────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-slate-50 font-sans">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="font-black text-slate-700 text-sm">
                Send<span className="text-[#FF5E5B]">My</span>Form
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                A free service by Achaia Labs · Zero data retained · Always free
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-slate-500 justify-center">
              <Link href="/" className="hover:text-slate-800 hover:underline">Home</Link>
              <Link href="/docs" className="hover:text-slate-800 hover:underline">Docs</Link>
              <Link href="/dashboard" className="hover:text-slate-800 hover:underline">Dashboard</Link>
              <Link href="/integrations" className="hover:text-slate-800 hover:underline">Integrations</Link>
              <a href={KOFI_URL} target="_blank" rel="noopener noreferrer"
                className="text-[#FF5E5B] font-bold hover:underline flex items-center gap-1">
                <Coffee size={11} /> Support us
              </a>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
            © 2026 Achaia Labs · SendMyForm is provided free of charge · No submission data is stored
          </div>
        </div>
      </footer>

      {/* ── FLOATING APPEAL BANNER (appears after 2.5s) ───────────────────── */}
      <AppealBanner />
    </div>
  );
}
