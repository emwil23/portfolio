import Link from "next/link";
import { apps } from "@/lib/ewstudios";
import { StudyMedia } from "./StudyMedia";
import { screenshotSizes } from "@/lib/ewstudios-media";

export function StudioIndex({ compact = false }: { compact?: boolean }) {
  return <div className={compact ? "ew-app-links" : "ew-app-grid"}>
    {apps.map((app, i) => <article key={app.slug} data-app={app.slug} className="ew-app-tile">
      <div className="ew-tile-copy"><p className="ew-eyebrow">0{i + 1} / {app.name}</p><h3><Link prefetch={false} href={`/work/${app.slug}/`}>{app.title} <span aria-hidden="true">↗</span></Link></h3><p>{app.hook}</p></div>
      {!compact && <StudyMedia name={app.name} poster={`/assets/ewstudios/${app.slug}.webp`} recording={`/assets/ewstudios/${app.slug}`} {...screenshotSizes[app.slug]} tile />}
      <Link prefetch={false} className="ew-tile-link" href={`/work/${app.slug}/`}>Read the {app.name} study <span aria-hidden="true">→</span></Link>
    </article>)}
  </div>;
}
