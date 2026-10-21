'use client';

import React, { useState, useRef } from 'react';

export interface SpeechRecorderCardProps {
  id: string;
  targetSentence: string;
  targetIpa: string;
  onRecordComplete: (audioBlob: Blob, hasSupport: boolean) => void;
  onFallbackToWrite?: () => void;
}

export function SpeechRecorderCard({
  targetSentence,
  targetIpa,
  onRecordComplete,
  onFallbackToWrite
}: SpeechRecorderCardProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setMicError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('NOT_SUPPORTED');
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setHasRecorded(true);
        setIsRecording(false);
        onRecordComplete(blob, false);
        // Stop audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mr.start();
      setIsRecording(true);
    } catch {
      setMicError('Trình duyệt chưa được cấp quyền Microphone hoặc thiết bị chưa kết nối mic.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="card p-6 bg-white/95 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">
          Thu Âm Luyện Phát Âm
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="text-xl md:text-2xl font-extrabold text-slate-800">{targetSentence}</h3>
        <p className="font-mono text-sm text-indigo-600 font-bold">{targetIpa}</p>
      </div>

      {micError ? (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
          <p className="font-bold flex items-center gap-1.5">
            ⚠️ Đây là sự cố kỹ thuật micro, không phải lỗi học tập của bạn!
          </p>
          <p>{micError}</p>
          {onFallbackToWrite && (
            <button
              type="button"
              onClick={onFallbackToWrite}
              className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors"
            >
              ✍️ Chuyển sang gõ bài viết thay thế
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 transition-colors shadow-sm"
            >
              <span>🎙️</span>
              <span>{hasRecorded ? 'Thu âm lại' : 'Bắt đầu thu âm'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 transition-colors animate-pulse shadow-sm"
            >
              <span>⏹</span>
              <span>Dừng &amp; Lưu bản ghi</span>
            </button>
          )}

          {hasRecorded && !isRecording && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              ✓ Đã ghi nhận bản ghi âm của bạn
            </span>
          )}
        </div>
      )}
    </div>
  );
}
