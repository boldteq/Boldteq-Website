import Image from "next/image";
import { Button } from "@/components/primitives/button";
import styles from "./cta-banner.module.css";

/*
  Matches Webflow .blue-sec + .book-section.remove-pattern
  - Centered layout (default): used on blog, how-it-works, scope, testimonials
  - Left-aligned layout (align="left"): used on beta page with bullets
*/
export function CtaBanner({
  title = "Ready to Deliver This Level of Work Under Your Brand?",
  subtitle = "Partner with Boldteq as your dedicated backend delivery team and gain a reliable, scalable foundation for your technology initiatives.",
  primaryCta = { label: "Book a Demo", href: "/book-a-demo" },
  secondaryCta,
  bullets,
  align = "center",
}: {
  title?: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  bullets?: string[];
  align?: "center" | "left";
}) {
  const isLeft = align === "left";

  return (
    <section className={styles.ctaSection}>
      <div className={`${styles.ctaCard}${isLeft ? ` ${styles.ctaCardLeft}` : ""}`}>
        <div className={isLeft ? styles.ctaContent : styles.ctaContentCentered}>
          {/* Left variant: text column (Webflow .column-regular.column-left). */}
          <div className={isLeft ? styles.ctaContentMain : undefined}>
            <h2 className={styles.ctaHeading}>{title}</h2>

            {subtitle && (
              <p className={`${styles.ctaSubtitle}${isLeft ? ` ${styles.ctaSubtitleLeft}` : ""}`}>
                {subtitle}
              </p>
            )}

            {/* Bullet list (beta page) */}
            {bullets && bullets.length > 0 && (
              <div className={styles.ctaBullets}>
                {bullets.map((bullet) => (
                  <div key={bullet} className={styles.ctaBulletItem}>
                    <div className={styles.ctaBulletIcon}>
                      <Image
                        src="/images/webflow/Group-1.svg"
                        alt=""
                        aria-hidden="true"
                        width={14}
                        height={14}
                      />
                    </div>
                    <p className={styles.ctaBulletText}>{bullet}</p>
                  </div>
                ))}
              </div>
            )}

            <div className={`${styles.ctaActions}${isLeft ? ` ${styles.ctaActionsLeft}` : ""}`}>
              <Button href={primaryCta.href} variant="primary" size="md" hideArrow={isLeft}>
                {primaryCta.label}
              </Button>

              {secondaryCta && (
                <Button href={secondaryCta.href} variant="white" size="md">
                  {secondaryCta.label}
                </Button>
              )}
            </div>
          </div>

          {/* Left variant: empty right spacer column (Webflow .max-width-small.right). */}
          {isLeft && <div className={styles.ctaContentSpacer} aria-hidden="true" />}
        </div>
      </div>
    </section>
  );
}
