"use client";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import Link from "next/link";
import {
  Plus, Layers, LogOut, Settings, Home, Copy, Check, X,
  ShieldCheck, Trash2, Link2, Menu, ChevronDown,
  Mail, Code2, ArrowRight, Activity, Pencil
} from "lucide-react";
import { THEMES } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { trackProjectCreate, trackProjectDelete, trackTabSwitch, trackCopyEndpoint } from "@/lib/analytics";
import ThemeToggle from "@/components/ThemeToggle";

const THEME_LIST = Object.values(THEMES) as Array<{
  id: string; name: string; primary: string; bg: string;
  card: string; border: string; text: string; muted: string; accent: string;
}>;

const DUMMY_SUBMISSION = {
  "Full Name": "Alex Johnson",
  "Email": "alex@example.com",
  "Message": "Hey, I'd love to learn more about your services!",
  "Submitted": new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
};

const EmailPreviewCard = ({ theme, projectName, previewData }: any) => {
  const card = { background: "var(--bg-card)", borderColor: "var(--border-color)" };
  const muted = { color: "var(--text-muted)" };

  return (
    <div className="rounded-2xl border overflow-hidden" style={card}>
      <div className="flex items-center gap-2 px-5 py-3" style={{ borderBottom: "1px solid var(--border-color)" }}>
        <Mail size={14} style={muted} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={muted}>Email preview</span>
        <span className="ml-auto text-[10px] font-medium" style={muted}>{theme.name}</span>
      </div>
      <div className="p-4" style={{ background: "var(--code-bg)" }}>
        <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border-color)" }}>
          <div className="flex items-center gap-1.5 px-3 py-2.5" style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}>
            <div className="w-2 h-2 rounded-full bg-rose-500/60" />
            <div className="w-2 h-2 rounded-full bg-amber-500/60" />
            <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
            <span className="text-[9px] ml-2 font-mono" style={muted}>Inbox — New Submission</span>
          </div>
          <div className="p-5 transition-all duration-500" style={{ background: theme.bg, color: theme.text }}>
            <div className="rounded-2xl p-5 transition-all duration-500" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
              <div className="mb-4 pb-4" style={{ borderBottom: `1px solid ${theme.border}` }}>
                <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: theme.accent }}>New Submission</p>
                <h3 className="text-sm font-bold" style={{ color: theme.text }}>{projectName || "Untitled Project"}</h3>
              </div>
              <div className="space-y-3">
                {Object.entries({
                  "Full Name": previewData.name || DUMMY_SUBMISSION["Full Name"],
                  "Email": previewData.email || DUMMY_SUBMISSION["Email"],
                  "Message": previewData.message || DUMMY_SUBMISSION["Message"],
                  "Submitted": DUMMY_SUBMISSION["Submitted"],
                }).map(([key, val]) => (
                  <div key={key} className="pb-3" style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: theme.muted }}>{key}</p>
                    <p className="text-xs leading-relaxed" style={{ color: theme.text }}>{val}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 text-center" style={{ borderTop: `1px solid ${theme.border}` }}>
                <p className="text-[9px] font-medium uppercase tracking-widest" style={{ color: theme.muted }}>Sent via SendMyForm · Achaia Labs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const [newTheme, setNewTheme] = useState("modern");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<"preview" | "code">("preview");

  // Preview data — user-typed values for live form & email preview
  const [previewData, setPreviewData] = useState({ name: "", email: "", message: "" });

  // Email theme
  const [selectedTheme, setSelectedTheme] = useState("modern");
  const [isSavingTheme, setIsSavingTheme] = useState(false);
  const [themeSaved, setThemeSaved] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setOrigin(
      window.location.host.includes("localhost")
        ? "http://localhost:3002"
        : `https://${window.location.host}`
    );
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        const q = query(collection(db, "projects"), where("uid", "==", u.uid));
        const unsubProjects = onSnapshot(q, (snap) => {
          setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
          setLoading(false);
        }, () => {
          setError("Failed to load projects. Please refresh.");
          setLoading(false);
        });
        return () => unsubProjects();
      } else {
        window.location.href = "/auth";
      }
    });
    return () => unsub();
  }, []);

  const currentProject = useMemo(
    () => selectedProjectId ? projects.find((p) => p.id === selectedProjectId) : projects[0],
    [projects, selectedProjectId]
  );

  useEffect(() => {
    if (currentProject) {
      setSelectedTheme(currentProject.theme || "modern");
    }
  }, [currentProject?.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreate = async () => {
    if (!newName || !newSlug || isCreating) return;
    setIsCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/project/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, name: newName, slug: newSlug, emailTo: user.email || "", theme: newTheme }),
      });
      const data = await res.json();
      if (data.id || data.success) {
        trackProjectCreate(newName);
        setSelectedProjectId(data.id);
        setIsCreatingNew(false);
        setNewName(""); setNewSlug("");
        setActiveTab("projects");
      } else {
        setError(data.error || "Failed to create project.");
      }
    } catch { setError("Network error. Please try again."); }
    finally { setIsCreating(false); }
  };

  const deleteProj = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    trackProjectDelete(id);
    await deleteDoc(doc(db, "projects", id));
    setSelectedProjectId(null);
    setActiveTab("overview");
  };

  const saveTheme = async (themeId: string) => {
    if (!currentProject) return;
    setIsSavingTheme(true);
    try {
      await fetch("/api/project/set-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: currentProject.id, theme: themeId }),
      });
      setThemeSaved(true);
      setTimeout(() => setThemeSaved(false), 2000);
    } finally { setIsSavingTheme(false); }
  };

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    setThemeDropdownOpen(false);
    saveTheme(themeId);
  };

  const switchTab = (tab: string) => {
    trackTabSwitch(tab);
    setActiveTab(tab);
    setIsCreatingNew(false);
    setError(null);
    setSidebarOpen(false);
  };

  if (!mounted || loading) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const activeTheme = THEME_LIST.find((t) => t.id === selectedTheme) || THEME_LIST[1];
  const userInitial = user?.displayName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || "U";
  const endpointSlug = currentProject?.slug || currentProject?.id || "YOUR_ID";
  const endpointUrl = `${origin}/api/f/${endpointSlug}`;

  // Reusable card style
  const card = { background: "var(--bg-card)", borderColor: "var(--border-color)" };
  const muted = { color: "var(--text-muted)" };
  const secondary = { color: "var(--text-secondary)" };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={cn("w-60 flex flex-col fixed h-screen z-50 transition-transform duration-300", sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0")}
        style={{ background: "var(--bg-secondary)", borderRight: "1px solid var(--border-color)" }}
      >
        <div className="px-5 py-5" style={{ borderBottom: "1px solid var(--border-color)" }}>
          <Link href="/" className="text-lg font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Send<span className="text-violet-500">My</span>Form
          </Link>
          <p className="text-[10px] mt-0.5 font-medium" style={muted}>by Achaia Labs</p>
        </div>

        <div className="px-4 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid var(--border-color)" }}>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-violet-600/80 flex items-center justify-center text-xs font-bold flex-shrink-0 text-white">{userInitial}</div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{user?.displayName || "User"}</p>
            <p className="text-[10px] truncate" style={muted}>{user?.email}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-3 flex-1">
          {[
            { id: "overview", label: "Overview", icon: Home },
            { id: "projects", label: "My Forms", icon: Layers },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((t) => (
            <button key={t.id} onClick={() => switchTab(t.id)}
              className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                activeTab === t.id && !isCreatingNew ? "bg-violet-600/15 text-violet-400 border border-violet-500/20" : "hover:bg-white/[0.04]")}
              style={activeTab === t.id && !isCreatingNew ? {} : muted}
            >
              <t.icon size={16} />{t.label}
            </button>
          ))}
        </nav>

        <div className="p-3" style={{ borderTop: "1px solid var(--border-color)" }}>
          <button onClick={() => signOut(auth)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:text-red-400 hover:bg-red-500/5 transition-all"
            style={muted}>
            <LogOut size={16} />Sign out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="md:ml-60 flex-1 flex flex-col h-full overflow-y-auto">

        {/* Topbar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-5 md:px-8 py-4 backdrop-blur-xl"
          style={{ background: "var(--nav-bg)", borderBottom: "1px solid var(--border-color)" }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg border"
              style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium" style={muted}>Active</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button onClick={() => { setIsCreatingNew(true); setActiveTab(""); setError(null); }}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-violet-900/30">
              <Plus size={15} />New project
            </button>
          </div>
        </div>

        <div className="flex-1 p-5 md:p-8">

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
              <X size={16} />
              <p className="text-sm font-medium flex-1">{error}</p>
              <button onClick={() => setError(null)}><X size={14} /></button>
            </div>
          )}

          {/* ── CREATE PROJECT ── */}
          {isCreatingNew ? (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Create a new project</h2>
                  <p className="text-sm mb-8" style={muted}>You'll get a unique form endpoint to start receiving submissions.</p>
                  <div className="space-y-5 mb-8">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={secondary}>Project name</label>
                      <input type="text" placeholder="e.g. Contact Form" value={newName} onChange={(e) => setNewName(e.target.value)}
                        className="w-full rounded-xl px-4 py-3 outline-none text-sm border transition-colors focus:border-violet-500/50"
                        style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={secondary}>URL slug</label>
                      <div className="flex items-center rounded-xl px-4 py-3 border transition-colors focus-within:border-violet-500/50"
                        style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
                        <span className="text-sm font-mono mr-1" style={muted}>/api/f/</span>
                        <input type="text" placeholder="contact-form" value={newSlug}
                          onChange={(e) => setNewSlug(e.target.value.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))}
                          className="bg-transparent flex-1 outline-none text-sm font-mono placeholder:text-slate-600"
                          style={{ color: "var(--text-primary)" }} />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={secondary}>Email Theme</label>
                      <div className="grid grid-cols-2 gap-3">
                        {THEME_LIST.map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => setNewTheme(theme.id)}
                            className={cn("flex flex-col items-start p-3 rounded-xl border transition-all text-left",
                              newTheme === theme.id ? "border-violet-500 shadow-sm shadow-violet-500/20" : "hover:border-violet-500/50"
                            )}
                            style={{ background: "var(--bg-card)", borderColor: newTheme === theme.id ? "" : "var(--border-color)" }}
                          >
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="w-3 h-3 rounded-full" style={{ background: theme.accent }} />
                              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{theme.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleCreate} disabled={!newName || !newSlug || isCreating}
                      className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                      {isCreating ? "Creating…" : "Create project"}
                    </button>
                    <button onClick={() => setIsCreatingNew(false)}
                      className="px-5 py-3 rounded-xl text-sm font-semibold border transition-all"
                      style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", ...secondary }}>
                      Cancel
                    </button>
                  </div>
                </div>

                {/* CREATE PREVIEW */}
                <div>
                  <EmailPreviewCard
                    theme={THEME_LIST.find((t) => t.id === newTheme) || THEME_LIST[1]}
                    projectName={newName}
                    previewData={previewData}
                  />
                </div>
              </div>
            </div>

            /* ── OVERVIEW ── */
          ) : activeTab === "overview" ? (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-1">
                  Good to see you{user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""} 👋
                </h1>
                <p className="text-sm" style={muted}>Here's a snapshot of your SendMyForm account.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Total Projects", val: projects.length.toString(), icon: Layers, cls: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
                  { label: "Data Stored", val: "Zero", icon: ShieldCheck, cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                  { label: "System Status", val: "Online", icon: Activity, cls: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                ].map((s, i) => (
                  <div key={i} className="p-6 rounded-2xl border" style={card}>
                    <div className={`p-2 rounded-lg border w-fit mb-4 ${s.cls}`}><s.icon size={15} /></div>
                    <p className="text-2xl font-bold mb-1">{s.val}</p>
                    <p className="text-xs font-medium" style={muted}>{s.label}</p>
                  </div>
                ))}
              </div>

              {projects.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-16 text-center" style={{ borderColor: "var(--border-color)" }}>
                  <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                    <Layers size={20} className="text-violet-400" />
                  </div>
                  <h3 className="text-base font-semibold mb-2">No projects yet</h3>
                  <p className="text-sm mb-6" style={muted}>Create your first project to get a form endpoint.</p>
                  <button onClick={() => { setIsCreatingNew(true); setActiveTab(""); }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-all">
                    <Plus size={15} />Create first project
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={muted}>Your projects</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {projects.map((p) => (
                      <button key={p.id} onClick={() => { setSelectedProjectId(p.id); switchTab("projects"); }}
                        className="p-5 rounded-xl text-left transition-all group border hover:border-violet-500/30" style={card}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                            <Layers size={14} className="text-violet-400" />
                          </div>
                          <ArrowRight size={14} className="text-slate-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <p className="text-sm font-semibold mb-1">{p.name}</p>
                        <p className="text-xs font-mono truncate" style={muted}>/api/f/{p.slug || p.id}</p>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            /* ── MY FORMS ── */
          ) : activeTab === "projects" && currentProject ? (
            <div className="animate-fade-in">

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold">{currentProject.name}</h1>
                  <p className="text-xs font-mono mt-0.5" style={muted}>/api/f/{endpointSlug}</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Theme dropdown */}
                  <div className="relative" ref={themeDropdownRef}>
                    <button onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all hover:border-violet-500/30"
                      style={{ ...card, ...secondary }}>
                      <div className="w-3 h-3 rounded-full" style={{ background: activeTheme.accent }} />
                      <span className="hidden sm:inline">{activeTheme.name}</span>
                      <span className="sm:hidden">Theme</span>
                      <ChevronDown size={13} className={cn("transition-transform", themeDropdownOpen && "rotate-180")} style={muted} />
                    </button>
                    {themeDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 rounded-xl shadow-2xl overflow-hidden z-50 border"
                        style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
                        {THEME_LIST.map((theme) => (
                          <button key={theme.id} onClick={() => handleThemeSelect(theme.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-all hover:bg-white/[0.04]"
                            style={{ color: selectedTheme === theme.id ? "var(--text-primary)" : "var(--text-muted)" }}>
                            <div className="w-3 h-3 rounded-full" style={{ background: theme.accent }} />
                            {theme.name}
                            {selectedTheme === theme.id && <Check size={12} className="ml-auto text-violet-400" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {projects.length > 1 && (
                    <select onChange={(e) => setSelectedProjectId(e.target.value)} value={selectedProjectId || ""}
                      className="px-3 py-2 rounded-lg outline-none text-sm font-medium cursor-pointer border"
                      style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id} style={{ background: "var(--bg-secondary)" }}>{p.name}</option>
                      ))}
                    </select>
                  )}

                  <button onClick={() => deleteProj(currentProject.id)}
                    className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Toast indicators */}
              {(isSavingTheme || themeSaved) && (
                <div className="flex gap-3 mb-5 flex-wrap">
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-medium">
                    {themeSaved ? <Check size={13} /> : <div className="w-3 h-3 border border-emerald-400 border-t-transparent rounded-full animate-spin" />}
                    {themeSaved ? "Theme saved" : "Saving theme…"}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* LEFT col */}
                <div className="space-y-5">

                  {/* Endpoint card */}
                  <div className="p-6 rounded-2xl border" style={card}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Link2 size={14} className="text-violet-400" />
                        <p className="text-xs font-semibold uppercase tracking-wider" style={muted}>Form Endpoint</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 rounded-xl px-4 py-3 border" style={{ background: "var(--code-bg)", borderColor: "var(--border-color)" }}>
                        <code className="text-violet-400 text-xs sm:text-sm font-mono flex-1 truncate">{endpointUrl}</code>
                        <button
                          onClick={() => { navigator.clipboard.writeText(endpointUrl); trackCopyEndpoint(currentProject.id); setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); }}
                          className="p-2 rounded-lg border hover:border-violet-500/30 hover:text-violet-400 transition-all flex-shrink-0"
                          style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", ...muted }}>
                          {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                      <p className="text-xs" style={muted}>* The URL will be unique to each project.</p>
                    </div>
                  </div>

                  {/* Code snippet card */}
                  <div className="rounded-2xl border overflow-hidden" style={card}>
                    <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <div className="flex items-center gap-2">
                        <Code2 size={14} style={muted} />
                        <span className="text-xs font-semibold uppercase tracking-wider" style={muted}>Integration snippet</span>
                      </div>
                      <div className="flex">
                        {(["preview", "code"] as const).map((tab) => (
                          <button key={tab} onClick={() => setActivePreviewTab(tab)}
                            className={cn("px-3 py-1 text-xs font-medium rounded-lg transition-all", activePreviewTab === tab ? "bg-white/[0.07]" : "")}
                            style={{ color: activePreviewTab === tab ? "var(--text-primary)" : "var(--text-muted)" }}>
                            {tab === "preview" ? "Preview" : "HTML"}
                          </button>
                        ))}
                      </div>
                    </div>
                    {activePreviewTab === "code" ? (
                      <pre className="p-5 text-xs font-mono text-violet-400 leading-relaxed overflow-x-auto" style={{ background: "var(--code-bg)" }}>
                        {`<form
                          action="${endpointUrl}"
                          method="POST"
                          enctype="multipart/form-data"
                        >
                          <input name="name" type="text" required />
                          <input name="email" type="email" required />
                          <textarea name="message"></textarea>
                          <button type="submit">Send</button>
                        </form>`}
                      </pre>
                    ) : (
                      <div className="p-5" style={{ background: "var(--code-bg)" }}>
                        <div className="rounded-xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
                          <p className="text-[10px] font-semibold uppercase tracking-widest mb-4" style={muted}>Form preview — type to see live email preview →</p>
                          <div className="space-y-3">
                            <input
                              type="text" placeholder="Name…" value={previewData.name}
                              onChange={(e) => setPreviewData((p) => ({ ...p, name: e.target.value }))}
                              className="h-9 w-full rounded-lg border px-3 text-xs outline-none"
                              style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                            />
                            <input
                              type="email" placeholder="Email…" value={previewData.email}
                              onChange={(e) => setPreviewData((p) => ({ ...p, email: e.target.value }))}
                              className="h-9 w-full rounded-lg border px-3 text-xs outline-none"
                              style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                            />
                            <textarea
                              placeholder="Message…" value={previewData.message}
                              onChange={(e) => setPreviewData((p) => ({ ...p, message: e.target.value }))}
                              className="w-full rounded-lg border px-3 py-2 text-xs outline-none resize-none"
                              rows={2}
                              style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                            />
                            <div className="h-9 rounded-lg flex items-center justify-center text-xs font-semibold text-white" style={{ background: activeTheme.accent }}>
                              Submit
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT — Live email preview */}
                <EmailPreviewCard
                  theme={activeTheme}
                  projectName={currentProject.name}
                  previewData={previewData}
                />
              </div>
            </div>

            /* ── SETTINGS ── */
          ) : activeTab === "settings" ? (
            <div className="animate-fade-in max-w-2xl">
              <h1 className="text-2xl font-bold mb-1">Settings</h1>
              <p className="text-sm mb-8" style={muted}>Manage your account and preferences.</p>

              <div className="p-6 rounded-2xl border mb-5" style={card}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-5" style={muted}>Profile</p>
                <div className="flex items-center gap-5">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/10" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-violet-600/80 flex items-center justify-center text-xl font-bold text-white">{userInitial}</div>
                  )}
                  <div>
                    <p className="text-lg font-bold">{user?.displayName || "User"}</p>
                    <p className="text-sm" style={muted}>{user?.email}</p>
                    <p className="text-[10px] mt-1 font-mono" style={muted}>ID: {user?.uid?.slice(0, 16)}…</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                {[
                  { label: "Total projects", val: projects.length.toString() },
                  { label: "Account status", val: "Active" },
                  { label: "Sign-in method", val: "Google" },
                  { label: "Data policy", val: "Zero storage" },
                ].map((s, i) => (
                  <div key={i} className="p-5 rounded-2xl border" style={card}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={muted}>{s.label}</p>
                    <p className="text-base font-bold">{s.val}</p>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
                <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-4">Danger zone</p>
                <button onClick={() => signOut(auth)}
                  className="px-5 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl font-semibold text-sm hover:bg-red-500 hover:text-white transition-all">
                  Sign out
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}