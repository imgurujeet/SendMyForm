import { db } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { projectId, theme } = await req.json();

    if (!projectId || !theme) {
      return new Response("Missing parameters", { status: 400 });
    }

    await db.collection("projects").doc(projectId).update({
      theme: theme
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
}
