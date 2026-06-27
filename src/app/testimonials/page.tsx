import { createMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/jsonld";
import { TestimonialsGrid } from "@/components/testimonials/testimonials-grid";

export const metadata = createMetadata({
  title: "Testimonials | What Agencies Say About Boldteq",
  description:
    "Real feedback from agency owners and delivery leads who scaled their output with Boldteq's white-label execution team. See why agencies switch.",
  path: "/testimonials",
});

const breadcrumbs = breadcrumbSchema([
  { name: "Testimonials", path: "/testimonials" },
]);

export default function TestimonialsPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} id="schema-breadcrumbs" />
      <TestimonialsGrid />
    </>
  );
}
