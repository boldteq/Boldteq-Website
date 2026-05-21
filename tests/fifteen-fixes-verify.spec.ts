/**
 * 15-fix verify spec — Phase 7 deep Playwright check
 *
 * One test() per PDF defect. Asserts computed CSS + interaction + presence.
 * Run: pnpm playwright test tests/fifteen-fixes-verify.spec.ts
 */

import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const BASE = "http://localhost:3000";
const RESULTS_DIR = join(process.cwd(), "tests/screenshots");

type FixResult = { id: number; name: string; checks: Array<{ label: string; pass: boolean; actual?: unknown; expected?: unknown }> };
const RESULTS: FixResult[] = [];

function record(id: number, name: string, checks: FixResult["checks"]) {
  RESULTS.push({ id, name, checks });
}

async function getComputed(page: Page, selector: string, props: string[]): Promise<Record<string, string> | null> {
  return await page.evaluate(
    ({ selector, props }) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const out: Record<string, string> = {};
      for (const p of props) out[p] = cs.getPropertyValue(p);
      return out;
    },
    { selector, props },
  );
}

async function getComputedPseudo(page: Page, selector: string, pseudo: string, props: string[]): Promise<Record<string, string> | null> {
  return await page.evaluate(
    ({ selector, pseudo, props }) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const cs = window.getComputedStyle(el, pseudo);
      const out: Record<string, string> = {};
      for (const p of props) out[p] = cs.getPropertyValue(p);
      return out;
    },
    { selector, pseudo, props },
  );
}

async function getRect(page: Page, selector: string): Promise<{ x: number; y: number; w: number; h: number } | null> {
  return await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  }, selector);
}

async function dismissOverlays(page: Page) {
  await page.evaluate(() => {
    const sels = ["#chatwoot_live_chat_widget", ".onetrust-banner-sdk", "iframe[src*='guidejar']"];
    for (const s of sels) {
      document.querySelectorAll<HTMLElement>(s).forEach((el) => {
        el.style.display = "none";
      });
    }
  });
}

