import { forwardRef } from 'react';
import type { ElementType, Ref } from 'react';
import styles from './cluster.module.css';
import type { ClusterProps } from './cluster.types';

export const Cluster = forwardRef<HTMLElement, ClusterProps>(function Cluster(
  {
    as,
    gap = '3',
    align = 'center',
    justify,
    wrap = true,
    className,
    children,
    ...rest
  },
  ref,
) {
  const Tag = (as ?? 'div') as ElementType;
  const classes = [
    styles['cluster'],
    !wrap ? styles['no-wrap'] : '',
    styles[`gap-${gap}`],
    align ? styles[`align-${align}`] : '',
    justify ? styles[`justify-${justify}`] : '',
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
