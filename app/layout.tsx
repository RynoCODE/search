import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Local Document Search Engine",
  description: "A Next.js application for file extraction, summarization, and search",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
