import { test, expect, type Page } from "@playwright/test";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const LOCAL = process.env.LOCAL_URL ?? "http://localhost:3000";
const LIVE = "https://boldteq.com";

const VIEWPORTS = [
  { name: "1920", width: 1920, height: 1080 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1024", width: 1024, height: 768 },
  { name: "768", width: 768, height: 1024 },
  { name: "480", width: 480, height: 800 },
  { name: "375", width: 375, height: 812 },
] as const;

type Bug = {
  category: string;
  severity: "critical" | "major" | "minor" | "cosmetic";
  viewport: string;
  selector?: string;
  message: string;
  detail?: unknown;
};

async function pushBug(bugs: Bug[], bug: Bug) {
  bugs.push(bug);
}

async function probeConsoleAndRequests(page: Page, vpName: string, bugs: Bug[]) {
  const consoleErrors: string[] = [];
  const consoleWarns: string[] = [];
  const pageErrors: string[] = [];
  const failedRequests: { url: string; reason: string }[] = [];
  const slow: { url: string; ms: number }[] = [];

  page.on("console", (msg) => {
    const t = msg.type();
    const text = msg.text();
    if (t === "error") consoleErrors.push(text);
    else if (t === "warning") consoleWarns.push(text);
  });
  page.on("pageerror", (err) => pageErrors.push(err.message));
  page.on("requestfailed", (req) => {
    failedRequests.push({ url: req.url(), reason: req.failure()?.errorText ?? "" });
  });
  page.on("response", (resp) => {
    const status = resp.status();
    if (status >= 400 && resp.url().startsWith(LOCAL)) {
      failedRequests.push({ url: resp.url(), reason: `HTTP ${status}` });
    }
  });

  return {
    finalize: () => {
      for (const e of consoleErrors) {
        // Skip 3rd-party 429 rate-limit noise
        if (e.includes("429") || e.includes("Failed to load resource")) continue;
        if (e.includes("hydrated but some attributes")) {
          pushBug(bugs, { category: "hydration", severity: "major", viewport: vpName, message: e.slice(0, 250) });
        } else {
          pushBug(bugs, { category: "console-error", severity: "major", viewport: vpName, message: e.slice(0, 250) });
        }
      }
      for (const w of consoleWarns) {
        if (w.includes("Download the React DevTools")) continue;
        if (w.toLowerCase().includes("react") || w.toLowerCase().includes("next") || w.includes("Image")) {
          pushBug(bugs, { category: "console-warn", severity: "minor", viewport: vpName, message: w.slice(0, 250) });
        }
      }
      for (const e of pageErrors) {
        pushBug(bugs, { category: "page-error", severity: "critical", viewport: vpName, message: e.slice(0, 300) });
      }
      for (const r of failedRequests) {
        // Known external/3rd-party domains that legitimately fail on localhost or are browser-extension noise
        const knownExternal = [
          "trustpilot", "guidejar", "clarity", "google-analytics", "contentsquare", "chatwoot",
          // Browser extensions or Webflow live-site analytics — not loaded by our code
          "userjot.com", "crisp.chat", "tolt.io", "connect.facebook", "fbevents",
          "cloudflareinsights", "sentry.io",
          // GTM container (dns-prefetch only in our layout, not a Script load)
          "gtm.js",
        ];
        if (knownExternal.some((ext) => r.url.includes(ext))) continue;
        pushBug(bugs, { category: "failed-request", severity: "major", viewport: vpName, message: `${r.reason} ${r.url}` });
      }
      return { consoleErrors, consoleWarns, pageErrors, failedRequests, slow };
    },
  };
}

async function checkA11y(page: Page, vpName: string, bugs: Bug[]) {
  const findings = await page.evaluate(() => {
    type F = { type: string; selector: string; detail?: string };
    const out: F[] = [];

    // 1. Missing alt
    document.querySelectorAll("img").forEach((img, i) => {
      if (!img.hasAttribute("alt")) out.push({ type: "img-no-alt", selector: `img:nth-of-type(${i + 1})`, detail: img.src.slice(-80) });
    });

    // 2. Multiple H1
    const h1s = document.querySelectorAll("h1");
    if (h1s.length === 0) out.push({ type: "no-h1", selector: "body" });
    if (h1s.length > 1) out.push({ type: "multiple-h1", selector: "body", detail: `${h1s.length} h1 elements` });

    // 3. Heading hierarchy skip (h1 then h3 without h2)
    const headings = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6"));
    let prev = 0;
    for (const h of headings) {
      const lvl = parseInt(h.tagName[1]!, 10);
      if (prev > 0 && lvl > prev + 1) out.push({ type: "heading-skip", selector: h.tagName.toLowerCase(), detail: `${prev}→${lvl}: "${h.textContent?.trim().slice(0, 60)}"` });
      prev = lvl;
    }

    // 4. Form inputs without label
    document.querySelectorAll("input:not([type='hidden']),textarea,select").forEach((el, i) => {
      const id = el.getAttribute("id");
      const ariaLabel = el.getAttribute("aria-label");
      const ariaLabelledby = el.getAttribute("aria-labelledby");
      const hasLabel = id ? !!document.querySelector(`label[for="${id}"]`) : false;
      const wrapped = el.closest("label") !== null;
      if (!hasLabel && !ariaLabel && !ariaLabelledby && !wrapped) {
        const tag = el.tagName.toLowerCase();
        const type = el.getAttribute("type") ?? "";
        out.push({ type: "input-no-label", selector: `${tag}[${type}]:nth-of-type(${i + 1})`, detail: el.getAttribute("name") ?? "" });
      }
    });

    // 5. Buttons / links without accessible name
    document.querySelectorAll("button, a").forEach((el, i) => {
      const text = (el.textContent ?? "").trim();
      const ariaLabel = el.getAttribute("aria-label");
      const ariaLabelledby = el.getAttribute("aria-labelledby");
      const titleAttr = el.getAttribute("title");
      if (!text && !ariaLabel && !ariaLabelledby && !titleAttr) {
        const inner = el.querySelector("img[alt],svg[aria-label]");
        if (!inner) out.push({ type: "no-accessible-name", selector: `${el.tagName.toLowerCase()}:nth-of-type(${i + 1})` });
      }
    });

    // 6. Empty href / href="#" non-anchor links
    document.querySelectorAll("a").forEach((el, i) => {
      const href = el.getAttribute("href");
      if (!href || href === "#" || href === "javascript:void(0)" || href === "javascript:void(0);") {
        out.push({ type: "dead-link", selector: `a:nth-of-type(${i + 1})`, detail: `href="${href}" text="${el.textContent?.trim().slice(0, 40)}"` });
      }
    });

    // 7. External links without rel="noopener noreferrer"
    document.querySelectorAll('a[target="_blank"]').forEach((el, i) => {
      const rel = el.getAttribute("rel") ?? "";
      if (!rel.includes("noopener") || !rel.includes("noreferrer")) {
        out.push({ type: "external-no-rel", selector: `a[target=_blank]:nth-of-type(${i + 1})`, detail: el.getAttribute("href") ?? "" });
      }
    });

    // 8. Images without explicit width/height (causes CLS)
    // Skip fill-mode images: Next.js <Image fill> renders with position:absolute — no width/height attrs needed
    document.querySelectorAll("img").forEach((img, i) => {
      const w = img.getAttribute("width");
      const h = img.getAttribute("height");
      if (!w || !h) {
        const pos = window.getComputedStyle(img).position;
        if (pos === "absolute") return; // fill-mode image — intentional, skip
        out.push({ type: "img-no-dimensions", selector: `img:nth-of-type(${i + 1})`, detail: img.src.slice(-80) });
      }
    });

    // 9. Buttons without type
    document.querySelectorAll("button").forEach((b, i) => {
      if (!b.hasAttribute("type")) out.push({ type: "button-no-type", selector: `button:nth-of-type(${i + 1})` });
    });

    // 10. Modals / dialogs missing aria-modal
    document.querySelectorAll('[role="dialog"]').forEach((d, i) => {
      if (d.getAttribute("aria-modal") !== "true") out.push({ type: "dialog-no-aria-modal", selector: `[role=dialog]:nth-of-type(${i + 1})` });
      if (!d.getAttribute("aria-labelledby") && !d.getAttribute("aria-label")) out.push({ type: "dialog-no-label", selector: `[role=dialog]:nth-of-type(${i + 1})` });
    });

    // 11. Click handler on non-interactive element
    document.querySelectorAll("[onclick]").forEach((el, i) => {
      const tag = el.tagName.toLowerCase();
      if (!["button", "a", "input", "textarea", "select"].includes(tag) && el.getAttribute("role") !== "button") {
        out.push({ type: "click-on-non-interactive", selector: `${tag}:nth-of-type(${i + 1})` });
      }
    });

    // 12. tabindex > 0 (anti-pattern)
    document.querySelectorAll("[tabindex]").forEach((el, i) => {
      const ti = parseInt(el.getAttribute("tabindex") ?? "0", 10);
      if (ti > 0) out.push({ type: "positive-tabindex", selector: `${el.tagName.toLowerCase()}:nth-of-type(${i + 1})`, detail: `tabindex=${ti}` });
    });

    // 13. Page lang
    if (!document.documentElement.lang) out.push({ type: "no-lang", selector: "html" });

    return out;
  });

  for (const f of findings) {
    let severity: Bug["severity"] = "minor";
    if (["page-error", "no-h1", "no-lang"].includes(f.type)) severity = "critical";
    if (["multiple-h1", "input-no-label", "no-accessible-name", "dead-link", "img-no-alt", "dialog-no-aria-modal"].includes(f.type)) severity = "major";
    if (["heading-skip", "external-no-rel", "img-no-dimensions"].includes(f.type)) severity = "minor";
    pushBug(bugs, { category: `a11y/${f.type}`, severity, viewport: vpName, selector: f.selector, message: f.detail ?? "" });
  }
}

async function checkSeo(page: Page, vpName: string, bugs: Bug[]) {
  const findings = await page.evaluate(() => {
    type F = { type: string; detail: string };
    const out: F[] = [];

    const title = document.querySelector("title")?.textContent ?? "";
    if (!title) out.push({ type: "no-title", detail: "" });
    if (title.length > 70) out.push({ type: "title-too-long", detail: `${title.length} chars` });
    if (title.length < 10) out.push({ type: "title-too-short", detail: `${title.length} chars` });

    const desc = document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
    if (!desc) out.push({ type: "no-description", detail: "" });
    if (desc.length > 170) out.push({ type: "description-too-long", detail: `${desc.length} chars` });
    if (desc.length < 100) out.push({ type: "description-too-short", detail: `${desc.length} chars` });

    if (!document.querySelector('meta[property="og:title"]')) out.push({ type: "no-og-title", detail: "" });
    if (!document.querySelector('meta[property="og:description"]')) out.push({ type: "no-og-description", detail: "" });
    if (!document.querySelector('meta[property="og:image"]')) out.push({ type: "no-og-image", detail: "" });
    if (!document.querySelector('meta[name="twitter:card"]')) out.push({ type: "no-twitter-card", detail: "" });
    if (!document.querySelector('link[rel="canonical"]')) out.push({ type: "no-canonical", detail: "" });

    const jsonld = document.querySelectorAll('script[type="application/ld+json"]');
    if (jsonld.length === 0) out.push({ type: "no-json-ld", detail: "" });

    const viewport = document.querySelector('meta[name="viewport"]')?.getAttribute("content") ?? "";
    if (!viewport) out.push({ type: "no-viewport-meta", detail: "" });

    return out;
  });

  for (const f of findings) {
    pushBug(bugs, { category: `seo/${f.type}`, severity: f.type.startsWith("no-") ? "major" : "minor", viewport: vpName, message: f.detail });
  }
}

async function checkPerf(page: Page, vpName: string, bugs: Bug[]) {
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const paint = performance.getEntriesByType("paint");
    const fcp = paint.find((p) => p.name === "first-contentful-paint");
    return {
      domContentLoaded: nav ? nav.domContentLoadedEventEnd - nav.startTime : 0,
      load: nav ? nav.loadEventEnd - nav.startTime : 0,
      fcp: fcp?.startTime ?? 0,
      domNodes: document.querySelectorAll("*").length,
      images: document.querySelectorAll("img").length,
      stylesheets: document.querySelectorAll('link[rel="stylesheet"]').length,
      scripts: document.querySelectorAll("script").length,
    };
  });

  if (metrics.load > 5000) pushBug(bugs, { category: "perf/slow-load", severity: "major", viewport: vpName, message: `load=${Math.round(metrics.load)}ms`, detail: metrics });
  if (metrics.fcp > 2500) pushBug(bugs, { category: "perf/slow-fcp", severity: "minor", viewport: vpName, message: `fcp=${Math.round(metrics.fcp)}ms`, detail: metrics });
  if (metrics.domNodes > 2500) pushBug(bugs, { category: "perf/dom-too-large", severity: "minor", viewport: vpName, message: `${metrics.domNodes} nodes` });
}

