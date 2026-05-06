import type { HTMLAttributes, ElementType, ReactNode } from 'react';

export type CardVariant =
  | 'elevated'         // White bg + shadow — default for feature/benefit cards
  | 'flat'             // White bg, no shadow — info cards on light pages
  | 'outlined'         // White bg + border, no shadow — pricing cards
  | 'gradient-bg'      // Gradient bg — beta CTA cards
  | 'navy-translucent'; // rgba(255,255,255,0.3) bg + cyan border — newsletter card

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  /** Adds hover lift transition — for interactive cards (links, buttons) */
  interactive?: boolean;
  /** Render as different element. Defaults to div. */
  as?: ElementType;
  children: ReactNode;
}

export interface CardSlotProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
