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
      grossPay: `₹${gross.toLocaleString()}`,
      netPay: `₹${net.toLocaleString()}`,
      statutoryDeductions: `₹${deductions.toLocaleString()}`,
      status: STATUSES[i % STATUSES.length],
      perfScore: `${(0.4 + (i % 6) * 0.15).toFixed(2)}ms`
    });
  }
  return records;
};

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

  // Benchmark calculations derived from employeeScale
  const benchmarkData = useMemo(() => {
    // Unoptimized: N+1 queries = 1 initial + N queries for employees
    const unoptQueries = employeeScale + 4;
    // Optimized: Exactly 3 batched queries regardless of count
    const optQueries = 3;
    
    // Latency in seconds (approx 34ms per query unoptimized vs batched bulk)
    const unoptLatency = ((employeeScale * 0.034) + 0.5).toFixed(1);
    const optLatency = Math.max(0.8, (0.7 + (employeeScale / 10000) * 1.4)).toFixed(1);

    // Pool saturation percentage
    const unoptPool = Math.min(100, Math.round(25 + (employeeScale / 2500) * 70));
    const optPool = Math.min(100, Math.round(4 + (employeeScale / 10000) * 5));

    return {
      unoptQueries,
      optQueries,
      unoptLatency,
      optLatency,
      unoptPool,
      optPool,
      querySavings: ((1 - (optQueries / unoptQueries)) * 100).toFixed(1)
    };
  }, [employeeScale]);

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
    <section id="proof" className="relative w-full py-28 px-6 sm:px-12 bg-[var(--background)] border-t border-[var(--border)] overflow-hidden transition-colors duration-300">
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[var(--accent)]/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-[var(--accent)]" />
            <span className="font-mono text-xs text-[var(--accent)] uppercase tracking-widest font-semibold">
              02 // THE PROOF
            </span>
          </div>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-primary)] uppercase tracking-[-0.03em] max-w-4xl">
            Engineered Systems & Case Studies
          </h2>
          <p className="mt-5 text-[var(--text-muted)] text-base sm:text-lg max-w-3xl font-sans leading-relaxed">
            Detailed dissections of production systems I architected and delivered: deterministic AI agent copilot orchestrations, distributed batch optimizations eliminating 99.7% of database bottlenecks, and high-frequency frontend virtualizations.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* CASE STUDY 1: AUTONOMOUS ENTERPRISE WORKFLOW COPILOT */}
        {/* ========================================================================= */}
        <div className="mb-32">
          <div className="p-8 sm:p-10 rounded-2xl bg-[var(--surface-1)]/70 border border-[var(--border)] backdrop-blur-xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-bg)] border border-[var(--accent)]/30 text-[var(--accent-hover)] font-mono text-[10px] uppercase tracking-widest mb-3">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Autonomous AI Orchestrator & UI Sync</span>
                </div>
                <h3 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] uppercase tracking-tight">
                  Autonomous Enterprise Workflow Copilot
                </h3>
                <p className="text-[var(--text-secondary)] font-sans text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
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

            {/* Metrics HUD Row (THE DATA) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-8 border-b border-[var(--border-subtle)]">
              <div className="p-4 rounded-xl bg-[var(--surface-2)]/50 border border-[var(--border-subtle)]">
                <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Audit Traceability</div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mt-1 flex items-baseline gap-1">
                  100<span className="text-sm font-mono text-[var(--accent)]">%</span>
                </div>
                <div className="text-[11px] text-[var(--text-subtle)] mt-1 font-mono">Cryptographic action hash log</div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-2)]/50 border border-[var(--border-subtle)]">
                <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Silent API Failures</div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mt-1 flex items-baseline gap-1">
                  0<span className="text-sm font-mono text-[var(--success)]">Δ</span>
                </div>
                <div className="text-[11px] text-[var(--text-subtle)] mt-1 font-mono">Honesty Guard interceptor layer</div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-2)]/50 border border-[var(--border-subtle)]">
                <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Batch Run Orchestration</div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mt-1 flex items-baseline gap-1">
                  42<span className="text-sm font-mono text-[var(--accent)]">s</span>
                </div>
                <div className="text-[11px] text-[var(--text-subtle)] mt-1 font-mono">Automated 1,420 employee cycle</div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-2)]/50 border border-[var(--border-subtle)]">
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
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/40 p-5 sm:p-6 font-mono text-xs overflow-hidden shadow-inner flex flex-col gap-4 max-h-[500px] overflow-y-auto">
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
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--warning-bg)] border border-[var(--warning)]/40 text-[var(--warning)] text-[11px] font-mono font-medium max-w-xl text-center">
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
                            <div className="p-3 rounded-lg bg-[var(--surface-2)]/80 border border-[var(--border-subtle)] font-mono text-[11px] space-y-1.5">
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
                            <div className="p-2.5 rounded-lg bg-[var(--accent-bg)] border border-[var(--accent)]/30 text-[11px] font-mono flex items-center justify-between">
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
                            : "bg-[var(--surface-2)]/60 border-[var(--border-subtle)] hover:border-[var(--border)] hover:bg-[var(--surface-2)]"
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
                    className="mt-6 p-6 rounded-xl bg-[var(--surface-2)]/80 border border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-6"
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
          <div className="p-8 sm:p-10 rounded-2xl bg-[var(--surface-1)]/70 border border-[var(--border)] backdrop-blur-xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-bg)] border border-[var(--accent)]/30 text-[var(--accent-hover)] font-mono text-[10px] uppercase tracking-widest mb-3">
                  <Database className="w-3.5 h-3.5" />
                  <span>Distributed Database Optimization & Telemetry</span>
                </div>
                <h3 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] uppercase tracking-tight">
                  High-Throughput Batch Optimization & Telemetry
                </h3>
                <p className="text-[var(--text-secondary)] font-sans text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
                  Engineered distributed performance overhaul for core batch calculations servicing 150K–200K active employee records across multi-tenant environments. Eliminated cascading N+1 database queries via bulk replica joins and built resilient asynchronous request logging queues with automatic reconnect retry.
                </p>
              </div>

              {/* Benchmark Metric View Selector */}
              <div className="flex items-center gap-1.5 bg-[var(--surface-2)] p-1.5 rounded-xl border border-[var(--border)] shrink-0">
                <button
                  onClick={() => setBenchmarkView("queries")}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                    benchmarkView === "queries"
                      ? "bg-[var(--surface-1)] text-[var(--text-primary)] shadow-sm font-bold border border-[var(--border)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  DB Queries
                </button>
                <button
                  onClick={() => setBenchmarkView("latency")}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                    benchmarkView === "latency"
                      ? "bg-[var(--surface-1)] text-[var(--text-primary)] shadow-sm font-bold border border-[var(--border)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Execution Latency
                </button>
                <button
                  onClick={() => setBenchmarkView("pool")}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                    benchmarkView === "pool"
                      ? "bg-[var(--surface-1)] text-[var(--text-primary)] shadow-sm font-bold border border-[var(--border)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Connection Pool
                </button>
              </div>
            </div>

            {/* Metrics HUD Row (THE DATA) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-8 border-b border-[var(--border-subtle)]">
              <div className="p-4 rounded-xl bg-[var(--surface-2)]/50 border border-[var(--border-subtle)]">
                <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Database Query Reduction</div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mt-1 flex items-baseline gap-1">
                  -99.7<span className="text-sm font-mono text-[var(--accent)]">%</span>
                </div>
                <div className="text-[11px] text-[var(--text-subtle)] mt-1 font-mono">1,004 down to 3 batched queries</div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-2)]/50 border border-[var(--border-subtle)]">
                <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Batch Runtime Speedup</div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mt-1 flex items-baseline gap-1">
                  19<span className="text-sm font-mono text-[var(--success)]">x Faster</span>
                </div>
                <div className="text-[11px] text-[var(--text-subtle)] mt-1 font-mono">34.2s down to 1.8s per 1K batch</div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-2)]/50 border border-[var(--border-subtle)]">
                <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider">DB Pool Saturation</div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mt-1 flex items-baseline gap-1">
                  8<span className="text-sm font-mono text-[var(--accent)]">%</span>
                </div>
                <div className="text-[11px] text-[var(--text-subtle)] mt-1 font-mono">Relieved 94% pool exhaustion</div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-2)]/50 border border-[var(--border-subtle)]">
                <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Dropped Telemetry Logs</div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mt-1 flex items-baseline gap-1">
                  0<span className="text-sm font-mono text-[var(--success)]">Rows</span>
                </div>
                <div className="text-[11px] text-[var(--text-subtle)] mt-1 font-mono">Resilient async queue with retry</div>
              </div>
            </div>

            {/* INTERACTIVE BENCHMARK & QUERY VISUALIZER (GRAPHS & SLIDER) */}
            <div className="pt-8">
              {/* Interactive Scale Slider Control */}
              <div className="p-6 rounded-xl bg-[var(--surface-2)]/50 border border-[var(--border)] mb-8">
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
                      {employeeScale.toLocaleString()}
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

              {/* Comparative Visual Graph Bars */}
              <div className="p-6 sm:p-8 rounded-xl bg-[var(--surface-2)]/30 border border-[var(--border)]">
                <div className="flex items-center justify-between mb-6">
                  <div className="font-mono text-xs text-[var(--text-primary)] uppercase tracking-wider font-bold flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[var(--accent)]" />
                    <span>
                      {benchmarkView === "queries" && "Total Database Roundtrips Generated"}
                      {benchmarkView === "latency" && "Batch Computation Latency (Wall-clock Seconds)"}
                      {benchmarkView === "pool" && "Database Connection Pool Saturation"}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[var(--success)] font-bold">
                    {benchmarkData.querySavings}% Database Load Reduction
                  </span>
                </div>

                {/* Graph Item 1: Legacy Iterative Pipeline (N+1) */}
                <div className="mb-6">
                  <div className="flex items-center justify-between font-mono text-xs mb-2">
                    <span className="text-[var(--text-muted)]">
                      Legacy Architecture (Iterative Per-Employee Query Loop):
                    </span>
                    <span className="text-[#EF4444] font-bold">
                      {benchmarkView === "queries" && `${benchmarkData.unoptQueries.toLocaleString()} Queries`}
                      {benchmarkView === "latency" && `${benchmarkData.unoptLatency}s (High Latency)`}
                      {benchmarkView === "pool" && `${benchmarkData.unoptPool}% Saturation (Critical)`}
                    </span>
                  </div>
                  <div className="w-full h-8 bg-[var(--surface-2)] rounded-lg overflow-hidden border border-[var(--border-subtle)] relative">
                    <motion.div
                      className="h-full bg-gradient-to-r from-red-500/70 to-red-600 rounded-lg flex items-center justify-end pr-3 font-mono text-xs text-white font-bold"
                      initial={{ width: "20%" }}
                      animate={{ 
                        width: `${benchmarkView === "queries" ? Math.min(100, (benchmarkData.unoptQueries / 10004) * 100) : benchmarkView === "latency" ? Math.min(100, (Number(benchmarkData.unoptLatency) / 342) * 100) : benchmarkData.unoptPool}%` 
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="drop-shadow-sm">O(N) Complexity</span>
                    </motion.div>
                  </div>
                </div>

                {/* Graph Item 2: Optimized Batch Read-Replica Pipeline */}
                <div>
                  <div className="flex items-center justify-between font-mono text-xs mb-2">
                    <span className="text-[var(--text-muted)]">
                      Optimized Architecture (Bulk Read-Replica Join + In-Memory Preload):
                    </span>
                    <span className="text-[#22C55E] font-bold">
                      {benchmarkView === "queries" && `${benchmarkData.optQueries} Batched Queries`}
                      {benchmarkView === "latency" && `${benchmarkData.optLatency}s (Sub-second)`}
                      {benchmarkView === "pool" && `${benchmarkData.optPool}% Healthy Capacity`}
                    </span>
                  </div>
                  <div className="w-full h-8 bg-[var(--surface-2)] rounded-lg overflow-hidden border border-[var(--border-subtle)] relative">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500/80 to-emerald-600 rounded-lg flex items-center justify-end pr-3 font-mono text-xs text-white font-bold"
                      initial={{ width: "3%" }}
                      animate={{ 
                        width: `${benchmarkView === "queries" ? 4 : benchmarkView === "latency" ? Math.max(3, (Number(benchmarkData.optLatency) / 342) * 100) : benchmarkData.optPool}%` 
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="drop-shadow-sm">O(1) Flat</span>
                    </motion.div>
                  </div>
                </div>

                {/* Architectural Explanations Row */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-[var(--border-subtle)] text-xs font-sans">
                  <div className="p-4 rounded-lg bg-[var(--surface-2)]/60 border border-[var(--border-subtle)]">
                    <strong className="text-[var(--text-primary)] block mb-1 font-semibold">1. Bulk Replica Preloads:</strong>
                    <p className="text-[var(--text-muted)] leading-relaxed">
                      Eliminated the per-employee query cascade by materializing tenant company registers in one read-replica call and performing in-memory hash index joining.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[var(--surface-2)]/60 border border-[var(--border-subtle)]">
                    <strong className="text-[var(--text-primary)] block mb-1 font-semibold">2. Resilient Telemetry Queue:</strong>
                    <p className="text-[var(--text-muted)] leading-relaxed">
                      Decoupled API response cycles from DB audit writes using an asynchronous request_queue with immediate single retry to survive broker disconnects.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[var(--surface-2)]/60 border border-[var(--border-subtle)]">
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
          <div className="p-8 sm:p-10 rounded-2xl bg-[var(--surface-1)]/70 border border-[var(--border)] backdrop-blur-xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--warm)]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-bg)] border border-[var(--accent)]/30 text-[var(--accent-hover)] font-mono text-[10px] uppercase tracking-widest mb-3">
                  <Gauge className="w-3.5 h-3.5" />
                  <span>High-Scale Frontend Virtualization</span>
                </div>
                <h3 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] uppercase tracking-tight">
                  High-Throughput Virtualized Pay Register
                </h3>
                <p className="text-[var(--text-secondary)] font-sans text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
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

            {/* Performance Telemetry Comparative HUD */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-8 border-b border-[var(--border-subtle)]">
              <div className="p-4 rounded-xl bg-[var(--surface-2)]/50 border border-[var(--border-subtle)]">
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

              <div className="p-4 rounded-xl bg-[var(--surface-2)]/50 border border-[var(--border-subtle)]">
                <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Mounted DOM Nodes</div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mt-1 flex items-baseline gap-1">
                  {isOptimized ? "28" : "1,120+"}<span className="text-sm font-mono text-[var(--accent)]">Nodes</span>
                </div>
                <div className="text-[11px] text-[var(--text-subtle)] mt-1 font-mono">
                  {isOptimized ? "Fixed O(1) viewport bound" : "Full unvirtualized thrashing"}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-2)]/50 border border-[var(--border-subtle)]">
                <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Memory Footprint</div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mt-1 flex items-baseline gap-1">
                  {isOptimized ? "14.2" : "186.0"}<span className="text-sm font-mono text-[var(--warm-light)]">MB</span>
                </div>
                <div className="text-[11px] text-[var(--text-subtle)] mt-1 font-mono">
                  {isOptimized ? "-92% garbage collection overhead" : "High GC pause pressure"}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-2)]/50 border border-[var(--border-subtle)]">
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
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/40 overflow-hidden shadow-inner">
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
                          className="grid grid-cols-7 px-4 items-center border-b border-[var(--border-subtle)]/60 font-mono text-xs hover:bg-[var(--surface-3)]/60 transition-colors"
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
                <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--surface-2)]/90 border-t border-[var(--border)] font-mono text-[10px] text-[var(--text-muted)]">
                  <div>
                    SHOWING ROWS {startIndex + 1}–{Math.min(totalCount, endIndex)} OF {totalCount.toLocaleString()}
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
