import Image from 'next/image';
import styles from './logo-strip.module.css';
import type { LogoStripProps } from './logo-strip.types';

export function LogoStrip({ logos, label, animated = false, className }: LogoStripProps) {
  const trackClass = [
    styles['track'],
    animated ? styles['animated'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  // Duplicate logos for seamless infinite scroll when animated
  const displayLogos = animated ? [...logos, ...logos] : logos;

  return (
    <div className={[styles['root'], className ?? ''].filter(Boolean).join(' ')}>
      {label ? <p className={styles['label']}>{label}</p> : null}
      <div className={trackClass} aria-hidden={animated}>
        {displayLogos.map((logo, i) => (
          <div key={i} className={styles['logoItem']}>
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width ?? 120}
              height={logo.height ?? 28}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
