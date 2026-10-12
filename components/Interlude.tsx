"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Character, type CharacterAction } from "@/components/Character";

/**
 * One beat of the story: a screen that holds still while the 3D stage behind it moves.
 * `scene` names the camera stop in components/Stage.tsx. With `character`, he stands where the
 * stage parks its set-piece and plays that clip each time the beat comes into view.
 */
export const Interlude: React.FC<{
  scene: string;
  id?: string;
  step: string;
  title: string;
  body: string;
  spec?: string;
  character?: CharacterAction | "idle";
  track?: boolean;
  /** Outside links for this beat, such as the live site and the repository. */
  links?: { label: string; href: string }[];
  /** A picture for the side the character would stand on. With a character too, it covers him. */
  figure?: React.ReactNode;
  /** The figure is showing over the character: he fades out, and so does the stage's ring of frames (Stage.tsx reads data-covered). */
  covered?: boolean;
  children?: React.ReactNode;
}> = ({ scene, id, step, title, body, spec, character, track, links, figure, covered, children }) => (
  <div id={id} data-chapter={scene} data-covered={covered || undefined} className="h-[170vh]">
    <div className="sticky top-0 flex h-screen items-end px-4 pb-8 sm:px-12 md:items-center md:pb-0">
      {character && (
        <div className={`pointer-events-none absolute left-1/2 top-[9vh] h-[42vh] -translate-x-1/2 transition-opacity duration-300 md:bottom-0 md:left-[72.5%] md:top-auto md:h-[82vh] ${covered ? "opacity-0" : ""}`}>
          <Character
            track={track}
            onView={character === "idle" ? undefined : character}
            className="h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
          />
        </div>
      )}

      {figure && (
        <div className="pointer-events-none absolute left-1/2 top-[11vh] w-[86vw] max-w-md -translate-x-1/2 md:left-[72.5%] md:top-1/2 md:w-[38vw] md:max-w-none md:-translate-y-1/2">
          {figure}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.6 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md rounded-2xl bg-[var(--background)]/75 p-5 backdrop-blur-md md:bg-transparent md:p-0 md:backdrop-blur-none"
      >
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--key)]">{step}</p>
        <h2 className="mt-3 font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-[var(--text-primary)] sm:text-5xl">
          {title}
        </h2>
        <p className="mt-4 font-sans text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">{body}</p>
        {spec && (
          <p className="mt-5 inline-block max-w-full break-words rounded-md border border-[var(--border)] bg-[var(--surface-1)]/60 px-3 py-1.5 font-mono text-[10px] text-[var(--text-muted)] sm:text-[11px]">
            {spec}
          </p>
        )}
        {links && (
          <ul className="mt-6 flex flex-wrap gap-3">
            {links.map((link, index) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-widest transition-opacity hover:opacity-90 ${
                    index === 0
                      ? "bg-[var(--button-primary-bg)] text-[var(--button-primary-text)]"
                      : "border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)]"
                  }`}
                >
                  {link.label}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
          </ul>
        )}
        {children}
      </motion.div>
    </div>
  </div>
);
