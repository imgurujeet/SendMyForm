"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { CheckCircle2, Megaphone, ShieldCheck, ShieldX } from "lucide-react";
import { event } from "@/lib/analytics";
import AdSense from "@/components/AdSense";

export default function SimpleThankYou() {
   const [mounted, setMounted] = useState(false);
   const [adConfig, setAdConfig] = useState<any>(null);

   useEffect(() => {
      setMounted(true);
      event("form_submission_success", { page: "thank_you" });
      
      // Fetch dynamic ad configuration from admin panel
      fetch("/api/admin/config")
         .then(r => r.json())
         .then(data => setAdConfig(data))
         .catch(err => console.error("Failed to load ad config:", err));
   }, []);

   // Helper to extract ad slot from raw HTML string
   const extractSlot = (html: string) => {
      if (!html) return null;
      const match = html.match(/data-ad-slot="(\d+)"/);
      return match ? match[1] : null;
   };

   // Helper to extract ad client from raw HTML string
   const extractClient = (html: string) => {
      if (!html) return null;
      const match = html.match(/data-ad-client="([^"]+)"/);
      return match ? match[1] : "ca-pub-9204160176455905";
   };

   // Helper to check for test mode in raw HTML
   const isTestMode = (html: string) => {
      return html?.includes('data-adtest="on"');
   };

   if (!mounted) return null;

   return (
      <div className="min-h-screen bg-white text-slate-900 font-sans p-6 md:p-12 flex flex-col items-center">

         {/* 1. TOP AD SLOT (Leaderboard) */}
         <div className="w-full max-w-5xl mb-16 min-h-[100px] flex items-center justify-center">
            {adConfig?.topAd ? (
               extractSlot(adConfig.topAd) ? (
                  <AdSense 
                     adSlot={extractSlot(adConfig.topAd)!} 
                     adClient={extractClient(adConfig.topAd)}
                     adTest={isTestMode(adConfig.topAd)} 
                     adFormat="horizontal" 
                  />
               ) : (
                  <div dangerouslySetInnerHTML={{ __html: adConfig.topAd }} className="w-full" />
               )
            ) : (
               <AdSense adSlot="success_top_fallback" adFormat="horizontal" />
            )}
         </div>

         <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center py-20 text-center">

            {/* Success Signal */}
            <div className="mb-12 inline-flex items-center gap-3 px-6 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] italic">
               <ShieldCheck size={14} /> Submission Secured
            </div>

            <h1 className="text-8xl font-black tracking-tightest mb-4 italic leading-none text-slate-950">Thank <span className="text-slate-400">You.</span></h1>
            <p className="text-slate-400 text-xl font-bold uppercase tracking-widest mb-20 italic">Captured <span className="text-slate-900">&</span> Delivered Successfully</p>

            {/* 2. MIDDLE AD SLOT (Native/Square) */}
            <div className="w-full max-w-2xl mb-12 min-h-[250px] flex items-center justify-center">
               {adConfig?.middleAd ? (
                  extractSlot(adConfig.middleAd) ? (
                     <AdSense 
                        adSlot={extractSlot(adConfig.middleAd)!} 
                        adClient={extractClient(adConfig.middleAd)}
                        adTest={isTestMode(adConfig.middleAd)} 
                        adFormat="rectangle" 
                     />
                  ) : (
                     <div dangerouslySetInnerHTML={{ __html: adConfig.middleAd }} className="w-full" />
                  )
               ) : (
                  <AdSense adSlot="success_middle_fallback" adFormat="rectangle" />
               )}
            </div>

            {/* Privacy Badge */}
            <div className="flex items-center gap-3 mt-12 mb-20 px-8 py-3 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest italic">
               <ShieldX size={14} className="text-emerald-500" /> All submission data has been purged from our servers.
            </div>
         </div>

         {/* 3. BOTTOM AD SLOT (Footer Banner) */}
         <div className="w-full max-w-5xl mt-12 min-h-[100px] flex items-center justify-center">
            {adConfig?.bottomAd ? (
               extractSlot(adConfig.bottomAd) ? (
                  <AdSense 
                     adSlot={extractSlot(adConfig.bottomAd)!} 
                     adClient={extractClient(adConfig.bottomAd)}
                     adTest={isTestMode(adConfig.bottomAd)} 
                     adFormat="horizontal" 
                  />
               ) : (
                  <div dangerouslySetInnerHTML={{ __html: adConfig.bottomAd }} className="w-full" />
               )
            ) : (
               <AdSense adSlot="success_bottom_fallback" adFormat="horizontal" />
            )}
         </div>


         <div className="mt-32 text-center pb-20 border-t border-slate-50 pt-20 w-full flex flex-col items-center gap-6">
            <p className="text-[11px] font-black text-slate-200 uppercase tracking-[0.8em] italic">SendMyForm Global Protocol v2.0</p>
            <div className="flex gap-12 font-black text-[10px] uppercase tracking-widest text-slate-400 italic">
               <Link href="/" className="hover:text-slate-950 transition-colors">Portal</Link>
               <Link href="/docs" className="hover:text-slate-950 transition-colors">API Docs</Link>
               <span className="text-slate-200 opacity-30">Achaia Labs Node</span>
            </div>
         </div>

         <style jsx global>{`
        .tracking-tightest { letter-spacing: -0.09em; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #fff; }
        ::-webkit-scrollbar-thumb { background: #eee; border-radius: 99px; }
      `}</style>
      </div>
   );
}
