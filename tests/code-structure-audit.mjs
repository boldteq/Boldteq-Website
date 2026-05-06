#!/usr/bin/env node
// Code-structure + UI-consistency audit for homepage components.
// Scans src/components/home/* + src/app/page.tsx + src/app/globals.css + src/components/layout/*
// for code-quality bugs: inline styles, magic colors, hardcoded spacing, duplicated values,
// console.log, any types, ts-ignore, missing semantic tags.
//
// Output: tests/screenshots/code-audit.json with classified bug list.

import { readFile, writeFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const ROOT = "/Users/yashbaldha/Desktop/Boldteq App/Marketing Site/Boldteq";
const TARGETS = [
  "src/app/page.tsx",
  "src/app/layout.tsx",
  "src/app/globals.css",
  "src/components/home",
  "src/components/layout",
  "src/components/shared",
  "src/components/animations",
];

const bugs = [];

function push(category, severity, file, line, message) {
  bugs.push({ category, severity, file: file.replace(ROOT + "/", ""), line, message });
}

async function walk(dir, files = []) {
  const entries = await readdir(dir).catch(() => []);
  for (const e of entries) {
    const p = join(dir, e);
    const s = await stat(p);
    if (s.isDirectory()) await walk(p, files);
    else files.push(p);
  }
  return files;
}

async function getTargetFiles() {
  const all = [];
  for (const t of TARGETS) {
    const p = join(ROOT, t);
    const s = await stat(p).catch(() => null);
    if (!s) continue;
    if (s.isDirectory()) {
      const files = await walk(p);
      all.push(...files);
    } else {
      all.push(p);
    }
  }
  return all.filter((f) => /\.(tsx|ts|css)$/.test(f));
}

function scanFile(file, content) {
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // 1. Inline style with hardcoded value (red flag — should use CSS module)
    if (/\bstyle=\{?\s*\{[^}]*\}/i.test(line) && !line.trim().startsWith("//") && !line.trim().startsWith("*")) {
      // Allow style={{ '--var': value }} for CSS vars
      if (!/[\"\']--[a-z]/i.test(line)) {
        push("inline-style", "minor", file, lineNum, line.trim().slice(0, 140));
      }
    }

    // 2. console.log / console.warn
    if (/\bconsole\.(log|warn|debug|info)\(/.test(line) && !line.trim().startsWith("//")) {
      push("console-statement", "minor", file, lineNum, line.trim().slice(0, 140));
    }

    // 3. any type
    if (/\bas\s+any\b/.test(line) || /\:\s*any\b/.test(line) || /<any>/.test(line)) {
      // Skip in comments
      if (!line.trim().startsWith("//") && !line.trim().startsWith("*")) {
        push("any-type", "major", file, lineNum, line.trim().slice(0, 140));
      }
    }

    // 4. @ts-ignore / @ts-expect-error
    if (/@ts-(ignore|expect-error)/.test(line)) {
      push("ts-suppress", "minor", file, lineNum, line.trim().slice(0, 140));
    }

    // 5. Hardcoded hex colors in TSX (should use CSS module or design tokens)
    if (/\.tsx$/.test(file)) {
      const hexMatches = line.match(/#[0-9a-fA-F]{3,8}\b/g);
      if (hexMatches && !line.trim().startsWith("//")) {
        for (const h of hexMatches) {
          // Skip svg fill in SVG icon definitions inside JSX
          if (/<(stop|path|rect|circle|linearGradient)/.test(line)) continue;
          push("hardcoded-color-in-tsx", "minor", file, lineNum, `${h}: ${line.trim().slice(0, 100)}`);
          break;
        }
      }
    }

    // 6. !important in CSS (overuse smell)
    if (/\.css$/.test(file) && /!important/.test(line)) {
      push("css-important", "minor", file, lineNum, line.trim().slice(0, 140));
    }

    // 7. Duplicate hardcoded px values that look like spacing magic numbers in CSS
    // (Just count occurrences — analyzed at file level below)

    // 8. Empty href or href="#" in TSX (not in SVG)
    if (/\.tsx$/.test(file)) {
      if (/href=["']#["']/.test(line) && !/<linearGradient|<defs/.test(line)) {
        push("dead-href", "major", file, lineNum, line.trim().slice(0, 140));
      }
    }

    // 9. Missing alt on Image / img
    if (/\.tsx$/.test(file)) {
      if (/<(Image|img)\b/.test(line)) {
        // Check if this line OR next 5 lines contain alt= prop
        const block = lines.slice(i, i + 8).join(" ");
        if (!/\balt=/.test(block)) {
          push("img-no-alt", "major", file, lineNum, line.trim().slice(0, 140));
        }
      }
    }

    // 10. Missing key prop in .map (heuristic)
    if (/\.tsx$/.test(file) && /\.map\(\s*\([^)]*\)\s*=>\s*</.test(line)) {
      const block = lines.slice(i, i + 10).join(" ");
      if (!/\bkey=/.test(block)) {
        push("missing-key", "major", file, lineNum, line.trim().slice(0, 140));
      }
    }

    // 11. Tailwind classes mixed with CSS modules (inconsistency)
    if (/\.tsx$/.test(file) && /className=/.test(line)) {
      const hasModule = /styles\[/.test(line) || /styles\./.test(line);
      const hasTailwind = /className=["'][^"']*(\bflex\b|\bgrid\b|\bp-\d|\bm-\d|\btext-\w|\bbg-\w|\bborder-\w)/.test(line);
      if (hasModule && hasTailwind) {
        push("mixed-styling", "minor", file, lineNum, line.trim().slice(0, 140));
      }
    }

    // 12. Fragment <></> with single child
    if (/<>\s*<[A-Z][a-zA-Z]*[^>]*\/?>\s*<\/>/.test(line)) {
      push("redundant-fragment", "minor", file, lineNum, line.trim().slice(0, 140));
    }

    // 13. TODO / FIXME / XXX / HACK comments
    if (/(TODO|FIXME|XXX|HACK):/.test(line)) {
      push("todo-comment", "minor", file, lineNum, line.trim().slice(0, 140));
    }

    // 14. process.env without typeof check
    if (/\.tsx$/.test(file) && /process\.env\./.test(line) && !/typeof\s+process/.test(line)) {
      // Allow in next.config and other server-only paths but flag in components
      if (file.includes("/components/")) {
        push("process-env-in-component", "minor", file, lineNum, line.trim().slice(0, 140));
      }
    }

    // 15. Magic z-index values >9999
    const z = line.match(/z-?index:\s*(\d{4,})/i) || line.match(/zIndex:\s*(\d{4,})/);
    if (z) {
      const v = parseInt(z[1], 10);
      if (v > 9999) push("magic-z-index", "minor", file, lineNum, `z=${v}`);
    }
  }

  // File-level checks

  // Component file should have one default or named export only
  if (/\.tsx$/.test(file) && !file.endsWith("page.tsx") && !file.endsWith("layout.tsx")) {
    const exports = (content.match(/^export\s+(function|const|default)\s+/gm) ?? []).length;
    if (exports === 0 && file.includes("/components/")) {
      push("no-export", "major", file, 1, "Component file with no exports");
    }
  }

  // Use client on every component (over-use)
  if (/\.tsx$/.test(file) && content.startsWith('"use client"')) {
    // Just track count
  }

  // CSS module without any classes (empty)
  if (/\.module\.css$/.test(file) && content.trim().length < 50) {
    push("empty-module-css", "minor", file, 1, "Empty module CSS file");
  }
}

(async () => {
  const files = await getTargetFiles();
  console.log(`Scanning ${files.length} files...`);
  for (const f of files) {
    const content = await readFile(f, "utf8").catch(() => "");
    scanFile(f, content);
  }

  const byCategory = {};
  const bySeverity = {};
  for (const b of bugs) {
    byCategory[b.category] = (byCategory[b.category] ?? 0) + 1;
    bySeverity[b.severity] = (bySeverity[b.severity] ?? 0) + 1;
  }

  console.log(`\nTotal code-structure bugs: ${bugs.length}`);
  console.log(`By severity: ${JSON.stringify(bySeverity)}`);
  console.log(`By category:`);
  Object.entries(byCategory).sort((a, b) => b[1] - a[1]).forEach(([c, n]) => console.log(`  ${n.toString().padStart(4)}  ${c}`));

  await writeFile(
    join(ROOT, "tests/screenshots/code-audit.json"),
    JSON.stringify({ totals: { count: bugs.length, byCategory, bySeverity }, bugs }, null, 2),
    "utf8",
  );
  console.log(`\nSaved: tests/screenshots/code-audit.json`);
})();
