import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, startIcon, endIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-brand-black tracking-wide uppercase">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {startIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-brand-black/40">
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-brand-white border border-brand-cream-dark text-brand-black text-sm rounded-lg py-2.5 px-3.5 transition-colors placeholder:text-brand-black/35 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red disabled:bg-brand-cream disabled:opacity-60',
              startIcon && 'pl-10',
              endIcon && 'pr-10',
              error && 'border-utility-danger focus:border-utility-danger focus:ring-utility-danger',
              className
            )}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-3.5 flex items-center text-brand-black/40">
              {endIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-utility-danger font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-brand-black/60">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
