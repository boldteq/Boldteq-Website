export interface ComparisonRow {
  label: string;
  detail?: string;
}

export interface ComparisonTableProps {
  /** Left column — usually "the old way" */
  leftHeading: string;
  leftItems: ComparisonRow[];
  /** Right column — usually your product */
  rightHeading: string;
  rightItems: ComparisonRow[];
  /** Subtext beneath left column heading */
  leftSubtext?: string;
  rightSubtext?: string;
  className?: string;
}
