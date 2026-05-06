import type { InputHTMLAttributes } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputTone = 'default' | 'on-dark';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  inputSize?: InputSize;
  tone?: InputTone;
  invalid?: boolean;
}
