"use client";

import React from "react";
import { Interlude } from "@/components/Interlude";
import type { CharacterAction } from "@/components/Character";

interface Chapter {
  scene: string;
  step: string;
  title: string;
  body: string;
  spec: string;
  image?: { src: string; alt: string; width: number; height: number; card?: boolean };
  character?: CharacterAction;
  links?: { label: string; href: string }[];
}

// Add the repository here once it is public: { label: "View the code", href: "…" }
const LINKS = [{ label: "Visit the invitation", href: "https://tinaandemmanuel.me" }];

// The wedding invitation at tinaandemmanuel.me. Each chapter names its camera stop in components/Stage.tsx.
const CHAPTERS: Chapter[] = [
  {
    scene: "wedding",
    step: "Case study 02 · tinaandemmanuel.me",
    title: "An invitation that flows.",
    body: "Our wedding invitation, built for our guests as one long scroll-painting: two streams rise in the mountains, travel side by side, and become one.",
    spec: "33 commits · April to October 2026",
    links: LINKS,
    image: { src: "/assets/wedding/couple.png", alt: "Illustration of Tina and Emmanuel walking hand in hand", width: 640, height: 357 },
  },
  {
    scene: "river",
    step: "01 · The world",
    title: "Scroll down, travel sideways.",
    body: "The page scrolls down while the world slides sideways, one pixel for one pixel. A fragment shader paints the two streams live as watercolour, rose and indigo, and the paper itself warms from dawn to dusk along the way.",
    spec: "River.tsx · OGL fragment shader",
    image: { src: "/assets/wedding/mountains.webp", alt: "Ink drawing of the mountains where the two streams rise", width: 3000, height: 1278, card: true },
  },
  {
    scene: "confluence",
    step: "02 · The confluence",
    title: "Where they meet, the river rises.",
    body: "At the confluence the world holds still and the water climbs over the whole screen. The two colours steep into one while a poem is read, then the water drains back and the journey goes on. The pointer stirs it; a tap sends a ring across it.",
    spec: "Water.tsx · two pigments, one pool",
    image: { src: "/assets/wedding/portrait.jpeg", alt: "Illustrated portrait of the couple", width: 1200, height: 630, card: true },
  },
  {
    scene: "blend",
    step: "03 · Performance",
    title: "Lighter every week.",
    body: "The keyed videos began as a loop over every pixel on the CPU, throttled to 24 frames a second, and moved into a WebGL shader. Three.js and react-three-fiber gave way to OGL, the smooth-scroll library came out, and phones got their own smaller encodes.",
    spec: "CPU pixel loop → GPU shader",
  },
  {
    scene: "reply",
    step: "04 · The reply",
    title: "A guest list in a spreadsheet.",
    body: "A guest can be sent a link with their own name in it and be greeted by it. Replies go straight into a Google Sheet through an Apps Script, so the site needs no server and ships as a static export on GitHub Pages.",
    spec: "Next.js static export · Apps Script",
    links: LINKS,
    character: "thumbsup",
  },
];

export const WeddingStory: React.FC = () => (
  <section id="wedding" aria-label="Case study: a wedding invitation" className="relative">
    {CHAPTERS.map(({ image, ...chapter }) => (
      <Interlude
        key={chapter.scene}
        {...chapter}
        figure={
          image && (
            // eslint-disable-next-line @next/next/no-img-element -- images are unoptimized in this static export
            <img
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading="lazy"
              className={`h-auto w-full ${image.card ? "rounded-2xl border border-[var(--border)] bg-[#F4EEE4] shadow-2xl" : "drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"}`}
            />
          )
        }
      />
    ))}
  </section>
);
