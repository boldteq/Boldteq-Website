import { TESTIMONIALS } from "@/lib/constants/testimonials";
import { TestimonialCard } from "./testimonial-card";
import styles from "./testimonials-grid.module.css";

export function TestimonialsGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.titleWrap}>
          <h2 className={styles.heading}>
            See what the biggest
            <br />
            SaaS brands say.
          </h2>
        </div>
        <div className={styles.grid}>
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard
              key={`${testimonial.name}-${testimonial.company}`}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
