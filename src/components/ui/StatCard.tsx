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
    <Card className={cn('relative overflow-hidden flex flex-col justify-between', className)}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-black/60">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight mt-1">
            {value}
          </div>
        </div>
        {icon && (
          <div className="p-2.5 rounded-xl bg-brand-cream border border-brand-cream-dark/60 text-brand-black">
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={cn(
                'font-bold px-1.5 py-0.5 rounded',
                trend.isPositive
                  ? 'bg-utility-success-soft text-utility-success'
                  : 'bg-utility-danger-soft text-utility-danger'
              )}
            >
              {trend.value}
            </span>
          )}
          {subtitle && <span className="text-brand-black/60">{subtitle}</span>}
        </div>
      )}
    </Card>
  );
};
