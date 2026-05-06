export interface FaqItem {
  question: string;
  answer: string;
  linkHref?: string;
  linkLabel?: string;
}

export interface FaqAccordionProps {
  items: FaqItem[];
  /** Layout variant. 'single' = single column. 'double' = 2-col grid at ≥1280px */
  layout?: 'single' | 'double';
  className?: string;
}
