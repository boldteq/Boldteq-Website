"use client";

import Image from "next/image";
import type { PortfolioItem } from "@/types/portfolio";
import styles from "./portfolio-card.module.css";

const CATEGORY_LABELS: Record<string, string> = {
  shopify: "Shopify",
  wordpress: "WordPress",
};

interface PortfolioCardProps {
  item: PortfolioItem;
  onCardClick: (item: PortfolioItem) => void;
  eager?: boolean;
}

export function PortfolioCard({ item, onCardClick, eager = false }: PortfolioCardProps) {
  return (
    <button
      type="button"
      className={styles.card}
      onClick={() => onCardClick(item)}
      aria-label={`View ${item.name} project`}
    >
      <div className={styles.imageWrapper}>
        {/* Category badge — top left */}
        <span className={styles.categoryBadge}>
          {CATEGORY_LABELS[item.category] ?? item.category}
        </span>

        {/* Card image — fill mode, unoptimized=false to enable priority preloading */}
        <Image
          src={item.featuredImage}
          alt={`${item.name} — Boldteq portfolio project`}
          fill
          sizes="(max-width: 767px) 90vw, (max-width: 991px) 45vw, 480px"
          className={styles.image}
          loading={eager ? "eager" : "lazy"}
          priority={eager}
          unoptimized={false}
        />

        {/* Eye icon — bottom right (decorative overlay) */}
        <Image
          src="/images/webflow/Vector-25.svg"
          alt=""
          aria-hidden="true"
          width={33}
          height={33}
          className={styles.eyeIcon}
        />
      </div>
    </button>
  );
}
