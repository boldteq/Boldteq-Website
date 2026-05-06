import { createMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/jsonld";
import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export const metadata = createMetadata({
  title: "App Development Services | Coming Soon | Boldteq",
  description:
    "Custom apps designed for speed, performance and scalability. White-label mobile and web app development service for agencies — iOS, Android, web. Coming soon.",
  path: "/services/app-development",
});

const breadcrumbs = breadcrumbSchema([
  { name: "Services", path: "/services/app-development" },
  { name: "App Development", path: "/services/app-development" },
]);

export default function AppDevelopmentPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} id="schema-breadcrumbs" />
      <ComingSoonPage
        serviceName="App Development"
        description="Custom apps designed for speed and scalability."
      />
    </>
  );
}
