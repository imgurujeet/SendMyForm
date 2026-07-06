import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const { uid, name, slug, emailTo, theme } = await req.json();

    if (!uid || !name || !slug) {
      return NextResponse.json({ error: "Missing identity fields" }, { status: 400 });
    }

    const formattedSlug = slug.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // CHECK FOR DUPLICATE SLUG (using Admin SDK)
    const slugQuery = await db.collection("projects").where("slug", "==", formattedSlug).get();
    if (!slugQuery.empty) {
      return NextResponse.json({ error: "That URL Slug is already taken" }, { status: 400 });
    }

    const apiKey = `ak_${nanoid(24)}`;

    // Bypass Client Rules by using Firebase Admin SDK
    const projectRef = await db.collection("projects").add({
      uid,
      name,
      slug: formattedSlug,
      emailTo: emailTo || "",
      apiKey,
      isActive: true,
      createdAt: new Date().toISOString(), // Standard date for admin
      theme: theme || "modern",
      emailConfirmations: true,
      successMessage: "Submission received.",
    });

    return NextResponse.json({
      success: true,
      id: projectRef.id,
      apiKey
    }, { status: 201 });

  } catch (error: any) {
    console.error("Firebase Admin Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
