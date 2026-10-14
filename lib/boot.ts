import { useSyncExternalStore } from "react";

/**
 * What this visit can afford, shared by everything that loads media.
 *
 *   ready   media may start loading. The home page holds it until the preloader has its own clip and the
 *           hero's assets (components/Preloader.tsx); other pages release it on mount.
 *   lite    phones and slow connections get the lighter variants (scripts/lite-assets.sh) and a lighter stage
 *   mobile  a small or touch-first screen
 *
 * The static HTML is rendered with ready false, so no video starts downloading before the preloader's own.
 */
export interface Boot {
  ready: boolean;
  lite: boolean;
  mobile: boolean;
}

const NOT_READY: Boot = { ready: false, lite: false, mobile: false };
let state = NOT_READY;
const listeners = new Set<() => void>();

export const boot = {
  get: () => state,
  set(next: Partial<Boot>) {
    state = { ...state, ...next };
    listeners.forEach((listener) => listener());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export const useBoot = () => useSyncExternalStore(boot.subscribe, boot.get, () => NOT_READY);

/** A first guess from the screen and the browser's own connection hints (Chromium only). */
export function guess(): Pick<Boot, "lite" | "mobile"> {
  const mobile = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const slow = !!connection && (connection.saveData === true || /(^|-)2g|3g/.test(connection.effectiveType ?? ""));
  return { mobile, lite: mobile || slow };
}

/** Release media straight away, for pages and visits that skip the preloader. */
export function release() {
  if (!state.ready) boot.set({ ...guess(), ready: true });
}

/** The variant of a character clip this visit should load. */
export const clip = (name: string, lite: boolean) => `/assets/character/${name}${lite ? "-lite" : ""}`;
