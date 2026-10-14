# Portfolio session handoff (written 2026-10-14, Mac session)

A briefing for another agent picking up this project. It replaces the Windows handoff of 2026-10-13.

## Project

- Emmanuel Wilson's portfolio, live at **https://emmanuelwilson.tech**. The folder name `protfolio` is misspelt on purpose; don't rename it.
  - Windows PC: `D:\Code\AIPro\AIPro\protfolio`
  - Mac: `/Users/emmanuelwilson/Documents/AIPro/protfolio`
- Next.js 14 App Router static export, React 18, Tailwind 3, Framer Motion 11 (`framer-motion` imports, not `motion/react`), three.js 0.170, lucide-react.
- Read `CLAUDE.md` first: commands, architecture, the 3D stage, the loading system and the deploy constraints. It is current as of this handoff. `README.md` is the public write-up of the project.
- Only checks: `npx tsc --noEmit` and `npm run build`. No tests, no lint.
- `npm run build` writes to `.next`, which the dev server also uses: stop the dev server before building, then delete `.next` and restart.

## State of the repo

- `main` is at `048f8ce`, pushed and deployed. Nothing is uncommitted.
- Every push to `main` runs `.github/workflows/deploy.yml` and publishes to GitHub Pages, so a push is a production deploy. The user says "merge and deploy" when they want it; work on a branch until then.
- Remote: `origin` = `https://github.com/emwil23/portfolio.git` (private). Repo description and website are set on GitHub.
  - Mac: `git -c credential.helper= -c credential.helper='!gh auth git-credential' push` (SSH keys are not set up; `gh` is signed in as `emwil23` with `repo` and `workflow` scopes).
  - Windows: Git Credential Manager. `gh` is not installed. Commit with `-c user.name="Emmanuel Wilson" -c user.email=emmanuel@kredily.com` to match the history.
