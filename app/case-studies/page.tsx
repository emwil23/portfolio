"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";
import { release, useBoot } from "@/lib/boot";
import { Nav } from "@/components/Nav";
import { Story } from "@/components/Story";
import { WeddingStory } from "@/components/WeddingStory";
import { Interlude } from "@/components/Interlude";
import { CaseStudies } from "@/components/CaseStudies";
import { ContactHandshake } from "@/components/ContactHandshake";

// three.js only loads in the browser, after the first paint
const Stage = dynamic(() => import("@/components/Stage").then((m) => m.Stage), { ssr: false });

export default function CaseStudiesPage() {
  const { ready } = useBoot();
  // No preloader here: media is released as soon as the page is up, in the variant this visit can afford
  useEffect(release, []);

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[color:color-mix(in_srgb,var(--accent)_30%,transparent)] selection:text-[var(--text-primary)] transition-colors duration-300">
        {ready && <Stage />}
        <Nav />

        {/* 1. How this website was made */}
        <Story />

        {/* 2. The wedding invitation */}
        <WeddingStory />

        {/* 3. The Proof: Architecture Case Studies */}
        <Interlude
          scene="proof"
          step="Case studies 03–05 · Production"
          title="Now the day job."
          body="Three systems built and shipped for 200,000 daily users, each one taken apart below."
          character="type"
        />
        <CaseStudies />

        <ContactHandshake />
        <div data-chapter="end" />
      </main>
    </MotionConfig>
  );
}
