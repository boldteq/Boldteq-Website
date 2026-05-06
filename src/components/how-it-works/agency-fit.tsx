import Image from "next/image";
import styles from "./agency-fit.module.css";

const CARDS = [
  {
    icon: "/images/webflow/Layer_1-21.svg",
    title: "Your Agency",
    text: "You own the strategy, sell the work, and manage client relationships. You remain the face, the expert, and the decision-maker.",
  },
  {
    icon: "/images/webflow/Layer_1-37.svg",
    title: "Boldteq (Backend Team)",
    text: "We operate behind the scenes as your white-label delivery team handling UI/UX, design, and development under your brand standards.",
  },
  {
    icon: "/images/webflow/Layer_1-38.svg",
    title: "Your Client",
    text: "Receives polished, on-time deliverables as if produced by your in-house team. We stay invisible. You stay in control.",
  },
];

export function AgencyFit() {
  return (
    <section className={styles["section"]}>
      <div className={styles["container"]}>
        <div className={styles["header"]}>
          <h2 className={styles["heading"]}>
            Boldteq Fits Quietly Into Your Agency
          </h2>
          <p className={styles["subtitle"]}>
            Boldteq operates as your backend delivery team — supporting your
            agency without changing how you sell, manage clients, or present your
            brand.
          </p>
        </div>

        <div className={styles["grid"]}>
          {CARDS.map((card) => (
            <div key={card.title} className={styles["card"]}>
              <Image
                src={card.icon}
                alt={`${card.title} icon`}
                width={48}
                height={48}
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
