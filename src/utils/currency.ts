export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

export function formatAddOn(value: number): string {
  return value === 0 ? 'Included' : `+${formatPrice(value)}`;
}