# Boldteq Marketing Site — Deep Refactor Spec

**Mission:** Convert the page-by-page section soup into a typed, token-driven, primitive-first design system. Zero visual regression vs live https://boldteq.com. Every brand value lives in ONE place. Every repeating UI pattern is ONE component used in many places. Production-grade quality bar throughout.

---

## 1. Scope — what the refactor must touch

### 1.1 Pages audited (18 routes)
- `/` (homepage with 11 sections)
- `/pricing`, `/our-works`, `/our-works/[slug]`, `/how-it-works`
- `/contact`, `/beta`, `/careers`, `/book-a-demo`
- `/blog`, `/blog/[slug]`, `/our-mission`, `/scope`
- `/services/website-development`, `/services/ui-ux-design`, `/services/graphics-design`, `/services/app-development`
- `/testimonials`, `/newsletter`, `/privacy-policy`, `/terms-of-service`
- `/not-found`, `/error`

### 1.2 Layers in scope
1. **Design tokens** — color, type, spacing, radius, shadow, motion
2. **Primitives** — `Button`, `Badge`, `Card`, `Input`, `Textarea`, `Field`, `Select`, `Checkbox`, `Container`, `Section`, `Stack`, `Cluster`, `Grid`
3. **Patterns** — `PageHero`, `FeatureCard`, `BenefitCard`, `LogoStrip`, `StatCard`, `TestimonialCard`, `FaqAccordion`, `CtaBanner`, `NewsletterCard`, `BetaCta`, `ProcessSteps`, `ComparisonTable`
4. **Layouts** — `Navbar`, `Footer`, `MobileNav`, `BannerStrip`
5. **Pages** — composition only; zero per-page CSS unless genuinely unique

---

## 2. Non-negotiables (acceptance criteria)

### 2.1 Tokens (must)
- Every color used by components comes from `--color-*` CSS variables. No hex literals in `.module.css` outside `globals.css`.
- Every font-family declaration uses `var(--font-roobert)`. Zero raw `'Roobert PRO'` strings in component CSS.
- Spacing scale: `--space-1` … `--space-24` (4px base). Component CSS uses these only. No bare px/rem for spacing.
- Radius scale: `--radius-sm/md/lg/xl/2xl/pill` (4/8/12/16/20/9999).
- Shadow scale: `--shadow-card`, `--shadow-card-hover`, `--shadow-popover`, `--shadow-glow`.
- Breakpoints: `--bp-sm/md/lg/xl/2xl` mapped to Webflow's 479/767/991/1280/1440.

### 2.2 Primitives (must)
- Single `Button` component covers 5 current variants:
  - `<Button variant="primary">` ≡ `.btn-primary` / `.a-gulf-book`
  - `<Button variant="secondary">` ≡ `.button-secondary-large`
  - `<Button variant="outline">` ≡ `.a-except-get`
  - `<Button variant="sky">` ≡ `.sky-button` (gradient pill)
  - `<Button variant="ghost">` (text-only nav links)
  - Sizes: `sm | md | lg`
  - Polymorphic `as` prop (renders `<a>`, `<Link>`, `<button>` based on `href`)
- Single `Badge` covers Coming Soon, Trustpilot, status pills, "Join 500+" pill. Variants: `default | success | warning | sky-gradient | outline`.
- Single `Card` covers feature card, info card, benefit card, testimonial card, blog card. Slots: `header | media | body | footer`. Variants: `elevated | flat | outlined | gradient-bg`.
- Single `Field` (label + input + helper + error) wraps `<Input>` / `<Textarea>` / `<Select>`. Replaces hand-rolled form patterns in `/contact`, `/newsletter`, footer.
- Single `Section` (semantic `<section>` + `<Container>` + `<SectionHeader>` slots) replaces the 50+ ad-hoc section wrappers.

### 2.3 Patterns (must)
- `PageHero` — variants: `home | inner | service | legal`. One component, prop-driven content.
- `FeatureGrid` — receives `items: FeatureItem[]`, columns prop, renders `<Card>` per item.
- `LogoStrip` — receives `logos: Logo[]`, animated/static prop.
- `ProcessSteps` — receives `steps: Step[]`, layout prop (`numbered | screenshot`).
- `ComparisonTable` — receives `rows: ComparisonRow[]`, two columns labelled by props.
- `CtaBanner` — single component, replaces home + pricing + how-it-works variants.
- `FaqAccordion` — receives `items: FaqItem[]`, controlled or uncontrolled.

### 2.4 Type safety (must)
- Zero `any`, zero `@ts-ignore`, zero `@ts-expect-error`.
- Every primitive exports a `Props` interface.
- Every pattern exports a `Props` interface AND a corresponding data-shape interface in `src/types/`.
- Page files import data from `src/lib/constants/*` only. No inline content arrays in page files.

