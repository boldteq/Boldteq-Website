# Boldteq Marketing Site — Webflow-to-Next.js 1:1 Conversion

## Mission
Convert the Webflow-exported Boldteq marketing site into a pixel-perfect Next.js 16 implementation. The live reference is https://boldteq.com. Every page, every section, every pixel, every interaction must match the Webflow original exactly.

## Critical Rule: READ BEFORE YOU WRITE
Before writing ANY component, you MUST:
1. Read the corresponding Webflow HTML file in `boldteq-v1-0.webflow/`
2. Read the exact CSS values from `boldteq-v1-0.webflow/css/boldteq-v1-0.webflow.css` (33,001 lines)
3. Extract exact padding, margins, font sizes, colors, border-radius, box-shadow, grid columns, responsive breakpoints
4. Use those EXACT values — do not approximate, do not use Tailwind defaults, do not guess

## Source of Truth (in priority order)
1. **Live site**: https://boldteq.com — this is what the user sees. When in doubt, Playwright-screenshot the live page and match it.
2. **Webflow HTML**: `boldteq-v1-0.webflow/*.html` — the exported markup with exact class names, content, and structure
3. **Webflow CSS**: `boldteq-v1-0.webflow/css/boldteq-v1-0.webflow.css` — every CSS value (padding, color, font-size, grid, shadow, radius, responsive breakpoints at 479px, 767px, 991px, 1280px, 1440px)
4. **CMS Data**: `CMS Data/*.csv` — portfolio items, blog posts, blog categories, portfolio categories with exact names, slugs, images, descriptions, order values

## Tech Stack (LOCKED)
- Next.js 16.2.3 (App Router) — read `node_modules/next/dist/docs/` for any API changes
- React 19, TypeScript strict, NO `any` types
- Tailwind CSS v4 + shadcn/ui for base components
- CSS Modules (`.module.css`) for page-specific styling — use exact Webflow CSS values
- Framer Motion for animations
- Embla Carousel for carousels
- Self-hosted RoobertPRO font (4 weights: 300, 400, 500, 700)
- PostHog analytics, Sentry error tracking
- Images from `cdn.prod.website-files.com` (Webflow CDN) and `public/images/webflow/`

## Project Structure
```
boldteq-v1-0.webflow/          ← REFERENCE: Webflow export (DO NOT MODIFY)
  index.html                   ← Homepage
  pricing.html                 ← Pricing page
  our-works.html               ← Portfolio page
  how-it-works.html            ← How it works
  contact.html                 ← Contact page
  beta.html                    ← Beta access page
  careers.html                 ← Careers page
  blog.html                    ← Blog listing
  our-mission.html             ← Mission/about page
  book-a-demo.html             ← Demo booking
  scope.html                   ← Service scope details
  testimonials.html            ← Testimonials
  privacy-policy.html          ← Privacy policy
  terms-of-service.html        ← Terms of service
  newsletter.html              ← Newsletter signup
  services/
    website-development.html   ← Web dev service page
    ui-ux-design.html          ← UI/UX (coming soon shell)
    graphics-design.html       ← Graphics (coming soon shell)
  our-works-pages/             ← 9 portfolio detail pages
    dabble.html, cinea.html, dog-crate.html, junoone.html,
    better-days.html, lippy-oil.html, frames-for-prints.html,
    repower-electric-supply.html, sandscents.html
  css/
    boldteq-v1-0.webflow.css   ← 33,001 lines of exact CSS values
    normalize.css               ← CSS reset
    webflow.css                 ← Webflow framework
  images/                      ← 485 image assets (all copied to public/images/webflow/)
  fonts/                       ← RoobertPRO font files (copied to public/fonts/)
  videos/                      ← Video assets

CMS Data/                      ← Webflow CMS exports
  Boldteq - Our Works - *.csv         ← 21 portfolio items (name, slug, category, image, gallery, order)
  Boldteq - Blog Posts - *.csv        ← 6 blog articles (name, slug, image, description, HTML content, category)
  Boldteq - Blog Categories - *.csv   ← 6 blog categories
  Boldteq - Portfolio Categories - *.csv ← 8 portfolio categories

src/app/                       ← Next.js pages (App Router)
src/components/                ← React components (one folder per page + shared + ui)
src/lib/constants/             ← Static data extracted from Webflow
src/lib/seo/                   ← SEO metadata utilities
src/types/                     ← TypeScript interfaces
```

