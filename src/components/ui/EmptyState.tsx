import React from 'react';
import { AlertCircle, RefreshCw, FolderOpen, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export interface EmptyStateProps {
  type?: 'empty' | 'error' | 'loading';
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'empty',
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
}) => {
  const getDefaultIcon = () => {
    switch (type) {
      case 'loading':
        return <Loader2 className="w-8 h-8 text-brand-red animate-spin" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-utility-danger" />;
      case 'empty':
      default:
        return <FolderOpen className="w-8 h-8 text-brand-black/40" />;
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-brand-cream-dark/80 bg-brand-cream/30',
        className
      )}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-brand-white shadow-sm mb-4 border border-brand-cream-dark">
        {icon || getDefaultIcon()}
      </div>

      <h4 className="text-base font-bold text-brand-black tracking-tight">{title}</h4>
      {description && (
        <p className="text-xs sm:text-sm text-brand-black/60 max-w-sm mt-1.5">{description}</p>
      )}

      {onAction && (
        <div className="mt-5">
          <Button
            size="sm"
            variant={type === 'error' ? 'primary' : 'outline'}
            onClick={onAction}
            className="flex items-center gap-2"
          >
            {type === 'error' && <RefreshCw className="w-3.5 h-3.5" />}
            <span>{actionLabel || (type === 'error' ? 'Retry Action' : 'Action')}</span>
          </Button>
        </div>
      )}
    </div>
  );
};