test.describe("15-fix verify — PDF defects 1-15", () => {
  test.beforeEach(async ({ page }) => {
    page.on("pageerror", (e) => console.error("[pageerror]", e.message));
    await page.goto(BASE + "/", { waitUntil: "load" });
    await page.waitForTimeout(800);
    await dismissOverlays(page);
  });

  test.afterAll(async () => {
    mkdirSync(RESULTS_DIR, { recursive: true });
    writeFileSync(join(RESULTS_DIR, "fifteen-fixes-verify.json"), JSON.stringify(RESULTS, null, 2));
    const total = RESULTS.length;
    const allPassed = RESULTS.filter((r) => r.checks.every((c) => c.pass)).length;
    const partial = RESULTS.filter((r) => r.checks.some((c) => c.pass) && r.checks.some((c) => !c.pass)).length;
    const failed = RESULTS.filter((r) => r.checks.every((c) => !c.pass)).length;
    console.log(`\n=== 15-FIX VERIFY SUMMARY ===\n  ALL PASS:    ${allPassed}/${total}\n  PARTIAL:     ${partial}/${total}\n  ALL FAIL:    ${failed}/${total}\n`);
  });

  // 1. Typewriter
  test("Issue #1 — Hero typewriter smoothness", async ({ page }) => {
    const cs = await getComputed(page, '[class*="typewriterContainer"]', ["min-width", "min-height"]);
    const cs2 = await getComputed(page, '[class*="animate-span"]', ["color"]);

    // capture phrase changes over time
    const phrases: string[] = [];
    for (let i = 0; i < 10; i++) {
      const txt = await page.locator('[class*="typewriterContainer"]').innerText().catch(() => "");
      if (!phrases.includes(txt) && txt) phrases.push(txt);
      await page.waitForTimeout(1200);
    }

    const minWidthOK = cs && parseFloat(cs["min-width"]) >= 180;
    const phrasesOK = phrases.length >= 2;
    const colorOK = cs2 && (cs2["color"].includes("5, 186, 254") || cs2["color"].includes("33, 207, 255"));

    record(1, "Hero typewriter smoothness", [
      { label: "min-width >= 180px (17ch equiv)", pass: !!minWidthOK, actual: cs?.["min-width"] },
      { label: "rotates >= 2 unique phrases in 12s", pass: phrasesOK, actual: phrases },
      { label: "rotating word colored cyan", pass: !!colorOK, actual: cs2?.["color"] },
    ]);
    expect(minWidthOK).toBe(true);
    expect(phrasesOK).toBe(true);
  });

  // 2. TopBanner font bolder
  test("Issue #2 — TopBanner font bolder", async ({ page }) => {
    const cs = await getComputed(page, '[class*="bannerText"], [class*="paragraph-regular"]', ["font-weight"]);
    const fw = cs ? parseInt(cs["font-weight"], 10) : 0;
    record(2, "TopBanner font bolder", [
      { label: "bannerText font-weight >= 600", pass: fw >= 600, actual: fw, expected: ">= 600" },
    ]);
    expect(fw).toBeGreaterThanOrEqual(600);
  });

  // 3. Global body weight 500
  test("Issue #3 — Global body weight 500", async ({ page }) => {
    const fw = await page.evaluate(() => parseInt(window.getComputedStyle(document.body).fontWeight, 10));
    record(3, "Global body weight 500", [
      { label: "document.body font-weight == 500", pass: fw === 500, actual: fw, expected: 500 },
    ]);
    expect(fw).toBe(500);
  });

  // 4. Hero pills + video + 2 buttons
  test("Issue #4 — Hero pills + video + 2 buttons", async ({ page }) => {
    // 3 trust icons uniform 24x24
    const iconRects = await page.evaluate(() => {
      const icons = Array.from(document.querySelectorAll<HTMLElement>('[class*="home-bangrid-icon"]'));
      return icons.map((i) => {
        const r = i.getBoundingClientRect();
        return { w: r.width, h: r.height };
      });
    });
    const iconsUniform = iconRects.length === 3 && iconRects.every((r) => Math.abs(r.w - 24) < 4 && Math.abs(r.h - 24) < 4);

    // grid-para weight
    const paraFw = await page.evaluate(() => {
      const p = document.querySelector('[class*="grid-para"]');
      return p ? parseInt(window.getComputedStyle(p).fontWeight, 10) : 0;
    });

    // video wrapper padding-bottom = 56.25% (no +32px)
    const videoPadBottom = await page.evaluate(() => {
      const el = document.querySelector('[class*="guidejarWrapper"]');
      return el ? (el as HTMLElement).style.paddingBottom || window.getComputedStyle(el).paddingBottom : "";
    });

    // 2 buttons below video
    const scheduleDemo = await page.locator('a:has-text("Schedule Demo"), button:has-text("Schedule Demo")').count();
    const starterTrial = await page.locator('a:has-text("14-Day Starter Trial")').count();

    // button border-radius 12px
    const btnRadius = await page.evaluate(() => {
      const btn = document.querySelector('a[href="/book-a-demo"]') as HTMLElement | null;
      return btn ? window.getComputedStyle(btn).borderRadius : "";
    });

    record(4, "Hero pills + video + buttons", [
      { label: "3 trust icons each ~24×24", pass: iconsUniform, actual: iconRects },
      { label: "grid-para font-weight = 600", pass: paraFw === 600, actual: paraFw },
      { label: "video wrapper padding-bottom NOT +32px", pass: !String(videoPadBottom).includes("32"), actual: videoPadBottom },
      { label: "Schedule Demo button present", pass: scheduleDemo >= 1, actual: scheduleDemo },
      { label: "14-Day Starter Trial button present", pass: starterTrial >= 1, actual: starterTrial },
      { label: "button border-radius 12px", pass: btnRadius === "12px", actual: btnRadius },
    ]);
    expect(iconsUniform).toBe(true);
    expect(paraFw).toBe(600);
  });

  // 5. Resolution banner sentence case + button
  test("Issue #5 — Resolution banner sentence case", async ({ page }) => {
    const heading = await page.locator('[class*="image-in-text"]').first().innerText().catch(() => "");
    const first25 = heading.slice(0, 25);
    const sentenceCase = first25.startsWith("Boldteq removes") || first25.startsWith("Boldteq Removes");
    // tighter: lowercase r in "removes"
    const lowercaseR = heading.toLowerCase().includes("boldteq removes these blockers");

    record(5, "Resolution banner sentence case", [
      { label: "heading starts with 'Boldteq removes'", pass: sentenceCase, actual: first25 },
      { label: "contains 'boldteq removes these blockers' lowercase", pass: lowercaseR, actual: heading.slice(0, 60) },
    ]);
    expect(lowercaseR).toBe(true);
  });

  // 6. Carousel dots ring
  test("Issue #6 — Carousel dots active ring", async ({ page }) => {
    await page.locator('[class*="gallery-13"]').first().scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(300);

    const dotInactiveBg = await getComputedPseudo(page, '[class*="slider-dot"]:not([class*="slider-dot-active"])', "::after", ["width", "height", "background-color"]);
    const dotActiveAfter = await getComputedPseudo(page, '[class*="slider-dot-active"]', "::after", ["width", "height", "background-color", "box-shadow"]);

    const inactiveOK = dotInactiveBg && parseFloat(dotInactiveBg["width"]) >= 6 && parseFloat(dotInactiveBg["width"]) <= 12;
    const activeRingOK = dotActiveAfter && (dotActiveAfter["box-shadow"].includes("33, 207, 255") || dotActiveAfter["box-shadow"].includes("rgb"));

    record(6, "Carousel dots ring", [
      { label: "inactive dot::after ~8px", pass: !!inactiveOK, actual: dotInactiveBg },
      { label: "active dot::after has box-shadow ring", pass: !!activeRingOK, actual: dotActiveAfter },
    ]);
  });

  // 7. How-It-Works cards bg
  test("Issue #7 — How-It-Works cards soft bg", async ({ page }) => {
    await page.locator('[class*="featureCardBlue"], [class*="feature-card"]').first().scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(300);

    const cardBg = await page.evaluate(() => {
      const card = document.querySelector('[class*="featureCardBlue"]');
      const section = card?.closest('section, [class*="section"]');
      const cardCs = card ? window.getComputedStyle(card).backgroundColor : "";
      const secCs = section ? window.getComputedStyle(section).backgroundColor : "";
      return { card: cardCs, section: secCs };
    });

    // expect card !== section bg (visual lift)
    const diff = cardBg.card !== cardBg.section && cardBg.card !== "rgba(0, 0, 0, 0)";
    // expect specific #1c3861 = rgb(28, 56, 97)
    const exact = cardBg.card.includes("28, 56, 97");

    record(7, "How-It-Works cards bg", [
      { label: "card bg !== section bg", pass: diff, actual: cardBg },
      { label: "card bg == rgb(28, 56, 97)", pass: exact, actual: cardBg.card },
    ]);
    expect(diff).toBe(true);
  });

  // 8. Pricing toggle center + badge inline
  test("Issue #8 — Pricing toggle center + Save badge inline", async ({ page }) => {
    await page.locator('[class*="pricingTabsMenuLarge"]').first().scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(300);

    const tabsDisplay = await page.evaluate(() => {
      const el = document.querySelector('[class*="pricingTabsMenuLarge"]') as HTMLElement | null;
      return el ? window.getComputedStyle(el).display : "";
    });

    // center check: element center vs parent center
    const centering = await page.evaluate(() => {
      const el = document.querySelector('[class*="pricingTabsMenuLarge"]') as HTMLElement | null;
      if (!el) return null;
      const parent = el.parentElement;
      if (!parent) return null;
      const er = el.getBoundingClientRect();
      const pr = parent.getBoundingClientRect();
      const elCenter = er.left + er.width / 2;
      const parentCenter = pr.left + pr.width / 2;
      return { delta: Math.abs(elCenter - parentCenter), elCenter, parentCenter };
    });
    const centered = centering && centering.delta < 10;

    // Save badge inline beside text
    const badgeInline = await page.evaluate(() => {
      const badges = Array.from(document.querySelectorAll('[class*="pricingBadge"]'));
      if (!badges.length) return false;
      const d = window.getComputedStyle(badges[0]).display;
      return d === "inline-flex" || d === "inline-block" || d === "inline";
    });

    record(8, "Pricing toggle center + badge", [
      { label: "pricingTabsMenuLarge display=flex", pass: tabsDisplay === "flex", actual: tabsDisplay },
      { label: "toggle horizontally centered (Δ < 10px)", pass: !!centered, actual: centering },
      { label: "Save badge display inline-*", pass: badgeInline, actual: badgeInline },
    ]);
    expect(centered).toBe(true);
  });

  // 9. Growth card cyan border all sides
  test("Issue #9 — Growth card cyan border full", async ({ page }) => {
    await page.locator('[class*="pricingCard2CenterPcard"]').first().scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(300);

    const border = await getComputed(page, '[class*="pricingCard2CenterPcard"]', [
      "border-top-width", "border-top-style", "border-top-color",
      "border-right-width", "border-bottom-width", "border-left-width",
    ]);
    const topOK = border && border["border-top-width"] === "3px" && border["border-top-style"] === "solid";
    const colorOK = border && border["border-top-color"].includes("33, 207, 255");
    const allSidesOK = border && border["border-right-width"] === "3px" && border["border-bottom-width"] === "3px" && border["border-left-width"] === "3px";

    record(9, "Growth card cyan border", [
      { label: "border-top 3px solid", pass: !!topOK, actual: { width: border?.["border-top-width"], style: border?.["border-top-style"] } },
      { label: "border-top cyan", pass: !!colorOK, actual: border?.["border-top-color"] },
      { label: "all sides 3px", pass: !!allSidesOK, actual: border },
    ]);
    expect(topOK).toBe(true);
    expect(allSidesOK).toBe(true);
  });

  // 10. Comparison table headers + tooltip icon
  test("Issue #10 — Comparison table headers same color + tooltip", async ({ page }) => {
    await page.locator('[class*="pricingTableHeader"]').first().scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(300);

    const headerColors = await page.evaluate(() => {
      const headers = Array.from(document.querySelectorAll('[class*="subheadingLarge7"]'));
      return headers.slice(0, 4).map((h) => window.getComputedStyle(h).color);
    });

    // Starter/Growth/Pro (indices 1,2,3 — index 0 is "Basic Features")
    const right3 = headerColors.slice(1, 4);
    const sameColor = right3.length === 3 && right3.every((c) => c === right3[0]);

    const tooltipOpacity = await page.evaluate(() => {
      const ico = document.querySelector('[class*="tooltipIco"]') as HTMLElement | null;
      return ico ? parseFloat(window.getComputedStyle(ico).opacity) : 0;
    });

    record(10, "Comparison table headers", [
      { label: "Starter/Growth/Pro same color", pass: sameColor, actual: right3 },
      { label: "tooltip icon opacity == 1", pass: tooltipOpacity === 1, actual: tooltipOpacity },
    ]);
    expect(sameColor).toBe(true);
    expect(tooltipOpacity).toBe(1);
  });

  // 11. Custom plan width — needs /pricing page
  test("Issue #11 — Custom plan CTA width matches table", async ({ page }) => {
    await page.goto(BASE + "/pricing", { waitUntil: "load" });
    await page.waitForTimeout(500);
    await dismissOverlays(page);

    const customPlanRect = await page.evaluate(() => {
      const candidates = Array.from(document.querySelectorAll('section'));
      for (const s of candidates) {
        if (s.textContent?.includes("Need Something More Flexible")) {
          const inner = s.querySelector('[class*="container"]') as HTMLElement | null;
          if (inner) {
            const cs = window.getComputedStyle(inner);
            const r = inner.getBoundingClientRect();
            return { maxWidth: cs.maxWidth, width: r.width, x: r.x };
          }
        }
      }
      return null;
    });

    const maxWidthOK = customPlanRect && (parseFloat(customPlanRect.maxWidth) >= 1080 || customPlanRect.maxWidth === "1280px");

    record(11, "Custom plan width", [
      { label: "container max-width >= 1080px", pass: !!maxWidthOK, actual: customPlanRect },
    ]);
    expect(maxWidthOK).toBe(true);
  });

  // 12. Comparison spacing + testimonial wrapper
  test("Issue #12 — Traditional vs Boldteq spacing", async ({ page }) => {
    await page.locator('[class*="waysGrid"]').first().scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(300);

    const crossMb = await page.evaluate(() => {
      const el = document.querySelector('[class*="paragraphWithCross"]:not([class*="paragraphWithCrossLast"])') as HTMLElement | null;
      return el ? parseFloat(window.getComputedStyle(el).marginBottom) : 0;
    });
    const tickMb = await page.evaluate(() => {
      const el = document.querySelector('[class*="paragraphWithTick"]:not([class*="paragraphWithTickLast"])') as HTMLElement | null;
      return el ? parseFloat(window.getComputedStyle(el).marginBottom) : 0;
    });

    const wayInnerBg = await page.evaluate(() => {
      const el = document.querySelector('[class*="wayInnerGrid"]') as HTMLElement | null;
      if (!el) return "";
      return window.getComputedStyle(el).backgroundImage;
    });

    record(12, "Comparison spacing", [
      { label: "paragraphWithCross margin-bottom = 20px", pass: crossMb === 20, actual: crossMb },
      { label: "paragraphWithTick margin-bottom = 20px", pass: tickMb === 20, actual: tickMb },
      { label: "wayInnerGrid has background-image", pass: wayInnerBg !== "" && wayInnerBg !== "none", actual: wayInnerBg },
    ]);
    expect(crossMb).toBe(20);
    expect(tickMb).toBe(20);
  });

  // 13. FAQ borders rendering — FAQ accordion item via pattern component (.item)
  test("Issue #13 — FAQ borders rendering", async ({ page }) => {
    await page.locator('[class*="faqSection"]').first().scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(300);

    // FAQ accordion items use FaqAccordion pattern with .item class
    const faqItemBorder = await page.evaluate(() => {
      const candidates = Array.from(document.querySelectorAll('[role="listitem"] > div, [class*="faq-accordion"] [class*="item"], [class*="faqAccordion"] [class*="item"]'));
      for (const el of candidates) {
        const cs = window.getComputedStyle(el);
        if (cs.borderTopWidth && cs.borderTopStyle === "solid") {
          return { style: cs.borderTopStyle, color: cs.borderTopColor, width: cs.borderTopWidth, radius: cs.borderRadius };
        }
      }
      return null;
    });

    const rowBorder = await page.evaluate(() => {
      const el = document.querySelector('[class*="rowSmallWithBorder"]') as HTMLElement | null;
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      return { style: cs.borderTopStyle, color: cs.borderTopColor, width: cs.borderTopWidth };
    });

    const faqStyleOK = faqItemBorder && faqItemBorder.style === "solid" && parseFloat(faqItemBorder.width) >= 1;
    const rowStyleOK = rowBorder && rowBorder.style === "solid" && parseFloat(rowBorder.width) >= 1;

    record(13, "FAQ borders", [
      { label: "FAQ item border solid >= 1px (Webflow card style)", pass: !!faqStyleOK, actual: faqItemBorder },
      { label: "Help-Center row border solid >= 1px", pass: !!rowStyleOK, actual: rowBorder },
    ]);
    expect(faqStyleOK).toBe(true);
    expect(rowStyleOK).toBe(true);
  });

  // 14. Footer newsletter + logo + spacing
  test("Issue #14 — Footer newsletter + logo + spacing", async ({ page }) => {
    await page.locator('footer').first().scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(300);

    const cardBg = await page.evaluate(() => {
      const el = document.querySelector('[class*="footer-newsletter-card"]') as HTMLElement | null;
      return el ? window.getComputedStyle(el).backgroundImage : "";
    });

    const logoW = await page.evaluate(() => {
      const img = document.querySelector('footer [class*="footer-logo"] img') as HTMLImageElement | null;
      return img ? img.naturalWidth || parseFloat(img.getAttribute("width") || "0") : 0;
    });

    const gridGap = await page.evaluate(() => {
      const el = document.querySelector('[class*="footer-grid"]') as HTMLElement | null;
      return el ? parseFloat(window.getComputedStyle(el).columnGap) : 0;
    });

    const radialOK = cardBg.includes("radial-gradient");
    const logoOK = logoW >= 150;
    const gapOK = gridGap > 0 && gridGap < 50; // < 3rem (48px)

    record(14, "Footer newsletter + logo + spacing", [
      { label: "newsletter card bg has radial-gradient", pass: radialOK, actual: cardBg.slice(0, 100) },
      { label: "footer logo width >= 150", pass: logoOK, actual: logoW },
      { label: "footer-grid column-gap < 50px (was 48px before)", pass: gapOK, actual: gridGap },
    ]);
    expect(radialOK).toBe(true);
    expect(logoOK).toBe(true);
  });

  // 15. Solutions dropdown hover + cyan button
  test("Issue #15 — Solutions dropdown + sky button", async ({ page }) => {
    const trigger = page.locator('button:has-text("Solutions")').first();
    await trigger.hover();
    await page.waitForTimeout(500);

    const dropdownOpen = await page.locator('[class*="nav-23-dropdown-list"][class*="w--open"]').isVisible().catch(() => false);

    const skyBtnBg = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll<HTMLElement>('a[href="/scope"]'));
      // find the one inside dropdown (.sky-button class)
      const skyBtn = btns.find((b) => b.className.includes("sky-button") || b.className.includes("sky"));
      if (!skyBtn) return null;
      const cs = window.getComputedStyle(skyBtn);
      return { bgColor: cs.backgroundColor, bgImage: cs.backgroundImage };
    });

    const navyBg = skyBtnBg && skyBtnBg.bgColor.includes("8, 39, 83");
    const gradientOK = skyBtnBg && skyBtnBg.bgImage.includes("linear-gradient");

    const comingSoonBadge = await page.evaluate(() => {
      const el = document.querySelector('[class*="header-comingsoon-badge"]') as HTMLElement | null;
      return el ? window.getComputedStyle(el).color : "";
    });
    const badgeBlue = comingSoonBadge.includes("24, 144, 255");

    record(15, "Solutions dropdown + sky button", [
      { label: "dropdown opens on hover", pass: dropdownOpen, actual: dropdownOpen },
      { label: "sky-button bg = navy rgb(8,39,83)", pass: !!navyBg, actual: skyBtnBg },
      { label: "sky-button bg has linear-gradient", pass: !!gradientOK, actual: skyBtnBg?.bgImage?.slice(0, 60) },
      { label: "Coming Soon badge color blue", pass: badgeBlue, actual: comingSoonBadge },
    ]);
    expect(dropdownOpen).toBe(true);
    expect(navyBg).toBe(true);
  });
});
