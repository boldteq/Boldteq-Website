import { chromium } from "@playwright/test";

async function audit() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 30000 });

  // Wait for all images to load
  await page.waitForTimeout(3000);

  // Take screenshots
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: "tests/screenshots/local-hero.png" });
  await page.screenshot({ path: "tests/screenshots/local-full.png", fullPage: true });

  // Audit
  const results = await page.evaluate(() => {
    const out = {};

    // Check truly broken images (404s, not just loading)
    const imgs = document.querySelectorAll("img");
    const broken = [];
    const loaded = [];
    imgs.forEach(img => {
      if (img.naturalWidth === 0 && img.complete) {
        broken.push(img.src.replace(window.location.origin, ""));
      } else {
        loaded.push(1);
      }
    });
    out.totalImages = imgs.length;
    out.loadedImages = loaded.length;
    out.brokenImages = broken;

    // Hover test - check if cards have transition
    const cards = document.querySelectorAll("[class*='transition']");
    out.elementsWithTransitions = cards.length;

    // Check font consistency
    const allText = document.querySelectorAll("h1, h2, h3, p, a, span, button");
    const fontFamilies = new Set();
    allText.forEach(el => {
      const ff = window.getComputedStyle(el).fontFamily;
      if (ff) fontFamilies.add(ff.split(",")[0].trim().replace(/"/g, ""));
    });
    out.fontsUsed = [...fontFamilies];

    // Check all h2 weights are 700
    const h2s = document.querySelectorAll("h2");
    const h2Issues = [];
    h2s.forEach(h => {
      const w = window.getComputedStyle(h).fontWeight;
      if (w !== "700") {
        h2Issues.push({ text: h.textContent.trim().substring(0, 30), weight: w });
      }
    });
    out.h2WeightIssues = h2Issues;

    // Check all gradient buttons have rounded-xl (not rounded-full)
    const btns = document.querySelectorAll("a, button");
    const radiusIssues = [];
    btns.forEach(btn => {
      const cs = window.getComputedStyle(btn);
      if (cs.backgroundImage.includes("gradient")) {
        const r = parseFloat(cs.borderRadius);
        if (r > 100) {
          radiusIssues.push({ text: btn.textContent.trim().substring(0, 20), radius: cs.borderRadius });
        }
      }
    });
    out.buttonRadiusIssues = radiusIssues;

    // Section count and backgrounds
    const sections = document.querySelectorAll("main > *");
    out.topLevelSections = sections.length;

    return out;
  });

  console.log(JSON.stringify(results, null, 2));

  if (consoleErrors.length > 0) {
    console.log("\n=== CONSOLE ERRORS ===");
    consoleErrors.forEach(e => console.log("  " + e));
  } else {
    console.log("\n=== ZERO CONSOLE ERRORS ===");
  }

  await browser.close();
}

audit().catch(console.error);
