"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./beta-cta.module.css";

const LEFT_BENEFITS = [
  "Beta pricing locked in",
  "Priority onboarding — live in 12 hours",
  "14-day satisfaction guarantee",
  "Pause or cancel anytime",
];

const RIGHT_BULLETS = [
  "Founding pricing locked in before public rollout",
  "⚡ Priority onboarding — your team live in 12 hours",
  "🎁 Earn up to 20 free hours for beta feedback",
];

function BetaModal({ onClose }: { onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingId = "beta-modal-heading";

  // Escape key + focus trap
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !containerRef.current) return;
      const focusable = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
        )
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    // Auto-focus first focusable element
    const el = containerRef.current?.querySelector<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    el?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className={styles["betaPopupOverlay"]}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
    >
      <div ref={containerRef} className={styles["betaPopupModal"]}>
        {/* Left panel */}
        <div className={styles["popupLeftPanel"]}>
          <div className={styles["popupBadge"]}>
            <div className={styles["popBadgeTxt"]}>
              <span aria-hidden="true">🔒</span> Exclusive Access
            </div>
          </div>
          <h2 id={headingId} className={styles["whiteHeading"]}>
            Private Beta Pricing
          </h2>
          <div className={styles["popupDivider"]} />
          <div className={styles["whatsIncluded"]}>
            WHAT&apos;S INCLUDED
          </div>
          <div className={styles["customPlanDlexdivNoWrap"]}>
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
        </div>

        {/* Right panel */}
        <div className={styles["popupRightPanel"]}>
          <div className={styles["eyebrowText"]}>
            Founding Partner Pricing
          </div>
          <h3 className={styles["popMainHd"]}>
            <strong>Start Your First Month with Beta Access</strong>
          </h3>
          <p
            className={`${styles["paragraph"]} ${styles["paragraphSmallFont"]}`}
          >
            Join Boldteq&apos;s private beta and experience our agency
            delivery infrastructure at founding pricing — before public
            launch moves to standard rates.
          </p>
          <div className={styles["popupUrgencyCard"]}>
            <div className={styles["redDot"]} aria-hidden="true" />
            <div className={styles["redRightTxt"]}>
              Only{" "}
              <strong className={styles["skyBold"]}>15 agencies</strong>{" "}
              will be accepted in this beta round
            </div>
          </div>
          <div className={styles["rightBulletsWrapper"]}>
            {RIGHT_BULLETS.map((bullet) => (
              <div key={bullet} className={styles["whiteLiIcon"]}>
                <p className={styles["paragraphSmallBullet"]}>{bullet}</p>
              </div>
            ))}
          </div>
          <Link href="/beta" className={styles["skyButton"]} onClick={onClose}>
            <span aria-hidden="true">🚀</span> Join the Beta
          </Link>
          <button
            type="button"
            className={styles["popupSkip"]}
            onClick={onClose}
          >
            I&apos;ll wait for the public launch
          </button>
        </div>

        {/* Close button */}
        <button
          type="button"
          aria-label="Close beta popup"
          className={styles["popupCloseBtn"]}
          onClick={onClose}
        >
          <div className={styles["closeTxt"]} aria-hidden="true">
            ✕
          </div>
        </button>
      </div>
    </div>
  );
}

export function BetaPopupTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* This is used by navbar banner "Join Beta" link and other CTAs */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={styles["triggerButton"]}
        aria-haspopup="dialog"
      >
        Join Beta
      </button>

      {open && <BetaModal onClose={() => setOpen(false)} />}
    </>
  );
}

// Standalone section version for pages that show it inline
export function BetaCta() {
  return (
    <section className={styles["betaSection"]} aria-labelledby="beta-cta-heading">
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
          <Link href="/book-a-demo" className={styles["skyButton"]}>
            <span aria-hidden="true">🚀</span> Join the Beta
          </Link>
        </div>
      </div>
    </section>
  );
}
