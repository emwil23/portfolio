"use client";

import React, { useEffect, useRef } from "react";

// turn.webp is an 8x6 sprite of him turning once on the spot (see scripts/key-assets.sh).
const COLS = 8;
const ROWS = 6;

/** The character, turned by the scroll: one full spin while his chapter holds the screen. */
export const Turnaround: React.FC<{ className?: string }> = ({ className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const chapter = el?.closest<HTMLElement>("[data-chapter]");
    if (!el || !chapter) return;
    const onScroll = () => {
      const box = chapter.getBoundingClientRect();
      const turned = Math.min(1, Math.max(0, -box.top / (box.height - window.innerHeight)));
      const cell = Math.round(turned * (COLS * ROWS - 1));
      el.style.backgroundPosition = `${((cell % COLS) * 100) / (COLS - 1)}% ${(Math.floor(cell / COLS) * 100) / (ROWS - 1)}%`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Emmanuel's character turning on the spot"
      className={`aspect-[261/698] bg-[length:800%_600%] bg-[position:0%_0%] bg-[url('/assets/character/turn.webp')] ${className}`}
    />
  );
};
