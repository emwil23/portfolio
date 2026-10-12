# AGENTS.md — Development Guidelines & Installed Skills

This document guides AI coding agents working on Emmanuel Wilson's Portfolio codebase. All agents must follow the principles, conventions, and skills registered below to maintain top-tier performance, accessibility, SEO ranking, and cross-browser reliability.

---

## 🚀 Installed Skills in `.agents/skills`

The following skills are installed and natively discoverable in `.agents/skills/`:

### Next.js & React Architecture
- **`next-best-practices`** (`.agents/skills/next-best-practices/`):
  Next.js 14/15 file conventions, RSC boundaries, data patterns, async APIs, error handling, route handlers, image/font optimization, bundling, and hydration debugging.
- **`nextjs-app-router-patterns`** (`.agents/skills/nextjs-app-router-patterns/`):
  Full App Router patterns: Server Components, Server Actions, streaming, parallel routes, loading states, and client boundary segregation.

### Performance, Core Web Vitals & SEO
- **`performance`** (`.agents/skills/performance/`):
  Web performance optimization, payload reduction, asset preloading, script scheduling, and zero-runtime bloat.
- **`core-web-vitals`** (`.agents/skills/core-web-vitals/`):
  Optimization of LCP (Largest Contentful Paint), INP (Interaction to Next Paint), and CLS (Cumulative Layout Shift).
- **`seo`** (`.agents/skills/seo/`):
  Search engine visibility, semantic HTML, Open Graph/Twitter meta tags, structured data (JSON-LD), robots, and sitemaps.
- **`web-quality-audit`** (`.agents/skills/web-quality-audit/`):
  Systematic audits covering performance, accessibility, SEO, best practices, and browser compatibility.

### UI, Cross-Browser Compatibility & Accessibility
- **`responsive-design`** (`.agents/skills/responsive-design/`):
  Mobile-first layout strategies, fluid typography, flex/grid architectures, and cross-browser resilience (WebKit/Safari, Chromium, Firefox).
- **`tailwind-design-system`** (`.agents/skills/tailwind-design-system/`):
  Design tokens, responsive utility conventions, and harmonious component layouts.
- **`accessibility`** (`.agents/skills/accessibility/`), **`accessibility-compliance`** (`.agents/skills/accessibility-compliance/`), **`wcag-audit-patterns`** (`.agents/skills/wcag-audit-patterns/`):
  WCAG 2.2 AA standards, ARIA landmark roles, semantic DOM tags, keyboard focus rings, and screen reader compatibility.

### Animation, Motion Systems & 3D
- **`framer-motion-animator`** (`.agents/skills/framer-motion-animator/`):
  Framer Motion orchestrations: variants, staggering, layout animations, scroll-driven triggers, gesture handling, and exit transitions.
- **`motion-foundations`**, **`motion-patterns`**, **`motion-advanced`** (`.agents/skills/motion-*/`, from `affaan-m/ECC`):
  Motion tokens and spring presets, reduced-motion and SSR-safe initial states, UI patterns (stagger, `AnimatePresence`, scroll, layout), and advanced work (drag, gestures, SVG, text, `useAnimate`). **Project override:** this repo uses `framer-motion` v11, so keep importing from `framer-motion` — ignore the skills' "`motion/react` only" rule, and treat `lib/motion-tokens.ts` as a suggestion, not an existing file.
- **`ui-animation`** (`.agents/skills/ui-animation/`):
  GPU-accelerated UI animation rules: strict `transform`/`opacity` isolation, 200–300ms timing windows, spring physics, and CSS-first implementations.
- **`threejs-animation`** (`.agents/skills/threejs-animation/`):
  Three.js animation systems: AnimationMixer, AnimationClip, skeletal mesh animations, morph targets, and animation blending.

### Code Quality, Security & Automated Review
- **`code-review-expert`** (`.agents/skills/code-review-expert/`):
  Senior engineering lens review with SOLID principles, security vulnerability checks (XSS, injection, SSRF), performance anti-patterns (N+1 queries, memory leaks, unneeded re-renders), and P0–P3 priority triage.
