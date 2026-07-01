import Link from "next/link";
import styles from "./service-platforms.module.css";

const PLATFORMS = [
  {
    title: "Shopify Development",
    text: "From custom Liquid templates to full storefront builds — our Shopify developers have delivered 100+ stores with deep expertise in performance, UX, and conversion optimization.",
    ctaLabel: "See Shopify Scope",
    ctaHref: "/scope#scope-sec",
  },
  {
    title: "WordPress Development",
    text: "Custom themes, Gutenberg block libraries, WooCommerce stores, ACF-powered flexible layouts and robust maintenance plans — all white-labeled for your agency clients.",
    ctaLabel: "See WordPress Scope",
    ctaHref: "/scope?tab=wordpress#scope-sec",
  },
];

export function ServicePlatforms() {
  return (
    <section className={styles["section"]}>
      <div className={styles["container"]}>
        {/* Header */}
        <div className={styles["header"]}>
          <div className={styles["badgeRow"]}>
            <div className={styles["badge"]}>
              <span className={styles["badgeText"]}>Platform Expertise</span>
            </div>
          </div>
          <h2 className={styles["heading"]}>Platforms We Support</h2>
          <p className={styles["subtitle"]}>
            Boldteq provides white-label web development across leading
            platforms — giving agencies reliable, platform-specific execution
            without hiring in-house specialists.
          </p>
        </div>

        {/* Platform cards */}
        <div className={styles["grid"]}>
          {PLATFORMS.map((platform) => (
            <div key={platform.title} className={styles["card"]}>
              <h3 className={styles["cardTitle"]}>{platform.title}</h3>
              <p className={styles["cardText"]}>{platform.text}</p>
              <Link href={platform.ctaHref} className={styles["cardCta"]}>
                {platform.ctaLabel}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
