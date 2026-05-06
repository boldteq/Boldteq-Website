export type TierKey = "small" | "medium" | "large" | "support";

export type PlatformVariant = "shopify" | "wordpress" | "shopify-apps" | "frontend";

export interface ServiceCard {
  label: string;
  heading: string;
  items: string[];
}

export interface Tier {
  key: TierKey;
  icon: string;
  name: string;
  description: string;
  timeframe: string;
  cards: ServiceCard[];
}

export interface Platform {
  key: string;
  label: string;
  icon: string;
  iconVariant: PlatformVariant;
  name: string;
  description: string;
  badge: string;
  tiers: Tier[];
}

export const SCOPE_PLATFORMS: Platform[] = [
  {
    key: "shopify",
    label: "Shopify",
    icon: "S",
    iconVariant: "shopify",
    name: "Shopify Services",
    description:
      "Complete white-label Shopify delivery — from quick fixes to full store builds. Your clients get world-class work. They never need to know we exist.",
    badge: "eCommerce Expert",
    tiers: [
      {
        key: "small",
        icon: "⚡",
        name: "Small Tasks",
        description:
          "Quick, precise fixes that keep your client's store polished and performing. Delivered in under 3 hours so you never miss a deadline.",
        timeframe: "Under 3 hrs",
        cards: [
          {
            label: "Design & Layout",
            heading: "Visual Fixes That Convert",
            items: [
              "CSS styling fixes & overrides",
              "Font, color & spacing updates",
              "Mobile responsiveness fixes",
              "Section alignment & padding adjustments",
              "Button & CTA styling corrections",
            ],
          },
          {
            label: "Content Updates",
            heading: "Keep Your Store Fresh",
            items: [
              "Product descriptions & page edits",
              "Collection page content updates",
              "Homepage banner & image swaps",
              "Text, pricing & translation changes",
              "Announcement bar updates",
            ],
          },
          {
            label: "Bug Fixes",
            heading: "Zero Tolerance for Broken",
            items: [
              "Fix broken links, buttons & redirects",
              "Cart & checkout UI fixes",
              "App styling & display corrections",
              "Header, footer & nav bar fixes",
              "Cross-browser compatibility patches",
            ],
          },
          {
            label: "Basic SEO",
            heading: "Get Found on Google",
            items: [
              "Meta titles & descriptions setup",
              "Image compression & optimization",
              "Alt tag & schema markup setup",
              "URL structure cleanup",
            ],
          },
        ],
      },
      {
        key: "medium",
        icon: "🔧",
        name: "Medium Tasks",
        description:
          "Feature builds and conversion improvements that move the needle. Structured execution, delivered in 3–12 hours with full QA review before it reaches you.",
        timeframe: "3–12 hrs",
        cards: [
          {
            label: "Theme Customization",
            heading: "Custom Storefront Experiences",
            items: [
              "Custom product page templates",
              "High-converting landing pages",
              "Mega menu design & development",
              "Custom section blocks (Liquid)",
              "Collection page layout redesign",
            ],
          },
          {
            label: "App Integration",
            heading: "Power Your Store with the Right Tools",
            items: [
              "App installation & configuration",
              "Subscription & recurring billing setup",
              "Product bundle & bundle builder setup",
              "Review platform integration (Judge.me)",
              "Upsell & cross-sell app setup",
            ],
          },
          {
            label: "Conversion Optimization",
            heading: "Turn Visitors into Buyers",
            items: [
              "Sticky Add-to-Cart bar setup",
              "Cart drawer & slide-out customization",
              "Trust badges & social proof placement",
              "Checkout flow improvements",
              "Urgency element setup",
            ],
          },
          {
            label: "Automation",
            heading: "Work Smarter, Not Harder",
            items: [
              "Klaviyo / Omnisend email automation",
              "Abandoned cart & win-back flows",
              "Post-purchase automation setup",
              "Inventory & restock alerts",
            ],
          },
        ],
      },
      {
        key: "large",
        icon: "🚀",
        name: "Large Tasks",
        description:
          "End-to-end Shopify builds, migrations and custom development — for agencies with clients who need serious eCommerce infrastructure, delivered on time.",
        timeframe: "12+ hrs",
        cards: [
          {
            label: "Complete Store Builds",
            heading: "Launch-Ready from Day One",
            items: [
              "Full Shopify store setup from scratch",
              "Pixel-perfect theme development from Figma",
              "Navigation, UI & UX structure planning",
              "Payment gateway & shipping configuration",
              "Product catalog setup & SEO foundation",
            ],
          },
          {
            label: "Custom Development",
            heading: "Limitless Shopify Capabilities",
            items: [
              "Advanced Liquid templating & customization",
              "Custom Liquid sections, templates & logic",
              "Custom metafield & metaobject structures",
              "Subscription & custom checkout logic",
              "Fully QA-tested",
            ],
          },
          {
            label: "Store Migration",
            heading: "Zero Data Loss. Zero Downtime.",
            items: [
              "WooCommerce to Shopify full migration",
              "WordPress to Shopify",
              "Product, order & customer data transfer",
              "301 redirect mapping & SEO preservation",
              "Post-migration QA & validation",
            ],
          },
          {
            label: "Performance Optimization",
            heading: "Faster Store. Higher Revenue.",
            items: [
              "Advanced Lighthouse & Core Web Vitals fixes",
              "Image lazy-loading & next-gen formats",
              "Script / app bloat removal",
              "CDN & asset delivery optimization",
              "Mobile performance audit & fix",
            ],
          },
        ],
      },
      {
        key: "support",
        icon: "🔄",
        name: "Ongoing Support",
        description:
          "Your dedicated Shopify backend team — running in the background every month so you can focus on winning clients while we handle delivery.",
        timeframe: "Monthly retainer",
        cards: [
          {
            label: "Monthly Maintenance",
            heading: "Your Store Never Stands Still",
            items: [
              "Bug fixes & emergency patches",
              "App, theme & Shopify version updates",
              "Regular content & product updates",
              "Monthly health check report",
              "Security & uptime monitoring",
            ],
          },
          {
            label: "Growth Retainer",
            heading: "Continuous CRO & Performance",
            items: [
              "Monthly conversion rate audit & fixes",
              "A/B testing design & implementation",
              "Performance monitoring & improvements",
              "New feature rollouts & seasonal updates",
              "Priority task queue — your work ships first",
            ],
          },
        ],
      },
    ],
  },
  {
    key: "wordpress",
    label: "WordPress",
    icon: "W",
    iconVariant: "wordpress",
    name: "WordPress Services",
    description:
      "White-label WordPress & WooCommerce delivery your clients will rave about. Custom themes, plugins, performance, and ongoing maintenance — all under your brand.",
    badge: "CMS Expert",
    tiers: [
      {
        key: "small",
        icon: "⚡",
        name: "Small Tasks",
        description:
          "Fast turnaround WordPress fixes that your clients notice immediately — without disrupting live sites or causing downtime.",
        timeframe: "Under 3 hrs",
        cards: [
          {
            label: "Design & Layout",
            heading: "Pixel-Perfect Visual Fixes",
            items: [
              "CSS / custom code styling fixes",
              "Font, color & spacing adjustments",
              "Mobile & tablet responsiveness fixes",
              "Block editor (Gutenberg) layout fixes",
              "Elementor / Divi / Bricks UI adjustments",
            ],
          },
          {
            label: "Content Updates",
            heading: "Keep Content Current & Accurate",
            items: [
              "Page copy & content edits",
              "Image, banner & media updates",
              "Blog post formatting & publishing",
              "Menu & navigation text changes",
              "Team, portfolio & testimonial updates",
            ],
          },
          {
            label: "Bug Fixes",
            heading: "Fix It Before the Client Sees It",
            items: [
              "Plugin conflict & white screen fixes",
              "Broken links, forms & buttons",
              "404 errors & redirect issues",
              "Widget & sidebar display fixes",
              "Contact form & email delivery fixes",
            ],
          },
          {
            label: "Basic SEO",
            heading: "Built for Search from the Start",
            items: [
              "Yoast / Rank Math setup & configuration",
              "Meta titles, descriptions & OG tags",
              "Image alt tags & compression",
              "XML sitemap & robots.txt setup",
            ],
          },
        ],
      },
      {
        key: "medium",
        icon: "🔧",
        name: "Medium Tasks",
        description:
          "Structured WordPress development that adds real value — custom templates, plugin builds, WooCommerce enhancements and CRO improvements delivered in 3–12 hours.",
        timeframe: "3–12 hrs",
        cards: [
          {
            label: "Theme Customization",
            heading: "Custom WordPress Experiences",
            items: [
              "Custom page templates (PHP/Gutenberg/Elementor)",
              "Header, footer & sidebar redesigns",
              "Custom post type display templates",
              "Landing page design & build",
              "Child theme creation & customization",
            ],
          },
          {
            label: "Plugin & WooCommerce",
            heading: "Extend WordPress the Right Way",
            items: [
              "Plugin installation, setup & configuration",
              "WooCommerce product & catalog setup",
              "Payment gateway integration",
              "Subscription plugin setup (WooSubscriptions)",
              "Membership & access control configuration",
            ],
          },
          {
            label: "Conversion Optimization",
            heading: "More Leads from the Same Traffic",
            items: [
              "Lead form & landing page optimization",
              "Popup & exit-intent setup",
              "CTA placement & copy improvements",
              "WooCommerce cart abandonment reduction",
              "Trust signal & social proof setup",
            ],
          },
          {
            label: "Automation",
            heading: "Automate the Repetitive Stuff",
            items: [
              "Mailchimp / ActiveCampaign integration",
              "Automation flow setup & testing",
              "CRM connection & lead routing",
              "Zapier / Make workflow setup",
            ],
          },
        ],
      },
      {
        key: "large",
        icon: "🚀",
        name: "Large Tasks",
        description:
          "Full WordPress builds, custom plugin development and complex WooCommerce stores — built with senior-level expertise and delivered with white-label QA.",
        timeframe: "12+ hrs",
        cards: [
          {
            label: "Complete Site Builds",
            heading: "WordPress Sites That Win Clients",
            items: [
              "Full WordPress site build from scratch",
              "Pixel-perfect Figma to WordPress development",
              "Custom theme development (no page builder)",
              "Multi-language & multisite setup",
              "Full on-page SEO foundation setup",
            ],
          },
          {
            label: "Custom Plugin Development",
            heading: "WordPress Without Limits",
            items: [
              "Custom WordPress plugin development",
              "Third-party CRM / ERP integrations",
              "Advanced Custom Fields (ACF) builds",
              "Gutenberg custom block development",
            ],
          },
          {
            label: "WooCommerce Builds",
            heading: "eCommerce That Scales",
            items: [
              "Full WooCommerce store setup & configuration",
              "Custom WooCommerce templates & checkout",
              "Multi-vendor marketplace setup",
              "Platform migration to WooCommerce",
              "Advanced shipping & tax configuration",
            ],
          },
          {
            label: "Performance Optimization",
            heading: "Fastest WordPress Sites. Proven.",
            items: [
              "Full Core Web Vitals audit & remediation",
              "Database optimization & cleanup",
              "Caching stack setup (Redis, WP Rocket, Cloudflare)",
              "Image pipeline & CDN configuration",
              "Hosting migration to optimized stack",
            ],
          },
        ],
      },
      {
        key: "support",
        icon: "🔄",
        name: "Ongoing Support",
        description:
          "Monthly WordPress care that keeps sites fast, secure and growing — handled by your white-label backend team without you lifting a finger.",
        timeframe: "Monthly retainer",
        cards: [
          {
            label: "Monthly Maintenance",
            heading: "Security, Stability & Speed",
            items: [
              "WordPress core, plugin & theme updates",
              "Security scanning & malware removal",
              "Daily backup management & restore testing",
              "Uptime monitoring & incident response",
              "Monthly site performance report",
            ],
          },
          {
            label: "Growth Retainer",
            heading: "Your Clients Keep Growing. You Keep Winning.",
            items: [
              "Monthly CRO improvements & testing",
              "New page builds & content additions",
              "SEO monitoring & on-page improvements",
              "Feature additions & plugin upgrades",
              "Priority queue — your tasks ship first",
            ],
          },
        ],
      },
    ],
  },
  {
    key: "shopify-apps",
    label: "Shopify Apps",
    icon: "S",
    iconVariant: "shopify-apps",
    name: "Shopify Apps Development",
    description:
      "Custom Shopify app development that extends functionality and creates unique experiences. From private apps to public marketplace launches \u2014 we build scalable, merchant-focused solutions.",
    badge: "eCommerce Expert",
    tiers: [
      {
        key: "small",
        icon: "\u26A1",
        name: "Small Tasks",
        description:
          "Quick app modifications, bug fixes, and minor feature additions that keep your Shopify apps running smoothly.",
        timeframe: "Under 3 hrs",
        cards: [
          {
            label: "UI/UX Fixes",
            heading: "App UI/UX Fixes",
            items: [
              "Component styling fixes",
              "Mobile responsiveness improvements",
              "Admin panel layout adjustments",
              "Toast notification & banner updates",
              "Loading state & error message improvements",
            ],
          },
          {
            label: "Content Updates",
            heading: "Keep Your Store Fresh",
            items: [
              "Product descriptions & page edits",
              "Collection page content updates",
              "Homepage banner & image swaps",
              "Text, pricing & translation changes",
              "Announcement bar updates",
            ],
          },
          {
            label: "Bug Fixes",
            heading: "Zero Tolerance for Broken",
            items: [
              "Fix broken links, buttons & redirects",
              "Cart & checkout UI fixes",
              "App styling & display corrections",
              "Header, footer & nav bar fixes",
              "Cross-browser compatibility patches",
            ],
          },
          {
            label: "Basic SEO",
            heading: "Get Found on Google",
            items: [
              "Meta titles & descriptions setup",
              "Image compression & optimization",
              "Alt tag & schema markup setup",
              "URL structure cleanup",
            ],
          },
        ],
      },
      {
        key: "medium",
        icon: "\uD83D\uDD27",
        name: "Medium Tasks",
        description:
          "Feature builds and conversion improvements that move the needle. Structured execution, delivered in 3\u201312 hours with full QA review before it reaches you.",
        timeframe: "3\u201312 hrs",
        cards: [
          {
            label: "Theme Customization",
            heading: "Custom Storefront Experiences",
            items: [
              "Custom product page templates",
              "High-converting landing pages",
              "Mega menu design & development",
              "Custom section blocks (Liquid)",
              "Collection page layout redesign",
            ],
          },
          {
            label: "App Integration",
            heading: "Power Your Store with the Right Tools",
            items: [
              "App installation & configuration",
              "Subscription & recurring billing setup",
              "Product bundle & bundle builder setup",
              "Review platform integration (Judge.me)",
              "Upsell & cross-sell app setup",
            ],
          },
          {
            label: "Conversion Optimization",
            heading: "Turn Visitors into Buyers",
            items: [
              "Sticky Add-to-Cart bar setup",
              "Cart drawer & slide-out customization",
              "Trust badges & social proof placement",
              "Checkout flow improvements",
              "Urgency element setup",
            ],
          },
          {
            label: "Automation",
            heading: "Work Smarter, Not Harder",
            items: [
              "Klaviyo / Omnisend email automation",
              "Abandoned cart & win-back flows",
              "Post-purchase automation setup",
              "Inventory & restock alerts",
            ],
          },
        ],
      },
      {
        key: "large",
        icon: "\uD83D\uDE80",
        name: "Large Tasks",
        description:
          "End-to-end Shopify app builds, migrations, and custom development \u2014 for agencies with clients who need serious app infrastructure, delivered on time.",
        timeframe: "12+ hrs",
        cards: [
          {
            label: "Idea to App Store",
            heading: "Full App Development",
            items: [
              "Complete Shopify app build from scratch",
              "React + Node.js architecture",
              "Shopify Polaris UI implementation",
              "Database design & setup (MongoDB/PostgreSQL)",
              "App Store submission & approval process",
            ],
          },
          {
            label: "Private/Custom Apps",
            heading: "Tailored Solutions for Unique Needs",
            items: [
              "Custom merchant app development",
              "Enterprise workflow automation",
              "Complex business logic implementation",
              "Multi-store data synchronization",
              "Advanced inventory management systems",
            ],
          },
          {
            label: "App Migration & Upgrade",
            heading: "Modernize Your Existing App",
            items: [
              "Legacy app modernization",
              "Migration to Shopify App Bridge 3.0",
              "REST to GraphQL migration",
              "Database architecture improvements",
              "Performance optimization & scaling",
            ],
          },
          {
            label: "Subscription & Billing",
            heading: "Monetize Your App Effectively",
            items: [
              "Shopify Billing API integration",
              "Multi-tier pricing implementation",
              "Usage-based billing setup",
              "Free trial & upgrade flows",
              "Payment webhook handling",
            ],
          },
        ],
      },
      {
        key: "support",
        icon: "\uD83D\uDD04",
        name: "Ongoing Support",
        description:
          "Your dedicated Shopify app backend team \u2014 running in the background every month so you can focus on winning clients while we handle delivery.",
        timeframe: "Monthly retainer",
        cards: [
          {
            label: "Monthly Maintenance",
            heading: "Your App Never Stands Still",
            items: [
              "Bug fixes & emergency patches",
              "App, theme & Shopify version updates",
              "Regular content & product updates",
              "Monthly health check report",
              "Security & uptime monitoring",
            ],
          },
          {
            label: "Growth Retainer",
            heading: "Continuous CRO & Performance",
            items: [
              "Monthly conversion rate audit & fixes",
              "A/B testing design & implementation",
              "Performance monitoring & improvements",
              "New feature rollouts & seasonal updates",
              "Priority task queue \u2014 your work ships first",
            ],
          },
        ],
      },
    ],
  },
  {
    key: "frontend",
    label: "Frontend Tasks",
    icon: "F",
    iconVariant: "frontend",
    name: "Frontend Development Services",
    description:
      "Modern, responsive, and performant web interfaces built with the latest technologies. From landing pages to complex web applications \u2014 we deliver pixel-perfect frontend experiences.",
    badge: "CMS Expert",
    tiers: [
      {
        key: "small",
        icon: "\u26A1",
        name: "Small Tasks",
        description:
          "Quick UI fixes and minor enhancements that improve user experience and visual polish.",
        timeframe: "Under 3 hrs",
        cards: [
          {
            label: "UI/UX Fixes",
            heading: "Visual Excellence in Every Pixel",
            items: [
              "CSS styling & layout corrections",
              "Responsive design fixes (mobile/tablet)",
              "Cross-browser compatibility patches",
              "Button, form & navigation styling",
              "Typography & spacing adjustments",
            ],
          },
          {
            label: "Component Updates",
            heading: "Keep Your UI Components Fresh",
            items: [
              "React/Vue component modifications",
              "Props & state management fixes",
              "Component styling updates",
              "Icon & image replacements",
              "Text content & copy updates",
            ],
          },
          {
            label: "Interactive Elements",
            heading: "Engage Users Effectively",
            items: [
              "Modal & popup implementations",
              "Dropdown & tooltip additions",
              "Hover & animation effects",
              "Click event handlers",
              "Form validation improvements",
            ],
          },
          {
            label: "Accessibility Fixes",
            heading: "Inclusive Design for Everyone",
            items: [
              "ARIA label additions",
              "Keyboard navigation fixes",
              "Color contrast improvements",
              "Screen reader optimization",
              "Focus state enhancements",
            ],
          },
        ],
      },
      {
        key: "medium",
        icon: "\uD83D\uDD27",
        name: "Medium Tasks",
        description:
          "Feature-rich components, page builds, and integrations that elevate your web application\u2019s functionality and design.",
        timeframe: "3\u201312 hrs",
        cards: [
          {
            label: "Page Development",
            heading: "Beautiful Pages That Convert",
            items: [
              "Landing page development from design",
              "Multi-section page layouts",
              "Hero sections & CTAs",
              "Feature showcase sections",
              "Testimonial & pricing sections",
            ],
          },
          {
            label: "Component Library",
            heading: "Build Once, Reuse Everywhere",
            items: [
              "Reusable component development",
              "Design system implementation",
              "Custom UI component creation",
              "Component library organization",
            ],
          },
          {
            label: "API Integration",
            heading: "Connect Frontend to Backend",
            items: [
              "REST API integration",
              "GraphQL query implementation",
              "State management (Redux/Zustand)",
              "Error handling & loading states",
              "Data fetching optimization",
            ],
          },
          {
            label: "Forms & Validation",
            heading: "User Input Done Right",
            items: [
              "Multi-step form implementation",
              "Client-side validation (Formik/React Hook Form)",
              "File upload functionality",
              "Form submission handling",
              "Input masking & formatting",
            ],
          },
        ],
      },
      {
        key: "large",
        icon: "\uD83D\uDE80",
        name: "Large Tasks",
        description:
          "Complete web applications and complex frontend systems built with modern frameworks and best practices.",
        timeframe: "12+ hrs",
        cards: [
          {
            label: "Full Application Development",
            heading: "Production-Ready Web Apps",
            items: [
              "Complete React/Next.js application",
              "Vue/Nuxt.js application development",
              "SPA (Single Page Application) build",
              "PWA (Progressive Web App) setup",
              "Authentication & routing implementation",
            ],
          },
          {
            label: "Figma to Code",
            heading: "Pixel-Perfect Design Implementation",
            items: [
              "Complete Figma design conversion",
              "Responsive breakpoint implementation",
              "Animation & micro-interaction setup",
              "Component-based architecture",
            ],
          },
          {
            label: "Dashboard & Admin Panels",
            heading: "Data-Driven Interfaces",
            items: [
              "Complete admin dashboard development",
              "Table & grid implementations",
              "Real-time data updates",
              "User management interfaces",
            ],
          },
          {
            label: "Performance Optimization",
            heading: "Lightning-Fast Web Experiences",
            items: [
              "Core Web Vitals optimization",
              "Code splitting & lazy loading",
              "Image optimization & WebP conversion",
              "Bundle size reduction",
              "Lighthouse score improvements",
            ],
          },
        ],
      },
      {
        key: "support",
        icon: "\uD83D\uDD04",
        name: "Ongoing Support",
        description:
          "Continuous frontend maintenance, feature additions, and performance monitoring to keep your web application cutting-edge.",
        timeframe: "Monthly retainer",
        cards: [
          {
            label: "Monthly Maintenance",
            heading: "Keep Your Frontend Modern",
            items: [
              "Framework & dependency updates",
              "Security vulnerability patches",
              "Browser compatibility testing",
              "Bug fixes & troubleshooting",
              "Monthly performance audits",
            ],
          },
          {
            label: "Continuous Improvement",
            heading: "Evolution Never Stops",
            items: [
              "Monthly feature additions",
              "UX/UI enhancements",
              "A/B testing implementation",
              "Analytics & tracking updates",
              "Performance optimization iterations",
            ],
          },
        ],
      },
    ],
  },
];
