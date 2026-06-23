import { chromium } from '@playwright/test';
const b = await chromium.launch({ channel: 'chrome' });

// 1) Button arrow-on-hover regression on blog routes
const av = (el)=>{const L=[getComputedStyle(el),getComputedStyle(el,'::before'),getComputedStyle(el,'::after')];return L.some(cs=>cs.backgroundImage.includes('Group-46729')&&parseFloat(cs.opacity)>0.01);};
const broken=[];
for (const route of ['/blog','/blog-posts/how-agencies-use-white-label-web-development-teams']) {
  const p = await b.newPage({ viewport:{width:1440,height:900} });
  await p.goto('http://localhost:3000'+route,{waitUntil:'networkidle'});
  for (const el of await p.$$('a,button')) {
    if(!(await el.evaluate(av))) continue;
    await el.hover().catch(()=>{}); await p.waitForTimeout(300);
    if(!(await el.evaluate(av))) broken.push(route+' '+(await el.evaluate(n=>n.textContent.trim().slice(0,18))));
    await p.mouse.move(0,0).catch(()=>{});
  }
  await p.close();
}
console.log('buttons losing arrow on hover:', broken.length?JSON.stringify(broken):'NONE ✅');

// 2) blog smoke: filter + load more still work
const p = await b.newPage({ viewport:{width:1440,height:1000} });
await p.goto('http://localhost:3000/blog',{waitUntil:'networkidle'});
const smoke = await p.evaluate(()=>({count:document.querySelector('[class*="resultCount"]')?.textContent.trim(), cards:document.querySelectorAll('[class*="cardWrapper"]').length, loadMore:!!document.querySelector('[class*="loadBtn"]')}));
console.log('blog smoke:', JSON.stringify(smoke));
await b.close();
