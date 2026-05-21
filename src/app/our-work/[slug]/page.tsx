import { notFound } from "next/navigation";
import { PORTFOLIO_DETAILS } from "@/lib/constants/portfolio-details";
import { createMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/jsonld";
import { SITE_CONFIG } from "@/lib/constants/site";
import { CaseStudyContent } from "@/components/our-works-detail/case-study-content";
import { CaseStudyGallery } from "@/components/our-works-detail/case-study-gallery";
import layoutStyles from "./case-study-layout.module.css";

export function generateStaticParams() {
  return PORTFOLIO_DETAILS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = PORTFOLIO_DETAILS.find((d) => d.slug === slug);
  if (!detail) return {};
  const truncated =
    detail.challenge.length > 155
      ? `${detail.challenge.slice(0, 152)}...`
      : detail.challenge;
  return createMetadata({
    title: `${detail.title} | Case Study | Boldteq`,
    description: truncated,
    path: `/our-work/${detail.slug}`,
    ogImage: detail.gallery[0],
    type: "article",
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = PORTFOLIO_DETAILS.find((d) => d.slug === slug);
  if (!detail) notFound();

  const breadcrumbs = breadcrumbSchema([
    { name: "Our Works", path: "/our-works" },
    { name: detail.title, path: `/our-work/${detail.slug}` },
  ]);

  const PUBLISHED = "2026-04-12T00:00:00Z";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: detail.title,
    description: detail.challenge,
    image: detail.gallery.map((url) => ({
      "@type": "ImageObject",
      url,
    })),
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    author: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: "https://cdn.prod.website-files.com/68ee3857579ec95674c7dd80/6937cbaf47872f6a8eb16f1c_Group%2046895.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.url}/our-work/${detail.slug}`,
    },
    about: {
      "@type": "CreativeWork",
      name: detail.title,
      keywords: detail.platform,
    },
  };

  return (
    <section className={layoutStyles.pageOut}>
      <JsonLd data={breadcrumbs} id="schema-breadcrumbs" />
      <JsonLd data={articleSchema} id="schema-case-study" />
      <div className={layoutStyles.container}>
        <div className={layoutStyles.grid}>
          <CaseStudyContent detail={detail} />
          <CaseStudyGallery images={detail.gallery} title={detail.title} />
        </div>
      </div>
    </section>
  );
}
