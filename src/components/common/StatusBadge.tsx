import React from 'react';
import type { SafetyStatus } from '../../types';
import { CheckCircle2, AlertTriangle, Flame, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: SafetyStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const config = {
    NORMAL: {
      label: 'NORMAL',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
    },
    SAFE: {
      label: 'SAFE',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
    },
    ATTENTION: {
      label: 'ATTENTION',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
    },
    WARNING: {
      label: 'WARNING',
      bg: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />,
    },
    HIGH_EXPOSURE: {
      label: 'HIGH EXPOSURE',
      bg: 'bg-red-50 text-red-700 border-red-200 animate-pulse',
      icon: <Flame className="w-3.5 h-3.5 text-red-600 shrink-0" />,
    },
    CRITICAL_EXPOSURE: {
      label: 'CRITICAL EXPOSURE',
      bg: 'bg-red-100 text-red-900 border-red-400 animate-pulse',
      icon: <Flame className="w-3.5 h-3.5 text-red-700 shrink-0" />,
    },
    INVALID: {
      label: 'INVALID READING',
      bg: 'bg-stone-100 text-stone-700 border-stone-200',
      icon: <AlertCircle className="w-3.5 h-3.5 text-stone-500 shrink-0" />,
    },
  };

  const activeConfig = config[status] || config.INVALID;

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs gap-1 border font-bold rounded-full',
    md: 'px-3 py-1 text-xs md:text-sm gap-1.5 border font-bold rounded-full',
    lg: 'px-4 py-1.5 text-sm gap-2 border-2 font-extrabold rounded-full',
  };

  return (
    <span
      className={`inline-flex items-center tracking-wide font-sans ${sizeClasses[size]} ${activeConfig.bg} ${className}`}
    >
      {showIcon && activeConfig.icon}
      <span>{activeConfig.label}</span>
    </span>
  );
};
