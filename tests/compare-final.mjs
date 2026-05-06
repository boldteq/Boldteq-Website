import { chromium } from "@playwright/test";

const LIVE = "https://boldteq.com/our-works";
const LOCAL = "http://localhost:3001/our-works";

async function getData(page) {
  return page.evaluate(() => {
    const sidebar = document.querySelector('aside, [class*="filter_column"], [class*="sidebar"]');
    const fh = document.querySelector('[class*="filter_header"], [class*="filterHeader"]');
    const grid = document.querySelector('[class*="cardGrid"], [class*="collection-list"]:not([class*="blog"])');
    const cards = document.querySelectorAll('[class*="content_card"]:not([class*="block"]):not([class*="info"]):not([class*="header"]):not([class*="image"]):not([class*="title"]):not([class*="price"]), article');
    const vis = [...cards].filter(c => c.getBoundingClientRect().width > 100 && c.getBoundingClientRect().height > 100 && getComputedStyle(c).display !== 'none');
    const pg = document.querySelector('[class*="pagination"], #custom-pagination');

    const c0 = vis[0]; const c0r = c0?.getBoundingClientRect();
    const imgW = c0?.querySelector('[class*="imageWrapper"], a[class*="cms-image"]');

    return {
      pageH: document.body.scrollHeight,
      sections: document.querySelectorAll('section').length,
      sidebarW: sidebar ? Math.round(sidebar.getBoundingClientRect().width) : 0,
      fhW: fh ? Math.round(fh.getBoundingClientRect().width) : 0,
      gridCols: grid ? getComputedStyle(grid).gridTemplateColumns : '',
      cardCount: vis.length,
      cardW: c0r ? Math.round(c0r.width) : 0,
      cardH: c0r ? Math.round(c0r.height) : 0,
      imgH: imgW ? Math.round(imgW.getBoundingClientRect().height) : 0,
      pgText: pg?.textContent?.trim() || '',
    };
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  const lp = await ctx.newPage();
  await lp.goto(LIVE, { waitUntil: "domcontentloaded", timeout: 45000 });
  await lp.waitForTimeout(5000);
  await lp.screenshot({ path: "tests/final-live.png", fullPage: true });
  const ld = await getData(lp);

  const rp = await ctx.newPage();
  await rp.goto(LOCAL, { waitUntil: "domcontentloaded", timeout: 30000 });
  await rp.waitForTimeout(4000);
  // Scroll to trigger lazy images
  await rp.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await rp.waitForTimeout(1500);
  await rp.evaluate(() => window.scrollTo(0, 0));
  await rp.waitForTimeout(500);
  await rp.screenshot({ path: "tests/final-local.png", fullPage: true });
  const rd = await getData(rp);

  console.log("\n========== FINAL COMPARISON ==========\n");
  const cmp = (label, l, r, tol = 0) => {
    const diff = typeof l === 'number' && typeof r === 'number' ? Math.abs(l - r) : (JSON.stringify(l) === JSON.stringify(r) ? 0 : 999);
    const ok = diff <= tol;
    console.log(`${ok ? '✅' : '❌'} ${label}: LIVE=${l} LOCAL=${r}${diff > 0 ? ` (diff=${diff})` : ''}`);
  };

  cmp("Page height", ld.pageH, rd.pageH, 150);
  cmp("Sections", ld.sections, rd.sections);
  cmp("Sidebar width", ld.sidebarW, rd.sidebarW, 5);
  cmp("Filter header width", ld.fhW, rd.fhW, 10);
  cmp("Card count", ld.cardCount, rd.cardCount);
  cmp("Card width", ld.cardW, rd.cardW, 5);
  cmp("Card height", ld.cardH, rd.cardH, 5);
  cmp("Image height", ld.imgH, rd.imgH, 5);
  cmp("Pagination", ld.pgText, rd.pgText);

  // Popup test
  const card = await rp.$("article");
  if (card) {
    await card.click();
    await rp.waitForTimeout(800);
    const p = await rp.evaluate(() => {
      const d = document.querySelector('[role="dialog"]');
      return d ? { ok: true, has404: d.textContent?.includes('404') || false } : { ok: false };
    });
    console.log(`\n${p.ok && !p.has404 ? '✅' : '❌'} Popup: opens=${p.ok} has404=${p.has404 || false}`);
    await rp.screenshot({ path: "tests/final-popup.png" });
  }

  // Image check after scroll
  const imgs = await rp.evaluate(() => {
    const closeBtn = document.querySelector('[role="dialog"] button');
    if (closeBtn) closeBtn.click();
    const cards = document.querySelectorAll('article');
    let loaded = 0, total = cards.length;
    cards.forEach(c => {
      const img = [...c.querySelectorAll('img')].find(i => !i.src.includes('Vector'));
      if (img && img.naturalWidth > 0) loaded++;
    });
    return { loaded, total };
  });
  console.log(`${imgs.loaded === imgs.total ? '✅' : '❌'} Images: ${imgs.loaded}/${imgs.total} loaded`);

  await browser.close();
  console.log("\n✅ Done");
}

main().catch(console.error);
