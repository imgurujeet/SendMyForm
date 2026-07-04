"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Mail, Trash2, Edit2, Copy, Check, X, Calendar, 
  Send, Sparkles, AlertCircle, RefreshCw, SendHorizontal, Play, Eye
} from "lucide-react";
import { 
  collection, query, where, onSnapshot, doc, 
  setDoc, deleteDoc, updateDoc, getDocs, getDoc
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import TipTapEditor from "@/components/TipTapEditor";

interface CampaignsViewProps {
  user: any;
}

export default function CampaignsView({ user }: CampaignsViewProps) {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [lists, setLists] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [audienceType, setAudienceType] = useState<"all" | "list" | "tag">("all");
  const [audienceValue, setAudienceValue] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [contentJson, setContentJson] = useState("");
  const [sendType, setSendType] = useState<"immediate" | "scheduled">("immediate");
  const [scheduledDate, setScheduledDate] = useState("");

  // Testing Fields
  const [testEmail, setTestEmail] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [testSuccess, setTestSuccess] = useState<string | null>(null);
  const [testError, setTestError] = useState<string | null>(null);

  // General State
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch campaigns, templates, lists, and contacts
  useEffect(() => {
    // 1. Campaigns
    const qCamps = query(collection(db, "campaigns"), where("uid", "==", user.uid));
    const unsubCamps = onSnapshot(qCamps, (snap) => {
      setCampaigns(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    // 2. Templates
    const qTpls = query(collection(db, "templates"), where("uid", "==", user.uid));
    const unsubTpls = onSnapshot(qTpls, (snap) => {
      setTemplates(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 3. Lists
    const qLists = query(collection(db, "lists"), where("uid", "==", user.uid));
    const unsubLists = onSnapshot(qLists, (snap) => {
      setLists(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 4. Contacts
    const qContacts = query(collection(db, "contacts"), where("uid", "==", user.uid));
    const unsubContacts = onSnapshot(qContacts, (snap) => {
      setContacts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubCamps();
      unsubTpls();
      unsubLists();
      unsubContacts();
    };
  }, [user.uid]);

  // Derived unique tags for segmenting
  const allTags = React.useMemo(() => {
    const tagsSet = new Set<string>();
    contacts.forEach(c => {
      if (Array.isArray(c.tags)) {
        c.tags.forEach((t: any) => tagsSet.add(t));
      }
    });
    return Array.from(tagsSet);
  }, [contacts]);

  // Open modal triggers
  const handleOpenCreate = () => {
    setName("");
    setSubject("");
    setPreviewText("");
    setAudienceType("all");
    setAudienceValue("");
    setContentHtml("<p>Start writing your campaign message here...</p>");
    setContentJson("");
    setSendType("immediate");
    setScheduledDate("");
    setEditingCampaignId(null);
    setError(null);
    setTestSuccess(null);
    setTestError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (camp: any) => {
    setName(camp.name);
    setSubject(camp.subject || "");
    setPreviewText(camp.previewText || "");
    setAudienceType(camp.audience?.type || "all");
    setAudienceValue(camp.audience?.value || "");
    setContentHtml(camp.contentHtml || "");
    setContentJson(camp.contentJson || "");
    setSendType(camp.status === "scheduled" ? "scheduled" : "immediate");
    
    let dateStr = "";
    if (camp.scheduledDate) {
      const d = camp.scheduledDate.toDate ? camp.scheduledDate.toDate() : new Date(camp.scheduledDate);
      dateStr = d.toISOString().slice(0, 16); // format: YYYY-MM-DDThh:mm
    }
    setScheduledDate(dateStr);
    
    setEditingCampaignId(camp.id);
    setError(null);
    setTestSuccess(null);
    setTestError(null);
    setIsModalOpen(true);
  };

  // Duplicate campaign
  const handleDuplicate = async (camp: any) => {
    try {
      const campRef = doc(collection(db, "campaigns"));
      await setDoc(campRef, {
        id: campRef.id,
        uid: user.uid,
        name: `${camp.name} (Copy)`,
        subject: camp.subject || "",
        previewText: camp.previewText || "",
        audience: camp.audience || { type: "all", value: "" },
        contentHtml: camp.contentHtml || "",
        contentJson: camp.contentJson || "",
        status: "draft",
        sentCount: 0,
        openCount: 0,
        clickCount: 0,
        bounceCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (err) {
      console.error(err);
      alert("Failed to duplicate campaign.");
    }
  };

  // Delete campaign
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete campaign "${name}"?`)) return;
    try {
      await deleteDoc(doc(db, "campaigns", id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete campaign.");
    }
  };

  // Load Template into fields
  const handleLoadTemplate = (tplId: string) => {
    if (!tplId) return;
    const selectedTpl = templates.find(t => t.id === tplId);
    if (selectedTpl) {
      setSubject(selectedTpl.subject || "");
      setContentHtml(selectedTpl.contentHtml || "");
      setContentJson(selectedTpl.contentJson || "");
    }
  };

  // Save Campaign
  const handleSaveCampaign = async (status: "draft" | "scheduled") => {
    if (!name.trim() || !subject.trim()) {
      setError("Campaign name and subject are required.");
      return;
    }

    setSaving(true);
    setError(null);

    const schedVal = sendType === "scheduled" && scheduledDate ? new Date(scheduledDate) : null;
    
    // Check if scheduled is in the past
    if (status === "scheduled" && schedVal && schedVal.getTime() < Date.now()) {
      setError("Scheduled date must be in the future.");
      setSaving(false);
      return;
    }

    const payload = {
      uid: user.uid,
      name: name.trim(),
      subject: subject.trim(),
      previewText: previewText.trim(),
      audience: {
        type: audienceType,
        value: audienceValue
      },
      contentHtml,
      contentJson,
      scheduledDate: schedVal,
      status: status, // draft or scheduled
      updatedAt: new Date()
    };

    try {
      if (editingCampaignId) {
        await updateDoc(doc(db, "campaigns", editingCampaignId), payload);
      } else {
        const campRef = doc(collection(db, "campaigns"));
        await setDoc(campRef, {
          ...payload,
          id: campRef.id,
          sentCount: 0,
          openCount: 0,
          clickCount: 0,
          bounceCount: 0,
          createdAt: new Date()
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save campaign.");
    } finally {
      setSaving(false);
    }
  };

  // Send Test Email
  const handleSendTest = async () => {
    if (!testEmail.trim()) return;
    setSendingTest(true);
    setTestSuccess(null);
    setTestError(null);

    try {
      const res = await fetch("/api/newsletter/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          toEmail: testEmail.trim().toLowerCase(),
          subject: subject.trim() || "Test Campaign Dispatch",
          contentHtml,
          previewText
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestSuccess(`Test email sent successfully to ${testEmail}!`);
        setTestEmail("");
      } else {
        setTestError(data.error || "Failed to dispatch test mail.");
      }
    } catch (err: any) {
      console.error(err);
      setTestError(err.message || "Network error. Make sure your delivery SMTP or Resend settings are valid.");
    } finally {
      setSendingTest(false);
    }
  };

  // Process / send immediate campaign
  const handleSendImmediate = async (camp: any) => {
    if (!confirm(`Are you sure you want to send the campaign "${camp.name}" immediately? This will deliver emails to all matching contacts.`)) return;
    
    try {
      // Set status to scheduled for immediate cron processing or trigger direct API call
      await updateDoc(doc(db, "campaigns", camp.id), {
        status: "scheduled",
        scheduledDate: new Date(), // Immediate trigger
        updatedAt: new Date()
      });
      
      // Let's call the cron router API manually to trigger immediate sending
      const token = await auth.currentUser?.getIdToken();
      const headers: any = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/newsletter/cron", {
        method: "POST",
        headers,
        body: JSON.stringify({ campaignId: camp.id })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message || "Campaign processing started!");
      } else {
        alert(`Campaign marked for sending: ${data.error || "It will be processed shortly by global scheduler"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to queue campaign.");
    }
  };

  if (loading) {
    return (
      <div className="h-60 flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest text-xs italic animate-pulse">
        Fetching Campaigns Node...
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tight text-white mb-1">Email Campaigns</h1>
          <p className="text-sm text-slate-400">Design, test, schedule, and execute modern email marketing newsletters.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-violet-900/30"
        >
          <Plus size={14} /> Create Campaign
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/5 p-16 text-center bg-slate-950/20">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
            <Mail size={20} className="text-violet-400" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase italic mb-1">No campaigns yet</h3>
          <p className="text-xs text-slate-500 mb-6">Create a campaign newsletter and write something meaningful to your list.</p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all"
          >
            <Plus size={14} /> Design First Campaign
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map((c) => (
            <div
              key={c.id}
              className="p-6 rounded-[32px] bg-slate-950/50 border border-white/5 hover:border-violet-500/20 hover:scale-[1.01] transition-all flex flex-col justify-between group relative overflow-hidden h-72"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-3xl group-hover:bg-violet-600/10 transition-colors" />
              
              <div>
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    c.status === "sent" 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                      : c.status === "scheduled" 
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                      : c.status === "sending"
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                      : "bg-slate-800 text-slate-400 border border-white/5"
                  }`}>
                    {c.status}
                  </span>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {c.status === "draft" && (
                      <button
                        onClick={() => handleSendImmediate(c)}
                        className="p-1.5 rounded-lg border border-emerald-500/20 bg-slate-900 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                        title="Send Campaign Now"
                      >
                        <Play size={12} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDuplicate(c)}
                      className="p-1.5 rounded-lg border border-white/5 bg-slate-900 text-slate-400 hover:text-white hover:border-white/10 transition-all"
                      title="Duplicate Campaign"
                    >
                      <Copy size={12} />
                    </button>
                    {c.status !== "sent" && c.status !== "sending" && (
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 rounded-lg border border-white/5 bg-slate-900 text-slate-400 hover:text-white hover:border-white/10 transition-all"
                        title="Edit Campaign"
                      >
                        <Edit2 size={12} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(c.id, c.name)}
                      className="p-1.5 rounded-lg border border-red-500/20 bg-slate-900 text-red-400 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all"
                      title="Delete Campaign"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-black text-white mb-1 pr-8 leading-tight truncate">{c.name}</h3>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-2 truncate">Subject: {c.subject || "Untitled subject"}</p>
                <div className="text-[11px] text-slate-400 leading-relaxed line-clamp-3" dangerouslySetInnerHTML={{ __html: c.contentHtml || "" }} />
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <span>Sent: <strong className="text-white font-black">{c.sentCount || 0}</strong></span>
                  <span>Opens: <strong className="text-white font-black">{c.openCount || 0}</strong></span>
                  <span>Clicks: <strong className="text-white font-black">{c.clickCount || 0}</strong></span>
                </div>
                
                <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
                  {c.status === "scheduled" && c.scheduledDate ? (
                    <>
                      <Calendar size={12} className="text-blue-400" />
                      Scheduled: {c.scheduledDate.toDate ? c.scheduledDate.toDate().toLocaleString() : new Date(c.scheduledDate).toLocaleString()}
                    </>
                  ) : (
                    <>Last update: {c.updatedAt?.seconds ? new Date(c.updatedAt.seconds * 1000).toLocaleDateString() : new Date().toLocaleDateString()}</>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE/EDIT MODAL DIALOGUE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md p-4 flex justify-center items-start md:items-center">
          <div className="relative w-full max-w-4xl bg-slate-950 border border-white/5 rounded-[32px] overflow-hidden shadow-2xl p-8 max-h-[95vh] flex flex-col my-auto">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-600 via-pink-600 to-violet-500" />
            
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <div>
                <h2 className="text-lg font-black italic uppercase tracking-tight text-white">
                  {editingCampaignId ? "Edit Campaign Design" : "Create New Campaign"}
                </h2>
                <p className="text-xs text-slate-500">Design modern, responsive newsletters and queue delivery parameters.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg border border-white/5 bg-slate-900 hover:border-white/10 hover:text-white text-slate-500 transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl flex-shrink-0 flex items-center gap-2">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-4">
              
              {/* Load Template and Audience */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Template Selection */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">Prefill from Template</label>
                  <select
                    onChange={(e) => handleLoadTemplate(e.target.value)}
                    className="form-input text-xs cursor-pointer appearance-none"
                    defaultValue=""
                  >
                    <option value="">Start from Scratch (Blank)</option>
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                {/* Audience Segmentation */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">Audience Group</label>
                  <select
                    value={audienceType}
                    onChange={(e) => {
                      setAudienceType(e.target.value as any);
                      setAudienceValue("");
                    }}
                    className="form-input text-xs cursor-pointer appearance-none"
                  >
                    <option value="all">Entire Contact Base</option>
                    <option value="list">Filter by Mailing List</option>
                    <option value="tag">Filter by Contact Tag</option>
                  </select>
                </div>

                {/* Audience Value */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">Audience Value</label>
                  {audienceType === "all" ? (
                    <input
                      type="text"
                      value="All Contacts"
                      className="form-input text-xs"
                      disabled
                    />
                  ) : audienceType === "list" ? (
                    <select
                      value={audienceValue}
                      onChange={(e) => setAudienceValue(e.target.value)}
                      className="form-input text-xs cursor-pointer"
                      required
                    >
                      <option value="">Choose List...</option>
                      {lists.map(l => (
                        <option key={l.id} value={l.id}>{l.name} ({l.contactCount || 0} sub)</option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={audienceValue}
                      onChange={(e) => setAudienceValue(e.target.value)}
                      className="form-input text-xs cursor-pointer"
                      required
                    >
                      <option value="">Choose Tag...</option>
                      {allTags.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Campaign details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">Campaign Internal Name</label>
                  <input
                    type="text"
                    placeholder="e.g. July Newsletter - Version 1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">Email Subject Line</label>
                  <input
                    type="text"
                    placeholder="e.g. Exciting updates inside!"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="form-input text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">Preheader/Preview Text</label>
                <input
                  type="text"
                  placeholder="e.g. This summary will show next to subject line in user client inbox..."
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              {/* Rich editor */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">Campaign Body Markup</label>
                <div className="rounded-2xl border border-white/5 bg-slate-950 overflow-hidden">
                  <TipTapEditor
                    value={contentHtml}
                    onChange={(html, json) => {
                      setContentHtml(html);
                      setContentJson(json);
                    }}
                  />
                </div>
              </div>

              {/* Delivery Timing Options */}
              <div className="p-5 bg-slate-900/40 border border-white/5 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500 font-black">Delivery Timing</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setSendType("immediate")}
                      className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl border transition-all ${
                        sendType === "immediate"
                          ? "border-violet-500 bg-violet-600/10 text-white"
                          : "border-white/5 bg-slate-900/40 text-slate-400"
                      }`}
                    >
                      Send Immediately
                    </button>
                    <button
                      type="button"
                      onClick={() => setSendType("scheduled")}
                      className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl border transition-all ${
                        sendType === "scheduled"
                          ? "border-violet-500 bg-violet-600/10 text-white"
                          : "border-white/5 bg-slate-900/40 text-slate-400"
                      }`}
                    >
                      Schedule Delivery
                    </button>
                  </div>
                </div>

                {sendType === "scheduled" ? (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500 font-black">Date and Time</label>
                    <input
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="form-input text-xs text-white"
                      required
                    />
                  </div>
                ) : (
                  <div className="flex flex-col justify-end text-[10px] text-slate-500 font-medium italic">
                    Campaign will be queue-processed instantly after approval.
                  </div>
                )}
              </div>

              {/* Testing dispatch card */}
              <div className="p-6 bg-slate-950/80 border border-white/5 rounded-3xl space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <SendHorizontal size={14} className="text-violet-400 animate-pulse" /> Dispatch Campaign Test Email
                </h3>

                {testSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold rounded-xl flex items-center gap-2">
                    <Check size={14} /> {testSuccess}
                  </div>
                )}

                {testError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold rounded-xl flex items-center gap-2">
                    <AlertCircle size={14} /> {testError}
                  </div>
                )}

                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="Enter recipient email..."
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="form-input text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleSendTest}
                    disabled={sendingTest || !testEmail.trim()}
                    className="px-5 bg-slate-900 border border-white/5 hover:border-white/10 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all disabled:opacity-40"
                  >
                    {sendingTest ? "Sending..." : "Send Test"}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-3 pt-4 border-t border-white/5 flex-shrink-0">
              <button
                type="button"
                onClick={() => handleSaveCampaign(sendType === "scheduled" ? "scheduled" : "draft")}
                disabled={saving || !name.trim() || !subject.trim()}
                className="flex-1 btn-primary py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all"
              >
                {saving ? "Saving..." : sendType === "scheduled" ? "Schedule Campaign" : "Save Campaign Draft"}
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-3 rounded-xl border border-white/5 bg-slate-900 text-slate-400 hover:text-white text-xs font-black uppercase tracking-wider transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
