"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants/site";
import styles from "./footer.module.css";

// ─── Social icons (white fill, 20×20, exact SVG paths from Webflow HTML) ─────

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.78353 4.16652C5.78331 4.60855 5.6075 5.03239 5.29478 5.34479C4.98207 5.6572 4.55806 5.83258 4.11603 5.83236C3.674 5.83214 3.25017 5.65633 2.93776 5.34361C2.62536 5.0309 2.44997 4.60688 2.4502 4.16486C2.45042 3.72283 2.62622 3.29899 2.93894 2.98659C3.25166 2.67419 3.67567 2.4988 4.1177 2.49902C4.55972 2.49924 4.98356 2.67505 5.29596 2.98777C5.60837 3.30049 5.78375 3.7245 5.78353 4.16652ZM5.83353 7.06652H2.5002V17.4999H5.83353V7.06652ZM11.1002 7.06652H7.78353V17.4999H11.0669V12.0249C11.0669 8.97486 15.0419 8.69152 15.0419 12.0249V17.4999H18.3335V10.8915C18.3335 5.74986 12.4502 5.94152 11.0669 8.46652L11.1002 7.06652Z" fill="white" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.50033 1.66699H13.5003C16.167 1.66699 18.3337 3.83366 18.3337 6.50033V13.5003C18.3337 14.7822 17.8244 16.0116 16.918 16.918C16.0116 17.8244 14.7822 18.3337 13.5003 18.3337H6.50033C3.83366 18.3337 1.66699 16.167 1.66699 13.5003V6.50033C1.66699 5.21845 2.17622 3.98907 3.08264 3.08264C3.98907 2.17622 5.21845 1.66699 6.50033 1.66699ZM6.33366 3.33366C5.53801 3.33366 4.77495 3.64973 4.21234 4.21234C3.64973 4.77495 3.33366 5.53801 3.33366 6.33366V13.667C3.33366 15.3253 4.67533 16.667 6.33366 16.667H13.667C14.4626 16.667 15.2257 16.3509 15.7883 15.7883C16.3509 15.2257 16.667 14.4626 16.667 13.667V6.33366C16.667 4.67533 15.3253 3.33366 13.667 3.33366H6.33366ZM14.3753 4.58366C14.6516 4.58366 14.9165 4.69341 15.1119 4.88876C15.3072 5.08411 15.417 5.34906 15.417 5.62533C15.417 5.90159 15.3072 6.16654 15.1119 6.3619C14.9165 6.55725 14.6516 6.66699 14.3753 6.66699C14.0991 6.66699 13.8341 6.55725 13.6388 6.3619C13.4434 6.16654 13.3337 5.90159 13.3337 5.62533C13.3337 5.34906 13.4434 5.08411 13.6388 4.88876C13.8341 4.69341 14.0991 4.58366 14.3753 4.58366ZM10.0003 5.83366C11.1054 5.83366 12.1652 6.27265 12.9466 7.05405C13.728 7.83545 14.167 8.89526 14.167 10.0003C14.167 11.1054 13.728 12.1652 12.9466 12.9466C12.1652 13.728 11.1054 14.167 10.0003 14.167C8.89526 14.167 7.83545 13.728 7.05405 12.9466C6.27265 12.1652 5.83366 11.1054 5.83366 10.0003C5.83366 8.89526 6.27265 7.83545 7.05405 7.05405C7.83545 6.27265 8.89526 5.83366 10.0003 5.83366ZM10.0003 7.50033C9.33728 7.50033 8.7014 7.76372 8.23256 8.23256C7.76372 8.7014 7.50033 9.33728 7.50033 10.0003C7.50033 10.6634 7.76372 11.2993 8.23256 11.7681C8.7014 12.2369 9.33728 12.5003 10.0003 12.5003C10.6634 12.5003 11.2993 12.2369 11.7681 11.7681C12.2369 11.2993 12.5003 10.6634 12.5003 10.0003C12.5003 9.33728 12.2369 8.7014 11.7681 8.23256C11.2993 7.76372 10.6634 7.50033 10.0003 7.50033Z" fill="white" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.8337 2.39551C10.8115 2.39551 9.83115 2.80157 9.10835 3.52437C8.38556 4.24716 7.97949 5.22749 7.97949 6.24967V8.39551H5.91699C5.81366 8.39551 5.72949 8.47884 5.72949 8.58301V11.4163C5.72949 11.5197 5.81283 11.6038 5.91699 11.6038H7.97949V17.4163C7.97949 17.5197 8.06283 17.6038 8.16699 17.6038H11.0003C11.1037 17.6038 11.1878 17.5205 11.1878 17.4163V11.6038H13.2687C13.3545 11.6038 13.4295 11.5455 13.4503 11.4622L14.1587 8.62884C14.1656 8.60119 14.1662 8.57232 14.1603 8.54442C14.1545 8.51652 14.1423 8.49032 14.1248 8.46782C14.1073 8.44532 14.0849 8.42712 14.0592 8.41459C14.0336 8.40205 14.0055 8.39553 13.977 8.39551H11.1878V6.24967C11.1878 6.16486 11.2045 6.08088 11.237 6.00252C11.2694 5.92417 11.317 5.85297 11.377 5.793C11.437 5.73303 11.5082 5.68546 11.5865 5.653C11.6649 5.62055 11.7488 5.60384 11.8337 5.60384H14.0003C14.1037 5.60384 14.1878 5.52051 14.1878 5.41634V2.58301C14.1878 2.47967 14.1045 2.39551 14.0003 2.39551H11.8337Z" fill="white" />
    </svg>
  );
}

