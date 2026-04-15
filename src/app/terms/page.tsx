"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

// This route redirects to the homepage.
// The Terms & Conditions are shown as a modal (TermsModal component)
// triggered from the pages that link to it.
export default function TermsPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/");
    }, [router]);

    return null;
}
