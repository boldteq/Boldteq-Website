import styles from "./demo-audience.module.css";

const BENEFITS = [
  "Digital agencies managing ongoing client work",
  "Shopify & WordPress agencies",
  "UI/UX & branding studios",
  "Founders scaling delivery without hiring",
  "Teams looking for a reliable white-label partner",
];

function BlueTick() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="10" fill="#21cfff" fillOpacity="0.15" />
      <path
        d="M6 10.5l2.8 2.8L14 7"
        stroke="#21cfff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DemoAudience() {
  return (
    <section className={styles["section"]}>
      <div className={styles["inner"]}>
        <div className={styles["content"]}>
          {/* Left */}
          <div className={styles["leftCol"]}>
            <h2 className={styles["heading"]}>
              Who This Demo Is Designed For
            </h2>
            <p className={styles["subtitle"]}>
              This walkthrough is built for teams responsible for delivering
              consistent, client-ready work — and who want a reliable,
              white-label delivery partner behind the scenes.
            </p>
          </div>

          {/* Right */}
          <div className={styles["rightCol"]}>
            <p className={styles["rightLabel"]}>This Demo Is Ideal For:</p>
            <ul className={styles["benefitsList"]}>
              {BENEFITS.map((benefit) => (
                <li key={benefit} className={styles["benefitItem"]}>
                  <div className={styles["tickWrap"]}>
                    <BlueTick />
                  </div>
                  <p className={styles["benefitText"]}>{benefit}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
