"use client";

import type { PORTFOLIO_CATEGORIES } from "@/lib/constants/portfolio";
import styles from "./portfolio-filter.module.css";

type Category = (typeof PORTFOLIO_CATEGORIES)[number];

export type SortOption = "name-asc" | "name-desc";

interface PortfolioFilterProps {
  categories: Category[];
  activeCategories: string[];
  search: string;
  sort: SortOption;
  filteredCount: number;
  totalCount: number;
  onCategoryToggle: (cat: string) => void;
  onCategoryRemove: (cat: string) => void;
  onClearAll: () => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: SortOption) => void;
}

export function PortfolioFilter({
  categories,
  activeCategories,
  search,
  sort,
  filteredCount,
  totalCount,
  onCategoryToggle,
  onCategoryRemove,
  onClearAll,
  onSearchChange,
  onSortChange,
}: PortfolioFilterProps) {
  const hasFilters = activeCategories.length > 0 || search.trim() !== "";

  return (
    <aside className={styles.sidebar}>
      {/* Search */}
      <div className={styles.searchBlock}>
        <input
          type="search"
          placeholder="Search here..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchField}
          aria-label="Search projects"
        />
      </div>

      {/* Active filter tags */}
      {activeCategories.length > 0 && (
        <div className={styles.tagsWrapper}>
          <p className={styles.tagsLabel}>Filtering by:</p>
          {activeCategories.map((cat) => {
            const label =
              categories.find((c) => c.slug === cat)?.name ?? cat;
            return (
              <div key={cat} className={styles.activeTag}>
                {label}
                <button
                  type="button"
                  className={styles.activeTagRemove}
                  onClick={() => onCategoryRemove(cat)}
                  aria-label={`Remove ${label} filter`}
                >
                  &times;
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Sort */}
      <div className={styles.sortBlock}>
        <select
          className={styles.sortSelect}
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          aria-label="Sort projects"
        >
          <option value="name-asc">Name (A/Z)</option>
          <option value="name-desc">Name (Z/A)</option>
        </select>
      </div>

      {/* Results count */}
      <div className={styles.resultsBlock}>
        <p className={styles.resultsText}>
          Showing{" "}
          <span className={styles.resultsCount}>{filteredCount}</span>{" "}
          results
          <br />
          of <span className={styles.itemsCount}>{totalCount}</span> items.
        </p>
        {hasFilters && (
          <button
            type="button"
            className={styles.resetAll}
            onClick={onClearAll}
          >
            Reset All
          </button>
        )}
      </div>

      {/* Category header */}
      <div className={styles.categoryHeader}>
        <h3 className={styles.categoryTitle}>Service Categories</h3>
        {activeCategories.length > 0 && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={onClearAll}
          >
            Clear
          </button>
        )}
      </div>

      {/* Category checkboxes */}
      <div className={styles.categoryList}>
        {categories.map((cat) => {
          if (cat.slug === "all") return null;

          if (cat.comingSoon) {
            return (
              <label key={cat.slug} className={styles.comingSoonLabel}>
                <input
                  type="checkbox"
                  disabled
                  className={styles.checkboxInput}
                />
                <span>{cat.name}</span>
                <span className={styles.comingSoonBadge}>Coming Soon</span>
              </label>
            );
          }

          const isChecked = activeCategories.includes(cat.slug);
          return (
            <label key={cat.slug} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onCategoryToggle(cat.slug)}
                className={styles.checkboxInput}
              />
              <span>{cat.name}</span>
            </label>
          );
        })}
      </div>
    </aside>
  );
}
