import Image from "next/image";
import styles from "./how-works-steps.module.css";

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

export function HowWorksSteps() {
  return (
    <section className={styles["section"]}>
      <div className={styles["container"]}>
        {/* Badge */}
        <div className={styles["badgeRow"]}>
          <div className={styles["badge"]}>
            <p className={styles["badgeText"]}>How it works</p>
          </div>
        </div>

        <h2 className={styles["heading"]}>
          How White Label Web Development Works
        </h2>

        {/* Webflow hard-breaks after "simple requests," for two balanced lines. */}
        <p className={styles["subtitle"]}>
          A structured execution system built for agencies — simple requests,{" "}
          <br />
          predictable delivery, and full white-label support.
        </p>

        <div className={styles["featureGrid"]}>
          {STEPS.map((step) => (
            <div key={step.title} className={styles["featureCard"]}>
              <div className={styles["textWrapper"]}>
                <div className={styles["cardTitle"]}>{step.title}</div>
                <p className={styles["cardDesc"]}>{step.description}</p>
              </div>
              <Image
                src={step.imageSrc}
                alt={step.imageAlt}
                width={step.imageWidth}
                height={step.imageHeight}
                className={styles["fullWidthImage"]}
                sizes="(max-width: 767px) 100vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
