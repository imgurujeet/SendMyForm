import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, FileText } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { BLOG } from "@/lib/seo-data";

export const metadata = {
  title: "SendMyForm Blog — Static Forms & Web Dev Guides",
  description: "Tutorials, best-of roundups, glossary definitions, and expert advice on handling HTML forms on JAMstack websites without custom server setups.",
  alternates: {
    canonical: "https://sendmyform.live/blog"
  }
};

export default function BlogHub() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-700/5 blur-[140px] rounded-full"></div>
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 py-3 px-6 md:px-10 flex justify-between items-center backdrop-blur-xl" style={{ background: "var(--nav-bg)", borderBottom: "1px solid var(--border-color)" }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold tracking-tight text-white">
            Send<span className="text-violet-500">My</span>Form
          </Link>
          <span className="hidden sm:block text-[10px] text-slate-500 font-medium tracking-wider uppercase border border-slate-800 px-2 py-0.5 rounded">
            Blog
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/integrations" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Integrations</Link>
          <Link href="/use-cases" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Use Cases</Link>
          <Link href="/vs" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Comparisons</Link>
          <Link href="/docs" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Docs</Link>
          <ThemeToggle />
          <Link href="/dashboard" className="px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-500 transition-all">Login</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-12 px-6 max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          Static Website <span className="text-violet-400">Blog</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Detailed tutorials, comparisons, roundup guides, and conceptual explanations to help you master modern JAMstack form architectures.
        </p>
      </section>

      {/* GRID LIST */}
      <section className="py-12 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {BLOG.map((p) => {
            const isPriority = p.priority;
            return (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className={`p-6 rounded-2xl border transition-all hover:-translate-y-0.5 flex flex-col justify-between group ${
                  isPriority
                    ? "bg-violet-600/5 border-violet-500/20 hover:border-violet-500/40"
                    : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-violet-400">
                      {isPriority ? <BookOpen size={18} /> : <FileText size={18} />}
                    </span>
                    {isPriority && (
                      <span className="text-[10px] text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-violet-400 transition-colors line-clamp-3">
                    {p.h1}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6 line-clamp-2">
                    {p.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-violet-400 mt-auto">
                  Read Article <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 px-6 text-center max-w-5xl mx-auto mt-16">
        <p className="text-xs text-slate-700">© 2026 Achaia Labs. All rights reserved.</p>
      </footer>
    </div>
  );
}
