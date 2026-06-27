import { createMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/jsonld";
import { NewsletterHero } from "@/components/newsletter/newsletter-hero";

export const metadata = createMetadata({
  title: "Newsletter | Agency Growth Insights | Boldteq",
  description:
    "Subscribe to agency growth insights delivered monthly. Smart growth strategies, CRM playbooks, industry trends, and member-only offers for modern agencies.",
  path: "/newsletter",
});

const breadcrumbs = breadcrumbSchema([
  { name: "Newsletter", path: "/newsletter" },
]);

export default function NewsletterPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} id="schema-breadcrumbs" />
      <NewsletterHero />
    </>
  );
}
