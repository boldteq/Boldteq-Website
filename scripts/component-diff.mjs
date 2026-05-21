#!/usr/bin/env node
/**
 * component-diff.mjs — Clip-screenshot shared components across all pages
 *
 * Thin wrapper around visual-diff.mjs --component=<key>. Iterates each component
 * and writes per-component reports so S1 (shared infra) can be gated independently
 * of full-page diff.
 *
 * Usage:
 *   pnpm dev &
 *   node scripts/component-diff.mjs --components=nav,footer,beta-cta,newsletter --all
 *   node scripts/component-diff.mjs --components=nav --pages=/,/pricing --gate=3
 */

import { spawn } from 'child_process';
import { join } from 'path';

const ROOT = '/Users/yashbaldha/Desktop/Boldteq App/Marketing Site/Boldteq - Website';

const args = process.argv.slice(2);
function flag(name) { return args.find(a => a === `--${name}` || a.startsWith(`--${name}=`)); }
function flagValue(name, fallback) {
  const a = flag(name);
  if (!a) return fallback;
  const eq = a.indexOf('=');
  return eq === -1 ? true : a.slice(eq + 1);
}

const componentsArg = flagValue('components', 'nav,footer,beta-cta,newsletter');
const components = String(componentsArg).split(',');

// Pass through every other arg
const passthrough = args.filter(a => !a.startsWith('--components='));

function run(comp) {
  return new Promise((resolve, reject) => {
    const argv = ['scripts/visual-diff.mjs', `--component=${comp}`, ...passthrough];
    console.log(`\n--- component=${comp} ---`);
    const proc = spawn('node', argv, { cwd: ROOT, stdio: 'inherit' });
    proc.on('close', code => code === 0 ? resolve(0) : resolve(code));
  });
}

(async () => {
  let anyFail = 0;
  for (const c of components) {
    const code = await run(c);
    if (code !== 0) anyFail = code;
  }
  process.exit(anyFail);
})();
