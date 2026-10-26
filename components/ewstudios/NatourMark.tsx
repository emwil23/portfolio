// Original SVG mark from natour/src/components/Logo.tsx; no visual redesign.
export function NatourMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#1b2420" />
      <path
        d="M12.6 12.8 20.4 21"
        fill="none"
        stroke="#ff8a5c"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="0 3.8"
      />
      <path
        d="M9.5 24V9.5M22.5 23v-6.6"
        fill="none"
        stroke="#f4efe6"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M22.5 16.8c-2.9-3.3-3.8-5-3.8-6.6a3.8 3.8 0 0 1 7.6 0c0 1.6-.9 3.3-3.8 6.6Z"
        fill="#ff8a5c"
      />
      <circle cx="22.5" cy="10.2" r="1.4" fill="#1b2420" />
    </svg>
  )
}

