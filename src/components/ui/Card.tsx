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
    default: 'bg-brand-black-card text-brand-white border border-brand-black-muted shadow-[0_8px_30px_rgba(0,0,0,0.35)]',
    flat: 'bg-brand-black-soft text-brand-white border border-brand-black-muted/70',
    outline: 'bg-transparent text-brand-white border border-brand-black-muted',
    dark: 'bg-brand-black text-brand-white border border-brand-black-muted',
  };

  return (
    <div className={cn('rounded-2xl p-5 transition-all duration-200', variants[variant], className)} {...props}>
      {children}
    </div>
  );
};
