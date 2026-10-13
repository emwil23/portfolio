"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { Gamepad2, Sun } from "lucide-react";

interface GameRealm {
  /** Names his pose (.webp) and the world's backdrop clip (.mp4) in public/assets/player/ */
  pose: string;
  title: string;
  game: string;
  alt: string;
  badge: string;
  /** The colour the whole corner takes on while this world is picked */
  color: string;
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
    color: "#E935C1",
    lesson: "A living reminder of how complex systems cooperate under the hood. Thousands of asynchronous routines create the illusion of a seamless world.",
    takeaway: "Always check the view from the edge of the city. And pet the rooftop cat."
  },
  {
    pose: "creed",
    title: "Leap of faith",
    game: "Assassin's Creed",
    alt: "Emmanuel's character in a white hooded robe and red sash, poised to leap",
    badge: "Read the map first",
    color: "#F59E0B",
    lesson: "Climb to the viewpoint before you move. Synchronise, see the whole map, then take the quiet route. Observability first, and the clean fix beats the loud one.",
    takeaway: "Never jump without a haystack: tests below, and a rollback."
  },
  {
    pose: "site",
    title: "Radiant site defense",
    game: "Valorant & CS2",
    alt: "Emmanuel's character in an esports jersey, lining up a shot with his fingers",
    badge: "Frame-locked precision",
    color: "#FB6A5A",
    lesson: "Pixel-perfect execution. In competitive shooters as in browser rendering, every single frame counts. If you drop frames, you lose the exchange.",
    takeaway: "Crosshair discipline and a 16.6ms frame budget."
  }
];

// The world colour is for the dark theme; on the light one it would not read as text
const worldText = "text-[var(--text-secondary)] transition-colors duration-700 dark:text-[var(--world)]";
const kicker = `font-mono text-[10px] uppercase tracking-widest ${worldText}`;
const corner = "absolute h-5 w-5 border-[var(--world)] transition-colors duration-700";
const rise = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { amount: 0.4, once: true },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

/** A puffy holographic sticker of a print: it leans towards the pointer and its foil catches the light as it turns. Hover, focus or tap it and it steps aside for the words. */
const Photograph: React.FC = () => {
  const [open, setOpen] = useState(false);
  const tiltX = useSpring(useMotionValue(0), { stiffness: 150, damping: 15 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 150, damping: 15 });

  const lean = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    const box = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width;
    const y = (e.clientY - box.top) / box.height;
    tiltY.set((x - 0.5) * 24);
    tiltX.set((0.5 - y) * 24);
    // The foil and the glare (.sticker-foil, .sticker-glare in globals.css) slide with the pointer
    e.currentTarget.style.setProperty("--mx", `${x * 100}%`);
    e.currentTarget.style.setProperty("--my", `${y * 100}%`);
    e.currentTarget.style.setProperty("--shine", "1");
  };
  const settle = (e: React.PointerEvent<HTMLButtonElement>) => {
    tiltX.set(0);
    tiltY.set(0);
    e.currentTarget.style.setProperty("--shine", "0.35");
  };

  return (
    <div className="mx-auto grid max-w-7xl items-center gap-x-12 gap-y-10 px-4 pb-28 pt-20 sm:px-12 md:min-h-[90vh] md:grid-cols-2">
      {/* Until it is opened the print hangs in the middle of the screen (md and up; on a phone the words are always below it) */}
      <div className={`flex justify-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [perspective:1000px] ${open ? "" : "md:translate-x-[55%]"}`}>
        <motion.button
          type="button"
          aria-expanded={open}
          aria-controls="care"
          onClick={() => setOpen(true)}
          onMouseEnter={() => setOpen(true)}
          onFocus={() => setOpen(true)}
          onPointerMove={lean}
          onPointerLeave={settle}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{ rotateX: tiltX, rotateY: tiltY, rotate: -3 }}
          className="sticker relative w-full max-w-[380px] rounded-[28px] bg-white p-4 pb-5 text-left sm:p-5"
        >
          <span className="relative block aspect-square overflow-hidden rounded-2xl bg-neutral-200">
            {/* eslint-disable-next-line @next/next/no-img-element -- images are unoptimized in this static export */}
            <img
              src="/assets/romantic-polaroid.webp"
              alt="Emmanuel's character with a coffee by the water at golden hour"
              width={1254}
              height={1254}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-amber-300 backdrop-blur-md">
              <Sun className="h-3 w-3" />
              Golden hour
            </span>
          </span>
          <span className="block pt-4 text-center font-mono text-xs font-semibold tracking-wider text-neutral-800">bengaluru_sunset_cafe.raw</span>
          <span className="mt-1 block text-center font-mono text-[10px] text-neutral-500">18:24 IST · Warm coffee, calm water &amp; peaceful thoughts</span>
          <span aria-hidden="true" className="sticker-foil" />
          <span aria-hidden="true" className="sticker-glare" />
          <span aria-hidden="true" className={`absolute -bottom-9 left-0 right-0 hidden text-center font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] transition-opacity duration-500 md:block ${open ? "opacity-0" : ""}`}>
            Hover the photograph
          </span>
        </motion.button>
      </div>

      <div id="care" className={`transition-[opacity,transform] delay-150 duration-700 ease-out ${open ? "" : "md:pointer-events-none md:translate-x-10 md:opacity-0"}`}>
        <p className="font-mono text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-400">Off the clock</p>
        <h3 className="mt-3 font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-[var(--text-primary)] sm:text-5xl">
          Software is an act of care.
        </h3>
        <div className="mt-5 max-w-xl space-y-4 font-sans text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
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
      </div>
    </div>
  );
};

