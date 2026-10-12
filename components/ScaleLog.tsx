"use client";

import React, { useState } from "react";
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
  FileCode2,
  ShieldCheck,
  Database,
  Server,
  HardDrive,
  Layers,
  Lock
} from "lucide-react";

interface InvariantPillar {
  id: string;
  category: "database" | "security" | "reliability" | "frontend";
  categoryLabel: string;
  badge: string;
  title: string;
  invariant: string;
  problem: string;
  solution: string;
  metric: string;
  pattern: string;
  icon: React.ElementType;
}

const SDE2_INVARIANTS: InvariantPillar[] = [
  {
    id: "cursor-memory",
    category: "database",
    categoryLabel: "Database & Memory",
    badge: "Memory Bounding // Cursors",
    title: "Server-Side Cursor Streaming",
    invariant: "Bounded O(1) memory footprint during massive background attendance evaluations.",
    problem: "Batch attendance analytics jobs evaluated unpaginated ORM QuerySets across tens of thousands of employee punch logs, ballooning worker process memory past 1.2 GB and triggering Kubernetes OOMKilled restarts during peak morning load.",
    solution: "Replaced eager ORM evaluations with PostgreSQL server-side cursor streaming (.iterator(chunk_size=1000)) and batched per-company query aggregations, ensuring records are streamed and discarded incrementally.",
    metric: "1,280 MB down to 24 MB peak memory (-98% reduction)",
    pattern: "Django/PostgreSQL iterator() chunking",
    icon: HardDrive
  },
  {
    id: "tenant-isolation",
    category: "security",
    categoryLabel: "Multi-Tenant Security",
    badge: "Security // Tenant Boundary",
    title: "Multi-Tenant Predicate Enforcement",
    invariant: "Complete multi-tenant data containment with zero cross-tenant IDOR leakage.",
    problem: "Directory export utilities and file manager lookups relied on caller-supplied IDs without strict compile-time tenant scoping, creating severe cross-tenant information exposure risks if endpoints omitted company filters.",
    solution: "Enforced structural tenant scoping predicates (acting_company_id UUID lookups) in the data-access layer independent of call shape, fortified with automated test suites validating null/invalid tenant contexts and XSS output escaping.",
    metric: "100% tenant boundary coverage · 0 cross-tenant data leaks",
    pattern: "Tenant predicate scoping & structural assertions",
    icon: ShieldCheck
  },
  {
    id: "query-optimization",
    category: "database",
    categoryLabel: "Database & Memory",
    badge: "Database Scalability // N+1",
    title: "Batch Relational Query Optimization",
    invariant: "Constant O(1) query budgets on batch payroll, appraisals, and EMI settlements.",
    problem: "Sequential employee-by-employee loop queries across payroll runs, performance appraisal grids, and loan deductions generated thousands of TCP roundtrips, exhausting connection pools and causing 504 gateway timeouts.",
    solution: "Hoisted shared configurations, pre-materialized tenant company sets, and converted iterative loops into single read-replica bulk prefetches with in-memory hash index joining and chunked batch status updates.",
    metric: "-99.7% database queries (1,000+ down to 3 queries)",
    pattern: "Read-replica prefetch & in-memory hash joins",
    icon: Database
  },
  {
    id: "async-telemetry",
    category: "reliability",
    categoryLabel: "Reliability & Queues",
    badge: "Distributed Messaging // Zero-Loss",
    title: "Resilient Asynchronous Ingestion Pipeline",
    invariant: "Zero dropped audit rows during broker network partitions or service restarts.",
    problem: "Synchronous request logging blocked API response cycles, while ephemeral network blips or broker connection resets permanently dropped critical compliance audit logs during peak traffic windows.",
    solution: "Decoupled logging into an asynchronous RabbitMQ queue (request_queue) with direct primary database routing and an immediate single-retry publisher fallback to survive transient broker resets without dropping rows.",
    metric: "0 dropped audit records · <4ms async dispatch overhead",
    pattern: "Async queue with immediate connection retry fallback",
    icon: Server
  },
  {
    id: "sod-invariants",
    category: "security",
    categoryLabel: "Multi-Tenant Security",
    badge: "Compliance // Separation of Duties",
    title: "Non-Bypassable Authority Invariants",
    invariant: "Strict Separation of Duties (SoD) and deterministic distributed cache invalidation.",
    problem: "Privileged administrator roles previously permitted self-approval of personal expense claims and leave balances; concurrently, cached employee dashboards displayed stale entitlement counts after administrative policy revisions.",
    solution: "Engineered hard backend authority invariants strictly prohibiting users (including super-admins) from approving their own requests, paired with event-driven cache invalidation hooks that purge dashboard caches immediately upon policy rule mutation.",
    metric: "Zero compliance discrepancies · Immediate cache consistency",
    pattern: "Domain authority locks & policy cache invalidation",
    icon: Lock
  },
  {
    id: "frontend-containment",
    category: "frontend",
    categoryLabel: "Frontend Systems",
    badge: "Frontend Systems // Sub-Pixel Stability",
    title: "Sticky Table Containment & Blob Streaming",
    invariant: "Zero layout clipping and reliable binary streaming for large client datasets.",
    problem: "High-density data tables suffered from modal field clipping under sticky headers and sub-pixel misalignment across Safari/WebKit vs Chromium; large CSV exports crashed browsers by loading raw JSON error bodies.",
    solution: "Pinned sticky table headers to parent padding edges with sub-pixel margin containment, resolving modal intersection. Replaced brittle client-side data URLs with streaming binary blob handling, graceful toast feedback, and bulk row selection states.",
    metric: "Sub-1.5ms frame pacing · Zero uncaught download exceptions",
    pattern: "Padding-edge sticky containment & binary blob handling",
    icon: Layers
  }
];

