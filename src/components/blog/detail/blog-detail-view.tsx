import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/types/blog";
import { SITE_CONFIG } from "@/lib/constants/site";
import { BlogCard } from "../blog-card";
import styles from "./blog-detail.module.css";

const CATEGORY_LABELS: Record<string, string> = {
  cro: "CRO",
  shopify: "Shopify",
  "ui-ux-design": "UI/UX Design",
  "web-development": "Web Development",
  "white-label-outsourcing": "White-Label & Outsourcing",
  wordpress: "WordPress",
};

interface BlogDetailViewProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogDetailView({ post, relatedPosts }: BlogDetailViewProps) {
  const categoryLabel = CATEGORY_LABELS[post.category] ?? post.category;
  const postUrl = `${SITE_CONFIG.url}/blog-posts/${post.slug}`;
  const shareTitle = encodeURIComponent(post.title);
  const shareUrl = encodeURIComponent(postUrl);

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        {/* Back link */}
        <Link href="/blog" className={styles.backLink}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Blog
        </Link>

        {/* blog-detail-top-grid */}
        <div className={styles.topGrid}>
          {/* ── Main content column ── */}
          <main className={styles.mainCol}>
            {/* content_card-title.blog-detail-title */}
            <h1 className={styles.postTitle}>{post.title}</h1>

            {/* blog-detail-cat-name-top (gradient) */}
            <p className={styles.catNameTop}>{categoryLabel}</p>

            {/* short description */}
            <p className={styles.catName}>{post.shortDescription}</p>

            {/* blog-detail-image */}
            <Image
              src={post.image}
              alt={`${post.title} cover image`}
              width={800}
              height={450}
              className={styles.coverImage}
              priority
              sizes="(max-width: 991px) 100vw, 800px"
            />

            {/* Rich text body from CMS */}
            <div
              className={styles.body}
              dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
            />
          </main>

          {/* ── Sidebar — 3 blocks per Webflow detail_blog-posts.html L344-L384 ── */}
          <aside className={styles.sidebar} aria-label="Article sidebar">
            {/* Author block */}
            <div className={styles.sidebarBlock}>
              <p className={styles.sidebarLabel}>Author</p>
              <div className={styles.authorRow}>
                <Image
                  src="/images/webflow/53ca939ea8306f9306c2a81fd38c72ba62512c86.png"
                  alt="" aria-hidden="true"
                  width={49}
                  height={49}
                  className={styles.authorImage}
                />
                <div className={styles.authorMeta}>
                  <h4 className={styles.authorName}>Cameron Williamson</h4>
                  <p className={styles.authorRole}>Co-Founder @Boldteq</p>
                </div>
              </div>
              <p className={styles.publishLabel}>Published</p>
              <p className={styles.publishDate}>
                {formatDate(post.publishedAt)}
              </p>
            </div>

            {/* Share block */}
            <div className={styles.sidebarBlock}>
              <p className={styles.shareLabel}>Share</p>
              <div className={styles.shareRow}>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.shareLink}
                  aria-label="Share on LinkedIn"
                >
                  <Image
                    src="/images/webflow/ri_linkedin-fill.svg"
                    alt=""
                    width={24}
                    height={24}
                    aria-hidden="true"
                  />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.shareLink}
                  aria-label="Share on Facebook"
                >
                  <Image
                    src="/images/webflow/basil_facebook-solid.svg"
                    alt=""
                    width={24}
                    height={24}
                    aria-hidden="true"
                  />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.shareLink}
                  aria-label="Share on X"
                >
                  <Image
                    src="/images/webflow/mdi_instagram.svg"
                    alt=""
                    width={24}
                    height={24}
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>

            {/* Categories block + sky CTA */}
            <div className={styles.sidebarBlock}>
              <p className={styles.shareLabel}>Categories</p>
              <Link
                href={`/blog?category=${post.category}`}
                className={styles.catLink}
              >
                {categoryLabel}
              </Link>

              <div className={styles.sidebarCta}>
                <h2 className={styles.sidebarCtaTitle}>
                  Looking for design support?
                </h2>
                <p className={styles.sidebarCtaPara}>
                  Hire top designers for a fixed monthly rate.
                </p>
                <Link href="/book-a-demo" className={styles.sidebarCtaBtn}>
                  Schedule Demo
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Continue Reading */}
        {relatedPosts.length > 0 && (
          <section
            className={styles.relatedSection}
            aria-label="Continue reading"
          >
            <div className={styles.continueHeader}>
              <h2 className={styles.continueHeading}>Continue Reading</h2>
              <p className={styles.continueSubtitle}>
                Practical perspectives on agency growth, white-label delivery,
                and execution systems — written for teams scaling client work.
              </p>
            </div>
            <ul className={styles.relatedGrid} role="list">
              {relatedPosts.map((related) => (
                <li key={related.slug}>
                  <BlogCard post={related} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </section>
  );
}
