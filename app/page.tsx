"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { Preloader } from "@/components/Preloader";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Interlude } from "@/components/Interlude";
import { ScaleLog } from "@/components/ScaleLog";
import { PlayerOne } from "@/components/PlayerOne";
import { ContactHandshake } from "@/components/ContactHandshake";

// three.js only loads in the browser, after the first paint
const Stage = dynamic(() => import("@/components/Stage").then((m) => m.Stage), { ssr: false });

// The glimpse cards into the case studies page
const CASE_STUDIES = [
  { href: "/case-studies/#making", kicker: "01 · This website", title: "He isn't a 3D model.", glimpse: "/assets/glimpse/making.webp" },
  { href: "/case-studies/#wedding", kicker: "02 · A wedding invitation", title: "Two rivers, one journey.", glimpse: "/assets/glimpse/wedding.webp" },
  { href: "/case-studies/#proof", kicker: "03–05 · Production systems", title: "Built with intention.", glimpse: "/assets/glimpse/proof.webp" },
];

// The preloader plays once per page load, not again on the way back from another page
let entered = false;

// Coming back with the browser's back button returns to where this page was left, not to the top.
// A click records the spot (and means the next arrival is not a "back"); popstate means it is one.
let leftAt: number | null = null;
let cameBack = false;
if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    cameBack = true;
  });
  window.addEventListener(
    "click",
    () => {
      cameBack = false;
      if (window.location.pathname === "/") leftAt = window.scrollY;
    },
    true,
  );
}

export default function Home() {
  const [isReady, setIsReady] = useState(entered);
  // The case study whose card is hovered or focused: its glimpse takes the character's place
  const [glimpse, setGlimpse] = useState<string | null>(null);
  // The card that was just clicked spins until the case studies page takes over
  const [opening, setOpening] = useState<string | null>(null);

  // Enforce scroll position at top on initial load and disable automatic browser scroll restoration
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.search.includes("skip=true")) {
        setIsReady(true);
      }
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      if (!window.location.hash && !(cameBack && leftAt !== null)) window.scrollTo(0, 0);
    }
  }, []);

  // Lock background scrolling while preloader is active so user cannot scroll the page
  useEffect(() => {
    if (!isReady) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      entered = true;
      document.body.style.overflow = "";
      // A link such as /#scale lands on its section; anything else starts at the top
      const target = window.location.hash ? document.getElementById(window.location.hash.slice(1)) : null;
      if (target) {
        target.scrollIntoView({ behavior: "instant" });
      } else if (cameBack && leftAt !== null) {
        window.scrollTo({ top: leftAt, left: 0, behavior: "instant" });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        requestAnimationFrame(() => {
          window.scrollTo(0, 0);
        });
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isReady]);

  const handleComplete = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setIsReady(true);
  };

  return (
    <MotionConfig reducedMotion="user">
      <main id="top" className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[color:color-mix(in_srgb,var(--accent)_30%,transparent)] selection:text-[var(--text-primary)] transition-colors duration-300">
        {/* Preloading Screen */}
        {!isReady && <Preloader onComplete={handleComplete} variant="light" />}

        {/* The WebGL world every section below sits in */}
        <Stage />
        <Nav isLoaded={isReady} />

        {/* 1. Hero Page */}
        <Hero isLoaded={isReady} />

        {/* 2. The work: a glimpse of the case studies page */}
        <Interlude
          scene="work"
          id="work"
          step="Chapter 01 · The work"
          title="First, the proof."
          body="This website taken apart frame by frame, a wedding invitation that flows like a river, and three production systems built for 200,000 daily users. Pick a thread."
          character="idle"
          track
          covered={glimpse !== null}
          figure={
            <AnimatePresence>
              {glimpse && (
                // eslint-disable-next-line @next/next/no-img-element -- images are unoptimized in this static export
                <motion.img
                  key={glimpse}
                  src={glimpse}
                  alt=""
                  width={1280}
                  height={800}
                  style={{ y: "-50%" }}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-x-0 top-1/2 h-auto w-full rounded-2xl border border-[color:color-mix(in_srgb,var(--key)_60%,transparent)] shadow-2xl"
                />
              )}
            </AnimatePresence>
          }
        >
          <ul className="mt-6 flex flex-col gap-3">
            {CASE_STUDIES.map((study) => (
              <li key={study.href}>
                <Link
                  href={study.href}
                  onClick={() => setOpening(study.href)}
                  onMouseEnter={() => setGlimpse(study.glimpse)}
                  onMouseLeave={() => setGlimpse(null)}
                  onFocus={() => setGlimpse(study.glimpse)}
                  onBlur={() => setGlimpse(null)}
                  className="group flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface-1)_70%,transparent)] px-4 py-3 shadow-md backdrop-blur-md transition-colors hover:border-[var(--key)]"
                >
                  <span>
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-[var(--key)]">{study.kicker}</span>
                    <span className="mt-1 block font-display text-base font-extrabold uppercase tracking-tight text-[var(--text-primary)] sm:text-lg">{study.title}</span>
                  </span>
                  {opening === study.href ? (
                    <Loader2 aria-label="Opening" className="h-4 w-4 shrink-0 animate-spin text-[var(--key)]" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--key)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </Interlude>

        {/* 3. The Scale Log: Experience & Engineering Philosophy */}
        <Interlude
          scene="scale"
          step="Chapter 02 · The scale"
          title="Then, the scale."
          body="Where those systems ran, what they carried, and what had changed by the time I was done with them."
          character="admire"
        />
        <ScaleLog />

        {/* 4. Player 1: The Sanctuary (Gaming, Soft Heart & Romantic Soul) */}
        <Interlude
          scene="player"
          step="Chapter 03 · Player 1"
          title="And when the terminal closes."
          body="The gamer and the person behind the architecture. Three worlds, and what each one taught me about systems."
          character="game"
        />
        <PlayerOne />

        {/* 5. The Handshake: Action & Contact */}
        <Interlude
          scene="shake"
          step="Chapter 04 · The handshake"
          title="Your move."
          body="That is the story so far. The next chapter could be yours."
          character="handshake"
        />
        <ContactHandshake />
        <div data-chapter="close" />
      </main>
    </MotionConfig>
  );
}
