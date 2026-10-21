'use client';

import React from 'react';

export interface GrammarTableProps {
  title: string;
  headers: string[];
  rows: string[][];
  note?: string | undefined;
}

export function GrammarTable({ title, headers, rows, note }: GrammarTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs">
      <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-200/80 flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">{title}</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100/70 text-xs font-bold text-slate-600 uppercase border-b border-slate-200/60">
            <tr>
              {headers.map((h, idx) => (
                <th key={idx} className="px-4 py-2.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50/60 transition-colors">
                {r.map((cell, cIdx) => (
                  <td key={cIdx} className="px-4 py-2.5 text-slate-700 font-medium">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && (
        <div className="bg-amber-50/50 px-4 py-2 border-t border-amber-100 text-xs text-amber-800">
          💡 <strong>Lưu ý:</strong> {note}
        </div>
      )}
    </div>
  );
}
