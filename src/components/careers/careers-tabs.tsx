"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  JOB_LISTINGS,
  CAREER_TABS as TABS,
  BENEFIT_CARDS,
  type JobListing,
  type CareerTabId as TabId,
} from "@/lib/constants/careers";
import styles from "./careers-tabs.module.css";

function JobAccordion({ job }: { job: JobListing }) {
  const [open, setOpen] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const jobId = `job-${job.slug}`;
  const panelId = `${jobId}-panel`;

  function toggle() {
    const next = !open;
    setOpen(next);
    // bring the freshly-expanded item into view if it's clipped below the fold
    if (next) {
      setTimeout(
        () => articleRef.current?.scrollIntoView({ block: "nearest" }),
        60,
      );
    }
  }

  return (
    <article ref={articleRef} className={styles.jobItem}>
      {/* WAI-ARIA accordion: heading wraps the toggle button (a heading must not
          be interactive, and block elements aren't valid inside <button>) */}
      <h3 className={styles.jobHeading}>
        <button
          type="button"
          id={jobId}
          className={styles.jobToggle}
          onClick={toggle}
          onKeyDown={(e) => {
            // Escape closes the panel while focus is still on the toggle
            // (focus stays here after opening; the panel is a sibling below)
            if (e.key === "Escape" && open) setOpen(false);
          }}
          aria-expanded={open}
          aria-controls={panelId}
        >
          <div className={styles.jobTitleRow}>
            <div className={styles.jobMeta}>
              <span className={styles.jobTitle}>{job.title}</span>
              <span className={styles.jobType}>{job.type}</span>
            </div>
            <div
              className={`${styles.jobArrow} ${open ? styles.jobArrowOpen : ""}`}
              aria-hidden="true"
            >
            <svg
              width="16"
              height="10"
              viewBox="0 0 16 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.25 1.25L8 8L14.75 1.25"
                stroke="url(#grad-arrow)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient
                  id="grad-arrow"
                  x1="8"
                  y1="8"
                  x2="8"
                  y2="1.25"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#21CFFF" />
                  <stop offset="1" stopColor="#019AE6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          </div>
        </button>
      </h3>

      {open && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={jobId}
          className={styles.jobContent}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <p className={styles.jobDescription}>{job.description}</p>
          <p className={styles.jobSectionLabel}>Responsibilities</p>
          <ul className={styles.jobList}>
            {job.responsibilities.map((item) => (
              <li key={item} className={styles.jobListItem}>
                {item}
              </li>
            ))}
          </ul>
          <p className={styles.jobSectionLabel}>Requirements</p>
          <ul className={styles.jobList}>
            {job.requirements.map((item) => (
              <li key={item} className={styles.jobListItem}>
                {item}
              </li>
            ))}
          </ul>
          <a
            href={`mailto:hr@boldteq.com?subject=${encodeURIComponent(
              `Application: ${job.title}`,
            )}`}
            className={styles.jobApply}
          >
            Apply for this role
          </a>
        </div>
      )}
    </article>
  );
}

