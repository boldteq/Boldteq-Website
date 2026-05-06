import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const LOCAL = process.env.LOCAL_URL ?? "http://localhost:3000";
const LIVE = "https://boldteq.com";
const PAGE = "/our-mission";

const VIEWPORTS = [
  { name: "1440-desktop", width: 1440, height: 900 },
  { name: "991-tablet", width: 991, height: 800 },
  { name: "767-mobile-l", width: 767, height: 800 },
  { name: "479-mobile-p", width: 479, height: 800 },
] as const;

const OUT_DIR = path.join(process.cwd(), "test-results", "our-mission");
fs.mkdirSync(OUT_DIR, { recursive: true });

for (const vp of VIEWPORTS) {
  test.describe(`our-mission parity @ ${vp.name}`, () => {
    test(`screenshots + structural diff @ ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // ── LIVE ──
      await page.goto(`${LIVE}${PAGE}`, { waitUntil: "domcontentloaded", timeout: 60_000 });
      await page.waitForLoadState("load", { timeout: 30_000 }).catch(() => {});
      await page.waitForTimeout(2500);
      await page.screenshot({
        path: path.join(OUT_DIR, `live-${vp.name}.png`),
        fullPage: true,
      });
      const liveHeadings = await page.evaluate(() => {
        const h = (sel: string) =>
          Array.from(document.querySelectorAll(sel)).map((n) => n.textContent?.trim() ?? "");
        return { h1: h("h1"), h2: h("h2"), h3: h("h3") };
      });
      const liveSections = await page.locator("section").count();

      // ── LOCAL ──
      await page.goto(`${LOCAL}${PAGE}`, { waitUntil: "domcontentloaded", timeout: 60_000 });
      await page.waitForLoadState("load", { timeout: 30_000 }).catch(() => {});
      await page.waitForTimeout(2000);
      await page.screenshot({
        path: path.join(OUT_DIR, `local-${vp.name}.png`),
        fullPage: true,
      });
      const localHeadings = await page.evaluate(() => {
        const h = (sel: string) =>
          Array.from(document.querySelectorAll(sel)).map((n) => n.textContent?.trim() ?? "");
        return { h1: h("h1"), h2: h("h2"), h3: h("h3") };
      });
      const localSections = await page.locator("section").count();

      const report = {
        viewport: vp.name,
        live: { sections: liveSections, ...liveHeadings },
        local: { sections: localSections, ...localHeadings },
      };
      fs.writeFileSync(
        path.join(OUT_DIR, `report-${vp.name}.json`),
        JSON.stringify(report, null, 2),
      );

      // h1 must match exactly
      expect(localHeadings.h1[0]).toBe(liveHeadings.h1[0]);
    });
  });
}
