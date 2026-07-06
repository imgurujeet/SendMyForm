"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Settings, Save, AlertCircle, CheckCircle, MailWarning } from "lucide-react";
import { cn } from "@/lib/utils";

function PreferencesContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  const directUnsubscribe = searchParams.get("unsubscribe") === "true";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const [subscriber, setSubscriber] = useState<any>(null);
  const [status, setStatus] = useState("subscribed");
  const [frequency, setFrequency] = useState("instant");
  const [preferences, setPreferences] = useState({
    productUpdates: true,
    featureReleases: true,
    weeklyDigest: true,
    monthlyDigest: true,
    maintenanceNotifications: true,
    securityAlerts: true,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!email || !token) {
      setError("Invalid or incomplete preferences access link.");
      setLoading(false);
      return;
    }

    const loadPreferences = async () => {
      try {
        const res = await fetch(`/api/newsletter/preferences?email=${encodeURIComponent(email)}&token=${token}`);
        const data = await res.json();
        
        if (data.success) {
          setSubscriber(data.subscriber);
          setStatus(data.subscriber.status);
          setFrequency(data.subscriber.frequency || "instant");
          setPreferences(data.subscriber.preferences || {
            productUpdates: true,
            featureReleases: true,
            weeklyDigest: true,
            monthlyDigest: true,
            maintenanceNotifications: true,
            securityAlerts: true,
          });

          // Check if direct unsubscribe was requested via link
          if (directUnsubscribe && data.subscriber.status === "subscribed") {
            handleDirectUnsubscribe();
          }
        } else {
          setError(data.error || "Failed to load subscription preferences.");
        }
      } catch (err) {
        setError("Network error loading preferences.");
      }
      setLoading(false);
    };

    loadPreferences();
  }, [email, token]);

  const handleDirectUnsubscribe = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/newsletter/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token,
          status: "unsubscribed",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("unsubscribed");
        setSuccessMsg("You have successfully unsubscribed from all our newsletter updates.");
      }
    } catch (err) {
      setError("Failed to unsubscribe automatically.");
    }
    setSaving(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/newsletter/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token,
          status,
          preferences,
          frequency,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Your email preferences have been successfully updated!");
      } else {
        setError(data.error || "Failed to update preferences.");
      }
    } catch (err) {
      setError("Network error updating preferences.");
    }
    setSaving(false);
  };

  const togglePref = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center font-bold tracking-tighter italic">
        FETCHING EMAIL PREFERENCES NODE...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 selection:bg-rose-500/30 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-rose-600/5 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-lg bg-slate-950/80 backdrop-blur-md border border-white/5 rounded-[40px] p-10 shadow-2xl relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 via-orange-500 to-rose-600"></div>

        {error ? (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={28} className="text-rose-500" />
            </div>
            <h1 className="text-2xl font-black uppercase italic">Access Denied</h1>
            <p className="text-xs text-slate-400 font-semibold">{error}</p>
          </div>
        ) : (
          <div className="space-y-8 text-left">
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings size={28} className="text-rose-500 animate-spin-slow" />
              </div>
              <h1 className="text-3xl font-black uppercase italic">Email settings</h1>
              <p className="text-[10px] font-mono text-rose-400 mt-1 select-all">{email}</p>
            </div>

            {successMsg && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3">
                <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-400 font-bold uppercase italic leading-relaxed">{successMsg}</p>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              {/* Subscription Status Toggle */}
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase text-white italic">Active Subscription</h4>
                  <p className="text-[9px] text-slate-500 font-semibold mt-0.5">Subscribe or temporarily pause announcements</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStatus(status === "subscribed" ? "unsubscribed" : "subscribed")}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors border",
                    status === "subscribed"
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
                      : "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20"
                  )}
                >
                  {status === "subscribed" ? "Subscribed" : "Unsubscribed"}
                </button>
              </div>

              {status === "subscribed" && (
                <>
                  {/* Category Options */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Announcements Segmentation</h3>
                    <div className="grid grid-cols-1 gap-2.5">
                      {[
                        { key: "productUpdates", title: "Product Updates", desc: "Release logs, system changes, core version updates" },
                        { key: "featureReleases", title: "New Features", desc: "Detailed breakdowns of newly added platform tooling" },
                        { key: "weeklyDigest", title: "Weekly Digest", desc: "Consolidated list of logs, tutorials, and content articles" },
                        { key: "monthlyDigest", title: "Monthly Newsletter", desc: "Roundup digest of the best content from SendMyForm" },
                        { key: "maintenanceNotifications", title: "Maintenance Alerts", desc: "Urgent announcements on scheduling window updates" },
                        { key: "securityAlerts", title: "Security Notices", desc: "Priority notifications on authentication standards and patches" },
                      ].map((item) => (
                        <div
                          key={item.key}
                          onClick={() => togglePref(item.key as any)}
                          className={cn(
                            "p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between bg-slate-900/30",
                            preferences[item.key as keyof typeof preferences]
                              ? "border-rose-500/20 bg-rose-500/[0.02]"
                              : "border-white/5 hover:border-white/10"
                          )}
                        >
                          <div>
                            <h5 className="text-[11px] font-black text-white italic">{item.title}</h5>
                            <p className="text-[9px] text-slate-500 font-semibold mt-0.5">{item.desc}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences[item.key as keyof typeof preferences]}
                            onChange={() => {}} // toggles on box container click
                            className="w-4 h-4 rounded border-white/5 bg-slate-950 accent-rose-600 cursor-pointer pointer-events-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Frequency Options */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Frequency Limit</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "instant", label: "Instant" },
                        { value: "weekly", label: "Weekly" },
                        { value: "monthly", label: "Monthly" },
                      ].map((f) => (
                        <button
                          key={f.value}
                          type="button"
                          onClick={() => setFrequency(f.value)}
                          className={cn(
                            "py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all",
                            frequency === f.value
                              ? "border-rose-500 text-rose-500 bg-rose-500/5 shadow"
                              : "border-white/5 hover:border-white/10 text-slate-400"
                          )}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Action buttons */}
              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-rose-950/30"
                >
                  <Save size={14} /> {saving ? "Saving Changes..." : "Save Preferences"}
                </button>
                {status === "subscribed" && (
                  <button
                    type="button"
                    onClick={handleDirectUnsubscribe}
                    disabled={saving}
                    className="px-6 py-4 bg-slate-900 border border-white/5 rounded-2xl text-xs font-black uppercase text-rose-500 hover:bg-rose-500/10 transition-colors"
                  >
                    Unsubscribe All
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>

      <style jsx global>{`
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function PreferencesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617] text-white flex items-center justify-center font-bold tracking-tighter italic">CONNECTING NETWORK NODE...</div>}>
      <PreferencesContent />
    </Suspense>
  );
}
