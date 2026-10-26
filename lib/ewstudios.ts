// Facts and source captions: approved brief, reconciled against the pinned READMEs.
// Regenerate with node scripts/ewstudios-sources.cjs.
export const studies = [
  {
    "slug": "ewstudios",
    "folder": "ew-apps-api",
    "name": "Platform",
    "title": "Five different AI products. One $7 server.",
    "hook": "The shared work is deciding what the browser is allowed to ask for.",
    "ideaTitle": "One small server. Deliberate boundaries.",
    "idea": "Keep credentials, prompts and quotas behind one boundary. Keep product data in the browser.",
    "nodes": [
      "Browsers",
      "Hono guards",
      "Atomic quota",
      "Server template",
      "Gemini stream"
    ],
    "architecture": "Browsers send capped data through region, IP, JWT and input guards, then an atomic Supabase quota and a server-owned template. Gemini streams back to the browser. Supabase supplies identity and quota; source-CDN media travels directly to the browser. Queues and caches are single-process memory.",
    "next": "The IP limiter is in memory. Move it to Postgres before scaling beyond one dyno.",
    "metric": "$7 / month",
    "metricNote": "Heroku Basic only. Cloudflare Workers, Supabase and Gemini use free tiers. Seven apps share the API; five are featured here.",
    "decisions": [
      {
        "title": "Keep the trust boundary on the server",
        "body": "A shared model key must not become a general chatbot → clients send typed, capped data to server-owned templates, with validation, identity and quota guards → the quota increment and return happen in one atomic SQL statement, avoiding parallel calls slipping through. The region gate uses the last X-Forwarded-For entry because earlier entries can be forged.",
        "source": "ew-apps-api/README.md, “Decisions worth explaining” → “Templates live on the server”, “The quota is one atomic SQL statement”, “The region block is on the server”. Referenced implementation: src/app.ts, src/apps/, supabase/migrations/. No claim that prompt injection is universally solved."
      },
      {
        "title": "Stream within the host's deadline",
        "body": "Heroku drops a silent request after 30s → begin streaming, send a blank-line keep-alive every 10 seconds while waiting, and abort the model at 25s → clients receive partial output and an explicit upper bound, rather than waiting for a silent router failure. Keep-alives stop at the first model chunk so a translation's line breaks remain intact.",
        "source": "ew-apps-api/README.md, “Streaming, with a 25s stop”, “Keep-alives stop at the first chunk”, “JSON Lines output”. These are configured behaviors, not latency percentiles."
      },
      {
        "title": "Share infrastructure, keep app data local",
        "body": "Five featured products need shared AI identity and budgets → static Workers frontends, shared Supabase identity/quota and one $7 Heroku dyno; a 6-digit email code is the fallback → product data remains local while free-server AI has shared identity.",
        "source": "ew-apps-api/README.md → “The idea”, “The IP limit is in memory”; taskpilot/README.md and pixe/README.md → “One sign-in for every EWSTUDIOS app”. The API README now documents workers.dev as a public suffix: ewstudios.workers.dev is the shared registrable passkey domain. Four apps offer passkeys; Natour uses email code only. Shared identity does not mean shared task, board or library storage."
      }
    ],
    "quality": "README documents route tests with fake dependencies; npm test, npm run lint and npm run typecheck. No current run or test total is claimed.",
    "repo": "https://github.com/emwil23/ew-apps-api",
    "source": "https://github.com/emwil23/ew-apps-api/blob/aafe065a91f8846f02fb11a3355be1889544b6bf/README.md",
    "revision": "aafe065a91f8846f02fb11a3355be1889544b6bf",
    "live": null,
    "stack": "Hono · TypeScript · Heroku · Supabase · Gemini",
    "original": "Seven apps, one $7 Heroku dyno. Each app gets AI features without ever holding an API key or sending a raw prompt: the browser sends plain data (a goal, a list of tasks), and the server turns it into a prompt from a template it owns."
  },
  {
    "slug": "taskpilot",
    "folder": "taskpilot",
    "name": "TaskPilot",
    "title": "Your day, co-piloted.",
    "hook": "Your tasks stay on your device; AI is an action you choose.",
    "ideaTitle": "A cockpit for a calmer day.",
    "idea": "Natural-language capture, a flight path through the day and one place to plan, focus and review. The orange cockpit pairs Space Grotesk with a quiet task surface.",
    "nodes": [
      "Quick add",
      "Local parser",
      "IndexedDB",
      "Board / calendar",
      "Undo"
    ],
    "architecture": "Quick add is parsed locally and stored through Dexie in IndexedDB. Board, matrix and calendar read the same tasks. Optional AI sends selected task fields through a chosen provider; validated streamed items enter the calendar with Undo. Notes and project names are excluded.",
    "next": "Sync is Pro planned. Core task management needs no account; browser storage still needs a backup through JSON export.",
    "metric": "0.79 → 0.98",
    "metricNote": "README-reported mobile landing performance after prerendering; not a new portfolio measurement.",
    "decisions": [
      {
        "title": "Local-first ownership",
        "body": "The 2021 app was a form, four tabs and localStorage, with indexing/date/render-order bugs → store tasks in IndexedDB with plain JSON import/export, and require no account for core use → offline task management; sync remains a Pro feature for later. AI receives selected fields when invoked, never notes or project names.",
        "source": "taskpilot/README.md → “The idea”; “Decisions worth explaining” → “Local-first, no account”, “The AI sees as little as possible”. The historical counts are context, not a measured privacy/performance result; no sync benchmark exists."
      },
      {
        "title": "First paint before hydration",
        "body": "A JavaScript-dependent public landing delays content → prerender using React renderToString inside the built app and hydrate with the correct markers → reported mobile Lighthouse performance 0.79 → 0.98.",
        "source": "taskpilot/README.md → “Prerender and hydrate, not a server framework”; “How it is built” names scripts/prerender.mjs. Preserve the score scale and mobile/landing scope."
      },
      {
        "title": "Drag by destination, not by pixels",
        "body": "The default keyboard sensor only nudges cards → a coordinate getter jumps between drop zones for board, matrix and calendar → a complete keyboard path, not just a mouse alternative in the marketing copy.",
        "source": "taskpilot/README.md → “Keyboard drag for everyone”; “A walk through” → Board describes Space/arrows/Space. taskpilot/docs/design-brief.md → “Motion” specifies 150–220ms list/board transitions; this is a design timing, not a keyboard speed measurement. No numerical keyboard benchmark is documented; do not invent one."
      }
    ],
    "quality": "README reports Lighthouse 98–100 and zero axe violations.",
    "repo": "https://github.com/emwil23/taskpilot",
    "source": "https://github.com/emwil23/taskpilot/blob/8dabb62b269c1a7d93a3686245b218f5f88aa712/README.md",
    "revision": "8dabb62b269c1a7d93a3686245b218f5f88aa712",
    "live": "https://taskpilot.ewstudios.workers.dev",
    "stack": "React 19 · TypeScript · TanStack Router · IndexedDB",
    "original": "TaskPilot began in 2021 as a tutorial-sized React app: a form, four tabs and `localStorage`. It indexed tasks by `id - 1`, showed the wrong month, and reversed the stored list every time it rendered. This is a rebuild of it as a real product."
  },
  {
    "slug": "pixe",
    "folder": "pixe",
    "name": "Pixe",
    "title": "A light table for creative direction.",
    "hook": "Built around a board rather than another wall of search results.",
    "ideaTitle": "A board, not an image-search clone.",
    "idea": "Instrument Serif, warm black and lime frame actual prints on a light table. Rulers and specification lines support a working board rather than decorating a search grid.",
    "nodes": [
      "Board",
      "Photo search",
      "Source adapters",
      "Credited CDN",
      "DOM prints"
    ],
    "architecture": "The board calls shared cached photo adapters; credited images load from source CDNs into DOM prints. Palette extraction is local. AI description accepts selected public stock URLs only; uploaded images never enter the free-tier model. Board data remains in IndexedDB.",
    "next": "Existing boards open without the API, but search does not. Offline search is a possible improvement, not a shipped feature.",
    "metric": "202 pending",
    "metricNote": "Slow-source search returns after 20 seconds; the separate board-build wait ends at 12 seconds.",
    "decisions": [
      {
        "title": "Design around source rules",
        "body": "Repeating Unsplash's core experience is prohibited by the documented guidelines; the old app exposed its key → make search a tool inside a board, proxy keys and normalize sources, hotlink returned URLs and report exports → a moodboard with credit and licence context. Searches cache for one hour; the documented shared source budgets are 200/day for anonymous Openverse and 50/hour for Unsplash demo.",
        "source": "pixe/README.md → “Not an Unsplash clone”, “The keys stay on the server”. No claim that Openverse checks every licence."
      },
      {
        "title": "Let slow sources finish outside the request",
        "body": "Openverse can take 40 seconds, beyond Heroku's 30-second limit → return 202 pending after 20 seconds, let the in-flight search fill the cache and poll again → fast-source results appear immediately; board creation excludes a still-loading source after 12 seconds.",
        "source": "pixe/README.md → “Slow sources don't hold the page, or break it”. Explain the separate search and board-build clocks; do not imply a 40-second HTTP response survives the router."
      },
      {
        "title": "Keep the canvas in the DOM",
        "body": "Pixel canvas content is hard for screen readers to inspect and tldraw has a commercial licence constraint → real elements in one transformed layer, alt text, tab/arrow controls and an equivalent list → pointer drag, resize, pan and zoom in about 350 lines, with a nonvisual reading path.",
        "source": "pixe/README.md → “A DOM canvas, not a <canvas>”. “About” is essential; this is README-reported implementation size, not an accessibility audit score."
      }
    ],
    "quality": "README reports Lighthouse ≥95 and zero axe violations.",
    "repo": "https://github.com/emwil23/pixe",
    "source": "https://github.com/emwil23/pixe/blob/32fd0748f88511e43fbeb3db0e615b4f385a0ee0/README.md",
    "revision": "32fd0748f88511e43fbeb3db0e615b4f385a0ee0",
    "live": "https://pixe.ewstudios.workers.dev",
    "stack": "React 19 · TypeScript · TanStack Router · IndexedDB",
    "original": "Pixe began in 2021 as a React 17 photo search: type a word, get 30 Unsplash photos in a masonry grid. It had the Unsplash key in the source, no alt text (`alt={discription}`), and no credit for photographers. It also can't be rebuilt as it was: Unsplash's API rules say an app may not replicate Unsplash's core experience."
  },
  {
    "slug": "translateplus",
    "folder": "translateapp",
    "name": "Translate+",
    "title": "Say it like you mean it.",
    "hook": "Translate on the device first. Keep the words you care about, and the Hindi you actually speak.",
    "ideaTitle": "Everything hangs from the line.",
    "idea": "The Devanagari shirorekha becomes the rule above each panel. Fraunces and marigold sit beside Hindi; tone and respect level are explicit choices.",
    "nodes": [
      "Input",
      "Capability check",
      "Local / chosen AI",
      "Restore glossary",
      "Local history"
    ],
    "architecture": "A capability check selects on-device translation or an explicitly requested provider action. Numbered tokens preserve glossary terms; rule-based Hinglish runs locally. Phrasebook and history stay in IndexedDB. Document and photo text needs separate consent before AI use.",
    "next": "Offline translation needs a downloaded language pack and supported desktop Chrome. Unsupported browsers or pairs require an explicit provider action.",
    "metric": "2,000 glyphs",
    "metricNote": "One instanced draw call for the globe, not for the whole app. README-reported implementation.",
    "decisions": [
      {
        "title": "Do not spend AI calls on typing",
        "body": "Browser support and model downloads vary → prefer Chrome's built-in Translator/Language Detector on desktop Chrome 138+, cap availability/detection at 1–2 seconds, and fall back to an explicit Translate action → as-you-type stays on-device; tones and unsupported pairs use a chosen provider when requested.",
        "source": "translateapp/README.md → “On the device first”, “Typing never spends AI calls”. Offline requires a downloaded language pack; do not imply support in every browser."
      },
      {
        "title": "Preserve terms and handle Hinglish locally",
        "body": "The on-device translator cannot accept glossary instructions → substitute numbered tokens such as ⟦0⟧, restore terms afterwards, and use rule-based Devanagari/Latin conversion with Hindi schwa deletion → glossary terms survive the local path; कमल → kamal, समझना → samajhna are the documented examples.",
        "source": "translateapp/README.md → “A glossary that works on the device too”, “Hinglish is rule-based”. 0 is the documented placeholder index, not a success rate. Tests are documented, but no accuracy percentage or test total is available."
      },
      {
        "title": "Make the globe share its work",
        "body": "A glyph-rich hero can multiply geometry/material work → 2,000 glyphs share a plane and a canvas atlas, moved by a shader → one instanced draw call for the globe. Defer until after first paint, wide screens and real GPU only; omit for reduced motion.",
        "source": "translateapp/README.md → “One instanced draw call for the globe”. Do not generalize that count to the whole page or claim measured FPS."
      }
    ],
    "quality": "README reports Lighthouse ≥95 and zero axe violations.",
    "repo": "https://github.com/emwil23/TranslateApp",
    "source": "https://github.com/emwil23/TranslateApp/blob/9954ae68bf807c781ca7fc37a555da19bfc465f3/README.md",
    "revision": "9954ae68bf807c781ca7fc37a555da19bfc465f3",
    "live": "https://translateplus.ewstudios.workers.dev",
    "stack": "React 19 · TypeScript · TanStack Router · IndexedDB",
    "original": "Translate+ began in 2021 as a React Context exercise: two flag buttons, 🇺🇸 and 🇮🇳, that swapped the word \"Submit\" for \"Bhejo\". The name field didn't even keep its state. What was worth keeping was the pairing of English and Hindi, so that became the signature: Hinglish both ways, respect levels (aap, tum, tu), and an interface that itself comes in English and हिन्दी."
  },
  {
    "slug": "willify",
    "folder": "willify",
    "name": "Willify",
    "title": "A vibe is only the beginning.",
    "hook": "An AI DJ that has to prove the song exists before it reaches your playlist.",
    "ideaTitle": "A galaxy pressed into a record.",
    "idea": "Bricolage Grotesque, violet and mint turn the galaxy into a vinyl record. Verification precedes the library; playback keeps the source credit in view.",
    "nodes": [
      "Vibe",
      "Server template",
      "iTunes check",
      "Accepted library",
      "Two audio decks"
    ],
    "architecture": "The server suggests songs. The browser checks artist and title against iTunes, three at a time, before accepting them. A shared catalogue bucket caches JSON only. Preview streams travel directly from Apple into two browser audio decks, gain nodes and one analyser; audio and artwork are not service-worker cached.",
    "next": "This is preview-based listening, not full-track playback. Refining the preview experience is a proposal; competitor service buttons were deliberately omitted.",
    "metric": "14 of 16",
    "metricNote": "Matches in one documented real Gemini playlist. Two suggestions were dropped; this is not a global accuracy rate.",
    "decisions": [
      {
        "title": "Verify the catalogue, not model confidence",
        "body": "The model can invent tracks or choose covers → match normalized artist/title against iTunes, reject karaoke/tribute substitutions, prefer originals, and check as output streams → 14 of 16 suggestions matched in the documented real Gemini playlist; 2 dropped. Checks run three at a time.",
        "source": "willify/README.md → “The AI can't add a song that doesn't exist”, naming src/lib/match.ts. This is one example, not a global accuracy rate."
      },
      {
        "title": "Make source terms and the shared budget visible",
        "body": "Apple's promotional preview rules and API budget constrain both UI and traffic → direct Apple streaming, official unaltered Apple Music badge/link and iTunes credit, no Spotify/YouTube Music buttons, no audio/artwork service-worker cache; proxy JSON through one shared token bucket → about 20 calls/minute, queue up to 15 seconds, then 503 music_busy; cache JSON 6–24 hours, lookup up to 50 IDs at once.",
        "source": "willify/README.md → “Apple's terms shaped the interface”, “No competitor buttons”, “One iTunes budget for everyone”. Keep licensing and quota as separate parts of this decision, not proof that caching grants media reuse rights."
      },
      {
        "title": "Crossfade on real audio nodes",
        "body": "Cutting between previews breaks continuity → two audio decks feed Web Audio gain nodes and one analyser → a 1.5-second crossfade, with direct Apple CORS-enabled streams and Media Session controls.",
        "source": "willify/README.md → “Two decks, one analyser”. This is implemented timing, not measured perceptual quality."
      }
    ],
    "quality": "README reports mobile landing performance 0.98.",
    "repo": "https://github.com/emwil23/Willify",
    "source": "https://github.com/emwil23/Willify/blob/0ef8dbde82c55486a4152aaf89dac214a7dfdc6a/README.md",
    "revision": "0ef8dbde82c55486a4152aaf89dac214a7dfdc6a",
    "live": "https://willify.ewstudios.workers.dev",
    "stack": "React 19 · TypeScript · TanStack Router · IndexedDB",
    "original": "Willify started in 2021 as a Spotify player: search a song, play it in the page. Only Spotify Premium users could play anything, the client ID was hard-coded, and the login server on Heroku has been dead for years. What was worth keeping was the promise, _search a song, play it instantly_, and the name."
  },
  {
    "slug": "natour",
    "folder": "natour",
    "name": "Natour",
    "title": "A plan with its feet on the ground.",
    "hook": "The AI writes the itinerary. OpenStreetMap checks the places. Unchecked stays visibly unchecked.",
    "ideaTitle": "A journal, a route, a check stamp.",
    "idea": "Fraunces on map paper, terracotta route lines and forest-green stamps. The route-line N ends in a pin; a check is earned by a lookup rather than model confidence.",
    "nodes": [
      "Description",
      "Browser job",
      "Place checks",
      "IndexedDB",
      "Live-query views"
    ],
    "architecture": "A browser job streams and validates JSON Lines, checks destination-bounded names through the shared Nominatim queue and writes to IndexedDB. Views subscribe with live queries. Wikivoyage supplies guides, NASA POWER supplies climate averages and OpenFreeMap supplies tiles. A stop that cannot be checked is labelled and has no pin. Closing the running tab interrupts its job.",
    "next": "Interrupted jobs do not resume after tab closure. Durable resume is a proposed improvement. Natour uses email-code sign-in only.",
    "metric": "1 request / s",
    "metricNote": "Nominatim budget shared by the whole app. Climate uses NASA POWER 2001–2025 monthly averages, not a forecast.",
    "decisions": [
      {
        "title": "Check names before adding pins",
        "body": "Suggested places can be invented or refer to a road/bus stop → search Nominatim inside the destination bounds and require at least half the normalized name words to match; exclude inappropriate place types → the recorded Lisbon plan dropped one unmapped suggestion, and accepted stops use OSM names/coordinates. Busy/offline checks preserve a labelled unverified stop without a pin.",
        "source": "natour/README.md → “The AI can't add a place that doesn't exist”, naming src/lib/check.ts. One recorded plan is not an accuracy benchmark."
      },
      {
        "title": "Let data terms choose the stack",
        "body": "A planned commercial product cannot assume every free public endpoint fits → use a shared Nominatim queue at 1 request/second, submit-only search and caching; omit public Overpass/OSRM demo and free Open-Meteo under the documented terms assessment → estimated walking times use straight-line distance ×1.3 at 4.8 km/h, labelled ~; NASA POWER supplies 2001–2025 monthly climate averages instead of a forecast.",
        "source": "natour/README.md → “The terms of each data source shaped the app”, “Data and credits”; natour/docs/data-terms.md → source rows. The terms document confirms NASA POWER is used, approved by the owner on 2026-10-23."
      },
      {
        "title": "Let jobs outlive a React view",
        "body": "A plan can still be streaming when a user changes views → src/lib/trips.ts runs jobs outside React, checks each JSON line and writes to IndexedDB; pages watch live queries → switching views preserves progress and two tabs show the same progress. Closing the running tab still interrupts the job; the next visit clears it with a note.",
        "source": "natour/README.md → “Jobs run outside React”. Two tabs are documented behavior, not evidence of a durable background worker or server job queue."
      }
    ],
    "quality": "README reports mobile landing performance 0.96–0.98 and 1.0 in the other categories.",
    "repo": "https://github.com/emwil23/natour",
    "source": "https://github.com/emwil23/natour/blob/9568132dd42ea479bea28cc400eef8d66fc1676b/README.md",
    "revision": "9568132dd42ea479bea28cc400eef8d66fc1676b",
    "live": "https://natour.ewstudios.workers.dev",
    "stack": "React 19 · TypeScript · TanStack Router · IndexedDB",
    "original": "Natour started in 2021 as three CSS exercises from the same course: _natour_, a tour-booking landing page whose form went nowhere; _Trillo_, a hotel page with made-up reviews and \"only 4 rooms left\"; and _Nexter_, a homes page that survived only as built files. None of it did anything. What was worth keeping was the travel idea, natour's Easy / Medium / Hard tours, and \"where to stay\"."
  }
] as const;
export type Study = (typeof studies)[number];
export const apps = studies.filter(study => study.slug !== 'ewstudios');
