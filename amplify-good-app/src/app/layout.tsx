import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amplify Good — Amplify the Good City-Wide",
  description:
    "Where Wealth Preserves Art & Art Drives Social Impact. Connecting Austin musicians, non-profits, and community members.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=League+Spartan:wght@400;600;700&family=Open+Sans:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
