'use client';

import { useEffect, useState } from 'react';
import { getGrowthStages } from '@/lib/api';

export interface GrowthStage {
  id: number;
  name: string;
  dayTag: string;
  icon: string;
  kicker: string;
  focus: string;
  desc: string;
}

export const GROWTH_STAGES: GrowthStage[] = [
  {
    id: 1,
    name: 'Hạt giống',
    dayTag: 'Ngày 1',
    icon: '🌱',
    kicker: 'NGÀY 1 · KHỞI ĐẦU TỰ TIN',
    focus: 'Gieo mầm 4 trụ cột thông tin cá nhân',
    desc: 'Làm quen với bạn đồng hành Linh, nhận diện cấu trúc Tên - Tuổi - Quốc gia - Nghề nghiệp trong tâm thế nhẹ nhàng.',
  },
  {
    id: 2,
    name: 'Nảy mầm',
    dayTag: 'Ngày 2',
    icon: '🌿',
    kicker: 'NGÀY 2 · MẢNH GHÉP CĂN BẢN',
    focus: 'Grammar Pieces: Động từ To Be & Dạng rút gọn',
    desc: 'Hiểu sâu cách gắn kết chủ ngữ với am / are / is, phản xạ nhận diện các dạng viết tắt I\'m, you\'re, he\'s.',
  },
  {
    id: 3,
    name: 'Thân cành',
    dayTag: 'Ngày 3',
    icon: '🪵',
    kicker: 'NGÀY 3 · NGHE & ĐỌC QUÉT',
    focus: 'Đánh vần tên quốc tế & Đọc lướt hồ sơ',
    desc: 'Lắng nghe Mai đánh vần họ tên và đọc quét nhanh thẻ hồ sơ quốc tế của Tom Baker mà không cần tra từ điển từng chữ.',
  },
  {
    id: 4,
    name: 'Phân nhánh',
    dayTag: 'Ngày 4',
    icon: '🪴',
    kicker: 'NGÀY 4 · TƯƠNG TÁC HAI CHIỀU',
    focus: 'Làm chủ 3 câu hỏi Wh- & Câu hỏi đảo Yes/No',
    desc: 'Phản xạ hỏi đáp với What / Where / Who và ngữ điệu lên giọng cuối câu hỏi Yes/No để duy trì cuộc trò chuyện tự nhiên.',
  },
  {
    id: 5,
    name: 'Ra lá',
    dayTag: 'Ngày 5',
    icon: '🍃',
    kicker: 'NGÀY 5 · HIỆN THỰC HOÁ KẾT QUẢ',
    focus: 'Tự viết profile & Thu âm giọng nói đầu tiên',
    desc: 'Tự tay viết 3-5 câu giới thiệu bản thân và ghi âm giọng nói tiếng Anh đầu tiên làm kỷ niệm cột mốc đáng nhớ.',
  },
  {
    id: 6,
    name: 'Kết trái',
    dayTag: 'Ngày 6–7',
    icon: '🍎',
    kicker: 'NGÀY 6 & 7 · CHUYỂN GIAO & HOÀN THÀNH',
    focus: 'Chuyển giao tình huống thực tế & Thu hoạch Tuần 1',
    desc: 'Tự tin nhắn tin làm quen Carlos và giới thiệu đồng nghiệp mới. Trái ngọt tri thức đơm hoa cho toàn bộ Tuần 1.',
  },
];

interface GrowthTreeCardProps {
  completedCount?: number;
  totalCount?: number;
}

