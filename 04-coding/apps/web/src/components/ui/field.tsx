'use client';

import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      leftIcon,
      rightIcon,
      onClear,
      hasError = false,
      value,
      type = 'text',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative w-full flex items-center">
        {leftIcon && (
          <span className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          value={value}
          disabled={disabled}
          className={`w-full py-2.5 text-xs sm:text-sm bg-slate-50/70 hover:bg-white focus:bg-white rounded-xl border transition-all duration-150 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-slate-100 disabled:cursor-not-allowed min-h-[44px] ${
            leftIcon ? 'pl-9' : 'pl-3.5'
          } ${rightIcon || onClear ? 'pr-9' : 'pr-3.5'} ${
            hasError
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
              : 'border-slate-200/90 focus:border-indigo-600 focus:ring-indigo-500/20'
          } ${className}`}
          {...props}
        />
        {onClear && value && !disabled && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 text-slate-400 hover:text-slate-600 text-xs p-1 rounded-full transition-colors"
            aria-label="Xóa nội dung nhập"
          >
            ✕
          </button>
        )}
        {!onClear && rightIcon && (
          <span className="absolute right-3 text-slate-400 pointer-events-none flex items-center">
            {rightIcon}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', hasError = false, disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        className={`w-full p-3.5 text-xs sm:text-sm bg-slate-50/70 hover:bg-white focus:bg-white rounded-2xl border transition-all duration-150 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-slate-100 disabled:cursor-not-allowed ${
          hasError
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
            : 'border-slate-200/90 focus:border-indigo-600 focus:ring-indigo-500/20'
        } ${className}`}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export interface FieldProps {
  label?: string;
  htmlFor?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Field({
  label,
  htmlFor,
  helperText,
  error,
  required = false,
  className = '',
  children,
}: FieldProps) {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-xs font-bold text-slate-700 select-none"
        >
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
          <span>⚠️</span>
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
}