## Page Map (Webflow HTML → Next.js Route)
| Webflow File | Next.js Route | Status |
|---|---|---|
| index.html | `/` | Homepage |
| pricing.html | `/pricing` | Pricing + ROI calculator |
| our-works.html | `/our-works` | Portfolio with sidebar filter + popup |
| how-it-works.html | `/how-it-works` | Process explanation |
| contact.html | `/contact` | Contact form |
| beta.html | `/beta` | Beta pricing ($299/$599) |
| careers.html | `/careers` | Job listings + team testimonials |
| blog.html | `/blog` | Blog listing with category filter |
| our-mission.html | `/our-mission` | Mission/about |
| book-a-demo.html | `/book-a-demo` | Demo booking (Calendly) |
| scope.html | `/scope` | 4-tab scope (Shopify, WordPress, Shopify Apps, Frontend) |
| testimonials.html | `/testimonials` | Client testimonials |
| privacy-policy.html | `/privacy-policy` | Legal |
| terms-of-service.html | `/terms-of-service` | Legal |
| newsletter.html | `/newsletter` | Newsletter signup |
| services/website-development.html | `/services/website-development` | Full service page |
| services/ui-ux-design.html | `/services/ui-ux-design` | Coming soon |
| services/graphics-design.html | `/services/graphics-design` | Coming soon |
| — | `/services/app-development` | Coming soon |
| our-works-pages/*.html | `/our-works/[slug]` | 9 portfolio detail pages |

## Design System (from Webflow CSS)
```
Colors:
  --navy:           #092245 / #082753
  --cyan:           #21cfff
  --blue:           #019ae6
  --gradient:       linear-gradient(90deg, #21cfff, #019ae6)
  --white:          #ffffff
  --light-bg:       #f5f7fa
  --text-primary:   #082753
  --text-secondary: #2b2b2b / #5b616e
  --text-muted:     #6b7280 / #9ca3af
  --border-cyan:    rgba(33, 207, 255, 0.23)
  --green-badge:    #18c958
  --orange-tag:     #ff8a65

Typography (Roobert PRO):
  h1: 3.125rem (50px), weight 700
  h2: 40px, weight 700, line-height 45px
  h3: 1.53rem, weight 700
  para: 1.125rem (18px), line-height 28px
  para-small: 16px
  button: 1rem (16px), weight 700

Spacing:
  Section padding: varies per page — always read the Webflow CSS
  Container max-width: 1280px (general), 1300px (portfolio)
  Border-radius: 10px (inputs), 15px (cards), 20px (large cards), 999px (pills)
  Box-shadow: 0 0 5px rgba(0,0,0,0.1) (cards), 0 0 80px rgba(0,0,0,0.1) (pricing tabs)

Responsive breakpoints:
  >= 1440px  (large desktop)
  >= 1280px  (desktop)
  <= 991px   (tablet)
  <= 767px   (mobile)
  <= 479px   (small mobile)
```

## Component Architecture Pattern
Each page gets its own component folder:
```
src/components/[page-name]/
  [section-name].tsx           ← Component
  [section-name].module.css    ← CSS Module with EXACT Webflow values
```

### CSS Module Rules
- Extract values directly from `boldteq-v1-0.webflow.css` — search for the Webflow class name
- Include ALL responsive breakpoints from the Webflow CSS (min-width: 1280px, 1440px AND max-width: 991px, 767px, 479px)
- Use `font-family: 'Roobert PRO', Arial, sans-serif` everywhere
- Use `composes:` for shared base styles within a module
- Match box-shadow, border, border-radius, padding exactly — never approximate

### Component Rules
- Use `next/image` with `fill` mode for responsive images, explicit `width`/`height` for fixed icons
- Set `sizes` prop accurately based on the grid column width
- Use `loading="eager"` and `priority` for above-fold images on page 1
- All interactive components are `"use client"` — keep server components for page shells
- Extract static data into `src/lib/constants/` TypeScript files
- Type everything — no `any`, use proper interfaces

## Shared Components (appear on every/most pages)
These are extracted from the Webflow `<section class="footer">` and popup HTML that repeats across every page:

### Navbar (`src/components/layout/navbar.tsx`)
- Sticky on scroll (trigger at 300px desktop, 350px mobile)
- Solutions dropdown: Web Development (link), UI/UX Design (Coming Soon), Graphic Design (Coming Soon), App Development (Coming Soon)
- Custom solution link: "View Full Service Scope" → /scope
- Resources dropdown: Blog, Help Center (help.boldteq.com)
- CTA: Login (portal.boldteq.com) + Schedule Demo (/book-a-demo)
- Mobile: hamburger → slide-out sheet (300px, #082753 bg)

### Footer (`src/components/layout/footer.tsx`)
- Newsletter card (left) with email input + "Get Started" button
- 4 link columns: About, Services, Resources, Help
- Coming Soon badges on disabled links (UI/UX, Graphics, Affiliate)
- Logo + social icons (LinkedIn, Instagram, Facebook)
- Copyright: "Designed with ❤️ from India" + 🇮🇳

### Beta Popup (`src/components/shared/beta-cta.tsx`)
- Appears at bottom of most pages
- Left panel: "🔒 Exclusive Access" + 4 checkmark benefits
- Right panel: "Founding Partner Pricing" + urgency (15 agencies) + CTA buttons
- Also appears as modal popup (close on ✕, Escape, overlay click)

### Newsletter Signup (`src/components/shared/newsletter-signup.tsx`)
- Appears above BetaCta on most pages
- Email input + submit + privacy guarantee line

### CTA Banner (`src/components/shared/cta-banner.tsx`)
- Navy background, customizable title/subtitle/buttons
- Default: "Ready to Deliver This Level of Work Under Your Brand?"
- Padding: `40px 20px 50px` (matches live Webflow)

## Page-Specific Critical Details

### Homepage (index.html → `/`)
- Hero: Trustpilot badge, animated typewriter ("Ownership Driven", "Without Hiring", "On Demand"), h2 then h1, 3 trust badges, GuideJar embed, Schedule Demo + 14-Day Trial CTAs
- Featured logos: infinite scroll CSS animation (Forbes, Entrepreneur, Inc., etc.)
- Portfolio carousel: Embla carousel with 4 categories
- Pain points: 3 cards with large images
- Resolution banner: blue card with inline team image
- Built For: 4 numbered agency stages
- Benefits grid: 6 cards with images
- How It Works: 3 steps with screenshots (blue bg)
- Pricing: Monthly/Quarterly/Annual toggle, 3 plans ($999/$1999/$3499), comparison table
- Comparison: Traditional vs Boldteq (2-column)
- FAQ: 8 items accordion with help center links

### Pricing (pricing.html → `/pricing`)
- Reuses PricingSection from homepage
- Custom Plan CTA: "Need Something More Flexible?"
- ROI Calculator: presets (Startup/Growth/Enterprise), sliders, animated counters

### Our Works (our-works.html → `/our-works`)
- Hero with 4 trust badges
- Filter header bar: search + active filter tags (horizontal, above grid)
- Sidebar (305px fixed) + 2-col card grid (1fr 1fr)
- Cards: image-only (title/tags hidden), white bg, 20px radius, category badge top-left, eye icon bottom-right
- Image heights: 280px default, 400px at >=1280px, 450px at >=1440px
- Click card → popup modal (iframe for detail pages, image gallery for others)
- Pagination: 8 items/page, numbered buttons (44px, #1a3a6e active)
- Categories: Shopify, WordPress (active) + 5 Coming Soon (disabled)

### Beta (beta.html → `/beta`)
- Different pricing from main site: Beta Lite $299/mo, Beta Pro $599/mo
- Bug report card + Add-on hours card
- "How it works" 3-step section
- "Who It's Built For" 3-segment section
- CTA: "Your Execution Team. Live in 12 Hours."

### Contact (contact.html → `/contact`)
- 3 info cards: Sales (sales@boldteq.com), Support (support@boldteq.com), Career (hr@boldteq.com)
- Form: First Name, Last Name, Email, Phone, "What Are You Looking For?" dropdown (Start a New Project, Agency Partnership, Technical or Account Support, Join Our Team, General Inquiry), Message
- Success: "Thank you! Your submission has been received! Our team will get back to you within 12-24hrs."

### Scope (scope.html → `/scope`)
- 4 platform tabs: Shopify, WordPress, Shopify Apps, Frontend
- Each platform: 4 tier tabs (Small/Medium/Large/Support) with color-coded cards
- Extensive card content from Webflow — read scope.html carefully

### Careers (careers.html → `/careers`)
- 4-step selection process
- Tabbed content: About, Culture, Benefits, Opportunities
- 5 job listings with responsibilities/requirements
- Benchmarks section with percentages
- "Voices from Boldteq" 4 team testimonials
- "Global Impact" section

### How It Works (how-it-works.html → `/how-it-works`)
- Hero with 4 stat badges + GuideJar embed
- Agency Fit: 3-column (Your Agency / Boldteq / Your Client)
- 3-step process with screenshots
- 4-step detailed workflow
- "Designed to Remove Risk" section: 4 cards (White-Label, Dedicated Team, Turnaround, QA)

## SEO Requirements
- Every page: unique `<title>`, `<meta description>`, Open Graph tags
- Structured data (JSON-LD): Organization schema on all pages, FAQPage on homepage, Service+Offers on pricing
- Google verification: `JlE0J7GQIyTbyMqTli7Z0EOoLHC08lyX-cdkTY9iRLI`
- Canonical URLs with `metadataBase: new URL("https://boldteq.com")`
- Sitemap via next-sitemap
- All images: descriptive `alt` text, proper `sizes` attribute
- Semantic HTML: proper heading hierarchy (h1 → h2 → h3), landmark regions, ARIA labels

## Validation Workflow
After building any page:
1. `pnpm build` — must compile with 0 errors
2. Playwright screenshot comparison at 1440px viewport:
   - Section count matches
   - Card dimensions within ±5px
   - Image heights match breakpoint values
   - Sidebar width matches (305px for portfolio)
   - Pagination text matches
3. Test all interactive elements: filters, toggles, popups, forms, carousels
4. Mobile test at 375px and 768px widths
5. Compare against live https://boldteq.com side-by-side

## What NOT to Do
- Do NOT use Tailwind utility classes for layout/spacing that should match Webflow exactly — use CSS Modules with exact values
- Do NOT approximate colors, padding, or font sizes — extract from the Webflow CSS
- Do NOT add features, sections, or elements that don't exist on the live site
- Do NOT use `any` type, `@ts-ignore`, or `console.log` in production code
- Do NOT create new pages that don't exist in the Webflow export
- Do NOT modify files in `boldteq-v1-0.webflow/` — that's the read-only reference
- Do NOT use Vercel, Stripe, Prisma, NextAuth, Pages Router, npm/yarn
