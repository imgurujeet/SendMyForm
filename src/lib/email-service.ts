import nodemailer from "nodemailer";
import * as React from "react";
import {
  VerificationEmail,
  WelcomeEmail,
  NewsletterCampaignEmail,
  renderReactEmail,
} from "@/components/email/templates";

// Initialize SMTP Transporter
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER || "achaialabs@gmail.com";
const SMTP_PASS = process.env.SMTP_PASS || "edzi wucp lism lynj";
const EMAIL_FROM = `"SendMyForm" <achaialabs@gmail.com>`; // Force sending from achaialabs@gmail.com

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  campaignId,
  subscriberEmail,
  smtpSettings,
}: {
  to: string;
  subject: string;
  html: string;
  campaignId?: string;
  subscriberEmail?: string;
  smtpSettings?: {
    senderType?: "global" | "custom_smtp" | "resend";
    resendApiKey?: string;
    host?: string;
    port?: string | number;
    user?: string;
    pass?: string;
    fromName?: string;
    fromEmail?: string;
  };
}) {
  let activeTransporter = transporter;
  let from = EMAIL_FROM;

  if (smtpSettings) {
    const { senderType, resendApiKey, host, port, user, pass, fromName, fromEmail } = smtpSettings;
    
    if (senderType === "resend" && resendApiKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: `"${fromName || 'Newsletter'}" <${fromEmail || 'noreply@resend.dev'}>`,
          to: [to],
          subject: subject,
          html: html,
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Resend delivery failed: ${errText}`);
      }
      return await res.json();
    } else if (senderType === "custom_smtp" && host && user && pass) {
      const parsedPort = typeof port === "string" ? parseInt(port) : port || 587;
      activeTransporter = nodemailer.createTransport({
        host,
        port: parsedPort,
        secure: parsedPort === 465,
        auth: {
          user,
          pass,
        },
      });
      from = `"${fromName || "Newsletter"}" <${fromEmail || user}>`;
    }
  }

  const mailOptions: any = {
    from,
    to,
    subject,
    html,
  };

  // Add custom headers if campaign metadata is available for tracking
  if (campaignId || subscriberEmail) {
    mailOptions.headers = {
      "X-Campaign-ID": campaignId || "",
      "X-Subscriber-Email": subscriberEmail || "",
    };
  }

  return await activeTransporter.sendMail(mailOptions);
}

// 1. Send Verification Link Email
export async function sendVerificationEmail(
  to: string,
  name: string,
  verificationLink: string
) {
  const element = React.createElement(VerificationEmail, {
    name,
    verificationLink,
  });
  const html = await renderReactEmail(element);
  return await sendEmail({
    to,
    subject: "Verify your email subscription - SendMyForm",
    html,
  });
}

// 2. Send Welcome Email
export async function sendWelcomeEmail(to: string, name: string, preferencesLink: string) {
  const element = React.createElement(WelcomeEmail, {
    name,
    preferencesLink,
  });
  const html = await renderReactEmail(element);
  return await sendEmail({
    to,
    subject: "Subscription Confirmed! Welcome to SendMyForm Updates",
    html,
  });
}

// 3. Send Campaign/Newsletter Email
export async function sendCampaignEmail({
  to,
  subject,
  contentHtml,
  ctaText,
  ctaUrl,
  coverImageUrl,
  preferencesLink,
  unsubscribeLink,
  campaignId,
  smtpSettings,
}: {
  to: string;
  subject: string;
  contentHtml: string;
  ctaText?: string;
  ctaUrl?: string;
  coverImageUrl?: string;
  preferencesLink: string;
  unsubscribeLink: string;
  campaignId: string;
  smtpSettings?: any;
}) {
  const element = React.createElement(NewsletterCampaignEmail, {
    contentHtml,
    ctaText,
    ctaUrl,
    coverImageUrl,
    preferencesLink,
    unsubscribeLink,
  });
  const html = await renderReactEmail(element);
  return await sendEmail({
    to,
    subject,
    html,
    campaignId,
    subscriberEmail: to,
    smtpSettings,
  });
}
