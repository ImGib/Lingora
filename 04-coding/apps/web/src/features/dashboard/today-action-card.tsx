'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export interface TodayActionCardProps {
  initialMode?: 'standard_20' | 'light_5' | undefined;
  title?: string | undefined;
  description?: string | undefined;
  ctaText?: string | undefined;
  ctaHref?: string | null | undefined;
  onActionClick?: (() => void) | undefined;
  isBusy?: boolean | undefined;
  activeBlockType?: string | undefined;
}

export function TodayActionCard({
  initialMode = 'standard_20',
  title = 'Bắt đầu bài học hôm nay',
  description = 'Khám phá kiến thức mới trước khi luyện tập. Bạn có thể dừng hoặc đổi nhịp bất cứ lúc nào.',
  ctaText = 'Vào bài học ngay',
  ctaHref = null,
  onActionClick,
  isBusy = false,
  activeBlockType = 'LESSON',
}: TodayActionCardProps) {
  const [selectedMode, setSelectedMode] = useState<'standard_20' | 'light_5'>(initialMode);

  return (
    <section className="dashboard-next-card relative overflow-hidden" aria-labelledby="today-action-title">
      {/* Top Header Row */}
      <div className="next-card-top flex items-center justify-between">
        <p className="dashboard-kicker flex items-center gap-2 text-emerald-300">
          <span className="next-pulse bg-emerald-400" />
          <span>HÀNH ĐỘNG HÔM NAY • {selectedMode === 'standard_20' ? 'TIÊU CHUẨN 20 PHÚT' : 'HỌC NHẸ 5 PHÚT'}</span>
        </p>
        <span className="next-card-index text-indigo-200">01 / TODAY</span>
      </div>

      {/* Mode Switcher Toggle (20p vs 5p) */}
      <div className="my-3 py-1.5 px-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 inline-flex items-center gap-1.5 w-fit">
        <button
          type="button"
          onClick={() => setSelectedMode('standard_20')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            selectedMode === 'standard_20'
              ? 'bg-[#9de3d2] text-[#1c3532] shadow-sm'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>🎯 Tiêu chuẩn (20p)</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMode('light_5')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            selectedMode === 'light_5'
              ? 'bg-[#9de3d2] text-[#1c3532] shadow-sm'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>☕ Học nhẹ (5p)</span>
        </button>
      </div>

      {/* Main Action Content */}
      <div className="my-2 space-y-2">
        <h2 id="today-action-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {selectedMode === 'standard_20' ? (title ?? 'Bắt đầu bài học hôm nay') : 'Micro-learning: 1 Âm IPA + 1 Câu Bỏ Túi'}
        </h2>
        <p className="text-white/80 text-sm leading-relaxed max-w-xl">
          {selectedMode === 'standard_20'
            ? (description ?? 'Khám phá kiến thức mới trước khi luyện tập. Bạn có thể dừng hoặc đổi nhịp bất cứ lúc nào.')
            : 'Dành riêng cho những ngày bận rộn. Chỉ 5 phút để giữ nhịp học êm đềm, không áp lực và không gián đoạn chuỗi tiến trình.'}
        </p>

        {/* Quick Mode Features preview */}
        <div className="pt-2 flex flex-wrap gap-3 text-xs text-indigo-100">
          {selectedMode === 'standard_20' ? (
            <>
              <span className="flex items-center gap-1">
                <span className="text-emerald-300">✓</span> Khẩu hình trực quan
              </span>
              <span className="flex items-center gap-1">
                <span className="text-emerald-300">✓</span> Ngữ pháp ForumFlash
              </span>
              <span className="flex items-center gap-1">
                <span className="text-emerald-300">✓</span> Thu âm đối chiếu
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1">
                <span className="text-emerald-300">✓</span> 1 Âm vị trọng tâm
              </span>
              <span className="flex items-center gap-1">
                <span className="text-emerald-300">✓</span> 1 Câu giao tiếp ngắn
              </span>
              <span className="flex items-center gap-1">
                <span className="text-emerald-300">✓</span> Giữ nhịp tâm lý vững vàng
              </span>
            </>
          )}
        </div>
      </div>

      {/* Bottom CTA & Controls */}
      <div className="next-card-bottom flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          {ctaHref ? (
            <Link
              href={selectedMode === 'light_5' ? '/lab/ipa' : ctaHref}
              className="dashboard-primary-link"
            >
              <span>{selectedMode === 'light_5' ? 'Vào ôn nhanh 5 phút' : (ctaText ?? 'Khám phá')}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          ) : onActionClick ? (
            <button
              type="button"
              className="dashboard-primary-link"
              disabled={isBusy}
              onClick={onActionClick}
            >
              <span>{selectedMode === 'light_5' ? 'Vào ôn nhanh 5 phút' : (ctaText ?? 'Khám phá')}</span>
              <span aria-hidden="true">↗</span>
            </button>
          ) : (
            <Link href={selectedMode === 'light_5' ? '/lab/ipa' : '/roadmap'} className="dashboard-primary-link">
              <span>{selectedMode === 'light_5' ? 'Vào ôn nhanh 5 phút' : 'Khám phá bài học'}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          )}

          <Link
            href="/roadmap"
            className="text-xs text-white/80 hover:text-white underline underline-offset-4 transition-colors"
          >
            Xem lộ trình 4 mốc
          </Link>
        </div>

        <span className="text-[11px] text-white/60">
          Bỏ qua / đổi nhịp học không bao giờ bị trừ điểm hay phán xét
        </span>
      </div>
    </section>
  );
}
