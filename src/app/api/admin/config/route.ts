
import { db } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const configRaw = await db.collection("admin").doc("config").get();
    let config = configRaw.data() || {};
    
    // Default Fallback
    if (!config.adTitle) {
      config = {
        adTitle: "Build with Achaia Labs",
        adText: "Looking for high-conversion web designs and premium developer tools? Visit Achaia Labs today.",
        adLink: "https://achaialabs.tech",
        brandingName: "SendMyForm by Achaia Labs"
      };
    }

    return new Response(JSON.stringify(config), { status: 200 });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const newConfig = await req.json();
    await db.collection("admin").doc("config").set(newConfig, { merge: true });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
}
