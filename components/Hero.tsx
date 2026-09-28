"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { portfolioData } from "@/lib/data";
import { StudioBackground } from "@/components/StudioBackground";
import { 
  ArrowUpRight, 
  Terminal, 
  Layers, 
  Activity, 
  Github, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Code2
} from "lucide-react";

interface HeroProps {
  isLoaded: boolean;
}

export const Hero: React.FC<HeroProps> = ({ isLoaded }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="relative min-h-screen w-full bg-[#18181B] text-[#F9FAFB] overflow-hidden flex flex-col justify-between">
      {/* Background Subtle Grids & Vibrant Violet Radial Lighting */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] bg-radial-glow pointer-events-none" />

      {/* Top Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -12 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-zinc-800/80"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#27272A] border border-zinc-700/70 flex items-center justify-center font-mono text-[#7C3AED] font-bold text-sm shadow-[0_0_15px_rgba(124,58,237,0.25)]">
            EW
          </div>
          <div>
            <span className="font-mono text-xs tracking-wider text-[#F9FAFB] font-semibold uppercase">
              {portfolioData.name}
            </span>
            <span className="hidden sm:inline-block ml-2 text-[11px] font-mono text-zinc-400 border-l border-zinc-700/80 pl-2">
              SDE-2 // DISTRIBUTED ARCHITECTURE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 font-mono text-xs text-zinc-400 bg-[#27272A]/70 px-3 py-1.5 rounded-full border border-zinc-700/70">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7C3AED] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7C3AED]"></span>
            </span>
            <span className="text-[#F9FAFB] font-medium">STATIC SSG • 60 FPS</span>
          </div>

          <a
            href={portfolioData.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] border border-zinc-700 hover:border-[#7C3AED]/50 font-mono text-xs text-[#F9FAFB] transition-all shadow-sm"
          >
            <Github className="w-3.5 h-3.5 text-zinc-300" />
            <span>GitHub</span>
            <ArrowUpRight className="w-3 h-3 text-zinc-400" />
          </a>
        </div>
      </motion.nav>

      {/* Main Hero Container */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-10 pb-16 flex-1 flex flex-col justify-center"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-8 flex flex-col">
            {/* Status Pill Badge */}
            <motion.div variants={itemVariants} className="flex items-center gap-2 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/30 text-[#c4b5fd] text-xs font-mono tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>AVAILABLE FOR SDE-2 ROLES // HIGH-SCALE SYSTEMS</span>
              </div>
            </motion.div>

            {/* Primary Headline */}
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F9FAFB] leading-[1.08]">
                Architecting{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#a78bfa] to-[#c4b5fd]">
                  High-Throughput
                </span>{" "}
                Frontends & Matrix Systems.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl leading-relaxed font-normal">
                {portfolioData.tagline}
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#7C3AED] hover:bg-[#6d28d9] text-white font-semibold text-sm transition-all shadow-[0_0_25px_rgba(124,58,237,0.35)] hover:shadow-[0_0_35px_rgba(124,58,237,0.55)] cursor-pointer"
              >
                <span>Explore Engineering Projects</span>
                <ChevronRight className="w-4 h-4" />
              </a>

              <a
                href={portfolioData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3.5 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] text-[#F9FAFB] border border-zinc-700/80 font-mono text-xs transition-all hover:border-[#7C3AED]/40"
              >
                <Terminal className="w-4 h-4 text-[#7C3AED]" />
                <span>git clone ewilly/portfolio</span>
              </a>
            </motion.div>
          </div>

          {/* Right Column: 3D Character Studio Cyclorama Viewport */}
          <motion.div variants={itemVariants} className="lg:col-span-4 flex justify-center items-center">
            <div className="relative w-full max-w-sm flex flex-col items-center">
              
              {/* Backlight Glow */}
              <div className="absolute inset-0 bg-[#7C3AED]/20 rounded-full blur-3xl pointer-events-none" />

              {/* Main Studio Cyclorama Frame */}
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-zinc-700/80 shadow-2xl group">
                <StudioBackground
                  variant="light"
                  spotlightPosition="center"
                  showFloorShadow={true}
                  showGrain={true}
                  className="h-full flex flex-col justify-between p-4"
                >
                  {/* Top Bar inside Studio Frame */}
                  <div className="flex items-center justify-between font-mono text-[11px] text-zinc-600 bg-white/70 backdrop-blur-md px-3 py-1 rounded-full border border-zinc-300/80 shadow-sm z-20">
                    <span className="font-semibold text-zinc-800">STUDIO COVE</span>
                    <span className="text-[#7C3AED] font-medium">REUSABLE COMPONENT</span>
                  </div>

                  {/* Character Stage */}
                  <div className="relative flex-1 flex items-end justify-center overflow-hidden pb-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/character-sample.png"
                      alt="Emmanuel Wilson 3D Avatar"
                      className="max-h-[92%] object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.18)] transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Footer Tag */}
                  <div className="text-center font-mono text-[10px] text-zinc-500 py-1 bg-white/50 backdrop-blur-sm rounded-lg border border-zinc-200/60 z-20">
                    &lt;StudioBackground variant=&quot;light&quot; /&gt;
                  </div>
                </StudioBackground>
              </div>

              {/* Component Info Chip */}
              <div className="mt-3 flex items-center gap-2 font-mono text-xs text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse" />
                <span>Cyclorama Infinite Cove Backdrop</span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Metric Impact Grid (SDE-2 Proof of Scale) */}
        <motion.div variants={itemVariants} className="mt-16">
          <div className="flex items-center gap-2 mb-4 font-mono text-xs text-zinc-400 uppercase tracking-widest">
            <Activity className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Core Performance & Impact Telemetry</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {portfolioData.heroMetrics.map((metric, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="glass-panel rounded-xl p-5 relative overflow-hidden group transition-all"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#7C3AED]/10 rounded-full blur-2xl group-hover:bg-[#7C3AED]/20 transition-colors pointer-events-none" />
                
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                  <span>{metric.label}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-[#c4b5fd] font-medium border border-zinc-700/60">
                    {metric.context}
                  </span>
                </div>

                <div className="text-3xl font-mono font-bold text-[#F9FAFB] tracking-tight group-hover:text-[#a78bfa] transition-colors">
                  {metric.value}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Project Preview Section */}
        <motion.div variants={itemVariants} id="projects" className="mt-16">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 uppercase tracking-widest">
              <Layers className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Flagship Case Studies (Static Data Layer)</span>
            </div>
            <span className="font-mono text-xs text-zinc-500">
              lib/data.ts • SSG compiled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolioData.projects.map((proj) => (
              <div
                key={proj.id}
                className="glass-panel rounded-xl p-6 flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold text-[#F9FAFB] group-hover:text-[#a78bfa] transition-colors">
                      {proj.title}
                    </h3>
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md bg-[#27272A] hover:bg-[#3F3F46] text-zinc-300 hover:text-white transition-all shrink-0 border border-zinc-700/60"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed font-normal">
                    {proj.summary}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-1.5 pt-4 border-t border-zinc-800">
                  {proj.stack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#27272A] border border-zinc-700/60 text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />
          <span>ZERO-MAINTENANCE STATIC EXPORT // GITHUB PAGES COMPLIANT</span>
        </div>
        <div className="text-zinc-500">
          Rich Zinc (#18181B) • Pristine Off-White (#F9FAFB) • Vibrant Violet (#7C3AED)
        </div>
      </footer>
    </div>
  );
};
