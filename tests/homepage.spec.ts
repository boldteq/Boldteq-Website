import { test, expect, type Page } from "@playwright/test";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const LIVE_URL = "https://boldteq.com";
const LOCAL_URL = process.env.LOCAL_URL ?? "http://localhost:3000";

const VIEWPORTS = [
  { name: "1440", width: 1440, height: 900 },
  { name: "1280", width: 1280, height: 800 },
  { name: "768", width: 768, height: 1024 },
  { name: "375", width: 375, height: 812 },
] as const;

// Webflow root class → human label. Used to find each section on BOTH live and local.
// Local Next.js wraps these classes via CSS modules (hashed), so we also map a
// data-testid we add (later) — for now we query the Webflow class via partial
// `[class*="..."]` matching which works for both raw Webflow classes (live) and
// CSS-module-hashed classes (local) because Next.js preserves the original token
// inside the hash (`<token>__<hash>`).
const SECTIONS: Array<{ id: string; selector: string; label: string }> = [
  { id: "hero", selector: '[class*="section-high-judge"]', label: "Hero" },
  { id: "carousel", selector: '[class*="img-slider-sec"]', label: "Portfolio Carousel" },
  { id: "pain", selector: '[class*="slowing-sec"]', label: "Pain Points" },
  { id: "resolution", selector: '[class*="blue-card-sec"]', label: "Resolution Banner" },
  { id: "built-for", selector: '[class*="built-seccc"]', label: "Built For" },
  { id: "benefits", selector: '[class*="works-sec"], [class*="worksSec"]', label: "Benefits Grid" },
  { id: "how-it-works", selector: '[class*="makeit-sec"], [class*="sectionRegular3BlueSec"]', label: "How It Works" },
  { id: "pricing", selector: '[class*="new-price-sec"], [class*="newPriceSec"]', label: "Pricing" },
  { id: "comparison", selector: '[class*="ways-sec"], [class*="waysSec"]', label: "Comparison" },
  { id: "faq", selector: '[class*="home-faq"], [class*="faq-section"]', label: "FAQ" },
  { id: "footer", selector: "footer, [class*='footer']", label: "Footer" },
];

const PROBE_PROPS = [
  "padding",
  "margin",
  "fontSize",
  "lineHeight",
  "fontWeight",
  "color",
  "backgroundColor",
  "borderRadius",
  "boxShadow",
  "gap",
  "gridTemplateColumns",
  "maxWidth",
  "width",
  "height",
  "display",
] as const;

type Probe = {
  found: boolean;
  bbox: { x: number; y: number; width: number; height: number } | null;
  computed: Record<string, string> | null;
  childCount: number;
};

async function probeSections(page: Page): Promise<Record<string, Probe>> {
  return await page.evaluate(
    ({ sections, props }) => {
      const out: Record<string, Probe> = {};
      for (const s of sections) {
        const el = document.querySelector(s.selector) as HTMLElement | null;
        if (!el) {
          out[s.id] = { found: false, bbox: null, computed: null, childCount: 0 };
          continue;
        }
        const r = el.getBoundingClientRect();
        const cs = window.getComputedStyle(el);
        const computed: Record<string, string> = {};
        for (const p of props) computed[p] = cs.getPropertyValue(p) || (cs as unknown as Record<string, string>)[p] || "";
        out[s.id] = {
          found: true,
          bbox: { x: r.x, y: r.y, width: r.width, height: r.height },
          computed,
          childCount: el.children.length,
        };
      }
      return out;
    },
    { sections: SECTIONS, props: PROBE_PROPS as unknown as string[] },
  );
}

async function dismissOverlays(page: Page) {
  // Best-effort dismiss of cookie banners / chat widgets that interfere with
  // screenshot diffs. Failures are silently swallowed.
  await page
    .evaluate(() => {
      const sel = [
        "#chatwoot_live_chat_widget",
        "#chatwoot-widget-holder",
        ".onetrust-banner-sdk",
        '[id^="hs-eu-cookie-confirmation"]',
      ];
      for (const s of sel) {
        const el = document.querySelector(s) as HTMLElement | null;
        if (el) el.style.display = "none";
      }
    })
    .catch(() => {});
}

