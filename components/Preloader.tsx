"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Monitor } from "lucide-react";
import { StudioBackground } from "@/components/StudioBackground";
import { CharacterClip } from "@/components/Character";
import { boot, clip, guess } from "@/lib/boot";

interface PreloaderProps {
  onComplete: () => void;
  variant?: "light" | "dark";
}

// Below this many bytes a second (about 2.5 Mbit/s) the visit gets the lighter variants
const LITE_BELOW = 320_000;
// However slow the connection, the visitor is let in about this long after the page was requested
const PATIENCE_MS = 25000;
// He gets at least this long to walk in, however fast the connection
const LEAST_MS = 2200;

const wait = (ms: number) => new Promise((done) => setTimeout(done, ms));

/**
 * Bytes a second this connection managed for the page's own scripts and styles, which loaded before this
 * code could run. They load side by side, so it is their total over the span they took. Null when they
 * came from the cache or were too small to tell.
 */
function measured() {
  const files = (performance.getEntriesByType("resource") as PerformanceResourceTiming[]).filter((e) => e.transferSize > 0 && e.responseStart > 0);
  const bytes = files.reduce((sum, e) => sum + e.transferSize, 0);
  if (bytes < 150_000) return null;
  const span = Math.max(...files.map((e) => e.responseEnd)) - Math.min(...files.map((e) => e.responseStart));
  return span > 0 ? bytes / (span / 1000) : null;
}

