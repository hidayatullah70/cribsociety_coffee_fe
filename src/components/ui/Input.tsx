import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, startIcon, endIcon, showPasswordToggle = true, type, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const isPasswordType = type === 'password';
    const effectiveType = isPasswordType && showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

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
            type={effectiveType}
            className={cn(
              'w-full bg-brand-black-soft border border-brand-black-muted text-brand-white text-sm rounded-xl py-2.5 px-3.5 transition-colors placeholder:text-brand-white/40 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red disabled:bg-brand-black disabled:opacity-50',
              startIcon && 'pl-10',
              (endIcon || (isPasswordType && showPasswordToggle)) && 'pr-11',
              error && 'border-utility-danger focus:border-utility-danger focus:ring-utility-danger',
              className
            )}
            {...props}
          />
          {isPasswordType && showPasswordToggle ? (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              className="absolute right-3.5 p-1 text-brand-white/40 hover:text-brand-white focus:text-brand-red transition-colors cursor-pointer rounded-md hover:bg-brand-black-muted/50"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-brand-red" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          ) : endIcon ? (
            <div className="absolute right-3.5 flex items-center text-brand-red">
              {endIcon}
            </div>
          ) : null}
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

