import { forwardRef } from 'react';
import styles from './stat.module.css';
import type { StatProps, StatSize, StatVariant } from './stat.types';

const VARIANT_CLASS: Record<StatVariant, string> = {
  card: styles['card'],
  inline: styles['inline'],
  gradient: styles['gradient'],
};

const SIZE_CLASS: Record<StatSize, string> = {
  sm: styles['size-sm'],
  md: styles['size-md'],
  lg: styles['size-lg'],
};

export const Stat = forwardRef<HTMLDivElement, StatProps>(function Stat(
  {
    variant = 'card',
    size = 'md',
    value,
    label,
    icon,
    className,
    ...rest
  },
  ref,
) {
  const classes = [
    styles['stat'],
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} className={classes} {...rest}>
      {icon ? <span className={styles['icon']}>{icon}</span> : null}
      <div className={styles['body']}>
        {value ? <span className={styles['value']}>{value}</span> : null}
        <p className={styles['label']}>{label}</p>
      </div>
    </div>
  );
});
