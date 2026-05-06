import { forwardRef } from 'react';
import styles from './textarea.module.css';
import type { TextareaProps } from './textarea.types';
import type { InputSize } from '../input/input.types';

const SIZE_CLASS: Record<InputSize, string> = {
  sm: styles['size-sm'],
  md: styles['size-md'],
  lg: styles['size-lg'],
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { inputSize = 'md', invalid = false, className, ...rest },
  ref,
) {
  const classes = [
    styles['textarea'],
    SIZE_CLASS[inputSize],
    invalid ? styles['invalid'] : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <textarea
      ref={ref}
      className={classes}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
});
