'use client';

import React from 'react';

export type BadgeVariant =
  | 'indigo'
  | 'teal'
  | 'amber'
  | 'rose'
  | 'slate'
  | 'emerald'
  | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  withDot?: boolean;
}

const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/70',
  teal: 'bg-teal-50 text-teal-700 border-teal-200/70',
  amber: 'bg-amber-50 text-amber-800 border-amber-200/70',
  rose: 'bg-rose-50 text-rose-700 border-rose-200/70',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
  outline: 'bg-transparent text-slate-600 border-slate-300',
};

const DOT_COLORS: Record<BadgeVariant, string> = {
  indigo: 'bg-indigo-600',
  teal: 'bg-teal-600',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  slate: 'bg-slate-500',
  emerald: 'bg-emerald-500',
  outline: 'bg-slate-400',
};

export function Badge({
  variant = 'indigo',
  withDot = false,
  className = '',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wide border select-none ${BADGE_VARIANTS[variant]} ${className}`}
      {...props}
    >
      {withDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOT_COLORS[variant]}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
