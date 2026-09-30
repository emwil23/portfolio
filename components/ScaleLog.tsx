"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  Sparkles, 
  GitMerge, 
  Cpu, 
  CheckCircle2, 
  ArrowUpRight, 
  Zap, 
  Workflow, 
  Rocket, 
  Terminal,
  TrendingUp,
  FileCode2
} from "lucide-react";

export const ScaleLog: React.FC = () => {
  return (
    <section id="scale" className="relative w-full py-28 px-6 sm:px-12 bg-[var(--background)] border-t border-[var(--border)] overflow-hidden transition-colors duration-300">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[600px] h-[500px] bg-[var(--accent)]/5 blur-[180px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-[var(--accent)]" />
            <span className="font-mono text-xs text-[var(--accent)] uppercase tracking-widest font-semibold">
              03 // THE SCALE LOG
            </span>
          </div>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-primary)] uppercase tracking-[-0.03em] max-w-4xl">
            Experience & Engineering Philosophy
          </h2>
          <p className="mt-5 text-[var(--text-muted)] text-base sm:text-lg max-w-2xl font-sans leading-relaxed">
            Standard timelines don't capture systems impact. This log details technical ownership, architectural modernizations, and my AI-first acceleration workflow.
          </p>
        </div>

        {/* Experience Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* 1. Kredily Tenure Card */}
          <div className="p-8 sm:p-10 rounded-2xl bg-[var(--surface-1)]/70 border border-[var(--border)] backdrop-blur-xl relative overflow-hidden flex flex-col justify-between group hover:border-[var(--accent)] transition-all duration-300 shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-bg)] border border-[var(--accent)]/30 text-[var(--accent-hover)] font-mono text-[10px] uppercase tracking-widest mb-3">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Enterprise Scale // 150K–200K DAU</span>
                  </div>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-[var(--text-primary)] uppercase tracking-tight">
                    Kredily
                  </h3>
                  <div className="font-mono text-xs text-[var(--accent)] mt-1">
                    Software Development Engineer
                  </div>
                </div>
              </div>

              <p className="text-[var(--text-secondary)] font-sans text-sm leading-relaxed mb-6">
                Owned critical frontend architecture for India&apos;s leading enterprise payroll and HRMS platform, migrating fragmented legacy codebases and delivering high-cardinality virtualization.
              </p>

              {/* Technical Milestones */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-[var(--accent-bg)] text-[var(--accent-hover)] mt-0.5 shrink-0">
                    <GitMerge className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-[var(--text-primary)] text-sm font-sans font-semibold">Vite Workspace Modernization:</strong>
                    <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5 leading-relaxed">
                      Consolidated multiple legacy frontends into an optimized Vite and React monorepo, slashing production bundle sizes by <span className="text-[var(--text-primary)] font-bold">60%</span> and improving HMR cycle speeds by 8x.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-[var(--accent-bg)] text-[var(--accent-hover)] mt-0.5 shrink-0">
                    <Workflow className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-[var(--text-primary)] text-sm font-sans font-semibold">Modular Design System Architecture:</strong>
                    <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5 leading-relaxed">
                      Architected and rolled out reusable enterprise UI components across all modules, cutting new feature delivery lifecycles by <span className="text-[var(--text-primary)] font-bold">~50%</span> across teams.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-[var(--accent-bg)] text-[var(--accent-hover)] mt-0.5 shrink-0">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-[var(--text-primary)] text-sm font-sans font-semibold">High-Scale Payroll Virtualization:</strong>
                    <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5 leading-relaxed">
                      Implemented AG-Grid with custom windowed row recycling for payroll runs with tens of thousands of employees, achieving locked 60 FPS scrolling and eliminating UI lockups.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-2 pt-6 border-t border-[var(--border-subtle)] font-mono text-[11px] text-[var(--text-muted)]">
              {["React", "TypeScript", "Vite", "AG-Grid", "Tailwind CSS", "Zustand", "Webpack", "REST APIs"].map((tech) => (
                <span key={tech} className="px-2.5 py-1 rounded-md bg-[var(--surface-2)] border border-[var(--border-subtle)]">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* 2. ForeignAdmits Tenure Card */}
          <div className="p-8 sm:p-10 rounded-2xl bg-[var(--surface-1)]/70 border border-[var(--border)] backdrop-blur-xl relative overflow-hidden flex flex-col justify-between group hover:border-[var(--accent)] transition-all duration-300 shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--warm)]/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-bg)] border border-[var(--accent)]/30 text-[var(--accent-hover)] font-mono text-[10px] uppercase tracking-widest mb-3">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>EdTech Infrastructure & CRM</span>
                  </div>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-[var(--text-primary)] uppercase tracking-tight">
                    ForeignAdmits
                  </h3>
                  <div className="font-mono text-xs text-[var(--accent)] mt-1">
                    Frontend Software Engineer
                  </div>
                </div>
              </div>

              <p className="text-[var(--text-secondary)] font-sans text-sm leading-relaxed mb-6">
                Architected foundational Angular applications, schema-driven form engines, and high-velocity internal CRM tools managing thousands of international university applicants.
              </p>

              {/* Technical Milestones */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-[var(--accent-bg)] text-[var(--accent-hover)] mt-0.5 shrink-0">
                    <FileCode2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-[var(--text-primary)] text-sm font-sans font-semibold">Dynamic Formly Schema Engine:</strong>
                    <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5 leading-relaxed">
                      Engineered dynamic JSON schema-driven form systems with Angular and ngx-formly, handling complex multi-step validation logic for visa and admission applications without code changes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-[var(--accent-bg)] text-[var(--accent-hover)] mt-0.5 shrink-0">
                    <Terminal className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-[var(--text-primary)] text-sm font-sans font-semibold">High-Velocity Internal CRM:</strong>
                    <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5 leading-relaxed">
                      Designed and built internal operations dashboards for counsellors, featuring real-time lead routing, document verification pipelines, and sub-second filtering workflows.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-[var(--accent-bg)] text-[var(--accent-hover)] mt-0.5 shrink-0">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-[var(--text-primary)] text-sm font-sans font-semibold">RxJS Reactive State Streams:</strong>
                    <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5 leading-relaxed">
                      Constructed resilient reactive pipelines with RxJS operators, eliminating memory leaks in single-page form transitions and optimizing live search autocomplete latency.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-2 pt-6 border-t border-[var(--border-subtle)] font-mono text-[11px] text-[var(--text-muted)]">
              {["Angular", "TypeScript", "RxJS", "ngx-formly", "SCSS", "REST APIs", "State Management", "CRM Tooling"].map((tech) => (
                <span key={tech} className="px-2.5 py-1 rounded-md bg-[var(--surface-2)] border border-[var(--border-subtle)]">
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. The AI-First Philosophy Manifesto */}
        {/* ========================================================================= */}
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-[var(--surface-1)] via-[var(--surface-2)] to-[var(--surface-1)] border border-[var(--border)] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--accent)]/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-bg)] border border-[var(--accent)]/30 text-[var(--accent-hover)] font-mono text-[10px] uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[var(--warm-light)]" />
                <span>Modern Engineering Workflow</span>
              </div>
              <h3 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] uppercase tracking-tight">
                The AI-First Engineering Manifesto
              </h3>
            </div>

            <div className="flex items-baseline gap-2 font-mono bg-[var(--surface-2)] px-4 py-2 rounded-xl border border-[var(--border)]">
              <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider">Output Velocity:</span>
              <span className="text-xl font-extrabold text-[var(--warm-light)]">Up to 5x</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-[var(--surface-2)]/40 border border-[var(--border-subtle)]">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-1)] border border-[var(--border)] flex items-center justify-center font-mono text-sm text-[var(--accent)] font-bold mb-4">
                01
              </div>
              <h4 className="font-display font-bold text-base text-[var(--text-primary)] uppercase tracking-tight mb-2">
                Speculative Prototyping
              </h4>
              <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed">
                I don&apos;t waste sprint cycles on guessing. I leverage LLM-driven subagents to simulate alternate state models, stress-test API contracts, and evaluate library trade-offs before writing the first production line.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[var(--surface-2)]/40 border border-[var(--border-subtle)]">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-1)] border border-[var(--border)] flex items-center justify-center font-mono text-sm text-[var(--accent)] font-bold mb-4">
                02
              </div>
              <h4 className="font-display font-bold text-base text-[var(--text-primary)] uppercase tracking-tight mb-2">
                Parallel Sub-Task Delegation
              </h4>
              <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed">
                Boilerplate, schema transformations, and test suite permutations are parallelized through localized AI toolchains. My cognitive bandwidth remains 100% focused on system architecture, invariants, and performance budgets.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[var(--surface-2)]/40 border border-[var(--border-subtle)]">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-1)] border border-[var(--border)] flex items-center justify-center font-mono text-sm text-[var(--accent)] font-bold mb-4">
                03
              </div>
              <h4 className="font-display font-bold text-base text-[var(--text-primary)] uppercase tracking-tight mb-2">
                Systems Intuition Over Syntax
              </h4>
              <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed">
                AI is an accelerator, not a crutch. Real scale requires mastery over browser rendering lifecycles, memory leaks, and distributed cache invalidation—foundations that AI cannot intuit without expert human orchestration.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
