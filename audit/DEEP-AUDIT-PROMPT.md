# Boldteq — Pixel-Perfect Deep Audit Prompt v2

## Mission
Find 1000+ pixel-perfect defects across the entire Boldteq marketing site. Every bug must be **actionable** — file path, line number, Webflow value, local value, exact fix. No vague findings. No false positives.

## Source of truth (strict priority)
1. `boldteq-v1-0.webflow/*.html` — structure, class names, element order, copy
2. `boldteq-v1-0.webflow/css/boldteq-v1-0.webflow.css` — exact CSS values (33,001 lines)
3. Live `https://boldteq.com` — final visual authority when refs conflict
4. `CMS Data/*.csv` — data correctness

## How to generate 1000+ bugs per page group

### CSS EXTRACTION METHOD (highest yield — 400+ bugs)
For every component module.css file:
1. Find every Webflow class used in the matching HTML
2. Extract exact values from boldteq-v1-0.webflow.css: padding, margin, font-size, line-height, letter-spacing, font-weight, color, background, border-radius, box-shadow, max-width, gap, grid-template-columns
3. Compare against local module.css
4. Every mismatch = 1 bug

### RESPONSIVE METHOD (200+ bugs)
Webflow has 5 breakpoints: `>=1440px`, `>=1280px`, `<=991px`, `<=767px`, `<=479px`
For every section, extract ALL @media rules from webflow.css.
Compare against local module.css @media rules.
Missing breakpoint = bug. Wrong value at breakpoint = bug.

### STRUCTURE METHOD (100+ bugs)
Compare HTML element structure:
- Section order matches scroll order
- Element types match (div vs section vs article vs nav)
- Class hierarchy preserved
- Missing wrapper divs that affect layout
- Extra wrapper divs not in Webflow
- Heading levels (h1/h2/h3/h4) match

### CONTENT METHOD (100+ bugs)
Every string of text:
- Exact copy (punctuation, casing, em-dashes, apostrophes, spacing)
- Exact href values
- Exact image src paths
- Exact alt text
- Missing text nodes

### INTERACTION METHOD (50+ bugs)
- Hover states missing or wrong values
- Focus states missing
- Transition duration/easing wrong
- Animation timing wrong
- Transform values wrong

### A11Y + SEO METHOD (100+ bugs)
- Missing ARIA labels
- Wrong heading hierarchy per section
- Missing role attributes
- Wrong meta values
- Missing structured data fields

## Output format per bug

```jsonl
{
  "id": "SP{sprint}-{n:04d}",
  "sprint": 1,
  "page": "/",
  "section": "hero",
  "component": "src/components/home/hero.module.css",
  "line": 45,
  "category": "css|structure|content|responsive|interaction|a11y",
  "severity": "P0|P1|P2|P3",
  "title": "hero padding-top: 4rem vs Webflow 6.25rem",
  "webflow_ref": "boldteq-v1-0.webflow.css:1234 .section-high-judge { padding-top: 6.25rem }",
  "local_ref": "hero.module.css:49 padding-top: 4rem",
  "fix": "Change padding-top from 4rem to 6.25rem",
  "minutes": 2
}
```

## Sprint organization

| Sprint | Pages | Target bugs |
|--------|-------|------------|
| SP1 | Homepage `/` | 120 |
| SP2 | `/pricing` | 80 |
| SP3 | `/our-works` | 80 |
| SP4 | `/how-it-works` | 70 |
| SP5 | `/contact` + `/book-a-demo` + `/newsletter` | 70 |
| SP6 | `/beta` + `/scope` | 80 |
| SP7 | `/careers` + `/our-mission` | 70 |
| SP8 | `/blog` + `/blog/[slug]` | 60 |
| SP9 | `/testimonials` + legal + services | 60 |
| SP10 | `/our-works/[slug]` (case studies) | 80 |
| SP11 | Shared: navbar + footer + beta-cta + newsletter-signup | 100 |
| SP12 | Globals: globals.css + layout.tsx + responsive + a11y | 100 |

**TOTAL TARGET: 1050+**

## Critical CSS classes to always check

From Webflow index.html class inventory:
- `.padding-section-large`, `.padding-section`, `.padding-global` — padding values
- `.heading-h1`, `.heading-h2`, `.heading-h3`, `.heading-h4` — typography
- `.container-large`, `.container`, `.max-width-large` — widths
- `.margin-*`, `.padding-*` — spacing utilities
- `.text-*`, `.font-*` — text styles
- `.grid-*`, `.flex-*` — layout
- Every component-specific class (e.g. `.hero-wrapper`, `.nav-23-*`)

## Execution instructions for agents

1. Read the Webflow HTML file completely
2. Extract every unique CSS class
3. For each class, grep webflow.css for the definition
4. Extract: padding, margin, font-size, line-height, letter-spacing, font-weight, color, background, border-radius, box-shadow, max-width, min-height, width, height, gap, grid-template-columns, display, flex-direction, align-items, justify-content
5. Find the matching element in local Next.js component
6. Find the corresponding CSS in local module.css
7. Compare every value
8. Emit bug for every mismatch
9. Also check structure: do the same elements exist? Same order?
10. Check responsive: does local have @media rules for all 5 Webflow breakpoints?
