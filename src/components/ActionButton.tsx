import React from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'dark' | 'white';

type ActionButtonProps = {
  variant?: Variant;
  to?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
};

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-hover',
  secondary: 'bg-panel/90 text-ink backdrop-blur hover:bg-white',
  dark: 'bg-ink text-white hover:bg-black',
  white: 'bg-white text-ink hover:bg-panel'
};

export function ActionButton({
  variant = 'primary',
  to,
  onClick,
  type = 'button',
  disabled,
  fullWidth,
  className = '',
  children
}: ActionButtonProps) {
  const classes = `inline-flex h-10 items-center justify-center whitespace-nowrap rounded px-6 text-sm font-medium transition-colors duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
  fullWidth ? 'w-full' : 'min-w-[200px] sm:min-w-[240px]'} ${
  variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>);

  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>);

}