import { forwardRef } from 'react';
import type { ElementType, Ref } from 'react';
import styles from './stack.module.css';
import type { StackProps } from './stack.types';

export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
  { as, gap = '4', align, justify, className, children, ...rest },
  ref,
) {
  const Tag = (as ?? 'div') as ElementType;
  const classes = [
    styles['stack'],
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
