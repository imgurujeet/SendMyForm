"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Users, Trash2, Edit2, Check, X, Search, Filter, 
  Download, Upload, ChevronLeft, ChevronRight, UserPlus, 
  Tag, ListPlus, CheckSquare, Square, AlertCircle
} from "lucide-react";
import { 
  collection, query, where, onSnapshot, doc, 
  setDoc, deleteDoc, writeBatch, getDocs 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ContactsViewProps {
  user: any;
}

export default function ContactsView({ user }: ContactsViewProps) {
  const [contacts, setContacts] = useState<any[]>([]);
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [listFilter, setListFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // Selected Contacts for Bulk Actions
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  // Modals
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  // Form State
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactStatus, setContactStatus] = useState<"subscribed" | "unsubscribed" | "pending">("subscribed");
  const [contactTags, setContactTags] = useState("");
  const [contactLists, setContactLists] = useState<string[]>([]);
  
  // Import State
  const [csvInput, setCsvInput] = useState("");
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // General error/saving
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch lists and contacts
  useEffect(() => {
    // 1. Fetch lists
    const qLists = query(collection(db, "lists"), where("uid", "==", user.uid));
    const unsubLists = onSnapshot(qLists, (snap) => {
      setLists(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 2. Fetch contacts
    const qContacts = query(collection(db, "contacts"), where("uid", "==", user.uid));
    const unsubContacts = onSnapshot(qContacts, (snap) => {
      setContacts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    return () => {
      unsubLists();
      unsubContacts();
    };
  }, [user.uid]);

  // Derived unique tags
  const allTags = React.useMemo(() => {
    const tagsSet = new Set<string>();
    contacts.forEach(c => {
      if (Array.isArray(c.tags)) {
        c.tags.forEach((t: any) => tagsSet.add(t));
      }
    });
    return Array.from(tagsSet);
  }, [contacts]);

  // Filtered contacts
  const filteredContacts = React.useMemo(() => {
    return contacts.filter(c => {
      const matchesSearch = 
        c.email.toLowerCase().includes(search.toLowerCase()) || 
        (c.name || "").toLowerCase().includes(search.toLowerCase());
      
      const matchesTag = !tagFilter || (c.tags || []).includes(tagFilter);
      const matchesList = !listFilter || (c.lists || []).includes(listFilter);
      const matchesStatus = !statusFilter || c.status === statusFilter;

      return matchesSearch && matchesTag && matchesList && matchesStatus;
    });
  }, [contacts, search, tagFilter, listFilter, statusFilter]);

  // Paginated contacts
  const paginatedContacts = React.useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredContacts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredContacts, page]);

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage) || 1;

  // Reset pagination on filter change
  useEffect(() => {
    setPage(1);
  }, [search, tagFilter, listFilter, statusFilter]);

  // Selection helpers
  const handleSelectAll = () => {
    const currentEmails = paginatedContacts.map(c => c.email);
    const allSelected = currentEmails.every(email => selectedEmails.includes(email));
    
    if (allSelected) {
      // Remove all current page emails from selection
      setSelectedEmails(prev => prev.filter(email => !currentEmails.includes(email)));
    } else {
      // Add all current page emails to selection
      setSelectedEmails(prev => {
        const union = new Set([...prev, ...currentEmails]);
        return Array.from(union);
      });
    }
  };

  const handleSelectContact = (email: string) => {
    setSelectedEmails(prev => 
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  // Add/Edit Save
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail.trim()) return;
    setSaving(true);
    setError(null);

    const emailKey = contactEmail.trim().toLowerCase();
    const docId = `${user.uid}_${emailKey}`;

    // Format tags
    const tagsArray = contactTags
      ? contactTags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean)
      : [];

    const payload = {
      uid: user.uid,
      email: emailKey,
      name: contactName.trim(),
      status: contactStatus,
      tags: tagsArray,
      lists: contactLists,
      updatedAt: new Date(),
      joinedDate: new Date()
    };

    try {
      // Save contact doc
      await setDoc(doc(db, "contacts", docId), payload, { merge: true });
      
      // Update contact counts for selected lists (incremental updates would be ideal, but for now we recalculate list sizes or do simple estimation)
      await updateListCounts();

      setIsContactModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save contact.");
    } finally {
      setSaving(false);
    }
  };

  const updateListCounts = async () => {
    // Helper to recalculate mailing list contact sizes
    try {
      const listSnap = await getDocs(query(collection(db, "lists"), where("uid", "==", user.uid)));
      const batch = writeBatch(db);
      for (const lDoc of listSnap.docs) {
        const listId = lDoc.id;
        const matchingContacts = contacts.filter(c => (c.lists || []).includes(listId));
        batch.update(doc(db, "lists", listId), { contactCount: matchingContacts.length });
      }
      await batch.commit();
    } catch (err) {
      console.error("Failed to update list counts:", err);
    }
  };

  // Open modal triggers
  const handleOpenCreate = () => {
    setEditingEmail(null);
    setContactEmail("");
    setContactName("");
    setContactStatus("subscribed");
    setContactTags("");
    setContactLists([]);
    setError(null);
    setIsContactModalOpen(true);
  };

  const handleOpenEdit = (contact: any) => {
    setEditingEmail(contact.email);
    setContactEmail(contact.email);
    setContactName(contact.name || "");
    setContactStatus(contact.status || "subscribed");
    setContactTags((contact.tags || []).join(", "));
    setContactLists(contact.lists || []);
    setError(null);
    setIsContactModalOpen(true);
  };

  // Delete contact
  const handleDeleteContact = async (email: string) => {
    if (!confirm(`Are you sure you want to remove contact ${email}?`)) return;
    try {
      const docId = `${user.uid}_${email}`;
      await deleteDoc(doc(db, "contacts", docId));
      setSelectedEmails(prev => prev.filter(e => e !== email));
    } catch (err) {
      console.error(err);
      alert("Failed to delete contact.");
    }
  };

  // CSV Import
  const handleImportCSV = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvInput.trim()) return;
    setImporting(true);
    setImportError(null);

    const lines = csvInput.split("\n");
    const newContactsList: any[] = [];

    lines.forEach((line) => {
      const parts = line.split(",").map(p => p.trim());
      if (parts.length > 0 && parts[0].includes("@")) {
        const email = parts[0].toLowerCase();
        const name = parts[1] || "";
        const tags = parts[2] ? parts[2].split(";").map(t => t.trim().toLowerCase()).filter(Boolean) : ["imported"];
        newContactsList.push({ email, name, tags });
      }
    });

    if (newContactsList.length === 0) {
      setImportError("No valid email records detected. Format: email, name, tags (separated by semicolons)");
      setImporting(false);
      return;
    }

    try {
      const batch = writeBatch(db);
      newContactsList.forEach((c) => {
        const docId = `${user.uid}_${c.email}`;
        batch.set(doc(db, "contacts", docId), {
          uid: user.uid,
          email: c.email,
          name: c.name,
          status: "subscribed",
          tags: c.tags,
          lists: [],
          joinedDate: new Date(),
          updatedAt: new Date()
        }, { merge: true });
      });

      await batch.commit();
      setIsImportModalOpen(false);
      setCsvInput("");
    } catch (err: any) {
      console.error(err);
      setImportError(err.message || "Failed to import subscribers.");
    } finally {
      setImporting(false);
    }
  };

  // Bulk actions
  const handleBulkDelete = async () => {
    if (selectedEmails.length === 0) return;
    if (!confirm(`Delete ${selectedEmails.length} selected contacts? This action is irreversible.`)) return;

    try {
      const batch = writeBatch(db);
      selectedEmails.forEach(email => {
        const docId = `${user.uid}_${email}`;
        batch.delete(doc(db, "contacts", docId));
      });
      await batch.commit();
      setSelectedEmails([]);
    } catch (err) {
      console.error(err);
      alert("Failed to delete selected contacts.");
    }
  };

  const handleBulkStatusChange = async (newStatus: "subscribed" | "unsubscribed") => {
    if (selectedEmails.length === 0) return;
    try {
      const batch = writeBatch(db);
      selectedEmails.forEach(email => {
        const docId = `${user.uid}_${email}`;
        batch.update(doc(db, "contacts", docId), { status: newStatus, updatedAt: new Date() });
      });
      await batch.commit();
      setSelectedEmails([]);
    } catch (err) {
      console.error(err);
      alert("Failed to update status on selected contacts.");
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (filteredContacts.length === 0) return;
    const headers = ["Email", "Name", "Status", "Tags", "Lists", "Joined Date"];
    const rows = filteredContacts.map(c => [
      c.email,
      c.name || "",
      c.status,
      (c.tags || []).join(";"),
      (c.lists || []).join(";"),
      c.joinedDate?.seconds ? new Date(c.joinedDate.seconds * 1000).toISOString() : new Date().toISOString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sendmyform_contacts_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tight text-white mb-1">Mailing List Contacts</h1>
          <p className="text-sm text-slate-400">Total of {contacts.length} unique contacts enrolled across your campaigns.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-3 bg-slate-900 border border-white/5 hover:border-white/10 hover:bg-slate-950 text-slate-300 text-xs font-black uppercase tracking-wider rounded-xl transition-all"
          >
            <Upload size={14} /> Import CSV
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-3 bg-slate-900 border border-white/5 hover:border-white/10 hover:bg-slate-950 text-slate-300 text-xs font-black uppercase tracking-wider rounded-xl transition-all"
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-3 bg-violet-600 hover:bg-violet-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-violet-900/30"
          >
            <Plus size={14} /> Add Contact
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <div className="p-5 bg-slate-950/50 border border-white/5 rounded-3xl grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input text-xs pl-10"
          />
        </div>
        
        <div>
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="form-input text-xs appearance-none cursor-pointer"
          >
            <option value="">Filter by Tag (All)</option>
            {allTags.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={listFilter}
            onChange={(e) => setListFilter(e.target.value)}
            className="form-input text-xs appearance-none cursor-pointer"
          >
            <option value="">Filter by List (All)</option>
            {lists.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input text-xs appearance-none cursor-pointer"
          >
            <option value="">Filter by Status (All)</option>
            <option value="subscribed">Subscribed</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Bulk actions and info */}
      {selectedEmails.length > 0 && (
        <div className="p-4 bg-violet-600/10 border border-violet-500/20 rounded-2xl flex items-center justify-between gap-4 animate-fade-in">
          <span className="text-xs font-bold text-violet-400 uppercase">{selectedEmails.length} contacts selected</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatusChange("subscribed")}
              className="px-3 py-1.5 bg-slate-900 border border-white/5 hover:border-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all"
            >
              Subscribe
            </button>
            <button
              onClick={() => handleBulkStatusChange("unsubscribed")}
              className="px-3 py-1.5 bg-slate-900 border border-white/5 hover:border-white/10 text-orange-400 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all"
            >
              Unsubscribe
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-red-500 hover:text-white transition-all"
            >
              Delete
            </button>
            <button
              onClick={() => setSelectedEmails([])}
              className="p-1 text-slate-500 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Contacts List Grid */}
      {filteredContacts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/5 p-16 text-center bg-slate-950/20">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
            <Users size={20} className="text-violet-400" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase italic mb-1">No contacts found</h3>
          <p className="text-xs text-slate-500">Try adjusting your filters, searching for another term, or creating a contact.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-3xl border border-white/5 bg-slate-950/50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-950/80">
                  <th className="p-4 w-12 text-center">
                    <button onClick={handleSelectAll} className="text-slate-400 hover:text-white transition-all">
                      {paginatedContacts.every(c => selectedEmails.includes(c.email)) ? (
                        <CheckSquare size={16} className="text-violet-400" />
                      ) : (
                        <Square size={16} />
                      )}
                    </button>
                  </th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Mailing Lists</th>
                  <th className="p-4">Tags</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedContacts.map((c) => (
                  <tr key={c.email} className="hover:bg-white/[0.01] transition-colors text-xs">
                    <td className="p-4 text-center">
                      <button onClick={() => handleSelectContact(c.email)} className="text-slate-400 hover:text-white transition-all">
                        {selectedEmails.includes(c.email) ? (
                          <CheckSquare size={16} className="text-violet-400" />
                        ) : (
                          <Square size={16} />
                        )}
                      </button>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-white">{c.name || "Anonymous Contact"}</p>
                        <p className="text-[10px] font-mono text-slate-500 mt-0.5">{c.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        c.status === "subscribed" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : c.status === "unsubscribed" 
                          ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" 
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(c.lists || []).length > 0 ? (
                          c.lists.map((lId: string) => {
                            const foundList = lists.find(l => l.id === lId);
                            return (
                              <span key={lId} className="px-2 py-0.5 bg-violet-600/10 border border-violet-500/10 text-violet-400 text-[9px] rounded-lg">
                                {foundList ? foundList.name : `List: ${lId.slice(0, 5)}`}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-[10px] text-slate-600 italic">Unassigned</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(c.tags || []).length > 0 ? (
                          c.tags.map((t: string) => (
                            <span key={t} className="px-2 py-0.5 bg-slate-900 border border-white/5 text-slate-400 text-[9px] rounded-lg">
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-600 italic">-</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 rounded-lg border border-white/5 bg-slate-900 text-slate-400 hover:text-white transition-all"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteContact(c.email)}
                          className="p-1.5 rounded-lg border border-red-500/20 bg-slate-900 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Page {page} of {totalPages} ({filteredContacts.length} total)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-2 rounded-xl border border-white/5 bg-slate-950/50 text-slate-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="p-2 rounded-xl border border-white/5 bg-slate-950/50 text-slate-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL CONTACT CREATE/EDIT MODAL */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg bg-slate-950 border border-white/5 rounded-[32px] overflow-hidden shadow-2xl p-8">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-600 via-pink-600 to-violet-500" />
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black italic uppercase tracking-tight text-white">
                {editingEmail ? "Edit Subscriber Info" : "Create Subscriber Entry"}
              </h2>
              <button
                onClick={() => setIsContactModalOpen(false)}
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

            <form onSubmit={handleSaveContact} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">Email Address</label>
                <input
                  type="email"
                  placeholder="subscriber@domain.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="form-input text-xs"
                  disabled={editingEmail !== null}
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">Name</label>
                <input
                  type="text"
                  placeholder="Alex Johnson"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">Subscription Status</label>
                  <select
                    value={contactStatus}
                    onChange={(e) => setContactStatus(e.target.value as any)}
                    className="form-input text-xs appearance-none cursor-pointer"
                  >
                    <option value="subscribed">Subscribed</option>
                    <option value="unsubscribed">Unsubscribed</option>
                    <option value="pending">Pending Verification</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="newsletter, developer"
                    value={contactTags}
                    onChange={(e) => setContactTags(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">Assign to Lists</label>
                {lists.length === 0 ? (
                  <p className="text-[10px] text-slate-500 italic">No lists created yet. Create lists first under the Lists tab.</p>
                ) : (
                  <div className="max-h-28 overflow-y-auto p-3 bg-slate-900/50 border border-white/5 rounded-2xl grid grid-cols-2 gap-2">
                    {lists.map(l => {
                      const active = contactLists.includes(l.id);
                      return (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => setContactLists(prev => 
                            active ? prev.filter(id => id !== l.id) : [...prev, l.id]
                          )}
                          className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all text-[11px] font-semibold ${
                            active 
                              ? "border-violet-500/40 bg-violet-600/10 text-white" 
                              : "border-white/5 bg-slate-900/30 text-slate-400 hover:border-white/10"
                          }`}
                        >
                          {active ? <CheckSquare size={13} className="text-violet-400" /> : <Square size={13} />}
                          <span className="truncate">{l.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 btn-primary py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all"
                >
                  {saving ? "Saving..." : editingEmail ? "Update Info" : "Enroll Subscriber"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="px-5 py-3 rounded-xl border border-white/5 bg-slate-900 text-slate-400 hover:text-white text-xs font-black uppercase tracking-wider transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMPORT MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg bg-slate-950 border border-white/5 rounded-[32px] overflow-hidden shadow-2xl p-8">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-600 via-pink-600 to-violet-500" />
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black italic uppercase tracking-tight text-white flex items-center gap-2">
                <Upload size={18} className="text-violet-400" /> Bulk Import Subscribers
              </h2>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1.5 rounded-lg border border-white/5 bg-slate-900 hover:border-white/10 hover:text-white text-slate-500 transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {importError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl flex items-center gap-2">
                <AlertCircle size={14} /> {importError}
              </div>
            )}

            <form onSubmit={handleImportCSV} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">CSV Records (Comma-Separated)</label>
                <textarea
                  placeholder="email,name,tags(separated by semicolons)&#10;subscriber1@domain.com,John Doe,imported;newsletter&#10;subscriber2@domain.com,Jane Smith,developer;lead"
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  className="form-input text-xs font-mono h-48 resize-none"
                  required
                />
                <p className="text-[9px] text-slate-500 mt-1">First column MUST contain the email address. Names and semicolon-separated tags are optional.</p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  type="submit"
                  disabled={importing}
                  className="flex-1 btn-primary py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all"
                >
                  {importing ? "Importing records..." : "Import List"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
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
