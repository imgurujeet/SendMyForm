import React from "react";
import Link from "next/link";
import { ChevronRight, Terminal, ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { SeoPageData } from "@/lib/seo-data";
import CopyCodeButton from "@/components/CopyCodeButton";
import Footer from "@/components/Footer";

interface SeoPageLayoutProps {
  data: SeoPageData;
  category: string;
}

export default function SeoPageLayout({ data, category }: SeoPageLayoutProps) {

  // Generate breadcrumbs link
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ");

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        fontFamily: "'DM Sans', 'Inter', sans-serif",
        background: "var(--bg-primary)",
        color: "var(--text-primary)"
      }}
    >
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-700/5 blur-[140px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-indigo-800/4 blur-[120px] rounded-full"></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav
        className="fixed top-0 w-full z-50 py-3 px-6 md:px-10 flex justify-between items-center backdrop-blur-xl"
        style={{
          background: "var(--nav-bg)",
          borderBottom: "1px solid var(--border-color)"
        }}
      >
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold tracking-tight text-white">
            Send<span className="text-violet-500">My</span>Form
          </Link>
          <span className="hidden sm:block text-[10px] text-slate-500 font-medium tracking-wider uppercase border border-slate-800 px-2 py-0.5 rounded">
            SEO & AEO Hub
          </span>
        </div>

        <div className="flex gap-4 md:gap-6 items-center">
          <Link href="/integrations" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Integrations
          </Link>
          <Link href="/use-cases" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Use Cases
          </Link>
          <Link href="/vs" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Comparisons
          </Link>
          <Link href="/blog" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Blog
          </Link>
          <Link href="/docs" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Docs
          </Link>
          <ThemeToggle />
          <Link href="/dashboard" className="px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-500 transition-all shadow-lg shadow-violet-900/30">
            Login
          </Link>
        </div>
      </nav>

      {/* --- MAIN CONTAINER --- */}
      <div className="min-h-screen pt-24 pb-16">
        <main className="max-w-4xl mx-auto py-12 px-6 md:px-10 relative z-10">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-violet-400 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href={`/${category}`} className="hover:text-violet-400 transition-colors">{categoryLabel}</Link>
            <ChevronRight size={12} />
            <span className="text-slate-300 truncate max-w-[200px]">{data.h1}</span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <span className="inline-flex items-center gap-1.5 bg-violet-600/10 border border-violet-500/20 text-violet-400 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-5">
              Target query: &ldquo;{data.targetQuery}&rdquo;
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-5 text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
              {data.h1}
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">
              {data.description}
            </p>
          </header>

          {/* --- AEO ANSWER BLOCK --- */}
          {data.quickAnswer && data.quickAnswer.length > 0 && (
            <section
              className="p-6 md:p-8 rounded-2xl border border-violet-500/10 mb-12 bg-gradient-to-br from-violet-900/10 to-indigo-950/10 backdrop-blur-sm"
              aria-label="Quick Answer"
            >
              <h2 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-4">Quick Summary</h2>
              <dl className="space-y-4">
                {data.quickAnswer.map((qa, i) => (
                  <div key={i} className="border-b border-white/[0.03] last:border-0 pb-4 last:pb-0">
                    <dt className="text-sm font-semibold text-white mb-2">{qa.question}</dt>
                    <dd className="text-sm text-slate-400 leading-relaxed">{qa.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* --- CODE SNIPPET (IF INTEGRATION) --- */}
          {data.codeSnippet && (
            <section className="mb-12">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Example Integration Code</h3>
                <CopyCodeButton code={data.codeSnippet} />
              </div>
              <div className="rounded-xl bg-[#080810] border border-white/[0.08] overflow-hidden">
                <pre className="p-5 text-[13px] font-mono text-violet-300 leading-relaxed overflow-x-auto">
                  {data.codeSnippet}
                </pre>
              </div>
            </section>
          )}

          {/* --- COMPARISON TABLE (IF VS PAGE) --- */}
          {data.comparisonTable && (
            <section className="mb-12">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                SendMyForm vs {data.comparisonTable.competitor} Feature Matrix
              </h3>
              <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/[0.03] border-b border-white/[0.06]">
                      <th className="text-left px-6 py-4 text-slate-500 font-medium">Metric</th>
                      <th className="text-center px-6 py-4 text-slate-500 font-medium">{data.comparisonTable.competitor}</th>
                      <th className="text-center px-6 py-4 text-violet-400 font-semibold">SendMyForm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.comparisonTable.metrics.map((metric, i) => (
                      <tr key={i} className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors last:border-0">
                        <td className="px-6 py-4 text-slate-300 font-medium">{metric.name}</td>
                        <td className="px-6 py-4 text-center text-slate-500">{metric.competitorValue}</td>
                        <td className="px-6 py-4 text-center text-emerald-400 font-medium">{metric.sendMyFormValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* --- MAIN HTML BODY --- */}
          {data.contentHtml && (
            <article 
              className="prose prose-invert max-w-none text-slate-400 leading-relaxed mb-12 space-y-6"
              style={{
                fontSize: "0.95rem"
              }}
              dangerouslySetInnerHTML={{ __html: data.contentHtml }}
            />
          )}

          {/* --- FAQ SECTION --- */}
          {data.faq && data.faq.length > 0 && (
            <section className="mb-12 border-t border-white/[0.05] pt-12">
              <h3 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {data.faq.map((item, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-violet-500/20 transition-all">
                    <h4 className="text-base font-semibold text-white mb-2">{item.question}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* --- CTA SECTION --- */}
          <section className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div className="max-w-md">
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">Connect your form today.</h3>
              <p className="text-white/80 text-sm">
                No credit card required. Free tier includes 100 submissions per month with instant setup.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-white text-black font-bold text-sm rounded-xl hover:bg-slate-200 transition-all shadow-xl flex items-center justify-center gap-2 group whitespace-nowrap"
            >
              Get Started Free <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </section>

          {/* --- INTERNAL LINKING WIDGET --- */}
          <section className="border-t border-white/[0.05] pt-8">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Related Resources</h4>
            <div className="flex flex-wrap gap-3">
              <Link href="/free-forever" className="px-3.5 py-1.5 rounded-full border border-white/[0.05] bg-white/[0.02] text-xs text-slate-400 hover:text-white hover:border-violet-500/30 transition-all">
                Free Forever
              </Link>
              <Link href="/integrations" className="px-3.5 py-1.5 rounded-full border border-white/[0.05] bg-white/[0.02] text-xs text-slate-400 hover:text-white hover:border-violet-500/30 transition-all">
                All Integrations
              </Link>
              <Link href="/use-cases" className="px-3.5 py-1.5 rounded-full border border-white/[0.05] bg-white/[0.02] text-xs text-slate-400 hover:text-white hover:border-violet-500/30 transition-all">
                All Use Cases
              </Link>
              <Link href="/vs" className="px-3.5 py-1.5 rounded-full border border-white/[0.05] bg-white/[0.02] text-xs text-slate-400 hover:text-white hover:border-violet-500/30 transition-all">
                Competitor Comparisons
              </Link>
              <Link href="/blog" className="px-3.5 py-1.5 rounded-full border border-white/[0.05] bg-white/[0.02] text-xs text-slate-400 hover:text-white hover:border-violet-500/30 transition-all">
                Static Site Blog
              </Link>
            </div>
          </section>

        </main>
      </div>

      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
}
