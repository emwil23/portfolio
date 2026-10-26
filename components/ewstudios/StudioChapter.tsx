import Link from "next/link";
import { Architecture } from "./Architecture";
import { StudioIndex } from "./StudioIndex";
import "./ewstudios.css";

export function StudioChapter() {
  return <section id="ewstudios" className="ew-studio ew-shell" aria-labelledby="ewstudio-title">
    <header data-chapter="ewstudio" className="ew-studio-intro glass-panel">
      <p className="ew-eyebrow">Independent products / EWSTUDIOS / 2021 → 2026</p>
      <h2 id="ewstudio-title">Five different AI products.<br /><em>One $7 server.</em></h2>
      <p>Five old exercises rebuilt as working products. One shared platform for the things each browser should never have to hold: model keys, trusted prompts and quotas.</p>
      <p className="ew-caption">$7/month for Heroku Basic. Cloudflare Workers, Supabase and Gemini use free tiers. The API serves all five apps.</p>
      <Link prefetch={false} className="ew-button" href="/work/ewstudios/">Read the platform study <span aria-hidden="true">↗</span></Link>
      <Architecture nodes={["Five featured apps", "Shared identity", "Hono guards", "$7 Heroku dyno", "Gemini"]} description="Static Workers frontends share Supabase identity and quota through the API. Task, board, phrasebook, library and journal data remain in each browser. Natour uses an email code only." compact />
    </header>
    <div data-chapter="ewindex"><div className="ew-section-heading"><p className="ew-eyebrow">The product index</p><h2>Same foundation.<br />Five ways to use it.</h2></div><StudioIndex /></div>
  </section>;
}
