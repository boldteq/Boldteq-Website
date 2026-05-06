import type { HTMLAttributes, ElementType, ReactNode } from 'react';
import type { ContainerSize } from '../container/container.types';

export type SectionTone = 'default' | 'muted' | 'navy' | 'gradient';
export type SectionPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  tone?: SectionTone;
  padding?: SectionPadding;
  /** Wrap children in a Container with this size. Pass `none` to skip the container. */
  containerSize?: ContainerSize | 'none';
  children: ReactNode;
}
