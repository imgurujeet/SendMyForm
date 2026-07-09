"use client";

import React, { useEffect, useState, useMemo } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
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
  ArrowDown,
  FileText,
  PieChart,
  Tag,
  Download,
  Upload,
  Calendar,
  Send,
  Sparkles,
  Smartphone,
  Monitor,
  Eye,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { trackAdminAction, trackTabSwitch } from "@/lib/analytics";
import TipTapEditor from "@/components/TipTapEditor";

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

const PRESET_TEMPLATES = [
  {
    name: "Product Update",
    desc: "For detailing software iterations & features",
    subject: "SendMyForm Product Update: Check out what we built",
    contentHtml: `<h1>SendMyForm Product Update</h1>
<p>Hey {{name}},</p>
<p>We've been hard at work building features to make your experience seamless. Here is what is new:</p>
<h2>🛡️ Advanced Spam Filtering</h2>
<p>Our bot protection model has been updated. You will now see fewer spam submissions in your dashboard with zero configuration changes required.</p>
<h2>⚡ Enhanced Webhooks</h2>
<p>Webhook delivery has been optimized to execute in under 100ms. We have also added support for secure webhook signatures so you can verify the payload comes from SendMyForm.</p>
<h2>🎨 New Styling Themes</h2>
<p>Style your redirect thank-you pages with 5 premium design templates, including sleek glassmorphic themes and dark modes.</p>
<br/>
<p>Try these new features today in your developer dashboard!</p>`,
  },
  {
    name: "Feature Launch",
    desc: "Sleek card layout announcing key feature",
    subject: "Introducing [Feature Name]: Ramping up your productivity!",
    contentHtml: `<h1>Announcing Our Brand New Feature</h1>
<p>Hi {{name}},</p>
<p>We are thrilled to launch our new feature. Here is what you can do with it:</p>
<ul>
  <li>Integrate with 300+ apps.</li>
  <li>Automate data exports.</li>
  <li>Track submissions in real time.</li>
</ul>
<p>We hope this helps you build better workflows!</p>`,
  },
  {
    name: "Weekly Digest",
    desc: "Consolidated updates list for readers",
    subject: "SendMyForm Weekly Digest: Top Articles & Tips",
    contentHtml: `<h1>Your Weekly Roundup</h1>
<p>Here is a summary of articles and resources from this week:</p>
<ul>
  <li><strong>5 Form Security Best Practices</strong></li>
  <li><strong>Optimizing Conversion Rates on Landing Pages</strong></li>
  <li><strong>Getting Started with Zero Persistence Data</strong></li>
</ul>
<p>Hope you find these resources useful!</p>`,
  },
  {
    name: "Security Advisory",
    desc: "High alert red notice styled advisory",
    subject: "Important Security Advisory: Action required",
    contentHtml: `<h1>Important Security Advisory</h1>
<p>We are issuing a security update regarding token verification. Please ensure your API keys are rotated. Action required:</p>
<ol>
  <li>Go to your dashboard settings.</li>
  <li>Click "Rotate API Keys".</li>
  <li>Update your environment variables.</li>
</ol>
<p>If you have any questions, reach out to support immediately.</p>`,
  }
];

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
  
  // Tabs: overview, ads, users, monitoring, newsletter_dashboard, newsletter_subscribers, newsletter_campaigns, newsletter_templates, newsletter_analytics, newsletter_settings
  const [activeTab, setActiveTab] = useState("overview"); 
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  // --- NEWSLETTER STATE ---
  const [nlStats, setNlStats] = useState<any>({
    totalSubscribers: 0,
    activeSubscribers: 0,
    campaignsSent: 0,
    draftCampaigns: 0,
    scheduledCampaigns: 0,
    openRate: 0,
    clickRate: 0,
    bounceRate: 0,
  });
  const [growthChartData, setGrowthChartData] = useState<any[]>([]);
  const [recentSubscribers, setRecentSubscribers] = useState<any[]>([]);
  const [recentCampaigns, setRecentCampaigns] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [processingCron, setProcessingCron] = useState(false);

  // Subscribers page
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [subsTotal, setSubsTotal] = useState(0);
  const [subsPage, setSubsPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [isAddSubModalOpen, setIsAddSubModalOpen] = useState(false);
  const [newSubInput, setNewSubInput] = useState({ email: "", name: "", tags: "" });
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [csvPasteInput, setCsvPasteInput] = useState("");

  // Campaigns page
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [campaignForm, setCampaignForm] = useState<any>({
    name: "",
    subject: "",
    previewText: "",
    audience: { type: "all", tag: "" },
    coverImage: "",
    contentHtml: "",
    contentJson: "",
    ctaButton: { text: "", url: "" },
    internalNotes: "",
    scheduledDate: "",
    sendType: "immediate", // immediate, scheduled
  });
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [campaignPreviewMode, setCampaignPreviewMode] = useState<"desktop" | "mobile">("desktop");

  // Templates page
  const [templates, setTemplates] = useState<any[]>([]);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templateForm, setTemplateForm] = useState({ name: "", subject: "", contentHtml: "", contentJson: "" });
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

  // Analytics page
  const [selectedAnalyticsCampaignId, setSelectedAnalyticsCampaignId] = useState("");
  const [analyticsCampaign, setAnalyticsCampaign] = useState<any>(null);

  // Settings page
  const [nlSettings, setNlSettings] = useState({
    senderName: "SendMyForm Team",
    senderEmail: "achaialabs@gmail.com",
    replyTo: "achaialabs@gmail.com",
    doubleOptIn: true,
    footer: "© 2026 Achaia Labs. All rights reserved.",
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // --- API HELPER ---
  const callNewsletterAdminApi = async (action: string, payload?: any) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/newsletter/admin", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, payload }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Request failed");
      }
      return await res.json();
    } catch (err: any) {
      console.error(`API error for ${action}:`, err);
      alert(`API Error: ${err.message}`);
      return { success: false, error: err.message };
    }
  };

  // Auth & Core Init
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
      setAllUsers(userList.sort((a, b) => b.count - a.count).slice(0, 10));
    }, (err) => {
      console.warn("Firestore projects snapshot read denied (check security rules):", err.message);
    });

    onSnapshot(collection(db, "submissions"), (snap) => {
      setStats(prev => ({ ...prev, submissions: snap.size }));
    }, (err) => {
      console.warn("Firestore submissions snapshot read denied (check security rules):", err.message);
    });

    fetch("/api/admin/config").then(r => r.json()).then(setConfig);
  };

  // Load Newsletter Tab Specific Data
  useEffect(() => {
    if (!isAdmin) return;
    if (activeTab.startsWith("newsletter_")) {
      trackTabSwitch(activeTab);
    }
    
    if (activeTab === "newsletter_dashboard") {
      fetchNlStats();
    } else if (activeTab === "newsletter_subscribers") {
      fetchSubscribers();
    } else if (activeTab === "newsletter_campaigns") {
      fetchCampaigns();
      fetchTemplates();
    } else if (activeTab === "newsletter_templates") {
      fetchTemplates();
    } else if (activeTab === "newsletter_analytics") {
      fetchCampaigns();
    } else if (activeTab === "newsletter_settings") {
      fetchSettings();
    }
  }, [activeTab, isAdmin, subsPage, searchQuery, tagFilter, statusFilter]);

  // Fetch functions
  const fetchNlStats = async () => {
    const res = await callNewsletterAdminApi("getStats");
    if (res.success) {
      setNlStats(res.stats);
      setGrowthChartData(res.charts.growthChart);
      setRecentSubscribers(res.recentActivity.recentSubscribers);
      setRecentCampaigns(res.recentActivity.recentCampaigns);
      
      const logsRes = await callNewsletterAdminApi("getLogs");
      if (logsRes.success) setAuditLogs(logsRes.logs);
    }
  };

  const fetchSubscribers = async () => {
    setLoadingSubs(true);
    const res = await callNewsletterAdminApi("getSubscribers", {
      search: searchQuery,
      tag: tagFilter,
      status: statusFilter,
      page: subsPage,
      limit: 15,
    });
    setLoadingSubs(false);
    if (res.success) {
      setSubscribers(res.subscribers);
      setSubsTotal(res.total);
      setAllTags(res.allTags);
    }
  };

  const fetchCampaigns = async () => {
    const res = await callNewsletterAdminApi("getCampaigns");
    if (res.success) {
      setCampaigns(res.campaigns);
      if (res.campaigns.length > 0 && !selectedAnalyticsCampaignId) {
        setSelectedAnalyticsCampaignId(res.campaigns[0].id);
        setAnalyticsCampaign(res.campaigns[0]);
      }
    }
  };

  const fetchTemplates = async () => {
    const res = await callNewsletterAdminApi("getTemplates");
    if (res.success) setTemplates(res.templates);
  };

  const fetchSettings = async () => {
    const res = await callNewsletterAdminApi("getSettings");
    if (res.success) setNlSettings(res.settings);
  };

  // Actions
  const saveConfig = async () => {
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        body: JSON.stringify(config),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        trackAdminAction("config_save", "ad_config_updated");
        alert("Campaign Clusters Updated! Your AdSense units are now live.");
      }
    } catch (err) { alert("Config update failed"); }
  };

  // Manual cron trigger
  const runScheduler = async () => {
    setProcessingCron(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/newsletter/cron", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchNlStats();
      } else {
        alert(`Failed to run scheduler: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Error running scheduler: ${err.message}`);
    }
    setProcessingCron(false);
  };

  // Add subscriber manually
  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubInput.email) return;
    const tagArray = newSubInput.tags
      ? newSubInput.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
      : [];
    
    const res = await callNewsletterAdminApi("addSubscriber", {
      email: newSubInput.email,
      name: newSubInput.name,
      tags: tagArray,
      status: "subscribed",
    });

    if (res.success) {
      setIsAddSubModalOpen(false);
      setNewSubInput({ email: "", name: "", tags: "" });
      fetchSubscribers();
    }
  };

  // Delete subscriber
  const handleDeleteSub = async (email: string) => {
    if (!confirm(`Are you sure you want to remove ${email}?`)) return;
    const res = await callNewsletterAdminApi("deleteSubscriber", { email });
    if (res.success) fetchSubscribers();
  };

  // CSV Import
  const handleImportCSV = async () => {
    if (!csvPasteInput.trim()) return;
    const lines = csvPasteInput.split("\n");
    const list: any[] = [];
    
    lines.forEach((line) => {
      const parts = line.split(",").map((p) => p.trim());
      if (parts.length > 0 && parts[0].includes("@")) {
        const email = parts[0];
        const name = parts[1] || "";
        const tags = parts[2] ? parts[2].split(";").map((t) => t.trim().toLowerCase()) : ["imported"];
        list.push({ email, name, tags });
      }
    });

    if (list.length === 0) {
      alert("No valid email records found. Format: email, name, tags(separated by semicolon)");
      return;
    }

    const res = await callNewsletterAdminApi("importCSV", { subscribers: list });
    if (res.success) {
      alert(res.message);
      setIsImportModalOpen(false);
      setCsvPasteInput("");
      fetchSubscribers();
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (subscribers.length === 0) return;
    const headers = ["Email", "Name", "Status", "Verified", "Source", "Tags", "Joined Date"];
    const rows = subscribers.map(s => [
      s.email,
      s.name || "",
      s.status,
      s.verified ? "TRUE" : "FALSE",
      s.source || "",
      (s.tags || []).join(";"),
      s.joinedDate?.seconds ? new Date(s.joinedDate.seconds * 1000).toISOString() : new Date(s.joinedDate).toISOString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `newsletter_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Bulk Actions
  const handleBulkAction = async (bulkAction: string) => {
    if (selectedEmails.length === 0) return;
    let tagValue = "";
    
    if (bulkAction === "addTag" || bulkAction === "removeTag") {
      tagValue = window.prompt("Enter tag name:") || "";
      if (!tagValue) return;
      tagValue = tagValue.trim().toLowerCase();
    } else {
      if (!confirm(`Are you sure you want to perform '${bulkAction}' on ${selectedEmails.length} subscribers?`)) return;
    }

    // Build map of existing tags for add/remove tags actions
    const existingTagsMap: Record<string, string[]> = {};
    subscribers.forEach((s) => {
      if (selectedEmails.includes(s.email)) {
        existingTagsMap[s.email] = s.tags || [];
      }
    });

    const res = await callNewsletterAdminApi("bulkActions", {
      emails: selectedEmails,
      bulkAction,
      tagValue,
      existingTagsTags: existingTagsMap,
    });

    if (res.success) {
      setSelectedEmails([]);
      fetchSubscribers();
    }
  };

  // Campaign Save
  const handleSaveCampaign = async (status: string) => {
    if (!campaignForm.name || !campaignForm.subject) {
      alert("Name and Subject are required");
      return;
    }

    const scheduledTime = campaignForm.sendType === "scheduled" ? campaignForm.scheduledDate : null;

    const campaign = {
      name: campaignForm.name,
      subject: campaignForm.subject,
      previewText: campaignForm.previewText,
      audience: campaignForm.audience,
      coverImage: campaignForm.coverImage,
      contentHtml: campaignForm.contentHtml,
      contentJson: campaignForm.contentJson,
      ctaButton: campaignForm.ctaButton,
      internalNotes: campaignForm.internalNotes,
      scheduledDate: scheduledTime,
      status: status, // draft or scheduled
    };

    const res = await callNewsletterAdminApi("saveCampaign", {
      id: editingCampaignId,
      campaign,
    });

    if (res.success) {
      setIsCampaignModalOpen(false);
      setEditingCampaignId(null);
      resetCampaignForm();
      fetchCampaigns();
    }
  };

  // Open Builder & pre-populate release update
  const openProductUpdateBuilder = () => {
    const currentMonthYear = new Date().toLocaleString("default", { month: "long", year: "numeric" });
    setCampaignForm({
      name: `SendMyForm Product Update - ${currentMonthYear}`,
      subject: "SendMyForm Update: Webhooks, Spam Filtering, and new Admin Dashboard!",
      previewText: "Check out the latest features and updates live on SendMyForm.",
      audience: { type: "all", tag: "" },
      coverImage: "",
      contentHtml: `<h1>SendMyForm Product Update</h1><p>Hey {{name}},</p><p>We have been busy building some highly requested features to make SendMyForm the ultimate form backend for developers. Here is what is new:</p><h2>🛡️ Advanced Spam Filtering</h2><p>Our bot protection model has been updated. You will now see fewer spam submissions in your dashboard with zero configuration changes required.</p><h2>⚡ Enhanced Webhooks</h2><p>Webhook delivery has been optimized to execute in under 100ms. We have also added support for secure webhook signatures so you can verify the payload comes from SendMyForm.</p><h2>🎨 New Styling Themes</h2><p>Style your redirect thank-you pages with 5 premium design templates, including sleek glassmorphic themes and dark modes.</p><br/><p>Try these new features today in your developer dashboard!</p>`,
      contentJson: "",
      ctaButton: { text: "Go to Dashboard", url: "https://sendmyform.com/dashboard" },
      internalNotes: "Pre-populated product update templates.",
      scheduledDate: "",
      sendType: "immediate",
    });
    setEditingCampaignId(null);
    setIsCampaignModalOpen(true);
  };

  // Test Email
  const handleSendTestEmail = async () => {
    if (!testEmail) return;
    setSendingTest(true);
    const res = await callNewsletterAdminApi("sendTestEmail", {
      testEmail,
      campaign: campaignForm,
    });
    setSendingTest(false);
    if (res.success) {
      alert(res.message);
    }
  };

  // Duplicate campaign
  const duplicateCampaign = (c: any) => {
    setCampaignForm({
      name: `${c.name} (Copy)`,
      subject: c.subject,
      previewText: c.previewText || "",
      audience: c.audience || { type: "all", tag: "" },
      coverImage: c.coverImage || "",
      contentHtml: c.contentHtml || "",
      contentJson: c.contentJson || "",
      ctaButton: c.ctaButton || { text: "", url: "" },
      internalNotes: c.internalNotes || "",
      scheduledDate: "",
      sendType: "immediate",
    });
    setEditingCampaignId(null);
    setIsCampaignModalOpen(true);
  };

  // Edit campaign
  const startEditCampaign = (c: any) => {
    setEditingCampaignId(c.id);
    
    let dateStr = "";
    if (c.scheduledDate) {
      const d = c.scheduledDate.toDate ? c.scheduledDate.toDate() : new Date(c.scheduledDate);
      // Format as YYYY-MM-DDThh:mm
      dateStr = d.toISOString().slice(0, 16);
    }

    setCampaignForm({
      name: c.name,
      subject: c.subject,
      previewText: c.previewText || "",
      audience: c.audience || { type: "all", tag: "" },
      coverImage: c.coverImage || "",
      contentHtml: c.contentHtml || "",
      contentJson: c.contentJson || "",
      ctaButton: c.ctaButton || { text: "", url: "" },
      internalNotes: c.internalNotes || "",
      scheduledDate: dateStr,
      sendType: c.status === "scheduled" ? "scheduled" : "immediate",
    });
    setIsCampaignModalOpen(true);
  };

  // Delete campaign
  const handleDeleteCampaign = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    const res = await callNewsletterAdminApi("deleteCampaign", { id });
    if (res.success) fetchCampaigns();
  };

  // Templates CRUD
  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateForm.name || !templateForm.subject) return;

    const res = await callNewsletterAdminApi("saveTemplate", {
      id: editingTemplateId,
      template: templateForm,
    });

    if (res.success) {
      setIsTemplateModalOpen(false);
      setEditingTemplateId(null);
      setTemplateForm({ name: "", subject: "", contentHtml: "", contentJson: "" });
      fetchTemplates();
    }
  };

  // Load custom template into campaign form
  const loadTemplateIntoCampaign = (template: any) => {
    setCampaignForm((prev: any) => ({
      ...prev,
      subject: template.subject || prev.subject,
      contentHtml: template.contentHtml || prev.contentHtml,
      contentJson: template.contentJson || prev.contentJson,
    }));
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    const res = await callNewsletterAdminApi("saveSettings", { settings: nlSettings });
    setSavingSettings(false);
    if (res.success) {
      alert("Newsletter Settings Saved!");
    }
  };

  // Reset helpers
  const resetCampaignForm = () => {
    setCampaignForm({
      name: "",
      subject: "",
      previewText: "",
      audience: { type: "all", tag: "" },
      coverImage: "",
      contentHtml: "",
      contentJson: "",
      ctaButton: { text: "", url: "" },
      internalNotes: "",
      scheduledDate: "",
      sendType: "immediate",
    });
  };

  if (loading || !isAdmin) return <div className="h-screen flex items-center justify-center bg-slate-950 text-white font-bold tracking-tighter italic">🛡️ AUTHENTICATING ADMIN...</div>;

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 selection:bg-rose-500/30 overflow-hidden">
      
      {/* --- ADMIN SIDEBAR --- */}
      <aside className="w-72 border-r border-white/5 bg-slate-950 flex flex-col p-8 shrink-0 overflow-y-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-900/40 font-black text-xl italic">A</div>
          <h2 className="text-xl font-black tracking-tighter">achaia <span className="text-rose-500">HQ</span></h2>
        </div>

        {/* Section 1: Core Platform */}
        <div className="mb-6">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 italic">Platform Engine</p>
          <nav className="space-y-1">
            {[
              { id: "overview", label: "Global Insights", icon: BarChart4 },
              { id: "ads", label: "Multi-Ad Monetization", icon: Megaphone },
              { id: "users", label: "User Management", icon: Users },
              { id: "monitoring", label: "System Monitoring", icon: Activity },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { trackTabSwitch(`admin_${item.id}`); setActiveTab(item.id); }}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold tracking-tight transition-all duration-300 group text-left",
                  activeTab === item.id ? "bg-rose-600 shadow-lg shadow-rose-900/20 text-white" : "text-slate-500 hover:text-white hover:bg-slate-900"
                )}
              >
                <item.icon size={18} className={cn(activeTab === item.id ? "text-white" : "group-hover:text-rose-400")} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Section 2: Newsletter System */}
        <div className="mb-6">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 italic">Newsletter Module</p>
          <nav className="space-y-1">
            {[
              { id: "newsletter_dashboard", label: "Dashboard", icon: PieChart },
              { id: "newsletter_subscribers", label: "Subscribers", icon: UserPlus },
              { id: "newsletter_campaigns", label: "Campaigns", icon: Mail },
              { id: "newsletter_templates", label: "Templates", icon: FileText },
              { id: "newsletter_analytics", label: "Analytics", icon: TrendingUp },
              { id: "newsletter_settings", label: "Settings", icon: Settings },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold tracking-tight transition-all duration-300 group text-left",
                  activeTab === item.id ? "bg-rose-600 shadow-lg shadow-rose-900/20 text-white" : "text-slate-500 hover:text-white hover:bg-slate-900"
                )}
              >
                <item.icon size={18} className={cn(activeTab === item.id ? "text-white" : "group-hover:text-rose-400")} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto space-y-6 pt-6 border-t border-white/5">
          <div className="p-5 rounded-3xl bg-slate-900/50 border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-glow shadow-emerald-500/50"></div>
              <p className="text-xs font-bold text-slate-300">Status: <span className="text-white uppercase font-black">Online</span></p>
            </div>
          </div>
          <button onClick={() => signOut(auth)} className="w-full py-4 text-xs font-black text-slate-500 hover:text-rose-500 transition-colors uppercase tracking-[0.2em] border-t border-white/5">Terminal Logout</button>
        </div>
      </aside>

      {/* --- DASHBOARD VIEW --- */}
      <main className="flex-1 overflow-y-auto p-12 max-w-7xl mx-auto w-full">

        {/* ==================== CORE TAB: OVERVIEW ==================== */}
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
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-rose-500 border border-white/5 italic">{i + 1}</div>
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

        {/* ==================== CORE TAB: ADS ==================== */}
        {activeTab === "ads" && (
          <div className="animate-fade-in text-left">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-black uppercase tracking-tightest italic text-white">AdSense <span className="text-rose-500">Multi-Channel</span> Engine</h2>
              <div className="flex items-center gap-3 px-6 py-2 rounded-full border border-rose-600/30 bg-rose-600/10 text-rose-500 text-[10px] font-black uppercase tracking-widest italic animate-pulse">
                <Target size={14} /> Global Injection Active
              </div>
            </div>

            <div className="space-y-12">
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
                  onChange={(e) => setConfig({ ...config, topAd: e.target.value })}
                  placeholder="Paste AdSense Leaderboard code here..."
                />
              </div>

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
                  onChange={(e) => setConfig({ ...config, middleAd: e.target.value })}
                  placeholder="Paste AdSense In-Article or Square code here..."
                />
              </div>

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
                  onChange={(e) => setConfig({ ...config, bottomAd: e.target.value })}
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

        {/* ==================== CORE TAB: MONITORING / USERS ==================== */}
        {activeTab === "users" && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-black uppercase text-white mb-8 italic">User Management</h2>
            <div className="p-10 rounded-[48px] bg-slate-950/50 border border-white/5">
              <p className="text-slate-400 font-bold italic mb-6">Showing top active project creators</p>
              <div className="space-y-4">
                {allUsers.map((u, i) => (
                  <div key={i} className="p-6 bg-slate-900/40 rounded-3xl border border-white/5 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white">ID: {u.uid}</p>
                      <p className="text-xs text-rose-500 font-bold mt-1 uppercase">{u.count} Forms Configured</p>
                    </div>
                    <span className="text-xs font-black text-slate-500 italic px-4 py-2 border border-white/5 rounded-full">ACTIVE NODE</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "monitoring" && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-black uppercase text-white mb-8 italic">System Monitoring</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-10 rounded-3xl bg-slate-950/50 border border-white/5">
                <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-4">Node Health</h4>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 animate-ping"></div>
                  <span className="text-xl font-bold text-white">Primary Core: STABLE</span>
                </div>
              </div>
              <div className="p-10 rounded-3xl bg-slate-950/50 border border-white/5">
                <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-4">API Latency</h4>
                <span className="text-3xl font-black text-rose-500">47 ms</span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================
            ==================== NEWSLETTER MODULE PAGES =======================
            ====================================================================== */}

        {/* --- NEWSLETTER DASHBOARD --- */}
        {activeTab === "newsletter_dashboard" && (
          <div className="animate-fade-in">
            <header className="mb-12 flex justify-between items-end">
              <div>
                <h1 className="text-5xl font-black tracking-tightest uppercase italic mb-2">Newsletter <span className="text-rose-500">Terminal</span></h1>
                <p className="text-slate-400 font-medium italic uppercase tracking-widest">Campaigns & Audience Management</p>
              </div>
              <button
                onClick={runScheduler}
                disabled={processingCron}
                className="bg-rose-600 hover:bg-rose-500 disabled:bg-rose-900 text-white font-black uppercase text-xs tracking-widest px-8 py-4 rounded-2xl shadow-xl transition-all hover:scale-102 flex items-center gap-2"
              >
                <RefreshCw size={14} className={cn(processingCron && "animate-spin")} />
                Sync & Send Scheduled
              </button>
            </header>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-4 gap-6 mb-12">
              {[
                { label: "Total Subscribers", val: nlStats.totalSubscribers, icon: Users, sub: "All time signups" },
                { label: "Active Subscribers", val: nlStats.activeSubscribers, icon: CheckCircle, sub: "Verified & Opt-in" },
                { label: "Campaigns Sent", val: nlStats.campaignsSent, icon: Mail, sub: "Delivered to lists" },
                { label: "Scheduled / Draft", val: `${nlStats.scheduledCampaigns} / ${nlStats.draftCampaigns}`, icon: Calendar, sub: "Pending dispatch" },
                { label: "Avg Open Rate", val: `${nlStats.openRate}%`, icon: TrendingUp, sub: "Standard opens" },
                { label: "Avg Click Rate", val: `${nlStats.clickRate}%`, icon: Zap, sub: "CTA actions" },
                { label: "Bounce Rate", val: `${nlStats.bounceRate}%`, icon: XCircle, sub: "Invalid accounts" },
                { label: "Opt-In Mode", val: "Double", icon: ShieldAlert, sub: "Verified signup flow" },
              ].map((s, i) => (
                <div key={i} className="p-6 rounded-[32px] bg-slate-950/50 border border-white/5 hover:border-rose-500/20 transition-all group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-slate-900 rounded-xl"><s.icon size={18} className="text-rose-500" /></div>
                  </div>
                  <p className="text-2xl font-black tracking-tighter text-white mb-1 italic">{s.val}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">{s.label}</p>
                  <p className="text-[9px] font-medium text-slate-600 uppercase italic">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Chart and Recent logs */}
            <div className="grid grid-cols-3 gap-6">
              {/* Subscriber Growth Chart */}
              <div className="col-span-2 p-8 rounded-[40px] bg-slate-950/50 border border-white/5">
                <h3 className="text-lg font-black uppercase text-white mb-6 italic">Audience <span className="text-rose-500">Growth</span> Trend</h3>
                <div className="h-64 w-full">
                  {growthChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={growthChartData}>
                        <defs>
                          <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="month" stroke="#475569" style={{ fontSize: 10, fontWeight: "bold" }} />
                        <YAxis stroke="#475569" style={{ fontSize: 10, fontWeight: "bold" }} />
                        <ChartTooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                        <Area type="monotone" dataKey="subscribers" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#growthGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-600 text-sm font-bold uppercase italic">No signup records yet</div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="p-8 rounded-[40px] bg-slate-950/50 border border-white/5 flex flex-col">
                <h3 className="text-lg font-black uppercase text-white mb-6 italic">HQ <span className="text-rose-500">Logs</span></h3>
                <div className="flex-1 overflow-y-auto space-y-4 max-h-[250px]">
                  {auditLogs.slice(0, 5).map((l, i) => (
                    <div key={i} className="flex flex-col border-b border-white/5 pb-3">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-tight">{l.action.replace(/_/g, " ")}</span>
                        <span className="text-[9px] font-bold text-slate-600 uppercase">
                          {l.timestamp?.seconds ? new Date(l.timestamp.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 italic font-semibold">
                        Actor: {l.administrator} {l.metadata?.email ? `(${l.metadata.email})` : ""}
                      </p>
                    </div>
                  ))}
                  {auditLogs.length === 0 && (
                    <p className="text-center text-slate-600 text-xs font-bold uppercase tracking-wider mt-12 italic">No operations logged</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- NEWSLETTER SUBSCRIBERS --- */}
        {activeTab === "newsletter_subscribers" && (
          <div className="animate-fade-in text-left">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-black uppercase text-white italic">Subscriber <span className="text-rose-500">Fleet</span></h2>
                <p className="text-slate-500 text-xs font-bold uppercase italic mt-1">Manage, filter, import and segment subscribers list</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="px-4 py-3 bg-slate-900 border border-white/5 hover:border-white/20 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Upload size={14} /> Import CSV
                </button>
                <button
                  onClick={handleExportCSV}
                  disabled={subscribers.length === 0}
                  className="px-4 py-3 bg-slate-900 border border-white/5 hover:border-white/20 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Download size={14} /> Export CSV
                </button>
                <button
                  onClick={() => setIsAddSubModalOpen(true)}
                  className="px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus size={14} /> Add Subscriber
                </button>
              </div>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-4 mb-6 bg-slate-950/40 border border-white/5 p-4 rounded-2xl">
              <input
                type="text"
                placeholder="Search by email or name..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSubsPage(1); }}
                className="flex-1 bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none text-slate-100 placeholder-slate-600 font-bold focus:border-rose-500/30"
              />
              <select
                value={tagFilter}
                onChange={(e) => { setTagFilter(e.target.value); setSubsPage(1); }}
                className="bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none text-slate-300 font-bold max-w-[150px]"
              >
                <option value="">Filter by Tag</option>
                {allTags.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setSubsPage(1); }}
                className="bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none text-slate-300 font-bold max-w-[150px]"
              >
                <option value="">Filter Status</option>
                <option value="subscribed">Subscribed</option>
                <option value="unsubscribed">Unsubscribed</option>
                <option value="pending">Pending Opt-In</option>
                <option value="bounced">Bounced</option>
              </select>
            </div>

            {/* Bulk actions bar */}
            {selectedEmails.length > 0 && (
              <div className="flex items-center justify-between bg-rose-950/30 border border-rose-500/20 p-4 rounded-xl mb-6 animate-pulse">
                <span className="text-xs text-rose-300 font-black uppercase tracking-wider">{selectedEmails.length} Subscribers Selected</span>
                <div className="flex items-center gap-3">
                  {["subscribe", "unsubscribe", "addTag", "removeTag", "delete"].map((act) => (
                    <button
                      key={act}
                      onClick={() => handleBulkAction(act)}
                      className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 rounded-lg text-[10px] font-black uppercase text-slate-300 border border-white/5 hover:text-white"
                    >
                      {act.replace(/([A-Z])/g, " $1")}
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedEmails([])}
                    className="text-xs font-black text-rose-500 hover:text-rose-400 uppercase tracking-widest ml-4"
                  >
                    Deselect
                  </button>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="bg-slate-950/50 border border-white/5 rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-500 font-black uppercase tracking-widest">
                      <th className="p-4 w-10">
                        <input
                          type="checkbox"
                          checked={selectedEmails.length === subscribers.length && subscribers.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedEmails(subscribers.map(s => s.email));
                            else setSelectedEmails([]);
                          }}
                          className="rounded border-white/5 bg-slate-900 accent-rose-600"
                        />
                      </th>
                      <th className="p-4">Name / Source</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Tags</th>
                      <th className="p-4">Joined Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingSubs ? (
                      <tr>
                        <td colSpan={7} className="p-16 text-center text-slate-500 font-black italic">LOADING FLEET DATABASE...</td>
                      </tr>
                    ) : subscribers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-16 text-center text-slate-600 font-black italic">NO SUBSCRIBERS FOUND MATCHING CRITERIA</td>
                      </tr>
                    ) : (
                      subscribers.map((sub) => (
                        <tr key={sub.id} className="border-b border-white/5 hover:bg-slate-900/20 group">
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedEmails.includes(sub.email)}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedEmails([...selectedEmails, sub.email]);
                                else setSelectedEmails(selectedEmails.filter(x => x !== sub.email));
                              }}
                              className="rounded border-white/5 bg-slate-900 accent-rose-600"
                            />
                          </td>
                          <td className="p-4">
                            <p className="font-black text-white">{sub.name || "—"}</p>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">{sub.source || "web"}</span>
                          </td>
                          <td className="p-4 font-mono font-bold text-slate-300">{sub.email}</td>
                          <td className="p-4">
                            <span className={cn(
                              "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                              sub.status === "subscribed" && "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
                              sub.status === "unsubscribed" && "bg-rose-500/10 text-rose-500 border border-rose-500/20",
                              sub.status === "pending" && "bg-amber-500/10 text-amber-500 border border-amber-500/20",
                              sub.status === "bounced" && "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                            )}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {(sub.tags || []).map((t: string) => (
                                <span key={t} className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-400 font-bold border border-white/5 text-[9px]">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 text-slate-500 font-bold">
                            {sub.joinedDate?.seconds 
                              ? new Date(sub.joinedDate.seconds * 1000).toLocaleDateString()
                              : new Date(sub.joinedDate).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteSub(sub.email)}
                              className="p-2 opacity-0 group-hover:opacity-100 hover:text-rose-500 text-slate-500 transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
                <span>Total: {subsTotal} Subscribers</span>
                <div className="flex items-center gap-4">
                  <button
                    disabled={subsPage === 1}
                    onClick={() => setSubsPage(p => Math.max(1, p - 1))}
                    className="px-4 py-2 border border-white/5 rounded-xl hover:text-white disabled:opacity-30 disabled:hover:text-slate-500"
                  >
                    Previous
                  </button>
                  <span>Page {subsPage} of {Math.ceil(subsTotal / 15) || 1}</span>
                  <button
                    disabled={subsPage >= Math.ceil(subsTotal / 15)}
                    onClick={() => setSubsPage(p => p + 1)}
                    className="px-4 py-2 border border-white/5 rounded-xl hover:text-white disabled:opacity-30 disabled:hover:text-slate-500"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- NEWSLETTER CAMPAIGNS --- */}
        {activeTab === "newsletter_campaigns" && (
          <div className="animate-fade-in text-left">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-black uppercase text-white italic">Email <span className="text-rose-500">Campaigns</span></h2>
                <p className="text-slate-500 text-xs font-bold uppercase italic mt-1">Design release updates, feature newsletters, or digests</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={openProductUpdateBuilder}
                  className="px-5 py-3 bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-rose-950/40"
                >
                  <Sparkles size={14} fill="currentColor" /> Create Product Update
                </button>
                <button
                  onClick={() => { resetCampaignForm(); setEditingCampaignId(null); setIsCampaignModalOpen(true); }}
                  className="px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus size={14} /> New Campaign
                </button>
              </div>
            </div>

            {/* List Campaigns */}
            <div className="space-y-6">
              {campaigns.length === 0 ? (
                <div className="p-16 border border-white/5 rounded-3xl bg-slate-950/40 text-center text-slate-500 italic font-black uppercase">
                  No Campaigns Formulated Yet. Get Started Above!
                </div>
              ) : (
                campaigns.map((c) => {
                  const hasSent = c.status === "sent";
                  const metrics = c.metrics || {};
                  
                  return (
                    <div key={c.id} className="p-8 rounded-[36px] bg-slate-950/50 border border-white/5 hover:border-rose-500/10 transition-all flex justify-between items-start group">
                      <div className="space-y-3 flex-1 pr-6">
                        <div className="flex items-center gap-3">
                          <h4 className="text-xl font-black italic text-white leading-none">{c.name}</h4>
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest",
                            c.status === "sent" && "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
                            c.status === "scheduled" && "bg-blue-500/10 text-blue-500 border border-blue-500/20",
                            c.status === "sending" && "bg-purple-500/10 text-purple-500 border border-purple-500/20 animate-pulse",
                            c.status === "draft" && "bg-slate-500/15 text-slate-400 border border-white/5"
                          )}>
                            {c.status}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-400">Subject: <span className="font-mono text-rose-500 font-semibold">{c.subject}</span></p>
                        
                        {/* Meta */}
                        <div className="flex gap-6 text-[10px] text-slate-500 font-bold uppercase italic">
                          <span>Audience: <b className="text-white">{c.audience?.type}</b> {c.audience?.tag ? `(${c.audience.tag})` : ""}</span>
                          {c.scheduledDate && (
                            <span>Scheduled: <b className="text-white">
                              {c.scheduledDate?.seconds 
                                ? new Date(c.scheduledDate.seconds * 1000).toLocaleString()
                                : new Date(c.scheduledDate).toLocaleString()}
                            </b></span>
                          )}
                          {c.sentAt && (
                            <span>Sent: <b className="text-white">
                              {c.sentAt?.seconds 
                                ? new Date(c.sentAt.seconds * 1000).toLocaleString()
                                : new Date(c.sentAt).toLocaleString()}
                            </b></span>
                          )}
                        </div>

                        {/* Performance indicators if sent */}
                        {hasSent && (
                          <div className="grid grid-cols-5 gap-4 pt-4 border-t border-white/5 max-w-xl">
                            <div>
                              <p className="text-xs font-black text-white">{metrics.sent || 0}</p>
                              <p className="text-[9px] font-black text-slate-500 uppercase">Sent</p>
                            </div>
                            <div>
                              <p className="text-xs font-black text-white">
                                {metrics.sent > 0 ? Math.round(((metrics.opened || 0) / metrics.sent) * 100) : 0}%
                              </p>
                              <p className="text-[9px] font-black text-slate-500 uppercase">Opens</p>
                            </div>
                            <div>
                              <p className="text-xs font-black text-white">
                                {metrics.sent > 0 ? Math.round(((metrics.clicked || 0) / metrics.sent) * 100) : 0}%
                              </p>
                              <p className="text-[9px] font-black text-slate-500 uppercase">Clicks</p>
                            </div>
                            <div>
                              <p className="text-xs font-black text-white">
                                {metrics.sent > 0 ? Math.round(((metrics.bounced || 0) / metrics.sent) * 100) : 0}%
                              </p>
                              <p className="text-[9px] font-black text-slate-500 uppercase">Bounce</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {c.status === "draft" && (
                          <button
                            onClick={() => startEditCampaign(c)}
                            className="px-4 py-2 rounded-xl bg-slate-900 border border-white/5 hover:border-rose-500/20 text-xs font-black uppercase text-slate-300 hover:text-white"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => duplicateCampaign(c)}
                          className="px-4 py-2 rounded-xl bg-slate-900 border border-white/5 hover:border-rose-500/20 text-xs font-black uppercase text-slate-300 hover:text-white"
                        >
                          Duplicate
                        </button>
                        <button
                          onClick={() => handleDeleteCampaign(c.id)}
                          className="p-3 text-slate-500 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* --- NEWSLETTER TEMPLATES --- */}
        {activeTab === "newsletter_templates" && (
          <div className="animate-fade-in text-left">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-black uppercase text-white italic">Email <span className="text-rose-500">Templates</span></h2>
                <p className="text-slate-500 text-xs font-bold uppercase italic mt-1">Reusable layouts for announcement emails and updates</p>
              </div>
              <button
                onClick={() => { setEditingTemplateId(null); setTemplateForm({ name: "", subject: "", contentHtml: "", contentJson: "" }); setIsTemplateModalOpen(true); }}
                className="px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
              >
                <Plus size={14} /> Create Template
              </button>
            </div>

            {/* List templates */}
            <div className="grid grid-cols-3 gap-6">
              {/* Default presets */}
              {PRESET_TEMPLATES.map((p, i) => (
                <div key={i} className="p-6 rounded-3xl bg-slate-950/40 border border-white/5 relative overflow-hidden group">
                  <span className="absolute top-4 right-4 text-[8px] font-black uppercase tracking-widest bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded border border-rose-500/20">PRESET</span>
                  <h4 className="text-lg font-black text-white mb-2 italic">{p.name}</h4>
                  <p className="text-slate-500 text-xs font-semibold mb-6">{p.desc}</p>
                  <div className="flex gap-4 items-center">
                    <button 
                      onClick={() => {
                        setCampaignForm((prev: any) => ({
                          ...prev,
                          subject: p.subject,
                          contentHtml: p.contentHtml,
                        }));
                        setIsCampaignModalOpen(true);
                      }}
                      className="text-xs font-black text-rose-500 hover:underline uppercase tracking-wider flex items-center gap-1"
                    >
                      Load into builder <Send size={10} />
                    </button>
                    <button
                      onClick={() => {
                        setEditingTemplateId(null);
                        setTemplateForm({
                          name: `Custom ${p.name}`,
                          subject: p.subject,
                          contentHtml: p.contentHtml,
                          contentJson: "",
                        });
                        setIsTemplateModalOpen(true);
                      }}
                      className="text-xs font-black text-slate-400 hover:text-white uppercase tracking-wider"
                    >
                      Customize
                    </button>
                  </div>
                </div>
              ))}

              {/* Custom Templates */}
              {templates.map((t) => (
                <div key={t.id} className="p-6 rounded-3xl bg-slate-950/50 border border-white/5 relative group">
                  <h4 className="text-lg font-black text-white mb-2 italic">{t.name}</h4>
                  <p className="text-slate-500 text-xs font-semibold mb-6">Subject fallback: {t.subject}</p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => loadTemplateIntoCampaign(t)}
                      className="text-xs font-black text-emerald-500 hover:underline uppercase tracking-wider"
                    >
                      Use
                    </button>
                    <button
                      onClick={() => {
                        setEditingTemplateId(t.id);
                        setTemplateForm({ name: t.name, subject: t.subject || "", contentHtml: t.contentHtml || "", contentJson: t.contentJson || "" });
                        setIsTemplateModalOpen(true);
                      }}
                      className="text-xs font-black text-slate-400 hover:text-white uppercase tracking-wider"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm("Delete template?")) {
                          await callNewsletterAdminApi("deleteTemplate", { id: t.id });
                          fetchTemplates();
                        }
                      }}
                      className="text-xs font-black text-rose-500 hover:text-rose-400 uppercase tracking-wider ml-auto"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- NEWSLETTER ANALYTICS --- */}
        {activeTab === "newsletter_analytics" && (
          <div className="animate-fade-in text-left">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-black uppercase text-white italic">Campaign <span className="text-rose-500">Analytics</span></h2>
                <p className="text-slate-500 text-xs font-bold uppercase italic mt-1">Granular analysis on dispatch records & delivery quality</p>
              </div>
              <select
                value={selectedAnalyticsCampaignId}
                onChange={(e) => {
                  setSelectedAnalyticsCampaignId(e.target.value);
                  setAnalyticsCampaign(campaigns.find(c => c.id === e.target.value));
                }}
                className="bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none text-slate-200 font-black uppercase tracking-wider"
              >
                {campaigns.filter(c => c.status === "sent").map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
                {campaigns.filter(c => c.status === "sent").length === 0 && (
                  <option value="">No campaigns sent yet</option>
                )}
              </select>
            </div>

            {analyticsCampaign ? (
              <div className="space-y-8">
                {/* Visual stats summary */}
                <div className="grid grid-cols-4 gap-6">
                  {[
                    { label: "Emails Dispatched", val: analyticsCampaign.metrics?.sent || 0, icon: Send },
                    { label: "Opens Detected", val: analyticsCampaign.metrics?.opened || 0, icon: Eye },
                    { label: "CTAs Engaged (Clicks)", val: analyticsCampaign.metrics?.clicked || 0, icon: Zap },
                    { label: "Failed / Bounced", val: `${analyticsCampaign.metrics?.failed || 0} / ${analyticsCampaign.metrics?.bounced || 0}`, icon: XCircle },
                  ].map((s, i) => (
                    <div key={i} className="p-8 rounded-3xl bg-slate-950/50 border border-white/5 relative overflow-hidden">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 bg-slate-900 rounded-xl"><s.icon size={18} className="text-rose-500" /></div>
                      </div>
                      <p className="text-3xl font-black tracking-tighter text-white mb-1 italic">{s.val}</p>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Performance rates */}
                <div className="p-10 rounded-[48px] bg-slate-950/50 border border-white/5">
                  <h3 className="text-lg font-black uppercase text-white mb-6 italic">Performance Quality Ratio</h3>
                  <div className="grid grid-cols-3 gap-8 text-center">
                    <div>
                      <div className="w-32 h-32 rounded-full border-4 border-rose-500/10 flex flex-col items-center justify-center mx-auto mb-4">
                        <span className="text-3xl font-black text-white">
                          {analyticsCampaign.metrics?.sent > 0 ? Math.round((analyticsCampaign.metrics.opened / analyticsCampaign.metrics.sent) * 100) : 0}%
                        </span>
                      </div>
                      <p className="text-xs font-black uppercase text-slate-400">Open Rate</p>
                    </div>
                    <div>
                      <div className="w-32 h-32 rounded-full border-4 border-rose-500/10 flex flex-col items-center justify-center mx-auto mb-4">
                        <span className="text-3xl font-black text-white">
                          {analyticsCampaign.metrics?.sent > 0 ? Math.round((analyticsCampaign.metrics.clicked / analyticsCampaign.metrics.sent) * 100) : 0}%
                        </span>
                      </div>
                      <p className="text-xs font-black uppercase text-slate-400">Click Rate</p>
                    </div>
                    <div>
                      <div className="w-32 h-32 rounded-full border-4 border-rose-500/10 flex flex-col items-center justify-center mx-auto mb-4">
                        <span className="text-3xl font-black text-white">
                          {analyticsCampaign.metrics?.sent > 0 ? Math.round((analyticsCampaign.metrics.bounced / analyticsCampaign.metrics.sent) * 100) : 0}%
                        </span>
                      </div>
                      <p className="text-xs font-black uppercase text-slate-400">Bounce Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-16 border border-white/5 rounded-3xl bg-slate-950/40 text-center text-slate-500 italic font-black uppercase">
                Select a sent campaign from the dropdown to check analytical metrics.
              </div>
            )}
          </div>
        )}

        {/* --- NEWSLETTER SETTINGS --- */}
        {activeTab === "newsletter_settings" && (
          <div className="animate-fade-in text-left max-w-3xl">
            <h2 className="text-3xl font-black uppercase text-white mb-8 italic">System <span className="text-rose-500">Settings</span></h2>
            
            <form onSubmit={handleSaveSettings} className="p-10 rounded-[40px] bg-slate-950/50 border border-white/5 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Sender Name</label>
                  <input
                    type="text"
                    value={nlSettings.senderName}
                    onChange={(e) => setNlSettings({ ...nlSettings, senderName: e.target.value })}
                    className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none text-slate-100 placeholder-slate-600 font-bold focus:border-rose-500/30"
                    placeholder="e.g. SendMyForm Team"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Sender Email</label>
                  <input
                    type="email"
                    value={nlSettings.senderEmail}
                    onChange={(e) => setNlSettings({ ...nlSettings, senderEmail: e.target.value })}
                    className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none text-slate-100 placeholder-slate-600 font-bold focus:border-rose-500/30"
                    placeholder="e.g. team@yourdomain.com"
                    required
                  />
                  <p className="text-[9px] text-rose-500 font-semibold italic mt-1">Note: emails send via achaialabs@gmail.com by default.</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Reply-To Email</label>
                <input
                  type="email"
                  value={nlSettings.replyTo}
                  onChange={(e) => setNlSettings({ ...nlSettings, replyTo: e.target.value })}
                  className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none text-slate-100 placeholder-slate-600 font-bold focus:border-rose-500/30"
                  placeholder="e.g. support@yourdomain.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Default Footer Text</label>
                <textarea
                  value={nlSettings.footer}
                  onChange={(e) => setNlSettings({ ...nlSettings, footer: e.target.value })}
                  className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none text-slate-100 placeholder-slate-600 font-bold focus:border-rose-500/30 h-24"
                  placeholder="© 2026 Achaia Labs. All rights reserved."
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                <div>
                  <h5 className="text-xs font-black uppercase text-white italic">Double Opt-In signup</h5>
                  <p className="text-[10px] text-slate-500 font-semibold italic mt-0.5">Enforce subscription verification link before welcome</p>
                </div>
                <input
                  type="checkbox"
                  checked={nlSettings.doubleOptIn}
                  onChange={(e) => setNlSettings({ ...nlSettings, doubleOptIn: e.target.checked })}
                  className="w-5 h-5 bg-slate-900 border-white/5 rounded accent-rose-600"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="bg-rose-600 hover:bg-rose-500 disabled:bg-rose-800 text-white font-black uppercase text-xs tracking-widest px-8 py-4 rounded-xl shadow-xl transition-all"
                >
                  {savingSettings ? "Saving Settings..." : "Save Settings"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* ======================================================================
          ========================== MODAL POPUPS ==============================
          ====================================================================== */}

      {/* --- MODAL: ADD SUBSCRIBER --- */}
      {isAddSubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4 text-left">
          <div className="w-full max-w-md bg-slate-950 border border-white/10 rounded-[32px] p-8 shadow-2xl space-y-6">
            <h3 className="text-2xl font-black text-white italic uppercase">Add Subscriber</h3>
            <form onSubmit={handleAddSubscriber} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  value={newSubInput.email}
                  onChange={(e) => setNewSubInput({ ...newSubInput, email: e.target.value })}
                  className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none text-slate-100 font-bold focus:border-rose-500/30"
                  placeholder="e.g. developer@example.com"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                <input
                  type="text"
                  value={newSubInput.name}
                  onChange={(e) => setNewSubInput({ ...newSubInput, name: e.target.value })}
                  className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none text-slate-100 font-bold focus:border-rose-500/30"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newSubInput.tags}
                  onChange={(e) => setNewSubInput({ ...newSubInput, tags: e.target.value })}
                  className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none text-slate-100 font-bold focus:border-rose-500/30"
                  placeholder="e.g. beta, launch-list"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  Add Subscriber
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddSubModalOpen(false)}
                  className="px-6 py-3 bg-slate-900 border border-white/5 rounded-xl text-xs font-black uppercase text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: IMPORT CSV --- */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4 text-left">
          <div className="w-full max-w-lg bg-slate-950 border border-white/10 rounded-[32px] p-8 shadow-2xl space-y-6">
            <h3 className="text-2xl font-black text-white italic uppercase">Import CSV List</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Format: <code>email, name, tags(separated by semicolon)</code>. Add one subscriber per line.
            </p>
            <textarea
              value={csvPasteInput}
              onChange={(e) => setCsvPasteInput(e.target.value)}
              className="w-full h-48 bg-slate-900 border border-white/5 rounded-2xl p-4 text-xs font-mono text-emerald-400 outline-none focus:border-rose-500/30"
              placeholder="developer@example.com, John Doe, api;web-form&#10;user2@example.com, Sarah Jenkins, landing"
            />
            <div className="flex gap-4">
              <button
                onClick={handleImportCSV}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                Process List
              </button>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-6 py-3 bg-slate-900 border border-white/5 rounded-xl text-xs font-black uppercase text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: CAMPAIGN BUILDER (FULLSCREEN STYLE) --- */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#020617] text-slate-100 flex flex-col p-8 overflow-y-auto text-left animate-fade-in">
          <header className="flex justify-between items-center pb-6 border-b border-white/5 mb-8">
            <div>
              <h3 className="text-3xl font-black italic uppercase text-white leading-none">
                {editingCampaignId ? "Edit Campaign" : "Build Campaign"}
              </h3>
              <p className="text-slate-500 text-xs font-bold uppercase mt-1">Design rich email copy using TipTap & load dynamic templates</p>
            </div>
            <button
              onClick={() => setIsCampaignModalOpen(false)}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-black uppercase text-slate-400 hover:text-white border border-white/5"
            >
              Close Editor
            </button>
          </header>

          <div className="grid grid-cols-3 gap-8 items-start">
            {/* Inputs Form */}
            <div className="col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Campaign Name (Internal)</label>
                  <input
                    type="text"
                    value={campaignForm.name}
                    onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                    className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none text-slate-100 font-bold focus:border-rose-500/30"
                    placeholder="e.g. July Feature Updates"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Subject Line</label>
                  <input
                    type="text"
                    value={campaignForm.subject}
                    onChange={(e) => setCampaignForm({ ...campaignForm, subject: e.target.value })}
                    className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none text-slate-100 font-bold focus:border-rose-500/30"
                    placeholder="e.g. Webhook Optimization is now live!"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Preview Text (Snippet)</label>
                  <input
                    type="text"
                    value={campaignForm.previewText}
                    onChange={(e) => setCampaignForm({ ...campaignForm, previewText: e.target.value })}
                    className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none text-slate-100 font-bold focus:border-rose-500/30"
                    placeholder="e.g. Setup webhooks, stop spam, and style dashboards."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Audience Target</label>
                  <div className="flex gap-2">
                    <select
                      value={campaignForm.audience.type}
                      onChange={(e) => setCampaignForm({ ...campaignForm, audience: { ...campaignForm.audience, type: e.target.value } })}
                      className="bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none text-slate-300 font-bold flex-1"
                    >
                      <option value="all">All Subscribers</option>
                      <option value="verified">Verified Subscribers</option>
                      <option value="tagged">Tagged Subscribers</option>
                      <option value="imported">Imported Lists</option>
                    </select>
                    {campaignForm.audience.type === "tagged" && (
                      <input
                        type="text"
                        placeholder="Tag name"
                        value={campaignForm.audience.tag}
                        onChange={(e) => setCampaignForm({ ...campaignForm, audience: { ...campaignForm.audience, tag: e.target.value } })}
                        className="bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none text-slate-100 font-bold w-1/3 focus:border-rose-500/30"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Cover Image and CTA */}
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cover Image URL</label>
                  <input
                    type="text"
                    value={campaignForm.coverImage}
                    onChange={(e) => setCampaignForm({ ...campaignForm, coverImage: e.target.value })}
                    className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none text-slate-100 font-bold focus:border-rose-500/30"
                    placeholder="e.g. https://images.com/cover.png"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CTA Button Text</label>
                  <input
                    type="text"
                    value={campaignForm.ctaButton.text}
                    onChange={(e) => setCampaignForm({ ...campaignForm, ctaButton: { ...campaignForm.ctaButton, text: e.target.value } })}
                    className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none text-slate-100 font-bold focus:border-rose-500/30"
                    placeholder="e.g. View Updates"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CTA Link URL</label>
                  <input
                    type="text"
                    value={campaignForm.ctaButton.url}
                    onChange={(e) => setCampaignForm({ ...campaignForm, ctaButton: { ...campaignForm.ctaButton, url: e.target.value } })}
                    className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none text-slate-100 font-bold focus:border-rose-500/30"
                    placeholder="e.g. https://domain.com/dashboard"
                  />
                </div>
              </div>

              {/* Rich text TipTap */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Body Editor</label>
                <TipTapEditor
                  value={campaignForm.contentHtml}
                  onChange={(html, json) => setCampaignForm({ ...campaignForm, contentHtml: html, contentJson: json })}
                />
              </div>

              {/* Scheduling settings */}
              <div className="p-6 bg-slate-950/50 border border-white/5 rounded-3xl space-y-4">
                <h5 className="text-xs font-black uppercase tracking-wider text-slate-400">Scheduling Engine</h5>
                <div className="flex gap-6 items-center">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <input
                      type="radio"
                      name="sendType"
                      value="immediate"
                      checked={campaignForm.sendType === "immediate"}
                      onChange={() => setCampaignForm({ ...campaignForm, sendType: "immediate" })}
                      className="accent-rose-600 w-4 h-4"
                    />
                    Send Immediately
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <input
                      type="radio"
                      name="sendType"
                      value="scheduled"
                      checked={campaignForm.sendType === "scheduled"}
                      onChange={() => setCampaignForm({ ...campaignForm, sendType: "scheduled" })}
                      className="accent-rose-600 w-4 h-4"
                    />
                    Schedule for later
                  </label>

                  {campaignForm.sendType === "scheduled" && (
                    <input
                      type="datetime-local"
                      value={campaignForm.scheduledDate}
                      onChange={(e) => setCampaignForm({ ...campaignForm, scheduledDate: e.target.value })}
                      className="bg-slate-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs outline-none text-slate-200 font-bold focus:border-rose-500/30"
                      required
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Preview Column */}
            <div className="space-y-6">
              {/* Template selector */}
              <div className="p-6 bg-slate-950/50 border border-white/5 rounded-3xl space-y-3">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Inject Custom Template</h5>
                <select
                  onChange={(e) => {
                    const temp = templates.find(t => t.id === e.target.value);
                    if (temp) loadTemplateIntoCampaign(temp);
                  }}
                  className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none text-slate-300 font-bold"
                >
                  <option value="">Select custom template...</option>
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Test Send */}
              <div className="p-6 bg-slate-950/50 border border-white/5 rounded-3xl space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Dispatch Test Copy</h5>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="flex-1 bg-slate-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs outline-none text-slate-100 font-bold placeholder-slate-600 focus:border-rose-500/30"
                    placeholder="test@domain.com"
                  />
                  <button
                    onClick={handleSendTestEmail}
                    disabled={sendingTest || !testEmail}
                    className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-black uppercase text-[10px] tracking-wider px-4 py-2.5 rounded-xl flex items-center gap-1 shrink-0"
                  >
                    <Send size={10} /> Test
                  </button>
                </div>
              </div>

              {/* Device Preview */}
              <div className="p-6 bg-slate-950/50 border border-white/5 rounded-3xl flex flex-col h-[400px]">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Visual Quality Preview</h5>
                  <div className="flex bg-slate-900 p-0.5 rounded-lg border border-white/5">
                    <button
                      onClick={() => setCampaignPreviewMode("desktop")}
                      className={cn("p-1.5 rounded-md text-slate-500", campaignPreviewMode === "desktop" && "bg-slate-950 text-rose-500")}
                    >
                      <Monitor size={14} />
                    </button>
                    <button
                      onClick={() => setCampaignPreviewMode("mobile")}
                      className={cn("p-1.5 rounded-md text-slate-500", campaignPreviewMode === "mobile" && "bg-slate-950 text-rose-500")}
                    >
                      <Smartphone size={14} />
                    </button>
                  </div>
                </div>

                {/* Rendered HTML Box */}
                <div className="flex-1 bg-slate-900 rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center p-3">
                  <div 
                    className={cn(
                      "h-full overflow-y-auto bg-[#0b1329] border border-white/5 rounded-xl p-4 text-[10px] text-slate-300 text-left scrollbar-thin select-none pointer-events-none transition-all",
                      campaignPreviewMode === "desktop" ? "w-full" : "w-[180px] text-[8px]"
                    )}
                  >
                    {/* Header */}
                    <div className="text-center font-black uppercase tracking-tighter text-slate-200 border-b border-white/5 pb-2 mb-2 italic">
                      sendmyform <span className="text-rose-500">HQ</span>
                    </div>
                    {/* Cover image mock */}
                    {campaignForm.coverImage && (
                      <img src={campaignForm.coverImage} className="w-full rounded mb-3 max-h-[100px] object-cover" />
                    )}
                    {/* Content */}
                    <div 
                      className="space-y-1 prose prose-invert max-w-none break-all" 
                      dangerouslySetInnerHTML={{ __html: campaignForm.contentHtml || "<p style='color:#475569;font-style:italic;'>Copy content is empty...</p>" }} 
                    />
                    {/* CTA mock */}
                    {campaignForm.ctaButton?.text && (
                      <div className="text-center mt-3">
                        <span className="inline-block bg-rose-600 text-white rounded px-3 py-1 font-black uppercase text-[8px] tracking-wider shadow">
                          {campaignForm.ctaButton.text}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Builder footer */}
          <footer className="mt-8 pt-6 border-t border-white/5 flex justify-end gap-4">
            <button
              onClick={() => setIsCampaignModalOpen(false)}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-black uppercase tracking-wider rounded-xl border border-white/5"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSaveCampaign("draft")}
              className="px-8 py-3 bg-slate-850 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-xl border border-white/10"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSaveCampaign(campaignForm.sendType === "scheduled" ? "scheduled" : "scheduled")} 
              // Wait: if immediate, we can save as scheduled with current timestamp, or let backend trigger immediately.
              // We set status to scheduled so the manual cron sync dispatch triggers it.
              className="px-10 py-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-rose-900/30"
            >
              {campaignForm.sendType === "scheduled" ? "Schedule Campaign" : "Send / Queue Campaign"}
            </button>
          </footer>
        </div>
      )}

      {/* --- MODAL: CREATE/EDIT TEMPLATE --- */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4 text-left">
          <div className="w-full max-w-4xl bg-slate-950 border border-white/10 rounded-[32px] p-8 shadow-2xl space-y-6 flex flex-col max-h-[90vh]">
            <h3 className="text-2xl font-black text-white italic uppercase">{editingTemplateId ? "Edit Template" : "Create Template"}</h3>
            <form onSubmit={handleSaveTemplate} className="space-y-4 flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Template Name</label>
                  <input
                    type="text"
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                    className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none text-slate-100 font-bold focus:border-rose-500/30"
                    placeholder="e.g. Monthly Digest Layout"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subject Fallback</label>
                  <input
                    type="text"
                    value={templateForm.subject}
                    onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                    className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none text-slate-100 font-bold focus:border-rose-500/30"
                    placeholder="e.g. Newsletter Digest"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Template Content HTML</label>
                <div className="rounded-xl border border-white/5 bg-slate-950 overflow-hidden text-left">
                  <TipTapEditor
                    value={templateForm.contentHtml}
                    onChange={(html, json) => {
                      setTemplateForm(prev => ({
                        ...prev,
                        contentHtml: html,
                        contentJson: json
                      }));
                    }}
                    placeholder="Start composing template layout..."
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  Save Template
                </button>
                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="px-6 py-3 bg-slate-900 border border-white/5 rounded-xl text-xs font-black uppercase text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- INLINE STYLES FOR PAGE --- */}
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
        
        /* TipTap Placeholder override */
        .before\\:content-\\[attr\\(data-placeholder\\)\\]::before {
          content: attr(data-placeholder);
          color: #475569;
          font-style: italic;
        }
      `}</style>

    </div>
  );
}
