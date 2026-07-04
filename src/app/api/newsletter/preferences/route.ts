import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase() || "";
    const token = searchParams.get("token") || "";

    if (!email || !token) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    const subRef = db.collection("newsletter").doc(email);
    const subSnap = await subRef.get();

    if (!subSnap.exists) {
      return NextResponse.json({ success: false, error: "Subscriber not found" }, { status: 404 });
    }

    const data = subSnap.data();

    if (data?.unsubscribeToken !== token) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      subscriber: {
        email: data.email,
        name: data.name,
        status: data.status,
        verified: data.verified,
        preferences: data.preferences,
        frequency: data.frequency,
      },
    });
  } catch (error: any) {
    console.error("Fetch preferences error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, token, preferences, frequency, status } = body;

    if (!email || !token) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    const emailKey = email.toLowerCase();
    const subRef = db.collection("newsletter").doc(emailKey);
    const subSnap = await subRef.get();

    if (!subSnap.exists) {
      return NextResponse.json({ success: false, error: "Subscriber not found" }, { status: 404 });
    }

    const data = subSnap.data();

    if (data?.unsubscribeToken !== token) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    const updateData: any = {};
    if (preferences !== undefined) updateData.preferences = preferences;
    if (frequency !== undefined) updateData.frequency = frequency;
    if (status !== undefined) updateData.status = status;

    await subRef.update(updateData);

    // Audit Log
    await db.collection("newsletter_logs").add({
      timestamp: new Date(),
      action: "subscriber_preferences_updated",
      administrator: "system",
      metadata: { email: emailKey, updateData },
    });

    return NextResponse.json({ success: true, message: "Preferences updated successfully!" });
  } catch (error: any) {
    console.error("Save preferences error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
