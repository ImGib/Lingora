'use client';

import React from 'react';
import { GrammarTable } from './grammar-table';
import { GrammarSentenceBreakdown, type GrammarBreakdownItem } from './grammar-sentence-breakdown';

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
}

export function GrammarMasterclass({
  title,
  tagline,
  coreConcept,
  functions,
  tableHeaders,
  tableRows,
  tableNote,
  structures,
  detectionClues,
  sentenceBreakdowns
}: GrammarMasterclassProps) {
  return (
    <article className="card p-6 md:p-8 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-sm space-y-7">
      {/* Header Chuyên Đề */}
      <div className="border-b border-slate-100 pb-4">
        <span className="eyebrow text-indigo-600 font-bold tracking-wider text-xs uppercase">
          Chuyên Đề Ngữ Pháp 6 Phần (ForumFlash Masterclass)
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">{title}</h2>
        <p className="text-slate-500 text-sm mt-1">{tagline}</p>
      </div>

      {/* MỤC 1: Khái niệm & Bản chất cốt lõi */}
      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">1</span>
          <h3 className="text-base font-bold text-slate-800">Khái Niệm &amp; Bản Chất Cốt Lõi</h3>
        </div>
        <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-100 text-slate-700 leading-relaxed text-sm">
          {coreConcept}
        </div>
      </section>

      {/* MỤC 2: Chức năng thực tế & Ví dụ minh họa */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">2</span>
          <h3 className="text-base font-bold text-slate-800">Chức Năng Thực Tế &amp; Ví Dụ</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {functions.map((fn, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 text-sm">
              <h4 className="font-bold text-slate-800 text-sm mb-1">{fn.title}</h4>
              <p className="text-slate-600 text-xs mb-2 leading-relaxed">{fn.explanation}</p>
              <div className="p-2 rounded-lg bg-white border border-slate-200/60 text-xs">
                <span className="font-bold text-indigo-700">{fn.exampleEn}</span>
                <span className="text-slate-500 block mt-0.5">↳ {fn.exampleVi}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MỤC 3: Mảnh ghép & Bảng chia ngôi */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">3</span>
          <h3 className="text-base font-bold text-slate-800">Mảnh Ghép &amp; Bảng Chia Ngôi</h3>
        </div>
        <GrammarTable
          title="Bảng Chia Động Từ Theo Ngôi"
          headers={tableHeaders}
          rows={tableRows}
          note={tableNote}
        />
      </section>

      {/* MỤC 4: Cấu trúc 3 thể (+ Khẳng định, - Phủ định, ? Nghi vấn) */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">4</span>
          <h3 className="text-base font-bold text-slate-800">Cấu Trúc 3 Thể (+ / - / ?)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {structures.map((st, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs">
              <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ${
                st.form === 'affirmative' ? 'bg-emerald-100 text-emerald-800' :
                st.form === 'negative' ? 'bg-rose-100 text-rose-800' : 'bg-sky-100 text-sky-800'
              }`}>
                {st.label}
              </span>
              <p className="font-mono text-xs font-bold text-slate-800 mt-2 p-2 bg-slate-50 rounded border border-slate-100">
                {st.formula}
              </p>
              <p className="text-xs text-slate-600 mt-2">
                Ví dụ: <span className="font-semibold text-slate-800">{st.example}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* MỤC 5: Dấu hiệu nhận biết & Phân tích ngữ cảnh */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">5</span>
          <h3 className="text-base font-bold text-slate-800">Dấu Hiệu Nhận Biết &amp; Mẹo Làm Bài</h3>
        </div>
        <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/70">
          <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
            {detectionClues.map((clue, idx) => (
              <li key={idx} className="leading-relaxed">
                <span className="font-medium">{clue}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* MỤC 6: Ví dụ giảng giải mổ xẻ câu */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">6</span>
          <h3 className="text-base font-bold text-slate-800">Phân Tích Mổ Xẻ Cú Pháp Câu</h3>
        </div>
        <GrammarSentenceBreakdown items={sentenceBreakdowns} />
      </section>
    </article>
  );
}
