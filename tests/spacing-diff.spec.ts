import { test, expect, type Page } from "@playwright/test";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const LOCAL = process.env.LOCAL_URL ?? "http://localhost:3000";
const LIVE = "https://boldteq.com";

const VIEWPORTS = [
  { name: "1440", width: 1440, height: 900 },
  { name: "768", width: 768, height: 1024 },
  { name: "375", width: 375, height: 812 },
] as const;

// Selectors that map cleanly between live (raw kebab) and local (CSS-module hashed but preserves token).
// Each entry probes one logical element type.
type ProbeTarget = {
  id: string;
  selector: string;
  // Properties to compare. Numerical diffs over `tolerance` flagged.
  props: readonly string[];
  tolerance: number;
};

const PROBES: ProbeTarget[] = [
  // SECTION ROOTS
  { id: "hero-section", selector: '[class*="section-high-judge"]', props: ["padding", "margin", "background-color"], tolerance: 2 },
  { id: "carousel-section", selector: '[class*="img-slider-sec"]', props: ["padding", "margin"], tolerance: 2 },
  { id: "pain-points-section", selector: '[class*="slowing-sec"]', props: ["padding", "margin"], tolerance: 2 },
  { id: "resolution-section", selector: '[class*="blue-card-sec"]', props: ["padding", "margin"], tolerance: 2 },
  { id: "built-for-section", selector: '[class*="built-seccc"]', props: ["padding", "margin"], tolerance: 2 },
  { id: "benefits-section", selector: '[class*="works-sec"], [class*="worksSec"]', props: ["padding", "margin"], tolerance: 2 },
  { id: "how-it-works-section", selector: '[class*="makeit-sec"], [class*="sectionRegular3BlueSec"]', props: ["padding", "margin", "background-color"], tolerance: 2 },
  { id: "pricing-section", selector: '[class*="new-price-sec"], [class*="newPriceSec"]', props: ["padding", "margin"], tolerance: 2 },
  { id: "comparison-section", selector: '[class*="ways-sec"], [class*="waysSec"]', props: ["padding", "margin"], tolerance: 2 },
  { id: "faq-section", selector: '[class*="home-faq"], [class*="faq-section"]', props: ["padding", "margin"], tolerance: 2 },
  { id: "footer-section", selector: "footer, [class*='footer'][class*='Footer']", props: ["padding", "margin"], tolerance: 2 },

  // BADGES (the user-mentioned issue)
  { id: "trustpilot-badge", selector: '[class*="review-stars"], [class*="reviewStars"]', props: ["padding", "border-radius", "background-color", "width", "height"], tolerance: 1 },
  { id: "trust-grid-box", selector: '[class*="grid-box"]', props: ["padding", "border-radius", "box-shadow", "gap"], tolerance: 1 },
  { id: "how-it-works-badge", selector: '[class*="how-work-badge"], [class*="howWorkBadge"]', props: ["padding", "border-radius", "border", "background-color", "line-height"], tolerance: 1 },
  { id: "pricing-badge", selector: '[class*="pricesubott"]', props: ["padding", "border-radius", "border"], tolerance: 1 },
  { id: "benefits-badge", selector: '[class*="benefitsubott"]', props: ["padding", "border-radius", "border"], tolerance: 1 },
  { id: "faq-badge", selector: '[class*="faq-subott"], [class*="faqSubott"]', props: ["padding", "border-radius", "border"], tolerance: 1 },
  { id: "newsletter-badge", selector: '[class*="news-subhead-out"], [class*="newsSubheadOut"], [class*="newsubott"]', props: ["padding", "border-radius", "border"], tolerance: 1 },
  { id: "popular-badge", selector: '[class*="p-top-dv"], [class*="pTopDv"]', props: ["padding", "border-radius", "height"], tolerance: 1 },
  { id: "save-pricing-badge", selector: '[class*="pricing-badge"], [class*="pricingBadge"]', props: ["padding", "border-radius", "font-size", "font-weight"], tolerance: 1 },
  { id: "coming-soon-badge", selector: '[class*="comingsoon-badge"], [class*="header-comingsoon-badge"]', props: ["padding", "border-radius", "font-size"], tolerance: 1 },
  { id: "navbar-banner-link", selector: '[class*="beta-link"]', props: ["padding", "border-radius", "background-color", "color"], tolerance: 1 },

  // CTA BUTTONS
  { id: "cta-primary", selector: '[class*="a-gulf-book"]', props: ["padding", "border-radius", "font-size", "font-weight", "line-height", "height"], tolerance: 1 },
  { id: "cta-secondary", selector: '[class*="a-except-get"]', props: ["padding", "border-radius", "font-size", "font-weight", "line-height", "height"], tolerance: 1 },
  { id: "btn-primary-nav", selector: '[class*="btn-primary"]', props: ["padding", "border-radius", "font-size"], tolerance: 1 },
  { id: "btn-secondary-nav", selector: '[class*="button-secondary-large"]', props: ["padding", "border-radius", "font-size"], tolerance: 1 },
  { id: "sky-button", selector: '[class*="sky-button"], [class*="skyButton"]', props: ["padding", "border-radius", "font-size"], tolerance: 1 },
  { id: "pricing-cta-button", selector: '[class*="button-pricing"], [class*="buttonPricing"]', props: ["padding", "border-radius", "font-size", "height"], tolerance: 1 },
  { id: "newsletter-submit", selector: '[class*="button-secondary-small"]', props: ["padding", "border-radius", "font-size", "height"], tolerance: 1 },
  { id: "faq-bottom-link", selector: '[class*="faq-btm-link"], [class*="faqBtmLink"]', props: ["padding", "border-radius"], tolerance: 1 },

  // CARDS
  { id: "feature-card-pain", selector: '[class*="slowing-sec"] [class*="feature-card"]', props: ["padding", "border-radius", "box-shadow", "background-color"], tolerance: 1 },
  { id: "feature-card-benefits", selector: '[class*="works-sec"] [class*="feature-card"], [class*="worksSec"] [class*="featureCard"]', props: ["padding", "border-radius", "box-shadow"], tolerance: 1 },
  { id: "feature-card-how", selector: '[class*="makeit-sec"] [class*="feature-card"], [class*="sectionRegular3BlueSec"] [class*="featureCardBlue"]', props: ["padding", "border-radius", "background-color"], tolerance: 1 },
  { id: "pricing-card-starter", selector: '[class*="pricing-card-2"][class*="white-card"], [class*="pricingCard2WhiteCard"]', props: ["padding", "border-radius", "border", "box-shadow"], tolerance: 1 },
  { id: "pricing-card-popular", selector: '[class*="pricing-card-2"][class*="center-pcard"], [class*="pricingCard2CenterPcard"]', props: ["padding", "border-radius", "border", "box-shadow"], tolerance: 1 },
  { id: "built-for-card", selector: '[class*="built-grid-outer-new"]', props: ["padding", "border-radius", "border", "background-color"], tolerance: 1 },
  { id: "way-inn-in-card", selector: '[class*="way-inn-in"][class*="drop-shadow"], [class*="wayInnInDropShadow"]', props: ["padding", "border-radius", "box-shadow"], tolerance: 1 },

  // GRIDS / GAPS
  { id: "feature-grid-pain", selector: '[class*="slowing-sec"] [class*="feature-grid"], [class*="slowing-sec"] [class*="featureGrid"]', props: ["gap", "grid-template-columns", "margin-top"], tolerance: 1 },
  { id: "feature-grid-benefits", selector: '[class*="works-sec"] [class*="feature-grid"], [class*="worksSec"] [class*="featureGrid"]', props: ["gap", "grid-template-columns", "margin-top"], tolerance: 1 },
  { id: "feature-grid-how", selector: '[class*="makeit-sec"] [class*="feature-grid"], [class*="sectionRegular3BlueSec"] [class*="featureGrid"]', props: ["gap", "grid-template-columns", "margin-top"], tolerance: 1 },
  { id: "built-for-grid", selector: '[class*="built-3-grid-new"]', props: ["gap", "grid-template-columns", "padding"], tolerance: 1 },
  { id: "pricing-grid", selector: '[class*="pricing-grid"][class*="new"], [class*="pricingGrid"]', props: ["gap", "grid-template-columns", "padding"], tolerance: 1 },
  { id: "ways-grid", selector: '[class*="ways-grid"], [class*="waysGrid"]', props: ["gap", "grid-template-columns"], tolerance: 1 },
  { id: "ban-grid-trust", selector: '[class*="ban-grid"]', props: ["gap", "grid-template-columns", "max-width", "margin-bottom"], tolerance: 1 },

  // TYPOGRAPHY (heading-2)
  { id: "heading-2-pain", selector: '[class*="slowing-sec"] [class*="heading-2"]', props: ["font-size", "line-height", "font-weight", "margin-bottom", "color"], tolerance: 1 },
  { id: "heading-2-built", selector: '[class*="built-seccc"] [class*="heading-2"]', props: ["font-size", "line-height", "margin-bottom"], tolerance: 1 },
  { id: "heading-2-faq", selector: '[class*="faq-section"] [class*="heading-2"], [class*="home-faq"] [class*="heading2"]', props: ["font-size", "line-height", "margin-bottom"], tolerance: 1 },
  { id: "heading-2-pricing", selector: '[class*="new-price-sec"] [class*="heading-2"], [class*="newPriceSec"] [class*="heading2"]', props: ["font-size", "line-height", "margin-bottom"], tolerance: 1 },

  // PARAGRAPHS
  { id: "paragraph-pain", selector: '[class*="slowing-sec"] [class*="paragraph"]', props: ["font-size", "line-height", "color"], tolerance: 1 },
  { id: "paragraph-built", selector: '[class*="built-seccc"] [class*="paragraph"]', props: ["font-size", "line-height", "color"], tolerance: 1 },

  // FAQ ACCORDION
  { id: "faq-toggle", selector: '[class*="faq-toggle"], [class*="faqToggle"]', props: ["padding", "border-radius", "background-color"], tolerance: 1 },
  { id: "faq-item", selector: '[class*="faq-item"], [class*="faqItem"]', props: ["padding", "border-radius", "border", "margin-bottom"], tolerance: 1 },

  // FOOTER PIECES
  { id: "footer-newsletter-card", selector: '[class*="footer-newsletter-card"], [class*="footerNewsletterCard"]', props: ["padding", "border-radius", "background-color"], tolerance: 1 },
  { id: "footer-link-column", selector: '[class*="footer-links-grid"], [class*="footerLinksGrid"]', props: ["gap", "grid-template-columns", "padding"], tolerance: 1 },
  { id: "footer-social-link", selector: '[class*="footer-social-link"], [class*="footerSocialLink"]', props: ["padding", "border-radius", "width", "height"], tolerance: 1 },
];

