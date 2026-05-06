import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const BASE = "http://localhost:3000";

// Ensure test-results dir exists
const RESULTS_DIR = path.resolve(__dirname, "../test-results");
if (!fs.existsSync(RESULTS_DIR)) fs.mkdirSync(RESULTS_DIR, { recursive: true });

test.describe("Pricing page parity — /pricing", () => {
  test("h1 contains both title lines", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "domcontentloaded" });
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    const text = await h1.innerText();
    expect(text).toContain("Pick a Flexible Subscription.");
    expect(text).toContain("Get Predictable Output.");
  });

  test("monthly tab — 3 pricing cards with correct prices", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "domcontentloaded" });
    // Monthly is default — assert 3 prices
    await expect(page.getByText("$999/month").first()).toBeVisible();
    await expect(page.getByText("$1,999/month").first()).toBeVisible();
    await expect(page.getByText("$3,499/month").first()).toBeVisible();
  });

  test("monthly CTA labels = 'Choose Plan' × 3", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "domcontentloaded" });
    const ctaLinks = page.locator('a:has-text("Choose Plan")');
    await expect(ctaLinks).toHaveCount(3);
  });

  test("monthly CTA hrefs contain portal.boldteq.com/services/{plan}", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "domcontentloaded" });
    const ctaLinks = page.locator('a:has-text("Choose Plan")');
    const hrefs = await ctaLinks.evaluateAll((els) =>
      (els as HTMLAnchorElement[]).map((el) => el.href)
    );
    expect(hrefs).toHaveLength(3);
    for (const href of hrefs) {
      expect(href).toContain("portal.boldteq.com/services/");
    }
  });

  test("quarterly tab — discounted prices + struck originals", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "domcontentloaded" });
    await page.getByRole("group", { name: "Billing period" }).getByRole("button", { name: /quarterly/i }).click();

    // Discounted prices
    await expect(page.getByText("$899/month").first()).toBeVisible();
    await expect(page.getByText("$1,799/month").first()).toBeVisible();
    await expect(page.getByText("$3,149/month").first()).toBeVisible();

    // Struck-through originals (comparePrice elements)
    await expect(page.getByText("$999.00").first()).toBeVisible();
    await expect(page.getByText("$1,999.00").first()).toBeVisible();
    await expect(page.getByText("$3,499.00").first()).toBeVisible();
  });

  test("quarterly CTA labels = 'Get Started' × 3", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "domcontentloaded" });
    await page.getByRole("group", { name: "Billing period" }).getByRole("button", { name: /quarterly/i }).click();
    const ctaLinks = page.locator('a:has-text("Get Started")');
    await expect(ctaLinks).toHaveCount(3);
  });

  test("annually tab — discounted prices + struck originals", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "domcontentloaded" });
    await page.getByRole("group", { name: "Billing period" }).getByRole("button", { name: /annually/i }).click();

    // Discounted prices
    await expect(page.getByText("$799/month").first()).toBeVisible();
    await expect(page.getByText("$1,599/month").first()).toBeVisible();
    await expect(page.getByText("$2,799/month").first()).toBeVisible();

    // Struck-through originals
    await expect(page.getByText("$999.00").first()).toBeVisible();
    await expect(page.getByText("$1,999.00").first()).toBeVisible();
    await expect(page.getByText("$3,499.00").first()).toBeVisible();
  });

  test("annually CTA labels = 'Get Started' × 3", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "domcontentloaded" });
    await page.getByRole("group", { name: "Billing period" }).getByRole("button", { name: /annually/i }).click();
    const ctaLinks = page.locator('a:has-text("Get Started")');
    await expect(ctaLinks).toHaveCount(3);
  });

  test("comparison table has exactly 9 data rows", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "domcontentloaded" });
    // Each data row has a left cell with a strong label — count those
    // The table header row is separate; count only the data label cells
    const labelCells = page.locator('[class*="pricingTableCellLeft"]');
    await expect(labelCells).toHaveCount(9);
  });

  test("ROI calculator section is present", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#roi-calc")).toBeVisible();
    await expect(page.locator("#roi-calc-heading")).toHaveText("See Your Real Savings Before You Commit");
  });

  // ── Viewport screenshot suite ─────────────────────────────────────────────
  for (const viewport of [
    { name: "1440", width: 1440, height: 900 },
    { name: "1280", width: 1280, height: 800 },
    { name: "991", width: 991, height: 768 },
    { name: "767", width: 767, height: 900 },
    { name: "479", width: 479, height: 900 },
  ]) {
    test(`screenshot at ${viewport.name}px`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`${BASE}/pricing`, { waitUntil: "networkidle" });
      const filePath = path.join(RESULTS_DIR, `pricing-${viewport.name}.png`);
      await page.screenshot({ path: filePath, fullPage: true });
      expect(fs.existsSync(filePath)).toBe(true);
    });
  }
});
