import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/types/blog";
import { getCategoryLabel } from "@/lib/constants/blog";
import styles from "./blog-card.module.css";

interface BlogCardProps {
  post: BlogPost;
  /** Eagerly load + prioritize this card's image (above-the-fold LCP) */
  priority?: boolean;
}

export function BlogCard({ post, priority = false }: BlogCardProps) {
  const categoryLabel = getCategoryLabel(post.category);
  const href = `/blog-posts/${post.slug}`;

  return (
    <article className={styles.cardWrapper}>
      {/* content_card-blog — image-only card (240–270px, bordered, 20px radius, 10px padding) */}
      <div className={styles.imageCard}>
        <Link href={href} className={styles.imageLink} aria-label={post.title}>
          <Image
            src={post.image}
            alt="" aria-hidden="true"
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className={styles.image}
            {...(priority ? { priority: true } : { loading: "lazy" })}
          />
        </Link>
      </div>

      {/* content_card-block-blog — sibling text body */}
      <div className={styles.body}>
        {/* category tag — eyebrow above the title (was floating top-right) */}
        <span className={styles.category}>{categoryLabel}</span>

        <Link href={href} className={styles.titleLink}>
          <h3 className={styles.title}>{post.title}</h3>
        </Link>

        <p className={styles.description}>{post.shortDescription}</p>

        <Link
          href={href}
          className={styles.readBtn}
          aria-label={`Read article: ${post.title}`}
        >
          Read Article
        </Link>
      </div>
    </article>
  );
}
