import Image from "next/image";
import { Button } from '@/components/primitives/button';
import styles from "./custom-plan-cta.module.css";

const BENEFITS = [
  "Flexible capacity",
  "Custom turnaround",
  "Multiple projects or brands",
  "Simple monthly pricing",
];

export function CustomPlanCta() {
  return (
    <section className={styles["section"]}>
      <div className={styles["container"]}>
        <div className={styles["card"]}>
          <div className={styles["inner"]}>
            <div className={styles["content"]}>
          <div className={styles["textBlock"]}>
            <h2 className={styles["heading"]}>
              Need Something More Flexible?
            </h2>
            <p className={styles["subtitle"]}>
              Create a custom subscription based on your workload, turnaround
              needs, and workflow.
            </p>
          </div>

          <div className={styles["benefitsRow"]}>
            {BENEFITS.map((benefit) => (
              <div key={benefit} className={styles["benefitItem"]}>
                <div className={styles["checkWrap"]}>
                  <Image
                    src="/images/webflow/Group-1.svg"
                    alt="check"
                    width={19}
                    height={19}
                    className={styles["checkIcon"]}
                  />
                </div>
                <span className={styles["benefitText"]}>{benefit}</span>
              </div>
            ))}
          </div>

          <Button href="/contact" variant="primary" size="md">
            Build Your Custom Plan
          </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
