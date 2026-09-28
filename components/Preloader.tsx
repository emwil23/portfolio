"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Check, Sparkles, Zap, ArrowRight } from "lucide-react";

interface PreloaderProps {
  onComplete: () => void;
}

const STATUS_MESSAGES = [
  "INITIALIZING RUNTIME ENVIRONMENT...",
  "PRE-RENDERING STATIC ASSETS...",
  "CALIBRATING 60 FPS MOTION MATRIX...",
  "COMPILING INTERACTIVE SHADERS...",
  "PORTFOLIO READY // WELCOME"
];

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-play insurance for mobile devices & Safari policy
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be restricted in rare low-power mode, fallback cleanly
      });
    }
  }, []);

  // Smooth progress progression
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const remaining = 100 - prev;
        const step = Math.max(1, Math.min(Math.ceil(remaining * 0.12), 5));
        return prev + step;
      });
    }, 45);

    return () => clearInterval(timer);
  }, []);

  // Sync status messages and handle exit when reaching 100%
  useEffect(() => {
    const nextIdx = Math.min(
      Math.floor((progress / 100) * STATUS_MESSAGES.length),
      STATUS_MESSAGES.length - 1
    );
    setStatusIndex(nextIdx);

    if (progress === 100) {
      const exitTimeout = setTimeout(() => {
        setIsFinished(true);
        setTimeout(onComplete, 650);
      }, 400);
      return () => clearTimeout(exitTimeout);
    }
  }, [progress, onComplete]);

  // Space / Escape keyboard skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Escape" || e.code === "Enter") {
        setIsFinished(true);
        setTimeout(onComplete, 300);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onComplete]);

  const handleSkip = () => {
    setIsFinished(true);
    setTimeout(onComplete, 300);
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
              duration: 0.65,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
          className="fixed inset-0 z-50 w-full h-full bg-[#18181B] select-none overflow-hidden"
        >
          {/* 1. Fullscreen Responsive Video Layer */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <video
              ref={videoRef}
              src="/assets/character-working.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            />

            {/* Subtle Studio Vignette Overlay to blend video edges */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#18181B]/70 via-transparent to-[#18181B]/40 pointer-events-none" />
            <div className="absolute inset-0 bg-radial-glow opacity-60 pointer-events-none" />
          </div>

          {/* 2. Top Navigation Bar Overlay */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between max-w-7xl mx-auto pointer-events-none"
          >
            <div className="flex items-center gap-3 bg-[#18181B]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-700/60 shadow-lg">
              <div className="w-5 h-5 rounded-md bg-[#27272A] border border-zinc-700 flex items-center justify-center font-mono font-bold text-[10px] text-[#7C3AED]">
                EW
              </div>
              <span className="font-mono text-xs tracking-wider text-[#F9FAFB] font-semibold">
                EMMANUEL WILSON
              </span>
              <span className="hidden sm:inline-block text-[11px] font-mono text-zinc-400 border-l border-zinc-700 pl-2">
                SDE-2
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-zinc-300 bg-[#18181B]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-700/60 shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7C3AED] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7C3AED]"></span>
              </span>
              <span>STUDIO ENVIRONMENT // ACTIVE</span>
            </div>
          </motion.div>

          {/* 3. Bottom-Right Loading Overlay Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-30 w-[calc(100%-2.5rem)] sm:w-84 md:w-96"
          >
            <div className="relative rounded-2xl bg-[#18181B]/90 backdrop-blur-xl border border-zinc-700/70 p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.65)] overflow-hidden">
              
              {/* Vibrant Violet Glow Accent inside card */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/15 rounded-full blur-2xl pointer-events-none" />

              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-4">
                <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
                  <Terminal className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span className="tracking-wider text-[#F9FAFB] font-medium">SYSTEM BOOT</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#7C3AED]">
                  {progress === 100 ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Zap className="w-3.5 h-3.5 animate-pulse" />
                  )}
                  <span>{progress === 100 ? "READY" : "LOADING"}</span>
                </div>
              </div>

              {/* Main Counter & Status */}
              <div className="flex items-baseline justify-between mb-3">
                <div className="flex flex-col">
                  <span className="font-mono text-[11px] text-zinc-400 tracking-wider">
                    COMPILATION
                  </span>
                  <span className="font-mono text-xs text-zinc-300 font-semibold mt-0.5 truncate max-w-[190px] sm:max-w-[220px]">
                    {STATUS_MESSAGES[statusIndex]}
                  </span>
                </div>

                <div className="font-mono text-4xl sm:text-5xl font-extrabold tracking-tighter text-[#F9FAFB] flex items-baseline">
                  {progress.toString().padStart(2, "0")}
                  <span className="text-xl sm:text-2xl text-[#7C3AED] font-light ml-1">%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative w-full h-1.5 bg-zinc-800/90 rounded-full overflow-hidden mb-4 border border-zinc-700/50">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#7C3AED] via-[#a78bfa] to-[#c4b5fd] shadow-[0_0_15px_#7C3AED]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.08 }}
                />
              </div>

              {/* Card Footer: Skip & Telemetry */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleSkip}
                  className="group flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 hover:text-[#F9FAFB] transition-colors cursor-pointer px-2.5 py-1 rounded-md bg-zinc-800/60 hover:bg-[#7C3AED]/20 border border-zinc-700/60 hover:border-[#7C3AED]/50"
                >
                  <span>Skip</span>
                  <kbd className="px-1 py-0.2 rounded bg-zinc-900 text-[#7C3AED] text-[9px] font-bold">
                    SPACE
                  </kbd>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <div className="font-mono text-[10px] text-zinc-500 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#7C3AED]" />
                  <span>60 FPS LOCKED</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
