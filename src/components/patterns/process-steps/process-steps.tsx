import Image from 'next/image';
import styles from './process-steps.module.css';
import type { ProcessStepsProps } from './process-steps.types';

export function ProcessSteps({
  steps,
  layout = 'numbered',
  className,
}: ProcessStepsProps) {
  const wrapClass = [
    styles[layout],
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  if (layout === 'screenshot') {
    return (
      <div className={wrapClass}>
        {steps.map((step, i) => (
          <div key={i} className={styles['step-screenshot']}>
            <div className={styles['stepHeader']}>
              <span className={styles['numberBadge']}>{step.number ?? i + 1}</span>
              <h3 className={styles['stepTitle']}>{step.title}</h3>
            </div>
            <p className={styles['stepDesc']}>{step.description}</p>
            {step.imageSrc ? (
              <div className={styles['stepImage']}>
                <Image
                  src={step.imageSrc}
                  alt={step.imageAlt ?? step.title}
                  width={step.imageWidth ?? 800}
                  height={step.imageHeight ?? 500}
                  style={{ width: '100%', height: 'auto' }}
                  loading="lazy"
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={wrapClass}>
      {steps.map((step, i) => (
        <div key={i} className={styles['step-numbered']}>
          <span className={styles['numberBadge']}>{step.number ?? i + 1}</span>
          <div>
            <h3 className={styles['stepTitle']}>{step.title}</h3>
            <p className={styles['stepDesc']}>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
