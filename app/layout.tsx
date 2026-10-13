import type { Metadata } from "next";
import "./globals.css";

const title = "Emmanuel Wilson | Full-Stack & Systems Engineer";
const description = "Portfolio of Emmanuel Wilson — High-Scale Frontend Systems, Matrix Virtualization & Distributed Architectures.";

export const metadata: Metadata = {
  // The live address (public/CNAME): link previews need absolute URLs for their image
  metadataBase: new URL("https://emmanuelwilson.tech"),
  title,
  description,
  openGraph: { title, description, url: "/", type: "website", images: [{ url: "/assets/og.jpg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: ["/assets/og.jpg"] },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Montserrat:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Anti-FOUC Theme Initialization */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('portfolio-theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const isDark = stored !== null ? stored === 'dark' : prefersDark;
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-[color:color-mix(in_srgb,var(--accent)_30%,transparent)] selection:text-[var(--text-primary)] min-h-screen transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
