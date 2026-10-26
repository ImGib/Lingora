'use client';

import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui';

export interface GrammarTableProps {
  title: string;
  headers: string[];
  rows: string[][];
  note?: string | undefined;
}

export function GrammarTable({ title, headers, rows, note }: GrammarTableProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">{title}</h4>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((h, idx) => (
              <TableHead key={idx}>{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r, rIdx) => (
            <TableRow key={rIdx}>
              {r.map((cell, cIdx) => (
                <TableCell key={cIdx} className="font-medium text-slate-800">
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {note && (
        <div className="rounded-xl bg-amber-50/80 p-3 border border-amber-200/70 text-xs text-amber-900 leading-relaxed shadow-2xs">
          <span className="font-bold">💡 Lưu ý:</span> {note}
        </div>
      )}
    </div>
  );
}
