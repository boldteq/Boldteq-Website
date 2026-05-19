#!/usr/bin/env node
/**
 * apply-css-fixes.mjs v2
 *
 * Reads audit/sprints/sp-auto.jsonl and applies pre-approved-category fixes to
 * CSS modules — both default context and @media contexts.
 *
 * Usage:
 *   node scripts/apply-css-fixes.mjs --dry-run             # preview all
 *   node scripts/apply-css-fixes.mjs --apply               # apply all
 *   node scripts/apply-css-fixes.mjs --apply --sprint=1    # one sprint
 *   node scripts/apply-css-fixes.mjs --apply --page=/      # one page
 *   node scripts/apply-css-fixes.mjs --apply --include-media   # @media too
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = '/Users/yashbaldha/Desktop/Boldteq App/Marketing Site/Boldteq - Website';
const BUGS = join(ROOT, 'audit/sprints/sp-auto.jsonl');

const args = process.argv.slice(2);
const APPLY = args.includes('--apply') && !args.includes('--dry-run');
const sprintArg = args.find(a => a.startsWith('--sprint='));
const pageArg = args.find(a => a.startsWith('--page='));
const SPRINT = sprintArg ? parseInt(sprintArg.split('=')[1]) : null;
const PAGE = pageArg ? pageArg.split('=')[1] : null;
const INCLUDE_MEDIA = args.includes('--include-media') || args.includes('--all-contexts');

const PRE_APPROVED = new Set([
  'color', 'background-color', 'border-color',
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'font-size', 'line-height', 'letter-spacing', 'font-weight',
  'border-radius', 'border-top-left-radius', 'border-top-right-radius',
  'border-bottom-left-radius', 'border-bottom-right-radius',
  'box-shadow',
  'grid-column-gap', 'grid-row-gap', 'gap', 'row-gap', 'column-gap',
  'max-width', 'min-width', 'min-height', 'max-height',
]);

// ── Load bug list ────────────────────────────────────────────────────────────
const lines = readFileSync(BUGS, 'utf8').trim().split('\n').filter(Boolean);
const bugs = lines.map(l => JSON.parse(l));

const candidates = bugs.filter(b => {
  if (!PRE_APPROVED.has(b.prop)) return false;
  if (!INCLUDE_MEDIA && b.context !== 'default') return false;
  if (typeof b.wfVal !== 'string' || b.wfVal.includes('var(')) return false;
  if (SPRINT !== null && b.sprint !== SPRINT) return false;
  if (PAGE !== null && b.page !== PAGE) return false;
  return true;
});

console.log(`Loaded ${bugs.length} bugs; ${candidates.length} candidates after filters`);
console.log(`Mode: ${APPLY ? 'APPLY' : 'DRY-RUN'}`);
if (SPRINT !== null) console.log(`Sprint filter: ${SPRINT}`);
if (PAGE !== null) console.log(`Page filter: ${PAGE}`);
console.log(`Include @media contexts: ${INCLUDE_MEDIA}`);

// Group by file
const byFile = {};
for (const b of candidates) {
  const path = join(ROOT, b.component);
  if (!byFile[path]) byFile[path] = [];
  byFile[path].push(b);
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function camelToKebab(s) {
  return s.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`).replace(/^-/, '');
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function stripComments(src) {
  let out = '';
  let i = 0;
  while (i < src.length) {
    if (src[i] === '/' && src[i + 1] === '*') {
      out += '  '; i += 2;
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) {
        out += src[i] === '\n' ? '\n' : ' ';
        i++;
      }
      if (i < src.length) { out += '  '; i += 2; }
    } else { out += src[i++]; }
  }
  return out;
}

// Find a top-level block matching a selector pattern
// pattern: { kind: 'class', name: 'className' } | { kind: 'media', mediaRe: RegExp }
function findTopLevelBlock(srcRaw, pattern) {
  const src = stripComments(srcRaw);
  let i = 0;
  while (i < src.length) {
    // Skip whitespace
    while (i < src.length && /\s/.test(src[i])) i++;
    if (i >= src.length) break;

    const isAt = src[i] === '@';
    const headStart = i;
    let head = '';
    while (i < src.length && src[i] !== '{' && src[i] !== '}' && src[i] !== ';') {
      head += src[i++];
    }
    if (src[i] === ';') { i++; continue; }
    if (src[i] !== '{') { i++; continue; }
    // Read body
    const bodyStart = i + 1;
    let d = 1; let j = i + 1;
    while (j < src.length && d > 0) {
      if (src[j] === '{') d++;
      else if (src[j] === '}') d--;
      if (d === 0) break;
      j++;
    }
    const bodyEnd = j; // position of closing }
    const blockEnd = j + 1;

    const headTrim = head.trim();
    if (pattern.kind === 'class' && !isAt) {
      const parts = headTrim.split(',').map(s => s.trim());
      const candidates = [pattern.name, camelToKebab(pattern.name)];
      if (parts.some(p => candidates.some(c => p === `.${c}` || p.startsWith(`.${c}:`) || p.startsWith(`.${c}.`) || p.startsWith(`.${c} `)))) {
        return { headStart, bodyStart, bodyEnd, blockEnd, head: headTrim };
      }
    } else if (pattern.kind === 'media' && isAt && /^@media\b/.test(headTrim)) {
      if (pattern.mediaRe.test(headTrim)) {
        return { headStart, bodyStart, bodyEnd, blockEnd, head: headTrim };
      }
    }
    i = blockEnd;
  }
  return null;
}

// Find a class block INSIDE a @media body (relative offsets to src absolute)
function findClassBlockInRange(srcRaw, className, rangeStart, rangeEnd) {
  const sub = stripComments(srcRaw).slice(rangeStart, rangeEnd);
  const candidates = [className, camelToKebab(className)];
  let i = 0;
  while (i < sub.length) {
    while (i < sub.length && /\s/.test(sub[i])) i++;
    if (i >= sub.length) break;
    if (sub[i] === '@') {
      // skip nested at-rule
      while (i < sub.length && sub[i] !== '{' && sub[i] !== ';') i++;
      if (sub[i] === ';') { i++; continue; }
      if (sub[i] === '{') {
        let d = 1; i++;
        while (i < sub.length && d > 0) {
          if (sub[i] === '{') d++;
          else if (sub[i] === '}') d--;
          i++;
        }
      }
      continue;
    }
    const headStart = i;
    let head = '';
    while (i < sub.length && sub[i] !== '{' && sub[i] !== '}' && sub[i] !== ';') {
      head += sub[i++];
    }
    if (sub[i] !== '{') { i++; continue; }
    const bodyStart = i + 1;
    let d = 1; let j = i + 1;
    while (j < sub.length && d > 0) {
      if (sub[j] === '{') d++;
      else if (sub[j] === '}') d--;
      if (d === 0) break;
      j++;
    }
    const bodyEnd = j;
    const blockEnd = j + 1;
    const parts = head.trim().split(',').map(s => s.trim());
    if (parts.some(p => candidates.some(c => p === `.${c}` || p.startsWith(`.${c}:`) || p.startsWith(`.${c}.`) || p.startsWith(`.${c} `)))) {
      return { headStart: headStart + rangeStart, bodyStart: bodyStart + rangeStart, bodyEnd: bodyEnd + rangeStart, blockEnd: blockEnd + rangeStart, head: head.trim() };
    }
    i = blockEnd;
  }
  return null;
}

function setPropInBody(src, bodyStart, bodyEnd, prop, newVal) {
  const body = src.slice(bodyStart, bodyEnd);
  const propRe = new RegExp(`(^|;|\\{)(\\s*)${escapeRegex(prop)}\\s*:\\s*([^;]+);`, 'm');
  if (propRe.test(body)) {
    const replaced = body.replace(propRe, `$1$2${prop}: ${newVal};`);
    return src.slice(0, bodyStart) + replaced + src.slice(bodyEnd);
  }
  const indent = (body.match(/\n(\s+)\S/) || [, '  '])[1];
  const trimmed = body.replace(/\s*$/, '\n');
  return src.slice(0, bodyStart) + trimmed + `${indent}${prop}: ${newVal};\n` + src.slice(bodyEnd);
}

function contextToMediaRe(ctx) {
  // ctx like "@media(max-width:991)" → /^@media[^{]*max-width[^{]*991/
  const m = ctx.match(/@media\(([a-z-]+):(\d+)\)/);
  if (!m) return null;
  const [, dir, num] = m;
  return new RegExp(`^@media[^{]*\\(${dir}\\s*:\\s*${num}px\\)`);
}

function contextToMediaHeader(ctx) {
  const m = ctx.match(/@media\(([a-z-]+):(\d+)\)/);
  if (!m) return null;
  const [, dir, num] = m;
  return `@media (${dir}: ${num}px)`;
}

// ── Run ──────────────────────────────────────────────────────────────────────
let applied = 0;
let skipped = 0;
const skips = { 'class-not-found': 0, 'media-create-failed': 0, 'unsafe': 0 };
const log = [];

for (const [filePath, fileBugs] of Object.entries(byFile)) {
  let src;
  try { src = readFileSync(filePath, 'utf8'); }
  catch { console.warn(`SKIP unreadable: ${filePath}`); skipped += fileBugs.length; continue; }
  const original = src;

  // De-dupe by (className, prop, context)
  const seen = new Map();
  for (const b of fileBugs) {
    const cls = b.title.split(':')[0].trim();
    seen.set(`${cls}|${b.prop}|${b.context}`, { ...b, _cls: cls });
  }

  // Apply default-context fixes first (simpler)
  for (const b of [...seen.values()].filter(x => x.context === 'default')) {
    if (!b.wfVal || /[<>]/.test(b.wfVal)) { skipped++; skips.unsafe++; continue; }
    const block = findTopLevelBlock(src, { kind: 'class', name: b._cls });
    if (!block) { skipped++; skips['class-not-found']++; log.push(`MISS ${b.id} .${b._cls} { ${b.prop} } @ default`); continue; }
    const next = setPropInBody(src, block.bodyStart, block.bodyEnd, b.prop, b.wfVal);
    if (next === src) { skipped++; skips['class-not-found']++; continue; }
    src = next; applied++;
    log.push(`FIX  ${b.id} .${b._cls} { ${b.prop}: ${b.wfVal} } @ default`);
  }

  // Apply @media-context fixes
  for (const b of [...seen.values()].filter(x => x.context !== 'default')) {
    if (!b.wfVal || /[<>]/.test(b.wfVal)) { skipped++; skips.unsafe++; continue; }
    const mediaRe = contextToMediaRe(b.context);
    const mediaHeader = contextToMediaHeader(b.context);
    if (!mediaRe || !mediaHeader) { skipped++; skips.unsafe++; continue; }

    let mediaBlock = findTopLevelBlock(src, { kind: 'media', mediaRe });
    if (!mediaBlock) {
      // Create the @media block at end of file
      const insertion = `\n${mediaHeader} {\n  .${camelToKebab(b._cls)} {\n    ${b.prop}: ${b.wfVal};\n  }\n}\n`;
      src = src.replace(/\s*$/, '') + insertion;
      applied++;
      log.push(`NEW  ${b.id} ${mediaHeader} { .${b._cls} { ${b.prop}: ${b.wfVal} } }`);
      continue;
    }

    // Look for class block inside media body
    let classBlock = findClassBlockInRange(src, b._cls, mediaBlock.bodyStart, mediaBlock.bodyEnd);
    if (!classBlock) {
      // Insert a fresh `.className { prop: val; }` inside @media
      const beforeClose = mediaBlock.bodyEnd;
      const indent = '  ';
      const insertion = `${indent}.${camelToKebab(b._cls)} {\n${indent}  ${b.prop}: ${b.wfVal};\n${indent}}\n`;
      src = src.slice(0, beforeClose) + insertion + src.slice(beforeClose);
      applied++;
      log.push(`INS  ${b.id} ${mediaHeader} { .${b._cls} { ${b.prop}: ${b.wfVal} } }`);
      continue;
    }

    const next = setPropInBody(src, classBlock.bodyStart, classBlock.bodyEnd, b.prop, b.wfVal);
    if (next === src) { skipped++; skips['class-not-found']++; continue; }
    src = next; applied++;
    log.push(`FIX  ${b.id} ${mediaHeader} { .${b._cls} { ${b.prop}: ${b.wfVal} } }`);
  }

  if (src !== original && APPLY) writeFileSync(filePath, src);
}

console.log(`\n=== ${APPLY ? 'APPLIED' : 'DRY-RUN'} ===`);
console.log(`Fixes applied: ${applied}`);
console.log(`Skipped: ${skipped}`);
console.log(`  class-not-found: ${skips['class-not-found']}`);
console.log(`  media-create-failed: ${skips['media-create-failed']}`);
console.log(`  unsafe: ${skips.unsafe}`);
if (args.includes('--verbose')) {
  console.log('\n--- log ---');
  console.log(log.slice(0, 250).join('\n'));
  if (log.length > 250) console.log(`... and ${log.length - 250} more`);
}
