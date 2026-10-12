import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emmanuel Wilson | Full-Stack & Systems Engineer",
  description: "Portfolio of Emmanuel Wilson — High-Scale Frontend Systems, Matrix Virtualization & Distributed Architectures.",
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
        {/* Preload critical preloader & sanctuary assets for blazing fast LCP */}
        <link rel="preload" as="image" href="/assets/player1-setup.webp" />
        <link rel="preload" as="image" href="/assets/romantic-polaroid.webp" />
        
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
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-[var(--accent)]/30 selection:text-[var(--text-primary)] min-h-screen transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
