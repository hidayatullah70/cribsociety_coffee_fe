import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  className,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className={cn(
          'relative w-full bg-brand-black-card text-brand-white rounded-2xl shadow-2xl border border-brand-black-muted p-6 z-10 animate-in fade-in zoom-in-95 duration-200',
          sizeClasses[size],
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between pb-4 border-b border-brand-black-muted">
          <div>
            {title && <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>}
            {description && <p className="text-xs text-brand-white/60 mt-0.5">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-brand-white/60 hover:text-white hover:bg-brand-black-soft transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center border border-transparent hover:border-brand-black-muted"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-brand-red" />
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>,
    document.body
  );
};
