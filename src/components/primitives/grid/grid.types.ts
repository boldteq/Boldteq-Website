import type { HTMLAttributes, ElementType, ReactNode } from 'react';
import type { StackGap } from '../stack/stack.types';

export type GridCols = 1 | 2 | 3 | 4 | 6 | 12;

export interface GridProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  cols?: GridCols;
  gap?: StackGap;
  /** Collapse to single column under 767px (default true) */
  responsive?: boolean;
  children: ReactNode;
}
