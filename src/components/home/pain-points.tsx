import Image from 'next/image';
import styles from './pain-points.module.css';

const CARDS = [
  {
    title: 'Bottlenecked Delivery',
    description:
      "Your team is stretched thin. Projects move slower, timelines slip, and you're forced to turn down work you should be able to take on.",
    imageSrc: '/images/webflow/Group-46945.png',
    imageAlt: 'Project overview',
    imageWidth: 1492,
    imageHeight: 800,
    sizes: '(max-width: 1492px) 100vw, 1492px',
  },
  {
    title: 'Unreliable Outsourcing',
    description:
      'Freelancers and vendors deliver inconsistent quality, miss deadlines, or require constant follow-ups \u2014 putting your brand reputation and client trust at risk.',
    imageSrc: '/images/webflow/Group-46953.png',
    imageAlt: 'Unreliable outsourcing',
    imageWidth: 1492,
    imageHeight: 800,
    sizes: '(max-width: 1492px) 100vw, 1492px',
  },
  {
    title: 'High Hiring Costs',
    description:
      'Scaling through full-time hires means salaries, onboarding, tools, and long ramp-up times \u2014 all before you see real ROI.',
    imageSrc: '/images/webflow/Group-46951.png',
    imageAlt: 'High Hiring cost',
    imageWidth: 1492,
    imageHeight: 800,
    sizes: '(max-width: 1492px) 100vw, 1492px',
  },
] as const;

export function PainPoints() {
  return (
    <section
      className={`${styles['section-regular-3']} ${styles['slowing-sec']}`}
    >
      <div className={styles['container-large-3']}>
        <h2 className={`${styles['heading-2']} ${styles['margin-bottom-24px']}`}>
          What&apos;s Slowing Your Agency Down?
        </h2>
        <p className={`${styles['paragraph']} ${styles['center']}`}>
          Running an agency shouldn&apos;t feel like constant firefighting. Yet most growing agencies hit
          <br />
          the same roadblocks that quietly slow delivery, limit capacity, and hurt margins.
        </p>

        <div
          className={`${styles['feature-grid']} ${styles['margin-top-40px']} ${styles['agency-grid']}`}
        >
          {CARDS.map((card) => (
            <div
              key={card.title}
              className={styles['feature-card']}
            >
              <div className={`${styles['text-wrapper']} ${styles['featured-card-twrapper']}`}>
                <div className={`${styles['subheading-large']} ${styles['margin-bottom-5']}`}>
                  <strong>{card.title}</strong>
                </div>
                <p className={`${styles['paragraph-small-2']} ${styles['margin-bottom-20px']}`}>
                  {card.description}
                </p>
              </div>
              <Image
                src={card.imageSrc}
                loading="lazy"
                width={card.imageWidth}
                height={card.imageHeight}
                alt={card.imageAlt}
                sizes={card.sizes}
                className={`${styles['full-width-image']} ${styles['drop-shadow']}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
