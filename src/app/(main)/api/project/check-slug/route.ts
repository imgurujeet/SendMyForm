import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { slug, projectId } = await req.json();

    if (!slug) return NextResponse.json({ error: "No slug provided" }, { status: 400 });

    const q = query(collection(db, "projects"), where("slug", "==", slug));
    const snapshot = await getDocs(q);

    // Exclude the current project from the check so editing your own slug works
    const taken = snapshot.docs.some((d) => d.id !== projectId);

    return NextResponse.json({ available: !taken });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
