import type { Metadata } from "next";

const title = "Case Studies | Emmanuel Wilson";
const description =
  "The making of this portfolio, a wedding invitation, EWSTUDIOS: five AI products on one shared platform, and three production engineering studies.";

// A page's openGraph replaces the root one whole, so the image is repeated here
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/case-studies/" },
  openGraph: {
    title,
    description,
    url: "/case-studies/",
    siteName: "Emmanuel Wilson",
    locale: "en_IN",
    type: "article",
    images: [{ url: "/assets/og.jpg", width: 1200, height: 630, alt: "Emmanuel Wilson, full-stack and systems engineer" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/assets/og.jpg"] },
};

export default function CaseStudiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
