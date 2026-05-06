import { test } from "@playwright/test";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const LOCAL = process.env.LOCAL_URL ?? "http://localhost:3000";
const LIVE = "https://boldteq.com";

const SECTIONS = [
  { id: "01-hero-trust-video-cta", selector: '[class*="div-stuck-swept"]' },
  { id: "02-trustpilot-badge", selector: '[class*="review-link"]' },
  { id: "03-pain-points-cards", selector: '[class*="slowing-sec"]' },
  { id: "04-resolution-banner", selector: '[class*="blue-card-sec"]' },
  { id: "05-built-for-section", selector: '[class*="built-seccc"]' },
  { id: "06-benefits-grid", selector: '[class*="works-sec"], [class*="worksSec"]' },
  { id: "07-how-it-works-section", selector: '[class*="makeit-sec"], [class*="sectionRegular3BlueSec"]' },
  { id: "08-pricing-section", selector: '[class*="new-price-sec"], [class*="newPriceSec"]' },
  { id: "09-custom-plan-cta", selector: '[class*="customPlan"], [class*="custom-plan"]' },
  { id: "10-comparison-section", selector: '[class*="ways-sec"], [class*="waysSec"]' },
  { id: "11-faq-section", selector: '[class*="home-faq"], [class*="faqSection"]' },
  { id: "12-footer-newsletter", selector: '[class*="footer-newsletter"], [class*="footerNewsletter"]' },
];

const VIEWPORT = { width: 1440, height: 900 };

test("capture section screenshots side-by-side", async ({ browser }) => {
  test.setTimeout(600_000);
  const outDir = path.join("tests", "screenshots", "side-by-side");
  await fs.mkdir(outDir, { recursive: true });

  const liveCtx = await browser.newContext({ viewport: VIEWPORT });
  const localCtx = await browser.newContext({ viewport: VIEWPORT });
  const livePage = await liveCtx.newPage();
  const localPage = await localCtx.newPage();

  for (const url of [LIVE, LOCAL]) {
    const page = url === LIVE ? livePage : localPage;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
    await page.waitForTimeout(1500);
    await page.evaluate(() => {
      const sel = ["#chatwoot_live_chat_widget", "#chatwoot-widget-holder"];
      for (const s of sel) {
        const el = document.querySelector(s) as HTMLElement | null;
        if (el) el.style.display = "none";
      }
    });
  }

  for (const s of SECTIONS) {
    const liveLoc = livePage.locator(s.selector).first();
    const localLoc = localPage.locator(s.selector).first();
    const liveOk = await liveLoc.count();
    const localOk = await localLoc.count();
    if (liveOk) {
      await liveLoc.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
      await livePage.waitForTimeout(300);
      await liveLoc.screenshot({ path: path.join(outDir, `${s.id}_live.png`), animations: "disabled" }).catch(() => {});
    }
    if (localOk) {
      await localLoc.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
      await localPage.waitForTimeout(300);
      await localLoc.screenshot({ path: path.join(outDir, `${s.id}_local.png`), animations: "disabled" }).catch(() => {});
    }
    console.log(`  ${s.id} live=${liveOk} local=${localOk}`);
  }

  await liveCtx.close();
  await localCtx.close();
});
