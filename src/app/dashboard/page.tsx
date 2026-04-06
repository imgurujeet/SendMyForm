"use client";
import React, { useEffect, useState, useMemo } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import Link from "next/link";
import { Plus, Layers, LogOut, Settings, Home, Copy, Check, X, ShieldCheck, Trash2, Zap, Link2 } from "lucide-react";
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

  if (!mounted || loading) return <div className="h-screen flex items-center justify-center bg-black text-white font-bold tracking-widest animate-pulse">ESTABLISHING CONNECTION...</div>;

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <aside className="w-64 border-r border-zinc-900 bg-zinc-950 flex flex-col fixed h-screen z-50">
        <div className="p-8 border-b border-zinc-800"><Link href="/" className="text-xl font-bold flex items-center gap-2"><Zap size={20} fill="#3b82f6"/> SendMyForm</Link></div>
        <nav className="flex p-4 flex-col space-y-1">
          {[{id:"overview",label:"Dashboard",icon:Home},{id:"projects",label:"My Forms",icon:Layers},{id:"settings",label:"Settings",icon:Settings}].map(t => (
            <button key={t.id} onClick={() => {setActiveTab(t.id); setIsCreatingNew(false); setError(null);}} className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all", activeTab===t.id && !isCreatingNew ? "bg-blue-600 shadow-xl" : "text-zinc-500 hover:bg-zinc-900")}>
              <t.icon size={18} /> {t.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-800"><button onClick={() => signOut(auth)} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-500 hover:text-red-500 transition-all font-bold"><LogOut size={18}/> Logout</button></div>
      </aside>

      <main className="ml-64 flex-1 p-10 max-w-5xl overflow-y-auto h-full">
        <header className="flex justify-between items-center mb-10 pb-8 border-b border-zinc-800">
          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-full border border-zinc-800"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest tracking-widest">Active System</span></div>
          <button onClick={() => {setIsCreatingNew(true); setActiveTab(""); setError(null);}} className="bg-blue-600 px-8 py-2.5 rounded-xl text-sm font-bold shadow-xl hover:bg-blue-500 transition-all">+ New project</button>
        </header>

        {error && (
            <div className="mb-10 p-6 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center gap-4 text-red-500">
               <X size={20} /> <p className="text-sm font-bold uppercase tracking-widest">{error}</p>
            </div>
        )}

        {isCreatingNew ? (
          <div className="bg-zinc-950 p-12 rounded-[3.5rem] border border-zinc-800 max-w-xl text-left animate-fade-in shadow-2xl">
            <h2 className="text-4xl font-bold mb-8 italic">Establish Node</h2>
            <div className="space-y-6 mb-10 text-left">
               <div>
                  <label className="text-[11px] font-bold text-zinc-500 uppercase mb-3 block tracking-widest">Identity Name</label>
                  <input type="text" placeholder="e.g. Hero Section Form" value={newName} onChange={e=>setNewName(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-4 outline-none focus:border-blue-600 shadow-inner" />
               </div>
               <div>
                  <label className="text-[11px] font-bold text-zinc-500 uppercase mb-3 block tracking-widest">URL Slug</label>
                  <div className="flex items-center bg-black border border-zinc-800 rounded-2xl px-5 py-4 focus-within:border-blue-600 shadow-inner">
                     <span className="text-zinc-600 text-sm font-mono mr-2">/api/f/</span>
                     <input type="text" placeholder="contact-form" value={newSlug} onChange={e=>setNewSlug(e.target.value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))} className="bg-transparent flex-1 outline-none text-white font-mono text-sm" />
                  </div>
               </div>
            </div>
            <div className="flex gap-4">
               <button onClick={handleCreate} disabled={!newName||!newSlug||isCreating} className="flex-1 py-4 bg-white text-black rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50">{isCreating ? "Establishing Node..." : "Establish Protocol"}</button>
               <button onClick={()=>setIsCreatingNew(false)} className="px-8 py-4 bg-zinc-800 rounded-2xl font-bold">Cancel</button>
            </div>
          </div>
        ) : activeTab === "overview" ? (
          <div className="animate-fade-in text-left">
             <h1 className="text-5xl font-black mb-12">Mainframe</h1>
             <div className="grid grid-cols-2 gap-8">
                <div className="p-10 bg-zinc-950 rounded-[3rem] border border-zinc-800 shadow-xl"><p className="text-zinc-500 text-xs font-bold uppercase mb-2 tracking-widest">Total Nodes</p><p className="text-6xl font-black">{projects.length}</p></div>
                <div className="p-10 bg-zinc-950 rounded-[3rem] border border-zinc-800 text-left"><p className="text-zinc-500 text-xs font-bold uppercase mb-2 tracking-widest">Data Protection</p><p className="text-2xl font-bold text-blue-500 flex items-center gap-3 italic"><ShieldCheck size={28}/> Zero Storage Active</p></div>
             </div>
          </div>
        ) : activeTab === "projects" && currentProject ? (
          <div className="animate-fade-in text-left">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-bold text-white uppercase italic">{currentProject.name}</h3>
              <div className="flex gap-4">
                 <select onChange={e=>setSelectedProjectId(e.target.value)} value={selectedProjectId||""} className="bg-zinc-900 border border-zinc-800 px-6 py-2.5 rounded-xl outline-none cursor-pointer text-sm">
                   {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                 </select>
                 <button onClick={() => deleteProj(currentProject.id)} className="p-2.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20}/></button>
              </div>
            </div>
            <div className="bg-zinc-950 p-12 rounded-[3.5rem] border border-zinc-800 text-left mb-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[80px]"></div>
              <p className="text-zinc-500 text-xs font-bold uppercase mb-3 flex items-center gap-2 tracking-widest"><Link2 size={14}/> Node Ingress Point</p>
              <div className="flex justify-between items-center bg-black p-6 rounded-[2rem] border border-zinc-800 mb-8 shadow-inner">
                <code className="text-blue-400 text-sm font-mono tracking-tighter">{origin}/api/f/{currentProject.slug || currentProject.id}</code>
                <button onClick={() => {navigator.clipboard.writeText(`${origin}/api/f/${currentProject.slug || currentProject.id}`); setCopiedLink(true); setTimeout(()=>setCopiedLink(false),2000)}} className="bg-zinc-800 p-3 rounded-2xl border border-zinc-700 hover:bg-zinc-700 transition-all">{copiedLink ? <Check size={18} className="text-green-500"/> : <Copy size={18}/>}</button>
              </div>
              <p className="text-zinc-500 text-xs font-bold uppercase mb-4 opacity-50 tracking-widest">Integration Point</p>
              <div className="bg-black p-6 rounded-2xl border border-zinc-800 shadow-inner">
                <code className="text-zinc-400 text-xs font-mono italic">{`<form action="${origin}/api/f/${currentProject.slug || currentProject.id}" method="POST">`}</code>
              </div>
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
