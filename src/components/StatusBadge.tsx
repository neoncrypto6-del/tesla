import React from 'react';

type StatusBadgeProps = {status: string;label?: string;};

const styles: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-800 ring-amber-200',
  completed: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  paid: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  failed: 'bg-red-50 text-red-700 ring-red-200',
  refunded: 'bg-panel text-muted ring-line',
  due: 'bg-amber-50 text-amber-800 ring-amber-200'
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${
      styles[status] ?? styles.refunded}`
      }>
      
      {label ?? status}
    </span>);

}