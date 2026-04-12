"use client";
import React, { useEffect, useState, useMemo } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import Link from "next/link";
import { Plus, Layers, LogOut, Settings, Home, Copy, Check, X, ShieldCheck, Trash2, Zap, Link2, Menu, User } from "lucide-react";
import { THEMES } from "@/lib/themes";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setOrigin(window.location.host.includes("localhost") ? "http://localhost:3002" : `https://${window.location.host}`);
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        const q = query(collection(db, "projects"), where("uid", "==", u.uid));
        const unsubProjects = onSnapshot(q, (snap) => {
          setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          setLoading(false);
        }, (err) => {
          console.error("Firestore Listen Error:", err);
          setError("Permissions Check Failed. Checking system...");
          setLoading(false);
        });
        return () => unsubProjects();
      } else window.location.href = "/auth";
    });
    return () => unsub();
  }, []);

  const currentProject = useMemo(() => selectedProjectId ? projects.find(p => p.id === selectedProjectId) : projects[0], [projects, selectedProjectId]);

  useEffect(() => {
    if (currentProject) setEmailInput(currentProject.emailTo || "");
  }, [currentProject?.id]);

  const handleCreate = async () => {
    if (!newName || !newSlug || isCreating) return;
    setIsCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/project/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, name: newName, slug: newSlug, emailTo: user.email || "" })
      });
      const data = await res.json();
      if (data.id || data.success) {
        setSelectedProjectId(data.id);
        setIsCreatingNew(false);
        setNewName("");
        setNewSlug("");
        setActiveTab("projects");
      } else {
        setError(data.error || "Failed to Establish Node");
      }
    } catch (e) { setError("Network Isolation Detected."); } finally { setIsCreating(false); }
  };

  const deleteProj = async (id: string) => {
    if (confirm("Terminate Node?")) await deleteDoc(doc(db, "projects", id));
  };

  const switchTab = (tab: string) => {
    setActiveTab(tab);
    setIsCreatingNew(false);
    setError(null);
    setSidebarOpen(false);
  };

  if (!mounted || loading) return <div className="h-screen flex items-center justify-center bg-black text-white font-bold tracking-widest animate-pulse">ESTABLISHING CONNECTION...</div>;

  const userInitial = user?.displayName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-64 border-r border-zinc-900 bg-zinc-950 flex flex-col fixed h-screen z-50 transition-transform duration-300",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 md:p-8 border-b border-zinc-800">
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <Zap size={20} fill="#3b82f6" /> SendMyForm
          </Link>
        </div>
        
        {/* User profile in sidebar */}
        <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-9 h-9 rounded-full border-2 border-zinc-700 object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-sm font-black">{userInitial}</div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{user?.displayName || "User"}</p>
            <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
          </div>
        </div>

        <nav className="flex p-4 flex-col space-y-1 flex-1">
          {[{ id: "overview", label: "Dashboard", icon: Home }, { id: "projects", label: "My Forms", icon: Layers }, { id: "settings", label: "Settings", icon: Settings }].map(t => (
            <button key={t.id} onClick={() => switchTab(t.id)} className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all", activeTab === t.id && !isCreatingNew ? "bg-blue-600 shadow-xl" : "text-zinc-500 hover:bg-zinc-900")}>
              <t.icon size={18} /> {t.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <button onClick={() => signOut(auth)} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-500 hover:text-red-500 transition-all font-bold">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="md:ml-64 flex-1 p-4 md:p-10 overflow-y-auto h-full">

        {/* Mobile top bar */}
        <div className="flex md:hidden items-center justify-between mb-6">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
            <Menu size={22} />
          </button>
          <Link href="/" className="text-lg font-bold flex items-center gap-2">
            <Zap size={18} fill="#3b82f6" /> SendMyForm
          </Link>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border-2 border-zinc-700 object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-black">{userInitial}</div>
          )}
        </div>

        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-8 border-b border-zinc-800">
          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-full border border-zinc-800"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active System</span></div>
          <button onClick={() => { setIsCreatingNew(true); setActiveTab(""); setError(null); }} className="bg-blue-600 px-6 md:px-8 py-2.5 rounded-xl text-sm font-bold shadow-xl hover:bg-blue-500 transition-all w-full sm:w-auto text-center">+ New project</button>
        </header>

        {error && (
          <div className="mb-10 p-4 md:p-6 bg-red-500/10 border border-red-500/20 rounded-2xl md:rounded-3xl flex items-center gap-4 text-red-500">
            <X size={20} /> <p className="text-sm font-bold uppercase tracking-widest">{error}</p>
          </div>
        )}

        {isCreatingNew ? (
          <div className="bg-zinc-950 p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-zinc-800 max-w-xl text-left animate-fade-in shadow-2xl">
            <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 italic">Establish Node</h2>
            <div className="space-y-6 mb-8 md:mb-10 text-left">
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase mb-3 block tracking-widest">Identity Name</label>
                <input type="text" placeholder="e.g. Hero Section Form" value={newName} onChange={e => setNewName(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-4 outline-none focus:border-blue-600 shadow-inner" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase mb-3 block tracking-widest">URL Slug</label>
                <div className="flex items-center bg-black border border-zinc-800 rounded-2xl px-5 py-4 focus-within:border-blue-600 shadow-inner">
                  <span className="text-zinc-600 text-sm font-mono mr-2">/api/f/</span>
                  <input type="text" placeholder="contact-form" value={newSlug} onChange={e => setNewSlug(e.target.value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))} className="bg-transparent flex-1 outline-none text-white font-mono text-sm" />
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={handleCreate} disabled={!newName || !newSlug || isCreating} className="flex-1 py-4 bg-white text-black rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50">{isCreating ? "Establishing Node..." : "Establish Protocol"}</button>
              <button onClick={() => setIsCreatingNew(false)} className="px-8 py-4 bg-zinc-800 rounded-2xl font-bold">Cancel</button>
            </div>
          </div>
        ) : activeTab === "overview" ? (
          <div className="animate-fade-in text-left">
            <h1 className="text-3xl md:text-5xl font-black mb-8 md:mb-12">Mainframe</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div className="p-8 md:p-10 bg-zinc-950 rounded-[2rem] md:rounded-[3rem] border border-zinc-800 shadow-xl"><p className="text-zinc-500 text-xs font-bold uppercase mb-2 tracking-widest">Total Nodes</p><p className="text-4xl md:text-6xl font-black">{projects.length}</p></div>
              <div className="p-8 md:p-10 bg-zinc-950 rounded-[2rem] md:rounded-[3rem] border border-zinc-800 text-left"><p className="text-zinc-500 text-xs font-bold uppercase mb-2 tracking-widest">Data Protection</p><p className="text-xl md:text-2xl font-bold text-blue-500 flex items-center gap-3 italic"><ShieldCheck size={28} /> Zero Storage Active</p></div>
            </div>
          </div>
        ) : activeTab === "projects" && currentProject ? (
          <div className="animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white uppercase italic">{currentProject.name}</h3>
              <div className="flex gap-4 w-full sm:w-auto">
                <select onChange={e => setSelectedProjectId(e.target.value)} value={selectedProjectId || ""} className="bg-zinc-900 border border-zinc-800 px-4 md:px-6 py-2.5 rounded-xl outline-none cursor-pointer text-sm flex-1 sm:flex-none">
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <button onClick={() => deleteProj(currentProject.id)} className="p-2.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20} /></button>
              </div>
            </div>
            <div className="bg-zinc-950 p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-zinc-800 text-left mb-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[80px]"></div>
              <p className="text-zinc-500 text-xs font-bold uppercase mb-3 flex items-center gap-2 tracking-widest"><Link2 size={14} /> Node Ingress Point</p>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-black p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-zinc-800 mb-8 shadow-inner">
                <code className="text-blue-400 text-xs sm:text-sm font-mono tracking-tighter break-all">{origin}/api/f/{currentProject.slug || currentProject.id}</code>
                <button onClick={() => { navigator.clipboard.writeText(`${origin}/api/f/${currentProject.slug || currentProject.id}`); setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000) }} className="bg-zinc-800 p-3 rounded-2xl border border-zinc-700 hover:bg-zinc-700 transition-all shrink-0">{copiedLink ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}</button>
              </div>
              <p className="text-zinc-500 text-xs font-bold uppercase mb-4 opacity-50 tracking-widest">Integration Point</p>
              <div className="bg-black p-4 md:p-6 rounded-2xl border border-zinc-800 shadow-inner overflow-x-auto">
                <code className="text-zinc-400 text-xs font-mono italic whitespace-nowrap">{`<form action="${origin}/api/f/${currentProject.slug || currentProject.id}" method="POST">`}</code>
              </div>
            </div>
          </div>

        ) : activeTab === "settings" ? (
          <div className="animate-fade-in text-left">
            <h1 className="text-3xl md:text-5xl font-black mb-8 md:mb-12">Settings</h1>

            {/* Profile Card */}
            <div className="bg-zinc-950 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-zinc-800 shadow-xl mb-6 md:mb-8">
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">Profile</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-20 h-20 rounded-2xl border-2 border-zinc-700 object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-violet-600 flex items-center justify-center text-2xl font-black">{userInitial}</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xl md:text-2xl font-black text-white mb-1">{user?.displayName || "User"}</p>
                  <p className="text-sm text-zinc-500 break-all">{user?.email}</p>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-2 italic">UID: {user?.uid?.slice(0, 12)}...</p>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
              <div className="bg-zinc-950 p-6 md:p-8 rounded-[2rem] border border-zinc-800">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Account Status</p>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  <p className="text-lg font-bold text-emerald-400 italic">Active</p>
                </div>
              </div>
              <div className="bg-zinc-950 p-6 md:p-8 rounded-[2rem] border border-zinc-800">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Total Forms</p>
                <p className="text-3xl font-black">{projects.length}</p>
              </div>
              <div className="bg-zinc-950 p-6 md:p-8 rounded-[2rem] border border-zinc-800">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Sign-In Method</p>
                <p className="text-lg font-bold text-blue-400 italic flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                  Google
                </p>
              </div>
              <div className="bg-zinc-950 p-6 md:p-8 rounded-[2rem] border border-zinc-800">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Data Policy</p>
                <p className="text-lg font-bold text-violet-400 italic flex items-center gap-2"><ShieldCheck size={20} /> Zero Persistence</p>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-zinc-950 p-6 md:p-8 rounded-[2rem] border border-red-500/20">
              <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">Danger Zone</p>
              <button onClick={() => signOut(auth)} className="px-8 py-3 bg-red-500/10 text-red-500 border border-red-500/30 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all text-sm uppercase tracking-widest">
                Sign Out
              </button>
            </div>
          </div>
        ) : null}
      </main>
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
      `}</style>
    </div>
  );
}
