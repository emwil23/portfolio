import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emmanuel Wilson | Full-Stack & Systems Engineer (SDE-2)",
  description: "Portfolio of Emmanuel Wilson — High-Scale Frontend Systems, Matrix Virtualization & Distributed Architectures.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#18181B] text-[#F9FAFB] antialiased selection:bg-[#7C3AED]/30 selection:text-[#F9FAFB] min-h-screen">
        {children}
      </body>
    </html>
  );
}
