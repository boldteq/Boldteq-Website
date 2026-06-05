import Image from "next/image";
import styles from "./risk-removal.module.css";

// Icon w/h = each SVG's intrinsic size; Webflow renders .web6-icon bare (no CSS size).
const CARDS = [
  {
    icon: "/images/webflow/Layer_1-30.svg",
    w: 45,
    h: 45,
    title: "White-Label by Default",
    text: "Every deliverable is produced under your brand. We remain fully invisible and never communicate with your clients \u2014 your agency stays front and center.",
  },
  {
    icon: "/images/webflow/Layer_1-20.svg",
    w: 46,
    h: 46,
    title: "Dedicated Team",
    text: "You work with a consistent delivery team that understands your workflow, standards, and expectations \u2014 not rotating or anonymous freelancers.",
  },
  {
    icon: "/images/webflow/Layer_1-10.svg",
    w: 46,
    h: 46,
    title: "Predictable Turnaround",
    text: "Clear turnaround timelines are defined based on task scope and your selected plan, so you always know what\u2019s coming and when.",
  },
  {
    icon: "/images/webflow/Layer_1-32.svg",
    w: 45,
    h: 45,
    title: "Quality Control",
    text: "Each task goes through internal quality checks to ensure accuracy, consistency, and client-ready output before delivery.",
  },
];

export function RiskRemoval() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.heading}>
            Designed to Remove Risk at Every Step
          </h2>
          <p className={styles.subtitle}>
            From white-label delivery to quality checks and dedicated teams,
            every safeguard exists to protect your client relationships and
            reputation.
          </p>
        </div>

        <div className={styles.grid}>
          {CARDS.map((card) => (
            <div key={card.title} className={styles.card}>
              <Image
                src={card.icon}
                alt={`${card.title} icon`}
                width={card.w}
                height={card.h}
                className={styles.cardIcon}
              />
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardText}>{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
