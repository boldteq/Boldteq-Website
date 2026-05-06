import { createMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/jsonld";
import { WorkPageBg } from "@/components/shared/page-bg";
import { ScopeHero } from "@/components/scope/scope-hero";
import { ScopeTabs } from "@/components/scope/scope-tabs";
import { OurWorksCta } from "@/components/our-works/our-works-cta";
import { BetaCta } from "@/components/shared/beta-cta";

export const metadata = createMetadata({
  title: "Service Scope | Shopify, WordPress & Frontend | Boldteq",
  description:
    "Full service scope for white-label Shopify, WordPress, Shopify Apps and Frontend dev. From quick fixes to complete builds — delivered under your brand.",
  path: "/scope",
});

const breadcrumbs = breadcrumbSchema([{ name: "Scope", path: "/scope" }]);

export default function ScopePage() {
  return (
    <>
      <JsonLd data={breadcrumbs} id="schema-breadcrumbs" />
      <WorkPageBg />
      <ScopeHero />
      <ScopeTabs />
      <OurWorksCta />
      <BetaCta />
    </>
  );
}
