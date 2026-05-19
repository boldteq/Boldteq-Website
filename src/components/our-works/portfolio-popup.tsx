"use client";

import { useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import type { PortfolioItem } from "@/types/portfolio";
import styles from "./portfolio-popup.module.css";

interface PortfolioPopupProps {
  item: PortfolioItem;
  onClose: () => void;
}

/** Trap focus within the modal container */
function useFocusTrap(containerRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableSelectors =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(
      container.querySelectorAll<HTMLElement>(focusableSelectors)
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Move focus into modal on open
    firstFocusable?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    }

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [containerRef]);
}

export function PortfolioPopup({ item, onClose }: PortfolioPopupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleId = `popup-title-${item.slug}`;

  useFocusTrap(containerRef);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  // Full content mode for items with detail pages, gallery/image mode for others
  const isFullMode = item.hasDetailPage;
  const containerClass = isFullMode
    ? styles.container
    : `${styles.container} ${styles.containerGallery}`;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div ref={containerRef} className={containerClass}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close popup"
        >
          &times;
        </button>

        {isFullMode ? (
          <>
            <h2 id={titleId} className="sr-only">
              {item.name} project details
            </h2>
            <iframe
              src={`/our-works/${item.slug}`}
              className={styles.iframe}
              title={`${item.name} project details`}
              allowFullScreen
              loading="lazy"
            />
          </>
        ) : (
          <div className={styles.galleryContent}>
            <div className={styles.galleryImageWrap}>
              <Image
                src={item.featuredImage}
                alt={`${item.name} — Boldteq portfolio project`}
                fill
                sizes="(max-width: 600px) 90vw, 560px"
                className={styles.galleryImage}
                priority
              />
            </div>
            <div className={styles.galleryInfo}>
              <h2 id={titleId} className={styles.galleryTitle}>
                {item.name}
              </h2>
              <span className={styles.galleryBadge}>{item.category}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
