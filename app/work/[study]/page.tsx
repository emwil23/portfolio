import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { studies, type Study } from "@/lib/ewstudios";
import { screenshotSizes } from "@/lib/ewstudios-media";
import { Comparison } from "@/components/ewstudios/Comparison";
import history from "@/docs/ewstudios/history-manifest.json";
import evidence from "@/public/evidence/ewstudios-checks.json";
import { StudyChrome } from "@/components/ewstudios/StudyChrome";
import { StudyMedia } from "@/components/ewstudios/StudyMedia";
import { Architecture } from "@/components/ewstudios/Architecture";
import { StudioIndex } from "@/components/ewstudios/StudioIndex";
import { TaskPilotMark } from "@/components/ewstudios/TaskPilotMark";
import { PixeMark } from "@/components/ewstudios/PixeMark";
import { TranslatePlusMark } from "@/components/ewstudios/TranslatePlusMark";
import { WillifyMark } from "@/components/ewstudios/WillifyMark";
import { NatourMark } from "@/components/ewstudios/NatourMark";
import "@/components/ewstudios/ewstudios.css";

export const dynamicParams = false;
export function generateStaticParams() { return studies.map(study => ({ study: study.slug })); }
function getStudy(slug: string) { return studies.find(study => study.slug === slug) ?? notFound(); }

export function generateMetadata({ params }: { params: { study: string } }): Metadata {
  const study = getStudy(params.study);
  const title = `${study.name} — ${study.title} | Emmanuel Wilson`;
  const image = `/assets/ewstudios/${study.slug}-og.webp`;
  return {
    title, description: study.hook, alternates: { canonical: `/work/${study.slug}/` },
    openGraph: { title, description: study.hook, url: `/work/${study.slug}/`, type: "article", images: [{ url: image, width: 1200, height: 630, alt: `${study.name}: product and engineering study by Emmanuel Wilson` }] },
    twitter: { card: "summary_large_image", title, description: study.hook, images: [image] },
  };
}

const marks = { taskpilot: TaskPilotMark, pixe: PixeMark, translateplus: TranslatePlusMark, willify: WillifyMark, natour: NatourMark };
const palettes = {
  taskpilot: [["Cockpit orange", "#FF6B3D"], ["Sky", "#7CC4FF"]],
  pixe: [["Lime", "#D4FF3A"], ["Warm black", "#0E0D0C"]],
  translateplus: [["Marigold", "#FFB43A"], ["Indigo", "#7C8CFF"]],
  willify: [["Violet", "#8F72FF"], ["Mint", "#6CF2C2"]],
  natour: [["Paper", "#F4EFE6"], ["Terracotta", "#B8402A"], ["Forest", "#2C6A4C"]],
};
const typefaces = { taskpilot: "Space Grotesk", pixe: "Instrument Serif", translateplus: "Fraunces · Noto Serif Devanagari", willify: "Bricolage Grotesque", natour: "Fraunces" };

function decisionParts(body: string) {
  const [constraint, choice, ...result] = body.split(" → ");
  return [constraint, choice, result.join(" → ")];
}

function Credits({ study }: { study: Study }) {
  if (study.slug === "willify") return <p className="ew-caption">Previews courtesy of iTunes. <a href="https://music.apple.com/" aria-label="Listen on Apple Music"><img src="/assets/ewstudios/listen-on-apple-music.svg" width="110" height="40" alt="Listen on Apple Music" style={{ display: "inline-block", verticalAlign: "middle", marginLeft: 12 }} /></a> Live catalogue search recording; portfolio playback is silent. No preview audio is embedded.</p>;
  if (study.slug === "natour") return <p className="ew-caption">Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors / ODbL</a>; place checks by Nominatim; tiles by OpenFreeMap / OpenMapTiles. Guides: <a href="https://en.wikivoyage.org/">Wikivoyage / CC BY-SA 4.0</a>. Climate data obtained from the NASA Langley Research Center <a href="https://power.larc.nasa.gov/">POWER Project</a>, funded through the NASA Earth Science Division, Climatology API 2001–2025. Photo credits remain in the source screen.</p>;
  if (study.slug === "pixe") return <p className="ew-caption">Live example-board recording. Photographer, Unsplash, Pexels and Openverse source/licence links remain part of the app interface. Public-stock search and user uploads have different AI boundaries. <a href="/evidence/ewstudios-photo-credits.json">Photographer and licence links for the captured prints</a>.</p>;
  return <p className="ew-caption">Live product recording, October 2026. AI actions requiring sign-in are not demonstrated. The capture manifest records each interaction and its limits.</p>;
}

