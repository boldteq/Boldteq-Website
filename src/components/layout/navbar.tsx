"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { NAV_ITEMS, CTA_NAV } from "@/lib/constants/navigation";
import { MobileNav } from "./mobile-nav";
import type { NavItem } from "@/types/navigation";
import styles from "./navbar.module.css";
import betaStyles from "@/components/shared/beta-cta.module.css";

function BetaPopup({ onClose }: { onClose: () => void }) {
  const firstFocusRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Body scroll lock
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Escape key close
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      // Focus trap
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
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Auto-focus close button on mount
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
            {["Beta pricing locked in", "Priority onboarding — live in 12 hours", "14-day satisfaction guarantee", "Pause or cancel anytime"].map((b) => (
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
          <Link href="/book-a-demo" className={betaStyles["skyButton"]} onClick={onClose}><span aria-hidden="true">🚀</span> Join the Beta</Link>
          <button type="button" className={betaStyles["popupSkip"]} onClick={onClose}>I&apos;ll wait for the public launch</button>
        </div>
        <button type="button" ref={firstFocusRef} aria-label="Close beta modal" className={betaStyles["popupCloseBtn"]} onClick={onClose}>
          <div className={betaStyles["closeTxt"]} aria-hidden="true">{"✕"}</div>
        </button>
      </div>
    </div>
  );
}

// ─── Chevron SVG ──────────────────────────────────────────────────────────────

function ChevronDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M11.9997 13.1714L16.9495 8.22168L18.3637 9.63589L11.9997 15.9999L5.63574 9.63589L7.04996 8.22168L11.9997 13.1714Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ─── Solutions SVG icons (gradient 28×28) ─────────────────────────────────────

function WebDevIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="28" height="28" rx="5" fill="url(#webdev_bg)" fillOpacity="0.1" />
      <g clipPath="url(#webdev_clip)">
        <path d="M14.6244 4C14.6631 4.02292 14.7387 4.02708 14.8055 4.03229C19.673 4.41979 23.5802 8.32604 23.9664 13.1943C23.9716 13.2609 23.9773 13.3359 23.9998 13.375V14.5078C23.9961 14.5042 23.9695 14.5661 23.9679 14.588L23.9345 15.0208C23.8897 15.6089 23.3772 16.0229 22.812 15.9547C22.227 15.8839 21.8544 15.35 21.9415 14.7542C22.0767 13.8339 21.9608 12.9177 21.737 12.0005H17.9044C17.9607 12.6943 18.0056 13.3521 17.9936 14.0401C17.9842 14.6052 17.4921 15.0182 16.9629 14.9974C16.4191 14.976 15.9844 14.5286 16.0011 13.962C15.9917 13.2943 15.9615 12.6542 15.8931 12.0005H12.0965C11.9488 13.3198 11.9556 14.6453 12.0871 15.9984L14.0013 16C14.567 16.0062 14.9955 16.4573 14.9981 16.9948C15.0007 17.5411 14.5665 17.9948 14.0013 17.9974L12.419 18.0042C12.751 19.4583 13.2332 20.7719 13.9993 22.001L15.0185 22.0052C15.5429 22.0073 15.9531 22.4266 15.9943 22.9208C16.0382 23.449 15.676 23.8687 15.1714 24H13.3746C10.9964 23.8161 8.78164 22.8479 7.072 21.2031C2.96022 17.2479 2.97901 10.6901 7.11062 6.75833C8.8166 5.13385 11.0152 4.18594 13.3741 4H14.6239H14.6244Z" fill="url(#webdev_p1)" />
        <path d="M21.2379 20.9875C21.1357 21.0385 21.0381 21.1359 20.9937 21.2245L20.1347 22.9432C20.0429 23.1266 19.8733 23.2344 19.6849 23.2354C19.4782 23.237 19.3076 23.1323 19.2121 22.9224L16.6784 17.349C16.5829 17.1385 16.6252 16.9344 16.7655 16.7859C16.9059 16.6375 17.1288 16.5781 17.349 16.6786L22.9225 19.2115C23.1198 19.301 23.2231 19.463 23.2341 19.6453C23.2466 19.8563 23.1381 20.0375 22.9424 20.1354L21.2374 20.9875H21.2379Z" fill="url(#webdev_p2)" />
      </g>
      <defs>
        <linearGradient id="webdev_bg" x1="0" y1="14" x2="28" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#21CFFF" /><stop offset="1" stopColor="#019AE6" />
        </linearGradient>
        <linearGradient id="webdev_p1" x1="4" y1="14" x2="23.9998" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#21CFFF" /><stop offset="1" stopColor="#019AE6" />
        </linearGradient>
        <linearGradient id="webdev_p2" x1="16.627" y1="19.9321" x2="23.2351" y2="19.9321" gradientUnits="userSpaceOnUse">
          <stop stopColor="#21CFFF" /><stop offset="1" stopColor="#019AE6" />
        </linearGradient>
        <clipPath id="webdev_clip">
          <rect width="20" height="20" fill="white" transform="translate(4 4)" />
        </clipPath>
      </defs>
    </svg>
  );
}

function UIUXIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="28" height="28" rx="5" fill="url(#uiux_bg)" fillOpacity="0.1" />
      <g clipPath="url(#uiux_clip)">
        <path d="M11.9678 13.688L5.63444 13.6897C5.27957 13.6891 5 13.3943 5 13.0222V6.37683C5 6.002 5.27852 5.70935 5.63444 5.70935H11.9472C12.3005 5.70935 12.5812 6.00366 12.5812 6.37683V13.0228C12.5812 13.3665 12.3274 13.688 11.9678 13.688Z" fill="url(#uiux_p1)" />
        <path d="M11.9678 22.9989L5.63444 23.0006C5.2801 23.0006 5 22.7046 5 22.3331V15.6877C5 15.3129 5.27852 15.0203 5.63444 15.0203H11.9472C12.3005 15.0203 12.5812 15.3146 12.5812 15.6877V22.3337C12.5812 22.6774 12.3274 22.9989 11.9678 22.9989Z" fill="url(#uiux_p2)" />
        <path d="M20.8135 22.9989L14.4801 23.0006C14.1258 23.0006 13.8457 22.7052 13.8457 22.3331V15.6877C13.8457 15.3129 14.1242 15.0203 14.4801 15.0203H20.7929C21.1462 15.0203 21.4269 15.3146 21.4269 15.6877V22.3337C21.4269 22.6774 21.1731 22.9989 20.8135 22.9989Z" fill="url(#uiux_p3)" />
        <path d="M19.3635 13.5247C19.0934 13.809 18.7038 13.8068 18.4464 13.5358L13.9905 8.84514C13.7347 8.57582 13.7352 8.16156 13.9905 7.89223L18.4469 3.20154C18.7022 2.93277 19.0961 2.93222 19.3525 3.20154L23.8083 7.89223C24.0636 8.161 24.0636 8.57693 23.8083 8.8457L19.3635 13.5247Z" fill="url(#uiux_p4)" />
      </g>
      <defs>
        <linearGradient id="uiux_bg" x1="0" y1="14" x2="28" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#21CFFF" /><stop offset="1" stopColor="#019AE6" />
        </linearGradient>
        <linearGradient id="uiux_p1" x1="5" y1="9.69952" x2="12.5812" y2="9.69952" gradientUnits="userSpaceOnUse">
          <stop stopColor="#21CFFF" /><stop offset="1" stopColor="#019AE6" />
        </linearGradient>
        <linearGradient id="uiux_p2" x1="5" y1="19.0104" x2="12.5812" y2="19.0104" gradientUnits="userSpaceOnUse">
          <stop stopColor="#21CFFF" /><stop offset="1" stopColor="#019AE6" />
        </linearGradient>
        <linearGradient id="uiux_p3" x1="13.8457" y1="19.0104" x2="21.4269" y2="19.0104" gradientUnits="userSpaceOnUse">
          <stop stopColor="#21CFFF" /><stop offset="1" stopColor="#019AE6" />
        </linearGradient>
        <linearGradient id="uiux_p4" x1="13.7988" y1="8.36915" x2="23.9998" y2="8.36915" gradientUnits="userSpaceOnUse">
          <stop stopColor="#21CFFF" /><stop offset="1" stopColor="#019AE6" />
        </linearGradient>
        <clipPath id="uiux_clip">
          <rect width="19" height="20" fill="white" transform="translate(5 3)" />
        </clipPath>
      </defs>
    </svg>
  );
}

function GraphicDesignIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="28" height="28" rx="5" fill="url(#gd_bg)" fillOpacity="0.1" />
      <g clipPath="url(#gd_clip)">
        <path d="M24.0005 4.43927V7.08223C23.8755 7.36546 23.6602 7.52199 23.3359 7.5215L21.0308 7.51612C20.7065 7.51514 20.4507 7.25442 20.4482 6.93646L20.4438 6.34457L18.0498 6.35093C20.1172 7.66727 21.4097 9.8695 21.5713 12.3378C22.3818 12.6147 22.8813 13.3959 22.7705 14.2294C22.6582 15.0698 21.9609 15.7091 21.123 15.7517C20.2656 15.7952 19.5127 15.2151 19.3242 14.3943C19.1357 13.5735 19.5664 12.7008 20.3994 12.3711C20.2144 9.61366 18.2778 7.23779 15.5552 6.56519C15.2407 7.14925 14.6582 7.51074 14.0186 7.51563C13.3779 7.52053 12.7734 7.17909 12.4521 6.56763C9.75098 7.21724 7.7832 9.60241 7.60254 12.3721C8.42432 12.6969 8.8584 13.5363 8.68457 14.3625C8.51074 15.1887 7.7666 15.7801 6.91309 15.7537C6.08203 15.7277 5.38037 15.1143 5.24072 14.294C5.09814 13.4541 5.58105 12.625 6.42725 12.3442C6.59082 9.90863 7.84717 7.68929 9.94238 6.34995L7.55859 6.33968L7.55273 6.93744C7.54932 7.25197 7.29541 7.51857 6.97021 7.51808L4.54736 7.51612C4.26807 7.51612 4.11963 7.29257 4.00098 7.08908V4.43292C4.11963 4.22893 4.26807 4.00587 4.54736 4.00539L6.97021 4.00343C7.29541 4.00343 7.5498 4.27002 7.55273 4.58407L7.55811 5.17498L12.3535 5.17351C12.6196 4.45493 13.2822 3.99658 14.019 4.0049C14.7393 4.01272 15.3857 4.46667 15.6475 5.174L20.4429 5.17547L20.4482 4.58554C20.4512 4.26758 20.7061 4.00636 21.0308 4.00539L23.3359 4C23.6602 3.99903 23.876 4.15556 24.0005 4.43927Z" fill="url(#gd_p1)" />
        <path d="M17.5493 24H10.4497C10.2222 23.8988 9.92432 23.6923 9.99903 23.3866C10.2471 22.3706 11.1816 21.6222 12.2373 21.6222H15.7612C16.8169 21.6222 17.7515 22.3711 17.9995 23.3866C18.0742 23.6923 17.7764 23.8988 17.5488 24H17.5493Z" fill="url(#gd_p2)" />
        <path d="M17.077 20.6981C16.6146 20.544 16.2103 20.4462 15.7557 20.4462H12.2841C11.8173 20.4462 11.3954 20.5303 10.9261 20.7045C10.6488 19.1998 9.96667 17.8394 8.89977 16.7633C8.70935 16.5353 8.67712 16.2741 8.83044 16.0134L13.412 9.14307L13.4154 14.697C12.5936 15.0018 12.1307 15.8109 12.2728 16.639C12.4149 17.4672 13.1356 18.0884 13.9818 18.0972C14.8324 18.106 15.5633 17.5024 15.722 16.6728C15.8832 15.8324 15.4188 15.0067 14.5858 14.697L14.5892 9.14307L19.1708 16.0134C19.3236 16.2741 19.2924 16.5353 19.1009 16.7628C18.0448 17.8326 17.3573 19.1754 17.0775 20.6981H17.077Z" fill="url(#gd_p3)" />
        <path d="M13.8438 15.7844C14.1734 15.691 14.4776 15.896 14.5611 16.1875C14.6499 16.4981 14.4649 16.8195 14.1568 16.9071C13.8487 16.9946 13.5459 16.8244 13.4463 16.5294C13.3452 16.231 13.502 15.8818 13.8438 15.7849V15.7844Z" fill="url(#gd_p4)" />
      </g>
      <defs>
        <linearGradient id="gd_bg" x1="0" y1="14" x2="28" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#21CFFF" /><stop offset="1" stopColor="#019AE6" />
        </linearGradient>
        <linearGradient id="gd_p1" x1="4.00098" y1="9.87726" x2="24.0005" y2="9.87726" gradientUnits="userSpaceOnUse">
          <stop stopColor="#21CFFF" /><stop offset="1" stopColor="#019AE6" />
        </linearGradient>
        <linearGradient id="gd_p2" x1="9.9873" y1="22.8111" x2="18.0112" y2="22.8111" gradientUnits="userSpaceOnUse">
          <stop stopColor="#21CFFF" /><stop offset="1" stopColor="#019AE6" />
        </linearGradient>
        <linearGradient id="gd_p3" x1="8.7334" y1="14.9238" x2="19.2677" y2="14.9238" gradientUnits="userSpaceOnUse">
          <stop stopColor="#21CFFF" /><stop offset="1" stopColor="#019AE6" />
        </linearGradient>
        <linearGradient id="gd_p4" x1="13.416" y1="16.3458" x2="14.5834" y2="16.3458" gradientUnits="userSpaceOnUse">
          <stop stopColor="#21CFFF" /><stop offset="1" stopColor="#019AE6" />
        </linearGradient>
        <clipPath id="gd_clip">
          <rect width="20" height="20" fill="white" transform="translate(4 4)" />
        </clipPath>
      </defs>
    </svg>
  );
}

function AppDevIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="28" height="28" rx="5" fill="url(#appdev_bg)" fillOpacity="0.1" />
      <g clipPath="url(#appdev_clip)">
        <path d="M9 11H19L18.2 21H9.8L9 11Z" stroke="url(#appdev_p1)" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M11 11V9.8C11 8.25 12.34 7 14 7C15.66 7 17 8.25 17 9.8V11" stroke="url(#appdev_p1)" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="14" r="0.9" fill="url(#appdev_p2)" />
        <circle cx="16" cy="14" r="0.9" fill="url(#appdev_p2)" />
      </g>
      <defs>
        <linearGradient id="appdev_bg" x1="0" y1="14" x2="28" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#21CFFF" /><stop offset="1" stopColor="#019AE6" />
        </linearGradient>
        <linearGradient id="appdev_p1" x1="8" y1="14" x2="20" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#21CFFF" /><stop offset="1" stopColor="#019AE6" />
        </linearGradient>
        <linearGradient id="appdev_p2" x1="11" y1="14" x2="17" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#21CFFF" /><stop offset="1" stopColor="#019AE6" />
        </linearGradient>
        <clipPath id="appdev_clip">
          <rect width="16" height="16" fill="white" transform="translate(6 6)" />
        </clipPath>
      </defs>
    </svg>
  );
}

// ─── Map nav item label → icon ────────────────────────────────────────────────

const SOLUTION_ICONS: Record<string, React.FC> = {
  "Web Development": WebDevIcon,
  "UI/UX Design": UIUXIcon,
  "Graphic Design": GraphicDesignIcon,
  "App Development": AppDevIcon,
};

// ─── Solutions dropdown (rich card with icons) ────────────────────────────────

