#!/usr/bin/env node
/**
 * visual-diff.mjs v3 — gated harness
 *
 * Captures Playwright screenshots of local Next.js + live https://boldteq.com,
 * disables animations + masks chat/iframe widgets + locks carousel state,
 * computes pixel-by-pixel delta + page-height geometry check.
 *
 * Usage:
 *   pnpm dev &
 *   node scripts/visual-diff.mjs --all
 *   node scripts/visual-diff.mjs --pages=/,/pricing --viewports=1440,479
 *   node scripts/visual-diff.mjs --all --gate=5 --page-height-tolerance=2
 *   node scripts/visual-diff.mjs --component=nav --all
 *   node scripts/visual-diff.mjs --above-fold     # opt-in to old 900px-clip mode
 *
 * Flags:
 *   --gate=N                       Exit 1 if any page/vp delta exceeds N%
 *   --page-height-tolerance=N      Exit 1 if local/live page height delta exceeds N%
 *   --component=<key>              Clip to named component selector (nav|footer|beta-cta|newsletter)
 *   --port=N                       Local port (default 3000)
 *   --pages=/a,/b                  Override page list
 *   --viewports=1440,991,767,479   Override viewport list
 *   --all                          All ALL_PAGES
 *   --local-only / --live-only     Skip one side
 *   --above-fold                   900px viewport-clip mode (legacy)
 */

import { chromium } from '@playwright/test';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';

const ROOT = '/Users/yashbaldha/Desktop/Boldteq App/Marketing Site/Boldteq - Website';
const OUT_DIR = join(ROOT, 'audit/screens');

const ALL_PAGES = [
  '/', '/pricing', '/our-works', '/how-it-works', '/beta', '/contact', '/scope',
  '/careers', '/our-mission', '/book-a-demo', '/blog', '/testimonials',
  '/newsletter', '/services/website-development', '/services/ui-ux-design',
  '/services/graphics-design', '/services/app-development', '/privacy-policy',
  '/terms-of-service',
  // Representative dynamic routes
  '/our-works/dabble',
  '/blog/how-agencies-use-white-label-teams-in-practice-6',
];

const ALL_VIEWPORTS = [
  { name: '1440', width: 1440, height: 900 },
  { name: '991', width: 991, height: 900 },
  { name: '767', width: 767, height: 900 },
  { name: '479', width: 479, height: 900 },
];

// Named component selectors for --component clip mode
const COMPONENT_SELECTORS = {
  nav: 'nav, header nav, [role="navigation"]',
  footer: 'footer',
  'beta-cta': '[data-section="beta-cta"], [data-beta-cta], section[class*="betaCta"], section[class*="beta-cta"]',
  newsletter: '[data-section="newsletter"], [data-newsletter], section[class*="newsletter"]',
};

const args = process.argv.slice(2);
function flag(name) { return args.find(a => a === `--${name}` || a.startsWith(`--${name}=`)); }
function flagValue(name, fallback) {
  const a = flag(name);
  if (!a) return fallback;
  const eq = a.indexOf('=');
  return eq === -1 ? true : a.slice(eq + 1);
}

const pagesArg = flagValue('pages', null);
const viewportsArg = flagValue('viewports', null);
const all = args.includes('--all');
const localOnly = args.includes('--local-only');
const liveOnly = args.includes('--live-only');
const fullPage = !args.includes('--above-fold');
const gate = flag('gate') ? Number(flagValue('gate', 5)) : null;
const heightTol = flag('page-height-tolerance') ? Number(flagValue('page-height-tolerance', 2)) : null;
const componentKey = flagValue('component', null);
const componentSelector = componentKey && typeof componentKey === 'string'
  ? (COMPONENT_SELECTORS[componentKey] || componentKey)
  : null;

const PAGES = all
  ? ALL_PAGES
  : pagesArg
    ? String(pagesArg).split(',')
    : ['/', '/pricing', '/our-works', '/how-it-works'];
const VIEWPORTS = viewportsArg
  ? String(viewportsArg).split(',').map(w => ALL_VIEWPORTS.find(v => v.name === w)).filter(Boolean)
  : ALL_VIEWPORTS;
const LOCAL_PORT = flagValue('port', '3000');
const LOCAL_BASE = `http://localhost:${LOCAL_PORT}`;

mkdirSync(OUT_DIR, { recursive: true });

