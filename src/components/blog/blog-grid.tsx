"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/constants/blog";
import { BlogCard } from "./blog-card";
import styles from "./blog-grid.module.css";

const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  cro: "CRO",
  shopify: "Shopify",
  "ui-ux-design": "UI/UX Design",
  "web-development": "Web Development",
  "white-label-outsourcing": "White-Label & Outsourcing",
  wordpress: "WordPress",
};

interface BlogGridProps {
  /** Pre-select a category (used by /blog/categories/[slug]) */
  initialCategory?: string;
}

export function BlogGrid({ initialCategory = "all" }: BlogGridProps = {}) {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const topPosts = useMemo(() => BLOG_POSTS.slice(0, 4), []);

  const handleClearCategory = () => {
    setActiveCategory("all");
  };

  return (
    <section className={styles.section}>
      <div className={styles.tabsContainer}>
        <div className={styles.filtOut}>
          <div className={styles.filterGrid}>
            {/* ── LEFT SIDEBAR ── */}
            <div className={styles.filterColumn}>
              {/* Search */}
              <div className={styles.searchBlock}>
                <input
                  type="search"
                  className={styles.searchField}
                  placeholder="Search here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search blog articles"
                />
              </div>

              {/* Categories */}
              <div className={styles.filterBlock}>
                <div className={styles.filterBlockHeader}>
                  <button
                    type="button"
                    className={styles.filterReset}
                    onClick={handleClearCategory}
                    aria-label="Clear category filter"
                  >
                    Clear
                  </button>
                  <h3 className={styles.filterBarTitle}>Categories</h3>
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
                            className={`${styles.categoryLabel} ${isActive ? styles.categoryLabelActive : ""}`}
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
                  <span />
                  <h3 className={styles.filterBarTitle}>Top Posts</h3>
                </div>
                <div className={styles.filterOptions}>
                  <ul className={styles.topPostsList} role="list">
                    {topPosts.map((post, index) => (
                      <li key={post.slug} className={styles.topPostItem}>
                        <span
                          className={styles.topPostNumber}
                          aria-hidden="true"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className={styles.topPostInner}>
                          <a
                            href={`/blog/${post.slug}`}
                            className={styles.topPostTitle}
                          >
                            {post.title}
                          </a>
                          <p className={styles.topPostCat}>
                            {CATEGORY_LABELS[post.category] ?? post.category}
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
                  <span />
                  <h3 className={styles.filterBarTitle}>Follow Us</h3>
                </div>
                <div className={styles.filterOptions}>
                  <div className={styles.socialRow}>
                    <a
                      href="https://www.linkedin.com/company/boldteq"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label="Boldteq on LinkedIn"
                    >
                      <Image
                        src="/images/webflow/ri_linkedin-fill.svg"
                        alt="LinkedIn"
                        width={24}
                        height={24}
                      />
                    </a>
                    <a
                      href="https://www.instagram.com/boldteq/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label="Boldteq on Instagram"
                    >
                      <Image
                        src="/images/webflow/mdi_instagram.svg"
                        alt="Instagram"
                        width={24}
                        height={24}
                      />
                    </a>
                    <a
                      href="https://www.facebook.com/people/Boldteq-Global-Pvt-Ltd/100070645008632/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label="Boldteq on Facebook"
                    >
                      <Image
                        src="/images/webflow/basil_facebook-solid.svg"
                        alt="Facebook"
                        width={24}
                        height={24}
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT CONTENT ── */}
            <div className={styles.filterContent}>
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
                  <p className={styles.emptyText}>No results found.</p>
                </div>
              ) : (
                <ul className={styles.grid} role="list">
                  {filtered.map((post) => (
                    <li key={post.slug}>
                      <BlogCard post={post} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
