import React from 'react';
import { Card } from './Card';
import { cn } from '../../utils/cn';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}) => {
  return (
    <Card className={cn('relative overflow-hidden flex flex-col justify-between bg-brand-black-card border-brand-black-muted', className)}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-white/60">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            {value}
          </div>
        </div>
        {icon && (
          <div className="p-2.5 rounded-xl bg-brand-black-soft border border-brand-black-muted text-brand-red">
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={cn(
                'font-bold px-1.5 py-0.5 rounded border',
                trend.isPositive
                  ? 'bg-utility-success-soft text-utility-success border-utility-success/30'
                  : 'bg-utility-danger-soft text-utility-danger border-utility-danger/30'
              )}
            >
              {trend.value}
            </span>
          )}
          {subtitle && <span className="text-brand-white/60">{subtitle}</span>}
        </div>
      )}
    </Card>
  );
};
