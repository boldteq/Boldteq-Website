import { notFound } from "next/navigation";
import { BLOG_POSTS, getCategoryLabel } from "@/lib/constants/blog";
import { createMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/jsonld";
import { SITE_CONFIG } from "@/lib/constants/site";
import { BlogDetailView } from "@/components/blog/detail/blog-detail-view";
import { BetaCta } from "@/components/shared/beta-cta";
import { GradientPageBg } from "@/components/shared/page-bg";

/** How many related posts to show under "Continue Reading". */
const RELATED_POSTS_COUNT = 3;

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return createMetadata({
    title: `${post.title} | Boldteq Blog`,
    description: post.shortDescription,
    path: `/blog-posts/${post.slug}`,
    ogImage: post.image,
    type: "article",
    authors: [post.author.name],
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt ?? post.publishedAt,
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  // Related posts: same category first, then top up from other posts.
  const sameCategory = BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && p.category === post.category,
  ).slice(0, RELATED_POSTS_COUNT);

  const relatedPosts =
    sameCategory.length >= RELATED_POSTS_COUNT
      ? sameCategory
      : [
          ...sameCategory,
          ...BLOG_POSTS.filter(
            (p) =>
              p.slug !== post.slug &&
              !sameCategory.find((r) => r.slug === p.slug),
          ).slice(0, RELATED_POSTS_COUNT - sameCategory.length),
        ];

  const breadcrumbs = breadcrumbSchema([
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog-posts/${post.slug}` },
  ]);

  // Plain-text body for schema (strip the CMS HTML tags).
  const articleBody = (post.content ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = articleBody ? articleBody.split(" ").length : undefined;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.shortDescription,
    image: post.image,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    url: `${SITE_CONFIG.url}/blog-posts/${post.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.url}/blog-posts/${post.slug}`,
    },
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: "https://cdn.prod.website-files.com/68ee3857579ec95674c7dd80/6937cbaf47872f6a8eb16f1c_Group%2046895.svg",
      },
    },
    articleSection: getCategoryLabel(post.category),
    keywords: getCategoryLabel(post.category),
    articleBody,
    ...(wordCount ? { wordCount } : {}),
    ...(post.readingTime ? { timeRequired: `PT${post.readingTime}M` } : {}),
    inLanguage: "en-US",
  };

  return (
    <>
      <JsonLd data={breadcrumbs} id="schema-breadcrumbs" />
      <JsonLd data={articleSchema} id="schema-article" />
      <GradientPageBg />
      <BlogDetailView post={post} relatedPosts={relatedPosts} />
      <BetaCta />
    </>
  );
}
