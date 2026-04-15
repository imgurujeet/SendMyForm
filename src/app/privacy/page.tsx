"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

// This route redirects to the homepage.
// The Privacy Policy is shown as a modal (PrivacyModal component)
// triggered from the pages that link to it.
export default function PrivacyPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/");
    }, [router]);

    return null;
}
