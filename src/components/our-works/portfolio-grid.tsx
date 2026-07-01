"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import {
  PORTFOLIO_ITEMS,
  PORTFOLIO_CATEGORIES,
} from "@/lib/constants/portfolio";
import type { PortfolioItem } from "@/types/portfolio";
import { PortfolioCard } from "./portfolio-card";
import { PortfolioPopup } from "./portfolio-popup";
import styles from "./portfolio-grid.module.css";

const ITEMS_PER_PAGE = 8;

export function PortfolioGrid() {
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [popupItem, setPopupItem] = useState<PortfolioItem | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Preserve the curated CMS order (PORTFOLIO_ITEMS is already sorted by
  // `order`); Webflow applies no default sort, so we must not re-sort.
  const filtered = useMemo(() => {
    return PORTFOLIO_ITEMS.filter((item) => {
      const matchesCategory =
        activeCategories.length === 0 ||
        activeCategories.includes(item.category);
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategories, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const visible = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const toggleCategory = useCallback((cat: string) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setCurrentPage(1);
  }, []);

  const removeCategory = useCallback((cat: string) => {
    setActiveCategories((prev) => prev.filter((c) => c !== cat));
    setCurrentPage(1);
  }, []);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    // Mirror Webflow's showPage(): scroll the grid back to the top on change.
    // Respect prefers-reduced-motion — the JS smooth behavior isn't governed
    // by the CSS scroll-behavior override in globals.css.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gridRef.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }, []);

  // Build page numbers
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <>
      <section className={styles.section}>
        <div className={styles.container}>
          {/* ──── Filter Header Bar (search + tags + sort) ──── */}
          <div className={styles.filterHeader}>
            <input
              type="text"
              placeholder="Search here..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className={styles.searchField}
              aria-label="Search projects"
            />

            <div className={styles.tagsArea}>
              {activeCategories.length > 0 && (
                <>
                  <p className={styles.tagsLabel}>Filtering by:</p>
                  {activeCategories.map((cat) => {
                    const label =
                      PORTFOLIO_CATEGORIES.find((c) => c.slug === cat)?.name ??
                      cat;
                    return (
                      <div key={cat} className={styles.activeTag}>
                        {label}
                        <button
                          type="button"
                          className={styles.activeTagClose}
                          onClick={() => removeCategory(cat)}
                          aria-label={`Remove ${label} filter`}
                        >
                          &times;
                        </button>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Total Results pill — Webflow .filter-results > .cms-result, 3rd column */}
            <div className={styles.filterResults}>
              <div className={styles.cmsResult}>
                <span className={styles.resultWork}>Total Results:</span>
                <span className={styles.resultWork}>{filtered.length}</span>
              </div>
            </div>
          </div>

          {/* ──── Sidebar + Card Grid ──── */}
          <div className={styles.filterGrid}>
            {/* LEFT SIDEBAR */}
            <aside className={styles.sidebar}>
              <div className={styles.categoryHeader}>
                <h2 className={styles.categoryTitle}>Service Categories</h2>
              </div>

              <div className={styles.categoryList}>
                {PORTFOLIO_CATEGORIES.map((cat) => {
                  if (cat.slug === "all") return null;

                  if (cat.comingSoon) {
                    return (
                      <label key={cat.slug} className={styles.comingSoonLabel}>
                        <input
                          type="checkbox"
                          disabled
                          className={styles.comingSoonCheckbox}
                        />
                        <span className={styles.comingSoonText}>{cat.name}</span>
                        <span className={styles.comingSoonBadge}>
                          Coming Soon
                        </span>
                      </label>
                    );
                  }

                  const isChecked = activeCategories.includes(cat.slug);
                  return (
                    <label key={cat.slug} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCategory(cat.slug)}
                        className={styles.checkboxInput}
                      />
                      <span>{cat.name}</span>
                    </label>
                  );
                })}
              </div>
            </aside>

            {/* RIGHT CONTENT */}
            <div ref={gridRef}>
              {filtered.length === 0 ? (
                <div className={styles.emptyState}>
                  <Image
                    src="/images/webflow/Group.svg"
                    alt=""
                    aria-hidden="true"
                    width={80}
                    height={66}
                    className={styles.emptyIcon}
                  />
                  <div className={styles.emptyTitle}>No results found.</div>
                </div>
              ) : (
                <>
                  <ul className={styles.cardGrid} role="list">
                    {visible.map((item, idx) => (
                      <li key={item.slug}>
                        <PortfolioCard
                          item={item}
                          onCardClick={setPopupItem}
                          eager={safePage === 1 && idx < ITEMS_PER_PAGE}
                        />
                      </li>
                    ))}
                  </ul>

                  {totalPages > 1 && (
                    <div className={styles.pagination}>
                      <button
                        type="button"
                        className={styles.pageBtn}
                        onClick={() => goToPage(safePage - 1)}
                        disabled={safePage === 1}
                        aria-label="Previous page"
                      >
                        {"<<"}
                      </button>

                      {pages.map((num) => (
                        <button
                          key={num}
                          type="button"
                          className={`${styles.pageBtn} ${num === safePage ? styles.pageBtnActive : ""}`}
                          onClick={() => goToPage(num)}
                          aria-label={`Page ${num}`}
                          aria-current={num === safePage ? "page" : undefined}
                        >
                          {num}
                        </button>
                      ))}

                      <button
                        type="button"
                        className={styles.pageBtn}
                        onClick={() => goToPage(safePage + 1)}
                        disabled={safePage === totalPages}
                        aria-label="Next page"
                      >
                        {">>"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Popup modal */}
      {popupItem && (
        <PortfolioPopup
          item={popupItem}
          onClose={() => setPopupItem(null)}
        />
      )}
    </>
  );
}
