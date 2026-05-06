import { createMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/jsonld";
import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export const metadata = createMetadata({
  title: "Graphic Design Services | Coming Soon | Boldteq",
  description:
    "Visually striking designs that strengthen your brand identity. White-label graphic design service for agencies — logos, branding, marketing assets. Coming soon.",
  path: "/services/graphics-design",
});

const breadcrumbs = breadcrumbSchema([
  { name: "Services", path: "/services/graphics-design" },
  { name: "Graphic Design", path: "/services/graphics-design" },
]);

export default function GraphicsDesignPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} id="schema-breadcrumbs" />
      <ComingSoonPage
        serviceName="Graphic Design Services"
        description="Visually striking designs that strengthen your brand."
      />
    </>
  );
}
