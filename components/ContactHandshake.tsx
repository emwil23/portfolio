"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Linkedin, 
  Github, 
  FileDown, 
  ArrowUpRight, 
  Copy, 
  Check, 
  MapPin, 
  Clock, 
  ArrowUp,
  Sparkles,
  ShieldCheck
} from "lucide-react";

export const ContactHandshake: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const email = "emmanuel_work@icloud.com";

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section id="contact" className="relative w-full pt-28 pb-16 px-6 sm:px-12 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[var(--accent)]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        
        {/* Availability Badge */}
        <div className="inline-flex flex-wrap items-center gap-3 px-4 py-2 rounded-full bg-[var(--surface-1)] border border-[var(--border)] shadow-lg mb-8">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22C55E]"></span>
          </span>
          <span className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
            Immediate Joiner
          </span>
          <span className="text-[var(--border)]">|</span>
          <span className="font-mono text-xs text-[var(--text-muted)] flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[var(--accent)]" />
            Bangalore, India
          </span>
          <span className="hidden sm:inline-block text-[var(--border)]">|</span>
          <span className="hidden sm:inline-block font-mono text-[11px] text-[var(--accent-hover)] font-medium">
            Available for Senior & Systems Engineering Roles
          </span>
        </div>

        {/* Section Headline */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-[var(--accent)]" />
            <span className="font-mono text-xs text-[var(--accent)] uppercase tracking-widest font-semibold">
              05 // THE RESONANT HANDSHAKE
            </span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-[var(--text-primary)] uppercase tracking-[-0.03em] max-w-4xl leading-[0.9]">
            Let&apos;s Build <br />
            <span className="text-[var(--accent-hover)]">Something Resilient.</span>
          </h2>
          <p className="mt-6 text-[var(--text-muted)] text-base sm:text-lg max-w-2xl font-sans leading-relaxed">
            I am available for engineering roles where concurrency, rendering performance, and systems quality are paramount. Reach out directly or grab my resume below.
          </p>
        </div>

        {/* Action Panel: Resume CTA & Direct Contact Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
          
          {/* 1. Resume Download Card (Prominent CTA) */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-[var(--surface-1)] to-[var(--surface-2)] border border-[var(--border)] flex flex-col justify-between relative overflow-hidden shadow-2xl group hover:border-[var(--accent)] transition-all">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--accent)]/15 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] text-[var(--accent-hover)] uppercase tracking-widest font-semibold">
                  Official Asset // PDF
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--accent-bg)] text-[var(--accent-hover)] border border-[var(--accent)]/30">
                  1-Page Verified
                </span>
              </div>
              <h3 className="font-display font-extrabold text-2xl text-[var(--text-primary)] uppercase tracking-tight">
                Single-Page Resume
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-sans mt-2 leading-relaxed">
                Concise overview of frontend systems architecture, impact metrics, technical toolchains, and work history.
              </p>
            </div>

            <div className="mt-8">
              <a
                href="/assets/Emmanuel_Wilson_Resume.pdf"
                download="Emmanuel_Wilson_Resume.pdf"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:bg-[var(--surface-3)] hover:text-[var(--text-primary)] font-mono text-xs uppercase tracking-wider font-extrabold shadow-lg transition-all group-hover:scale-[1.02]"
              >
                <FileDown className="w-4 h-4" />
                <span>Download Resume (PDF)</span>
              </a>
            </div>
          </div>

          {/* 2. Direct Email Card */}
          <div className="p-8 rounded-2xl bg-[var(--surface-1)]/70 border border-[var(--border)] backdrop-blur-xl flex flex-col justify-between group hover:border-[var(--accent)] transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-semibold">
                  Primary Dispatch // Email
                </span>
                <Mail className="w-4 h-4 text-[var(--accent)]" />
              </div>
              <h3 className="font-display font-extrabold text-2xl text-[var(--text-primary)] uppercase tracking-tight">
                Get In Touch
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-sans mt-2 leading-relaxed">
                Direct channel for interview requests, technical consultations, or architecture discussions.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <a
                href={`mailto:${email}`}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors truncate"
              >
                <span className="truncate">{email}</span>
                <ArrowUpRight className="w-4 h-4 text-[var(--accent)] shrink-0 ml-2" />
              </a>

              <button
                onClick={handleCopyEmail}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--surface-2)]/60 hover:bg-[var(--surface-2)] border border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-secondary)] transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[var(--success)]" />
                    <span className="text-[var(--success)] font-semibold">Email Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span>Copy Email Address</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3. Professional Social Handles */}
          <div className="p-8 rounded-2xl bg-[var(--surface-1)]/70 border border-[var(--border)] backdrop-blur-xl flex flex-col justify-between group hover:border-[var(--accent)] transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-semibold">
                  Network & Code
                </span>
                <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
              </div>
              <h3 className="font-display font-extrabold text-2xl text-[var(--text-primary)] uppercase tracking-tight">
                Verified Profiles
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-sans mt-2 leading-relaxed">
                Review production commits, open-source repositories, and professional endorsements.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <a
                href="https://www.linkedin.com/in/ewilly/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] hover:border-[var(--accent)] hover:bg-[var(--surface-3)] transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                  <span>linkedin.com/in/ewilly</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)]" />
              </a>

              <a
                href="https://github.com/emwil23"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] hover:border-[var(--accent)] hover:bg-[var(--surface-3)] transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Github className="w-4 h-4 text-[var(--text-primary)]" />
                  <span>github.com/emwil23</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)]" />
              </a>
            </div>
          </div>

        </div>

        {/* Footer Bar */}
        <div className="pt-12 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-[11px] text-[var(--text-muted)]">
          <div className="flex items-center gap-3">
            <span className="font-display font-extrabold text-sm text-[var(--text-primary)] tracking-tighter uppercase">
              Emmanuel Wilson
            </span>
            <span>//</span>
            <span>Frontend & Systems Engineering</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[var(--text-subtle)] hidden md:inline-block">
              Bangalore, India (IST)
            </span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--text-primary)] transition-colors cursor-pointer border border-[var(--border-subtle)]"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
