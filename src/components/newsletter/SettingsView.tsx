"use client";

import React, { useState, useEffect } from "react";
import { Save, ShieldCheck, Mail, ShieldAlert, Key, Server, Settings } from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface SettingsViewProps {
  user: any;
}

export default function SettingsView({ user }: SettingsViewProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Settings state
  const [senderType, setSenderType] = useState<"global" | "custom_smtp" | "resend">("global");
  const [resendApiKey, setResendApiKey] = useState("");
  const [defaultSenderName, setDefaultSenderName] = useState("");
  const [defaultSenderEmail, setDefaultSenderEmail] = useState("");
  const [requireDoubleOptIn, setRequireDoubleOptIn] = useState(true);

  // Custom SMTP State
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const s = data.newsletterSettings || {};
          
          setSenderType(s.senderType || "global");
          setResendApiKey(s.resendApiKey || "");
          setDefaultSenderName(s.defaultSenderName || data.displayName || "");
          setDefaultSenderEmail(s.defaultSenderEmail || data.email || "");
          setRequireDoubleOptIn(s.requireDoubleOptIn !== false);

          const smtp = s.smtp || {};
          setSmtpHost(smtp.host || "");
          setSmtpPort(smtp.port || "587");
          setSmtpUser(smtp.user || "");
          setSmtpPass(smtp.pass || "");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load newsletter settings.");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [user.uid]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const settingsPayload = {
        senderType,
        resendApiKey,
        defaultSenderName,
        defaultSenderEmail,
        requireDoubleOptIn,
        smtp: {
          host: smtpHost,
          port: smtpPort,
          user: smtpUser,
          pass: smtpPass
        }
      };

      await updateDoc(doc(db, "users", user.uid), {
        newsletterSettings: settingsPayload
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-60 flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest text-xs italic animate-pulse">
        Fetching Settings Node...
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-black italic uppercase tracking-tight text-white mb-1">Newsletter Settings</h1>
        <p className="text-sm text-slate-400">Configure email delivery protocols, default sender details, and double opt-in settings.</p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-2xl flex items-center gap-2">
          <ShieldCheck size={16} /> settings updated successfully!
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl flex items-center gap-2">
          <ShieldAlert size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Sender Type Selector */}
        <div className="p-6 bg-slate-950/50 border border-white/5 rounded-3xl space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Server size={14} className="text-violet-400" /> Delivery Protocol
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                id: "global",
                title: "Global SMTP Server",
                desc: "Send through SendMyForm's mail server out-of-the-box. Free for testing.",
              },
              {
                id: "custom_smtp",
                title: "Custom SMTP",
                desc: "Configure your own mail server (Amazon SES, Gmail, Mailgun, etc.).",
              },
              {
                id: "resend",
                title: "Resend Engine",
                desc: "Deliver campaigns using Resend API with modern tracking capabilities.",
              }
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSenderType(p.id as any)}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-36 transition-all ${
                  senderType === p.id 
                    ? "border-violet-500 bg-violet-600/10 text-white" 
                    : "border-white/5 bg-slate-900/30 text-slate-400 hover:border-white/10"
                }`}
              >
                <span className="text-xs font-bold text-white uppercase">{p.title}</span>
                <span className="text-[10px] text-slate-400 leading-relaxed mt-2">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom SMTP Configuration */}
        {senderType === "custom_smtp" && (
          <div className="p-6 bg-slate-950/50 border border-white/5 rounded-3xl space-y-4 animate-fade-in">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Server size={14} className="text-violet-400" /> Custom SMTP Host Credentials
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">SMTP Host</label>
                <input
                  type="text"
                  placeholder="e.g. smtp.gmail.com"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  className="form-input text-xs"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">SMTP Port</label>
                <input
                  type="text"
                  placeholder="e.g. 587"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  className="form-input text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">SMTP Username</label>
                <input
                  type="text"
                  placeholder="Username / Email"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  className="form-input text-xs"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">SMTP Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  value={smtpPass}
                  onChange={(e) => setSmtpPass(e.target.value)}
                  className="form-input text-xs"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Resend API Key */}
        {senderType === "resend" && (
          <div className="p-6 bg-slate-950/50 border border-white/5 rounded-3xl space-y-4 animate-fade-in">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Key size={14} className="text-violet-400" /> Resend Integration Credentials
            </h2>
            
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">Resend API Key</label>
              <input
                type="password"
                placeholder="re_..."
                value={resendApiKey}
                onChange={(e) => setResendApiKey(e.target.value)}
                className="form-input text-xs font-mono"
                required
              />
              <p className="text-[9px] text-slate-500 mt-1">Get your API key from resend.com dashboard. Domain verification is required to send from custom emails.</p>
            </div>
          </div>
        )}

        {/* Sender Profile */}
        <div className="p-6 bg-slate-950/50 border border-white/5 rounded-3xl space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Mail size={14} className="text-violet-400" /> Sender Profile
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">Default Sender Name</label>
              <input
                type="text"
                placeholder="e.g. Alex from SendMyForm"
                value={defaultSenderName}
                onChange={(e) => setDefaultSenderName(e.target.value)}
                className="form-input text-xs"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">Default Sender Email</label>
              <input
                type="email"
                placeholder="e.g. alex@yourdomain.com"
                value={defaultSenderEmail}
                onChange={(e) => setDefaultSenderEmail(e.target.value)}
                className="form-input text-xs"
                required
              />
              <p className="text-[9px] text-slate-500 mt-1">If using Resend, this domain must be verified. If using Global SMTP, use your account email address.</p>
            </div>
          </div>
        </div>

        {/* Subscription Preferences */}
        <div className="p-6 bg-slate-950/50 border border-white/5 rounded-3xl space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Settings size={14} className="text-violet-400" /> Global Subscriber Settings
          </h2>
          
          <div className="flex items-center justify-between p-4 bg-slate-900/40 border border-white/5 rounded-2xl">
            <div>
              <h3 className="text-xs font-bold text-white uppercase italic">Double Opt-in Verification</h3>
              <p className="text-[9px] text-slate-500 font-semibold mt-0.5">Send a verification email to new subscribers before activating their subscription status.</p>
            </div>
            <button
              type="button"
              onClick={() => setRequireDoubleOptIn(!requireDoubleOptIn)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${
                requireDoubleOptIn 
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20" 
                  : "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20"
              }`}
            >
              {requireDoubleOptIn ? "Enabled" : "Disabled"}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full btn-primary py-4 font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
        >
          <Save size={15} /> {saving ? "Saving settings..." : "Save Settings"}
        </button>

      </form>
    </div>
  );
}
