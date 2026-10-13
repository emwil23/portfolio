# Portfolio session handoff (written 2026-10-13)

A briefing for another agent picking up this project. The complete raw transcript is in
`~/Downloads/session-export-1791874569304.zip` (58 MB); this file is the short version.

## Project

- Emmanuel Wilson's portfolio. Local path: `/Users/emmanuelwilson/Documents/AIPro/protfolio` (the folder name is misspelt on purpose; don't rename it).
- Next.js 14 App Router static export, React 18, Tailwind 3, Framer Motion 11 (`framer-motion` imports, not `motion/react`), three.js 0.170, lucide-react.
- Read `CLAUDE.md` first: it documents the commands, architecture, the 3D stage and the deploy constraints, and is current.
- Only checks: `npx tsc --noEmit` and `npm run build`. No tests, no lint.
- `npm run build` writes to `.next`, which the dev server also uses: stop the dev server before building, then `rm -rf .next` and restart.

## State of the repo

- Branch `main`, clean, pushed. Head: `9939c0f feat: rebuild the site as a 3D scroll story with a case studies page`.
- Remote: `origin` = `https://github.com/emwil23/portfolio.git` (private). Pushing needs
  `git -c credential.helper= -c credential.helper='!gh auth git-credential' push` (SSH keys are not set up; `gh` is signed in as `emwil23` with `repo` and `workflow` scopes).
- Every push to `main` runs `.github/workflows/deploy.yml` and publishes to GitHub Pages.
- Parked local branches, both rejected by the user as designs, safe to delete if they agree: `redesign/ground-up`, `feat/awwwards`.

## What is live and what is broken

- Published at `https://emwil23.github.io/portfolio/`. The pages load, but **every asset under `/assets/...` 404s** there, because the site uses root-absolute asset paths and has no `basePath`. Videos, sprites, WebGL textures and preview images are missing.
- The user chose to fix this with a **custom domain** (serving from the root), not by adding a base path. Waiting on them for the domain. When it arrives: add `public/CNAME`, set it in the repo's Pages settings, and set `metadataBase` plus `openGraph.images` (`/assets/og.jpg`, 1200x630, already in the repo) in `app/layout.tsx`.

## What the site is now

- `/`: preloader (character walks in) -> hero (cursor-following character, glimpse card) -> "First, the proof" (three case study cards; hovering one fades out the character and the 3D ring and shows a screenshot preview) -> "Then, the scale" + Experience -> "And when the terminal closes" + Player 1 -> "Your move" + Contact.
- `/case-studies/`: making-of story for the character (scroll-driven turnaround, green screen keyed live in a shader, ring of 55 frames) -> wedding invitation case study (tinaandemmanuel.me, two particle rivers) -> "Now the day job" + the three production case studies -> Contact.
- `components/Stage.tsx` is the fixed three.js backdrop. Its camera stops are looked up by the `data-chapter` scene name of each `Interlude`; a new scene needs an entry in the `stops` table.
- Browser back returns to the scroll position the home page was left at; the preloader plays once per page load.

## Character assets

- Sources live in `raw-assets/` (gitignored, local only). `scripts/key-assets.sh` rebuilds everything in `public/assets/character/` (needs ffmpeg with libvpx-vp9 and hevc_videotoolbox, and cwebp).
- Keying uses ffmpeg `colorkey` (not `chromakey`, which eats the black clothes) at `0.12:0.06`. Each Flow clip has a slightly different wall green and framing; the script carries a measured mask, crop and key per clip so the character lines up with the idle pose.
- Clips in use: `idle`, `arrive` (preloader), `game` (Player 1), `admire` (Scale), `type` (day job), `handshake` (contact), `thumbsup` (end of the wedding study), sprites `look.webp` (cursor tracking), `look-small.webp` and `green.webp` (stage), `turn.webp` (turnaround).
- Unused but still in the repo: `wave`, `present`. `raw-assets/16-walk.mp4` (a walk cycle) is unused: the user had its on-screen use removed.
- New clips are generated in the user's Google Flow project "Portfolio" through Claude in Chrome. Rules: always attach the favourited "Master image"; images with Nano Banana Pro, one at a time; videos with Omni 1.1 Flash, 720p, 6 s, one at a time (10 credits each). Confirm a shot list before spending credits and ask before downloading.

## User preferences learned this session

- Keep it professional. No ornamental or mascot-style animation over content; they had a small walking figure removed. Suggest such ideas in a line and wait.
- Transitions must be smooth: things fade out and in, nothing left showing behind an overlay.
- They want an Awwwards-level, story-driven 3D site with the character in the lead and the preloader kept.
- They said "I didn't like the design" about putting section characters on the old flat layout, and liked the dark 3D stage version.
- The session ran in "ponytail" mode: smallest complete change, reuse what exists, and end every reply with what was skipped or not checked.

## Verifying changes

- The in-app browser pane is often hidden, which stalls animation frames and makes screenshots fail. Screenshots were taken with headless Chrome through `playwright-core` (installed in a scratch folder, not in the repo), using `channel: "chrome"`.
- `html` has `scroll-smooth`, so scripted scrolling must pass `behavior: "instant"` or screenshots catch the page mid-scroll.
- Append `?skip=true` to bypass the preloader.

## Open items

1. Custom domain from the user, then `CNAME`, Pages setting and share-image metadata (see above).
2. Repository links on the case studies: `Interlude` takes a `links` prop and `WeddingStory.tsx` has a `LINKS` list with a comment marking where to add one. Neither the portfolio repo nor the wedding repo is public, so no repo links were added. Ask before linking a private repo.
3. `favicon.ico` is missing (404).
4. Not tested: Safari (HEVC-alpha clips), a real phone, light mode for the newest clips, and anything in motion (all checks were still screenshots).
5. The wedding case study's images were copied from `/Users/emmanuelwilson/Documents/AIPro/Wedding` (a separate repo, untouched).