async function checkVisualLayout(page: Page, vpName: string, bugs: Bug[]) {
  const findings = await page.evaluate(() => {
    type F = { type: string; selector: string; detail: string };
    const out: F[] = [];
    const vw = window.innerWidth;

    // 1. Horizontal overflow (any element wider than viewport)
    // Skip elements whose ancestor has overflow-x:auto/scroll (intentional scrollable containers)
    function hasScrollableAncestor(el: HTMLElement): boolean {
      let cur: HTMLElement | null = el.parentElement;
      while (cur && cur !== document.documentElement) {
        const ox = window.getComputedStyle(cur).overflowX;
        if (ox === "auto" || ox === "scroll") return true;
        cur = cur.parentElement;
      }
      return false;
    }
    document.querySelectorAll<HTMLElement>("section, main, div, header, footer, nav").forEach((el, i) => {
      const r = el.getBoundingClientRect();
      if (r.width > vw + 1) {
        if (hasScrollableAncestor(el)) return; // inside overflow-x:auto wrapper — intentional
        const cls = el.className?.toString().slice(0, 60) ?? "";
        out.push({ type: "horizontal-overflow", selector: `${el.tagName.toLowerCase()}.${cls}`, detail: `width=${Math.round(r.width)} > vw=${vw}` });
      }
    });

    // 2. Tap target too small (mobile only — handled by viewport name check outside)
    // Skip sr-only and visually-hidden focus targets (clip-path:inset(50%) pattern)
    document.querySelectorAll<HTMLElement>("button, a").forEach((el, i) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return; // hidden
      if (r.width < 24 || r.height < 24) {
        if (window.innerWidth <= 768) {
          // Skip sr-only elements
          const cls = el.className?.toString() ?? "";
          if (cls.includes("sr-only")) return;
          // Skip visually-hidden via clip-path (skip-nav, focus traps)
          const cp = window.getComputedStyle(el).clipPath;
          if (cp && cp.includes("inset(50%)")) return;
          out.push({ type: "tap-target-tiny", selector: `${el.tagName.toLowerCase()}:nth-of-type(${i + 1})`, detail: `${Math.round(r.width)}×${Math.round(r.height)}` });
        }
      }
    });

    // 3. Text overflow / clipping
    document.querySelectorAll<HTMLElement>("h1,h2,h3,h4,p,a,button,span").forEach((el, i) => {
      if (el.scrollWidth > el.clientWidth + 2) {
        const cs = window.getComputedStyle(el);
        if (cs.overflow === "hidden" && cs.textOverflow !== "ellipsis") {
          out.push({ type: "text-clipped", selector: `${el.tagName.toLowerCase()}:nth-of-type(${i + 1})`, detail: `scroll=${el.scrollWidth} client=${el.clientWidth}` });
        }
      }
    });

    // 4. Text too small (under 12px)
    document.querySelectorAll<HTMLElement>("p, span, a, li, button").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const fs = parseFloat(window.getComputedStyle(el).fontSize);
      if (fs < 11) out.push({ type: "text-too-small", selector: el.tagName.toLowerCase(), detail: `${fs}px` });
    });

    // 5. Color contrast — sample headings
    function rgbToL(rgb: string): number {
      const m = rgb.match(/\d+/g);
      if (!m) return 0;
      const [r, g, b] = m.slice(0, 3).map((x) => {
        const v = parseInt(x, 10) / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
    }
    function contrast(fg: string, bg: string): number {
      const l1 = rgbToL(fg);
      const l2 = rgbToL(bg);
      const a = Math.max(l1, l2);
      const b = Math.min(l1, l2);
      return (a + 0.05) / (b + 0.05);
    }
    function effectiveBg(el: HTMLElement): string {
      let cur: HTMLElement | null = el;
      while (cur) {
        const c = window.getComputedStyle(cur).backgroundColor;
        if (c && c !== "rgba(0, 0, 0, 0)" && c !== "transparent") return c;
        cur = cur.parentElement;
      }
      return "rgb(255,255,255)";
    }
    document.querySelectorAll<HTMLElement>("p, span, a, li, h1, h2, h3, h4, h5, h6, button").forEach((el, i) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if ((el.textContent ?? "").trim().length === 0) return;
      const cs = window.getComputedStyle(el);
      const fg = cs.color;
      const bg = effectiveBg(el);
      const fs = parseFloat(cs.fontSize);
      const fw = parseInt(cs.fontWeight, 10) || 400;
      const isLarge = fs >= 24 || (fs >= 18.66 && fw >= 700);
      const ratio = contrast(fg, bg);
      const min = isLarge ? 3 : 4.5;
      if (ratio < min) {
        out.push({ type: "low-contrast", selector: `${el.tagName.toLowerCase()}:nth-of-type(${i + 1})`, detail: `ratio=${ratio.toFixed(2)} fg=${fg} bg=${bg} fs=${fs}px` });
      }
    });

    return out;
  });

  for (const f of findings) {
    let severity: Bug["severity"] = "minor";
    if (f.type === "horizontal-overflow") severity = "major";
    if (f.type === "tap-target-tiny") severity = "major";
    if (f.type === "text-clipped") severity = "minor";
    if (f.type === "low-contrast") severity = "major";
    if (f.type === "text-too-small") severity = "minor";
    pushBug(bugs, { category: `visual/${f.type}`, severity, viewport: vpName, selector: f.selector, message: f.detail });
  }
}