function safePath(p) { return p === '/' ? '_root' : p.replace(/^\//, '').replace(/\//g, '_'); }
function fileSuffix() { return componentKey ? `-comp-${componentKey}` : ''; }

const STABILIZE_CSS = `
*, *::before, *::after {
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
  scroll-behavior: auto !important;
}
.woot-widget-bubble,
.woot-widget-banner,
.woot-widget-holder,
#woot-widget-holder,
iframe[src*="guidejar"],
iframe[src*="chatwoot"],
iframe[src*="hotjar"],
iframe[id*="hubspot"] {
  visibility: hidden !important;
  opacity: 0 !important;
  display: none !important;
}
`;

async function stabilizePage(p) {
  await p.addStyleTag({ content: STABILIZE_CSS }).catch(() => {});
  await p.evaluate(() => {
    document.querySelectorAll('[data-embla-carousel], .embla').forEach((el) => {
      const inst = el.__embla__ || el.embla;
      if (inst && typeof inst.scrollTo === 'function') inst.scrollTo(0, true);
    });
  }).catch(() => {});
  await p.waitForTimeout(1000);
}

async function captureScreenshots(baseUrl, pages, viewports, kind) {
  const browser = await chromium.launch();
  const results = {};
  for (const page of pages) {
    results[page] = {};
    for (const vp of viewports) {
      const t0 = Date.now();
      console.log(`  [${kind}] ${page} @ ${vp.name}${componentKey ? ` (component=${componentKey})` : ''} ...`);
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        reducedMotion: 'reduce',
        deviceScaleFactor: 1,
      });
      const p = await ctx.newPage();
      const url = `${baseUrl}${page}`;
      try {
        await p.goto(url, { waitUntil: 'load', timeout: 60_000 });
        await stabilizePage(p);

        const outFile = join(OUT_DIR, safePath(page), `${vp.name}-${kind}${fileSuffix()}.png`);
        mkdirSync(dirname(outFile), { recursive: true });

        let pageHeight = null;
        if (componentSelector) {
          const handle = await p.$(componentSelector);
          if (!handle) throw new Error(`Component selector found nothing: ${componentSelector}`);
          await handle.screenshot({ path: outFile, timeout: 60_000 });
        } else {
          await p.screenshot({ path: outFile, fullPage, timeout: 90_000 });
          pageHeight = await p.evaluate(() => document.documentElement.scrollHeight);
        }
        results[page][vp.name] = { ok: true, file: outFile, pageHeight };
        console.log(`    ok in ${Date.now() - t0}ms${pageHeight ? ` (h=${pageHeight}px)` : ''}`);
      } catch (err) {
        results[page][vp.name] = { ok: false, error: String(err.message || err) };
        console.log(`    FAIL in ${Date.now() - t0}ms: ${String(err.message || err).slice(0, 200)}`);
      }
      await ctx.close();
    }
  }
  await browser.close();
  return results;
}

function diffPng(aPath, bPath, outPath) {
  if (!existsSync(aPath) || !existsSync(bPath)) return null;
  const a = PNG.sync.read(readFileSync(aPath));
  const b = PNG.sync.read(readFileSync(bPath));
  const width = Math.min(a.width, b.width);
  const height = Math.min(a.height, b.height);
  const cropA = cropPng(a, width, height);
  const cropB = cropPng(b, width, height);
  const diff = new PNG({ width, height });
  const mismatched = pixelmatch(cropA.data, cropB.data, diff.data, width, height, { threshold: 0.18 });
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, PNG.sync.write(diff));
  return { width, height, mismatched, pct: (mismatched / (width * height)) * 100 };
}

function cropPng(src, w, h) {
  if (src.width === w && src.height === h) return src;
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const srcIdx = (y * src.width + x) * 4;
      const dstIdx = (y * w + x) * 4;
      out.data[dstIdx + 0] = src.data[srcIdx + 0];
      out.data[dstIdx + 1] = src.data[srcIdx + 1];
      out.data[dstIdx + 2] = src.data[srcIdx + 2];
      out.data[dstIdx + 3] = src.data[srcIdx + 3];
    }
  }
  return out;
}

function pctHeightDelta(localH, liveH) {
  if (!localH || !liveH) return null;
  const base = Math.max(localH, liveH);
  return Math.abs(localH - liveH) / base * 100;
}

function writeMarkdownReport(report, outPath) {
  const lines = [];
  lines.push(`# Visual Diff Report`);
  lines.push('');
  lines.push(`**Generated:** ${report.generated_at}`);
  lines.push(`**Mode:** ${report.full_page ? 'fullPage' : 'above-fold'}${report.component ? ` · component=${report.component}` : ''}`);
  if (report.gate !== null) lines.push(`**Gate:** <${report.gate}% pixel delta${report.height_tolerance !== null ? ` · ±${report.height_tolerance}% page-height` : ''}`);
  lines.push('');
  lines.push(`| Page | Viewport | Δ pixels | Δ height | Status | Diff |`);
  lines.push(`|---|---|---|---|---|---|`);
  for (const [page, vps] of Object.entries(report.pages)) {
    for (const [v, r] of Object.entries(vps)) {
      if (r.error) {
        lines.push(`| \`${page}\` | ${v} | — | — | ❌ ERROR | ${r.error} |`);
        continue;
      }
      const px = `${r.pct.toFixed(2)}%`;
      const ht = r.heightPct === null || r.heightPct === undefined ? '—' : `${r.heightPct.toFixed(2)}%`;
      const passPx = report.gate === null || r.pct < report.gate;
      const passHt = report.height_tolerance === null || r.heightPct === null || r.heightPct === undefined || r.heightPct < report.height_tolerance;
      const status = passPx && passHt ? '✅' : '❌';
      const diffRel = r.diffFile ? r.diffFile.replace(`${ROOT}/`, '') : '';
      lines.push(`| \`${page}\` | ${v} | ${px} | ${ht} | ${status} | [diff](${diffRel}) |`);
    }
  }
  lines.push('');
  if (report.summary) {
    lines.push(`**Summary:** ${report.summary.passing}/${report.summary.total} passing · worst ${report.summary.worst_pct?.toFixed(2)}% on \`${report.summary.worst_page}\` @ ${report.summary.worst_vp}`);
  }
  writeFileSync(outPath, lines.join('\n'));
}

