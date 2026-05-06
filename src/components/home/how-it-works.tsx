import Image from "next/image";
import styles from "./how-it-works.module.css";

const STEPS = [
  {
    title: "Choose Your Subscription",
    description:
      "Start scaling today. Your delivery team is live within 12 hours.",
    imageSrc: "/images/webflow/Rectangle-243.png",
    imageAlt: "Boldteq subscription plan order summary screen",
    imageWidth: 1492,
    imageHeight: 840,
  },
  {
    title: "Submit Your Tasks",
    description: "Submit requests anytime. We start within hours, not days.",
    imageSrc: "/images/webflow/Rectangle-244.png",
    imageAlt: "Boldteq task submission form with title field interface",
    imageWidth: 1492,
    imageHeight: 840,
  },
  {
    title: "Review & Approve",
    description:
      "We deliver white-label work you can confidently send to your clients.",
    imageSrc: "/images/webflow/Rectangle-186.png",
    imageAlt:
      "Boldteq delivered white-label homepage redesign ready for client approval",
    imageWidth: 1492,
    imageHeight: 840,
  },
];

export function HowItWorks() {
  return (
    <section className={styles['sectionRegular3BlueSec']}>
      <div className={styles['containerLarge3']}>
        <div className={styles['howWorkTagBadge']}>
          <div className={styles['howWorkBadge']}>
            <p className={styles['badgePillText']}>
              <strong className={styles['faqSkyText']}>How it works</strong>
            </p>
          </div>
        </div>

        <h2 className={styles['heading2WhiteHeading']}>
          <strong>How Boldteq Works</strong>
        </h2>

        <p className={styles['paragraphWhiteOpacity']}>
          A structured execution system built for agencies — simple requests,{" "}
          <br />
          predictable delivery, and full white-label support.
        </p>

        <div className={styles['featureGrid']}>
          {STEPS.map((step) => (
            <div key={step.title} className={styles['featureCardBlue']}>
              <div className={styles['textWrapper']}>
                <div className={styles['subheadingLargeWhite']}>
                  <strong>{step.title}</strong>
                </div>
                <p className={styles['paragraphSmall2WhiteOpacity']}>
                  {step.description}
                </p>
              </div>
              <div className={styles['imageWrapper']}>
                <Image
                  src={step.imageSrc}
                  alt={step.imageAlt}
                  fill
                  className={styles['fullWidthImage']}
                  sizes="(max-width: 767px) 100vw, 33vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
