import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'md',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full tracking-wide uppercase';

  const variants = {
    brand: 'bg-brand-red-soft text-brand-red border border-brand-red/20',
    success: 'bg-utility-success-soft text-utility-success border border-utility-success/20',
    warning: 'bg-utility-warning-soft text-utility-warning border border-utility-warning/20',
    danger: 'bg-utility-danger-soft text-utility-danger border border-utility-danger/20',
    info: 'bg-utility-info-soft text-utility-info border border-utility-info/20',
    neutral: 'bg-brand-cream-dark/60 text-brand-black/80 border border-brand-cream-dark',
    outline: 'border border-brand-cream-dark text-brand-black bg-transparent',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 font-semibold',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