export const PlayerOne: React.FC = () => {
  // The world whose card was last hovered, focused or tapped: he changes into its kit and the corner into its colours
  const [world, setWorld] = useState(0);
  const [playing, setPlaying] = useState<boolean[]>([]);
  const realm = GAME_REALMS[world];
  const screen = useRef<HTMLDivElement>(null);
  const clips = useRef<(HTMLVideoElement | null)[]>([]);
  const inView = useInView(screen, { amount: 0.3 });
  const still = useReducedMotion();

  // Only the picked world's clip plays, and only while the screen is in view; none is fetched before that
  useEffect(() => {
    clips.current.forEach((clip, index) => {
      if (!clip) return;
      if (index === world && inView && !still) clip.play().catch(() => {});
      else clip.pause();
    });
  }, [world, inView, still]);

  return (
    <section
      id="sanctuary"
      aria-label="Player 1: the gaming corner"
      style={{ "--world": realm.color } as React.CSSProperties}
      className="relative"
    >
      {/* Screen 1: pick a world. The stage's camera stops here, then flies on through the gems during screen 2 */}
      <div ref={screen} data-chapter="player" className="relative overflow-hidden border-y border-[color:color-mix(in_srgb,var(--world)_30%,transparent)] transition-colors duration-700">
        <div aria-hidden="true" className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_16%,black_80%,transparent)]">
          {GAME_REALMS.map((item, index) => (
            <React.Fragment key={item.pose}>
              <video
                ref={(el) => {
                  clips.current[index] = el;
                }}
                src={`/assets/player/${item.pose}.mp4`}
                muted
                loop
                playsInline
                preload="none"
                onPlaying={() => setPlaying((was) => Object.assign([...was], { [index]: true }))}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${index === world && playing[index] ? "opacity-60" : "opacity-0"}`}
              />
              <div
                style={{ background: `radial-gradient(ellipse at 72% 30%, color-mix(in srgb, ${item.color} 26%, transparent), transparent 62%), radial-gradient(ellipse at 15% 90%, color-mix(in srgb, ${item.color} 14%, transparent), transparent 55%)` }}
                className={`absolute inset-0 transition-opacity duration-1000 ${index === world ? "" : "opacity-0"}`}
              />
            </React.Fragment>
          ))}
          {/* Keeps the words readable over whatever the clip is doing */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[color:color-mix(in_srgb,var(--background)_70%,transparent)] to-transparent" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-x-12 gap-y-10 px-4 py-24 sm:px-12 md:min-h-screen md:grid-cols-2">
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

          <motion.figure {...rise} className="relative mx-auto aspect-[768/1376] h-[38vh] md:col-start-2 md:row-span-2 md:row-start-1 md:h-[74vh]">
            {/* All three poses are mounted, so a kit change never waits on a download */}
            {GAME_REALMS.map((item, index) => (
              // eslint-disable-next-line @next/next/no-img-element -- images are unoptimized in this static export
              <img
                key={item.pose}
                src={`/assets/player/${item.pose}.webp`}
                alt={index === world ? item.alt : ""}
                aria-hidden={index !== world}
                width={768}
                height={1376}
                loading="lazy"
                className={`absolute inset-0 h-full w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)] transition-[opacity,transform] duration-500 ease-out ${
                  index === world ? "" : "translate-y-3 scale-[0.98] opacity-0"
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
              <span>{realm.game}</span>
              <span className={worldText}>World 0{world + 1} / 0{GAME_REALMS.length}</span>
            </figcaption>
          </motion.figure>

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
                    className={`block w-full rounded-xl border bg-[color:color-mix(in_srgb,var(--surface-1)_70%,transparent)] px-4 py-3 text-left shadow-md backdrop-blur-md transition-colors duration-500 ${
                      active ? "border-[var(--world)]" : "border-[var(--border)]"
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
      </div>

      {/* Screen 2: the photograph */}
      <Photograph />
    </section>
  );
};
