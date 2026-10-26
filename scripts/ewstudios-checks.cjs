const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.resolve('.pw-browsers');
const { chromium, webkit, firefox } = require('playwright');
const { default: AxeBuilder } = require('@axe-core/playwright');
const origin = process.env.STUDY_ORIGIN || 'http://127.0.0.1:4173';
const slugs = ['ewstudios', 'taskpilot', 'pixe', 'translateplus', 'willify', 'natour'];
const result = { date: new Date().toISOString(), origin, scope: 'Exported portfolio pages, not app README scores', browsers: [], axe: [], failures: [], liveApps: [], home: {}, limitations: ['Real Safari/iPhone hardware not available.', '.git writes denied: commits and branch push unavailable.'] };

(async () => {
  const range = await fetch(`${origin}/assets/ewstudios/taskpilot.mp4`, { headers: { Range: 'bytes=0-15' } });
  assert.equal(range.status, 206);
  assert.equal((await range.arrayBuffer()).byteLength, 16);
  result.byteRanges = '16-byte video request returned HTTP 206';
  const html = await fetch(`${origin}/work/ewstudios/`, { headers: { 'Accept-Encoding': 'gzip' } });
  assert.equal(html.headers.get('content-encoding'), 'gzip');
  const invalid = await fetch(`${origin}/%2e%2e%2fCLAUDE.md`);
  assert.equal(invalid.status, 403);
  for (const [engine, launcher] of Object.entries({ chromium, webkit, firefox })) {
    let browser;
    try {
      browser = await launcher.launch({ headless: true, timeout: 15000 });
      for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
        for (const theme of ['light', 'dark']) {
          const context = await browser.newContext({ viewport, colorScheme: theme, reducedMotion: 'reduce' });
          await context.addInitScript(value => localStorage.setItem('portfolio-theme', value), theme);
          const page = await context.newPage();
          const errors = [];
          page.on('pageerror', error => errors.push(error.message));
          for (const slug of slugs) {
            const url = `${origin}/work/${slug}/`;
            const row = { engine, viewport, theme, slug };
            try {
              const response = await page.goto(url, { waitUntil: 'networkidle' });
              assert.equal(response.status(), 200);
              await page.getByRole('heading', { level: 1 }).waitFor();
              await page.evaluate(() => document.fonts.ready);
              await page.waitForFunction(() => [...document.querySelectorAll('header')].every(el => Number(getComputedStyle(el).opacity) === 1));
              assert.equal(await page.locator('h1').count(), 1);
              assert.equal(await page.locator('.ew-decision > div > p > strong').count(), 9, 'three labelled paragraphs per decision, including inline arrow examples');
              assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), `https://emmanuelwilson.tech/work/${slug}/`);
              assert.equal(await page.locator('video source').count(), 0, 'no recording loads without intent');
              assert.equal(await page.locator('canvas').count(), 0, 'reduced motion has no decorative stage');
              assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no horizontal overflow');
              const broken = await page.locator('main img').evaluateAll(images => images.filter(img => img.getBoundingClientRect().top < innerHeight && img.getBoundingClientRect().bottom > 0).filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src));
              assert.deepEqual(broken, [], 'all above-fold images loaded');
              const schemas = await page.locator('main script[type="application/ld+json"]').textContent();
              assert.equal(JSON.parse(schemas)[0]['@type'], 'Article');
              await page.getByRole('link', { name: /Back to studio index/ }).focus();
              assert.ok(await page.getByRole('link', { name: /Back to studio index/ }).evaluate(el => document.activeElement === el));
              if (engine === 'chromium' && viewport.width === 1440) {
                const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
                result.axe.push({ slug, theme, violations: axe.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({target:n.target,summary:n.failureSummary})) })) });
                assert.equal(axe.violations.length, 0, 'axe has no violations');
              }
              row.passed = true;
            } catch (error) { row.passed = false; row.error = error.message; result.failures.push(row); }
            result.browsers.push(row);
          }
          if (errors.length) result.failures.push({ engine, viewport, theme, pageErrors: errors });
          await context.close();
        }
      }
      if (engine === 'chromium') {
        const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const page = await context.newPage();
        const requests = [];
        page.on('request', request => requests.push(request.url()));
        await page.goto(`${origin}/?skip=true`, { waitUntil: 'networkidle' });
        result.home = { requests: requests.length, appMediaRequests: requests.filter(url => /\/assets\/ewstudios\//.test(url)), studyPrefetchRequests: requests.filter(url => /\/work\//.test(url)), glimpseBytes: fs.statSync('public/assets/glimpse/ewstudios.webp').size };
        assert.deepEqual(result.home.appMediaRequests, []);
        assert.deepEqual(result.home.studyPrefetchRequests, []);
        await page.getByRole('link', { name: /04 · EWSTUDIOS: five AI apps, one backend/ }).click();
        await page.getByRole('heading', { name: /Five different AI products/ }).waitFor();
        await page.waitForFunction(() => {
          const top = document.querySelector('#ewstudios')?.getBoundingClientRect().top;
          return top !== undefined && top >= -2 && top < 200;
        });
        assert.equal(await page.locator('#ewstudios .ew-app-tile').count(), 5);
        result.studioIndex = { tiles: 5, anchor: await page.locator('#ewstudios').evaluate(el => Math.round(el.getBoundingClientRect().top)) };
        for (const slug of slugs.filter(slug => slug !== 'ewstudios')) {
          const response = await page.goto(`https://${slug}.ewstudios.workers.dev`, { waitUntil: 'domcontentloaded' });
          result.liveApps.push({ slug, status: response.status(), title: await page.title() });
        }
        await context.close();
      }
    } catch (error) { if(engine === 'firefox' && result.browsers.every(row=>row.engine!=='firefox')) result.limitations.push('Firefox blocked: '+error.message.split('\n')[0]); else result.failures.push({ engine, error: error.message }); }
    finally { await browser?.close(); }
    fs.writeFileSync('docs/ewstudios/browser-results.json', JSON.stringify(result, null, 2));
    console.log(`${engine}: ${result.browsers.filter(row => row.engine === engine && row.passed).length} passed`);
  }
  fs.writeFileSync('docs/ewstudios/browser-results.json', JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ pages: result.browsers.length, passed: result.browsers.filter(row => row.passed).length, axeRuns: result.axe.length, failures: result.failures.length }));
  if (result.failures.length) process.exitCode = 1;
})();
