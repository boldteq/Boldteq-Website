import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants/site";
import { Hero } from "@/components/home/hero";
import { PortfolioCarousel } from "@/components/home/portfolio-carousel";
import { PainPoints } from "@/components/home/pain-points";
import { ResolutionBanner } from "@/components/home/resolution-banner";
import { BuiltFor } from "@/components/home/built-for";
import { BenefitsGrid } from "@/components/home/benefits-grid";
import { HowItWorks } from "@/components/home/how-it-works";
import { PricingSection } from "@/components/home/pricing-section";
import { CustomPlanCta } from "@/components/pricing/custom-plan-cta";
import { Comparison } from "@/components/home/comparison";
import { FaqSection } from "@/components/home/faq-section";

export const metadata: Metadata = {
  title: "White Label Web Design & Development Services | Boldteq",
  description:
    "Boldteq is a subscription-based white-label web development service for agencies. Dedicated team, 24-48hr turnaround, no contracts. Plans from $999/mo.",
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    title: "White Label Web Design & Development Services | Boldteq",
    description:
      "Subscription-based white-label web development for agencies. Dedicated team, 24-48hr turnaround, no contracts. Plans from $999/mo.",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/webflow/Group-47047.png",
        width: 1200,
        height: 630,
        alt: "Boldteq — White Label Web Development for Agencies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "White Label Web Design & Development Services | Boldteq",
    description:
      "Subscription-based white-label web development for agencies. 24-48hr turnaround. Plans from $999/mo.",
    images: ["/images/webflow/Group-47047.png"],
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <PortfolioCarousel />
      <PainPoints />
      <ResolutionBanner />
      <BuiltFor />
      <BenefitsGrid />
      <HowItWorks />
      <PricingSection />
      <CustomPlanCta />
      <Comparison />
      <FaqSection />
    </>
  );
}
