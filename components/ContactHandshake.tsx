"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUp, ArrowUpRight, Check, Copy, FileDown, MapPin } from "lucide-react";
import { useBoot } from "@/lib/boot";

const EMAIL = "emmanuel_work@icloud.com";

interface Channel {
  kicker: string;
  title: string;
  href: string;
  /** Saves the file under this name instead of opening a new tab */
  download?: string;
}

const CHANNELS: Channel[] = [
  { kicker: "01 · Email", title: EMAIL, href: `mailto:${EMAIL}` },
  { kicker: "02 · Resume · One page, PDF", title: "Download the resume", href: "/assets/Emmanuel_Wilson_Resume.pdf", download: "Emmanuel_Wilson_Resume.pdf" },
  { kicker: "03 · LinkedIn", title: "linkedin.com/in/ewilly", href: "https://www.linkedin.com/in/ewilly/" },
  { kicker: "04 · GitHub", title: "github.com/emwil23", href: "https://github.com/emwil23" },
];

const row =
  "group flex min-w-0 flex-1 items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface-1)_70%,transparent)] px-4 py-3 shadow-md backdrop-blur-md transition-colors hover:border-[var(--key)]";

/** The last chapter: the ways to reach me, with him busy building beside them. */
export const ContactHandshake: React.FC = () => {
  const [copied, setCopied] = useState(false);
  // shortcut: WebKit plays this VP9 clip without its transparency, so Apple browsers keep the still. Add an HEVC-alpha encode (scripts/key-assets.sh, on a Mac) to give them the motion too.
  const [moving, setMoving] = useState(false);
  const [playing, setPlaying] = useState(false);
  const still = useReducedMotion();
  const { ready, lite } = useBoot();
  // The clip is the heaviest file on the site and sits at the very bottom, so it waits until the visitor is near
  const desk = useRef<HTMLDivElement>(null);
  const near = useInView(desk, { once: true, margin: "600px 0px" });
  // Slow connections and phones keep the still too
  useEffect(() => setMoving(near && ready && !lite && !still && !navigator.vendor.includes("Apple")), [near, ready, lite, still]);

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" aria-label="Contact" className="relative px-4 sm:px-12">
      <div data-chapter="shake" className="mx-auto grid max-w-7xl gap-x-12 pt-24 md:min-h-screen md:grid-cols-2 md:pt-0">
        {/* He does not perform for the visitor here: he is at his desk, building, and the clip just loops */}
        <div className="pointer-events-none relative mx-auto w-full max-w-[640px] md:col-start-2 md:row-start-1 md:self-center">
          {/* The desk's legs run off the bottom of the frame, so it fades out instead of ending in a cut */}
          <div ref={desk} className="relative aspect-[800/630] [mask-image:linear-gradient(to_bottom,black_82%,transparent)]">
            {/* The still stands in until the clip is playing, then leaves: both at once would show as a ghost behind him */}
            {/* eslint-disable-next-line @next/next/no-img-element -- images are unoptimized in this static export */}
            <img
              src="/assets/character/desk.webp"
              alt="Emmanuel's character at his desk, coding across two monitors"
              width={800}
              height={630}
              loading="lazy"
              className={`h-full w-full ${playing ? "invisible" : ""}`}
            />
            {moving && (
              <video autoPlay loop muted playsInline aria-hidden="true" onPlaying={() => setPlaying(true)} className="absolute inset-0 h-full w-full">
                <source src="/assets/character/desk.webm" type="video/webm" />
              </video>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3, once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="py-10 md:col-start-1 md:row-start-1 md:self-center md:py-28"
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--key)]">Chapter 04 · The handshake</p>
          <h2 className="mt-3 font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-tight text-[var(--text-primary)] sm:text-7xl">
            Your move.
          </h2>
          <p className="mt-5 max-w-md font-sans text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            That is the story so far. The next chapter could be yours: I am available for engineering roles where concurrency, rendering performance and systems quality matter most.
          </p>
          <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
            <span className="flex items-center gap-2 text-[var(--text-primary)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--key)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--key)]" />
              </span>
              Immediate joiner
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Bangalore, India
            </span>
          </p>

          <ul className="mt-8 flex max-w-xl flex-col gap-3">
            {CHANNELS.map((channel) => (
              <li key={channel.href} className="flex gap-2">
                <a
                  href={channel.href}
                  download={channel.download}
                  {...(channel.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={row}
                >
                  <span className="min-w-0">
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-[var(--key)]">{channel.kicker}</span>
                    <span className="mt-1 block truncate font-display text-base font-extrabold tracking-tight text-[var(--text-primary)] sm:text-lg">{channel.title}</span>
                  </span>
                  {channel.download ? (
                    <FileDown className="h-4 w-4 shrink-0 text-[var(--key)]" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--key)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  )}
                </a>
                {channel.title === EMAIL && (
                  <button
                    type="button"
                    onClick={copyEmail}
                    aria-label={copied ? "Email copied" : "Copy email address"}
                    className="flex w-[52px] shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface-1)_70%,transparent)] shadow-md backdrop-blur-md transition-colors hover:border-[var(--key)]"
                  >
                    {copied ? <Check className="h-4 w-4 text-[var(--key)]" /> : <Copy className="h-4 w-4 text-[var(--text-muted)]" />}
                  </button>
                )}
              </li>
            ))}
          </ul>
          <p aria-live="polite" className="mt-2 h-4 font-mono text-[10px] uppercase tracking-widest text-[var(--key)]">
            {copied && "Email copied to clipboard"}
          </p>
        </motion.div>
      </div>

      <footer className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 border-t border-[var(--border-subtle)] py-8 font-mono text-[11px] text-[var(--text-muted)] sm:flex-row">
        <div className="flex items-center gap-3">
          <span className="font-display text-sm font-extrabold uppercase tracking-tighter text-[var(--text-primary)]">Emmanuel Wilson</span>
          <span>{"//"}</span>
          <span>Frontend &amp; Systems Engineering</span>
        </div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-2)] px-3 py-1.5 text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-3)]"
        >
          <span>Back to top</span>
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
      </footer>
    </section>
  );
};
