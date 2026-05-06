"use client";

import { useState } from "react";
import { z } from "zod";
import styles from "./contact-form-section.module.css";

/* ── Schema ─────────────────────────────────────────────────── */
const ContactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: z.string().optional(),
  inquiryType: z.string().min(1, "Please select an option"),
  message: z.string().optional(),
});

type ContactFields = z.infer<typeof ContactSchema>;
type FieldErrors = Partial<Record<keyof ContactFields, string>>;
type FormStatus = "idle" | "submitting" | "success" | "error";

const INITIAL: ContactFields = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  inquiryType: "",
  message: "",
};

const INQUIRY_OPTIONS = [
  { value: "new-project", label: "Start a New Project" },
  { value: "agency-partnership", label: "Agency Partnership" },
  { value: "technical-account-support", label: "Technical or Account Support" },
  { value: "team", label: "Join Our Team" },
  { value: "general-inquiry", label: "General Inquiry" },
];

/* ── Component ──────────────────────────────────────────────── */
export function ContactFormSection() {
  const [fields, setFields] = useState<ContactFields>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");

  function validateField(name: keyof ContactFields, value: string) {
    const result = ContactSchema.safeParse({ ...fields, [name]: value });
    if (!result.success) {
      const fieldError = result.error.flatten().fieldErrors[name];
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError?.[0] ?? undefined,
      }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  function handleBlur(
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    validateField(name as keyof ContactFields, value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const result = ContactSchema.safeParse(fields);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const mapped: FieldErrors = {};
      for (const [k, v] of Object.entries(fieldErrors)) {
        const key = k as keyof ContactFields;
        if (v?.[0]) mapped[key] = v[0];
      }
      setErrors(mapped);
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setStatus("success");
      setFields(INITIAL);
      setErrors({});
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className={styles.section} aria-label="Contact form">
      <div className={styles.container}>
        {/* aria-live region for screen readers */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={styles.srOnly}
        >
          {status === "success"
            ? "Your message has been sent successfully."
            : status === "error"
            ? "Something went wrong. Please try again."
            : ""}
        </div>

        {status === "success" ? (
          <div className={styles.successMsg}>
            Thank you! Your submission has been received!
            <br />
            Our team will get back to you within 12-24hrs.
          </div>
        ) : (
          <>
            <h3 className={styles.heading}>Send us a message.</h3>

            <form
              onSubmit={handleSubmit}
              className={styles.form}
              noValidate
              aria-label="Send a message"
            >
              {/* First Name + Last Name */}
              <div className={styles.rowTwo}>
                <div className={styles.field}>
                  <div className={styles.labelRow}>
                    <label htmlFor="firstName" className={styles.label}>
                      First Name
                    </label>
                    <span className={styles.required} aria-hidden="true">
                      *
                    </span>
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    maxLength={256}
                    value={fields.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.firstName}
                    aria-describedby={
                      errors.firstName ? "firstName-error" : undefined
                    }
                    className={styles.input}
                  />
                  {errors.firstName && (
                    <p
                      id="firstName-error"
                      className={styles.fieldError}
                      role="alert"
                    >
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <div className={styles.labelRow}>
                    <label htmlFor="lastName" className={styles.label}>
                      Last Name
                    </label>
                    <span className={styles.required} aria-hidden="true">
                      *
                    </span>
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Smith"
                    maxLength={256}
                    value={fields.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.lastName}
                    aria-describedby={
                      errors.lastName ? "lastName-error" : undefined
                    }
                    className={styles.input}
                  />
                  {errors.lastName && (
                    <p
                      id="lastName-error"
                      className={styles.fieldError}
                      role="alert"
                    >
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email + Phone */}
              <div className={styles.rowTwo}>
                <div className={styles.field}>
                  <div className={styles.labelRow}>
                    <label htmlFor="email" className={styles.label}>
                      Email
                    </label>
                    <span className={styles.required} aria-hidden="true">
                      *
                    </span>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    maxLength={256}
                    value={fields.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={
                      errors.email ? "email-error" : undefined
                    }
                    className={styles.input}
                  />
                  {errors.email && (
                    <p
                      id="email-error"
                      className={styles.fieldError}
                      role="alert"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="phone" className={styles.label}>
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (123) 456 7890"
                    maxLength={256}
                    value={fields.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Inquiry Type */}
              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <label htmlFor="inquiryType" className={styles.label}>
                    What Are You Looking For?
                  </label>
                  <span className={styles.required} aria-hidden="true">
                    *
                  </span>
                </div>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={fields.inquiryType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.inquiryType}
                  aria-describedby={
                    errors.inquiryType ? "inquiryType-error" : undefined
                  }
                  className={styles.select}
                >
                  <option value="">Select an option...</option>
                  {INQUIRY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.inquiryType && (
                  <p
                    id="inquiryType-error"
                    className={styles.fieldError}
                    role="alert"
                  >
                    {errors.inquiryType}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className={styles.field}>
                <label htmlFor="message" className={styles.label}>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Enter your message..."
                  maxLength={5000}
                  value={fields.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={styles.textarea}
                  aria-describedby="message-counter"
                />
                <p
                  id="message-counter"
                  className={styles.charCounter}
                  aria-live="polite"
                >
                  {(fields.message ?? "").length}/5000 characters
                </p>
              </div>

              {/* Form-level error */}
              {status === "error" && (
                <p className={styles.errorMsg} role="alert">
                  Oops! Something went wrong while submitting the form. Please
                  try again or email us directly.
                </p>
              )}

              <div>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? "Please wait..." : "Send Message"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