export function CareersTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("about");
  // True only while the nav is pinned (sticky) to the top — drives the gradient
  // bar + white text. In its normal flow position it stays the pale #def4ff bar.
  const [stuck, setStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  // While a click-scroll is in flight we lock the scroll-spy so the sections it
  // passes through don't briefly steal the highlight from the clicked tab.
  const spyLocked = useRef(false);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect when the nav becomes sticky: a zero-height sentinel sits where the nav
  // starts; once it scrolls above the sticky offset (86px) the nav is pinned.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { rootMargin: "-86px 0px 0px 0px", threshold: 0 },
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  // Scroll-spy: keep the active nav item in sync with the section in view.
  // This also makes deep-links (e.g. the hero/benchmarks/global CTAs that point
  // to #career-opportunities) highlight the right nav item once scrolled there.
  useEffect(() => {
    const sections = TABS.map((t) => {
      const el = document.getElementById(t.href.replace("#", ""));
      return el ? { id: t.id, el } : null;
    }).filter((s): s is { id: TabId; el: HTMLElement } => s !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (spyLocked.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const match = sections.find((s) => s.el === visible.target);
          if (match) setActiveTab(match.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );

    sections.forEach((s) => observer.observe(s.el));
    return () => {
      observer.disconnect();
      if (lockTimer.current) clearTimeout(lockTimer.current);
    };
  }, []);

  function scrollToSection(href: string) {
    const el = document.querySelector(href);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  function handleTabClick(tab: (typeof TABS)[number]) {
    setActiveTab(tab.id);
    // Lock the spy for the duration of the smooth scroll so the highlight stays
    // on the clicked tab instead of flickering through intermediate sections.
    spyLocked.current = true;
    if (lockTimer.current) clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(() => {
      spyLocked.current = false;
    }, 800);
    scrollToSection(tab.href);
  }

  return (
    <>
      {/* Sticky tab nav — hidden on mobile (hide-mob) */}
      <section className={styles.section}>
        <div className={styles.container}>
          {/* Section header */}
          <div className={styles.sectionOuter}>
            <div className={styles.contCenter}>
              <div className={styles.header}>
                <h2 className={styles.heading}>The Boldteq Standard</h2>
                <div>
                  <p className={styles.subtitle}>
                    Boldteq is built to power agency growth with precision, performance, and discipline. Here&apos;s what defines how we operate and build careers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky tab nav + the four content sections share one wrapper so the nav
          can stick across all of them (Webflow: .career-wrapper > .career-tabs-sc
          + the #career-* sections). The wrapper must NOT clip overflow or sticky breaks. */}
      <div className={styles.careerWrapper}>
        {/* Sentinel for sticky detection (see the IntersectionObserver above). */}
        <div ref={sentinelRef} className={styles.stickySentinel} aria-hidden="true" />
        {/* Section navigation. These are NOT tabs (panels aren't shown/hidden —
            all sections render and the buttons scroll to them), so this is a nav
            with aria-current, not role=tablist/tab. */}
        <nav
          className={`${styles.tabNav}${stuck ? ` ${styles.tabNavStuck}` : ""}`}
          aria-label="Career sections"
        >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-current={activeTab === tab.id ? "true" : undefined}
                className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabButtonActive : ""}`}
                onClick={() => handleTabClick(tab)}
              >
                <span className={styles.tabButtonText}>{tab.label}</span>
              </button>
            ))}
        </nav>

        {/* ── About Boldteq ── */}
      <section
        id="career-about"
        aria-labelledby="career-about-heading"
        className={`${styles.section} ${styles.aboutSection}`}
      >
        <div className={styles.container}>
          <div className={styles.aboutGrid}>
            <div className={styles.imagesFlex}>
              <Image
                src="/images/webflow/ca7e39d79f09e622dbf744ac70e1284061b70db0-1.png"
                alt="Boldteq team members collaborating in the office"
                width={480}
                height={720}
                className={styles.aboutImg}
                sizes="(max-width: 991px) 45vw, 24vw"
              />
              <Image
                src="/images/webflow/a994d403aef97ae290a90af19570268925b45785-1.png"
                alt="A Boldteq developer at their workstation"
                width={480}
                height={720}
                className={`${styles.aboutImg} ${styles.aboutImgSecond}`}
                sizes="(max-width: 991px) 45vw, 24vw"
              />
            </div>
            <div className={styles.textColumn}>
              <h2 id="career-about-heading" className={styles.tabHeading}>About Boldteq</h2>
              <div className={styles.textInner}>
                <p className={styles.tabParagraph}>
                  Boldteq supports growing agencies with structured execution systems and performance-driven operations that enable consistent, reliable delivery.
                </p>
                <p className={styles.tabParagraph}>
                  We focus on precision, accountability, and long-term partnerships built on measurable results.
                </p>
                <div>
                  <Link href="/our-mission" className={styles.tabCta}>
                    Discover More About Boldteq
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Culture ── */}
      <section
        id="career-culture"
        aria-labelledby="career-culture-heading"
        className={`${styles.section} ${styles.cultureSection}`}
      >
        <div className={styles.container}>
          <div className={styles.cultureGrid}>
            <div className={styles.textColumn}>
              <h2 id="career-culture-heading" className={styles.tabHeading}>Our Culture</h2>
              <div className={styles.textInner}>
                <p className={styles.tabParagraph}>
                  We hire for capability, not geography — building a global team selected for excellence, precision, and dependable execution.
                </p>
                <p className={styles.tabParagraph}>
                  Our culture is rooted in ownership, clarity, and maintaining the standards our clients rely on.
                </p>
                <div>
                  <Link href="/our-mission" className={styles.tabCta}>
                    Learn More About Our Culture
                  </Link>
                </div>
              </div>
            </div>
            <div className={styles.imagesFlex}>
              <Image
                src="/images/webflow/beee5e7b40b6b5bf056c827d851f803f9d6618c3.png"
                alt="Boldteq team members in a planning session"
                width={480}
                height={720}
                className={`${styles.cultureImg} ${styles.cultureImgFirst}`}
                sizes="(max-width: 991px) 45vw, 24vw"
              />
              <Image
                src="/images/webflow/Rectangle-30834.png"
                alt="The Boldteq team together at a company event"
                width={480}
                height={720}
                className={styles.cultureImg}
                sizes="(max-width: 991px) 45vw, 24vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section
        id="career-benefits"
        aria-labelledby="career-benefits-heading"
        className={`${styles.section} ${styles.benefitsSection}`}
      >
        <div className={styles.container}>
          <div className={styles.benefitsOuter}>
            <div className={styles.benefitsCenter}>
              <div className={styles.benefitsHeader}>
                <h2 id="career-benefits-heading" className={styles.heading}>Benefits</h2>
                <div>
                  <p className={styles.subtitle}>
                    At Boldteq, we combine global opportunity with structured standards — creating an environment where high performers can thrive, grow, and deliver meaningful impact.
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.benefitsGrid}>
              {BENEFIT_CARDS.map((card) => (
                <div key={card.title} className={styles.benefitCard}>
                  <Image
                    src={card.icon}
                    alt=""
                    aria-hidden="true"
                    width={48}
                    height={48}
                    className={styles.benefitIcon}
                  />
                  <h3 className={styles.benefitTitle}>{card.title}</h3>
                  <p className={styles.benefitText}>{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Career Opportunities ── */}
      <section
        id="career-opportunities"
        aria-labelledby="career-opportunities-heading"
        className={`${styles.section} ${styles.opportunitiesSection}`}
      >
        <div className={styles.container}>
          <div className={styles.opportunitiesOuter}>
            <div className={styles.opportunitiesCenter}>
              <div className={styles.opportunitiesHeader}>
                <h2 id="career-opportunities-heading" className={styles.heading}>Current Opportunities</h2>
                <div>
                  <p className={styles.subtitle}>
                    We are selectively expanding our engineering network across backend systems, frontend architecture, DevOps infrastructure, and emerging technologies.
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.jobWrapper}>
              {JOB_LISTINGS.map((job) => (
                <JobAccordion key={job.title} job={job} />
              ))}
            </div>
            <p className={styles.fallbackNote}>
              Don&apos;t see a role that fits?{" "}
              <a href="mailto:hr@boldteq.com" className={styles.fallbackLink}>
                Send your resume to hr@boldteq.com
              </a>
            </p>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
