import styles from "./demo-steps.module.css";

const STEPS = [
  {
    number: "1.",
    title: "Book a Time",
    text: "Choose a time slot that works for you. No preparation required.",
  },
  {
    number: "2.",
    title: "Walkthrough",
    text: "We walk you through our workflow, subscription plans, and delivery model, with space for your questions.",
  },
  {
    number: "3.",
    title: "Next Steps (If Needed)",
    text: "If there's a fit, we'll discuss next steps. If not, that's completely fine — no pressure either way.",
  },
  {
    number: "4.",
    title: "Micro-Reassurance",
    text: "No obligation and no pressure. The demo is simply a clear walkthrough to help you decide if Boldteq is the right fit.",
  },
];

export function DemoSteps() {
  return (
    <section className={styles["section"]}>
      <div className={styles["container"]}>
        <div className={styles["header"]}>
          <h2 className={styles["heading"]}>How the Demo Works</h2>
          <p className={styles["subtitle"]}>
            A short, transparent walkthrough focused on fit not a sales pitch.
          </p>
        </div>

        <div className={styles["stepsGrid"]}>
          {STEPS.map((step) => (
            <div key={step.number} className={styles["step"]}>
              <div className={styles["numberCircle"]}>
                <span className={styles["number"]}>{step.number}</span>
              </div>
              <h3 className={styles["stepTitle"]}>{step.title}</h3>
              <p className={styles["stepText"]}>{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
