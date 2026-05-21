import Image from 'next/image';
import styles from './featured-logos.module.css';

const LOGOS = [
  {
    src: '/images/webflow/68ef9013b2a3f77a6fe65a0d_image-234.svg',
    alt: 'Forbes logo',
    width: 100,
    height: 32,
  },
  {
    src: '/images/webflow/68ef9013ae41bcbd0914ef6a_image-235.svg',
    alt: 'Entrepreneur logo',
    width: 140,
    height: 32,
  },
  {
    src: '/images/webflow/68ef90122cc026bc542ca992_image-236.svg',
    alt: 'Inc. logo',
    width: 60,
    height: 32,
  },
  {
    src: '/images/webflow/68ef90124d939b1501f73e75_image-237.svg',
    alt: 'The Washington Post logo',
    width: 180,
    height: 32,
  },
  {
    src: '/images/webflow/68ef901324f4b0506dab4aa7_image-239.svg',
    alt: 'Philadelphia Inquirer logo',
    width: 130,
    height: 32,
  },
  {
    src: '/images/webflow/68ef90139f3536c7615bc0d3_image-240.svg',
    alt: 'Technically logo',
    width: 120,
    height: 32,
  },
] as const;

// Duplicated for seamless infinite scroll
const ALL_LOGOS = [...LOGOS, ...LOGOS];

export function FeaturedLogos() {
  return (
    <section
      className={`${styles['section-regular']} ${styles['no-padding-mob']} ${styles['logo-mob']}`}
      aria-label="Featured in"
    >
      {/* "Featured in:" label */}
      <div className={styles['logo-3-title']}>
        <p className={`${styles['paragraph-x-large']} ${styles['text-color-secondary']}`}>
          Featured in:
        </p>
      </div>

      {/* Infinite scroll carousel — aria-hidden because it's decorative logos */}
      <div className={styles['logo-3-carousel']} aria-hidden="true">
        <div
          className={`${styles['logo-3-content']} ${styles['logo-3-scroll-content']} logo-3-scroll-track`}
        >
          {ALL_LOGOS.map((logo, i) => (
            <div key={i} className={styles['logo-3-block']}>
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                loading="lazy"
                className={styles['logo-3-icon']}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        /* Marquee timing matches Webflow fb-carousel-speed="60000" (60s) */
        .logo-3-scroll-track {
          animation: logo-scroll 60s linear infinite;
        }
        @keyframes logo-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .logo-3-scroll-track {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
