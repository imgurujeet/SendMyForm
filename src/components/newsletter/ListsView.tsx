"use client";

import React, { useState, useEffect } from "react";
import { Plus, Users, Trash2, Edit2, Check, X, FileText } from "lucide-react";
import { collection, query, where, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ListsViewProps {
  user: any;
}

export default function ListsView({ user }: ListsViewProps) {
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListId, setEditingListId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "lists"), where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      setLists(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    return () => unsub();
  }, [user.uid]);

  const handleOpenCreate = () => {
    setName("");
    setDescription("");
    setEditingListId(null);
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (list: any) => {
    setName(list.name);
    setDescription(list.description || "");
    setEditingListId(list.id);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);

    try {
      if (editingListId) {
        // Edit List
        await updateDoc(doc(db, "lists", editingListId), {
          name: name.trim(),
          description: description.trim(),
          updatedAt: new Date()
        });
      } else {
        // Create List
        const listRef = doc(collection(db, "lists"));
        await setDoc(listRef, {
          id: listRef.id,
          uid: user.uid,
          name: name.trim(),
          description: description.trim(),
          contactCount: 0,
          createdAt: new Date()
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save list.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the list "${name}"? Contacts in this list will remain, but the association will be removed.`)) return;
    try {
      await deleteDoc(doc(db, "lists", id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete list.");
    }
  };

  if (loading) {
    return (
      <div className="h-60 flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest text-xs italic animate-pulse">
        Fetching Lists Node...
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tight text-white mb-1">Mailing Lists</h1>
          <p className="text-sm text-slate-400">Organize and segment your contacts into targeted mailing lists.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-violet-900/30"
        >
          <Plus size={14} /> Create list
        </button>
      </div>

      {lists.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/5 p-16 text-center bg-slate-950/20">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
            <Users size={20} className="text-violet-400" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase italic mb-1">No lists yet</h3>
          <p className="text-xs text-slate-500 mb-6">Create a mailing list to begin categorizing your subscribers.</p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all"
          >
            <Plus size={14} /> Create first list
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((l) => (
            <div
              key={l.id}
              className="p-6 rounded-3xl bg-slate-950/50 border border-white/5 hover:border-violet-500/20 hover:scale-[1.01] transition-all flex flex-col justify-between group relative overflow-hidden h-48"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 blur-3xl group-hover:bg-violet-600/10 transition-colors" />
              
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                    <Users size={18} />
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(l)}
                      className="p-1.5 rounded-lg border border-white/5 bg-slate-900 text-slate-400 hover:text-white hover:border-white/10 transition-all"
                      title="Edit List"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(l.id, l.name)}
                      className="p-1.5 rounded-lg border border-red-500/20 bg-slate-900 text-red-400 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all"
                      title="Delete List"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white mb-1.5 truncate pr-8">{l.name}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{l.description || "No description provided."}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
                <span className="text-[10px] font-mono text-slate-500">ID: {l.id}</span>
                <span className="text-xs font-black text-violet-400 flex items-center gap-1 uppercase">
                  <Users size={12} /> {l.contactCount || 0} Contacts
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg bg-slate-950 border border-white/5 rounded-[32px] overflow-hidden shadow-2xl p-8">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-600 via-pink-600 to-violet-500" />
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black italic uppercase tracking-tight text-white">
                {editingListId ? "Edit Mailing List" : "Create Mailing List"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg border border-white/5 bg-slate-900 hover:border-white/10 hover:text-white text-slate-500 transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">List Name</label>
                <input
                  type="text"
                  placeholder="e.g. Weekly Subscribers"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input text-xs"
                  required
                />
              </div>
              
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">Description</label>
                <textarea
                  placeholder="e.g. Contacts signed up via weekly blog footer widget..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input text-xs resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 btn-primary py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all"
                >
                  {saving ? "Saving..." : editingListId ? "Update List" : "Create List"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl border border-white/5 bg-slate-900 text-slate-400 hover:text-white text-xs font-black uppercase tracking-wider transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
