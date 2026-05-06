import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant =
  | 'primary'   // Webflow .btn-primary / .a-gulf-book — gradient + arrow icon
  | 'secondary' // Webflow .button-secondary-large — outlined navy
  | 'outline'   // Webflow .a-except-get — light cyan with border + arrow
  | 'sky'       // Webflow .sky-button — gradient pill, used inside cards
  | 'navy'      // Webflow .navy-button — solid navy
  | 'white'     // White bg + brand-blue text — for dark section CTAs (cta-banner secondary)
  | 'ghost';    // Plain text-only button (nav links)

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** When provided, button renders as a link (Next <Link> for internal, <a> for external/external=true) */
  href?: string;
  /** Force external link rendering with target=_blank + rel=noopener noreferrer */
  external?: boolean;
  /** Loading state — disables interaction, shows spinner */
  loading?: boolean;
  /** Stretch to 100% width of parent */
  fullWidth?: boolean;
  /** Optional icon node placed before label */
  iconLeft?: ReactNode;
  /** Optional icon node placed after label (overrides arrow icon on primary/outline) */
  iconRight?: ReactNode;
  /** Hide the built-in arrow icon on primary/outline variants */
  hideArrow?: boolean;
}

export type ButtonProps = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps | 'children'> & {
    children: ReactNode;
  };
