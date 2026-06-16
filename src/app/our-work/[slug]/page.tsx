import { notFound } from "next/navigation";
import { PORTFOLIO_DETAILS } from "@/lib/constants/portfolio-details";
import { PORTFOLIO_ITEMS } from "@/lib/constants/portfolio";
import { createMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/jsonld";
import { SITE_CONFIG } from "@/lib/constants/site";
import { CaseStudyContent } from "@/components/our-works-detail/case-study-content";
import { CaseStudyGallery } from "@/components/our-works-detail/case-study-gallery";
import { CaseStudyShowcase } from "@/components/our-works-detail/case-study-showcase";
import layoutStyles from "./case-study-layout.module.css";

// Every portfolio item gets a real page — full case study where we have one,
// a lightweight showcase otherwise — so the popup never 404s or shows nothing.
export function generateStaticParams() {
  return PORTFOLIO_ITEMS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const detail = PORTFOLIO_DETAILS.find((d) => d.slug === slug);
  if (detail) {
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

  const item = PORTFOLIO_ITEMS.find((i) => i.slug === slug);
  if (item) {
    const platform = item.category === "wordpress" ? "WordPress" : "Shopify";
    return createMetadata({
      title: `${item.name} | ${platform} Project | Boldteq`,
      description: `${item.name} — a ${platform} project from the Boldteq white-label portfolio, designed and built for agency partners.`,
      path: `/our-work/${item.slug}`,
      ogImage: item.featuredImage,
      type: "article",
    });
  }

  return {};
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = PORTFOLIO_DETAILS.find((d) => d.slug === slug);

  // ── Lightweight showcase for items without a written case study ──
  if (!detail) {
    const item = PORTFOLIO_ITEMS.find((i) => i.slug === slug);
    if (!item) notFound();

    const showcaseBreadcrumbs = breadcrumbSchema([
      { name: "Our Works", path: "/our-works" },
      { name: item.name, path: `/our-work/${item.slug}` },
    ]);

    return (
      <section className={layoutStyles.pageOut}>
        <JsonLd data={showcaseBreadcrumbs} id="schema-breadcrumbs" />
        <div className={layoutStyles.container}>
          <div className={layoutStyles.grid}>
            <CaseStudyShowcase item={item} />
            <CaseStudyGallery images={[item.featuredImage]} title={item.name} />
          </div>
        </div>
      </section>
    );
  }

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
