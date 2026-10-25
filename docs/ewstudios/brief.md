# EWSTUDIOS: five AI products, one $7 server

Step 1 — brief and design direction, awaiting owner approval. No pages or assets are built by this step.

## Scope and evidence

The story is a set of product and engineering decisions: five distinct experiences, backed by a deliberately small shared platform. Lead with the working product, explain the constraint, show the implementation choice, then show the evidence and its limits. The intended reader is a design lead or an engineer assessing SDE 2 judgment: ownership, trust boundaries, graceful failure, accessibility, performance and operational trade-offs.

App facts come only from the READMEs and docs in `D:\Code\AIPro\AIPro\ew-apps\`. Paths below are relative to that directory. A named README bullet is the precise source; implementation paths mentioned by a README are navigation aids, not independently audited evidence. Portfolio integration is based on its `CLAUDE.md`, `AGENTS.md`, `HANDOFF.md` and the existing components. External links inform art direction only.

Numbers below are documented observations, limits or design specifications, distinguished explicitly. New routes, section counts, the requested years and the Lighthouse target are requirements, not measured results. Do not turn a design specification or a README badge into a newly verified benchmark.

Read the portfolio instructions first. Its current local `main` and `origin/main` both resolve to `98ff27d54aeacb84f95fa98f993a452ac9852130`; the older hash in `HANDOFF.md` is historical. Only `.codex/` was untracked in the source checkout, and it must remain untouched. This brief is prepared on `ewstudios-case-studies` in an isolated scratch checkout because the source directory is read-only in this session. Remote freshness and push success must be reported separately; never push or merge `main`.

### Editorial guardrails

- No invented users, revenue, conversion, uptime, latency, test counts or savings. Use “live”, “open source” and “Pro planned” where supported. Public repository visibility still needs checking before an “open source” label goes live.
- The API README says **seven** apps share the server. The portfolio features **five**; it must not claim these are the server's only clients.
- The API README's “The idea” documents **one $7 Heroku dyno**. Use the approved headline, with a nearby qualification: “$7/month for the shared Heroku dyno, using free tiers elsewhere.” Do not claim an audited all-in bill: domain costs, model overages and future paid services are not established here.
- Local-first means browser storage, not that AI actions send nothing. TaskPilot's README explicitly sends selected task fields to AI while excluding notes and project names. Tell that boundary plainly.
- Credit AI-assisted development as the READMEs do: the owner directed the products; Claude Code wrote and tested code. Do not imply a team or an unassisted implementation.
- Natour has unverified-place fallback states. Avoid the absolute “every place is verified”: checked places get map coordinates; unavailable checks remain visibly “not checked” without pins.
- Terms discussions describe the documented implementation rationale as of the repo's recorded date, not an independent legal conclusion. Preserve source credits and recheck actual media use before publishing.

## 1. Information architecture

| Entry | Destination and purpose |
| --- | --- |
| Home work section | Add the fourth glimpse card, exactly “04 · EWSTUDIOS: five AI apps, one backend”. Link to `/case-studies/#ewstudios` so it opens the new studio chapter. |
| `/case-studies/#ewstudios` | Studio introduction, prominent “Read the platform study” link, then an index of five large app tiles. |
| `/work/ewstudios/` | Platform study: shared server, costs, authentication boundaries, validated prompts, quotas, streaming and failure behavior. |
| `/work/taskpilot/` | TaskPilot study. |
| `/work/pixe/` | Pixe study. |
| `/work/translateplus/` | Translate+ study; its source folder is `translateapp`. |
| `/work/willify/` | Willify study. |
| `/work/natour/` | Natour study. |

Place the studio chapter after WeddingStory and before the existing production-systems chapter on `/case-studies/`. Keep existing anchors working. Start with a short studio statement and a compact shared-server diagram, then let the five tiles carry the product differentiation. Tiles use each app's own colours, display type, an accurate poster and a short recording that plays on hover or keyboard focus. Touch gets a visible play control separate from the study link. Pause when a tile loses focus/hover or leaves view; only the active recording plays. Reduced motion shows the still and an explicit optional play control.

Study sequence: platform → TaskPilot → Pixe → Translate+ → Willify → Natour → studio index. Provide a persistent way back to the index. The platform page repeats the app index compactly; it is the hub, not a sixth app.

### Integration map for the later build

