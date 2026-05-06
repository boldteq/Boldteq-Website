import { forwardRef } from 'react';
import type { ElementType, Ref } from 'react';
import styles from './section.module.css';
import { Container } from '../container/container';
import type {
  SectionProps,
  SectionTone,
  SectionPadding,
} from './section.types';

const TONE_CLASS: Record<SectionTone, string> = {
  default: styles['tone-default'],
  muted: styles['tone-muted'],
  navy: styles['tone-navy'],
  gradient: styles['tone-gradient'],
};

const PAD_CLASS: Record<SectionPadding, string> = {
  none: styles['pad-none'],
  sm: styles['pad-sm'],
  md: styles['pad-md'],
  lg: styles['pad-lg'],
  xl: styles['pad-xl'],
};

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  {
    as,
    tone = 'default',
    padding = 'lg',
    containerSize = 'default',
    className,
    children,
    ...rest
  },
  ref,
) {
  const Tag = (as ?? 'section') as ElementType;
  const classes = [
    styles['section'],
    TONE_CLASS[tone],
    PAD_CLASS[padding],
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag ref={ref as Ref<HTMLElement>} className={classes} {...rest}>
      {containerSize === 'none' ? (
        children
      ) : (
        <Container size={containerSize}>{children}</Container>
      )}
    </Tag>
  );
});
