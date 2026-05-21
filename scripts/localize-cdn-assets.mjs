#!/usr/bin/env node
/**
 * localize-cdn-assets.mjs
 *
 * Scans src/lib/constants/ for cdn.prod.website-files.com URLs, downloads each
 * unique asset to public/images/webflow/cdn/, rewrites the constant to point
 * at the local path. Idempotent — re-running skips already-downloaded assets.
 *
 * Usage:
 *   node scripts/localize-cdn-assets.mjs --dry-run
 *   node scripts/localize-cdn-assets.mjs --apply
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join, basename, dirname } from 'path';

const ROOT = '/Users/yashbaldha/Desktop/Boldteq App/Marketing Site/Boldteq - Website';
const CONST_DIR = join(ROOT, 'src/lib/constants');
const OUT_DIR = join(ROOT, 'public/images/webflow/cdn');

const args = process.argv.slice(2);
const APPLY = args.includes('--apply') && !args.includes('--dry-run');

const CDN_RE = /https:\/\/cdn\.prod\.website-files\.com\/[^"'\s,]+/g;

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|js|mjs)$/.test(e)) out.push(p);
  }
  return out;
}

// Collect unique URLs across all source files
const files = walk(CONST_DIR);
const urlMap = new Map(); // remoteUrl → { localPath, files: [] }

for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const matches = src.matchAll(CDN_RE);
  for (const m of matches) {
    const remote = m[0];
    if (!urlMap.has(remote)) {
      // Local path: cdn/{lastPathSegmentDecoded}
      const tail = remote.split('/').pop().split('?')[0];
      const decoded = decodeURIComponent(tail).replace(/[^\w.\-]/g, '_');
      const local = `/images/webflow/cdn/${decoded}`;
      urlMap.set(remote, { local, files: new Set() });
    }
    urlMap.get(remote).files.add(f);
  }
}

console.log(`Unique CDN URLs: ${urlMap.size}`);

mkdirSync(OUT_DIR, { recursive: true });

// Download each URL
let downloaded = 0, skipped = 0, failed = 0;
for (const [remote, info] of urlMap) {
  const localFs = join(ROOT, 'public', info.local.replace(/^\/+/, ''));
  if (existsSync(localFs)) {
    skipped++;
    continue;
  }
  if (!APPLY) {
    console.log(`  DRY  ${remote} → ${info.local}`);
    continue;
  }
  try {
    const res = await fetch(remote);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    mkdirSync(dirname(localFs), { recursive: true });
    writeFileSync(localFs, buf);
    downloaded++;
    console.log(`  GET  ${remote} → ${info.local} (${buf.length} bytes)`);
  } catch (err) {
    failed++;
    console.log(`  FAIL ${remote}: ${err.message}`);
  }
}

// Rewrite constants
let rewritten = 0;
const filesTouched = new Set();
for (const f of files) {
  let src = readFileSync(f, 'utf8');
  const original = src;
  for (const [remote, info] of urlMap) {
    if (src.includes(remote)) {
      src = src.split(remote).join(info.local);
    }
  }
  if (src !== original) {
    filesTouched.add(f);
    if (APPLY) writeFileSync(f, src);
    rewritten++;
  }
}

console.log(`\n=== ${APPLY ? 'APPLIED' : 'DRY-RUN'} ===`);
console.log(`Downloaded: ${downloaded}, skipped (cached): ${skipped}, failed: ${failed}`);
console.log(`Files rewritten: ${rewritten}`);
[...filesTouched].slice(0, 10).forEach(f => console.log(`  ${f.replace(ROOT + '/', '')}`));
