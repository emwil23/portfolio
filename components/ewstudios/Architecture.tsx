"use client";

import { motion, useReducedMotion } from "framer-motion";

const duration = 0.2;
export function Architecture({ nodes, description, compact = false, platform = false }: { nodes: readonly string[]; description: string; compact?: boolean; platform?: boolean }) {
  const reduced = useReducedMotion();
  return <figure className={`ew-architecture ${compact ? "ew-architecture-compact" : ""}`}>
    <svg className="ew-diagram-wide" viewBox={platform ? "0 0 1000 260" : "0 0 1000 150"} role="img" aria-label={description}>
      {nodes.map((node, i) => <g key={node}>
        {i > 0 && <><motion.path initial={false} whileInView={reduced ? undefined : { opacity: [0.35, 1] }} viewport={{ once: true }} transition={{ duration, delay: i * duration }} d={`M${(i - 1) * 200 + 178} 65h32`} /><path d={`M${i * 200 + 3} 60l7 5-7 5`} fill="none" stroke="currentColor" /></>}
        <rect x={i * 200 + 12} y="25" width="166" height="80" rx="12" />
        <text x={i * 200 + 95} y="69" textAnchor="middle">{node}</text>
        <text className="ew-node-number" x={i * 200 + 24} y="125">0{i + 1}</text>
      </g>)}
      {platform && <g>
        <path d="M95 170v-65m-5 5 5-5 5 5M295 170v-65m-5 5 5-5 5 5M495 170v-65m-5 5 5-5 5 5" />
        <rect x="12" y="170" width="166" height="56" rx="10" /><text x="95" y="204" textAnchor="middle">Source CDN media</text>
        <rect x="212" y="170" width="366" height="56" rx="10" /><text x="395" y="204" textAnchor="middle">Supabase / identity + atomic quota</text>
        <text x="620" y="204">Queues and caches: process memory</text>
      </g>}
    </svg>
    <svg className="ew-diagram-phone" viewBox="0 0 320 490" role="img" aria-label={description}>
      {nodes.map((node, i) => <g key={node}>
        {i > 0 && <path d={`M160 ${i * 98 - 20}v18m-5-5 5 5 5-5`} />}
        <rect x="12" y={i * 98 + 4} width="296" height="72" rx="12" />
        <text x="160" y={i * 98 + 46} textAnchor="middle">{node}</text>
      </g>)}
    </svg>
    {platform && <p className="ew-caption">Supabase supplies identity beside the guards and the atomic quota. Source-CDN media goes straight to the browser. Queues and caches remain in one process.</p>}
    <figcaption>{description}</figcaption>
  </figure>;
}
