import { createMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/jsonld";
import { GradientPageBg } from "@/components/shared/page-bg";
import { LegalContent } from "@/components/legal/legal-content";
import { PRIVACY_POLICY } from "@/lib/constants/legal";

export const metadata = createMetadata({
  title: "Privacy Policy | Boldteq",
  description:
    "Learn how Boldteq collects, uses, and protects personal data. Our privacy commitment, GDPR compliance, and data handling practices for agency partners.",
  path: "/privacy-policy",
});

const breadcrumbs = breadcrumbSchema([
  { name: "Privacy Policy", path: "/privacy-policy" },
]);

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} id="schema-breadcrumbs" />
      <GradientPageBg />
      <LegalContent doc={PRIVACY_POLICY} />
    </>
  );
}