### 2.5 Performance (must)
- LCP < 2.5s, CLS < 0.05, INP < 200ms on homepage at 1440px viewport.
- Above-the-fold images use `priority` + `sizes`.
- Every below-fold image is `loading="lazy"`.
- No CSS module > 300 lines (signal of insufficient decomposition).
- No component file > 250 lines (extract patterns).
- Bundle: framer-motion only loaded on pages that animate (dynamic import where possible).

### 2.6 Accessibility (must)
- Every interactive element has accessible name.
- Color contrast ≥ 4.5:1 for text, ≥ 3:1 for UI.
- Focus visible on every focusable element via `:focus-visible` token.
- Keyboard navigation works for navbar, mobile sheet, dialogs, accordions, dropdowns, carousels.
- Reduced-motion respected via `@media (prefers-reduced-motion: reduce)` in token layer.
- Skip-to-content link present.

### 2.7 SEO (must)
- Every page has unique `<title>`, meta description, OG tags via `generateMetadata` or static `export const metadata`.
- JSON-LD: Organization on layout, FAQPage on home, Service on service pages, BlogPosting on blog posts, BreadcrumbList on inner pages.
- Canonical URL, sitemap, robots.txt all valid.

### 2.8 Webflow visual parity (must)
- Side-by-side Playwright screenshot diff at 1440px, 991px, 767px, 479px viewports — pixel-diff ≤ 2% per page.
- All Webflow class names from `boldteq-v1-0.webflow.css` honored in spirit (matching values), not by class-name copy.

---

## 3. Architecture target

### 3.1 New folder layout
```
src/
  app/
    layout.tsx                ← Roboto load, providers, metadata
    page.tsx                  ← composition only
    [route]/page.tsx          ← composition only
    api/
      contact/route.ts
      newsletter/route.ts
  components/
    primitives/               ← NEW — atoms
      button/
        button.tsx
        button.module.css
        button.types.ts
      badge/
      card/
      input/
      textarea/
      field/
      select/
      checkbox/
      container/
      section/
      stack/
      cluster/
      grid/
      icon/
    patterns/                 ← NEW — molecules
      page-hero/
      feature-grid/
      logo-strip/
      process-steps/
      comparison-table/
      cta-banner/
      faq-accordion/
      newsletter-card/
      beta-cta/
      testimonial-grid/
      pricing-table/
      contact-form/
      stat-card/
    layouts/                  ← navbar, footer, mobile-nav, banner-strip
      navbar/
      footer/
      mobile-nav/
      banner-strip/
    pages/                    ← page-specific compositions (only when truly bespoke)
      home/
      pricing/
      our-works/
      ...
  lib/
    constants/                ← typed content data
    seo/
    analytics/
    sanity/
    tokens.ts                 ← design tokens as TS export (mirrors CSS vars)
    cn.ts                     ← className helper
  styles/
    tokens.css                ← all CSS variables
    base.css                  ← resets, font-face, body defaults
    globals.css               ← imports tokens + base + tailwind
  types/
    content.ts                ← shared content shapes
    nav.ts
    blog.ts
    portfolio.ts
```

### 3.2 Component contract (every component follows)
```tsx
// button.types.ts
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'sky' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;            // when present, renders <Link>
  external?: boolean;       // when href + external, renders <a target=_blank>
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

// button.tsx
export function Button({ variant = 'primary', size = 'md', href, ... }: ButtonProps) { ... }
```

### 3.3 Naming conventions
- Files: `kebab-case.tsx`, `kebab-case.module.css`, `kebab-case.types.ts`
- Exports: `PascalCase` for components, `camelCase` for hooks/utils, `SCREAMING_SNAKE` for constants
- CSS: BEM-ish in modules — `.button`, `.button--primary`, `.button__icon` (camelCase or kebab; pick ONE — kebab to align with current modules)
- Class lookup in JSX: bracket notation for hyphenated keys: `styles['button--primary']`

---

## 4. Migration plan (incremental, ship-per-step, no big-bang)

### Phase 0 — Tokens layer (1 commit)
- [ ] Extract every brand color from CSS modules → `src/styles/tokens.css`
- [ ] Extract spacing scale, radius scale, shadow scale, breakpoints
- [ ] Replace raw values across CSS modules with `var(--*)` (use ripgrep + sed; verify Playwright diff)
- [ ] Replace `'Roobert PRO', Arial, sans-serif` everywhere with `var(--font-roobert)`