- `app/page.tsx`: extend the existing glimpse-card array and reuse its focus/hover image behavior and overlay transition.
- `components/Preloader.tsx`, `homeAssets()`: add only `/assets/glimpse/ewstudios.webp` to the existing glimpse still list. No app recordings, display fonts, character clips, architecture code or case-study bundles enter the home preloader. Ensure Next link prefetch does not fetch the new studies' heavy resources from home; use `prefetch={false}` for these links if needed.
- `app/case-studies/page.tsx`: compose the studio introduction and index using existing glass-panel and interlude conventions. Do not fold the new stories into the large `CaseStudies.tsx` simulation component.
- `components/Stage.tsx`: every new `[data-chapter]` name needs a stop in `measure()`'s `stops` table; its current fallback is the hero camera. Propose `ewstudio` and `ewindex` on the index chapter, `ewplatform` on the platform, and `ewtaskpilot`, `ewpixe`, `ewtranslateplus`, `ewwillify`, `ewnatour` on the app heroes. Determine coordinates against measured DOM positions, desktop and mobile; do not invent them in this brief. Scope set-piece visibility to the page's scenes and keep the camera transition to existing chapters smooth. Avoid a separate camera stop for every paragraph.
- `app/work/.../page.tsx` and route metadata: static pages with readable HTML; small client leaves for media, slider and SVG motion. Keep `output: "export"` and trailing slashes. No request-time backend or CMS.
- `app/globals.css` and page-scoped styles: consume existing theme tokens and glass utilities; route-scoped brand variables. Update `public/sitemap.xml`, canonical/OG/Twitter metadata and semantic landmarks when pages are built.
- `public/assets/`: future approved web media only. This run changes only this brief. No config, callers, exports, tests or fixtures need changing for Step 1.

## 2. One app-page template

Use one shared composition with app data held in the existing typed-constant style, without a CMS or a general page-builder system.

1. **Hero.** App name in its own display font, one sentence about its purpose, and a looping real screen recording in a CSS-drawn browser or phone frame. Facts strip: role, timeline, stack, live link and repository link. The READMEs support a 2021 origin and an October 2026 rebuild, not exact working hours or a project duration. Mark role wording and exact dates as owner confirmations. Label current links honestly; do not turn “Oct 2026” into “built in a weekend”.
2. **2021 → 2026.** A before/after drag slider with comparable, uncropped context and visible year labels. Use a native keyboard-operable range control with a meaningful label and accessible values. Also offer both images in a stacked view; no information requires dragging. Credit the original course/tutorial where the README describes that origin. If history cannot produce an authentic image, leave an explicit capture gap for approval rather than fabricate a before screen.
3. **The idea.** A short explanation of the design concept, the real SVG logo, labelled palette swatches and type specimens. Explain how the idea influences the working interface. Do not invent logo symbolism where the docs give none.
4. **Three engineering decisions.** Each is constraint → decision → result, with its source and documented number. Use diagrams or a focused screenshot to explain the difficult bit. A source without a measured outcome stays qualitative; numbers must retain their actual meaning.
5. **Architecture.** Animated inline SVG, readable as a still: labelled nodes, directional arrows, a concise caption and an equivalent text description. Animate a short path to illustrate one request, not a perpetual field of particles. Use Framer Motion and existing dependencies. Reduced motion draws the complete graph without animation.
6. **Quality proof.** Lighthouse, tests and axe shown as dated evidence with route, theme, device/profile, command and evidence link. Separate README-reported app results from future portfolio-page measurements. Do not show made-up test totals or a “passed” status before running checks.
7. **What's next.** A short, documented limitation and a proposed next improvement, explicitly labelled planned. No implied users or payment revenue. “Pro planned” is not a subscription-sales claim.
8. **Next study.** One large, clearly labelled link in the next app's palette, plus a quieter studio-index link. Motion must not be required to navigate.

Each page scopes `--world` to its app colour, following `PlayerOne.tsx`, with a display-font variable and supporting surface tokens. Keep Montserrat for portfolio navigation/chrome, Inter for the case-study body, and JetBrains Mono for facts, metrics and source captions. Load the app's display face only on its route, with a fallback that reserves space. Both themes need their documented accessible accent variants; bright brand colours are not automatically body-text colours on light surfaces.

The platform adapts the same visual grammar: server/cost hero → five-app context → three platform decisions → architecture → proof → limits → TaskPilot. It has no invented 2021 backend screenshot. The owner's existing 3D character appears only on this platform study among the new pages; do not capture the apps' developer portraits into app-study media.

## 3. Study content and source ledger

All source names in this section resolve under the `ew-apps` root stated above. Numbers are not generalized beyond the documented example or design specification.

### Platform — `/work/ewstudios/`

**Hook:** “Five different AI products. One $7 server. The shared work is deciding what the browser is allowed to ask for.”

