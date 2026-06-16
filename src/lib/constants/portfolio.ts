import type { PortfolioItem, PortfolioCategory } from "@/types/portfolio";
import { PORTFOLIO_DETAILS } from "./portfolio-details";

/**
 * Portfolio items — URLs and order extracted from live boldteq.com/our-works
 * via Playwright on 2026-04-13. Only published items included (Nuve is draft).
 */
const RAW_ITEMS: Array<{
  name: string;
  slug: string;
  category: PortfolioCategory;
  featuredImage: string;
  detailPath: string;
  order: number;
}> = [
  {
    name: "Dabble",
    slug: "dabble",
    category: "shopify",
    featuredImage:
      "/images/webflow/cdn/699e90f3f234b8ab10cb61d1_Group_1261153274__1).png",
    detailPath: "/our-works-pages/dabble",
    order: 1,
  },
  {
    name: "Cinea",
    slug: "cinea",
    category: "shopify",
    featuredImage:
      "/images/webflow/cdn/699e933dcf605ccf4b38fa30_Group_1261153273.png",
    detailPath: "",
    order: 2,
  },
  {
    name: "Dog & Crate",
    slug: "dog-crate",
    category: "shopify",
    featuredImage:
      "/images/webflow/cdn/699e93b7d948db527ee77578_Group_1261153276.png",
    detailPath: "/our-works-pages/dog-crate",
    order: 3,
  },
  {
    name: "Aura Beauty",
    slug: "aura",
    category: "shopify",
    featuredImage:
      "/images/webflow/cdn/699e946107e81ee60d7d4f41_Group_1261153277.png",
    detailPath: "",
    order: 4,
  },
  {
    name: "Junoone",
    slug: "junoone",
    category: "shopify",
    featuredImage:
      "/images/webflow/cdn/69a677cb48fc3300a1d634c9_Mask_group__1).png",
    detailPath: "/our-works-pages/junoone",
    order: 5,
  },
  {
    name: "Thrive Tea",
    slug: "thrive-tea",
    category: "shopify",
    featuredImage:
      "/images/webflow/cdn/69a6ca85e49ea863d50bcd8c_Homepage_V2__2).png",
    detailPath: "",
    order: 6,
  },
  {
    name: "Superlash",
    slug: "superlash",
    category: "shopify",
    featuredImage:
      "/images/webflow/cdn/69a6cc98c468ef0813c60789_Home.png",
    detailPath: "",
    order: 7,
  },
  {
    name: "BetterDays",
    slug: "better-days",
    category: "shopify",
    featuredImage:
      "/images/webflow/cdn/69a6db42f4e03ca908276246_Home__1).png",
    detailPath: "/our-works-pages/better-days",
    order: 8,
  },
  {
    name: "Cheesecakes by Sam",
    slug: "cheesecakes-by-sam",
    category: "shopify",
    featuredImage:
      "/images/webflow/cdn/69a6dcb97821f82c3a596b30_Feedback.png",
    detailPath: "",
    order: 9,
  },
  {
    name: "Poppincob",
    slug: "poppincob",
    category: "shopify",
    featuredImage:
      "/images/webflow/cdn/69aa5728212278b5d89c939f_Feedback_2.png",
    detailPath: "",
    order: 10,
  },
  {
    name: "Lippy oil",
    slug: "lippy-oil",
    category: "wordpress",
    featuredImage:
      "/images/webflow/cdn/69aa58e264d14d4a4f8aaa65_Home__Client).png",
    detailPath: "/our-works-pages/lippy-oil",
    order: 11,
  },
  {
    name: "Pet Factor",
    slug: "pet-factor",
    category: "wordpress",
    featuredImage:
      "/images/webflow/cdn/699e938de25837ecbec91457_Group_1261153275.png",
    detailPath: "",
    order: 12,
  },
  {
    name: "Renterr",
    slug: "renterr",
    category: "wordpress",
    featuredImage:
      "/images/webflow/cdn/69aa597212ae731147edfe75_Home__2).png",
    detailPath: "",
    order: 13,
  },
  {
    name: "Frames for Prints",
    slug: "frames-for-prints",
    category: "wordpress",
    featuredImage:
      "/images/webflow/cdn/69aa59c5f5b790f3e020c16b_Feedback_2__1).png",
    detailPath: "/our-works-pages/frames-for-prints",
    order: 14,
  },
  {
    name: "Patatoche",
    slug: "patatoche",
    category: "wordpress",
    featuredImage:
      "/images/webflow/cdn/69aa5a2c9b837923eed38971_Home__3).png",
    detailPath: "",
    order: 15,
  },
  {
    name: "Sandscents",
    slug: "sandscents",
    category: "wordpress",
    featuredImage:
      "/images/webflow/cdn/69aa5abaec3a7df94a39f9d3_Home__4).png",
    detailPath: "/our-works-pages/sandscents",
    order: 16,
  },
  {
    name: "Repower Electric Supply",
    slug: "repower-electric-supply",
    category: "wordpress",
    featuredImage:
      "/images/webflow/cdn/69aa5b3cfef2d1593c33491e_Home__5).png",
    detailPath: "/our-works-pages/repower-electric-supply",
    order: 17,
  },
  {
    name: "Livdynamic",
    slug: "livdynamic",
    category: "wordpress",
    featuredImage:
      "/images/webflow/cdn/69aa5c201277cb68bf69abaa_Home__6).png",
    detailPath: "",
    order: 18,
  },
  {
    name: "Verzendetiket",
    slug: "verzendetiket",
    category: "wordpress",
    featuredImage:
      "/images/webflow/cdn/69aa5c8f8225ec55e94a86eb_Home__7).png",
    detailPath: "",
    order: 19,
  },
];

// Single source of truth for which items have a real /our-work/[slug] page —
// derived from PORTFOLIO_DETAILS so the popup and the route can never drift
// (e.g. Cinea has a full case study but had detailPath: "").
const DETAIL_SLUGS = new Set(PORTFOLIO_DETAILS.map((d) => d.slug));

export const PORTFOLIO_ITEMS: PortfolioItem[] = RAW_ITEMS.sort(
  (a, b) => a.order - b.order
).map((item) => ({
  name: item.name,
  slug: item.slug,
  category: item.category,
  featuredImage: item.featuredImage,
  hasDetailPage: DETAIL_SLUGS.has(item.slug),
  order: item.order,
}));

export const PORTFOLIO_CATEGORIES: Array<{
  slug: string;
  name: string;
  comingSoon?: boolean;
}> = [
  { slug: "all", name: "All" },
  { slug: "shopify", name: "Shopify" },
  { slug: "wordpress", name: "WordPress" },
  { slug: "webflow", name: "Webflow", comingSoon: true },
  { slug: "frontend", name: "Frontend", comingSoon: true },
  { slug: "shopify-apps", name: "Shopify App", comingSoon: true },
  { slug: "ui-ux-design", name: "UI/UX Design", comingSoon: true },
  { slug: "graphics-design", name: "Graphics Design", comingSoon: true },
];
