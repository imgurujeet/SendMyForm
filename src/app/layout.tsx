import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  icons: {
    icon: "/icon.png"
  },
  title: "SendMyForm — Form Backend as a Service | Handle Form Submissions Instantly",
  description: "SendMyForm is a form backend service that receives, validates, and delivers form submissions directly to your inbox. No backend code required. Works with any HTML form, React, Vue, or frontend framework.",
  keywords: "form backend, form submission service, HTML form handler, form as a service, form endpoint, contact form backend, form API, email form submissions, no backend form, SendMyForm",
  openGraph: {
    title: "SendMyForm — Handle Form Submissions Without a Backend",
    description: "Point your HTML form at a single endpoint. We validate, filter spam, and deliver submissions to your inbox instantly.",
    url: "https://sendmyform.vercel.app",
    siteName: "SendMyForm",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SendMyForm — Form Backend as a Service",
    description: "Handle form submissions without writing a backend. Works with any frontend or framework.",
    site: "@achaialabs",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9204160176455905"
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}