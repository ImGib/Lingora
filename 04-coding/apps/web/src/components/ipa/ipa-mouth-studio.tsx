'use client';

import React, { useState } from 'react';
import { IpaFrontView } from './ipa-front-view';
import { IpaSideView } from './ipa-side-view';
import { AudioButton } from '@/components/common/audio-button';

export interface PhonemeSpec {
  symbol: string;
  label: string;
  tag: string;
  mouthDesc: string;
  tongueDesc: string;
  voiceDesc: string;
  frontCaption: string;
  sideCaption: string;
  sampleWord: string;
  sampleIpa: string;
  sampleMeaning: string;
  isVoiced?: boolean | undefined;
  isLong?: boolean | undefined;
  vietnameseTip?: string | undefined;
  subCategory?: string | undefined;
}

const DEFAULT_PHONEMES: PhonemeSpec[] = [
  {
    symbol: '/iː/',
    label: 'Âm i dài (Cười tươi)',
    tag: 'Khẩu hình Căng ngang (Cười tươi)',
    mouthDesc: 'Kéo căng 2 khóe miệng sang ngang như đang mỉm cười',
    tongueDesc: 'Thân lưỡi nâng cao sát vòm miệng trên',
    voiceDesc: 'Rung dây thanh · Ngân dài 2 nhịp (i...)',
    frontCaption: '↔ Căng ngang 2 bên khóe miệng như đang cười',
    sideCaption: 'Lưỡi nâng cao sát vòm · Ngân dài 2 nhịp',
    sampleWord: 'see',
    sampleIpa: '/siː/',
    sampleMeaning: 'nhìn thấy',
    isVoiced: true,
    isLong: true,
    vietnameseTip: 'Người Việt hay đọc như chữ "i" ngắn trong "ti vi". Hãy kéo dẹt 2 khóe miệng sang 2 bên như đang cười và ngân dài 2 nhịp.'
  },
  {
    symbol: '/ɪ/',
    label: 'Âm i ngắn (Thả lỏng)',
    tag: 'Khẩu hình Thả lỏng (Mở hờ tự nhiên)',
    mouthDesc: 'Môi mở hờ tự nhiên, KHÔNG kéo căng sang hai bên',
    tongueDesc: 'Lưỡi hạ thấp hơn /iː/ một chút, cơ lưỡi thả lỏng',
    voiceDesc: 'Rung dây thanh · Phát âm cực gọn 1 nhịp',
    frontCaption: '↕ Môi mở hờ thả lỏng · Đọc dứt khoát 1 nhịp',
    sideCaption: 'Lưỡi ở tầm giữa · Thả lỏng cơ hàm',
    sampleWord: 'sit',
    sampleIpa: '/sɪt/',
    sampleMeaning: 'ngồi',
    isVoiced: true,
    isLong: false,
    vietnameseTip: 'Đừng đọc thành âm "i" kéo dài hay âm "ê". Giữ cơ miệng thả lỏng hoàn toàn, phát âm cực dứt khoát nửa nhịp.'
  },
  {
    symbol: '/eɪ/',
    label: 'Âm đôi /eɪ/ (ây)',
    tag: 'Khẩu hình Trượt đôi (Mở vừa ➔ Khép cười)',
    mouthDesc: 'Bắt đầu mở vừa đọc /e/ (ê), rồi trượt khép dần sang /ɪ/ (i)',
    tongueDesc: 'Lưỡi lướt mượt từ vị trí giữa miệng lên cao',
    voiceDesc: 'Nguyên âm đôi trượt mượt (ê ↷ i = ây)',
    frontCaption: '1. Mở vừa đọc /e/ ↷ 2. Khép cười sang /ɪ/',
    sideCaption: 'Thân lưỡi trượt nâng dần từ giữa lên cao',
    sampleWord: 'name',
    sampleIpa: '/neɪm/',
    sampleMeaning: 'tên gọi',
    isVoiced: true,
    vietnameseTip: 'Tránh đọc thành âm "nêm" hay "nêm-x" cứng nhắc. Hãy phát âm rõ độ trượt từ âm /e/ lướt sang âm /ɪ/ rồi ngậm môi /m/.'
  },
  {
    symbol: '/z/',
    label: 'Phụ âm /z/ (Rung kẽ răng)',
    tag: 'Khẩu hình Khép hờ Răng & Rung cổ họng',
    mouthDesc: 'Môi hé nhẹ tự nhiên để lộ hai hàm răng',
    tongueDesc: 'Hai hàm răng khép gần chạm nhau, đầu lưỡi sát chân răng trên',
    voiceDesc: 'Rung mạnh dây thanh quản ở cổ + luồng hơi xì qua kẽ răng (zzz)',
    frontCaption: '🦷 Hai hàm răng khép hờ · Xì hơi rung "zzz"',
    sideCaption: '〰 Đầu lưỡi sát răng cửa · Rung thanh quản',
    sampleWord: 'is',
    sampleIpa: '/ɪz/',
    sampleMeaning: 'thì, là (động từ to be)',
    isVoiced: true,
    vietnameseTip: 'Người Việt hay phát âm nhầm thành /s/ (không rung) hoặc âm "d" tiếng Việt. Hãy đặt tay lên cổ họng để cảm nhận độ rung mạnh.'
  },
  {
    symbol: '/m/',
    label: 'Phụ âm /m/ (Ngậm môi âm mũi)',
    tag: 'Khẩu hình Ngậm khép 2 môi (Âm mũi)',
    mouthDesc: 'Hai môi khép chạm nhẹ vào nhau ở cuối từ',
    tongueDesc: 'Lưỡi thả lỏng hoàn toàn bên trong khoang miệng',
    voiceDesc: 'Rung dây thanh, luồng hơi đi lên qua khoang mũi ("ừm")',
    frontCaption: '👄 Hai môi ngậm khép nhẹ vào nhau',
    sideCaption: '👃 Luồng hơi rung thoát ra qua khoang mũi',
    sampleWord: 'my',
    sampleIpa: '/maɪ/',
    sampleMeaning: 'của tôi',
    isVoiced: true,
    vietnameseTip: 'Khi /m/ đứng ở cuối từ (ví dụ: come, time), người Việt hay nuốt mất. Hãy luôn giữ ngậm chặt hai môi lại ở âm đuôi.'
  }
];

