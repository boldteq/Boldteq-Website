import Image from "next/image";
import styles from "./beta-hero.module.css";

const STAT_BADGES = [
  { icon: "/images/webflow/Layer_1-3.svg", label: "White-Label by Default" },
  { icon: "/images/webflow/Layer_1-25.svg", label: "Senior-Level Team" },
  { icon: "/images/webflow/Layer_1-22.svg", label: "No Long-Term Contract" },
  { icon: "/images/webflow/Layer_1-26.svg", label: "Pause or Scale Anytime" },
];

export function BetaHero() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.inner}>
          {/* Badge */}
          <div className={styles.badgeRow}>
            <div className={styles.badge}>
              <p className={styles.badgeText}>
                Beta Access Open &mdash; Limited Spots Remaining
              </p>
            </div>
          </div>

          {/* H1 */}
          <h1 className={styles.heading}>
            Your Agency&rsquo;s Execution Team.
            <br />
            Ownership Driven.
          </h1>

          {/* Subtitle */}
          <p className={styles.subtitle}>
            Boldteq becomes the white-label backend for your agency &mdash;
            delivering QA-backed WordPress &amp; Shopify work with live
            tracking, so you scale without chaos or overhead.
          </p>

          {/* Stat badges */}
          <div className={styles.badgeGridWrap}>
            <div className={styles.badgeGrid}>
              {STAT_BADGES.map((b) => (
                <div key={b.label} className={styles.statBadge}>
                  <Image
                    src={b.icon}
                    alt=""
                    aria-hidden="true"
                    width={24}
                    height={24}
                    loading="eager"
                  />
                  <p className={styles.statLabel}>{b.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
