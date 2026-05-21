"use client";

import { useState } from "react";
import { BetaModal } from "@/components/shared/beta-modal";
import styles from "./top-banner.module.css";

/**
 * Top banner strip above navbar — matches Webflow live `section.banner-section`.
 * Renders persistent "We're upgrading the experience" notice + Join Beta CTA
 * that opens the BetaModal overlay.
 */
export function TopBanner() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <section className={styles.bannerSection} aria-label="Site notice">
        <div className={styles.containerLarge}>
          <div className={styles.bannerContent}>
            <p className={styles.bannerText}>
              <span aria-hidden="true">🚀</span> We&apos;re upgrading the website experience — Some sections may update in real-time.
            </p>
            <button
              type="button"
              className={styles.betaLink}
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={open}
            >
              Join Beta
            </button>
          </div>
        </div>
      </section>
      {open && <BetaModal onClose={() => setOpen(false)} />}
    </>
  );
}
