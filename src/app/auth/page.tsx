"use client";
import React, { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { nanoid } from "nanoid";

export default function AuthPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      }
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-card animate-fade-in" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Achaia <span className="gradient-text">Forms</span></h1>
        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
          Instantly handle form submissions. One-click setup.
        </p>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '10px', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '14px' }}>{error}</div>}

        <button
          onClick={handleGoogleSignIn}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
          disabled={loading}
        >
          {loading ? "Connecting..." : "Sign in with Google"}
        </button>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '12px', color: '#64748b' }}>
          By signing in, you agree to Achaia Labs' Terms of Service.
        </div>
      </div>
    </div>
  );
}
