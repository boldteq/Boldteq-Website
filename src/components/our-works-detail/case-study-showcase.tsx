import Link from "next/link";
import type { PortfolioItem } from "@/types/portfolio";
import styles from "./case-study-showcase.module.css";

const PLATFORM_LABEL: Record<string, string> = {
  shopify: "Shopify",
  wordpress: "WordPress",
};

// Honest, generic highlights (no fabricated metrics) — true of every Boldteq build.
const HIGHLIGHTS = [
  "Custom, on-brand design",
  "Fully responsive across every device",
  "Performance-optimised build",
  "Delivered fully white-label",
];

interface CaseStudyShowcaseProps {
  item: PortfolioItem;
  /** Rendered inside the portfolio popup — fills the modal instead of 100vh. */
  embedded?: boolean;
}

/**
 * Lightweight project showcase for portfolio items that don't have a full
 * written case study. Presents the real design + platform + a CTA so the
 * popup/page always has meaningful content (never empty, never a 404).
 */
export function CaseStudyShowcase({ item, embedded = false }: CaseStudyShowcaseProps) {
  const platform = PLATFORM_LABEL[item.category] ?? item.category;

  return (
    <div className={`${styles.content} ${embedded ? styles.embedded : ""}`}>
      <div className={styles.heroSubott}>
        <div className={styles.badge}>
          <strong className={styles.badgeText}>{platform}</strong>
        </div>
      </div>

      <h2 className={styles.title}>{item.name}</h2>

      <p className={styles.desc}>
        A {platform} project from the Boldteq portfolio — designed and built to
        be clean, fast, and conversion-ready, and delivered fully white-label
        for our agency partners.
      </p>

      <ul className={styles.highlights}>
        {HIGHLIGHTS.map((h) => (
          <li key={h} className={styles.highlight}>
            <span className={styles.check} aria-hidden="true">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            {h}
          </li>
        ))}
      </ul>

      <div className={styles.ctaRow}>
        <Link href="/book-a-demo" className={styles.cta}>
          Start a project like this
        </Link>
        <Link href="/our-works" className={styles.back}>
          ← Back to all work
        </Link>
      </div>
    </div>
  );
}
