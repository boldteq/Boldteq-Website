import Link from "next/link";
import styles from "./demo-sky-cta.module.css";

export function DemoSkyCta() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <h2 className={styles.heading}>A Better Way to Scale Agency Delivery</h2>
          <div className={styles.rightCol}>
            <p className={styles.para}>
              Stop juggling freelancers or overloading your team. Let Boldteq
              handle execution while you focus on growth.
            </p>
            <div className={styles.btnsGrid}>
              <a
                href="https://calendly.com/boldteq/schedule-demo"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whiteBtn}
              >
                Book a Demo
              </a>
              <Link href="/pricing" className={styles.navyBtn}>
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
