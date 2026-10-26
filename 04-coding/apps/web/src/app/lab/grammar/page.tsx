import type { Metadata } from 'next';
import React from 'react';
import { HeaderNav } from '@/components/common/header-nav';
import { Footer } from '@/components/common/footer';
import { GrammarCatalog } from '@/components/grammar/grammar-catalog';

export const metadata: Metadata = {
  title: 'Thư Viện Masterclass Ngữ Pháp | Lingora',
  description:
    'Làm chủ ngữ pháp tiếng Anh qua cấu trúc bài giảng 6 phần chuyên sâu: Bản chất cốt lõi, Chức năng, Chia ngôi, Cấu trúc 3 thể, Dấu hiệu nhận biết và Mổ xẻ câu thực chiến.',
};

export default function GrammarLabPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="px-6 py-4 max-w-7xl mx-auto w-full">
        <HeaderNav />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 w-full space-y-4">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-3 border-b border-slate-200/60">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                32 Chuyên Đề Chuẩn ForumFlash
              </span>
              <span className="hidden sm:inline text-slate-400 text-xs">•</span>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500">
                Trọn bộ 14 Thì &amp; Cấu trúc B1-B2
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Thư Viện Ngữ Pháp &amp; Phòng Luyện Đề
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Thấu hiểu bản chất tư duy ngôn ngữ qua phương pháp mổ xẻ câu chuyên sâu và rèn luyện kỹ năng giải đề thực chiến không áp lực.
            </p>
          </div>
        </header>

        {/* Master-Detail Catalog & Reader */}
        <GrammarCatalog />
      </main>

      {/* SaaS Footer */}
      <Footer />
    </div>
  );
}
