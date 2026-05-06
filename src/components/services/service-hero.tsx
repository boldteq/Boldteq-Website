import Image from "next/image";
import { Button } from '@/components/primitives/button';
import styles from "./service-hero.module.css";

const STAT_BADGES = [
  { label: "White-Label by Default", icon: "/images/webflow/Layer_1-3.svg" },
  { label: "Senior Developers", icon: "/images/webflow/Layer_1-4.svg" },
  {
    label: "Subscription-Based Delivery",
    icon: "/images/webflow/Layer_1-5.svg",
  },
  { label: "NDA Protected", icon: "/images/webflow/Layer_1-6.svg" },
];

export function ServiceHero() {
  return (
    <section className={styles["section"]}>
      <div className={styles["container"]}>
        {/* Badge */}
        <div className={styles["badgeRow"]}>
          <div className={styles["badge"]}>
            <span className={styles["badgeText"]}>Web Development</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className={styles["heading"]}>
          White-Label Web Development for Agencies
        </h1>

        {/* Subtitle */}
        <p className={styles["subtitle"]}>
          Boldteq provides reliable, senior-level web development as part of a
          single monthly subscription — delivered under your brand, built for
          agency workflows.
        </p>

        {/* Stat cards — 4-col white-card grid (matches Webflow .web-ban-grid.mob-2grid) */}
        <div className={styles["statsGrid"]}>
          {STAT_BADGES.map((badge) => (
            <div key={badge.label} className={styles["statCard"]}>
              <Image
                src={badge.icon}
                alt=""
                aria-hidden="true"
                width={40}
                height={40}
                className={styles["statIcon"]}
              />
              <p className={styles["statLabel"]}>{badge.label}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className={styles["ctaRow"]}>
          <Button href="/pricing" variant="primary" size="md">
            View Pricing
          </Button>
          <Button href="/book-a-demo" variant="secondary" size="md">
            Book a Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
