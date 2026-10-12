"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Check, Sparkles, Zap, ArrowRight, Eye, RotateCcw } from "lucide-react";
import { StudioBackground } from "@/components/StudioBackground";
import { CharacterClip } from "@/components/Character";

interface PreloaderProps {
  onComplete: () => void;
  variant?: "light" | "dark";
}

const STATUS_MESSAGES = [
  "INITIALIZING RUNTIME ENVIRONMENT...",
  "PRE-RENDERING STATIC ASSETS...",
  "CALIBRATING 60 FPS MOTION MATRIX...",
  "COMPILING INTERACTIVE SHADERS...",
  "PORTFOLIO READY // WELCOME"
];

export const Preloader: React.FC<PreloaderProps> = ({ onComplete, variant = "light" }) => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Smooth progress progression
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const remaining = 100 - prev;
        const step = Math.max(1, Math.min(Math.ceil(remaining * 0.12), 4));
        return prev + step;
      });
    }, 45);

    return () => clearInterval(timer);
  }, []);

  // Sync status messages
  useEffect(() => {
    const nextIdx = Math.min(
      Math.floor((progress / 100) * STATUS_MESSAGES.length),
      STATUS_MESSAGES.length - 1
    );
    setStatusIndex(nextIdx);

    // Auto-proceed smoothly 1.2s after reaching 100% if user hasn't clicked
    if (progress === 100) {
      const autoTimer = setTimeout(() => {
        handleProceed();
      }, 1200);
      return () => clearTimeout(autoTimer);
    }
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

  const handleRestartProgress = () => {
    setProgress(0);
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
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] ${variant === "light" ? "bg-slate-200/50" : "bg-[var(--accent)]/15"} blur-[100px] rounded-full pointer-events-none`} />

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
                <CharacterClip name="arrive" className="relative h-full" />
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
                <span>{progress === 100 ? "CLICK OR PRESS SPACE TO ENTER" : STATUS_MESSAGES[statusIndex]}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </StudioBackground>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
