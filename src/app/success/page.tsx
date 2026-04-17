"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { CheckCircle2, Megaphone, Terminal, Zap, ShieldCheck, Globe, ShieldX } from "lucide-react";
import { event } from "@/lib/analytics";

export default function SimpleThankYou() {
   const [ad, setAd] = useState<any>({
      topAd: "",
      middleAd: "",
      bottomAd: "",
      sideAd: ""
   });
   const [mounted, setMounted] = useState(false);
   const containerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      setMounted(true);
      event("form_submission_success", { page: "thank_you" });
      fetch("/api/admin/config")
         .then(r => r.json())
         .then(data => {
            setAd(data);
            // Activate AdSense units after DOM injection
            setTimeout(() => {
               try {
                  const adSlots = containerRef.current?.querySelectorAll("ins.adsbygoogle");
                  adSlots?.forEach((slot) => {
                     if (!slot.getAttribute("data-ad-status")) {
                        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
                        (window as any).adsbygoogle.push({});
                     }
                  });
               } catch (e) {
                  console.warn("AdSense activation skipped:", e);
               }
            }, 1000);
         });
   }, []);

   if (!mounted) return null;

   return (
      <div ref={containerRef} className="min-h-screen bg-white text-slate-900 font-sans p-6 md:p-12 flex flex-col items-center">

         {/* 1. TOP AD SLOT (Leaderboard) */}
         <div className={`w-full max-w-5xl min-h-[100px] bg-slate-50 border border-slate-100 rounded-[2rem] mb-16 overflow-hidden ${ad.topAd ? 'block' : 'flex items-center justify-center'}`}>
            {ad.topAd ? (
               <div dangerouslySetInnerHTML={{ __html: ad.topAd }} className="w-full h-full block" />
            ) : (
               <div className="text-center p-8">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic mb-2">Slot_01 [Leaderboard]</p>
                  <p className="text-[9px] text-slate-200 font-bold uppercase italic">Awaiting Global AdSense Node</p>
               </div>
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
            <div className={`w-full max-w-2xl min-h-[400px] bg-slate-50 border border-slate-100 rounded-[3rem] mb-12 overflow-hidden shadow-2xl relative group ${ad.middleAd ? 'block' : 'flex items-center justify-center'}`}>
               <div className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-100/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
               {ad.middleAd ? (
                  <div dangerouslySetInnerHTML={{ __html: ad.middleAd }} className="w-full h-full block relative z-10" />
               ) : (
                  <div className="text-center p-12">
                     <Megaphone size={32} className="mx-auto text-slate-100 mb-6" />
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] italic">Slot_02 [Native_Ingress]</p>
                  </div>
               )}
            </div>

            {/* Privacy Badge */}
            <div className="flex items-center gap-3 mt-12 mb-20 px-8 py-3 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest italic">
               <ShieldX size={14} className="text-emerald-500" /> All submission data has been purged from our servers.
            </div>
         </div>

         {/* 3. BOTTOM AD SLOT (Footer Banner) */}
         <div className={`w-full max-w-5xl min-h-[150px] bg-slate-50 border border-slate-100 rounded-[2rem] mt-12 overflow-hidden ${ad.bottomAd ? 'block' : 'flex items-center justify-center'}`}>
            {ad.bottomAd ? (
               <div dangerouslySetInnerHTML={{ __html: ad.bottomAd }} className="w-full h-full block" />
            ) : (
               <div className="text-center p-8">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic mb-2">Slot_03 [Footer_Node]</p>
               </div>
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
