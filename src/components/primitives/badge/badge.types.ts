import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeVariant =
  | 'default'        // Light blue bg, blue text — Webflow .header-comingsoon-badge
  | 'success'        // Green bg, green text
  | 'warning'        // Amber bg, amber text
  | 'sky-gradient'   // Gradient bg, white text — beta "Exclusive Access" pill
  | 'sky-outline'    // Cyan border, cyan text on dark — "Join 500+ Subscribers"
  | 'navy-outline'   // Navy border, navy text — Trustpilot pill
  | 'dot-red';       // Red dot prefix + text — urgency "live" indicator

export type BadgeSize = 'xs' | 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  iconLeft?: ReactNode;
  /** Render a pulsing dot prefix — used by dot-red urgency variant */
  dot?: boolean;
}
