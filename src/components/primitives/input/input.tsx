import { forwardRef } from 'react';
import styles from './input.module.css';
import type { InputProps, InputSize, InputTone } from './input.types';

const SIZE_CLASS: Record<InputSize, string> = {
  sm: styles['size-sm'],
  md: styles['size-md'],
  lg: styles['size-lg'],
};

const TONE_CLASS: Record<InputTone, string> = {
  default: styles['tone-default'],
  'on-dark': styles['tone-on-dark'],
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { inputSize = 'md', tone = 'default', invalid = false, className, ...rest },
  ref,
) {
  const classes = [
    styles['input'],
    SIZE_CLASS[inputSize],
    TONE_CLASS[tone],
    invalid ? styles['invalid'] : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <input
      ref={ref}
      className={classes}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
});
