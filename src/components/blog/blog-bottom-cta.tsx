import Link from "next/link";
import { Button } from "@/components/primitives/button";
import styles from "./blog-bottom-cta.module.css";

export function BlogBottomCta() {
  return (
    <section className={styles['section']}>
      <div className={styles['inner']}>
        <div className={styles['body']}>
          <div className={styles['header']}>
            <h2 className={styles['heading']}>
              Struggling To Manage Delivery as Your Agency Grows
            </h2>
            <p className={styles['subtitle']}>
              See how a white-label partner can help you scale.
            </p>

            <div className={styles['btnRow']}>
              <Button href="/how-it-works" variant="primary" size="md">
                View How It Works
              </Button>
              <Button href="/book-a-demo" variant="navy" size="md">
                Book a Demo
              </Button>
            </div>
          </div>

          <div className={styles['grid']}>
            <div className={styles['card']}>
              <div>
                <h3 className={styles['cardHeading']}>
                  White-Label &amp; Outsourcing
                </h3>
                <p className={styles['cardPara']}>
                  Understanding white-label delivery models, outsourcing
                  strategies, and how agencies scale execution while protecting
                  client relationships and quality.
                </p>
                <Link href="/blog" className={styles['cardBtn']}>
                  View Articles
                </Link>
              </div>
            </div>

            <div className={styles['card']}>
              <div>
                <h3 className={styles['cardHeading']}>
                  Agency Growth &amp; Operations
                </h3>
                <p className={styles['cardPara']}>
                  Strategies, systems, and operational insights that help
                  agencies grow sustainably while maintaining delivery quality
                  and control.
                </p>
                <Link href="/blog" className={styles['cardBtn']}>
                  View Articles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
