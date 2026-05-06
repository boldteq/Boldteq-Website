import { chromium } from "@playwright/test";

async function scorecard() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const consoleErrors = [];
  page.on("console", msg => {
    if (msg.type() === "error" && !msg.text().includes("429")) consoleErrors.push(msg.text());
  });

  await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(2000);

  const score = await page.evaluate(() => {
    const checks = {};

    // 1. FONT
    const body = document.body;
    const bodyFont = window.getComputedStyle(body).fontFamily;
    checks.font = bodyFont.includes("roobertPro") ? "PASS" : `FAIL: ${bodyFont}`;

    // 2. ALL IMAGES LOADED
    const imgs = document.querySelectorAll("img");
    let broken = 0;
    imgs.forEach(img => { if (img.complete && img.naturalWidth === 0) broken++; });
    checks.images = broken === 0 ? `PASS (${imgs.length} loaded)` : `FAIL (${broken} broken of ${imgs.length})`;

    // 3. ALL H2 FONT-WEIGHT 700
    const h2s = document.querySelectorAll("h2");
    let h2Fail = 0;
    h2s.forEach(h => { if (window.getComputedStyle(h).fontWeight !== "700") h2Fail++; });
    checks.h2Weights = h2Fail === 0 ? `PASS (${h2s.length} headings)` : `FAIL (${h2Fail} wrong)`;

    // 4. ALL BUTTONS HAVE CURSOR POINTER
    const btns = document.querySelectorAll("button, a[class*='gradient'], a[class*='btn']");
    let cursorFail = 0;
    btns.forEach(b => { if (window.getComputedStyle(b).cursor !== "pointer") cursorFail++; });
    checks.cursors = cursorFail === 0 ? `PASS (${btns.length} buttons)` : `FAIL (${cursorFail} missing)`;

    // 5. SECTION COUNT
    const main = document.querySelector("main");
    const sections = main ? main.children.length : 0;
    checks.sections = sections === 13 ? "PASS (13)" : `FAIL (${sections})`;

    // 6. STICKY NAV
    const nav = document.querySelector("nav");
    const navPos = nav ? window.getComputedStyle(nav).position : "none";
    checks.stickyNav = navPos === "sticky" ? "PASS" : `WARN: ${navPos}`;

    // 7. FOOTER BG COLOR
    const footer = document.querySelector("footer");
    const footerBg = footer ? window.getComputedStyle(footer).backgroundColor : "none";
    checks.footerBg = footerBg === "rgb(8, 39, 83)" ? "PASS (#082753)" : `FAIL: ${footerBg}`;

    // 8. GRADIENT BUTTONS RADIUS (should be 10-14px, not 9999px)
    const gradBtns = document.querySelectorAll("a, button");
    let radiusFail = 0;
    gradBtns.forEach(b => {
      const cs = window.getComputedStyle(b);
      if (cs.backgroundImage.includes("gradient") && parseFloat(cs.borderRadius) > 100) radiusFail++;
    });
    checks.buttonRadius = radiusFail === 0 ? "PASS" : `FAIL (${radiusFail} rounded-full)`;

    // 9. SMOOTH SCROLL
    const scrollB = window.getComputedStyle(document.documentElement).scrollBehavior;
    checks.smoothScroll = scrollB === "smooth" ? "PASS" : `FAIL: ${scrollB}`;

    // 10. TEXT OVERFLOW
    let overflows = 0;
    document.querySelectorAll("h1,h2,h3,p").forEach(el => {
      if (el.scrollWidth > el.clientWidth + 10) overflows++;
    });
    checks.textOverflow = overflows === 0 ? "PASS" : `WARN (${overflows} overflows)`;

    // 11. NO EMPTY SECTIONS
    const mainKids = main ? [...main.children] : [];
    let emptySec = 0;
    mainKids.forEach(sec => { if (sec.offsetHeight < 10) emptySec++; });
    checks.emptySections = emptySec === 0 ? "PASS" : `FAIL (${emptySec} empty)`;

    // 12. TRANSITIONS ON INTERACTIVE ELEMENTS
    let transCount = 0;
    document.querySelectorAll("[class*='transition']").forEach(() => transCount++);
    checks.transitions = transCount > 50 ? `PASS (${transCount} elements)` : `WARN (${transCount} — low)`;

    // 13. DARK SECTION CONTRAST (white text on navy)
    const navySections = document.querySelectorAll("[class*='082753'], [class*='navy']");
    let contrastFail = 0;
    navySections.forEach(sec => {
      const h = sec.querySelector("h1,h2,h3");
      if (h) {
        const c = window.getComputedStyle(h).color;
        if (!c.includes("255")) contrastFail++;
      }
    });
    checks.contrast = contrastFail === 0 ? "PASS" : `WARN (${contrastFail} dark-on-dark)`;

    return checks;
  });

  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║     BOLDTEQ HOMEPAGE — FINAL SCORECARD   ║");
  console.log("╠══════════════════════════════════════════╣");
  let passCount = 0;
  let totalCount = 0;
  for (const [check, result] of Object.entries(score)) {
    totalCount++;
    const status = result.startsWith("PASS") ? "✅" : result.startsWith("WARN") ? "⚠️ " : "❌";
    if (result.startsWith("PASS")) passCount++;
    console.log(`║ ${status} ${check.padEnd(18)} ${result.substring(0, 28).padEnd(20)}║`);
  }
  console.log("╠══════════════════════════════════════════╣");
  console.log(`║ Score: ${passCount}/${totalCount} checks passed${" ".repeat(17)}║`);
  if (consoleErrors.length > 0) {
    console.log(`║ Console errors: ${consoleErrors.length}${" ".repeat(22)}║`);
  } else {
    console.log(`║ Console errors: 0${" ".repeat(21)}║`);
  }
  console.log("╚══════════════════════════════════════════╝");

  // Take final screenshots
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: "tests/screenshots/final-hero.png" });
  await page.screenshot({ path: "tests/screenshots/final-full.png", fullPage: true });

  // Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: "tests/screenshots/final-mobile.png" });
  await page.screenshot({ path: "tests/screenshots/final-mobile-full.png", fullPage: true });

  await browser.close();
}

scorecard().catch(console.error);
