import { NextResponse, after } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import * as admin from "firebase-admin";
import { db } from "@/lib/firebase-admin";
import { generateEmailHtml } from "@/lib/themes";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@sendmyform.com";

const formSchema = z.record(z.string(), z.any());

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const response = NextResponse.redirect(`${origin}/docs`);
  Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
  return response;
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;


  try {
    // 1. Find Project by Custom Slug OR API Key
    let projectDoc: any = null;
    let projectID: string = "";

    const isApiKey = id.startsWith("ak_");

    if (isApiKey) {
      const q = db.collection("projects").where("apiKey", "==", id).limit(1);
      const snapshot = await q.get();
      if (!snapshot.empty) {
        projectDoc = snapshot.docs[0].data();
        projectID = snapshot.docs[0].id;
      }
    } else {
      // 1a. Try lookup by slug
      const q = db.collection("projects").where("slug", "==", id.toLowerCase()).limit(1);
      const snapshot = await q.get();
      if (!snapshot.empty) {
        projectDoc = snapshot.docs[0].data();
        projectID = snapshot.docs[0].id;
      } else {
        // 1b. Try lookup by document ID directly (fallback)
        try {
           const doc = await db.collection("projects").doc(id).get();
           if (doc.exists) {
             projectDoc = doc.data();
             projectID = doc.id;
           }
        } catch (e) {
           // Skip if not a valid doc ID
        }
      }
    }

    if (!projectDoc) {
      return NextResponse.json({ success: false, error: "Identifier not found" }, { status: 404, headers: corsHeaders });
    }

    // 2. Fetch Global Admin Ad Config
    const adminConfigRaw = await db.collection("admin").doc("config").get();
    const adminConfig = adminConfigRaw.data() || {
      topAd: "", middleAd: "", bottomAd: "",
      adTitle: "Build with SendMyForm",
      adText: "Premium high-conversion web development and developer tools.",
      adLink: "https://achaialabs.tech"
    };

    const contentType = req.headers.get("content-type") || "";
    let data: any;

    try {
      if (contentType.includes("application/json")) {
        data = await req.json();
      } else {
        const formData = await req.formData();
        data = Object.fromEntries(formData);
      }
    } catch (e) {
      data = {}; // Fallback for empty body or malformed data
    }

    const validatedData = formSchema.parse(data);

    // 2.5 Newsletter Integration: automatically enroll form submitter as contact
    const submitterEmail = validatedData.email || validatedData.Email || validatedData.EMAIL;
    if (submitterEmail && projectDoc.newsletterIntegrationEnabled && projectDoc.newsletterListId) {
      try {
        const emailKey = submitterEmail.trim().toLowerCase();
        const contactRef = db.collection("contacts").doc(`${projectDoc.uid}_${emailKey}`);
        const contactDoc = await contactRef.get();
        
        const submitterName = validatedData.name || validatedData.Name || validatedData.NAME || "";
        
        if (contactDoc.exists) {
          const existingData = contactDoc.data() || {};
          const existingLists = existingData.lists || [];
          if (!existingLists.includes(projectDoc.newsletterListId)) {
            await contactRef.update({
              lists: [...existingLists, projectDoc.newsletterListId],
              updatedAt: new Date()
            });
            
            // Increment list size
            await db.collection("lists").doc(projectDoc.newsletterListId).update({
              contactCount: admin.firestore.FieldValue.increment(1)
            });
          }
        } else {
          await contactRef.set({
            uid: projectDoc.uid,
            email: emailKey,
            name: submitterName,
            status: "subscribed",
            tags: ["form-submission", projectDoc.name],
            lists: [projectDoc.newsletterListId],
            joinedDate: new Date(),
            updatedAt: new Date()
          });
          
          // Increment list size
          await db.collection("lists").doc(projectDoc.newsletterListId).update({
            contactCount: admin.firestore.FieldValue.increment(1)
          });
        }
      } catch (err) {
        console.error("Newsletter sync error:", err);
      }
    }

    // 3. CREATE TRANSPORTER & VERIFY CONNECTION (fast — just a TCP+auth handshake)
    // This ensures SMTP is reachable before we tell the user "success".
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    if (SMTP_HOST && SMTP_USER) {
      try {
        await transporter.verify();
      } catch (smtpErr) {
        console.error("SMTP verification failed:", smtpErr);
        return NextResponse.json(
          { success: false, error: "Email service unavailable" },
          { status: 503, headers: corsHeaders }
        );
      }
    }

    // 4. SMTP is verified — safe to respond with success now.
    const origin = new URL(req.url).origin;
    const successUrl = `${origin}/success`;

    // Send emails in background AFTER response (non-blocking).
    // We already verified SMTP works, so these will go through.
    after(async () => {
      try {
        const finalAdContent = adminConfig.middleAd ? adminConfig.middleAd : [
          '<div style="margin: 30px 0; padding: 40px; background: #000; border-radius: 32px; border: 1px solid #7c3aed; box-shadow: 0 0 50px -10px rgba(124, 58, 237, 0.4); text-align: center;">',
            '<p style="margin: 0 0 12px 0; color: #8b5cf6; font-weight: 900; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3em; font-style: italic;">Achaia Labs Partner Feature</p>',
            '<h3 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 900; font-style: italic; color: white;">' + (adminConfig.adTitle || "Grow with SendMyForm") + '</h3>',
            '<p style="margin: 0 0 24px 0; font-size: 14px; color: #94a3b8; line-height: 1.6; font-style: italic;">' + (adminConfig.adText || "Accelerate your development cycle with our premium developer resources.") + '</p>',
            '<a href="' + (adminConfig.adLink || "#") + '" style="display: inline-block; background: #ffffff; color: #000; padding: 14px 40px; border-radius: 99px; text-decoration: none; font-weight: 900; font-size: 13px; text-transform: uppercase; font-style: italic;">Discover Now</a>',
          '</div>'
        ].join('');

        const ownerEmailHtml = generateEmailHtml(
          validatedData,
          projectDoc.name,
          projectDoc.theme || 'modern',
          {
            title: adminConfig.adTitle,
            text: adminConfig.adText,
            link: adminConfig.adLink,
            useCustomHtml: !!adminConfig.middleAd,
            customHtml: adminConfig.middleAd
          }
        );

        // Send to project owner
        await transporter.sendMail({
          from: `"SendMyForm Ingest" <${EMAIL_FROM}>`,
          to: projectDoc.emailTo,
          subject: `[Lead Notification] ${projectDoc.name}`,
          html: ownerEmailHtml,
        });

        // Send confirmation to submitter
        const submitterEmail = validatedData.email || validatedData.Email || validatedData.EMAIL;
        if (submitterEmail) {
          const userConfirmationHtml = [
            '<div style="font-family: sans-serif; background-color: #000; padding: 60px 20px; color: #fff;">',
              '<div style="max-width: 600px; margin: 0 auto; background: #0a0a0a; border-radius: 32px; padding: 48px; border: 1px solid rgba(255,255,255,0.05); text-align: center;">',
                '<div style="margin-bottom: 40px;">',
                  '<div style="width: 64px; height: 64px; background: #22c55e; border-radius: 20px; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 32px;">✓</div>',
                '</div>',
                '<h1 style="font-size: 28px; font-weight: 900; letter-spacing: -0.05em; margin-bottom: 12px; font-style: italic;">SUBMISSION SUCCESSFUL!</h1>',
                '<p style="font-size: 16px; color: #64748b; margin-bottom: 48px; font-weight: 500; font-style: italic;">Success! Your submission to <strong>' + projectDoc.name + '</strong> has been processed by our global nodes.</p>',
                finalAdContent,
                '<p style="font-size: 10px; color: #334155; margin-top: 48px; font-weight: 800; letter-spacing: 0.4em; text-transform: uppercase; font-style: italic;">&copy; 2026 SendMyForm Platform. Secured Processing.</p>',
              '</div>',
            '</div>'
          ].join('');

          await transporter.sendMail({
            from: `"SendMyForm" <${EMAIL_FROM}>`,
            to: submitterEmail,
            subject: `Submission Confirmed: ${projectDoc.name}`,
            html: userConfirmationHtml,
          });
        }
      } catch (emailError) {
        console.error("Background email error:", emailError);
      }
    });

    // 5. FAST RESPONSE — detect native form vs fetch/AJAX
    const fetchMode = req.headers.get("sec-fetch-mode");
    const acceptHeader = req.headers.get("accept") || "";
    const isAjaxRequest =
      contentType.includes("application/json") ||
      acceptHeader.includes("application/json") ||
      fetchMode === "cors" ||
      fetchMode === "no-cors";

    if (isAjaxRequest) {
      return NextResponse.json({
        success: true,
        message: "Submission received",
        redirect: successUrl
      }, { status: 200, headers: corsHeaders });
    }

    // Native browser form — 303 redirect to success page
    const response = NextResponse.redirect(successUrl, 303);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;

  } catch (error: any) {
    console.error("Submission error:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500, headers: corsHeaders });
  }
}


