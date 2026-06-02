"use client";

import Image from "next/image";
import Link from "next/link";
import { FAQ_ITEMS } from "@/lib/constants/faq";
import { FaqAccordion } from "@/components/patterns/faq-accordion/faq-accordion";
import styles from "./faq-section.module.css";

function HelpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <g clipPath="url(#faq_help_clip)">
        <path d="M0.804837 13.9634C0.571036 14.0288 0.365291 13.9914 0.196954 13.8418C0.0473215 13.7108 -0.0461988 13.4864 0.0192654 13.2619L0.804837 10.2506C-0.813066 7.17377 0.0847296 3.41425 2.83423 1.37551C5.58373 -0.663235 9.49288 -0.392026 11.9431 2.04886C14.3933 4.48974 14.6926 8.36148 12.6445 11.1484C10.5964 13.9353 6.82755 14.8144 3.75073 13.2058L0.804837 13.9727V13.9634ZM6.47217 7.99675C6.47217 8.33343 6.70597 8.57658 7.01459 8.56723C7.3045 8.56723 7.52895 8.31472 7.52895 8.01546C7.52895 7.74425 7.62247 7.50109 7.80016 7.3047L8.39869 6.65941C8.74471 6.29468 8.9037 5.84578 8.9224 5.35013C8.96916 4.25594 8.12748 3.34879 7.04265 3.32073C5.95781 3.29268 5.08807 4.13436 5.06937 5.2192C5.06937 5.52781 5.31252 5.77097 5.60243 5.76161C5.89234 5.75226 6.11679 5.52781 6.12615 5.2192C6.1355 4.71419 6.56569 4.34011 7.04265 4.36816C7.5196 4.39622 7.88433 4.789 7.87498 5.28466C7.87498 5.55587 7.78146 5.78967 7.59441 5.98606L6.99588 6.63135C6.64986 7.00544 6.47217 7.46369 6.47217 7.99675ZM6.79949 9.48373C6.39735 9.6053 6.21967 10.0168 6.34124 10.3722C6.46282 10.7275 6.84625 10.9239 7.20163 10.8211C7.55701 10.7182 7.78146 10.3254 7.66923 9.95133C7.55701 9.57725 7.19228 9.3715 6.79949 9.48373Z" fill="url(#faq_help_grad)"/>
      </g>
      <defs>
        <linearGradient id="faq_help_grad" x1="-0.002" y1="7.01" x2="14.002" y2="7.01" gradientUnits="userSpaceOnUse">
          <stop stopColor="#21CFFF"/><stop offset="1" stopColor="#019AE6"/>
        </linearGradient>
        <clipPath id="faq_help_clip"><rect width="14" height="14" fill="white"/></clipPath>
      </defs>
    </svg>
  );
}

function MsgIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <g clipPath="url(#faq_msg_clip)">
        <path d="M0.0102213 14.9937L2.17237 12.8223C1.55622 12.1655 1.06058 11.4356 0.689674 10.633C-0.655164 7.71945 0.0149103 4.32163 2.28022 2.12392C5.27328 -0.779318 10.0065 -0.68931 12.8889 2.29034C15.6958 5.19171 15.7173 9.79667 12.8715 12.7205C11.4634 14.1672 9.52584 15.0012 7.46216 14.9998L0.0102213 14.9942V14.9937ZM10.497 8.24731L4.50005 8.24872C4.50896 9.942 5.88709 11.2542 7.51749 11.2471C9.14367 11.2401 10.5068 9.90075 10.497 8.24731Z" fill="url(#faq_msg_grad)"/>
      </g>
      <defs>
        <linearGradient id="faq_msg_grad" x1="0" y1="7.5" x2="15" y2="7.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#21CFFF"/><stop offset="1" stopColor="#019AE6"/>
        </linearGradient>
        <clipPath id="faq_msg_clip"><rect width="15" height="15" fill="white"/></clipPath>
      </defs>
    </svg>
  );
}

const QUICK_LINKS = [
  {
    icon: <HelpIcon />,
    title: "Our Help Center",
    sub: "Help when you need it",
    href: "https://help.boldteq.com/",
    external: true,
    label: "Visit Boldteq Help Center (opens in new tab)",
  },
  {
    icon: <MsgIcon />,
    title: "Send Us A Message",
    sub: "We're here to help",
    href: "/contact",
    external: false,
    label: "Contact us — send a message",
  },
];

export function FaqSection() {
  return (
    <section
      className={`${styles["faqSection"]} ${styles["faqSectionHomeFaq"]}`}
      aria-labelledby="faq-heading"
    >
      <div className={styles["containerLarge3"]}>
        <div className={styles["fqOuterGrid"]}>
          {/* Left column — heading + quick links */}
          <div>
            <div className={styles["faqSubheadingOuter"]}>
              {/* Webflow .faq-subott pill + .faq-sky-text (gradient cyan, capitalize,
                  weight 500). The shared Badge primitive rendered the wrong pill
                  (1.5px #21cfff border, 999px radius, solid bold text). */}
              <div className={styles["faqSubott"]}>
                <p className={styles["badgePillText"]}>
                  <strong className={styles["faqSkyText"]}>
                    Have question in mind?
                  </strong>
                </p>
              </div>
            </div>
            <h2 id="faq-heading" className={styles["heading2"]}>
              Frequently Asked Questions
            </h2>
            <p className={styles["paragraph"]}>
              See our Help Center or send us a message!
            </p>

            <div className={styles["faqGrid"]}>
              {QUICK_LINKS.map((item) => (
                <div key={item.href} className={styles["rowSmallWithBorder"]}>
                  <div className={styles["contactIconPrimary"]}>
                    {item.icon}
                  </div>
                  <div className={styles["column"]}>
                    <div className={styles["row2xSmall"]}>
                      <div className={styles["subheadingSmall5"]}>{item.title}</div>
                      {item.external ? (
                        <a
                          aria-label={item.label}
                          href={item.href}
                          className={styles["faqLinkBlock"]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image
                            src="/images/webflow/Vector-17.svg"
                            alt=""
                            aria-hidden="true"
                            width={11}
                            height={11}
                          />
                        </a>
                      ) : (
                        <Link
                          aria-label={item.label}
                          href={item.href}
                          className={styles["faqLinkBlock"]}
                        >
                          <Image
                            src="/images/webflow/Vector-17.svg"
                            alt=""
                            aria-hidden="true"
                            width={11}
                            height={11}
                          />
                        </Link>
                      )}
                    </div>
                    <div className={styles["paragraphXSmall11TextColorTertiary"]}>
                      {item.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — accordion */}
          <div className={styles["faqSingleGrid"]}>
            <FaqAccordion items={FAQ_ITEMS} layout="single" />
            <div className={styles["faqBtmCenter"]}>
              <a
                href="https://help.boldteq.com"
                className={styles["faqBtmLink"]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="See more questions in our Help Center (opens in new tab)"
              >
                <p className={styles["faqBtmLinkText"]}>
                  <strong className={styles["faqSkyText"]}>
                    See more questions
                  </strong>
                </p>
                <Image
                  src="/images/webflow/Vector-17.svg"
                  alt=""
                  aria-hidden="true"
                  width={11}
                  height={11}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
