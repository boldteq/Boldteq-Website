import { chromium } from "@playwright/test";

async function getData(page) {
  return page.evaluate(() => {
    const sidebar = document.querySelector('aside, [class*="filter_column"]');
    const cards = document.querySelectorAll('article, [class*="content_card"]:not([class*="block"]):not([class*="info"]):not([class*="header"]):not([class*="image"]):not([class*="title"])');
    const vis = [...cards].filter(c => c.getBoundingClientRect().width > 100 && c.getBoundingClientRect().height > 100);
    const c0 = vis[0]; const c0r = c0?.getBoundingClientRect();
    const imgW = c0?.querySelector('[class*="imageWrapper"], a[class*="cms-image"]');
    const pg = document.querySelector('[class*="pagination"], #custom-pagination');
    return {
      pageH: document.body.scrollHeight,
      sections: document.querySelectorAll('section').length,
      sidebarW: sidebar ? Math.round(sidebar.getBoundingClientRect().width) : 0,
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
  await lp.goto("https://boldteq.com/our-works", { waitUntil: "domcontentloaded", timeout: 45000 });
  await lp.waitForTimeout(5000);
  const ld = await getData(lp);

  const rp = await ctx.newPage();
  await rp.goto("http://localhost:3001/our-works", { waitUntil: "domcontentloaded", timeout: 30000 });
  await rp.waitForTimeout(4000);
  await rp.screenshot({ path: "tests/final2-local.png", fullPage: true });
  const rd = await getData(rp);

  // Image loading check
  const imgs = await rp.evaluate(() => {
    const cards = document.querySelectorAll('article');
    let loaded = 0;
    cards.forEach(c => {
      const img = [...c.querySelectorAll('img')].find(i => !i.src.includes('Vector'));
      if (img && img.naturalWidth > 0) loaded++;
    });
    return { loaded, total: cards.length };
  });

  console.log("\n========== FINAL v2 ==========\n");
  const cmp = (l, v1, v2, t=5) => { const d=typeof v1==='number'?Math.abs(v1-v2):v1===v2?0:999; console.log(`${d<=t?'✅':'❌'} ${l}: ${v1} vs ${v2}${d>0?` (±${d})`:''}`); };
  cmp("Page height (±150)", ld.pageH, rd.pageH, 150);
  cmp("Sections", ld.sections, rd.sections, 0);
  cmp("Sidebar width", ld.sidebarW, rd.sidebarW);
  cmp("Cards visible", ld.cardCount, rd.cardCount, 0);
  cmp("Card width", ld.cardW, rd.cardW);
  cmp("Card height", ld.cardH, rd.cardH);
  cmp("Image height", ld.imgH, rd.imgH);
  cmp("Pagination", ld.pgText, rd.pgText, 0);
  console.log(`${imgs.loaded===imgs.total?'✅':'❌'} Images loaded: ${imgs.loaded}/${imgs.total}`);

  // Popup
  const card = await rp.$("article");
  if (card) {
    await card.click();
    await rp.waitForTimeout(500);
    const p = await rp.evaluate(() => {
      const d = document.querySelector('[role="dialog"]');
      return d ? { ok: true, no404: !d.textContent?.includes('404') } : { ok: false };
    });
    console.log(`${p.ok&&p.no404?'✅':'❌'} Popup works (no 404)`);
  }

  await browser.close();
  console.log("\n✅ All checks complete");
}

main().catch(console.error);
