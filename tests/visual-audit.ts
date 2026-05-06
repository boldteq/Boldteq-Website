import { chromium } from "@playwright/test";

async function audit() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  // Screenshot our site
  const localPage = await context.newPage();
  await localPage.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await localPage.screenshot({ path: "tests/screenshots/local-full.png", fullPage: true });

  // Screenshot viewport sections
  await localPage.evaluate(() => window.scrollTo(0, 0));
  await localPage.screenshot({ path: "tests/screenshots/local-hero.png" });

  // Get computed styles for key elements
  const auditResults = await localPage.evaluate(() => {
    const results: Record<string, Record<string, string>> = {};

    function getStyles(selector: string, label: string) {
      const el = document.querySelector(selector);
      if (!el) {
        results[label] = { error: "NOT FOUND: " + selector };
        return;
      }
      const cs = getComputedStyle(el);
      results[label] = {
        fontFamily: cs.fontFamily.slice(0, 60),
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        padding: cs.padding,
        margin: cs.margin,
        borderRadius: cs.borderRadius,
        boxShadow: cs.boxShadow.slice(0, 80),
        display: cs.display,
        gap: cs.gap,
        width: cs.width,
        maxWidth: cs.maxWidth,
      };
    }

    // Navbar
    getStyles("header", "navbar-header");
    getStyles("nav", "navbar-nav");
    getStyles("header a img", "navbar-logo");

    // Hero section
    getStyles("section", "first-section");
    getStyles("h1", "first-h1");
    getStyles("h2", "first-h2");

    // Body
    getStyles("body", "body");

    // All headings
    const allH2s = document.querySelectorAll("h2");
    allH2s.forEach((h2, i) => {
      if (i < 10) {
        const cs = getComputedStyle(h2);
        results[`h2-${i}`] = {
          text: (h2.textContent || "").slice(0, 50),
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          lineHeight: cs.lineHeight,
          color: cs.color,
          marginBottom: cs.marginBottom,
        };
      }
    });

    // Check all buttons
    const buttons = document.querySelectorAll("a, button");
    let btnCount = 0;
    buttons.forEach((btn) => {
      const cs = getComputedStyle(btn);
      const text = (btn.textContent || "").trim();
      if (text === "Schedule Demo" || text === "Login" || text === "Choose Plan" || text === "Join the Beta") {
        results[`btn-${text}`] = {
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          padding: cs.padding,
          borderRadius: cs.borderRadius,
          background: cs.backgroundImage.slice(0, 80) || cs.backgroundColor,
          color: cs.color,
          border: cs.border,
        };
        btnCount++;
      }
    });

    // Check footer
    getStyles("footer", "footer");

    // Count sections
    const sections = document.querySelectorAll("section, [class*='sec']");
    results["section-count"] = { total: String(sections.length) };

    return results;
  });

  console.log(JSON.stringify(auditResults, null, 2));

  // Check for console errors
  const errors: string[] = [];
  localPage.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await localPage.reload({ waitUntil: "networkidle" });
  if (errors.length > 0) {
    console.log("\n=== CONSOLE ERRORS ===");
    errors.forEach((e) => console.log(e));
  }

  await browser.close();
}

audit().catch(console.error);
