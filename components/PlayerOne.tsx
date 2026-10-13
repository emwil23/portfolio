"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gamepad2, 
  Heart, 
  Coffee, 
  Compass, 
  Sparkles, 
  Monitor, 
  Cpu, 
  Headphones, 
  Zap, 
  ChevronRight, 
  Camera, 
  Sun,
  Crosshair,
  Radio,
  Eye
} from "lucide-react";

interface GameRealm {
  id: string;
  title: string;
  game: string;
  genre: string;
  image: string;
  badge: string;
  tagline: string;
  lesson: string;
  takeaway: string;
}

const GAME_REALMS: GameRealm[] = [
  {
    id: "realm-cyberpunk",
    title: "Night City Horizons",
    game: "Cyberpunk 2077",
    genre: "Immersive Open World / RPG",
    image: "/assets/game-card-1.webp",
    badge: "Systemic Scale & Simulation",
    tagline: "High-tech, low-life, and sprawling data streams.",
    lesson: "A living reminder of how complex systems cooperate under the hood. Thousands of asynchronous routines create the illusion of a seamless world.",
    takeaway: "Always check the view from the edge of the city. And never forget to pet the rooftop cat."
  },
  {
    id: "realm-warzone",
    title: "Alpine Squad Insertion",
    game: "Modern Warfare & Warzone",
    genre: "Tactical Military Action",
    image: "/assets/game-card-2.webp",
    badge: "Sub-Second Squad Telemetry",
    tagline: "Milliseconds, clear callouts, and staying calm under fire.",
    lesson: "High-stakes squad operations teach you what distributed systems crave most: zero-latency communication, crisp protocols, and zero panic when the zone collapses.",
    takeaway: "Production incident bridges run on the exact same muscle memory as clutch endgame rotations."
  },
  {
    id: "realm-valorant",
    title: "Radiant Site Defense",
    game: "Valorant (Ascent Site)",
    genre: "Tactical Precision Duelist",
    image: "/assets/game-card-3.webp",
    badge: "Frame-Locked Precision",
    tagline: "Crosshair discipline and 16.6ms frame budgets.",
    lesson: "Pixel-perfect execution. In competitive shooters as in browser rendering: every single frame counts. If you drop frames, you lose the exchange.",
    takeaway: "Discipline, spatial awareness, and respecting microsecond latencies."
  }
];

