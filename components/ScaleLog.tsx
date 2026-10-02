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
            Experience & Systems Impact
          </h2>
          <p className="mt-5 text-[var(--text-muted)] text-base sm:text-lg max-w-2xl font-sans leading-relaxed">
            Technical ownership, architectural modernizations, and scalable system deliveries across high-concurrency cloud platforms and data-intensive workflows.
          </p>
        </div>

        {/* Experience Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* 1. Enterprise Cloud Platform Card */}
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
                    Enterprise Workforce & Payroll Platform
                  </h3>
                  <div className="font-mono text-xs text-[var(--accent)] mt-1 font-semibold">
                    Software Development Engineer
                  </div>
                </div>
              </div>

              <p className="text-[var(--text-secondary)] font-sans text-sm leading-relaxed mb-6">
                Owned core architecture across multi-tenant payroll engines, autonomous workflow copilot systems, and high-frequency frontend registers serving 150K–200K daily active workforce members.
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
                      Consolidated fragmented legacy frontends into an optimized Vite and React monorepo, slashing production bundle sizes by <span className="text-[var(--text-primary)] font-bold">60%</span> and accelerating dev HMR cycle speeds by 8x.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-[var(--accent-bg)] text-[var(--accent-hover)] mt-0.5 shrink-0">
                    <Workflow className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-[var(--text-primary)] text-sm font-sans font-semibold">Autonomous Copilot & UI Sync:</strong>
                    <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5 leading-relaxed">
                      Architected declarative agent toolchains with strict RBAC authority gates, UI-driving actions, and real-time state synchronization, automating multi-step payroll and statutory filings.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-[var(--accent-bg)] text-[var(--accent-hover)] mt-0.5 shrink-0">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-[var(--text-primary)] text-sm font-sans font-semibold">Distributed N+1 Batch Optimization:</strong>
                    <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5 leading-relaxed">
                      Eliminated cascading database query bottlenecks across batch pay-registers, reducing queries by <span className="text-[var(--text-primary)] font-bold">99.7%</span> and speeding up execution time from 34.2s to 1.8s.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-[var(--accent-bg)] text-[var(--accent-hover)] mt-0.5 shrink-0">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-[var(--text-primary)] text-sm font-sans font-semibold">High-Scale Payroll Virtualization:</strong>
                    <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5 leading-relaxed">
                      Implemented custom windowed row recycling for massive payroll tables with tens of thousands of employees, achieving locked 60 FPS scrolling and zero DOM thrashing.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-2 pt-6 border-t border-[var(--border-subtle)] font-mono text-[11px] text-[var(--text-muted)]">
              {["React", "TypeScript", "Vite", "Python", "FastAPI", "PostgreSQL", "Celery", "AG-Grid", "Tailwind CSS"].map((tech) => (
                <span key={tech} className="px-2.5 py-1 rounded-md bg-[var(--surface-2)] border border-[var(--border-subtle)]">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* 2. Global EdTech Platform Card */}
          <div className="p-8 sm:p-10 rounded-2xl bg-[var(--surface-1)]/70 border border-[var(--border)] backdrop-blur-xl relative overflow-hidden flex flex-col justify-between group hover:border-[var(--accent)] transition-all duration-300 shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--warm)]/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-bg)] border border-[var(--accent)]/30 text-[var(--accent-hover)] font-mono text-[10px] uppercase tracking-widest mb-3">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Global Scale // Operations CRM</span>
                  </div>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-[var(--text-primary)] uppercase tracking-tight">
                    Global Admissions & EdTech Infrastructure
                  </h3>
                  <div className="font-mono text-xs text-[var(--accent)] mt-1 font-semibold">
                    Frontend Software Engineer
                  </div>
                </div>
              </div>

              <p className="text-[var(--text-secondary)] font-sans text-sm leading-relaxed mb-6">
                Architected dynamic JSON schema-driven frontend engines, high-velocity internal CRM tools, and reactive applicant verification workflows handling thousands of international university candidates.
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
                      Engineered dynamic JSON schema-driven form systems with Angular and ngx-formly, handling complex multi-step validation logic for visa and admission applications without code redeployments.
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
                      Constructed resilient reactive pipelines with RxJS operators, eliminating memory leaks across complex application workflows and optimizing live search autocomplete latency.
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
        {/* 3. The Engineering Philosophy */}
        {/* ========================================================================= */}
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-[var(--surface-1)] via-[var(--surface-2)] to-[var(--surface-1)] border border-[var(--border)] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--accent)]/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-bg)] border border-[var(--accent)]/30 text-[var(--accent-hover)] font-mono text-[10px] uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[var(--warm-light)]" />
                <span>Modern Engineering Methodology</span>
              </div>
              <h3 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] uppercase tracking-tight">
                AI-Augmented Engineering Philosophy
              </h3>
            </div>

            <div className="flex items-baseline gap-2 font-mono bg-[var(--surface-2)] px-4 py-2 rounded-xl border border-[var(--border)]">
              <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider">Velocity Multiplier:</span>
              <span className="text-xl font-extrabold text-[var(--warm-light)]">Up to 5x</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-[var(--surface-2)]/40 border border-[var(--border-subtle)]">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-1)] border border-[var(--border)] flex items-center justify-center font-mono text-sm text-[var(--accent)] font-bold mb-4">
                01
              </div>
              <h4 className="font-display font-bold text-base text-[var(--text-primary)] uppercase tracking-tight mb-2">
                Specification-First Architecture
              </h4>
              <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed">
                I leverage LLM-driven subagents to simulate alternate state models, stress-test API contracts, and evaluate library trade-offs before committing the first line of production code.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[var(--surface-2)]/40 border border-[var(--border-subtle)]">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-1)] border border-[var(--border)] flex items-center justify-center font-mono text-sm text-[var(--accent)] font-bold mb-4">
                02
              </div>
              <h4 className="font-display font-bold text-base text-[var(--text-primary)] uppercase tracking-tight mb-2">
                Accelerated Verification & Test Harnesses
              </h4>
              <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed">
                Boilerplate, schema transformations, and test suite permutations are parallelized through localized AI toolchains. My cognitive bandwidth remains focused on system architecture, invariants, and performance budgets.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[var(--surface-2)]/40 border border-[var(--border-subtle)]">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-1)] border border-[var(--border)] flex items-center justify-center font-mono text-sm text-[var(--accent)] font-bold mb-4">
                03
              </div>
              <h4 className="font-display font-bold text-base text-[var(--text-primary)] uppercase tracking-tight mb-2">
                Grounded Systems Depth
              </h4>
              <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed">
                AI is an accelerator, not a crutch. Real scale requires mastery over database query shapes, connection pooling, memory lifecycles, and frame budgets—foundations that AI cannot intuit without expert human orchestration.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
