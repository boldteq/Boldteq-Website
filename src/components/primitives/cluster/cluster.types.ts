import type { HTMLAttributes, ElementType, ReactNode } from 'react';
import type { StackGap, StackAlign, StackJustify } from '../stack/stack.types';

export interface ClusterProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  /** Allow children to wrap onto next line (default true) */
  wrap?: boolean;
  children: ReactNode;
}
