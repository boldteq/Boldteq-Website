# Inconsistency Audit — Boldteq Marketing Site

Generated 2026-04-27. Scope: 192 source files, all 18 pages.

---

## 1. Raw hex colors in CSS modules — 452 occurrences

| Color | Count | Should be |
|---|---|---|
| `#fff` | 226 | `var(--color-surface)` or `var(--color-text-on-dark)` |
| `#082753` | 170 | `var(--color-text-primary)` / `var(--color-surface-dark)` |
| `#21cfff` | 146 | `var(--color-brand-cyan)` |
| `#019ae6` | 136 | `var(--color-brand-blue)` |
| `#2b2b2b` | 78 | `var(--color-text-secondary)` |
| `#092245` | 61 | `var(--color-brand-navy)` |
| `#05bafe` | 59 | `var(--color-brand-cyan)` (alias) |
| `#000` | 33 | `#000` legitimate or `var(--color-text-primary)` |
| `#009ce0` | 24 | `var(--color-brand-card-border)` |
| `#def4ff` | 21 | new token `--color-success-bg` |
| `#21cfff12` | 17 | `var(--color-accent-bg)` |
| `#effafe` | 13 | new token `--color-cyan-tint` |
| `#0000001a` | 11 | `rgba(0,0,0,0.1)` → `var(--shadow-card)` |
| `#6b7280` | 10 | `var(--color-text-subtle)` |
| `#e6f7ff` | 9 | new token `--color-info-bg` |
| `#111827` | 9 | `var(--color-brand-dark)` |
| `#ef4444` | 8 | new token `--color-danger` |
| `#9ca3af` | 7 | new token `--color-border-subtle-2` |

**Fix**: token replacement pass (mechanical sed). Phase 0.5.

---

## 2. Box shadows — 25 different values, 4 represent 90% of usage

| Shadow | Count | Status |
|---|---|---|
| `0 0 5px rgba(0,0,0,0.1)` | 36 | use `var(--shadow-card)` |
| `0 0 5px #0000001a` | 11 | identical to above — collapse |
| `0 0 80px rgba(175,175,175,0.1)` | 3 | new `--shadow-card-soft` |
| `0 0 0 3px rgba(33,207,255,0.15)` | 3 | new `--shadow-focus-ring` |
| `0 4px 20px rgba(1,154,230,0.1)` | 2 | new `--shadow-card-cyan` |
| 14 one-off variants | 14 | retire — collapse to 6 tokens |

**Fix**: extend shadow tokens, replace inline with vars.

---

## 3. Border radius — 20 different values, must normalize to 8 tokens

| Radius | Count | → Token |
|---|---|---|
| `20px` | 73 | `--radius-3xl` |
| `10px` | 67 | `--radius-l` |
| `0.75rem` (12px) | 32 | `--radius-xl` |
| `15px` | 22 | `--radius-2xl` |
| `8px` | 19 | `--radius-m` |
| `12px` | 9 | `--radius-xl` |
| `7px` | 8 | → `--radius-m` (round to 8) |
| `5px` | 8 | → `--radius-s` (round to 6) |
| `16px` | 8 | new `--radius-2xl-alt` or merge into 15px |
| `9px` | 6 | → `--radius-m` (round to 8) |
| `100px` | 5 | `--radius-pill` |
| `50px` | 4 | `--radius-pill` |
| `14px` | 4 | → `--radius-2xl` |
| `13px` | 4 | → `--radius-xl` |
| `999px` | many | `--radius-pill` |

**Fix**: bucket all radii into 8 tokens; document exceptions per Webflow source.

---

## 4. Font sizes — 25+ values, must bucket to 9 tokens

| Size | Count | → Token |
|---|---|---|
| `16px` | 97 | `--text-base` |
| `14px` | 73 | `--text-sm` |
| `12px` | 56 | `--text-xs` |
| `40px` | 52 | `--text-3xl` |
| `1rem` | 47 | `--text-base` |
| `15px` | 38 | merge to 14 or 16 |
| `18px` | 31 | `--text-md` |
| `13px` | 25 | merge to 12 or 14 |
| `1.125rem` (18px) | 24 | `--text-md` |
| `28px` | 23 | new `--text-2xl-alt` or merge to 32 |
| `20px` | 21 | `--text-lg` |
| `34px` | 13 | merge to 32 |
| `22px` | 12 | merge to 24 |
| `1.5rem` (24px) | 12 | `--text-xl` |
| `25px` | 10 | merge to 24 |
| `35px` | 9 | merge to 32 |
| `23px` | 9 | merge to 24 |
| `1.9rem` | 6 | merge to 32 |

**Fix**: type scale enforcement. Heading primitive resolves most.

---

## 5. Button-like duplicate classes — 25+ found

```
.billingBtn, .billingBtnActive
.btn-primary, .btnPrimary, .btnSecondary
.ctaBtn, .ctaButton
.clearBtn, .closeBtn, .closeButton, .continueBtn
.emptyBtn, .planBtn, .platformBtn, .presetBtn, .submitBtn
.gallery-13-button.button-left, .gallery-13-button.button-right
.nav-23-menu-button
.tabButtonText
.a-gulf-book, .a-except-get  (hero)
.button-secondary-large  (navbar login)
.sky-button, .sky-button.padding-less  (cards CTAs)
.navy-button  (services)
```

