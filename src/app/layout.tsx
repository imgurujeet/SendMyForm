import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Achaia Labs | Form Submitted",
  description: "Form submission confirmation for Achaia Labs",
  keywords: "form submission, confirmation, Achaia Labs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9204160176455905"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <div className="gradient-bg" />
        {children}
      </body>
    </html>
  );
}