/** Download a file into the browser's cache, reporting each chunk. Resolves with its size; gives up at `until`. */
async function fetchInto(url: string, until: number, onBytes: (loaded: number, total: number) => void) {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), Math.max(0, until - performance.now()));
  try {
    const response = await fetch(url, { signal: abort.signal });
    const total = Number(response.headers.get("content-length")) || 0;
    const reader = response.body?.getReader();
    let loaded = 0;
    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      loaded += value.length;
      onBytes(loaded, total);
    }
    return loaded;
  } finally {
    clearTimeout(timer);
  }
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete, variant = "light" }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Loading the studio");
  const [mobile, setMobile] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const clipBox = useRef<HTMLDivElement>(null);

  // The real work behind the percentage. First his own walk-in clip, alone, so it is what loads first. Then the
  // hero's assets in the order they are needed, timed to see what this connection can afford. Then the page's
  // media is released (lib/boot.ts) with the variant chosen, and the hero has what it needs when the curtain lifts.
  useEffect(() => {
    let live = true;
    const begun = performance.now();
    // Never less than four seconds to fetch the hero's assets, however long the scripts took to arrive
    const until = Math.max(PATIENCE_MS, begun + 4000);
    const first = guess();
    const rate = measured();
    setMobile(first.mobile);
    const show = (value: number) => live && setProgress((was) => Math.max(was, Math.round(value)));

    (async () => {
      const video = clipBox.current?.querySelector("video");
      if (video && video.readyState < 4) {
        await Promise.race([new Promise((done) => video.addEventListener("canplaythrough", done, { once: true })), wait(3000)]);
      }
      show(20);

      let lite = first.lite || (rate !== null && rate < LITE_BELOW);
      try {
        if (live) setStatus("Checking your connection");
        // The clip format the browser will pick from <source>: HEVC with alpha in Safari, VP9 elsewhere
        const ext = document.createElement("video").canPlayType('video/mp4; codecs="hvc1"') ? "mp4" : "webm";
        const t0 = performance.now();
        const size = await fetchInto(`${clip("idle", lite)}.${ext}`, until, (loaded, total) => show(20 + 35 * (total ? loaded / total : 0.5)));
        // The scripts may have come from the cache, so the clip is timed too
        if (!lite && size / ((performance.now() - t0) / 1000) < LITE_BELOW) {
          lite = true;
          if (live) setStatus("Tuning for your connection");
          await fetchInto(`${clip("idle", true)}.${ext}`, until, () => {});
        }
        show(55);

        if (live) setStatus("Fetching the character");
        // The cursor-tracking sprite only exists on a screen with a mouse
        if (!first.mobile) {
          await fetchInto(lite ? "/assets/character/look-small.webp" : "/assets/character/look.webp", until, (loaded, total) =>
            show(55 + 15 * (total ? loaded / total : 0.5)),
          );
        }
        show(70);

        // Everything else the page plays, so nothing is still loading when its section arrives
        if (live) setStatus("Fetching the rest");
        const rest = [
          `${clip("admire", lite)}.${ext}`,
          "/assets/character/idle.webp",
          // Apple browsers and lite visits get the desk clip's still (components/ContactHandshake.tsx)
          lite || navigator.vendor.includes("Apple") ? "/assets/character/desk.webp" : "/assets/character/desk.webm",
          ...["night", "creed", "site"].map((pose) => `/assets/player/${pose}.webp`),
        ];
        let done = 0;
        await Promise.all(rest.map((url) => fetchInto(url, until, () => {}).then(() => show(70 + 10 * (++done / rest.length)))));
        show(80);

        // The 3D stage behind the hero. A slow connection does not wait for it: it fades in when it arrives
        if (live) setStatus("Building the stage");
        const stage = import("@/components/Stage");
        if (!lite) await Promise.race([stage, wait(Math.max(0, until - performance.now()))]);
      } catch {
        // Out of patience or offline: let them in with the lighter variants
        lite = true;
      }
      // A visitor who entered early has already been let in with the first guess; do not swap variants under them
      if (!boot.get().ready) boot.set({ ready: true, lite, mobile: first.mobile });
      if (!live) return;
      setStatus(lite ? "Tuned for your connection" : "Ready");
      await wait(Math.max(0, LEAST_MS - (performance.now() - begun)));
      show(100);
    })();

    return () => {
      live = false;
    };
  }, []);

  // Enter by itself 1.2s after everything is ready, if the visitor has not already
  useEffect(() => {
    if (progress !== 100) return;
    const autoTimer = setTimeout(() => handleProceed(), 1200);
    return () => clearTimeout(autoTimer);
  }, [progress]);

  // Space / Enter keyboard trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        setIsFinished(true);
        setTimeout(() => {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          onComplete();
        }, 500);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onComplete]);

  const handleProceed = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setIsFinished(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      onComplete();
    }, 500);
  };



  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="video-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.03,
            transition: {
              duration: 0.7,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
          className={`fixed inset-0 z-50 w-full h-full ${variant === "light" ? "bg-white" : "bg-[var(--background)]"} select-none overflow-hidden`}
        >
          {/* 1. Fullscreen Studio Cyclorama Infinity Cove Environment */}
          <StudioBackground
            variant={variant}
            spotlightPosition="center"
            showFloorShadow={true}
            showGrain={true}
            showVignette={true}
            className="absolute inset-0 w-full h-full"
          >

            {/* 2. Centered "Far Back" Character Studio Scene */}
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              
              {/* Backlight Softbox Glow */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] ${variant === "light" ? "bg-slate-200/50" : "bg-[color:color-mix(in_srgb,var(--accent)_15%,transparent)]"} blur-[100px] rounded-full pointer-events-none`} />

              {/* Character Video - Sized down & placed far back in the center */}
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 flex h-[68vh] items-center justify-center"
              >
                {/* Contact ground shadow */}
                <div className={`absolute bottom-[3%] left-1/2 -translate-x-1/2 w-[70%] h-8 ${variant === "light" ? "bg-slate-900/15" : "bg-black/30"} blur-2xl rounded-full pointer-events-none`} />

                {/* He walks in while the page loads */}
                <div ref={clipBox} className="relative h-full">
                  <CharacterClip name="arrive" eager className="relative h-full" />
                </div>
              </motion.div>


            </div>

            {/* 3. Floating Bottom-Right Loader & Percentage (No Card) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={handleProceed}
              className="fixed bottom-8 right-8 sm:bottom-12 sm:right-12 z-30 flex flex-col items-end w-60 sm:w-72 select-none cursor-pointer group"
              title="Click or press Space to enter portfolio"
            >
              {/* Floating Percentage Counter: Montserrat ExtraBold 800 */}
              <div className={`font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-[-0.02em] ${variant === "dark" ? "text-[var(--text-primary)]" : "text-[#000000]"} flex items-baseline mb-2.5 transition-transform group-hover:scale-105`}>
                {progress.toString().padStart(2, "0")}
                <span className="text-xl sm:text-2xl text-accent font-light ml-1 font-display">%</span>
              </div>

              {/* Animated Wavy Loader strictly in color system with dissolving feathered edges */}
              <div 
                className="relative w-full h-6 overflow-hidden"
                style={{
                  maskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
                }}
              >
                <svg className="w-full h-full" viewBox="0 0 400 20" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="accentWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--accent-active)" />
                      <stop offset="45%" stopColor="var(--accent)" />
                      <stop offset="75%" stopColor="var(--accent-hover)" />
                      <stop offset="100%" stopColor="var(--warm-light)" />
                    </linearGradient>
                    <filter id="accentGlow" x="-20%" y="-40%" width="140%" height="180%">
                      <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="var(--accent)" floodOpacity="0.7" />
                    </filter>
                  </defs>

                  {/* Background Muted Wave Track */}
                  <path
                    d="M 0 10 Q 8 3, 16 10 T 32 10 T 48 10 T 64 10 T 80 10 T 96 10 T 112 10 T 128 10 T 144 10 T 160 10 T 176 10 T 192 10 T 208 10 T 224 10 T 240 10 T 256 10 T 272 10 T 288 10 T 304 10 T 320 10 T 336 10 T 352 10 T 368 10 T 384 10 T 400 10"
                    fill="none"
                    stroke={variant === "light" ? "rgba(100, 116, 139, 0.25)" : "rgba(var(--accent-rgb), 0.2)"}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Active Animated Wave Masked to Progress */}
                <div 
                  className="absolute top-0 left-0 h-full overflow-hidden transition-[width] duration-150 ease-out"
                  style={{ width: `${progress}%` }}
                >
                  <div className="w-[480px] h-full relative">
                    <motion.svg 
                      className="absolute top-0 left-0 w-[480px] h-full" 
                      viewBox="0 0 480 20" 
                      preserveAspectRatio="none"
                      animate={{ x: [0, -32] }}
                      transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                    >
                      {/* Secondary background wave for fluid liquid motion */}
                      <path
                        d="M 0 10 Q 8 16, 16 10 T 32 10 T 48 10 T 64 10 T 80 10 T 96 10 T 112 10 T 128 10 T 144 10 T 160 10 T 176 10 T 192 10 T 208 10 T 224 10 T 240 10 T 256 10 T 272 10 T 288 10 T 304 10 T 320 10 T 336 10 T 352 10 T 368 10 T 384 10 T 400 10 T 416 10 T 432 10 T 448 10 T 464 10 T 480 10"
                        fill="none"
                        stroke="rgba(var(--accent-rgb), 0.35)"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      {/* Primary glowing wave */}
                      <path
                        d="M 0 10 Q 8 3, 16 10 T 32 10 T 48 10 T 64 10 T 80 10 T 96 10 T 112 10 T 128 10 T 144 10 T 160 10 T 176 10 T 192 10 T 208 10 T 224 10 T 240 10 T 256 10 T 272 10 T 288 10 T 304 10 T 320 10 T 336 10 T 352 10 T 368 10 T 384 10 T 400 10 T 416 10 T 432 10 T 448 10 T 464 10 T 480 10"
                        fill="none"
                        stroke="url(#accentWaveGrad)"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        filter="url(#accentGlow)"
                      />
                    </motion.svg>
                  </div>
                </div>

                {/* Leading Crest Glow Sparkle */}
                {progress > 0 && progress < 100 && (
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_var(--accent),0_0_16px_var(--accent)] pointer-events-none transition-[left] duration-150 ease-out"
                    style={{ left: `${progress}%` }}
                  />
                )}
              </div>

              {/* Status & Skip hint */}
              <div className={`mt-2.5 font-mono text-[10px] tracking-wider uppercase ${variant === "light" ? "text-slate-500" : "text-[var(--text-muted)]"} flex items-center gap-1.5 opacity-75 group-hover:opacity-100 transition-opacity`}>
                <span>{progress === 100 ? (mobile ? "Tap to enter" : "Click or press Space to enter") : `${status}…`}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Phones get the whole story, but it was made for a big screen and a mouse */}
              {mobile && (
                <div className={`mt-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider ${variant === "light" ? "text-slate-600" : "text-[var(--text-secondary)]"}`}>
                  <Monitor className="h-3 w-3" />
                  <span>Best experienced on a desktop</span>
                </div>
              )}
            </motion.div>
          </StudioBackground>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
