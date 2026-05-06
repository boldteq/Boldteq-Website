import type { ReactNode } from 'react';

export interface StatRowItem {
  icon: ReactNode;
  label: string;
  value?: string;
}

export interface StatRowProps {
  items: StatRowItem[];
  className?: string;
}
