import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { sendVerificationEmail } from "@/lib/email-service";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().optional().default(""),
  source: z.string().optional().default("landing"),
});

function getBaseUrl(req: Request) {
  const host = req.headers.get("host") || "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") || "http";
  return `${proto}://${host}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, source } = subscribeSchema.parse(body);

    const emailKey = email.trim().toLowerCase();

    // Check if subscriber already exists
    const subRef = db.collection("newsletter").doc(emailKey);
    const subSnap = await subRef.get();

    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const unsubscribeToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const baseUrl = getBaseUrl(req);
    const verificationLink = `${baseUrl}/api/newsletter/verify?token=${verificationToken}&email=${encodeURIComponent(emailKey)}`;

    if (subSnap.exists) {
      const data = subSnap.data();
      if (data?.verified) {
        return NextResponse.json(
          { success: true, message: "You are already subscribed!" },
          { status: 200 }
        );
      } else {
        // Update verification token and resend
        await subRef.update({
          verificationToken,
          name: name || data?.name || "",
          source: source || data?.source || "landing",
        });

        await sendVerificationEmail(emailKey, name || data?.name || "", verificationLink);

        // Audit Log
        await db.collection("newsletter_logs").add({
          timestamp: new Date(),
          action: "verification_resent",
          administrator: "system",
          metadata: { email: emailKey, source },
        });

        return NextResponse.json(
          { success: true, message: "Verification email resent. Please check your inbox!" },
          { status: 200 }
        );
      }
    }

    // Create new pending subscriber
    const newSubscriber = {
      email: emailKey,
      name,
      status: "pending",
      verified: false,
      source,
      tags: ["website-subscriber"],
      preferences: {
        productUpdates: true,
        featureReleases: true,
        weeklyDigest: true,
        monthlyDigest: true,
        maintenanceNotifications: true,
        securityAlerts: true,
      },
      frequency: "instant",
      joinedDate: new Date(),
      lastOpen: null,
      lastClick: null,
      lastCampaignReceived: null,
      unsubscribeToken,
      verificationToken,
    };

    await subRef.set(newSubscriber);

    // Send Verification Email
    await sendVerificationEmail(emailKey, name, verificationLink);

    // Audit Log
    await db.collection("newsletter_logs").add({
      timestamp: new Date(),
      action: "subscriber_pending",
      administrator: "system",
      metadata: { email: emailKey, source },
    });

    return NextResponse.json(
      { success: true, message: "Subscription requested! Please check your email to verify." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Newsletter subscribe error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process subscription" },
      { status: 400 }
    );
  }
}