async function captureForViewport(
  page: Page,
  url: string,
  scope: "live" | "local",
  vp: typeof VIEWPORTS[number],
) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 }).catch(async () => {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  });
  await page.waitForTimeout(2_000);
  await dismissOverlays(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  const screenshotDir = path.join("tests", "screenshots", "baseline", scope);
  await fs.mkdir(screenshotDir, { recursive: true });
  const screenshotPath = path.join(screenshotDir, `${vp.name}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true, animations: "disabled" });

  const probes = await probeSections(page);
  return { viewport: vp.name, screenshotPath, probes };
}

function diffComputed(live: Probe, local: Probe) {
  const out: Record<string, { live: string; local: string }> = {};
  if (!live.found || !local.found) return out;
  if (!live.computed || !local.computed) return out;
  for (const k of Object.keys(live.computed)) {
    const a = live.computed[k];
    const b = local.computed[k];
    if (a !== b) out[k] = { live: a, local: b };
  }
  return out;
}

test.describe("Homepage pixel-perfect audit", () => {
  test("capture baselines + diff report", async ({ browser }) => {
    test.setTimeout(600_000);

    const liveCtx = await browser.newContext();
    const localCtx = await browser.newContext();
    const livePage = await liveCtx.newPage();
    const localPage = await localCtx.newPage();

    type Snapshot = Awaited<ReturnType<typeof captureForViewport>>;
    const live: Record<string, Snapshot> = {};
    const local: Record<string, Snapshot> = {};

    for (const vp of VIEWPORTS) {
      console.log(`▶ viewport ${vp.name} — live`);
      live[vp.name] = await captureForViewport(livePage, LIVE_URL, "live", vp);
      console.log(`▶ viewport ${vp.name} — local`);
      local[vp.name] = await captureForViewport(localPage, LOCAL_URL, "local", vp);
    }

    type SectionDiff = {
      id: string;
      label: string;
      liveFound: boolean;
      localFound: boolean;
      bboxDelta: { dx: number; dy: number; dw: number; dh: number } | null;
      computedDiff: Record<string, { live: string; local: string }>;
    };
    const report: Array<{ viewport: string; sections: SectionDiff[] }> = [];

    for (const vp of VIEWPORTS) {
      const sections: SectionDiff[] = [];
      for (const s of SECTIONS) {
        const lp = live[vp.name].probes[s.id];
        const cp = local[vp.name].probes[s.id];
        sections.push({
          id: s.id,
          label: s.label,
          liveFound: lp.found,
          localFound: cp.found,
          bboxDelta:
            lp.bbox && cp.bbox
              ? {
                  dx: Math.round((cp.bbox.x - lp.bbox.x) * 10) / 10,
                  dy: Math.round((cp.bbox.y - lp.bbox.y) * 10) / 10,
                  dw: Math.round((cp.bbox.width - lp.bbox.width) * 10) / 10,
                  dh: Math.round((cp.bbox.height - lp.bbox.height) * 10) / 10,
                }
              : null,
          computedDiff: diffComputed(lp, cp),
        });
      }
      report.push({ viewport: vp.name, sections });
    }

    const reportPath = path.join("tests", "screenshots", "diff-report.json");
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");

    // Human-readable summary log
    console.log("\n=== HOMEPAGE DIFF SUMMARY ===");
    for (const vpReport of report) {
      console.log(`\n▶ Viewport ${vpReport.viewport}px`);
      for (const s of vpReport.sections) {
        const status = !s.liveFound
          ? "MISSING-LIVE"
          : !s.localFound
            ? "MISSING-LOCAL"
            : Object.keys(s.computedDiff).length === 0 &&
                s.bboxDelta &&
                Math.abs(s.bboxDelta.dh) < 4
              ? "OK"
              : "DRIFT";
        const propCount = Object.keys(s.computedDiff).length;
        const dh = s.bboxDelta?.dh ?? "n/a";
        console.log(`  [${status}] ${s.label.padEnd(22)} dh=${dh} computedDiff=${propCount}`);
      }
    }

    // Don't fail test on drift — this is an audit run.
    expect(report.length).toBeGreaterThan(0);
  });
});
