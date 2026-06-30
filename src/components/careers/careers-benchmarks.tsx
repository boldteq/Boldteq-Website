import { Button } from '@/components/primitives/button';
import styles from "./careers-benchmarks.module.css";

const BENCHMARKS = [
  { label: "Proven Execution", percentage: "30%", variant: "card1" },
  { label: "Technical Depth", percentage: "20%", variant: "card2" },
  { label: "Precision & Detail", percentage: "12%", variant: "card3" },
  { label: "Ownership Mindset", percentage: "8%", variant: "card4" },
  { label: "Consistent Reliability", percentage: "3%", variant: "card5" },
  { label: "Boldteq Standard", percentage: "1%", variant: "card6" },
] as const;

export function CareersBenchmarks() {
  return (
    <section className={styles["section"]}>
      <div className={styles["container"]}>
        <div className={styles["benchOuter"]}>
          <div className={styles["contCenter"]}>
            <div className={styles["header"]}>
              <h2 className={styles["heading"]}>The Benchmarks We Hire For</h2>
              <div className={styles["subtitleWrap"]}>
                <p className={styles["subtitle"]}>
                  Only a small percentage of applicants demonstrate the
                  capabilities required to support high-growth agencies at scale.
                </p>
              </div>
              <div className={styles["ctaWrap"]}>
                <Button href="#career-opportunities" variant="primary" size="md">
                  View Open Positions
                </Button>
              </div>
            </div>

            <div className={styles["benchGrid"]}>
              {BENCHMARKS.map((item) => (
                <div key={item.label} className={styles["benchCard"]}>
                  <p className={styles["benchLabel"]}>{item.label}</p>
                  <div className={`${styles["benchBar"]} ${styles[item.variant]}`}>
                    <span className={styles["benchPercentage"]}>{item.percentage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
