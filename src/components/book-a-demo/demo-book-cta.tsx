import Script from "next/script";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants/site";
import styles from "./demo-book-cta.module.css";

const LEARN_ITEMS = [
  "How our subscription model works",
  "How unlimited tasks & unlimited revisions function",
  "What white-label delivery looks like",
  "Workflow, communication, and turnaround times",
  "Client onboarding best practices",
  "How to integrate Boldteq into your existing processes",
  "A live walkthrough of the Boldteq dashboard",
  "Real examples of agency-ready work",
];

export function DemoBookCta() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left column */}
          <div className={styles.leftCol}>
            <p className={styles.subheading}>Book a Demo</p>
            <h2 className={styles.heading}>
              See How Boldteq Can Power Your Agency&apos;s Growth
            </h2>
            <p className={styles.para}>
              A quick, personalized walkthrough of how our white-label creative
              team can help you scale without hiring, training, or overhead.
            </p>

            {/* Email contact */}
            <div className={styles.contactOuter}>
              <div className={styles.contactInn}>
                <Image
                  src="/images/webflow/Vector-16.svg"
                  alt="Email Icon"
                  width={18}
                  height={18}
                  className={styles.emailIcon}
                />
                <div className={styles.contactDiv}>
                  <p className={styles.skyLabel}>Email Us At:</p>
                  <p className={styles.callPhone}>
                    <a
                      href="mailto:sales@boldteq.com"
                      className={styles.anchorLink}
                    >
                      sales@boldteq.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* What you'll learn */}
            <p className={styles.learnLabel}>
              <strong>What You&apos;ll Learn in Your Demo:</strong>
            </p>
            {LEARN_ITEMS.map((item) => (
              <div key={item} className={styles.demoListItem}>
                <div className={styles.pricingCheck}>
                  <Image
                    src="/images/webflow/blue-tick.svg"
                    alt="Tick mark symbol"
                    width={16}
                    height={16}
                  />
                </div>
                <p className={styles.demoListText}>{item}</p>
              </div>
            ))}
          </div>

          {/* Right column — Calendly inline widget */}
          <div className={styles.rightCol}>
            <div
              className={styles.calendlyWrap}
              role="region"
              aria-label="Demo scheduling calendar"
            >
              {/* Empty node Calendly's script fills; min-height reserves space (no CLS) */}
              <div
                className={`calendly-inline-widget ${styles.calendlyWidget}`}
                data-url={`${SITE_CONFIG.calendly}?hide_event_type_details=1&hide_gdpr_banner=1`}
              />
            </div>
            {/* Always-visible fallback if the scheduler can't load / JS is blocked */}
            <p className={styles.calendlyFallback}>
              Calendar not loading?{" "}
              <a
                href={SITE_CONFIG.calendly}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open the booking page
              </a>{" "}
              or email{" "}
              <a href={`mailto:${SITE_CONFIG.email.sales}`}>
                {SITE_CONFIG.email.sales}
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
      />
    </section>
  );
}
