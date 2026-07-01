import Image from "next/image";
import { Button } from '@/components/primitives/button';
import styles from "./careers-global.module.css";

const DECORATIVE_IMAGES = [
  // Webflow uses Rectangle-30898 twice, both with class .cimg1 (same position) so
  // they overlap and read as a single avatar. We render it once to match that
  // visual without the side-by-side duplicate our earlier port introduced.
  { src: "/images/webflow/Rectangle-30898.png", className: styles.cimg1, alt: "" },
  { src: "/images/webflow/Rectangle-30899.png", className: styles.cimg2, alt: "" },
  { src: "/images/webflow/Rectangle-30900.png", className: styles.cimg3, alt: "" },
  { src: "/images/webflow/Rectangle-30902.png", className: styles.cimg4, alt: "" },
  { src: "/images/webflow/Rectangle-30901.png", className: styles.cimg5, alt: "" },
  { src: "/images/webflow/Rectangle-30903.png", className: styles.cimg6, alt: "" },
];

export function CareersGlobal() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.outer}>
          <h2 className={styles.heading}>Where Your Work Travels Further</h2>
          <p className={styles.subtitle}>
            At Boldteq, you collaborate globally and make real-world impact.
          </p>
          <Button href="#career-opportunities" variant="navy" size="md">
            View Opening Positions
          </Button>
          {DECORATIVE_IMAGES.map((img) => (
            <Image
              key={img.src}
              src={img.src}
              alt=""
              aria-hidden="true"
              width={50}
              height={50}
              sizes="50px"
              className={img.className}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
