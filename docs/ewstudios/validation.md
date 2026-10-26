# EWSTUDIOS implementation and evidence

The owner approved the brief on 26 October 2026 and authorized the resumed implementation. The brief remains the original proposal; its old approval gate and open questions are superseded by that instruction. No production deployment or PR is authorized.

The implementation exports `/work/ewstudios/`, `/work/taskpilot/`, `/work/pixe/`, `/work/translateplus/`, `/work/willify/` and `/work/natour/`. The studio chapter sits between WeddingStory and production studies at `/case-studies/#ewstudios`; the fourth home glimpse leads there. The study sequence ends back at the index. Each app includes its actual SVG mark, palette and display face, local/AI boundaries, three sourced decisions, responsive request diagram, historical comparison, phone screen, limits and next link. The platform alone reuses the existing owner character.

## Reproduce the checks

Run commands from the portfolio root. On this Windows machine use `npm.cmd` and `npx.cmd`; PowerShell's script execution policy blocks the `.ps1` shims.

```powershell
npx.cmd tsc --noEmit
npm.cmd run build
node scripts/ewstudios-serve.cjs
# In another terminal, while the export server is running:
node scripts/ewstudios-checks.cjs
node scripts/ewstudios-interactions.cjs
node scripts/ewstudios-lighthouse.cjs
```

Stop the server with Ctrl+C afterward. The server serves `out/` with gzip, caching and video byte ranges, as expected from the production static host. The checks assert byte ranges, compression and path containment as well as page behavior. `next start` is not used. Lint remains interactive/unconfigured and was skipped.

`browser-results.json` records all six routes at 1440 × 900 and 390 × 844, light/dark, with reduced motion. It verifies HTTP status, canonical, one H1, JSON-LD, overflow, visible images, deferred video sources and focusable index navigation. Chromium runs axe WCAG 2 A/AA, 2.1 AA and 2.2 AA in both themes. Home records app-media requests, study prefetch and glimpse size. The studio anchor and five tile links are checked. All five live app origins returned HTTP 200.

`home-cold-results.json` adds a separate empty-context desktop visit with the full preloader and no skip query: 4,349 ms to release on this local export, 48 requests, the new glimpse requested, zero app-media requests and zero study prefetches. This is a local unthrottled check, not a live-network loading benchmark. The glimpse adds 14,934 bytes; the existing preloader list is otherwise unchanged. The actual fourth-card click reaches the studio anchor at its 90px scroll margin.

`interaction-results.json` records native range keyboard endpoints, stacked alternatives, media intent, mute/pause/offscreen behavior, one active tile, and desktop Stage/diagram behavior with motion enabled. Windows WebKit cannot decode even a standalone H.264 baseline MP4: the probe returns NotSupportedError. Its playback is reported as blocked, separate from page/control checks. Firefox's installed binary times out during launch. WebKit is a Safari proxy, not a substitute for real Safari/iPhone hardware. Its external Google Fonts request can also fail local certificate trust; the local app display fonts and CSS/system fallbacks still render.

`lighthouse-results.json` records Lighthouse mobile against the gzip export server, cold cache, simulated throttling and default light theme. The script opens a fresh Chromium for each page. Raw Lighthouse reports, including screenshots, stay under `E:/media/ewstudios-case-studies/lighthouse/`; the public summary is `/evidence/ewstudios-checks.json`. These are portfolio lab results, not field data or reruns of app README scores. The acceptance threshold is 95 in each category.

## Source ledger and corrections

`lib/ewstudios.ts` pins each app README and includes a source caption for all 18 decisions. Preserve distinctions between configured limits, one recorded example, design timings and measured scores. App scores are explicitly README reports; no app test totals, users or revenue are claimed. The public GitHub API returned HTTP 200 and `private: false` for all six linked repositories; that verifies visibility, not an open-source licence.

