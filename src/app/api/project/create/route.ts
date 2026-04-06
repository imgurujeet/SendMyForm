import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const { uid, name, emailTo } = await req.json();

    if (!uid || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const apiKey = `ak_${nanoid(24)}`;
    
    const projectRef = await addDoc(collection(db, "projects"), {
      uid,
      name,
      emailTo: emailTo || "",
      apiKey,
      isActive: true,
      createdAt: serverTimestamp(),
      theme: "modern",
      emailConfirmations: true,
      successMessage: "Submission received. We'll be in touch.",
    });

    return NextResponse.json({ id: projectRef.id, apiKey }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
