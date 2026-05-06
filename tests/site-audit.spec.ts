import { test, expect, type Page } from "@playwright/test";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const LOCAL = process.env.LOCAL_URL ?? "http://localhost:3000";

const ROUTES = [
  "/",
  "/pricing",
  "/our-works",
  "/our-works/cinea",
  "/our-works/dabble",
  "/how-it-works",
  "/contact",
  "/beta",
  "/careers",
  "/blog",
  "/our-mission",
  "/book-a-demo",
  "/scope",
  "/testimonials",
  "/privacy-policy",
  "/terms-of-service",
  "/newsletter",
  "/services/website-development",
  "/services/ui-ux-design",
  "/services/graphics-design",
  "/services/app-development",
] as const;

const VIEWPORTS = [
  { name: "1440", width: 1440, height: 900 },
  { name: "375", width: 375, height: 812 },
] as const;

type RouteResult = {
  route: string;
  viewport: string;
  status: number;
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: string[];
  hasH1: boolean;
  hasMain: boolean;
  hasNavbar: boolean;
  hasFooter: boolean;
  imageCount: number;
  imagesWithoutAlt: number;
  loadMs: number;
};

async function probeRoute(page: Page, route: string, vpName: string): Promise<RouteResult> {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const failedRequests: string[] = [];

  const onConsole = (msg: import("@playwright/test").ConsoleMessage) => {
    if (msg.type() === "error") consoleErrors.push(msg.text().slice(0, 300));
  };
  const onPageError = (err: Error) => pageErrors.push(err.message.slice(0, 300));
  const onRequestFailed = (req: import("@playwright/test").Request) => {
    const url = req.url();
    if (url.startsWith(LOCAL)) failedRequests.push(`${req.method()} ${url} ${req.failure()?.errorText ?? ""}`);
  };

  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  page.on("requestfailed", onRequestFailed);

  const start = Date.now();
  let status = 0;
  try {
    const resp = await page.goto(`${LOCAL}${route}`, { waitUntil: "domcontentloaded", timeout: 30_000 });
    status = resp?.status() ?? 0;
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  } catch {
    status = -1;
  }
  const loadMs = Date.now() - start;

  const summary = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll("img"));
    return {
      hasH1: !!document.querySelector("h1"),
      hasMain: !!document.querySelector("main"),
      hasNavbar: !!document.querySelector("nav, [role='navigation']"),
      hasFooter: !!document.querySelector("footer"),
      imageCount: imgs.length,
      imagesWithoutAlt: imgs.filter((i) => !i.hasAttribute("alt")).length,
    };
  }).catch(() => ({ hasH1: false, hasMain: false, hasNavbar: false, hasFooter: false, imageCount: 0, imagesWithoutAlt: 0 }));

  page.off("console", onConsole);
  page.off("pageerror", onPageError);
  page.off("requestfailed", onRequestFailed);

  return { route, viewport: vpName, status, consoleErrors, pageErrors, failedRequests, loadMs, ...summary };
}

test.describe("Site-wide acceptance audit", () => {
  test("all routes load clean across viewports", async ({ browser }) => {
    test.setTimeout(900_000);

    const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
    const page = await ctx.newPage();
    const results: RouteResult[] = [];

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      console.log(`\n=== Viewport ${vp.name} ===`);
      for (const route of ROUTES) {
        const r = await probeRoute(page, route, vp.name);
        results.push(r);
        const flags: string[] = [];
        if (r.status !== 200) flags.push(`status=${r.status}`);
        if (r.consoleErrors.length > 0) flags.push(`console=${r.consoleErrors.length}`);
        if (r.pageErrors.length > 0) flags.push(`pageError=${r.pageErrors.length}`);
        if (r.failedRequests.length > 0) flags.push(`failedReq=${r.failedRequests.length}`);
        if (!r.hasH1) flags.push("no-h1");
        if (!r.hasMain) flags.push("no-main");
        if (!r.hasNavbar) flags.push("no-nav");
        if (!r.hasFooter) flags.push("no-footer");
        if (r.imagesWithoutAlt > 0) flags.push(`alt-missing=${r.imagesWithoutAlt}`);
        const status = flags.length === 0 ? "OK" : "ISSUES";
        console.log(`  [${status}] ${r.route.padEnd(36)} ${r.loadMs}ms ${flags.join(" ")}`);
      }
    }

    const reportPath = path.join("tests", "screenshots", "site-audit-report.json");
    await fs.writeFile(reportPath, JSON.stringify(results, null, 2), "utf8");

    const failures = results.filter((r) => r.status !== 200 || r.pageErrors.length > 0 || r.failedRequests.length > 0);
    if (failures.length > 0) {
      console.log("\n=== HARD FAILURES ===");
      for (const f of failures) console.log(`  ${f.route} @${f.viewport}: status=${f.status} pageErrors=${f.pageErrors.length} failedReq=${f.failedRequests.length}`);
    }

    expect(failures.length, `${failures.length} hard failures (status / pageError / failedRequest). See site-audit-report.json`).toBe(0);
  });
});
