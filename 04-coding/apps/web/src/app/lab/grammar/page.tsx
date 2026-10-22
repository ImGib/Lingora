import type { Metadata } from 'next';
import React from 'react';
import { HeaderNav } from '@/components/common/header-nav';
import { Footer } from '@/components/common/footer';
import { GrammarCatalog } from '@/components/grammar/grammar-catalog';

export const metadata: Metadata = {
  title: 'Thư Viện Masterclass Ngữ Pháp ForumFlash | Lingora',
  description:
    'Làm chủ ngữ pháp tiếng Anh qua cấu trúc 6 phần ForumFlash: Bản chất cốt lõi, Chức năng, Chia ngôi, Cấu trúc 3 thể, Dấu hiệu nhận biết và Mổ xẻ câu thực chiến.',
};

export default function GrammarLabPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#fff9fb]">
      {/* Navigation Header */}
      <header className="px-6 py-4 max-w-7xl mx-auto w-full">
        <HeaderNav />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full space-y-8">
        <header className="section-heading max-w-3xl pt-4 pb-2">
          <span className="eyebrow text-indigo-600 font-bold tracking-wider text-xs uppercase block mb-1">
            LINGORA GRAMMAR MASTERCLASS
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#34303d] tracking-tight">
            Thư Viện Masterclass Ngữ Pháp
          </h1>
          <p className="lede text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Ngữ pháp không phải là những công thức khô khan cần học vẹt. Với phương pháp ForumFlash 6 phần,
            bạn sẽ thấu hiểu bản chất tư duy ngôn ngữ đằng sau từng cấu trúc từ A1 đến IELTS 6.5+.
          </p>
        </header>

        {/* Catalog & Masterclass View */}
        <GrammarCatalog />
      </main>

      {/* SaaS Footer */}
      <Footer />
    </div>
  );
}
