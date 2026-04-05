import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

// --- SMTP CONFIGURATION FROM ENV ---
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@achaialabs.com";
const EMAIL_TO = process.env.EMAIL_TO || "contact@achaialabs.com";

const IS_SMTP_CONFIGURED = !!(SMTP_HOST && SMTP_USER && SMTP_PASS);

const formSchema = z.record(z.string(), z.any());

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let data: any;

    if (contentType.includes("application/json")) {
      data = await req.json();
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const formData = await req.formData();
      data = Object.fromEntries(formData);
    } else {
      throw new Error("Unsupported content type");
    }

    const validatedData = formSchema.parse(data);

    // Filter out common fields to make the email more readable
    const entries = Object.entries(validatedData);
    const htmlRows = entries
      .map(
        ([key, value]) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #475569; width: 30%; text-transform: capitalize;">${key.replace(
          /([A-Z])/g,
          " $1"
        )}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${value}</td>
      </tr>
    `
      )
      .join("");

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
          <div style="background: linear-gradient(135deg, #6d28d9 0%, #ec4899 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Achaia Labs | New Submission</h1>
          </div>
          <div style="padding: 30px;">
            <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              You have received a new form submission from your website <b>achaialabs.tech</b>. Here are the details:
            </p>
            <table style="width: 100%; border-collapse: collapse;">
              ${htmlRows}
            </table>
            <div style="margin-top: 30px; text-align: center;">
              <p style="color: #94a3b8; font-size: 14px;">Submitted at ${new Date().toLocaleString()}</p>
            </div>
          </div>
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #64748b; font-size: 12px;">© 2026 Achaia Labs. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;

    if (IS_SMTP_CONFIGURED) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"${validatedData.name || "Form Bot"}" <${EMAIL_FROM}>`,
        to: EMAIL_TO,
        subject: `New Form Submission: ${validatedData.subject || "Contact from achaialabs.tech"}`,
        html: emailHtml,
      });
    } else {
      console.log("--- SMTP MOCK (Testing Mode Enabled) ---");
      console.log("Submission for achaialabs.com:");
      console.log(validatedData);
      console.log("---------------------------------------");
    }

    return NextResponse.json(
      { success: true, message: "Form submitted successfully" },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error: any) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit form" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
