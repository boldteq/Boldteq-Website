import Image from "next/image";
import styles from "./demo-covers.module.css";

const CARDS = [
  {
    icon: "/images/webflow/Layer_1-17.svg",
    title: "Delivery Workflow",
    text: "How tasks move from request → execution → review → client-ready delivery.",
  },
  {
    icon: "/images/webflow/Layer_1-18.svg",
    title: "Subscription Model",
    text: "How our plans work, how capacity is handled, and how agencies scale.",
  },
  {
    icon: "/images/webflow/Layer_1-8.svg",
    title: "White-Label Operations",
    text: "How we stay invisible while supporting your client delivery.",
  },
  {
    icon: "/images/webflow/Layer_1-19.svg",
    title: "Real Use Cases",
    text: "How agencies use Boldteq for web, Shopify, UI/UX, and ongoing work.",
  },
];

export function DemoCovers() {
  return (
    <section className={styles["section"]}>
      <div className={styles["container"]}>
        <div className={styles["header"]}>
          <h2 className={styles["heading"]}>
            What We&apos;ll Cover in the Demo
          </h2>
          <p className={styles["subtitle"]}>
            A focused walkthrough of how Boldteq operates as your white-label
            delivery partner — so you can evaluate fit before making any
            commitment.
          </p>
        </div>

        <div className={styles["grid"]}>
          {CARDS.map((card) => (
            <div key={card.title} className={styles["card"]}>
              <Image
                src={card.icon}
                alt=""
                aria-hidden="true"
                width={45}
                height={45}
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
