import Image from "next/image";
import { Button } from '@/components/primitives/button';
import styles from "./how-works-hero.module.css";

const STAT_BADGES = [
  {
    icon: "/images/webflow/Layer_1-3.svg",
    label: "White-Label by Default",
  },
  {
    icon: "/images/webflow/Layer_1-25.svg",
    label: "Senior-Level Team",
  },
  {
    icon: "/images/webflow/Layer_1-22.svg",
    label: "No Long-Term Contract",
  },
  {
    icon: "/images/webflow/Layer_1-26.svg",
    label: "Pause or Scale Anytime",
  },
];

export function HowWorksHero() {
  return (
    <div className={styles["section"]}>
      <div className={styles["container"]}>
        <div className={styles["inner"]}>
          {/* Badge */}
          <div className={styles["badgeRow"]}>
            <div className={styles["badge"]}>
              <p className={styles["badgeText"]}>Boldteq Work</p>
            </div>
          </div>

          {/* Heading */}
          <h1 className={styles["heading"]}>How Boldteq Works</h1>

          {/* Subtitle */}
          <p className={styles["subtitle"]}>
            A simple, structured white-label delivery process built for agency
            workflows from request to client-ready delivery.
          </p>

          {/* Stat badges grid */}
          <div className={styles["badgeGridWrap"]}>
            <div className={styles["badgeGrid"]}>
              {STAT_BADGES.map((badge) => (
                <div key={badge.label} className={styles["statBadge"]}>
                  <Image
                    src={badge.icon}
                    alt={`${badge.label} icon`}
                    width={24}
                    height={24}
                    loading="eager"
                  />
                  <p className={styles["statBadgeText"]}>{badge.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* GuideJar video embed */}
          <div className={styles["videoWrap"]}>
            <div className={styles["videoContainer"]}>
              <iframe
                src="https://www.guidejar.com/embed/xvH9rRaAyggwH1eetyrl?type=1&controls=on"
                width="100%"
                height="100%"
                style={{ position: "absolute", inset: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="How Boldteq white-label delivery works"
              />
            </div>
          </div>

          {/* CTA buttons */}
          <div className={styles["ctaRow"]}>
            <Button href="/pricing" variant="primary" size="md">
              See Plans
            </Button>
            <Button href="/book-a-demo" variant="secondary" size="md">
              Book a Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