export interface IpaMouthStudioProps {
  phonemes?: PhonemeSpec[];
  activeSymbol?: string;
  onSelectSymbol?: (symbol: string) => void;
  hideTabs?: boolean;
  headerExtra?: React.ReactNode;
  className?: string;
}

export function IpaMouthStudio({
  phonemes = DEFAULT_PHONEMES,
  activeSymbol,
  onSelectSymbol,
  hideTabs = false,
  headerExtra,
  className = '',
}: IpaMouthStudioProps) {
  const [internalActiveIdx, setInternalActiveIdx] = useState(0);

  const activeIdx = activeSymbol
    ? Math.max(
        0,
        phonemes.findIndex((p) => p.symbol === activeSymbol)
      )
    : internalActiveIdx;

  const current = phonemes[activeIdx] ?? phonemes[0];

  if (!current) return null;

  const handleSelectTab = (symbol: string, idx: number) => {
    if (onSelectSymbol) {
      onSelectSymbol(symbol);
    } else {
      setInternalActiveIdx(idx);
    }
  };

  const shouldShowTabs = !hideTabs && phonemes.length > 1;

  return (
    <section
      className={`card p-5 sm:p-7 md:p-8 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-sm space-y-6 ${className}`.trim()}
    >
      {/* Header Studio */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="eyebrow text-indigo-600 font-bold tracking-wider text-xs uppercase">
              LINGORA PRONUNCIATION STUDIO
            </span>
            {current.isVoiced !== undefined && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  current.isVoiced
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {current.isVoiced ? '⚡ Hữu thanh (Rung cổ)' : '💨 Vô thanh (Bật hơi)'}
              </span>
            )}
            {current.isLong && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                ⏱️ Ngân dài (2 nhịp)
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight flex items-center gap-2.5">
            <span>Khẩu hình chuẩn:</span>
            <span className="font-mono text-indigo-600 bg-indigo-50/80 px-2.5 py-0.5 rounded-xl border border-indigo-200/80 shadow-2xs">
              {current.symbol}
            </span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">{current.tag}</p>
        </div>

        {/* Custom Header Controls (Prev/Next buttons, counters, etc.) */}
        {headerExtra}

        {/* Thanh Tab chọn âm nếu có nhiều âm */}
        {shouldShowTabs && (
          <div
            className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl"
            role="tablist"
            aria-label="Danh sách âm IPA"
          >
            {phonemes.map((p, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={p.symbol}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleSelectTab(p.symbol, idx)}
                  className={`px-3 py-1.5 text-xs font-bold font-mono rounded-xl transition-all ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {p.symbol}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid 2 góc nhìn khẩu hình giải phẫu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Góc nhìn 1: Mặt trước (Môi & Răng) */}
        <div className="flex flex-col items-center justify-between p-5 rounded-2xl border border-rose-100/90 bg-gradient-to-b from-rose-50/30 to-white text-center shadow-2xs">
          <div className="w-full flex items-center justify-between border-b border-rose-100/80 pb-2.5 mb-3">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wide flex items-center gap-1.5">
              <span>👄</span>
              <span>1. Nhìn Thẳng (Môi &amp; Răng)</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">Front View</span>
          </div>
          <IpaFrontView ipa={current.symbol} isVoiced={current.isVoiced ?? false} />
          <p className="text-xs text-rose-950 font-semibold mt-4 bg-white/95 px-3 py-2 rounded-xl border border-rose-200/70 shadow-2xs w-full leading-relaxed">
            {current.frontCaption}
          </p>
        </div>

        {/* Góc nhìn 2: Mặt cắt ngang (Lưỡi & Luồng hơi) */}
        <div className="flex flex-col items-center justify-between p-5 rounded-2xl border border-indigo-100/90 bg-gradient-to-b from-indigo-50/30 to-white text-center shadow-2xs">
          <div className="w-full flex items-center justify-between border-b border-indigo-100/80 pb-2.5 mb-3">
            <span className="text-xs font-bold text-indigo-800 uppercase tracking-wide flex items-center gap-1.5">
              <span>🔬</span>
              <span>2. Mặt Cắt Ngang (Lưỡi &amp; Hơi)</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">Side View</span>
          </div>
          <IpaSideView ipa={current.symbol} isVoiced={current.isVoiced ?? false} />
          <p className="text-xs text-indigo-950 font-semibold mt-4 bg-white/95 px-3 py-2 rounded-xl border border-indigo-200/70 shadow-2xs w-full leading-relaxed">
            {current.sideCaption}
          </p>
        </div>
      </div>

      {/* 3 Hướng dẫn kỹ thuật thuần HTML chống tràn viền */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
          <span className="font-extrabold text-slate-700 block text-xs uppercase mb-1.5 flex items-center gap-1">
            <span>👄</span>
            <span>Vị trí Môi</span>
          </span>
          <p className="text-slate-600 leading-relaxed font-medium">{current.mouthDesc}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
          <span className="font-extrabold text-slate-700 block text-xs uppercase mb-1.5 flex items-center gap-1">
            <span>👅</span>
            <span>Vị trí Lưỡi</span>
          </span>
          <p className="text-slate-600 leading-relaxed font-medium">{current.tongueDesc}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
          <span className="font-extrabold text-slate-700 block text-xs uppercase mb-1.5 flex items-center gap-1">
            <span>🔊</span>
            <span>Dây Thanh Quản</span>
          </span>
          <p className="text-slate-600 leading-relaxed font-medium">{current.voiceDesc}</p>
        </div>
      </div>

      {/* Thẻ Mẹo Thực Chiến Cho Người Việt (Vietnamese Learner Pitfall & Solution) */}
      {current.vietnameseTip && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-3">
          <span className="text-lg shrink-0 mt-0.5">💡</span>
          <div>
            <span className="font-extrabold uppercase tracking-wide text-amber-900 block mb-1">
              Mẹo phát âm thực chiến cho người Việt:
            </span>
            <p className="leading-relaxed text-amber-900 font-medium">
              {current.vietnameseTip}
            </p>
          </div>
        </div>
      )}

      {/* Từ vựng mẫu thực tế kèm Audio nút chuẩn 1.0x & chậm 0.75x */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-pink-50/50 border border-indigo-100/90 shadow-2xs">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {current.sampleWord}
          </span>
          <span className="font-mono text-indigo-700 font-bold bg-white px-3 py-1 rounded-xl border border-indigo-200/80 text-sm shadow-2xs">
            {current.sampleIpa}
          </span>
          <span className="text-xs sm:text-sm text-slate-600 font-medium">
            ({current.sampleMeaning})
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <AudioButton text={current.sampleWord} />
        </div>
      </div>
    </section>
  );
}
