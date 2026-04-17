"use client";
import React, { useState } from "react";
import TermsModal from "@/components/TermsModal";
import { auth, db } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import { Zap } from "lucide-react";
import { trackSignIn, trackSignUp } from "@/lib/analytics";

export default function AuthPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already has a project
      const q = query(collection(db, "projects"), where("uid", "==", user.uid));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Initialize User's First Project
        const projectID = nanoid(10);
        const apiKey = `ak_${nanoid(24)}`;

        await setDoc(doc(db, "projects", projectID), {
          uid: user.uid,
          name: "My First Project",
          apiKey,
          emailTo: user.email,
          isActive: true,
          createdAt: new Date(),
          theme: "modern",
        });
        trackSignUp("google");
      } else {
        trackSignIn("google");
      }
      // Route admin users to admin panel
      if (user.email === "achaialabs@gmail.com" || user.email?.endsWith("@achaialabs.tech")) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md rounded-[2.5rem] border border-zinc-800 bg-zinc-950 p-8 md:p-12 text-center shadow-2xl animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap size={24} fill="#7c3aed" className="text-violet-600" />
          <h1 className="text-2xl md:text-3xl font-black italic text-white uppercase tracking-tighter">
            SendMyForm
          </h1>
          <p className="text-xs text-zinc-600 italic">~By Achaia Labs</p>
        </div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8 italic">
          Instantly handle form submissions. One-click setup.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl mb-6 text-sm font-bold">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-violet-600 hover:text-white transition-all shadow-xl disabled:opacity-50 italic"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {loading ? "Connecting..." : "Sign in with Google"}
        </button>

        <p className="text-center mt-6 text-[12px] text-zinc-600 italic">
          By signing in, you agree to Achaia Labs&apos; <button onClick={() => setShowTerms(true)} className="text-blue-600 hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit text-inherit">Terms of Service</button>.
        </p>

        <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      </div>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
      `}</style>
    </div>
  );
}
