import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'outline' | 'dark';
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-brand-white border border-brand-cream-dark/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]',
    flat: 'bg-brand-cream-light border border-brand-cream-dark/60',
    outline: 'bg-transparent border border-brand-cream-dark',
    dark: 'bg-brand-black text-brand-white border border-brand-black-soft',
  };

  return (
    <div className={cn('rounded-xl p-5 transition-all duration-200', variants[variant], className)} {...props}>
      {children}
    </div>
  );
};
