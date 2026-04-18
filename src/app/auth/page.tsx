"use client";
import React, { useState } from "react";
import TermsModal from "@/components/TermsModal";
import { auth, db } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import Link from "next/link";
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

      const q = query(collection(db, "projects"), where("uid", "==", user.uid));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
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
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Subtle glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-700/8 blur-[160px] rounded-full" />
      </div>

      <div
        className="relative w-full max-w-md rounded-2xl border p-8 md:p-10 text-center shadow-2xl animate-fade-in"
        style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
      >
        {/* Logo */}
        <div className="mb-2">
          <Link href="/" className="text-2xl font-bold tracking-tight inline-block" style={{ color: "var(--text-primary)" }}>
            Send<span className="text-violet-500">My</span>Form
          </Link>
        </div>
        <p className="text-sm font-medium mb-8" style={{ color: "var(--text-muted)" }}>
          Handle form submissions without a backend.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 font-semibold text-sm rounded-xl transition-all shadow-lg disabled:opacity-50 border hover:border-violet-500/30 bg-[var(--bg-card)] hover:bg-white text-[var(--text-primary)] hover:text-black border-[var(--border-color)]"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {loading ? "Signing in…" : "Continue with Google"}
        </button>

        <p className="mt-6 text-xs" style={{ color: "var(--text-muted)" }}>
          By signing in, you agree to Achaia Labs'{" "}
          <button
            onClick={() => setShowTerms(true)}
            className="text-violet-400 hover:underline cursor-pointer bg-transparent border-none p-0"
          >
            Terms of Service
          </button>.
        </p>

        <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      </div>
    </div>
  );
}