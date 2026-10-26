"use client";

import { useEffect, useRef, useState } from "react";

// Sources are attached only on intent; one recording can play across all tiles.
const activeMedia = new EventTarget();
export function StudyMedia({ name, poster, recording, width, height, tile = false }: {
  name: string; poster: string; recording?: string; width: number; height: number; tile?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const stop = () => { ref.current?.pause(); setPlaying(false); };
  const play = () => {
    activeMedia.dispatchEvent(new CustomEvent("pause", { detail: ref.current }));
    setLoaded(true);
    setPlaying(true);
  };
  useEffect(() => { if (loaded) ref.current?.load(); }, [loaded]);
  useEffect(() => {
    if (playing) ref.current?.play().catch(() => setPlaying(false));
  }, [playing, loaded]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { if (!entries[0].isIntersecting) stop(); });
    if (frame.current) observer.observe(frame.current);
    const hide = () => { if (document.hidden) stop(); };
    const pauseOthers = (event: Event) => { if ((event as CustomEvent).detail !== ref.current) stop(); };
    activeMedia.addEventListener("pause", pauseOthers);
    document.addEventListener("visibilitychange", hide);
    return () => { observer.disconnect(); activeMedia.removeEventListener("pause", pauseOthers); document.removeEventListener("visibilitychange", hide); };
  }, []);
  const preview = () => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (recording && tile && !connection?.saveData && window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) play();
  };
  useEffect(() => {
    if (!tile) return;
    const article = frame.current?.closest("article");
    const leave = (event: Event) => {
      if (!(event instanceof FocusEvent) || !article?.contains(event.relatedTarget as Node | null)) stop();
    };
    article?.addEventListener("pointerenter", preview);
    article?.addEventListener("pointerleave", leave);
    article?.addEventListener("focusin", preview);
    article?.addEventListener("focusout", leave);
    return () => {
      article?.removeEventListener("pointerenter", preview);
      article?.removeEventListener("pointerleave", leave);
      article?.removeEventListener("focusin", preview);
      article?.removeEventListener("focusout", leave);
    };
  }, [tile, recording]);
  return <div className="ew-media" ref={frame}>
    <div className="ew-browser" aria-hidden="true"><span>● ● ●</span><span>{name} / product view</span></div>
    {recording ? <video ref={ref} poster={poster} width={width} height={height} preload="none" muted playsInline loop aria-label={`${name}, silent product walkthrough`} onPause={() => setPlaying(false)} onPlay={() => {
      const bounds = frame.current?.getBoundingClientRect();
      if (document.hidden || !bounds || bounds.bottom <= 0 || bounds.top >= window.innerHeight) stop();
    }}>
      {loaded && <><source src={`${recording}.webm`} type="video/webm" /><source src={`${recording}.mp4`} type="video/mp4" /></>}
    </video> : <img src={poster} width={width} height={height} alt={`${name} working interface, captured in the source repository`} loading={tile ? "lazy" : "eager"} decoding="async" />}
    {recording && <button type="button" className="ew-media-control" onClick={playing ? stop : play} aria-pressed={playing}>{playing ? "Pause" : "Play silent walkthrough"}</button>}
  </div>;
}
