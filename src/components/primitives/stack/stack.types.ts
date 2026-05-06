import type { HTMLAttributes, ElementType, ReactNode } from 'react';

export type StackGap =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '8'
  | '10'
  | '12'
  | '16';

export type StackAlign = 'start' | 'center' | 'end' | 'stretch';
export type StackJustify = 'start' | 'center' | 'between' | 'end';

export interface StackProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  children: ReactNode;
}
