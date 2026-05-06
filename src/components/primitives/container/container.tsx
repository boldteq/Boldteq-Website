import { forwardRef } from 'react';
import type { ElementType, Ref } from 'react';
import styles from './container.module.css';
import type { ContainerProps, ContainerSize } from './container.types';

const SIZE_CLASS: Record<ContainerSize, string> = {
  narrow: styles['size-narrow'],
  default: styles['size-default'],
  wide: styles['size-wide'],
  fluid: styles['size-fluid'],
};

export const Container = forwardRef<HTMLElement, ContainerProps>(function Container(
  { size = 'default', padding = true, as, className, children, ...rest },
  ref,
) {
  const Tag = (as ?? 'div') as ElementType;
  const classes = [
    styles['container'],
    SIZE_CLASS[size],
    padding ? styles['padded'] : '',
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
