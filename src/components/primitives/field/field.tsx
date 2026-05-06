import { cloneElement, useId } from 'react';
import styles from './field.module.css';
import type { FieldProps } from './field.types';

/**
 * Field — accessible label + control wrapper.
 *
 * - Auto-generates an id if the child control doesn't have one.
 * - Wires `aria-describedby` to helper or error text.
 * - Marks control invalid when `error` is provided.
 * - Forwards `required` to control + appends visual asterisk.
 */
export function Field({
  label,
  helper,
  error,
  required = false,
  htmlFor,
  className,
  children,
  beforeControl,
}: FieldProps) {
  const generatedId = useId();
  const childId = children.props.id ?? htmlFor ?? generatedId;
  const helperId = `${childId}-helper`;
  const errorId = `${childId}-error`;

  const describedBy = [
    error ? errorId : null,
    !error && helper ? helperId : null,
    children.props['aria-describedby'] ?? null,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  const control = cloneElement(children, {
    id: childId,
    'aria-describedby': describedBy,
    'aria-invalid': error ? true : children.props['aria-invalid'],
    invalid: error ? true : children.props.invalid,
    required: required || children.props.required,
  });

  return (
    <div className={[styles['field'], className ?? ''].filter(Boolean).join(' ')}>
      <label htmlFor={childId} className={styles['label']}>
        {label}
        {required ? (
          <span className={styles['required']} aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {beforeControl}
      {control}
      {error ? (
        <p id={errorId} className={styles['error']} role="alert">
          {error}
        </p>
      ) : helper ? (
        <p id={helperId} className={styles['helper']}>
          {helper}
        </p>
      ) : null}
    </div>
  );
}
