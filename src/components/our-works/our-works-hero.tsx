import Image from "next/image";
import styles from "./our-works-hero.module.css";

const STAT_BADGES = [
  { icon: "/images/webflow/Layer_1-54.svg", label: "4.8/5 from 75+ agencies" },
  { icon: "/images/webflow/Layer_1-55.svg", label: "Predictable timelines" },
  { icon: "/images/webflow/Layer_1-23.svg", label: "White-label delivery" },
  { icon: "/images/webflow/Layer_1-56.svg", label: "Dedicated ownership" },
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
                    width={24}
                    height={24}
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
