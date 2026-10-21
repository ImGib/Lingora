'use client';

import React from 'react';

export interface GrammarSentenceToken {
  word: string;
  role: 'subject' | 'verb' | 'object' | 'complement' | 'adverb';
  label: string;
  explanation: string;
}

export interface GrammarBreakdownItem {
  sentence: string;
  meaning: string;
  tokens: GrammarSentenceToken[];
}

export function GrammarSentenceBreakdown({ items }: { items: GrammarBreakdownItem[] }) {
  const getRoleStyle = (role: GrammarSentenceToken['role']) => {
    switch (role) {
      case 'subject':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'verb':
        return 'bg-sky-50 text-sky-800 border-sky-300';
      case 'object':
      case 'complement':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'adverb':
        return 'bg-purple-50 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  const getRoleBadge = (role: GrammarSentenceToken['role'], label: string) => {
    switch (role) {
      case 'subject':
        return <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-100/80 px-1.5 py-0.5 rounded">{label || 'Chủ ngữ [S]'}</span>;
      case 'verb':
        return <span className="text-[10px] uppercase font-bold text-sky-600 bg-sky-100/80 px-1.5 py-0.5 rounded">{label || 'Động từ [V]'}</span>;
      case 'object':
      case 'complement':
        return <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-100/80 px-1.5 py-0.5 rounded">{label || 'Bổ ngữ [C]'}</span>;
      case 'adverb':
        return <span className="text-[10px] uppercase font-bold text-purple-600 bg-purple-100/80 px-1.5 py-0.5 rounded">{label || 'Trạng từ [Adv]'}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={idx} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {item.tokens.map((tok, tIdx) => (
              <div
                key={tIdx}
                className={`inline-flex flex-col items-center px-3 py-1.5 rounded-lg border text-sm font-medium ${getRoleStyle(tok.role)}`}
              >
                <span className="font-bold text-base">{tok.word}</span>
                {getRoleBadge(tok.role, tok.label)}
              </div>
            ))}
          </div>
          <p className="text-sm font-medium text-slate-600 mt-2">
            👉 <span className="font-semibold text-slate-800">{item.sentence}</span> : {item.meaning}
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-slate-600">
            {item.tokens.map((tok, tIdx) => (
              <div key={tIdx} className="bg-white/90 p-2 rounded-md border border-slate-200/60">
                <span className="font-bold text-slate-800">{tok.word}</span>: {tok.explanation}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
