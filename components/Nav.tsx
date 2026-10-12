"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import { Sun, Moon, Gamepad2 } from "lucide-react";

const linkClass = "hover:text-[var(--text-primary)] cursor-pointer transition-colors";

/** The fixed top bar, shared by every page, with the scroll-progress line above it. */
export const Nav: React.FC<{ isLoaded?: boolean }> = ({ isLoaded = true }) => {
  const [time, setTime] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();

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
    <>
      <motion.div
        aria-hidden="true"
        style={{ scaleX: scrollYProgress }}
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-[var(--key)]"
      />

      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 inset-x-0 z-40 w-full px-6 py-4 sm:px-12 flex items-center justify-between backdrop-blur-md bg-[var(--background)]/80 border-b border-[var(--border-subtle)] transition-colors duration-300 shadow-sm"
      >
        <Link href="/" className="font-display font-extrabold text-sm tracking-tighter uppercase text-[var(--text-primary)]">
          EW Studio
        </Link>

        <div className="hidden lg:block font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
          {time}
        </div>

        <div className="hidden md:flex items-center gap-7 font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
          <Link href="/" className={linkClass}>Home</Link>
          <Link href="/case-studies/" className={linkClass}>Case Studies</Link>
          <Link href="/#scale" className={linkClass}>Experience</Link>
          <Link href="/#sanctuary" className={`${linkClass} flex items-center gap-1.5 text-purple-400`}>
            <Gamepad2 className="w-3 h-3" />
            <span>Player 1</span>
          </Link>
          <Link href="/#contact" className={linkClass}>Contact</Link>
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

          {/* The section links are hidden below md, so the case studies get a button there */}
          <Link
            href="/case-studies/"
            className="md:hidden flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--key)] text-white dark:text-black font-mono text-[10px] uppercase tracking-widest font-bold shadow-sm"
          >
            Work
          </Link>
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
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[var(--surface-2)] text-[var(--text-primary)] hover:bg-[var(--surface-3)] font-mono text-[10px] uppercase tracking-widest transition-all font-bold border border-[var(--border)] shadow-sm"
          >
            <span>LinkedIn</span>
          </a>
        </div>
      </motion.nav>
    </>
  );
};
