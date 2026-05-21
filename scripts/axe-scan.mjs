#!/usr/bin/env node
/**
 * axe-scan.mjs — Playwright + axe-core a11y scanner
 *
 * Usage:
 *   pnpm dev &
 *   node scripts/axe-scan.mjs --all
 *   node scripts/axe-scan.mjs --routes=/,/pricing
 *   node scripts/axe-scan.mjs --all --gate
 *
 * Flags:
 *   --routes=/a,/b           Override route list
 *   --all                    All ALL_PAGES
 *   --port=N                 Local port (default 3000)
 *   --gate                   Exit 1 on any violation
 *   --viewports=1440,479     Override viewports (default 1440)
 */

import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = '/Users/yashbaldha/Desktop/Boldteq App/Marketing Site/Boldteq - Website';
const OUT_DIR = join(ROOT, 'audit/axe');

const ALL_PAGES = [
  '/', '/pricing', '/our-works', '/how-it-works', '/beta', '/contact', '/scope',
  '/careers', '/our-mission', '/book-a-demo', '/blog', '/testimonials',
  '/newsletter', '/services/website-development', '/services/ui-ux-design',
  '/services/graphics-design', '/services/app-development', '/privacy-policy',
  '/terms-of-service',
  '/our-work/dabble',
  '/blog-posts/how-agencies-use-white-label-teams-in-practice-6',
];

const args = process.argv.slice(2);
function flag(name) { return args.find(a => a === `--${name}` || a.startsWith(`--${name}=`)); }
function flagValue(name, fallback) {
  const a = flag(name);
  if (!a) return fallback;
  const eq = a.indexOf('=');
  return eq === -1 ? true : a.slice(eq + 1);
}

const all = args.includes('--all');
const gate = args.includes('--gate');
const routesArg = flagValue('routes', null);
const port = flagValue('port', '3000');
const vpArg = flagValue('viewports', '1440');

const ROUTES = all ? ALL_PAGES : routesArg ? String(routesArg).split(',') : ['/'];
const VIEWPORT_NAMES = String(vpArg).split(',');
const VIEWPORTS = VIEWPORT_NAMES.map(w => ({
  '1440': { width: 1440, height: 900 },
  '991': { width: 991, height: 900 },
  '767': { width: 767, height: 900 },
  '479': { width: 479, height: 900 },
}[w])).filter(Boolean);

const BASE = `http://localhost:${port}`;

mkdirSync(OUT_DIR, { recursive: true });

function safePath(p) { return p === '/' ? '_root' : p.replace(/^\//, '').replace(/\//g, '_'); }

(async () => {
  console.log(`Routes: ${ROUTES.length} | Viewports: ${VIEWPORT_NAMES.join(',')}`);
  const summary = { generated_at: new Date().toISOString(), routes: {} };
  let totalViolations = 0;
  let failedRoutes = 0;

  const browser = await chromium.launch();
  for (const route of ROUTES) {
    summary.routes[route] = {};
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({ viewport: vp });
      const page = await ctx.newPage();
      const url = `${BASE}${route}`;
      console.log(`\n  axe ${route} @ ${vp.width}px`);
      try {
        await page.goto(url, { waitUntil: 'load', timeout: 45_000 });
        await page.waitForTimeout(800);
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
          .analyze();
        const violations = results.violations.map(v => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.length,
        }));
        summary.routes[route][vp.width] = {
          violation_count: violations.length,
          violations,
        };
        if (violations.length > 0) {
          totalViolations += violations.length;
          failedRoutes++;
          console.log(`    FAIL: ${violations.length} violations`);
          violations.slice(0, 5).forEach(v => {
            console.log(`      - [${v.impact}] ${v.id}: ${v.description.slice(0, 80)} (${v.nodes} nodes)`);
          });
        } else {
          console.log('    PASS');
        }
        const outFile = join(OUT_DIR, `${safePath(route)}-${vp.width}.json`);
        writeFileSync(outFile, JSON.stringify(results, null, 2));
      } catch (err) {
        summary.routes[route][vp.width] = { error: String(err.message || err).slice(0, 300) };
        console.log(`    ERROR: ${String(err.message || err).slice(0, 200)}`);
        failedRoutes++;
      }
      await ctx.close();
    }
  }
  await browser.close();

  writeFileSync(join(OUT_DIR, 'summary.json'), JSON.stringify(summary, null, 2));
  console.log(`\n=== AXE SCAN SUMMARY ===`);
  console.log(`Total violations: ${totalViolations} across ${failedRoutes} route+viewport combos`);
  console.log(`Report: ${join(OUT_DIR, 'summary.json')}`);

  if (gate && totalViolations > 0) {
    console.error(`\nGATE FAIL: ${totalViolations} accessibility violations.`);
    process.exit(1);
  }
})();
