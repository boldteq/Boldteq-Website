import { chromium } from "@playwright/test";

const LIVE = "https://boldteq.com/our-works";
const LOCAL = "http://localhost:3001/our-works";

async function getPageData(page) {
  return page.evaluate(() => {
    const body = document.body;
    const sidebar = document.querySelector('aside, [class*="filter_column"], [class*="sidebar"]');
    const sidebarRect = sidebar?.getBoundingClientRect();
    const filterHeader = document.querySelector('[class*="filter_header"], [class*="filterHeader"]');
    const fhRect = filterHeader?.getBoundingClientRect();
    const gridEl = document.querySelector('[class*="cardGrid"], [class*="collection-list"]:not([class*="blog"])');
    const gridStyle = gridEl ? getComputedStyle(gridEl) : null;

    // Get visible card-like elements (white bg, > 200px tall)
    const allCards = document.querySelectorAll('[class*="content_card"]:not([class*="block"]):not([class*="info"]):not([class*="header"]):not([class*="image"]):not([class*="title"]):not([class*="price"]), article');
    const visibleCards = [...allCards].filter(c => {
      const r = c.getBoundingClientRect();
      return r.width > 100 && r.height > 100 && getComputedStyle(c).display !== 'none';
    });

    const cardDetails = visibleCards.slice(0, 3).map(c => {
      const r = c.getBoundingClientRect();
      const s = getComputedStyle(c);
      const imgWrap = c.querySelector('[class*="imageWrapper"], a[class*="cms-image"]');
      const imgWrapRect = imgWrap?.getBoundingClientRect();
      return {
        w: Math.round(r.width), h: Math.round(r.height),
        imgWrapH: imgWrapRect ? Math.round(imgWrapRect.height) : 0,
        bg: s.backgroundColor, br: s.borderRadius, pad: s.padding,
      };
    });

    const pagination = document.querySelector('[class*="pagination"], #custom-pagination');
    const sections = document.querySelectorAll('section');

    return {
      pageH: body.scrollHeight,
      sections: sections.length,
      sidebar: sidebarRect ? { w: Math.round(sidebarRect.width), h: Math.round(sidebarRect.height) } : null,
      filterHeader: fhRect ? { w: Math.round(fhRect.width), h: Math.round(fhRect.height), gridCols: filterHeader ? getComputedStyle(filterHeader).gridTemplateColumns : '' } : null,
      grid: gridStyle ? { cols: gridStyle.gridTemplateColumns, gap: gridStyle.gap, children: gridEl.children.length } : null,
      visibleCards: visibleCards.length,
      cards: cardDetails,
      pagination: pagination ? { text: pagination.textContent?.trim(), buttons: pagination.querySelectorAll('button').length } : null,
    };
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  console.log("Capturing LIVE...");
  const lp = await ctx.newPage();
  await lp.goto(LIVE, { waitUntil: "domcontentloaded", timeout: 45000 });
  await lp.waitForTimeout(5000);
  await lp.screenshot({ path: "tests/v3-live.png", fullPage: true });
  const ld = await getPageData(lp);

  console.log("Capturing LOCAL...");
  const rp = await ctx.newPage();
  await rp.goto(LOCAL, { waitUntil: "domcontentloaded", timeout: 30000 });
  await rp.waitForTimeout(4000);
  await rp.screenshot({ path: "tests/v3-local.png", fullPage: true });
  const rd = await getPageData(rp);

  const cmp = (label, l, r) => {
    const match = JSON.stringify(l) === JSON.stringify(r);
    console.log(`${match ? '✅' : '❌'} ${label}`);
    if (!match) { console.log(`   LIVE:  ${JSON.stringify(l)}`); console.log(`   LOCAL: ${JSON.stringify(r)}`); }
  };

  console.log("\n========== COMPARISON v3 ==========\n");
  cmp("Page height (±100)", Math.round(ld.pageH / 100) * 100, Math.round(rd.pageH / 100) * 100);
  cmp("Section count", ld.sections, rd.sections);
  cmp("Sidebar width", ld.sidebar?.w, rd.sidebar?.w);
  cmp("Filter header width", ld.filterHeader?.w, rd.filterHeader?.w);
  cmp("Filter header grid", ld.filterHeader?.gridCols, rd.filterHeader?.gridCols);
  cmp("Grid columns", ld.grid?.cols, rd.grid?.cols);
  cmp("Grid gap", ld.grid?.gap, rd.grid?.gap);
  cmp("Visible card count", ld.visibleCards, rd.visibleCards);
  cmp("Pagination text", ld.pagination?.text, rd.pagination?.text);

  console.log("\n--- Card Details ---");
  for (let i = 0; i < 3; i++) {
    const l = ld.cards[i], r = rd.cards[i];
    if (l && r) {
      console.log(`Card ${i}: LIVE ${l.w}x${l.h} imgH=${l.imgWrapH} | LOCAL ${r.w}x${r.h} imgH=${r.imgWrapH}`);
      const wDiff = Math.abs(l.w - r.w);
      const hDiff = Math.abs(l.h - r.h);
      const imgDiff = Math.abs(l.imgWrapH - r.imgWrapH);
      if (wDiff <= 5 && hDiff <= 5 && imgDiff <= 5) console.log(`  ✅ Dimensions match (within 5px)`);
      else console.log(`  ❌ Diff: w=${wDiff}px h=${hDiff}px img=${imgDiff}px`);
    }
  }

  // Test popup
  console.log("\n--- Popup Test ---");
  const card = await rp.$("article");
  if (card) {
    await card.click();
    await rp.waitForTimeout(800);
    const popup = await rp.evaluate(() => {
      const d = document.querySelector('[role="dialog"]');
      if (!d) return { visible: false };
      const iframe = d.querySelector('iframe');
      const img = d.querySelector('img');
      const container = d.querySelector('div');
      return {
        visible: true,
        hasIframe: !!iframe,
        hasImage: !!img,
        containerW: container ? Math.round(container.getBoundingClientRect().width) : 0,
      };
    });
    console.log(`Popup: ${JSON.stringify(popup)}`);
    if (!popup.hasIframe && popup.hasImage) console.log("  ✅ Gallery mode (image shown, no iframe 404)");
    else if (popup.hasIframe) console.log("  ✅ Full content mode (iframe)");
    await rp.screenshot({ path: "tests/v3-local-popup.png" });
  }

  // Check all 8 cards have images loading
  console.log("\n--- Image Loading Check ---");
  const imgCheck = await rp.evaluate(() => {
    // Close popup first
    const closeBtn = document.querySelector('[role="dialog"] button');
    if (closeBtn) closeBtn.click();

    const cards = document.querySelectorAll('article');
    return [...cards].map((c, i) => {
      const imgs = c.querySelectorAll('img');
      const mainImg = [...imgs].find(img => !img.src.includes('Vector-25'));
      return {
        index: i,
        hasMainImage: !!mainImg,
        imgSrc: mainImg?.src?.substring(0, 80) || 'MISSING',
        imgLoaded: mainImg ? (mainImg.naturalWidth > 0 || mainImg.complete) : false,
        imgHeight: mainImg ? Math.round(mainImg.getBoundingClientRect().height) : 0,
      };
    });
  });
  imgCheck.forEach(c => {
    const status = c.hasMainImage && c.imgHeight > 0 ? '✅' : '❌';
    console.log(`  ${status} Card ${c.index}: h=${c.imgHeight}px loaded=${c.imgLoaded} src=${c.imgSrc.substring(0,60)}`);
  });

  await browser.close();
  console.log("\n✅ Done");
}

main().catch(console.error);
