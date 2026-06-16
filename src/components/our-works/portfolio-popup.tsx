"use client";

import { useEffect, useCallback, useRef } from "react";
import type { PortfolioItem } from "@/types/portfolio";
import { PORTFOLIO_DETAILS } from "@/lib/constants/portfolio-details";
import { CaseStudyContent } from "@/components/our-works-detail/case-study-content";
import { CaseStudyGallery } from "@/components/our-works-detail/case-study-gallery";
import { CaseStudyShowcase } from "@/components/our-works-detail/case-study-showcase";
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

    // Remember what was focused (the triggering card) BEFORE we move focus in,
    // so we can restore it when the modal closes.
    const previouslyFocused = document.activeElement as HTMLElement | null;

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
    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      // Restore focus to the element that opened the modal
      previouslyFocused?.focus();
    };
  }, [containerRef]);
}

export function PortfolioPopup({ item, onClose }: PortfolioPopupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleId = `popup-title-${item.slug}`;
  const detail = PORTFOLIO_DETAILS.find((d) => d.slug === item.slug);

  useFocusTrap(containerRef);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    // Lock scroll without the layout shift on platforms with classic scrollbars
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [handleKeyDown]);

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
      <div ref={containerRef} className={styles.container}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close popup"
        >
          &times;
        </button>

        {/* Render the case study / showcase content directly (no iframe) so the
            popup never drags in the site nav/footer or shows an empty frame. */}
        <h2 id={titleId} className="sr-only">
          {item.name} project details
        </h2>
        <div className={styles.body}>
          <div className={styles.caseGrid}>
            {detail ? (
              <>
                <CaseStudyContent detail={detail} embedded />
                <CaseStudyGallery
                  images={detail.gallery}
                  title={detail.title}
                  embedded
                />
              </>
            ) : (
              <>
                <CaseStudyShowcase item={item} embedded />
                <CaseStudyGallery
                  images={[item.featuredImage]}
                  title={item.name}
                  embedded
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
