# Portfolio session handoff (written 2026-10-13, Windows session)

A briefing for another agent picking up this project. It replaces the earlier handoff written the same day on the Mac.

## Project

- Emmanuel Wilson's portfolio. The folder name `protfolio` is misspelt on purpose; don't rename it.
  - Windows PC: `D:\Code\AIPro\AIPro\protfolio`
  - Mac: `/Users/emmanuelwilson/Documents/AIPro/protfolio`
- Next.js 14 App Router static export, React 18, Tailwind 3, Framer Motion 11 (`framer-motion` imports, not `motion/react`), three.js 0.170, lucide-react.
- Read `CLAUDE.md` first: commands, architecture, the 3D stage and the deploy constraints. It is current as of this handoff.
- Only checks: `npx tsc --noEmit` and `npm run build`. No tests, no lint.
- `npm run build` writes to `.next`, which the dev server also uses: stop the dev server before building, then delete `.next` and restart.

## State of the repo

- Everything from this session is merged into local `main`. **It has not been pushed.** `origin/main` is still at `b5db0e2`.
- Every push to `main` runs `.github/workflows/deploy.yml` and publishes to GitHub Pages, so a push is a production deploy. Ask first.
- Remote: `origin` = `https://github.com/emwil23/portfolio.git` (private).
  - Windows: Git Credential Manager (browser sign-in). `gh` is not installed. Git has no `user.name`/`user.email` here; this session committed with `-c user.name="Emmanuel Wilson" -c user.email=emmanuel@kredily.com` to match the history.
  - Mac: `git -c credential.helper= -c credential.helper='!gh auth git-credential' push`.
- `feat/player-one-redesign` is the branch the work was done on; it is fully merged and can be deleted.
- Parked local branches on the Mac, both rejected as designs: `redesign/ground-up`, `feat/awwwards`.

## What changed this session

- **Nav**: floating glass pills with an active-section highlight and a mobile menu.
- **Case studies**: an "issue / what we did / result" strip on each production study, and a before/after infographic on the wedding study's performance chapter (`Lighter` in `WeddingStory.tsx`). The infographic states only what the chapter text states; there are no measured numbers in it.
- **Theme fix**: Tailwind 3 drops `bg-[var(--x)]/80`, so every translucent surface on the site had been rendering with no background. All 93 uses were rewritten to `color-mix`. See "Opacity on theme colours" in `CLAUDE.md`.
- **Player 1** (`PlayerOne.tsx`), rebuilt as a two-screen gaming corner:
  1. Pick a world. Hover, focus or tap a card (Cyberpunk 2077, Assassin's Creed, Valorant & CS2) and the character changes kit, that world's backdrop clip fades in, and the screen takes the world's colour.
  2. A holographic sticker of the golden-hour photo. It leans towards the pointer, its foil and glare follow it (`.sticker*` in `globals.css`), and hovering it slides it aside for the "Software is an act of care" paragraphs.
- **Contact** (`ContactHandshake.tsx`): the separate "Your move" chapter is folded in. One screen: four channels as rows, and a looping clip of him coding at his desk.
- The home page no longer has interludes in front of Player 1 or Contact.

## Assets and Flow

- Sources live in `raw-assets/` (gitignored, local to each machine). `scripts/key-assets.sh` documents how every output is built, but it is a bash script that needs `hevc_videotoolbox`, so it only runs whole on the Mac. On Windows, ffmpeg is installed through Scoop (`D:\Code\scoop\shims`) and the individual lines were run by hand.
- New this session, all from the user's Google Flow project "Portfolio" through Claude in Chrome, with the favourited "Master image" attached to every character shot:
  - `public/assets/player/{night,creed,site}.webp`: keyed stills, Nano Banana Pro, free.
  - `public/assets/player/{night,creed,site}.mp4`: world backdrops, Veo 3.1 Fast, 20 credits each. They are original scenes in the style of each game, not game footage.
  - `public/assets/character/desk.webm` + `desk.webp`: the desk clip, Omni 1.1 Flash, 10 credits.
- Raw files from this session exist only on the Windows PC (`raw-assets/19-night.jpg`, `21-site.jpg`, `23-creed.jpg`, `24`–`26-world-*.mp4`, `27-desk.mp4`; originals also in `D:\Downloads`). Copy them to the Mac before rebuilding there.
- Chrome on the PC downloads to `D:\Downloads`.
- Flow rules the user set: images with Nano Banana Pro, videos one at a time, say what a generation costs. They have since said "use Flow if needed", so no need to ask before each one, but state the credits spent.
- Keying: stills and the older clips use `colorkey` at `0.12:0.06` on a measured wall colour. The desk clip's wall is unevenly lit, so it is keyed on greenness (`g - max(r, b)`) instead; its keyed-out pixels are painted black so codec noise cannot show as a haze.

## Open items

1. **Push.** Nothing from this session is live. Run `npm run build` first.
2. **HEVC encode of `desk.webm`** on the Mac, so Safari and iPhones get the motion instead of the still. Then add the `.mp4` source and drop the `navigator.vendor` check in `ContactHandshake.tsx`.
3. **Custom domain**: set to `emmanuelwilson.tech` on the Mac after this handoff (`public/CNAME`, the Pages setting, `metadataBase` and the share image in `app/layout.tsx`). The site serves from the root there, so the `/assets/...` paths work. It needs the domain's DNS pointed at GitHub Pages.
4. **Not checked this session**: Safari, a real phone, and light mode for most of the new sections. Player 1 measures about 2.5 screens tall on a phone.
5. Copy written by the agent that the user has not confirmed: the Assassin's Creed card ("Leap of faith"), the wedding infographic's "Native scroll" and "One encode for everyone" labels.
6. `lib/data.ts` is still unused. (The favicon was added on the Mac after this handoff: `app/icon.png`, `apple-icon.png`, `favicon.ico`.)
7. Unused character clips still in the repo: `wave`, `present`, `thumbsup`, `handshake`, `game`. (`handshake` and `game` lost their last use this session.)

## User preferences learned

- Keep it professional and subtle. "Not everything has to be in your face": they had per-channel gestures, rotating rings and a speech tag removed from the contact character the same day they were added.
- They want an Awwwards-level, story-driven site, but short. Long per-item scroll beats were rejected for Player 1 in favour of two screens.
- Interactive details are welcome when they are quiet and optional (hover to change a world, the sticker's foil).
- Transitions must be smooth: things fade out and in, nothing left showing behind an overlay. A still left visible behind a playing clip was reported as a bug within minutes.
- They read text over the 3D stage closely; anything the stage's set-pieces cross needs a backing pane.
- The session ran in "ponytail" mode: smallest complete change, reuse what exists, and end every reply with what was skipped or not checked.

## Verifying changes

- The in-app browser pane throttles animation and pauses every `<video>` while it is in the background. Screenshots often catch the stage camera mid-flight and elements mid-fade; wait and retake, and do not conclude a clip is broken because it reports `paused`.
- A `filter` (such as `drop-shadow`) directly on a keyed `<video>` rendered blank in that pane; put it on a wrapper, as `Character.tsx` does.
- `html` has `scroll-smooth`, so scripted scrolling must pass `behavior: "instant"`.
- Framer Motion's `whileInView` uses the element's own visible area: an element that starts clipped or scaled to nothing never counts as in view. Observe an unclipped parent and drive the child with variants.
- Append `?skip=true` to bypass the preloader.
- The dev server listens on all interfaces; on the same Wi-Fi the PC is at `http://192.168.0.6:3000` (NordVPN on the PC can block this unless LAN access is allowed).
