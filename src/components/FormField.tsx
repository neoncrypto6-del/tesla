import React from 'react';

type FormFieldProps = {
  id: string;
  label: string;
  children: React.ReactNode;
  error?: string;
};

export const inputClass =
'h-10 w-full rounded bg-panel px-3 text-sm text-ink outline-none ring-1 ring-transparent transition-shadow duration-150 placeholder:text-muted/70 focus:ring-ink';

export function FormField({ id, label, children, error }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm text-muted">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>);

}