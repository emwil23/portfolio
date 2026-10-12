/** Shown at once when a link to the case studies is clicked, until the page is ready. */
export default function Loading() {
  return (
    <div role="status" className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-[var(--background)]">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--key)] motion-reduce:animate-none" />
      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Opening case studies</span>
    </div>
  );
}
