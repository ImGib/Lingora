import React from 'react';
import Link from 'next/link';
import { Show, SignUpButton } from '@clerk/nextjs';
import { HeaderNav } from '@/components/common/header-nav';
import { AudioButton } from '@/components/common/audio-button';
import { Footer } from '@/components/common/footer';

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-transparent overflow-x-hidden">
      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Navigation Header */}
        <header className="px-6 py-4 max-w-7xl mx-auto w-full">
          <HeaderNav />
        </header>

        {/* Hero Section */}
        <section className="px-6 pt-12 pb-20 max-w-6xl mx-auto w-full text-center md:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                Khởi đầu êm đềm • Tiến bộ vững chắc • Hướng tới IELTS 6.5
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#34303d] tracking-tight leading-[1.08]">
                Xây nền tiếng Anh <br className="hidden sm:inline" />
                <span className="text-indigo-600">vững chắc & rõ ràng</span> từng bước.
              </h1>

              <p className="text-base sm:text-lg text-[#716b79] leading-relaxed max-w-xl">
                Lingora giữ an toàn cho danh tính học tập của bạn. Phương pháp sư phạm nhân văn không phán xét,
                đi từ 44 âm khẩu hình IPA, ngữ pháp 6 phần đến sẵn sàng cho kỳ thi IELTS.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2 justify-center md:justify-start">
                <Show when="signed-out">
                  <SignUpButton>
                    <button className="button primary large text-base px-6 py-3.5 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all">
                      Bắt đầu nhẹ nhàng
                    </button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <Link
                    href="/dashboard"
                    className="button primary large text-base px-6 py-3.5 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all"
                  >
                    Vào Bàn học hôm nay →
                  </Link>
                </Show>

                <Link
                  href="/roadmap"
                  className="button secondary large text-base px-6 py-3.5 hover:bg-slate-50 transition-all"
                >
                  🗺️ Xem Lộ trình 4 Mốc
                </Link>

                <a
                  href="/prototype/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-3 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  🚀 Thử Prototype 7 ngày
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#716b79] justify-center md:justify-start">
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span> Không phán xét lỗi sai
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span> 1 âm / màn hình trực quan
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span> Chuẩn đầu ra IELTS 6.5
                </span>
              </div>
            </div>

            {/* Right Interactive Hero Card */}
            <div className="lg:col-span-5">
              <div className="card p-6 sm:p-8 bg-white/95 backdrop-blur-md rounded-3xl border border-[#e8e1ec] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-3xl -z-10 pointer-events-none"></div>

                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                    <span className="text-xs font-bold text-slate-400 ml-2">LINGORA LAB PREVIEW</span>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                    Live Demo
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#faf8f6] border border-[#f0e9f3]">
                    <span className="text-xs uppercase tracking-wider font-bold text-indigo-600 block mb-1">
                      Thử phát âm song tốc:
                    </span>
                    <p className="text-lg font-bold text-slate-800">
                      "Consistent practice creates effortless fluency."
                    </p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      /kənˈsɪstənt ˈpræktɪs kriˈeɪts ˈɛfərtləs ˈfluːənsi/
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-xs text-slate-600 font-medium">Nghe mẫu hai tốc độ:</span>
                      <AudioButton text="Consistent practice creates effortless fluency." />
                    </div>
                  </div>

                  {/* 3 Pillars Preview pills */}
                  <div className="space-y-2 pt-1">
                    <Link
                      href="/lab/ipa"
                      className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                          /æ/
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
                            Phòng Lab 44 Âm IPA
                          </p>
                          <p className="text-[11px] text-slate-500">Khẩu hình trực diện & mặt cắt 1 âm/màn hình</p>
                        </div>
                      </div>
                      <span className="text-xs text-indigo-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        Xem →
                      </span>
                    </Link>

                    <Link
                      href="/lab/grammar"
                      className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm">
                          6P
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
                            Masterclass Ngữ Pháp
                          </p>
                          <p className="text-[11px] text-slate-500">Mổ xẻ bản chất và cấu trúc câu</p>
                        </div>
                      </div>
                      <span className="text-xs text-indigo-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        Xem →
                      </span>
                    </Link>

                    <Link
                      href="/roadmap"
                      className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-sm">
                          6.5
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
                            Bản đồ 4 Mốc IELTS
                          </p>
                          <p className="text-[11px] text-slate-500">Từ Zero đến 6.5 kèm định dạng bài test</p>
                        </div>
                      </div>
                      <span className="text-xs text-indigo-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        Xem →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Milestones Section */}
        <section className="px-6 py-16 bg-white/60 border-y border-[#e8e1ec]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="eyebrow text-indigo-600 font-bold tracking-wider text-xs uppercase block mb-2">
                HÀNH TRÌNH TỪ GỐC
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#34303d] tracking-tight">
                4 Mốc vững chắc hướng tới IELTS 6.5
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                Mỗi mốc có ma trận kiến thức trọng tâm rõ ràng và bài kiểm tra năng lực độc lập tương ứng.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Mốc 1 */}
              <div className="card p-6 bg-white rounded-2xl border border-slate-200/80 hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                      MỐC 1 • A1
                    </span>
                    <span className="text-xs text-slate-400 font-bold">Band 0.0 - 3.0</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-800 mb-2">Nền Tảng Âm Vị</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    44 âm IPA khẩu hình chuẩn xác, động từ To Be, số đếm và 300 từ vựng sinh hoạt hàng ngày.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Test:</span> Mini Test 25 phút (Phân biệt âm vị)
                </div>
              </div>

              {/* Mốc 2 */}
              <div className="card p-6 bg-white rounded-2xl border border-slate-200/80 hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                      MỐC 2 • A2
                    </span>
                    <span className="text-xs text-slate-400 font-bold">Band 3.0 - 4.5</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-800 mb-2">Kể Chuyện & Kế Hoạch</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Thì Quá khứ đơn, Tương lai, so sánh hơn/nhất và 500 từ vựng miêu tả cuộc sống quanh mình.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Test:</span> Milestone Test 40 phút (Email 80 từ)
                </div>
              </div>

              {/* Mốc 3 */}
              <div className="card p-6 bg-white rounded-2xl border border-slate-200/80 hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                      MỐC 3 • B1
                    </span>
                    <span className="text-xs text-slate-400 font-bold">Band 4.5 - 5.5</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-800 mb-2">Tư Duy Phản Biện</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Câu điều kiện, bị động, mệnh đề quan hệ và 600 từ vựng học thuật cơ bản (AWL).
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Test:</span> Pre-IELTS 60 phút (Section 1-2, Luận 120w)
                </div>
              </div>

              {/* Mốc 4 */}
              <div className="card p-6 bg-white rounded-2xl border border-slate-200/80 hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                      MỐC 4 • B2
                    </span>
                    <span className="text-xs text-emerald-600 font-bold">Band 5.5 - 6.5+</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-800 mb-2">Luyện Đề 4 Kỹ Năng</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    1.500 từ AWL, chiến thuật Skimming/Scanning, xử lý trọn vẹn đề thi Listening & Speaking.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Test:</span> Full Mock Test 160 phút
                </div>
              </div>
            </div>

            <div className="text-center mt-10">
              <Link
                href="/roadmap"
                className="button primary px-6 py-3 text-sm font-bold shadow-md hover:shadow-lg transition-all"
              >
                Khám phá chi tiết Lộ trình 4 Mốc →
              </Link>
            </div>
          </div>
        </section>

        {/* Pedagogical Invariants Section */}
        <section className="px-6 py-20 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="eyebrow text-indigo-600 font-bold tracking-wider text-xs uppercase block mb-2">
              HIẾN PHÁP SƯ PHẠM LINGORA
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#34303d] tracking-tight">
              An toàn tâm lý tuyệt đối khi học
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Chúng tôi bảo vệ sự tự tin của bạn khỏi những áp lực phán xét lỗi thường gặp trong học ngoại ngữ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-3xl bg-white border border-[#e8e1ec] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">
                🛡️
              </div>
              <h3 className="text-lg font-bold text-slate-800">Skipped != Failed</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Bấm <em>"Bỏ qua"</em> hoặc <em>"Để sau"</em> không bao giờ bị trừ điểm hay báo lỗi đỏ. Bạn có quyền chọn học khi tâm trí sẵn sàng nhất.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-[#e8e1ec] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
                💡
              </div>
              <h3 className="text-lg font-bold text-slate-800">Support != Independent</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Gợi ý luôn ở đây để giúp bạn hiểu bài. Hệ thống tách biệt rõ ràng giữa câu trả lời có gợi ý và năng lực độc lập một cách tôn trọng.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-[#e8e1ec] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold">
                🎧
              </div>
              <h3 className="text-lg font-bold text-slate-800">Fault Tolerance</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Khi micro không cấp quyền hoặc đường truyền gián đoạn, hệ thống tự động chuyển sang gõ chữ. Sự cố kỹ thuật không bao giờ là lỗi học viên.
              </p>
            </div>
          </div>
        </section>

        {/* SaaS Footer */}
        <Footer />
      </div>
    </div>
  );
}
