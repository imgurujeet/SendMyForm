"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight, Sparkles } from "lucide-react";

function VerifiedContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const error = searchParams.get("error");

  const isSuccess = !error && email;

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 selection:bg-rose-500/30 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-orange-600/5 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md bg-slate-950/80 backdrop-blur-md border border-white/5 rounded-[40px] p-10 text-center shadow-2xl relative overflow-hidden">
        {/* Decorative glass bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 via-orange-500 to-rose-600"></div>

        {isSuccess ? (
          <div className="space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-rose-950/20">
              <CheckCircle2 size={38} className="text-rose-500" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 inline-flex items-center gap-1">
                <Sparkles size={10} fill="currentColor" /> Verified
              </span>
              <h1 className="text-3xl font-black tracking-tighter italic uppercase text-white">Welcome Aboard!</h1>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                Your email subscription has been confirmed successfully. You are now in the loop for product announcements.
              </p>
            </div>

            <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl font-mono text-xs text-rose-400 select-all">
              {email}
            </div>

            <div className="pt-4">
              <Link
                href="/"
                className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-rose-950/30"
              >
                Go to Homepage <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-rose-950/20">
              <XCircle size={38} className="text-rose-500" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 inline-flex items-center gap-1">
                Verification Failed
              </span>
              <h1 className="text-3xl font-black tracking-tighter italic uppercase text-white">Invalid Link</h1>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                {error === "invalid_token" && "The verification token provided is invalid or has expired."}
                {error === "subscriber_not_found" && "No pending subscription request was found for this email."}
                {error === "invalid_params" && "The request details are incomplete."}
                {!error && "Something went wrong. The subscription could not be confirmed."}
              </p>
            </div>

            <div className="pt-4">
              <Link
                href="/"
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-white/5 flex items-center justify-center gap-2"
              >
                Return Home
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}

export default function VerifiedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617] text-white flex items-center justify-center font-bold tracking-tighter italic">CONNECTING NETWORK NODE...</div>}>
      <VerifiedContent />
    </Suspense>
  );
}