export function GrowthTreeIllustration({ stage }: { stage: number }) {
  return (
    <div className="growth-tree-illustration-shell" aria-hidden="true">
      <svg
        viewBox="0 0 320 205"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="growth-tree-svg"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ecfdf5" />
            <stop offset="55%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
          <radialGradient id="sunGlow" cx="50%" cy="28%" r="58%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#d1fae5" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="magicAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fde68a" stopOpacity="0.75" />
            <stop offset="55%" stopColor="#6ee7b7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hillBack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d1fae5" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ecfdf5" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="leafDeep" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>
          <linearGradient id="leafMid" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="leafLight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a7f3d0" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="stemGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="45%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <linearGradient id="rootGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="potBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#f5f3ff" />
            <stop offset="100%" stopColor="#e9d5ff" />
          </linearGradient>
          <linearGradient id="potRim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#faf5ff" />
            <stop offset="100%" stopColor="#ede9fe" />
          </linearGradient>
          <linearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6c4731" />
            <stop offset="100%" stopColor="#361f12" />
          </linearGradient>
          <radialGradient id="seedGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#92400e" />
          </radialGradient>
          <radialGradient id="goldFruitGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="35%" stopColor="#fde047" />
            <stop offset="75%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </radialGradient>
          <radialGradient id="rubyFruitGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffe4e6" />
            <stop offset="35%" stopColor="#fb7185" />
            <stop offset="80%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#881337" />
          </radialGradient>
          <filter id="softGlow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="dropShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#064e3b" floodOpacity="0.14" />
          </filter>
        </defs>

        {/* Sanctuary Sky & Distant Botanical Hills */}
        <rect width="320" height="205" rx="18" fill="url(#skyGrad)" />
        <circle cx="160" cy="58" r="88" fill="url(#sunGlow)" />
        <path d="M 0 155 Q 75 132 165 148 T 320 142 L 320 205 L 0 205 Z" fill="url(#hillBack)" />
        <path d="M 0 166 Q 110 146 215 158 T 320 154 L 320 205 L 0 205 Z" fill="#d1fae5" opacity="0.35" />

        {/* Distant Atmospheric Aura Particles */}
        <g className="tree-dust-particles" opacity="0.75">
          <circle cx="56" cy="52" r="2" fill="#34d399" />
          <circle cx="262" cy="46" r="1.8" fill="#fbbf24" />
          <circle cx="78" cy="96" r="2.2" fill="#6ee7b7" />
          <circle cx="244" cy="88" r="2.2" fill="#34d399" />
          <circle cx="118" cy="30" r="1.5" fill="#fbbf24" />
          <circle cx="204" cy="28" r="1.5" fill="#a7f3d0" />
        </g>

        {/* Artisan Ceramic Terrarium Planter */}
        <g id="pot-group">
          <ellipse cx="160" cy="193" rx="84" ry="7.5" fill="#1e1b2e" opacity="0.09" />
          <path
            d="M 92 153 L 105 184 C 107.5 189 113 192 120 192 L 200 192 C 207 192 212.5 189 215 184 L 228 153 Z"
            fill="url(#potBody)"
            stroke="#d8b4fe"
            strokeWidth="1.4"
          />
          <path d="M 99 169 Q 160 175 221 169" stroke="#ddd6fe" strokeWidth="2" fill="none" />
          <path d="M 102 175 Q 160 181 218 175" stroke="#fde68a" strokeWidth="1.2" fill="none" opacity="0.8" />
          <rect
            x="86"
            y="145"
            width="148"
            height="10"
            rx="5"
            fill="url(#potRim)"
            stroke="#d8b4fe"
            strokeWidth="1.4"
          />
          <path d="M 92 150 Q 160 141 228 150 Q 160 158 92 150 Z" fill="url(#soilGrad)" />
          <ellipse cx="116" cy="150" rx="14" ry="3.5" fill="#10b981" opacity="0.55" />
          <ellipse cx="202" cy="151" rx="16" ry="3.5" fill="#059669" opacity="0.5" />
          <circle cx="142" cy="151" r="1.3" fill="#d6d3d1" opacity="0.6" />
          <circle cx="178" cy="149" r="1.5" fill="#fde68a" opacity="0.5" />
        </g>

        {/* STAGE-SPECIFIC LIVING BOTANICAL CONTENT */}
        {stage === 1 && (
          <g id="stage-1-seed" className="tree-anim-fade-in tree-stage-group">
            <ellipse cx="160" cy="148" rx="28" ry="12" fill="url(#magicAura)" opacity="0.65" filter="url(#softGlow)" />
            <path d="M 160 154 C 157 166 163 176 159 186" stroke="url(#rootGrad)" strokeWidth="2.2" strokeLinecap="round" fill="none" strokeDasharray="4 2" />
            <path d="M 159 163 C 150 169 144 175 140 182" stroke="url(#rootGrad)" strokeWidth="1.6" strokeLinecap="round" fill="none" strokeDasharray="3 2" />
            <path d="M 161 167 C 169 172 174 177 177 183" stroke="url(#rootGrad)" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeDasharray="3 2" />
            <path d="M 138 149 Q 160 142 182 149 Q 160 154 138 149 Z" fill="#432818" opacity="0.85" />
            <g transform="translate(160, 142) rotate(-10)">
              <ellipse cx="0" cy="2" rx="11" ry="14" fill="url(#seedGrad)" filter="url(#dropShadow)" />
              <path d="M -11 -2 C -11 -10 11 -10 11 -2 C 7 1 -7 1 -11 -2 Z" fill="#78350f" />
              <path d="M 0 -10 L 0 -15" stroke="#78350f" strokeWidth="2.2" strokeLinecap="round" />
              <ellipse cx="-3.5" cy="1" rx="3" ry="5.5" fill="#fef9c3" opacity="0.55" transform="rotate(-12 -3.5 1)" />
            </g>
            <path d="M 162 128 C 164 121 171 119 173 123 C 170 127 165 129 162 128 Z" fill="url(#leafLight)" filter="url(#softGlow)" />
            <circle cx="163" cy="120" r="2.5" fill="#ffffff" filter="url(#softGlow)" />
            <path d="M 152 118 L 150 113 M 163 113 L 163 107 M 174 118 L 177 113" stroke="#fbbf24" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
          </g>
        )}

        {stage === 2 && (
          <g id="stage-2-sprout" className="tree-anim-fade-in tree-stage-group">
            <ellipse cx="160" cy="148" rx="34" ry="12" fill="url(#magicAura)" opacity="0.5" />
            <path d="M 160 154 C 154 166 146 177 140 186 M 160 154 C 166 167 174 178 180 186 M 160 154 L 160 188" stroke="url(#rootGrad)" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 160 150 C 156 134 165 116 160 96" stroke="url(#stemGrad)" strokeWidth="4.5" strokeLinecap="round" fill="none" filter="url(#dropShadow)" />
            <g transform="translate(159, 104) rotate(-8)">
              <path d="M 0 0 C -14 -18 -38 -14 -42 2 C -34 16 -12 14 0 0 Z" fill="url(#leafMid)" filter="url(#dropShadow)" />
              <path d="M 0 0 C -14 -6 -28 -5 -38 2" stroke="#a7f3d0" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.85" />
            </g>
            <g transform="translate(161, 98) rotate(6)">
              <path d="M 0 0 C 14 -20 40 -16 44 0 C 36 16 14 14 0 0 Z" fill="url(#leafLight)" filter="url(#dropShadow)" />
              <path d="M 0 0 C 15 -7 29 -6 40 0" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.85" />
            </g>
            <path d="M 160 97 C 155 86 160 78 160 78 C 160 78 165 86 160 97 Z" fill="#6ee7b7" />
            <circle cx="126" cy="108" r="3" fill="#e0f2fe" filter="url(#softGlow)" />
            <circle cx="125" cy="107" r="1.2" fill="#ffffff" />
            <circle cx="160" cy="73" r="2.5" fill="#fef08a" filter="url(#softGlow)" />
          </g>
        )}

        {stage === 3 && (
          <g id="stage-3-sapling" className="tree-anim-fade-in tree-stage-group">
            <path d="M 160 154 C 150 167 138 178 128 187 M 160 154 C 170 167 182 178 192 187 M 160 156 L 160 189" stroke="url(#rootGrad)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            <path d="M 154 151 C 156 128 158 102 158 72 L 162 72 C 162 102 164 128 166 151 Z" fill="url(#trunkGrad)" filter="url(#dropShadow)" />
            <path d="M 158 118 Q 142 110 132 98" stroke="url(#trunkGrad)" strokeWidth="3.8" strokeLinecap="round" fill="none" />
            <path d="M 162 108 Q 178 100 188 88" stroke="url(#trunkGrad)" strokeWidth="3.8" strokeLinecap="round" fill="none" />
            <g transform="translate(132, 98)">
              <ellipse cx="-8" cy="-4" rx="18" ry="11" transform="rotate(-22 -8 -4)" fill="url(#leafDeep)" />
              <ellipse cx="2" cy="-9" rx="15" ry="9.5" transform="rotate(-10 2 -9)" fill="url(#leafMid)" />
              <path d="M 4 2 Q -6 -4 -18 -7" stroke="#6ee7b7" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />
            </g>
            <g transform="translate(188, 88)">
              <ellipse cx="8" cy="-4" rx="18" ry="11" transform="rotate(22 8 -4)" fill="url(#leafDeep)" />
              <ellipse cx="-2" cy="-9" rx="15" ry="9.5" transform="rotate(10 -2 -9)" fill="url(#leafLight)" />
              <path d="M -4 2 Q 6 -4 18 -7" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />
            </g>
            <g transform="translate(160, 68)">
              <ellipse cx="0" cy="0" rx="26" ry="18" fill="url(#leafMid)" filter="url(#dropShadow)" />
              <ellipse cx="-8" cy="-5" rx="18" ry="12" fill="url(#leafLight)" />
              <ellipse cx="10" cy="-3" rx="16" ry="11" fill="url(#leafLight)" opacity="0.9" />
              <circle cx="0" cy="-22" r="2.8" fill="#fef08a" filter="url(#softGlow)" />
            </g>
          </g>
        )}

        {stage === 4 && (
          <g id="stage-4-branching" className="tree-anim-fade-in tree-stage-group">
            <path d="M 160 154 C 146 168 130 179 118 188 M 160 154 C 174 168 190 179 202 188 M 155 158 C 152 172 148 182 144 189 M 165 158 C 168 172 172 182 176 189" stroke="url(#rootGrad)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
            <ellipse cx="118" cy="84" rx="26" ry="19" fill="url(#leafDeep)" />
            <ellipse cx="202" cy="82" rx="26" ry="19" fill="url(#leafDeep)" />
            <ellipse cx="160" cy="58" rx="34" ry="24" fill="url(#leafDeep)" />
            <path d="M 151 151 C 153 128 155 108 156 92 L 164 92 C 165 108 167 128 169 151 Z" fill="url(#trunkGrad)" filter="url(#dropShadow)" />
            <path d="M 158 104 C 144 96 128 88 114 78" stroke="url(#trunkGrad)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <path d="M 162 102 C 176 94 192 86 206 76" stroke="url(#trunkGrad)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <path d="M 160 96 L 160 58" stroke="url(#trunkGrad)" strokeWidth="5" strokeLinecap="round" fill="none" />
            <ellipse cx="112" cy="78" rx="24" ry="17" fill="url(#leafMid)" filter="url(#dropShadow)" />
            <ellipse cx="120" cy="72" rx="17" ry="12" fill="url(#leafLight)" />
            <ellipse cx="208" cy="76" rx="24" ry="17" fill="url(#leafMid)" filter="url(#dropShadow)" />
            <ellipse cx="200" cy="70" rx="17" ry="12" fill="url(#leafLight)" />
            <ellipse cx="160" cy="54" rx="32" ry="22" fill="url(#leafMid)" filter="url(#dropShadow)" />
            <ellipse cx="154" cy="47" rx="22" ry="15" fill="url(#leafLight)" />
            <ellipse cx="170" cy="49" rx="18" ry="12" fill="#a7f3d0" opacity="0.75" />
            <circle cx="102" cy="72" r="3" fill="#fbcfe8" />
            <circle cx="216" cy="70" r="3" fill="#fbcfe8" />
            <circle cx="160" cy="36" r="3.5" fill="#fef08a" filter="url(#softGlow)" />
          </g>
        )}

        {stage === 5 && (
          <g id="stage-5-foliage" className="tree-anim-fade-in tree-stage-group">
            <path d="M 160 154 C 142 169 124 180 110 189 M 160 154 C 178 169 196 180 210 189 M 152 158 C 147 173 141 183 136 190 M 168 158 C 173 173 179 183 184 190" stroke="url(#rootGrad)" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <ellipse cx="160" cy="64" rx="68" ry="42" fill="url(#leafDeep)" filter="url(#dropShadow)" />
            <ellipse cx="106" cy="76" rx="34" ry="25" fill="url(#leafDeep)" />
            <ellipse cx="214" cy="74" rx="34" ry="25" fill="url(#leafDeep)" />
            <path d="M 147 152 C 151 128 154 106 155 86 L 165 86 C 166 106 169 128 173 152 Z" fill="url(#trunkGrad)" filter="url(#dropShadow)" />
            <path d="M 156 146 L 158 105" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            <path d="M 157 98 C 138 88 120 78 104 68" stroke="url(#trunkGrad)" strokeWidth="6.5" strokeLinecap="round" fill="none" />
            <path d="M 163 96 C 182 86 200 76 216 66" stroke="url(#trunkGrad)" strokeWidth="6.5" strokeLinecap="round" fill="none" />
            <path d="M 160 90 L 160 48" stroke="url(#trunkGrad)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <ellipse cx="108" cy="70" rx="32" ry="23" fill="url(#leafMid)" />
            <ellipse cx="212" cy="68" rx="32" ry="23" fill="url(#leafMid)" />
            <ellipse cx="160" cy="52" rx="44" ry="30" fill="url(#leafMid)" />
            <ellipse cx="134" cy="74" rx="28" ry="20" fill="url(#leafMid)" />
            <ellipse cx="186" cy="72" rx="28" ry="20" fill="url(#leafMid)" />
            <ellipse cx="136" cy="46" rx="26" ry="18" fill="url(#leafLight)" />
            <ellipse cx="184" cy="45" rx="26" ry="18" fill="url(#leafLight)" />
            <ellipse cx="104" cy="62" rx="20" ry="14" fill="url(#leafLight)" />
            <ellipse cx="216" cy="60" rx="20" ry="14" fill="url(#leafLight)" />
            <ellipse cx="160" cy="36" rx="24" ry="16" fill="#a7f3d0" />
            <g transform="translate(114, 56)"><circle cx="0" cy="0" r="4.5" fill="#fdf2f8" /><circle cx="0" cy="0" r="2" fill="#f472b6" /></g>
            <g transform="translate(148, 36)"><circle cx="0" cy="0" r="5" fill="#fdf2f8" /><circle cx="0" cy="0" r="2.2" fill="#fbbf24" /></g>
            <g transform="translate(196, 52)"><circle cx="0" cy="0" r="4.5" fill="#fdf2f8" /><circle cx="0" cy="0" r="2" fill="#f472b6" /></g>
            <g transform="translate(168, 66)"><circle cx="0" cy="0" r="4" fill="#fdf2f8" /><circle cx="0" cy="0" r="1.8" fill="#fbbf24" /></g>
          </g>
        )}

        {stage === 6 && (
          <g id="stage-6-fruit" className="tree-anim-fade-in tree-stage-group">
            <circle cx="160" cy="58" r="76" fill="url(#magicAura)" opacity="0.75" />
            <path d="M 160 154 C 138 170 118 181 104 190 M 160 154 C 182 170 202 181 216 190 M 150 158 C 144 174 138 184 132 190 M 170 158 C 176 174 182 184 188 190" stroke="url(#rootGrad)" strokeWidth="3" strokeLinecap="round" fill="none" />
            <ellipse cx="160" cy="62" rx="74" ry="45" fill="url(#leafDeep)" filter="url(#dropShadow)" />
            <ellipse cx="100" cy="74" rx="36" ry="26" fill="url(#leafDeep)" />
            <ellipse cx="220" cy="72" rx="36" ry="26" fill="url(#leafDeep)" />
            <path d="M 144 152 C 149 126 153 104 154 84 L 166 84 C 167 104 171 126 176 152 Z" fill="url(#trunkGrad)" filter="url(#dropShadow)" />
            <path d="M 155 146 C 157 128 158 112 158 95" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" opacity="0.55" fill="none" />
            <path d="M 156 96 C 134 86 114 75 96 64" stroke="url(#trunkGrad)" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M 164 94 C 186 84 206 73 224 62" stroke="url(#trunkGrad)" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M 160 88 L 160 44" stroke="url(#trunkGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
            <ellipse cx="102" cy="68" rx="34" ry="24" fill="url(#leafMid)" />
            <ellipse cx="218" cy="66" rx="34" ry="24" fill="url(#leafMid)" />
            <ellipse cx="160" cy="48" rx="48" ry="32" fill="url(#leafMid)" />
            <ellipse cx="132" cy="72" rx="30" ry="22" fill="url(#leafMid)" />
            <ellipse cx="188" cy="70" rx="30" ry="22" fill="url(#leafMid)" />
            <ellipse cx="132" cy="42" rx="28" ry="19" fill="url(#leafLight)" />
            <ellipse cx="188" cy="41" rx="28" ry="19" fill="url(#leafLight)" />
            <ellipse cx="98" cy="58" rx="22" ry="15" fill="url(#leafLight)" />
            <ellipse cx="222" cy="56" rx="22" ry="15" fill="url(#leafLight)" />
            <ellipse cx="160" cy="32" rx="26" ry="17" fill="#a7f3d0" />
            <g transform="translate(94, 68)" filter="url(#dropShadow)">
              <circle cx="0" cy="0" r="6.5" fill="url(#goldFruitGrad)" /><circle cx="-2" cy="-2" r="2" fill="#ffffff" opacity="0.9" />
            </g>
            <g transform="translate(120, 44)" filter="url(#dropShadow)">
              <circle cx="0" cy="0" r="7" fill="url(#rubyFruitGrad)" /><circle cx="-2" cy="-2" r="2.2" fill="#ffffff" opacity="0.9" />
            </g>
            <g transform="translate(160, 24)" filter="url(#dropShadow)">
              <circle cx="0" cy="0" r="8" fill="url(#goldFruitGrad)" /><circle cx="-2.4" cy="-2.4" r="2.5" fill="#ffffff" opacity="0.95" />
              <path d="M 0 -15 L 2 -10 L 7 -10 L 3 -7 L 4.5 -2 L 0 -5 L -4.5 -2 L -3 -7 L -7 -10 L -2 -10 Z" fill="#fbbf24" />
            </g>
            <g transform="translate(200, 42)" filter="url(#dropShadow)">
              <circle cx="0" cy="0" r="7" fill="url(#rubyFruitGrad)" /><circle cx="-2" cy="-2" r="2.2" fill="#ffffff" opacity="0.9" />
            </g>
            <g transform="translate(226, 66)" filter="url(#dropShadow)">
              <circle cx="0" cy="0" r="6.5" fill="url(#goldFruitGrad)" /><circle cx="-2" cy="-2" r="2" fill="#ffffff" opacity="0.9" />
            </g>
            <g transform="translate(160, 66)" filter="url(#dropShadow)">
              <circle cx="0" cy="0" r="7.5" fill="url(#rubyFruitGrad)" /><circle cx="-2.2" cy="-2.2" r="2.2" fill="#ffffff" opacity="0.9" />
            </g>
            <circle cx="84" cy="36" r="2" fill="#fbbf24" filter="url(#softGlow)" />
            <circle cx="236" cy="34" r="2" fill="#fbbf24" filter="url(#softGlow)" />
            <circle cx="128" cy="16" r="1.8" fill="#fde047" />
            <circle cx="192" cy="16" r="1.8" fill="#fde047" />
          </g>
        )}
      </svg>
    </div>
  );
}

export function GrowthTreeCard({ completedCount = 0, totalCount = 7 }: GrowthTreeCardProps) {
  const [stages, setStages] = useState<GrowthStage[]>(GROWTH_STAGES);

  useEffect(() => {
    getGrowthStages()
      .then((data) => {
        if (data && data.length > 0) {
          setStages(data as unknown as GrowthStage[]);
        }
      })
      .catch((err) => {
        console.warn('Could not load dynamic growth stages from DB, using fallback:', err);
      });
  }, []);
  // Current natural stage derived from completed items (1 to 6)
  const naturalStage = Math.min(6, Math.max(1, Math.floor((completedCount / Math.max(totalCount, 1)) * 5) + 1));
  const [inspectedStage, setInspectedStage] = useState<number | null>(null);

  const activeStageId = inspectedStage ?? naturalStage;
  const currentStage: GrowthStage = stages.find((s) => s.id === activeStageId) ?? stages[0]!;
  const isPreviewing = inspectedStage !== null && inspectedStage !== naturalStage;

  return (
    <section className="growth-tree-card-v2" aria-label="Cây tiến độ học tập">
      {/* Header with Title, Tag, and Stage Pill */}
      <div className="growth-tree-header">
        <div>
          <div className="growth-tree-kicker-row">
            <span className="growth-tree-dot" aria-hidden="true" />
            <p className="growth-tree-kicker">CÂY TIẾN ĐỘ · KHU VƯỜN TRI THỨC</p>
          </div>
          <h2 className="growth-tree-title">Hành trình gieo mầm Tuần 1</h2>
        </div>
        <div className="growth-tree-header-badge">
          <span className="growth-stage-pill">
            <span className="growth-stage-pill-ico" aria-hidden="true">{currentStage.icon}</span> GĐ {currentStage.id}: {currentStage.name}
          </span>
        </div>
      </div>

      {/* Centerpiece: Living SVG Illustration */}
      <div className="growth-tree-visual-container">
        <div className="growth-tree-stage-ribbon">
          <span className="ribbon-stage-num">Mốc 0{currentStage.id}/06</span>
          <span className={`ribbon-stage-state ${activeStageId < naturalStage ? 'done' : activeStageId === naturalStage ? 'current' : 'preview'}`}>
            {activeStageId < naturalStage ? '✓ Đã đạt được' : activeStageId === naturalStage ? '● Đang nuôi dưỡng' : '👁 Xem trước cột mốc'}
          </span>
        </div>

        <GrowthTreeIllustration stage={activeStageId} />

        <div className="growth-tree-caption-overlay">
          <div className="growth-tree-caption-top">
            <span className="growth-tree-caption-tag">{currentStage.kicker}</span>
          </div>
          <h3 className="growth-tree-caption-focus">{currentStage.focus}</h3>
          <p className="growth-tree-caption-desc">{currentStage.desc}</p>
        </div>
      </div>

      {/* Nutrient Progress Indicator */}
      <div className="growth-tree-nutrient-bar-wrap">
        <div className="growth-tree-nutrient-info">
          <span className="growth-tree-nutrient-label">
            <span className="water-drop-icon" aria-hidden="true">💧</span> Dưỡng chất tích luỹ: <strong>{completedCount}/{totalCount} ngày</strong>
          </span>
          <span className="growth-tree-nutrient-status">
            {completedCount >= totalCount ? 'Trái chín mọng 🌟' : naturalStage === 1 ? 'Mới gieo mầm 🌱' : `GĐ ${naturalStage} đang vươn lên`}
          </span>
        </div>
        <div className="growth-tree-track-rail">
          <div
            className="growth-tree-track-fill"
            style={{ width: `${Math.min(100, Math.max(8, (completedCount / totalCount) * 100))}%` }}
          />
          <div className="growth-tree-track-ticks" aria-hidden="true">
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <span key={d} className="track-tick" />
            ))}
          </div>
        </div>
      </div>

      {/* 6 Stage Interactive Milestone Stepper */}
      <div className="growth-tree-steps-container">
        <div className="growth-tree-steps-header">
          <span className="steps-header-title">6 CỘT MỐC PHÁT TRIỂN · <small>Chạm để xem chi tiết</small></span>
          {isPreviewing && (
            <button
              type="button"
              className="growth-tree-back-current"
              onClick={() => setInspectedStage(null)}
            >
              Quay lại mốc hiện tại ↩
            </button>
          )}
        </div>

        <ol className="growth-tree-step-pills" role="list">
          {stages.map((st) => {
            const isDone = st.id < naturalStage;
            const isCurrent = st.id === naturalStage;
            const isSelected = st.id === activeStageId;
            const stateText = isDone ? 'Đã mở' : isCurrent ? 'Hiện tại' : st.dayTag;

            return (
              <li key={st.id} className="growth-tree-step-pill-wrapper">
                <button
                  type="button"
                  className={`growth-tree-step-btn ${isDone ? 'is-done' : ''} ${isCurrent ? 'is-current' : ''} ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => setInspectedStage(st.id)}
                  title={`Xem mốc ${st.id}: ${st.name} (${st.dayTag})`}
                  aria-pressed={isSelected}
                >
                  <span className="step-btn-top">
                    <span className="step-btn-badge">
                      {isDone ? '✓' : `0${st.id}`}
                    </span>
                    <span className="step-btn-icon" aria-hidden="true">{st.icon}</span>
                  </span>
                  <span className="step-btn-name">{st.name}</span>
                  <span className="step-btn-sub">{stateText}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Gentle Lingora Philosophy Footnote */}
      <p className="growth-tree-footnote">
        <span aria-hidden="true">🌿</span> Cây lớn dần theo nhịp học đều đặn của bạn. Dù nghỉ vài hôm cây vẫn đợi bạn tưới nước, không héo tàn hay phạt điểm.
      </p>
    </section>
  );
}
