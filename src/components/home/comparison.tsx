import Image from "next/image";
import styles from "./comparison.module.css";

const TRADITIONAL_POINTS = [
  {
    label: "Slow execution cycles",
    detail: "Work typically takes 5–10 business days.",
    last: false,
  },
  {
    label: "Hiring creates friction",
    detail: "Recruiting, onboarding, and coordination delay real progress.",
    last: false,
  },
  {
    label: "Agency-style timelines",
    detail: "Proposals and handoffs stretch timelines.",
    last: false,
  },
  {
    label: "Constant supervision needed",
    detail:
      "Teams require repeated context, follow-ups, and micromanagement.",
    last: true,
  },
];

const BOLDTEQ_POINTS = [
  {
    label: "24–48 hour execution cycles",
    detail: "Requests move forward without delay.",
    last: false,
  },
  {
    label: "No hiring delays",
    detail: "Your execution team is active within hours, not weeks.",
    last: false,
  },
  {
    label: "Faster than traditional agencies",
    detail: "Delivery moves in days, not weeks.",
    last: false,
  },
  {
    label: "Predictable monthly capacity",
    detail: "You always know what's in progress and what's coming next.",
    last: true,
  },
];

export function Comparison() {
  return (
    <section className={styles["waysSec"]}>
      <div className={styles["containerLarge3"]}>
        <div className={styles["waysGrid"]}>
          {/* Traditional Way */}
          <div className={styles["grayBg"]}>
            <h2 className={styles["heading2"]}>Traditional Way</h2>

            {TRADITIONAL_POINTS.map((point) => (
              <p
                key={point.label}
                className={
                  point.last
                    ? styles["paragraphWithCrossLast"]
                    : styles["paragraphWithCross"]
                }
              >
                <strong className={styles["wayGridBold"]}>
                  {point.label}
                  <br />
                </strong>
                {point.detail}
                <br />
              </p>
            ))}

            <div className={styles["wayInnerGrid"]}>
              <div className={styles["wayInnInDropShadow"]}>
                <p className={styles["paragraphSmallText"]}>
                  Hey, quick update — the work isn&apos;t fully finished yet. I
                  need a little more time to wrap it up properly. I&apos;ll keep
                  you posted with progress.
                </p>
                <div className={styles["authorBlock"]}>
                  <Image
                    src="/images/webflow/21c8ac36af4c545ed9dbd097e8be0561ce815262.png"
                    alt="Client Testimonial-Traditional way"
                    width={42}
                    height={42}
                    className={styles["authorImageSmall"]}
                  />
                  <div>
                    <p className={styles["authorNameSmall"]}>Laura Kim</p>
                    <p className={styles["authorNameTag"]}>Client</p>
                  </div>
                </div>
              </div>

              <div className={styles["wayInnInDropShadowMarginTop"]}>
                <p className={styles["paragraphSmallText"]}>
                  Hi, I wanted to let you know that the work is running behind
                  schedule. Rather than rushing it and compromising quality,
                  I&apos;m taking extra time to complete it properly.
                </p>
                <div className={styles["authorBlock"]}>
                  <Image
                    src="/images/webflow/074abb6201ad0615171136142abaca66277d607b.png"
                    alt="Client testimonial-Olivia Smith"
                    width={42}
                    height={42}
                    className={styles["authorImageSmallPinkBg"]}
                  />
                  <div>
                    <p className={styles["authorNameSmall"]}>Olivia Smith</p>
                    <p className={styles["authorNameTag"]}>Client</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Boldteq Way */}
          <div className={styles["skycolorBg"]}>
            <h2 className={styles["heading2"]}>Boldteq Way</h2>

            {BOLDTEQ_POINTS.map((point) => (
              <p
                key={point.label}
                className={
                  point.last
                    ? styles["paragraphWithTickLast"]
                    : styles["paragraphWithTick"]
                }
              >
                <strong className={styles["wayGridBoldSky"]}>
                  {point.label}
                  <br />
                </strong>
                {point.detail}
                <br />
              </p>
            ))}

            <div className={styles["wayInnerGridCol2"]}>
              <div className={styles["wayInnIn2"]}>
                <Image
                  src="/images/webflow/f8f0feb98079a1670f1d01ab1aa9fadccc312da5.png"
                  alt=""
                  aria-hidden="true"
                  width={42}
                  height={42}
                  className={styles["authorImageSmallRightAuthor"]}
                />
                <div className={styles["descBlock"]}>
                  <p className={styles["paragraphSmallText"]}>
                    Wow! Thanks for delivering this ahead of schedule. Really
                    appreciate your speed and quality.
                  </p>
                </div>
              </div>

              <div className={styles["wayInnIn2Two"]}>
                <Image
                  src="/images/webflow/Group-47034.svg"
                  alt="Boldteq icon"
                  width={42}
                  height={42}
                  className={styles["authorImageSmallRightAuthorNoBg"]}
                />
                <div className={styles["descBlock"]}>
                  <p className={styles["paragraphSmallText"]}>
                    Thank you! Glad we could deliver ahead of time. Let us know
                    if you&apos;d like any changes.
                  </p>
                </div>
              </div>

              <div className={styles["wayInnIn2"]}>
                <Image
                  src="/images/webflow/f8f0feb98079a1670f1d01ab1aa9fadccc312da5.png"
                  alt=""
                  aria-hidden="true"
                  width={42}
                  height={42}
                  className={styles["authorImageSmallRightAuthor"]}
                />
                <div className={styles["descBlock"]}>
                  <p className={styles["paragraphSmallText"]}>
                    The design looks great! I&apos;m happy with the direction
                    and everything is approved. Please go ahead and move forward
                    with the development phase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
