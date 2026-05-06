import styles from "./service-pain-points.module.css";

const PAIN_POINTS = [
  {
    icon: "⏱️",
    title: "Deadlines Slip",
    text: "Dev bottlenecks delay launches. Clients notice. Relationships erode.",
  },
  {
    icon: "⚠️",
    title: "Quality Drops",
    text: "No two freelancers deliver the same standard — inconsistency kills agency credibility.",
  },
  {
    icon: "🐢",
    title: "Slow Hiring",
    text: "Recruiting, onboarding, tools, salaries — all before a single line of code ships.",
  },
  {
    icon: "🛡️",
    title: "Client Trust at Risk",
    text: "Every late delivery, every buggy handoff chips away at your agency's reputation.",
  },
];

export function ServicePainPoints() {
  return (
    <section className={styles["section"]}>
      <div className={styles["container"]}>
        {/* Header */}
        <div className={styles["header"]}>
          <div className={styles["badgeRow"]}>
            <div className={styles["badge"]}>
              <span className={styles["badgeText"]}>Why Agencies Struggle</span>
            </div>
          </div>
          <h2 className={styles["heading"]}>
            Why Web Development Becomes a Bottleneck as You Grow
          </h2>
          <p className={styles["subtitle"]}>
            As agencies scale, web development becomes the hardest part to
            manage. The usual options all come with trade-offs that limit your
            growth.
          </p>
        </div>

        {/* Cards */}
        <div className={styles["grid"]}>
          {PAIN_POINTS.map((point) => (
            <div key={point.title} className={styles["card"]}>
              <span
                className={styles["icon"]}
                role="img"
                aria-label={point.title}
              >
                {point.icon}
              </span>
              <h3 className={styles["cardTitle"]}>{point.title}</h3>
              <p className={styles["cardText"]}>{point.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
