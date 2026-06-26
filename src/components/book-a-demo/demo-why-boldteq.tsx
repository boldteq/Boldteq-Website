import Image from "next/image";
import styles from "./demo-why-boldteq.module.css";

const CARDS = [
  {
    icon: "/images/webflow/Layer_1-8.svg",
    iconWidth: 46,
    iconHeight: 46,
    title: "White-Label by Default",
    text: "We operate entirely under your brand. Your clients remain yours — always.",
  },
  {
    icon: "/images/webflow/Layer_1-20.svg",
    iconWidth: 46,
    iconHeight: 46,
    title: "Senior-Level Team",
    text: "Work is handled by experienced professionals who understand agency standards, timelines, and accountability — not rotating freelancers.",
  },
  {
    icon: "/images/webflow/Layer_1-10.svg",
    iconWidth: 46,
    iconHeight: 46,
    title: "Structured Delivery",
    text: "Clear systems, defined ownership, and predictable processes ensure consistent, client-ready output.",
  },
  {
    icon: "/images/webflow/Layer_1-21.svg",
    iconWidth: 40,
    iconHeight: 46,
    title: "Built for Agencies",
    text: "Everything about Boldteq is designed around agency workflows and ongoing client delivery — not one-off or solo work.",
  },
];

export function DemoWhyBoldteq() {
  return (
    <section className={styles["section"]}>
      <div className={styles["container"]}>
        <div className={styles["header"]}>
          <div className={styles["badgeRow"]}>
            <div className={styles["badge"]}>
              <p className={styles["badgeText"]}>Why Boldteq</p>
            </div>
          </div>
          <h2 className={styles["heading"]}>
            Why Agencies Choose Boldteq
          </h2>
          <p className={styles["subtitle"]}>
            Our delivery model prioritizes consistency, accountability, and brand
            protection — giving agencies a dependable backend team without
            operational risk.
          </p>
        </div>

        <div className={styles["grid"]}>
          {CARDS.map((card) => (
            <div key={card.title} className={styles["card"]}>
              <Image
                src={card.icon}
                alt=""
                aria-hidden="true"
                width={card.iconWidth}
                height={card.iconHeight}
                className={styles["cardIcon"]}
              />
              <h3 className={styles["cardTitle"]}>{card.title}</h3>
              <p className={styles["cardText"]}>{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
