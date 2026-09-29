import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  variant?: 'white' | 'cream' | 'burgundy' | 'coral' | 'outline';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  variant = 'white',
  ...props
}) => {
  const variantClasses = {
    white: 'bg-white border border-[#590D22]/08 shadow-warm-card',
    cream: 'bg-[#FFFBF7] border border-[#590D22]/08 shadow-warm-card',
    burgundy: 'bg-[#590D22] text-white shadow-xl shadow-[#590D22]/15',
    coral: 'bg-[#E63946] text-white shadow-xl shadow-[#E63946]/20',
    outline: 'bg-transparent border-2 border-[#590D22]/15',
  };

  return (
    <div
      className={`rounded-3xl p-5 md:p-6 transition-all duration-300 ${
        variantClasses[variant]
      } ${
        hoverable ? 'hover:-translate-y-1 hover:shadow-warm-lg cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
