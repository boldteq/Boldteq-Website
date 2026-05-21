import type { PortfolioDetail } from "@/types/portfolio";

export const PORTFOLIO_DETAILS: PortfolioDetail[] = [
  {
    slug: "cinea",
    platform: "Shopify",
    title: "Premium Brand Shopify Redesign with Checkout Optimisation",
    meta: {
      role: "Lead Shopify Developer",
      teamSize: "3 Members",
      duration: "1 Month",
    },
    challenge:
      "Cinea's existing Shopify store looked outdated and failed to communicate the premium feel of their brand. A complete redesign was needed — without disrupting the live store.",
    solution:
      "We designed and developed a new custom Shopify theme with editorial-style layouts, dynamic product displays and a streamlined multi-step checkout. Every design decision was rooted in conversion data — reducing friction at each stage of the buyer journey.",
    implementation: [
      "Full custom Shopify theme build — editorial layouts, premium typography",
      "Dynamic product display with colour & variant switching",
      "Streamlined checkout flow — fewer steps, higher completion rate",
      "Brand identity cohesion across all pages and components",
    ],
    impact: [
      {
        value: "48%",
        label: "Add-to-Cart Rate",
        description: "Increase after redesign",
      },
      {
        value: "-34%",
        label: "Bounce Rate",
        description: "Homepage improvement",
      },
      {
        value: "+27%",
        label: "Checkout Completion",
        description: "Reduced drop-off",
      },
      {
        value: "4 weeks",
        label: "Delivery Time",
        description: "Full redesign & QA",
      },
    ],
    keyFeatures: [
      "Custom premium theme from scratch",
      "Dynamic product variant display",
      "Optimised multi-step checkout",
      "Full brand identity system",
    ],
    techStack: ["Shopify", "Liquid", "JavaScript", "CSS", "Figma"],
    gallery: [
      "/images/webflow/cdn/69aaae99f3e11e64fe731430_Home_Client.png",
      "/images/webflow/cdn/69aab08fe64fc4b6ce7d0851_21.png",
      "/images/webflow/cdn/69aab00138b4184464328e7b_33.png",
    ],
  },
  {
    slug: "better-days",
    platform: "Shopify",
    title: "Wellness Brand — Emotional Storytelling Shopify Store",
    meta: {
      role: "Lead Shopify Developer",
      teamSize: "4 Members",
      duration: "2 weeks",
    },
    challenge:
      "BetterDays sells optimism — but their store was transactional and flat. Repeat purchase rate was critically low.",
    solution:
      "We built a mission-first Shopify store with warm visual language, brand storytelling sections, community UX and a high-converting email capture flow.",
    implementation: [
      "Brand story & mission sections on homepage and about page",
      "Community UGC section and customer story carousel",
      "Email capture popup with Klaviyo welcome flow",
      "Post-purchase loyalty flow to drive repeat visits",
    ],
    impact: [
      {
        value: "58%",
        label: "Email Signups",
        description: "First 30 days",
      },
      {
        value: "+47%",
        label: "Repeat Purchases",
        description: "Within 90 days",
      },
      {
        value: "+36%",
        label: "Avg Session Time",
        description: "Storytelling impact",
      },
      {
        value: "2 weeks",
        label: "Delivery Time",
        description: "Full build & QA",
      },
    ],
    keyFeatures: [
      "Mission & brand story sections",
      "Community UGC & customer story blocks",
      "Email capture with Klaviyo welcome flow",
      "Post-purchase loyalty automation",
    ],
    techStack: ["Shopify", "Liquid", "JavaScript", "Klaviyo", "Figma"],
    gallery: [
      "/images/webflow/cdn/69a6db42f4e03ca908276246_Home__1).png",
      "/images/webflow/cdn/69a6db42f4e03ca908276246_Home__1).png",
      "/images/webflow/cdn/69a6db42f4e03ca908276246_Home__1).png",
    ],
  },
  {
    slug: "dabble",
    platform: "Shopify",
    title: "High-Converting Shopify Store Optimization",
    meta: {
      role: "Lead Shopify Developer",
      teamSize: "5 Members",
      duration: "4 Months",
    },
    challenge:
      "The client's Shopify store faced low conversion rates, poor mobile performance, and a high cart abandonment rate — limiting revenue despite steady incoming traffic.",
    solution:
      "We redesigned the Shopify theme, optimised store performance, and streamlined the checkout flow — delivering a faster, conversion-focused shopping experience built entirely within Shopify.",
    implementation: [
      "Performed a full Shopify store audit covering UX, page speed, and checkout flow analysis.",
      "Developed a custom Shopify theme using Liquid, aligned with the brand and optimised for conversions.",
      "Improved Shopify store speed through image optimisation, lazy loading, and app script management.",
      "Integrated Shopify-native upsell features, Klaviyo email flows, and improved collection filtering.",
    ],
    impact: [
      {
        value: "38%",
        label: "Conversion Increase",
        description: "Within 90 days",
      },
      {
        value: "52%",
        label: "Page Speed Improvement",
        description: "Mobile performance score",
      },
      {
        value: "27%",
        label: "Higher AOV",
        description: "With upsell & bundling",
      },
      {
        value: "21%",
        label: "Cart Abandonment Reduced",
        description: "Checkout optimization",
      },
    ],
    keyFeatures: [
      "Custom Shopify theme development",
      "Advanced filtering & product recommendations",
      "Core Web Vitals improvement",
      "Email automation & upsell integration",
    ],
    techStack: ["Shopify", "Liquid", "JavaScript", "CSS", "Klaviyo"],
    gallery: [
      "/images/webflow/cdn/699e90f3f234b8ab10cb61d1_Group_1261153274__1).png",
      "/images/webflow/cdn/699e90f3f234b8ab10cb61d1_Group_1261153274__1).png",
      "/images/webflow/cdn/699e90f3f234b8ab10cb61d1_Group_1261153274__1).png",
    ],
  },
  {
    slug: "dog-crate",
    platform: "Shopify",
    title: "Subscription-Based eCommerce Growth",
    meta: {
      role: "Lead Shopify Developer",
      teamSize: "4 Members",
      duration: "3 Months",
    },
    challenge:
      "The brand wanted to transition from one-time purchases to a recurring subscription model. They faced high churn rates, unclear subscription options, and low repeat purchase frequency.",
    solution:
      "We integrated a subscription app, redesigned product pages to clearly present subscription benefits, and implemented automated retention flows including reminders, rewards, and flexible subscription management.",
    implementation: [
      "Subscription model setup with flexible billing cycles",
      "UX redesign of PDP to highlight savings & benefits",
      "Email automation for renewals & churn prevention",
      "Loyalty & rewards integration for long-term retention",
    ],
    impact: [
      {
        value: "45%",
        label: "Repeat Purchase Rate",
        description: "Increase within 6 months",
      },
      {
        value: "33%",
        label: "Churn Reduction",
        description: "After optimization",
      },
      {
        value: "2.4x",
        label: "LTV Growth",
        description: "Subscription customers",
      },
      {
        value: "29%",
        label: "AOV Increase",
        description: "Bundle offers",
      },
    ],
    keyFeatures: [
      "Flexible subscription billing",
      "Customer self-manage portal",
      "Automated retention emails",
      "Loyalty & rewards integration",
    ],
    techStack: ["Shopify", "Liquid", "JavaScript", "Recharge", "Klaviyo"],
    gallery: [
      "/images/webflow/cdn/699e93b7d948db527ee77578_Group_1261153276.png",
      "/images/webflow/cdn/699e938de25837ecbec91457_Group_1261153275.png",
      "/images/webflow/cdn/699e938de25837ecbec91457_Group_1261153275.png",
    ],
  },
  {
    slug: "frames-for-prints",
    platform: "WordPress",
    title:
      "Art & Decor Brand — WooCommerce Store with Custom Frame Configurator",
    meta: {
      role: "Lead WordPress Developer",
      teamSize: "4 Members",
      duration: "4 weeks",
    },
    challenge:
      "Custom framing is a considered, high-value purchase — customers need to visualise the product before committing. Frames for Prints had a basic WooCommerce store with no product visualisation.",
    solution:
      "We built a custom WordPress/WooCommerce store with a live frame configurator, room-context mockup previews, material comparison tables and a checkout that guided customers through their selection with confidence — turning hesitant visitors into high-value buyers.",
    implementation: [
      "Custom JavaScript frame configurator — real-time preview by size & material",
      "Room mockup preview system — see frame in a living room context",
      "Material comparison table with wood grain, metal & colour swatch display",
      "Guided WooCommerce checkout with selection summary & confidence signals",
    ],
    impact: [
      {
        value: "88%",
        label: "Product Page CVR",
        description: "Configurator impact",
      },
      {
        value: "+61%",
        label: "Avg Order Value",
        description: "Upsell & material upgrades",
      },
      {
        value: "-45%",
        label: "Checkout Drop-off",
        description: "Guided selection impact",
      },
      {
        value: "4 weeks",
        label: "Delivery Time",
        description: "Full build & QA",
      },
    ],
    keyFeatures: [
      "Live frame configurator with real-time preview",
      "Room context mockup previews",
      "Material comparison tables & swatches",
      "Guided WooCommerce checkout",
    ],
    techStack: ["WordPress", "WooCommerce", "PHP", "JavaScript", "ACF"],
    gallery: [
      "/images/webflow/cdn/69aa59c5f5b790f3e020c16b_Feedback_2__1).png",
      "/images/webflow/cdn/69aa59c5f5b790f3e020c16b_Feedback_2__1).png",
      "/images/webflow/cdn/69aa59c5f5b790f3e020c16b_Feedback_2__1).png",
    ],
  },
  {
    slug: "junoone",
    platform: "Shopify",
    title: "Bundles & Subscription Revenue Optimization",
    meta: {
      role: "Lead Shopify Developer",
      teamSize: "4 Members",
      duration: "4 Months",
    },
    challenge:
      "The store was entirely dependent on one-time purchases with no recurring revenue model in place. Low average order value and minimal customer retention were limiting overall revenue growth.",
    solution:
      "We implemented a Shopify-native bundling system paired with a flexible subscription model, enabling recurring orders at preferential rates — directly improving average order value and long-term customer retention.",
    implementation: [
      "Designed high-converting product bundles including starter kits and best-seller packs",
      "Integrated Shopify-compatible subscription billing with full bundle support",
      "Implemented dynamic Subscribe & Save pricing to incentivise recurring orders",
      "Built automated Klaviyo retention flows",
    ],
    impact: [
      {
        value: "54%",
        label: "Average Order Value Increase",
        description: "Driven by strategic product bundling",
      },
      {
        value: "2.7x",
        label: "Customer Lifetime Value Growth",
        description: "Among active subscription customers",
      },
      {
        value: "37%",
        label: "Repeat Purchase Rate",
        description: "Achieved within the first 5 months",
      },
      {
        value: "31%",
        label: "Monthly Revenue from Subscriptions",
        description: "As a share of total monthly sales",
      },
    ],
    keyFeatures: [
      "Shopify bundle builder configured",
      "Subscribe & Save pricing model",
      "Automated retention & churn prevention",
      "Enhanced Shopify product pages",
    ],
    techStack: [
      "Shopify",
      "Liquid",
      "JavaScript",
      "Bundler App",
      "Subscription App",
    ],
    gallery: [
      "/images/webflow/cdn/69a677cb48fc3300a1d634c9_Mask_group__1).png",
      "/images/webflow/cdn/69a677cb48fc3300a1d634c9_Mask_group__1).png",
      "/images/webflow/cdn/69a677cb48fc3300a1d634c9_Mask_group__1).png",
    ],
  },
  {
    slug: "lippy-oil",
    platform: "WordPress",
    title: "Beauty Brand — Custom WordPress + WooCommerce Store Build",
    meta: {
      role: "Lead WordPress Developer",
      teamSize: "4 Members",
      duration: "12 Days",
    },
    challenge:
      "Lippy Oil had a strong product range but their WooCommerce store looked like a generic template. It failed to communicate their clean beauty positioning and a checkout flow that was losing mobile customers before purchase completion.",
    solution:
      "We built a fully custom WordPress theme with WooCommerce — ingredient transparency sections, dermatologist callouts, influencer review blocks and an SEO foundation targeting high-intent beauty keywords.",
    implementation: [
      "Custom WordPress theme build with clean beauty visual language",
      "Ingredient transparency & dermatologist-approved product sections",
      "On-page SEO setup with Rank Math — targeting beauty keywords",
      "WooCommerce mobile checkout optimisation",
    ],
    impact: [
      {
        value: "66%",
        label: "Organic Traffic",
        description: "Growth in 90 days",
      },
      {
        value: "+44%",
        label: "Conversion Rate",
        description: "Post-launch improvement",
      },
      {
        value: "-38%",
        label: "Mobile Drop-off",
        description: "Checkout optimisation",
      },
      {
        value: "12 days",
        label: "Delivery Time",
        description: "Full build & QA",
      },
    ],
    keyFeatures: [
      "Custom WordPress theme from scratch",
      "Ingredient transparency sections",
      "SEO foundation with Rank Math",
      "WooCommerce mobile checkout rebuild",
    ],
    techStack: ["WordPress", "WooCommerce", "PHP", "Rank Math", "Figma"],
    gallery: [
      "/images/webflow/cdn/69aa58e264d14d4a4f8aaa65_Home__Client).png",
      "/images/webflow/cdn/69aa58e264d14d4a4f8aaa65_Home__Client).png",
      "/images/webflow/cdn/69aa58e264d14d4a4f8aaa65_Home__Client).png",
    ],
  },
  {
    slug: "repower-electric-supply",
    platform: "WordPress",
    title: "B2B Industrial Brand — Lead-Generation WordPress Site",
    meta: {
      role: "Lead WordPress Developer",
      teamSize: "4 Members",
      duration: "4 weeks",
    },
    challenge:
      "Repower Electric Supply was an established B2B business with a website that worked against them — outdated design, no product catalogue structure and poor SEO for industrial buyers searching for electrical supply solutions.",
    solution:
      "We built a professional B2B WordPress site with a structured product catalogue and an industrial SEO framework targeting high-intent procurement keywords.",
    implementation: [
      "CPT-based product catalogue with specs, datasheets & brand filters",
      "Auto-acknowledgement emails",
      "Industrial SEO — keyword targeting, technical schema & site speed",
      "Bulk order enquiry flow with quantity & delivery requirement inputs",
    ],
    impact: [
      {
        value: "+145%",
        label: "Qualified Leads",
        description: "Monthly lead volume",
      },
      {
        value: "+57%",
        label: "First Purchase CVR",
        description: "New visitor conversion",
      },
      {
        value: "Top 3",
        label: "Google Rankings",
        description: "Target keywords",
      },
      {
        value: "4 weeks",
        label: "Delivery Time",
        description: "Full build & QA",
      },
    ],
    keyFeatures: [
      "CPT product catalogue with spec sheets",
      "Interactive UI/UX",
      "Industrial SEO & schema markup",
      "Bulk order enquiry flow",
    ],
    techStack: ["WordPress", "Gravity Forms", "PHP", "ACF Pro", "Figma"],
    gallery: [
      "/images/webflow/cdn/69aa5b3cfef2d1593c33491e_Home__5).png",
      "/images/webflow/cdn/69aa5b3cfef2d1593c33491e_Home__5).png",
      "/images/webflow/cdn/69aa5b3cfef2d1593c33491e_Home__5).png",
    ],
  },
  {
    slug: "sandscents",
    platform: "WordPress",
    title: "Luxury Fragrance Brand — Sensory WordPress eCommerce Experience",
    meta: {
      role: "Lead WordPress Developer",
      teamSize: "4 Members",
      duration: "4 weeks",
    },
    challenge:
      "Sandscents sells luxury candles and fragrances online — but scent can't be experienced through a screen. Conversion from new visitors was critically low.",
    solution:
      "We built an immersive WordPress experience with scent-story sections, mood-based product discovery, fragrance note breakdowns and a personalisation quiz that recommends the ideal candle. By turning uncertainty into guided confidence, first-purchase conversion rates jumped significantly.",
    implementation: [
      "Scent story sections — fragrance notes, mood pairings, burn time & materials",
      "Mood-based product discovery — shop by mood, space or occasion",
      "Personalisation quiz — recommends fragrance based on preferences",
      "Luxury visual design with immersive scroll animations",
    ],
    impact: [
      {
        value: "94%",
        label: "Quiz Completions",
        description: "Of quiz starters",
      },
      {
        value: "+57%",
        label: "First Purchase CVR",
        description: "New visitor conversion",
      },
      {
        value: "+48%",
        label: "AOV Increase",
        description: "Discovery & bundle lift",
      },
      {
        value: "4 weeks",
        label: "Delivery Time",
        description: "Full build & QA",
      },
    ],
    keyFeatures: [
      "Scent story & fragrance note sections",
      "Mood-based product discovery",
      "Personalisation quiz with recommendations",
      "Immersive scroll animations",
    ],
    techStack: ["WordPress", "WooCommerce", "PHP", "JavaScript", "Figma"],
    gallery: [
      "/images/webflow/cdn/69aa5abaec3a7df94a39f9d3_Home__4).png",
      "/images/webflow/cdn/69aa5abaec3a7df94a39f9d3_Home__4).png",
      "/images/webflow/cdn/69aa5abaec3a7df94a39f9d3_Home__4).png",
    ],
  },
];
