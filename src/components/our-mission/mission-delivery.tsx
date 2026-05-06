import Image from 'next/image';
import { Button } from '@/components/primitives/button';
import styles from './mission-delivery.module.css';

const BULLET_POINTS = [
  {
    intro: 'Dedicated delivery team aligned to your plan:',
    detail:
      'A consistent team that understands your workflows, priorities, and quality standards.',
  },
  {
    intro: 'Structured task intake via Many Requests:',
    detail:
      'Clear scope, organized queues, and full visibility into active and upcoming work.',
  },
  {
    intro: 'Slack-based communication for alignment:',
    detail:
      'Direct, real-time coordination to avoid delays, misinterpretation, or rework.',
  },
  {
    intro: 'White-label–ready handoff for client delivery:',
    detail:
      'All outputs prepared for immediate client sharing under your branding.',
  },
  {
    intro: 'Internal QA and review before completion:',
    detail:
      'Every deliverable is reviewed internally before it reaches your team.',
  },
] as const;

export function MissionDelivery() {
  return (
    <section className={styles['section']}>
      <div className={styles['container']}>
        <div className={styles['grid']}>
          {/* Left: text */}
          <div className={styles['textCol']}>
            <h2 className={styles['heading']}>
              How We Deliver On The Mission
            </h2>

            <ul className={styles['list']}>
              {BULLET_POINTS.map((point) => (
                <li key={point.intro} className={styles['listItem']}>
                  <div className={styles['bullet']} aria-hidden="true" />
                  <p className={styles['listText']}>
                    <strong className={styles['listIntro']}>{point.intro}</strong>
                    {' '}{point.detail}
                  </p>
                </li>
              ))}
            </ul>

            <Button href="/book-a-demo" variant="primary" size="md">
              Book a Demo
            </Button>
          </div>

          {/* Right: image */}
          <div className={styles['imageCol']}>
            <Image
              src="/images/webflow/Group-47036-1.png"
              alt="Boldteq delivery workflow overview"
              width={1600}
              height={1200}
              className={styles['image']}
              loading="lazy"
              sizes="(max-width: 767px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
