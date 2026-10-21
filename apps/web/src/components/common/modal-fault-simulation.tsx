'use client';

import React, { useState } from 'react';

export interface ModalFaultSimulationProps {
  onSimulate: (scenarioKey: 'mic_denied' | 'audio_error' | 'network_drop' | 'welcome_back_3d') => void;
}

export function ModalFaultSimulation({ onSimulate }: ModalFaultSimulationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  const handleRun = (key: 'mic_denied' | 'audio_error' | 'network_drop' | 'welcome_back_3d', label: string) => {
    setActiveScenario(label);
    onSimulate(key);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-md backdrop-blur-md hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      >
        <span>⚙️</span>
        <span>QA Giả lập lỗi</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span>⚙️</span>
                <span>Trung Tâm Giả Lập Lỗi (QA Tool)</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Chọn kịch bản lỗi để kiểm chứng quy tắc bất biến: <em>Technical failure != Learner failure</em> (Sự cố kỹ thuật không bao giờ bị tính là lỗi học viên).
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleRun('mic_denied', 'Mất quyền Micro')}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/70 hover:bg-indigo-50/30 text-xs font-medium transition-all"
              >
                <div className="font-bold text-slate-800">1. Quyền Micro bị từ chối / Không có mic</div>
                <div className="text-slate-500 text-[11px] mt-0.5">Hệ thống mở luồng cứu hộ, cho phép gõ văn bản thay vì thu âm.</div>
              </button>

              <button
                type="button"
                onClick={() => handleRun('audio_error', 'Audio học tập bị lỗi')}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/70 hover:bg-indigo-50/30 text-xs font-medium transition-all"
              >
                <div className="font-bold text-slate-800">2. Lỗi tải file Audio / Không phát được</div>
                <div className="text-slate-500 text-[11px] mt-0.5">Hiển thị lời thoại (Transcript) có hỗ trợ, không phạt lỗi.</div>
              </button>

              <button
                type="button"
                onClick={() => handleRun('welcome_back_3d', 'Nghỉ học 3 ngày trở lại')}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/70 hover:bg-indigo-50/30 text-xs font-medium transition-all"
              >
                <div className="font-bold text-slate-800">3. Học viên quay lại sau 3 ngày vắng mặt</div>
                <div className="text-slate-500 text-[11px] mt-0.5">Lời chào êm dịu, không phạt streak, đề xuất ôn nhẹ 5 phút.</div>
              </button>
            </div>

            {activeScenario && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs font-medium">
                ✓ Đã kích hoạt kịch bản: <strong>{activeScenario}</strong>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Đóng hộp thoại
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