| Decision | Constraint → decision → result, with evidence |
| --- | --- |
| Keep the trust boundary on the server | A shared model key must not become a general chatbot → clients send typed, capped data to server-owned templates, with validation, identity and quota guards → the quota increment and return happen in **one atomic SQL statement**, avoiding parallel calls slipping through. The region gate uses the **last** `X-Forwarded-For` entry because earlier entries can be forged. Sources: `ew-apps-api/README.md`, “Decisions worth explaining” → “Templates live on the server”, “The quota is one atomic SQL statement”, “The region block is on the server”. Referenced implementation: `src/app.ts`, `src/apps/`, `supabase/migrations/`. No claim that prompt injection is universally solved. |
| Stream within the host's deadline | Heroku drops a silent request after **30s** → begin streaming, send a blank-line keep-alive every **10 seconds** while waiting, and abort the model at **25s** → clients receive partial output and an explicit upper bound, rather than waiting for a silent router failure. Keep-alives stop at the first model chunk so a translation's line breaks remain intact. Sources: `ew-apps-api/README.md`, “Streaming, with a 25s stop”, “Keep-alives stop at the first chunk”, “JSON Lines output”. These are configured behaviors, not latency percentiles. |
| Share infrastructure, keep app data local | Five featured products need shared AI identity and budgets → static Workers frontends, shared Supabase identity/quota and **one $7** Heroku dyno; a **6-digit** email code is the fallback → product data remains local while free-server AI has shared identity. Sources: `ew-apps-api/README.md` → “The idea”, “The IP limit is in memory”; `taskpilot/README.md` and `pixe/README.md` → “One sign-in for every EWSTUDIOS app”. Those READMEs explain the single passkey domain; the Public Suffix List reason is not documented in the allowed sources. Natour explicitly uses email code only. Never depict shared sign-in as shared task/board/library storage. |

**SVG:** app browsers → Hono guards (region/IP/JWT/input) → atomic quota → server template → Gemini stream → browser. Put Supabase identity/quota beside the guards and direct source-CDN media outside the AI stream. Show the in-memory queues/caches as single-process state, not durable infrastructure.

**Honest next:** move the in-memory IP limiter to Postgres if the dyno scales out (`ew-apps-api/README.md` → “The IP limit is in memory”). No uptime or throughput claim. API quality source lists route tests with fake dependencies and `npm test`, `npm run lint`, `npm run typecheck`, without counts or current run results.

### TaskPilot — `/work/taskpilot/`

**Hook:** “Your day, co-piloted. Your tasks stay on your device; AI is an action you choose.”

| Decision | Constraint → decision → result, with evidence |
| --- | --- |
| Local-first ownership | The **2021** app was a form, **four tabs** and `localStorage`, with indexing/date/render-order bugs → store tasks in IndexedDB with plain JSON import/export, and require no account for core use → offline task management; sync remains a Pro feature for later. AI receives selected fields when invoked, never notes or project names. Sources: `taskpilot/README.md` → “The idea”; “Decisions worth explaining” → “Local-first, no account”, “The AI sees as little as possible”. The historical counts are context, not a measured privacy/performance result; no sync benchmark exists. |
| First paint before hydration | A JavaScript-dependent public landing delays content → prerender using React `renderToString` inside the built app and hydrate with the correct markers → reported mobile Lighthouse performance **0.79 → 0.98**. Source: `taskpilot/README.md` → “Prerender and hydrate, not a server framework”; “How it is built” names `scripts/prerender.mjs`. Preserve the score scale and mobile/landing scope. |
| Drag by destination, not by pixels | The default keyboard sensor only nudges cards → a coordinate getter jumps between drop zones for board, matrix and calendar → a complete keyboard path, not just a mouse alternative in the marketing copy. Sources: `taskpilot/README.md` → “Keyboard drag for everyone”; “A walk through” → Board describes Space/arrows/Space. `taskpilot/docs/design-brief.md` → “Motion” specifies **150–220ms** list/board transitions; this is a design timing, not a keyboard speed measurement. No numerical keyboard benchmark is documented; do not invent one. |

**SVG:** quick add → local parser → Dexie → views; selected fields → chosen AI provider → validated streamed items → calendar, with Undo. Separate local data from the optional AI path.

**Honest next:** sync is Pro planned, not shipped. Quality source: README badges report Lighthouse **98–100** and axe **0 violations**; “Run it” documents unit/E2E commands, axe on every page in both themes, and CI Lighthouse **≥0.95** per category. These are repo reports, not results rerun in this brief.

