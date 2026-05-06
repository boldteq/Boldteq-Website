"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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

interface JobListing {
  title: string;
  type: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

const JOB_LISTINGS: JobListing[] = [
  {
    title: "Web Developers (WordPress / Shopify / Webflow)",
    type: "Full Time | Remote",
    description:
      "We're looking for a versatile Web Developer experienced in building high-performance websites across WordPress, Shopify, and Webflow. You'll work closely with designers and product teams to deliver scalable, conversion-focused digital experiences.",
    responsibilities: [
      "Develop and maintain custom themes and plugins",
      "Build Shopify storefronts and custom features",
      "Optimize performance, SEO, and responsiveness",
      "Integrate third-party APIs and tools",
    ],
    requirements: [
      "2+ years experience with WordPress, Shopify, or Webflow",
      "Strong knowledge of HTML, CSS, JavaScript",
      "Experience with Liquid (Shopify) is a plus",
      "Ability to handle multiple projects independently",
    ],
  },
  {
    title: "Frontend Developer (React / Next.js)",
    type: "Full Time | Remote",
    description:
      "We are hiring a Frontend Developer to build fast, scalable, and visually polished web applications using modern frameworks.",
    responsibilities: [
      "Develop UI components using React / Next.js",
      "Translate UI/UX designs into responsive code",
      "Optimize applications for speed and performance",
      "Collaborate with backend developers and designers",
    ],
    requirements: [
      "Strong experience with React.js and Next.js",
      "Good understanding of REST APIs",
      "Experience with Tailwind / modern CSS frameworks",
      "Eye for design and detail",
    ],
  },
  {
    title: "Shopify App Developer",
    type: "Full Time | Remote",
    description:
      "Join us to build powerful Shopify apps used by merchants worldwide.",
    responsibilities: [
      "Develop and maintain Shopify apps",
      "Work with Shopify APIs (Admin, Storefront, Webhooks)",
      "Build embedded apps using Polaris",
      "Ensure app performance and scalability",
    ],
    requirements: [
      "Experience with Shopify app development",
      "Knowledge of Node.js / React",
      "Understanding of Shopify ecosystem",
      "Experience with app billing & OAuth",
    ],
  },
  {
    title: "UI/UX Designer",
    type: "Full Time | Remote",
    description:
      "We're looking for a creative UI/UX Designer to craft intuitive and engaging user experiences.",
    responsibilities: [
      "Design wireframes, prototypes, and UI systems",
      "Conduct user research and usability testing",
      "Collaborate with developers for implementation",
      "Maintain design consistency across products",
    ],
    requirements: [
      "Strong portfolio (web/SaaS preferred)",
      "Experience with Figma / Adobe XD",
      "Understanding of UX principles",
      "Ability to think from a user-first perspective",
    ],
  },
  {
    title: "Digital Marketing Specialist",
    type: "Full Time | Remote",
    description:
      "We're hiring a performance-driven marketer to scale traffic and conversions.",
    responsibilities: [
      "Manage SEO, PPC, and paid campaigns",
      "Analyze performance metrics",
      "Optimize funnels and landing pages",
      "Work with content and design teams",
    ],
    requirements: [
      "Experience with Google Ads / Meta Ads",
      "Strong analytical skills",
      "Knowledge of SEO tools",
      "Growth mindset",
    ],
  },
];

function JobAccordion({ job }: { job: JobListing }) {
  const [open, setOpen] = useState(false);
  const jobId = `job-${job.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  const panelId = `${jobId}-panel`;

  return (
    <div className={styles.jobItem}>
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
            <h3 className={styles.jobTitle}>{job.title}</h3>
            <p className={styles.jobType}>{job.type}</p>
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

      {open && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={jobId}
          className={styles.jobContent}
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
    </div>
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

          {/* Tab navigation */}
          <nav
            className={styles.tabNav}
            role="tablist"
            aria-label="Career sections"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`career-tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={tab.href.replace("#", "")}
                tabIndex={activeTab === tab.id ? 0 : -1}
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
        className={`${styles.section} ${styles.aboutSection}`}
      >
        <div className={styles.container}>
          <div className={styles.aboutGrid}>
            <div className={styles.imagesFlex}>
              <Image
                src="/images/webflow/ca7e39d79f09e622dbf744ac70e1284061b70db0-1.png"
                alt="Boldteq team"
                width={480}
                height={720}
                className={styles.aboutImg}
                loading="lazy"
              />
              <Image
                src="/images/webflow/a994d403aef97ae290a90af19570268925b45785-1.png"
                alt="Boldteq work environment"
                width={480}
                height={720}
                className={`${styles.aboutImg} ${styles.aboutImgSecond}`}
                loading="lazy"
              />
            </div>
            <div className={styles.textColumn}>
              <h2 className={styles.tabHeading}>About Boldteq</h2>
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
        className={`${styles.section} ${styles.cultureSection}`}
      >
        <div className={styles.container}>
          <div className={styles.cultureGrid}>
            <div className={styles.textColumn}>
              <h2 className={styles.tabHeading}>Our Culture</h2>
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
                alt="Boldteq culture"
                width={480}
                height={720}
                className={`${styles.cultureImg} ${styles.cultureImgFirst}`}
                loading="lazy"
              />
              <Image
                src="/images/webflow/Rectangle-30834.png"
                alt="Boldteq team culture"
                width={480}
                height={720}
                className={styles.cultureImg}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section
        id="career-benefits"
        className={`${styles.section} ${styles.benefitsSection}`}
      >
        <div className={styles.container}>
          <div className={styles.benefitsOuter}>
            <div className={styles.benefitsCenter}>
              <div className={styles.benefitsHeader}>
                <h2 className={styles.heading}>Benefits</h2>
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
                    alt={`${card.title} icon`}
                    width={48}
                    height={48}
                    className={styles.benefitIcon}
                    loading="lazy"
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
        className={`${styles.section} ${styles.opportunitiesSection}`}
      >
        <div className={styles.container}>
          <div className={styles.opportunitiesOuter}>
            <div className={styles.opportunitiesCenter}>
              <div className={styles.opportunitiesHeader}>
                <h2 className={styles.heading}>Current Opportunities</h2>
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