// ─── Social link button ───────────────────────────────────────────────────────

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={styles['footer-social-link']}
    >
      {children}
    </a>
  );
}

// ─── Newsletter form ──────────────────────────────────────────────────────────

function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles['footer-newsletter-card']}>
      <div className={styles['footer-newsletter-title']}>
        {/* "Join 500+ Subscribers" pill */}
        <div className={styles['news-subhead-out']}>
          <div className={styles['newsubott']}>
            {/* Webflow renders this sparkle bare at its intrinsic 17×16. The
                .icon-regular class (24×24) was overriding the width/height and
                oversizing/distorting it — removed so it matches Webflow. */}
            <Image
              src="/images/webflow/Layer_1-57.svg"
              alt=""
              aria-hidden="true"
              width={17}
              height={16}
            />
            <p className={styles['news-pill-text']}>
              <strong className={styles['news-pill-highlight']}>Join 500+ Subscribers</strong>
            </p>
          </div>
        </div>

        {/* Heading */}
        <h2 className={styles['heading-2-news']}>
          Agency Growth Insights{" "}
          <span className={styles['gradient-span']}>
            <br />
            Delivered Monthly
          </span>
        </h2>

        {/* Sub-text */}
        <p className={styles['paragraph-small-4-gray']}>
          Smart growth strategies, CRM playbooks, industry trends, early product
          updates, and member-only offers — designed for modern agencies.
        </p>
      </div>

      {/* Form block */}
      <div className={styles['footer-newsletter-form-block']}>
        {status === "success" ? (
          <div className={styles['success-message']}>
            Thank you! Your submission has been received!
          </div>
        ) : (
          <form onSubmit={handleSubmit} aria-label="Newsletter subscription">
            <div className={styles['column-tiny-2']}>
              <label htmlFor="Email-Footer-Newsletter" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                name="Email-Footer-Newsletter"
                id="Email-Footer-Newsletter"
                placeholder="Enter your email"
                required
                aria-required="true"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles['text-field-small']}
              />
              <button
                type="submit"
                disabled={submitting}
                className={styles['button-secondary-small']}
              >
                {submitting ? "Please wait..." : "Get Started"}
              </button>
            </div>
            {status === "error" && (
              <div className={styles['error-message']} role="alert">
                Oops! Something went wrong while submitting the form.
              </div>
            )}
          </form>
        )}
      </div>

      {/* Privacy line */}
      <div className={styles['newsletter-btm-line']}>
        {/* Vector-24.svg intrinsic is 16×18; Webflow renders it bare. */}
        <Image
          src="/images/webflow/Vector-24.svg"
          alt=""
          aria-hidden="true"
          width={16}
          height={18}
          className={styles['shield-icon']}
        />
        <p className={styles['news-btm-para']}>
          100% privacy guaranteed. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}

