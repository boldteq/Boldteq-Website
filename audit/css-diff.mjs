#!/usr/bin/env node
/**
 * css-diff.mjs v2 — Programmatic CSS audit
 *
 * Extracts every Webflow CSS class used in each page's HTML, looks up exact
 * property values (including @media contexts), and compares against the
 * matching local CSS module. Emits actionable bugs as JSONL.
 *
 * v2 changes vs v1:
 *  - Fixed ROOT path (was missing " - Website" suffix).
 *  - Brace-balanced parser handles @media context correctly.
 *  - globals.css token map resolves var(--*) chains to final values.
 *  - Value normalizer: hex<->rgba, rem<->px, named-color, lowercase.
 *  - Token-alias and unit-alias false positives flagged + filtered.
 *  - Structure noise filtered (Webflow utility classes w/o real properties).
 *  - Per-sprint IDs prevent collision.
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';

const ROOT = '/Users/yashbaldha/Desktop/Boldteq App/Marketing Site/Boldteq - Website';
const WEBFLOW_CSS = join(ROOT, 'boldteq-v1-0.webflow/css/boldteq-v1-0.webflow.css');
const GLOBALS_CSS = join(ROOT, 'src/app/globals.css');
const SRC = join(ROOT, 'src');
const OUT = join(ROOT, 'audit/sprints/sp-auto.jsonl');
const SUMMARY = join(ROOT, 'audit/sprints/sp-auto-summary.json');

const CRITICAL_PROPS = [
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'font-size', 'line-height', 'font-weight', 'letter-spacing',
  'border-radius', 'border-top-left-radius', 'border-top-right-radius',
  'border-bottom-left-radius', 'border-bottom-right-radius',
  'border', 'border-top', 'border-right', 'border-bottom', 'border-left',
  'border-color', 'border-width', 'border-style',
  'max-width', 'min-width', 'width', 'height', 'min-height', 'max-height',
  'gap', 'grid-column-gap', 'grid-row-gap', 'row-gap', 'column-gap',
  'background-color', 'color',
  'box-shadow', 'text-decoration', 'text-align', 'text-transform',
  'grid-template-columns', 'grid-template-rows',
  'display', 'flex-direction', 'align-items', 'justify-content', 'flex-wrap',
  'position', 'top', 'right', 'bottom', 'left', 'z-index',
  'opacity',
];

const PRE_APPROVED_CATEGORIES = new Set([
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

// ── Token map from globals.css ───────────────────────────────────────────────
function buildTokenMap() {
  const css = readFileSync(GLOBALS_CSS, 'utf8');
  const map = {};
  // Match --token: value;
  const re = /--([a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let m;
  while ((m = re.exec(css)) !== null) {
    const name = m[1].trim();
    const val = m[2].trim();
    // Skip references that loop (--color-background: var(--background))
    map[name] = val;
  }
  // Resolve var() chains up to 5 levels deep
  for (let pass = 0; pass < 5; pass++) {
    for (const [k, v] of Object.entries(map)) {
      const resolved = v.replace(/var\(--([a-z0-9-]+)\)/gi, (_, ref) => map[ref] || `var(--${ref})`);
      map[k] = resolved;
    }
  }
  return map;
}

const TOKEN_MAP = buildTokenMap();

// ── Value normalizer ──────────────────────────────────────────────────────────
const NAMED_COLORS = {
  white: '#ffffff', black: '#000000', transparent: '#00000000',
  red: '#ff0000', blue: '#0000ff', green: '#008000',
};

function hexToRgba(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  if (h.length === 4) h = h.split('').map(c => c + c).join('');
  if (h.length === 6) h += 'ff';
  if (h.length !== 8) return null;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const a = parseInt(h.slice(6, 8), 16) / 255;
  return [r, g, b, a];
}

function rgbaStr(parts) {
  const [r, g, b, a] = parts;
  if (a <= 0.001) return `rgba(0,0,0,0)`;
  if (a >= 0.999) return `rgb(${r},${g},${b})`;
  return `rgba(${r},${g},${b},${Number(a.toFixed(2))})`;
}

function resolveTokens(val) {
  let out = val;
  for (let i = 0; i < 5; i++) {
    const next = out.replace(/var\(--([a-z0-9-]+)\)/gi, (_, ref) => TOKEN_MAP[ref] || `var(--${ref})`);
    if (next === out) break;
    out = next;
  }
  return out;
}

function normalizeValue(raw) {
  if (raw === undefined || raw === null) return '';
  let v = String(raw).trim().toLowerCase();
  v = resolveTokens(v);
  // strip trailing commas / important
  v = v.replace(/\s*!important\s*$/i, '');
  // collapse whitespace
  v = v.replace(/\s+/g, ' ');
  // named colors → hex
  if (NAMED_COLORS[v]) v = NAMED_COLORS[v];
  // hex → canonical rgb/rgba
  v = v.replace(/#[0-9a-f]{3,8}\b/gi, (hex) => {
    const parts = hexToRgba(hex);
    return parts ? rgbaStr(parts) : hex;
  });
  // rgba(255,255,255,1) ↔ rgb()
  v = v.replace(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/g,
    (_, r, g, b, a) => {
      const al = a === undefined ? 1 : parseFloat(a);
      return rgbaStr([Number(r), Number(g), Number(b), al]);
    });
  // rem → px (1rem = 16px) for comparison
  v = v.replace(/([\d.]+)rem\b/g, (_, n) => `${Math.round(parseFloat(n) * 16 * 1000) / 1000}px`);
  // 0px → 0
  v = v.replace(/\b0px\b/g, '0');
  // strip trailing zeros from decimals
  v = v.replace(/([\d.]+)/g, (n) => {
    if (!n.includes('.')) return n;
    return n.replace(/\.?0+$/, '') || '0';
  });
  return v;
}

// Returns { isAlias, normLocal, normWf } for diagnostic flagging
function compareValues(localVal, wfVal) {
  const nl = normalizeValue(localVal);
  const nw = normalizeValue(wfVal);
  if (nl === nw) return { match: true, isAlias: localVal !== wfVal, normLocal: nl, normWf: nw };
  return { match: false, isAlias: false, normLocal: nl, normWf: nw };
}

// ── Brace-balanced CSS parser ────────────────────────────────────────────────
function parseCss(css) {
  // Returns array of { context, selectors[], props{} }
  // context = 'default' | '@media ...'
  const results = [];
  let i = 0;
  const len = css.length;
  const stack = ['default'];

  function skipComments() {
    while (i < len) {
      if (css[i] === '/' && css[i + 1] === '*') {
        i += 2;
        while (i < len && !(css[i] === '*' && css[i + 1] === '/')) i++;
        i += 2;
      } else if (/\s/.test(css[i])) {
        i++;
      } else break;
    }
  }

  function readUntil(stopChars) {
    let buf = '';
    while (i < len && !stopChars.includes(css[i])) {
      buf += css[i++];
    }
    return buf;
  }

  function parseBlock(context) {
    while (i < len) {
      skipComments();
      if (i >= len) break;
      if (css[i] === '}') { i++; return; }

      // At-rule
      if (css[i] === '@') {
        const start = i;
        const atName = readUntil([' ', '{', ';', '\t', '\n']);
        // skip whitespace
        while (i < len && /\s/.test(css[i])) i++;
        const params = readUntil(['{', ';']);
        if (css[i] === ';') { i++; continue; }
        if (css[i] === '{') {
          i++; // consume {
          const newContext = `${atName.trim()} ${params.trim()}`.trim();
          if (atName === '@media') {
            stack.push(newContext);
            parseBlock(newContext);
            stack.pop();
          } else {
            // @keyframes / @supports / @font-face — skip block
            let depth = 1;
            while (i < len && depth > 0) {
              if (css[i] === '{') depth++;
              else if (css[i] === '}') depth--;
              i++;
            }
          }
        }
        continue;
      }

      // selector { ... }
      const selStart = i;
      let selector = '';
      let depth = 0;
      while (i < len && (css[i] !== '{' || depth > 0)) {
        if (css[i] === '(') depth++;
        else if (css[i] === ')') depth--;
        selector += css[i++];
      }
      if (i >= len) break;
      i++; // consume {
      selector = selector.trim();

      // Read declarations
      const props = {};
      let nested = '';
      while (i < len && css[i] !== '}') {
        skipComments();
        if (css[i] === '}') break;
        // Property: value;
        const propStart = i;
        let propBuf = '';
        let inParen = 0;
        while (i < len && css[i] !== ';' && (css[i] !== '}' || inParen > 0)) {
          if (css[i] === '(') inParen++;
          else if (css[i] === ')') inParen--;
          propBuf += css[i++];
        }
        if (css[i] === ';') i++;
        const colonIdx = propBuf.indexOf(':');
        if (colonIdx > 0) {
          const name = propBuf.slice(0, colonIdx).trim().toLowerCase();
          const val = propBuf.slice(colonIdx + 1).trim();
          if (name && val && !name.startsWith('--')) props[name] = val;
        }
      }
      if (css[i] === '}') i++;

      // Split combined selectors (".a, .b" → two records)
      for (const sel of selector.split(',').map(s => s.trim()).filter(Boolean)) {
        results.push({ context, selector: sel, props });
      }
    }
  }

  parseBlock('default');
  return results;
}

// Build a map: { selector → { context → props } }
function indexCss(parsed) {
  const map = {};
  for (const { context, selector, props } of parsed) {
    if (!map[selector]) map[selector] = {};
    if (!map[selector][context]) map[selector][context] = {};
    Object.assign(map[selector][context], props);
  }
  return map;
}

// ── Extract classes used in HTML ─────────────────────────────────────────────
function extractClasses(html) {
  const set = new Set();
  const re = /class="([^"]+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    m[1].trim().split(/\s+/).forEach(c => {
      if (c && !c.startsWith('w--') && !c.startsWith('w-')) set.add(c);
    });
  }
  return set;
}

// ── Normalize @media context to comparable key ───────────────────────────────
function normalizeContext(ctx) {
  if (ctx === 'default') return 'default';
  // Extract max-width / min-width number
  const m = ctx.match(/(max-width|min-width)\s*:\s*(\d+)/);
  if (m) return `@media(${m[1]}:${m[2]})`;
  return ctx.replace(/\s+/g, ' ').trim();
}

// Convert camelCase → kebab-case
function camelToKebab(s) {
  return s.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
}

// ── Audit a page ─────────────────────────────────────────────────────────────
function auditPage({ html: htmlPath, dir, sprint, page, wfIndex, bugs, counters }) {
  let html;
  try { html = readFileSync(htmlPath, 'utf8'); } catch { return; }
  const htmlClasses = extractClasses(html);

  const moduleFiles = (() => {
    try {
      return readdirSync(dir).filter(f => f.endsWith('.module.css')).map(f => join(dir, f));
    } catch { return []; }
  })();
  if (moduleFiles.length === 0) return;

  for (const moduleFile of moduleFiles) {
    let localCss;
    try { localCss = readFileSync(moduleFile, 'utf8'); } catch { continue; }
    const localParsed = parseCss(localCss);
    const localIndex = indexCss(localParsed);

    // For each local class, find matching Webflow class and compare per context
    for (const [localSel, contexts] of Object.entries(localIndex)) {
      if (!localSel.startsWith('.')) continue;
      const localClass = localSel.slice(1);
      const candidates = [
        `.${localClass}`,
        `.${camelToKebab(localClass)}`,
        `.${camelToKebab(localClass).replace(/^-/, '')}`,
      ];
      let wfContexts = null;
      let wfClassUsed = null;
      for (const c of candidates) {
        if (wfIndex[c]) { wfContexts = wfIndex[c]; wfClassUsed = c.slice(1); break; }
      }
      if (!wfContexts) continue;

      for (const [ctxRaw, wfProps] of Object.entries(wfContexts)) {
        const ctx = normalizeContext(ctxRaw);
        const localProps = contexts[ctxRaw] || contexts['default'] || {};
        for (const prop of CRITICAL_PROPS) {
          const wfVal = wfProps[prop];
          if (wfVal === undefined) continue;
          const localVal = localProps[prop];

          if (localVal === undefined) {
            counters.missing++;
            bugs.push(buildBug({
              sprint, page, component: moduleFile, localClass,
              wfClass: wfClassUsed, context: ctx, prop,
              localVal: null, wfVal, kind: 'missing',
            }));
            continue;
          }
          const cmp = compareValues(localVal, wfVal);
          if (cmp.match) {
            if (cmp.isAlias) counters.alias++;
            continue;
          }
          counters.mismatch++;
          bugs.push(buildBug({
            sprint, page, component: moduleFile, localClass,
            wfClass: wfClassUsed, context: ctx, prop,
            localVal, wfVal, kind: 'mismatch', normLocal: cmp.normLocal, normWf: cmp.normWf,
          }));
        }
      }
    }

    // Responsive gap: classes used on HTML page exist in webflow.css with @media context,
    // but local module lacks ANY @media block.
    const localHasMedia = localCss.includes('@media');
    if (!localHasMedia) {
      // Check if any class in this module corresponds to a Webflow class that has media rules
      let hasWfMedia = false;
      for (const localSel of Object.keys(localIndex)) {
        if (!localSel.startsWith('.')) continue;
        const localClass = localSel.slice(1);
        const candidates = [`.${localClass}`, `.${camelToKebab(localClass)}`];
        for (const c of candidates) {
          if (wfIndex[c] && Object.keys(wfIndex[c]).some(k => k !== 'default')) {
            hasWfMedia = true; break;
          }
        }
        if (hasWfMedia) break;
      }
      if (hasWfMedia) {
        counters.responsive_module++;
        bugs.push({
          id: '',
          sprint, page,
          section: 'responsive',
          component: moduleFile.replace(ROOT + '/', ''),
          line: 0,
          category: 'responsive',
          severity: 'P1',
          title: `${basename(moduleFile)}: NO @media breakpoints — Webflow defines 991/767/479 for matched classes`,
          webflow_ref: `webflow.css has @media rules for classes in this module`,
          local_ref: `${basename(moduleFile)} — no @media blocks`,
          fix: `Add @media (max-width: 991px), (max-width: 767px), (max-width: 479px) blocks mirroring Webflow values for matched classes`,
          is_token_alias: false, is_unit_alias: false,
          auto_fixable: false,
          minutes: 30,
        });
      }
    }
  }
}

function buildBug({ sprint, page, component, localClass, wfClass, context, prop, localVal, wfVal, kind, normLocal, normWf }) {
  const sev = (() => {
    if (kind === 'missing') return prop === 'padding' || prop === 'max-width' || prop.includes('font-size') ? 'P1' : 'P2';
    if (prop.includes('font-size') || prop === 'max-width' || prop === 'padding') return 'P1';
    if (prop.includes('color') || prop.includes('border-radius')) return 'P2';
    return 'P2';
  })();
  const autoFixable = PRE_APPROVED_CATEGORIES.has(prop) && context === 'default';
  const ctxLabel = context === 'default' ? '' : ` @ ${context}`;
  return {
    id: '',
    sprint, page,
    section: localClass.split(/[A-Z-]/)[0].toLowerCase() || localClass,
    component: component.replace(ROOT + '/', ''),
    line: 0,
    category: 'css',
    severity: sev,
    title: kind === 'missing'
      ? `${localClass}: missing ${prop}${ctxLabel} (Webflow: ${wfVal})`
      : `${localClass}: ${prop}${ctxLabel} mismatch — local: ${localVal}, Webflow: ${wfVal}`,
    webflow_ref: `webflow.css .${wfClass}${ctxLabel} { ${prop}: ${wfVal} }`,
    local_ref: kind === 'missing'
      ? `${basename(component)} .${localClass}${ctxLabel} — ${prop} not defined`
      : `${basename(component)} .${localClass}${ctxLabel} { ${prop}: ${localVal} }`,
    fix: kind === 'missing'
      ? `Add ${prop}: ${wfVal} to .${localClass}${ctxLabel}`
      : `Change ${prop} from "${localVal}" to "${wfVal}" in .${localClass}${ctxLabel}`,
    context,
    prop,
    localVal: localVal ?? null,
    wfVal,
    normLocal: normLocal ?? null,
    normWf: normWf ?? null,
    is_token_alias: false,
    is_unit_alias: false,
    auto_fixable: autoFixable,
    minutes: 2,
    status: 'open',
  };
}

// ── Pages registry ───────────────────────────────────────────────────────────
const PAGES = [
  { html: 'boldteq-v1-0.webflow/index.html',                 dir: 'src/components/home',             sprint: 1, page: '/' },
  { html: 'boldteq-v1-0.webflow/pricing.html',               dir: 'src/components/pricing',          sprint: 2, page: '/pricing' },
  { html: 'boldteq-v1-0.webflow/beta.html',                  dir: 'src/components/beta',             sprint: 2, page: '/beta' },
  { html: 'boldteq-v1-0.webflow/our-works.html',             dir: 'src/components/our-works',        sprint: 3, page: '/our-works' },
  { html: 'boldteq-v1-0.webflow/how-it-works.html',          dir: 'src/components/how-it-works',     sprint: 4, page: '/how-it-works' },
  { html: 'boldteq-v1-0.webflow/our-mission.html',           dir: 'src/components/our-mission',      sprint: 4, page: '/our-mission' },
  { html: 'boldteq-v1-0.webflow/contact.html',               dir: 'src/components/contact',          sprint: 5, page: '/contact' },
  { html: 'boldteq-v1-0.webflow/book-a-demo.html',           dir: 'src/components/book-a-demo',      sprint: 5, page: '/book-a-demo' },
  { html: 'boldteq-v1-0.webflow/newsletter.html',            dir: 'src/components/newsletter',       sprint: 5, page: '/newsletter' },
  { html: 'boldteq-v1-0.webflow/careers.html',               dir: 'src/components/careers',          sprint: 6, page: '/careers' },
  { html: 'boldteq-v1-0.webflow/scope.html',                 dir: 'src/components/scope',            sprint: 6, page: '/scope' },
  { html: 'boldteq-v1-0.webflow/blog.html',                  dir: 'src/components/blog',             sprint: 7, page: '/blog' },
  { html: 'boldteq-v1-0.webflow/testimonials.html',          dir: 'src/components/testimonials',     sprint: 7, page: '/testimonials' },
  { html: 'boldteq-v1-0.webflow/our-works-pages/dabble.html', dir: 'src/components/our-works-detail', sprint: 8, page: '/our-works/[slug]' },
  { html: 'boldteq-v1-0.webflow/services/website-development.html', dir: 'src/components/services',  sprint: 9, page: '/services/website-development' },
  { html: 'boldteq-v1-0.webflow/privacy-policy.html',        dir: 'src/components/legal',            sprint: 10, page: '/privacy-policy' },
  // Shared
  { html: 'boldteq-v1-0.webflow/index.html',                 dir: 'src/components/layout',           sprint: 11, page: '*' },
  { html: 'boldteq-v1-0.webflow/index.html',                 dir: 'src/components/shared',           sprint: 11, page: '*' },
  { html: 'boldteq-v1-0.webflow/index.html',                 dir: 'src/components/primitives/button', sprint: 11, page: '*' },
  { html: 'boldteq-v1-0.webflow/index.html',                 dir: 'src/components/patterns/section-header', sprint: 11, page: '*' },
];

// ── Run ──────────────────────────────────────────────────────────────────────
console.log('css-diff v2 starting...');
console.log(`Token map: ${Object.keys(TOKEN_MAP).length} tokens loaded`);

const wfCss = readFileSync(WEBFLOW_CSS, 'utf8');
const wfParsed = parseCss(wfCss);
const wfIndex = indexCss(wfParsed);
console.log(`Webflow CSS: ${wfParsed.length} declarations across ${Object.keys(wfIndex).length} selectors`);

const bugs = [];
const counters = { mismatch: 0, missing: 0, alias: 0, responsive_module: 0 };

for (const { html, dir, sprint, page } of PAGES) {
  const htmlAbs = join(ROOT, html);
  const dirAbs = join(ROOT, dir);
  auditPage({ html: htmlAbs, dir: dirAbs, sprint, page, wfIndex, bugs, counters });
}

// Assign IDs per sprint
const sprintCounts = {};
for (const b of bugs) {
  sprintCounts[b.sprint] = (sprintCounts[b.sprint] || 0) + 1;
  b.id = `SP${b.sprint}-${String(sprintCounts[b.sprint]).padStart(4, '0')}`;
}

// Write JSONL
writeFileSync(OUT, bugs.map(b => JSON.stringify(b)).join('\n') + '\n');

// Summary
const bySprint = {};
const bySeverity = { P0: 0, P1: 0, P2: 0, P3: 0 };
const byCategory = {};
const byProp = {};
let autoFixable = 0;
for (const b of bugs) {
  bySprint[b.sprint] = (bySprint[b.sprint] || 0) + 1;
  bySeverity[b.severity] = (bySeverity[b.severity] || 0) + 1;
  byCategory[b.category] = (byCategory[b.category] || 0) + 1;
  if (b.prop) byProp[b.prop] = (byProp[b.prop] || 0) + 1;
  if (b.auto_fixable) autoFixable++;
}

const summary = {
  generated_at: new Date().toISOString(),
  total_bugs: bugs.length,
  auto_fixable: autoFixable,
  manual_review: bugs.length - autoFixable,
  by_sprint: bySprint,
  by_severity: bySeverity,
  by_category: byCategory,
  top_properties: Object.entries(byProp).sort((a, b) => b[1] - a[1]).slice(0, 20),
  counters,
  token_map_size: Object.keys(TOKEN_MAP).length,
};
writeFileSync(SUMMARY, JSON.stringify(summary, null, 2));

console.log('\n=== AUDIT COMPLETE ===');
console.log(`Total bugs: ${bugs.length} (auto-fixable: ${autoFixable})`);
console.log(`Counters:`, counters);
console.log(`By sprint:`, bySprint);
console.log(`By severity:`, bySeverity);
console.log(`Output: ${OUT}`);
console.log(`Summary: ${SUMMARY}`);
