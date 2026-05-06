import { createMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/jsonld";
import { GradientPageBg } from "@/components/shared/page-bg";
import { CareersHero } from "@/components/careers/careers-hero";
import { CareersSelection } from "@/components/careers/careers-selection";
import { CareersTabs } from "@/components/careers/careers-tabs";
import { CareersBenchmarks } from "@/components/careers/careers-benchmarks";
import { CareersGlobal } from "@/components/careers/careers-global";
import { BetaCta } from "@/components/shared/beta-cta";

export const metadata = createMetadata({
  title: "Careers at Boldteq | Build the Future of White-Label Web Dev",
  description:
    "Join a global team that sets a higher standard. Boldteq hires senior developers, designers and PMs who take ownership and deliver with precision.",
  path: "/careers",
});

const breadcrumbs = breadcrumbSchema([{ name: "Careers", path: "/careers" }]);

export default function CareersPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} id="schema-breadcrumbs" />
      <GradientPageBg />
      <CareersHero />
      <CareersSelection />
      <CareersTabs />
      <CareersBenchmarks />
      <CareersGlobal />
      <BetaCta />
    </>
  );
}
