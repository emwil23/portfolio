"use client";

import React from "react";
import { Interlude } from "@/components/Interlude";
import { Turnaround } from "@/components/Turnaround";

interface Chapter {
  scene: string;
  step: string;
  title: string;
  body: string;
  spec: string;
}

// Each chapter names its camera stop in components/Stage.tsx.
const CHAPTERS: Chapter[] = [
  {
    scene: "fly",
    step: "Case study 01 · This website",
    title: "He isn't a 3D model.",
    body: "The character who watches your cursor is 55 video frames, five short clips and a little trigonometry. This is how he was made, start to finish.",
    spec: "Scroll to turn him round",
  },
  {
    scene: "green",
    step: "01 · Source",
    title: "Shoot it on green.",
    body: "Every clip starts from one master image, animated in Google Flow against a flat green wall: 720 × 1280, 24 frames a second, six seconds each. Green, because nothing he wears is.",
    spec: "04-look-circle.mp4 · 144 frames",
  },
  {
    scene: "key",
    step: "02 · Key",
    title: "Take the wall away.",
    body: "ffmpeg removes the green. The obvious filter, chromakey, ignores brightness and ate his black sweater, so the key measures plain RGB distance instead, kept tight enough that the beard stays solid. The wipe you are scrolling is the same maths, running in a shader.",
    spec: "colorkey=0x109757:0.12:0.06,despill=type=green",
  },
  {
    scene: "sprite",
    step: "03 · Sprite",
    title: "One slow look around, cut into frames.",
    body: "In a single clip he turns away from the camera, then sweeps his gaze through a full circle. Every second frame goes into one image: one pose facing you, 12 turning away, 42 around the ring.",
    spec: "look.webp · 8 × 7 cells",
  },
  {
    scene: "follow",
    step: "04 · Follow",
    title: "The angle of your cursor picks the frame.",
    body: "Move the pointer around him. Its angle maps to a place on the ring, and he gets there through the real frames in between, the short way round. Nothing is blended or generated on the fly, so nothing smears.",
    spec: "atan2(dy, dx) → cell 13…54",
  },
  {
    scene: "out",
    step: "05 · Rest",
    title: "Stop moving and he comes back to life.",
    body: "After 1.6 seconds of stillness he returns to the camera, and a looping clip takes over from the very same pose: breathing, shifting his weight. Move again and the frames pick up where the film left off.",
    spec: "idle.webm · VP9 with alpha, HEVC for Safari",
  },
];

const STATS = [
  ["55", "frames"],
  ["5", "clips"],
  ["2", "codecs"],
  ["0", "3D models"],
];

export const Story: React.FC = () => (
  <section id="making" aria-label="Case study: how this website was made" className="relative">
    {CHAPTERS.map((chapter, index) => {
      const last = index === CHAPTERS.length - 1;
      return (
        <Interlude
          key={chapter.scene}
          {...chapter}
          character={last ? "idle" : undefined}
          // He opens the story by turning all the way round as you scroll
          figure={index === 0 && <Turnaround className="mx-auto h-[42vh] drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)] md:h-[74vh]" />}
        >
          {last && (
            <ul className="mt-8 grid grid-cols-4 gap-3 border-t border-[var(--border)] pt-5">
              {STATS.map(([value, label]) => (
                <li key={label}>
                  <span className="block font-display text-2xl font-extrabold text-[var(--text-primary)] sm:text-3xl">{value}</span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)]">{label}</span>
                </li>
              ))}
            </ul>
          )}
        </Interlude>
      );
    })}
  </section>
);
