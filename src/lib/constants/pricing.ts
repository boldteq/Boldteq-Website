export type BillingPeriod = "monthly" | "quarterly" | "annually";

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  annuallyPrice: number;
  hours: number;
  lanes: string;
  platforms: string;
  workspace: string;
  popular: boolean;
  featuresLabels: {
    monthly: string;
    quarterly: string;
    annually: string;
  };
  features: string[];
  checkoutLinks: {
    monthly: string;
    quarterly: string;
    annually: string;
  };
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Agencies replacing first execution hire",
    monthlyPrice: 999,
    quarterlyPrice: 899,
    annuallyPrice: 799,
    hours: 40,
    lanes: "1 task at a time",
    platforms: "Single platform",
    workspace: "Smart Client Workspace",
    popular: false,
    featuresLabels: {
      monthly: "What Includes:",
      quarterly: "Everything in onboarding, plus:",
      annually: "Everything in onboarding, plus:",
    },
    features: [
      "40 hrs / month",
      "1 task at a time",
      "Single platform",
      "Smart Client Workspace",
    ],
    checkoutLinks: {
      monthly:
        "https://portal.boldteq.com/services/starter-mwma05bdxjhzji0zwzav/checkout?variation=9",
      quarterly:
        "https://portal.boldteq.com/services/starter-mwma05bdxjhzji0zwzav/checkout?variation=9",
      annually:
        "https://portal.boldteq.com/services/starter-mwma05bdxjhzji0zwzav/checkout?variation=9",
    },
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "Agencies scaling delivery",
    monthlyPrice: 1999,
    quarterlyPrice: 1799,
    annuallyPrice: 1599,
    hours: 80,
    lanes: "2 tasks simultaneously",
    platforms: "Multi-platform",
    workspace: "Smart Client Workspace",
    popular: true,
    featuresLabels: {
      monthly: "What Includes:",
      quarterly: "Everything in Starter, plus:",
      annually: "Everything in Starter, plus:",
    },
    features: [
      "80 hrs / month",
      "Dual-lane execution",
      "Multi-platform delivery",
      "Smart Client Workspace",
    ],
    checkoutLinks: {
      monthly:
        "https://portal.boldteq.com/services/growth-0kjv8vdq1slacrk0eujt/checkout?variation=11",
      quarterly:
        "https://portal.boldteq.com/services/growth-0kjv8vdq1slacrk0eujt/checkout?variation=11",
      annually:
        "https://portal.boldteq.com/services/growth-0kjv8vdq1slacrk0eujt/checkout?variation=11",
    },
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "High-volume / mature agencies",
    monthlyPrice: 3499,
    quarterlyPrice: 3149,
    annuallyPrice: 2799,
    hours: 140,
    lanes: "3 tasks simultaneously",
    platforms: "Advanced multi-platform",
    workspace: "Smart Client Workspace",
    popular: false,
    featuresLabels: {
      monthly: "What Includes:",
      quarterly: "Everything in Growth, plus:",
      annually: "Everything in Growth, plus:",
    },
    features: [
      "140 hrs / month",
      "Three-lane execution",
      "Advanced reporting",
      "Smart Client Workspace",
    ],
    checkoutLinks: {
      monthly:
        "https://portal.boldteq.com/services/pro-c8jtfwr3tdjelxvygqrz/checkout?variation=38",
      quarterly:
        "https://portal.boldteq.com/services/pro-c8jtfwr3tdjelxvygqrz/checkout?variation=38",
      annually:
        "https://portal.boldteq.com/services/pro-c8jtfwr3tdjelxvygqrz/checkout?variation=38",
    },
  },
];

export interface ComparisonRow {
  label: string;
  tooltip: string;
  starter: string | boolean;
  growth: string | boolean;
  pro: string | boolean;
}

