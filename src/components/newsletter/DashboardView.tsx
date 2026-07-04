"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, Mail, FileText, TrendingUp, TrendingDown, Plus, 
  ArrowRight, Sparkles, Zap, Award, Calendar, ChevronRight
} from "lucide-react";
import { collection, query, where, onSnapshot, limit, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Recharts components
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardViewProps {
  user: any;
  setActiveTab: (tab: string) => void;
}

export default function DashboardView({ user, setActiveTab }: DashboardViewProps) {
  const [contacts, setContacts] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch counts and datasets
  useEffect(() => {
    // 1. Fetch contacts
    const qContacts = query(collection(db, "contacts"), where("uid", "==", user.uid));
    const unsubContacts = onSnapshot(qContacts, (snap) => {
      setContacts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    // 2. Fetch campaigns
    const qCamps = query(collection(db, "campaigns"), where("uid", "==", user.uid));
    const unsubCamps = onSnapshot(qCamps, (snap) => {
      setCampaigns(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 3. Fetch lists
    const qLists = query(collection(db, "lists"), where("uid", "==", user.uid));
    const unsubLists = onSnapshot(qLists, (snap) => {
      setLists(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubContacts();
      unsubCamps();
      unsubLists();
    };
  }, [user.uid]);

  // Derived stats
  const activeSubs = React.useMemo(() => contacts.filter(c => c.status === "subscribed").length, [contacts]);
  const sentCampaigns = React.useMemo(() => campaigns.filter(c => c.status === "sent").length, [campaigns]);
  
  const avgRates = React.useMemo(() => {
    const sentCamps = campaigns.filter(c => c.status === "sent");
    if (sentCamps.length === 0) return { open: 0, click: 0 };
    
    let totalSent = 0;
    let totalOpens = 0;
    let totalClicks = 0;
    
    sentCamps.forEach(c => {
      totalSent += c.sentCount || 0;
      totalOpens += c.openCount || 0;
      totalClicks += c.clickCount || 0;
    });

    if (totalSent === 0) return { open: 0, click: 0 };

    return {
      open: parseFloat(((totalOpens / totalSent) * 100).toFixed(1)),
      click: parseFloat(((totalClicks / totalSent) * 100).toFixed(1))
    };
  }, [campaigns]);

  // Sort and filter datasets for recent activities
  const recentSubscribers = React.useMemo(() => {
    return [...contacts]
      .sort((a, b) => (b.joinedDate?.seconds || 0) - (a.joinedDate?.seconds || 0))
      .slice(0, 5);
  }, [contacts]);

  const recentCampaigns = React.useMemo(() => {
    return [...campaigns]
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      .slice(0, 3);
  }, [campaigns]);

  // Growth chart: calculate subscribers count over the last 7 days
  const growthChartData = React.useMemo(() => {
    const data = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dayStr = d.toLocaleDateString("en-US", { weekday: "short" });
      
      // Calculate how many contacts joined before or on this day
      const countOnDay = contacts.filter(c => {
        if (!c.joinedDate) return true;
        const joinedDate = c.joinedDate.toDate ? c.joinedDate.toDate() : new Date(c.joinedDate);
        return joinedDate.getTime() <= d.getTime();
      }).length;

      data.push({ name: dayStr, Subscribers: countOnDay });
    }
    return data;
  }, [contacts]);

  if (loading) {
    return (
      <div className="h-60 flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest text-xs italic animate-pulse">
        Fetching Dashboard Node...
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      
      {/* Welcome Banner */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tight text-white mb-1">
            Newsletter <span className="text-violet-500">Hub</span>
          </h1>
          <p className="text-sm text-slate-400">Launch campaigns, manage segments, and review growth indices in real time.</p>
        </div>
        
        {/* Quick Action Pill buttons */}
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={() => setActiveTab("campaigns")}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-505 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-violet-900/30"
          >
            <Plus size={14} /> Write Campaign
          </button>
          <button 
            onClick={() => setActiveTab("contacts")}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-white/5 hover:border-white/10 text-slate-300 text-xs font-black uppercase tracking-wider rounded-xl transition-all"
          >
            Import CSV
          </button>
        </div>
      </header>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Subscribers", val: activeSubs, trend: "+12.4%", up: true, icon: Users, tab: "contacts" },
          { label: "Campaigns Executed", val: sentCampaigns, trend: "Stable", up: true, icon: Mail, tab: "campaigns" },
          { label: "Average Open Rate", val: `${avgRates.open}%`, trend: "Industry: 21%", up: true, icon: Award, tab: "analytics" },
          { label: "Mailing Segments", val: lists.length, trend: "Total segments", up: true, icon: FileText, tab: "lists" }
        ].map((s, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(s.tab)}
            className="p-6 rounded-[32px] bg-slate-950/50 border border-white/5 hover:border-violet-500/20 hover:scale-[1.01] transition-all text-left flex flex-col justify-between h-36 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-violet-600/5 blur-2xl group-hover:bg-violet-600/10 transition-colors" />
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</span>
              <div className="p-2 rounded-xl bg-slate-900 border border-white/5 text-violet-400">
                <s.icon size={14} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white italic tracking-tight">{s.val}</h3>
              <p className="text-[9px] text-slate-500 font-semibold mt-0.5">{s.trend}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Main dashboard data rows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Growth line chart */}
        <div className="lg:col-span-2 p-6 rounded-[32px] bg-slate-950/50 border border-white/5 flex flex-col justify-between h-96">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1 flex items-center gap-1.5">
              <TrendingUp size={14} className="text-violet-400" /> Growth Trajectory
            </h3>
            <p className="text-[10px] text-slate-500 font-semibold">Unique mailing list subscribers accrued over the current week.</p>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                <ChartTooltip 
                  contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px" }}
                  labelStyle={{ color: "#94a3b8", fontSize: "10px", fontWeight: "bold" }}
                  itemStyle={{ fontSize: "11px" }}
                />
                <Area type="monotone" dataKey="Subscribers" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSubs)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity feed */}
        <div className="p-6 rounded-[32px] bg-slate-950/50 border border-white/5 flex flex-col justify-between h-96">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1 flex items-center gap-1.5">
              <Zap size={14} className="text-violet-400 animate-pulse" /> Subscriber Enlistments
            </h3>
            <p className="text-[10px] text-slate-500 font-semibold">Real-time log of recent email verification signals.</p>
          </div>

          <div className="flex-1 overflow-y-auto mt-4 space-y-3 pr-1">
            {recentSubscribers.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[10px] text-slate-500 italic">
                Waiting for contacts...
              </div>
            ) : (
              recentSubscribers.map((sub) => (
                <div key={sub.email} className="p-3 bg-slate-900/30 border border-white/5 rounded-xl flex items-center justify-between text-[11px] hover:border-violet-500/20 transition-colors">
                  <div>
                    <p className="font-bold text-white truncate max-w-[130px]">{sub.name || "Anonymous"}</p>
                    <p className="text-[9px] font-mono text-slate-500 mt-0.5">{sub.email}</p>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">
                    {sub.joinedDate?.seconds ? new Date(sub.joinedDate.seconds * 1000).toLocaleDateString() : new Date().toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent campaigns feed */}
      <div className="p-6 rounded-[32px] bg-slate-950/50 border border-white/5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1 flex items-center gap-1.5">
              <Mail size={14} className="text-violet-400" /> Recent Marketing Campaigns
            </h3>
            <p className="text-[10px] text-slate-500 font-semibold">Overview of recent newsletter campaign status and drafts.</p>
          </div>
          <button 
            onClick={() => setActiveTab("campaigns")}
            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-violet-400 hover:text-violet-300 transition-colors"
          >
            View all <ChevronRight size={12} />
          </button>
        </div>

        {recentCampaigns.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500 italic">No campaigns designed yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentCampaigns.map((camp) => (
              <div key={camp.id} className="p-4 bg-slate-900/30 border border-white/5 rounded-2xl flex flex-col justify-between h-36">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                      camp.status === "sent" 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : camp.status === "scheduled" 
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                        : "bg-slate-800 text-slate-400 border border-white/5"
                    }`}>
                      {camp.status}
                    </span>
                    <span className="text-[8px] text-slate-500 font-mono">
                      {camp.createdAt?.seconds ? new Date(camp.createdAt.seconds * 1000).toLocaleDateString() : new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-white truncate">{camp.name}</h4>
                  <p className="text-[9px] text-slate-500 mt-1 truncate">{camp.subject || "No subject header"}</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[9px] text-slate-500 font-bold uppercase">
                  <span>Delivered: {camp.sentCount || 0}</span>
                  <span>Opens: {camp.openCount || 0}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
