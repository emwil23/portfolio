"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/** A keyed, transparent character clip from public/assets/character (built by scripts/key-assets.sh). */
export type CharacterAction = "wave" | "present" | "thumbsup" | "handshake" | "game" | "admire" | "type";

/** HEVC-with-alpha for Safari, VP9-with-alpha for everything else. */
const sources = (name: string) => (
  <>
    <source src={`/assets/character/${name}.mp4`} type='video/mp4; codecs="hvc1"' />
    <source src={`/assets/character/${name}.webm`} type="video/webm" />
  </>
);

export const CharacterClip: React.FC<{ name: "idle" | "arrive" | CharacterAction; className?: string }> = ({ name, className = "" }) => (
  <video autoPlay loop muted playsInline aria-hidden="true" className={`pointer-events-none ${className}`}>
    {sources(name)}
  </video>
);

// Clips keyed with a wider frame than the shared one (see FRAME_WIDE in scripts/key-assets.sh).
// This box puts him back in the same place as every other clip.
const CLIP_BOX: Partial<Record<CharacterAction, React.CSSProperties>> = {
  present: { left: "-74.71%", width: "174.71%" },
  game: { left: "-4.02%", width: "108.05%" },
};

// look.webp is an 8x7 sprite of the head-circle clip (see scripts/key-assets.sh):
//   cell 0            looking at the camera
//   cells 1..12       the turn from the camera out to screen-left (the "spoke")
//   cells 13..54      one full circle of his gaze (the "ring"): left, up, right, down
// Mirroring the spoke gives the turn from the camera out to screen-right.
const COLS = 8;
const ROWS = 7;
export const SPOKE = 13; // spoke steps from the camera (0) to where it joins the ring (13)
export const RING = 42;
const LEFT = 0; // ring positions where the two spokes join
const RIGHT = 19; // the real frame that best matches the mirrored end of the spoke
const SPEED = 0.034; // cells per millisecond, about three times the clip's own pace
const REST_MS = 1600;
const FADE_MS = 260;

/** Signed shortest distance from a to b around the ring. */
export const around = (a: number, b: number) => ((b - a + RING * 1.5) % RING) - RING / 2;

/** Cursor angle -> position on the ring. The clip doesn't turn at a constant speed, so each quadrant has its own span. */
export const ringAt = (dx: number, dy: number) => {
  // Degrees clockwise on screen from "left": left 0, up 90, right 180, down 270
  const a = (180 - (Math.atan2(-dy, dx) * 180) / Math.PI + 360) % 360;
  const q = Math.min(3, Math.floor(a / 90));
  const start = [0, 10, 20, 31][q];
  const span = [10, 10, 11, 11][q];
  return (start + ((a - q * 90) / 90) * span) % RING;
};

const cellPosition = (cell: number) =>
  `${((cell % COLS) * 100) / (COLS - 1)}% ${(Math.floor(cell / COLS) * 100) / (ROWS - 1)}%`;

const sprite = "absolute inset-0 bg-[length:800%_700%] bg-[position:0%_0%] bg-[url('/assets/character/look.webp')]";

/**
 * The character. He never cuts or blends between two different poses: every change of pose is
 * played through real frames, and clips only swap at the neutral pose they all start and end in.
 *
 *   resting   the idle clip plays (he breathes, shifts, glances)
 *   action    a one-shot clip (`onView` when he scrolls into view, `play` on demand), then back to resting
 *
 * With `track`, on devices that have a mouse:
 *   noticed   he turns from the camera out to the side, then round the ring to face the cursor
 *   pointed   cursor on his face: he comes back round and looks at you
 *   left be   after REST_MS he returns to the camera, and the idle clip takes over from the same pose
 */
