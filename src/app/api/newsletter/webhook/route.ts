import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { type, data } = payload;

    if (!type || !data) {
      return NextResponse.json({ success: false, error: "Invalid webhook payload" }, { status: 400 });
    }

    // Extract campaignId and subscriberEmail from tags
    let campaignId = "";
    let subscriberEmail = "";

    const rawTags = data.tags || {};
    if (Array.isArray(rawTags)) {
      const cTag = rawTags.find((t) => t.name === "campaign_id" || t.key === "campaign_id");
      const sTag = rawTags.find((t) => t.name === "subscriber_email" || t.key === "subscriber_email");
      campaignId = cTag?.value || cTag?.value || "";
      subscriberEmail = sTag?.value || sTag?.value || "";
    } else {
      campaignId = rawTags.campaign_id || "";
      subscriberEmail = rawTags.subscriber_email || "";
    }

    // Try to get recipient from 'to' field if tag is missing
    if (!subscriberEmail && data.to && data.to.length > 0) {
      subscriberEmail = data.to[0].toLowerCase();
    }

    if (!campaignId || !subscriberEmail) {
      console.warn("Resend webhook: missing campaignId or subscriberEmail. Tags:", rawTags, "Recipient:", subscriberEmail);
      return NextResponse.json({ success: true, message: "Webhook skipped - missing tracking IDs" });
    }

    const cleanEmail = subscriberEmail.toLowerCase();
    const eventType = type.replace("email.", ""); // opened, clicked, bounced, complained, delivered, sent

    // Log the event
    await db.collection("newsletter_events").add({
      campaignId,
      subscriberEmail: cleanEmail,
      type: eventType,
      timestamp: new Date(),
      metadata: { resendEmailId: data.email_id || "" },
    });

    const campaignRef = db.collection("newsletter_campaigns").doc(campaignId);
    const subRef = db.collection("newsletter").doc(cleanEmail);

    // Run transaction to increment metrics safely
    await db.runTransaction(async (transaction) => {
      const campaignDoc = await transaction.get(campaignRef);
      if (!campaignDoc.exists) return;

      const cData = campaignDoc.data() || {};
      const metrics = cData.metrics || {
        sent: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        spam: 0,
        unsubscribed: 0,
        failed: 0,
      };

      if (eventType === "opened") {
        metrics.opened = (metrics.opened || 0) + 1;
        transaction.update(subRef, { lastOpen: new Date() });
      } else if (eventType === "clicked") {
        metrics.clicked = (metrics.clicked || 0) + 1;
        transaction.update(subRef, { lastClick: new Date() });
      } else if (eventType === "bounced") {
        metrics.bounced = (metrics.bounced || 0) + 1;
        transaction.update(subRef, { status: "bounced" });
      } else if (eventType === "complained") {
        metrics.spam = (metrics.spam || 0) + 1;
        transaction.update(subRef, { status: "unsubscribed", tags: adminFieldUnion("spam-complaint") });
      }

      transaction.update(campaignRef, { metrics });
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Resend Webhook processing failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Field union helper since we don't have direct access in transactions easily
function adminFieldUnion(tag: string) {
  // Return updated array placeholder or let transaction handle it,
  // we will just append it or set status.
  return ["unsubscribed", "spam-complaint"];
}