type Snapshot = {
  found: boolean;
  styles: Record<string, string>;
  bbox?: { x: number; y: number; width: number; height: number };
};

async function snapshotAll(page: Page, probes: ProbeTarget[]): Promise<Record<string, Snapshot>> {
  return await page.evaluate(
    ({ probes }) => {
      const out: Record<string, { found: boolean; styles: Record<string, string>; bbox?: DOMRect }> = {};
      for (const p of probes) {
        const el = document.querySelector(p.selector) as HTMLElement | null;
        if (!el) {
          out[p.id] = { found: false, styles: {} };
          continue;
        }
        const cs = window.getComputedStyle(el);
        const styles: Record<string, string> = {};
        for (const prop of p.props) styles[prop] = cs.getPropertyValue(prop) || "";
        const r = el.getBoundingClientRect();
        out[p.id] = { found: true, styles, bbox: { x: r.x, y: r.y, width: r.width, height: r.height } as DOMRect };
      }
      return out;
    },
    { probes },
  );
}

async function loadAndSettle(page: Page, url: string) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await page.waitForTimeout(1500);
  // Hide chat widgets / cookie banners
  await page
    .evaluate(() => {
      const sel = ["#chatwoot_live_chat_widget", "#chatwoot-widget-holder", '[id^="hs-eu-cookie"]'];
      for (const s of sel) {
        const el = document.querySelector(s) as HTMLElement | null;
        if (el) el.style.display = "none";
      }
    })
    .catch(() => {});
}

