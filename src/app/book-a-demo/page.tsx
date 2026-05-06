import { createMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/jsonld";
import { GradientPageBg } from "@/components/shared/page-bg";
import { DemoHero } from "@/components/book-a-demo/demo-hero";
import { DemoCovers } from "@/components/book-a-demo/demo-covers";
import { DemoAudience } from "@/components/book-a-demo/demo-audience";
import { DemoSteps } from "@/components/book-a-demo/demo-steps";
import { DemoWhyBoldteq } from "@/components/book-a-demo/demo-why-boldteq";
import { DemoBookCta } from "@/components/book-a-demo/demo-book-cta";
import { DemoSkyCta } from "@/components/book-a-demo/demo-sky-cta";

export const metadata = createMetadata({
  title: "Book a Demo | White Label Web Dev for Agencies | Boldteq",
  description:
    "See how Boldteq works as your white-label backend team. Book a 30-min demo to learn how agencies use our subscription model to deliver faster without hiring.",
  path: "/book-a-demo",
});

const breadcrumbs = breadcrumbSchema([
  { name: "Book a Demo", path: "/book-a-demo" },
]);

export default function BookADemoPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} id="schema-breadcrumbs" />
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
