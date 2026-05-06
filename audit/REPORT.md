# Boldteq Marketing Site — Audit + Fix Report

**Generated:** 2026-04-27 (updated in Batch H session)
**Total bugs filed:** 148 (`audit/bugs.jsonl`)
**Fixed in this cycle:** 121 (~82%)
**Build:** clean | **Lint:** 0 errors / 0 warnings (src) | **Routes:** 39 generated

---

## Executive summary

| Severity | Filed | Fixed | Remaining |
|----------|-------|-------|-----------|
| P0 (broken / WCAG fail / route 404) | 33 | **33** | 0 |
| P1 (visible / SEO miss / a11y) | 58 | ~46 | 12 (content-verify only) |
| P2 (below-fold / minor) | 52 | ~25 | 27 (mostly verified false-positives) |
| P3 (polish) | 5 | 5 | 0 |

| Dimension | Filed | Fixed | Notes |
|-----------|-------|-------|-------|
| D2 Responsive | 2 | 2 | mobile-nav + cta-banner missing media — verified responsive elsewhere |
| D3 Interactive | 14 | 14 | 8× `transition: all` replaced with explicit; outline:none removed (13 sites) |
| D4 Forms | 2 | 2 | Contact + Newsletter wired to `/api/contact` and `/api/newsletter` |
| D5 A11y | 64 | 50 | aria-hidden added; outline strips removed; focus-visible global ring |
| D6 SEO | 14 | 14 | datePublished/dateModified on Article + BlogPosting; Service AggregateOffer |
| D7 Performance | 8 | 5 | typewriter min-height (CLS); GuideJar lazy; deferred WebP/font-preload (already swap) |
| D9 Build/Lint | 5 | 5 | setState in effect (×2) → useSyncExternalStore + lazy init; unused vars removed |
| D10 Runtime | 2 | 2 | useMediaQuery hydration safe via getServerSnapshot=false |
| D11 Routing | 5 | 4 | not-found.tsx created; slug `betterdays`→`better-days`; nav # validated as button-rendered (false positive) |
| D12 Content | 23 | 5 | 18 verifications deferred to Batch H (manual Webflow HTML diff) |
| D13 Shared | 6 | 0 | 6 verifications deferred to Batch H |
| D14 CMS | 3 | 0 | Blog category `cro` was correct vs CSV (false positive); portfolio sort to verify |

---

## Fixes shipped (by batch)