| Study | Pinned source | Qualification |
| --- | --- | --- |
| Platform | ew-apps-api `aafe065a91f8846f02fb11a3355be1889544b6bf`, README, “Decisions worth explaining” | Public Suffix List/passkey explanation is now documented; Natour is email-only. $7/month is Heroku Basic only; Workers, Supabase and Gemini use free tiers. The API serves seven apps; five are featured. |
| TaskPilot | taskpilot `8dabb62b269c1a7d93a3686245b218f5f88aa712`, README/design brief | 0.79 → 0.98 is reported mobile landing performance; selected fields can reach AI, notes/project names do not. Sync is planned. |
| Pixe | pixe `32fd0748f88511e43fbeb3db0e615b4f385a0ee0`, README/design brief | 20s search-pending and 12s board-build waits are separate. “About 350 lines” is reported implementation size. Source/licence links for the captured prints are preserved in public evidence. |
| Translate+ | TranslateApp `9954ae68bf807c781ca7fc37a555da19bfc465f3`, README/design brief | Local typing is distinct from explicit provider actions; browser model support is conditional. One draw call applies to its globe only. |
| Willify | Willify `0ef8dbde82c55486a4152aaf89dac214a7dfdc6a`, README/design brief | 14/16 matches is one documented example. Captured preview playback is silent and retains the real iTunes credit and Apple Music badge. No independent media-licence opinion is claimed. |
| Natour | natour `9568132dd42ea479bea28cc400eef8d66fc1676b`, README/data-terms/design brief | README/API now agree it is live. NASA POWER use was owner-approved 23 October 2026. Climate averages are not forecasts; unchecked places have no pins. |

Role wording is the owner's: “Product, design direction and engineering lead, built with Claude Code.” The originals are described as 2021 work; the rebuild dates are 19–25 October 2026. No duration is inferred. The machine clock dates captures/checks 26 October 2026; manifests retain actual timestamps rather than backdating them to the resume message.

## Assets and historical provenance

All capture masters, source archives, temporary bundles, browser states, recordings and generated editorial OG masters are on `E:/media/ewstudios-case-studies/`. Only optimized WebP, silent WebM/H.264 MP4 and the original app SVG marks ship under `public/assets/ewstudios/`. The original Apple Music badge is unaltered. No Flow or generated video was used. OG cards are original vector typography/diagrams rendered to WebP, with no synthetic product UI or new owner likeness.

Local display-font files come from the app assets; Noto Serif Devanagari supplies the Hindi examples. Font OFL notices are retained under `public/assets/ewstudios/fonts/` (Google Fonts upstream `ofl/<family>/OFL.txt`); the new font master and Google Fonts source CSS remain on E:. Common portfolio fonts keep the existing root loading behavior.

The capture manifest at `/evidence/ewstudios-captures.json` records actual UI actions and limitations. Authenticated AI workflows were not recorded: no account credentials were available. Natour shows a real manual Lisbon trip and map, not invented checked stops. Translate+ shows real rule-based Hinglish, not a claimed downloaded Translator model or fabricated translation timing. Pixe uses the app's built-in example board and actual source responses. Photographer, source and licence URLs are at `/evidence/ewstudios-photo-credits.json`; Apple links are in the capture manifest. Map/source credits remain in the screen/caption.

Historical views are explicitly labelled **source reconstructions**, not original-toolchain builds. `history-manifest.json` and `/evidence/ewstudios-history.json` record repo, revision/date, compatibility tooling, viewport and substitutions. Old CRA 4/node-sass 6 was not installed into the portfolio or presented as successfully rebuilt with its original lockfile. Archived source was rendered locally with the existing React 18 runtime, esbuild and Dart Sass. No historical backend was deployed or connected. Pixe's old key is replaced by an empty offline response and its developer portrait is hidden; Willify renders the original login component without its dead server. The old Natour clone had only a 2022 snapshot, but the active repo's full history yielded **2be11cc (5 November 2021)**; the final reconstruction renders that original Header component and records the full revision. Its CSS course origin is credited without inventing a course author absent from the permitted README.

To reproduce compatibility renders, first run:

```powershell
npm.cmd exec --cache .npm-cache --yes --package esbuild --package sass -- node scripts/ewstudios-history.cjs
node scripts/ewstudios-assets.cjs
node scripts/ewstudios-capture.cjs
```

Capture scripts use live public origins and anonymous disposable browser data. They do not bypass authentication or synthesize model results. FFmpeg strips audio (`-an`), uses H.264/yuv420p/faststart plus VP9 and produces short excerpts. Playwright browser binaries are under the ignored `.pw-browsers/`; `.npm-cache/` is ignored too. The home preloader changes only by the new glimpse image. No app video, font or heavy study bundle joins it.

## Git limitation

Branch remains `ewstudios-case-studies`. The first requested commit was attempted after a passing typecheck; both `git add` and `git commit` failed because this session denies writing `.git/index.lock`. No commit, push, PR, merge, rebase or main deployment occurred. `.codex/` was left alone. The owner must commit/push this working tree from a session allowed to write `.git`; do not mistake the local export for a live deployment.
