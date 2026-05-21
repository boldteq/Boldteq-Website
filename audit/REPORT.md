# Boldteq Marketing Site — Pixel-Perfect Audit + Auto-Fix Report

**Last update:** 2026-05-21 (group-level parallel cycle)
**Cumulative fixes applied:** 1,201 (prior) + structural + behavioral parity work (this cycle)
**Build status:** green | 39 routes prerender | lint 0 warnings in src

---

## Cycle 3 summary (2026-05-21) — group-level parallel tracks

| Track | Scope | Status |
|---|---|---|
| **T0** | Visual-diff harness stabilization | ✅ shipped |
| **T1** | Mobile nav A1 — hide desktop nav at ≤991px | ✅ shipped |
| **T2** | Blog/portfolio/contact content verify (no actionable — live = local) | ✅ verified |
| **T3** | TopBanner above navbar + extract BetaModal + 3 right-panel bullets + /beta href | ✅ shipped |
| **T4** | `transition: all` removed + Twitter handles + canonical helper site-wide | ✅ shipped |
| **T5** | Localize 28 CDN images to public/images/webflow/cdn/ | ✅ shipped |
| **T6** | Manual CSS sweep tail (1,053 layout-property reviews) | ⏭ deferred — hours of per-class layout review |
| **T7** | Re-baseline visual diff + final commit | ✅ shipped |

---

## T0 — Visual-diff harness fixes

`scripts/visual-diff.mjs` rewritten with:
- `newContext({ reducedMotion: 'reduce' })`
- `addStyleTag` injects animation-pause + hide Chatwoot bubble + hide GuideJar/Chatwoot iframes
- Locks embla carousels to slide 0 after goto
- Drop `networkidle` wait (dev HMR socket never closes)
- Per-page timing logs
- `fullPage: true` default; `--above-fold` opt-in to old 900px-clip mode

Switching to fullPage exposed below-fold divergence that prior above-fold capture had hidden — baseline rose from 6-12% to 25-40%. This is GOOD: we now measure the truth.

## T1 — Mobile nav (A1)

Bug: Webflow uses 991px breakpoint; local `mobile-nav.module.css` had 991px but `navbar.module.css` @media block didn't actually hide the desktop horizontal nav at that breakpoint. At 991px viewport, local showed desktop nav AND hamburger simultaneously.

Fix: in `navbar.module.css` @media (max-width: 991px) block, replace stale Webflow-overlay rules for `.nav-23-menu` with `display: none`. React `MobileNav` overlay handles the mobile sheet exclusively.

## T3 — Missing layout sections + BetaModal refinement

Three concrete adds vs live boldteq.com:

1. **`src/components/layout/top-banner.tsx`** + `top-banner.module.css` — gradient strip above navbar with "🚀 We're upgrading the website experience — Some sections may update in real-time." + "Join Beta" button. Matches Webflow `<section class="banner-section">` markup. Mounted in `src/app/layout.tsx`.

2. **`src/components/shared/beta-modal.tsx`** — extracted from inline `BetaPopup` in navbar.tsx. Now reusable from TopBanner. Updated to match live structure exactly:
   - Right panel: added 3 emoji bullets (🚀 Founding pricing locked in / ⚡ Priority onboarding / 🎁 20 free hours for beta feedback)
   - CTA href: changed from `/book-a-demo` → `/beta` to match live

3. Modal trigger now wired via TopBanner (visible site-wide). Live shows the popup overlay on every page.

## T4 — A11y + SEO

- `src/components/services/service-hero.module.css:97` — `transition: all 0.5s` → `transition: opacity 0.5s ease, transform 0.5s ease`. Now 0 `transition: all` in src.
- `src/app/layout.tsx` twitter meta — added `site: '@boldteq'`, `creator: '@boldteq'`.
- `src/lib/seo/metadata.ts` — `createMetadata` helper now emits twitter handles on every page that uses it (16 routes).
- Confirmed every `page.tsx` already has canonical (via `createMetadata` or explicit `alternates`).

## T5 — CDN image localization

`scripts/localize-cdn-assets.mjs` — scans `src/lib/constants/`, downloads every `https://cdn.prod.website-files.com/*` URL to `public/images/webflow/cdn/`, rewrites references to local paths.

