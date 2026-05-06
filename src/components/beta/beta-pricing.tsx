import Image from "next/image";
import styles from "./beta-pricing.module.css";

interface BetaPlan {
  name: string;
  price: number;
  tagline: string;
  popular: boolean;
  features: string[];
  checkoutUrl: string;
}

const BETA_PLANS: BetaPlan[] = [
  {
    name: "Beta Lite",
    price: 299,
    tagline: "Perfect for trying Boldteq risk-free with real client work",
    popular: false,
    features: [
      "~15\u201320 hrs monthly capacity",
      "WordPress or Shopify support",
      "Small tasks, fixes & updates",
      "Single task at a time",
      "White-label delivery",
      "Smart Client Workspace access",
    ],
    checkoutUrl:
      "https://portal.boldteq.com/services/execution-starter-plan-dzoakl0d1zmcblxhztgo/checkout",
  },
  {
    name: "Beta Pro",
    price: 599,
    tagline: "For agencies ready to deliver full projects through Boldteq",
    popular: true,
    features: [
      "~30\u201340 hrs monthly capacity",
      "WordPress or Shopify development",
      "Website design & landing pages",
      "Single task at a time",
      "White-label delivery",
      "Smart Client Workspace access",
    ],
    checkoutUrl:
      "https://portal.boldteq.com/services/execution-growth-plan-wxstfzca0hg6qtr8yr56/checkout",
  },
];

function CheckIcon() {
  return (
    <Image
      src="/images/webflow/Vector-20.svg"
      alt="check icon"
      width={16}
      height={16}
      className={styles.checkIcon}
    />
  );
}

export function BetaPricing() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.titleGrid}>
          <div className={styles.maxWidth}>
            <div className={styles.badgeRow}>
              <div className={styles.badge}>
                <p className={styles.badgeText}>
                  <strong>Beta Access Pricing</strong>
                </p>
              </div>
            </div>
            <h2 className={styles.heading}>Try Boldteq completely risk-free</h2>
            <p className={styles.paragraph}>
              Start at beta price. Lock it in. Scale when you&rsquo;re ready
              &mdash; no contracts, no commitments.
            </p>
          </div>
        </div>

        {/* Plan cards */}
        <div className={styles.grid}>
          {BETA_PLANS.map((plan) => {
            const cardClass = plan.popular
              ? `${styles.card} ${styles.cardPopular}`
              : styles.card;
            const ctaClass = plan.popular
              ? `${styles.cta} ${styles.ctaSky}`
              : styles.cta;

            return (
              <div key={plan.name} className={cardClass}>
                {plan.popular && (
                  <div className={styles.popularBanner}>
                    <Image
                      src="/images/webflow/Layer_2.svg"
                      alt="flash icon"
                      width={18}
                      height={18}
                    />
                    <p className={styles.popularText}>Most Popular</p>
                  </div>
                )}

                <div className={styles.cardInner}>
                  <h6 className={styles.planName}>{plan.name}</h6>
                  <div className={styles.priceRow}>
                    <h3 className={styles.price}>${plan.price}/month</h3>
                  </div>
                  <p className={styles.tagline}>{plan.tagline}</p>
                </div>

                <div>
                  <div className={styles.featuresWrapper}>
                    <div className={styles.featuresLabel}>
                      <strong>What Includes:</strong>
                    </div>
                    {plan.features.map((feature) => (
                      <div key={feature} className={styles.feature}>
                        <CheckIcon />
                        <div className={styles.featureText}>{feature}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={plan.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={ctaClass}
                >
                  <div>Start Beta</div>
                </a>
                <div className={styles.caption}>
                  &#x26A1; Limited beta spots available
                </div>
              </div>
            );
          })}

          {/* Bug Report card */}
          <div className={styles.infoCard}>
            <div className={styles.infoCardInner}>
              <div className={styles.infoIcon}>&#x1F41E;</div>
              <h3 className={styles.infoTitle}>
                Report a Bug or Give Feedback
              </h3>
              <p className={styles.infoText}>
                Spot an issue or have a product suggestion? Share it and earn{" "}
                <strong>up to 20 complimentary hours</strong> added directly to
                your plan. We&rsquo;re building this together.
              </p>
            </div>
          </div>

          {/* Add-On Hours card */}
          <div className={styles.infoCard}>
            <div className={styles.infoCardInner}>
              <div className={styles.infoIcon}>&#x2795;</div>
              <h3 className={styles.infoTitle}>
                Need More Hours? Add On Anytime.
              </h3>
              <p className={styles.infoText}>
                Satisfied with Boldteq? Purchase{" "}
                <strong>Add-On hour packs</strong> anytime to extend your
                monthly capacity &mdash; no plan upgrade required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
