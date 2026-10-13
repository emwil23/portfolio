"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gamepad2 } from "lucide-react";

interface GameRealm {
  /** The pose in public/assets/player/ */
  pose: string;
  title: string;
  game: string;
  alt: string;
  badge: string;
  lesson: string;
  takeaway: string;
}

const GAME_REALMS: GameRealm[] = [
  {
    pose: "night",
    title: "Night City horizons",
    game: "Cyberpunk 2077",
    alt: "Emmanuel's character in a neon-piped jacket, looking up at a skyline",
    badge: "Systemic scale",
    lesson: "A living reminder of how complex systems cooperate under the hood. Thousands of asynchronous routines create the illusion of a seamless world.",
    takeaway: "Always check the view from the edge of the city. And pet the rooftop cat."
  },
  {
    pose: "squad",
    title: "Alpine squad insertion",
    game: "Modern Warfare & Warzone",
    alt: "Emmanuel's character in a headset and utility vest, pointing as he calls out",
    badge: "Squad telemetry",
    lesson: "Squad operations teach you what distributed systems crave most: zero-latency communication, crisp protocols, and zero panic when the zone collapses.",
    takeaway: "Incident bridges run on the same muscle memory as endgame rotations."
  },
  {
    pose: "site",
    title: "Radiant site defense",
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

const kicker = "font-mono text-[10px] uppercase tracking-widest text-purple-600 dark:text-purple-400";
const corner = "absolute h-5 w-5 border-purple-500 dark:border-purple-400";
const rise = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { amount: 0.4, once: true },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

/** He stands inside a select box in the kit of whichever pose is active; the others wait, already loaded. */
const Player: React.FC<{ poses: { pose: string; alt: string }[]; active: number; label: string; tag: string }> = ({ poses, active, label, tag }) => (
  <motion.figure {...rise} className="relative mx-auto aspect-[768/1376] h-[38vh] md:h-[74vh]">
    {poses.map(({ pose, alt }, index) => (
      // eslint-disable-next-line @next/next/no-img-element -- images are unoptimized in this static export
      <img
        key={pose}
        src={`/assets/player/${pose}.webp`}
        alt={index === active ? alt : ""}
        aria-hidden={index !== active}
        width={768}
        height={1376}
        loading="lazy"
        className={`absolute inset-0 h-full w-full transition-[opacity,transform] duration-500 ease-out drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)] ${
          index === active ? "opacity-100" : "translate-y-3 scale-[0.98] opacity-0"
        }`}
      />
    ))}
    <div aria-hidden="true" className="absolute -inset-x-[12%] inset-y-0">
      <span className={`${corner} left-0 top-0 border-l border-t`} />
      <span className={`${corner} right-0 top-0 border-r border-t`} />
      <span className={`${corner} bottom-0 left-0 border-b border-l`} />
      <span className={`${corner} bottom-0 right-0 border-b border-r`} />
    </div>
    <figcaption className="absolute -inset-x-[12%] -bottom-6 flex justify-between gap-4 font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)] sm:text-[10px]">
      <span>{label}</span>
      <span className="text-right text-purple-600 dark:text-purple-400">{tag}</span>
    </figcaption>
  </motion.figure>
);

export const PlayerOne: React.FC = () => {
  // The world whose card was last hovered, focused or tapped: he changes into its kit
  const [world, setWorld] = useState(0);
  const realm = GAME_REALMS[world];

  return (
    <section
      id="sanctuary"
      aria-label="Player 1: the gaming corner"
      className="relative border-y border-purple-500/20 bg-[radial-gradient(ellipse_at_70%_25%,rgba(168,85,247,0.16),transparent_60%),radial-gradient(ellipse_at_20%_85%,rgba(168,85,247,0.10),transparent_55%)] px-4 sm:px-12"
    >
      {/* Screen 1: pick a world. The stage's camera stops here, then flies on through the gems during screen 2 */}
      <div data-chapter="player" className="mx-auto grid max-w-7xl items-center gap-x-12 gap-y-10 py-24 md:min-h-screen md:grid-cols-2">
        <motion.div {...rise} className="md:self-end">
          <p className={`${kicker} flex items-center gap-2`}>
            <Gamepad2 className="h-3.5 w-3.5" />
            Chapter 03 · Player 1
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-[var(--text-primary)] sm:text-5xl">
            When the terminal closes.
          </h2>
          <p className="mt-4 max-w-md font-sans text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            Three worlds, and what each one taught me about systems. Pick one.
          </p>
        </motion.div>

        <div className="md:col-start-2 md:row-span-2 md:row-start-1">
          <Player poses={GAME_REALMS} active={world} label={realm.game} tag={`World 0${world + 1} / 0${GAME_REALMS.length}`} />
        </div>

        <motion.ul {...rise} className="flex flex-col gap-3 md:self-start">
          {GAME_REALMS.map((item, index) => {
            const active = index === world;
            return (
              <li key={item.pose}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setWorld(index)}
                  onMouseEnter={() => setWorld(index)}
                  onFocus={() => setWorld(index)}
                  className={`block w-full rounded-xl border bg-[color:color-mix(in_srgb,var(--surface-1)_70%,transparent)] px-4 py-3 text-left shadow-md backdrop-blur-md transition-colors ${
                    active ? "border-purple-500 dark:border-purple-400" : "border-[var(--border)]"
                  }`}
                >
                  <span className="flex items-baseline justify-between gap-4">
                    <span className={kicker}>0{index + 1} · {item.game}</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">{item.badge}</span>
                  </span>
                  <span className="mt-1 block font-display text-base font-extrabold uppercase tracking-tight text-[var(--text-primary)] sm:text-lg">{item.title}</span>
                  <AnimatePresence initial={false}>
                    {active && (
                      <motion.span
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="block overflow-hidden"
                      >
                        <span className="mt-2 block font-sans text-sm leading-relaxed text-[var(--text-secondary)]">{item.lesson}</span>
                        <span className="mt-2 block font-mono text-[11px] text-[var(--text-muted)]">&gt; {item.takeaway}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </li>
            );
          })}
        </motion.ul>
      </div>

      {/* Screen 2: the desk, and why any of it matters */}
      <div className="mx-auto grid max-w-7xl items-center gap-x-12 gap-y-10 pb-28 pt-8 md:min-h-[90vh] md:grid-cols-2">
        <Player
          poses={[{ pose: "station", alt: "Emmanuel's character in a gaming chair, headset on, controller in hand" }]}
          active={0}
          label="Station · Nocturne & coffee"
          tag="Online"
        />
        <motion.div {...rise}>
          <p className={kicker}>The station</p>
          <h3 className="mt-3 font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Crafted for flow and focus.
          </h3>
          <p className="mt-4 max-w-md font-sans text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            Where high-volume distributed code meets midnight exploration, built for unbroken concentration.
          </p>
          <ul className="mt-8 grid max-w-md grid-cols-4 gap-3 border-t border-[var(--border)] pt-5">
            {RIG.map(([value, label]) => (
              <li key={label}>
                <span className="block font-display text-xl font-extrabold text-[var(--text-primary)] sm:text-2xl">{value}</span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)]">{label}</span>
              </li>
            ))}
          </ul>
          <blockquote className="mt-8 max-w-md border-l-2 border-purple-500 pl-4 font-sans text-sm leading-relaxed text-[var(--text-secondary)] dark:border-purple-400 sm:text-base">
            <strong className="block font-display text-lg font-extrabold uppercase tracking-tight text-[var(--text-primary)]">Software is an act of care.</strong>
            Under every thousand concurrent transactions is a real person trying to get work done and go home. Zero latency is respect for their time.
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
};
