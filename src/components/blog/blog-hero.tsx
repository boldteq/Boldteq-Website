import Image from "next/image";
import { Button } from '@/components/primitives/button';
import styles from "./blog-hero.module.css";

const STAT_BADGES = [
  { icon: "/images/webflow/Layer_1-14.svg", label: "Built for Agencies" },
  { icon: "/images/webflow/Layer_1-3.svg", label: "White-Label Expertise" },
  { icon: "/images/webflow/Layer_1-15.svg", label: "Execution-Focused" },
];

export function BlogHero() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.inner}>
          {/* H1 */}
          <h1 className={styles.heading}>
            Insights on Scaling Agencies with White-Label Delivery
          </h1>

          {/* Subtitle */}
          <p className={styles.subtitle}>
            Practical insights on white-label outsourcing, agency growth, web
            delivery systems, and conversion-focused execution — written for
            agency founders and leadership teams.
          </p>

          {/* Stat badges */}
          <div className={styles.badgeGridWrap}>
            <div className={styles.badgeGrid}>
              {STAT_BADGES.map((badge) => (
                <div key={badge.label} className={styles.badge}>
                  <Image
                    src={badge.icon}
                    alt=""
                    width={22}
                    height={22}
                    className={styles.badgeIcon}
                    aria-hidden="true"
                  />
                  <p className={styles.badgeLabel}>{badge.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className={styles.ctaWrap}>
            <Button href="/how-it-works" variant="primary" size="md">
              Explore How It Works
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
