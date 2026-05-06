import Image from 'next/image';
import { Button } from '@/components/primitives/button';
import { Typewriter } from './typewriter';
import styles from './hero.module.css';

export function Hero() {
  return (
    <div className={styles['div-white-bag']}>
      <section
        className={`${styles['section-high-judge']} ${styles['home-ban-judge']}`}
      >
        <div className={styles['div-stuck-swept']}>
          <div className={styles['div-wrote-smoke']}>
            {/* Trustpilot badge */}
            <a
              aria-label="Open Trustpilot Reviews"
              href="https://www.trustpilot.com/review/boldteq.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles['review-link']}
            >
              <Image
                src="/images/webflow/Group-46731.svg"
                alt="Boldteq Trustpilot star rating"
                width={248}
                height={34}
                priority
                className={styles['review-stars']}
              />
            </a>

            {/* Animated h2 heading */}
            <h2 className={styles['p-base-place']}>
              Your Dedicated Team &mdash; <Typewriter />
              <br />
            </h2>

            {/* h1 */}
            <h1 className={styles['p-base-place-copy']}>
              One Subscription. Predictable Execution.
            </h1>

            {/* Descriptor paragraph */}
            <p className={styles['h1-season-seeing']}>
              Boldteq becomes the team behind your agency &mdash; delivering QA-backed
              work with live request tracking, so you scale without chaos.
            </p>

            {/* Trust badges grid — first div-job-attention (mob-left + mob-margin-less) */}
            <div
              className={`${styles['div-job-attention']} ${styles['mob-left']} ${styles['mob-margin-less']}`}
            >
              <div
                className={`${styles['ban-grid']} ${styles['margin-bottom-0']} ${styles['hom-ban-grd']}`}
              >
                {/* Badge 1 */}
                <div className={`${styles['grid-box']} ${styles['home-grid-box']} ${styles['order-mob-1']}`}>
                  <Image
                    src="/images/webflow/Layer_1.svg"
                    loading="eager"
                    alt="Satisfaction guarantee Icon"
                    width={24}
                    height={24}
                    className={styles['home-bangrid-icon']}
                  />
                  <p className={`${styles['grid-para']} ${styles['mob-center']} ${styles['lighter-font']}`}>
                    14 Days Satisfaction Guarantee
                  </p>
                </div>

                {/* Badge 2 */}
                <div className={`${styles['grid-box']} ${styles['home-grid-box']} ${styles['order-mob-2']}`}>
                  <Image
                    src="/images/webflow/Layer_1-45.svg"
                    loading="eager"
                    alt="No contract required icon"
                    width={24}
                    height={24}
                    style={{ width: 'auto', height: 'auto' }}
                    className={styles['home-bangrid-icon']}
                  />
                  <p className={`${styles['grid-para']} ${styles['middle']} ${styles['mob-center']} ${styles['lighter-font']}`}>
                    No Contract
                  </p>
                </div>

                {/* Badge 3 */}
                <div className={`${styles['grid-box']} ${styles['home-grid-box']} ${styles['order-mob-3']}`}>
                  <Image
                    src="/images/webflow/Layer_1-2.svg"
                    loading="eager"
                    alt="Service pause or Cancel icon"
                    width={24}
                    height={24}
                    style={{ width: 'auto', height: 'auto' }}
                    className={styles['home-bangrid-icon']}
                  />
                  <p className={`${styles['grid-para']} ${styles['mob-center']} ${styles['lighter-font']}`}>
                    Pause or Cancel Anytime
                  </p>
                </div>
              </div>
            </div>

            {/* GuideJar video embed */}
            <div className={`${styles['code-embed-3']} ${styles['how-code-embed']} ${styles['margin-top-50']}`}>
              <div className={styles['guidejarWrapper']}>
                <iframe
                  src="https://www.guidejar.com/embed/xvH9rRaAyggwH1eetyrl?type=1&controls=on"
                  width="100%"
                  height="100%"
                  className={styles['guidejarIframe']}
                  allowFullScreen
                  frameBorder="0"
                  loading="lazy"
                  title="Boldteq product demo"
                />
              </div>
            </div>

            {/* CTA buttons — second div-job-attention (mob-margin-less) */}
            <div className={`${styles['div-job-attention']} ${styles['mob-margin-less']}`}>
              <Button href="/book-a-demo" variant="primary" size="md">
                Schedule Demo
              </Button>
              <Button href="https://portal.boldteq.com/" variant="outline" size="md">
                14-Day Starter Trial
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className={styles['gradient-bg-ban']} />
    </div>
  );
}
