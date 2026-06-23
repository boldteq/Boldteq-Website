import { createMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/jsonld";
import { SITE_CONFIG } from "@/lib/constants/site";
import { GradientPageBg } from "@/components/shared/page-bg";
import { DemoHero } from "@/components/book-a-demo/demo-hero";
import { DemoCovers } from "@/components/book-a-demo/demo-covers";
import { DemoAudience } from "@/components/book-a-demo/demo-audience";
import { DemoSteps } from "@/components/book-a-demo/demo-steps";
import { DemoWhyBoldteq } from "@/components/book-a-demo/demo-why-boldteq";
import { DemoBookCta } from "@/components/book-a-demo/demo-book-cta";
import { DemoSkyCta } from "@/components/book-a-demo/demo-sky-cta";

export const metadata = createMetadata({
  title: "Book a Demo | White Label Web Development for Agencies | Boldteq",
  description:
    "Book a free demo to see how Boldteq's white-label web dev subscription works as your backend team — pricing, workflow, turnaround, and delivery, without hiring.",
  path: "/book-a-demo",
});

const breadcrumbs = breadcrumbSchema([
  { name: "Book a Demo", path: "/book-a-demo" },
]);

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "White-Label Web Development Demo",
  serviceType: "White-label web development subscription",
  description:
    "A personalized walkthrough of Boldteq's white-label web development subscription for agencies — workflow, pricing, turnaround, and delivery.",
  url: `${SITE_CONFIG.url}/book-a-demo`,
  provider: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
  },
  areaServed: "Worldwide",
  audience: { "@type": "Audience", audienceType: "Digital agencies" },
};

export default function BookADemoPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} id="schema-breadcrumbs" />
      <JsonLd data={serviceSchema} id="schema-service" />
      <GradientPageBg />
      <DemoHero />
      <DemoCovers />
      <DemoAudience />
      <DemoSteps />
      <DemoWhyBoldteq />
      <DemoBookCta />
      <DemoSkyCta />
    </>
  );
}
