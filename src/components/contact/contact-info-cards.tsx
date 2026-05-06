import Image from "next/image";
import Link from "next/link";
import styles from "./contact-info-cards.module.css";

const CARDS = [
  { dept: "Sales", email: "sales@boldteq.com" },
  { dept: "Support", email: "support@boldteq.com" },
  { dept: "Career", email: "hr@boldteq.com" },
];

/* Exact Webflow SVG arrow — gradient from #21CFFF → #019AE6 */
function GradientArrow() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M1.64376 1.00077H9.36014V8.71715M8.82428 1.53663L1.00073 9.36018"
        stroke="url(#arrowGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="arrowGrad"
          x1="1.32225"
          y1="1.32228"
          x2="9.03863"
          y2="9.03866"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#21CFFF" />
          <stop offset="1" stopColor="#019AE6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ContactInfoCards() {
  return (
    <div className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {CARDS.map((card) => (
            <div key={card.dept} className={styles.card}>
              <div className={styles.iconWrap}>
                <Image
                  src="/images/webflow/Group_1.svg"
                  alt=""
                  width={24}
                  height={24}
                  aria-hidden="true"
                />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardDept}>{card.dept}</div>
                <div className={styles.cardEmail}>{card.email}</div>
              </div>
              <Link
                href={`mailto:${card.email}`}
                className={styles.arrowLink}
                aria-label={`Email ${card.dept} at ${card.email}`}
              >
                <GradientArrow />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
