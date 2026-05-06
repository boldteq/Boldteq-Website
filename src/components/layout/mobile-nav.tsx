"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { NAV_ITEMS, CTA_NAV } from "@/lib/constants/navigation";
import type { NavItem } from "@/types/navigation";
import styles from "./mobile-nav.module.css";

/*
  Webflow mobile nav: full-screen overlay matching .nav-23-menu at max-width 767px.
  Background: #082753, flex column, padding 10px 4%, z-index via --z-modal token.
  Nav links: color #fff, border-bottom 1px solid rgba(255,255,255,0.04), padding 12px 0.
  Dropdown chevron: color #21cfff.
*/

function ChevronDownIcon({ rotated }: { rotated: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className={`${styles.chevron}${rotated ? ` ${styles.chevronRotated}` : ""}`}
      aria-hidden="true"
    >
      <path
        d="M11.9997 13.1714L16.9495 8.22168L18.3637 9.63589L11.9997 15.9999L5.63574 9.63589L7.04996 8.22168L11.9997 13.1714Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MobileNavGroup({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const submenuId = `mobile-submenu-${item.label.toLowerCase().replace(/\s+/g, "-")}`;

  if (!item.children) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={styles.navLink}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className={styles.navRow}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-haspopup="true"
        aria-controls={submenuId}
        className={styles.dropdownToggle}
      >
        {item.label}
        <ChevronDownIcon rotated={expanded} />
      </button>

      {expanded && (
        <div id={submenuId} className={styles.submenu}>
          {item.children.map((child) => {
            const comingSoonBadge = child.comingSoon ? (
              <span className={styles.comingSoonBadge}>Coming Soon</span>
            ) : null;

            const innerContent = (
              <span className={styles.submenuInner}>
                <span className={styles.submenuLabel}>{child.label}</span>
                {comingSoonBadge}
              </span>
            );

            if (child.comingSoon) {
              return (
                <div
                  key={child.label}
                  className={`${styles.submenuItem} ${styles.submenuItemDisabled}`}
                >
                  {innerContent}
                </div>
              );
            }

            if (child.external) {
              return (
                <a
                  key={child.label}
                  href={child.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onNavigate}
                  className={styles.submenuItem}
                >
                  {innerContent}
                </a>
              );
            }

            return (
              <Link
                key={child.label}
                href={child.href}
                onClick={onNavigate}
                className={styles.submenuItem}
              >
                {innerContent}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape key closes the menu
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      id="mobile-nav"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      className={styles.overlay}
    >
      {/* Header — logo + close button */}
      <div className={styles.header}>
        <Link href="/" onClick={onClose} aria-label="Boldteq Home">
          <Image
            src="/images/webflow/Group-46895.svg"
            alt="Boldteq logo"
            width={130}
            height={40}
            style={{ width: 'auto', height: 'auto' }}
            className={styles.logoImage}
          />
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className={styles.closeButton}
        >
          &#x2715;
        </button>
      </div>

      {/* Nav links */}
      <div className={styles.navList}>
        {NAV_ITEMS.map((item) => (
          <MobileNavGroup
            key={item.label}
            item={item}
            onNavigate={onClose}
          />
        ))}
      </div>

      {/* CTA buttons at bottom */}
      <div className={styles.ctaFooter}>
        <a
          href={CTA_NAV[0].href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className={styles.ctaLogin}
        >
          {CTA_NAV[0].label}
        </a>

        <Link
          href={CTA_NAV[1].href}
          onClick={onClose}
          className={styles.ctaDemo}
        >
          {CTA_NAV[1].label}
        </Link>
      </div>
    </div>
  );
}
