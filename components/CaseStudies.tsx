"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, 
  Layers, 
  Zap, 
  Terminal, 
  Server, 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  ArrowRight,
  Code2,
  RefreshCw,
  Gauge,
  MessageSquare,
  BarChart3,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Sparkles,
  Check,
  CheckCheck,
  Clock,
  ArrowUpRight,
  FileText,
  Lock,
  ChevronRight
} from "lucide-react";

// ============================================================================
// 1. DATA STRUCTURES & DEFINITIONS
// ============================================================================

// State Machine Gate definition for Case Study 1
interface WorkflowGate {
  id: string;
  gateNumber: string;
  name: string;
  category: "Ingestion" | "Worker" | "Audit" | "Security" | "Statutory";
  summary: string;
  authorityCheck: string;
  failDirection: "Fail-Closed" | "Fail-Open" | "Halt-For-Approval";
  latency: string;
  specs: string[];
}

const WORKFLOW_GATES: WorkflowGate[] = [
  {
    id: "gate-01",
    gateNumber: "GATE M1",
    name: "Pre-Flight Ingestion & Biometric Sync",
    category: "Ingestion",
    summary: "Scans real-time punch ingestion pipelines, reconciles biometric shifts, and identifies anomaly tickets prior to compute dispatch.",
    authorityCheck: "System Token + Tenant Context Verification",
    failDirection: "Halt-For-Approval",
    latency: "320ms",
    specs: [
      "1,400+ Employee Attendance Match",
      "Honesty Guard against silent 201 errors",
      "Biometric shift boundary verification"
    ]
  },
  {
    id: "gate-02",
    gateNumber: "GATE M2",
    name: "Celery Worker Watcher & Chunked Calc",
    category: "Worker",
    summary: "Asynchronous task orchestration over Celery message queues. Chunks calculation tasks into batches of 10 with peak-load throttling.",
    authorityCheck: "Worker Node Signature + DB Lease Lock",
    failDirection: "Fail-Closed",
    latency: "42s",
    specs: [
      "Chunked x10 batch throttling",
      "Non-blocking status poll watcher",
      "Zero deadlocks via distributed lease"
    ]
  },
  {
    id: "gate-03",
    gateNumber: "GATE M3",
    name: "Variance & Statutory Audit Gate",
    category: "Audit",
    summary: "Deterministic reconciliation comparing current month calculations against historical cycles. Enforces strict <0.5% variance tolerance.",
    authorityCheck: "Statutory Compliance Model Engine",
    failDirection: "Fail-Closed",
    latency: "850ms",
    specs: [
      "PF / ESI / PT rate verification",
      "Net pay anomaly threshold detection",
      "Negative salary & deduction locking"
    ]
  },
  {
    id: "gate-04",
    gateNumber: "GATE M4",
    name: "Executive RBAC Authority Gate",
    category: "Security",
    summary: "Enforces dual-key executive sign-off for sensitive write transactions. Validates stored manager objects and digital signatures.",
    authorityCheck: "Dual HR-Admin + Finance Signing Key",
    failDirection: "Fail-Closed",
    latency: "Instant",
    specs: [
      "Strict RBAC bucket validation",
      "Cryptographic write audit logging",
      "Zero cross-tenant privilege escalation"
    ]
  },
  {
    id: "gate-05",
    gateNumber: "GATE M5",
    name: "Statutory Package Handoff",
    category: "Statutory",
    summary: "Automatic generation of sealed statutory returns and banking payout instructions (PF ECR, ESI Portal, Form 24Q, JV records).",
    authorityCheck: "Encrypted Banking API Token",
    failDirection: "Fail-Closed",
    latency: "1.2s",
    specs: [
      "Automated PF ECR text file compilation",
      "Direct bank payout batch challan",
      "Audit trail export with SHA-256 seal"
    ]
  }
];

// Interactive Copilot Chat Dialogue for Case Study 1
interface ChatTurn {
  id: number;
  sender: "user" | "copilot" | "system";
  timestamp: string;
  content: string;
  toolCall?: {
    tool: string;
    status: "dispatched" | "completed" | "gated";
    params: string;
    result: string;
  };
  uiAction?: {
    action: string;
    route: string;
    status: string;
  };
}

const COPILOT_SCRIPT: ChatTurn[] = [
  {
    id: 1,
    sender: "user",
    timestamp: "10:41:02 AM",
    content: "Run September payroll cycle for Bangalore HQ. Auto-reconcile biometric shifts and generate statutory filing packages."
  },
  {
    id: 2,
    sender: "copilot",
    timestamp: "10:41:04 AM",
    content: "Initiating declarative Payroll Autopilot for Bangalore HQ (1,420 employees). Verifying pre-flight gates and biometric reconciliation...",
    toolCall: {
      tool: "tools.reconcile_biometric_punches(tenant_id='BLR-HQ', cycle='2026-09')",
      status: "completed",
      params: "tenant='BLR-HQ', grace_window=15min",
      result: "1,420 matched · 3 unregularized anomalies flagged"
    }
  },
  {
    id: 3,
    sender: "system",
    timestamp: "10:41:06 AM",
    content: "GATE M2 INTERVENTION: 3 employees contain unresolved late-mark anomalies exceeding statutory tolerance threshold. Human-in-the-loop authorization required."
  },
  {
    id: 4,
    sender: "user",
    timestamp: "10:41:18 AM",
    content: "Apply standard 1-day approved grace waiver for the 3 flagged records under manager override and resume computation."
  },
  {
    id: 5,
    sender: "copilot",
    timestamp: "10:41:20 AM",
    content: "Manager override authenticated via stored reporting authority. Signed entry written to ai_agent_auditlog. Dispatching Celery background worker...",
    toolCall: {
      tool: "tools.dispatch_payroll_celery_worker(batch_id='BLR-2026-09-EXEC')",
      status: "completed",
      params: "chunk_size=10, throttle=50ms, replica_mode=True",
      result: "142 batch tasks queued · 100% Celery worker ACK"
    },
    uiAction: {
      action: "CONTEXTUAL_VIEWPORT_NAVIGATION",
      route: "/payroll/register?cycle=2026-09&highlight=batch_running",
      status: "Active Screen Synchronized"
    }
  },
  {
    id: 6,
    sender: "copilot",
    timestamp: "10:42:02 AM",
    content: "Payroll computation verified in 42.0s with zero variance errors. Compiling statutory compliance bundle (PF ECR, ESI, PT, Form 24Q).",
    toolCall: {
      tool: "tools.export_compliance_package(types=['PF_ECR', 'ESI', 'PT', 'TDS'])",
      status: "completed",
      params: "cycle='2026-09', format='GOV_STATUTORY_V2'",
      result: "4 statutory packages sealed · Payout challan generated"
    }
  }
];

// 10,000 Mock Data Generator for High-Throughput Register Matrix
interface LedgerRecord {
  id: string;
  employee: string;
  role: string;
  department: string;
  grossPay: string;
  netPay: string;
  statutoryDeductions: string;
  status: "Verified" | "Dispatched" | "Audited";
  perfScore: string;
}

const DEPARTMENTS = ["Core Platform", "Distributed Infrastructure", "AI Research", "Product Engineering", "Data Systems"];
const ROLES = ["Staff Engineer", "Senior SDE", "Systems Architect", "Lead Developer", "Infrastructure Specialist"];
const STATUSES: ("Verified" | "Dispatched" | "Audited")[] = ["Verified", "Dispatched", "Audited"];

const formatINR = (val: number): string => `₹${val.toLocaleString("en-IN")}`;
const formatNumber = (val: number): string => val.toLocaleString("en-US");

const generateRecords = (count: number): LedgerRecord[] => {
  const records: LedgerRecord[] = [];
  for (let i = 1; i <= count; i++) {
    const gross = 120000 + ((i * 137) % 180000);
    const deductions = Math.floor(gross * 0.18);
    const net = gross - deductions;
    records.push({
      id: `PAY-${(200000 + i).toString()}`,
      employee: `Engineer #${(1000 + (i % 900))}`,
      role: ROLES[i % ROLES.length],
      department: DEPARTMENTS[i % DEPARTMENTS.length],
      grossPay: formatINR(gross),
      netPay: formatINR(net),
      statutoryDeductions: formatINR(deductions),
      status: STATUSES[i % STATUSES.length],
      perfScore: `${(0.4 + (i % 6) * 0.15).toFixed(2)}ms`
    });
  }
  return records;
};

