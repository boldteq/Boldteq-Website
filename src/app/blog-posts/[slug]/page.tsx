import { notFound } from "next/navigation";
import { BLOG_POSTS } from "@/lib/constants/blog";
import { createMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/jsonld";
import { SITE_CONFIG } from "@/lib/constants/site";
import { BlogDetailView } from "@/components/blog/detail/blog-detail-view";
import { BetaCta } from "@/components/shared/beta-cta";
import { GradientPageBg } from "@/components/shared/page-bg";

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

  // Related posts: same category, excluding current
  const related = BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && p.category === post.category,
  ).slice(0, 3);

  // If fewer than 3 related, fill from other posts
  const relatedPosts =
    related.length >= 2
      ? related
      : [
          ...related,
          ...BLOG_POSTS.filter(
            (p) =>
              p.slug !== post.slug &&
              !related.find((r) => r.slug === p.slug),
          ).slice(0, 3 - related.length),
        ];

  const breadcrumbs = breadcrumbSchema([
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog-posts/${post.slug}` },
  ]);

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
    articleSection: post.category,
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
