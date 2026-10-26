'use client';

import React, { createContext, useContext } from 'react';

type TabsVariant = 'underline' | 'segmented';

interface TabsContextValue {
  value: string;
  onValueChange: (val: string) => void;
  variant: TabsVariant;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error('Tabs compound components must be rendered inside <Tabs>');
  }
  return ctx;
}

export interface TabsProps {
  value: string;
  onValueChange: (val: string) => void;
  variant?: TabsVariant;
  className?: string;
  children: React.ReactNode;
}

export function Tabs({
  value,
  onValueChange,
  variant = 'underline',
  className = '',
  children,
}: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange, variant }}>
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function TabsList({ className = '', children, ...props }: TabsListProps) {
  const { variant } = useTabsContext();

  const variantStyles =
    variant === 'underline'
      ? 'flex items-center gap-2 sm:gap-6 border-b border-slate-200/90 -mb-px overflow-x-auto scrollbar-none'
      : 'inline-flex p-1 bg-slate-100/90 rounded-2xl gap-1 border border-slate-200/60';

  return (
    <div
      role="tablist"
      className={`${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
}

export function TabsTrigger({
  value: triggerValue,
  badge,
  icon,
  className = '',
  children,
  ...props
}: TabsTriggerProps) {
  const { value, onValueChange, variant } = useTabsContext();
  const isActive = value === triggerValue;

  let stateStyles = '';
  if (variant === 'underline') {
    stateStyles = isActive
      ? 'border-b-2 border-indigo-600 text-indigo-950 font-black'
      : 'border-b-2 border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 font-bold';
  } else {
    stateStyles = isActive
      ? 'bg-white text-indigo-950 shadow-xs font-black ring-1 ring-slate-200/60'
      : 'text-slate-600 hover:text-slate-900 font-bold hover:bg-white/40';
  }

  const basePadding =
    variant === 'underline'
      ? 'pb-3 pt-2 px-2.5 sm:px-3 text-xs sm:text-sm min-h-[44px]'
      : 'px-3 sm:px-4 py-2 text-xs rounded-xl min-h-[38px]';

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => onValueChange(triggerValue)}
      className={`transition-all flex items-center justify-center gap-2 shrink-0 select-none ${basePadding} ${stateStyles} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {badge && <span className="shrink-0">{badge}</span>}
    </button>
  );
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({
  value: contentValue,
  className = '',
  children,
  ...props
}: TabsContentProps) {
  const { value } = useTabsContext();
  if (value !== contentValue) return null;

  return (
    <div
      role="tabpanel"
      className={`animate-in fade-in-50 duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
