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
    sampleMeaning: 'nhìn thấy'
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
    sampleMeaning: 'ngồi'
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
    sampleMeaning: 'tên gọi'
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
    sampleMeaning: 'thì, là (động từ to be)'
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
    sampleMeaning: 'của tôi'
  }
];

export function IpaMouthStudio({ phonemes = DEFAULT_PHONEMES }: { phonemes?: PhonemeSpec[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = phonemes[activeIdx] ?? phonemes[0];

  if (!current) return null;

  return (
    <section className="card p-5 md:p-7 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
        <div>
          <span className="eyebrow text-indigo-600 font-bold tracking-wider text-xs uppercase">
            Phòng Lab Khẩu Hình IPA (1 Âm / Viewport)
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 mt-1">
            Khám phá khẩu hình chuẩn: <span className="text-indigo-600 font-mono">{current.symbol}</span>
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">{current.tag}</p>
        </div>

        {/* Thanh Tab chọn âm con thoi */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100/90 rounded-xl" role="tablist" aria-label="Danh sách âm IPA">
          {phonemes.map((p, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={p.symbol}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveIdx(idx)}
                className={`px-3 py-1.5 text-sm font-bold font-mono rounded-lg transition-all ${
                  isActive
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {p.symbol}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid 2 góc nhìn khẩu hình */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Góc nhìn 1: Mặt trước (Môi & Răng) */}
        <div className="flex flex-col items-center justify-between p-4 rounded-xl border border-pink-100 bg-pink-50/20 text-center">
          <div className="w-full flex items-center justify-between border-b border-pink-100/80 pb-2 mb-3">
            <span className="text-xs font-bold text-pink-700 uppercase tracking-wide">
              1. Nhìn Thẳng (Môi &amp; Răng)
            </span>
            <span className="text-xs text-slate-400">Front View</span>
          </div>
          <IpaFrontView ipa={current.symbol} />
          <p className="text-xs text-pink-900 font-medium mt-3 bg-white/80 px-3 py-1.5 rounded-lg border border-pink-200/60 w-full">
            {current.frontCaption}
          </p>
        </div>

        {/* Góc nhìn 2: Mặt cắt ngang (Lưỡi & Luồng hơi) */}
        <div className="flex flex-col items-center justify-between p-4 rounded-xl border border-indigo-100 bg-indigo-50/20 text-center">
          <div className="w-full flex items-center justify-between border-b border-indigo-100/80 pb-2 mb-3">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">
              2. Mặt Cắt Ngang (Lưỡi &amp; Hơi)
            </span>
            <span className="text-xs text-slate-400">Side View</span>
          </div>
          <IpaSideView ipa={current.symbol} />
          <p className="text-xs text-indigo-900 font-medium mt-3 bg-white/80 px-3 py-1.5 rounded-lg border border-indigo-200/60 w-full">
            {current.sideCaption}
          </p>
        </div>
      </div>

      {/* 3 Hướng dẫn kỹ thuật thuần HTML chống tràn viền */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5 text-sm">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
          <span className="font-bold text-slate-700 block text-xs uppercase text-slate-500 mb-1">
            👄 Vị trí Môi
          </span>
          <p className="text-slate-700 leading-snug">{current.mouthDesc}</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
          <span className="font-bold text-slate-700 block text-xs uppercase text-slate-500 mb-1">
            👅 Vị trí Lưỡi
          </span>
          <p className="text-slate-700 leading-snug">{current.tongueDesc}</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
          <span className="font-bold text-slate-700 block text-xs uppercase text-slate-500 mb-1">
            🔊 Dây Thanh Quản
          </span>
          <p className="text-slate-700 leading-snug">{current.voiceDesc}</p>
        </div>
      </div>

      {/* Từ vựng mẫu thực tế kèm Audio nút chuẩn & chậm */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-indigo-50/60 to-purple-50/60 border border-indigo-100">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-extrabold text-slate-900">{current.sampleWord}</span>
          <span className="font-mono text-indigo-700 font-bold bg-white px-2.5 py-1 rounded-md border border-indigo-200/70 text-sm">
            {current.sampleIpa}
          </span>
          <span className="text-sm text-slate-600">({current.sampleMeaning})</span>
        </div>

        <div className="flex items-center gap-2">
          <AudioButton text={current.sampleWord} />
        </div>
      </div>
    </section>
  );
}
