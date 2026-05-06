export interface LogoItem {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface LogoStripProps {
  logos: LogoItem[];
  label?: string;
  /** Enable CSS marquee scroll animation */
  animated?: boolean;
  className?: string;
}
