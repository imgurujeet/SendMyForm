"use client";
import React, { useEffect, useState, useMemo } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, limit, doc, deleteDoc } from "firebase/firestore";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Layers, 
  Mail, 
  BarChart3, 
  Settings, 
  Plus, 
  LogOut, 
  ExternalLink, 
  Zap, 
  CheckCircle2, 
  Eye, 
  FileJson,
  Palette,
  Megaphone,
  ArrowRight,
  ShieldCheck,
  Globe,
  Bell,
  Trash2,
  Copy,
  Check,
  Link2,
  Search,
  X,
  Target,
  RefreshCw,
  Terminal
} from "lucide-react";
import { THEMES } from "@/lib/themes";
import { cn } from "@/lib/utils";

export default function UserStudio() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); 
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  const [mounted, setMounted] = useState(false);
  const [globalAds, setGlobalAds] = useState<any>({ adTitle: "", adText: "", adLink: "" });
  const [copiedKey, setCopiedKey] = useState(false);
  
  // Workspace UI Logic
  const [slugInput, setSlugInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [isSlugChecking, setIsSlugChecking] = useState(false);
  const [slugStatus, setSlugStatus] = useState<"idle" | "available" | "taken">("idle");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
    
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const qProjects = query(collection(db, "projects"), where("uid", "==", u.uid));
        const unsubProjects = onSnapshot(qProjects, (snap) => {
          const pData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setProjects(pData);
          if (pData.length > 0 && !selectedProjectId) setSelectedProjectId(pData[0].id);
          setLoading(false);
        });

        return () => { unsubProjects(); };
      } else {
        window.location.href = "/auth";
      }
    });

    fetch("/api/admin/config").then(r => r.json()).then(setGlobalAds).catch(() => {});
    return () => unsubAuth();
  }, []);

  const currentProject = useMemo(() => projects.find(p => p.id === selectedProjectId) || projects[0], [projects, selectedProjectId]);

  useEffect(() => {
     if (currentProject) {
        setSlugInput(currentProject.slug || "");
        setEmailInput(currentProject.emailTo || "");
     }
  }, [currentProject?.id]);

  const checkSlugAvailability = async () => {
    if (!slugInput || slugInput === currentProject.slug) return;
    setIsSlugChecking(true);
    try {
       const res = await fetch("/api/project/check-slug", {
          method: "POST",
          body: JSON.stringify({ slug: slugInput }),
          headers: { "Content-Type": "application/json" }
       });
       const { available } = await res.json();
       setSlugStatus(available ? "available" : "taken");
    } finally {
       setIsSlugChecking(false);
    }
  };

  const saveSlug = async () => {
     if (slugStatus !== "available") return;
     try {
        await updateSetting(currentProject.id, "slug", slugInput);
        setSlugStatus("idle");
     } catch (err) { console.error(err); }
  }

  const saveEmailDelivery = async () => {
     if (!emailInput) return;
     try {
        await updateSetting(currentProject.id, "emailTo", emailInput);
        alert("Success! Your notifications will now be delivered to " + emailInput);
     } catch (err) { console.error(err); }
  }

  const updateSetting = async (projectId: string, field: string, value: any) => {
    try {
      await fetch("/api/project/update-settings", {
        method: "POST",
        body: JSON.stringify({ projectId, settings: { [field]: value } }),
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) { console.error("Update error", err); }
  };

  const createNewProject = async () => {
    const name = prompt("Name your new form (example: Contact Page)");
    if (!name) return;
    try {
       await fetch("/api/project/create", {
          method: "POST",
          body: JSON.stringify({ uid: user.uid, name, emailTo: user.email }),
          headers: { "Content-Type": "application/json" }
       });
    } catch (err) { console.error("Creation failed", err); }
  };

  const deleteProject = async (id: string) => {
    if (confirm("Delete this form forever? You won't be able to recover it.")) {
       await deleteDoc(doc(db, "projects", id));
       setSelectedProjectId(null);
    }
  }

  const copyEndpoint = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  }

  if (!mounted || loading) return <div className="flex h-screen items-center justify-center bg-black text-white font-black italic tracking-tighter animate-pulse">SENDMYFORM ENGINE BOOTING...</div>;

  return (
    <div className="flex min-h-screen bg-black text-slate-100 font-sans selection:bg-violet-600/50 overflow-x-hidden">
      
      {/* Background Production Glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-violet-600/5 blur-[140px] rounded-full -translate-y-1/2 translate-x-1/4"></div>

      {/* --- DASHBOARD SIDEBAR --- */}
      <aside className="w-72 border-r border-white/5 bg-black flex flex-col sticky top-0 h-screen shrink-0 z-50">
        <div className="p-10">
          <Link href="/" className="text-2xl font-black tracking-tightest italic hover:text-violet-500 transition-all uppercase">
            SendMyForm <span className="text-violet-600 block text-[10px] font-bold tracking-[0.4em] mt-1 italic italic">BY achaiabs</span>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {[
            { id: "overview", label: "Studio Hub", icon: LayoutDashboard },
            { id: "forms", label: "Active Nodes", icon: Layers },
            { id: "analytics", label: "System Insights", icon: BarChart3 },
            { id: "settings", label: "Preferences", icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 group italic",
                activeTab === item.id 
                  ? "bg-violet-600 text-white shadow-2xl shadow-violet-900/40" 
                  : "text-slate-500 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={18} className={cn(activeTab === item.id ? "text-white" : "text-slate-700 group-hover:text-violet-500")} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* --- Featured Partner Ad --- */}
        <div className="p-6 mx-6 mb-8 rounded-[32px] bg-gradient-to-br from-slate-900 to-black border border-white/5 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-violet-600/10 blur-[40px] group-hover:bg-violet-600/40 transition-all"></div>
          <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest mb-3 italic">Launch Status</p>
          <h4 className="text-[11px] font-black text-white mb-1 uppercase italic tracking-tight">{globalAds.adTitle || "SendMyForm v2.0"}</h4>
          <p className="text-[10px] text-slate-500 leading-relaxed mb-4 italic font-medium">{globalAds.adText || "Professional form ingestion at global scale."}</p>
          <Link href={globalAds.adLink || "#"} className="text-[10px] font-black text-violet-400 hover:text-violet-300 flex items-center gap-2 group/btn uppercase tracking-widest italic">
            See More <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="p-6 border-t border-white/5">
           <button onClick={() => signOut(auth)} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-red-500 transition-all italic">
             <LogOut size={16} /> Termination
           </button>
        </div>
      </aside>

      {/* --- DASHBOARD MAIN VIEW --- */}
      <main className="flex-1 max-h-screen overflow-y-auto">
        
        {/* --- TOP STATUS BAR --- */}
        <header className="sticky top-0 z-[50] bg-black/80 backdrop-blur-3xl border-b border-white/5 p-8 flex justify-between items-center px-16">
           <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">GATEWAY: SECURED</p>
           </div>
           <div className="flex items-center gap-6">
              <button onClick={createNewProject} className="flex items-center gap-2 bg-white/5 border border-white/10 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 hover:border-violet-600/50 transition-all italic italic">
                <Plus size={14} /> Provision Node
              </button>
              <div className="h-10 w-[1px] bg-white/5"></div>
              <div className="flex items-center gap-4 group cursor-pointer text-left">
                 <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white italic">{user.displayName || 'Guest User'}</p>
                    <p className="text-[9px] font-bold text-violet-500 uppercase tracking-tighter">Production Clear</p>
                 </div>
                 <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-600 p-[1px]">
                    <div className="w-full h-full rounded-[14px] bg-black flex items-center justify-center font-black uppercase italic text-xs">
                       {user.displayName?.slice(0,1) || 'S'}
                    </div>
                 </div>
              </div>
           </div>
        </header>

        <div className="p-16 max-w-7xl mx-auto w-full">

        {activeTab === "overview" && (
          <div className="animate-fade-in text-left">
             <header className="mb-16">
                <h1 className="text-7xl font-black tracking-tightest mb-3 uppercase italic leading-none">Global <span className="text-violet-600 underline underline-offset-[12px] decoration-white/5">Studio</span></h1>
                <p className="text-slate-500 text-xl font-medium italic uppercase tracking-widest">SendMyForm Infrastructure is Optimized for Launch.</p>
             </header>

             <div className="grid grid-cols-2 gap-8 mb-20 md:mb-32">
                <div className="p-12 rounded-[56px] bg-slate-950/20 border border-white/5 hover:border-violet-600/30 hover:scale-[1.02] transition-all relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-[40px] group-hover:bg-violet-600/15"></div>
                     <div className="flex justify-between items-start mb-10">
                        <div className="p-4 rounded-2xl bg-black border border-white/5 shadow-inner text-blue-500"><Globe size={26} /></div>
                        <span className="text-[10px] font-black text-violet-500 uppercase italic tracking-widest border border-violet-500/10 px-4 py-1.5 rounded-full">Fleet Deployment</span>
                     </div>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Active Ingestion Nodes</p>
                     <p className="text-6xl font-black text-white tracking-tighter uppercase italic">{projects.length}</p>
                </div>
                <div className="p-12 rounded-[56px] bg-slate-950/20 border border-white/5 hover:border-violet-600/30 hover:scale-[1.02] transition-all relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 blur-[40px] group-hover:bg-emerald-600/15"></div>
                     <div className="flex justify-between items-start mb-10">
                        <div className="p-4 rounded-2xl bg-black border border-white/5 shadow-inner text-emerald-500"><ShieldCheck size={26} /></div>
                        <span className="text-[10px] font-black text-emerald-500 uppercase italic tracking-widest border border-emerald-500/10 px-4 py-1.5 rounded-full">Privacy Enforced</span>
                     </div>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Data Storage Policy</p>
                     <p className="text-4xl font-black text-white tracking-tighter uppercase italic">ZERO_PERSISTENCE</p>
                </div>
             </div>

             <div className="rounded-[64px] bg-slate-950/20 border border-white/5 p-16 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[120px]"></div>
                <div className="flex justify-between items-center mb-16">
                   <h3 className="font-black text-4xl text-white uppercase italic tracking-tighter">Production <span className="text-violet-600">Guidance</span></h3>
                   <Link href="/docs" className="text-[12px] font-black text-violet-500 hover:text-white uppercase tracking-widest italic transition-all border-b border-violet-500/20 pb-2 flex items-center gap-2">Protocol Architecture <ExternalLink size={14} /></Link>
                </div>
                <div className="grid grid-cols-2 gap-8">
                   <div className="p-10 rounded-[40px] bg-black border border-white/5 hover:border-violet-500/40 transition-all">
                      <Terminal size={24} className="text-violet-500 mb-6" />
                      <h4 className="text-lg font-black text-white uppercase italic mb-3">Live Ingestion</h4>
                      <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest italic leading-relaxed">Simply point your frontend to our global endpoint nodes. We handle the routing and ad-powered confirmations instantly.</p>
                   </div>
                   <div className="p-10 rounded-[40px] bg-black border border-white/5 hover:border-violet-600/40 transition-all">
                      <Mail size={24} className="text-emerald-500 mb-6" />
                      <h4 className="text-lg font-black text-white uppercase italic mb-3">Instant Routing</h4>
                      <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest italic leading-relaxed">We deliver leads directly to your inbox. No data stays on our servers—privacy is hardcoded into the SendMyForm protocol.</p>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === "forms" && (
          <div className="animate-fade-in text-left">
             <div className="flex justify-between items-center mb-16">
                <h2 className="text-5xl font-black uppercase italic tracking-tightest">Design <span className="text-violet-600">Nodes</span></h2>
                <div className="flex gap-4">
                   <select 
                     onChange={(e) => {
                        setSelectedProjectId(e.target.value);
                        setSlugStatus("idle");
                     }} 
                     value={selectedProjectId || ""}
                     className="px-10 py-5 rounded-3xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white focus:border-violet-500 transition-all italic outline-none appearance-none"
                   >
                     {projects.map(p => <option key={p.id} value={p.id} className="bg-slate-950 font-sans">{p.name}</option>)}
                   </select>
                   <button onClick={createNewProject} className="p-5 rounded-3xl bg-violet-600 text-white shadow-2xl shadow-violet-900/40 hover:scale-105 transition-all"><Plus size={28} /></button>
                </div>
             </div>

             {currentProject && (
               <div className="p-16 rounded-[4.5rem] bg-slate-950/20 border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-600 to-pink-600"></div>
                  
                  <div className="flex justify-between items-start mb-20 text-left">
                     <div className="max-w-md">
                        <h3 className="text-5xl font-black text-white italic uppercase mb-4 tracking-tighter">{currentProject.name}</h3>
                        
                        {/* High End Custom Handle Editor */}
                        <div className="flex items-center gap-4 mt-6 p-4 bg-black/40 rounded-[28px] border border-white/5 focus-within:border-violet-600/50 transition-all">
                           <Link2 size={16} className="text-slate-700 ml-2" />
                           <p className="text-[10px] font-black text-slate-500 uppercase italic whitespace-nowrap italic">sendmyform.com/api/f/</p>
                           <input 
                              type="text"
                              value={slugInput}
                              onChange={(e) => {
                                 setSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                                 setSlugStatus("idle");
                              }}
                              placeholder="choose-node-id"
                              className="bg-transparent text-sm font-black text-white outline-none italic placeholder:text-slate-800 w-full italic"
                           />
                           {slugStatus === "available" ? (
                              <button onClick={saveSlug} className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-2xl shadow-lg transition-all animate-bounce"><Check size={14} /></button>
                           ) : (
                              <button 
                                 onClick={checkSlugAvailability} 
                                 disabled={isSlugChecking || !slugInput || slugInput === currentProject.slug}
                                 className="bg-white/5 hover:bg-white/10 text-slate-500 disabled:opacity-20 p-2.5 rounded-2xl transition-all"
                              >
                                 {isSlugChecking ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <Search size={14} />}
                              </button>
                           )}
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <button onClick={() => deleteProject(currentProject.id)} className="p-5 rounded-3xl bg-white/5 border border-white/5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all"><Trash2 size={24} /></button>
                     </div>
                  </div>

                  {/* DELIVERY ROUTING EDITOR */}
                  <div className="p-12 rounded-[48px] bg-black border border-white/5 mb-12 shadow-inner group/delivery">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-violet-600/10 rounded-2xl border border-violet-500/20"><Target size={22} className="text-violet-500" /></div>
                        <h4 className="text-xl font-black italic text-white uppercase tracking-tighter">Delivery Routing</h4>
                     </div>
                     <div className="flex gap-4">
                        <input 
                           type="email"
                           value={emailInput}
                           onChange={(e) => setEmailInput(e.target.value)}
                           placeholder="Primary lead destination"
                           className="flex-1 bg-slate-900/40 border border-white/5 rounded-3xl px-8 py-5 text-sm font-black text-white italic placeholder:text-slate-800 outline-none focus:border-violet-600/50 transition-all italic"
                        />
                        <button onClick={saveEmailDelivery} className="px-10 py-5 bg-white text-black font-black uppercase text-xs rounded-3xl hover:bg-violet-600 hover:text-white transition-all italic italic flex items-center gap-3">
                           Establish Path
                        </button>
                     </div>
                  </div>

                  {/* CODE SNIPPET AREA */}
                  <div className="p-12 rounded-[48px] bg-black border border-white/5 mb-16 shadow-inner relative group/code overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-[60px] group-hover/code:bg-violet-600/10 transition-all"></div>
                     <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                           <Zap size={22} className="text-violet-500" />
                           <p className="text-[12px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Your Global Endpoint Address</p>
                        </div>
                        <button onClick={() => copyEndpoint(`${origin}/api/f/${currentProject.slug || currentProject.id}`)} className="text-[11px] font-black text-violet-500 uppercase italic tracking-widest flex items-center gap-3 hover:text-white transition-colors bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                           {copiedKey ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                           {copiedKey ? "Endpoint Copied" : "Copy Form URL"}
                        </button>
                     </div>
                     <pre className="text-base text-violet-400 leading-relaxed font-mono overflow-x-auto p-10 bg-slate-950/20 rounded-[40px] border border-white/5 italic">
                       <code>
{`<form action="${origin}/api/f/${currentProject.slug || currentProject.id}" method="POST">
  <!-- Connect Instantly -->
  <button type="submit">Ingest Data</button>
</form>`}
                       </code>
                     </pre>
                  </div>

                  <div className="grid grid-cols-2 gap-10">
                     <div className="p-12 rounded-[40px] bg-black border border-white/5 hover:border-violet-600/30 transition-all cursor-pointer group">
                        <Mail size={36} className="text-violet-600 mb-6 transition-transform" />
                        <h5 className="text-xl font-black text-white uppercase italic mb-3 tracking-tighter">Direct Ingress</h5>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-loose">Destination: <span className="text-slate-300 font-black italic">{currentProject.emailTo}</span></p>
                     </div>
                     <div className="p-12 rounded-[40px] bg-black border border-white/5 hover:border-emerald-600/30 transition-all cursor-pointer group text-left">
                        <ShieldCheck size={36} className="text-emerald-600 mb-6 transition-transform" />
                        <h5 className="text-xl font-black text-white uppercase italic mb-3 tracking-tighter">Privacy Bot</h5>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-loose">Mode: <span className="text-emerald-500 font-black italic">MANDATORY_NON_PERSISTENCE</span></p>
                     </div>
                  </div>
               </div>
             )}
          </div>
        )}

        {activeTab === "analytics" && (
           <div className="animate-fade-in text-left">
              <h2 className="text-5xl font-black uppercase italic tracking-tightest mb-16">System <span className="text-violet-600">Insights</span></h2>
              <div className="p-20 text-center bg-white/5 border border-white/5 rounded-[64px] border-dashed">
                 <Activity size={40} className="mx-auto text-violet-500 mb-8" />
                 <p className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-700 italic">Streaming real-time ingestion traffic metrics...</p>
              </div>
           </div>
        )}

        {activeTab === "settings" && (
          <div className="animate-fade-in text-left">
             <h2 className="text-5xl font-black uppercase italic tracking-tightest mb-16">Global <span className="text-violet-600">Preferences</span></h2>
             <div className="p-16 rounded-[4.5rem] bg-slate-950/20 border border-white/5 text-left">
                <div className="flex items-center gap-4 mb-12 text-left">
                   <Palette size={28} className="text-violet-500" />
                   <h4 className="text-2xl font-black uppercase italic text-white tracking-tighter">Visual Themes</h4>
                </div>
                <div className="grid grid-cols-4 gap-8 text-left">
                   {Object.values(THEMES).map((theme) => (
                     <button 
                       key={theme.id}
                       onClick={() => updateSetting(currentProject.id, "theme", theme.id)}
                       className={cn(
                         "p-1.5 rounded-[40px] border-2 transition-all group scale-[0.98] hover:scale-100",
                         currentProject.theme === theme.id ? "border-violet-600 shadow-2xl shadow-violet-900/40" : "border-transparent"
                       )}
                     >
                        <div className="p-10 rounded-[34px] h-56 flex flex-col items-center justify-center text-center relative overflow-hidden" style={{ background: theme.bg }}>
                           <div className="absolute top-0 right-0 w-16 h-16 blur-2xl opacity-40" style={{ background: theme.accent }}></div>
                           <p className="text-[11px] font-black uppercase tracking-widest italic" style={{ color: theme.text }}>{theme.name}</p>
                           <div className="mt-8 w-14 h-14 rounded-3xl shadow-2xl" style={{ background: theme.primary }}></div>
                        </div>
                     </button>
                   ))}
                </div>
             </div>
          </div>
        )}

        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); scale: 0.95; }
          to { opacity: 1; transform: translateY(0); scale: 1; }
        }
        .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .tracking-tightest { letter-spacing: -0.09em; }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #111; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #6d28d9; }
      `}</style>
    </div>
  );
}
