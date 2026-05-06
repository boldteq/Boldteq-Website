import type { HTMLAttributes, ReactNode } from 'react';

export type IconBoxVariant =
  | 'square-gradient'  // Solid gradient square — primary CTAs
  | 'square-tint'      // Cyan tint square — feature card icons
  | 'circle-gradient'  // Gradient pill — round nav buttons
  | 'circle-tint'      // Tint pill — soft accent buttons
  | 'circle-white'     // White circle on dark — beta/footer accents
  | 'pill-cyan';       // Cyan border + cyan fg — nav arrow indicators

export type IconBoxSize = 'sm' | 'md' | 'lg';

export interface IconBoxProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: IconBoxVariant;
  size?: IconBoxSize;
  children: ReactNode;
}
