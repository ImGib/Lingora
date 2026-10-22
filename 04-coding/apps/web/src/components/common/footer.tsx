import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-[#e8e1ec] bg-white/70 backdrop-blur-md mt-20 pt-16 pb-12 text-[#716b79] text-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2 text-lg font-extrabold text-[#34303d]">
              <span className="text-indigo-600">✦</span>
              <span>Lingora</span>
            </Link>
            <p className="text-xs leading-relaxed text-[#716b79]">
              Your soft study companion. Xây dựng nền tảng tiếng Anh êm dịu, tiến bộ vững chắc từng bước đến IELTS 6.5.
            </p>
            <div className="pt-2 text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Hệ thống vận hành an toàn
            </div>
          </div>

          {/* Learning Hub */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#34303d] mb-4">Lộ trình & Phòng Lab</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/roadmap" className="hover:text-indigo-600 transition-colors">
                  Lộ trình 4 Mốc IELTS 6.5
                </Link>
              </li>
              <li>
                <Link href="/lab/ipa" className="hover:text-indigo-600 transition-colors">
                  Phòng Lab 44 Âm IPA
                </Link>
              </li>
              <li>
                <Link href="/lab/grammar" className="hover:text-indigo-600 transition-colors">
                  Masterclass Ngữ pháp
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">
                  Dashboard Học viên
                </Link>
              </li>
            </ul>
          </div>

          {/* Pedagogical Invariants */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#34303d] mb-4">Triết lý sư phạm</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <span className="text-indigo-500">✓</span> Bỏ qua không phạt lỗi
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-indigo-500">✓</span> Minh bạch gợi ý trợ giúp
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-indigo-500">✓</span> Lỗi mic không là lỗi học viên
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-indigo-500">✓</span> Khẩu hình 1 âm / màn hình
              </li>
            </ul>
          </div>

          {/* Resources & System */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#34303d] mb-4">Tài nguyên & Trực tiếp</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/prototype/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 transition-colors"
                >
                  🚀 Prototype 7 Ngày
                </a>
              </li>
              <li>
                <a
                  href="https://lingora-prototype.vercel.app/stakeholder-hub.html#ai-ops"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 transition-colors"
                >
                  🤖 Bảng điều khiển AI Ops
                </a>
              </li>
              <li className="text-[#a09aa7]">Bảo mật & Tôn trọng quyền riêng tư</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#f0e9f3] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#a09aa7]">
          <p>© 2026 Lingora. Thiết kế cho sự tiến bộ bền vững của người học.</p>
          <p className="flex items-center gap-3">
            <span>Phiên bản 2.1</span>
            <span>•</span>
            <span>Next.js App Router</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
