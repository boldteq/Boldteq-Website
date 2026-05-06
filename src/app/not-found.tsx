import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist or has been moved.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        padding: "40px 20px",
        textAlign: "center",
        fontFamily: "var(--font-roobert), Arial, sans-serif",
        color: "var(--color-text-primary)",
      }}
    >
      <p
        style={{
          fontSize: "14px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--color-brand-blue)",
          margin: 0,
          fontWeight: 700,
        }}
      >
        404 — Page not found
      </p>
      <h1
        style={{
          fontSize: "clamp(32px, 5vw, 50px)",
          lineHeight: 1.1,
          margin: "16px 0 12px",
          fontWeight: 700,
        }}
      >
        We couldn&apos;t find that page.
      </h1>
      <p
        style={{
          fontSize: "18px",
          lineHeight: "28px",
          color: "var(--color-text-muted)",
          maxWidth: "560px",
          margin: "0 0 32px",
        }}
      >
        The link may be broken, or the page may have been moved. Try heading back
        to the homepage or browsing recent work.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "14px 28px",
            borderRadius: 999,
            backgroundImage: "var(--gradient-brand)",
            color: "var(--color-surface)",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Back to home
        </Link>
        <Link
          href="/our-works"
          style={{
            display: "inline-block",
            padding: "14px 28px",
            borderRadius: 999,
            background: "var(--color-text-primary)",
            color: "var(--color-surface)",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          See our work
        </Link>
      </div>
    </div>
  );
}