(async () => {
  console.log(`Pages: ${PAGES.length} | Viewports: ${VIEWPORTS.map(v => v.name).join(',')} | fullPage=${fullPage}${componentKey ? ` | component=${componentKey}` : ''}`);
  if (gate !== null) console.log(`Gate: <${gate}% delta${heightTol !== null ? ` + ±${heightTol}% page-height` : ''}`);

  let local = null, live = null;
  if (!liveOnly) {
    console.log(`Capturing local (${LOCAL_BASE})...`);
    local = await captureScreenshots(LOCAL_BASE, PAGES, VIEWPORTS, 'local');
  }
  if (!localOnly) {
    console.log('Capturing live (https://boldteq.com)...');
    live = await captureScreenshots('https://boldteq.com', PAGES, VIEWPORTS, 'live');
  }

  if (!local || !live) {
    console.log('\nOne-sided capture complete. No diff produced.');
    process.exit(0);
  }

  const report = {
    generated_at: new Date().toISOString(),
    full_page: fullPage,
    component: componentKey || null,
    gate: gate !== null ? gate : null,
    height_tolerance: heightTol !== null ? heightTol : null,
    pages: {},
  };

  let total = 0, passing = 0, worstPct = -1, worstPage = '', worstVp = '';
  let failCount = 0;

  for (const page of PAGES) {
    report.pages[page] = {};
    for (const vp of VIEWPORTS) {
      const localFile = local[page]?.[vp.name]?.file;
      const liveFile = live[page]?.[vp.name]?.file;
      const localH = local[page]?.[vp.name]?.pageHeight;
      const liveH = live[page]?.[vp.name]?.pageHeight;
      const diffFile = join(OUT_DIR, safePath(page), `${vp.name}-diff${fileSuffix()}.png`);
      const d = diffPng(localFile, liveFile, diffFile);
      const heightPct = pctHeightDelta(localH, liveH);

      if (!d) {
        report.pages[page][vp.name] = { error: 'one screenshot failed' };
        failCount++;
        total++;
        continue;
      }

      const entry = {
        pct: Number(d.pct.toFixed(2)),
        mismatched: d.mismatched,
        width: d.width,
        height: d.height,
        localHeight: localH,
        liveHeight: liveH,
        heightPct: heightPct === null ? null : Number(heightPct.toFixed(2)),
        diffFile,
      };
      report.pages[page][vp.name] = entry;
      total++;

      const passPx = gate === null || entry.pct < gate;
      const passHt = heightTol === null || entry.heightPct === null || entry.heightPct < heightTol;
      if (passPx && passHt) passing++;
      else failCount++;

      if (entry.pct > worstPct) { worstPct = entry.pct; worstPage = page; worstVp = vp.name; }
    }
  }

  report.summary = { total, passing, worst_pct: worstPct, worst_page: worstPage, worst_vp: worstVp };

  const jsonOut = join(OUT_DIR, componentKey ? `report-${componentKey}.json` : 'report.json');
  const mdOut = join(OUT_DIR, componentKey ? `REPORT-${componentKey}.md` : 'REPORT.md');
  writeFileSync(jsonOut, JSON.stringify(report, null, 2));
  writeMarkdownReport(report, mdOut);

  console.log('\n=== VISUAL DIFF REPORT ===');
  for (const [page, vps] of Object.entries(report.pages)) {
    for (const [v, r] of Object.entries(vps)) {
      if (r.pct !== undefined) {
        const ht = r.heightPct === null || r.heightPct === undefined ? '' : ` · Δh=${r.heightPct}%`;
        const passPx = gate === null || r.pct < gate;
        const passHt = heightTol === null || r.heightPct === null || r.heightPct < heightTol;
        const status = passPx && passHt ? 'PASS' : 'FAIL';
        console.log(`  [${status}] ${page} @ ${v}: ${r.pct}% (${r.width}x${r.height})${ht}`);
      } else {
        console.log(`  [ERR ] ${page} @ ${v}: ${r.error}`);
      }
    }
  }
  console.log(`\nReport: ${jsonOut}`);
  console.log(`Markdown: ${mdOut}`);
  console.log(`Summary: ${passing}/${total} passing · worst ${worstPct.toFixed(2)}% on ${worstPage} @ ${worstVp}`);

  if (gate !== null && failCount > 0) {
    console.error(`\nGATE FAIL: ${failCount} page/viewport combinations exceed thresholds.`);
    process.exit(1);
  }
})();
