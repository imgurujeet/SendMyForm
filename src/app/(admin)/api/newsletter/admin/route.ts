import { NextResponse } from "next/server";
import { db, auth as adminAuth } from "@/lib/firebase-admin";
import { sendCampaignEmail } from "@/lib/email-service";

async function verifyAdmin(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }
  const token = authHeader.split("Bearer ")[1];
  const decodedToken = await adminAuth.verifyIdToken(token);
  const email = decodedToken.email;
  
  if (email === "achaialabs@gmail.com" || email?.endsWith("@achaialabs.tech")) {
    return decodedToken;
  }
  throw new Error("Forbidden");
}

export async function POST(req: Request) {
  try {
    const decodedToken = await verifyAdmin(req);
    const adminEmail = decodedToken.email || "unknown_admin";

    const body = await req.json();
    const { action, payload } = body;

    if (!action) {
      return NextResponse.json({ success: false, error: "Missing action" }, { status: 400 });
    }

    // Write Audit Log helper
    const logAction = async (act: string, meta: any) => {
      await db.collection("newsletter_logs").add({
        timestamp: new Date(),
        action: act,
        administrator: adminEmail,
        metadata: meta,
      });
    };

    switch (action) {
      // --- DASHBOARD STATS ---
      case "getStats": {
        const subSnap = await db.collection("newsletter").get();
        const campaignSnap = await db.collection("newsletter_campaigns").get();

        const totalSubscribers = subSnap.size;
        const activeSubscribers = subSnap.docs.filter(d => d.data().status === "subscribed").length;
        const campaignsSent = campaignSnap.docs.filter(d => d.data().status === "sent").length;
        const draftCampaigns = campaignSnap.docs.filter(d => d.data().status === "draft").length;
        const scheduledCampaigns = campaignSnap.docs.filter(d => d.data().status === "scheduled").length;

        // Calculate rates
        let totalOpened = 0;
        let totalClicked = 0;
        let totalBounced = 0;
        let totalEmailsSent = 0;

        campaignSnap.docs.forEach((doc) => {
          const m = doc.data().metrics || {};
          totalOpened += m.opened || 0;
          totalClicked += m.clicked || 0;
          totalBounced += m.bounced || 0;
          totalEmailsSent += m.sent || 0;
        });

        const openRate = totalEmailsSent > 0 ? Math.round((totalOpened / totalEmailsSent) * 100) : 0;
        const clickRate = totalEmailsSent > 0 ? Math.round((totalClicked / totalEmailsSent) * 100) : 0;
        const bounceRate = totalEmailsSent > 0 ? Math.round((totalBounced / totalEmailsSent) * 100) : 0;

        // Growth history chart data (last 6 months placeholder & dynamic aggregate)
        const subscribers = subSnap.docs.map(d => d.data());
        const monthlyGrowth: Record<string, number> = {};
        
        subscribers.forEach((s) => {
          if (s.joinedDate) {
            const date = s.joinedDate.toDate ? s.joinedDate.toDate() : new Date(s.joinedDate);
            const month = date.toLocaleString("default", { month: "short", year: "2-digit" });
            monthlyGrowth[month] = (monthlyGrowth[month] || 0) + 1;
          }
        });

        const growthChart = Object.keys(monthlyGrowth).map(month => ({
          month,
          subscribers: monthlyGrowth[month],
        })).sort((a, b) => {
          const ad = new Date(a.month + " 01");
          const bd = new Date(b.month + " 01");
          return ad.getTime() - bd.getTime();
        });

        // Recent activity
        const recentSubscribers = subSnap.docs
          .map(d => ({ email: d.id, name: d.data().name, status: d.data().status, joinedDate: d.data().joinedDate }))
          .sort((a, b) => b.joinedDate - a.joinedDate)
          .slice(0, 5);

        const recentCampaigns = campaignSnap.docs
          .map(d => ({ id: d.id, name: d.data().name, status: d.data().status, sentAt: d.data().sentAt || d.data().scheduledDate }))
          .sort((a, b) => b.sentAt - a.sentAt)
          .slice(0, 5);

        return NextResponse.json({
          success: true,
          stats: {
            totalSubscribers,
            activeSubscribers,
            campaignsSent,
            draftCampaigns,
            scheduledCampaigns,
            openRate,
            clickRate,
            bounceRate,
          },
          charts: {
            growthChart,
          },
          recentActivity: {
            recentSubscribers,
            recentCampaigns,
          }
        });
      }

      // --- SUBSCRIBER MANAGEMENT ---
      case "getSubscribers": {
        const { search, tag, status, page = 1, limit = 20 } = payload || {};
        let q: any = db.collection("newsletter");

        if (status) {
          q = q.where("status", "==", status);
        }

        const snap = await q.get();
        let list = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

        // Client-side search and tag filter for convenience since firestore doesn't support easy full text search
        if (search) {
          const lower = search.toLowerCase();
          list = list.filter((s: any) => 
            s.email.toLowerCase().includes(lower) || 
            (s.name && s.name.toLowerCase().includes(lower))
          );
        }

        if (tag) {
          list = list.filter((s: any) => s.tags && s.tags.includes(tag));
        }

        // Sort by joined date
        list.sort((a: any, b: any) => {
          const ad = a.joinedDate?.toDate ? a.joinedDate.toDate().getTime() : 0;
          const bd = b.joinedDate?.toDate ? b.joinedDate.toDate().getTime() : 0;
          return bd - ad;
        });

        // Pagination
        const total = list.length;
        const startIndex = (page - 1) * limit;
        const paginatedList = list.slice(startIndex, startIndex + limit);

        // Fetch distinct tags
        const allTags = new Set<string>();
        list.forEach((s: any) => s.tags?.forEach((t: string) => allTags.add(t)));

        return NextResponse.json({
          success: true,
          subscribers: paginatedList,
          total,
          allTags: Array.from(allTags),
        });
      }

      case "addSubscriber": {
        const { email, name, tags, status } = payload;
        const emailKey = email.trim().toLowerCase();
        
        const subRef = db.collection("newsletter").doc(emailKey);
        const exists = (await subRef.get()).exists;

        if (exists) {
          return NextResponse.json({ success: false, error: "Subscriber already exists" }, { status: 400 });
        }

        const token = Math.random().toString(36).substring(2, 15);
        const subDoc = {
          email: emailKey,
          name: name || "",
          status: status || "subscribed",
          verified: status === "subscribed",
          source: "manual-admin",
          tags: tags || [],
          preferences: {
            productUpdates: true,
            featureReleases: true,
            weeklyDigest: true,
            monthlyDigest: true,
            maintenanceNotifications: true,
            securityAlerts: true,
          },
          frequency: "instant",
          joinedDate: new Date(),
          lastOpen: null,
          lastClick: null,
          lastCampaignReceived: null,
          unsubscribeToken: token,
          verificationToken: token,
        };

        await subRef.set(subDoc);
        await logAction("subscriber_added_manually", { email: emailKey });

        return NextResponse.json({ success: true, message: "Subscriber added manually!" });
      }

      case "deleteSubscriber": {
        const { email } = payload;
        await db.collection("newsletter").doc(email.toLowerCase()).delete();
        await logAction("subscriber_deleted", { email });
        return NextResponse.json({ success: true, message: "Subscriber deleted successfully!" });
      }

      case "bulkActions": {
        const { emails, bulkAction, tagValue } = payload; // delete, subscribe, unsubscribe, addTag, removeTag
        const batch = db.batch();

        emails.forEach((email: string) => {
          const ref = db.collection("newsletter").doc(email.toLowerCase());
          
          if (bulkAction === "delete") {
            batch.delete(ref);
          } else if (bulkAction === "subscribe") {
            batch.update(ref, { status: "subscribed", verified: true });
          } else if (bulkAction === "unsubscribe") {
            batch.update(ref, { status: "unsubscribed" });
          } else if (bulkAction === "addTag" && tagValue) {
            batch.update(ref, {
              tags: Array.from(new Set([...(payload.existingTags?.[email] || []), tagValue]))
            });
          } else if (bulkAction === "removeTag" && tagValue) {
            batch.update(ref, {
              tags: (payload.existingTags?.[email] || []).filter((t: string) => t !== tagValue)
            });
          }
        });

        await batch.commit();
        await logAction(`bulk_${bulkAction}`, { count: emails.length });
        return NextResponse.json({ success: true, message: `Bulk ${bulkAction} processed successfully!` });
      }

      case "importCSV": {
        const { subscribers } = payload; // array of { email, name, tags }
        const batch = db.batch();
        let importedCount = 0;

        subscribers.forEach((s: any) => {
          if (!s.email) return;
          const emailKey = s.email.trim().toLowerCase();
          const ref = db.collection("newsletter").doc(emailKey);
          const token = Math.random().toString(36).substring(2, 15);

          batch.set(ref, {
            email: emailKey,
            name: s.name || "",
            status: "subscribed",
            verified: true,
            source: "csv-import",
            tags: s.tags || ["imported"],
            preferences: {
              productUpdates: true,
              featureReleases: true,
              weeklyDigest: true,
              monthlyDigest: true,
              maintenanceNotifications: true,
              securityAlerts: true,
            },
            frequency: "instant",
            joinedDate: new Date(),
            unsubscribeToken: token,
            verificationToken: token,
          }, { merge: true });

          importedCount++;
        });

        await batch.commit();
        await logAction("csv_import", { count: importedCount });
        return NextResponse.json({ success: true, count: importedCount, message: `Successfully imported ${importedCount} subscribers!` });
      }

      // --- CAMPAIGN MANAGEMENT ---
      case "getCampaigns": {
        const snap = await db.collection("newsletter_campaigns").get();
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        list.sort((a: any, b: any) => {
          const ad = a.scheduledDate?.toDate ? a.scheduledDate.toDate().getTime() : 0;
          const bd = b.scheduledDate?.toDate ? b.scheduledDate.toDate().getTime() : 0;
          return bd - ad;
        });
        return NextResponse.json({ success: true, campaigns: list });
      }

      case "saveCampaign": {
        const { id, campaign } = payload;
        const campaignData = {
          ...campaign,
          scheduledDate: campaign.scheduledDate ? new Date(campaign.scheduledDate) : null,
          updatedAt: new Date(),
        };

        if (id) {
          await db.collection("newsletter_campaigns").doc(id).update(campaignData);
          await logAction("campaign_updated", { id, name: campaign.name });
        } else {
          campaignData.createdAt = new Date();
          campaignData.metrics = {
            sent: 0,
            opened: 0,
            clicked: 0,
            bounced: 0,
            spam: 0,
            unsubscribed: 0,
            failed: 0,
          };
          const ref = await db.collection("newsletter_campaigns").add(campaignData);
          await logAction("campaign_created", { id: ref.id, name: campaign.name });
        }

        return NextResponse.json({ success: true, message: "Campaign saved successfully!" });
      }

      case "deleteCampaign": {
        const { id } = payload;
        await db.collection("newsletter_campaigns").doc(id).delete();
        await logAction("campaign_deleted", { id });
        return NextResponse.json({ success: true, message: "Campaign deleted!" });
      }

      case "sendTestEmail": {
        const { testEmail, campaign } = payload;
        const host = req.headers.get("host") || "localhost:3000";
        const proto = req.headers.get("x-forwarded-proto") || "http";
        const baseUrl = `${proto}://${host}`;

        const preferencesLink = `${baseUrl}/subscribe/preferences?token=test_token&email=${encodeURIComponent(testEmail)}`;
        const unsubscribeLink = `${baseUrl}/subscribe/preferences?token=test_token&email=${encodeURIComponent(testEmail)}&unsubscribe=true`;

        // Render test content replacing variables with dummy values
        const contentHtml = campaign.contentHtml
          .replace(/\{\{name\}\}/g, "Test Recipient")
          .replace(/\{\{email\}\}/g, testEmail)
          .replace(/\{\{unsubscribe_link\}\}/g, unsubscribeLink);

        await sendCampaignEmail({
          to: testEmail,
          subject: `[TEST] ${campaign.subject}`,
          contentHtml,
          ctaText: campaign.ctaButton?.text,
          ctaUrl: campaign.ctaButton?.url,
          coverImageUrl: campaign.coverImage,
          preferencesLink,
          unsubscribeLink,
          campaignId: "test_campaign",
        });

        await logAction("test_email_sent", { to: testEmail, subject: campaign.subject });
        return NextResponse.json({ success: true, message: `Test email sent to ${testEmail}!` });
      }

      // --- TEMPLATES ---
      case "getTemplates": {
        const snap = await db.collection("newsletter_templates").get();
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json({ success: true, templates: list });
      }

      case "saveTemplate": {
        const { id, template } = payload;
        if (id) {
          await db.collection("newsletter_templates").doc(id).set(template, { merge: true });
          await logAction("template_updated", { id, name: template.name });
        } else {
          template.createdAt = new Date();
          const ref = await db.collection("newsletter_templates").add(template);
          await logAction("template_created", { id: ref.id, name: template.name });
        }
        return NextResponse.json({ success: true, message: "Template saved!" });
      }

      case "deleteTemplate": {
        const { id } = payload;
        await db.collection("newsletter_templates").doc(id).delete();
        await logAction("template_deleted", { id });
        return NextResponse.json({ success: true });
      }

      // --- SETTINGS ---
      case "getSettings": {
        const doc = await db.collection("newsletter_settings").doc("config").get();
        let settings = doc.data() || {};
        
        // Defaults
        if (!settings.senderName) {
          settings = {
            senderName: "Achaia HQ",
            senderEmail: "achaialabs@gmail.com",
            replyTo: "achaialabs@gmail.com",
            doubleOptIn: true,
            footer: "© 2026 Achaia Labs. All rights reserved.",
          };
        }
        return NextResponse.json({ success: true, settings });
      }

      case "saveSettings": {
        const { settings } = payload;
        await db.collection("newsletter_settings").doc("config").set(settings, { merge: true });
        await logAction("settings_updated", settings);
        return NextResponse.json({ success: true, message: "Settings updated!" });
      }

      // --- LOGS ---
      case "getLogs": {
        const snap = await db.collection("newsletter_logs").orderBy("timestamp", "desc").limit(50).get();
        const logs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json({ success: true, logs });
      }

      default:
        return NextResponse.json({ success: false, error: `Action ${action} not supported` }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Admin API Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Admin API processing failed" }, { status: 401 });
  }
}
