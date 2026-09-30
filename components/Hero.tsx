"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Code2, Sun, Moon } from "lucide-react";

interface HeroProps {
  isLoaded: boolean;
}

export const Hero: React.FC<HeroProps> = ({ isLoaded }) => {
  const [time, setTime] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    updateTime();
    const timer = setInterval(updateTime, 60000);

    // Sync theme with document class
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("portfolio-theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  };

  return (
    <main 
      className="relative min-h-screen bg-[var(--background)] overflow-hidden transition-colors duration-300"
    >
      {/* Studio Cyclorama Background */}
      <div className="absolute inset-0 bg-hero-cyclorama pointer-events-none transition-opacity duration-500" />

      {/* Subtle Studio Glow */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      {/* Fixed Top Navigation Bar */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 inset-x-0 z-40 w-full px-6 py-4 sm:px-12 flex items-center justify-between backdrop-blur-md bg-[var(--background)]/80 border-b border-[var(--border-subtle)] transition-colors duration-300 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <span className="font-display font-extrabold text-sm tracking-tighter uppercase text-[var(--text-primary)]">
            EW Studio
          </span>
        </div>
        
        <div className="hidden md:block font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
          {time}
        </div>

        <div className="hidden md:flex items-center gap-8 font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
          <a href="#top" className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">Home</a>
          <a href="#proof" className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">Case Studies</a>
          <a href="#scale" className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">Experience</a>
          <a href="#contact" className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Day / Night Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "Day" : "Night"} mode`}
            title={`Switch to ${theme === "dark" ? "Day" : "Night"} mode`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface-2)] text-[var(--text-primary)] hover:bg-[var(--surface-3)] font-mono text-[10px] uppercase tracking-wider transition-all font-bold border border-[var(--border)] group cursor-pointer shadow-sm active:scale-95"
          >
            <div className="relative w-3.5 h-3.5 flex items-center justify-center">
              {mounted && theme === "dark" ? (
                <Moon className="w-3.5 h-3.5 text-amber-300 transition-transform duration-300 group-hover:-rotate-12" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-500 transition-transform duration-300 group-hover:rotate-45" />
              )}
            </div>
            <span className="hidden sm:inline">
              {mounted ? (theme === "dark" ? "Night" : "Day") : "Theme"}
            </span>
          </button>

          <a
            href="https://github.com/emwil23"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:opacity-90 font-mono text-[10px] uppercase tracking-widest transition-all font-bold shadow-sm"
          >
            <span>GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/ewilly/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[var(--surface-2)] text-[var(--text-primary)] hover:bg-[var(--surface-3)] font-mono text-[10px] uppercase tracking-widest transition-all font-bold border border-[var(--border)] shadow-sm"
          >
            <span>LinkedIn</span>
          </a>
        </div>
      </motion.nav>

      {/* Center Character Canvas */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      >
        <div className="relative w-full max-w-[900px] h-[85vh] flex items-center justify-center -mt-6">
          {/* Studio Floor Shadow */}
          <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[42%] h-[22px] bg-slate-900/15 dark:bg-black/50 blur-2xl rounded-full transition-colors duration-500" />
          
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          >
            <source src="/assets/character-coffee-v3.webm" type="video/webm" />
            <source src="/assets/character-coffee-v3.mp4" type='video/mp4; codecs="hvc1"' />
          </video>
        </div>
      </motion.div>

      {/* Foreground Content HUD */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 z-20 pointer-events-none">
        <div className="flex flex-col md:flex-row items-end justify-between w-full gap-8">
          
          {/* Bottom Left: Huge Headline */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 max-w-3xl pointer-events-auto"
          >
            <h1 className="font-display font-extrabold text-[13vw] sm:text-[10vw] xl:text-[140px] leading-[0.8] tracking-[-0.03em] uppercase text-[var(--text-primary)] transition-colors duration-300">
              EMMANUEL <br/> WILSON
            </h1>
            <div className="mt-6 md:mt-8 font-mono text-xs sm:text-sm uppercase tracking-widest text-[var(--text-muted)] border-l-2 border-[var(--accent)] pl-4 max-w-md leading-relaxed transition-colors duration-300">
              AI-First Full-Stack & Frontend Systems Engineer.
            </div>
          </motion.div>

          {/* Bottom Right: Telemetry HUD */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-5 pointer-events-auto max-w-[340px] shrink-0 mb-2 md:mb-6"
          >
            <div className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-widest flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--accent)]"></span>
              </span>
              Telemetry HUD // Engineering Impact
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="group bg-[var(--surface-1)]/80 dark:bg-[var(--surface-1)]/40 backdrop-blur-md border border-[var(--border)] p-4 rounded-xl hover:border-[var(--accent)] transition-all shadow-md dark:shadow-lg">
                <div className="text-[var(--text-primary)] font-sans text-sm leading-snug">
                  Scaled enterprise platforms for <span className="text-[var(--accent)] dark:text-[var(--accent-hover)] font-bold">150K–200K DAU</span>.
                </div>
              </div>
              
              <div className="group bg-[var(--surface-1)]/80 dark:bg-[var(--surface-1)]/40 backdrop-blur-md border border-[var(--border)] p-4 rounded-xl hover:border-[var(--accent)] transition-all shadow-md dark:shadow-lg">
                <div className="text-[var(--text-primary)] font-sans text-sm leading-snug">
                  Slashed production bundle footprints by <span className="text-[var(--accent)] dark:text-[var(--accent-hover)] font-bold">60%</span> via a unified React and Vite migration.
                </div>
              </div>

              <div className="group bg-[var(--surface-1)]/80 dark:bg-[var(--surface-1)]/40 backdrop-blur-md border border-[var(--border)] p-4 rounded-xl hover:border-[var(--accent)] transition-all shadow-md dark:shadow-lg">
                <div className="text-[var(--text-primary)] font-sans text-sm leading-snug">
                  Accelerated personal programming velocity by <span className="text-[var(--accent)] dark:text-[var(--accent-hover)] font-bold">up to 5x</span> using LLMs and AI workflows.
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
};
