import styles from "./beta-who-its-for.module.css";

const SEGMENTS = [
  {
    number: "1.",
    title: "Starting Out",
    text: "Winning clients is easy. You need reliable execution without committing to full-time hires before the revenue justifies it.",
  },
  {
    number: "2.",
    title: "Feeling Stretched",
    text: "Your team is overloaded. Quality is slipping, deadlines are being missed, and client relationships are quietly at risk.",
  },
  {
    number: "3.",
    title: "Scaling Up Fast",
    text: "You need surge capacity that adjusts to your workload without the chaos of hiring, onboarding, and managing more people.",
  },
];

export function BetaWhoItsFor() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.outer}>
          {/* Header */}
          <div className={styles.center}>
            <div className={styles.headerCol}>
              {/* Badge */}
              <div className={styles.tagBadgeWrap}>
                <div className={styles.tagBadge}>
                  <p className={styles.badgeInner}>
                    <strong className={styles.badgeText}>
                      Who It&rsquo;s Built For
                    </strong>
                  </p>
                </div>
              </div>

              {/* Heading */}
              <h2 className={styles.heading}>
                Boldteq adapts to wherever
                <br />
                your agency is right now
              </h2>

              {/* Subtitle */}
              <div className={styles.subtitleWrap}>
                <p className={styles.subtitle}>
                  From signup to first delivery — here&rsquo;s exactly what
                  happens.
                </p>
              </div>
            </div>
          </div>

          {/* Cards grid */}
          <div className={styles.gridboxes}>
            {SEGMENTS.map((seg) => (
              <div key={seg.number} className={styles.card}>
                <h2 className={styles.skyDigit}>{seg.number}</h2>
                <h3 className={styles.cardTitle}>{seg.title}</h3>
                <p className={styles.cardText}>{seg.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