export const Character: React.FC<{
  className?: string;
  track?: boolean;
  /** Played each time he scrolls into view. */
  onView?: CharacterAction;
  /** Played whenever `id` changes to a new non-zero value. */
  play?: { action: CharacterAction; id: number };
}> = ({ className = "", track = false, onView, play }) => {
  const ref = useRef<HTMLDivElement>(null);
  const idleRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLVideoElement>(null);
  const busy = useRef(false); // an action clip is playing
  const yieldToAction = useRef<() => void>();
  const [hasMouse, setHasMouse] = useState(true);
  const [action, setAction] = useState<{ name: CharacterAction; n: number } | null>(null);
  const inView = useInView(ref, { amount: 0.6 });

  const start = useCallback((name: CharacterAction) => {
    busy.current = true;
    yieldToAction.current?.();
    setAction((prev) => ({ name, n: (prev?.n ?? 0) + 1 }));
  }, []);

  useEffect(() => {
    if (inView && onView) start(onView);
  }, [inView, onView, start]);

  const playId = play?.id;
  const playAction = play?.action;
  useEffect(() => {
    if (playId && playAction) start(playAction);
  }, [playId, playAction, start]);

  // The action clip fades in over the solid idle clip, which is then hidden so its outline can't show behind
  const onActionPlaying = () => {
    const idle = idleRef.current;
    if (!idle || !actionRef.current) return;
    actionRef.current.style.opacity = "1";
    idle.style.transition = `opacity 0s ${FADE_MS}ms`;
    idle.style.opacity = "0";
  };

  // It ends in the pose the idle clip starts in, so the idle clip is restarted underneath and the action fades off it
  const onActionDone = () => {
    const idle = idleRef.current;
    if (!idle) return;
    const clip = idle.querySelector("video");
    if (clip) clip.currentTime = 0;
    idle.style.transition = "none";
    idle.style.opacity = "1";
    if (actionRef.current) actionRef.current.style.opacity = "0";
    const n = action?.n;
    window.setTimeout(() => {
      setAction((cur) => {
        if (cur?.n !== n) return cur; // another action started meanwhile
        busy.current = false;
        return null;
      });
    }, FADE_MS);
  };

  useEffect(() => {
    setHasMouse(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  useEffect(() => {
    const el = ref.current;
    const idle = idleRef.current;
    const layer = trackRef.current; // only rendered with `track` on a device that has a mouse
    const base = baseRef.current;
    const top = topRef.current;
    if (!el || !idle || !layer || !base || !top) return;

    // Where his gaze is: on a spoke (t steps out from the camera, on `side`) or on the ring (at `pos`)
    let onRing = false;
    let side = LEFT;
    let t = 0;
    let pos = 0;
    // Where it should go: a ring position, or null for the camera
    let goal: number | null = null;
    let resting = true; // the idle clip is showing
    let shown = "";
    let raf = 0;
    let last = 0;
    let restTimer = 0;
    let fading: Animation | undefined;

    const draw = () => {
      const k = Math.round(t);
      const cell = onRing ? SPOKE + (Math.round(pos) % RING) : k;
      // Only the frames between the camera and the ring are mirrored; both ends are real frames
      const mirrored = !onRing && side === RIGHT && k > 0;
      const key = `${cell}${mirrored}`;
      if (key === shown) return;
      // The mirrored spoke doesn't quite meet the real right-hand frame, so that one join gets a short blend.
      // The previous frame stays solid underneath for it, so he never goes see-through.
      const joinsRing = onRing && shown.endsWith("true");
      const leavesRing = mirrored && k === SPOKE - 1 && shown === `${SPOKE + RIGHT}false`;
      if (joinsRing || leavesRing) {
        fading?.cancel();
        base.style.backgroundPosition = top.style.backgroundPosition;
        base.style.transform = top.style.transform;
        base.style.opacity = "1";
        fading = top.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 140, easing: "ease-out" });
        // A cancelled fade rejects; the fade that replaced it does the hiding
        fading.finished.then(() => (base.style.opacity = "0"), () => {});
      }
      top.style.backgroundPosition = cellPosition(cell);
      top.style.transform = mirrored ? "scaleX(-1)" : "";
      shown = key;
    };

    // The idle clip sits under the sprite. Both hold the same pose whenever they swap, so the swap is
    // a short plain fade of the sprite over a solid clip, never two half-transparent figures.
    const setResting = (on: boolean) => {
      resting = on;
      if (on) {
        const clip = idle.querySelector("video");
        if (clip) clip.currentTime = 0;
        idle.style.transition = "none";
        idle.style.opacity = "1";
      } else {
        idle.style.transition = `opacity 0s ${FADE_MS}ms`;
        idle.style.opacity = "0";
      }
      layer.style.opacity = on ? "0" : "1";
    };

    const tick = (now: number) => {
      const step = Math.min(now - last, 50) * SPEED;
      last = now;
      let settled = false;

      if (onRing) {
        // Heading for the camera means heading for whichever spoke is nearer
        const to = goal ?? (Math.abs(around(pos, LEFT)) <= Math.abs(around(pos, RIGHT)) ? LEFT : RIGHT);
        const diff = around(pos, to);
        if (goal === null && Math.abs(diff) <= step) {
          onRing = false;
          side = to;
          t = SPOKE - 1;
        } else {
          // Ease into the cursor's direction, but never faster than the frames can carry
          const move = goal === null ? Math.sign(diff) * step : Math.max(-step, Math.min(step, diff * 0.2));
          pos = (pos + move + RING) % RING;
          settled = goal !== null && Math.abs(diff) < 0.3;
        }
      } else if (goal === null) {
        t = Math.max(0, t - step);
        settled = t === 0;
      } else {
        // Leaving the camera: go out the side nearer to where the cursor is
        if (t === 0) side = Math.abs(around(LEFT, goal)) <= Math.abs(around(RIGHT, goal)) ? LEFT : RIGHT;
        t += step;
        if (t >= SPOKE) {
          onRing = true;
          pos = side;
        }
      }

      draw();
      if (!settled) {
        raf = requestAnimationFrame(tick);
        return;
      }
      raf = 0;
      // Back at the camera with the mouse still: hand over to the idle clip
      if (goal === null && restTimer === 0 && !resting) setResting(true);
    };

    const run = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    // An action clip is taking over: drop straight back to the resting pose
    yieldToAction.current = () => {
      window.clearTimeout(restTimer);
      restTimer = 0;
      cancelAnimationFrame(raf);
      raf = 0;
      goal = null;
      onRing = false;
      t = 0;
      draw();
      if (!resting) setResting(true);
    };

    const onMove = (e: PointerEvent) => {
      if (busy.current) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height * 0.12);
      // Within this radius of his face he looks at you; a little slack stops flicker at the edge
      const reach = Math.hypot(dx, dy) / (r.height * 0.16);
      goal = reach < (goal === null ? 1 : 0.85) ? null : ringAt(dx, dy);

      window.clearTimeout(restTimer);
      restTimer = window.setTimeout(() => {
        restTimer = 0;
        goal = null;
        run();
      }, REST_MS);

      if (resting) {
        // Take over from the idle clip in the pose it rests in: looking at the camera
        onRing = false;
        t = 0;
        draw();
        setResting(false);
      }
      run();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      window.clearTimeout(restTimer);
      yieldToAction.current = undefined;
    };
  }, [hasMouse, track]);

  return (
    <div ref={ref} role="img" aria-label="Emmanuel's 3D character" className={`relative aspect-[348/930] ${className}`}>
      <div ref={idleRef} className="absolute inset-0">
        <CharacterClip name="idle" className="h-full w-full" />
      </div>
      {hasMouse && track && (
        <div
          ref={trackRef}
          className="absolute inset-0 opacity-0 transition-opacity ease-out"
          style={{ transitionDuration: `${FADE_MS}ms` }}
        >
          <div ref={baseRef} className={`${sprite} opacity-0`} />
          <div ref={topRef} className={sprite} />
        </div>
      )}
      {action && (
        <video
          key={action.n}
          ref={actionRef}
          autoPlay
          muted
          playsInline
          aria-hidden="true"
          onPlaying={onActionPlaying}
          onEnded={onActionDone}
          // A rejected <source> (the HEVC one, outside Safari) also lands here; only a failure of the video itself ends the action
          onError={(e) => e.target === e.currentTarget && onActionDone()}
          className="pointer-events-none absolute inset-y-0 h-full opacity-0 transition-opacity ease-out"
          style={{ left: 0, width: "100%", transitionDuration: `${FADE_MS}ms`, ...CLIP_BOX[action.name] }}
        >
          {sources(action.name)}
        </video>
      )}
    </div>
  );
};
