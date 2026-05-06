import { Heading } from '@/components/primitives/heading/heading';
import { Badge } from '@/components/primitives/badge/badge';
import styles from './section-header.module.css';
import type { SectionHeaderProps } from './section-header.types';

export function SectionHeader({
  eyebrow,
  heading,
  subtitle,
  headingSize = 'h2',
  headingTone = 'default',
  align = 'center',
  className,
}: SectionHeaderProps) {
  const rootClass = [
    styles['root'],
    styles[`align-${align}`],
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const subtitleClass = [
    styles['subtitle'],
    headingTone === 'on-dark' ? styles['on-dark'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass}>
      {eyebrow ? (
        <div className={styles['eyebrowWrap']}>
          <Badge variant="sky-outline" size="md">
            {eyebrow}
          </Badge>
        </div>
      ) : null}

      <Heading size={headingSize} tone={headingTone} align={align}>
        {heading}
      </Heading>

      {subtitle ? (
        <p className={subtitleClass}>{subtitle}</p>
      ) : null}
    </div>
  );
}
