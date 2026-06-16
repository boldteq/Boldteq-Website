import { createMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/jsonld";
import { WorkPageBg } from "@/components/shared/page-bg";
import { OurWorksHero } from "@/components/our-works/our-works-hero";
import { PortfolioGrid } from "@/components/our-works/portfolio-grid";
import { OurWorksCta } from "@/components/our-works/our-works-cta";

export const metadata = createMetadata({
  title: "White Label Web Development Portfolio | Agency Work Samples | Boldteq",
  description:
    "Browse Boldteq's white-label web development portfolio. Shopify, WordPress, custom builds delivered for agencies. See real project examples.",
  path: "/our-works",
});

const breadcrumbs = breadcrumbSchema([
  { name: "Our Works", path: "/our-works" },
]);

export default function OurWorksPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} id="schema-breadcrumbs" />
      <WorkPageBg />
      <OurWorksHero />
      <PortfolioGrid />
      <OurWorksCta />
    </>
  );
}
