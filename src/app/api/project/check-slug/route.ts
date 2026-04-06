import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { slug } = await req.json();

    if (!slug) return NextResponse.json({ error: "No slug provided" }, { status: 400 });

    const q = query(collection(db, "projects"), where("slug", "==", slug));
    const snapshot = await getDocs(q);

    return NextResponse.json({ available: snapshot.empty });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
