import { createMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/jsonld";
import { GradientPageBg } from "@/components/shared/page-bg";
import { LegalContent } from "@/components/legal/legal-content";
import { TERMS_OF_SERVICE } from "@/lib/constants/legal";

export const metadata = createMetadata({
  title: "Terms of Service | Boldteq",
  description:
    "Read Boldteq's Terms of Service — subscription plans, billing, refunds, IP rights, and full service scope policies for agency partners and clients.",
  path: "/terms-of-service",
});

const breadcrumbs = breadcrumbSchema([
  { name: "Terms of Service", path: "/terms-of-service" },
]);

export default function TermsOfServicePage() {
  return (
    <>
      <JsonLd data={breadcrumbs} id="schema-breadcrumbs" />
      <GradientPageBg />
      <LegalContent doc={TERMS_OF_SERVICE} />
    </>
  );
}
