import Image from "next/image";
import type { Testimonial } from "@/types/testimonial";
import styles from "./testimonial-card.module.css";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className={styles.card}>
      {/* Quote icon — absolutely positioned above card top */}
      <Image
        src="/images/webflow/Vector-11.svg"
        alt=""
        width={52}
        height={40}
        className={styles.quoteIcon}
        aria-hidden="true"
      />

      <div className={styles.body}>
        {/* Quote text */}
        <p className={styles.quote}>{testimonial.quote}</p>

        {/* Author row */}
        <div className={styles.authorRow}>
          <div className={styles.avatar} aria-hidden="true">
            {testimonial.name.charAt(0)}
          </div>
          <div>
            <p className={styles.name}>
              <strong>{testimonial.name}</strong>
            </p>
            <p className={styles.role}>
              {testimonial.role}, {testimonial.company}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
