"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./case-study-gallery.module.css";

interface CaseStudyGalleryProps {
  images: string[];
  title: string;
  /** Rendered inside the portfolio popup — fills the modal instead of 100vh. */
  embedded?: boolean;
}

export function CaseStudyGallery({
  images,
  title,
  embedded = false,
}: CaseStudyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) return null;

  const activeImage = images[activeIndex];

  return (
    <div className={`${styles.gallery} ${embedded ? styles.embedded : ""}`}>
      <div className={styles.galleryWrapper}>
        {/* Main image — work-slide (flex: 1) + work-slide-image */}
        <div className={styles.mainSlide}>
          <Image
            src={activeImage}
            alt={title}
            fill
            className={styles.mainImg}
            sizes="(max-width: 900px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Thumbnails — work-gallery-thumbs */}
        {images.length > 1 && (
          <div className={styles.thumbnails}>
            {images.map((src, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.thumb} ${index === activeIndex ? styles.thumbActive : ""}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`View image ${index + 1} of ${images.length}`}
                aria-pressed={index === activeIndex}
              >
                <Image
                  src={src}
                  alt={`${title} — image ${index + 1}`}
                  fill
                  className={styles.thumbImg}
                  sizes="(max-width: 900px) 33vw, 16vw"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
