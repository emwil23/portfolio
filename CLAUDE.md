# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # Next dev server at http://localhost:3000
npm run build   # Static export to ./out (this is what CI runs)
npx tsc --noEmit  # Type-check only
```

- Append `?skip=true` to the URL to bypass the preloader during development.
- `npm run lint` is not usable yet: ESLint is not installed and there is no ESLint config, so `next lint` drops into an interactive setup prompt.
- There is no test framework or test suite. `npm run build` plus `npx tsc --noEmit` are the only automated checks.
- `npm run start` does not apply — the site is a static export (`output: "export"`), so serve `./out` instead if you need to check the production build.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which runs `npm ci` + `next build` on Node 20 and publishes `./out` to GitHub Pages. Every push to `main` is a production deploy.

Constraints that follow from static export:

- No server runtime: no route handlers, server actions, middleware, or request-time data fetching.
- `images.unoptimized: true` — `next/image` does no resizing or format conversion. Ship pre-sized `.webp` files in `public/assets/` (the existing images keep a `.png` original alongside the `.webp` that is actually referenced).
- `trailingSlash: true`.
- Assets are referenced by absolute path (`/assets/...`) in `<video>`, `<link rel="preload">` and `next/image`, with no `basePath` in `next.config.mjs`. Raw `<video>`/`<link>` paths will not be rewritten if the site is ever served from a sub-path.

## Architecture

Single-page portfolio: Next.js 14 App Router, React 18, Tailwind 3, Framer Motion 11, lucide-react. One route (`app/page.tsx`), no API, no CMS.

**Page composition.** `app/page.tsx` is a client component that owns one piece of state, `isReady`. While false it renders `Preloader` as an overlay and locks body scroll; the preloader calls `onComplete` to flip it. All sections are mounted underneath from the start, in order: `Hero` → `CaseStudies` → `ScaleLog` → `PlayerOne` → `ContactHandshake`. `Hero` receives `isLoaded` and holds its entrance animations until the preloader finishes. The page also forces scroll-to-top and sets `history.scrollRestoration = "manual"`.

**Content lives inside the components.** Each section defines its own typed interfaces and constant arrays at the top of its file (`WORKFLOW_GATES` in `CaseStudies.tsx`, `SDE2_INVARIANTS` in `ScaleLog.tsx`, `GAME_REALMS` in `PlayerOne.tsx`), then renders them. To change copy, edit the section file. `lib/data.ts` exports `portfolioData` but nothing imports it — contact details such as the email are hard-coded in `ContactHandshake.tsx` and can drift from it.

**Everything is a client component.** All of `components/` and `app/page.tsx` are `"use client"`; only `app/layout.tsx` is a server component. `CaseStudies.tsx` (~1,500 lines) contains several interactive simulations in one file.

**Theming.** Dark/light is class-based on `<html>` (`darkMode: "class"`), defaulting to `dark`:

- `app/layout.tsx` runs an inline script before paint that reads `localStorage["portfolio-theme"]`, falls back to `prefers-color-scheme`, and sets `dark`/`light` on `<html>` (hence `suppressHydrationWarning`).
- The toggle lives in `Hero.tsx` and writes the same key.
- Colors are CSS custom properties defined in `app/globals.css` under `:root` (light) and `html.dark`. Components consume them as Tailwind arbitrary values — `bg-[var(--surface-1)]`, `text-[var(--text-muted)]`, `border-[var(--border)]` — rather than Tailwind's palette. Only `background`, `foreground` and `accent` are mapped in `tailwind.config.ts`. New colors belong in both theme blocks in `globals.css`.
- `globals.css` also holds the shared utility classes: `glass-panel`, `bg-grid-pattern`, `bg-radial-glow`, and the cyclorama backgrounds. `StudioBackground` is the reusable component form of the studio backdrop.

**Fonts** are loaded from Google Fonts via `<link>` in `layout.tsx` (not `next/font`) and exposed as `font-display` (Montserrat), `font-sans` (Inter), `font-mono` (JetBrains Mono).

**Hydration.** Anything locale- or time-dependent must be deterministic or deferred to `useEffect`. Number formatting passes an explicit locale (`formatINR` / `formatNumber` in `CaseStudies.tsx`); the clock and theme state in `Hero.tsx` are set after mount.

**Imports** use the `@/*` alias mapped to the repo root (`@/components/Preloader`).

## Conventions

`AGENTS.md` holds the project's engineering conventions (cross-browser/Safari handling, `prefers-reduced-motion`, client-boundary and hydration rules, Core Web Vitals, SEO/semantic landmarks) and the index of skills in `.agents/skills/`. Follow it.

`.agents/`, `.claude/`, `agent/` and `skills-lock.json` are gitignored — local tooling, not part of the site.
