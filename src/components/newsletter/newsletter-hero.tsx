"use client";

import { useState } from "react";
import Image from "next/image";
import { z } from "zod";
import styles from "./newsletter-hero.module.css";

const NewsletterSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

export function NewsletterHero() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function handleBlur() {
    const result = NewsletterSchema.safeParse({ email });
    if (!result.success) {
      const err = result.error.flatten().fieldErrors.email;
      setEmailError(err?.[0]);
    } else {
      setEmailError(undefined);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const result = NewsletterSchema.safeParse({ email });
    if (!result.success) {
      const err = result.error.flatten().fieldErrors.email;
      setEmailError(err?.[0]);
      return;
    }

    setEmailError(undefined);
    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source: "newsletter-page" }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className={styles.section} aria-labelledby="newsletter-heading">
      {/* aria-live region */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={styles.srOnly}
      >
        {status === "success" ? "Successfully subscribed to the newsletter." : ""}
      </div>

      <div className={styles.inner}>
        {/* Badge */}
        <div className={styles.badgeRow}>
          <div className={styles.badge}>
            <Image
              src="/images/webflow/Layer_1-57.svg"
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
            />
            <p className={styles.badgeText}>Join 500+ Subscribers</p>
          </div>
        </div>

        {/* Heading */}
        <h1 id="newsletter-heading" className={styles.heading}>
          Agency Growth Insights{" "}
          <span className={styles.gradientSpan}>Delivered Monthly</span>
        </h1>

        {/* Description */}
        <p className={styles.description}>
          Smart growth strategies, CRM playbooks, industry trends, early product
          updates, and member-only offers — designed for modern agencies.
        </p>

        {/* Form */}
        <div className={styles.formBlock}>
          {status === "success" ? (
            <div className={styles.successMsg}>
              Thank you! Your submission has been received!
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className={styles.form}
              noValidate
              aria-label="Newsletter signup"
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <label htmlFor="newsletter-email" className={styles.srOnly}>
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  maxLength={256}
                  required
                  aria-required="true"
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "newsletter-email-error" : undefined}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleBlur}
                  className={styles.emailInput}
                />
              </div>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Please wait..." : "Subscribe"}
              </button>
            </form>
          )}

          {emailError && status !== "success" && (
            <p
              id="newsletter-email-error"
              className={styles.fieldError}
              role="alert"
            >
              {emailError}
            </p>
          )}

          {status === "error" && (
            <p className={styles.errorMsg} role="alert">
              Oops! Something went wrong while submitting the form.
            </p>
          )}
        </div>

        {/* Privacy line */}
        <div className={styles.btmLine}>
          <Image
            src="/images/webflow/Vector-24.svg"
            alt=""
            width={14}
            height={14}
            aria-hidden="true"
          />
          <p className={styles.btmPara}>
            100% privacy guaranteed. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
