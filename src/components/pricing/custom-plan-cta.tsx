import Image from "next/image";
import Link from "next/link";
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
            {/* Webflow .column-regular.column-left — h2, p, benefits row and the
                anchor are DIRECT flex children (no intermediate wrapper), matching
                pricing.html:1142-1163. */}
            <div className={styles["content"]}>
              <h2 className={styles["heading"]}>
                Need Something More Flexible?
              </h2>
              <p className={styles["subtitle"]}>
                Create a custom subscription based on your workload, turnaround
                needs, and workflow.
              </p>

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

              {/* Webflow <a class="sky-button"> — a bare anchor. Rendered directly
                  (not via the Button primitive) so .ctaButton fully controls radius,
                  border, shadow, font-size and padding with no primitive base styles
                  leaking in. */}
              <Link href="/contact" className={styles["ctaButton"]}>
                Build Your Custom Plan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
