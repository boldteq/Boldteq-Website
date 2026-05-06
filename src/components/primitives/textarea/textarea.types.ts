import type { TextareaHTMLAttributes } from 'react';
import type { InputSize, InputTone } from '../input/input.types';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  inputSize?: InputSize;
  tone?: InputTone;
  invalid?: boolean;
}
