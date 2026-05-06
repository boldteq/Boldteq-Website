import { chromium } from "@playwright/test";

async function compare() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  // Screenshot live Webflow site
  const webflow = await ctx.newPage();
  await webflow.goto("https://boldteq.com", { waitUntil: "networkidle", timeout: 30000 });
  await webflow.screenshot({ path: "tests/screenshots/webflow-hero.png" });
  await webflow.screenshot({ path: "tests/screenshots/webflow-full.png", fullPage: true });

  // Get Webflow computed styles for comparison
  const wfStyles = await webflow.evaluate(() => {
    const out = {};
    function grab(sel, label) {
      const el = document.querySelector(sel);
      if (!el) { out[label] = "NOT_FOUND"; return; }
      const cs = window.getComputedStyle(el);
      out[label] = {
        font: cs.fontFamily.substring(0, 40),
        size: cs.fontSize,
        weight: cs.fontWeight,
        lh: cs.lineHeight,
        color: cs.color,
        bg: cs.backgroundColor,
      };
    }
    grab("body", "body");
    grab("h1", "h1");
    grab("h2", "h2");
    grab(".heading-2", "heading-2-class");
    grab(".nav-23-link", "nav-link");
    grab(".a-gulf-book", "cta-btn");
    grab(".footer", "footer");

    // Get all h2 font-weights
    const h2s = document.querySelectorAll("h2, .heading-2");
    const weights = [];
    h2s.forEach((h, i) => {
      if (i < 10) {
        const cs = window.getComputedStyle(h);
        weights.push({ text: h.textContent.trim().substring(0, 30), weight: cs.fontWeight, size: cs.fontSize });
      }
    });
    out.allH2Weights = weights;

    return out;
  });

  console.log("=== WEBFLOW STYLES ===");
  console.log(JSON.stringify(wfStyles, null, 2));

  await browser.close();
}

compare().catch(console.error);
