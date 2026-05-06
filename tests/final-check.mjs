import { chromium } from "@playwright/test";

async function finalCheck() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(2000);

  const issues = await page.evaluate(() => {
    const problems = [];

    // 1. Check all interactive elements have cursor:pointer
    const clickables = document.querySelectorAll("a, button, [role='button']");
    clickables.forEach(el => {
      const cs = window.getComputedStyle(el);
      if (cs.cursor !== "pointer" && el.textContent.trim()) {
        problems.push(`Missing cursor:pointer on "${el.tagName} - ${el.textContent.trim().substring(0, 20)}"`);
      }
    });

    // 2. Check no text overflows its container
    const allText = document.querySelectorAll("h1, h2, h3, h4, p, span, a");
    allText.forEach(el => {
      if (el.scrollWidth > el.clientWidth + 5) {
        problems.push(`Text overflow: "${el.textContent.trim().substring(0, 30)}" in ${el.tagName}`);
      }
    });

    // 3. Check z-index on sticky nav
    const header = document.querySelector("header");
    if (header) {
      const hs = window.getComputedStyle(header);
      if (hs.position !== "sticky" && hs.position !== "fixed") {
        problems.push(`Header not sticky: position=${hs.position}`);
      }
    }
    const nav = document.querySelector("nav");
    if (nav) {
      const ns = window.getComputedStyle(nav);
      if (ns.position === "sticky" || ns.position === "fixed") {
        const z = parseInt(ns.zIndex);
        if (z < 50) problems.push(`Nav z-index too low: ${z}`);
      }
    }

    // 4. Check section backgrounds alternate correctly
    const main = document.querySelector("main");
    if (main) {
      const kids = main.children;
      for (let i = 0; i < kids.length; i++) {
        const bg = window.getComputedStyle(kids[i]).backgroundColor;
        // Just log backgrounds for review
        const h = kids[i].querySelector("h1, h2, h3");
        const text = h ? h.textContent.trim().substring(0, 30) : "(no heading)";
      }
    }

    // 5. Check all images have alt text
    const imgs = document.querySelectorAll("img");
    imgs.forEach(img => {
      if (!img.alt && !img.getAttribute("aria-hidden")) {
        problems.push(`Image missing alt: ${img.src.substring(img.src.lastIndexOf("/") + 1, img.src.lastIndexOf("/") + 30)}`);
      }
    });

    // 6. Check dropdown hover works (by checking visibility of dropdown content)
    const dropdowns = document.querySelectorAll("[class*='group']");
    problems.push(`Dropdown groups found: ${dropdowns.length}`);

    // 7. Check smooth scroll is enabled
    const html = document.documentElement;
    const scrollBehavior = window.getComputedStyle(html).scrollBehavior;
    if (scrollBehavior !== "smooth") {
      problems.push(`Scroll behavior not smooth: ${scrollBehavior}`);
    }

    // 8. Check all gradient buttons
    const btns = document.querySelectorAll("a, button");
    const gradBtns = [];
    btns.forEach(btn => {
      const cs = window.getComputedStyle(btn);
      if (cs.backgroundImage.includes("gradient")) {
        const r = parseFloat(cs.borderRadius);
        gradBtns.push({
          text: btn.textContent.trim().substring(0, 25),
          radius: cs.borderRadius,
          hasHoverTransition: cs.transition.includes("all") || cs.transition.includes("opacity") || cs.transition.includes("background"),
        });
      }
    });
    problems.push(`Gradient buttons: ${JSON.stringify(gradBtns)}`);

    return problems;
  });

  console.log("=== ISSUES FOUND ===");
  issues.forEach(i => console.log("  " + i));

  // Test hover on nav dropdown
  const solutionsLink = await page.locator("text=Solutions").first();
  if (solutionsLink) {
    await solutionsLink.hover();
    await page.waitForTimeout(500);
    await page.screenshot({ path: "tests/screenshots/dropdown-hover.png" });
    console.log("\nDropdown hover screenshot saved");
  }

  // Test mobile view
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: "tests/screenshots/mobile-hero.png" });
  await page.screenshot({ path: "tests/screenshots/mobile-full.png", fullPage: true });
  console.log("Mobile screenshots saved");

  await browser.close();
}

finalCheck().catch(console.error);
