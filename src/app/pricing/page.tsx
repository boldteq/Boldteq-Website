import { createMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/jsonld";
import { SITE_CONFIG } from "@/lib/constants/site";
import { GradientPageBg } from "@/components/shared/page-bg";
import { PricingSection } from "@/components/home/pricing-section";
import { CustomPlanCta } from "@/components/pricing/custom-plan-cta";
import { RoiCalculator } from "@/components/pricing/roi-calculator";

export const metadata = createMetadata({
  title: "White Label Pricing | Plans from $999/mo | Boldteq",
  description:
    "Transparent white-label web dev pricing for agencies. Starter $999/mo, Growth $1,999/mo, Pro $3,499/mo. No contracts, pause anytime. 14-day guarantee.",
  path: "/pricing",
});

const pricingSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "White Label Web Development",
  serviceType: "White Label Web Development",
  description:
    "Subscription-based white-label web development for digital agencies. Dedicated team, 24-48 hour turnaround, no contracts.",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "999",
    highPrice: "3499",
  },
  provider: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
  },
  areaServed: "Worldwide",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Boldteq Subscription Plans",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Starter",
        price: "999",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "999",
          priceCurrency: "USD",
          billingIncrement: 1,
          unitText: "MONTH",
        },
        availability: "https://schema.org/InStock",
        url: `${SITE_CONFIG.url}/pricing`,
      },
      {
        "@type": "Offer",
        name: "Growth",
        price: "1999",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "1999",
          priceCurrency: "USD",
          billingIncrement: 1,
          unitText: "MONTH",
        },
        availability: "https://schema.org/InStock",
        url: `${SITE_CONFIG.url}/pricing`,
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "3499",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "3499",
          priceCurrency: "USD",
          billingIncrement: 1,
          unitText: "MONTH",
        },
        availability: "https://schema.org/InStock",
        url: `${SITE_CONFIG.url}/pricing`,
      },
    ],
  },
};

const breadcrumbs = breadcrumbSchema([{ name: "Pricing", path: "/pricing" }]);

export default function PricingPage() {
  return (
    <>
      <GradientPageBg pricing={true} />
      <JsonLd data={pricingSchema} id="schema-pricing" />
      <JsonLd data={breadcrumbs} id="schema-breadcrumbs" />
      <PricingSection transparent asH1 />
      <CustomPlanCta />
      <RoiCalculator />
    </>
  );
}
