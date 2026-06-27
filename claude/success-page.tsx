"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, ShieldX } from "lucide-react";
import { event } from "@/lib/analytics";
import AdSense from "@/components/AdSense";
import KoFiWidget from "@/components/KoFiWidget";

/**
 * Success / Thank-You page
 *
 * Layout (top to bottom):
 *  1. Top AdSense leaderboard      ← ad revenue
 *  2. "Thank You" hero
 *  3. Ko-fi banner                 ← donation (replaces middle ad — better ROI here)
 *  4. Privacy badge
 *  5. Bottom AdSense leaderboard   ← ad revenue
 *  6. Footer links
 */
export default function SuccessPage() {
  const [mounted, setMounted] = useState(false);
  const [adConfig, setAdConfig] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    event("form_submission_success", { page: "thank_you" });
    fetch("/api/admin/config")
      .then((r) => r.json())
      .then((data) => setAdConfig(data))
      .catch((err) => console.error("Failed to load ad config:", err));
  }, []);

  const extractSlot = (html: string) => html?.match(/data-ad-slot="(\d+)"/)?.[1];
  const extractClient = (html: string) =>
    html?.match(/data-ad-client="([^"]+)"/)?.[1] ?? "ca-pub-9204160176455905";
  const isTestMode = (html: string) => html?.includes('data-adtest="on"');

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans p-6 md:p-12 flex flex-col items-center">

      {/* 1. TOP AD */}
      <div className="w-full max-w-5xl mb-16 min-h-[100px] flex items-center justify-center">
        {adConfig?.topAd && extractSlot(adConfig.topAd) ? (
          <AdSense adSlot={extractSlot(adConfig.topAd)!} adClient={extractClient(adConfig.topAd)} adTest={isTestMode(adConfig.topAd)} adFormat="horizontal" />
        ) : adConfig?.topAd ? (
          <div dangerouslySetInnerHTML={{ __html: adConfig.topAd }} className="w-full" />
        ) : (
          <AdSense adSlot="success_top_fallback" adFormat="horizontal" />
        )}
      </div>

      {/* 2. HERO */}
      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-12 inline-flex items-center gap-3 px-6 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] italic">
          <ShieldCheck size={14} /> Submission Secured
        </div>

        <h1 className="text-8xl font-black tracking-tightest mb-4 italic leading-none text-slate-950">
          Thank <span className="text-slate-400">You.</span>
        </h1>
        <p className="text-slate-400 text-xl font-bold uppercase tracking-widest mb-16 italic">
          Captured <span className="text-slate-900">&</span> Delivered Successfully
        </p>

        {/* 3. KO-FI BANNER — best placement: user just got value, peak goodwill */}
        <div className="w-full max-w-2xl mb-12">
          <KoFiWidget variant="banner" />
        </div>

        {/* 4. PRIVACY BADGE */}
        <div className="flex items-center gap-3 mt-4 mb-20 px-8 py-3 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest italic">
          <ShieldX size={14} className="text-emerald-500" />
          All submission data has been purged from our servers.
        </div>
      </div>

      {/* 5. BOTTOM AD */}
      <div className="w-full max-w-5xl mt-12 min-h-[100px] flex items-center justify-center">
        {adConfig?.bottomAd && extractSlot(adConfig.bottomAd) ? (
          <AdSense adSlot={extractSlot(adConfig.bottomAd)!} adClient={extractClient(adConfig.bottomAd)} adTest={isTestMode(adConfig.bottomAd)} adFormat="horizontal" />
        ) : adConfig?.bottomAd ? (
          <div dangerouslySetInnerHTML={{ __html: adConfig.bottomAd }} className="w-full" />
        ) : (
          <AdSense adSlot="success_bottom_fallback" adFormat="horizontal" />
        )}
      </div>

      {/* 6. FOOTER */}
      <div className="mt-32 text-center pb-20 border-t border-slate-50 pt-20 w-full flex flex-col items-center gap-6">
        <p className="text-[11px] font-black text-slate-200 uppercase tracking-[0.8em] italic">
          SendMyForm Global Protocol v2.0
        </p>
        <div className="flex gap-12 font-black text-[10px] uppercase tracking-widest text-slate-400 italic">
          <Link href="/" className="hover:text-slate-950 transition-colors">Portal</Link>
          <Link href="/docs" className="hover:text-slate-950 transition-colors">API Docs</Link>
          <span className="text-slate-200 opacity-30">Achaia Labs Node</span>
        </div>
      </div>

      <style jsx global>{`
        .tracking-tightest { letter-spacing: -0.09em; }
      `}</style>
    </div>
  );
}