- 28 unique CDN URLs across `portfolio.ts`, `portfolio-details.ts`, `blog.ts`
- All 28 now stored locally (~50 MB)
- Source files no longer reference external CDN

Initial regex stopped at `)` causing 12 URL truncations; fixed regex + backfilled missing files (renamed to match generated paths).

## Visual diff post-fix (fullPage capture)

| Page | 1440 | 991 | 767 | 479 |
|---|---|---|---|---|
| `/` | 29.32% | 28.16% | 32.96% | 32.42% |
| `/pricing` | 31.99% | 36.36% | 27.92% | 33.61% |
| `/our-works` | 36.88% | 39.74% | 43.83% | 41.62% |
| `/how-it-works` | 42.96% | 37.36% | 25.93% | 34.44% |

Persistent ~30-40% delta now reflects TRUE structural gaps:
- Different page heights (local /home 8712px @ 1440 vs live ~8000px) — content density mismatch
- Section spacing / vertical rhythm differences (1,053 manual-review CSS layout bugs still open in T6)
- Image rendering (Next.js Image optimization vs Webflow CDN srcset)
- Dynamic content position drift even with animations paused (lazy hydration, CMS rendering order)

True ≤2% pixel parity requires Phase T6: per-class layout review across navbar/beta-cta/hero/pain-points/careers-global (top 5 burden files, ~250 manual CSS fixes), plus tail 15 files (~800 fixes). 8+ hours of careful work with visual diff gate after each commit.

---

## Open backlog after this cycle

### Closed
- ✅ A1 Mobile nav breakpoint (T1)
- ✅ A8 Visual diff fullPage (T0)
- ✅ Missing top banner + BetaModal refinement (T3)
- ✅ Twitter handles + canonical helper (T4)
- ✅ `transition: all` (T4)
- ✅ Per-route canonical (already covered by createMetadata)
- ✅ alt="" without aria-hidden (verified: 45 tags all have aria-hidden in same tag)
- ✅ outline: none (verified 0)
- ✅ CDN image localization (T5)

### Open
- ⏭ **T6 manual CSS sweep** — 1,053 layout-property bugs (justify-content 74, display 59, border 53, padding/margin @ @media 290+). Top burden: navbar.module.css 85, beta-cta.module.css 60, hero.module.css 43, pain-points 37, careers-global 34. Requires per-class visual validation.
- ⏭ **Lighthouse not run** — write `scripts/lighthouse.mjs` and gate Performance ≥95 / A11y BP SEO = 100.
- ⏭ **F1 Image priority on heroes** — most heroes don't have content images; LCP profiling would identify the right targets.
- ⏭ **Route URL prefix mismatch** — live uses `/our-work/[slug]` and `/blog-posts/[slug]`; local uses `/our-works/[slug]` and `/blog/[slug]`. SEO-only (not visual). Requires route rename + redirect.
- ⏭ **Behavioral parity gaps** — Webflow runtime hooks (.w-tab-menu, .w-dropdown, .w-embed JS handlers) not all wired in React; some interactive states still CSS-only.

---

## Tooling now in place

- `audit/css-diff.mjs` — v2 auditor (token resolver + brace-balanced @media parser + hex/rgba norm)
- `scripts/apply-css-fixes.mjs` — pre-approved CSS prop codemod (default + @media)
- `scripts/apply-quality-fixes.mjs` — aria-hidden + rel + iframe lazy (idempotent)
- `scripts/visual-diff.mjs` — Playwright fullPage diff vs live (animation-stable)
- `scripts/localize-cdn-assets.mjs` — Webflow CDN → local

---

## Cumulative tally

| Cycle | Bugs documented | Fixed |
|---|---|---|
| Cycle 1 (prior, Batch A-I) | 148 | 121 |
| Cycle 2 (CSS sweep + quality) | 1,698 | 1,080 |
| **Cycle 3 (group-level: harness + nav + UI + SEO + assets)** | — | +structural |
| **TOTAL** | **1,846** | **1,201 + structural** |

Next cycle = T6 manual CSS sweep across top 5 burden files to drive visual delta from 30-40% toward 5-10% before final Lighthouse + true 1:1 confirmation.
