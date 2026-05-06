import styles from './comparison-table.module.css';
import type { ComparisonTableProps } from './comparison-table.types';

export function ComparisonTable({
  leftHeading,
  leftItems,
  rightHeading,
  rightItems,
  leftSubtext,
  rightSubtext,
  className,
}: ComparisonTableProps) {
  return (
    <div className={[styles['grid'], className ?? ''].filter(Boolean).join(' ')}>
      {/* Left col */}
      <div className={`${styles['col']} ${styles['col-left']}`}>
        <div className={styles['colHead']}>
          <h3 className={styles['colHeading']}>{leftHeading}</h3>
          {leftSubtext ? <p className={styles['colSubtext']}>{leftSubtext}</p> : null}
        </div>
        <div className={styles['items']}>
          {leftItems.map((item, i) => (
            <div key={i} className={styles['item']}>
              <p className={styles['itemLabel']}>{item.label}</p>
              {item.detail ? <p className={styles['itemDetail']}>{item.detail}</p> : null}
            </div>
          ))}
        </div>
      </div>

      {/* Right col */}
      <div className={`${styles['col']} ${styles['col-right']}`}>
        <div className={styles['colHead']}>
          <h3 className={styles['colHeading']}>{rightHeading}</h3>
          {rightSubtext ? <p className={styles['colSubtext']}>{rightSubtext}</p> : null}
        </div>
        <div className={styles['items']}>
          {rightItems.map((item, i) => (
            <div key={i} className={styles['item']}>
              <p className={styles['itemLabel']}>{item.label}</p>
              {item.detail ? <p className={styles['itemDetail']}>{item.detail}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
