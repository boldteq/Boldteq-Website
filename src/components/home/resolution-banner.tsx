import Image from 'next/image';
import Link from 'next/link';
import styles from './resolution-banner.module.css';

export function ResolutionBanner() {
  return (
    <section className={styles['blue-card-sec']}>
      <div className={styles['container-large-3']}>
        <div className={styles['blue-card']}>
          {/* Inline image in text — matches Webflow image-in-text pattern */}
          <h3 className={styles['image-in-text']}>
            Boldteq removes these blockers by acting as your dedicated white-label backend team{' '}
            <Image
              src="/images/webflow/Group-47019-1.png"
              width={93}
              alt="Boldteq Team"
              height={40}
              style={{ width: '93px', height: 'auto' }}
              className={styles['inlineTeamImage']}
            />{' '}
            giving you instant capacity, consistent quality, and predictable delivery.
          </h3>

          {/* dark-bg CTA */}
          <Link
            href="/book-a-demo"
            className={`${styles['a-gulf-book']} ${styles['dark-bg']}`}
          >
            Schedule Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
