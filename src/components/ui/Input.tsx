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
          <label htmlFor={inputId} className="block text-xs font-semibold text-brand-white tracking-wide uppercase">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {startIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-brand-red">
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-brand-black-soft border border-brand-black-muted text-brand-white text-sm rounded-xl py-2.5 px-3.5 transition-colors placeholder:text-brand-white/40 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red disabled:bg-brand-black disabled:opacity-50',
              startIcon && 'pl-10',
              endIcon && 'pr-10',
              error && 'border-utility-danger focus:border-utility-danger focus:ring-utility-danger',
              className
            )}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-3.5 flex items-center text-brand-red">
              {endIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-utility-danger font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-brand-white/60">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
