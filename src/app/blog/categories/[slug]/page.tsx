import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/jsonld";
import { SITE_CONFIG } from "@/lib/constants/site";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/constants/blog";
import { GradientPageBg } from "@/components/shared/page-bg";
import { BlogHero } from "@/components/blog/blog-hero";
import { BlogGrid } from "@/components/blog/blog-grid";
import { BlogBottomCta } from "@/components/blog/blog-bottom-cta";
import { BetaCta } from "@/components/shared/beta-cta";

/** Pre-render every category slug (excluding pseudo-slug "all") at build time. */
export function generateStaticParams() {
  return BLOG_CATEGORIES.filter((c) => c.slug !== "all").map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = BLOG_CATEGORIES.find((c) => c.slug === slug);
  if (!category) return {};

  const title = `${category.name} Articles | Boldteq Blog`;
  const description = `Insights and articles on ${category.name.toLowerCase()} — written for agencies scaling client delivery.`;

  return createMetadata({
    title,
    description,
    path: `/blog/categories/${category.slug}`,
  });
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = BLOG_CATEGORIES.find((c) => c.slug === slug);
  if (!category || category.slug === "all") notFound();

  const postsInCategory = BLOG_POSTS.filter((p) => p.category === category.slug);

  const breadcrumbs = breadcrumbSchema([
    { name: "Blog", path: "/blog" },
    { name: category.name, path: `/blog/categories/${category.slug}` },
  ]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} Articles | ${SITE_CONFIG.name} Blog`,
    description: `Articles in the ${category.name} category.`,
    url: `${SITE_CONFIG.url}/blog/categories/${category.slug}`,
    isPartOf: {
      "@type": "Blog",
      name: `${SITE_CONFIG.name} Blog`,
      url: `${SITE_CONFIG.url}/blog`,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: postsInCategory.map((post, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${SITE_CONFIG.url}/blog-posts/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <>
      <JsonLd data={breadcrumbs} id="schema-breadcrumbs" />
      <JsonLd data={collectionSchema} id="schema-collection" />
      <GradientPageBg />
      <BlogHero />
      <BlogGrid initialCategory={category.slug} />
      <BlogBottomCta />
      <BetaCta />
    </>
  );
}