- Branches: `fix/bugs-and-changes` and `perf/adaptive-loading` are merged and can be deleted. `redesign/ground-up` and `feat/awwwards` (Mac only) are rejected old designs.
- Hosting: GitHub Pages with the custom domain `emmanuelwilson.tech` (`public/CNAME`, DNS A records to GitHub's four Pages IPs, `www` CNAME to `emwil23.github.io`). HTTPS is issued by GitHub and enforced.

## What changed since the Windows handoff

- **Safari**: the hero name used `mix-blend-mode: difference`, which Safari does not apply against the WebGL stage, so it stayed white on the light theme. Safari now gets the theme's text colour with a halo (`.hero-name` in `globals.css`). Safari's HEVC clips had a blue halo from the despilled wall hidden under the alpha; keyed-out pixels are now painted black before encoding (`CLEAR` in `scripts/key-assets.sh`). Both confirmed by the user in real Safari.
- **Favicon**: an EW mark in Montserrat ExtraBold, white on dark with the green bar (`app/icon.png`, `apple-icon.png`, `favicon.ico`).
- **Phone layout fixes**: the green-screen frame no longer shows behind the turnaround on tall screens; the wedding infographic drops its list on phones; the benchmark tabs wrap.
- **SEO and sharing**: `metadataBase`, canonical links, Open Graph and Twitter cards on both pages (the case studies page has its own), JSON-LD Person, `public/robots.txt`, `public/sitemap.xml`. Share image is `public/assets/og.jpg`.
- **README.md** in the style of the user's public `emwil23/weddingvibes` repo, with screenshots in `docs/` (not published with the site).
- **Wedding case study** has a "View the code" button to `github.com/emwil23/weddingvibes`, which is public.
- **Adaptive loading** (`lib/boot.ts`, the preloader, `scripts/lite-assets.sh`). See "Loading and quality" in `CLAUDE.md`. In short: only the preloader's clip is in the static HTML; the preloader estimates connection speed, fetches the hero's clip and cursor sprite with real progress, then releases media; phones and slow connections get `-lite` clips and lighter everything; phones are told "Best experienced on a desktop". Measured on the live site with throttled 3G and an empty cache: desktop reveals at about 10 s and phones at about 6.6 s, with the hero clip already playing.

## Assets and Flow

- Green-screen sources live in `raw-assets/` (gitignored, local to each machine). The Mac has `00`–`17` plus `28-banner.jpg`; files `19`–`27` (Player 1 stills and backdrops, desk clip) exist only on the Windows PC.
- `scripts/key-assets.sh` builds the full assets from `raw-assets/` and needs macOS for its HEVC step. `scripts/lite-assets.sh` builds the `-lite` clips from the full ones, so it needs no sources, only macOS for HEVC.
- Google Flow project "Portfolio" (driven through Claude in Chrome): always attach the favourited "Master image". Images with Nano Banana Pro (shows 0 credits). Character clips with Omni 1.1 Flash, 720p, 6 s, one at a time (10 credits each). The user said "use Flow if needed": no need to ask before each generation, but state the credits spent. Flow downloads a single image as a zip ("Download batch").
- Keying: `colorkey` at `0.12:0.06` on each clip's measured wall colour, never `chromakey` (it eats the black clothes). Every clip gets its own crop so he lines up with the idle pose.
- `raw-assets/linkedin-banner.png` is the user's LinkedIn banner (3168×792), composed from `28-banner.jpg` with the site's fonts. Not part of the site.
- Unused clips still in the repo, full and lite: `wave`, `present`, `handshake`, `game`.

## Open items

1. **HEVC encode of the desk clip**, so Safari and iPhones see the motion instead of the still. Needs `27-desk.mp4` from the Windows PC on the Mac. Then add the `.mp4` source and drop the `navigator.vendor` check in `ContactHandshake.tsx`.
2. **Not tested on a real phone on mobile data**, or in real Safari since the loading change. Safari has no connection hint, so it relies on the timing measurements.
3. **Remaining weight on a slow first visit**: the site's scripts (about 460 KB compressed) and three Google font families with many weights. The preloader's walk-in clip is chosen by screen size only (it is in the HTML before any code runs), so a slow desktop still downloads the full 520 KB version.
4. **Portfolio repo is private**, so the making-of case study has no "View the code" button and the README is not visible. The user's call.
5. Copy the user has not confirmed: the Assassin's Creed card ("Leap of faith"), two labels on the wedding infographic, and the README's "How it was made" section, written in the user's voice.
6. `lib/data.ts` is unused. A faint Gemini sparkle sits in the bottom-right corner of `og.jpg`.

## User preferences learned

- Keep it professional and subtle. Ornamental or mascot-style animation over content was removed twice (a small walking figure; per-channel gestures and rings on the contact character). Suggest such ideas in a line and wait.
- Awwwards-level and story-driven, but short. Long per-item scroll beats were rejected.
- Transitions must be smooth: things fade out and in, nothing left showing behind an overlay.
- They read text over the 3D stage closely; anything the stage's set-pieces cross needs a backing pane.
- They test in Safari and on an iPhone. Check WebKit behaviour before calling something done.
- The sessions run in "ponytail" mode: smallest complete change, reuse what exists, and end every reply with what was skipped or not checked.

## Verifying changes

- The in-app browser pane is often hidden, which stalls animation and pauses video. Screenshots were taken with headless Chrome through `playwright-core` (installed in a scratch folder, not the repo), with `channel: "chrome"`. Playwright's WebKit (`npx playwright-core install webkit`) stands in for Safari, but it did not reproduce the real Safari blend-mode bug, so treat it as a partial check.
- Loading was profiled with Chrome DevTools Protocol throttling (Fast 3G: 1.6 Mbit/s, 150 ms) against the production build served by `npx http-server out -c600` (it supports range requests and caching like GitHub Pages) and against the live site.
- `html` has `scroll-smooth`, so scripted scrolling must pass `behavior: "instant"`.
- Append `?skip=true` to bypass the preloader.
- The Mac is at `http://192.168.0.12:3000` on the local Wi-Fi when the dev server runs, for testing on the iPhone.
