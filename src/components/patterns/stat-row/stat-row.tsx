import { Stat } from '@/components/primitives/stat/stat';
import styles from './stat-row.module.css';
import type { StatRowProps } from './stat-row.types';

export function StatRow({ items, className }: StatRowProps) {
  const rowClass = [styles['row'], className ?? ''].filter(Boolean).join(' ');

  return (
    <div className={rowClass}>
      {items.map((item, i) => (
        <Stat
          key={i}
          variant="card"
          size="md"
          label={item.label}
          value={item.value}
          icon={item.icon}
        />
      ))}
    </div>
  );
}
