import { forwardRef } from 'react';
import type { ElementType, Ref } from 'react';
import styles from './grid.module.css';
import type { GridProps } from './grid.types';

export const Grid = forwardRef<HTMLElement, GridProps>(function Grid(
  {
    as,
    cols = 3,
    gap = '4',
    responsive = true,
    className,
    children,
    ...rest
  },
  ref,
) {
  const Tag = (as ?? 'div') as ElementType;
  const classes = [
    styles['grid'],
    styles[`cols-${cols}`],
    styles[`gap-${gap}`],
    responsive ? styles['responsive'] : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag ref={ref as Ref<HTMLElement>} className={classes} {...rest}>
      {children}
    </Tag>
  );
});
