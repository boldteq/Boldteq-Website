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

function ArrowIcon() {
  return (
    <svg
      className={styles['arrow']}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
        fill="currentColor"
      />
    </svg>
  );
}

function buildClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  extra?: string,
) {
  return [
    styles['button'],
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    fullWidth ? styles['full-width'] : '',
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
    const showArrow =
      !hideArrow &&
      !iconRight &&
      (variant === 'primary' || variant === 'outline' || variant === 'white' || variant === 'navy');

    const content: ReactNode = loading ? (
      <span className={styles['spinner']} aria-hidden="true" />
    ) : (
      <>
        {iconLeft ? <span className={styles['icon-left']}>{iconLeft}</span> : null}
        <span>{children}</span>
        {iconRight ? <span className={styles['icon-right']}>{iconRight}</span> : null}
        {showArrow ? <ArrowIcon /> : null}
      </>
    );

    const classes = buildClassName(variant, size, fullWidth, className);

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