export const COMPARISON_TABLE: ComparisonRow[] = [
  {
    label: "Monthly delivery capacity",
    tooltip: "Total design & dev hours your team delivers each month.",
    starter: "upto 40 hours",
    growth: "upto 80 hours",
    pro: "upto 140 hours",
  },
  {
    label: "Task handling",
    tooltip: "Number of tasks we can actively work on at the same time.",
    starter: "1 task",
    growth: "2 parallel tasks",
    pro: "3 parallel tasks",
  },
  {
    label: "Task management & Communication",
    tooltip: "Centralized workspace to submit, track, and discuss every task.",
    starter: "Smart Client Workspace",
    growth: "Smart Client Workspace",
    pro: "Smart Client Workspace",
  },
  {
    label: "Quality assurance",
    tooltip: "Internal review level applied before any work reaches you.",
    starter: "Basic",
    growth: "Standard",
    pro: "Enhanced",
  },
  {
    label: "Platforms supported",
    tooltip:
      "Number of CMS/platforms (e.g. Shopify, WordPress) we deliver on.",
    starter: "1 platform",
    growth: "2 platforms",
    pro: "3 platforms",
  },
  {
    label: "Delivery model",
    tooltip:
      "How your execution team is structured and assigned to your account.",
    starter: false,
    growth: false,
    pro: "Semi-dedicated pod",
  },
  {
    label: "Turnaround time",
    tooltip: "How quickly tasks move from submission to final delivery.",
    starter: false,
    growth: "Faster",
    pro: "Faster",
  },
  {
    label: "Reporting",
    tooltip:
      "Summaries and insights on delivery progress and task performance.",
    starter: false,
    growth: "Basic",
    pro: "Advanced",
  },
  {
    label: "Rollover",
    tooltip: "Unused hours carried over to the next billing period.",
    starter: false,
    growth: false,
    pro: "Standard",
  },
];

export function getPlanPrice(plan: PricingPlan, period: BillingPeriod): number {
  if (period === "quarterly") return plan.quarterlyPrice;
  if (period === "annually") return plan.annuallyPrice;
  return plan.monthlyPrice;
}

export function getPlanCheckoutLink(
  plan: PricingPlan,
  period: BillingPeriod
): string {
  return plan.checkoutLinks[period];
}

// ─── ROI Calculator constants (single source of truth) ───────────────────────

export type PlanKey = "starter" | "growth" | "pro";
export type PresetKey = "startup" | "midsize" | "enterprise";

/**
 * Price matrix derived from PRICING_PLANS — keyed by plan id × billing period.
 * Consumed by RoiCalculator.
 */
export const PLAN_PRICE_MAP: Record<
  PlanKey,
  Record<BillingPeriod, number>
> = PRICING_PLANS.reduce(
  (acc, plan) => {
    acc[plan.id as PlanKey] = {
      monthly: plan.monthlyPrice,
      quarterly: plan.quarterlyPrice,
      annually: plan.annuallyPrice,
    };
    return acc;
  },
  {} as Record<PlanKey, Record<BillingPeriod, number>>
);

export const PLAN_LABELS: Record<PlanKey, string> = {
  starter: "Starter",
  growth: "Growth",
  pro: "Pro",
};

export const BILLING_LABELS: Record<BillingPeriod, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  annually: "Annual",
};

export const BILLING_BADGES: Partial<Record<BillingPeriod, string>> = {
  quarterly: "Save 10%",
  annually: "Save 20%",
};

export interface RoiPresetState {
  plan: PlanKey;
  teamSize: number;
  manualHours: number;
  hourlyRate: number;
  toolCost: number;
}

export const ROI_PRESETS: Record<PresetKey, RoiPresetState> = {
  startup: {
    plan: "starter",
    teamSize: 8,
    manualHours: 6,
    hourlyRate: 50,
    toolCost: 8000,
  },
  midsize: {
    plan: "growth",
    teamSize: 30,
    manualHours: 8,
    hourlyRate: 60,
    toolCost: 25000,
  },
  enterprise: {
    plan: "pro",
    teamSize: 100,
    manualHours: 10,
    hourlyRate: 75,
    toolCost: 80000,
  },
};

export const ROI_PRESET_META: Record<
  PresetKey,
  { label: string; emoji: string }
> = {
  startup: { label: "Startup", emoji: "🚀" },
  midsize: { label: "Growth Agency", emoji: "📈" },
  enterprise: { label: "Enterprise", emoji: "🏢" },
};

export const ROI_FIELD_TOOLTIPS = {
  teamSize:
    "Total number of people on your team who spend time on manual tasks.",
  manualHours:
    "Average hours per person per week spent on tasks Boldteq would handle — reporting, QA, revisions, coordination.",
  hourlyRate:
    "Average fully-loaded cost per hour for those team members (salary + benefits ÷ 2,080).",
  toolCost:
    "Annual spend on tools, contractors, or freelancers that Boldteq would replace.",
} as const;