### Pixe — `/work/pixe/`

**Hook:** “A light table for creative direction, built around a board rather than another wall of search results.”

| Decision | Constraint → decision → result, with evidence |
| --- | --- |
| Design around source rules | Repeating Unsplash's core experience is prohibited by the documented guidelines; the old app exposed its key → make search a tool inside a board, proxy keys and normalize sources, hotlink returned URLs and report exports → a moodboard with credit and licence context. Searches cache for **one hour**; the documented shared source budgets are **200/day** for anonymous Openverse and **50/hour** for Unsplash demo. Source: `pixe/README.md` → “Not an Unsplash clone”, “The keys stay on the server”. No claim that Openverse checks every licence. |
| Let slow sources finish outside the request | Openverse can take **40 seconds**, beyond Heroku's **30-second** limit → return **202 pending** after **20 seconds**, let the in-flight search fill the cache and poll again → fast-source results appear immediately; board creation excludes a still-loading source after **12 seconds**. Source: `pixe/README.md` → “Slow sources don't hold the page, or break it”. Explain the separate search and board-build clocks; do not imply a 40-second HTTP response survives the router. |
| Keep the canvas in the DOM | Pixel canvas content is hard for screen readers to inspect and tldraw has a commercial licence constraint → real elements in one transformed layer, alt text, tab/arrow controls and an equivalent list → pointer drag, resize, pan and zoom in **about 350 lines**, with a nonvisual reading path. Source: `pixe/README.md` → “A DOM canvas, not a `<canvas>`”. “About” is essential; this is README-reported implementation size, not an accessibility audit score. |

**SVG:** board → shared photo search → cached source adapters → credited source-CDN images → DOM prints; separate local palette extraction and selected public-stock AI input. User-uploaded images do not enter the free-tier model.

**Honest next:** the app still opens and keeps boards without the API, but search is unavailable (`pixe/README.md` → “Run it”). Any offline-search improvement is a proposal, not an existing promise. Quality source: badges report Lighthouse **≥95**, axe **0 violations**; “Run it” documents mocked photo/search E2E, axe in both themes and CI thresholds, without test counts.

### Translate+ — `/work/translateplus/`

**Hook:** “Translate on the device first. Keep the words you care about, and the Hindi you actually speak.”

| Decision | Constraint → decision → result, with evidence |
| --- | --- |
| Do not spend AI calls on typing | Browser support and model downloads vary → prefer Chrome's built-in Translator/Language Detector on desktop **Chrome 138+**, cap availability/detection at **1–2 seconds**, and fall back to an explicit Translate action → as-you-type stays on-device; tones and unsupported pairs use a chosen provider when requested. Source: `translateapp/README.md` → “On the device first”, “Typing never spends AI calls”. Offline requires a downloaded language pack; do not imply support in every browser. |
| Preserve terms and handle Hinglish locally | The on-device translator cannot accept glossary instructions → substitute numbered tokens such as **`⟦0⟧`**, restore terms afterwards, and use rule-based Devanagari/Latin conversion with Hindi schwa deletion → glossary terms survive the local path; `कमल → kamal`, `समझना → samajhna` are the documented examples. Sources: `translateapp/README.md` → “A glossary that works on the device too”, “Hinglish is rule-based”. `0` is the documented placeholder index, not a success rate. Tests are documented, but no accuracy percentage or test total is available. |
| Make the globe share its work | A glyph-rich hero can multiply geometry/material work → **2,000 glyphs** share a plane and a canvas atlas, moved by a shader → **one instanced draw call** for the globe. Defer until after first paint, wide screens and real GPU only; omit for reduced motion. Source: `translateapp/README.md` → “One instanced draw call for the globe”. Do not generalize that count to the whole page or claim measured FPS. |

**SVG:** input → on-device capability check → local translation or explicit provider action; glossary token/restore wraps both; local Hinglish path sits alongside; phrasebook/history remain in IndexedDB. Document/photo AI consent is a separate gate.

**Honest next:** unsupported device/language paths remain dependent on a provider; do not advertise universal offline translation. Quality source: README badges report Lighthouse **≥95**, axe **0 violations**; “Run it” documents mocked-provider E2E and both-theme axe checks. Keep schwa examples as tested rules, not a claim of perfect transliteration.

### Willify — `/work/willify/`

**Hook:** “An AI DJ that has to prove the song exists before it reaches your playlist.”

