'use client';

import React, { useState, useMemo } from 'react';
import { GrammarTable } from './grammar-table';
import { GrammarSentenceBreakdown, type GrammarBreakdownItem } from './grammar-sentence-breakdown';
import { GrammarPracticeCard, type GrammarQuizQuestion } from './grammar-practice-card';
import { getQuizForTopic } from './grammar-quiz-bank';
import { Button, Badge, Card } from '@/components/ui';

export interface GrammarFunctionItem {
  title: string;
  explanation: string;
  exampleEn: string;
  exampleVi: string;
}

export interface GrammarStructureItem {
  form: 'affirmative' | 'negative' | 'interrogative';
  label: string;
  formula: string;
  example: string;
}

export interface GrammarMasterclassProps {
  topicId?: string | undefined;
  title: string;
  tagline: string;
  coreConcept: string;
  functions: GrammarFunctionItem[];
  tableHeaders: string[];
  tableRows: string[][];
  tableNote?: string;
  structures: GrammarStructureItem[];
  detectionClues: string[];
  sentenceBreakdowns: GrammarBreakdownItem[];
  quizQuestions?: GrammarQuizQuestion[] | undefined;

  // Navigation & Context Meta
  milestone?: string | undefined;
  category?: string | undefined;
  bandTarget?: string | undefined;
  currentIndex?: number | undefined;
  totalCount?: number | undefined;
  onPrevTopic?: (() => void) | undefined;
  onNextTopic?: (() => void) | undefined;
  hasPrevTopic?: boolean | undefined;
  hasNextTopic?: boolean | undefined;
  prevTopicTitle?: string | undefined;
  nextTopicTitle?: string | undefined;
}

type SectionKey = 'concept' | 'functions' | 'conjugation' | 'structures' | 'clues' | 'breakdown' | 'practice';

interface SectionConfig {
  key: SectionKey;
  num: number;
  id: string;
  shortLabel: string;
  fullLabel: string;
  icon: string;
}

const SECTIONS: SectionConfig[] = [
  { key: 'concept', num: 1, id: 'gm-sec-concept', shortLabel: 'Bản chất', fullLabel: 'Khái Niệm & Bản Chất', icon: '💡' },
  { key: 'functions', num: 2, id: 'gm-sec-functions', shortLabel: 'Chức năng', fullLabel: 'Chức Năng & Ví Dụ', icon: '🎯' },
  { key: 'conjugation', num: 3, id: 'gm-sec-conjugation', shortLabel: 'Chia ngôi', fullLabel: 'Bảng Chia Ngôi', icon: '📊' },
  { key: 'structures', num: 4, id: 'gm-sec-structures', shortLabel: '3 Thể', fullLabel: 'Cấu Trúc 3 Thể (+/-)', icon: '⚖️' },
  { key: 'clues', num: 5, id: 'gm-sec-clues', shortLabel: 'Dấu hiệu', fullLabel: 'Dấu Hiệu Nhận Biết', icon: '🔍' },
  { key: 'breakdown', num: 6, id: 'gm-sec-breakdown', shortLabel: 'Mổ xẻ', fullLabel: 'Mổ Xẻ Cú Pháp Câu', icon: '🧩' },
  { key: 'practice', num: 7, id: 'gm-sec-practice', shortLabel: 'Luyện đề', fullLabel: 'Đề Ôn Tập & Thực Chiến', icon: '📝' },
];

