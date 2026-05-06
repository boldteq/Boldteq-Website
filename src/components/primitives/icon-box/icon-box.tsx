import { forwardRef } from 'react';
import styles from './icon-box.module.css';
import type { IconBoxProps, IconBoxSize, IconBoxVariant } from './icon-box.types';

const VARIANT_CLASS: Record<IconBoxVariant, string> = {
  'square-gradient': styles['square-gradient'],
  'square-tint': styles['square-tint'],
  'circle-gradient': styles['circle-gradient'],
  'circle-tint': styles['circle-tint'],
  'circle-white': styles['circle-white'],
  'pill-cyan': styles['pill-cyan'],
};

const SIZE_CLASS: Record<IconBoxSize, string> = {
  sm: styles['size-sm'],
  md: styles['size-md'],
  lg: styles['size-lg'],
};

export const IconBox = forwardRef<HTMLSpanElement, IconBoxProps>(function IconBox(
  { variant = 'square-tint', size = 'md', className, children, ...rest },
  ref,
) {
  const classes = [
    styles['icon-box'],
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span ref={ref} className={classes} {...rest}>
      {children}
    </span>
  );
});
