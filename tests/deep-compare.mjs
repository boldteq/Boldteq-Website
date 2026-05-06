import { chromium } from "@playwright/test";

async function deepCompare() {
  const browser = await chromium.launch();

  // Load our local site
  const localCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const local = await localCtx.newPage();
  await local.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 30000 });
  await local.waitForTimeout(2000);

  // Load Webflow site
  const wfCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const wf = await wfCtx.newPage();
  await wf.goto("https://boldteq.com", { waitUntil: "domcontentloaded", timeout: 60000 });
  await wf.waitForTimeout(3000);

  // Take comparison screenshots at key scroll positions
  const positions = [0, 600, 1200, 1800, 2400, 3200, 4000, 5000, 6000, 7000, 8000];
  for (const y of positions) {
    await local.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await local.waitForTimeout(300);
    await local.screenshot({ path: `tests/screenshots/local-${y}.png` });

    await wf.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await wf.waitForTimeout(300);
    await wf.screenshot({ path: `tests/screenshots/webflow-${y}.png` });
  }

  // Deep style comparison
  const extractStyles = () => {
    const out = { sections: [], nav: null, footer: null };

    // NAV
    const nav = document.querySelector("nav");
    if (nav) {
      const cs = window.getComputedStyle(nav);
      out.nav = {
        bg: cs.backgroundColor,
        padding: cs.padding,
        height: nav.offsetHeight,
        position: cs.position,
      };
      // Nav links
      const links = nav.querySelectorAll("a");
      out.navLinks = [];
      links.forEach((l, i) => {
        if (i < 8) {
          const lcs = window.getComputedStyle(l);
          out.navLinks.push({
            text: l.textContent.trim().substring(0, 20),
            size: lcs.fontSize,
            weight: lcs.fontWeight,
            color: lcs.color,
          });
        }
      });
    }

    // ALL SECTIONS from main
    const main = document.querySelector("main") || document.body;
    const children = main.children;
    for (let i = 0; i < children.length && i < 15; i++) {
      const sec = children[i];
      const cs = window.getComputedStyle(sec);
      const secData = {
        index: i,
        tag: sec.tagName,
        bg: cs.backgroundColor,
        padding: cs.padding,
        width: sec.offsetWidth,
        height: sec.offsetHeight,
      };

      // First heading in section
      const h = sec.querySelector("h1, h2, h3");
      if (h) {
        const hcs = window.getComputedStyle(h);
        secData.heading = {
          text: h.textContent.trim().substring(0, 40),
          tag: h.tagName,
          size: hcs.fontSize,
          weight: hcs.fontWeight,
          lh: hcs.lineHeight,
          color: hcs.color,
          mb: hcs.marginBottom,
        };
      }

      // First paragraph
      const p = sec.querySelector("p");
      if (p) {
        const pcs = window.getComputedStyle(p);
        secData.paragraph = {
          size: pcs.fontSize,
          lh: pcs.lineHeight,
          color: pcs.color,
          maxW: pcs.maxWidth,
        };
      }

      // Cards in section
      const cards = sec.querySelectorAll("[class*='rounded']");
      if (cards.length > 0 && cards.length <= 10) {
        const card = cards[0];
        const ccs = window.getComputedStyle(card);
        secData.firstCard = {
          bg: ccs.backgroundColor,
          border: ccs.border,
          radius: ccs.borderRadius,
          shadow: ccs.boxShadow.substring(0, 60),
          padding: ccs.padding,
        };
      }

      out.sections.push(secData);
    }

    // FOOTER
    const footer = document.querySelector("footer");
    if (footer) {
      const fcs = window.getComputedStyle(footer);
      out.footer = {
        bg: fcs.backgroundColor,
        padding: fcs.padding,
        height: footer.offsetHeight,
      };
    }

    return out;
  };

  const localStyles = await local.evaluate(extractStyles);
  const wfStyles = await wf.evaluate(extractStyles);

  // Compare and report differences
  console.log("=== NAVBAR COMPARISON ===");
  console.log("Local:", JSON.stringify(localStyles.nav, null, 2));
  console.log("Webflow:", JSON.stringify(wfStyles.nav, null, 2));

  console.log("\n=== NAV LINKS ===");
  console.log("Local:", JSON.stringify(localStyles.navLinks, null, 2));
  console.log("Webflow:", JSON.stringify(wfStyles.navLinks, null, 2));

  console.log("\n=== SECTION-BY-SECTION ===");
  const maxSec = Math.max(localStyles.sections.length, wfStyles.sections.length);
  for (let i = 0; i < maxSec; i++) {
    const l = localStyles.sections[i];
    const w = wfStyles.sections[i];
    if (!l || !w) {
      console.log(`\nSection ${i}: ${l ? "LOCAL ONLY" : "WEBFLOW ONLY"}`);
      continue;
    }
    const diffs = [];
    if (l.bg !== w.bg) diffs.push(`bg: ${l.bg} vs ${w.bg}`);
    if (l.padding !== w.padding) diffs.push(`padding: ${l.padding} vs ${w.padding}`);
    if (Math.abs(l.height - w.height) > 20) diffs.push(`height: ${l.height}px vs ${w.height}px`);

    if (l.heading && w.heading) {
      if (l.heading.size !== w.heading.size) diffs.push(`h-size: ${l.heading.size} vs ${w.heading.size}`);
      if (l.heading.weight !== w.heading.weight) diffs.push(`h-weight: ${l.heading.weight} vs ${w.heading.weight}`);
      if (l.heading.lh !== w.heading.lh) diffs.push(`h-lh: ${l.heading.lh} vs ${w.heading.lh}`);
      if (l.heading.color !== w.heading.color) diffs.push(`h-color: ${l.heading.color} vs ${w.heading.color}`);
    }

    if (diffs.length > 0) {
      console.log(`\nSection ${i} "${l.heading?.text || "no heading"}":`);
      diffs.forEach(d => console.log(`  DIFF: ${d}`));
    } else {
      console.log(`\nSection ${i} "${l.heading?.text || ""}": MATCH`);
    }
  }

  console.log("\n=== FOOTER COMPARISON ===");
  console.log("Local:", JSON.stringify(localStyles.footer, null, 2));
  console.log("Webflow:", JSON.stringify(wfStyles.footer, null, 2));

  await browser.close();
}

deepCompare().catch(console.error);
