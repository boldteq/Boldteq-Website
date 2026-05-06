import { forwardRef } from 'react';
import type { ElementType, Ref } from 'react';
import styles from './heading.module.css';
import type {
  HeadingProps,
  HeadingSize,
  HeadingTone,
  HeadingAlign,
  HeadingLevel,
} from './heading.types';

const SIZE_CLASS: Record<HeadingSize, string> = {
  'eyebrow': styles['size-eyebrow'],
  'h4': styles['size-h4'],
  'h3': styles['size-h3'],
  'h2': styles['size-h2'],
  'h2-news': styles['size-h2-news'],
  'h1': styles['size-h1'],
  'display': styles['size-display'],
};

const TONE_CLASS: Record<HeadingTone, string> = {
  'default': styles['tone-default'],
  'on-dark': styles['tone-on-dark'],
  'gradient': styles['tone-gradient'],
  'muted': styles['tone-muted'],
};

const ALIGN_CLASS: Record<HeadingAlign, string> = {
  left: styles['align-left'],
  center: styles['align-center'],
  right: styles['align-right'],
};

const SIZE_TO_TAG: Record<HeadingSize, HeadingLevel> = {
  eyebrow: 'h6',
  h4: 'h4',
  h3: 'h3',
  h2: 'h2',
  'h2-news': 'h2',
  h1: 'h1',
  display: 'h1',
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  {
    as,
    size = 'h2',
    tone = 'default',
    align = 'left',
    className,
    children,
    ...rest
  },
  ref,
) {
  const Tag = (as ?? SIZE_TO_TAG[size]) as ElementType;
  const classes = [
    styles['heading'],
    SIZE_CLASS[size],
    TONE_CLASS[tone],
    ALIGN_CLASS[align],
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag ref={ref as Ref<HTMLHeadingElement>} className={classes} {...rest}>
      {children}
    </Tag>
  );
});
