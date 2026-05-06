import type { HTMLAttributes, ReactNode } from 'react';

export type StatVariant =
  | 'card'        // White card with shadow + icon-left + label — hero trust badges
  | 'inline'      // Icon + value + label inline, no card chrome — careers benchmarks
  | 'gradient';   // Gradient bg card — featured stats

export type StatSize = 'sm' | 'md' | 'lg';

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  variant?: StatVariant;
  size?: StatSize;
  /** Optional value above label (e.g. "75%", "12hrs") */
  value?: ReactNode;
  /** Required label text */
  label: ReactNode;
  /** Optional icon node (rendered in IconBox or raw, depending on variant) */
  icon?: ReactNode;
}
