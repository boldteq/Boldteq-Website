import Image from "next/image";
import Link from "next/link";
import type { PortfolioDetail } from "@/types/portfolio";
import styles from "./case-study-content.module.css";

interface CaseStudyContentProps {
  detail: PortfolioDetail;
  /** Rendered inside the portfolio popup — fills the modal instead of 100vh. */
  embedded?: boolean;
}

export function CaseStudyContent({ detail, embedded = false }: CaseStudyContentProps) {
  return (
    <div className={`${styles.content} ${embedded ? styles.embedded : ""}`}>
      {/* ── Hero: badge + title + meta (workp-subott / workp-title / work-small-tags) ── */}
      <div className={styles.heroSubott}>
        <div className={styles.badge}>
          <strong className={styles.badgeText}>{detail.platform}</strong>
        </div>
      </div>
      <h2 className={styles.title}>{detail.title}</h2>
      <div className={styles.metaRow}>
        <div className={styles.metaItem}>
          <Image
            src="/images/webflow/Group-47135-2.svg"
            alt=""
            width={18}
            height={18}
            className={styles.metaIcon}
            aria-hidden="true"
          />
          <span className={styles.metaText}>{detail.meta.role}</span>
        </div>
        <div className={styles.metaItem}>
          <Image
            src="/images/webflow/Vector-27.svg"
            alt=""
            width={16}
            height={16}
            className={styles.metaIcon}
            aria-hidden="true"
          />
          <span className={styles.metaText}>{detail.meta.teamSize}</span>
        </div>
        <div className={styles.metaItem}>
          <Image
            src="/images/webflow/Group-3.svg"
            alt=""
            width={18}
            height={18}
            className={styles.metaIcon}
            aria-hidden="true"
          />
          <span className={styles.metaText}>{detail.meta.duration}</span>
        </div>
      </div>

      {/* ── Content sections (workp-content) ── */}
      <div className={styles.sections}>
        {/* The Challenge */}
        <div className={styles.section}>
          <div className={`${styles.iconCol} ${styles.iconColRed}`}>
            <Image
              src="/images/webflow/Layer_1-62.svg"
              alt=""
              width={20}
              height={20}
              className={styles.icon}
              aria-hidden="true"
            />
          </div>
          <div className={styles.sectionBody}>
            <h3 className={styles.sectionHeading}>The Challenge</h3>
            <p className={styles.sectionSubtitle}>Problem Statement</p>
            <p className={styles.paragraph}>{detail.challenge}</p>
          </div>
        </div>

        {/* Our Solution */}
        <div className={styles.section}>
          <div className={`${styles.iconCol} ${styles.iconColBlue}`}>
            <Image
              src="/images/webflow/Layer_1-63.svg"
              alt=""
              width={20}
              height={20}
              className={styles.icon}
              aria-hidden="true"
            />
          </div>
          <div className={styles.sectionBody}>
            <h3 className={styles.sectionHeading}>Our Solution</h3>
            <p className={styles.sectionSubtitle}>Strategic Approach</p>
            <p className={styles.paragraph}>{detail.solution}</p>
          </div>
        </div>

        {/* Implementation */}
        <div className={styles.section}>
          <div className={`${styles.iconCol} ${styles.iconColPurple}`}>
            <Image
              src="/images/webflow/Layer_1-64.svg"
              alt=""
              width={20}
              height={20}
              className={styles.icon}
              aria-hidden="true"
            />
          </div>
          <div className={styles.sectionBody}>
            <h3 className={styles.sectionHeading}>Implementation</h3>
            <p className={styles.sectionSubtitle}>Key Steps</p>
            <ul className={styles.implementList}>
              {detail.implementation.map((step, index) => (
                <li key={index} className={styles.implementItem}>
                  <span className={styles.listNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.listText}>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Impact & Results */}
        <div className={styles.section}>
          <div className={`${styles.iconCol} ${styles.iconColGreen}`}>
            <Image
              src="/images/webflow/Layer_1-65.svg"
              alt=""
              width={20}
              height={20}
              className={styles.icon}
              aria-hidden="true"
            />
          </div>
          <div className={styles.sectionBody}>
            <h3 className={styles.sectionHeading}>Impact &amp; Results</h3>
            <p className={styles.sectionSubtitle}>Measurable Outcomes</p>
            <div className={styles.impactGrid}>
              {detail.impact.map((item, index) => (
                <div key={index} className={styles.impactCard}>
                  <div className={styles.impactValue}>{item.value}</div>
                  <div className={styles.impactLabel}>{item.label}</div>
                  <div className={styles.impactDescription}>
                    {item.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className={styles.section}>
          <div className={`${styles.iconCol} ${styles.iconColOrange}`}>
            <Image
              src="/images/webflow/Layer_1-66.svg"
              alt=""
              width={20}
              height={20}
              className={styles.icon}
              aria-hidden="true"
            />
          </div>
          <div className={styles.sectionBody}>
            <h3 className={styles.sectionHeading}>Key Features</h3>
            <p className={styles.sectionSubtitle}>Highlights</p>
            <ul className={styles.featuresList}>
              {detail.keyFeatures.map((feature, index) => (
                <li key={index} className={styles.featureItem}>
                  <Image
                    src="/images/webflow/Group-4.svg"
                    alt=""
                    width={16}
                    height={16}
                    className={styles.checkIcon}
                    aria-hidden="true"
                  />
                  <span className={styles.featureText}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tech Stack + CTAs */}
        <div className={styles.techSection}>
          <h3 className={styles.techHeading}>Tech Stack</h3>
          <div className={styles.techRow}>
            {detail.techStack.map((tech) => (
              <span key={tech} className={styles.techPill}>
                {tech}
              </span>
            ))}
          </div>
          {/* div-job-attention.left-pos — CTA buttons matching Webflow */}
          <div className={styles.ctaRow}>
            <Link href="/pricing" className={styles.ctaGradient}>
              View Plans
            </Link>
            <Link href="/book-a-demo" className={styles.ctaNavy}>
              <strong>Schedule Demo</strong>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
