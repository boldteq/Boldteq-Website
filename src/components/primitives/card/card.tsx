import { forwardRef } from 'react';
import type { ElementType, Ref } from 'react';
import styles from './card.module.css';
import type { CardProps, CardSlotProps, CardVariant, CardPadding } from './card.types';

const VARIANT_CLASS: Record<CardVariant, string> = {
  'elevated': styles['elevated'],
  'flat': styles['flat'],
  'outlined': styles['outlined'],
  'gradient-bg': styles['gradient-bg'],
  'navy-translucent': styles['navy-translucent'],
};

const PADDING_CLASS: Record<CardPadding, string> = {
  none: styles['padding-none'],
  sm: styles['padding-sm'],
  md: styles['padding-md'],
  lg: styles['padding-lg'],
};

const CardRoot = forwardRef<HTMLElement, CardProps>(function CardRoot(
  {
    variant = 'elevated',
    padding = 'md',
    interactive = false,
    as,
    className,
    children,
    ...rest
  },
  ref,
) {
  const Tag = (as ?? 'div') as ElementType;
  const classes = [
    styles['card'],
    VARIANT_CLASS[variant],
    PADDING_CLASS[padding],
    interactive ? styles['interactive'] : '',
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

function CardHeader({ className, children, ...rest }: CardSlotProps) {
  return (
    <div className={[styles['header'], className ?? ''].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}

function CardMedia({ className, children, ...rest }: CardSlotProps) {
  return (
    <div className={[styles['media'], className ?? ''].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}

function CardBody({ className, children, ...rest }: CardSlotProps) {
  return (
    <div className={[styles['body'], className ?? ''].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}

function CardFooter({ className, children, ...rest }: CardSlotProps) {
  return (
    <div className={[styles['footer'], className ?? ''].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Media: CardMedia,
  Body: CardBody,
  Footer: CardFooter,
});
