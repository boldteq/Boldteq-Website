'use client';

import { useState } from 'react';
import { Field } from '@/components/primitives/field/field';
import { Input } from '@/components/primitives/input/input';
import { Textarea } from '@/components/primitives/textarea/textarea';
import { Button } from '@/components/primitives/button/button';
import styles from './contact-form.module.css';
import type { ContactFormProps, ContactFormField } from './contact-form.types';

type FieldErrors = Record<string, string>;
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

function FormControl({
  field,
  value,
  error,
  onChange,
  onBlur,
}: {
  field: ContactFormField;
  value: string;
  error?: string;
  onChange: (name: string, value: string) => void;
  onBlur: (name: string, value: string) => void;
}) {
  const invalid = !!error;

  if (field.type === 'textarea') {
    return (
      <Field label={field.label} error={error} required={field.required}>
        <Textarea
          name={field.name}
          placeholder={field.placeholder}
          required={field.required}
          invalid={invalid}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
          onBlur={(e) => onBlur(field.name, e.target.value)}
          inputSize="md"
        />
      </Field>
    );
  }

  if (field.type === 'select') {
    return (
      <Field label={field.label} error={error} required={field.required}>
        <select
          name={field.name}
          required={field.required}
          value={value}
          className={[styles['select'], invalid ? styles['invalid'] : ''].filter(Boolean).join(' ')}
          aria-invalid={invalid || undefined}
          onChange={(e) => onChange(field.name, e.target.value)}
          onBlur={(e) => onBlur(field.name, e.target.value)}
        >
          <option value="" disabled>
            {field.placeholder ?? 'Select an option'}
          </option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>
    );
  }

  return (
    <Field label={field.label} error={error} required={field.required}>
      <Input
        type={field.type}
        name={field.name}
        placeholder={field.placeholder}
        required={field.required}
        invalid={invalid}
        value={value}
        onChange={(e) => onChange(field.name, e.target.value)}
        onBlur={(e) => onBlur(field.name, e.target.value)}
        inputSize="md"
      />
    </Field>
  );
}

export function ContactForm({
  fields,
  endpoint,
  source,
  submitLabel = 'Send Message',
  successMessage = 'Thank you! Your submission has been received! Our team will get back to you within 12-24hrs.',
  className,
}: ContactFormProps) {
  const initial = Object.fromEntries(fields.map((f) => [f.name, '']));
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');

  function handleChange(name: string, value: string) {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  }

  function handleBlur(name: string, value: string) {
    const field = fields.find((f) => f.name === name);
    if (field?.required && !value.trim()) {
      setErrors((e) => ({ ...e, [name]: `${field.label} is required` }));
    }
  }

  function validate() {
    const errs: FieldErrors = {};
    for (const f of fields) {
      if (f.required && !values[f.name]?.trim()) {
        errs[f.name] = `${f.label} is required`;
      }
      if (f.type === 'email' && values[f.name] && !/\S+@\S+\.\S+/.test(values[f.name])) {
        errs[f.name] = 'Enter a valid email';
      }
    }
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'submitting') return;
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...values, ...(source ? { source } : {}) }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      setStatus('success');
      setValues(initial);
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return <div className={styles['success']}>{successMessage}</div>;
  }

  const singleFields = fields.filter((f) => !f.colSpan || f.colSpan === 1);
  const hasGrid = fields.some((f) => !f.colSpan || f.colSpan === 1);

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={[styles['form'], className ?? ''].filter(Boolean).join(' ')}
    >
      {hasGrid ? (
        <div className={styles['grid']}>
          {fields.map((field) => (
            <div key={field.name} className={field.colSpan === 2 ? styles['span-2'] : ''}>
              <FormControl
                field={field}
                value={values[field.name] ?? ''}
                error={errors[field.name]}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          ))}
        </div>
      ) : (
        fields.map((field) => (
          <FormControl
            key={field.name}
            field={field}
            value={values[field.name] ?? ''}
            error={errors[field.name]}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        ))
      )}

      {status === 'error' ? (
        <p className={styles['error']}>
          Oops! Something went wrong. Please try again.
        </p>
      ) : null}

      <div className={styles['submitRow']}>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={status === 'submitting'}
          hideArrow
        >
          {status === 'submitting' ? 'Sending…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
