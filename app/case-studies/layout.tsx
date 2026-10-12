import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies | Emmanuel Wilson",
  description:
    "How this portfolio's cursor-following character was built from green-screen video, a wedding invitation painted as two rivers, and three production systems engineered for 200,000 daily users.",
};

export default function CaseStudiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
