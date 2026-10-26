// Original SVG mark from taskpilot/src/components/Logo.tsx; no visual redesign.
export function TaskPilotMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="var(--accent)" />
      <path
        d="M8 17.5l5 5L25 9.5"
        fill="none"
        stroke="var(--accent-ink)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="25" cy="9.5" r="2.2" fill="var(--accent-ink)" />
    </svg>
  )
}

