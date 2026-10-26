'use client';

import React, { forwardRef } from 'react';

export type CardVariant = 'default' | 'soft' | 'interactive' | 'glass' | 'accent';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const CARD_VARIANTS: Record<CardVariant, string> = {
  default: 'bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs text-slate-800',
  soft: 'bg-slate-50/70 rounded-2xl border border-slate-200/70 text-slate-800',
  interactive:
    'bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs hover:border-indigo-400/80 hover:shadow-xs transition-all duration-200 cursor-pointer text-slate-800',
  glass: 'bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/60 shadow-xs text-slate-800',
  accent: 'bg-indigo-50/40 rounded-2xl sm:rounded-3xl border border-indigo-200/80 text-indigo-950',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${CARD_VARIANTS[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`p-5 sm:p-6 pb-3 border-b border-slate-100 flex flex-col space-y-1.5 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', children, ...props }, ref) => (
    <h3
      ref={ref}
      className={`text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug ${className}`}
      {...props}
    >
      {children}
    </h3>
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', children, ...props }, ref) => (
    <p
      ref={ref}
      className={`text-xs sm:text-sm text-slate-500 leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </p>
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`p-5 sm:p-6 ${className}`} {...props}>
      {children}
    </div>
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`p-5 sm:p-6 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = 'CardFooter';
