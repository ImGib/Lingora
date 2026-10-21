'use client';

import React, { useState } from 'react';
import { HeaderNav } from '@/components/common/header-nav';
import { ModalFaultSimulation } from '@/components/common/modal-fault-simulation';

interface BasePageShellProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
}

export function BasePageShell({ title, subtitle, badge, children }: BasePageShellProps) {
  const [activeFault, setActiveFault] = useState<string | null>(null);

  return (
    <main className="page-shell min-h-screen relative">
      <HeaderNav />

      {activeFault && (
        <div className="my-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
          ⚠️ <strong>Kịch bản giả lập QA:</strong> {activeFault} (Quy tắc: Sự cố kỹ thuật không bao giờ là lỗi học viên).
        </div>
      )}

      <header className="section-heading max-w-4xl pt-8 pb-6">
        {badge && (
          <span className="eyebrow text-indigo-600 font-bold tracking-wider text-xs uppercase block mb-1">
            {badge}
          </span>
        )}
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="lede text-slate-600 text-base md:text-lg mt-2 leading-relaxed">{subtitle}</p>}
      </header>

      <div className="page-content space-y-8 pb-20">
        {children}
      </div>

      <ModalFaultSimulation
        onSimulate={(k) => {
          setActiveFault(`Đã kích hoạt lỗi: ${k}`);
        }}
      />
    </main>
  );
}