- **`code-review-skill`** (`.agents/skills/code-review-skill/` and `~/.claude/skills/code-review-skill`):
  Multi-ecosystem code review patterns covering TypeScript, React 19, CSS, performance, architecture, 6-tier severity classification (blocking to praise), and four-phase review process.

### TypeScript Architecture, Type Safety & Testing
- **`mastering-typescript`** (`.agents/skills/mastering-typescript/`):
  Enterprise TypeScript patterns: advanced generics, mapped types, conditional types, `satisfies` operator, Zod validation schemas, and React integration.
- **`typescript-clean-code`** (`.agents/skills/typescript-clean-code/`):
  Clean code heuristics, type hygiene (`any` leakage prevention, exhaustiveness, strict checks, branded types), refactoring recipes, and PR review principles.
- **`typescript-unit-testing`** (`.agents/skills/typescript-unit-testing/`):
  AAA structure, DeepMocked mocks, in-memory testing strategies, and isolated unit test suites.
- **`typescript-e2e-testing`** (`.agents/skills/typescript-e2e-testing/`):
  Given-When-Then patterns, E2E testing strategies, TDD workflows, and integration test architectures.

### Build Tools, Monorepo Management & Task Pipelines
- **`turborepo`** (`.agents/skills/turborepo/`):
  Turborepo pipelines, caching, remote caching, hash inputs/outputs, and CI build acceleration.
- **`nx-workspace` & `nrwl/nx-ai-agents-config` suite** (`.agents/skills/nx-*/`):
  Nx workspace graph analysis, code generation (`nx-generate`), task execution (`nx-run-tasks`), and CI monitoring/self-healing (`monitor-ci`).
- **`monorepo-management`** (`.agents/skills/monorepo-management/`):
  Monorepo architectures, workspace package linking, boundary rules, and dependency management.
- **`vite`** & **`vitepress`** (`.agents/skills/vite/`, `.agents/skills/vitepress/`):
  Anthony Fu's official Vite build configuration, plugin architecture, SSR, Rolldown transitions, and VitePress static documentation generators.

### Browser Automation, E2E Testing & DevTools Verification
- **`agent-browser`** (`.agents/skills/agent-browser/`):
  Vercel Labs fast browser automation: page navigation, interactive controls, snapshots, visual audits, and automated validation.
- **`chrome-devtools`** (`.agents/skills/chrome-devtools/`):
  Chrome DevTools Protocol automation: console & network log inspection, JS evaluation, performance timeline tracing, and Core Web Vitals analysis.
- **`playwright-skill`** (`.agents/skills/playwright-skill/`) & **`playwright-best-practices`** (`.agents/skills/playwright-best-practices/`):
  Playwright E2E suite, visual regression, accessibility tree tests (axe-core), network mocking, and device emulation.
- **`webapp-testing`** (`.agents/skills/webapp-testing/`):
  Anthropic's official reconnaissance-then-action testing pattern for local web applications.

---

## 🛠️ Engineering Conventions for this Project

1. **Cross-Browser & Device Compatibility**:
   - Ensure animations and layouts function flawlessly across WebKit (Safari on macOS and iOS), Chromium, and Gecko (Firefox).
   - Beware of Safari-specific CSS gotchas (e.g., `-webkit-overflow-scrolling`, viewport height `dvh` vs `vh`, backdrop blur fallbacks).
   - Respect `prefers-reduced-motion` for Framer Motion animations.

2. **Hydration & Client Boundaries**:
   - Keep `'use client'` at the leaves of the component tree whenever possible.
   - Guard browser-specific APIs (`window`, `localStorage`, `matchMedia`) inside `useEffect` or safe checks to prevent hydration mismatches.

3. **Performance & Core Web Vitals**:
   - Preload critical above-the-fold assets (e.g., LCP images) using `<link rel="preload">` or `next/image` with `priority`.
   - Avoid layout shifts (`CLS`) by setting explicit aspect ratios or skeleton placeholders.
   - Minimize main thread blocking on user interaction (`INP < 200ms`).

4. **SEO & Ranking**:
   - Define comprehensive metadata in `layout.tsx` and route files (Title, Description, Open Graph images, Twitter card).
   - Use semantic landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
