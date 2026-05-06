import { chromium } from "@playwright/test";
import { writeFileSync } from "fs";

const LIVE = "https://boldteq.com/our-works";
const LOCAL = "http://localhost:3001/our-works";

async function capture(page, url, prefix) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(4000);

  // Full page screenshot
  await page.screenshot({
    path: `tests/${prefix}-full.png`,
    fullPage: true,
  });

  // Hero section
  const hero = await page.$("section").catch(() => null);
  if (hero) {
    await hero.screenshot({ path: `tests/${prefix}-hero.png` });
  }

  // Get page dimensions and content info
  const info = await page.evaluate(() => {
    const body = document.body;
    const sections = document.querySelectorAll("section");
    const cards = document.querySelectorAll(
      '[class*="card"], [class*="content_card"], [class*="cms-item"], [class*="portfolioCard"], article'
    );
    const sidebar = document.querySelector(
      '[class*="filter_column"], [class*="sidebar"], aside'
    );
    const filterHeader = document.querySelector(
      '[class*="filter_header"], [class*="filterHeader"]'
    );
    const pagination = document.querySelector(
      '[class*="pagination"], #custom-pagination'
    );
    const popup = document.querySelector(
      '[class*="global-popup"], [class*="popup"], [role="dialog"]'
    );

    // Get all text content from cards
    const cardTexts = [];
    cards.forEach((c) => {
      const rect = c.getBoundingClientRect();
      cardTexts.push({
        text: c.textContent?.trim().substring(0, 100),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        tag: c.tagName,
        classes: c.className?.substring?.(0, 100) || "",
      });
    });

    // Get sidebar info
    const sidebarInfo = sidebar
      ? {
          width: Math.round(sidebar.getBoundingClientRect().width),
          height: Math.round(sidebar.getBoundingClientRect().height),
          text: sidebar.textContent?.trim().substring(0, 500),
        }
      : null;

    // Get filter header info
    const filterHeaderInfo = filterHeader
      ? {
          width: Math.round(filterHeader.getBoundingClientRect().width),
          height: Math.round(filterHeader.getBoundingClientRect().height),
          display: getComputedStyle(filterHeader).display,
          gridCols: getComputedStyle(filterHeader).gridTemplateColumns,
        }
      : null;

    // Get grid layout
    const gridEl = document.querySelector(
      '[class*="cardGrid"], [class*="collection-list"], [class*="content_collection"]'
    );
    const gridInfo = gridEl
      ? {
          display: getComputedStyle(gridEl).display,
          gridCols: getComputedStyle(gridEl).gridTemplateColumns,
          gap: getComputedStyle(gridEl).gap,
          childCount: gridEl.children.length,
        }
      : null;

    // Get pagination info
    const paginationInfo = pagination
      ? {
          display: getComputedStyle(pagination).display,
          childCount: pagination.children.length,
          text: pagination.textContent?.trim(),
        }
      : null;

    return {
      bodyWidth: body.scrollWidth,
      bodyHeight: body.scrollHeight,
      sectionCount: sections.length,
      cardCount: cards.length,
      cards: cardTexts.slice(0, 10),
      sidebar: sidebarInfo,
      filterHeader: filterHeaderInfo,
      grid: gridInfo,
      pagination: paginationInfo,
      hasPopup: !!popup,
    };
  });

  return info;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  console.log("=== Capturing LIVE (boldteq.com) ===");
  const livePage = await context.newPage();
  const liveInfo = await capture(livePage, LIVE, "live");

  console.log("=== Capturing LOCAL (localhost:3001) ===");
  const localPage = await context.newPage();
  const localInfo = await capture(localPage, LOCAL, "local");

  // Compare
  console.log("\n========== COMPARISON ==========\n");

  console.log("--- Page Dimensions ---");
  console.log(`LIVE:  ${liveInfo.bodyWidth}x${liveInfo.bodyHeight}`);
  console.log(`LOCAL: ${localInfo.bodyWidth}x${localInfo.bodyHeight}`);

  console.log("\n--- Section Count ---");
  console.log(`LIVE:  ${liveInfo.sectionCount} sections`);
  console.log(`LOCAL: ${localInfo.sectionCount} sections`);

  console.log("\n--- Card Count ---");
  console.log(`LIVE:  ${liveInfo.cardCount} cards`);
  console.log(`LOCAL: ${localInfo.cardCount} cards`);

  console.log("\n--- Sidebar ---");
  console.log(`LIVE:  ${JSON.stringify(liveInfo.sidebar, null, 2)}`);
  console.log(`LOCAL: ${JSON.stringify(localInfo.sidebar, null, 2)}`);

  console.log("\n--- Filter Header ---");
  console.log(`LIVE:  ${JSON.stringify(liveInfo.filterHeader, null, 2)}`);
  console.log(`LOCAL: ${JSON.stringify(localInfo.filterHeader, null, 2)}`);

  console.log("\n--- Grid Layout ---");
  console.log(`LIVE:  ${JSON.stringify(liveInfo.grid, null, 2)}`);
  console.log(`LOCAL: ${JSON.stringify(localInfo.grid, null, 2)}`);

  console.log("\n--- Pagination ---");
  console.log(`LIVE:  ${JSON.stringify(liveInfo.pagination, null, 2)}`);
  console.log(`LOCAL: ${JSON.stringify(localInfo.pagination, null, 2)}`);

  console.log("\n--- Card Details (first 5) ---");
  for (let i = 0; i < Math.max(liveInfo.cards.length, localInfo.cards.length, 5); i++) {
    const lc = liveInfo.cards[i];
    const rc = localInfo.cards[i];
    if (lc || rc) {
      console.log(`\nCard ${i}:`);
      if (lc) console.log(`  LIVE:  ${lc.width}x${lc.height} tag=${lc.tag} text="${lc.text?.substring(0,60)}"`);
      if (rc) console.log(`  LOCAL: ${rc.width}x${rc.height} tag=${rc.tag} text="${rc.text?.substring(0,60)}"`);
    }
  }

  // Also capture a click interaction on local
  console.log("\n--- Testing Popup (LOCAL) ---");
  try {
    const firstCard = await localPage.$("article");
    if (firstCard) {
      await firstCard.click();
      await localPage.waitForTimeout(500);
      const popupVisible = await localPage.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        return dialog ? { visible: true, width: dialog.getBoundingClientRect().width, height: dialog.getBoundingClientRect().height } : { visible: false };
      });
      console.log(`Popup after click: ${JSON.stringify(popupVisible)}`);
      await localPage.screenshot({ path: "tests/local-popup.png", fullPage: false });
    }
  } catch (e) {
    console.log(`Popup test error: ${e.message}`);
  }

  // Capture live page card structure more deeply
  console.log("\n--- Live Page Deep Card Analysis ---");
  const liveCardDetails = await livePage.evaluate(() => {
    const items = document.querySelectorAll('.work-cms-item, [class*="content_card"]');
    const details = [];
    items.forEach((item, i) => {
      if (i >= 3) return;
      const rect = item.getBoundingClientRect();
      const img = item.querySelector('img[class*="card-image"]');
      const badge = item.querySelector('[class*="category-name"]');
      const eyeIcon = item.querySelector('[class*="eye-icon"]');
      const infoBlock = item.querySelector('[class*="card-block"]');
      details.push({
        totalWidth: Math.round(rect.width),
        totalHeight: Math.round(rect.height),
        hasImage: !!img,
        imageHeight: img ? Math.round(img.getBoundingClientRect().height) : 0,
        hasBadge: !!badge,
        badgeText: badge?.textContent?.trim() || "",
        hasEyeIcon: !!eyeIcon,
        infoBlockVisible: infoBlock ? getComputedStyle(infoBlock).display !== "none" : false,
        styles: {
          bg: getComputedStyle(item).backgroundColor,
          borderRadius: getComputedStyle(item).borderRadius,
          padding: getComputedStyle(item).padding,
          boxShadow: getComputedStyle(item).boxShadow?.substring(0, 80),
        }
      });
    });
    return details;
  });
  console.log(JSON.stringify(liveCardDetails, null, 2));

  // Local card analysis
  console.log("\n--- Local Page Deep Card Analysis ---");
  const localCardDetails = await localPage.evaluate(() => {
    // Close popup first
    const dialog = document.querySelector('[role="dialog"]');
    if (dialog) {
      const closeBtn = dialog.querySelector('button');
      if (closeBtn) closeBtn.click();
    }

    const items = document.querySelectorAll('article');
    const details = [];
    items.forEach((item, i) => {
      if (i >= 3) return;
      const rect = item.getBoundingClientRect();
      const imgs = item.querySelectorAll('img');
      const mainImg = imgs[0];
      const badge = item.querySelector('[class*="categoryBadge"], [class*="category"]');
      const eyeIcon = item.querySelector('[class*="eyeIcon"], [class*="eye"]');
      details.push({
        totalWidth: Math.round(rect.width),
        totalHeight: Math.round(rect.height),
        imgCount: imgs.length,
        mainImgHeight: mainImg ? Math.round(mainImg.getBoundingClientRect().height) : 0,
        hasBadge: !!badge,
        badgeText: badge?.textContent?.trim() || "",
        hasEyeIcon: !!eyeIcon,
        styles: {
          bg: getComputedStyle(item).backgroundColor,
          borderRadius: getComputedStyle(item).borderRadius,
          padding: getComputedStyle(item).padding,
          boxShadow: getComputedStyle(item).boxShadow?.substring(0, 80),
          minHeight: getComputedStyle(item).minHeight,
        }
      });
    });
    return details;
  });
  console.log(JSON.stringify(localCardDetails, null, 2));

  await browser.close();
  console.log("\n✅ Screenshots saved to tests/ folder");
}

main().catch(console.error);