// Benchmark calculations derived from employeeScale
const benchmark = (employeeScale: number) => {
  // Unoptimized: N+1 queries = 1 initial + 2 * N queries (overrides + payout updates)
  const unoptQueries = (employeeScale * 2) + 1;
  // Optimized: Exactly 3 batched queries regardless of count
  const optQueries = 3;

  // Latency in seconds (approx 28ms per query unoptimized vs batched bulk)
  const unoptLatency = ((employeeScale * 0.028) + 0.4).toFixed(1);
  const optLatency = Math.max(0.6, (0.5 + (employeeScale / 10000) * 1.2)).toFixed(1);

  // Pool saturation percentage (out of 50 max pool connections)
  const unoptPool = Math.min(100, Math.round(38 + (employeeScale / 2500) * 58));
  const optPool = Math.min(100, Math.round(6 + (employeeScale / 10000) * 4));

  // Active connection count
  const unoptConns = Math.min(50, Math.round((unoptPool / 100) * 50));
  const optConns = Math.min(50, Math.round((optPool / 100) * 50));

  // Throughput in employees/sec
  const unoptThroughput = Math.round(employeeScale / Math.max(1, Number(unoptLatency)));
  const optThroughput = Math.round(employeeScale / Math.max(0.1, Number(optLatency)));

  const querySavings = ((1 - (optQueries / unoptQueries)) * 100).toFixed(1);
  const speedupMultiplier = Math.max(2, Math.round(Number(unoptLatency) / Math.max(0.1, Number(optLatency))));

  return {
    unoptQueries,
    optQueries,
    unoptLatency,
    optLatency,
    unoptPool,
    optPool,
    unoptConns,
    optConns,
    unoptThroughput,
    optThroughput,
    querySavings,
    speedupMultiplier
  };
};

// ============================================================================
// 2. THE SHORT VERSION OF EACH CASE STUDY: ISSUE, WHAT WE DID, RESULT
// ============================================================================

interface StoryBar {
  label: string;
  display: string;
  value: number;
  /** The value a full-width bar stands for */
  of: number;
  tone: "bad" | "good" | "neutral";
}

interface CaseStory {
  issue: { stat: string; unit: string; caption: string; body: string };
  steps: { title: string; body: string }[];
  resultTitle: string;
  bars: StoryBar[];
  note?: string;
}

const TONE_COLOR: Record<StoryBar["tone"], string> = { bad: "#EF4444", good: "#22C55E", neutral: "var(--accent)" };

// The batch story is told at the simulator's starting size, so both show the same figures
const STORY_SCALE = 2500;
const STORY_BENCH = benchmark(STORY_SCALE);

const COPILOT_STORY: CaseStory = {
  issue: {
    stat: `${WORKFLOW_GATES.length}`,
    unit: "stages",
    caption: "between “run payroll” and money leaving the bank",
    body: "A payroll cycle crosses attendance sync, calculation, audit, sign-off and statutory filing. An agent that runs them for you is only safe if a step that fails quietly cannot pass as done."
  },
  steps: [
    { title: "One gate per stage", body: "Each stage is a gate with its own authority check, and the run cannot skip ahead." },
    { title: "Fail closed", body: "Four gates stop the run on any failure. The first halts and waits for a person to approve." },
    { title: "Honesty guard", body: "An interceptor reports a silent 201 as a failure instead of letting it count as success." }
  ],
  resultTitle: "Where a 1,420-employee run spends its time",
  bars: WORKFLOW_GATES.map((gate) => ({
    label: `${gate.gateNumber.replace("GATE ", "")} · ${gate.category}`,
    display: gate.latency,
    // "320ms" -> 0.32, "42s" -> 42, "Instant" -> 0
    value: (parseFloat(gate.latency) || 0) * (gate.latency.endsWith("ms") ? 0.001 : 1),
    of: 42,
    tone: "neutral"
  }))
};

const BATCH_STORY: CaseStory = {
  issue: {
    stat: formatNumber(STORY_BENCH.unoptQueries),
    unit: "queries",
    caption: `for one ${formatNumber(STORY_SCALE)}-employee batch`,
    body: `Every employee triggered its own override read and payout write: 2N+1 queries. At this size the run takes about ${STORY_BENCH.unoptLatency}s, past the 60s load balancer ceiling, so it ends in 504s and retry storms while holding ${STORY_BENCH.unoptPool}% of the connection pool.`
  },
  steps: [
    { title: "Bulk replica preloads", body: "One read-replica call loads the tenant's register, joined in memory by hash index." },
    { title: "Resilient telemetry queue", body: "Audit writes moved off the response cycle onto an async queue with an immediate single retry." },
    { title: "Hardened tenant scoping", body: "Directory export lookups carry a tenant predicate, so nothing crosses tenants." }
  ],
  resultTitle: "Before and after, same batch",
  bars: [
    { label: "DB queries · before", display: formatNumber(STORY_BENCH.unoptQueries), value: STORY_BENCH.unoptQueries, of: STORY_BENCH.unoptQueries, tone: "bad" },
    { label: "DB queries · after", display: `${STORY_BENCH.optQueries}`, value: STORY_BENCH.optQueries, of: STORY_BENCH.unoptQueries, tone: "good" },
    { label: "Run time · before", display: `${STORY_BENCH.unoptLatency}s`, value: Number(STORY_BENCH.unoptLatency), of: Number(STORY_BENCH.unoptLatency), tone: "bad" },
    { label: "Run time · after", display: `${STORY_BENCH.optLatency}s`, value: Number(STORY_BENCH.optLatency), of: Number(STORY_BENCH.unoptLatency), tone: "good" },
    { label: "Connection pool · before", display: `${STORY_BENCH.unoptPool}%`, value: STORY_BENCH.unoptPool, of: 100, tone: "bad" },
    { label: "Connection pool · after", display: `${STORY_BENCH.optPool}%`, value: STORY_BENCH.optPool, of: 100, tone: "good" }
  ],
  note: "Modelled figures. Drag the simulator below to change the batch size."
};

const REGISTER_STORY: CaseStory = {
  issue: {
    stat: "42.8",
    unit: "ms / frame",
    caption: "against a 16.6ms budget",
    body: "The pay register mounted every row it was given. With 1,120+ DOM nodes live, scrolling fell to about 18 FPS and memory sat at 186MB."
  },
  steps: [
    { title: "Window the rows", body: "Only the rows inside the viewport are mounted, plus three either side as overscan." },
    { title: "Fixed row height", body: "Every row is 44px, so the first visible row is one division with nothing to measure." },
    { title: "One offset", body: "A spacer keeps the full scroll height and the mounted rows are translated into place." }
  ],
  resultTitle: "Before and after, 10,000 rows",
  bars: [
    { label: "Frame time · before", display: "42.8ms", value: 42.8, of: 42.8, tone: "bad" },
    { label: "Frame time · after", display: "< 1.5ms", value: 1.5, of: 42.8, tone: "good" },
    { label: "DOM nodes · before", display: "1,120+", value: 1120, of: 1120, tone: "bad" },
    { label: "DOM nodes · after", display: "28", value: 28, of: 1120, tone: "good" },
    { label: "Memory · before", display: "186MB", value: 186, of: 186, tone: "bad" },
    { label: "Memory · after", display: "14.2MB", value: 14.2, of: 186, tone: "good" }
  ],
  note: "Switch Engine Mode below to scroll both versions."
};

const storyPanel = "p-5 rounded-xl bg-[color:color-mix(in_srgb,var(--surface-2)_50%,transparent)] border border-[var(--border-subtle)]";
const storyLabel = "font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider";

