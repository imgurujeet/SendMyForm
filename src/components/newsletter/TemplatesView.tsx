"use client";

import React, { useState, useEffect } from "react";
import { Plus, FileText, Trash2, Edit2, Copy, Check, X, Sparkles } from "lucide-react";
import { collection, query, where, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import TipTapEditor from "@/components/TipTapEditor";

interface TemplatesViewProps {
  user: any;
}

const PRESET_TEMPLATES = [
  {
    name: "Welcome Series (Preset)",
    subject: "Welcome to our community! Here is what's next.",
    contentHtml: `<h1>Welcome to our family!</h1>
<p>Hey there,</p>
<p>We are absolutely thrilled to have you here. Our mission is to help you build better products, faster.</p>
<p>Over the next few weeks, we will share some of our best tips, tricks, and resources to help you get started.</p>
<p>If you ever have any questions, just hit reply. We read and respond to every single email!</p>
<br/>
<p>Cheers,<br/>The Team</p>`,
    contentJson: ""
  },
  {
    name: "Product Update (Preset)",
    subject: "Product Update: What we built this month",
    contentHtml: `<h1>Monthly Product Digest</h1>
<p>Hello,</p>
<p>We've been hard at work building features to make your experience seamless. Here is what is new:</p>
<h2>🚀 Feature 1: Description</h2>
<p>A quick summary of this amazing feature and why you will love using it.</p>
<h2>⚡ Performance Boost</h2>
<p>We optimized our backend nodes resulting in up to 50% faster response times across the board.</p>
<br/>
<p>Try these new features today and let us know what you think!</p>`,
    contentJson: ""
  }
];

export default function TemplatesView({ user }: TemplatesViewProps) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [contentJson, setContentJson] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "templates"), where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      setTemplates(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    return () => unsub();
  }, [user.uid]);

  const handleOpenCreate = () => {
    setName("");
    setSubject("");
    setContentHtml("<p>Start writing your template here...</p>");
    setContentJson("");
    setEditingTemplateId(null);
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tpl: any) => {
    setName(tpl.name);
    setSubject(tpl.subject || "");
    setContentHtml(tpl.contentHtml || "");
    setContentJson(tpl.contentJson || "");
    setEditingTemplateId(tpl.id);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);

    try {
      if (editingTemplateId) {
        // Edit
        await updateDoc(doc(db, "templates", editingTemplateId), {
          name: name.trim(),
          subject: subject.trim(),
          contentHtml,
          contentJson,
          updatedAt: new Date()
        });
      } else {
        // Create
        const tplRef = doc(collection(db, "templates"));
        await setDoc(tplRef, {
          id: tplRef.id,
          uid: user.uid,
          name: name.trim(),
          subject: subject.trim(),
          contentHtml,
          contentJson,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save template.");
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async (tpl: any) => {
    try {
      const tplRef = doc(collection(db, "templates"));
      await setDoc(tplRef, {
        id: tplRef.id,
        uid: user.uid,
        name: `${tpl.name} (Copy)`,
        subject: tpl.subject || "",
        contentHtml: tpl.contentHtml || "",
        contentJson: tpl.contentJson || "",
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (err) {
      console.error(err);
      alert("Failed to duplicate template.");
    }
  };

  const handleLoadPreset = (preset: typeof PRESET_TEMPLATES[0]) => {
    setName(preset.name.replace(" (Preset)", ""));
    setSubject(preset.subject);
    setContentHtml(preset.contentHtml);
    setContentJson(preset.contentJson);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete template "${name}"?`)) return;
    try {
      await deleteDoc(doc(db, "templates", id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete template.");
    }
  };

  if (loading) {
    return (
      <div className="h-60 flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest text-xs italic animate-pulse">
        Fetching Templates Node...
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tight text-white mb-1">Email Templates</h1>
          <p className="text-sm text-slate-400">Save layout structures and boilerplate messages for quick campaign deployment.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-violet-900/30"
        >
          <Plus size={14} /> Create Template
        </button>
      </div>

      {templates.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/5 p-16 text-center bg-slate-950/20">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
            <FileText size={20} className="text-violet-400" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase italic mb-1">No templates yet</h3>
          <p className="text-xs text-slate-500 mb-6">Create a custom layout or copy from one of our professional presets.</p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all"
          >
            <Plus size={14} /> Start Custom Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-3xl bg-slate-950/50 border border-white/5 hover:border-violet-500/20 hover:scale-[1.01] transition-all flex flex-col justify-between group relative overflow-hidden h-52"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 blur-3xl group-hover:bg-violet-600/10 transition-colors" />
              
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                    <FileText size={18} />
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDuplicate(t)}
                      className="p-1.5 rounded-lg border border-white/5 bg-slate-900 text-slate-400 hover:text-white hover:border-white/10 transition-all"
                      title="Duplicate Template"
                    >
                      <Copy size={12} />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(t)}
                      className="p-1.5 rounded-lg border border-white/5 bg-slate-900 text-slate-400 hover:text-white hover:border-white/10 transition-all"
                      title="Edit Template"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id, t.name)}
                      className="p-1.5 rounded-lg border border-red-500/20 bg-slate-900 text-red-400 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all"
                      title="Delete Template"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white mb-1 truncate pr-8">{t.name}</h3>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-2 truncate">Subject: {t.subject || "No subject"}</p>
                <div className="text-[11px] text-slate-400 leading-relaxed line-clamp-2" dangerouslySetInnerHTML={{ __html: t.contentHtml || "" }} />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
                <span className="text-[9px] font-mono text-slate-600">ID: {t.id}</span>
                <span className="text-[10px] text-slate-400">
                  Last Updated: {t.updatedAt?.seconds ? new Date(t.updatedAt.seconds * 1000).toLocaleDateString() : new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE/EDIT FULL-SCREEN DIALOGUE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md p-4 flex justify-center items-start md:items-center">
          <div className="relative w-full max-w-4xl bg-slate-950 border border-white/5 rounded-[32px] overflow-hidden shadow-2xl p-8 max-h-[95vh] flex flex-col my-auto">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-600 via-pink-600 to-violet-500" />
            
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <div>
                <h2 className="text-lg font-black italic uppercase tracking-tight text-white">
                  {editingTemplateId ? "Edit Custom Template" : "Compose New Template"}
                </h2>
                <p className="text-xs text-slate-500">Design dynamic, responsive layouts saved as layout variables.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg border border-white/5 bg-slate-900 hover:border-white/10 hover:text-white text-slate-500 transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl flex-shrink-0">
                {error}
              </div>
            )}

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-4">
              
              {/* Presets Bar */}
              {!editingTemplateId && (
                <div className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5 mb-2.5">
                    <Sparkles size={12} className="text-violet-400 animate-pulse" /> Load from boilerplate layout presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_TEMPLATES.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleLoadPreset(p)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-950 border border-white/5 hover:border-white/10 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all"
                      >
                        {p.name.replace(" (Preset)", "")}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">Template Identifier Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Monthly Newsletter Layout"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input text-xs"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">Default Subject Line</label>
                  <input
                    type="text"
                    placeholder="e.g. Hey {{name}}, check this out!"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">Email Body Editor (HTML & Text Variables)</label>
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
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/5 flex-shrink-0">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !name.trim()}
                className="flex-1 btn-primary py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all"
              >
                {saving ? "Saving..." : editingTemplateId ? "Update Template" : "Save Template"}
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
