import styles from "./service-capabilities.module.css";

const CAPABILITIES = [
  {
    icon: "🏗️",
    title: "Full Website Builds",
    text: "End-to-end website development aligned with your designs, briefs, and client requirements. We handle front-end, integrations, and QA.",
    badge: "Most Requested",
  },
  {
    icon: "🛍️",
    title: "Shopify Development",
    text: "Custom themes, sections, store builds, Liquid templating, app integrations, and performance tuning — all Shopify, all white-label.",
    badge: "E-Commerce",
  },
  {
    icon: "⚙️",
    title: "WordPress Development",
    text: "Custom theme development, Gutenberg blocks, plugin configuration, ACF builds, WooCommerce, and ongoing WP maintenance.",
    badge: "CMS",
  },
  {
    icon: "🧩",
    title: "Custom Components",
    text: "Reusable, responsive UI sections and layouts tailored per-project — interactive sliders, mega-menus, dynamic content blocks.",
    badge: "UI Components",
  },
  {
    icon: "🐛",
    title: "Bug Fixes & Support",
    text: "Fast resolution of layout, functionality, and cross-browser compatibility issues. Triaged by priority, logged in your portal.",
    badge: "Priority Support",
  },
  {
    icon: "⚡",
    title: "Speed & Core Web Vitals",
    text: "Image optimization, lazy loading, caching setup, Core Web Vitals tuning — we make your clients' sites rank faster and load faster.",
    badge: "Performance",
  },
];

export function ServiceCapabilities() {
  return (
    <section className={styles["section"]}>
      <div className={styles["container"]}>
        {/* Header */}
        <div className={styles["header"]}>
          <div className={styles["badgeRow"]}>
            <div className={styles["badge"]}>
              <span className={styles["badgeText"]}>What We Handle</span>
            </div>
          </div>
          <h2 className={styles["heading"]}>
            What Our Web Development Team Handles
          </h2>
          <p className={styles["subtitle"]}>
            Boldteq takes care of the technical execution so your team
            doesn&apos;t have to manage builds, fixes, or ongoing client
            requests.
          </p>
        </div>

        {/* Cards grid */}
        <div className={styles["grid"]}>
          {CAPABILITIES.map((cap) => (
            <div key={cap.title} className={styles["card"]}>
              <span className={styles["cardIcon"]} aria-hidden="true">
                {cap.icon}
              </span>
              <h3 className={styles["cardTitle"]}>{cap.title}</h3>
              <p className={styles["cardText"]}>{cap.text}</p>
              <div className={styles["innerBadge"]}>
                <span className={styles["innerBadgeText"]}>{cap.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
