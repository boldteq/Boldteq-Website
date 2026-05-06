import { createMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/jsonld";
import { SITE_CONFIG } from "@/lib/constants/site";
import { GradientPageBg } from "@/components/shared/page-bg";
import { BetaHero } from "@/components/beta/beta-hero";
import { BetaPricing } from "@/components/beta/beta-pricing";
import { BetaHowItWorks } from "@/components/beta/beta-how-it-works";
import { BetaWhoItsFor } from "@/components/beta/beta-who-its-for";
import { CtaBanner } from "@/components/shared/cta-banner";
import { BetaCta } from "@/components/shared/beta-cta";

export const metadata = createMetadata({
  title: "Beta Access — Founding Partner Pricing | Boldteq",
  description:
    "Join Boldteq's private beta and lock in founding partner pricing before public launch. Only 15 agencies accepted. Priority onboarding, satisfaction guarantee.",
  path: "/beta",
});

const breadcrumbs = breadcrumbSchema([{ name: "Beta", path: "/beta" }]);

const betaOfferSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Boldteq Beta Access",
  serviceType: "White Label Web Development — Beta",
  provider: { "@type": "Organization", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Beta Plans",
    itemListElement: [
      { "@type": "Offer", name: "Beta Lite", price: "299", priceCurrency: "USD" },
      { "@type": "Offer", name: "Beta Pro", price: "599", priceCurrency: "USD" },
    ],
  },
};

export default function BetaPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} id="schema-breadcrumbs" />
      <JsonLd data={betaOfferSchema} id="schema-beta" />
      <GradientPageBg />
      <BetaHero />
      <BetaPricing />
      <BetaHowItWorks />
      <BetaWhoItsFor />
      <CtaBanner
        title="Your Execution Team. Live in 12 Hours."
        subtitle="Reserve your beta spot. Lock in pricing and start delivering client work through Boldteq before we open publicly."
        primaryCta={{ label: "Reserve My Spot", href: "/book-a-demo" }}
        align="left"
        bullets={[
          "Beta pricing locked in",
          "Priority onboarding — live in 12 hours",
          "14-day satisfaction guarantee",
          "Pause or cancel anytime",
        ]}
      />
      <BetaCta />
    </>
  );
}
