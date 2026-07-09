import { NextResponse } from "next/server";
import { db, auth as adminAuth } from "@/lib/firebase-admin";
import { sendCampaignEmail } from "@/lib/email-service";

async function verifyAuth(req: Request) {
  // Option 1: Bearer Token
  const authHeader = req.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const email = decodedToken.email;
    const uid = decodedToken.uid;
    const isAdmin = email === "achaialabs@gmail.com" || email?.endsWith("@achaialabs.tech");
    return { admin: isAdmin, email, uid };
  }

  // Option 2: Secret Query Param (for automated server cron)
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const localSecret = process.env.CRON_SECRET || "smf_newsletter_cron_secret";
  if (secret === localSecret) {
    return { admin: true, email: "cron_trigger", uid: null };
  }

  throw new Error("Unauthorized");
}

function getBaseUrl(req: Request) {
  const host = req.headers.get("host") || "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") || "http";
  return `${proto}://${host}`;
}

export async function POST(req: Request) {
  try {
    const authResult = await verifyAuth(req);
    const triggerUser = authResult.email || "unknown_trigger";

    const now = new Date();
    const campaignsQuery = await db
      .collection("campaigns")
      .where("status", "==", "scheduled")
      .get();

    let scheduledCampaigns = campaignsQuery.docs.filter((doc) => {
      const scheduledDate = doc.data().scheduledDate?.toDate();
      return scheduledDate && scheduledDate <= now;
    });

    // Enforce multi-tenant access: non-admin requests can only run campaigns they own
    if (!authResult.admin) {
      if (!authResult.uid) {
        throw new Error("Unauthorized: Invalid user credentials");
      }
      scheduledCampaigns = scheduledCampaigns.filter((doc) => doc.data().uid === authResult.uid);
    }

    if (scheduledCampaigns.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No scheduled campaigns to send at this time.",
        campaignsProcessed: 0,
        emailsSent: 0,
      });
    }

    const baseUrl = getBaseUrl(req);
    let totalEmailsSent = 0;

    for (const campaignDoc of scheduledCampaigns) {
      const campaignId = campaignDoc.id;
      const campaign = campaignDoc.data();
      const uid = campaign.uid;

      if (!uid) {
        console.warn(`Campaign ${campaignId} is missing uid.`);
        continue;
      }

      // Fetch campaign owner's newsletter delivery settings
      const userDoc = await db.collection("users").doc(uid).get();
      const userData = userDoc.exists ? userDoc.data() : null;
      const smtpSettings = userData?.newsletterSettings || null;

      // Update status to sending
      await db.collection("campaigns").doc(campaignId).update({
        status: "sending",
      });

      // Fetch user's target subscribers
      let subscribersQuery: any = db
        .collection("contacts")
        .where("uid", "==", uid)
        .where("status", "==", "subscribed");

      const subscribersSnap = await subscribersQuery.get();
      let targets = subscribersSnap.docs.map((doc: any) => doc.data());

      // Filter by audience
      const audienceType = campaign.audience?.type || "all";
      const audienceListId = campaign.audience?.listId || "";
      const audienceTag = campaign.audience?.tag || "";

      if (audienceType === "list" && audienceListId) {
        targets = targets.filter((t: any) => t.lists && t.lists.includes(audienceListId));
      } else if (audienceType === "segment" && audienceTag) {
        targets = targets.filter((t: any) => t.tags && t.tags.includes(audienceTag));
      }

      let campaignSentCount = 0;
      let campaignFailedCount = 0;

      for (const sub of targets) {
        try {
          const unsubscribeToken = sub.unsubscribeToken || Math.random().toString(36).substring(2, 15);
          const preferencesLink = `${baseUrl}/subscribe/preferences?token=${unsubscribeToken}&email=${encodeURIComponent(sub.email)}`;
          const unsubscribeLink = `${baseUrl}/subscribe/preferences?token=${unsubscribeToken}&email=${encodeURIComponent(sub.email)}&unsubscribe=true`;

          // Replace merge variables
          const contentHtml = (campaign.contentHtml || "")
            .replace(/\{\{name\}\}/g, sub.name || "Subscriber")
            .replace(/\{\{email\}\}/g, sub.email)
            .replace(/\{\{unsubscribe_link\}\}/g, unsubscribeLink);

          await sendCampaignEmail({
            to: sub.email,
            subject: campaign.subject || "Newsletter",
            contentHtml,
            ctaText: campaign.ctaButton?.text,
            ctaUrl: campaign.ctaButton?.url,
            coverImageUrl: campaign.coverImage,
            preferencesLink,
            unsubscribeLink,
            campaignId,
            smtpSettings,
          });

          // Log event in database
          await db.collection("newsletter_events").add({
            campaignId,
            subscriberEmail: sub.email,
            type: "sent",
            timestamp: new Date(),
          });

          // Update subscriber's last campaign received
          const contactDocId = `${uid}_${sub.email.toLowerCase().trim()}`;
          await db.collection("contacts").doc(contactDocId).update({
            lastCampaignReceived: campaignId,
          });

          campaignSentCount++;
          totalEmailsSent++;
        } catch (err: any) {
          console.error(`Failed to send email to ${sub.email} for campaign ${campaignId}:`, err);
          campaignFailedCount++;
          
          await db.collection("newsletter_events").add({
            campaignId,
            subscriberEmail: sub.email,
            type: "failed",
            timestamp: new Date(),
            metadata: { error: err.message || "Unknown error" },
          });
        }
      }

      // Update campaign state when finished
      await db.collection("campaigns").doc(campaignId).update({
        status: "sent",
        sentAt: new Date(),
        metrics: {
          sent: campaignSentCount,
          opened: 0,
          clicked: 0,
          bounced: 0,
          spam: 0,
          unsubscribed: 0,
          failed: campaignFailedCount,
        },
      });

      // Audit Log
      await db.collection("newsletter_logs").add({
        timestamp: new Date(),
        action: "campaign_sent",
        administrator: triggerUser,
        metadata: {
          campaignId,
          campaignName: campaign.name,
          recipientsCount: campaignSentCount,
          failedCount: campaignFailedCount,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${scheduledCampaigns.length} campaigns.`,
      campaignsProcessed: scheduledCampaigns.length,
      emailsSent: totalEmailsSent,
    });
  } catch (error: any) {
    console.error("Scheduler process error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process scheduler" },
      { status: 500 }
    );
  }
}
