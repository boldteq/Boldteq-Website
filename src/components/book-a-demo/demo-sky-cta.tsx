import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants/site";
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
                href={SITE_CONFIG.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whiteBtn}
                aria-label="Book a demo (opens Calendly in a new tab)"
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
