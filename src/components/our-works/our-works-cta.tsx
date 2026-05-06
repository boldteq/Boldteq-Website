import Image from "next/image";
import { Button } from "@/components/primitives/button";
import styles from "./our-works-cta.module.css";

const BULLETS = [
  "Agencies with fluctuating demand",
  "Large monthly task volumes",
  "Multiple brands or clients",
];

export function OurWorksCta() {
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <div className={styles.inner}>
          <div className={styles.content}>
            <h2 className={styles.heading}>
              Ready to Deliver This Level of Work Under Your Brand?
            </h2>
            <p className={styles.subtitle}>
              Partner with Boldteq as your dedicated backend delivery team and
              gain a reliable, scalable foundation for your technology
              initiatives.
            </p>

            <div className={styles.bullets}>
              {BULLETS.map((text) => (
                <div key={text} className={styles.bullet}>
                  <Image
                    src="/images/webflow/blue-tick.svg"
                    alt=""
                    aria-hidden="true"
                    width={20}
                    height={20}
                    className={styles.bulletIcon}
                  />
                  <p className={styles.bulletText}>{text}</p>
                </div>
              ))}
            </div>

            <div className={styles.buttons}>
              <Button href="/book-a-demo" variant="primary" size="md">
                Book a Demo
              </Button>
              <Button href="/pricing" variant="secondary" size="md">
                View Plans
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
