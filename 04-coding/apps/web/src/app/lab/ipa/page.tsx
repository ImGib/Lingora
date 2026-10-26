import type { Metadata } from 'next';
import React from 'react';
import { HeaderNav } from '@/components/common/header-nav';
import { Footer } from '@/components/common/footer';
import { IpaFullChart } from '@/components/ipa/ipa-full-chart';

export const metadata: Metadata = {
  title: 'Phòng Lab 44 Âm IPA Chuẩn Quốc Tế | Lingora',
  description:
    'Luyện phát âm chuẩn xác với 44 âm IPA tiếng Anh. Khẩu hình trực quan trực diện & mặt cắt, âm thanh song tốc 1.0x & 0.75x.',
};

export default function IpaLabPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#fff9fb]">
      {/* Navigation Header */}
      <header className="px-6 py-4 max-w-7xl mx-auto w-full">
        <HeaderNav />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 w-full space-y-8">
        <header className="section-heading max-w-3xl pt-4 pb-2">
          <span className="eyebrow text-indigo-600 font-bold tracking-wider text-xs uppercase block mb-1">
            LINGORA PRONUNCIATION LAB
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#34303d] tracking-tight">
            Phòng Lab 44 Âm IPA Quốc Tế
          </h1>
          <p className="lede text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Quan sát vị trí môi, răng và chuyển động của cơ lưỡi qua khẩu hình trực diện và mặt cắt giải phẫu.
            Quy chuẩn 1 âm / màn hình giúp bạn nắm bắt bản chất từng âm vị mà không lo quá tải thị giác.
          </p>
        </header>

        {/* 44-sound interactive chart and detail studio */}
        <IpaFullChart />
      </main>

      {/* SaaS Footer */}
      <Footer />
    </div>
  );
}
