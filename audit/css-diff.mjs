#!/usr/bin/env node
/**
 * css-diff.mjs — Programmatic CSS audit tool
 * Extracts CSS values from Webflow CSS and compares against local module.css files
 * Outputs bugs as JSONL to audit/sprints/sp-auto.jsonl
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, basename, dirname } from 'path';

const ROOT = '/Users/yashbaldha/Desktop/Boldteq App/Marketing Site/Boldteq';
const WEBFLOW_CSS = join(ROOT, 'boldteq-v1-0.webflow/css/boldteq-v1-0.webflow.css');
const SRC = join(ROOT, 'src');
const OUT = join(ROOT, 'audit/sprints/sp-auto.jsonl');

let bugId = 1;
const bugs = [];

// ── 1. Parse webflow.css into a map of class→properties ──────────────────────
function parseWebflowCSS(css) {
  const map = {};
  // Match .classname { ... } blocks (handles nested @media too)
  const classRegex = /(?:^|\n)(\.[\w-]+(?:\.[\w-]+)*)\s*\{([^}]+)\}/g;
  let m;
  while ((m = classRegex.exec(css)) !== null) {
    const selector = m[1].trim();
    const body = m[2];
    const props = {};
    const propRegex = /([\w-]+)\s*:\s*([^;]+);/g;
    let pm;
    while ((pm = propRegex.exec(body)) !== null) {
      props[pm[1].trim()] = pm[2].trim();
    }
    if (!map[selector]) map[selector] = {};
    Object.assign(map[selector], props);
  }
  return map;
}

// ── 2. Parse a module.css file into a map of .class→properties ───────────────
function parseModuleCSS(css) {
  const map = {};
  const blockRegex = /\.([\w-]+)\s*\{([^}]+)\}/g;
  let m;
  while ((m = blockRegex.exec(css)) !== null) {
    const cls = m[1].trim();
    const body = m[2];
    const props = {};
    const propRegex = /([\w-]+)\s*:\s*([^;]+);/g;
    let pm;
    while ((pm = propRegex.exec(body)) !== null) {
      props[pm[1].trim()] = pm[2].trim();
    }
    if (!map[cls]) map[cls] = {};
    Object.assign(map[cls], props);
  }
  return map;
}

// ── 3. Extract CSS classes used in an HTML file ───────────────────────────────
function extractClasses(html) {
  const classes = new Set();
  const classAttr = /class="([^"]+)"/g;
  let m;
  while ((m = classAttr.exec(html)) !== null) {
    m[1].trim().split(/\s+/).forEach(c => {
      if (c && !c.startsWith('w--') && !c.startsWith('w-')) classes.add(c);
    });
  }
  return classes;
}

// ── 4. Get line number in file ────────────────────────────────────────────────
function getLine(content, searchStr) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(searchStr)) return i + 1;
  }
  return 0;
}

// ── 5. Compare CSS values ─────────────────────────────────────────────────────
const CRITICAL_PROPS = [
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'font-size', 'line-height', 'font-weight', 'letter-spacing',
  'border-radius', 'border-top-left-radius', 'border-top-right-radius',
  'border-bottom-left-radius', 'border-bottom-right-radius',
  'max-width', 'min-width', 'width', 'height', 'min-height', 'max-height',
  'gap', 'grid-column-gap', 'grid-row-gap',
  'background-color', 'color',
  'box-shadow', 'text-decoration',
  'grid-template-columns', 'display', 'flex-direction', 'align-items', 'justify-content',
];

function normVal(v) {
  return v.toLowerCase().replace(/\s+/g, ' ').trim();
}

function compareProps(wfClass, wfProps, localCls, localProps, file, sprint, page, section) {
  for (const prop of CRITICAL_PROPS) {
    const wfVal = wfProps[prop];
    if (!wfVal) continue;

    const localVal = localProps[prop];
    if (!localVal) {
      // Property exists in Webflow but missing in local
      bugs.push({
        id: `SP${sprint}-${String(bugId++).padStart(4, '0')}`,
        sprint,
        page,
        section,
        component: file.replace(ROOT + '/', ''),
        line: 0,
        category: 'css',
        severity: 'P2',
        title: `${localCls}: missing ${prop} (Webflow: ${wfVal})`,
        webflow_ref: `webflow.css .${wfClass} { ${prop}: ${wfVal} }`,
        local_ref: `${basename(file)} .${localCls} — ${prop} not defined`,
        fix: `Add ${prop}: ${wfVal} to .${localCls}`,
        minutes: 2,
      });
    } else if (normVal(wfVal) !== normVal(localVal)) {
      const sev = prop.includes('font-size') || prop === 'max-width' || prop === 'padding' ? 'P1' :
                  prop.includes('color') || prop.includes('border-radius') ? 'P2' : 'P2';
      bugs.push({
        id: `SP${sprint}-${String(bugId++).padStart(4, '0')}`,
        sprint,
        page,
        section,
        component: file.replace(ROOT + '/', ''),
        line: 0,
        category: 'css',
        severity: sev,
        title: `${localCls}: ${prop} mismatch — local: ${localVal}, Webflow: ${wfVal}`,
        webflow_ref: `webflow.css .${wfClass} { ${prop}: ${wfVal} }`,
        local_ref: `${basename(file)} .${localCls} { ${prop}: ${localVal} }`,
        fix: `Change ${prop} from "${localVal}" to "${wfVal}"`,
        minutes: 2,
      });
    }
  }
}

// ── 6. Audit a page ───────────────────────────────────────────────────────────
function auditPage(htmlFile, moduleFiles, sprint, page) {
  let html;
  try { html = readFileSync(htmlFile, 'utf8'); } catch { return; }

  const wfCSS = readFileSync(WEBFLOW_CSS, 'utf8');
  const wfMap = parseWebflowCSS(wfCSS);
  const htmlClasses = extractClasses(html);

  for (const moduleFile of moduleFiles) {
    let localCSS;
    try { localCSS = readFileSync(moduleFile, 'utf8'); } catch { continue; }
    const localMap = parseModuleCSS(localCSS);

    // For each local class, find the matching Webflow class and compare
    for (const [localCls, localProps] of Object.entries(localMap)) {
      // Try direct match first
      const wfKey = `.${localCls}`;
      if (wfMap[wfKey]) {
        const section = localCls.split(/[A-Z]/)[0].toLowerCase() || localCls;
        compareProps(localCls, wfMap[wfKey], localCls, localProps, moduleFile, sprint, page, section);
        continue;
      }

      // Try kebab-case of camelCase class
      const kebab = localCls.replace(/([A-Z])/g, m => `-${m.toLowerCase()}`);
      const wfKebab = `.${kebab}`;
      if (wfMap[wfKebab]) {
        const section = kebab.split('-')[0];
        compareProps(kebab, wfMap[wfKebab], localCls, localProps, moduleFile, sprint, page, section);
      }
    }

    // Also check: Webflow HTML classes that should exist in local but don't
    for (const htmlCls of htmlClasses) {
      const wfKey = `.${htmlCls}`;
      if (!wfMap[wfKey]) continue;
      // Check if this class (or close equivalent) exists in any local module
      const localExists = Object.keys(localMap).some(lc =>
        lc === htmlCls || lc.toLowerCase() === htmlCls.toLowerCase() ||
        lc.replace(/([A-Z])/g, m => `-${m.toLowerCase()}`).replace(/^-/, '') === htmlCls
      );
      if (!localExists && wfMap[wfKey] && Object.keys(wfMap[wfKey]).length > 0) {
        bugs.push({
          id: `SP${sprint}-${String(bugId++).padStart(4, '0')}`,
          sprint,
          page,
          section: htmlCls.split('-')[0],
          component: moduleFile.replace(ROOT + '/', ''),
          line: 0,
          category: 'structure',
          severity: 'P2',
          title: `Webflow class .${htmlCls} used in HTML but not found in local module.css`,
          webflow_ref: `index.html class="${htmlCls}"`,
          local_ref: `${basename(moduleFile)} — no matching class found`,
          fix: `Add .${htmlCls} CSS block or equivalent camelCase mapping`,
          minutes: 5,
        });
      }
    }
  }
}

// ── 7. Audit responsive breakpoints ──────────────────────────────────────────
function auditResponsive(moduleFile, sprint, page) {
  let css;
  try { css = readFileSync(moduleFile, 'utf8'); } catch { return; }

  const webflowBreakpoints = [479, 767, 991, 1280, 1440];
  const localBreakpoints = [];
  const bpRegex = /@media[^{]*\((?:max-width|min-width):\s*(\d+)px\)/g;
  let m;
  while ((m = bpRegex.exec(css)) !== null) {
    localBreakpoints.push(parseInt(m[1]));
  }

  // Check Webflow CSS for classes used at each breakpoint
  const wfCSS = readFileSync(WEBFLOW_CSS, 'utf8');
  const wfBPs = [];
  while ((m = bpRegex.exec(wfCSS)) !== null) {
    const bp = parseInt(m[1]);
    if (webflowBreakpoints.includes(bp)) wfBPs.push(bp);
  }

  for (const bp of webflowBreakpoints) {
    if (!localBreakpoints.includes(bp)) {
      bugs.push({
        id: `SP${sprint}-${String(bugId++).padStart(4, '0')}`,
        sprint,
        page,
        section: 'responsive',
        component: moduleFile.replace(ROOT + '/', ''),
        line: 0,
        category: 'responsive',
        severity: bp <= 767 ? 'P1' : 'P2',
        title: `${basename(moduleFile)}: missing @media (${bp <= 991 ? 'max' : 'min'}-width: ${bp}px) breakpoint`,
        webflow_ref: `webflow.css uses @media at ${bp}px for this page's components`,
        local_ref: `${basename(moduleFile)} — breakpoint ${bp}px not present`,
        fix: `Add @media (${bp <= 991 ? 'max-width' : 'min-width'}: ${bp}px) block with appropriate responsive overrides`,
        minutes: 15,
      });
    }
  }
}

// ── 8. Run all audits ─────────────────────────────────────────────────────────
function getModuleFiles(dir) {
  try {
    return readdirSync(dir)
      .filter(f => f.endsWith('.module.css'))
      .map(f => join(dir, f));
  } catch { return []; }
}

const pages = [
  {
    html: join(ROOT, 'boldteq-v1-0.webflow/index.html'),
    dir: join(SRC, 'components/home'),
    sprint: 1, page: '/',
  },
  {
    html: join(ROOT, 'boldteq-v1-0.webflow/pricing.html'),
    dir: join(SRC, 'components/pricing'),
    sprint: 2, page: '/pricing',
  },
  {
    html: join(ROOT, 'boldteq-v1-0.webflow/our-works.html'),
    dir: join(SRC, 'components/our-works'),
    sprint: 3, page: '/our-works',
  },
  {
    html: join(ROOT, 'boldteq-v1-0.webflow/how-it-works.html'),
    dir: join(SRC, 'components/how-it-works'),
    sprint: 4, page: '/how-it-works',
  },
  {
    html: join(ROOT, 'boldteq-v1-0.webflow/contact.html'),
    dir: join(SRC, 'components/contact'),
    sprint: 5, page: '/contact',
  },
  {
    html: join(ROOT, 'boldteq-v1-0.webflow/beta.html'),
    dir: join(SRC, 'components/beta'),
    sprint: 6, page: '/beta',
  },
  {
    html: join(ROOT, 'boldteq-v1-0.webflow/scope.html'),
    dir: join(SRC, 'components/scope'),
    sprint: 6, page: '/scope',
  },
  {
    html: join(ROOT, 'boldteq-v1-0.webflow/careers.html'),
    dir: join(SRC, 'components/careers'),
    sprint: 7, page: '/careers',
  },
  {
    html: join(ROOT, 'boldteq-v1-0.webflow/our-mission.html'),
    dir: join(SRC, 'components/our-mission'),
    sprint: 7, page: '/our-mission',
  },
  {
    html: join(ROOT, 'boldteq-v1-0.webflow/blog.html'),
    dir: join(SRC, 'components/blog'),
    sprint: 8, page: '/blog',
  },
  {
    html: join(ROOT, 'boldteq-v1-0.webflow/testimonials.html'),
    dir: join(SRC, 'components/testimonials'),
    sprint: 9, page: '/testimonials',
  },
  {
    html: join(ROOT, 'boldteq-v1-0.webflow/our-works-pages/dabble.html'),
    dir: join(SRC, 'components/our-works-detail'),
    sprint: 10, page: '/our-works/[slug]',
  },
  {
    html: join(ROOT, 'boldteq-v1-0.webflow/services/website-development.html'),
    dir: join(SRC, 'components/services'),
    sprint: 9, page: '/services/website-development',
  },
  {
    html: join(ROOT, 'boldteq-v1-0.webflow/privacy-policy.html'),
    dir: join(SRC, 'components/legal'),
    sprint: 9, page: '/privacy-policy',
  },
  {
    html: join(ROOT, 'boldteq-v1-0.webflow/newsletter.html'),
    dir: join(SRC, 'components/newsletter'),
    sprint: 5, page: '/newsletter',
  },
  {
    html: join(ROOT, 'boldteq-v1-0.webflow/book-a-demo.html'),
    dir: join(SRC, 'components/book-a-demo'),
    sprint: 5, page: '/book-a-demo',
  },
  // Shared
  {
    html: join(ROOT, 'boldteq-v1-0.webflow/index.html'),
    dir: join(SRC, 'components/layout'),
    sprint: 11, page: '*',
  },
  {
    html: join(ROOT, 'boldteq-v1-0.webflow/index.html'),
    dir: join(SRC, 'components/shared'),
    sprint: 11, page: '*',
  },
];

console.log('Starting CSS diff audit...');

for (const { html, dir, sprint, page } of pages) {
  const moduleFiles = getModuleFiles(dir);
  if (moduleFiles.length === 0) { console.log(`No module.css in ${dir}`); continue; }
  console.log(`Auditing ${page} (sprint ${sprint}) — ${moduleFiles.length} CSS files`);
  auditPage(html, moduleFiles, sprint, page);

  // Responsive audit for all module files
  for (const f of moduleFiles) {
    auditResponsive(f, sprint, page);
  }
}

// SP12: globals.css
const globalsCss = join(SRC, 'app/globals.css');
auditResponsive(globalsCss, 12, '*');

// ── 9. Write output ───────────────────────────────────────────────────────────
const jsonl = bugs.map(b => JSON.stringify(b)).join('\n');
writeFileSync(OUT, jsonl);

// Summary
const bySprint = {};
bugs.forEach(b => { bySprint[b.sprint] = (bySprint[b.sprint] || 0) + 1; });
const bySev = { P0: 0, P1: 0, P2: 0, P3: 0 };
bugs.forEach(b => { bySev[b.severity] = (bySev[b.severity] || 0) + 1; });

console.log('\n=== AUDIT COMPLETE ===');
console.log(`Total bugs: ${bugs.length}`);
console.log('By sprint:', JSON.stringify(bySprint, null, 2));
console.log('By severity:', JSON.stringify(bySev, null, 2));
console.log(`Output: ${OUT}`);