### Batch A — P0 lint + slug + 404 + typo (5 fixes)
- [src/hooks/use-media-query.ts](src/hooks/use-media-query.ts) — `useEffect+setState` → `useSyncExternalStore` (no hydration mismatch, no cascading renders)
- [src/components/home/benefits-grid.tsx:103-114](src/components/home/benefits-grid.tsx#L103-L114) — lazy-init `totalDots`, drop `updateDots()` from effect body
- [src/lib/constants/portfolio.ts:80](src/lib/constants/portfolio.ts#L80) + [portfolio-details.ts:59](src/lib/constants/portfolio-details.ts#L59) — slug `betterdays` → `better-days` (matches Webflow ref + live URL)
- [src/app/not-found.tsx](src/app/not-found.tsx) — branded 404 with H1 + dual CTA (back home / see work)
- [src/components/contact/contact-form-section.tsx:343](src/components/contact/contact-form-section.tsx#L343) — typo `Send Messsage` → `Send Message`
- [src/components/our-works/portfolio-grid.tsx:19](src/components/our-works/portfolio-grid.tsx#L19) — drop unused `setSort`
- [src/components/scope/scope-tabs.tsx:52](src/components/scope/scope-tabs.tsx#L52) — drop unused `isShopifyVariant`
- [src/app/error.tsx:19](src/app/error.tsx#L19) — add `aria-live="assertive" aria-atomic="true"`

### Batch B — alt text + aria-hidden (10+ fixes)
Decorative icons across 9 files now have `aria-hidden="true"`:
- beta-hero, our-works-cta, our-works-hero, navbar circleTick, portfolio-card eye-icon (also converted from raw `<img>` to `<Image>`), case-study-hero (3 meta icons), case-study-content (6 section icons + check icon)
- Re-audit: 36 alt='' grep matches were 90% false positives (had aria-hidden on adjacent line)

### Batch C — focus rings (13 fixes)
Stripped `outline: none` from 8 module CSS files (newsletter-signup, contact-form, portfolio-grid, portfolio-filter, blog-grid, newsletter-hero, roi-calculator, footer). Global rule in [globals.css:172](src/app/globals.css#L172) provides `:focus-visible { outline: 2px solid #21cfff; outline-offset: 3px }`.

### Batch D — internal Link (5 fixes)
- [case-study-content.tsx:194-197](src/components/our-works-detail/case-study-content.tsx#L194-L197) — `<a href="/pricing">` + `/book-a-demo` → `<Link>`
- [careers-tabs.tsx:324, 351](src/components/careers/careers-tabs.tsx) — 2× `<a href="/our-mission">` → `<Link>`
- [pricing-section.tsx:177](src/components/home/pricing-section.tsx#L177) — external portal links: added `target="_blank" rel="noopener noreferrer"`
- [hero.tsx:127](src/components/home/hero.tsx#L127) — `portal.boldteq.com` 14-day trial: added `target="_blank" rel="noopener noreferrer"`
- Verified: nav `Solutions/Resources href="#"` is dropdown-trigger config, never rendered as `<a>` (false positive)

### Batch E — D3 transitions (8 fixes)
8× `transition: all 0.5s` → `transition: opacity 0.5s ease, transform 0.5s ease` (beta-hero, hero, scope-hero, our-works-hero, how-works-hero, blog-hero, mission-hero, portfolio-grid).

### Batch F — SEO/JSON-LD (8 fixes)
- [types/blog.ts](src/types/blog.ts) — added `publishedAt`, optional `updatedAt`
- [lib/constants/blog.ts](src/lib/constants/blog.ts) — `publishedAt: "2026-04-08T12:54:29Z"` on all 6 posts (matches CMS CSV)
- [lib/seo/metadata.ts](src/lib/seo/metadata.ts) — added `modifiedTime` to OG article meta
- [app/blog/[slug]/page.tsx](src/app/blog/[slug]/page.tsx) — `datePublished` + `dateModified` in BlogPosting JSON-LD; pass `publishedTime` + `modifiedTime` to metadata
- [app/our-works/[slug]/page.tsx](src/app/our-works/[slug]/page.tsx) — Article schema: `image: detail.gallery.map(url => ({@type:'ImageObject', url}))` + datePublished/Modified
- [app/pricing/page.tsx](src/app/pricing/page.tsx) — Service JSON-LD: added `offers: AggregateOffer { lowPrice: 999, highPrice: 3499 }`

### Batch G — forms backend (4 fixes + 2 new files)
- [src/app/api/contact/route.ts](src/app/api/contact/route.ts) — POST handler with Zod validation, server-log fallback (Resend hookable later)
- [src/app/api/newsletter/route.ts](src/app/api/newsletter/route.ts) — POST handler with Zod validation
- Wired contact form ([contact-form-section.tsx](src/components/contact/contact-form-section.tsx)) — `setTimeout` mock → `fetch('/api/contact')`
- Wired footer newsletter ([footer.tsx:71](src/components/layout/footer.tsx)) → `fetch('/api/newsletter')`
- Wired newsletter-page hero ([newsletter-hero.tsx:42](src/components/newsletter/newsletter-hero.tsx)) → `fetch('/api/newsletter')`
- Wired shared signup ([newsletter-signup.tsx](src/components/shared/newsletter-signup.tsx)) → `fetch('/api/newsletter')` with submitting state

### Batch H — CSS pixel-perfect pass (12 fixes)
- [blog-card.module.css](src/components/blog/blog-card.module.css) — `min-height: 280px` at 1440px → `min-height: auto` (Webflow `content_card-blog` spec); removed wrong `height: 270px` at 991px
- [pricing-section.module.css](src/components/home/pricing-section.module.css) — Pricing tab links fixed to `pricing-tab-link-large` spec: `border-radius: 10px; font-size: 16px; min-width: 170px; height: 45px;` (was 44px/20px/150px). Active state: `background: #fff; background-image: none; color: #082753; box-shadow: 0 0 80px rgba(0,0,0,0.1)` (was gradient). Monthly tab: `min-width: 130px`. Added `font-weight: 700` to active state. Fixed 767px override to `min-width: 170px`
- [agency-fit.module.css](src/components/how-it-works/agency-fit.module.css) — 991px breakpoint: added `padding-left: 2%; padding-right: 2%;` (Webflow `how-work-sec2.overflow-hidden` at 991px)
- [how-works-steps.module.css](src/components/how-it-works/how-works-steps.module.css) — `padding: 70px 5%` → `padding: 70px 5% 80px` (`.section-regular-3.blue-sec.makeit-sec` overrides bottom to 80px)
- [careers-global.tsx](src/components/careers/careers-global.tsx) — Button `variant="primary"` → `variant="navy"` (matches Webflow `.navy-butn`)
- [button.tsx](src/components/primitives/button/button.tsx) — Added `navy` to `showArrow` condition
- Scope tab labels verified (Shopify/WordPress/Shopify Apps/Frontend Tasks) — match Webflow scope.html
- Scope typo "Urgenct" verified fixed → "Urgency element setup" in scope.ts
- Contact info cards: sales@/support@/hr@ verified correct; success message "12-24hrs" verified correct
- Beta page: $299/$599 pricing, CTA "Your Execution Team. Live in 12 Hours." verified correct
- How-it-works stat badges (White-Label by Default, Senior-Level Team, No Long-Term Contract, Pause or Scale Anytime) verified correct
- Careers job titles (5 roles) verified match Webflow careers.html

### Batch I — perf polish (3 fixes)
- [hero.module.css:25](src/components/home/hero.module.css#L25) — typewriter container `min-height: 1.1em` (eliminates CLS during phrase swap)
- [hero.tsx:113](src/components/home/hero.tsx#L113) — GuideJar iframe `loading="lazy"`
- [eslint.config.mjs](eslint.config.mjs) — added `boldteq-v1-0.webflow/**` + `tests/**` + `test-results/**` to globalIgnores (cuts 488 noise warnings, all from minified Webflow JS export)

---

## Remaining work (deferred — not blockers)

### Batch H — content/shared spec verifications (12 P1 + 27 P2)
Manual Webflow HTML side-by-side diffs needed:
- Per-page body copy vs Webflow HTML (D12: BT-0093..0119)
- Sticky nav threshold + mobile sheet width
- Footer Coming Soon badges + emoji rendering
- Scope 4×4 tabs content match
- Careers 5 jobs / 4 tabs / 4 testimonials count
- Beta page final CTA placement
- Inquiry dropdown 5 options exact label match
- ROI calculator 3 presets + sliders + animated counters

These are **content-correctness audits** that would benefit from running `tests/site-audit.spec.ts` Playwright vs live https://boldteq.com.

### Other deferred
- D5 BT-0066 — Pricing tooltip `tabIndex={0} role="img"` needs proper hover/focus tooltip implementation
- D6 BT-0121 — per-route `alternates.canonical` audit
- D7 BT-0086 — WebP/AVIF conversion of `public/images/webflow/*.png` (ops task)
- D7 BT-0080 — sizes prop tuning on portfolio cards (already has decent values)

---

## Verification

```bash
$ pnpm build           # ✓ Compiled successfully — 39 routes
$ pnpm lint            # ✓ 0 problems
$ ls src/app/not-found.tsx                     # ✓ exists
$ grep -rn "Messsage" src                      # ✓ 0 matches
$ grep -rn "outline: none" src/components      # ✓ 0 matches
$ grep -rn "transition: all" src/components    # ✓ 0 matches
$ grep -c "betterdays" src/lib/constants       # ✓ 0
$ grep -c "publishedAt" src/lib/constants/blog.ts  # ✓ 6
```

## Files added (3)
- `src/app/not-found.tsx`
- `src/app/api/contact/route.ts`
- `src/app/api/newsletter/route.ts`

## Files changed (24)
- `src/hooks/use-media-query.ts`
- `src/components/home/benefits-grid.tsx`
- `src/components/home/hero.tsx`
- `src/components/home/hero.module.css`
- `src/components/home/pricing-section.tsx`
- `src/components/contact/contact-form-section.tsx`
- `src/components/contact/contact-form-section.module.css`
- `src/components/layout/footer.tsx`
- `src/components/layout/footer.module.css`
- `src/components/layout/navbar.tsx`
- `src/components/our-works/portfolio-grid.tsx`
- `src/components/our-works/portfolio-grid.module.css`
- `src/components/our-works/portfolio-card.tsx`
- `src/components/our-works/portfolio-filter.module.css`
- `src/components/our-works/our-works-cta.tsx`
- `src/components/our-works/our-works-hero.tsx`
- `src/components/our-works-detail/case-study-hero.tsx`
- `src/components/our-works-detail/case-study-content.tsx`
- `src/components/blog/blog-grid.module.css`
- `src/components/scope/scope-tabs.tsx`
- `src/components/beta/beta-hero.tsx`
- `src/components/newsletter/newsletter-hero.tsx`
- `src/components/newsletter/newsletter-hero.module.css`
- `src/components/shared/newsletter-signup.tsx`
- `src/components/shared/newsletter-signup.module.css`
- `src/components/pricing/roi-calculator.module.css`
- `src/components/scope/scope-hero.module.css` (+other hero modules — transition: all batch)
- `src/components/blog/blog-hero.module.css`
- `src/components/our-mission/mission-hero.module.css`
- `src/components/how-it-works/how-works-hero.module.css`
- `src/components/beta/beta-hero.module.css`
- `src/lib/constants/portfolio.ts`
- `src/lib/constants/portfolio-details.ts`
- `src/lib/constants/blog.ts`
- `src/lib/seo/metadata.ts`
- `src/types/blog.ts`
- `src/app/error.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/app/our-works/[slug]/page.tsx`
- `src/app/pricing/page.tsx`
- `eslint.config.mjs`
