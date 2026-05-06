import type { ReactNode } from 'react';
import type { HeadingSize, HeadingTone, HeadingAlign } from '@/components/primitives/heading/heading.types';

export interface SectionHeaderProps {
  /** Optional small eyebrow text above the heading (rendered inside a cyan badge pill) */
  eyebrow?: ReactNode;
  /** Main heading — required */
  heading: ReactNode;
  /** Optional subtitle paragraph below heading */
  subtitle?: ReactNode;
  headingSize?: HeadingSize;
  headingTone?: HeadingTone;
  align?: HeadingAlign;
  /** Extra className on root wrapper */
  className?: string;
}
