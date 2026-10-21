'use client';

import React, { useState } from 'react';

export interface MultipleChoiceCardProps {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
  onAnswer: (selected: string, hasSupport: boolean) => void;
  onSkip?: () => void;
}

export function MultipleChoiceCard({
  prompt,
  options,
  correctAnswer,
  explanation,
  hint,
  onAnswer,
  onSkip
}: MultipleChoiceCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSelect = (opt: string) => {
    if (submitted) return;
    setSelected(opt);
    setSubmitted(true);
    onAnswer(opt, showHint);
  };

  const handleUseHint = () => {
    setShowHint(true);
  };

  const isCorrect = selected === correctAnswer;

  return (
    <div className="card p-6 bg-white/95 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
          Trắc Nghiệm Ngữ Cảnh
        </span>
        <div className="flex items-center gap-2">
          {hint && !showHint && !submitted && (
            <button
              type="button"
              onClick={handleUseHint}
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
              title="Bỏ qua không bị trừ điểm (Skipped != Failed)"
            >
              Bỏ qua
            </button>
          )}
        </div>
      </div>

      <h3 className="text-lg md:text-xl font-bold text-slate-800 leading-snug">{prompt}</h3>

      {showHint && hint && (
        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
          <strong>Gợi ý:</strong> {hint}
          <span className="block mt-1 text-[11px] text-amber-700 italic">
            (Lưu ý: Sử dụng gợi ý sẽ được ghi nhận là &quot;Luyện tập có hỗ trợ&quot;)
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {options.map((opt, idx) => {
          let btnStyle = 'border-slate-200 hover:border-indigo-400 bg-slate-50/50 text-slate-800';
          if (submitted) {
            if (opt === correctAnswer) {
              btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
            } else if (opt === selected) {
              btnStyle = 'border-rose-400 bg-rose-50 text-rose-900';
            } else {
              btnStyle = 'border-slate-200 bg-slate-50/30 text-slate-400 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={submitted}
              onClick={() => handleSelect(opt)}
              className={`p-3.5 rounded-xl border text-left text-sm font-medium transition-all ${btnStyle}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {submitted && (
        <div className={`p-4 rounded-xl border text-sm leading-relaxed ${isCorrect ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
          <div className="font-bold mb-1 flex items-center gap-1.5">
            {isCorrect ? '🎉 Chính xác!' : '💡 Giải thích chi tiết:'}
            {showHint && (
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded ml-2">
                Có hỗ trợ
              </span>
            )}
          </div>
          <p className="text-xs">{explanation}</p>
        </div>
      )}
    </div>
  );
}
