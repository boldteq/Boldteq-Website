import { forwardRef } from 'react';
import styles from './badge.module.css';
import type { BadgeProps, BadgeSize, BadgeVariant } from './badge.types';

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  'default': styles['default'],
  'success': styles['success'],
  'warning': styles['warning'],
  'sky-gradient': styles['sky-gradient'],
  'sky-outline': styles['sky-outline'],
  'navy-outline': styles['navy-outline'],
  'dot-red': styles['dot-red'],
};

const SIZE_CLASS: Record<BadgeSize, string> = {
  xs: styles['size-xs'],
  sm: styles['size-sm'],
  md: styles['size-md'],
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    variant = 'default',
    size = 'sm',
    iconLeft,
    dot = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const classes = [
    styles['badge'],
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span ref={ref} className={classes} {...rest}>
      {dot ? <span className={styles['dot']} aria-hidden="true" /> : null}
      {iconLeft ? <span className={styles['icon']}>{iconLeft}</span> : null}
      {children}
    </span>
  );
});
