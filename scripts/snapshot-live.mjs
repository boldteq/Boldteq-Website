#!/usr/bin/env node
/**
 * snapshot-live.mjs — Archive live boldteq.com per-sprint snapshot
 *
 * Freezes the live diff target into audit/live-snapshot/{ISO_DATE}/ so live
 * site drift doesn't move the comparison target mid-sprint.
 *
 * Usage:
 *   node scripts/snapshot-live.mjs            # all pages, all 4 viewports
 *   node scripts/snapshot-live.mjs --pages=/  # specific pages
 *   node scripts/snapshot-live.mjs --tag=S1   # custom folder suffix
 */

import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = '/Users/yashbaldha/Desktop/Boldteq App/Marketing Site/Boldteq - Website';
const SNAPSHOT_ROOT = join(ROOT, 'audit/live-snapshot');

const ALL_PAGES = [
  '/', '/pricing', '/our-works', '/how-it-works', '/beta', '/contact', '/scope',
  '/careers', '/our-mission', '/book-a-demo', '/blog', '/testimonials',
  '/newsletter', '/services/website-development', '/services/ui-ux-design',
  '/services/graphics-design', '/services/app-development', '/privacy-policy',
  '/terms-of-service',
  '/our-works/dabble',
  '/blog/how-agencies-use-white-label-teams-in-practice-6',
];

const ALL_VIEWPORTS = [
  { name: '1440', width: 1440, height: 900 },
  { name: '991', width: 991, height: 900 },
  { name: '767', width: 767, height: 900 },
  { name: '479', width: 479, height: 900 },
];

const args = process.argv.slice(2);
function flag(name) { return args.find(a => a === `--${name}` || a.startsWith(`--${name}=`)); }
function flagValue(name, fallback) {
  const a = flag(name);
  if (!a) return fallback;
  const eq = a.indexOf('=');
  return eq === -1 ? true : a.slice(eq + 1);
}

const pagesArg = flagValue('pages', null);
const tag = flagValue('tag', null);
const PAGES = pagesArg ? String(pagesArg).split(',') : ALL_PAGES;

const today = new Date().toISOString().slice(0, 10);
const folder = tag ? `${today}_${tag}` : today;
const OUT = join(SNAPSHOT_ROOT, folder);
mkdirSync(OUT, { recursive: true });

function safePath(p) { return p === '/' ? '_root' : p.replace(/^\//, '').replace(/\//g, '_'); }

const STABILIZE_CSS = `
*, *::before, *::after {
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
  scroll-behavior: auto !important;
}
.woot-widget-bubble, .woot-widget-holder, iframe[src*="guidejar"],
iframe[src*="chatwoot"], iframe[src*="hotjar"], iframe[id*="hubspot"] {
  visibility: hidden !important; opacity: 0 !important; display: none !important;
}
`;

(async () => {
  console.log(`Snapshotting live boldteq.com → ${OUT}`);
  console.log(`Pages: ${PAGES.length} · Viewports: ${ALL_VIEWPORTS.map(v => v.name).join(',')}`);
  const browser = await chromium.launch();
  const manifest = { snapshot_date: new Date().toISOString(), tag, pages: {} };

  for (const page of PAGES) {
    manifest.pages[page] = {};
    for (const vp of ALL_VIEWPORTS) {
      const t0 = Date.now();
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        reducedMotion: 'reduce',
        deviceScaleFactor: 1,
      });
      const p = await ctx.newPage();
      const url = `https://boldteq.com${page}`;
      try {
        await p.goto(url, { waitUntil: 'load', timeout: 60_000 });
        await p.addStyleTag({ content: STABILIZE_CSS }).catch(() => {});
        await p.waitForTimeout(1500);
        const outFile = join(OUT, safePath(page), `${vp.name}.png`);
        mkdirSync(join(OUT, safePath(page)), { recursive: true });
        await p.screenshot({ path: outFile, fullPage: true, timeout: 90_000 });
        const pageHeight = await p.evaluate(() => document.documentElement.scrollHeight);
        manifest.pages[page][vp.name] = { ok: true, file: outFile, pageHeight };
        console.log(`  [ok] ${page} @ ${vp.name} (${Date.now() - t0}ms, h=${pageHeight}px)`);
      } catch (err) {
        manifest.pages[page][vp.name] = { ok: false, error: String(err.message || err).slice(0, 200) };
        console.log(`  [FAIL] ${page} @ ${vp.name}: ${String(err.message || err).slice(0, 100)}`);
      }
      await ctx.close();
    }
  }

  await browser.close();
  writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`\nSnapshot complete: ${OUT}`);
})();
