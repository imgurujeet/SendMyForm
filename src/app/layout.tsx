import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const GA_ID = process.env.NEXT_PUBLIC_MEASUREMENT_ID || "";

export const metadata: Metadata = {
  metadataBase: new URL("https://sendmyform.live"),
  applicationName: "SendMyForm",
  authors: [{ name: "Achaia Labs", url: "https://achaialabs.tech" }],
  icons: {
    icon: "/icon.png"
  },
  title: "SendMyForm — #1 No-Backend Form Submit Service | Handle Submissions Instantly",
  description: "SendMyForm is the best form backend service that receives, validates, and delivers form submissions directly to your inbox. No backend code required. Perfect for Jamstack, Static Sites, React, and Vue.",
  keywords: "no backend form submit, form backend service, HTML form handler, static site forms, jamstack form backend, form as a service, contact form API, email form submissions, AJAX form submit, SendMyForm, formspree alternative",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "SendMyForm — Handle Form Submissions Without a Backend",
    description: "The easiest way to handle forms on static sites. Point your HTML form at our endpoint. We do the rest: validation, spam filtering, and instant delivery.",
    url: "https://sendmyform.live",
    siteName: "SendMyForm",
    type: "website",
    locale: "en_US",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "SendMyForm — Form Backend as a Service",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SendMyForm — Form Backend as a Service",
    description: "Handle form submissions without writing a backend. Works with any frontend or framework.",
    site: "@achaialabs",
    creator: "@achaialabs",
    images: ["/og-image.png"],
  },
  other: {
    "google-adsense-account": "ca-pub-9204160176455905"
  }
};

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Achaia Labs",
  "url": "https://sendmyform.live",
  "logo": "https://sendmyform.live/logo.jpeg",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "",
    "contactType": "customer service",
    "email": "contact@sendmyform.live"
  },
  "sameAs": [
    "https://x.com/achaialabs",
    "https://www.linkedin.com/company/achaia-labs/"
  ]
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SendMyForm",
  "operatingSystem": "All",
  "applicationCategory": "DeveloperApplication",
  "description": "A powerful form backend service that allows developers to collect form submissions without writing a single line of backend code.",
  "author": {
    "@type": "Organization",
    "name": "Achaia Labs"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "120"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          id="org-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
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
        <Script
          id="adsbygoogle-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9204160176455905"
          crossOrigin="anonymous"
          strategy="afterInteractive"
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