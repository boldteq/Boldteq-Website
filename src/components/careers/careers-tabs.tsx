"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { JOB_LISTINGS, type JobListing } from "@/lib/constants/careers";
import styles from "./careers-tabs.module.css";

type TabId = "about" | "culture" | "benefits" | "opportunities";

interface Tab {
  id: TabId;
  label: string;
  href: string;
}

const TABS: Tab[] = [
  { id: "about", label: "About Boldteq", href: "#career-about" },
  { id: "culture", label: "Our Culture", href: "#career-culture" },
  { id: "benefits", label: "Benefits", href: "#career-benefits" },
  { id: "opportunities", label: "Career Opportunities", href: "#career-opportunities" },
];

const BENEFIT_CARDS = [
  {
    icon: "/images/webflow/Layer_1-50.svg",
    title: "Global Talent Network",
    text: "We hire based on skill and capability — not geography — building a diverse, high-caliber team that upholds the quality our clients expect.",
  },
  {
    icon: "/images/webflow/Layer_1-51.svg",
    title: "Technical Mastery",
    text: "Clear performance benchmarks, leadership pathways, and expanding global exposure ensure your growth scales alongside the organization.",
  },
  {
    icon: "/images/webflow/Layer_1-52.svg",
    title: "Detail Precision",
    text: "Competitive compensation aligned with contribution, consistency, and measurable impact — recognizing those who raise the standard.",
  },
  {
    icon: "/images/webflow/Layer_1-53.svg",
    title: "High-Trust Environment",
    text: "Operate with autonomy, accountability, and professional discipline — in a culture focused on outcomes, not micromanagement.",
  },
];

function JobAccordion({ job }: { job: JobListing }) {
  const [open, setOpen] = useState(false);
  const jobId = `job-${job.slug}`;
  const panelId = `${jobId}-panel`;

  return (
    <article className={styles.jobItem}>
      {/* WAI-ARIA accordion: heading wraps the toggle button (a heading must not
          be interactive, and block elements aren't valid inside <button>) */}
      <h3 className={styles.jobHeading}>
        <button
          type="button"
          id={jobId}
          className={styles.jobToggle}
          onClick={() => setOpen((prev) => !prev)}
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
        </div>
      )}
    </article>
  );
}

export function CareersTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("about");

  function scrollToSection(href: string) {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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

          {/* Section navigation. These are NOT tabs (panels aren't shown/hidden —
              all sections render and the buttons scroll to them), so this is a nav
              with aria-current, not role=tablist/tab. */}
          <nav className={styles.tabNav} aria-label="Career sections">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-current={activeTab === tab.id ? "true" : undefined}
                className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabButtonActive : ""}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  scrollToSection(tab.href);
                }}
              >
                <span className={styles.tabButtonText}>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </section>

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
    </>
  );
}
