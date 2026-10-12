"use client";

import React from "react";
import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";
import { Nav } from "@/components/Nav";
import { Story } from "@/components/Story";
import { WeddingStory } from "@/components/WeddingStory";
import { Interlude } from "@/components/Interlude";
import { CaseStudies } from "@/components/CaseStudies";
import { ContactHandshake } from "@/components/ContactHandshake";

// three.js only loads in the browser, after the first paint
const Stage = dynamic(() => import("@/components/Stage").then((m) => m.Stage), { ssr: false });

export default function CaseStudiesPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)]/30 selection:text-[var(--text-primary)] transition-colors duration-300">
        <Stage />
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
