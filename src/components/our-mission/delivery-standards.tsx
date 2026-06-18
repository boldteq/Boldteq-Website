import Image from 'next/image';
import styles from './delivery-standards.module.css';

const CARDS = [
  {
    icon: '/images/webflow/Layer_1-35.svg',
    title: 'Consistency',
    description:
      'Repeatable delivery systems ensure stable quality across every project. Work remains consistent even as request volume increases.',
    w: 47,
    h: 46,
  },
  {
    icon: '/images/webflow/Layer_1-34.svg',
    title: 'Speed With Control',
    description:
      'Fast turnaround backed by structure, communication, and internal review. Delivery moves quickly without sacrificing oversight or quality.',
    w: 44,
    h: 46,
  },
  {
    icon: '/images/webflow/Layer_1-35.svg',
    title: 'Senior-Level Output',
    description:
      'Work executed by experienced professionals who understand agency expectations. No juniors, no trial-and-error execution.',
    w: 47,
    h: 46,
  },
  {
    icon: '/images/webflow/Layer_1-32.svg',
    title: 'White-Label by Default',
    description:
      'Your brand stays front-facing at all times. Boldteq remains fully invisible within your client workflows.',
    w: 45,
    h: 45,
  },
] as const;

export function DeliveryStandards() {
  return (
    <section className={styles['section']}>
      <div className={styles['container']}>
        {/* Header */}
        <div className={styles['header']}>
          <div className={styles['priceSubheadOut']}>
            <div className={styles['badge']}>
              <span className={styles['badgeText']}>Our Standard</span>
            </div>
          </div>
          <h2 className={styles['heading']}>Our Delivery Standard</h2>
          <p className={styles['subtitle']}>
            Boldteq operates as a backend delivery system for agencies — built
            around consistency, control, and senior-level execution. Every
            project follows structured workflows designed to protect quality as
            you scale.
          </p>
        </div>

        {/* Cards grid */}
        <div className={styles['standardsGrid']}>
          {CARDS.map((card) => (
            <div key={card.title} className={styles['card']}>
              <Image
                src={card.icon}
                alt={card.title}
                width={card.w}
                height={card.h}
                className={styles['cardIcon']}
                loading="lazy"
              />
              <h3 className={styles['cardTitle']}>{card.title}</h3>
              <p className={styles['cardDesc']}>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