test.describe("Spacing diff: local vs https://boldteq.com", () => {
  test("element-by-element computed-style diff per viewport", async ({ browser }) => {
    test.setTimeout(900_000);

    type Diff = {
      probeId: string;
      viewport: string;
      property: string;
      live: string;
      local: string;
      delta?: number;
    };
    const diffs: Diff[] = [];
    const missing: { probeId: string; viewport: string; side: "live" | "local" }[] = [];

    for (const vp of VIEWPORTS) {
      console.log(`\n=== Viewport ${vp.name} ===`);
      const liveCtx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const localCtx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const livePage = await liveCtx.newPage();
      const localPage = await localCtx.newPage();

      await Promise.all([loadAndSettle(livePage, LIVE), loadAndSettle(localPage, LOCAL)]);

      const liveSnap = await snapshotAll(livePage, PROBES);
      const localSnap = await snapshotAll(localPage, PROBES);

      for (const p of PROBES) {
        const L = liveSnap[p.id];
        const C = localSnap[p.id];
        if (!L.found) {
          missing.push({ probeId: p.id, viewport: vp.name, side: "live" });
          continue;
        }
        if (!C.found) {
          missing.push({ probeId: p.id, viewport: vp.name, side: "local" });
          continue;
        }
        for (const prop of p.props) {
          const a = L.styles[prop] ?? "";
          const b = C.styles[prop] ?? "";
          if (a === b) continue;
          // Numerical compare for px values
          const ma = a.match(/^-?\d+(\.\d+)?px$/);
          const mb = b.match(/^-?\d+(\.\d+)?px$/);
          if (ma && mb) {
            const d = Math.abs(parseFloat(a) - parseFloat(b));
            if (d <= p.tolerance) continue;
            diffs.push({ probeId: p.id, viewport: vp.name, property: prop, live: a, local: b, delta: Math.round(d * 10) / 10 });
          } else {
            diffs.push({ probeId: p.id, viewport: vp.name, property: prop, live: a, local: b });
          }
        }
      }

      await liveCtx.close();
      await localCtx.close();
    }

    const byProbe: Record<string, Diff[]> = {};
    for (const d of diffs) (byProbe[d.probeId] ??= []).push(d);

    const reportPath = path.join("tests", "screenshots", "spacing-diff.json");
    await fs.writeFile(reportPath, JSON.stringify({ totals: { count: diffs.length, missing: missing.length }, missing, diffs }, null, 2), "utf8");

    console.log(`\nTotal diffs: ${diffs.length}`);
    console.log(`Missing element matches: ${missing.length}`);
    console.log(`\nDiffs grouped by probe (top 30):`);
    Object.entries(byProbe)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 30)
      .forEach(([probe, items]) => console.log(`  ${items.length.toString().padStart(3)}  ${probe}`));

    expect(diffs.length).toBeGreaterThanOrEqual(0);
  });
});
