"use client";
import React, { useState } from "react";
import Link from "next/link";
import { 
  Code2, 
  Copy, 
  Check, 
  ArrowLeft, 
  Layout, 
  Eye, 
  Settings2,
  Terminal,
  Zap
} from "lucide-react";
import AdSense from "@/components/AdSense";

export default function FormGeneratorClient() {
  const [copied, setCopied] = useState(false);
  const [formName, setFormName] = useState("Contact Form");
  const [endpointId, setEndpointId] = useState("YOUR_PROJECT_ID");
  const [fields, setFields] = useState([
    { id: 1, label: "Full Name", type: "text", name: "name", required: true },
    { id: 2, label: "Email Address", type: "email", name: "email", required: true },
    { id: 3, label: "Message", type: "textarea", name: "message", required: true },
  ]);

  const generateCode = () => {
    const fieldHtml = fields.map(field => {
      if (field.type === "textarea") {
        return `  <div class="field">
    <label>${field.label}</label>
    <textarea name="${field.name}" ${field.required ? 'required' : ''}></textarea>
  </div>`;
      }
      return `  <div class="field">
    <label>${field.label}</label>
    <input type="${field.type}" name="${field.name}" ${field.required ? 'required' : ''} />
  </div>`;
    }).join("\n");

    return `<form action="https://sendmyform.live/api/f/${endpointId}" method="POST">
${fieldHtml}
  <button type="submit">Submit</button>
</form>`;
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-black/20 backdrop-blur-xl px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <ArrowLeft size={18} className="text-slate-500 group-hover:text-white transition-colors" />
          <span className="font-bold">Send<span className="text-violet-500">My</span>Form</span>
        </Link>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">
          SEO Tool: Form Generator
        </span>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Free HTML <span className="text-violet-400">Form Generator</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Build your form visually, generate the code, and connect it to our no-backend service in seconds. No setup required.
          </p>
          </header>

          <AdSense adSlot="tools_form_gen_top" />

          <div className="grid lg:grid-cols-2 gap-10">
          {/* Configurator */}
          <section className="space-y-6">
            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
              <div className="flex items-center gap-3 mb-6">
                <Settings2 size={20} className="text-violet-400" />
                <h2 className="text-xl font-semibold">Configure</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Form Name</label>
                  <input 
                    type="text" 
                    value={formName} 
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-4 py-3 text-sm outline-none focus:border-violet-500/50 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Your Endpoint ID</label>
                  <input 
                    type="text" 
                    value={endpointId} 
                    onChange={(e) => setEndpointId(e.target.value)}
                    placeholder="e.g. contact-form-123"
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-4 py-3 text-sm outline-none focus:border-violet-500/50 transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Layout size={20} className="text-violet-400" />
                  <h2 className="text-xl font-semibold">Fields</h2>
                </div>
              </div>
              
              <div className="space-y-3">
                {fields.map((field) => (
                  <div key={field.id} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 group">
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{field.label}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{field.type} • {field.required ? 'Required' : 'Optional'}</p>
                    </div>
                    <button 
                      onClick={() => setFields(fields.filter(f => f.id !== field.id))}
                      className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Preview & Code */}
          <section className="space-y-6">
            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Code2 size={20} className="text-violet-400" />
                  <h2 className="text-xl font-semibold">Generated Code</h2>
                </div>
                <button 
                  onClick={copyCode}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-xs font-bold rounded-lg transition-all shadow-lg shadow-violet-900/20"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied!" : "Copy HTML"}
                </button>
              </div>
              <div className="relative rounded-xl bg-black border border-white/10 overflow-hidden">
                <div className="absolute top-0 right-0 p-2 pointer-events-none text-[10px] text-slate-700 font-mono">HTML</div>
                <pre className="p-6 text-[13px] font-mono leading-relaxed text-violet-300 overflow-x-auto whitespace-pre-wrap">
                  {generateCode()}
                </pre>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
              <div className="flex items-center gap-3 mb-6">
                <Eye size={20} className="text-violet-400" />
                <h2 className="text-xl font-semibold">Live Preview</h2>
              </div>
              <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
                <div className="space-y-4 max-w-md">
                  {fields.map(field => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium mb-1.5">{field.label}</label>
                      {field.type === 'textarea' ? (
                        <div className="w-full h-20 rounded-lg bg-white/5 border border-white/10" />
                      ) : (
                        <div className="w-full h-10 rounded-lg bg-white/5 border border-white/10" />
                      )}
                    </div>
                  ))}
                  <div className="w-full h-10 rounded-lg bg-violet-600 mt-2 flex items-center justify-center font-bold text-sm">
                    Submit Form
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <AdSense adSlot="tools_form_gen_bottom" />

        {/* SEO Content Section --- */}
        <article className="mt-24 pt-24 border-t border-white/[0.05] max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">How to use the HTML Form Generator</h2>
          <div className="grid md:grid-cols-2 gap-12 text-slate-400 leading-relaxed text-sm">
            <div className="space-y-4">
              <p>
                Our <strong>Free HTML Form Generator</strong> is built specifically for developers who are tired of building custom backends for every contact form. Whether you're working on a portfolio, a landing page, or a complex React application, this tool saves you hours of development time.
              </p>
              <p>
                Simply configure your fields, copy the generated code, and paste it into your project. By using the <code className="text-violet-400">POST</code> method pointing to our secure API, you never have to worry about SMTP servers, database management, or PHP scripts ever again.
              </p>
            </div>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <Zap size={18} className="text-violet-400 shrink-0" />
                <span><strong>No SDK Required:</strong> Standard HTML attributes are all you need. Works with any frontend.</span>
              </li>
              <li className="flex gap-3">
                <Terminal size={18} className="text-violet-400 shrink-0" />
                <span><strong>Clean Code:</strong> No unnecessary IDs, classes, or bloat. Just pure, semantic HTML.</span>
              </li>
              <li className="flex gap-3">
                <Code2 size={18} className="text-violet-400 shrink-0" />
                <span><strong>Framework Agnostic:</strong> Use the generated code in WordPress, Webflow, Framer, or custom builds.</span>
              </li>
            </ul>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="py-10 px-10 border-t border-white/[0.05] text-center">
        <p className="text-xs text-slate-800">
          Built by <a href="https://achaialabs.tech" className="hover:text-violet-500">Achaia Labs</a> • Part of the SendMyForm Ecosystem
        </p>
      </footer>
    </div>
  );
}
