'use client';

import React, { useState } from 'react';

export interface FillBlankCardProps {
  id: string;
  sentenceWithBlank: string;
  correctWord: string;
  ipa?: string;
  vietnameseMeaning: string;
  hint?: string;
  onAnswer: (value: string, hasSupport: boolean) => void;
  onSkip?: () => void;
}

export function FillBlankCard({
  sentenceWithBlank,
  correctWord,
  ipa,
  vietnameseMeaning,
  hint,
  onAnswer,
  onSkip
}: FillBlankCardProps) {
  const [val, setVal] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!val.trim() || submitted) return;
    setSubmitted(true);
    onAnswer(val.trim(), showHint);
  };

  const isCorrect = val.trim().toLowerCase() === correctWord.trim().toLowerCase();

  return (
    <div className="card p-6 bg-white/95 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
          Điền Từ &amp; Nhận Biết IPA
        </span>
        <div className="flex items-center gap-2">
          {hint && !showHint && !submitted && (
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md transition-colors"
            >
              💡 Gợi ý
            </button>
          )}
          {onSkip && !submitted && (
            <button
              type="button"
              onClick={onSkip}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-2 py-1 transition-colors"
            >
              Bỏ qua
            </button>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-lg md:text-xl font-bold text-slate-800 leading-snug">
          {sentenceWithBlank.replace('___', '______')}
        </p>
        <p className="text-sm text-slate-500 italic">Ý nghĩa: {vietnameseMeaning}</p>
        {ipa && (
          <div className="pt-1">
            <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              Ký hiệu âm: {ipa}
            </span>
          </div>
        )}
      </div>

      {showHint && hint && (
        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
          <strong>Gợi ý:</strong> {hint}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
        <input
          type="text"
          value={val}
          disabled={submitted}
          onChange={(e) => setVal(e.target.value)}
          placeholder="Nhập từ còn thiếu..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
        />
        <button
          type="submit"
          disabled={!val.trim() || submitted}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          Xác nhận
        </button>
      </form>

      {submitted && (
        <div className={`p-4 rounded-xl border text-sm leading-relaxed ${isCorrect ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' : 'bg-rose-50/60 border-rose-200 text-rose-950'}`}>
          <div className="font-bold mb-1">
            {isCorrect ? '🎉 Tuyệt vời! Bạn đã điền chính xác.' : `Chưa chính xác. Đáp án đúng là: "${correctWord}"`}
          </div>
        </div>
      )}
    </div>
  );
}
