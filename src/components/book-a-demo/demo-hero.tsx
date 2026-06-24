import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants/site";
import styles from "./demo-hero.module.css";

const STAT_BADGES = [
  {
    icon: "/images/webflow/Layer_1-3.svg",
    label: "100% white-label",
  },
  {
    icon: "/images/webflow/Layer_1-14.svg",
    label: "Agency-only conversations",
  },
  {
    icon: "/images/webflow/Layer_1-15.svg",
    label: "No sales pressure",
  },
  {
    icon: "/images/webflow/Layer_1-16.svg",
    label: "15–30 minute walkthrough",
  },
];

export function DemoHero() {
  return (
    <div className={styles["section"]}>
      <div className={styles["container"]}>
        <div className={styles["inner"]}>
          {/* Badge */}
          <div className={styles["badgeRow"]}>
            <div className={styles["badge"]}>
              <p className={styles["badgeText"]}>Book Demo</p>
            </div>
          </div>

          {/* Heading */}
          <h1 className={styles["heading"]}>Book a Demo with Boldteq</h1>

          {/* Subtitle */}
          <p className={styles["subtitle"]}>
            See how Boldteq works as your white-label backend team — and how
            agencies use our subscription model to deliver faster without hiring.
          </p>

          {/* Stat badges grid */}
          <div className={styles["badgeGrid"]}>
            {STAT_BADGES.map((badge) => (
              <div key={badge.label} className={styles["statBadge"]}>
                <Image
                  src={badge.icon}
                  alt=""
                  aria-hidden="true"
                  width={24}
                  height={24}
                  className={styles["statIcon"]}
                  loading="eager"
                />
                <p className={styles["statBadgeText"]}>{badge.label}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className={styles["ctaRow"]}>
            <a
              href={SITE_CONFIG.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className={styles["ctaBtn"]}
              aria-label="Schedule your demo (opens Calendly in a new tab)"
            >
              Schedule Your Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
