"use client";

import React, { useState } from "react";
import { 
  Sparkles, Layers, Mail, ArrowRight, ArrowLeft, Upload, Check, 
  UserPlus, HelpCircle, FileSpreadsheet, Plus, Settings
} from "lucide-react";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface OnboardingWizardProps {
  user: any;
  onComplete: (profile: any) => void;
}

export default function OnboardingWizard({ user, onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [product, setProduct] = useState<"forms" | "newsletter" | "both" | null>(null);
  
  // Contacts State
  const [importMethod, setImportMethod] = useState<"csv" | "paste" | "manual" | null>(null);
  const [rawContacts, setRawContacts] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [contactsList, setContactsList] = useState<Array<{ name: string; email: string }>>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  // List State
  const [listName, setListName] = useState("General Subscribers");
  const [listDesc, setListDesc] = useState("My first subscriber list");

  // Campaign State
  const [campaignName, setCampaignName] = useState("Welcome Campaign");
  const [campaignSubject, setCampaignSubject] = useState("Welcome to my newsletter!");
  const [campaignContent, setCampaignContent] = useState("<h1>Hello {{name}}!</h1><p>Thanks for subscribing. Stay tuned for exciting updates!</p>");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse Copy/Pasted Contacts
  const handleParsePaste = () => {
    if (!rawContacts.trim()) return;
    const lines = rawContacts.split("\n");
    const parsed: Array<{ name: string; email: string }> = [];
    
    lines.forEach((line) => {
      const emailMatch = line.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
      if (emailMatch) {
        const email = emailMatch[0].trim().toLowerCase();
        let name = line.replace(emailMatch[0], "").replace(/[<>,;"'\\/]/g, "").trim();
        if (!name) {
          name = email.split("@")[0];
        }
        parsed.push({ name, email });
      }
    });

    if (parsed.length > 0) {
      setContactsList((prev) => [...prev, ...parsed]);
      setRawContacts("");
      setImportMethod(null);
    }
  };

  // Add Single Manual Contact
  const handleAddManual = () => {
    if (!manualEmail || !manualEmail.includes("@")) return;
    setContactsList((prev) => [...prev, { name: manualName || manualEmail.split("@")[0], email: manualEmail.toLowerCase().trim() }]);
    setManualName("");
    setManualEmail("");
    setImportMethod(null);
  };

  // Handle CSV file select and parser
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;
      
      const lines = text.split("\n");
      const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
      
      const emailIdx = headers.findIndex(h => h.includes("email") || h === "mail");
      const nameIdx = headers.findIndex(h => h.includes("name") || h.includes("first") || h.includes("full"));

      const parsed: Array<{ name: string; email: string }> = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const cols = lines[i].split(",").map(c => c.replace(/["']/g, "").trim());
        const email = emailIdx !== -1 && cols[emailIdx] ? cols[emailIdx].toLowerCase() : "";
        
        if (email && email.includes("@")) {
          let name = nameIdx !== -1 && cols[nameIdx] ? cols[nameIdx] : email.split("@")[0];
          parsed.push({ name, email });
        }
      }

      if (parsed.length > 0) {
        setContactsList((prev) => [...prev, ...parsed]);
        setCsvFile(null);
        setImportMethod(null);
      }
    };
    reader.readAsText(file);
  };

  const handleNext = async () => {
    if (step === 1 && product === "forms") {
      // Direct complete for Forms only
      await completeOnboarding("forms", [], null, null);
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const completeOnboarding = async (
    selectedProduct: "forms" | "newsletter" | "both",
    contacts: Array<{ name: string; email: string }>,
    list: { name: string; desc: string } | null,
    campaign: { name: string; subject: string; content: string } | null
  ) => {
    setLoading(true);
    setError(null);
    try {
      const userProfile = {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "User",
        onboardingCompleted: true,
        productPreference: selectedProduct,
        createdAt: new Date(),
        newsletterSettings: {
          resendApiKey: "",
          defaultSenderName: user.displayName || "Sender",
          defaultSenderEmail: user.email || "newsletter@example.com",
          requireDoubleOptIn: true,
          senderType: "global"
        }
      };

      // 1. Create User Document
      await setDoc(doc(db, "users", user.uid), userProfile);

      // 2. If Forms, auto-create first project
      if (selectedProduct === "forms" || selectedProduct === "both") {
        const projectId = Math.random().toString(36).substring(2, 12);
        await setDoc(doc(db, "projects", projectId), {
          uid: user.uid,
          name: "My First Project",
          apiKey: `ak_${Math.random().toString(36).substring(2, 15)}`,
          emailTo: user.email,
          isActive: true,
          theme: "modern",
          slug: "my-first-project",
          createdAt: new Date(),
          newsletterIntegrationEnabled: false,
          newsletterListId: ""
        });
      }

      // 3. If Newsletter, create list, add contacts, and first campaign
      if ((selectedProduct === "newsletter" || selectedProduct === "both") && list) {
        // Create first List
        const listRef = doc(collection(db, "lists"));
        await setDoc(listRef, {
          id: listRef.id,
          uid: user.uid,
          name: list.name,
          description: list.desc,
          contactCount: contacts.length,
          createdAt: new Date()
        });

        // Add Contacts
        for (const contact of contacts) {
          const contactId = `${user.uid}_${contact.email}`;
          await setDoc(doc(db, "contacts", contactId), {
            id: contactId,
            uid: user.uid,
            email: contact.email,
            name: contact.name,
            status: "subscribed", // default direct subscribe during onboarding
            source: "manual",
            lists: [listRef.id],
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }

        // Create first Campaign
        if (campaign) {
          const campaignRef = doc(collection(db, "campaigns"));
          await setDoc(campaignRef, {
            id: campaignRef.id,
            uid: user.uid,
            name: campaign.name,
            subject: campaign.subject,
            senderName: user.displayName || "Sender",
            senderEmail: user.email || "newsletter@example.com",
            contentHtml: campaign.content,
            contentJson: "{}",
            listId: listRef.id,
            status: "draft",
            stats: { sent: 0, opened: 0, clicked: 0, unsubscribed: 0, failed: 0 },
            createdAt: new Date()
          });
        }
      }

      onComplete(userProfile);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to complete onboarding. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    const listPayload = { name: listName, desc: listDesc };
    const campaignPayload = { name: campaignName, subject: campaignSubject, content: campaignContent };
    await completeOnboarding(product || "both", contactsList, listPayload, campaignPayload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-950/90 border border-white/5 rounded-[32px] overflow-hidden shadow-2xl p-8 md:p-10 my-8">
        
        {/* Glow Header */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-600 via-pink-600 to-violet-500" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-violet-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Onboarding Node</span>
          </div>
          <span className="text-xs font-mono text-slate-500">Step {step} of 5</span>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl">
            {error}
          </div>
        )}

        {/* STEP 1: CHOOSE PRODUCT */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tight text-white mb-2">Welcome to SendMyForm!</h2>
              <p className="text-sm text-slate-400 leading-relaxed">Choose which products you want to enable on your account. Both products are completely independent but run seamlessly on the same workspace.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {[
                { 
                  id: "forms", 
                  title: "Forms Backend", 
                  desc: "Zero persistence HTML endpoints for developers and static sites.",
                  icon: Layers 
                },
                { 
                  id: "newsletter", 
                  title: "Newsletter SaaS", 
                  desc: "SaaS contact manager, rich-text campaigns, list managers, and analytics.",
                  icon: Mail 
                },
                { 
                  id: "both", 
                  title: "Forms & Newsletter", 
                  desc: "Unlock the full platform. Sync form signups directly to mailing lists.",
                  icon: Sparkles,
                  featured: true
                }
              ].map((p) => {
                const Icon = p.icon;
                const active = product === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setProduct(p.id as any)}
                    className={`p-6 rounded-2xl border text-left flex flex-col justify-between h-48 transition-all hover:scale-[1.02] ${
                      active 
                        ? "border-violet-500 bg-violet-600/10 text-white" 
                        : "border-white/5 bg-slate-900/40 text-slate-400 hover:border-white/10"
                    } ${p.featured && !active ? "relative ring-1 ring-violet-500/30" : ""}`}
                  >
                    {p.featured && (
                      <span className="absolute top-3 right-3 text-[9px] font-black uppercase bg-violet-600 text-white px-2 py-0.5 rounded-full">Recommended</span>
                    )}
                    <Icon size={24} className={active ? "text-violet-400" : "text-slate-500"} />
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1.5">{p.title}</h3>
                      <p className="text-[11px] leading-relaxed text-slate-400">{p.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-6">
              <button
                disabled={!product}
                onClick={handleNext}
                className="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:hover:bg-violet-600"
              >
                Continue <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: IMPORT CONTACTS */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tight text-white mb-2">Import Your Contacts</h2>
              <p className="text-sm text-slate-400 leading-relaxed">Add subscribers to get started. You can upload a CSV, copy and paste, enter a contact manually, or skip this step.</p>
            </div>

            {/* Display parsed list */}
            {contactsList.length > 0 && (
              <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">{contactsList.length} Contacts Staged</span>
                  <button onClick={() => setContactsList([])} className="text-[10px] uppercase font-bold text-red-400 hover:underline">Clear all</button>
                </div>
                <div className="max-h-36 overflow-y-auto space-y-2 pr-2">
                  {contactsList.slice().reverse().map((c, i) => (
                    <div key={i} className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-950 border border-white/5">
                      <span className="font-semibold text-slate-300">{c.name}</span>
                      <span className="font-mono text-slate-500">{c.email}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!importMethod ? (
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setImportMethod("csv")}
                  className="p-5 border border-white/5 rounded-2xl bg-slate-900/30 hover:border-white/10 hover:bg-slate-900/50 flex flex-col items-center gap-2 text-slate-400 font-semibold text-xs transition-all"
                >
                  <FileSpreadsheet size={20} className="text-violet-400" />
                  Upload CSV
                </button>
                <button
                  onClick={() => setImportMethod("paste")}
                  className="p-5 border border-white/5 rounded-2xl bg-slate-900/30 hover:border-white/10 hover:bg-slate-900/50 flex flex-col items-center gap-2 text-slate-400 font-semibold text-xs transition-all"
                >
                  <Upload size={20} className="text-violet-400" />
                  Copy & Paste
                </button>
                <button
                  onClick={() => setImportMethod("manual")}
                  className="p-5 border border-white/5 rounded-2xl bg-slate-900/30 hover:border-white/10 hover:bg-slate-900/50 flex flex-col items-center gap-2 text-slate-400 font-semibold text-xs transition-all"
                >
                  <UserPlus size={20} className="text-violet-400" />
                  Add Manually
                </button>
              </div>
            ) : (
              <div className="p-5 border border-white/5 rounded-2xl bg-slate-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Import Interface</span>
                  <button onClick={() => setImportMethod(null)} className="text-[10px] font-bold text-slate-500 hover:text-white uppercase">Cancel</button>
                </div>

                {importMethod === "csv" && (
                  <div className="flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl p-8 hover:bg-slate-900/20 cursor-pointer relative">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCsvUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload size={24} className="text-slate-500 mb-2" />
                    <p className="text-xs font-bold text-slate-300">Choose CSV File</p>
                    <p className="text-[10px] text-slate-500 mt-1">Expected columns: Name, Email</p>
                  </div>
                )}

                {importMethod === "paste" && (
                  <div className="space-y-3">
                    <textarea
                      placeholder="Paste contacts here. formats:&#10;john@example.com&#10;John Doe, john@example.com&#10;John Doe <john@example.com>"
                      value={rawContacts}
                      onChange={(e) => setRawContacts(e.target.value)}
                      rows={4}
                      className="form-input text-xs font-mono resize-none leading-relaxed"
                    />
                    <button onClick={handleParsePaste} className="w-full btn-primary py-2.5 text-xs font-bold">
                      Parse & Add Contacts
                    </button>
                  </div>
                )}

                {importMethod === "manual" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Subscriber Name"
                        value={manualName}
                        onChange={(e) => setManualName(e.target.value)}
                        className="form-input text-xs"
                      />
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={manualEmail}
                        onChange={(e) => setManualEmail(e.target.value)}
                        className="form-input text-xs"
                      />
                    </div>
                    <button onClick={handleAddManual} className="w-full btn-primary py-2.5 text-xs font-bold">
                      Add Subscriber
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between pt-6">
              <button onClick={handleBack} className="px-5 py-3 rounded-lg text-sm font-semibold border border-white/5 text-slate-400 hover:text-white flex items-center gap-2">
                <ArrowLeft size={15} /> Back
              </button>
              <button onClick={handleNext} className="btn-primary flex items-center gap-2">
                {contactsList.length > 0 ? "Next Step" : "Skip For Now"} <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CREATE MAILING LIST */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tight text-white mb-2">Create Your First List</h2>
              <p className="text-sm text-slate-400 leading-relaxed">Lists organize your subscribers. We'll add your imported contacts to this list automatically.</p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider mb-2 block text-slate-400">List Name</label>
                <input
                  type="text"
                  placeholder="e.g. General Subscribers"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider mb-2 block text-slate-400">Description</label>
                <textarea
                  placeholder="Describe who is on this list..."
                  value={listDesc}
                  onChange={(e) => setListDesc(e.target.value)}
                  rows={3}
                  className="form-input resize-none"
                />
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <button onClick={handleBack} className="px-5 py-3 rounded-lg text-sm font-semibold border border-white/5 text-slate-400 hover:text-white flex items-center gap-2">
                <ArrowLeft size={15} /> Back
              </button>
              <button onClick={handleNext} className="btn-primary flex items-center gap-2">
                Next Step <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CREATE FIRST CAMPAIGN */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tight text-white mb-2">Draft Your First Campaign</h2>
              <p className="text-sm text-slate-400 leading-relaxed">Set up your first newsletter campaign. You can fully customize this draft later in your dashboard.</p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider mb-2 block text-slate-400">Campaign Name (Internal)</label>
                <input
                  type="text"
                  placeholder="e.g. Welcome Campaign"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider mb-2 block text-slate-400">Subject Line</label>
                <input
                  type="text"
                  placeholder="e.g. Welcome to my newsletter!"
                  value={campaignSubject}
                  onChange={(e) => setCampaignSubject(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <button onClick={handleBack} className="px-5 py-3 rounded-lg text-sm font-semibold border border-white/5 text-slate-400 hover:text-white flex items-center gap-2">
                <ArrowLeft size={15} /> Back
              </button>
              <button onClick={handleNext} className="btn-primary flex items-center gap-2">
                Next Step <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SEND/COMPLETE */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tight text-white mb-2">Ready to Launch!</h2>
              <p className="text-sm text-slate-400 leading-relaxed">Here's a summary of your Newsletter setup. Finish to initialize your SaaS dashboard.</p>
            </div>

            <div className="space-y-3 p-6 border border-white/5 rounded-2xl bg-slate-900/30">
              <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
                <span className="font-bold text-slate-400 uppercase tracking-wider">Product Preference</span>
                <span className="font-bold text-violet-400 uppercase">{product === "both" ? "Forms & Newsletter" : "Newsletter Only"}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
                <span className="font-bold text-slate-400 uppercase tracking-wider">Mailing List</span>
                <span className="font-semibold text-slate-200">{listName}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
                <span className="font-bold text-slate-400 uppercase tracking-wider">Subscriber Count</span>
                <span className="font-mono text-slate-200 font-bold">{contactsList.length} Contacts</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider">First Campaign</span>
                <span className="font-semibold text-slate-200">{campaignName}</span>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <button onClick={handleBack} disabled={loading} className="px-5 py-3 rounded-lg text-sm font-semibold border border-white/5 text-slate-400 hover:text-white flex items-center gap-2">
                <ArrowLeft size={15} /> Back
              </button>
              <button
                onClick={handleFinish}
                disabled={loading}
                className="btn-primary flex items-center gap-2 px-8"
              >
                {loading ? "Initializing..." : "Complete Setup"} <Check size={15} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
