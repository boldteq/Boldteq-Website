"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./beta-cta.module.css";
import { BetaModal } from "@/components/shared/beta-modal";

const LEFT_BENEFITS = [
  "Beta pricing locked in",
  "Priority onboarding — live in 12 hours",
  "14-day satisfaction guarantee",
  "Pause or cancel anytime",
];

/**
 * Inline trigger — opens the shared BetaModal overlay.
 * Used by navbar banner "Join Beta" link and inline CTAs.
 */
export function BetaPopupTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={styles["triggerButton"]}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Join Beta
      </button>

      {open && <BetaModal onClose={() => setOpen(false)} />}
    </>
  );
}

/**
 * Inline beta section — visible band on most pages
 * (separate from Webflow's modal popup; local design)
 */
export function BetaCta() {
  return (
    <section
      className={styles["betaSection"]}
      aria-labelledby="beta-cta-heading"
    >
      <div className={styles["betaSectionInner"]}>
        <div className={styles["betaSectionContent"]}>
          <div className={styles["popupBadge"]}>
            <div className={styles["popBadgeTxt"]}>
              <span aria-hidden="true">🔒</span> Exclusive Access
            </div>
          </div>
          <h2 id="beta-cta-heading" className={styles["whiteHeading"]}>
            Private Beta Pricing
          </h2>
          <p className={styles["betaSectionDesc"]}>
            Join Boldteq&apos;s private beta and experience our agency delivery
            infrastructure at founding pricing — before public launch moves to
            standard rates.
          </p>
          <div className={styles["betaBenefitsRow"]}>
            {LEFT_BENEFITS.map((benefit) => (
              <div key={benefit} className={styles["whiteLiIcon"]}>
                <div className={styles["liCheckSky"]}>
                  <Image
                    src="/images/webflow/Group-1.svg"
                    alt=""
                    aria-hidden="true"
                    width={19}
                    height={19}
                    className={styles["circleTick"]}
                  />
                </div>
                <p className={styles["paragraphSmallWhiteSmallFont"]}>
                  {benefit}
                </p>
              </div>
            ))}
          </div>
          <p className={styles["urgencyText"]}>
            Only <strong className={styles["skyBold"]}>15 agencies</strong> will
            be accepted in this beta round
          </p>
          <Link
            href="/book-a-demo"
            className={`${styles["skyButton"]} ${styles["skyButtonInline"]}`}
          >
            <span aria-hidden="true">🚀</span> Join the Beta
          </Link>
        </div>
      </div>
    </section>
  );
}
