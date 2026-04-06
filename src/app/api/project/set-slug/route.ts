import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { slug, uid } = await req.json();

    if (!slug || !uid) {
      return NextResponse.json({ success: false, error: "Missing slug or UID" }, { status: 400 });
    }

    // 1. Check if slug is taken
    const q = db.collection("projects").where("slug", "==", slug.toLowerCase()).limit(1);
    const snapshot = await q.get();

    if (!snapshot.empty) {
      return NextResponse.json({ success: false, error: "Slug is already taken" }, { status: 409 });
    }

    // 2. Update the project with the new custom slug
    const projectRef = db.collection("projects").where("uid", "==", uid).limit(1);
    const projectSnapshot = await projectRef.get();

    if (projectSnapshot.empty) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    await projectSnapshot.docs[0].ref.update({
      slug: slug.toLowerCase()
    });

    return NextResponse.json({ success: true, message: "Custom endpoint saved!" });
  } catch (error: any) {
    console.error("Slug creation error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