| Decision | Constraint → decision → result, with evidence |
| --- | --- |
| Verify the catalogue, not model confidence | The model can invent tracks or choose covers → match normalized artist/title against iTunes, reject karaoke/tribute substitutions, prefer originals, and check as output streams → **14 of 16** suggestions matched in the documented real Gemini playlist; **2 dropped**. Checks run **three at a time**. Source: `willify/README.md` → “The AI can't add a song that doesn't exist”, naming `src/lib/match.ts`. This is one example, not a global accuracy rate. |
| Make source terms and the shared budget visible | Apple's promotional preview rules and API budget constrain both UI and traffic → direct Apple streaming, official unaltered Apple Music badge/link and iTunes credit, no Spotify/YouTube Music buttons, no audio/artwork service-worker cache; proxy JSON through one shared token bucket → about **20 calls/minute**, queue up to **15 seconds**, then `503 music_busy`; cache JSON **6–24 hours**, lookup up to **50 IDs** at once. Sources: `willify/README.md` → “Apple's terms shaped the interface”, “No competitor buttons”, “One iTunes budget for everyone”. Keep licensing and quota as separate parts of this decision, not proof that caching grants media reuse rights. |
| Crossfade on real audio nodes | Cutting between previews breaks continuity → **two audio decks** feed Web Audio gain nodes and **one analyser** → a **1.5-second** crossfade, with direct Apple CORS-enabled streams and Media Session controls. Source: `willify/README.md` → “Two decks, one analyser”. This is implemented timing, not measured perceptual quality. |

**SVG:** vibe → server template → suggestions → iTunes verification → accepted library; catalogue proxy/bucket beside matching; Apple stream URLs → two browser audio decks → gain/analyser → output. Do not draw an audio proxy or stored preview cache.

**Honest next:** the product is preview-based, not full-track Spotify playback. “What's next” can propose refining this experience; do not promise competitor buttons already rejected for the documented terms rationale. Quality source: README's landing decision reports mobile **0.98**; “Run it” documents tests, E2E/axe and CI Lighthouse. No new score or test total has been measured here.

### Natour — `/work/natour/`

**Hook:** “The AI writes the itinerary. OpenStreetMap checks the places. Unchecked stays visibly unchecked.”

| Decision | Constraint → decision → result, with evidence |
| --- | --- |
| Check names before adding pins | Suggested places can be invented or refer to a road/bus stop → search Nominatim inside the destination bounds and require at least **half** the normalized name words to match; exclude inappropriate place types → the recorded Lisbon plan dropped **one** unmapped suggestion, and accepted stops use OSM names/coordinates. Busy/offline checks preserve a labelled unverified stop without a pin. Source: `natour/README.md` → “The AI can't add a place that doesn't exist”, naming `src/lib/check.ts`. One recorded plan is not an accuracy benchmark. |
| Let data terms choose the stack | A planned commercial product cannot assume every free public endpoint fits → use a shared Nominatim queue at **1 request/second**, submit-only search and caching; omit public Overpass/OSRM demo and free Open-Meteo under the documented terms assessment → estimated walking times use straight-line distance **×1.3 at 4.8 km/h**, labelled `~`; NASA POWER supplies **2001–2025** monthly climate averages instead of a forecast. Sources: `natour/README.md` → “The terms of each data source shaped the app”, “Data and credits”; `natour/docs/data-terms.md` → source rows. That older terms doc still calls NASA “proposed”; README says used. Treat this as a source discrepancy for owner confirmation, not hidden certainty. |
| Let jobs outlive a React view | A plan can still be streaming when a user changes views → `src/lib/trips.ts` runs jobs outside React, checks each JSON line and writes to IndexedDB; pages watch live queries → switching views preserves progress and **two tabs** show the same progress. Closing the running tab still interrupts the job; the next visit clears it with a note. Source: `natour/README.md` → “Jobs run outside React”. Two tabs are documented behavior, not evidence of a durable background worker or server job queue. |

**SVG:** description → browser job → AI stream → destination/name checks → IndexedDB → live-query pages; separate shared places queue → Nominatim, guides → Wikivoyage, climate → NASA POWER, and tiles → OpenFreeMap. Mark “not checked” explicitly and show the close-tab interruption boundary.

**Honest next:** interrupted jobs do not resume after tab closure. Robust resume is a proposed improvement, not shipped behavior. Quality source: README's landing decision reports mobile performance **0.96–0.98**, other categories **1.0**; “Run it” documents mocked plan/reorder/list/packing/budget/journal flows and both-theme axe. Live status needs reconciliation: Natour's README links its live app, while the API README's app table still says “not live yet”.

## 4. Design direction

