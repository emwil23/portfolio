"use client";

import React from "react";
import { motion } from "framer-motion";
import { Interlude } from "@/components/Interlude";

interface GameRealm {
  /** Names the camera stop in components/Stage.tsx and the pose in public/assets/player/ */
  scene: string;
  title: string;
  game: string;
  alt: string;
  badge: string;
  lesson: string;
  takeaway: string;
}

const GAME_REALMS: GameRealm[] = [
  {
    scene: "night",
    title: "Night City horizons.",
    game: "Cyberpunk 2077",
    alt: "Emmanuel's character in a neon-piped jacket, looking up at a skyline",
    badge: "Systemic scale & simulation",
    lesson: "A living reminder of how complex systems cooperate under the hood. Thousands of asynchronous routines create the illusion of a seamless world.",
    takeaway: "Always check the view from the edge of the city. And pet the rooftop cat."
  },
  {
    scene: "squad",
    title: "Alpine squad insertion.",
    game: "Modern Warfare & Warzone",
    alt: "Emmanuel's character in a headset and utility vest, pointing as he calls out",
    badge: "Sub-second squad telemetry",
    lesson: "High-stakes squad operations teach you what distributed systems crave most: zero-latency communication, crisp protocols, and zero panic when the zone collapses.",
    takeaway: "Incident bridges run on the same muscle memory as endgame rotations."
  },
  {
    scene: "site",
    title: "Radiant site defense.",
    game: "Valorant",
    alt: "Emmanuel's character in an esports jersey, lining up a shot with his fingers",
    badge: "Frame-locked precision",
    lesson: "Pixel-perfect execution. In competitive shooters as in browser rendering, every single frame counts. If you drop frames, you lose the exchange.",
    takeaway: "Crosshair discipline and a 16.6ms frame budget."
  }
];

const RIG = [
  ["1000", "Hz polling"],
  ["144", "fps locked"],
  ["Lo-fi", "on loop"],
  ["Fresh", "coffee"],
];

const corner = "absolute h-5 w-5 border-[var(--key)]";

/** He stands in the stage in that world's kit, inside a select box that closes in around him. */
const Player: React.FC<{ pose: string; alt: string; label: string; tag: string }> = ({ pose, alt, label, tag }) => (
  <motion.figure
    initial="hidden"
    whileInView="shown"
    viewport={{ amount: 0.5 }}
    className="relative mx-auto aspect-[768/1376] h-[36vh] md:h-[78vh]"
  >
    <motion.div
      variants={{ hidden: { opacity: 0, y: 40 }, shown: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="h-full w-full"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- images are unoptimized in this static export */}
      <motion.img
        src={`/assets/player/${pose}.webp`}
        alt={alt}
        width={768}
        height={1376}
        loading="lazy"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="h-full w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
      />
    </motion.div>
    <motion.div
      aria-hidden="true"
      variants={{ hidden: { opacity: 0, scale: 1.18 }, shown: { opacity: 1, scale: 1 } }}
      transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="absolute -inset-x-[12%] inset-y-0"
    >
      <span className={`${corner} left-0 top-0 border-l border-t`} />
      <span className={`${corner} right-0 top-0 border-r border-t`} />
      <span className={`${corner} bottom-0 left-0 border-b border-l`} />
      <span className={`${corner} bottom-0 right-0 border-b border-r`} />
    </motion.div>
    <motion.figcaption
      variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
      transition={{ duration: 0.5, delay: 0.55 }}
      className="absolute -inset-x-[12%] -bottom-6 flex justify-between gap-4 font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)] sm:text-[10px]"
    >
      <span>{label}</span>
      <span className="text-right text-[var(--key)]">{tag}</span>
    </motion.figcaption>
  </motion.figure>
);

export const PlayerOne: React.FC = () => (
  <section id="sanctuary" aria-label="Player 1: beyond the terminal" className="relative">
    <Interlude
      scene="station"
      step="01 · The station"
      title="Crafted for flow and focus."
      body="This is where high-volume distributed code meets midnight exploration. From debugging multi-tenant query locks to wandering vast fantasy landscapes, the desk is built for unbroken concentration."
      figure={<Player pose="station" alt="Emmanuel's character in a gaming chair, headset on, controller in hand" label="Station · Nocturne & coffee" tag="Online" />}
    >
      <ul className="mt-8 grid grid-cols-4 gap-3 border-t border-[var(--border)] pt-5">
        {RIG.map(([value, label]) => (
          <li key={label}>
            <span className="block font-display text-xl font-extrabold text-[var(--text-primary)] sm:text-2xl">{value}</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)]">{label}</span>
          </li>
        ))}
      </ul>
    </Interlude>

    {GAME_REALMS.map((realm, index) => (
      <Interlude
        key={realm.scene}
        scene={realm.scene}
        step={`World 0${index + 1} / 0${GAME_REALMS.length} · ${realm.game}`}
        title={realm.title}
        body={realm.lesson}
        spec={realm.takeaway}
        figure={<Player pose={realm.scene} alt={realm.alt} label={realm.game} tag={realm.badge} />}
      />
    ))}

    <Interlude
      scene="care"
      step="05 · The point"
      title="Software is an act of care."
      body="Underneath every thousand concurrent transactions there is a real person trying to get work done and go home. Clean code, no layout shift and a quiet, instant interface are how an engineer shows consideration. Zero latency is respect for someone else's time."
      spec="18:24 IST · warm coffee, quiet thoughts"
      figure={<Player pose="care" alt="Emmanuel's character holding a mug of coffee" label="Golden hour" tag="Off the clock" />}
    />
  </section>
);
