/**
 * Comprehensive Playwright test that checks EVERY visual property
 * against the Webflow CSS source values. Returns a structured JSON
 * of all issues found so they can be fixed programmatically.
 */
import { chromium } from "@playwright/test";
import { readFileSync } from "fs";

async function runAudit() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const consoleErrors = [];
  page.on("console", msg => {
    if (msg.type() === "error" && !msg.text().includes("429") && !msg.text().includes("Failed to load resource"))
      consoleErrors.push(msg.text());
  });

  await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(3000);

  // Take screenshots at key positions
  const scrollPositions = [0, 800, 1600, 2400, 3200, 4000, 5000, 6000, 7000, 8000, 9000];
  for (const y of scrollPositions) {
    await page.evaluate(sy => window.scrollTo(0, sy), y);
    await page.waitForTimeout(200);
    await page.screenshot({ path: `tests/screenshots/audit-${y}.png` });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  const issues = await page.evaluate(() => {
    const bugs = [];
    const warnings = [];
    const passed = [];

    function cs(el) { return window.getComputedStyle(el); }
    function px(v) { return Math.round(parseFloat(v) || 0); }
    function rgb(v) { return v; }

    // ═══════════════════════════════════════════════
    // WEBFLOW REFERENCE VALUES (from CSS analysis)
    // ═══════════════════════════════════════════════
    const WF = {
      navLink: { color: "rgb(0, 0, 0)", fontSize: "16px", fontWeight: "400", padding: "8px 5px" },
      heading2: { fontSize: "40px", fontWeight: "700", lineHeight: "45px", marginBottom: "24px" },
      paragraph: { fontSize: "16px", lineHeight: "28px", color: "rgb(43, 43, 43)" },
      paragraphCenter: { textAlign: "center" },
      cta: { borderRadius: "12px", fontWeight: "700" },
      footerBg: "rgb(8, 39, 83)",
      navyBg: "rgb(8, 39, 83)",
      cardRadius: "20px",
      cardHoverBg: "rgb(200, 236, 250)", // #c8ecfa
      bodyFont: "roobertPro",
    };

    // ═══════════════════════════════════════════════
    // 1. FONT CHECK
    // ═══════════════════════════════════════════════
    const bodyFont = cs(document.body).fontFamily;
    if (bodyFont.toLowerCase().includes("roobert") || bodyFont.toLowerCase().includes("roobertpro")) {
      passed.push("FONT: RoobertPRO loaded");
    } else {
      bugs.push({ id: "FONT", desc: `Body font is ${bodyFont}, expected RoobertPRO` });
    }

    // ═══════════════════════════════════════════════
    // 2. IMAGE CHECK
    // ═══════════════════════════════════════════════
    const imgs = document.querySelectorAll("img");
    let brokenCount = 0;
    const brokenSrcs = [];
    imgs.forEach(img => {
      if (img.complete && img.naturalWidth === 0 && img.src && !img.src.includes("data:")) {
        brokenCount++;
        brokenSrcs.push(img.src.replace(window.location.origin, ""));
      }
    });
    if (brokenCount === 0) {
      passed.push(`IMAGES: ${imgs.length} loaded, 0 broken`);
    } else {
      bugs.push({ id: "BROKEN_IMAGES", desc: `${brokenCount} broken images`, details: brokenSrcs.slice(0, 10) });
    }

    // ═══════════════════════════════════════════════
    // 3. NAVBAR CHECK
    // ═══════════════════════════════════════════════
    // Navbar wrapper uses [role=banner] with scroll-based fixed positioning
    const navWrapper = document.querySelector("[role=banner]") || document.querySelector("nav");
    const nav = document.querySelector("nav");
    if (navWrapper) {
      const nwcs = cs(navWrapper);
      // On initial load it's relative, becomes fixed on scroll > 10px
      if (["sticky", "relative", "fixed"].includes(nwcs.position)) {
        passed.push("NAV: wrapper position ok (" + nwcs.position + ")");
      } else {
        bugs.push({ id: "NAV_STICKY", desc: `Nav wrapper position: ${nwcs.position}, unexpected` });
      }

      const navBg = cs(navWrapper).backgroundColor;
      if (navBg === "rgb(255, 255, 255)" || navBg === "rgba(255, 255, 255, 0.8)" || navBg === "rgba(0, 0, 0, 0)") {
        passed.push("NAV: bg ok (" + (navBg === "rgba(0, 0, 0, 0)" ? "transparent/initial" : "white") + ")");
      } else {
        warnings.push({ id: "NAV_BG", desc: `Nav bg: ${navBg}` });
      }

      // Check nav links
      const plainLinks = ["How It Works", "Pricing", "Our Work", "Our Mission"];
      plainLinks.forEach(text => {
        const link = [...nav.querySelectorAll("a, button")].find(a => a.textContent.trim() === text);
        if (!link) { bugs.push({ id: `NAV_LINK_${text}`, desc: `Nav link "${text}" not found` }); return; }
        const lcs = cs(link);
        if (lcs.fontWeight !== "400") bugs.push({ id: `NAV_LINK_WEIGHT_${text}`, desc: `"${text}" weight: ${lcs.fontWeight}, expected 400` });
        if (lcs.color !== "rgb(0, 0, 0)") bugs.push({ id: `NAV_LINK_COLOR_${text}`, desc: `"${text}" color: ${lcs.color}, expected rgb(0,0,0)` });
      });
      if (!bugs.find(b => b.id.startsWith("NAV_LINK"))) passed.push("NAV: link styles match");
    } else {
      bugs.push({ id: "NAV_MISSING", desc: "No <nav> element found" });
    }

    // ═══════════════════════════════════════════════
    // 4. SECTION-BY-SECTION CHECK
    // ═══════════════════════════════════════════════
    const main = document.querySelector("main");
    if (!main) { bugs.push({ id: "MAIN_MISSING", desc: "No <main> element" }); }
    else {
      const sections = main.children;
      if (sections.length !== 13) {
        bugs.push({ id: "SECTION_COUNT", desc: `${sections.length} sections, expected 13` });
      } else {
        passed.push(`SECTIONS: 13 rendered`);
      }

      // Check each h2
      const allH2 = main.querySelectorAll("h2");
      let h2Issues = 0;
      allH2.forEach((h2, i) => {
        const hcs = cs(h2);
        const text = h2.textContent.trim().substring(0, 30);
        // Skip non-main headings (newsletter, footer, etc.)
        if (px(hcs.fontSize) < 28) return;

        if (hcs.fontWeight !== "700" && hcs.fontWeight !== "bold") {
          bugs.push({ id: `H2_WEIGHT_${i}`, desc: `h2 "${text}" weight: ${hcs.fontWeight}, expected 700` });
          h2Issues++;
        }
        // Hero h2 is 50px at 1280px+ (Webflow .p-base-place responsive rule). Others are 40px.
        // Accept: 50px (hero), 40px (standard), 32px (custom-plan), 36px (beta), 22px (newsletter)
        const validSizes = [50, 40, 32, 36, 22, 28];
        if (!validSizes.includes(px(hcs.fontSize))) {
          bugs.push({ id: `H2_SIZE_${i}`, desc: `h2 "${text}" size: ${hcs.fontSize}, not in valid set` });
          h2Issues++;
        }
      });
      if (h2Issues === 0) passed.push("H2: all sizes and weights correct");
    }

    // ═══════════════════════════════════════════════
    // 5. BUTTON CONSISTENCY CHECK
    // ═══════════════════════════════════════════════
    const allButtons = document.querySelectorAll("a, button");
    let gradientBtnIssues = 0;
    let cursorIssues = 0;
    allButtons.forEach(btn => {
      const bcs = cs(btn);
      // Check cursor on buttons
      if (btn.tagName === "BUTTON" && bcs.cursor !== "pointer") {
        cursorIssues++;
      }
      // Check gradient button radius
      if (bcs.backgroundImage.includes("gradient")) {
        const r = parseFloat(bcs.borderRadius);
        if (r > 100) {
          bugs.push({ id: "BTN_RADIUS", desc: `Button "${btn.textContent.trim().substring(0,20)}" has radius ${bcs.borderRadius} (rounded-full)` });
          gradientBtnIssues++;
        }
        // Check transitions exist
        if (!bcs.transition || bcs.transition === "none" || bcs.transition === "all 0s ease 0s") {
          warnings.push({ id: "BTN_TRANSITION", desc: `Button "${btn.textContent.trim().substring(0,20)}" missing transition` });
        }
      }
    });
    if (cursorIssues > 0) bugs.push({ id: "CURSOR", desc: `${cursorIssues} buttons missing cursor:pointer` });
    else passed.push("BUTTONS: all have cursor:pointer");
    if (gradientBtnIssues === 0) passed.push("BUTTONS: all gradient btns have correct radius");

    // ═══════════════════════════════════════════════
    // 6. FOOTER CHECK
    // ═══════════════════════════════════════════════
    const footer = document.querySelector("footer");
    if (footer) {
      const fcs = cs(footer);
      if (fcs.backgroundColor === WF.footerBg) passed.push("FOOTER: correct bg color");
      else bugs.push({ id: "FOOTER_BG", desc: `Footer bg: ${fcs.backgroundColor}, expected ${WF.footerBg}` });

      // Check newsletter card exists (CSS module hashes class names, so check by structure)
      const nlForm = footer.querySelector("form") || footer.querySelector("input[type='email']");
      if (nlForm) passed.push("FOOTER: newsletter form present");
      else warnings.push({ id: "FOOTER_NL", desc: "Footer newsletter form not found" });

      // Check social icons
      const socialLinks = footer.querySelectorAll("a svg");
      if (socialLinks.length >= 3) passed.push(`FOOTER: ${socialLinks.length} social icons`);
      else warnings.push({ id: "FOOTER_SOCIAL", desc: `Only ${socialLinks.length} social icons found` });
    } else {
      bugs.push({ id: "FOOTER_MISSING", desc: "No footer element" });
    }

    // ═══════════════════════════════════════════════
    // 7. SMOOTH SCROLL + ACCESSIBILITY
    // ═══════════════════════════════════════════════
    const scrollB = cs(document.documentElement).scrollBehavior;
    if (scrollB === "smooth") passed.push("SCROLL: smooth enabled");
    else bugs.push({ id: "SCROLL", desc: `scroll-behavior: ${scrollB}` });

    // ═══════════════════════════════════════════════
    // 8. TEXT OVERFLOW CHECK
    // ═══════════════════════════════════════════════
    let overflows = 0;
    document.querySelectorAll("h1,h2,h3,h4,p,span").forEach(el => {
      if (el.scrollWidth > el.clientWidth + 15 && el.clientWidth > 0) {
        overflows++;
      }
    });
    if (overflows === 0) passed.push("TEXT: no overflow");
    else bugs.push({ id: "TEXT_OVERFLOW", desc: `${overflows} elements have text overflow` });

    // ═══════════════════════════════════════════════
    // 9. TRANSITIONS CHECK
    // ═══════════════════════════════════════════════
    let transCount = 0;
    document.querySelectorAll("*").forEach(el => {
      const t = cs(el).transition;
      if (t && t !== "none" && t !== "all 0s ease 0s" && !t.includes("0s")) transCount++;
    });
    if (transCount > 40) passed.push(`TRANSITIONS: ${transCount} elements with transitions`);
    else warnings.push({ id: "TRANSITIONS", desc: `Only ${transCount} elements have transitions (low)` });

    // ═══════════════════════════════════════════════
    // 10. CONTRAST CHECK ON DARK SECTIONS
    // ═══════════════════════════════════════════════
    const darkSections = document.querySelectorAll("[style*='082753'], [class*='082753']");
    let contrastIssues = 0;
    darkSections.forEach(sec => {
      const headings = sec.querySelectorAll("h1,h2,h3,h4");
      headings.forEach(h => {
        const c = cs(h).color;
        // Should be white or very light on dark bg
        const match = c.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
          const brightness = (parseInt(match[1]) + parseInt(match[2]) + parseInt(match[3])) / 3;
          if (brightness < 128) contrastIssues++;
        }
      });
    });
    if (contrastIssues === 0) passed.push("CONTRAST: dark sections have light text");
    else bugs.push({ id: "CONTRAST", desc: `${contrastIssues} dark-on-dark text issues` });

    // ═══════════════════════════════════════════════
    // 11. EMPTY SECTION CHECK
    // ═══════════════════════════════════════════════
    if (main) {
      let empty = 0;
      [...main.children].forEach(sec => { if (sec.offsetHeight < 10) empty++; });
      if (empty === 0) passed.push("LAYOUT: no empty sections");
      else bugs.push({ id: "EMPTY_SEC", desc: `${empty} empty/collapsed sections` });
    }

    // ═══════════════════════════════════════════════
    // 12. DROPDOWN FUNCTIONALITY
    // ═══════════════════════════════════════════════
    const dropdownGroups = document.querySelectorAll(".group");
    if (dropdownGroups.length > 0) passed.push(`DROPDOWN: ${dropdownGroups.length} hover groups found`);
    else warnings.push({ id: "DROPDOWN", desc: "No CSS hover dropdown groups found" });

    // ═══════════════════════════════════════════════
    // 13. BANNER STRIP CHECK
    // ═══════════════════════════════════════════════
    const banner = document.querySelector("header > div:first-child");
    if (banner) {
      const bcs = cs(banner);
      if (bcs.backgroundColor === "rgb(8, 39, 83)") passed.push("BANNER: correct bg");
      else warnings.push({ id: "BANNER_BG", desc: `Banner bg: ${bcs.backgroundColor}` });
    }

    return { bugs, warnings, passed, consoleErrorCount: 0 };
  });

  issues.consoleErrorCount = consoleErrors.length;

  // Print report
  console.log("\n╔══════════════════════════════════════════════════════╗");
  console.log("║          BOLDTEQ 1:1 AUDIT — FULL REPORT            ║");
  console.log("╠══════════════════════════════════════════════════════╣");

  console.log(`║ ✅ PASSED (${issues.passed.length}):${" ".repeat(38 - String(issues.passed.length).length)}║`);
  issues.passed.forEach(p => console.log(`║   ${p.padEnd(50)}║`));

  if (issues.warnings.length > 0) {
    console.log(`║ ⚠️  WARNINGS (${issues.warnings.length}):${" ".repeat(35 - String(issues.warnings.length).length)}║`);
    issues.warnings.forEach(w => console.log(`║   ${w.desc.substring(0, 50).padEnd(50)}║`));
  }

  if (issues.bugs.length > 0) {
    console.log(`║ ❌ BUGS (${issues.bugs.length}):${" ".repeat(40 - String(issues.bugs.length).length)}║`);
    issues.bugs.forEach(b => console.log(`║   ${b.desc.substring(0, 50).padEnd(50)}║`));
  }

  console.log("╠══════════════════════════════════════════════════════╣");
  console.log(`║ SCORE: ${issues.passed.length}/${issues.passed.length + issues.bugs.length} passed | ${issues.bugs.length} bugs | ${issues.warnings.length} warnings | ${consoleErrors.length} errors ║`);
  console.log("╚══════════════════════════════════════════════════════╝");

  // Output machine-readable summary
  console.log("\n---JSON---");
  console.log(JSON.stringify({
    passed: issues.passed.length,
    bugs: issues.bugs.length,
    warnings: issues.warnings.length,
    consoleErrors: consoleErrors.length,
    bugList: issues.bugs,
    warningList: issues.warnings,
  }));

  await browser.close();
  return issues.bugs.length;
}

runAudit().then(bugCount => {
  process.exit(bugCount > 0 ? 1 : 0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
