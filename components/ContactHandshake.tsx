"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowUpRight, Check, Copy, FileDown, MapPin } from "lucide-react";
import { Character, type CharacterAction } from "@/components/Character";

const EMAIL = "emmanuel_work@icloud.com";

interface Channel {
  kicker: string;
  title: string;
  href: string;
  /** Saves the file under this name instead of opening a new tab */
  download?: string;
  /** What he does, and says, when the pointer or focus reaches this channel */
  gesture: CharacterAction;
  say: string;
}

const CHANNELS: Channel[] = [
  { kicker: "01 · Email", title: EMAIL, href: `mailto:${EMAIL}`, gesture: "handshake", say: "Write to me" },
  { kicker: "02 · Resume · One page, PDF", title: "Download the resume", href: "/assets/Emmanuel_Wilson_Resume.pdf", download: "Emmanuel_Wilson_Resume.pdf", gesture: "present", say: "Take the one-pager" },
  { kicker: "03 · LinkedIn", title: "linkedin.com/in/ewilly", href: "https://www.linkedin.com/in/ewilly/", gesture: "wave", say: "Come say hello" },
  { kicker: "04 · GitHub", title: "github.com/emwil23", href: "https://github.com/emwil23", gesture: "thumbsup", say: "Read the code" },
];

const row =
  "group flex min-w-0 flex-1 items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface-1)_70%,transparent)] px-4 py-3 shadow-md backdrop-blur-md transition-colors hover:border-[var(--key)]";

/** The last chapter: he offers his hand, and the ways to take it are laid out beside him. */
export const ContactHandshake: React.FC = () => {
  const [copied, setCopied] = useState(false);
  // The channel last reached for: he answers each with its own gesture and line
  const [reach, setReach] = useState<{ channel: Channel; id: number } | null>(null);
  const reachFor = (channel: Channel) => setReach((was) => ({ channel, id: (was?.id ?? 0) + 1 }));

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" aria-label="Contact" className="relative px-4 sm:px-12">
      <div data-chapter="shake" className="mx-auto grid max-w-7xl gap-x-12 pt-24 md:min-h-screen md:grid-cols-2 md:pt-0">
        <div className="pointer-events-none relative mx-auto h-[38vh] md:col-start-2 md:row-start-1 md:h-[86vh] md:self-end">
          {/* His spot on the stage: a glow, and two rings turning slowly against each other */}
          <div aria-hidden="true" className="absolute left-1/2 top-[42%] aspect-square h-[78%] -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--key)_22%,transparent),transparent_65%)]" />
            <div className="absolute inset-0 animate-[spin_50s_linear_infinite] rounded-full border border-dashed border-[color:color-mix(in_srgb,var(--key)_55%,transparent)] motion-reduce:animate-none" />
            <div className="absolute inset-[9%] animate-[spin_35s_linear_infinite_reverse] rounded-full border border-[color:color-mix(in_srgb,var(--key)_25%,transparent)] border-t-[var(--key)] motion-reduce:animate-none" />
          </div>
          <Character
            track
            onView="handshake"
            play={reach ? { action: reach.channel.gesture, id: reach.id } : undefined}
            className="h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
          />
          <p aria-hidden="true" className="absolute left-0 top-[14%] -translate-x-[70%] whitespace-nowrap rounded-full border border-[var(--key)] bg-[color:color-mix(in_srgb,var(--surface-1)_80%,transparent)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-[var(--text-primary)] backdrop-blur-md">
            {reach ? reach.channel.say : "Your move"}
          </p>
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
                  onMouseEnter={() => reachFor(channel)}
                  onFocus={() => reachFor(channel)}
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
