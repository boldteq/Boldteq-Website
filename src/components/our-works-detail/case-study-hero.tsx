import Image from "next/image";
import type { PortfolioDetail } from "@/types/portfolio";
import styles from "./case-study-hero.module.css";

interface CaseStudyHeroProps {
  detail: PortfolioDetail;
}

export function CaseStudyHero({ detail }: CaseStudyHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <span className={styles.badge}>
          <strong style={{
            color: "var(--color-brand-cyan)",
            WebkitTextFillColor: "transparent",
            backgroundImage: "linear-gradient(90deg, #21cfff, #019ae6)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}>{detail.platform}</strong>
        </span>
        <h1 className={styles.title}>{detail.title}</h1>
        <div className={styles.metaRow}>
          <div className={styles.metaItem}>
            <Image
              src="/images/webflow/Group-47135-2.svg"
              alt=""
              width={18}
              height={18}
              className={styles.metaIcon}
              aria-hidden="true"
            />
            <span className={styles.metaText}>{detail.meta.role}</span>
          </div>
          <div className={styles.metaItem}>
            <Image
              src="/images/webflow/Vector-27.svg"
              alt=""
              width={16}
              height={16}
              className={styles.metaIcon}
              aria-hidden="true"
            />
            <span className={styles.metaText}>{detail.meta.teamSize}</span>
          </div>
          <div className={styles.metaItem}>
            <Image
              src="/images/webflow/Group-3.svg"
              alt=""
              width={18}
              height={18}
              className={styles.metaIcon}
              aria-hidden="true"
            />
            <span className={styles.metaText}>{detail.meta.duration}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
