import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const GA_ID = process.env.NEXT_PUBLIC_MEASUREMENT_ID || "";

export const metadata: Metadata = {
  metadataBase: new URL("https://sendmyform.vercel.app"),
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
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "SendMyForm Preview",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SendMyForm — Form Backend as a Service",
    description: "Handle form submissions without writing a backend. Works with any frontend or framework.",
    site: "@achaialabs",
    images: ["/og-image.png"],
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
        {/* Google Analytics */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9204160176455905"
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <GoogleAnalytics />
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}