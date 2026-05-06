import { createMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/jsonld";
import { SITE_CONFIG } from "@/lib/constants/site";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactInfoCards } from "@/components/contact/contact-info-cards";
import { ContactFormSection } from "@/components/contact/contact-form-section";
import { BetaCta } from "@/components/shared/beta-cta";

export const metadata = createMetadata({
  title: "Contact Boldteq | Sales, Support & Careers for Agencies",
  description:
    "Contact Boldteq's sales, support, or careers team. White-label web development for agencies — reach us at sales@boldteq.com or book a demo today.",
  path: "/contact",
});

const breadcrumbs = breadcrumbSchema([{ name: "Contact", path: "/contact" }]);

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Boldteq",
  url: `${SITE_CONFIG.url}/contact`,
  mainEntity: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: SITE_CONFIG.email.sales,
        availableLanguage: ["English"],
      },
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: SITE_CONFIG.email.support,
        availableLanguage: ["English"],
      },
      {
        "@type": "ContactPoint",
        contactType: "human resources",
        email: SITE_CONFIG.email.careers,
        availableLanguage: ["English"],
      },
    ],
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} id="schema-breadcrumbs" />
      <JsonLd data={contactPageSchema} id="schema-contact" />
      <ContactHero />
      <ContactInfoCards />
      <ContactFormSection />
      <BetaCta />
    </>
  );
}
