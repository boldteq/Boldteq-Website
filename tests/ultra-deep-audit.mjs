import { chromium } from "@playwright/test";

async function ultraDeep() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(3000);

  const audit = await page.evaluate(() => {
    const issues = [];

    function cs(el) { return window.getComputedStyle(el); }
    function px(v) { return parseFloat(v) || 0; }

    // NAVBAR DEEP CHECK
    const nav = document.querySelector("nav");
    if (nav) {
      const ncs = cs(nav);
      // Webflow: padding 6px 1%
      const navPL = px(ncs.paddingLeft);
      const navPR = px(ncs.paddingRight);
      if (navPL < 10 || navPL > 20) issues.push(`NAV padding-left: ${ncs.paddingLeft} (expect ~14px for 1%)`);

      // Check logo width
      const logo = nav.querySelector("img");
      if (logo && logo.naturalWidth > 0) {
        const logoW = logo.offsetWidth;
        if (logoW < 120 || logoW > 140) issues.push(`NAV logo width: ${logoW}px (expect 130px)`);
      }

      // Nav link spacing
      const navLinks = nav.querySelectorAll("a");
      const linkTexts = [];
      navLinks.forEach(l => {
        const t = l.textContent.trim();
        if (["How It Works","Pricing","Our Work","Our Mission"].includes(t)) {
          linkTexts.push({ text: t, size: cs(l).fontSize, weight: cs(l).fontWeight, color: cs(l).color, padding: cs(l).padding });
        }
      });
      issues.push(`NAV_LINKS: ${JSON.stringify(linkTexts)}`);
    }

    // EACH SECTION DEEP CHECK
    const main = document.querySelector("main");
    if (!main) { issues.push("NO MAIN FOUND"); return issues; }

    for (let i = 0; i < main.children.length; i++) {
      const sec = main.children[i];
      const scs = cs(sec);
      const heading = sec.querySelector("h1, h2");
      const hText = heading ? heading.textContent.trim().substring(0, 35) : "(none)";

      // Section padding (Webflow pattern: Xpx 5%)
      const pl = px(scs.paddingLeft);
      const pr = px(scs.paddingRight);
      const pt = px(scs.paddingTop);
      const pb = px(scs.paddingBottom);

      // Check side padding is roughly 5% of 1440 = 72px
      if (pl > 0 && (pl < 50 || pl > 90) && pl !== 0) {
        // Some sections use different padding, only flag obvious mismatches
      }

      // Check container max-width inside section
      const container = sec.querySelector("[class*='max-w']") || sec.firstElementChild;
      if (container) {
        const cw = container.offsetWidth;
        const cmw = cs(container).maxWidth;
        // Most Webflow sections use container-large (1280px) or regular (940px)
      }

      // Check heading alignment
      if (heading) {
        const hcs = cs(heading);
        const hAlign = hcs.textAlign;
        issues.push(`SEC${i} "${hText}" | pt:${pt} pb:${pb} pl:${pl} pr:${pr} | h-size:${hcs.fontSize} h-weight:${hcs.fontWeight} h-lh:${hcs.lineHeight} h-align:${hAlign} h-mb:${hcs.marginBottom}`);
      } else {
        issues.push(`SEC${i} (no heading) | pt:${pt} pb:${pb} pl:${pl} pr:${pr}`);
      }

      // Check cards inside section
      const cards = sec.querySelectorAll("[class*='rounded-']");
      if (cards.length > 0 && cards.length <= 12) {
        const card = cards[0];
        const ccs = cs(card);
        issues.push(`  CARD: radius:${ccs.borderRadius} padding:${ccs.padding} shadow:${ccs.boxShadow.substring(0,50)} border:${ccs.borderWidth} ${ccs.borderColor.substring(0,30)}`);
      }

      // Check paragraph text
      const para = sec.querySelector("p");
      if (para) {
        const pcs = cs(para);
        issues.push(`  PARA: size:${pcs.fontSize} lh:${pcs.lineHeight} color:${pcs.color} align:${pcs.textAlign}`);
      }

      // Check grid/flex gaps
      const grids = sec.querySelectorAll("[class*='grid'], [class*='flex']");
      grids.forEach((g, gi) => {
        if (gi > 2) return;
        const gcs = cs(g);
        if (gcs.gap && gcs.gap !== "normal" && gcs.gap !== "0px") {
          // Only log non-zero gaps
        }
      });

      // Check buttons in section
      const btns = sec.querySelectorAll("a[class*='gradient'], a[class*='bg-gradient'], button[class*='gradient']");
      btns.forEach(btn => {
        const bcs = cs(btn);
        issues.push(`  BTN "${btn.textContent.trim().substring(0,20)}": radius:${bcs.borderRadius} padding:${bcs.padding} size:${bcs.fontSize} weight:${bcs.fontWeight}`);
      });
    }

    // FOOTER DEEP CHECK
    const footer = document.querySelector("footer");
    if (footer) {
      const fcs = cs(footer);
      issues.push(`FOOTER: pt:${px(fcs.paddingTop)} pb:${px(fcs.paddingBottom)} pl:${px(fcs.paddingLeft)} pr:${px(fcs.paddingRight)}`);

      // Newsletter card
      const nlCard = footer.querySelector("[class*='rounded-[20px]']");
      if (nlCard) {
        const ncs = cs(nlCard);
        issues.push(`  NL_CARD: padding:${ncs.padding} radius:${ncs.borderRadius}`);
      }

      // Footer links
      const fLinks = footer.querySelectorAll("a");
      const linkSizes = new Set();
      fLinks.forEach(l => linkSizes.add(cs(l).fontSize));
      issues.push(`  LINK_SIZES: ${[...linkSizes].join(", ")}`);
    }

    return issues;
  });

  // Print all findings
  console.log("=== ULTRA DEEP AUDIT ===\n");
  audit.forEach(line => console.log(line));

  // Now compare with Webflow source CSS values
  console.log("\n=== WEBFLOW REFERENCE VALUES ===");
  console.log("hero section: padding 0, bg white");
  console.log("slowing-sec: padding 0 5% 30px, bg transparent");
  console.log("blue-card-sec: padding 0 5%, bg transparent");
  console.log("built-seccc: padding 60px 5% 0, bg transparent");
  console.log("works-sec: padding 20px 5% 60px, bg transparent");
  console.log("blue-sec makeit: padding 70px 5% 80px, bg #082753");
  console.log("new-price-sec: padding 80px 5% 20px, bg white");
  console.log("ways-sec: padding 0 5%, bg transparent");
  console.log("faq-section: padding 60px 5% 70px");
  console.log("footer: padding 72px 5% 16px, bg #082753");
  console.log("h2.heading-2: font-size 40px, font-weight 700, line-height 45px, margin-bottom 24px");
  console.log("p.paragraph.center: font-size 18px, line-height 28px, text-align center");
  console.log("nav-23-link: color #000, padding 8px 5px, font-size inherits 16px");
  console.log("a-gulf-book (CTA): border-radius .75rem, padding 12px 3rem 12px 1rem");
  console.log("card hover: bg #cdebfa, border #009ce0");

  await browser.close();
}

ultraDeep().catch(console.error);
