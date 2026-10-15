export const DISCOUNT_RATE = 0.4; // 40% off the vehicle base price

export function discountedPrice(original: number): number {
  return Math.round(original * (1 - DISCOUNT_RATE));
}

export function discountSavings(original: number): number {
  return original - discountedPrice(original);
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatAddOn(value: number): string {
  return value === 0 ? 'Included' : `+${formatPrice(value)}`;
}
