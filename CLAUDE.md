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

Two-page portfolio: Next.js 14 App Router, React 18, Tailwind 3, Framer Motion 11, three.js, lucide-react. Routes: `/` (`app/page.tsx`) and `/case-studies/` (`app/case-studies/page.tsx`). No API, no CMS.

**Page composition.** Both pages are client components that read as one scrolling story over a shared 3D backdrop.

- `app/page.tsx` owns one piece of state, `isReady`. While false it renders `Preloader` as an overlay and locks body scroll; the preloader calls `onComplete` to flip it. A module-level flag skips the preloader when you come back from the other page. Underneath, in order: `Stage`, `Nav`, `Hero` → `Interlude` (work, with the glimpse cards into the case studies) → `Interlude` + `ScaleLog` → `Interlude` + `PlayerOne` → `Interlude` + `ContactHandshake`. `Hero` receives `isLoaded` and holds its entrance animations until the preloader finishes. The page starts at the top unless the URL has a hash (`/#scale`), and sets `history.scrollRestoration = "manual"`.
- `app/case-studies/page.tsx`: `Stage`, `Nav`, `Story` (how this site's character was made) → `WeddingStory` (the tinaandemmanuel.me invitation; its images are copied from the separate Wedding repo into `public/assets/wedding/`) → `Interlude` + `CaseStudies` (the production case studies) → `ContactHandshake`. Its `<title>` comes from `app/case-studies/layout.tsx`.

**Story beats.** `components/Interlude.tsx` is a tall section with a sticky screen: a step label, title and body on one side, and optionally the character playing a clip (`character="wave"` etc.) on the other. `Story.tsx` is a list of interludes. Each interlude sets `data-chapter="<scene>"`.

`PlayerOne.tsx` is not an interlude: it is two ordinary screens with its own violet wash, and `data-chapter="player"` on the first of them. Hovering, focusing or tapping a world card changes the character into that world's kit (a keyed still), fades in that world's backdrop clip and recolours the screen through the `--world` custom property; the clips are `preload="none"` and only the picked one plays, while the screen is in view. Stills and clips live in `public/assets/player/`, built by the last steps of `scripts/key-assets.sh`. The second screen is a photograph that leans towards the pointer and steps aside for its text when hovered.

**3D stage.** `components/Stage.tsx` is a fixed three.js canvas behind everything, loaded with `next/dynamic` (`ssr: false`). Its camera has one stop per `[data-chapter]` element in DOM order, looked up by scene name in the `stops` table in `measure()`; a new scene needs an entry there or the camera returns to the hero stop. Set-pieces (the green-screen frame, the ring of frames, gates, skyline, gems) only show on a page that has their scene. It reuses the ring maths exported from `Character.tsx` and reads its colours from the theme tokens (`--foreground`, `--background`, `--key`). The content sections have no background of their own, so their glass cards float over the stage.

**Scroll-driven sprites.** `components/Turnaround.tsx` steps through a sprite sheet by scroll position: he spins once while his chapter holds the screen. The home page's work chapter shows a glimpse image (`public/assets/glimpse/`, screenshots of the case studies page) in place of the character while a case study card is hovered or focused. The interlude marks itself `data-covered` meanwhile, and the stage fades its ring of frames out until the glimpse is gone.

**Character.** `components/Character.tsx` plays the keyed clips in `public/assets/character/` (built from `raw-assets/` by `scripts/key-assets.sh`): an idle loop, one-shot actions, and with `track` a sprite of head poses that follows the cursor.

**Content lives inside the components.** Each section defines its own typed interfaces and constant arrays at the top of its file (`WORKFLOW_GATES` in `CaseStudies.tsx`, `SDE2_INVARIANTS` in `ScaleLog.tsx`, `GAME_REALMS` in `PlayerOne.tsx`), then renders them. To change copy, edit the section file. `lib/data.ts` exports `portfolioData` but nothing imports it — contact details such as the email are hard-coded in `ContactHandshake.tsx` and can drift from it.

**Everything is a client component.** All of `components/` and both pages are `"use client"`; only the two `layout.tsx` files are server components. `CaseStudies.tsx` (~1,500 lines) contains several interactive simulations in one file.

**Theming.** Dark/light is class-based on `<html>` (`darkMode: "class"`), defaulting to `dark`:

- `app/layout.tsx` runs an inline script before paint that reads `localStorage["portfolio-theme"]`, falls back to `prefers-color-scheme`, and sets `dark`/`light` on `<html>` (hence `suppressHydrationWarning`).
- The toggle lives in `Nav.tsx` and writes the same key.
- Colors are CSS custom properties defined in `app/globals.css` under `:root` (light) and `html.dark`. Components consume them as Tailwind arbitrary values — `bg-[var(--surface-1)]`, `text-[var(--text-muted)]`, `border-[var(--border)]` — rather than Tailwind's palette. Only `background`, `foreground` and `accent` are mapped in `tailwind.config.ts`. New colors belong in both theme blocks in `globals.css`.
- `globals.css` also holds the shared utility classes: `glass-panel`, `bg-grid-pattern`, `bg-radial-glow`, and the cyclorama backgrounds. `StudioBackground` is the reusable component form of the studio backdrop.

**Fonts** are loaded from Google Fonts via `<link>` in `layout.tsx` (not `next/font`) and exposed as `font-display` (Montserrat), `font-sans` (Inter), `font-mono` (JetBrains Mono).

**Hydration.** Anything locale- or time-dependent must be deterministic or deferred to `useEffect`. Number formatting passes an explicit locale (`formatINR` / `formatNumber` in `CaseStudies.tsx`); the clock and theme state in `Nav.tsx` are set after mount.

**Imports** use the `@/*` alias mapped to the repo root (`@/components/Preloader`).

## Conventions

`AGENTS.md` holds the project's engineering conventions (cross-browser/Safari handling, `prefers-reduced-motion`, client-boundary and hydration rules, Core Web Vitals, SEO/semantic landmarks) and the index of skills in `.agents/skills/`. Follow it.

`.agents/`, `.claude/`, `agent/` and `skills-lock.json` are gitignored — local tooling, not part of the site.
