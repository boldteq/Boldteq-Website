import { Button } from '@/components/primitives/button';
import styles from "./careers-hero.module.css";

export function CareersHero() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* div-wrote-smoke.careerb-smoke */}
        <div className={styles.content}>
          <div className={styles.badge}>
            <span className={styles.badgeText}>Careers At Boldteq</span>
          </div>
          <h1 className={styles.heading}>We Set a Higher Standard</h1>
          <p className={styles.subtitle}>
            Our clients trust us with their brand and growth. That responsibility
            shapes how we hire — we look for professionals who raise the bar,
            take ownership, and deliver with precision.
          </p>
          <div className={styles.ctaRow}>
            <Button href="#career-opportunities" variant="primary" size="md">
              Explore Open Roles
            </Button>
          </div>
        </div>

        {/* career-gallery-wrapper */}
        <div className={styles.galleryWrapper}>
          {/* career-gallery-row */}
          <div className={styles.galleryRow}>
            {/* card-1 */}
            <div className={`${styles.galleryCard} ${styles.galleryCard1}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/webflow/e1c5a28536cdd82b3405ddbd6babd3a23fdc34aa.png"
                loading="lazy"
                alt="Boldteq team"
                className={styles.galleryImage}
              />
            </div>
            {/* card-2 */}
            <div className={`${styles.galleryCard} ${styles.galleryCard2}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/webflow/ca7e39d79f09e622dbf744ac70e1284061b70db0-1.png"
                loading="lazy"
                alt="Boldteq office environment"
                className={styles.galleryImage}
              />
            </div>
            {/* card-5 (visible) */}
            <div className={`${styles.galleryCard} ${styles.galleryCard3}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/webflow/21bbfbdba86a0d80cb0a841c41df97d761902c14.png"
                loading="lazy"
                alt="Boldteq team collaboration"
                className={styles.galleryImage}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
