import * as React from 'react';
import clsx from 'clsx';

export type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

  const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-cta text-white hover:bg-cta-hover shadow-md hover:shadow-lg focus-visible:ring-cta',
    secondary:
      'bg-surface-1 text-ink hover:bg-surface-2 border border-border-neutral hover:border-ink focus-visible:ring-ink',
    accent: 'bg-gold text-ink-inverted hover:bg-gold-hover shadow-md hover:shadow-lg focus-visible:ring-gold',
  };

  const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)} {...props}>
      {children}
    </button>
  );
}

export default Button;
