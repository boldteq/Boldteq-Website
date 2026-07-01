export interface SelectOption {
  value: string;
  label: string;
}

export interface ContactFormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
  colSpan?: 1 | 2;
  /** HTML autocomplete token (e.g. given-name, family-name, email, tel) */
  autoComplete?: string;
}

export interface ContactFormProps {
  fields: ContactFormField[];
  /** API endpoint to POST to */
  endpoint: string;
  /** Extra body params merged into POST payload */
  source?: string;
  submitLabel?: string;
  successMessage?: string;
  className?: string;
}
