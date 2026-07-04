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
  backgroundColor: "#020617",
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  color: "#f1f5f9",
  padding: "40px 20px",
};

const containerStyle = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#0b1329",
  border: "1px solid rgba(255,255,255,0.05)",
  borderRadius: "24px",
  padding: "40px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
};

const logoContainerStyle = {
  textAlign: "center" as const,
  marginBottom: "30px",
};

const logoStyle = {
  display: "inline-block",
  height: "40px",
};

const headingStyle = {
  fontSize: "24px",
  fontWeight: "900",
  textAlign: "center" as const,
  color: "#ffffff",
  margin: "0 0 20px 0",
  letterSpacing: "-0.05em",
  textTransform: "uppercase" as const,
  fontStyle: "italic",
};

const highlightStyle = {
  color: "#e11d48", // rose-500
};

const textStyle = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#94a3b8",
  margin: "0 0 24px 0",
};

const buttonContainerStyle = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const buttonStyle = {
  backgroundColor: "#e11d48",
  borderRadius: "14px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "16px 32px",
  boxShadow: "0 4px 15px rgba(225,29,72,0.4)",
};

const hrStyle = {
  borderColor: "rgba(255,255,255,0.05)",
  margin: "30px 0",
};

const footerStyle = {
  fontSize: "12px",
  color: "#475569",
  textAlign: "center" as const,
  lineHeight: "1.5",
};

const footerLinkStyle = {
  color: "#94a3b8",
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
      <Head />
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
            style={{ color: "#e2e8f0", fontSize: "15px", lineHeight: "1.6", marginBottom: "24px" }}
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
