/**
 * codemod-tokens-pass2.mjs — handles border shorthands + alpha hex variants
 * skipped by pass 1 (which only touched standalone property values).
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const DRY_RUN = process.argv.includes('--dry-run');

// Direct string replacements — safe because these are complete value segments
const REPLACEMENTS = [
  // Alpha hex → tokens
  ['#21cfff12', 'var(--color-accent-bg)'],
  ['#21cfff21', 'var(--color-accent-bg-hover)'],
  // Border shorthand hex → tokens
  ['1px solid #05bafe', '1px solid var(--color-brand-cyan)'],
  ['1px solid #21cfff', '1px solid var(--color-brand-cyan)'],
  ['1px solid #082753', '1px solid var(--color-text-primary)'],
  ['1px solid #092245', '1px solid var(--color-brand-navy)'],
  ['1px dashed #082753', '1px dashed var(--color-text-primary)'],
  ['2px solid #082753', '2px solid var(--color-text-primary)'],
  ['2px solid #21cfff', '2px solid var(--color-brand-cyan)'],
  ['3px solid #21cfff', '3px solid var(--color-brand-cyan)'],
  ['1.5px solid #05bafe', '1.5px solid var(--color-brand-cyan)'],
  ['0.5px solid #05bafe', '0.5px solid var(--color-brand-cyan)'],
  ['1px solid #019ae6', '1px solid var(--color-brand-blue)'],
  ['2px solid #019ae6', '2px solid var(--color-brand-blue)'],
  ['0.5px solid #019ae6', '0.5px solid var(--color-brand-blue)'],
];

function processFile(filepath) {
  // Skip primitives — already token-correct
  if (filepath.includes('/primitives/')) return 0;
  const original = readFileSync(filepath, 'utf8');
  let content = original;

  for (const [from, to] of REPLACEMENTS) {
    content = content.split(from).join(to);
  }

  if (content === original) return 0;
  if (!DRY_RUN) writeFileSync(filepath, content, 'utf8');
  const origLines = original.split('\n');
  const newLines = content.split('\n');
  let changes = 0;
  for (let i = 0; i < Math.max(origLines.length, newLines.length); i++) {
    if (origLines[i] !== newLines[i]) changes++;
  }
  return changes;
}

function* walkCSS(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkCSS(full);
    } else if (entry.isFile() && full.endsWith('.module.css')) {
      yield full;
    }
  }
}

let filesChanged = 0, linesChanged = 0;
for (const file of walkCSS(join(ROOT, 'src', 'components'))) {
  const delta = processFile(file);
  if (delta > 0) {
    filesChanged++;
    linesChanged += delta;
    console.log(`  ✓ ${file.replace(ROOT + '/', '')} (${delta} lines)`);
  }
}
console.log(`\n${DRY_RUN ? '[DRY RUN] ' : ''}${filesChanged} files, ${linesChanged} lines ${DRY_RUN ? 'would be ' : ''}changed.`);
