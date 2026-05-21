#!/usr/bin/env node
/**
 * visual-diff.mjs v2 — stabilized harness
 *
 * Captures Playwright screenshots of local Next.js + live https://boldteq.com,
 * disables animations + masks chat/iframe widgets + locks carousel state,
 * computes pixel-by-pixel delta.
 *
 * Usage:
 *   pnpm dev &
 *   node scripts/visual-diff.mjs --port=3001 --pages=/ --viewports=1440
 *   node scripts/visual-diff.mjs --all
 *   node scripts/visual-diff.mjs --above-fold     # opt-in to old 900px-clip mode
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
];

const ALL_VIEWPORTS = [
  { name: '1440', width: 1440, height: 900 },
  { name: '991', width: 991, height: 900 },
  { name: '767', width: 767, height: 900 },
  { name: '479', width: 479, height: 900 },
];

const args = process.argv.slice(2);
const pagesArg = args.find(a => a.startsWith('--pages='));
const viewportsArg = args.find(a => a.startsWith('--viewports='));
const all = args.includes('--all');
const localOnly = args.includes('--local-only');
const liveOnly = args.includes('--live-only');
const fullPage = !args.includes('--above-fold');

const PAGES = all ? ALL_PAGES : (pagesArg ? pagesArg.split('=')[1].split(',') : ['/', '/pricing', '/our-works', '/how-it-works']);
const VIEWPORTS = viewportsArg
  ? viewportsArg.split('=')[1].split(',').map(w => ALL_VIEWPORTS.find(v => v.name === w)).filter(Boolean)
  : ALL_VIEWPORTS;
const portArg = args.find(a => a.startsWith('--port='));
const LOCAL_PORT = portArg ? portArg.split('=')[1] : '3000';
const LOCAL_BASE = `http://localhost:${LOCAL_PORT}`;

mkdirSync(OUT_DIR, { recursive: true });

function safePath(p) { return p === '/' ? '_root' : p.replace(/^\//, '').replace(/\//g, '_'); }

// Stabilization stylesheet: disables every animation + hides dynamic widgets
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
  // Inject animation-pause + widget-hide stylesheet
  await p.addStyleTag({ content: STABILIZE_CSS }).catch(() => {});
  // Lock Embla carousels to first slide (best-effort)
  await p.evaluate(() => {
    document.querySelectorAll('[data-embla-carousel], .embla').forEach((el) => {
      const inst = el.__embla__ || el.embla;
      if (inst && typeof inst.scrollTo === 'function') inst.scrollTo(0, true);
    });
  }).catch(() => {});
  // Brief settle (no networkidle — dev HMR + analytics keep socket open forever)
  await p.waitForTimeout(1000);
}

async function captureScreenshots(baseUrl, pages, viewports, kind) {
  const browser = await chromium.launch();
  const results = {};
  for (const page of pages) {
    results[page] = {};
    for (const vp of viewports) {
      const t0 = Date.now();
      console.log(`  [${kind}] ${page} @ ${vp.name} ...`);
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
        const outFile = join(OUT_DIR, safePath(page), `${vp.name}-${kind}.png`);
        mkdirSync(dirname(outFile), { recursive: true });
        await p.screenshot({ path: outFile, fullPage, timeout: 90_000 });
        results[page][vp.name] = { ok: true, file: outFile };
        console.log(`    ok in ${Date.now() - t0}ms`);
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

(async () => {
  console.log(`Pages: ${PAGES.length} | Viewports: ${VIEWPORTS.map(v => v.name).join(',')} | fullPage=${fullPage}`);

  let local = null, live = null;
  if (!liveOnly) {
    console.log(`Capturing local (${LOCAL_BASE})...`);
    local = await captureScreenshots(LOCAL_BASE, PAGES, VIEWPORTS, 'local');
  }
  if (!localOnly) {
    console.log('Capturing live (https://boldteq.com)...');
    live = await captureScreenshots('https://boldteq.com', PAGES, VIEWPORTS, 'live');
  }

  if (local && live) {
    const report = { generated_at: new Date().toISOString(), full_page: fullPage, pages: {} };
    for (const page of PAGES) {
      report.pages[page] = {};
      for (const vp of VIEWPORTS) {
        const localFile = local[page]?.[vp.name]?.file;
        const liveFile = live[page]?.[vp.name]?.file;
        const diffFile = join(OUT_DIR, safePath(page), `${vp.name}-diff.png`);
        const d = diffPng(localFile, liveFile, diffFile);
        report.pages[page][vp.name] = d
          ? { pct: Number(d.pct.toFixed(2)), mismatched: d.mismatched, width: d.width, height: d.height, diffFile }
          : { error: 'one screenshot failed' };
      }
    }
    writeFileSync(join(OUT_DIR, 'report.json'), JSON.stringify(report, null, 2));
    console.log('\n=== VISUAL DIFF REPORT ===');
    for (const [page, vps] of Object.entries(report.pages)) {
      for (const [v, r] of Object.entries(vps)) {
        if (r.pct !== undefined) console.log(`  ${page} @ ${v}: ${r.pct}% delta (${r.width}x${r.height})`);
        else console.log(`  ${page} @ ${v}: ${r.error}`);
      }
    }
    console.log(`\nReport: ${join(OUT_DIR, 'report.json')}`);
  }
})();