export const PlayerOne: React.FC = () => {
  const [selectedRealm, setSelectedRealm] = useState<string>("realm-cyberpunk");

  const currentRealm = GAME_REALMS.find(r => r.id === selectedRealm) || GAME_REALMS[0];

  return (
    <section 
      id="sanctuary" 
      className="relative w-full py-28 px-6 sm:px-12 overflow-hidden"
    >
      {/* Ambient Starlight / Atmosphere Glow */}
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-purple-500/5 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[color:color-mix(in_srgb,var(--warm)_5%,transparent)] blur-[160px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-[var(--accent)]" />
            <span className="font-mono text-xs text-[var(--accent)] uppercase tracking-widest font-semibold flex items-center gap-2">
              <Gamepad2 className="w-3.5 h-3.5" />
              04 // PLAYER 1 · THE SANCTUARY
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-primary)] uppercase tracking-[-0.03em] max-w-4xl">
                Beyond The Terminal
              </h2>
              <p className="mt-4 text-[var(--text-muted)] text-base sm:text-lg max-w-3xl font-sans leading-relaxed">
                Where algorithms sleep and stories begin. An authentic look into the mind behind the architecture: a dedicated gamer, a free spirit by heart, and someone who believes engineering is ultimately an act of human empathy.
              </p>
            </div>

            {/* Quick Status Pill */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--surface-1)] border border-[var(--border)] shadow-sm shrink-0 font-mono text-xs text-[var(--text-muted)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span>LOCKED 144 FPS // LO-FI VIBES</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1. THE COMMAND CENTER: THE GAMER'S DESK */}
        {/* ========================================================================= */}
        <div className="mb-24 p-6 sm:p-10 rounded-3xl bg-[color:color-mix(in_srgb,var(--surface-1)_70%,transparent)] border border-[var(--border)] backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
            
            {/* The Setup Visual */}
            <div className="lg:col-span-7 relative group rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-black/40">
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src="/assets/player1-setup.webp"
                  alt="Emmanuel Wilson - Player 1 Battle Station & Sanctuary"
                  fill
                  priority={false}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* In-Image Atmospheric Tag */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-mono text-[11px] tracking-wider uppercase">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Station: Nocturne &amp; Coffee</span>
              </div>
            </div>

            {/* Rig Philosophy & Telemetry */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-[10px] uppercase tracking-widest mb-4">
                  <Monitor className="w-3.5 h-3.5" />
                  <span>The Battle Station</span>
                </div>
                
                <h3 className="font-display font-black text-2xl sm:text-3xl text-[var(--text-primary)] uppercase tracking-tight">
                  Crafted for Flow &amp; Focus
                </h3>

                <p className="text-[var(--text-secondary)] font-sans text-sm leading-relaxed mt-3">
                  This is where high-volume distributed code meets midnight exploration. From debugging multi-tenant query locks to wandering vast fantasy landscapes, my workstation is designed for unbroken concentration and warm creative energy.
                </p>

                {/* Station Telemetry Badges */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="p-3.5 rounded-xl bg-[color:color-mix(in_srgb,var(--surface-2)_60%,transparent)] border border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--text-muted)] uppercase">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Input Latency</span>
                    </div>
                    <div className="font-display font-extrabold text-base text-[var(--text-primary)] mt-1">
                      1000 Hz Polling
                    </div>
                    <div className="text-[10px] text-[var(--text-subtle)] font-mono mt-0.5">
                      Mechanical switch precision
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[color:color-mix(in_srgb,var(--surface-2)_60%,transparent)] border border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--text-muted)] uppercase">
                      <Cpu className="w-3.5 h-3.5 text-purple-400" />
                      <span>Frame Budget</span>
                    </div>
                    <div className="font-display font-extrabold text-base text-[var(--text-primary)] mt-1">
                      Locked 144+ FPS
                    </div>
                    <div className="text-[10px] text-[var(--text-subtle)] font-mono mt-0.5">
                      Zero stutter, zero tearing
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[color:color-mix(in_srgb,var(--surface-2)_60%,transparent)] border border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--text-muted)] uppercase">
                      <Headphones className="w-3.5 h-3.5 text-blue-400" />
                      <span>Audio Vibe</span>
                    </div>
                    <div className="font-display font-extrabold text-base text-[var(--text-primary)] mt-1">
                      Lo-Fi &amp; Game OSTs
                    </div>
                    <div className="text-[10px] text-[var(--text-subtle)] font-mono mt-0.5">
                      Acoustic &amp; atmospheric
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[color:color-mix(in_srgb,var(--surface-2)_60%,transparent)] border border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--text-muted)] uppercase">
                      <Coffee className="w-3.5 h-3.5 text-[var(--warm)]" />
                      <span>Core Fuel</span>
                    </div>
                    <div className="font-display font-extrabold text-base text-[var(--text-primary)] mt-1">
                      Fresh Brewed
                    </div>
                    <div className="text-[10px] text-[var(--text-subtle)] font-mono mt-0.5">
                      Warm coffee at all hours
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] font-mono text-xs text-[var(--text-muted)] italic">
                &ldquo;Why gaming makes me a sharper engineer: It teaches you to respect frame rates, state machines, and system constraints.&rdquo;
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. THE THREE REALMS: GAMING CODEX */}
        {/* ========================================================================= */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="font-mono text-xs text-[var(--accent)] uppercase tracking-wider font-semibold">
                The Gamer&apos;s Codex
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] uppercase tracking-tight mt-1">
                Virtual Worlds &amp; Systems Lessons
              </h3>
            </div>
            <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-[var(--text-muted)]">
              <span>Click a world to inspect</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GAME_REALMS.map((realm) => {
              const isActive = selectedRealm === realm.id;
              return (
                <div
                  key={realm.id}
                  onClick={() => setSelectedRealm(realm.id)}
                  className={`group cursor-pointer rounded-2xl bg-[color:color-mix(in_srgb,var(--surface-1)_70%,transparent)] border transition-all duration-300 overflow-hidden flex flex-col ${
                    isActive 
                      ? "border-[var(--accent)] ring-1 ring-[color:color-mix(in_srgb,var(--accent)_50%,transparent)] shadow-xl" 
                      : "border-[var(--border)] hover:border-[var(--border-subtle)] hover:bg-[var(--surface-1)]"
                  }`}
                >
                  {/* Card Image */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/40">
                    <Image
                      src={realm.image}
                      alt={realm.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-1)] via-black/20 to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-white font-mono text-[10px] uppercase tracking-wider">
                        {realm.game}
                      </span>
                    </div>

                    <div className="absolute bottom-3 inset-x-3">
                      <div className="font-mono text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                        {realm.badge}
                      </div>
                      <div className="font-display font-extrabold text-lg text-white uppercase tracking-tight mt-0.5">
                        {realm.title}
                      </div>
                    </div>
                  </div>

                  {/* Card Reflection Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed">
                        {realm.lesson}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                      <div className="font-mono text-[11px] text-[var(--accent)] font-medium flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 shrink-0" />
                        <span>{realm.takeaway}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. THE ROMANTIC SOUL: THE POLAROID & SOFT HEART */}
        {/* ========================================================================= */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[var(--surface-1)] via-[color:color-mix(in_srgb,var(--surface-2)_60%,transparent)] to-[var(--surface-1)] border border-[var(--border)] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Polaroid Print Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div 
                whileHover={{ rotate: 0, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative bg-white dark:bg-[#1E1E22] p-4 sm:p-5 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 -rotate-2 max-w-[380px] w-full"
              >
                {/* Visual Photo */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-100 dark:bg-black/50">
                  <Image
                    src="/assets/romantic-polaroid.webp"
                    alt="Emmanuel Wilson - Golden hour coffee and reflections"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-center"
                  />
                  {/* Sun Flare Pill */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                    <Sun className="w-3 h-3" />
                    <span>Golden Hour</span>
                  </div>
                </div>

                {/* Handwritten / Monospace Polaroid Caption */}
                <div className="pt-4 pb-1 text-center">
                  <div className="font-mono text-xs text-neutral-800 dark:text-neutral-200 tracking-wider font-semibold">
                    bengaluru_sunset_cafe.raw
                  </div>
                  <div className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">
                    18:24 IST · Warm coffee, calm water &amp; peaceful thoughts
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Personal Philosophy & The Gentle Heart */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[10px] uppercase tracking-widest mb-4">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>The Gentle Heart · Free In Spirit</span>
              </div>

              <h3 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] uppercase tracking-tight">
                Software is an Act of Care.
              </h3>

              <div className="space-y-4 text-[var(--text-secondary)] font-sans text-sm sm:text-base leading-relaxed mt-4">
                <p>
                  I believe that underneath every thousand concurrent database transactions, there is a real person trying to get work done and go home to their family. 
                </p>
                <p>
                  Writing clean code, removing layout shifts, and crafting quiet, instantaneous interfaces is how an engineer shows genuine consideration. Zero latency is an act of respect for someone else&apos;s time.
                </p>
                <p>
                  Outside the IDE, I am a free-spirited dreamer who loves lingering over a warm cup of coffee, catching sunset reflections across the water, acoustic playlists, and finding warmth in everyday moments.
                </p>
              </div>

              {/* Personality Pills */}
              <div className="flex flex-wrap gap-2.5 mt-8 font-mono text-xs">
                <span className="px-3 py-1.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Free-Spirited Explorer</span>
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-amber-400" />
                  <span>Slow Coffee &amp; Twilight</span>
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>Soft On The Inside</span>
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Romantic Craftsman</span>
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
