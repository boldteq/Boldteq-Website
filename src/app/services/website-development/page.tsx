import { createMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/jsonld";
import { SITE_CONFIG } from "@/lib/constants/site";
import { GradientPageBg } from "@/components/shared/page-bg";
import { ServiceHero } from "@/components/services/service-hero";
import { ServicePainPoints } from "@/components/services/service-pain-points";
import { ServiceCapabilities } from "@/components/services/service-capabilities";
import { ServicePlatforms } from "@/components/services/service-platforms";
import { ServiceProcess } from "@/components/services/service-process";
import { OurWorksCta } from "@/components/our-works/our-works-cta";

export const metadata = createMetadata({
  title: "White Label Web Development Services for Agencies | Boldteq",
  description:
    "Boldteq provides reliable, senior-level web development as part of a single monthly subscription — delivered under your brand, built for agency workflows.",
  path: "/services/website-development",
});

const breadcrumbs = breadcrumbSchema([
  { name: "Services", path: "/services/website-development" },
  { name: "Web Development", path: "/services/website-development" },
]);

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "White Label Web Development",
  serviceType: "Web Development",
  description:
    "Senior-level web development as part of a single monthly subscription — delivered under your brand, built for agency workflows.",
  provider: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
  },
  areaServed: "Worldwide",
  audience: {
    "@type": "BusinessAudience",
    audienceType: "Digital Agencies",
  },
};

export default function WebsiteDevelopmentPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} id="schema-breadcrumbs" />
      <JsonLd data={serviceSchema} id="schema-service" />
      <GradientPageBg />
      <ServiceHero />
      <ServicePainPoints />
      <ServiceCapabilities />
      <ServicePlatforms />
      <ServiceProcess />
      <OurWorksCta />
    </>
  );
}
