"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./newsletter-signup.module.css";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "submitting") return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source: "shared-signup" }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className={styles["footerNewsletterCard"]}>
      <div className={styles["footerNewsletterTitle"]}>
        <div className={styles["newsSubheadOut"]}>
          <div className={styles["newsubott"]}>
            {/* Webflow renders the sparkle bare at its intrinsic 17×16. */}
            <Image
              src="/images/webflow/Layer_1-57.svg"
              alt=""
              aria-hidden="true"
              width={17}
              height={16}
            />
            <p className={styles["badgePillText"]}>
              <strong className={styles["faqSkyText"]}>
                Join 500+ Subscribers
              </strong>
              <br />
            </p>
          </div>
        </div>
        <div className={styles["newsHeading"]}>
          Agency Growth Insights{" "}
          <span className={styles["gradientSpan"]}>
            <br />
            Delivered Monthly
          </span>
        </div>
        <p className={styles["paragraphSmall4TextColorGray600"]}>
          Smart growth strategies, CRM playbooks, industry trends, early product
          updates, and member-only offers — designed for modern agencies.
        </p>
      </div>

      {/* aria-live region for screen reader feedback */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {status === "success" ? "Thank you! Your submission has been received!" : ""}
        {status === "error" ? "Something went wrong. Please try again." : ""}
      </div>

      <div className={styles["footerNewsletterFormBlock"]}>
        {status === "success" ? (
          <div className={styles["successMessage"]}>
            <div>Thank you! Your submission has been received!</div>
          </div>
        ) : (
          <form
            id="wf-form-newsletter-signup"
            name="newsletter-signup"
            onSubmit={handleSubmit}
            className={styles["columnLargeRowGap0"]}
          >
            <div className={styles["columnLarge"]}>
              <div className={styles["columnTiny2"]}>
                <label
                  htmlFor="newsletter-email"
                  className="sr-only"
                >
                  Email address
                </label>
                <input
                  className={styles["textFieldSmall"]}
                  maxLength={256}
                  name="Email-Newsletter"
                  placeholder="Enter your email"
                  type="email"
                  id="newsletter-email"
                  autoComplete="email"
                  required
                  aria-required="true"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className={styles["buttonSecondarySmall"]}
                >
                  Get Started
                </button>
              </div>
            </div>
          </form>
        )}
        {status === "error" && (
          <div className={styles["errorMessage"]} role="alert">
            <div>Oops! Something went wrong while submitting the form.</div>
          </div>
        )}
      </div>

      <div className={styles["newsletterBtmLine"]}>
        {/* Vector-24.svg intrinsic is 16×18; Webflow renders it bare. */}
        <Image
          src="/images/webflow/Vector-24.svg"
          alt=""
          aria-hidden="true"
          width={16}
          height={18}
          className={styles["shieldIcon"]}
        />
        <p className={styles["newsBtmPara"]}>
          100% privacy guaranteed. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
