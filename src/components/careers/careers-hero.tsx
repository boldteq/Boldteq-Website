import Image from "next/image";
import { Button } from '@/components/primitives/button';
import styles from "./careers-hero.module.css";

const GALLERY = [
  {
    src: "/images/webflow/e1c5a28536cdd82b3405ddbd6babd3a23fdc34aa.png",
    alt: "Boldteq team",
    cardClass: "galleryCard1",
  },
  {
    src: "/images/webflow/ca7e39d79f09e622dbf744ac70e1284061b70db0-1.png",
    alt: "Boldteq office environment",
    cardClass: "galleryCard2",
  },
  {
    src: "/images/webflow/21bbfbdba86a0d80cb0a841c41df97d761902c14.png",
    alt: "Boldteq team collaboration",
    cardClass: "galleryCard3",
  },
] as const;

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
            {GALLERY.map((item, i) => (
              <div
                key={item.src}
                className={`${styles.galleryCard} ${styles[item.cardClass]}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={240}
                  height={360}
                  priority={i === 0}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  sizes="(max-width: 767px) 33vw, 240px"
                  className={styles.galleryImage}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
