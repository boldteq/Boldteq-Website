import type { ReactNode, ReactElement } from 'react';

export interface FieldProps {
  label: string;
  /** Helper text shown below control when no error present. */
  helper?: string;
  /** Error text — when present, control is marked invalid. */
  error?: string;
  required?: boolean;
  /** Manually control id (auto-generated if omitted). */
  htmlFor?: string;
  /** Optional className for outer wrapper. */
  className?: string;
  /** The single form control (Input, Textarea, Select, etc.). */
  children: ReactElement<{
    id?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
    invalid?: boolean;
    required?: boolean;
  }>;
  /** Optional content rendered below the label, before the control. */
  beforeControl?: ReactNode;
}
