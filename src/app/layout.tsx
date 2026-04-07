import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  icons:{
    icon: "/icon.png"
  },
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9204160176455905"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <div className="gradient-bg" />
        {children}
      </body>
    </html>
  );
}