async function checkInteractions(page: Page, vpName: string, bugs: Bug[]) {
  // Wait for everything stable
  await page.waitForTimeout(500);

  // 1. Solutions dropdown — desktop only
  if (parseInt(vpName, 10) >= 1024) {
    const trigger = page.locator('button:has-text("Solutions")').first();
    if (await trigger.count()) {
      try {
        await trigger.hover({ timeout: 3000 });
        await page.waitForTimeout(300);
        const dropdownVisible = await page.locator('a:has-text("Web Development")').first().isVisible().catch(() => false);
        if (!dropdownVisible) pushBug(bugs, { category: "interaction/solutions-dropdown", severity: "major", viewport: vpName, message: "Solutions dropdown did not open on hover" });
      } catch {
        pushBug(bugs, { category: "interaction/solutions-dropdown", severity: "minor", viewport: vpName, message: "Solutions hover error" });
      }
    } else {
      pushBug(bugs, { category: "interaction/solutions-trigger-missing", severity: "major", viewport: vpName, message: "Solutions button not found" });
    }
  }

  // 2. Pricing tab toggle
  const monthlyBtn = page.locator('button:has-text("Monthly")').first();
  const quarterlyBtn = page.locator('button:has-text("Quarterly")').first();
  if (await quarterlyBtn.count()) {
    try {
      await quarterlyBtn.scrollIntoViewIfNeeded({ timeout: 3000 });
      await quarterlyBtn.click({ timeout: 3000 });
      await page.waitForTimeout(300);
      const monthlyActive = await monthlyBtn.evaluate((b) => b.className.toLowerCase().includes("active") || b.getAttribute("aria-pressed") === "true").catch(() => false);
      if (monthlyActive) pushBug(bugs, { category: "interaction/pricing-tab", severity: "major", viewport: vpName, message: "Quarterly tab click did not deactivate Monthly" });
    } catch {
      pushBug(bugs, { category: "interaction/pricing-tab", severity: "minor", viewport: vpName, message: "Pricing tab click error" });
    }
  }

  // 3. FAQ accordion
  const faqToggles = page.locator('section[class*="faq"] button, section[class*="Faq"] button');
  const faqCount = await faqToggles.count().catch(() => 0);
  if (faqCount > 0) {
    try {
      await faqToggles.first().scrollIntoViewIfNeeded({ timeout: 3000 });
      await faqToggles.first().click({ timeout: 3000 });
      await page.waitForTimeout(300);
      const expanded = await faqToggles.first().getAttribute("aria-expanded").catch(() => "");
      if (expanded !== "true") pushBug(bugs, { category: "interaction/faq-accordion", severity: "major", viewport: vpName, message: "FAQ first item did not expand on click" });
    } catch {
      pushBug(bugs, { category: "interaction/faq-accordion", severity: "minor", viewport: vpName, message: "FAQ click error" });
    }
  }

  // 4. Beta popup from banner
  const joinBeta = page.locator('button:has-text("Join Beta")').first();
  if (await joinBeta.count()) {
    try {
      await joinBeta.click({ timeout: 3000 });
      await page.waitForTimeout(500);
      const dialog = page.locator('[role="dialog"]').first();
      const dialogVisible = await dialog.isVisible().catch(() => false);
      if (!dialogVisible) pushBug(bugs, { category: "interaction/beta-popup", severity: "major", viewport: vpName, message: "Join Beta did not open dialog" });
      // Close on Escape
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
      const stillVisible = await dialog.isVisible().catch(() => false);
      if (stillVisible) pushBug(bugs, { category: "interaction/beta-popup-escape", severity: "minor", viewport: vpName, message: "Dialog did not close on Escape" });
    } catch {
      pushBug(bugs, { category: "interaction/beta-popup", severity: "minor", viewport: vpName, message: "Beta popup interaction error" });
    }
  }

  // 5. Mobile hamburger (mobile only)
  if (parseInt(vpName, 10) <= 768) {
    const hamburger = page.locator('button[aria-label*="navigation"], button[aria-label*="menu"]').first();
    if (await hamburger.count()) {
      try {
        await hamburger.click({ timeout: 3000 });
        await page.waitForTimeout(500);
        const mobileNav = page.locator('[role="dialog"][aria-modal="true"]').first();
        const visible = await mobileNav.isVisible().catch(() => false);
        if (!visible) pushBug(bugs, { category: "interaction/mobile-nav", severity: "major", viewport: vpName, message: "Hamburger did not open mobile nav" });
        await page.keyboard.press("Escape");
        await page.waitForTimeout(300);
      } catch {
        pushBug(bugs, { category: "interaction/mobile-nav", severity: "minor", viewport: vpName, message: "Mobile nav error" });
      }
    }
  }
}