export const ScaleLog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  return (
    <section id="scale" className="relative w-full py-28 px-6 sm:px-12 overflow-hidden">
      {/* Background Ambience */}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          
          {/* 1. Kredily Card */}
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
                  <div className="font-mono text-xs text-[var(--accent)] mt-1 font-semibold flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>Software Development Engineer</span>
                    <span className="text-[var(--text-subtle)]">•</span>
                    <span className="text-[var(--text-muted)] font-normal">Jan 2023 – Sept 2026</span>
                  </div>
                  <p className="font-mono text-[11px] text-[var(--text-muted)] mt-1 uppercase tracking-wider">
                    Enterprise Workforce &amp; Payroll Platform
                  </p>
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

          {/* 2. ForeignAdmits Card */}
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
                    ForeignAdmits
                  </h3>
                  <div className="font-mono text-xs text-[var(--accent)] mt-1 font-semibold flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>Frontend Software Engineer</span>
                    <span className="text-[var(--text-subtle)]">•</span>
                    <span className="text-[var(--text-muted)] font-normal">Dec 2021 – Oct 2022</span>
                  </div>
                  <p className="font-mono text-[11px] text-[var(--text-muted)] mt-1 uppercase tracking-wider">
                    Global Admissions &amp; EdTech Infrastructure
                  </p>
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
        {/* 2. SDE 2 SYSTEMS ENGINEERING INVARIANTS (NON-AI FOUNDATIONS) */}
        {/* ========================================================================= */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[var(--border-subtle)]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-bg)] border border-[var(--accent)]/30 text-[var(--accent-hover)] font-mono text-[10px] uppercase tracking-widest mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SDE 2 Core Competencies // Systems Depth</span>
              </div>
              <h3 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] uppercase tracking-tight">
                Architectural Invariants & Systems Discipline
              </h3>
              <p className="text-[var(--text-muted)] font-sans text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                Key production engineering challenges solved across distributed backends and multi-tenant architectures: memory bounding, tenant isolation, database query optimizations, and message queue failover.
              </p>
            </div>

            {/* Invariant Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[var(--surface-2)] p-1.5 rounded-xl border border-[var(--border)] shrink-0 font-mono text-xs">
              {[
                { id: "all", label: "All Invariants" },
                { id: "database", label: "Database & Memory" },
                { id: "security", label: "Multi-Tenant Security" },
                { id: "reliability", label: "Reliability & Queues" },
                { id: "frontend", label: "Frontend Systems" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedCategory === tab.id
                      ? "bg-[var(--accent)] text-white font-bold shadow-sm"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Invariants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SDE2_INVARIANTS.filter(inv => selectedCategory === "all" || inv.category === selectedCategory).map((inv) => {
              const Icon = inv.icon;
              return (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 rounded-2xl bg-[var(--surface-1)]/80 border border-[var(--border)] hover:border-[var(--accent)] transition-all flex flex-col justify-between shadow-lg group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 rounded-full blur-2xl pointer-events-none" />

                  <div>
                    {/* Badge & Icon */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="font-mono text-[10px] text-[var(--accent-hover)] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-[var(--accent-bg)] border border-[var(--accent)]/20 truncate">
                        {inv.badge}
                      </span>
                      <div className="p-1.5 rounded-lg bg-[var(--surface-2)] text-[var(--accent)] shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <h4 className="font-display font-bold text-lg text-[var(--text-primary)] tracking-tight mb-2">
                      {inv.title}
                    </h4>

                    {/* Invariant Statement */}
                    <div className="p-3 rounded-lg bg-[var(--surface-2)]/60 border border-[var(--border-subtle)] font-mono text-[11px] text-[var(--text-primary)] mb-4">
                      <strong className="text-[var(--accent)] block text-[10px] uppercase tracking-wider mb-0.5">Core Invariant:</strong>
                      {inv.invariant}
                    </div>

                    {/* Challenge & Solution */}
                    <div className="space-y-3 font-sans text-xs text-[var(--text-muted)] leading-relaxed mb-6">
                      <p>
                        <strong className="text-[var(--text-secondary)] font-semibold">Production Challenge:</strong> {inv.problem}
                      </p>
                      <p>
                        <strong className="text-[var(--text-secondary)] font-semibold">Engineered Solution:</strong> {inv.solution}
                      </p>
                    </div>
                  </div>

                  {/* Impact & Pattern Footer */}
                  <div className="pt-4 border-t border-[var(--border-subtle)] space-y-2 font-mono">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[var(--text-muted)] uppercase text-[10px]">Impact:</span>
                      <span className="text-[var(--success)] font-bold text-right truncate pl-2">{inv.metric}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[var(--text-subtle)]">
                      <span className="uppercase">Pattern:</span>
                      <span className="text-[var(--text-primary)] truncate pl-2">{inv.pattern}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
              <span className="text-xl font-extrabold text-[var(--warm-light)]">10x</span>
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
