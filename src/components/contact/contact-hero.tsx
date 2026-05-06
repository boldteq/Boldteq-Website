import styles from "./contact-hero.module.css";

export function ContactHero() {
  return (
    <div className={styles.section}>
      <div className={styles.container}>
        <div className={styles.inner}>
          {/* Badge */}
          <div className={styles.badgeRow}>
            <div className={styles.badge}>
              <p className={styles.badgeText}>Get In Touch</p>
            </div>
          </div>

          {/* Heading */}
          <h1 className={styles.heading}>Need any help? Contact us</h1>

          {/* Subtitle */}
          <p className={styles.subtitle}>
            Full-service agency crafting digital experiences that leave a lasting
            impression.
          </p>
        </div>
      </div>
    </div>
  );
}