**Fix**: every consumer migrates to `<Button variant=... />` primitive. Phase 3.

Target reduction: 25 hand-rolled → 0.

---

## 6. Badge-like duplicate classes — 13 found

```
.cg-soon, .cmg-soon
.coming-soon-badge, .header-comingsoon-badge, .comingSoonBadge, .comingSoonText
.coming-soon-out  (wrapper for badge)
.comingSoonCheckbox, .comingSoonLabel
.how-work-badge, .how-work-tag-badge
.inn-badge-text
.news-pill
```

**Fix**: every consumer migrates to `<Badge variant=... />` primitive.

Target reduction: 13 hand-rolled → 0.

---

## 7. Heading classes — 25+ inconsistent variants

```
.heading, .heading2, .heading-2, .heading-2-news, .heading-3, .heading-3-purple,
.heading-3-orange, .heading-3-green, .heading-3-green-light, .heading-grid-small,
.heading2WhiteHeading
.h1-season-seeing  (hero h1)
.h3, .h4, .h3-heading-5
.h6Heading3, .h6Heading5PlanName, .h3Heading3
.eyebrowText, .eyebrowBadge
.section-eyebrow
```

**Fix**: NEW `Heading` primitive — variants `h1 | h2 | h3 | h4 | eyebrow`, tones `default | on-dark | gradient`.

---

## 8. Container max-widths — 14 different values

```
1280, 1320, 80rem (1280), 1199, 1120 (70rem), 800, 720, 680, 640, 53rem (848), 500, 480
```

**Fix**: 4 sizes only (narrow 800 / default 1280 / wide 1320 / fluid). Container primitive enforces.

---

## 9. Icon wrappers — duplicate patterns

```
.iconWrap                     (cards)
.cont-icon-primary            (utility)
.shield-icon                  (footer)
.statIcon                     (careers)
.icon-box  (?)
.icon-button-outline-large    (carousel arrows)
.icon-regular                 (badge in pill)
```

**Fix**: NEW `IconBox` primitive — variants `square-gradient | square-tint | circle-tint | pill-cyan`, sizes `sm | md | lg`.

---

## 10. Stat / counter patterns — repeated 5+ times

```
.statBadge, .statBadgeText, .statIcon, .statLabel, .statsRow  (careers)
.benchmark-sec                                                (careers benchmarks)
ROI calculator counters                                       (pricing)
3 hero trust badges                                           (home, beta, careers, etc.)
```

**Fix**: NEW `Stat` primitive — wraps icon + label + (optional) value. Used by hero trust badges, benchmarks, careers stats.

---

## 11. Inline color literals in TSX — 20+ instances

Pattern:
```tsx
<div style={{ color: "#082753", backgroundColor: "#21cfff14" }}>
```

**Fix**: every inline `style={{color}}` moves to CSS module class. Page files have zero inline color/spacing/font-size after refactor.

---

## 12. Z-index inconsistencies

Already tokenized as `--z-modal: 9999999`, `--z-nav: 999999`, etc. Some legacy raw values remain in 5 components.

**Fix**: grep & replace pass.

---

## Action Plan

### Phase 1.4 — Token expansion (this turn)
- [ ] Add `--shadow-card-soft`, `--shadow-focus-ring`, `--shadow-card-cyan` to globals.css
- [ ] Add `--color-success-bg`, `--color-cyan-tint`, `--color-info-bg`, `--color-danger`, `--color-danger-fg` to globals.css
- [ ] Document accepted radii / font-size buckets in tokens section

### Phase 1.5 — New primitives (this turn)
- [ ] `Heading` — h1/h2/h3/h4/eyebrow + tones
- [ ] `IconBox` — square-gradient / square-tint / circle-tint / pill-cyan + sizes
- [ ] `Stat` — icon + label + optional value

### Phase 1.6 — Codemod sweep (next turn, scriptable)
- [ ] Replace all hex literals in CSS modules with tokens (mechanical, 452 replacements via mapping)
- [ ] Replace all inline `style={{color}}` in TSX files with CSS module classes
- [ ] Replace all duplicate shadow values with tokens
- [ ] Verify Playwright diff ≤ 2% per page

### Phase 1.7 — Class deletion sweep (with consumer migration in Phase 3)
- [ ] Once consumers use `Button` / `Badge` / `Heading` / `IconBox` / `Stat`, delete legacy `.btn-primary`, `.coming-soon-badge`, etc.

---

## Acceptance Criteria

| Metric | Before | Target |
|---|---|---|
| Raw hex literals in CSS modules | 452 | < 30 (legitimate exceptions) |
| Distinct box-shadow values | 25 | ≤ 6 |
| Distinct border-radius values | 20 | ≤ 8 |
| Distinct font-size values | 25+ | ≤ 9 |
| Hand-rolled button classes | 25+ | 0 |
| Hand-rolled badge classes | 13 | 0 |
| Hand-rolled heading classes | 25+ | 0 |
| Inline style colors in TSX | 20+ | 0 |