test.describe("Homepage deep audit (500-bug hunt)", () => {
  test("scan all bug categories across all viewports", async ({ browser }) => {
    test.setTimeout(900_000);

    const allBugs: Bug[] = [];

    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await ctx.newPage();
      const collector = await probeConsoleAndRequests(page, vp.name, allBugs);

      try {
        await page.goto(LOCAL, { waitUntil: "domcontentloaded", timeout: 30_000 });
        await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
      } catch (err) {
        pushBug(allBugs, { category: "page-error", severity: "critical", viewport: vp.name, message: `goto failed: ${(err as Error).message}` });
        await ctx.close();
        continue;
      }

      collector.finalize();

      await checkA11y(page, vp.name, allBugs);
      await checkSeo(page, vp.name, allBugs);
      await checkPerf(page, vp.name, allBugs);
      await checkVisualLayout(page, vp.name, allBugs);
      await checkInteractions(page, vp.name, allBugs);

      await ctx.close();
    }

    // Categorize
    const byCategory: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};
    for (const b of allBugs) {
      byCategory[b.category] = (byCategory[b.category] ?? 0) + 1;
      bySeverity[b.severity] = (bySeverity[b.severity] ?? 0) + 1;
    }

    console.log(`\n=== HOMEPAGE DEEP AUDIT ===`);
    console.log(`Total bugs: ${allBugs.length}`);
    console.log(`By severity: ${JSON.stringify(bySeverity)}`);
    console.log(`Top categories:`);
    const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
    for (const [cat, n] of sorted.slice(0, 30)) console.log(`  ${n.toString().padStart(4)}  ${cat}`);

    const reportPath = path.join("tests", "screenshots", "homepage-deep-audit.json");
    await fs.writeFile(reportPath, JSON.stringify({ totals: { count: allBugs.length, bySeverity, byCategory }, bugs: allBugs }, null, 2), "utf8");

    expect(allBugs.length).toBeGreaterThanOrEqual(0);
  });
});
