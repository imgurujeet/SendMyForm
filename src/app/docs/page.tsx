"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Terminal, 
  Code2, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Globe, 
  CheckCircle2, 
  Copy, 
  Check, 
  Server,
  Layers,
  Palette,
  Layout,
  Mail,
  Smartphone
} from "lucide-react";
import { THEMES } from "@/lib/themes";

export default function ApiDocsPage() {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");
  const [activeThemePreview, setActiveThemePreview] = useState("modern");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const dummyData = {
    "Full Name": "James Achaia",
    "Email": "james@achaialabs.tech",
    "Company": "Achaia Labs",
    "Message": "I need a high-performance form backend for my new portfolio site. The easyForm API looks incredible!",
    "Timestamp": "2026-04-06 14:25:33"
  };

  if (!mounted) return (
    <div className="h-screen bg-black flex items-center justify-center text-white italic font-black uppercase tracking-widest text-2xl animate-pulse">
      SendMyForm Node Booting...
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-violet-600/50 overflow-x-hidden">
      
      {/* Background Neural Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-violet-600/10 blur-[180px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/5 blur-[120px] rounded-full"></div>

      {/* --- DOCS NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 py-2 md:py-3 px-4 md:px-8 flex justify-between items-center backdrop-blur-2xl border-b border-white/5">
        <Link href="/" className="text-2xl font-black tracking-tighter italic uppercase">
          Send<span className="text-violet-600">My</span>Form <span className="text-violet-600 block text-[10px] font-bold tracking-[0.4em] mt-1 italic">DEVELOPER_DOCS</span>
        </Link>
        <div className="flex gap-8 items-center">
          <Link href="/dashboard" className="bg-violet-600 hover:bg-violet-500 text-white font-black uppercase text-xs px-8 py-3.5 rounded-2xl shadow-2xl shadow-violet-900/40 transition-all hover:scale-105 active:scale-95 italic">Open Studio</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-24 px-10 relative z-10">
        
        <header className="mb-24">
           <span className="bg-violet-600/10 border border-violet-500/20 text-violet-400 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic mb-10 inline-block">
             API VERSION: V2.0
           </span>
           <h1 className="text-7xl font-black tracking-tightest leading-none mb-10 uppercase italic">
             Build with <span className="text-violet-600">Neural</span><br /> Ingestion.
           </h1>
           <p className="text-slate-500 text-xl font-bold italic uppercase tracking-tight max-w-2xl leading-relaxed">
             Integration is zero-friction. Just pass data to our endpoint and we do the rest. No setup, no complex backend code.
           </p>
        </header>

        {/* --- CORE INTEGRATION --- */}
        <section className="mb-32">
           <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-violet-600/10 rounded-2xl border border-violet-500/20"><Terminal size={24} className="text-violet-500" /></div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Your <span className="text-violet-600">Form Endpoint</span></h2>
           </div>

           <div className="p-12 rounded-[56px] bg-slate-950/30 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-[60px] group-hover:bg-violet-600/10 transition-all"></div>
              
              <div className="flex justify-between items-center mb-10">
                 <p className="text-[10px] font-black italic uppercase tracking-widest text-slate-500 underline decoration-violet-500 underline-offset-8">Neural Node Path</p>
                 <button 
                   onClick={() => copyToClipboard(`${origin || 'https://easyform.achaialabs.tech'}/api/f/[YOUR_FORM_ID]`)}
                   className="flex items-center gap-2 p-3 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest italic"
                 >
                   {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                   {copied ? "NODE PATH COPIED" : "Copy Form URL"}
                 </button>
              </div>

              <div className="p-10 bg-black border border-white/10 rounded-[40px] shadow-inner mb-12">
                 <pre className="text-sm font-mono text-violet-400 group-hover:text-white transition-colors duration-500 italic leading-loose overflow-x-auto whitespace-pre-wrap">
                    <code>
{`<!-- Simply add this to your website -->
<form action="${origin || 'https://easyform.achaialabs.tech'}/api/f/[YOUR_FORM_ID]" method="POST">
  <input name="email" type="email" required />
  <button type="submit">Submit</button>
</form>`}
                    </code>
                 </pre>
              </div>

              <div className="grid grid-cols-2 gap-8">
                 <div className="p-10 rounded-[32px] bg-black border border-white/5 hover:border-violet-600/30 transition-all group cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-violet-600/5 blur-[40px]"></div>
                    <h5 className="text-lg font-black text-white uppercase italic mb-4 tracking-tighter">Response Codes</h5>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest italic border-b border-white/5 pb-2">
                          <span className="text-slate-500">Success</span>
                          <span className="text-emerald-500">200 OK</span>
                       </div>
                    </div>
                 </div>
                 <div className="p-10 rounded-[32px] bg-black border border-white/5 hover:border-violet-600/30 transition-all group cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-violet-600/5 blur-[40px]"></div>
                    <h5 className="text-lg font-black text-white uppercase italic mb-4 tracking-tighter">Zero-Code Setup</h5>
                    <div className="space-y-3">
                       {['Works on WordPress', 'Works on Framer/Wix', 'Works on Custom Sites'].map((f, i) => (
                         <div key={i} className="flex items-center gap-3">
                            <CheckCircle2 size={12} className="text-violet-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-500">{f}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* --- DYNAMIC THEME PREVIEW (DUMMY DATA) --- */}
        <section className="mb-32">
           <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-violet-600/10 rounded-2xl border border-violet-500/20"><Palette size={24} className="text-violet-500" /></div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Neural Theme <span className="text-violet-600">Previews</span></h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              {Object.values(THEMES).map((theme: any) => (
                <button 
                  key={theme.id}
                  onClick={() => setActiveThemePreview(theme.id)}
                  className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest italic transition-all border ${activeThemePreview === theme.id ? 'bg-violet-600 border-violet-500 text-white shadow-2xl shadow-violet-900/40' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'}`}
                >
                  {theme.name}
                </button>
              ))}
           </div>

           {/* Actual Preview Browser Mockup */}
           <div className="p-10 rounded-[64px] bg-slate-950/40 border border-white/5 min-h-[600px] flex items-center justify-center relative overflow-hidden animate-fade-in" key={activeThemePreview}>
              <div className="absolute top-0 left-0 w-full p-4 border-b border-white/5 bg-black/40 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                 <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                 <span className="text-[8px] font-black uppercase text-slate-700 ml-4 italic">Neural-Node: Confirming Transmission...</span>
              </div>

              {/* The Styled Email Frame */}
              <div 
                className="max-w-md w-full rounded-[40px] p-12 shadow-2xl transition-all duration-500"
                style={{ 
                  backgroundColor: THEMES[activeThemePreview.toUpperCase().replace(/-/g, '_') as keyof typeof THEMES]?.bg || "#000",
                  color: THEMES[activeThemePreview.toUpperCase().replace(/-/g, '_') as keyof typeof THEMES]?.text || "#fff",
                  border: `1px solid ${THEMES[activeThemePreview.toUpperCase().replace(/-/g, '_') as keyof typeof THEMES]?.border || "transparent"}`
                }}
              >
                 <h4 className="text-center font-black uppercase italic mb-10 tracking-widest text-xs" style={{ color: THEMES[activeThemePreview.toUpperCase().replace(/-/g, '_') as keyof typeof THEMES]?.primary }}>Lead Received: Portfolio</h4>
                 <div className="space-y-6">
                    {Object.entries(dummyData).map(([k, v]) => (
                      <div key={k} className="border-b pb-4" style={{ borderColor: THEMES[activeThemePreview.toUpperCase().replace(/-/g, '_') as keyof typeof THEMES]?.border }}>
                         <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-50">{k}</p>
                         <p className="text-sm font-bold italic">{v}</p>
                      </div>
                    ))}
                 </div>
                 <div className="mt-12 p-6 rounded-3xl bg-black text-white text-center">
                    <p className="text-[8px] font-black uppercase tracking-widest text-violet-500 mb-2 italic">Achaia Labs Partner</p>
                    <h5 className="text-[10px] font-black uppercase italic mb-2">Build with Precision</h5>
                    <p className="text-[8px] text-slate-500 mb-6 italic">Upgrade your project with our premium UI nodes.</p>
                    <span className="px-6 py-2 bg-white text-black text-[8px] font-black uppercase rounded-full">Discover</span>
                 </div>
              </div>
           </div>
        </section>

        {/* --- NODE ARCHITECTURE --- */}
        <section className="mb-32">
           <div className="flex items-center gap-4 mb-16">
              <div className="p-3 bg-violet-600/10 rounded-2xl border border-violet-500/20"><Server size={24} className="text-violet-500" /></div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Neural Ingestion <span className="text-violet-600">Workflow</span></h2>
           </div>

           <div className="grid grid-cols-3 gap-8">
              {[
                { title: "Ingestion", step: "01", desc: "Data enters our edge node. Validated against our neural Zod schema instantly." },
                { title: "Filtering", step: "02", desc: "Native bot protection filters spoofed headers and honeypot triggers." },
                { title: "Delivery", step: "03", desc: "Transmission to project owner via themed SMTP nodes with ad monetization." }
              ].map((w, i) => (
                <div key={i} className="p-12 rounded-[48px] bg-white/5 border border-white/5 hover:border-violet-600/40 transition-all group">
                   <p className="text-4xl font-black italic text-white/5 mb-6 group-hover:text-violet-500/10 transition-colors uppercase">{w.step}</p>
                   <h4 className="text-xl font-black italic text-white uppercase mb-4 tracking-tighter italic">{w.title}</h4>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-loose italic">{w.desc}</p>
                </div>
              ))}
           </div>
        </section>

      </main>

      <footer className="py-24 px-10 border-t border-white/5 bg-black text-center">
        <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.5em] italic italic decoration-white/5">
           &copy; 2026
           <a href="https://achaialabs.tech" 
           target="_blank" 
           rel="noopener noreferrer"
           className="hover:text-violet-500 transition-colors duration-200">Achaia Labs</a>. Secured by SendMyForm v2 Protocol.
        </p>
      </footer>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .tracking-tightest {
          letter-spacing: -0.09em;
        }
        .shadow-glow {
          box-shadow: 0 0 30px -5px currentColor;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #000;
        }
        ::-webkit-scrollbar-thumb {
          background: #111;
          border-radius: 99px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #6d28d9;
        }
      `}</style>
    </div>
  );
}
