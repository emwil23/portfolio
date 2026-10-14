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

Pushing to `main` triggers `.github/workflows/deploy.yml`, which runs `npm ci` + `next build` on Node 20 and publishes `./out` to GitHub Pages. Every push to `main` is a production deploy. The site is served at `https://emmanuelwilson.tech` (`public/CNAME`), from the root, over enforced HTTPS. Sharing and search metadata (canonical, Open Graph, Twitter, JSON-LD) is in the two `layout.tsx` files; `public/robots.txt` and `public/sitemap.xml` list both pages.

Constraints that follow from static export:

- No server runtime: no route handlers, server actions, middleware, or request-time data fetching.
- `images.unoptimized: true` — `next/image` does no resizing or format conversion. Ship pre-sized `.webp` files in `public/assets/` (the existing images keep a `.png` original alongside the `.webp` that is actually referenced).
- `trailingSlash: true`.
- Assets are referenced by absolute path (`/assets/...`) in `<video>`, `<link rel="preload">` and `next/image`, with no `basePath` in `next.config.mjs`. Raw `<video>`/`<link>` paths will not be rewritten if the site is ever served from a sub-path.

## Architecture

Two-page portfolio: Next.js 14 App Router, React 18, Tailwind 3, Framer Motion 11, three.js, lucide-react. Routes: `/` (`app/page.tsx`) and `/case-studies/` (`app/case-studies/page.tsx`). No API, no CMS.

**Page composition.** Both pages are client components that read as one scrolling story over a shared 3D backdrop.

- `app/page.tsx` owns one piece of state, `isReady`. While false it renders `Preloader` as an overlay and locks body scroll; the preloader calls `onComplete` to flip it. A module-level flag skips the preloader when you come back from the other page. Underneath, in order: `Stage`, `Nav`, `Hero` → `Interlude` (work, with the glimpse cards into the case studies) → `Interlude` + `ScaleLog` → `PlayerOne` → `ContactHandshake`. The last two carry their own `data-chapter` (`player`, `shake`) instead of sitting behind an interlude. `Hero` receives `isLoaded` and holds its entrance animations until the preloader finishes. The page starts at the top unless the URL has a hash (`/#scale`), and sets `history.scrollRestoration = "manual"`.
- `app/case-studies/page.tsx`: `Stage`, `Nav`, `Story` (how this site's character was made) → `WeddingStory` (the tinaandemmanuel.me invitation; its images are copied from the separate Wedding repo into `public/assets/wedding/`) → `Interlude` + `CaseStudies` (the production case studies) → `ContactHandshake`. Its `<title>` comes from `app/case-studies/layout.tsx`.

**Story beats.** `components/Interlude.tsx` is a tall section with a sticky screen: a step label, title and body on one side, and optionally the character playing a clip (`character="wave"` etc.) on the other. `Story.tsx` is a list of interludes. Each interlude sets `data-chapter="<scene>"`.

`PlayerOne.tsx` is not an interlude: it is two ordinary screens with its own violet wash, and `data-chapter="player"` on the first of them. Hovering, focusing or tapping a world card changes the character into that world's kit (a keyed still), fades in that world's backdrop clip and recolours the screen through the `--world` custom property; the clips are `preload="none"` and only the picked one plays, while the screen is in view. Stills and clips live in `public/assets/player/`, built by the last steps of `scripts/key-assets.sh`. The second screen is a photograph that leans towards the pointer and steps aside for its text when hovered.

`ContactHandshake.tsx` is one screen on both pages: the four ways to reach him as rows, and beside them a looping clip of him at his desk (`public/assets/character/desk.webm`, VP9 with alpha). There is no HEVC encode of that clip, so Apple browsers, reduced-motion users and lite visits get its first frame, `desk.webp`; the clip itself only loads once the section is near.

**Loading and quality.** `lib/boot.ts` holds what the visit can afford: `ready` (media may load), `lite` (phones, and connections that ask to save data or report 2G/3G) and `mobile`. The static HTML renders every character clip without sources and the cursor sprite and stage not at all, so the preloader's own clip (`CharacterClip eager`, which picks its variant by screen size with `<source media>`) is the only media the browser fetches first. The preloader then downloads every file the home page uses (`homeAssets()` in `Preloader.tsx`: clips, sprites, stills, the Player 1 backdrops, the desk clip and the stage's code) into the browser cache, all at once, with the percentage counting real bytes, and only then sets `ready`; a file added to the home page belongs in that list. It lets the visitor in after 60 s whatever is still missing, and says "Best experienced on a desktop" on phones. `lite` means the `-lite` clips (560px tall, built from the full ones by `scripts/lite-assets.sh`), `look-small.webp` for the cursor sprite, a lighter stage, and no desk clip. The case studies page and visits that skip the preloader call `release()` on mount. The desk clip also waits until the contact section is near.

**Opacity on theme colours.** Tailwind 3 silently drops `bg-[var(--x)]/80` (an opacity modifier on a CSS variable). Write `bg-[color:color-mix(in_srgb,var(--x)_80%,transparent)]` instead, as the rest of the code does.

**3D stage.** `components/Stage.tsx` is a fixed three.js canvas behind everything, loaded with `next/dynamic` (`ssr: false`). Its camera has one stop per `[data-chapter]` element in DOM order, looked up by scene name in the `stops` table in `measure()`; a new scene needs an entry there or the camera returns to the hero stop. Set-pieces (the green-screen frame, the ring of frames, gates, skyline, gems) only show on a page that has their scene. It reuses the ring maths exported from `Character.tsx` and reads its colours from the theme tokens (`--foreground`, `--background`, `--key`). The content sections have no background of their own, so their glass cards float over the stage.

**Scroll-driven sprites.** `components/Turnaround.tsx` steps through a sprite sheet by scroll position: he spins once while his chapter holds the screen. The home page's work chapter shows a glimpse image (`public/assets/glimpse/`, screenshots of the case studies page) in place of the character while a case study card is hovered or focused. The interlude marks itself `data-covered` meanwhile, and the stage fades its ring of frames out until the glimpse is gone.

**Character.** `components/Character.tsx` plays the keyed clips in `public/assets/character/` (built from `raw-assets/` by `scripts/key-assets.sh`, which needs macOS for its HEVC step; on Windows run the individual ffmpeg lines): an idle loop (with `idle.webp`, its first frame, as the poster, so he shows where iOS refuses autoplay, as in Low Power Mode; the first tap retries `play()`), one-shot actions, and with `track` a sprite of head poses that follows the cursor. Each clip has a `-lite` twin (`scripts/lite-assets.sh`) for phones and slow connections. Safari's HEVC clips have their keyed-out pixels painted black (`CLEAR` in the scripts), or a blue halo shows round him.

**Content lives inside the components.** Each section defines its own typed interfaces and constant arrays at the top of its file (`WORKFLOW_GATES` in `CaseStudies.tsx`, `SDE2_INVARIANTS` in `ScaleLog.tsx`, `GAME_REALMS` in `PlayerOne.tsx`), then renders them. To change copy, edit the section file. `lib/data.ts` exports `portfolioData` but nothing imports it — contact details such as the email are hard-coded in `ContactHandshake.tsx` and can drift from it.

**Everything is a client component.** All of `components/` and both pages are `"use client"`; only the two `layout.tsx` files are server components. `CaseStudies.tsx` (~1,500 lines) contains several interactive simulations in one file.

**Safari.** The hero name inverts with `mix-blend-mode: difference`, which Safari does not apply against the WebGL stage; `.hero-name` in `globals.css` gives Safari the theme colour instead. Test visual changes in WebKit as well as Chrome.

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
