export interface ProcessStep {
  /** Step number — auto-assigned if omitted */
  number?: number;
  title: string;
  description: string;
  /** Optional screenshot/image */
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
}

export type ProcessStepsLayout = 'numbered' | 'screenshot';

export interface ProcessStepsProps {
  steps: ProcessStep[];
  layout?: ProcessStepsLayout;
  className?: string;
}
