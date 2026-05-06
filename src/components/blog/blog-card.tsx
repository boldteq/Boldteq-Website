import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/types/blog";
import styles from "./blog-card.module.css";

const CATEGORY_LABELS: Record<string, string> = {
  cro: "CRO",
  shopify: "Shopify",
  "ui-ux-design": "UI/UX Design",
  "web-development": "Web Development",
  "white-label-outsourcing": "White-Label & Outsourcing",
  wordpress: "WordPress",
};

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const categoryLabel = CATEGORY_LABELS[post.category] ?? post.category;
  const href = `/blog/${post.slug}`;

  return (
    <article className={styles.cardWrapper}>
      {/* content_card-blog — image-only card (240–270px, bordered, 20px radius, 10px padding) */}
      <div className={styles.imageCard}>
        <Link href={href} className={styles.imageLink} aria-label={post.title}>
          <Image
            src={post.image}
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className={styles.image}
            loading="lazy"
          />
        </Link>
      </div>

      {/* content_card-block-blog — sibling text body */}
      <div className={styles.body}>
        {/* content_card-header — flex row: title left, gradient cat right */}
        <div className={styles.header}>
          <Link href={href} className={styles.titleLink}>
            <h3 className={styles.title}>{post.title}</h3>
          </Link>
          <p className={styles.category}>{categoryLabel}</p>
        </div>

        <p className={styles.description}>{post.shortDescription}</p>

        <Link href={href} className={styles.readBtn}>
          Read Article
        </Link>
      </div>
    </article>
  );
}