export function GrammarMasterclass({
  topicId,
  title,
  tagline,
  coreConcept,
  functions,
  tableHeaders,
  tableRows,
  tableNote,
  structures,
  detectionClues,
  sentenceBreakdowns,
  quizQuestions,
  milestone,
  category,
  bandTarget,
  currentIndex,
  totalCount,
  onPrevTopic,
  onNextTopic,
  hasPrevTopic,
  hasNextTopic,
  prevTopicTitle,
  nextTopicTitle,
}: GrammarMasterclassProps) {
  // 'all' = cuộn liền mạch với sticky jump pills; 'tab' = chỉ hiển thị 1 phần để zero-scroll hoàn toàn
  const [viewMode, setViewMode] = useState<'all' | 'tab'>('all');
  const [activeTab, setActiveTab] = useState<SectionKey>('concept');

  const resolvedQuestions = useMemo(() => {
    if (quizQuestions && quizQuestions.length > 0) return quizQuestions;
    if (topicId) return getQuizForTopic(topicId);
    return [];
  }, [quizQuestions, topicId]);

  const scrollToSection = (id: string, key: SectionKey) => {
    setActiveTab(key);
    if (viewMode === 'tab') {
      // Ở chế độ Tab, chuyển tab là nội dung tự đổi trong 1 khung nhìn
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    const el = document.getElementById('gm-masterclass-top');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Chuyển nhanh giữa các tab khi ở chế độ Tab Focus
  const currentTabIdx = SECTIONS.findIndex((s) => s.key === activeTab);
  const handlePrevTab = () => {
    if (currentTabIdx > 0) {
      const prev = SECTIONS[currentTabIdx - 1];
      if (prev) setActiveTab(prev.key);
    }
  };
  const handleNextTab = () => {
    if (currentTabIdx < SECTIONS.length - 1) {
      const next = SECTIONS[currentTabIdx + 1];
      if (next) setActiveTab(next.key);
    }
  };

  return (
    <Card
      id="gm-masterclass-top"
      variant="default"
      className="p-5 sm:p-7 md:p-8 scroll-mt-6 space-y-6"
    >
      {/* Header Chuyên Đề & Điều hướng nhanh */}
      <div className="border-b border-slate-100 pb-5 space-y-3">
        {/* Harmonious Metadata Bar & Navigation Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 text-slate-700 font-semibold flex-wrap">
            {milestone && <span className="font-bold text-indigo-700">{milestone}</span>}
            <span className="text-slate-300">•</span>
            {category && <span>{category}</span>}
            <span className="text-slate-300">•</span>
            {bandTarget && <span className="text-emerald-700 font-bold">{bandTarget}</span>}
            {typeof currentIndex === 'number' && typeof totalCount === 'number' && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-mono text-[11px]">Chuyên đề {currentIndex + 1}/{totalCount}</span>
              </>
            )}
          </div>

          {/* Quick Prev / Next Topic on Top (Desktop Only to prevent redundancy with mobile bar) */}
          <div className="hidden lg:flex items-center gap-2 ml-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={onPrevTopic}
              disabled={!hasPrevTopic}
              aria-label="Chuyên đề trước"
              leftIcon={<span>←</span>}
            >
              <span>Trước</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onNextTopic}
              disabled={!hasNextTopic}
              aria-label="Chuyên đề sau"
              rightIcon={<span>→</span>}
            >
              <span>Tiếp</span>
            </Button>
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="pt-1">
          <span className="eyebrow text-indigo-600 font-bold tracking-wider text-[11px] uppercase block mb-1">
            CHUYÊN ĐỀ NGỮ PHÁP 6 PHẦN CHUYÊN SÂU
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5 leading-relaxed max-w-3xl">{tagline}</p>
        </div>
      </div>

      {/* Sticky Section Quick Jump Bar & View Mode Switcher */}
      <div className="sticky top-2 z-20 bg-white/95 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        {/* Section Jump Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none text-xs">
          {SECTIONS.map((sec) => {
            const isActive = activeTab === sec.key;
            return (
              <button
                key={sec.key}
                type="button"
                onClick={() => scrollToSection(sec.id, sec.key)}
                className={`whitespace-nowrap px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 min-h-[36px] ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                <span className={`text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {sec.num}
                </span>
                <span>{sec.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle: All vs Tabbed Focus Mode */}
        <div className="flex items-center justify-end gap-1 border-t sm:border-t-0 sm:border-l border-slate-200/80 pt-1.5 sm:pt-0 sm:pl-2 shrink-0 text-xs">
          <div className="inline-flex p-0.5 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all min-h-[30px] flex items-center gap-1 ${
                viewMode === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Xem toàn bộ cuộn liền mạch"
            >
              <span>📜</span>
              <span className="hidden md:inline">Cuộn trang</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('tab')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all min-h-[30px] flex items-center gap-1 ${
                viewMode === 'tab'
                  ? 'bg-indigo-600 text-white shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Chỉ hiển thị 1 mục trọng tâm"
            >
              <span>🎯</span>
              <span className="hidden md:inline">Tiêu điểm</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Sections: In 'all' mode render all; in 'tab' mode render active tab */}
      <div className="space-y-8 pt-2">
        {/* MỤC 1: Khái niệm & Bản chất cốt lõi */}
        {(viewMode === 'all' || activeTab === 'concept') && (
          <section id="gm-sec-concept" className="space-y-2.5 scroll-mt-24">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                1
              </span>
              <h3 className="text-base font-bold text-slate-800">Khái Niệm &amp; Bản Chất Cốt Lõi</h3>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-slate-700 leading-relaxed text-sm">
              {coreConcept}
            </div>
          </section>
        )}

        {/* MỤC 2: Chức năng thực tế & Ví dụ minh họa */}
        {(viewMode === 'all' || activeTab === 'functions') && (
          <section id="gm-sec-functions" className="space-y-3 scroll-mt-24">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                2
              </span>
              <h3 className="text-base font-bold text-slate-800">Chức Năng Thực Tế &amp; Ví Dụ</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {functions.map((fn, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 text-sm">
                  <h4 className="font-bold text-slate-800 text-sm mb-1">{fn.title}</h4>
                  <p className="text-slate-600 text-xs mb-2.5 leading-relaxed">{fn.explanation}</p>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/60 text-xs">
                    <span className="font-bold text-indigo-700">{fn.exampleEn}</span>
                    <span className="text-slate-500 block mt-0.5">↳ {fn.exampleVi}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MỤC 3: Mảnh ghép & Bảng chia ngôi */}
        {(viewMode === 'all' || activeTab === 'conjugation') && (
          <section id="gm-sec-conjugation" className="space-y-3 scroll-mt-24">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                3
              </span>
              <h3 className="text-base font-bold text-slate-800">Mảnh Ghép &amp; Bảng Chia Ngôi</h3>
            </div>
            <GrammarTable
              title="Bảng Chia Động Từ Theo Ngôi"
              headers={tableHeaders}
              rows={tableRows}
              note={tableNote}
            />
          </section>
        )}

        {/* MỤC 4: Cấu trúc 3 thể (+ Khẳng định, - Phủ định, ? Nghi vấn) */}
        {(viewMode === 'all' || activeTab === 'structures') && (
          <section id="gm-sec-structures" className="space-y-3 scroll-mt-24">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                4
              </span>
              <h3 className="text-base font-bold text-slate-800">Cấu Trúc 3 Thể (+ / - / ?)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {structures.map((st, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
                  <span
                    className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      st.form === 'affirmative'
                        ? 'bg-emerald-100 text-emerald-800'
                        : st.form === 'negative'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    {st.label}
                  </span>
                  <p className="font-mono text-xs font-bold text-slate-800 mt-2.5 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    {st.formula}
                  </p>
                  <p className="text-xs text-slate-600 mt-2.5">
                    Ví dụ: <span className="font-semibold text-slate-800">{st.example}</span>
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MỤC 5: Dấu hiệu nhận biết & Phân tích ngữ cảnh */}
        {(viewMode === 'all' || activeTab === 'clues') && (
          <section id="gm-sec-clues" className="space-y-3 scroll-mt-24">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                5
              </span>
              <h3 className="text-base font-bold text-slate-800">Dấu Hiệu Nhận Biết &amp; Mẹo Làm Bài</h3>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200/70">
              <ul className="space-y-2 text-xs text-slate-700 list-disc list-inside">
                {detectionClues.map((clue, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <span className="font-medium">{clue}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* MỤC 6: Ví dụ giảng giải mổ xẻ câu */}
        {(viewMode === 'all' || activeTab === 'breakdown') && (
          <section id="gm-sec-breakdown" className="space-y-3 scroll-mt-24">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                6
              </span>
              <h3 className="text-base font-bold text-slate-800">Phân Tích Mổ Xẻ Cú Pháp Câu</h3>
            </div>
            <GrammarSentenceBreakdown items={sentenceBreakdowns} />
          </section>
        )}

        {/* MỤC 7: Đề ôn tập & Luyện tập thực chiến */}
        {(viewMode === 'all' || activeTab === 'practice') && (
          <section id="gm-sec-practice" className="space-y-3 scroll-mt-24">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                7
              </span>
              <h3 className="text-base font-bold text-slate-800">Đề Ôn Tập &amp; Luyện Tập Thực Chiến</h3>
            </div>
            <GrammarPracticeCard
              questions={resolvedQuestions}
              topicTitle={title}
            />
          </section>
        )}
      </div>

      {/* Tab Focus Mode In-between Navigation */}
      {viewMode === 'tab' && (
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
          <button
            onClick={handlePrevTab}
            disabled={currentTabIdx <= 0}
            className="px-3.5 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-all min-h-[40px] flex items-center gap-1.5"
          >
            <span>←</span>
            <span>Mục trước: {currentTabIdx > 0 && SECTIONS[currentTabIdx - 1] ? SECTIONS[currentTabIdx - 1]?.shortLabel : ''}</span>
          </button>
          <span className="text-slate-400 font-bold">
            Mục {currentTabIdx + 1} / {SECTIONS.length}
          </span>
          <button
            onClick={handleNextTab}
            disabled={currentTabIdx >= SECTIONS.length - 1}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-40 transition-all min-h-[40px] flex items-center gap-1.5"
          >
            <span>Mục tiếp: {currentTabIdx < SECTIONS.length - 1 && SECTIONS[currentTabIdx + 1] ? SECTIONS[currentTabIdx + 1]?.shortLabel : ''}</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Bottom Topic Navigation & Back to Top */}
      <footer className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          {hasPrevTopic && (
            <button
              onClick={onPrevTopic}
              className="flex-1 sm:flex-none text-left p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-indigo-300 transition-all text-xs"
            >
              <span className="text-slate-400 block font-bold text-[10px] uppercase">← Bài trước</span>
              <span className="font-extrabold text-slate-800 line-clamp-1">{prevTopicTitle || 'Chuyên đề trước'}</span>
            </button>
          )}
          {hasNextTopic && (
            <button
              onClick={onNextTopic}
              className="flex-1 sm:flex-none text-right p-3 rounded-2xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-400 transition-all text-xs ml-auto"
            >
              <span className="text-indigo-600 block font-bold text-[10px] uppercase">Bài tiếp theo →</span>
              <span className="font-extrabold text-indigo-900 line-clamp-1">{nextTopicTitle || 'Chuyên đề sau'}</span>
            </button>
          )}
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={scrollToTop}
          leftIcon={<span>↑</span>}
          className="self-center sm:self-auto shrink-0"
        >
          <span>Lên đầu chuyên đề</span>
        </Button>
      </footer>
    </Card>
  );
}