export default function StudyPage({ params }: { params: { study: string } }) {
  const study = getStudy(params.study);
  const platform = study.slug === "ewstudios";
  const historical = history.find(entry => entry.slug === study.slug);
  const proof = evidence.lighthouse.find(entry => entry.slug === study.slug);
  const next = studies[studies.indexOf(study) + 1];
  const appSlug = platform ? null : study.slug;
  const Mark = appSlug ? marks[appSlug] : null;
  const url = `https://emmanuelwilson.tech/work/${study.slug}/`;
  const schema = [
    { "@context": "https://schema.org", "@type": "Article", headline: `${study.name}: ${study.title}`, description: study.hook, url, image: `https://emmanuelwilson.tech/assets/ewstudios/${study.slug}-og.webp`, author: { "@type": "Person", name: "Emmanuel Wilson", url: "https://emmanuelwilson.tech/" }, about: study.name, citation: study.source },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Studio", item: "https://emmanuelwilson.tech/case-studies/#ewstudios" }, { "@type": "ListItem", position: 2, name: study.name, item: url }] },
  ];
  return <>
    <a className="ew-skip" href="#study-content">Skip to study</a>
    <StudyChrome />
    <main id="study-content" className="ew-shell ew-study" data-app={study.slug}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <nav className="ew-topline" aria-label="Study navigation"><Link prefetch={false} href="/case-studies/#ewstudios">← EWSTUDIOS / index</Link><span className="ew-caption">{platform ? "The shared platform" : `Product study / ${study.name}`}</span></nav>
      <header className="ew-hero" data-chapter={`ew${platform ? "platform" : study.slug}`}>
        <p className="ew-eyebrow">{platform ? "EWSTUDIOS / the platform" : `2021 → 2026 / ${study.name}`}</p>
        <div className={platform ? "ew-platform-hero" : undefined}><div><h1>{study.title}</h1><p className="ew-lead">{study.hook}</p>{platform && <p className="ew-caption">{study.metricNote}</p>}</div>{platform && <img src="/assets/character/idle.webp" width="200" height="260" alt="Emmanuel Wilson's portfolio character" />}</div>
        <dl className="ew-facts"><div><dt>Role</dt><dd>Product, design direction and engineering lead, built with Claude Code</dd></div><div><dt>Timeline</dt><dd>{platform ? "Shared platform · October 2026" : "2021 original · rebuilt 19–25 October 2026"}</dd></div><div><dt>Stack</dt><dd>{study.stack}</dd></div></dl>
        <div className="ew-actions">{study.live && <a className="ew-button" href={study.live}>Open {study.name} ↗</a>}<a className="ew-button" href={study.repo}>View the repository ↗</a>{!platform && <Link prefetch={false} className="ew-button" href="/work/ewstudios/">The shared platform →</Link>}</div>
        {appSlug && <><StudyMedia name={study.name} poster={`/assets/ewstudios/${appSlug}.webp`} recording={`/assets/ewstudios/${appSlug}`} {...screenshotSizes[appSlug]} /><Credits study={study} /><p className="ew-caption"><a href="/evidence/ewstudios-captures.json">Capture actions, source links and limits</a></p><details className="ew-phone"><summary>See the phone layout</summary><img src={`/assets/ewstudios/${appSlug}-phone.webp`} width="390" height="844" loading="lazy" alt={`${study.name} live phone interface at 390 pixels wide`} /></details></>}
        <div className="ew-metric"><strong>{study.metric}</strong><p>{study.metricNote}</p></div>
      </header>

      {platform ? <section className="ew-chapter" aria-labelledby="apps-title"><div className="ew-section-heading"><p className="ew-eyebrow">The five featured products</p><h2 id="apps-title">Shared infrastructure.<br />Independent experiences.</h2></div><StudioIndex compact /></section> : <>
        <section className="ew-chapter" aria-labelledby="history-title"><div className="ew-section-heading"><p className="ew-eyebrow">The rebuild</p><h2 id="history-title">Keep the spark.<br />Rebuild the product.</h2></div><div className="ew-history"><strong>2021 → 2026</strong><div><p>{study.original.replace(/[*`_]/g, "")}</p><p className="ew-caption">{historical?.slug === "natour" ? "Reconstructed from the original 2021 Header component at 2be11cc with compatibility tooling. The Natour, Trillo and Nexter CSS course exercises are credited in the app README." : "Reconstructed from the archived original source with React 18, esbuild and Dart Sass; the original CRA 4/node-sass toolchain was not rebuilt."} {historical?.slug === "pixe" && "Old Unsplash calls are disabled and the exposed key is removed; the empty search is authentic to that offline state."} {historical?.slug === "willify" && "Only the original login screen is rendered; the removed Spotify login service is not restored."} <a href="/evidence/ewstudios-history.json">Revision and substitutions</a></p></div></div>{appSlug && historical && <Comparison slug={appSlug} name={study.name} year={historical.commitDate.slice(0, 4)} />}</section>
        <section className="ew-chapter" aria-labelledby="idea-title"><div className="ew-section-heading"><p className="ew-eyebrow">The idea</p><h2 id="idea-title">{study.ideaTitle}</h2><p>{study.idea}</p></div><div className="ew-brand">{Mark && <Mark />}<div><div className="ew-brand-type">{study.name}</div><p className="ew-caption">{appSlug && typefaces[appSlug]} / original SVG mark</p></div></div><div className="ew-swatches">{appSlug && palettes[appSlug].map(([label, color]) => <span className="ew-swatch" key={color}><i aria-hidden="true" style={{ background: color }} />{label} / {color}</span>)}</div><p className="ew-caption">Brand colours above; text and focus accents adapt for contrast in each portfolio theme. <a href={`${study.repo}/blob/${study.revision}/docs/design-brief.md`}>Design source ↗</a></p></section>
      </>}

      <section className="ew-chapter" aria-labelledby="decisions-title"><div className="ew-section-heading"><p className="ew-eyebrow">Three engineering decisions</p><h2 id="decisions-title">The constraint shapes<br />the implementation.</h2></div><div className="ew-decisions">{study.decisions.map((decision, i) => <article className="ew-decision" key={decision.title}><span className="ew-decision-number" aria-hidden="true">0{i + 1}</span><div><h3>{decision.title}</h3>{decisionParts(decision.body).map((part, j) => <p key={j}><strong>{["Constraint", "Decision", "Result"][j]}.</strong> {part}</p>)}<details><summary>Source and evidence limits</summary><p>{decision.source}</p><a href={`${study.source}#decisions-worth-explaining`}>Read the pinned README ↗</a></details></div></article>)}</div></section>

      <section className="ew-chapter" aria-labelledby="architecture-title"><div className="ew-section-heading"><p className="ew-eyebrow">Architecture</p><h2 id="architecture-title">Follow one request.</h2></div><Architecture nodes={study.nodes} description={study.architecture} platform={platform} />{platform && <p className="ew-caption">Passkey domain: ewstudios.workers.dev. Because workers.dev is a public suffix, its child is registrable and can be the shared RP ID. Supabase origin limits mean four apps offer passkeys; Natour uses the emailed 6-digit code only. <a href={`${study.source}#decisions-worth-explaining`}>API README, “One passkey for every app, because workers.dev is a public suffix” · aafe065 ↗</a></p>}</section>

      <section className="ew-chapter" aria-labelledby="quality-title"><div className="ew-section-heading"><p className="ew-eyebrow">Quality proof / evidence, with scope</p><h2 id="quality-title">Show what was checked.</h2></div><div className="ew-quality"><div><h3>App evidence</h3><p>{study.quality}</p><p className="ew-caption">Repository report, read 26 October 2026. These app scores were not rerun for this portfolio.</p><a href={`${study.source}#run-it`}>Commands and evidence in the README ↗</a></div><div><h3>This portfolio page</h3><p>Static HTML, deferred decorative Stage, explicit media intent and complete reduced-motion content.</p>{proof && <><dl className="ew-proof-scores">{Object.entries(proof.scores).map(([label, score]) => <div key={label}><dt>{label.replace("best-practices", "best practices")}</dt><dd>{score}<small>/100</small></dd></div>)}</dl><p className="ew-caption">Lighthouse mobile, light theme, cold cache, simulated throttling. Measured {proof.date.slice(0, 10)}. Gzip static export on localhost.</p><p className="ew-caption">Eight page cases across Chromium/WebKit, phone/desktop and both themes; two axe audits with zero violations. WebKit playback and real Safari hardware remain unverified.</p></>}<a href="/evidence/ewstudios-checks.json">Read the dated portfolio check results ↗</a></div></div></section>

      <section className="ew-chapter" aria-labelledby="next-title"><p className="ew-eyebrow">The honest next step</p><h2 id="next-title">What remains.</h2><p className="ew-lead">{study.next}</p>{study.slug === "natour" && <p className="ew-caption"><a href={`${study.repo}/blob/${study.revision}/docs/data-terms.md`}>NASA POWER approval and source terms, 23 October 2026 ↗</a></p>}</section>
      <Link prefetch={false} className="ew-next" data-app={next?.slug} href={next ? `/work/${next.slug}/` : "/case-studies/#ewstudios"}><span>Next / {next?.name || "Back to the studio"}</span><strong>{next?.title || "Five products. One foundation."} <span aria-hidden="true">↗</span></strong></Link>
      <Link prefetch={false} className="ew-back" href="/case-studies/#ewstudios">← Back to studio index</Link>
    </main>
  </>;
}
