import Link from "next/link";
import styles from "./process-steps.module.css";

const STEPS = [
  {
    number: "1.",
    title: "Subscribe to a Plan",
    text: "Select a monthly plan based on the level of capacity, speed, and support your agency needs. No contracts. No surprises.",
  },
  {
    number: "2.",
    title: "Submit Requests",
    text: "Send tasks through our request system with clear instructions, references, and priorities. Everything stays organized — no long email threads.",
  },
  {
    number: "3.",
    title: "We Deliver",
    text: "Your dedicated Boldteq team handles execution, reviews, and refinements — following internal quality checks before delivery.",
  },
  {
    number: "4.",
    title: "Review & Refine",
    text: "Need changes? Submit revisions directly in the portal. We refine until the output meets your expectations and client standards.",
  },
];

export function ProcessSteps() {
  return (
    <section className={styles["section"]}>
      <div className={styles["container"]}>
        {/* Outer flex column */}
        <div className={styles["outer"]}>
          {/* Header: 2-column grid — heading left, text+CTA right */}
          <div className={styles["headerGrid"]}>
            <h2 className={styles["heading"]}>
              Built for Agencies That Need Predictable Delivery
            </h2>
            <div className={styles["headerRight"]}>
              <p className={styles["subtitle"]}>
                Boldteq is built to slot seamlessly into your agency workflow.
                From subscription to final delivery, every step is structured,
                transparent, and designed to keep projects moving without delays,
                confusion, or overhead.
              </p>
              <Link href="/book-a-demo" className={styles["demoLink"]}>
                Book a Demo
              </Link>
            </div>
          </div>

          {/* 4-step grid */}
          <div className={styles["stepsGrid"]}>
            {STEPS.map((step) => (
              <div key={step.number} className={styles["step"]}>
                <div className={styles["numberCircle"]}>
                  <span className={styles["number"]}>{step.number}</span>
                </div>
                <div className={styles["dashedDivider"]} aria-hidden="true" />
                <h3 className={styles["stepTitle"]}>{step.title}</h3>
                <p className={styles["stepText"]}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
