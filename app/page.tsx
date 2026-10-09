"use client";

import React, { useState, useEffect } from "react";
import { Preloader } from "@/components/Preloader";
import { Hero } from "@/components/Hero";
import { CaseStudies } from "@/components/CaseStudies";
import { ScaleLog } from "@/components/ScaleLog";
import { PlayerOne } from "@/components/PlayerOne";
import { ContactHandshake } from "@/components/ContactHandshake";

export default function Home() {
  const [isReady, setIsReady] = useState(false);

  // Enforce scroll position at top on initial load and disable automatic browser scroll restoration
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.search.includes("skip=true")) {
        setIsReady(true);
      }
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }
  }, []);

  // Lock background scrolling while preloader is active so user cannot scroll the page
  useEffect(() => {
    if (!isReady) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "";
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
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
    <main id="top" className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)]/30 selection:text-[var(--text-primary)] transition-colors duration-300">
      {/* Preloading Screen */}
      {!isReady && <Preloader onComplete={handleComplete} variant="light" />}

      {/* 1. Hero Page */}
      <Hero isLoaded={isReady} />

      {/* 2. The Proof: Architecture Case Studies */}
      <CaseStudies />

      {/* 3. The Scale Log: Experience & Engineering Philosophy */}
      <ScaleLog />

      {/* 4. Player 1: The Sanctuary (Gaming, Soft Heart & Romantic Soul) */}
      <PlayerOne />

      {/* 5. The Handshake: Action & Contact */}
      <ContactHandshake />
    </main>
  );
}