### Phase 1 — Primitives (3 commits)
- [ ] **Commit 1.1**: `Button` (5 variants, 3 sizes, polymorphic) + migrate navbar, hero, footer, all CTAs site-wide
- [ ] **Commit 1.2**: `Badge` + migrate all "Coming Soon", trust badges, "Join 500+", status pills
- [ ] **Commit 1.3**: `Card`, `Container`, `Section`, `Stack`, `Cluster`, `Grid`, `Field`, `Input`, `Textarea` + migrate every consumer

### Phase 2 — Patterns (4 commits)
- [ ] **Commit 2.1**: `PageHero` — replace home + 17 inner page heros
- [ ] **Commit 2.2**: `FeatureGrid` + `BenefitsGrid` + `LogoStrip` + `ProcessSteps`
- [ ] **Commit 2.3**: `CtaBanner` + `NewsletterCard` + `BetaCta` + `FaqAccordion`
- [ ] **Commit 2.4**: `PricingTable` + `ComparisonTable` + `TestimonialGrid` + `ContactForm`

### Phase 3 — Page recomposition (1 commit per page, 18 commits)
For each page:
- Delete `src/components/[page]/*` files
- Rewrite `src/app/[page]/page.tsx` as composition of patterns + primitives
- All content imports from `src/lib/constants/[page].ts`
- Keep ONLY genuinely unique sections in `src/components/pages/[page]/`
- Run Playwright visual diff, fix to ≤ 2% delta

### Phase 4 — Quality gate (1 commit)
- [ ] `pnpm typecheck` — zero errors
- [ ] `pnpm lint` — zero warnings
- [ ] `pnpm build` — production build succeeds
- [ ] Lighthouse on homepage: Performance ≥ 95, A11y = 100, BP = 100, SEO = 100
- [ ] Bundle size budget: First Load JS ≤ 180KB on `/`
- [ ] Playwright visual regression suite for all 18 pages at 4 viewports

---

## 5. Hard rules during refactor

1. **One change per commit** — Phase 0 tokens, Phase 1 primitives, etc. Each commit ships green.
2. **Visual diff before/after every commit** — Playwright at 1440px on `/`, `/pricing`, `/our-works`, `/contact`. ≤ 2% delta.
3. **No new `any` types** — TS strict stays strict.
4. **No new dependencies without justification** — current stack is locked.
5. **Webflow CSS values stay sacred** — when migrating, copy the Webflow source values, don't approximate.
6. **Production-grade error handling** — every form, every fetch, every navigation has error states + loading states + empty states.
7. **No console.logs, no commented-out code, no `// eslint-disable` shortcuts** — clean diff or no diff.
8. **No CSS module > 300 lines** — if it grows past, extract a pattern.
9. **No component > 250 lines** — same rule.
10. **Tokens win over Tailwind utilities** — Tailwind for layout glue (flex, grid, gap), tokens via CSS modules for brand values. Don't sprinkle `text-[#082753]` — use `color: var(--color-brand-navy-deep)`.

---

## 6. What's explicitly out of scope

- New page additions or content rewrites (this is structural refactor only).
- Backend / API rewrites (contact + newsletter routes stay as-is until ESP is wired).
- CMS migration (Sanity wiring stays as-is).
- Mobile app, dark mode (light mode only for now per current design).
- Full i18n (single locale).
- Auth (none on marketing site).

---

## 7. Verification checklist (run after EVERY commit)

```bash
pnpm typecheck                  # zero TS errors
pnpm lint                        # zero lint warnings
pnpm build                       # production build green
pnpm dev                         # local works, no console errors
```

Manual smoke at 1440px, 991px, 767px, 479px:
- Homepage hero loads, typewriter cycles, CTAs work
- Solutions dropdown opens, links navigate
- Footer newsletter accepts email, returns success
- Mobile sheet opens, all links navigate, body scroll-locks
- Beta popup opens via banner CTA, closes on overlay/esc/✕
- All 4 portfolio carousels swipe + autoplay
- FAQ accordions open/close on click + keyboard
- Pricing toggle (monthly/quarterly/annual) updates prices
- ROI calculator preset buttons + sliders update output

Lighthouse on `/`, `/pricing`, `/our-works`:
- Performance ≥ 95
- Accessibility = 100
- Best Practices = 100
- SEO = 100

---

## 8. Output of this refactor

A codebase where:
- Adding a new page = composing existing patterns, ~30 lines of TSX, ~0 lines of new CSS.
- Changing brand color = editing one line in `tokens.css`.
- Adding a new button variant = adding one CSS rule + one prop value.
- Future agents (Koda, Vega, Pixel) can ship features 3–5× faster because primitives + patterns are stable.
- Production-grade across performance, accessibility, SEO, type safety, visual fidelity.
