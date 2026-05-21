"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import betaStyles from "@/components/shared/beta-cta.module.css";

const LEFT_CHECKS = [
  "Beta pricing locked in",
  "Priority onboarding — live in 12 hours",
  "14-day satisfaction guarantee",
  "Pause or cancel anytime",
];

const RIGHT_BULLETS = [
  "🚀 Founding pricing locked in before public rollout",
  "⚡ Priority onboarding — your team live in 12 hours",
  "🎁 Earn up to 20 free hours for beta feedback",
];

export function BetaModal({ onClose }: { onClose: () => void }) {
  const firstFocusRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && modalRef.current) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
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
        } else if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    firstFocusRef.current?.focus();
  }, []);

  return (
    <div
      className={betaStyles["betaPopupOverlay"]}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      aria-modal="true"
      role="dialog"
      aria-label="Beta access modal"
    >
      <div className={betaStyles["betaPopupModal"]} ref={modalRef}>
        <div className={betaStyles["popupLeftPanel"]}>
          <div className={betaStyles["popupBadge"]}>
            <div className={betaStyles["popBadgeTxt"]}><span aria-hidden="true">🔒</span> Exclusive Access</div>
          </div>
          <h2 className={betaStyles["whiteHeading"]}>Private Beta Pricing</h2>
          <div className={betaStyles["whatsIncluded"]}>WHAT&apos;S INCLUDED</div>
          <div className={betaStyles["customPlanDlexdivNoWrap"]}>
            {LEFT_CHECKS.map((b) => (
              <div key={b} className={betaStyles["whiteLiIcon"]}>
                <div className={betaStyles["liCheckSky"]}>
                  <Image src="/images/webflow/Group-1.svg" alt="" aria-hidden="true" width={19} height={19} className={betaStyles["circleTick"]} />
                </div>
                <p className={betaStyles["paragraphSmallWhiteSmallFont"]}>{b}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={betaStyles["popupRightPanel"]}>
          <div className={betaStyles["eyebrowText"]}>Founding Partner Pricing</div>
          <h3 className={betaStyles["popMainHd"]}><strong>Start Your First Month with Beta Access</strong></h3>
          <p className={`${betaStyles["paragraph"]} ${betaStyles["paragraphSmallFont"]}`}>
            Join Boldteq&apos;s private beta and experience our agency delivery infrastructure at founding pricing — before public launch moves to standard rates.
          </p>
          <div className={betaStyles["popupUrgencyCard"]}>
            <div className={betaStyles["redDot"]} />
            <div className={betaStyles["redRightTxt"]}>Only <strong className={betaStyles["skyBold"]}>15 agencies</strong> will be accepted in this beta round</div>
          </div>
          <div className={betaStyles["customPlanDlexdivNoWrap"]}>
            {RIGHT_BULLETS.map((b) => (
              <div key={b} className={betaStyles["whiteLiIcon"]}>
                <p className={betaStyles["paragraphSmallFont"]}>{b}</p>
              </div>
            ))}
          </div>
          <Link href="/beta" className={betaStyles["skyButton"]} onClick={onClose}><span aria-hidden="true">🚀</span> Join the Beta</Link>
          <button type="button" className={betaStyles["popupSkip"]} onClick={onClose}>I&apos;ll wait for the public launch</button>
        </div>
        <button type="button" ref={firstFocusRef} aria-label="Close beta modal" className={betaStyles["popupCloseBtn"]} onClick={onClose}>
          <div className={betaStyles["closeTxt"]} aria-hidden="true">{"✕"}</div>
        </button>
      </div>
    </div>
  );
}
