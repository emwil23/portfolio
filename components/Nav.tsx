"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { Gamepad2, Github, Linkedin, Menu, Moon, Sun, X } from "lucide-react";

const CASE_STUDIES = "case-studies";

// `id` is the section a link points at; the case studies link is a page, not a section
const LINKS = [
  { id: CASE_STUDIES, label: "Case Studies", href: "/case-studies/" },
  { id: "scale", label: "Experience", href: "/#scale" },
  { id: "sanctuary", label: "Player 1", href: "/#sanctuary" },
  { id: "contact", label: "Contact", href: "/#contact" },
];

const pill = "glass pointer-events-auto flex h-12 items-center rounded-full shadow-lg shadow-[var(--shadow)]";

const iconButton =
  "flex h-10 w-10 items-center justify-center rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer active:scale-90";

/** The floating top bar, shared by every page, with the scroll-progress line above it. */
export const Nav: React.FC<{ isLoaded?: boolean }> = ({ isLoaded = true }) => {
  const [time, setTime] = useState("");
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [section, setSection] = useState("");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();

  // Theme and clock are read after mount so the server HTML stays deterministic
  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    const updateTime = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }));
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  // Highlight the section crossing the middle of the viewport
  useEffect(() => {
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
        setSection(LINKS.find((l) => visible.has(l.id))?.id ?? "");
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);

  const active = section || (pathname.startsWith("/case-studies") ? CASE_STUDIES : "");

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("portfolio-theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.classList.toggle("light", nextTheme === "light");
  };

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ scaleX: scrollYProgress }}
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-[var(--key)]"
      />

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-3 sm:top-4 inset-x-0 z-40 px-3 sm:px-6 pointer-events-none"
      >
        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3">
          <Link href="/" className={`${pill} gap-3 pl-4 pr-5`}>
            <span className="font-display font-extrabold text-sm tracking-tighter uppercase whitespace-nowrap text-[var(--text-primary)]">EW Studio</span>
            <span className="hidden sm:flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
              BLR {time}
            </span>
          </Link>

          <nav aria-label="Primary" className={`${pill} hidden md:flex gap-1 px-1.5`}>
            {LINKS.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                aria-current={active === link.id ? (link.id === CASE_STUDIES ? "page" : "true") : undefined}
                className={`relative rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                  active === link.id
                    ? "text-[var(--button-primary-text)]"
                    : link.id === "sanctuary"
                      ? "text-purple-400 hover:text-purple-300"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                {active === link.id && (
                  <motion.span
                    layoutId="nav-active"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-[var(--button-primary-bg)]"
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  {link.id === "sanctuary" && <Gamepad2 className="h-3 w-3" />}
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className={`${pill} gap-0.5 px-1`}>
            {/* Day / Night Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "Day" : "Night"} mode`}
              className={iconButton}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme ?? "none"}
                  initial={{ rotate: -90, scale: 0, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {theme === "light" ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-amber-300" />}
                </motion.span>
              </AnimatePresence>
            </button>
            <a href="https://github.com/emwil23" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={iconButton}>
              <Github className="h-4 w-4" />
            </a>
            <a href="https://www.linkedin.com/in/ewilly/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={iconButton}>
              <Linkedin className="h-4 w-4" />
            </a>
            {/* The section links are hidden below md, so they move into a dropdown there */}
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className={`${iconButton} md:hidden`}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>

          <AnimatePresence>
            {open && (
              <motion.nav
                aria-label="Mobile"
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="pointer-events-auto absolute right-0 top-14 flex w-56 origin-top-right flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-2 shadow-2xl md:hidden"
              >
                {LINKS.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
};
