export type PortfolioCategory = "shopify" | "wordpress";

export interface PortfolioItem {
  name: string;
  slug: string;
  category: PortfolioCategory;
  featuredImage: string;
  hasDetailPage: boolean;
  order: number;
}

export interface PortfolioImpact {
  value: string;
  label: string;
  description: string;
}

export interface PortfolioDetail {
  slug: string;
  platform: string;
  title: string;
  meta: { role: string; teamSize: string; duration: string };
  challenge: string;
  solution: string;
  implementation: string[];
  impact: PortfolioImpact[];
  keyFeatures: string[];
  techStack: string[];
  gallery: string[];
}
