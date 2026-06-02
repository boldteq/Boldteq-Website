"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./benefits-grid.module.css";

const BENEFITS = [
  {
    title: "One place for everything",
    description:
      "Requests, feedback, files, and approvals stay in a single workflow — no scattered tools.",
    imageSrc: "/images/webflow/Group-47184-3.png",
    imageAlt:
      "Boldteq centralized workflow dashboard showing requests, feedback and approvals in one place",
    imageWidth: 1412,
    imageHeight: 800,
  },
  {
    title: "Single point of responsibility",
    description: "No bouncing between people or teams.",
    imageSrc: "/images/webflow/Group-47199-2.png",
    imageAlt:
      "Single point of responsibility illustration showing one contact managing all deliverables",
    imageWidth: 1412,
    imageHeight: 800,
  },
  {
    title: "You control the queue",
    description: "Your priorities decide what ships next.",
    imageSrc: "/images/webflow/Group-47200-1.png",
    imageAlt:
      "Task queue control interface showing agency-controlled priority list",
    imageWidth: 1476,
    imageHeight: 800,
  },
  {
    title: "Delivered with quality control",
    description: "Internal QA catches issues before they reach you.",
    imageSrc: "/images/webflow/Group-47204-1.png",
    imageAlt: "Internal QA quality control checklist icon for delivery review",
    imageWidth: 1412,
    imageHeight: 800,
  },
  {
    title: "Flexible capacity, stable delivery",
    description: "Workload changes without execution friction.",
    imageSrc: "/images/webflow/Group-47207.png",
    imageAlt:
      "Flexible capacity illustration showing adjustable workload without execution friction",
    imageWidth: 1412,
    imageHeight: 800,
  },
  {
    title: "Structured execution flow",
    description: "Each task moves through a defined system.",
    imageSrc: "/images/webflow/69a01b9f560c30b6ad5db136_Group-47208.png",
    imageAlt:
      "Structured execution flow diagram showing task progression through defined stages",
    imageWidth: 1412,
    imageHeight: 800,
  },
];

// Slick: slidesToShow 3 at desktop, 2 at <980px, 1 at <480px
function getSlidesPerPage(): number {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth < 480) return 1;
  if (window.innerWidth < 980) return 2;
  return 3;
}

export function BenefitsGrid() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  // Server-stable default (desktop: 3 slides/page → 2 dots). Reading the real
  // viewport here would desync server vs client HTML and fail hydration, which
  // tears down the whole page tree. We sync to the actual viewport in the
  // mount effect below instead.
  const [totalDots, setTotalDots] = useState(
    Math.ceil(BENEFITS.length / 3),
  );

  const handleScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const perPage = getSlidesPerPage();
    const dots = Math.ceil(BENEFITS.length / perPage);
    const scrollRatio = el.scrollLeft / (el.scrollWidth - el.clientWidth);
    const dot = Math.round(scrollRatio * (dots - 1));
    setActiveDot(dot);
  }, []);

  const goToDot = useCallback((index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const perPage = getSlidesPerPage();
    const dots = Math.ceil(BENEFITS.length / perPage);
    const scrollTarget =
      (el.scrollWidth - el.clientWidth) * (index / (dots - 1));
    el.scrollTo({ left: scrollTarget, behavior: "smooth" });
    setActiveDot(index);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    function handleResize() {
      setTotalDots(Math.ceil(BENEFITS.length / getSlidesPerPage()));
    }
    if (el) {
      el.addEventListener("scroll", handleScroll, { passive: true });
    }
    // Sync dot count to the real viewport after mount (post-hydration).
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      el?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll]);

  return (
    <section className={styles['worksSec']}>
      <div className={styles['containerLarge3']}>
        <div className={styles['benefitSubheadOut']}>
          <div className={styles['benefitsubott']}>
            <p className={styles['badgePillText']}>
              <strong className={styles['faqSkyText']}>Our Benefits</strong>
            </p>
          </div>
        </div>

        <h2 className={styles['heading2']}>
          Why Agencies Choose Boldteq <br />
          Over Hiring
        </h2>

        <p className={styles['paragraph']}>
          Agencies partner with Boldteq to get a senior, white-label execution{" "}
          <br />
          team designed to support and deliver agency work.
        </p>

        <div className={styles['featureGrid']} ref={trackRef}>
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className={styles['featureCard']}>
              <div className={styles['textWrapper']}>
                <div className={styles['subheadingLarge']}>
                  <strong>{benefit.title}</strong>
                </div>
                <p className={styles['paragraphSmall2']}>
                  {benefit.description}
                </p>
              </div>
              <Image
                src={benefit.imageSrc}
                alt={benefit.imageAlt}
                width={benefit.imageWidth}
                height={benefit.imageHeight}
                className={styles['fullWidthImage']}
                sizes="(max-width: 479px) 100vw, (max-width: 767px) 50vw, (max-width: 991px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>

        {totalDots > 1 && (
          <ul className={styles['sliderDots']} aria-label="Benefits carousel navigation">
            {Array.from({ length: totalDots }).map((_, i) => (
              <li key={i}>
                <button
                  type="button"
                  className={`${styles['sliderDot']}${activeDot === i ? ` ${styles['active']}` : ""}`}
                  onClick={() => goToDot(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={activeDot === i ? "true" : undefined}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
