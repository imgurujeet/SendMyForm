"use client";
import React, { useEffect, useState, useMemo } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, onSnapshot, limit, orderBy } from "firebase/firestore";
import Link from "next/link";
import { 
  ShieldAlert, 
  Users, 
  BarChart4, 
  Megaphone, 
  Mail, 
  Plus, 
  Settings, 
  ExternalLink, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Globe,
  Settings2,
  CheckCircle,
  XCircle,
  Activity,
  UserPlus,
  Code2,
  Layout,
  Target,
  LayoutGrid,
  Zap,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SuperAdmin() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ users: 0, projects: 0, submissions: 0, growth: 12.5 });
  const [config, setConfig] = useState<any>({ 
    topAd: "", 
    middleAd: "", 
    bottomAd: "",
    sideAd: "",
    brandingName: "sendmyform",
  });
  const [activeTab, setActiveTab] = useState("overview"); // overview, ads, users, monitoring
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      if (u && (u.email === "achaialabs@gmail.com" || u.email?.endsWith("@achaialabs.tech"))) {
        setIsAdmin(true);
        setUser(u);
        loadAdminData();
      } else {
        window.location.href = "/auth";
      }
      setLoading(false);
    });
    return () => unsubAuth();
  }, []);

  const loadAdminData = () => {
    onSnapshot(collection(db, "projects"), (snap) => {
      const uniqueUids = new Set(snap.docs.map(d => d.data().uid));
      setStats(prev => ({ ...prev, users: uniqueUids.size, projects: snap.size }));
      const userList = Array.from(uniqueUids).map(uid => ({ uid, count: snap.docs.filter(d => d.data().uid === uid).length }));
      setAllUsers(userList.sort((a,b) => b.count - a.count).slice(0, 10));
    });

    onSnapshot(collection(db, "submissions"), (snap) => {
      setStats(prev => ({ ...prev, submissions: snap.size }));
    });

    fetch("/api/admin/config").then(r => r.json()).then(setConfig);
  };

  const saveConfig = async () => {
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        body: JSON.stringify(config),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) alert("Campaign Clusters Updated! Your AdSense units are now live.");
    } catch (err) { alert("Config update failed"); }
  };

  if (loading || !isAdmin) return <div className="h-screen flex items-center justify-center bg-slate-950 text-white font-bold tracking-tighter italic">🛡️ AUTHENTICATING ADMIN...</div>;

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 selection:bg-rose-500/30 overflow-hidden">
      
      {/* --- ADMIN SIDEBAR --- */}
      <aside className="w-72 border-r border-white/5 bg-slate-950 flex flex-col p-8 shrink-0">
        <div className="flex items-center gap-3 mb-12">
           <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-900/40 font-black text-xl italic">A</div>
           <h2 className="text-xl font-black tracking-tighter">achaia <span className="text-rose-500">HQ</span></h2>
        </div>

        <nav className="flex-1 space-y-1">
           {[
             { id: "overview", label: "Global Insights", icon: BarChart4 },
             { id: "ads", label: "Multi-Ad Monetization", icon: Megaphone },
             { id: "users", label: "User Management", icon: Users },
             { id: "monitoring", label: "System Monitoring", icon: Activity },
           ].map(item => (
             <button 
               key={item.id} 
               onClick={() => setActiveTab(item.id)}
               className={cn(
                 "w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold tracking-tight transition-all duration-300 group",
                 activeTab === item.id ? "bg-rose-600 shadow-lg shadow-rose-900/20 text-white" : "text-slate-500 hover:text-white hover:bg-slate-900"
               )}
             >
                <item.icon size={20} className={cn(activeTab === item.id ? "text-white" : "group-hover:text-rose-400")} />
                {item.label}
             </button>
           ))}
        </nav>

        <div className="mt-auto space-y-6">
           <div className="p-5 rounded-3xl bg-slate-900/50 border border-white/5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Server Status</p>
              <div className="flex items-center gap-2 mb-1">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-glow shadow-emerald-500/50"></div>
                 <p className="text-xs font-bold text-slate-300">Region: <span className="text-white uppercase font-black">Global-01</span></p>
              </div>
           </div>
           <button onClick={() => signOut(auth)} className="w-full py-4 text-xs font-black text-slate-500 hover:text-rose-500 transition-colors uppercase tracking-[0.2em] border-t border-white/5">Terminal Logout</button>
        </div>
      </aside>

      {/* --- DASHBOARD VIEW --- */}
      <main className="flex-1 overflow-y-auto p-12 max-w-7xl mx-auto w-full">
        
        {activeTab === "overview" && (
          <div className="animate-fade-in">
             <header className="mb-12">
                <h1 className="text-5xl font-black tracking-tightest uppercase italic mb-2">Platform <span className="text-rose-500">Pulse</span></h1>
                <p className="text-slate-400 font-medium italic uppercase tracking-widest">Global Node Performance Engine</p>
             </header>

             <div className="grid grid-cols-4 gap-6 mb-12">
                {[
                  { label: "Total Users", val: stats.users, icon: Users, trend: "+8.4%", up: true },
                  { label: "Active Nodes", val: stats.projects, icon: Globe, trend: "+45", up: true },
                  { label: "Submissions", val: stats.submissions, icon: TrendingUp, trend: "+2.1k", up: true },
                  { label: "Ad Units Live", val: "3", icon: Megaphone, trend: "STABLE", up: true },
                ].map((s, i) => (
                  <div key={i} className="p-8 rounded-[40px] bg-slate-950/50 border border-white/5 hover:border-rose-500/30 hover:scale-[1.02] transition-all group relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-rose-600/5 blur-3xl group-hover:bg-rose-600/10"></div>
                     <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-slate-900 rounded-2xl shadow-inner"><s.icon size={22} className="text-rose-500" /></div>
                        <span className={cn("text-[10px] font-black px-2 py-1 rounded-lg", s.up ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500")}>{s.trend}</span>
                     </div>
                     <p className="text-3xl font-black tracking-tighter text-white mb-1 italic">{s.val}</p>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{s.label}</p>
                  </div>
                ))}
             </div>

             <div className="p-10 rounded-[48px] bg-slate-950/50 border border-white/5">
                <h3 className="text-xl font-black uppercase text-white tracking-tight mb-8 italic">Dev <span className="text-rose-500">Fleet</span> Activity</h3>
                <div className="space-y-6">
                   {allUsers.map((u, i) => (
                      <div key={i} className="flex items-center justify-between group">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-rose-500 border border-white/5 italic">{i+1}</div>
                            <div>
                               <p className="text-sm font-black text-white italic">{u.uid.slice(0, 15)}...</p>
                               <p className="text-[10px] font-bold text-slate-500 uppercase italic">{u.count} active Projects</p>
                            </div>
                         </div>
                         <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"><ExternalLink size={16} className="text-slate-500 hover:text-white" /></button>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === "ads" && (
          <div className="animate-fade-in text-left">
             <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl font-black uppercase tracking-tightest italic text-white">AdSense <span className="text-rose-500">Multi-Channel</span> Engine</h2>
                <div className="flex items-center gap-3 px-6 py-2 rounded-full border border-rose-600/30 bg-rose-600/10 text-rose-500 text-[10px] font-black uppercase tracking-widest italic animate-pulse">
                   <Target size={14} /> Global Injection Active
                </div>
             </div>
             
             <div className="space-y-12">
                {/* 1. TOP AD ENGINE */}
                <div className="p-16 rounded-[4.5rem] bg-slate-950/40 border border-white/5 relative overflow-hidden group">
                   <div className="flex items-center gap-4 mb-10">
                      <div className="p-4 bg-rose-600/10 rounded-2xl border border-rose-500/20"><ArrowUp size={24} className="text-rose-500" /></div>
                      <div>
                        <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">Slot 01: Top Leaderboard</h4>
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">Renders at the head of every Thank You node.</p>
                      </div>
                   </div>
                   <textarea 
                     className="w-full bg-[#020617] border border-white/10 rounded-[32px] p-10 text-sm font-mono text-emerald-400 focus:border-rose-500/40 transition-all h-[150px] outline-none shadow-inner" 
                     value={config.topAd} 
                     onChange={(e) => setConfig({...config, topAd: e.target.value})} 
                     placeholder="Paste AdSense Leaderboard code here..." 
                   />
                </div>

                {/* 2. MIDDLE AD ENGINE */}
                <div className="p-16 rounded-[4.5rem] bg-slate-950/40 border border-white/5 relative overflow-hidden group">
                   <div className="flex items-center gap-4 mb-10">
                      <div className="p-4 bg-rose-600/10 rounded-2xl border border-rose-500/20"><LayoutGrid size={24} className="text-rose-500" /></div>
                      <div>
                        <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">Slot 02: Native Conversion Square</h4>
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">Injected directly below the 'Form Submitted' signal.</p>
                      </div>
                   </div>
                   <textarea 
                     className="w-full bg-[#020617] border border-white/10 rounded-[32px] p-10 text-sm font-mono text-emerald-400 focus:border-rose-500/40 transition-all h-[150px] outline-none shadow-inner" 
                     value={config.middleAd} 
                     onChange={(e) => setConfig({...config, middleAd: e.target.value})} 
                     placeholder="Paste AdSense In-Article or Square code here..." 
                   />
                </div>

                {/* 3. BOTTOM AD ENGINE */}
                <div className="p-16 rounded-[4.5rem] bg-slate-950/40 border border-white/5 relative overflow-hidden group">
                   <div className="flex items-center gap-4 mb-10">
                      <div className="p-4 bg-rose-600/10 rounded-2xl border border-rose-500/20"><ArrowDown size={24} className="text-rose-500" /></div>
                      <div>
                        <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">Slot 03: Footer Engagement Banner</h4>
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">The final monetization touchpoint on the page.</p>
                      </div>
                   </div>
                   <textarea 
                     className="w-full bg-[#020617] border border-white/10 rounded-[32px] p-10 text-sm font-mono text-emerald-400 focus:border-rose-500/40 transition-all h-[150px] outline-none shadow-inner" 
                     value={config.bottomAd} 
                     onChange={(e) => setConfig({...config, bottomAd: e.target.value})} 
                     placeholder="Paste AdSense Footer Banner code here..." 
                   />
                </div>

                <div className="mt-12 flex justify-end">
                   <button onClick={saveConfig} className="bg-rose-600 hover:bg-rose-500 text-white font-black uppercase text-xs tracking-widest px-16 py-6 rounded-3xl shadow-2xl shadow-rose-900/30 transition-all hover:scale-105 active:scale-95 italic flex items-center gap-4">
                     <Zap size={18} fill="currentColor" />
                     Sync AdSense Multi-Fleet
                   </button>
                </div>
             </div>
          </div>
        )}

      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); scale: 0.98; }
          to { opacity: 1; transform: translateY(0); scale: 1; }
        }
        .animate-fade-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .tracking-tightest { letter-spacing: -0.06em; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: #0f172a; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #e11d48; }
      `}</style>
    </div>
  );
}
