"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle2, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setMsg("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, source: "dedicated-page" }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setMsg(data.message);
      } else {
        setMsg(data.error || "Subscription request failed.");
      }
    } catch (err) {
      setMsg("Connection error. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 selection:bg-rose-500/30 relative overflow-hidden">
      {/* Visual background lights */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-rose-600/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-orange-600/5 rounded-full blur-3xl -z-10"></div>

      {/* Back to home */}
      <div className="absolute top-8 left-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest italic"
        >
          <ArrowLeft size={16} /> Return to Homepage
        </Link>
      </div>

      <div className="w-full max-w-lg bg-slate-950/80 backdrop-blur-md border border-white/5 rounded-[48px] p-12 shadow-2xl relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 via-orange-500 to-rose-600"></div>

        {success ? (
          <div className="space-y-6 text-center animate-fade-in">
            <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-rose-950/20">
              <CheckCircle2 size={38} className="text-rose-500 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black uppercase italic text-white tracking-tighter">Check Your Inbox!</h1>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                {msg || "We've sent a verification link to confirm your subscription request."}
              </p>
            </div>
            <div className="pt-4">
              <Link
                href="/"
                className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                Return Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={24} className="text-rose-500" />
              </div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter">Developer updates</h1>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed mt-2">
                Join our newsletter to get product updates, launch release notes, security advisories, and weekly tips.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Preferred Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alexis Dev"
                  className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-xs outline-none text-slate-100 font-bold placeholder-slate-600 focus:border-rose-500/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@example.com"
                  className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-xs outline-none text-slate-100 font-bold placeholder-slate-600 focus:border-rose-500/30"
                  required
                />
              </div>

              {msg && (
                <p className="text-[10px] text-rose-500 font-black uppercase italic text-center animate-pulse">{msg}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-rose-950/30 mt-6"
              >
                {submitting ? "Joining list..." : "Join developer list"} <ArrowRight size={14} />
              </button>
            </form>

            <div className="pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-slate-500">
              <ShieldCheck size={14} className="text-rose-500" />
              <span className="text-[9px] font-black uppercase tracking-widest italic">Double Opt-In Protected</span>
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
