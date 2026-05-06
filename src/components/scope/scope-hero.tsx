import Image from "next/image";
import styles from "./scope-hero.module.css";

const STATS = [
  { icon: "/images/webflow/Layer_1-54.svg", text: "4.8/5 from 75+ agencies" },
  { icon: "/images/webflow/Layer_1-55.svg", text: "Predictable timelines" },
  { icon: "/images/webflow/Layer_1-23.svg", text: "White-label delivery" },
  { icon: "/images/webflow/Layer_1-56.svg", text: "Dedicated ownership" },
];

export function ScopeHero() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.inner}>
          {/* Badge */}
          <div className={styles.badgeRow}>
            <div className={styles.badge}>
              <p className={styles.badgeText}>Full Scope</p>
            </div>
          </div>

          {/* H1 */}
          <h1 className={styles.heading}>
            Everything We Can Handle
            <br />
            for Your Business
          </h1>

          {/* Subtitle */}
          <p className={styles.subtitle}>
            From quick fixes to complete store builds, our team supports businesses
            at every stage. Whether you need a small design tweak or advanced custom
            development, we deliver scalable solutions focused on performance and
            conversion.
          </p>

          {/* Stat badges */}
          <div className={styles.badgeGridWrap}>
            <div className={styles.badgeGrid}>
              {STATS.map((stat) => (
                <div key={stat.text} className={styles.badgeBox}>
                  <Image
                    src={stat.icon}
                    alt=""
                    width={24}
                    height={24}
                    className={styles.badgeIcon}
                  />
                  <p className={styles.badgeText2}>{stat.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
