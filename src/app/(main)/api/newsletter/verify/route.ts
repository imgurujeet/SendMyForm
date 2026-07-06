import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { sendWelcomeEmail } from "@/lib/email-service";

function getBaseUrl(req: Request) {
  const host = req.headers.get("host") || "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") || "http";
  return `${proto}://${host}`;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase() || "";
    const token = searchParams.get("token") || "";

    const baseUrl = getBaseUrl(req);

    if (!email || !token) {
      return NextResponse.redirect(`${baseUrl}/subscribe/verified?error=invalid_params`);
    }

    const subRef = db.collection("newsletter").doc(email);
    const subSnap = await subRef.get();

    if (!subSnap.exists) {
      return NextResponse.redirect(`${baseUrl}/subscribe/verified?error=subscriber_not_found`);
    }

    const data = subSnap.data();

    // Verify token matches
    if (data?.verificationToken !== token) {
      return NextResponse.redirect(`${baseUrl}/subscribe/verified?error=invalid_token`);
    }

    // If already verified, just redirect to verified success
    if (data?.verified) {
      return NextResponse.redirect(`${baseUrl}/subscribe/verified?email=${encodeURIComponent(email)}`);
    }

    // Update subscriber
    await subRef.update({
      status: "subscribed",
      verified: true,
    });

    const preferencesLink = `${baseUrl}/subscribe/preferences?token=${data?.unsubscribeToken}&email=${encodeURIComponent(email)}`;

    // Send Welcome Email
    await sendWelcomeEmail(email, data?.name || "", preferencesLink);

    // Audit Log
    await db.collection("newsletter_logs").add({
      timestamp: new Date(),
      action: "subscriber_verified",
      administrator: "system",
      metadata: { email },
    });

    return NextResponse.redirect(`${baseUrl}/subscribe/verified?email=${encodeURIComponent(email)}`);
  } catch (error) {
    console.error("Verification error:", error);
    const baseUrl = getBaseUrl(req);
    return NextResponse.redirect(`${baseUrl}/subscribe/verified?error=server_error`);
  }
}
