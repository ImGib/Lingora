'use client';

import React, { forwardRef } from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'accent'
  | 'success'
  | 'danger';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 border-transparent shadow-xs focus-visible:ring-indigo-500',
  secondary:
    'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-slate-200/90 shadow-2xs focus-visible:ring-indigo-500',
  outline:
    'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 border-slate-300 focus-visible:ring-indigo-500',
  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-transparent focus-visible:ring-indigo-500',
  accent:
    'bg-amber-500 text-slate-950 hover:bg-amber-400 active:bg-amber-600 border-transparent shadow-xs font-black focus-visible:ring-amber-500',
  success:
    'bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 border-transparent shadow-xs focus-visible:ring-teal-500',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 border-transparent shadow-xs focus-visible:ring-rose-500',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5 min-h-[36px] rounded-xl gap-1.5',
  md: 'text-xs sm:text-sm px-4 py-2 min-h-[44px] rounded-xl gap-2 font-bold',
  lg: 'text-sm sm:text-base px-5 py-2.5 min-h-[48px] rounded-2xl gap-2.5 font-bold',
  icon: 'h-10 w-10 min-h-[40px] min-w-[40px] p-0 rounded-xl justify-center items-center',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-bold border transition-all duration-150 select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
    const variantStyle = VARIANT_CLASSES[variant];
    const sizeStyle = SIZE_CLASSES[size];

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variantStyle} ${sizeStyle} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
