import { forwardRef } from 'react';
import Link from 'next/link';
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import styles from './button.module.css';
import type { ButtonProps, ButtonVariant, ButtonSize } from './button.types';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: styles['primary'],
  secondary: styles['secondary'],
  outline: styles['outline'],
  sky: styles['sky'],
  navy: styles['navy'],
  white: styles['white'],
  ghost: styles['ghost'],
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: styles['size-sm'],
  md: styles['size-md'],
  lg: styles['size-lg'],
};

function buildClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  noArrow: boolean,
  extra?: string,
) {
  return [
    styles['button'],
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    fullWidth ? styles['full-width'] : '',
    noArrow ? styles['no-arrow'] : '',
    extra ?? '',
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * Button — token-driven primitive.
 *
 * Replaces hand-rolled `.btn-primary`, `.button-secondary-large`,
 * `.a-gulf-book`, `.a-except-get`, `.sky-button`, `.navy-button` styles
 * scattered across components. Polymorphic — renders <Link>, <a>, or <button>
 * based on `href` + `external` props.
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      href,
      external,
      loading = false,
      fullWidth = false,
      iconLeft,
      iconRight,
      hideArrow = false,
      className,
      children,
      disabled,
      type,
      ...rest
    },
    ref,
  ) {
    const noArrow = hideArrow || Boolean(iconRight);

    const content: ReactNode = loading ? (
      <span className={styles['spinner']} aria-hidden="true" />
    ) : (
      <>
        {iconLeft ? <span className={styles['icon-left']}>{iconLeft}</span> : null}
        <span>{children}</span>
        {iconRight ? <span className={styles['icon-right']}>{iconRight}</span> : null}
      </>
    );

    const classes = buildClassName(variant, size, fullWidth, noArrow, className);

    if (href) {
      const isExternal = external || /^https?:\/\//.test(href);
      const anchorProps: AnchorHTMLAttributes<HTMLAnchorElement> = {
        ...(rest as unknown as AnchorHTMLAttributes<HTMLAnchorElement>),
        className: classes,
        'aria-disabled': disabled || loading || undefined,
      };

      if (isExternal) {
        return (
          <a
            {...anchorProps}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            ref={ref as React.Ref<HTMLAnchorElement>}
          >
            {content}
          </a>
        );
      }

      return (
        <Link
          {...anchorProps}
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type ?? 'button'}
        className={classes}
        disabled={disabled || loading}
      >
        {content}
      </button>
    );
  },
);
