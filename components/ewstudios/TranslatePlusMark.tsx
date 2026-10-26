// Original SVG mark from translateapp/src/components/Logo.tsx; no visual redesign.
export function TranslatePlusMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="var(--accent)" />
      <path d="M6 10h20" stroke="var(--accent-ink)" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 10v15" stroke="var(--accent-ink)" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M16 17.5c-3.6 0-6-1.6-6-4"
        fill="none"
        stroke="var(--accent-ink)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M21 19.5h5M23.5 17v5"
        stroke="var(--accent-ink)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

