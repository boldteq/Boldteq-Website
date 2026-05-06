import { chromium } from "@playwright/test";

const LIVE = "https://boldteq.com/our-works";
const LOCAL = "http://localhost:3001/our-works";

async function getPageData(page) {
  return page.evaluate(() => {
    const body = document.body;

    // Sidebar
    const sidebar = document.querySelector('aside, [class*="filter_column"], [class*="sidebar"]');
    const sidebarRect = sidebar?.getBoundingClientRect();

    // Filter header
    const filterHeader = document.querySelector('[class*="filter_header"], [class*="filterHeader"]');
    const fhRect = filterHeader?.getBoundingClientRect();

    // Card grid
    const gridEl = document.querySelector('[class*="cardGrid"], [class*="collection-list"]:not([class*="blog"])');
    const gridStyle = gridEl ? getComputedStyle(gridEl) : null;

    // Cards — get the actual styled card elements
    const allCards = document.querySelectorAll('[class*="content_card"]:not([class*="block"]):not([class*="info"]):not([class*="header"]):not([class*="image"]):not([class*="title"]):not([class*="price"]), article');
    const visibleCards = [...allCards].filter(c => {
      const s = getComputedStyle(c);
      const r = c.getBoundingClientRect();
      return s.display !== 'none' && r.width > 100 && r.height > 100;
    });

    // Sample first 3 visible cards
    const cardDetails = visibleCards.slice(0, 3).map(c => {
      const r = c.getBoundingClientRect();
      const s = getComputedStyle(c);
      // Find the main image
      const img = c.querySelector('img[class*="card-image"], img[class*="image"]:not([class*="eye"])');
      const imgRect = img?.getBoundingClientRect();
      return {
        w: Math.round(r.width),
        h: Math.round(r.height),
        bg: s.backgroundColor,
        br: s.borderRadius,
        pad: s.padding,
        shadow: s.boxShadow?.substring(0, 60),
        imgH: imgRect ? Math.round(imgRect.height) : 0,
        imgW: imgRect ? Math.round(imgRect.width) : 0,
      };
    });

    // Pagination
    const pagination = document.querySelector('[class*="pagination"], #custom-pagination');
    const paginationInfo = pagination ? {
      visible: getComputedStyle(pagination).display !== 'none',
      buttons: pagination.querySelectorAll('button').length,
      text: pagination.textContent?.trim(),
    } : null;

    // Count sections
    const sections = document.querySelectorAll('section');

    return {
      pageH: body.scrollHeight,
      pageW: body.scrollWidth,
      sections: sections.length,
      sidebar: sidebarRect ? { w: Math.round(sidebarRect.width), h: Math.round(sidebarRect.height) } : null,
      filterHeader: fhRect ? { w: Math.round(fhRect.width), h: Math.round(fhRect.height), gridCols: filterHeader ? getComputedStyle(filterHeader).gridTemplateColumns : '' } : null,
      grid: gridStyle ? { cols: gridStyle.gridTemplateColumns, gap: gridStyle.gap, children: gridEl.children.length } : null,
      visibleCards: visibleCards.length,
      cards: cardDetails,
      pagination: paginationInfo,
    };
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  // Capture LIVE
  console.log("Capturing LIVE...");
  const lp = await ctx.newPage();
  await lp.goto(LIVE, { waitUntil: "domcontentloaded", timeout: 45000 });
  await lp.waitForTimeout(5000);
  await lp.screenshot({ path: "tests/v2-live.png", fullPage: true });
  const liveData = await getPageData(lp);

  // Capture LOCAL
  console.log("Capturing LOCAL...");
  const rp = await ctx.newPage();
  await rp.goto(LOCAL, { waitUntil: "domcontentloaded", timeout: 30000 });
  await rp.waitForTimeout(3000);
  await rp.screenshot({ path: "tests/v2-local.png", fullPage: true });
  const localData = await getPageData(rp);

  // Compare
  const compare = (label, live, local) => {
    const match = JSON.stringify(live) === JSON.stringify(local);
    console.log(`${match ? '✅' : '❌'} ${label}`);
    if (!match) {
      console.log(`   LIVE:  ${JSON.stringify(live)}`);
      console.log(`   LOCAL: ${JSON.stringify(local)}`);
    }
  };

  console.log("\n========== COMPARISON v2 ==========\n");
  compare("Page height", liveData.pageH, localData.pageH);
  compare("Section count", liveData.sections, localData.sections);
  compare("Sidebar dimensions", liveData.sidebar, localData.sidebar);
  compare("Filter header", liveData.filterHeader, localData.filterHeader);
  compare("Grid layout", liveData.grid, localData.grid);
  compare("Visible cards", liveData.visibleCards, localData.visibleCards);
  compare("Pagination", liveData.pagination, localData.pagination);

  console.log("\n--- Card Comparison ---");
  for (let i = 0; i < Math.max(liveData.cards.length, localData.cards.length); i++) {
    console.log(`\nCard ${i}:`);
    const l = liveData.cards[i];
    const r = localData.cards[i];
    if (l) console.log(`  LIVE:  ${l.w}x${l.h} img=${l.imgW}x${l.imgH} bg=${l.bg} br=${l.br} pad=${l.pad}`);
    if (r) console.log(`  LOCAL: ${r.w}x${r.h} img=${r.imgW}x${r.imgH} bg=${r.bg} br=${r.br} pad=${r.pad}`);
    if (l && r) {
      if (l.w !== r.w) console.log(`  ⚠️ WIDTH diff: ${l.w} vs ${r.w}`);
      if (Math.abs(l.h - r.h) > 10) console.log(`  ⚠️ HEIGHT diff: ${l.h} vs ${r.h}`);
      if (Math.abs(l.imgH - r.imgH) > 10) console.log(`  ⚠️ IMG HEIGHT diff: ${l.imgH} vs ${r.imgH}`);
    }
  }

  // Test popup on local
  console.log("\n--- Popup Test ---");
  const firstCard = await rp.$("article");
  if (firstCard) {
    await firstCard.click();
    await rp.waitForTimeout(800);
    const popupInfo = await rp.evaluate(() => {
      const d = document.querySelector('[role="dialog"]');
      if (!d) return { visible: false };
      const iframe = d.querySelector('iframe');
      const img = d.querySelector('img');
      return {
        visible: true,
        w: Math.round(d.getBoundingClientRect().width),
        h: Math.round(d.getBoundingClientRect().height),
        hasIframe: !!iframe,
        iframeSrc: iframe?.src || '',
        hasImage: !!img,
      };
    });
    console.log(`Popup: ${JSON.stringify(popupInfo, null, 2)}`);
    await rp.screenshot({ path: "tests/v2-local-popup.png" });

    // Check for 404 in iframe
    if (popupInfo.hasIframe && popupInfo.iframeSrc) {
      console.log(`Iframe src: ${popupInfo.iframeSrc}`);
    }
  }

  await browser.close();
  console.log("\n✅ Done. Screenshots at tests/v2-*.png");
}

main().catch(console.error);