// ─── Footer link columns ──────────────────────────────────────────────────────

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
  comingSoon?: boolean;
};

const footerLinks: Record<string, FooterLink[]> = {
  About: [
    { label: "Our Mission", href: "/our-mission" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Portfolio", href: "/our-works" },
    { label: "Pricing", href: "/pricing" },
  ],
  Services: [
    { label: "Web Development", href: "/services/website-development" },
    { label: "UI UX Design", href: "#", comingSoon: true },
    { label: "Graphics Design", href: "#", comingSoon: true },
  ],
  Resources: [
    { label: "Blog", href: "/blog" },
    { label: "Affiliate", href: "#", comingSoon: true },
    { label: "Careers", href: "/careers" },
  ],
  Help: [
    { label: "Contact us", href: "/contact" },
    { label: "Help center", href: "https://help.boldteq.com", external: true },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
};


function FooterLinkColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className={styles['column-x-large']}>
      <div className={styles['footer-title']}>{title}</div>
      <div className={styles['column-regular-2']}>
        {links.map((link) => {
          if (link.comingSoon) {
            /* Webflow: <div class="coming-soon-out">
                          <a class="footer-link disabled">Label</a>
                          <p class="coming-soon-badge">Coming Soon</p>
                        </div> */
            return (
              <div key={link.label} className={styles['coming-soon-out']}>
                <span className={`${styles['footer-link']} ${styles['disabled']}`}>
                  {link.label}
                </span>
                <span className={styles['coming-soon-badge']}>Coming Soon</span>
              </div>
            );
          }

          if (link.external) {
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles['footer-link']}
              >
                {link.label}
              </a>
            );
          }

          return (
            <Link
              key={link.label}
              href={link.href}
              className={styles['footer-link']}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── Social links data ────────────────────────────────────────────────────────

const socialLinks = [
  {
    icon: LinkedInIcon,
    href: SITE_CONFIG.social.linkedin,
    label: "Boldteq on LinkedIn",
  },
  {
    icon: InstagramIcon,
    href: SITE_CONFIG.social.instagram,
    label: "Boldteq on Instagram",
  },
  {
    icon: FacebookIcon,
    href: "https://www.facebook.com/people/Boldteq-Global-Pvt-Ltd/100070645008632/",
    label: "Boldteq on Facebook",
  },
];

// ─── Main Footer export ───────────────────────────────────────────────────────

export function Footer() {
  return (
    <footer className={styles['footer']} aria-label="Site footer">
      <div className={styles['container-large-6']}>
        <div className={styles['column-x-large']}>
          {/* Two-column grid: newsletter | right side */}
          <div className={styles['footer-grid']}>
            {/* Left: newsletter */}
            <div className={styles['footer-main']}>
              <FooterNewsletter />
            </div>

            {/* Right: logo + social + links */}
            <div className={styles['footer-right']}>
              {/* Logo + social row */}
              <div className={styles['footer-heading']}>
                <div className={styles['footer-column']}>
                  <Link href="/" aria-label="Boldteq — go to homepage" className={styles['footer-logo']}>
                    <Image
                      src="/images/webflow/f-new.svg"
                      alt="Boldteq logo"
                      width={170}
                      height={51}
                      className={styles['footer-logo-img']}
                    />
                  </Link>
                </div>

                {/* Social icons */}
                <div className={styles['row-regular']}>
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <SocialLink key={label} href={href} label={label}>
                      <Icon />
                    </SocialLink>
                  ))}
                </div>
              </div>

              {/* 4-column links grid */}
              <div className={styles['footer-links-grid']}>
                {Object.entries(footerLinks).map(([title, links]) => (
                  <FooterLinkColumn key={title} title={title} links={links} />
                ))}
              </div>
            </div>
          </div>

          {/* Legal / copyright */}
          <div className={styles['footer-legal-wrapper']}>
            <div className={styles['copyright-outer']}>
              <div className={styles['copyright-text']}>
                Designed with{" "}
                <span aria-label="love" role="img">❤️</span>
                {" "}from India
              </div>
              <Image
                src="/images/webflow/🇮🇳.svg"
                alt="Indian National flag icon"
                width={18}
                height={18}
                className={styles['indian-flag']}
                onError={() => undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
