import { createMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/jsonld";
import { SITE_CONFIG } from "@/lib/constants/site";
import { BLOG_POSTS } from "@/lib/constants/blog";
import { GradientPageBg } from "@/components/shared/page-bg";
import { BlogHero } from "@/components/blog/blog-hero";
import { BlogGrid } from "@/components/blog/blog-grid";
import { BlogBottomCta } from "@/components/blog/blog-bottom-cta";
import { BetaCta } from "@/components/shared/beta-cta";

export const metadata = createMetadata({
  title: "Agency Growth Blog | White Label Web Dev Insights | Boldteq",
  description:
    "Practical insights on white-label outsourcing, agency growth, web delivery systems, and conversion-focused execution — written for agencies that want to scale.",
  path: "/blog",
});

const breadcrumbs = breadcrumbSchema([{ name: "Blog", path: "/blog" }]);

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: `${SITE_CONFIG.name} Blog`,
  url: `${SITE_CONFIG.url}/blog`,
  description:
    "Practical insights on white-label outsourcing, agency growth, and execution systems for scaling agencies.",
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
  },
  blogPost: BLOG_POSTS.map((post) => ({
    "@type": "BlogPosting",
    headline: post.title,
    description: post.shortDescription,
    image: post.image,
    url: `${SITE_CONFIG.url}/blog/${post.slug}`,
  })),
};

export default function BlogPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} id="schema-breadcrumbs" />
      <JsonLd data={blogSchema} id="schema-blog" />
      <GradientPageBg />
      <BlogHero />
      <BlogGrid />
      <BlogBottomCta />
      <BetaCta />
    </>
  );
}
