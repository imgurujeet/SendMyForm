import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Heading,
  Hr,
  Img,
  Preview,
} from "@react-email/components";

// --- HELPERS & STYLES ---
const mainStyle = {
  backgroundColor: "#f8fafc",
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  color: "#334155",
  padding: "40px 20px",
};

const containerStyle = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  padding: "40px",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.025)",
};

const logoContainerStyle = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const logoStyle = {
  display: "inline-block",
  height: "40px",
};

const headingStyle = {
  fontSize: "24px",
  fontWeight: "800",
  textAlign: "center" as const,
  color: "#0f172a",
  margin: "0 0 24px 0",
  letterSpacing: "-0.025em",
  textTransform: "none" as const,
};

const highlightStyle = {
  color: "#e11d48", // rose-500
};

const textStyle = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#334155",
  margin: "0 0 20px 0",
};

const buttonContainerStyle = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const buttonStyle = {
  backgroundColor: "#e11d48",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 28px",
};

const hrStyle = {
  borderColor: "#e2e8f0",
  margin: "32px 0",
};

const footerStyle = {
  fontSize: "12px",
  color: "#64748b",
  textAlign: "center" as const,
  lineHeight: "1.6",
};

const footerLinkStyle = {
  color: "#64748b",
  textDecoration: "underline",
  margin: "0 8px",
};

// --- TEMPLATES ---

// 1. Verification Email
interface VerificationEmailProps {
  name?: string;
  verificationLink: string;
}

export const VerificationEmail = ({
  name,
  verificationLink,
}: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your email subscription to SendMyForm</Preview>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          <div style={logoContainerStyle}>
            <Heading style={headingStyle}>
              sendmyform <span style={highlightStyle}>HQ</span>
            </Heading>
          </div>
          <Heading style={{ ...headingStyle, fontSize: "20px", textTransform: "none" }}>
            Verify your email address
          </Heading>
          <Text style={textStyle}>
            Hello {name || "there"},
          </Text>
          <Text style={textStyle}>
            Thank you for subscribing to SendMyForm. To complete your subscription and start receiving product updates, releases, and feature launch notes, please click the button below to verify your email.
          </Text>
          <div style={buttonContainerStyle}>
            <Link href={verificationLink} style={buttonStyle}>
              Verify Subscription
            </Link>
          </div>
          <Text style={textStyle}>
            If you did not request this subscription, you can safely ignore this email.
          </Text>
          <Hr style={hrStyle} />
          <Text style={footerStyle}>
            SendMyForm by Achaia Labs. Zero Persistence Form Backend.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// 2. Welcome Email
interface WelcomeEmailProps {
  name?: string;
  preferencesLink: string;
}

export const WelcomeEmail = ({
  name,
  preferencesLink,
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to SendMyForm Updates!</Preview>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          <div style={logoContainerStyle}>
            <Heading style={headingStyle}>
              sendmyform <span style={highlightStyle}>HQ</span>
            </Heading>
          </div>
          <Heading style={{ ...headingStyle, fontSize: "20px", textTransform: "none" }}>
            You're in! 🎉
          </Heading>
          <Text style={textStyle}>
            Hi {name || "there"},
          </Text>
          <Text style={textStyle}>
            Your subscription to SendMyForm product updates is verified! You'll now be the first to hear about spam filtering improvements, API updates, new themes, and webhook integrations.
          </Text>
          <Text style={textStyle}>
            We build in public and release updates frequently. You can customize which updates you receive and their frequency at any time using the link below.
          </Text>
          <div style={buttonContainerStyle}>
            <Link href={preferencesLink} style={buttonStyle}>
              Manage Email Preferences
            </Link>
          </div>
          <Hr style={hrStyle} />
          <Text style={footerStyle}>
            SendMyForm by Achaia Labs.
            <br />
            To change preferences or unsubscribe, click{" "}
            <Link href={preferencesLink} style={{ color: "#94a3b8" }}>
              here
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// 3. Campaign Layout Email
interface NewsletterCampaignEmailProps {
  contentHtml: string;
  ctaText?: string;
  ctaUrl?: string;
  coverImageUrl?: string;
  preferencesLink: string;
  unsubscribeLink: string;
}

export const NewsletterCampaignEmail = ({
  contentHtml,
  ctaText,
  ctaUrl,
  coverImageUrl,
  preferencesLink,
  unsubscribeLink,
}: NewsletterCampaignEmailProps) => {
  return (
    <Html>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: `
          h1 { font-size: 24px; font-weight: 800; color: #0f172a; margin-top: 24px; margin-bottom: 12px; font-style: italic; }
          h2 { font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 20px; margin-bottom: 10px; }
          p { margin-bottom: 16px; color: #334155; }
          ul { list-style-type: disc; padding-left: 20px; margin-bottom: 16px; }
          ol { list-style-type: decimal; padding-left: 20px; margin-bottom: 16px; }
          li { margin-bottom: 8px; color: #334155; }
          blockquote { border-left: 4px solid #e11d48; padding-left: 16px; margin: 20px 0; font-style: italic; color: #475569; }
          a { color: #e11d48; text-decoration: underline; }
        `}} />
      </Head>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          <div style={logoContainerStyle}>
            <Heading style={headingStyle}>
              sendmyform <span style={highlightStyle}>HQ</span>
            </Heading>
          </div>
          {coverImageUrl && (
            <Section style={{ marginBottom: "24px", borderRadius: "16px", overflow: "hidden", textAlign: "center" }}>
              <Img src={coverImageUrl} alt="Campaign Cover" style={{ width: "100%", height: "auto", borderRadius: "16px" }} />
            </Section>
          )}
          
          {/* Inject contentHtml rendered from TipTap */}
          <div 
            style={{ color: "#334155", fontSize: "15px", lineHeight: "1.6", marginBottom: "24px" }}
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {ctaText && ctaUrl && (
            <div style={buttonContainerStyle}>
              <Link href={ctaUrl} style={buttonStyle}>
                {ctaText}
              </Link>
            </div>
          )}

          <Hr style={hrStyle} />
          
          <div style={footerStyle}>
            <Text style={{ margin: "0 0 10px 0", color: "#475569" }}>
              Sent from SendMyForm by Achaia Labs.
            </Text>
            <div>
              <Link href={unsubscribeLink} style={footerLinkStyle}>
                Unsubscribe
              </Link>
              <span style={{ color: "#1e293b" }}>•</span>
              <Link href={preferencesLink} style={footerLinkStyle}>
                Manage Preferences
              </Link>
            </div>
          </div>
        </Container>
      </Body>
    </Html>
  );
};

// --- RENDER UTILITY ---
export async function renderReactEmail(element: React.ReactElement): Promise<string> {
  const { render } = await import("@react-email/render");
  // Try newer async render or legacy sync render
  const rendered = render(element);
  if (rendered instanceof Promise) {
    return await rendered;
  }
  return rendered;
}
