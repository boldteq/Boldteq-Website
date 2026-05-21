#!/usr/bin/env node
/**
 * lighthouse.mjs — Chrome headless Lighthouse runner
 *
 * Usage:
 *   pnpm dev &
 *   node scripts/lighthouse.mjs --all
 *   node scripts/lighthouse.mjs --routes=/,/pricing
 *   node scripts/lighthouse.mjs --all --gate
 *
 * Flags:
 *   --routes=/a,/b           Override route list
 *   --all                    All ALL_PAGES from visual-diff.mjs
 *   --port=N                 Local port (default 3000)
 *   --gate                   Exit 1 if any score < threshold
 *   --perf=N                 Perf threshold (default 95)
 *   --a11y=N                 Accessibility threshold (default 100)
 *   --bp=N                   Best Practices threshold (default 100)
 *   --seo=N                  SEO threshold (default 100)
 */

import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';

const ROOT = '/Users/yashbaldha/Desktop/Boldteq App/Marketing Site/Boldteq - Website';
const OUT_DIR = join(ROOT, 'audit/lighthouse');

const ALL_PAGES = [
  '/', '/pricing', '/our-works', '/how-it-works', '/beta', '/contact', '/scope',
  '/careers', '/our-mission', '/book-a-demo', '/blog', '/testimonials',
  '/newsletter', '/services/website-development', '/services/ui-ux-design',
  '/services/graphics-design', '/services/app-development', '/privacy-policy',
  '/terms-of-service',
  '/our-works/dabble',
  '/blog/how-agencies-use-white-label-teams-in-practice-6',
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
const perfThresh = Number(flagValue('perf', 95));
const a11yThresh = Number(flagValue('a11y', 100));
const bpThresh = Number(flagValue('bp', 100));
const seoThresh = Number(flagValue('seo', 100));

const ROUTES = all ? ALL_PAGES : routesArg ? String(routesArg).split(',') : ['/'];
const BASE = `http://localhost:${port}`;

mkdirSync(OUT_DIR, { recursive: true });

function safePath(p) { return p === '/' ? '_root' : p.replace(/^\//, '').replace(/\//g, '_'); }

function runLighthouse(url, outFile) {
  return new Promise((resolve, reject) => {
    const proc = spawn('npx', [
      '--yes', 'lighthouse',
      url,
      '--output=json',
      `--output-path=${outFile}`,
      '--chrome-flags=--headless=new --no-sandbox --disable-gpu',
      '--quiet',
      '--preset=desktop',
      '--throttling-method=devtools',
    ], { stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';
    proc.stderr.on('data', d => { stderr += d.toString(); });
    proc.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`Lighthouse exited ${code}: ${stderr.slice(-500)}`));
    });
  });
}

(async () => {
  console.log(`Routes: ${ROUTES.length} | Thresholds: P${perfThresh}/A${a11yThresh}/BP${bpThresh}/SEO${seoThresh}`);
  const summary = { generated_at: new Date().toISOString(), routes: {} };
  let failCount = 0;

  for (const route of ROUTES) {
    const url = `${BASE}${route}`;
    const outFile = join(OUT_DIR, `${safePath(route)}.json`);
    console.log(`\n  Running Lighthouse: ${url}`);
    try {
      await runLighthouse(url, outFile);
      const { readFileSync } = await import('fs');
      const report = JSON.parse(readFileSync(outFile, 'utf8'));
      const cats = report.categories || {};
      const scores = {
        performance: Math.round((cats.performance?.score || 0) * 100),
        accessibility: Math.round((cats.accessibility?.score || 0) * 100),
        best_practices: Math.round((cats['best-practices']?.score || 0) * 100),
        seo: Math.round((cats.seo?.score || 0) * 100),
      };
      summary.routes[route] = scores;
      const pass = scores.performance >= perfThresh
        && scores.accessibility >= a11yThresh
        && scores.best_practices >= bpThresh
        && scores.seo >= seoThresh;
      const flagStr = pass ? 'PASS' : 'FAIL';
      console.log(`    [${flagStr}] P${scores.performance} A${scores.accessibility} BP${scores.best_practices} SEO${scores.seo}`);
      if (!pass) failCount++;
    } catch (err) {
      summary.routes[route] = { error: String(err.message || err).slice(0, 300) };
      console.log(`    ERROR: ${String(err.message || err).slice(0, 200)}`);
      failCount++;
    }
  }

  writeFileSync(join(OUT_DIR, 'summary.json'), JSON.stringify(summary, null, 2));
  console.log(`\nSummary: ${ROUTES.length - failCount}/${ROUTES.length} passing`);
  console.log(`Report: ${join(OUT_DIR, 'summary.json')}`);

  if (gate && failCount > 0) {
    console.error(`\nGATE FAIL: ${failCount} routes failed Lighthouse thresholds.`);
    process.exit(1);
  }
})();
