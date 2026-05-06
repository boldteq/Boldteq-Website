import type { HTMLAttributes, ElementType, ReactNode } from 'react';

export type ContainerSize = 'narrow' | 'default' | 'wide' | 'fluid';

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  size?: ContainerSize;
  /** Adds horizontal page padding (default true) */
  padding?: boolean;
  as?: ElementType;
  children: ReactNode;
}
