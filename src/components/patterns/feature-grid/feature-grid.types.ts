import type { ReactNode } from 'react';

export interface FeatureItem {
  /** Short title */
  title: string;
  description?: string;
  /** Optional image src */
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  /** Optional icon node (rendered in IconBox square-tint) */
  icon?: ReactNode;
  /** Optional CTA */
  href?: string;
  hrefLabel?: string;
}

export type FeatureGridCols = 2 | 3 | 4;
export type FeatureGridVariant = 'card' | 'minimal' | 'horizontal';

export interface FeatureGridProps {
  items: FeatureItem[];
  cols?: FeatureGridCols;
  variant?: FeatureGridVariant;
  className?: string;
}
