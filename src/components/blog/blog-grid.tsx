"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  BLOG_POSTS,
  BLOG_CATEGORIES,
  getCategoryLabel,
} from "@/lib/constants/blog";
import { BlogCard } from "./blog-card";
import styles from "./blog-grid.module.css";

/** Posts shown per page; "Load More" reveals another page (Webflow Finsweet parity). */
const PAGE_SIZE = 6;
/** Number of entries in the "Top Posts" sidebar block. */
const TOP_POSTS_COUNT = 4;
const TOP_POSTS = BLOG_POSTS.slice(0, TOP_POSTS_COUNT);
/** Debounce window before a search keystroke is applied to filtering/URL. */
const SEARCH_DEBOUNCE_MS = 200;

interface BlogGridProps {
  /** Pre-select a category (used by /blog/categories/[slug]) */
  initialCategory?: string;
  /** Pre-fill the search box (from the ?q= query param) */
  initialSearch?: string;
  /** Mirror the active category/search into the URL query (listing page only) */
  syncToUrl?: boolean;
}

export function BlogGrid({
  initialCategory = "all",
  initialSearch = "",
  syncToUrl = false,
}: BlogGridProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchInput, setSearchInput] = useState<string>(initialSearch);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Debounce the raw input into the query used for filtering + URL sync.
  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput]);

  const filtered = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        activeCategory === "all" || post.category === activeCategory;
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const matchesSearch =
        normalizedQuery === "" ||
        post.title.toLowerCase().includes(normalizedQuery) ||
        post.shortDescription.toLowerCase().includes(normalizedQuery) ||
        post.category.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Reset pagination whenever the filter set changes.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, searchQuery]);

  // Keep the URL query in sync so filters are shareable + back-button friendly.
  useEffect(() => {
    if (!syncToUrl) return;
    const params = new URLSearchParams();
    if (activeCategory !== "all") params.set("category", activeCategory);
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [activeCategory, searchQuery, syncToUrl, pathname, router]);

  const visiblePosts = filtered.slice(0, visibleCount);
  const hasActiveFilter = activeCategory !== "all" || searchQuery.trim() !== "";

  const handleReset = () => {
    setActiveCategory("all");
    setSearchInput("");
    setSearchQuery("");
  };

  return (
    <section className={styles.section}>
      <div className={styles.tabsContainer}>
        <div className={styles.filtOut}>
          <div className={styles.filterGrid}>
            {/* ── LEFT SIDEBAR ── */}
            <aside className={styles.filterColumn} aria-label="Filter articles">
              {/* Search */}
              <div
                className={`${styles.searchBlock} ${searchInput ? styles.searchBlockFilled : ""}`}
              >
                <label htmlFor="blog-search" className={styles.srOnly}>
                  Search blog articles
                </label>
                <input
                  id="blog-search"
                  name="q"
                  type="search"
                  autoComplete="off"
                  className={styles.searchField}
                  placeholder="Search here..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                {searchInput && (
                  <button
                    type="button"
                    className={styles.searchClear}
                    onClick={() => {
                      setSearchInput("");
                      setSearchQuery("");
                    }}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className={styles.filterBlock}>
                <div className={styles.filterBlockHeader}>
                  <h2 className={styles.filterBarTitle}>Categories</h2>
                </div>
                <div className={styles.filterOptions}>
                  <ul className={styles.categoryList} role="list">
                    {BLOG_CATEGORIES.filter((c) => c.slug !== "all").map((cat) => {
                      const isActive = activeCategory === cat.slug;
                      return (
                        <li key={cat.slug} className={styles.categoryItem}>
                          <input
                            type="checkbox"
                            id={`cat-${cat.slug}`}
                            className={styles.categoryCheckbox}
                            checked={isActive}
                            onChange={() =>
                              setActiveCategory(isActive ? "all" : cat.slug)
                            }
                            aria-label={`Filter by ${cat.name}`}
                          />
                          <label
                            htmlFor={`cat-${cat.slug}`}
                            className={styles.categoryLabel}
                          >
                            {cat.name}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Top Posts */}
              <div className={styles.filterBlock}>
                <div className={styles.filterBlockHeader}>
                  <h2 className={styles.filterBarTitle}>Top Posts</h2>
                </div>
                <div className={styles.filterOptions}>
                  <ul className={styles.topPostsList} role="list">
                    {TOP_POSTS.map((post, index) => (
                      <li key={post.slug} className={styles.topPostItem}>
                        <span
                          className={styles.topPostNumber}
                          aria-hidden="true"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className={styles.topPostInner}>
                          <Link
                            href={`/blog-posts/${post.slug}`}
                            className={styles.topPostTitle}
                          >
                            {post.title}
                          </Link>
                          <p className={styles.topPostCat}>
                            {getCategoryLabel(post.category)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Follow Us */}
              <div className={styles.filterBlock}>
                <div className={styles.filterBlockHeader}>
                  <h2 className={styles.filterBarTitle}>Follow Us</h2>
                </div>
                <div className={`${styles.filterOptions} ${styles.filterOptionsSocial}`}>
                  <div className={styles.socialRow}>
                    <a
                      href="https://www.linkedin.com/company/boldteq"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label="Boldteq on LinkedIn (opens in a new tab)"
                    >
                      <Image
                        src="/images/webflow/ri_linkedin-fill.svg"
                        alt="LinkedIn"
                        width={20}
                        height={20}
                      />
                    </a>
                    <a
                      href="https://www.instagram.com/boldteq/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label="Boldteq on Instagram (opens in a new tab)"
                    >
                      <Image
                        src="/images/webflow/mdi_instagram.svg"
                        alt="Instagram"
                        width={20}
                        height={20}
                      />
                    </a>
                    <a
                      href="https://www.facebook.com/people/Boldteq-Global-Pvt-Ltd/100070645008632/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label="Boldteq on Facebook (opens in a new tab)"
                    >
                      <Image
                        src="/images/webflow/basil_facebook-solid.svg"
                        alt="Facebook"
                        width={20}
                        height={20}
                      />
                    </a>
                  </div>
                </div>
              </div>
            </aside>

            {/* ── RIGHT CONTENT ── */}
            <div className={styles.filterContent}>
              <h2 className={styles.srOnly}>Latest articles</h2>
              {/* Result count + reset (Webflow result-count parity) */}
              <div className={styles.resultBar}>
                <p className={styles.resultCount} aria-live="polite">
                  {filtered.length === 0
                    ? "No articles found"
                    : `Showing ${visiblePosts.length} of ${filtered.length} article${filtered.length === 1 ? "" : "s"}`}
                </p>
                {hasActiveFilter && (
                  <button
                    type="button"
                    className={styles.resetBtn}
                    onClick={handleReset}
                  >
                    Reset filters
                  </button>
                )}
              </div>

              {filtered.length === 0 ? (
                <div className={styles.emptyState}>
                  <Image
                    src="/images/webflow/Group.svg"
                    alt=""
                    width={80}
                    height={80}
                    className={styles.emptyIcon}
                    aria-hidden="true"
                  />
                  <p className={styles.emptyText}>
                    No articles match your filters.
                  </p>
                  {hasActiveFilter && (
                    <button
                      type="button"
                      className={styles.resetBtn}
                      onClick={handleReset}
                    >
                      Reset filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <ul className={styles.grid} role="list">
                    {visiblePosts.map((post, index) => (
                      <li key={post.slug}>
                        <BlogCard post={post} priority={index < 2} />
                      </li>
                    ))}
                  </ul>

                  {visibleCount < filtered.length && (
                    <div className={styles.loadMoreOuter}>
                      <button
                        type="button"
                        className={styles.loadBtn}
                        onClick={() =>
                          setVisibleCount((c) => c + PAGE_SIZE)
                        }
                      >
                        Load more articles
                        <svg
                          className={styles.loadBtnIcon}
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
