import Image from "next/image";
import styles from "./careers-selection.module.css";

const CARDS = [
  {
    icon: "/images/webflow/Layer_1-46.svg",
    title: "Structured Screening",
    text: "We review applications using a role-specific scorecard, focusing on proven results, clarity of thinking, and relevant experience — not just resumes.",
  },
  {
    icon: "/images/webflow/Layer_1-47.svg",
    title: "Work Sample Task",
    text: "Shortlisted candidates complete a practical assignment based on real client scenarios to evaluate execution quality, attention to detail, and decision-making.",
  },
  {
    icon: "/images/webflow/Layer_1-8.svg",
    title: "Live Problem Session",
    text: "Candidates participate in a focused discussion where we explore real challenges, communication style, and ownership mindset in action.",
  },
  {
    icon: "/images/webflow/Layer_1-49.svg",
    title: "Trial Project",
    text: "Final candidates may complete a short trial to demonstrate consistency, reliability, and alignment with Boldteq's performance standards.",
  },
];

export function CareersSelection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.outer}>
          <div className={styles.header}>
            <h2 className={styles.heading}>Our Selection Process</h2>
            <div className={styles.subtitleWrap}>
              <p className={styles.subtitle}>
                We follow a structured, skills-first hiring process designed to identify professionals who can consistently deliver high-quality work in a real-world environment.
              </p>
            </div>
          </div>

          <div className={styles.grid}>
            {CARDS.map((card) => (
              <div key={card.title} className={styles.card}>
                <Image
                  src={card.icon}
                  alt={`${card.title} icon`}
                  width={48}
                  height={48}
                  className={styles.cardIcon}
                  loading="lazy"
                />
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardText}>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
