import styles from "./service-process.module.css";

const STEPS = [
  {
    number: "1.",
    title: "Choose a Plan",
    text: "Pick a subscription based on your delivery volume and turnaround needs. Scale up anytime.",
  },
  {
    number: "2.",
    title: "Submit via Portal",
    text: "Share tasks through your private portal with scope, designs, references, and priority levels.",
  },
  {
    number: "3.",
    title: "We Build & QA",
    text: "Senior developers handle execution and thorough internal QA before anything ships to you.",
  },
  {
    number: "4.",
    title: "Client-Ready Delivery",
    text: "Receive clean, white-label deliverables ready to hand directly to your client. No cleanup needed.",
  },
];

export function ServiceProcess() {
  return (
    <section className={styles["section"]}>
      <div className={styles["container"]}>
        {/* Header */}
        <div className={styles["header"]}>
          <div className={styles["badgeRow"]}>
            <div className={styles["badge"]}>
              <span className={styles["badgeText"]}>How It Works</span>
            </div>
          </div>
          <h2 className={styles["heading"]}>How We Bring Products to Life</h2>
          <p className={styles["subtitle"]}>
            Our four-step approach bridges the gap between imagination and
            execution — building products that actually perform.
          </p>
        </div>

        {/* Steps */}
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
