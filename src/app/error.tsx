"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Error captured — add your error tracking integration here when configured
  }, [error]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "40px 20px",
        textAlign: "center",
        fontFamily: "var(--font-roobert), Arial, sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: "32px",
          fontWeight: 700,
          color: "var(--color-text-primary)",
          marginBottom: "12px",
        }}
      >
        Something went wrong
      </h2>
      <p
        style={{
          fontSize: "16px",
          color: "var(--color-text-muted)",
          marginBottom: "32px",
          maxWidth: "480px",
        }}
      >
        We encountered an unexpected error. Please try again or return to the
        homepage.
      </p>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          type="button"
          onClick={reset}
          style={{
            padding: "12px 28px",
            borderRadius: "10px",
            backgroundImage: "var(--gradient-brand)",
            color: "var(--color-surface)",
            fontWeight: 700,
            fontSize: "16px",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-roobert), Arial, sans-serif",
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            padding: "12px 28px",
            borderRadius: "10px",
            border: "1px solid var(--color-text-primary)",
            color: "var(--color-text-primary)",
            fontWeight: 700,
            fontSize: "16px",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          Go to homepage
        </Link>
      </div>
    </div>
  );
}
