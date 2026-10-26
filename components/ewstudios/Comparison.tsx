"use client";

import { useId, useState } from "react";

export function Comparison({ slug, name, year }: { slug: string; name: string; year: string }) {
  const id = useId();
  const [position, setPosition] = useState(50);
  const [stacked, setStacked] = useState(false);
  return <div className="ew-comparison">
    <p className="ew-caption">{year} source reconstruction → live 2026 product. Same 1440 × 900 viewport, uncropped. Historical layout rendered with compatibility tooling; it does not demonstrate the old services working.</p>
    <button type="button" className="ew-button" aria-pressed={stacked} onClick={() => setStacked(!stacked)}>{stacked ? "Use comparison slider" : "Show both images"}</button>
    <div className={stacked ? "ew-comparison-stacked" : "ew-comparison-frame"}>
      <figure><img src={`/assets/ewstudios/${slug}.webp`} width="1200" height="750" loading="lazy" alt={`${name}, live 2026 interface`} /><figcaption>2026 / live product</figcaption></figure>
      <figure style={stacked ? undefined : { clipPath: `inset(0 ${100 - position}% 0 0)` }}><img src={`/assets/ewstudios/${slug}-before.webp`} width="1200" height="750" loading="lazy" alt={`${name}, ${year} source reconstruction`} /><figcaption>{year} / reconstruction</figcaption></figure>
    </div>
    {!stacked && <><label htmlFor={id} className="ew-caption">Reveal historical screen</label><input id={id} type="range" min="0" max="100" value={position} aria-valuetext={`${position}% historical screen; ${100 - position}% rebuilt product`} onChange={event => setPosition(Number(event.target.value))} /></>}
  </div>;
}
