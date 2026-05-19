#!/usr/bin/env node
/**
 * apply-quality-fixes.mjs
 *
 * Mechanical TSX fixes:
 *  - <Image|img alt=""> without aria-hidden → add aria-hidden="true"
 *  - <a ... target="_blank"> without rel → add rel="noopener noreferrer"
 *  - <iframe ...> without loading → add loading="lazy"
 *
 * Idempotent: re-running doesn't double-add.
 *
 * Usage:
 *   node scripts/apply-quality-fixes.mjs --dry-run
 *   node scripts/apply-quality-fixes.mjs --apply
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = '/Users/yashbaldha/Desktop/Boldteq App/Marketing Site/Boldteq - Website';
const SRC = join(ROOT, 'src');

const args = process.argv.slice(2);
const APPLY = args.includes('--apply') && !args.includes('--dry-run');

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(tsx|ts)$/.test(e)) out.push(p);
  }
  return out;
}

const files = walk(SRC);
let altFix = 0, relFix = 0, iframeFix = 0;
const touched = new Set();
const log = [];

for (const file of files) {
  let src = readFileSync(file, 'utf8');
  const original = src;

  // ── 1. alt="" without aria-hidden on <Image / <img tags ─────────────────────
  // Heuristic: find <Image ... alt="" ... /> or </Image>; if tag (between < and >)
  // lacks aria-hidden, insert it after alt.
  src = src.replace(/<(Image|img)\b([^>]*?)\balt=""([^>]*?)(\/?)>/g, (match, tag, before, after, slash) => {
    if (/aria-hidden=/.test(match)) return match;
    altFix++;
    log.push(`${file}: add aria-hidden to <${tag} alt="">`);
    return `<${tag}${before}alt="" aria-hidden="true"${after}${slash}>`;
  });

  // ── 2. <a target="_blank"> without rel ──────────────────────────────────────
  src = src.replace(/<a\b([^>]*?)target=("|')_blank\2([^>]*?)>/g, (match, before, q, after) => {
    if (/\brel=/.test(match)) return match;
    relFix++;
    log.push(`${file}: add rel="noopener noreferrer" to <a target="_blank">`);
    return `<a${before}target=${q}_blank${q} rel="noopener noreferrer"${after}>`;
  });

  // Also: <Link ... target="_blank"> without rel (Next.js Link)
  src = src.replace(/<Link\b([^>]*?)target=("|')_blank\2([^>]*?)>/g, (match, before, q, after) => {
    if (/\brel=/.test(match)) return match;
    relFix++;
    log.push(`${file}: add rel="noopener noreferrer" to <Link target="_blank">`);
    return `<Link${before}target=${q}_blank${q} rel="noopener noreferrer"${after}>`;
  });

  // ── 3. <iframe> without loading ─────────────────────────────────────────────
  // Preserve self-closing `/>` form.
  src = src.replace(/<iframe\b([\s\S]*?)(\s*\/?>)/g, (match, attrs, close) => {
    if (/\bloading=/.test(match)) return match;
    iframeFix++;
    log.push(`${file}: add loading="lazy" to <iframe>`);
    const selfClose = /\/>$/.test(close);
    if (selfClose) {
      return `<iframe${attrs}${attrs.endsWith(" ") || attrs.endsWith("\n") ? "" : " "}loading="lazy" />`;
    }
    return `<iframe${attrs} loading="lazy">`;
  });

  if (src !== original) {
    touched.add(file);
    if (APPLY) writeFileSync(file, src);
  }
}

console.log(`\n=== ${APPLY ? 'APPLIED' : 'DRY-RUN'} ===`);
console.log(`Files touched: ${touched.size}`);
console.log(`alt → aria-hidden: ${altFix}`);
console.log(`a/Link target=_blank → rel="noopener noreferrer": ${relFix}`);
console.log(`iframe → loading="lazy": ${iframeFix}`);
if (args.includes('--verbose')) {
  console.log('\n--- log ---');
  console.log(log.slice(0, 200).join('\n'));
  if (log.length > 200) console.log(`... and ${log.length - 200} more`);
}
