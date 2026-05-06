export type BillingPeriod = "monthly" | "quarterly" | "annual";

export interface PricingTier {
  name: string;
  tagline: string;
  prices: Record<BillingPeriod, number>;
  hours: string;
  features: string[];
  popular: boolean;
  cta: string;
}

export interface FeatureRow {
  feature: string;
  starter: string | boolean;
  growth: string | boolean;
  pro: string | boolean;
}
