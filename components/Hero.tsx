"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { Character } from "@/components/Character";

interface HeroProps {
  isLoaded: boolean;
}

export const Hero: React.FC<HeroProps> = ({ isLoaded }) => {
  // The glimpse card spins once clicked, until the case studies page takes over
  const [opening, setOpening] = useState(false);

  return (
    <header data-chapter="hero" className="relative min-h-screen overflow-hidden">
      {/* Subtle Studio Glow */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      {/* Center Character Canvas */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="relative w-full max-w-[900px] h-[85vh] flex items-center justify-center -mt-6">
          {/* Studio Floor Shadow */}
          <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[42%] h-[22px] bg-slate-900/15 dark:bg-black/50 blur-2xl rounded-full transition-colors duration-500" />
          
          <Character track className="h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]" />
        </div>
      </motion.div>

      {/* Foreground Content HUD */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 pointer-events-none">
        <div className="flex flex-col md:flex-row items-end justify-between w-full gap-8">
          
          {/* Bottom Left: Huge Headline */}
          <div className="flex-1 max-w-3xl pointer-events-auto">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-extrabold text-[13vw] sm:text-[10vw] xl:text-[140px] leading-[0.8] tracking-[-0.03em] uppercase hero-name select-none pointer-events-none"
            >
              EMMANUEL <br/> WILSON
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 md:mt-8 font-mono text-xs sm:text-sm uppercase tracking-widest text-[var(--text-muted)] border-l-2 border-[var(--accent)] pl-4 max-w-lg leading-relaxed transition-colors duration-300"
            >
              Full-Stack &amp; Systems Engineer · Distributed Systems &amp; High-Performance UI · Gamer by Nature.
            </motion.div>
          </div>

          {/* Bottom Right: Telemetry HUD */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-5 pointer-events-auto max-w-[340px] shrink-0 mb-2 md:mb-6"
          >
            {/* A glimpse of the case studies */}
            <Link
              href="/case-studies/"
              onClick={() => setOpening(true)}
              className="group flex items-center gap-4 rounded-xl border border-[color:color-mix(in_srgb,var(--key)_50%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-1)_80%,transparent)] p-3 pr-4 shadow-md backdrop-blur-md transition-all hover:border-[var(--key)] dark:bg-[color:color-mix(in_srgb,var(--surface-1)_40%,transparent)] dark:shadow-lg"
            >
              <span
                aria-hidden="true"
                className="h-16 w-16 shrink-0 rounded-lg bg-[url('/assets/character/green.webp')] bg-[length:230%] bg-[position:50%_9%]"
              />
              <span className="flex-1">
                <span className="block font-mono text-[10px] uppercase tracking-widest text-[var(--key)]">Case studies · 05</span>
                <span className="mt-1 block font-sans text-sm leading-snug text-[var(--text-primary)]">
                  This site, a wedding invitation and three production systems, taken apart.
                </span>
              </span>
              {opening ? (
                <Loader2 aria-label="Opening" className="h-4 w-4 shrink-0 animate-spin text-[var(--key)]" />
              ) : (
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--key)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              )}
            </Link>

            <div className="hidden md:flex font-mono text-[10px] text-[var(--accent)] uppercase tracking-widest items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--accent)]"></span>
              </span>
              Telemetry HUD // Systems Impact
            </div>
            
            <div className="hidden md:flex flex-col gap-3">
              <div className="group bg-[color:color-mix(in_srgb,var(--surface-1)_80%,transparent)] dark:bg-[color:color-mix(in_srgb,var(--surface-1)_40%,transparent)] backdrop-blur-md border border-[var(--border)] p-4 rounded-xl hover:border-[var(--accent)] transition-all shadow-md dark:shadow-lg">
                <div className="text-[var(--text-primary)] font-sans text-sm leading-snug">
                  Scaled multi-tenant platforms serving <span className="text-[var(--accent)] dark:text-[var(--accent-hover)] font-bold">150K–200K DAU</span> with zero downtime.
                </div>
              </div>
              
              <div className="group bg-[color:color-mix(in_srgb,var(--surface-1)_80%,transparent)] dark:bg-[color:color-mix(in_srgb,var(--surface-1)_40%,transparent)] backdrop-blur-md border border-[var(--border)] p-4 rounded-xl hover:border-[var(--accent)] transition-all shadow-md dark:shadow-lg">
                <div className="text-[var(--text-primary)] font-sans text-sm leading-snug">
                  Slashed bundle footprints by <span className="text-[var(--accent)] dark:text-[var(--accent-hover)] font-bold">60%</span> and accelerated HMR cycles by <span className="text-[var(--accent)] dark:text-[var(--accent-hover)] font-bold">8x</span> via unified Vite architecture.
                </div>
              </div>

              <div className="group bg-[color:color-mix(in_srgb,var(--surface-1)_80%,transparent)] dark:bg-[color:color-mix(in_srgb,var(--surface-1)_40%,transparent)] backdrop-blur-md border border-[var(--border)] p-4 rounded-xl hover:border-[var(--accent)] transition-all shadow-md dark:shadow-lg">
                <div className="text-[var(--text-primary)] font-sans text-sm leading-snug">
                  Eliminated <span className="text-[var(--accent)] dark:text-[var(--accent-hover)] font-bold">99.7% of N+1 database queries</span>, boosting batch processing throughput by <span className="text-[var(--accent)] dark:text-[var(--accent-hover)] font-bold">19x</span>.
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </header>
  );
};
