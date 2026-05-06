import { createMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/jsonld";
import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export const metadata = createMetadata({
  title: "UI/UX Design Services | Coming Soon | Boldteq",
  description:
    "User-centric UI/UX designs that drive engagement and conversions. White-label design service for agencies — research, wireframes, prototypes. Coming soon.",
  path: "/services/ui-ux-design",
});

const breadcrumbs = breadcrumbSchema([
  { name: "Services", path: "/services/ui-ux-design" },
  { name: "UI/UX Design", path: "/services/ui-ux-design" },
]);

export default function UIUXDesignPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} id="schema-breadcrumbs" />
      <ComingSoonPage
        serviceName="UI/UX Design Services"
        description="User-centric designs that drive engagement and conversions."
      />
    </>
  );
}
