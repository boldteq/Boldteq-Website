import { createMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema, jobPostingSchema } from "@/lib/seo/jsonld";
import { JOB_LISTINGS } from "@/lib/constants/careers";
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
    "Boldteq is hiring remote senior web developers, React/Next.js engineers, Shopify app developers, UI/UX designers, and marketers. Join a global team that sets a higher standard.",
  path: "/careers",
});

const breadcrumbs = breadcrumbSchema([{ name: "Careers", path: "/careers" }]);
const jobSchemas = JOB_LISTINGS.map((job) => jobPostingSchema(job));

export default function CareersPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} id="schema-breadcrumbs" />
      <JsonLd data={jobSchemas} id="schema-jobs" />
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
