import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-[#590D22]/08 shadow-warm-card">
      <div className="p-4 bg-[#FAF4ED] text-[#E63946] rounded-3xl mb-4 shadow-inner">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-[#1C1917] mb-1">{title}</h3>
      <p className="text-sm text-stone-500 max-w-xs mb-5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
