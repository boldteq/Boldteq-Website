import type { HTMLAttributes, ElementType, ReactNode } from 'react';

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeadingSize =
  | 'eyebrow'
  | 'h4'
  | 'h3'
  | 'h2'
  | 'h2-news'
  | 'h1'
  | 'display';
export type HeadingTone = 'default' | 'on-dark' | 'gradient' | 'muted';
export type HeadingAlign = 'left' | 'center' | 'right';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Semantic tag (h1..h6). Defaults map from `size`. */
  as?: HeadingLevel | ElementType;
  size?: HeadingSize;
  tone?: HeadingTone;
  align?: HeadingAlign;
  children: ReactNode;
}
