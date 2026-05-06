import styles from "./beta-how-it-works.module.css";

const STEPS = [
  {
    title: "Choose Your Plan",
    text: "Pick Lite or Pro. Your dedicated delivery owner and Smart Client Workspace go live within 12 hours. No ramp-up, no waiting.",
    badge: "⚡ Live in 12 hours",
  },
  {
    title: "Submit Your First Task",
    text: "Use your dashboard to submit any WordPress or Shopify request. We start the same day. Track live progress without chasing anyone.",
    badge: "📋 Same-day start",
  },
  {
    title: "Review, Approve & Send",
    text: "Receive QA-checked, white-label work in 24–48h. Approve in your workspace, then send straight to your client — under your brand.",
    badge: "✅ Client-ready output",
  },
];

export function BetaHowItWorks() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Badge */}
        <div className={styles.tagBadgeWrap}>
          <div className={styles.tagBadge}>
            <p className={styles.badgeInner}>
              <strong className={styles.badgeText}>How it works</strong>
            </p>
          </div>
        </div>

        {/* Heading */}
        <h2 className={styles.heading}>
          Simple to start.
          <br />
          Structured to scale.
        </h2>

        {/* Subtitle */}
        <p className={styles.subtitle}>
          From signup to first delivery — here&rsquo;s exactly what happens.
        </p>

        {/* Feature grid */}
        <div className={styles.featureGrid}>
          {STEPS.map((step) => (
            <div key={step.title} className={styles.featureCard}>
              <div className={styles.textWrapper}>
                <div className={styles.cardTitle}>{step.title}</div>
                <p className={styles.cardText}>{step.text}</p>
                <div className={styles.innerBadge}>
                  <p className={styles.innerBadgeInner}>
                    <strong className={styles.innBadgeText}>{step.badge}</strong>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