function SolutionsDropdown({ items }: { items: NavItem[] }) {
  return (
    // .nav-dropdown-slot > .nav-dropdown-card-3
    <div className={styles["nav-dropdown-slot"]}>
      <div className={styles["nav-dropdown-card-3"]}>
        <div className={styles["nav-dropdown-links"]}>
          {items.map((child, idx) => {
            const IconComp = SOLUTION_ICONS[child.label];
            const isDisabled = !!child.comingSoon;
            const isLast = idx === items.length - 1;

            const inner = (
              <>
                {/* .nav-dropdown-icon */}
                <div className={styles["nav-dropdown-icon"]}>
                  {IconComp && <IconComp />}
                </div>
                {/* .column-2x-small */}
                <div className={styles["column-2x-small"]}>
                  <div className={`${styles["text-weight-medium-2"]} ${styles["nav-head"]}`}>
                    {child.label}
                    {child.comingSoon && (
                      <span className={styles["header-comingsoon-badge"]}>Coming Soon</span>
                    )}
                  </div>
                  {child.description && (
                    <div className={`${styles["paragraph-small-16"]} ${styles["text-color-secondary"]} ${styles["nav-para"]}`}>
                      {child.description}
                    </div>
                  )}
                </div>
              </>
            );

            // .nav-dropdown-link-2 + .border-btm + optional .disabled
            const classNames = [
              styles["nav-dropdown-link-2"],
              !isLast ? styles["border-btm"] : "",
              isDisabled ? styles["disabled"] : "",
            ]
              .filter(Boolean)
              .join(" ");

            if (isDisabled) {
              return (
                <div key={child.label} className={classNames}>
                  {inner}
                </div>
              );
            }

            return (
              <Link key={child.label} href={child.href} className={classNames}>
                {inner}
              </Link>
            );
          })}

          {/* .mnav-inn — "Can't find what you are looking for?" */}
          <div className={styles["mnav-inn"]}>
            <div className={`${styles["text-weight-medium-2"]} ${styles["nav-head"]}`}>
              Can&apos;t find what you are looking for?
            </div>
            <div className={`${styles["paragraph-small-16"]} ${styles["text-color-secondary"]} ${styles["nav-para"]}`}>
              Tell us your requirements and{" "}
              <strong className={styles["boldteq-bold"]}>Boldteq</strong> will
              tailor a solution that fits your needs.
            </div>
            <Link href="/scope" className={styles["sky-button"]}>
              View Full Service Scope
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Resources dropdown (simple list) ────────────────────────────────────────

function ResourcesDropdown({ items }: { items: NavItem[] }) {
  return (
    // .nav-23-dropdown-card
    <div className={styles["nav-23-dropdown-card"]}>
      <div className={styles["nav-23-dropdown-links"]}>
        {items.map((child) => {
          if (child.external) {
            return (
              <a
                key={child.label}
                href={child.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles["nav-23-dropdown-link"]}
              >
                <span className={styles["text-weight-medium"]}>
                  {child.label}
                </span>
              </a>
            );
          }
          return (
            <Link
              key={child.label}
              href={child.href}
              className={styles["nav-23-dropdown-link"]}
            >
              <span className={styles["text-weight-medium"]}>
                {child.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── Desktop dropdown (hover-based) ──────────────────────────────────────────

function NavDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timerRef.current = setTimeout(() => setOpen(false), 120);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const isSolutions = item.label === "Solutions";
  const isLast = item.label === "Resources";

  return (
    // .nav-23-dropdown
    <div
      ref={containerRef}
      className={styles["nav-23-dropdown"]}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* .nav-23-dropdown-toggle (+ .last-child for Resources) */}
      <button
        type="button"
        className={[
          styles["nav-23-dropdown-toggle"],
          isLast ? styles["last-child"] : "",
          open ? styles["w--open"] : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {/* .menu-text */}
        <div className={styles["menu-text"]}>{item.label}</div>
        {/* Solutions: nav-dropdown-arrow | Resources: nav-23-dropdown-arrow */}
        <div
          className={[
            isSolutions ? styles["nav-dropdown-arrow"] : styles["nav-23-dropdown-arrow"],
            open ? styles["open"] : "",
          ].join(" ")}
        >
          <ChevronDownIcon />
        </div>
      </button>

      {/* .nav-23-dropdown-list.w--open */}
      {open && (
        <div
          className={`${styles["nav-23-dropdown-list"]} ${styles["w--open"]}`}
        >
          {isSolutions ? (
            <SolutionsDropdown items={item.children ?? []} />
          ) : (
            <ResourcesDropdown items={item.children ?? []} />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Desktop regular link ─────────────────────────────────────────────────────

function NavLink({ item }: { item: NavItem }) {
  return (
    // .nav-23-link
    <Link href={item.href} className={styles["nav-23-link"]}>
      <div className={styles["menu-text"]}>{item.label}</div>
    </Link>
  );
}

// ─── Sticky scroll hook ───────────────────────────────────────────────────────

function useStickyNav() {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const getOffset = () =>
      window.matchMedia("(max-width: 767px)").matches ? 350 : 300;
    let offset = getOffset();

    const handleScroll = () => {
      setSticky(window.scrollY > offset);
    };

    const handleResize = () => {
      offset = getOffset();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return sticky;
}

// ─── Navbar export ────────────────────────────────────────────────────────────

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [betaOpen, setBetaOpen] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);
  const sticky = useStickyNav();

  // When the navbar becomes position:fixed it leaves the document flow, so the
  // page would jump up by the navbar's height. Webflow compensates by adding an
  // equal padding-top to <body> (document.body.style.paddingTop = headerHeight).
  // Replicate that so content stays put and the frosted navbar overlays the
  // correct section instead of the nav links.
  useEffect(() => {
    if (sticky && navbarRef.current) {
      document.body.style.paddingTop = `${navbarRef.current.offsetHeight}px`;
    } else {
      document.body.style.paddingTop = "";
    }
    return () => {
      document.body.style.paddingTop = "";
    };
  }, [sticky]);

  return (
    // .header-sec
    <section className={styles["header-sec"]}>
      {/* Skip nav */}
      <a
        href="#main-content"
        className={`sr-only ${styles["skip-nav"]}`}
      >
        Skip to main content
      </a>

      {/* .banner-section */}
      <section className={styles["banner-section"]}>
        <div className={styles["banner-inner"]}>
          {/* .banner-content */}
          <div className={styles["banner-content"]}>
            <p className={`${styles["paragraph-regular"]} ${styles["capitalize"]}`}>
              🚀 We&apos;re upgrading the website experience — Some sections may update in real-time.
            </p>
            {/* Beta link triggers popup */}
            <button
              type="button"
              id="bt-popup-trigger"
              onClick={() => setBetaOpen(true)}
              className={styles["beta-link"]}
            >
              Join Beta
            </button>
          </div>
        </div>
      </section>

      {/* .navbar — sticky class toggles frosted glass (matches Webflow custom code) */}
      <div
        ref={navbarRef}
        className={`${styles["navbar"]} ${sticky ? styles["sticky"] : ""}`}
        role="banner"
      >
        {/* .nav-23-container */}
        <div className={styles["nav-23-container"]}>

          {/* .nav-23-left */}
          <div className={styles["nav-23-left"]}>
            {/* .nav-23-logo */}
            <Link
              href="/"
              aria-label="Boldteq — go to homepage"
              className={styles["nav-23-logo"]}
            >
              {/* .logo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/webflow/Group-46895.svg"
                alt="Boldteq logo"
                width={130}
                height={40}
                className={styles["logo"]}
                decoding="async"
              />
            </Link>
          </div>

          {/* .nav-23-menu — desktop nav (hidden at ≤991px via CSS; MobileNav overlay handles mobile) */}
          <nav aria-label="Main navigation" className={styles["nav-23-menu"]}>
            {/* .nav-23-links */}
            <div className={styles["nav-23-links"]}>
              {NAV_ITEMS.map((item) => {
                if (item.children) {
                  return <NavDropdown key={item.label} item={item} />;
                }
                return <NavLink key={item.label} item={item} />;
              })}
            </div>
          </nav>

          {/* .nav-23-right */}
          <div className={styles["nav-23-right"]}>
            {/* Desktop CTAs — .row-x-small-2.hide-mobile */}
            <div className={`${styles["row-x-small-2"]} ${styles["hide-mobile"]}`}>
              {/* Login — .button-secondary-large */}
              <a
                href={CTA_NAV[0].href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles["button-secondary-large"]}
              >
                <div>{CTA_NAV[0].label}</div>
              </a>

              {/* Schedule Demo — .btn-primary */}
              <Link href={CTA_NAV[1].href} className={styles["btn-primary"]}>
                {CTA_NAV[1].label}
              </Link>
            </div>

            {/* Hamburger — .nav-23-menu-button */}
            <button
              type="button"
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen(true)}
              className={styles["nav-23-menu-button"]}
            >
              {/* .nav-23-menu-burger */}
              <div className={styles["nav-23-menu-burger"]}>
                {/* .nav-23-menu-line.line-top */}
                <div className={`${styles["nav-23-menu-line"]} ${styles["line-top"]}`} />
                {/* .nav-23-menu-line.line-middle */}
                <div className={`${styles["nav-23-menu-line"]} ${styles["line-middle"]}`} />
                {/* .nav-23-menu-line.line-bottom */}
                <div className={`${styles["nav-23-menu-line"]} ${styles["line-bottom"]}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sheet nav */}
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Beta popup modal */}
      {betaOpen && <BetaPopup onClose={() => setBetaOpen(false)} />}
    </section>
  );
}