The existing portfolio supplies the grammar: Framer Motion, a quiet three.js Stage, glass panes over the set, Montserrat/Inter/JetBrains Mono and restrained transitions. The apps supply the accent, display type and one organizing motif. Keep case-study prose short and legible over a backing pane, with wide media between decisions. Avoid long pinned per-item scroll sequences, ornamental mascots and scroll hijacking; the handoff explicitly records those preferences. Do not import the apps' GSAP/Lenis systems into the portfolio.

| Study | Display type and colour direction | Motif and source |
| --- | --- | --- |
| Platform | Existing Montserrat, portfolio theme tokens | Five labelled inputs converging on one small server. Use the existing character here only; no new character generation is required. |
| TaskPilot | Space Grotesk; dark orange `#FF6B3D`, light accent `#C2410C`; sky `#7CC4FF` | A cockpit and a day's flight path. `taskpilot/docs/design-brief.md` → “The idea”, “Palette”, “Type”. |
| Pixe | Instrument Serif; lime `#D4FF3A` on warm black `#0E0D0C`; light text/ring accent `#4A6400` | Prints on a darkroom light table, rulers and spec lines. `pixe/docs/design-brief.md` → “The idea”, “Palette”, “Type”. |
| Translate+ | Fraunces with Noto Serif Devanagari where needed; marigold `#FFB43A`, indigo `#7C8CFF`; light text accent `#9A5A00` | Shirorekha rule above each panel; real plus/shirorekha SVG mark. `translateapp/docs/design-brief.md` → “The idea”, “Palette”, “Type”, “Assets”. |
| Willify | Bricolage Grotesque; violet `#8F72FF`, mint `#6CF2C2`; light accent `#5B3FE0` | Galaxy as vinyl record; W mark and needle/groove. `willify/docs/design-brief.md` → “The idea”, “Palette”, “Type”, “Assets”. |
| Natour | Fraunces; paper `#F4EFE6`, terracotta `#B8402A`, forest `#2C6A4C`; night accent `#FF8A5C` | Route-line N/pin, passport/check stamps and map-paper captions. `natour/docs/design-brief.md` → “The idea”, “Palette”, “Type”, “Assets”. |

Reuse each app's real SVG logo; logo files and licences are an asset check in Step 2. TaskPilot/Pixe docs establish SVG logos without a specific symbolic explanation, so captions should identify the mark without invented origin stories. The apps' other body fonts remain visible in recordings, while the study prose uses the portfolio's Inter.

Draw device frames in CSS: a subtle border, browser controls or phone safe-area shape, correct aspect ratio and no stock lifestyle mockup. Keep screens readable rather than placing many tiny devices in one composition. Provide visible pause/play controls for looping media; no autoplay audio.

### Case-study references

These are Awwwards-calibre craft references, not a claim that every linked case-study page itself won an award. The following pages were checked for their editorial structure; the applications' own claims still come solely from their repos. Take principles and make original layouts, assets and motion.