const CaseStoryStrip: React.FC<{ story: CaseStory }> = ({ story }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-8 border-b border-[var(--border-subtle)]">
    <div className={storyPanel}>
      <div className={storyLabel}>01 · The issue</div>
      <div className="font-display font-extrabold text-4xl sm:text-5xl text-[#EF4444] mt-3 flex items-baseline gap-2">
        {story.issue.stat}
        <span className="text-sm font-mono text-[var(--text-muted)]">{story.issue.unit}</span>
      </div>
      <div className="text-[11px] text-[var(--text-subtle)] mt-1 font-mono">{story.issue.caption}</div>
      <p className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed mt-4">{story.issue.body}</p>
    </div>

    <div className={storyPanel}>
      <div className={storyLabel}>02 · What we did</div>
      <ol className="mt-3 space-y-3">
        {story.steps.map((step, index) => (
          <li key={step.title} className="flex gap-3">
            <span className="font-mono text-xs text-[var(--accent)] font-bold mt-0.5">{index + 1}</span>
            <div>
              <strong className="block text-sm font-semibold text-[var(--text-primary)]">{step.title}</strong>
              <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed mt-0.5">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>

    <div className={storyPanel}>
      <div className={storyLabel}>03 · The result</div>
      <div className="text-[11px] text-[var(--text-subtle)] mt-1 font-mono">{story.resultTitle}</div>
      <ul className="mt-3 space-y-2.5">
        {story.bars.map((bar, index) => (
          <li key={bar.label}>
            <div className="flex items-baseline justify-between gap-3 font-mono text-[11px]">
              <span className="text-[var(--text-muted)]">{bar.label}</span>
              <span className="font-bold text-[var(--text-primary)]">{bar.display}</span>
            </div>
            {/* The track is what gets observed: a bar scaled to zero has no area to come into view */}
            <motion.div
              aria-hidden="true"
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true, amount: 0.6 }}
              className="mt-1 h-2 rounded-full bg-[var(--surface-3)] overflow-hidden"
            >
              <motion.div
                variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
                transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                // A bar never shrinks below 2%, so the "after" values stay visible
                style={{ width: `${Math.max(2, Math.min(100, (bar.value / bar.of) * 100))}%`, background: TONE_COLOR[bar.tone] }}
                className="h-full origin-left rounded-full"
              />
            </motion.div>
          </li>
        ))}
      </ul>
      {story.note && <p className="text-[11px] text-[var(--text-subtle)] font-mono mt-4">{story.note}</p>}
    </div>
  </div>
);

export const CaseStudies: React.FC = () => {
  // Case Study 1 State
  const [activeCopilotTab, setActiveCopilotTab] = useState<"chat" | "gates">("chat");
  const [selectedGate, setSelectedGate] = useState<WorkflowGate>(WORKFLOW_GATES[0]);
  const [chatTurnIndex, setChatTurnIndex] = useState(COPILOT_SCRIPT.length);
  const [isPlayingScript, setIsPlayingScript] = useState(false);

  // Case Study 2 Benchmark State
  const [employeeScale, setEmployeeScale] = useState<number>(2500);
  const [benchmarkView, setBenchmarkView] = useState<"queries" | "latency" | "pool">("queries");

  // Case Study 3 Matrix State
  const [isOptimized, setIsOptimized] = useState(true);
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const allRecords = useMemo(() => generateRecords(10000), []);
  
  // Virtual windowing calculations
  const rowHeight = 44;
  const visibleHeight = 360;
  const totalCount = allRecords.length;
  
  const { startIndex, endIndex, offsetY } = useMemo(() => {
    if (!isOptimized) {
      return { startIndex: 0, endIndex: 160, offsetY: 0 };
    }
    const start = Math.max(0, Math.floor(scrollTop / rowHeight) - 3);
    const end = Math.min(totalCount, Math.ceil((scrollTop + visibleHeight) / rowHeight) + 3);
    return {
      startIndex: start,
      endIndex: end,
      offsetY: start * rowHeight
    };
  }, [scrollTop, isOptimized, totalCount]);

  const visibleRecords = useMemo(() => {
    return allRecords.slice(startIndex, endIndex);
  }, [allRecords, startIndex, endIndex]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const benchmarkData = useMemo(() => benchmark(employeeScale), [employeeScale]);

  // Copilot dialogue auto-stepper
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingScript) {
      interval = setInterval(() => {
        setChatTurnIndex((prev) => {
          if (prev >= COPILOT_SCRIPT.length) {
            setIsPlayingScript(false);
            return COPILOT_SCRIPT.length;
          }
          return prev + 1;
        });
      }, 2400);
    }
    return () => clearInterval(interval);
  }, [isPlayingScript]);

  return (
    <section id="proof" className="relative w-full py-28 px-6 sm:px-12 overflow-hidden">
      {/* Background Subtle Tech Grid */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[color:color-mix(in_srgb,var(--accent)_5%,transparent)] blur-[160px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-[var(--accent)]" />
            <span className="font-mono text-xs text-[var(--accent)] uppercase tracking-widest font-semibold">
              02 // THE CHRONICLES · ARCHITECTURAL PROOF
            </span>
          </div>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-primary)] uppercase tracking-[-0.03em] max-w-4xl">
            Built With Intention.
          </h2>
          <p className="mt-5 text-[var(--text-muted)] text-base sm:text-lg max-w-3xl font-sans leading-relaxed">
            Three engineered chronicles. Detailed dissections of production systems architected and delivered for 200,000 daily users: deterministic AI copilots, distributed batch optimizations eliminating 99.7% of database bottlenecks, and 60 FPS matrix virtualization.
          </p>
          <div className="mt-4 font-mono text-xs text-[var(--text-subtle)] border-l-2 border-[var(--border)] pl-3 italic">
            &ldquo;Underneath every thousand concurrent transactions, there is a human heartbeat. Underneath every optimized query, a quiet yearning for elegance.&rdquo;
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CASE STUDY 1: AUTONOMOUS ENTERPRISE WORKFLOW COPILOT */}
        {/* ========================================================================= */}
        <div className="mb-32">
          <div className="p-8 sm:p-10 rounded-2xl bg-[color:color-mix(in_srgb,var(--surface-1)_70%,transparent)] border border-[var(--border)] backdrop-blur-xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[color:color-mix(in_srgb,var(--accent)_10%,transparent)] rounded-full blur-3xl pointer-events-none" />

            {/* Header Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-bg)] border border-[color:color-mix(in_srgb,var(--accent)_30%,transparent)] text-[var(--accent-hover)] font-mono text-[10px] uppercase tracking-widest mb-3">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Chronicle I // Autonomous AI Orchestrator &amp; UI Sync</span>
                </div>
                <h3 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] uppercase tracking-tight">
                  The Clockwork Sentinel // Autonomous Enterprise Copilot
                </h3>
                <div className="mt-1 font-mono text-xs text-purple-400 font-medium">
                  &ldquo;Teaching algorithms to listen with patience and act with integrity.&rdquo;
                </div>
                <p className="text-[var(--text-secondary)] font-sans text-sm sm:text-base mt-2.5 max-w-3xl leading-relaxed">
                  Deterministic multi-gate workflow engine capable of autonomously orchestrating high-concurrency payroll runs, biometric attendance reconciliation, and statutory filings. Features strict RBAC validation, honesty guards against masked errors, and real-time bidirectional UI viewport synchronization.
                </p>
              </div>

              {/* View Switcher: Interactive Chat Trace vs State Machine Topology */}
              <div className="flex items-center gap-2 bg-[var(--surface-2)] p-1.5 rounded-xl border border-[var(--border)] shrink-0">
                <button
                  onClick={() => setActiveCopilotTab("chat")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs transition-all ${
                    activeCopilotTab === "chat"
                      ? "bg-[var(--surface-1)] text-[var(--text-primary)] shadow-sm font-bold border border-[var(--border)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Agent Trace & Dialogue</span>
                </button>
                <button
                  onClick={() => setActiveCopilotTab("gates")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs transition-all ${
                    activeCopilotTab === "gates"
                      ? "bg-[var(--surface-1)] text-[var(--text-primary)] shadow-sm font-bold border border-[var(--border)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>5-Gate State Machine</span>
                </button>
              </div>
            </div>

            <CaseStoryStrip story={COPILOT_STORY} />

            {/* Metrics HUD Row (THE DATA) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-8 border-b border-[var(--border-subtle)]">
              <div className="p-4 rounded-xl bg-[color:color-mix(in_srgb,var(--surface-2)_50%,transparent)] border border-[var(--border-subtle)]">
                <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Audit Traceability</div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mt-1 flex items-baseline gap-1">
                  100<span className="text-sm font-mono text-[var(--accent)]">%</span>
                </div>
                <div className="text-[11px] text-[var(--text-subtle)] mt-1 font-mono">Cryptographic action hash log</div>
              </div>

              <div className="p-4 rounded-xl bg-[color:color-mix(in_srgb,var(--surface-2)_50%,transparent)] border border-[var(--border-subtle)]">
                <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Silent API Failures</div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mt-1 flex items-baseline gap-1">
                  0<span className="text-sm font-mono text-[var(--success)]">Δ</span>
                </div>
                <div className="text-[11px] text-[var(--text-subtle)] mt-1 font-mono">Honesty Guard interceptor layer</div>
              </div>

              <div className="p-4 rounded-xl bg-[color:color-mix(in_srgb,var(--surface-2)_50%,transparent)] border border-[var(--border-subtle)]">
                <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Batch Run Orchestration</div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mt-1 flex items-baseline gap-1">
                  42<span className="text-sm font-mono text-[var(--accent)]">s</span>
                </div>
                <div className="text-[11px] text-[var(--text-subtle)] mt-1 font-mono">Automated 1,420 employee cycle</div>
              </div>

              <div className="p-4 rounded-xl bg-[color:color-mix(in_srgb,var(--surface-2)_50%,transparent)] border border-[var(--border-subtle)]">
                <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Admin Policy Setup</div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mt-1 flex items-baseline gap-1">
                  8<span className="text-sm font-mono text-[var(--warm-light)]">x Faster</span>
                </div>
                <div className="text-[11px] text-[var(--text-subtle)] mt-1 font-mono">Conversational interview engine</div>
              </div>
            </div>

            {/* TAB CONTENT: EITHER INTERACTIVE CHAT TRACE OR GATES */}
            {activeCopilotTab === "chat" ? (
              <div className="pt-8">
                {/* Chat Control Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[var(--accent)]" />
                    <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-primary)] font-bold">
                      Autonomous Copilot Trace // Bangalore HQ Payroll Execution
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlayingScript(!isPlayingScript)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--text-primary)] font-mono text-[11px] font-semibold border border-[var(--border-subtle)] transition-colors"
                    >
                      {isPlayingScript ? (
                        <>
                          <Pause className="w-3.5 h-3.5 text-[var(--accent)]" />
                          <span>Pause Trace</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 text-[var(--accent)]" />
                          <span>Simulate Run</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setChatTurnIndex(1);
                        setIsPlayingScript(false);
                      }}
                      className="p-1.5 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors"
                      title="Reset Conversation"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Chat / Terminal Window */}
                <div className="rounded-xl border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface-2)_40%,transparent)] p-5 sm:p-6 font-mono text-xs overflow-hidden shadow-inner flex flex-col gap-4 max-h-[500px] overflow-y-auto">
                  {COPILOT_SCRIPT.slice(0, chatTurnIndex).map((turn) => {
                    if (turn.sender === "user") {
                      return (
                        <div key={turn.id} className="flex flex-col items-end">
                          <div className="flex items-center gap-2 mb-1 text-[10px] text-[var(--text-muted)]">
                            <span className="font-semibold text-[var(--text-primary)]">HR Admin (Executive Role)</span>
                            <span>·</span>
                            <span>{turn.timestamp}</span>
                          </div>
                          <div className="max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl rounded-tr-none bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] font-sans text-xs leading-relaxed shadow-md">
                            {turn.content}
                          </div>
                        </div>
                      );
                    }

                    if (turn.sender === "system") {
                      return (
                        <div key={turn.id} className="flex justify-center my-1">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--warning-bg)] border border-[color:color-mix(in_srgb,var(--warning)_40%,transparent)] text-[var(--warning)] text-[11px] font-mono font-medium max-w-xl text-center">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>{turn.content}</span>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={turn.id} className="flex flex-col items-start">
                        <div className="flex items-center gap-2 mb-1 text-[10px] text-[var(--text-muted)]">
                          <span className="flex items-center gap-1 font-semibold text-[var(--accent)]">
                            <Sparkles className="w-3 h-3" />
                            <span>Copilot Autonomous Agent</span>
                          </span>
                          <span>·</span>
                          <span>{turn.timestamp}</span>
                        </div>

                        <div className="max-w-[90%] sm:max-w-[80%] p-4 rounded-2xl rounded-tl-none bg-[var(--surface-1)] border border-[var(--border)] text-[var(--text-primary)] font-sans text-xs leading-relaxed shadow-md space-y-3">
                          <p>{turn.content}</p>

                          {/* Render Tool Call Telemetry if present */}
                          {turn.toolCall && (
                            <div className="p-3 rounded-lg bg-[color:color-mix(in_srgb,var(--surface-2)_80%,transparent)] border border-[var(--border-subtle)] font-mono text-[11px] space-y-1.5">
                              <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                                <span className="flex items-center gap-1.5 text-[var(--accent)] font-semibold">
                                  <Terminal className="w-3 h-3" />
                                  <span>{turn.toolCall.tool}</span>
                                </span>
                                <span className="inline-flex items-center gap-1 text-[var(--success)] font-bold">
                                  <Check className="w-3 h-3" />
                                  <span>ACK 200</span>
                                </span>
                              </div>
                              <div className="text-[var(--text-muted)] truncate">
                                Params: <span className="text-[var(--text-primary)]">{turn.toolCall.params}</span>
                              </div>
                              <div className="text-[var(--accent-hover)] font-medium">
                                Output: {turn.toolCall.result}
                              </div>
                            </div>
                          )}

                          {/* Render UI Navigation Action Telemetry if present */}
                          {turn.uiAction && (
                            <div className="p-2.5 rounded-lg bg-[var(--accent-bg)] border border-[color:color-mix(in_srgb,var(--accent)_30%,transparent)] text-[11px] font-mono flex items-center justify-between">
                              <div className="flex items-center gap-2 text-[var(--accent-hover)] font-semibold">
                                <Activity className="w-3.5 h-3.5 animate-pulse" />
                                <span>UI Viewport Synchronization</span>
                              </div>
                              <span className="text-[var(--text-primary)] font-mono text-[10px]">
                                {turn.uiAction.route}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Step through button footer */}
                <div className="flex items-center justify-between mt-3 text-[11px] font-mono text-[var(--text-muted)]">
                  <span>
                    STEP {chatTurnIndex} OF {COPILOT_SCRIPT.length}
                  </span>
                  {chatTurnIndex < COPILOT_SCRIPT.length && (
                    <button
                      onClick={() => setChatTurnIndex((prev) => Math.min(COPILOT_SCRIPT.length, prev + 1))}
                      className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-semibold flex items-center gap-1"
                    >
                      <span>Advance Next Turn</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* TAB 2: 5-GATE STATE MACHINE TOPOLOGY */
              <div className="pt-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[var(--accent)] animate-pulse" />
                    <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-primary)] font-bold">
                      Declarative State Gates (Click Gate to Inspect Security Contracts)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-subtle)] hidden sm:inline-block uppercase tracking-wider">
                    Fail Direction: Reads Open // Writes Closed
                  </span>
                </div>

                {/* Gate Pipeline Grid */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
                  {WORKFLOW_GATES.map((gate, index) => {
                    const isSelected = selectedGate.id === gate.id;
                    return (
                      <button
                        key={gate.id}
                        onClick={() => setSelectedGate(gate)}
                        className={`relative text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                          isSelected 
                            ? "bg-[var(--surface-3)] border-[var(--accent)] shadow-[0_0_20px_rgba(var(--accent-rgb),0.2)]" 
                            : "bg-[color:color-mix(in_srgb,var(--surface-2)_60%,transparent)] border-[var(--border-subtle)] hover:border-[var(--border)] hover:bg-[var(--surface-2)]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-[10px] text-[var(--text-muted)] font-bold">
                            {gate.gateNumber}
                          </span>
                          <span className={`w-2 h-2 rounded-full ${
                            gate.failDirection === "Fail-Closed" ? "bg-[var(--accent)]" : "bg-[var(--warning)]"
                          }`} />
                        </div>
                        <div className="font-display font-bold text-xs text-[var(--text-primary)] tracking-tight line-clamp-2">
                          {gate.name}
                        </div>
                        <div className="font-mono text-[10px] text-[var(--text-muted)] mt-1">
                          Latency: {gate.latency}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Gate Specification Inspector */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedGate.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="mt-6 p-6 rounded-xl bg-[color:color-mix(in_srgb,var(--surface-2)_80%,transparent)] border border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
                        <span className="font-mono text-xs uppercase tracking-wider text-[var(--accent-hover)] font-semibold">
                          Gate Invariants // {selectedGate.gateNumber}: {selectedGate.name}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed">
                        {selectedGate.summary}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-4 font-mono text-[11px] text-[var(--text-muted)]">
                        <div>Authority Check: <strong className="text-[var(--text-primary)]">{selectedGate.authorityCheck}</strong></div>
                        <div>Fail Direction: <strong className="text-[var(--text-primary)]">{selectedGate.failDirection}</strong></div>
                      </div>
                    </div>

                    <div className="flex flex-wrap md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-[var(--border-subtle)] pt-4 md:pt-0 md:pl-6">
                      {selectedGate.specs.map((spec, i) => (
                        <div key={i} className="flex items-center gap-2 font-mono text-xs text-[var(--text-primary)]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)] shrink-0" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CASE STUDY 2: DISTRIBUTED BATCH ENGINE & ZERO-LOSS TELEMETRY */}
        {/* ========================================================================= */}
        <div className="mb-32">
          <div className="p-8 sm:p-10 rounded-2xl bg-[color:color-mix(in_srgb,var(--surface-1)_70%,transparent)] border border-[var(--border)] backdrop-blur-xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[color:color-mix(in_srgb,var(--accent)_10%,transparent)] rounded-full blur-3xl pointer-events-none" />

            {/* Header Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-bg)] border border-[color:color-mix(in_srgb,var(--accent)_30%,transparent)] text-[var(--accent-hover)] font-mono text-[10px] uppercase tracking-widest mb-3">
                  <Database className="w-3.5 h-3.5" />
                  <span>Chronicle II // Distributed Database Optimization &amp; Telemetry</span>
                </div>
                <h3 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] uppercase tracking-tight">
                  Rivers in the Machine // High-Throughput Batch Optimization
                </h3>
                <div className="mt-1 font-mono text-xs text-purple-400 font-medium">
                  &ldquo;When twenty thousand records flow without friction, code becomes quiet water.&rdquo;
                </div>
                <p className="text-[var(--text-secondary)] font-sans text-sm sm:text-base mt-2.5 max-w-3xl leading-relaxed">
                  Engineered distributed performance overhaul for core batch calculations servicing 150K–200K active employee records across multi-tenant environments. Eliminated cascading N+1 database queries via bulk replica joins and built resilient asynchronous request logging queues with automatic reconnect retry.
                </p>
              </div>

              {/* Benchmark Metric View Selector */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-[var(--surface-2)] p-1.5 rounded-xl border border-[var(--border)] shrink-0">
                <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider pl-2 hidden sm:inline-block">
                  Active Metric:
                </span>
                <div className="flex items-center gap-1.5 bg-[var(--surface-1)] p-1 rounded-lg">
                  <button
                    onClick={() => setBenchmarkView("queries")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs transition-all ${
                      benchmarkView === "queries"
                        ? "bg-[var(--accent)] text-white shadow-md font-bold"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>DB Queries</span>
                  </button>

                  <button
                    onClick={() => setBenchmarkView("latency")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs transition-all ${
                      benchmarkView === "latency"
                        ? "bg-[var(--accent)] text-white shadow-md font-bold"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Execution Latency</span>
                  </button>

                  <button
                    onClick={() => setBenchmarkView("pool")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs transition-all ${
                      benchmarkView === "pool"
                        ? "bg-[var(--accent)] text-white shadow-md font-bold"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <Server className="w-3.5 h-3.5" />
                    <span>Connection Pool</span>
                  </button>
                </div>
              </div>
            </div>

            <CaseStoryStrip story={BATCH_STORY} />

            {/* Metrics HUD Row (THE DATA) — Directly Clickable and Synchronized */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-8 border-b border-[var(--border-subtle)]">
              {/* Card 1: Queries */}
              <button
                onClick={() => setBenchmarkView("queries")}
                className={`text-left p-4 rounded-xl transition-all duration-200 cursor-pointer ${
                  benchmarkView === "queries"
                    ? "bg-[var(--surface-3)] border-2 border-[var(--accent)] shadow-lg scale-[1.02] ring-2 ring-[color:color-mix(in_srgb,var(--accent)_20%,transparent)]"
                    : "bg-[color:color-mix(in_srgb,var(--surface-2)_50%,transparent)] border border-[var(--border-subtle)] hover:border-[var(--border)] hover:bg-[var(--surface-2)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-3 h-3 text-[var(--accent)]" />
                    <span>DB Query Cascade</span>
                  </div>
                  {benchmarkView === "queries" && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[var(--accent)] text-white">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mt-1.5 flex items-baseline gap-1">
                  -{benchmarkData.querySavings}<span className="text-sm font-mono text-[var(--accent)]">%</span>
                </div>
                <div className="text-[11px] text-[var(--text-subtle)] mt-1 font-mono">
                  {formatNumber(benchmarkData.unoptQueries)} down to {benchmarkData.optQueries} batched queries
                </div>
              </button>

              {/* Card 2: Latency */}
              <button
                onClick={() => setBenchmarkView("latency")}
                className={`text-left p-4 rounded-xl transition-all duration-200 cursor-pointer ${
                  benchmarkView === "latency"
                    ? "bg-[var(--surface-3)] border-2 border-[var(--accent)] shadow-lg scale-[1.02] ring-2 ring-[color:color-mix(in_srgb,var(--accent)_20%,transparent)]"
                    : "bg-[color:color-mix(in_srgb,var(--surface-2)_50%,transparent)] border border-[var(--border-subtle)] hover:border-[var(--border)] hover:bg-[var(--surface-2)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[var(--accent)]" />
                    <span>Batch Runtime Speedup</span>
                  </div>
                  {benchmarkView === "latency" && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[var(--accent)] text-white">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mt-1.5 flex items-baseline gap-1">
                  {benchmarkData.speedupMultiplier}<span className="text-sm font-mono text-[var(--success)]">x Faster</span>
                </div>
                <div className="text-[11px] text-[var(--text-subtle)] mt-1 font-mono">
                  {benchmarkData.unoptLatency}s down to {benchmarkData.optLatency}s runtime
                </div>
              </button>

              {/* Card 3: Connection Pool */}
              <button
                onClick={() => setBenchmarkView("pool")}
                className={`text-left p-4 rounded-xl transition-all duration-200 cursor-pointer ${
                  benchmarkView === "pool"
                    ? "bg-[var(--surface-3)] border-2 border-[var(--accent)] shadow-lg scale-[1.02] ring-2 ring-[color:color-mix(in_srgb,var(--accent)_20%,transparent)]"
                    : "bg-[color:color-mix(in_srgb,var(--surface-2)_50%,transparent)] border border-[var(--border-subtle)] hover:border-[var(--border)] hover:bg-[var(--surface-2)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                    <Server className="w-3 h-3 text-[var(--accent)]" />
                    <span>DB Pool Saturation</span>
                  </div>
                  {benchmarkView === "pool" && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[var(--accent)] text-white">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mt-1.5 flex items-baseline gap-1">
                  {benchmarkData.optPool}<span className="text-sm font-mono text-[var(--accent)]">%</span>
                </div>
                <div className="text-[11px] text-[var(--text-subtle)] mt-1 font-mono">
                  Relieved {benchmarkData.unoptPool}% pool exhaustion
                </div>
              </button>

              {/* Card 4: Dropped Logs */}
              <div className="p-4 rounded-xl bg-[color:color-mix(in_srgb,var(--surface-2)_50%,transparent)] border border-[var(--border-subtle)]">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-[var(--success)]" />
                    <span>Telemetry Reliability</span>
                  </div>
                </div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mt-1.5 flex items-baseline gap-1">
                  0<span className="text-sm font-mono text-[var(--success)]">Dropped Rows</span>
                </div>
                <div className="text-[11px] text-[var(--text-subtle)] mt-1 font-mono">
                  Resilient async queue with instant retry
                </div>
              </div>
            </div>

            {/* INTERACTIVE BENCHMARK & QUERY VISUALIZER (GRAPHS & SLIDER) */}
            <div className="pt-8">
              {/* Interactive Scale Slider Control */}
              <div className="p-6 rounded-xl bg-[color:color-mix(in_srgb,var(--surface-2)_50%,transparent)] border border-[var(--border)] mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-hover)] font-bold flex items-center gap-2">
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Interactive Batch Volume Simulator</span>
                    </span>
                    <p className="text-xs text-[var(--text-muted)] font-sans mt-1">
                      Drag slider to observe computational divergence between legacy iterative N+1 queries and the optimized batch read-replica engine.
                    </p>
                  </div>
                  <div className="font-mono text-sm bg-[var(--surface-1)] px-4 py-2 rounded-lg border border-[var(--border)] shrink-0 flex items-center gap-2">
                    <span className="text-[var(--text-muted)] text-xs uppercase">Simulated Batch:</span>
                    <strong className="text-[var(--text-primary)] text-base font-extrabold">
                      {formatNumber(employeeScale)}
                    </strong>
                    <span className="text-xs text-[var(--text-muted)]">Employees</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="500"
                  value={employeeScale}
                  onChange={(e) => setEmployeeScale(Number(e.target.value))}
                  className="w-full h-2 bg-[var(--surface-3)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                />

                <div className="flex justify-between font-mono text-[10px] text-[var(--text-muted)] mt-2">
                  <span>500 Employees</span>
                  <span>2,500 (Mid-tier org)</span>
                  <span>5,000 (Enterprise)</span>
                  <span>10,000+ (High-Scale Matrix)</span>
                </div>
              </div>

              {/* DEDICATED DYNAMIC BENCHMARK VISUALIZER CONTAINER */}
              <div className="p-6 sm:p-8 rounded-xl bg-[color:color-mix(in_srgb,var(--surface-2)_30%,transparent)] border border-[var(--border)]">
                
                {/* Secondary In-Graph Tab Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-primary)] font-bold uppercase tracking-wider">
                    <BarChart3 className="w-4 h-4 text-[var(--accent)]" />
                    <span>
                      {benchmarkView === "queries" && "Telemetry 01 // Database Query Waterfall & Volume"}
                      {benchmarkView === "latency" && "Telemetry 02 // Wall-Clock Execution Latency & Gateway Limit"}
                      {benchmarkView === "pool" && "Telemetry 03 // PostgreSQL Connection Pool & Lease Saturation"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-[var(--surface-1)] p-1 rounded-lg border border-[var(--border)]">
                    <button
                      onClick={() => setBenchmarkView("queries")}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                        benchmarkView === "queries"
                          ? "bg-[var(--accent)] text-white font-bold"
                          : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      Queries
                    </button>
                    <button
                      onClick={() => setBenchmarkView("latency")}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                        benchmarkView === "latency"
                          ? "bg-[var(--accent)] text-white font-bold"
                          : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      Latency
                    </button>
                    <button
                      onClick={() => setBenchmarkView("pool")}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                        benchmarkView === "pool"
                          ? "bg-[var(--accent)] text-white font-bold"
                          : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      Pool
                    </button>
                  </div>
                </div>

                {/* VIEW 1: DB QUERIES WATERFALL */}
                {benchmarkView === "queries" && (
                  <motion.div
                    key="view-queries"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-sans text-[var(--text-secondary)]">
                        Database roundtrips generated for <strong>{formatNumber(employeeScale)}</strong> employee payroll calculation:
                      </span>
                      <span className="font-mono text-xs text-[var(--success)] font-bold">
                        {benchmarkData.querySavings}% Network Roundtrips Saved
                      </span>
                    </div>

                    {/* Bar 1: Legacy Iterative Cascade */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                        <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
                          <span>Legacy Sequential Pipeline (N+1 Query Loop)</span>
                        </span>
                        <span className="text-[#EF4444] font-bold">
                          {formatNumber(benchmarkData.unoptQueries)} DB Queries (O(N) Explosion)
                        </span>
                      </div>
                      <div className="w-full h-8 bg-[var(--surface-2)] rounded-lg overflow-hidden border border-[var(--border-subtle)] relative">
                        <motion.div
                          className="h-full bg-gradient-to-r from-red-500/80 to-red-600 rounded-lg flex items-center justify-end pr-3 font-mono text-xs text-white font-bold"
                          initial={{ width: "20%" }}
                          animate={{ width: `${Math.min(100, Math.max(15, (benchmarkData.unoptQueries / 20001) * 100))}%` }}
                          transition={{ duration: 0.3 }}
                        >
                          <span>{formatNumber(benchmarkData.unoptQueries)} Queries</span>
                        </motion.div>
                      </div>
                    </div>

                    {/* Bar 2: Optimized Batch Read-Replica */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                        <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                          <span>Optimized Architecture (Bulk Read-Replica Join + In-Memory Preload)</span>
                        </span>
                        <span className="text-[#22C55E] font-bold">
                          {benchmarkData.optQueries} Batched Queries (O(1) Flat)
                        </span>
                      </div>
                      <div className="w-full h-8 bg-[var(--surface-2)] rounded-lg overflow-hidden border border-[var(--border-subtle)] relative">
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-500/80 to-emerald-600 rounded-lg flex items-center justify-end pr-3 font-mono text-xs text-white font-bold"
                          initial={{ width: "3%" }}
                          animate={{ width: "4%" }}
                          transition={{ duration: 0.3 }}
                        >
                          <span>3</span>
                        </motion.div>
                      </div>
                    </div>

                    {/* Query Decomposition Breakdown */}
                    <div className="p-4 rounded-xl bg-[color:color-mix(in_srgb,var(--surface-2)_60%,transparent)] border border-[var(--border-subtle)] font-mono text-xs space-y-2">
                      <div className="text-[10px] text-[var(--accent)] uppercase tracking-wider font-bold">
                        Detailed Query Execution Breakdown:
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-[var(--surface-1)] border border-[var(--border-subtle)]">
                          <div className="text-[#EF4444] font-bold mb-1">Legacy Iterative Loop:</div>
                          <ul className="text-[11px] text-[var(--text-muted)] space-y-1 list-disc list-inside">
                            <li>1x Batch initialization fetch</li>
                            <li>{formatNumber(employeeScale)}x Employee override queries</li>
                            <li>{formatNumber(employeeScale)}x Bulk payout status writes</li>
                            <li className="text-[var(--text-primary)] font-semibold mt-1">Total: {formatNumber(benchmarkData.unoptQueries)} TCP network roundtrips</li>
                          </ul>
                        </div>

                        <div className="p-3 rounded-lg bg-[var(--surface-1)] border border-[var(--border-subtle)]">
                          <div className="text-[#22C55E] font-bold mb-1">Optimized Read-Replica Batch:</div>
                          <ul className="text-[11px] text-[var(--text-muted)] space-y-1 list-disc list-inside">
                            <li>1x Bulk pay register fetch from read-replica</li>
                            <li>1x Bulk copy-override in-memory hash join</li>
                            <li>1x Chunked payout status batch update</li>
                            <li className="text-[var(--text-primary)] font-semibold mt-1">Total: Exactly 3 batched queries (O(1) invariant)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* VIEW 2: EXECUTION LATENCY & GATEWAY TIMEOUT */}
                {benchmarkView === "latency" && (
                  <motion.div
                    key="view-latency"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-sans text-[var(--text-secondary)]">
                        Wall-clock execution duration for <strong>{formatNumber(employeeScale)}</strong> records:
                      </span>
                      <span className="font-mono text-xs text-[var(--success)] font-bold">
                        {benchmarkData.speedupMultiplier}x Latency Reduction
                      </span>
                    </div>

                    {/* Bar 1: Legacy Latency */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                        <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
                          <span>Legacy Sequential Pipeline</span>
                        </span>
                        <span className="text-[#EF4444] font-bold">
                          {benchmarkData.unoptLatency}s Wall-Clock Time
                        </span>
                      </div>
                      <div className="w-full h-8 bg-[var(--surface-2)] rounded-lg overflow-hidden border border-[var(--border-subtle)] relative">
                        <motion.div
                          className="h-full bg-gradient-to-r from-red-500/80 to-red-600 rounded-lg flex items-center justify-end pr-3 font-mono text-xs text-white font-bold"
                          initial={{ width: "25%" }}
                          animate={{ width: `${Math.min(100, Math.max(12, (Number(benchmarkData.unoptLatency) / 280) * 100))}%` }}
                          transition={{ duration: 0.3 }}
                        >
                          <span>{benchmarkData.unoptLatency}s</span>
                        </motion.div>
                      </div>
                      {Number(benchmarkData.unoptLatency) >= 60 && (
                        <div className="mt-1.5 text-[10px] font-mono text-[#EF4444] flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>GATEWAY TIMEOUT VIOLATION: Exceeds 60s load balancer ceiling, triggering 504 Gateway errors & retry storms.</span>
                        </div>
                      )}
                    </div>

                    {/* Bar 2: Optimized Latency */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                        <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                          <span>Optimized Batch Architecture</span>
                        </span>
                        <span className="text-[#22C55E] font-bold">
                          {benchmarkData.optLatency}s (Sub-Second Ingestion & Compute)
                        </span>
                      </div>
                      <div className="w-full h-8 bg-[var(--surface-2)] rounded-lg overflow-hidden border border-[var(--border-subtle)] relative">
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-500/80 to-emerald-600 rounded-lg flex items-center justify-end pr-3 font-mono text-xs text-white font-bold"
                          initial={{ width: "4%" }}
                          animate={{ width: "4%" }}
                          transition={{ duration: 0.3 }}
                        >
                          <span>{benchmarkData.optLatency}s</span>
                        </motion.div>
                      </div>
                    </div>

                    {/* Throughput Metric Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[color:color-mix(in_srgb,var(--surface-2)_60%,transparent)] border border-[var(--border-subtle)] font-mono text-xs">
                      <div className="p-3 rounded-lg bg-[var(--surface-1)] border border-[var(--border-subtle)]">
                        <div className="text-[10px] text-[var(--text-muted)] uppercase">Legacy Processing Throughput</div>
                        <div className="text-xl font-display font-extrabold text-[#EF4444] mt-1">
                          ~{benchmarkData.unoptThroughput} <span className="text-xs font-mono text-[var(--text-muted)]">records/sec</span>
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] mt-1 font-sans">
                          Throttled by synchronous database network roundtrips.
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-[var(--surface-1)] border border-[var(--border-subtle)]">
                        <div className="text-[10px] text-[var(--text-muted)] uppercase">Optimized Batch Throughput</div>
                        <div className="text-xl font-display font-extrabold text-[#22C55E] mt-1">
                          ~{formatNumber(benchmarkData.optThroughput)} <span className="text-xs font-mono text-[var(--text-muted)]">records/sec</span>
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] mt-1 font-sans">
                          Parallel Celery chunking with zero network I/O block.
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* VIEW 3: CONNECTION POOL SATURATION */}
                {benchmarkView === "pool" && (
                  <motion.div
                    key="view-pool"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-sans text-[var(--text-secondary)]">
                        PostgreSQL database connection pool utilization (50 Max Pool Size):
                      </span>
                      <span className="font-mono text-xs text-[var(--success)] font-bold">
                        92% Headroom Available
                      </span>
                    </div>

                    {/* Bar 1: Legacy Pool */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                        <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
                          <span>Legacy Architecture Connection Saturation</span>
                        </span>
                        <span className="text-[#EF4444] font-bold">
                          {benchmarkData.unoptConns} / 50 Leases Locked ({benchmarkData.unoptPool}% Capacity)
                        </span>
                      </div>
                      <div className="w-full h-8 bg-[var(--surface-2)] rounded-lg overflow-hidden border border-[var(--border-subtle)] relative">
                        <motion.div
                          className="h-full bg-gradient-to-r from-amber-500/80 to-red-600 rounded-lg flex items-center justify-end pr-3 font-mono text-xs text-white font-bold"
                          initial={{ width: "40%" }}
                          animate={{ width: `${benchmarkData.unoptPool}%` }}
                          transition={{ duration: 0.3 }}
                        >
                          <span>{benchmarkData.unoptPool}% Saturation</span>
                        </motion.div>
                      </div>
                    </div>

                    {/* Bar 2: Optimized Pool */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                        <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                          <span>Optimized Read-Replica Batch Pipeline</span>
                        </span>
                        <span className="text-[#22C55E] font-bold">
                          {benchmarkData.optConns} / 50 Leases Active ({benchmarkData.optPool}% Capacity)
                        </span>
                      </div>
                      <div className="w-full h-8 bg-[var(--surface-2)] rounded-lg overflow-hidden border border-[var(--border-subtle)] relative">
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-500/80 to-emerald-600 rounded-lg flex items-center justify-end pr-3 font-mono text-xs text-white font-bold"
                          initial={{ width: "8%" }}
                          animate={{ width: `${Math.max(6, benchmarkData.optPool)}%` }}
                          transition={{ duration: 0.3 }}
                        >
                          <span>{benchmarkData.optPool}%</span>
                        </motion.div>
                      </div>
                    </div>

                    {/* Connection Slots Visualizer Grid */}
                    <div className="p-4 rounded-xl bg-[color:color-mix(in_srgb,var(--surface-2)_60%,transparent)] border border-[var(--border-subtle)] font-mono text-xs">
                      <div className="flex items-center justify-between mb-3 text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                        <span>Database Pool Connection Slot Health (50 Leases)</span>
                        <span className="text-[var(--success)] font-bold">Green = Available · Red = Blocked in Wait</span>
                      </div>
                      <div className="grid grid-cols-10 sm:grid-cols-25 gap-1.5">
                        {Array.from({ length: 50 }).map((_, idx) => {
                          const isLegacyLocked = idx < benchmarkData.unoptConns;
                          return (
                            <div
                              key={idx}
                              title={`Connection Lease #${idx + 1}`}
                              className={`h-4 rounded-sm transition-all duration-300 ${
                                isLegacyLocked
                                  ? "bg-red-500/80 shadow-[0_0_4px_rgba(239,68,68,0.5)]"
                                  : "bg-emerald-500/70"
                              }`}
                            />
                          );
                        })}
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[11px] text-[var(--text-muted)] font-sans">
                        <span>In optimized architecture, bulk fetch completes in <strong>42ms</strong>, immediately releasing connections back to pool.</span>
                        <span className="font-mono text-[#22C55E] font-bold">Zero starvation of external tenants</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Architectural Explanations Row */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-[var(--border-subtle)] text-xs font-sans">
                  <div className="p-4 rounded-lg bg-[color:color-mix(in_srgb,var(--surface-2)_60%,transparent)] border border-[var(--border-subtle)]">
                    <strong className="text-[var(--text-primary)] block mb-1 font-semibold">1. Bulk Replica Preloads:</strong>
                    <p className="text-[var(--text-muted)] leading-relaxed">
                      Eliminated the per-employee query cascade by materializing tenant company registers in one read-replica call and performing in-memory hash index joining.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[color:color-mix(in_srgb,var(--surface-2)_60%,transparent)] border border-[var(--border-subtle)]">
                    <strong className="text-[var(--text-primary)] block mb-1 font-semibold">2. Resilient Telemetry Queue:</strong>
                    <p className="text-[var(--text-muted)] leading-relaxed">
                      Decoupled API response cycles from DB audit writes using an asynchronous request_queue with immediate single retry to survive broker disconnects.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[color:color-mix(in_srgb,var(--surface-2)_60%,transparent)] border border-[var(--border-subtle)]">
                    <strong className="text-[var(--text-primary)] block mb-1 font-semibold">3. Hardened Tenant Scoping:</strong>
                    <p className="text-[var(--text-muted)] leading-relaxed">
                      Enforced tenant predicate scoping on directory export UUID lookups to structurally guarantee zero cross-tenant entity leakage.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CASE STUDY 3: HIGH-CARDINALITY VIRTUALIZED REGISTER & MATRIX */}
        {/* ========================================================================= */}
        <div>
          <div className="p-8 sm:p-10 rounded-2xl bg-[color:color-mix(in_srgb,var(--surface-1)_70%,transparent)] border border-[var(--border)] backdrop-blur-xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[color:color-mix(in_srgb,var(--warm)_10%,transparent)] rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-bg)] border border-[color:color-mix(in_srgb,var(--accent)_30%,transparent)] text-[var(--accent-hover)] font-mono text-[10px] uppercase tracking-widest mb-3">
                  <Gauge className="w-3.5 h-3.5" />
                  <span>Chronicle III // High-Scale Frontend Virtualization</span>
                </div>
                <h3 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] uppercase tracking-tight">
                  The Infinite Loom // High-Throughput Virtualized Pay Register
                </h3>
                <div className="mt-1 font-mono text-xs text-purple-400 font-medium">
                  &ldquo;Rendering only what the human eye can touch, leaving the rest to imagination.&rdquo;
                </div>
                <p className="text-[var(--text-secondary)] font-sans text-sm sm:text-base mt-2.5 max-w-2xl leading-relaxed">
                  Real-time payroll register stress-test demonstrating row windowing over massive 10,000+ data sets. Decouples DOM complexity from dataset volume for a locked 60 FPS experience with microsecond frame budgets.
                </p>
              </div>

              {/* Performance Switch Interactive Toggle */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-[var(--surface-2)] p-2 rounded-xl border border-[var(--border)]">
                <span className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider pl-2">
                  Engine Mode:
                </span>
                <div className="flex items-center gap-1.5 bg-[var(--surface-1)] p-1 rounded-lg">
                  <button
                    onClick={() => setIsOptimized(false)}
                    className={`px-3 py-1.5 rounded-md font-mono text-xs transition-all ${
                      !isOptimized 
                        ? "bg-[var(--error-bg)] text-[#EF4444] font-bold border border-[#EF4444]/40" 
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    Unoptimized
                  </button>
                  <button
                    onClick={() => setIsOptimized(true)}
                    className={`px-3 py-1.5 rounded-md font-mono text-xs transition-all ${
                      isOptimized 
                        ? "bg-[var(--success-bg)] text-[#22C55E] font-bold border border-[#22C55E]/40" 
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    60 FPS Virtualized
                  </button>
                </div>
              </div>
            </div>

            <CaseStoryStrip story={REGISTER_STORY} />

            {/* Performance Telemetry Comparative HUD */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-8 border-b border-[var(--border-subtle)]">
              <div className="p-4 rounded-xl bg-[color:color-mix(in_srgb,var(--surface-2)_50%,transparent)] border border-[var(--border-subtle)]">
                <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Scroll Refresh Rate</div>
                <div className={`font-display font-extrabold text-2xl sm:text-3xl mt-1 flex items-baseline gap-1 ${
                  isOptimized ? "text-[#22C55E]" : "text-[#EF4444]"
                }`}>
                  {isOptimized ? "60.0" : "~18.4"}<span className="text-sm font-mono text-[var(--text-muted)]">FPS</span>
                </div>
                <div className="text-[11px] text-[var(--text-subtle)] mt-1 font-mono">
                  {isOptimized ? "Locked vsync cadence" : "Frequent dropped frames"}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[color:color-mix(in_srgb,var(--surface-2)_50%,transparent)] border border-[var(--border-subtle)]">
                <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Mounted DOM Nodes</div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mt-1 flex items-baseline gap-1">
                  {isOptimized ? "28" : "1,120+"}<span className="text-sm font-mono text-[var(--accent)]">Nodes</span>
                </div>
                <div className="text-[11px] text-[var(--text-subtle)] mt-1 font-mono">
                  {isOptimized ? "Fixed O(1) viewport bound" : "Full unvirtualized thrashing"}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[color:color-mix(in_srgb,var(--surface-2)_50%,transparent)] border border-[var(--border-subtle)]">
                <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Memory Footprint</div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mt-1 flex items-baseline gap-1">
                  {isOptimized ? "14.2" : "186.0"}<span className="text-sm font-mono text-[var(--warm-light)]">MB</span>
                </div>
                <div className="text-[11px] text-[var(--text-subtle)] mt-1 font-mono">
                  {isOptimized ? "-92% garbage collection overhead" : "High GC pause pressure"}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[color:color-mix(in_srgb,var(--surface-2)_50%,transparent)] border border-[var(--border-subtle)]">
                <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Frame Render Budget</div>
                <div className={`font-display font-extrabold text-2xl sm:text-3xl mt-1 flex items-baseline gap-1 ${
                  isOptimized ? "text-[var(--text-primary)]" : "text-[#EF4444]"
                }`}>
                  {isOptimized ? "< 1.5" : "42.8"}<span className="text-sm font-mono text-[var(--text-muted)]">ms</span>
                </div>
                <div className="text-[11px] text-[var(--text-subtle)] mt-1 font-mono">
                  {isOptimized ? "Under 16.6ms frame threshold" : "Exceeds 16.6ms budget"}
                </div>
              </div>
            </div>

            {/* Interactive Live Scroll Matrix */}
            <div className="pt-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)]">
                  <Database className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>LIVE REPO DATASET: <strong className="text-[var(--text-primary)]">10,000 EMPLOYEE SALARY RECORDS</strong></span>
                </div>
                <div className="font-mono text-[11px] text-[var(--accent)]">
                  Scroll container below to test 60 FPS frame pacing
                </div>
              </div>

              {/* Table Container */}
              <div className="rounded-xl border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface-2)_40%,transparent)] overflow-hidden shadow-inner">
                {/* Table Header */}
                <div className="grid grid-cols-7 px-4 py-3 bg-[var(--surface-2)] border-b border-[var(--border)] font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
                  <div>Record ID</div>
                  <div className="col-span-2">Employee / Role</div>
                  <div>Department</div>
                  <div>Gross Pay</div>
                  <div>Net Pay</div>
                  <div className="text-right">Status</div>
                </div>

                {/* Virtual Scroll Area */}
                <div
                  ref={containerRef}
                  onScroll={handleScroll}
                  className="overflow-y-auto relative scroll-smooth"
                  style={{ height: `${visibleHeight}px` }}
                >
                  <div
                    style={{
                      height: isOptimized ? `${totalCount * rowHeight}px` : "auto",
                      position: "relative",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        transform: isOptimized ? `translateY(${offsetY}px)` : "none",
                        position: isOptimized ? "absolute" : "relative",
                        top: 0,
                        left: 0,
                        right: 0,
                      }}
                    >
                      {visibleRecords.map((item) => (
                        <div
                          key={item.id}
                          className="grid grid-cols-7 px-4 items-center border-b border-[color:color-mix(in_srgb,var(--border-subtle)_60%,transparent)] font-mono text-xs hover:bg-[color:color-mix(in_srgb,var(--surface-3)_60%,transparent)] transition-colors"
                          style={{ height: `${rowHeight}px` }}
                        >
                          <div className="text-[var(--accent-hover)] font-medium truncate">
                            {item.id}
                          </div>
                          <div className="col-span-2 font-sans font-medium text-[var(--text-primary)] truncate">
                            {item.employee} <span className="text-[10px] text-[var(--text-subtle)] font-mono">({item.role})</span>
                          </div>
                          <div className="text-[var(--text-muted)] truncate text-[11px]">
                            {item.department}
                          </div>
                          <div className="text-[var(--text-muted)] text-[11px]">
                            {item.grossPay}
                          </div>
                          <div className="text-[var(--text-primary)] font-bold">
                            {item.netPay}
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.status === "Verified"
                                ? "bg-[var(--success-bg)] text-[#22C55E]"
                                : item.status === "Dispatched"
                                ? "bg-[var(--accent-bg)] text-[var(--accent-hover)]"
                                : "bg-[var(--warning-bg)] text-[var(--warning)]"
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Table Footer Stats */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[color:color-mix(in_srgb,var(--surface-2)_90%,transparent)] border-t border-[var(--border)] font-mono text-[10px] text-[var(--text-muted)]">
                  <div>
                    SHOWING ROWS {startIndex + 1}–{Math.min(totalCount, endIndex)} OF {formatNumber(totalCount)}
                  </div>
                  <div className="flex items-center gap-1.5 text-[var(--success)] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-ping" />
                    <span>ZERO DOM-THRASH GC RECYCLING ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
