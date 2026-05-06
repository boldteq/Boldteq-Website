import { createMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/jsonld";
import { GradientPageBg } from "@/components/shared/page-bg";
import { HowWorksHero } from "@/components/how-it-works/how-works-hero";
import { AgencyFit } from "@/components/how-it-works/agency-fit";
import { HowWorksSteps } from "@/components/how-it-works/how-works-steps";
import { ProcessSteps } from "@/components/how-it-works/process-steps";
import { RiskRemoval } from "@/components/how-it-works/risk-removal";

export const metadata = createMetadata({
  title: "How White Label Web Development Works | Boldteq Process",
  description:
    "See how Boldteq's white-label web development works. Subscribe, submit tasks, review deliverables. 24-48hr turnaround, dedicated team, full QA included.",
  path: "/how-it-works",
  ogImage:
    "https://cdn.prod.website-files.com/68ee3857579ec95674c7dd80/69d64240db9eab6baa328bb5_69817a5c48d4bad1a9bb52b2_Group%2047047.png",
});

const breadcrumbs = breadcrumbSchema([
  { name: "How It Works", path: "/how-it-works" },
]);

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} id="schema-breadcrumbs" />
      <GradientPageBg />
      <HowWorksHero />
      <AgencyFit />
      <HowWorksSteps />
      <ProcessSteps />
      <RiskRemoval />
    </>
  );
}
