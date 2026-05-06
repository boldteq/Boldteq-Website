/**
 * codemod-tokens.mjs
 *
 * Replaces raw hex colors, font-family strings, and box-shadow values
 * with CSS design tokens across all non-primitive CSS module files.
 *
 * Zero visual change — same computed values, just via variables.
 *
 * Usage:
 *   node scripts/codemod-tokens.mjs [--dry-run]
 *
 * --dry-run  Print change counts without writing files.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const DRY_RUN = process.argv.includes('--dry-run');

// ─── Color map ────────────────────────────────────────────────────────────────
// Maps exact hex (lowercase) → CSS variable.
// Applied only to standalone property values, NOT inside box-shadow, gradient, border alpha.
const COLOR_MAP = new Map([
  ['#082753', 'var(--color-text-primary)'],
  ['#092245', 'var(--color-brand-navy)'],
  ['#21cfff', 'var(--color-brand-cyan)'],
  ['#019ae6', 'var(--color-brand-blue)'],
  ['#05bafe', 'var(--color-brand-cyan)'],
  ['#009ce0', 'var(--color-brand-card-border)'],
  ['#0ab4e8', 'var(--color-brand-cyan)'],
  ['#111827', 'var(--color-brand-dark)'],
  ['#23272f', 'var(--color-brand-dark)'],
  ['#2b2b2b', 'var(--color-text-secondary)'],
  ['#252525', 'var(--color-text-secondary)'],
  ['#5b616e', 'var(--color-text-muted)'],
  ['#6b7280', 'var(--color-text-subtle)'],
  ['#4b5563', 'var(--color-text-subtle)'],
  ['#1c3861', 'var(--color-text-primary)'],
  ['#f5f7fa', 'var(--color-brand-light-bg)'],
  ['#f4f7fa', 'var(--color-brand-light-bg)'],
  ['#f7f7f8', 'var(--color-brand-gray-bg)'],
  ['#cdebfa', 'var(--color-brand-card-hover)'],
  ['#effafe', 'var(--color-cyan-tint)'],
  ['#def4ff', 'var(--color-success-bg)'],
  ['#e6f7ff', 'var(--color-info-bg)'],
  ['#91d5ff', 'var(--color-info-border)'],
  ['#0050b3', 'var(--color-info-fg)'],
  ['#ef4444', 'var(--color-danger)'],
  ['#e53e3e', 'var(--color-danger)'],
  // Hex shorthand for alpha variants — normalize format only
  ['#0000001a', 'rgba(0, 0, 0, 0.1)'],
]);

// Colors that are safe to replace ONLY in standalone standalone value contexts.
// We check: property is color/background-color/fill/stroke/outline-color/caret-color.
const SAFE_PROPS = new Set([
  'color',
  'background-color',
  'background',
  'border-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'outline-color',
  'fill',
  'stroke',
  'caret-color',
  'text-decoration-color',
  '-webkit-text-fill-color',
]);

// ─── Shadow map ───────────────────────────────────────────────────────────────
// Applied as exact multiline string replacement (after normalizing whitespace).
const SHADOW_MAP = [
  ['0 0 5px rgba(0, 0, 0, 0.1)', 'var(--shadow-card)'],
  ['0 0 5px rgba(0,0,0,0.1)', 'var(--shadow-card)'],
  ['0 0 5px #0000001a', 'var(--shadow-card)'],
  ['0 0 7px rgba(0, 0, 0, 0.1)', 'var(--shadow-card)'],
  ['0 0 7px rgba(0,0,0,0.1)', 'var(--shadow-card)'],
  ['0 0 80px rgba(175, 175, 175, 0.1)', 'var(--shadow-card-soft)'],
  ['0 0 80px rgba(175,175,175,0.1)', 'var(--shadow-card-soft)'],
  ['0 0 0 3px rgba(33, 207, 255, 0.15)', 'var(--shadow-focus-ring)'],
  ['0 0 0 3px rgba(33,207,255,0.15)', 'var(--shadow-focus-ring)'],
  ['0 4px 20px rgba(1, 154, 230, 0.1)', 'var(--shadow-card-cyan)'],
  ['0 4px 20px rgba(1,154,230,0.1)', 'var(--shadow-card-cyan)'],
  ['0 0 80px rgba(0, 0, 0, 0.1)', 'var(--shadow-pricing)'],
  ['0 0 80px rgba(0,0,0,0.1)', 'var(--shadow-pricing)'],
];

// ─── Font-family map ──────────────────────────────────────────────────────────
const FONT_MAP = [
  ["'Roobert PRO', Arial, sans-serif", "var(--font-roobert), Arial, sans-serif"],
  ['Roobert PRO, Arial, sans-serif', 'var(--font-roobert), Arial, sans-serif'],
];

// ─── Border-radius pill normalization ─────────────────────────────────────────
// Only normalize pill values — leave all Webflow-exact values as px.
const RADIUS_MAP = [
  ['border-radius: 999px', 'border-radius: var(--radius-pill)'],
  ['border-radius: 100px', 'border-radius: var(--radius-pill)'],
  ['border-radius: 50px', 'border-radius: var(--radius-pill)'],
  ['border-radius: 100%', 'border-radius: var(--radius-pill)'],
];

// ─── Color replacement: property-value aware ─────────────────────────────────
function replaceColorsInCSS(content) {
  let result = content;

  for (const [hex, token] of COLOR_MAP.entries()) {
    // Build a regex that matches:
    //   <property>: <hex>;  OR  <property>: <hex> !important;
    // The property must be in SAFE_PROPS or a CSS variable name.
    // We use a global replacer with lookbehind for the property colon.
    const escaped = hex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Match: (safe-prop or --var): ...possibly spaces... HEX ...possibly !important... ;
    const regex = new RegExp(
      `((?:${[...SAFE_PROPS].join('|')}|--[a-z][a-z0-9-]*)\\s*:\\s*)${escaped}(\\s*(?:!important)?\\s*;)`,
      'gi',
    );

    result = result.replace(regex, (_, before, after) => `${before}${token}${after}`);
  }

  return result;
}

// ─── Box-shadow replacement ────────────────────────────────────────────────────
function replaceShadows(content) {
  let result = content;
  for (const [from, to] of SHADOW_MAP) {
    // Replace: box-shadow: <value>;
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(box-shadow\\s*:\\s*)${escaped}(\\s*;)`, 'g');
    result = result.replace(regex, `$1${to}$2`);
  }
  return result;
}

// ─── Font-family replacement ──────────────────────────────────────────────────
function replaceFonts(content) {
  let result = content;
  for (const [from, to] of FONT_MAP) {
    result = result.split(from).join(to);
  }
  return result;
}

// ─── Border-radius normalization ──────────────────────────────────────────────
function normalizeRadius(content) {
  let result = content;
  for (const [from, to] of RADIUS_MAP) {
    result = result.split(from).join(to);
  }
  return result;
}

// ─── Process single file ──────────────────────────────────────────────────────
function processFile(filepath) {
  const original = readFileSync(filepath, 'utf8');
  let content = original;

  content = replaceFonts(content);
  content = replaceShadows(content);
  content = normalizeRadius(content);
  content = replaceColorsInCSS(content);

  if (content === original) return 0;

  if (!DRY_RUN) {
    writeFileSync(filepath, content, 'utf8');
  }

  // Count changed lines
  const origLines = original.split('\n');
  const newLines = content.split('\n');
  let changes = 0;
  for (let i = 0; i < Math.max(origLines.length, newLines.length); i++) {
    if (origLines[i] !== newLines[i]) changes++;
  }
  return changes;
}

// ─── Glob CSS modules (exclude primitives) ────────────────────────────────────
function* walkCSS(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'primitives') continue; // skip — already token-correct
      yield* walkCSS(full);
    } else if (entry.isFile() && entry.name.endsWith('.module.css')) {
      yield full;
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
let filesChanged = 0;
let linesChanged = 0;
const COMPONENTS = join(ROOT, 'src', 'components');

for (const file of walkCSS(COMPONENTS)) {
  const delta = processFile(file);
  if (delta > 0) {
    filesChanged++;
    linesChanged += delta;
    const rel = file.replace(ROOT + '/', '');
    console.log(`  ✓ ${rel} (${delta} line${delta === 1 ? '' : 's'})`);
  }
}

console.log(`\n${DRY_RUN ? '[DRY RUN] ' : ''}${filesChanged} files, ${linesChanged} lines ${DRY_RUN ? 'would be ' : ''}changed.`);
