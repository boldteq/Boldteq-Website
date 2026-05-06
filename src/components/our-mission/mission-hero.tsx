import Image from 'next/image';
import { Button } from '@/components/primitives/button';
import styles from './mission-hero.module.css';

const STAT_BADGES = [
  {
    icon: '/images/webflow/Layer_1-3.svg',
    label: 'White-Label by Default',
  },
  {
    icon: '/images/webflow/Layer_1-25.svg',
    label: 'Senior-Level Team',
  },
  {
    icon: '/images/webflow/Layer_1-22.svg',
    label: 'Structured Delivery',
  },
  {
    icon: '/images/webflow/Layer_1-24.svg',
    label: 'Agency-First Workflows',
  },
] as const;

export function MissionHero() {
  return (
    <section className={styles['section']}>
      <div className={styles['container']}>
        <div className={styles['inner']}>
          {/* Badge */}
          <div className={styles['badge']}>
            <span className={styles['badgeText']}>Our Mission</span>
          </div>

          {/* Heading */}
          <h1 className={styles['heading']}>
            The White-Label Delivery Partner Agencies Can Build On
          </h1>

          {/* Subtitle */}
          <p className={styles['subtitle']}>
            Boldteq operates as your behind-the-scenes production team—delivering
            senior-level design and development under your brand, with structure,
            speed, and reliability.
          </p>

          {/* Stat badges grid */}
          <div className={styles['badgeGridWrap']}>
            <div className={styles['badgeGrid']}>
              {STAT_BADGES.map((badge) => (
                <div key={badge.label} className={styles['statBadge']}>
                  <Image
                    src={badge.icon}
                    alt={badge.label}
                    width={24}
                    height={24}
                    className={styles['statIcon']}
                    loading="eager"
                  />
                  <span className={styles['statLabel']}>{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div className={styles['ctaRow']}>
            <Button href="/book-a-demo" variant="primary" size="md">
              Book a Demo
            </Button>
            <Button href="/contact" variant="secondary" size="md">
              Talk to Our Team
            </Button>
          </div>
        </div>

        {/* 2-column navy content grid */}
        <div className={styles['contentGrid']}>
          <div className={styles['contentCol']}>
            <h3 className={styles['contentHeading']}>
              To help digital agencies scale faster without hiring pressure or
              delivery chaos.
            </h3>
            <p className={styles['contentPara']}>
              Agencies don&apos;t struggle with ideas. They struggle when delivery
              becomes inconsistent as volume grows. Boldteq exists to remove that
              bottleneck—by providing a dependable backend team agencies can trust
              with execution.
            </p>
          </div>

          <div className={styles['contentCol']}>
            <h3 className={styles['contentHeading']}>Why We Built Boldteq</h3>
            <p className={styles['contentPara']}>
              As agencies grow, delivery complexity increases. Hiring slows
              momentum. Freelancers add inconsistency. Internal teams become hard
              to manage at scale.
            </p>
            <p className={styles['contentPara']}>
              As agencies grow, delivery complexity increases. Hiring slows
              momentum. Freelancers add inconsistency. Internal teams become hard
              to manage at scale.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
