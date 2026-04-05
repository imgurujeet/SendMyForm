import type { Metadata } from "next";
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
      <body>
        <div className="gradient-bg" />
        {children}
      </body>
    </html>
  );
}