| Reference | What to take for this brief |
| --- | --- |
| [BASIC/DEPT — Patagonia](https://www.basicagency.com/case-studies/patagonia-ecommerce-website) | Its separation of strategy, design system and an honest account of what's next. Use short constraint/solution passages between large real product views, and make the platform system visible. |
| [Instrument — Oura](https://www.instrument.com/work/oura-smart-ring) | Progressive disclosure and a repeatable system for explaining complex technology. Show the product first, then reveal the architecture details; keep each app recognizably related without flattening its identity. |
| [ustwo — Peloton Lanebreak](https://ustwo.com/work/peloton/) | A clear product premise, focused interface imagery and explanations that connect interaction choices to human use. For Willify and keyboard workflows, explain what the interaction enables before explaining its machinery. Do not borrow its user figures or outcome claims. |

## 5. Asset plan for Step 2

No captures, downloads, generated imagery or historical builds happen in Step 1. Save all captured/generated images and video masters to **`E:\media\ewstudios-case-studies\`**, never C:. Flow is not needed; if later approved for an asset, its output belongs in `E:\flow-mcp-out\ewstudios-case-studies\`. Publishing optimized assets into a repo on D: is a later build action, not a reason to create media on C:.

Record real interaction from `https://<app>.ewstudios.workers.dev`, with `translateplus` as the Translate+ subdomain. Confirm Natour availability first. Use sanitized demo data, hide credentials/account codes and keep product/source credits visible. Never substitute generated UI footage or imply a staged latency is a benchmark.

For each app produce WebM + H.264 MP4 + a WebP poster; make desktop and phone screen captures where the layout differs. Export a short index excerpt from the same real interaction rather than filming a second fake demo. Use `preload="none"`, muted `playsInline`, and attach sources on intent/visibility so metadata downloads cannot defeat the budget. Reduced-motion and data-saving visits start with stills. Record any actual timing evidence separately from an edited loop.

| Study | Recording and detail screenshots to capture | Before image and OG concept |
| --- | --- | --- |
| Platform | Reuse excerpts from the five real apps; no invented “server dashboard”. Capture approved architecture/cost evidence with secrets removed. Use existing character media only. | No fake historical backend. OG: five product labels converge on one server with the approved headline and cost qualifier. |
| TaskPilot | Quick add → calendar plan → keyboard move → Undo. Still set: landing, Today, calendar, focused keyboard-drag state, mobile view, both themes. | Historical four-tab task app and comparable rebuilt task view. OG: readable task/calendar crop, cockpit orange, title. |
| Pixe | Vibe → source results → DOM board → keyboard move → palette/brief. Stills: board with credited prints, accessible list, pending-source status, palette, mobile drawer. | Historical Unsplash search grid, with old key redacted, compared with a real board. OG: original arrangement of credited prints and lime spec labels. |
| Translate+ | Local translation → glossary-preserved term → Hinglish → explicit AI tone action. Stills: on-device/provider status, glossary, RTL example, document AI consent, mobile view. | Historical Submit/Bhejo flag exercise and current translation workspace. OG: bilingual type beneath the shirorekha, real UI and marigold. |
| Willify | Vibe → match/drop → playlist → user-triggered preview transition. Stills: verification result, Apple badge/credit, library, now-playing, mobile player. | Historical Spotify search/login state versus verified playlist. OG: real playlist UI in violet; use original vector grooves rather than treating Apple's artwork as freely reusable marketing art. |
| Natour | Describe → checked stops stream in → switch tabs → keyboard move/list → journal. Stills: checked and not-checked states, guide/source credit, climate attribution, packing/budget estimate, mobile planner. | Historical original Natour landing as the primary comparison, with Trillo/Nexter only as credited context if recoverable. OG: real itinerary and route stamp, credited imagery only if reuse is permitted. |

Deliver one OG image per new route, plus the home glimpse poster. OG metadata must be static-export compatible. Use the brand fonts, original vector marks and approved screenshots; avoid decorative generated dashboards or a synthetic “2021” image. Asset dimensions, encoding sizes and loop lengths are to be chosen from actual quality/performance tests, not asserted as achieved budgets here.

### Recovering authentic 2021 screens

In Step 2, inspect each app repo's complete git history and record the selected revision, its commit date and the README-described original state. Use a disposable checkout, never reset the active repo. Build with that revision's lockfile and compatible Node/dependency versions; historical code is inspected before install and never deployed. Keep keys and tokens out of captures, use local nonsecret fixtures where services have disappeared, and label any fixtures in the asset ledger.

Capture the old page at the same viewport as the rebuilt comparison. Keep a manifest on E: with repo, commit hash, install/build command, viewport, screenshot filename, content substitutions and date. Use existing historical built files only when rebuilding is genuinely impossible and label that provenance. Willify's removed login server, Pixe's old exposed key and Natour/Nexter's surviving built files are documented risks. Do not make the old app seem functional beyond what actually runs. Exact historic hashes and rebuild success are open until this work is done.

### Credits retained with the assets

- Pixe: Unsplash and photographer links with the app's UTM conventions, required download tracking for relevant exports, Pexels where shown, and each Openverse licence. Source: `pixe/README.md` → “Not an Unsplash clone” and shared API photo decisions.
- Willify: “Previews courtesy of iTunes”, the official unaltered Apple Music badge/link and each song's Apple Music link. Stream audio/artwork from Apple in the app; do not assume the app's preview permission covers embedding audio in a portfolio film. Default portfolio loops are silent; confirm permitted recording/artwork use before publication. Source: `willify/README.md` → Apple terms decisions.
- Natour: © OpenStreetMap contributors/ODbL, Nominatim, OpenFreeMap/OpenMapTiles, linked Wikivoyage article/CC BY-SA 4.0, Unsplash photographer credit, and the NASA Langley Research Center POWER Project acknowledgement and data reference. Source: `natour/README.md` → “Data and credits”; `natour/docs/data-terms.md`.
- Historical course work and AI illustrations retain their documented origin labels. Do not present generated mood imagery as a real destination or screen recording.

## 6. Build order after approval

**Step 2 — evidence and assets.** Resolve the questions below, check source public visibility and current app availability, verify display/logo assets, recover historical screens, capture live workflows to E:, and collect dated quality evidence. Keep a claim-to-source and capture manifest. Approve the copy, comparison pairs and representative media before building around them.

**Step 3 — static pages and integration.** Build the shared app-page composition with TaskPilot as the first complete example; then populate Pixe, Translate+, Willify and Natour, and the platform study. Add the studio index, the home glimpse, Stage stops and route metadata/sitemap. Reuse existing utilities and Framer Motion; keep interactivity at leaf components. No main push or merge is authorized by this plan.

**Step 4 — validation and branch review.** Run the portfolio's `npx tsc --noEmit` and `npm run build`, serve the exported `out/`, and verify all trailing-slash routes/links and metadata. Do not use `next start` or the currently interactive `npm run lint`; the repo has no test suite. Exercise the new range slider, tile controls, pause behavior and next-study navigation with focused browser checks rather than adding a broad testing framework. Audit axe in both themes and check keyboard/screen-reader equivalents. Capture Lighthouse for every new page, with **≥95 in each category as the acceptance target**, not a present achievement. Compare home preload/network behavior before/after. Test Chromium, Firefox, WebKit and real Safari/iPhone before calling cross-browser work complete. Give the owner a branch review; pushing `main` remains a separate explicit deployment decision.

| Risk | Build/validation response |
| --- | --- |
| Home preloader grows into an app-media loader | Only the new glimpse image joins `homeAssets()`. Verify no app video, font or new-study bundle request on a cold home visit. Record the image's actual byte delta. |
| Videos defeat Lighthouse or overwhelm mobile | Posters carry first paint; reserve aspect ratio; no tile autoplay/download before intent; pause off screen. Check with cache empty and mobile throttling, not only a desktop warm cache. |
| Safari playback/graphics differ | H.264 MP4 fallback, `playsInline`, explicit play when autoplay is denied, readable CSS-frame/blur fallbacks. Avoid relying on WebGL blend-mode text; the existing real-Safari issue was not reproduced by WebKit. |
| Hydration diverges | Static facts, explicit locales, seeded/precomputed SVG positions; browser media preferences and storage read after mount. No random/time-based hero markup. Stage remains client-only via the existing dynamic loading pattern. |
| Added font and 3D work hurts first paint | Route-scoped display fonts; existing portfolio chrome fonts; defer decorative Stage/media work. No extra app WebGL runtime or GSAP/Lenis import. Reduced motion must render complete content and still diagrams. |
| Accessibility hidden by spectacle | Real headings/landmarks, contrast in both themes, visible focus, a labelled native slider, still/stacked alternatives and text architecture descriptions. No hover-only information or unsolicited audio. |
| Proof overstates the evidence | Date every score, distinguish app README reports from portfolio measurements, record commands/configs, leave missing evidence blank and labelled. Lighthouse is lab evidence, not real-user performance. |
| History or API services cannot be reproduced | Show the authentic recoverable state with provenance and an explicit limitation. Do not invent before screens, live status or latency results. |

## 7. Owner questions and approval gate

1. Approve the IA, common template, visual direction and studio-first entry flow before Step 2. No page implementation is authorized by approval of this brief's commit alone.
2. Confirm the role wording and actual rebuild timeline per app. Proposed wording is product/design direction and engineering ownership with explicit Claude Code implementation credit; exact dates/durations are not established.
3. Is the approved “one $7 server” headline acceptable with the dyno/free-tier qualifier? The API README covers seven apps; this selection deliberately features five. A claim of “$7 total monthly spending” needs documentation of the complete cost boundary.
4. Provide a permitted README/docs source for the `workers.dev` Public Suffix List explanation. Current allowed sources establish shared parent-domain passkeys, not that causal detail. Natour documents email-only sign-in and must remain an explicit exception.
5. Resolve Natour status and NASA approval: its README says live and NASA-backed, the API table says not live, and older data/design docs still say NASA proposed/owner to confirm. Use README-backed language provisionally but do not hide the conflict in final copy.
6. Approve the selected historical revisions and any clearly labelled offline fixture substitutions after recovery. Exact hashes, live recording availability, repository public visibility and logo/media reuse checks are pending Step 2.
7. Decide whether the qualitative keyboard/glossary results need additional documented numerical evidence. The current sources provide an interaction timing specification and a literal placeholder example, not keyboard task-speed or glossary-accuracy benchmarks. The brief deliberately does not invent metrics to fill those slots.

Stop here for the owner's approval. Do not build pages, capture media, update the handoff, touch `.codex/`, or push/merge `main` as part of Step 1.
