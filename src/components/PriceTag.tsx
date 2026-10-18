import { discountedPrice, formatPrice } from '../utils/currency';

type Size = 'sm' | 'md' | 'lg';

type Props = {
  original: number;
  size?: Size;
  isDark?: boolean; // <-- Added isDark prop
  className?: string;
};

export function PriceTag({ original, size = 'md', isDark = false, className = '' }: Props) {
  const now = discountedPrice(original);

  const styles: Record<Size, { old: string; now: string }> = {
    sm: { old: 'text-xs', now: 'text-sm font-medium' },
    md: { old: 'text-sm', now: 'text-2xl font-medium tracking-tight' },
    lg: { old: 'text-base', now: 'text-3xl font-medium tracking-tight' },
  };

  const s = styles[size];

  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className={`${s.old} ${isDark ? 'text-gray-400' : 'text-muted'} line-through`}>
        {formatPrice(original)}
      </span>
      <span className={`${s.now} ${isDark ? 'text-white' : 'text-ink'}`}>
        {formatPrice(now)}
      </span>
    </span>
  );
}

export default PriceTag;
