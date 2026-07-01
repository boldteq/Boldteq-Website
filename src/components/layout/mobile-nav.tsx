"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { NAV_ITEMS, CTA_NAV } from "@/lib/constants/navigation";
import type { NavItem } from "@/types/navigation";
import { ChevronDownIcon } from "./chevron-down-icon";
import styles from "./mobile-nav.module.css";

/*
  Webflow mobile nav (≤991px): slide-out drawer pattern from .nav-23-menu.
  Drawer: 300px wide, navy bg (#082753), padding 10px 4%, z-index var(--z-modal).
  .navLink base values mirror Webflow .nav-link (audit sprint 11 parity).
  .comingSoonBadge mirrors Webflow .coming-soon-badge (audit sprint 11 parity).
  Behavior: close on ✕, Escape, backdrop click. Focus trap. Body scroll locked.
*/

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
        <ChevronDownIcon
          width={16}
          height={16}
          className={`${styles.chevron}${expanded ? ` ${styles.chevronRotated}` : ""}`}
          ariaHidden
        />
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
                  aria-disabled="true"
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Move initial focus into the drawer & restore on close
  useEffect(() => {
    if (!open) return;
    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const dialog = dialogRef.current;
    if (dialog) {
      const firstFocusable = dialog.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      firstFocusable?.focus();
    }

    return () => {
      previouslyFocusedRef.current?.focus();
    };
  }, [open]);

  // Escape closes; Tab is trapped inside the dialog
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => !el.hasAttribute("disabled"));
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const handleBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className={styles.backdrop}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
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
    </>
  );
}
