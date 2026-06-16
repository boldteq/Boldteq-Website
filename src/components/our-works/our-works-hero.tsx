import Image from "next/image";
import styles from "./our-works-hero.module.css";

// width/height = each SVG's intrinsic size so the icons aren't distorted
// (Webflow renders these <img> at their natural ~20px height).
const STAT_BADGES = [
  { icon: "/images/webflow/Layer_1-54.svg", w: 22, h: 20, label: "4.8/5 from 75+ agencies" },
  { icon: "/images/webflow/Layer_1-55.svg", w: 20, h: 20, label: "Predictable timelines" },
  { icon: "/images/webflow/Layer_1-23.svg", w: 15, h: 20, label: "White-label delivery" },
  { icon: "/images/webflow/Layer_1-56.svg", w: 23, h: 20, label: "Dedicated ownership" },
] as const;

export function OurWorksHero() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.inner}>
          {/* Badge */}
          <div className={styles.badgeRow}>
            <div className={styles.badge}>
              <p className={styles.badgeText}>Our Work</p>
            </div>
          </div>

          {/* H1 */}
          <h1 className={styles.heading}>
            Agency-Level Delivery. <br />
            Without Hiring or Chaos.
          </h1>

          {/* Subtitle */}
          <p className={styles.subtitle}>
            Real client-ready work — powered by Boldteq CRM, structured
            execution, and dedicated ownership.
          </p>

          {/* Stat badges */}
          <div className={styles.badgeGridWrap}>
            <div className={styles.badgeGrid}>
              {STAT_BADGES.map((badge) => (
                <div key={badge.label} className={styles.badgeBox}>
                  <Image
                    src={badge.icon}
                    alt=""
                    aria-hidden="true"
                    width={badge.w}
                    height={badge.h}
                    className={styles.badgeIcon}
                    loading="eager"
                  />
                  <p className={styles.badgeText2}>{badge.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
