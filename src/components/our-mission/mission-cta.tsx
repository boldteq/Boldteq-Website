import Image from 'next/image';
import { Button } from '@/components/primitives/button';
import styles from './mission-cta.module.css';

const BULLETS = [
  'Agencies with fluctuating demand',
  'Large monthly task volumes',
  'Multiple brands or clients',
] as const;

export function MissionCta() {
  return (
    <section className={styles['section']}>
      <div className={styles['container']}>
        <div className={styles['card']}>
          <div className={styles['grid']}>
            <div className={styles['contentCol']}>
              <h2 className={styles['heading']}>
                Ready to Deliver This Level of Work Under Your Brand?
              </h2>

              <p className={styles['subtitle']}>
                Partner with Boldteq as your dedicated backend delivery team and
                gain a reliable, scalable foundation for your technology
                initiatives.
              </p>

              <div className={styles['bullets']}>
                {BULLETS.map((bullet) => (
                  <div key={bullet} className={styles['bulletItem']}>
                    <div className={styles['bulletIcon']}>
                      <Image
                        src="/images/webflow/blue-tick.svg"
                        alt="Tick mark symbol"
                        width={14}
                        height={10}
                      />
                    </div>
                    <p className={styles['bulletText']}>{bullet}</p>
                  </div>
                ))}
              </div>

              <div className={styles['actions']}>
                <Button href="/book-a-demo" variant="primary" size="md">
                  Book a Demo
                </Button>
                <Button href="/pricing" variant="white" size="md">
                  View Plans
                </Button>
              </div>
            </div>

            {/* Empty .25fr column — reserves space for the Union.svg pattern */}
            <div className={styles['rightCol']} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
