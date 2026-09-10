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
  const baseStyles = 'inline-flex items-center font-bold rounded-full tracking-wider uppercase';

  const variants = {
    brand: 'bg-brand-red-soft text-brand-red border border-brand-red/40 shadow-sm shadow-brand-red/10',
    success: 'bg-utility-success-soft text-utility-success border border-utility-success/40',
    warning: 'bg-utility-warning-soft text-utility-warning border border-utility-warning/40',
    danger: 'bg-utility-danger-soft text-utility-danger border border-utility-danger/40',
    info: 'bg-utility-info-soft text-utility-info border border-utility-info/40',
    neutral: 'bg-brand-black-soft text-brand-white/80 border border-brand-black-muted',
    outline: 'border border-brand-black-muted text-brand-white bg-transparent',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 font-bold',
    md: 'text-xs px-2.5 py-1 font-bold',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
