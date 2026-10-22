'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IpaMouthStudio, PhonemeSpec } from '@/components/ipa/ipa-mouth-studio';
import { AudioButton } from '@/components/common/audio-button';
import { MultipleChoiceCard } from '@/components/practice/multiple-choice-card';
import { FillBlankCard } from '@/components/practice/fill-blank-card';
import { SpeechRecorderCard } from '@/components/practice/speech-recorder-card';
import { ModalFaultSimulation } from '@/components/common/modal-fault-simulation';

export interface LessonStepRunnerProps {
  lessonId: string;
  lessonTitle: string;
  milestoneTitle?: string;
  phonemes?: PhonemeSpec[];
  onFinish?: () => void;
}

export function LessonStepRunner({
  lessonId,
  lessonTitle,
  milestoneTitle = 'MỐC 1 • A1 (Band 0.0 - 3.0)',
  phonemes,
  onFinish
}: LessonStepRunnerProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeFault, setActiveFault] = useState<string | null>(null);

  // Evidence and support tracking (Pedagogical Invariant: Support != Independent, Skipped != Failed)
  const [practiceStats, setPracticeStats] = useState<{
    completedCount: number;
    supportedCount: number;
    skippedCount: number;
  }>({
    completedCount: 0,
    supportedCount: 0,
    skippedCount: 0
  });

  const [practiceSubStep, setPracticeSubStep] = useState<number>(0);

  const stepsList = [
    { num: 1, label: 'Khẩu hình IPA', desc: 'Quan sát và định hình âm vị' },
    { num: 2, label: 'Cốt lõi Từ vựng', desc: 'Từ ngữ gắn liền với ngữ cảnh' },
    { num: 3, label: 'Ngữ pháp 6P', desc: 'Cấu trúc và bản chất câu' },
    { num: 4, label: 'Luyện tập', desc: 'Trắc nghiệm, Điền từ & Thu âm' },
    { num: 5, label: 'Tổng kết', desc: 'Bằng chứng & Tiếp tục lộ trình' }
  ];

  const handleRecordAnswer = (hasSupport: boolean) => {
    setPracticeStats((prev) => ({
      ...prev,
      completedCount: prev.completedCount + 1,
      supportedCount: hasSupport ? prev.supportedCount + 1 : prev.supportedCount
    }));
    setPracticeSubStep((prev) => prev + 1);
  };

  const handleSkipQuestion = () => {
    setPracticeStats((prev) => ({
      ...prev,
      skippedCount: prev.skippedCount + 1
    }));
    setPracticeSubStep((prev) => prev + 1);
  };

  return (
    <div className="space-y-8">
      {/* Simulation Banner if fault triggered */}
      {activeFault && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <span>⚠️ <strong>Giả lập cứu hộ:</strong> {activeFault}</span>
          <button
            onClick={() => setActiveFault(null)}
            className="text-amber-700 hover:text-amber-900 font-bold"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Step Stepper Progress Bar */}
      <section className="card p-4 sm:p-6 bg-white/95 rounded-3xl border border-[#e8e1ec] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-5">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              {milestoneTitle}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#34303d] mt-0.5">
              {lessonTitle}
            </h1>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold self-start sm:self-auto">
            Bước {currentStep} / 5: {stepsList[currentStep - 1]?.label}
          </span>
        </div>

        {/* 5-Step Stepper Navigation */}
        <div className="grid grid-cols-5 gap-2">
          {stepsList.map((st) => {
            const isPassed = st.num < currentStep;
            const isCurrent = st.num === currentStep;
            return (
              <button
                key={st.num}
                type="button"
                onClick={() => setCurrentStep(st.num)}
                className={`text-left p-2.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20'
                    : isPassed
                    ? 'border-emerald-200 bg-emerald-50/40 text-emerald-800'
                    : 'border-slate-100 bg-slate-50 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-indigo-600 text-white'
                        : isPassed
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isPassed ? '✓' : st.num}
                  </span>
                  <span className="hidden md:inline text-xs font-bold truncate">{st.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* STEP 1: Khẩu hình âm vị */}
      {currentStep === 1 && (
        <section className="space-y-6">
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-indigo-900 text-xs sm:text-sm">
            💡 <strong>Quy tắc khẩu hình:</strong> Quan sát chuyển động của môi và cơ lưỡi. Lắng nghe âm thanh ở cả 2 tốc độ (1.0x và 0.75x) để thẩm thấu ngữ điệu tự nhiên.
          </div>

          {phonemes ? <IpaMouthStudio phonemes={phonemes} /> : <IpaMouthStudio />}

          <div className="flex justify-between items-center pt-4">
            <Link href="/dashboard" className="button secondary text-xs">
              ← Về Bàn học
            </Link>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="button primary text-xs px-5 py-2.5"
            >
              Tiếp tục: Bước 2 (Từ vựng) →
            </button>
          </div>
        </section>
      )}

      {/* STEP 2: Cốt lõi Từ vựng */}
      {currentStep === 2 && (
        <section className="card p-6 sm:p-8 bg-white rounded-3xl border border-[#e8e1ec] shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="eyebrow text-indigo-600 font-bold tracking-wider text-xs uppercase">
              BƯỚC 2: CỐT LÕI TỪ VỰNG TRỌNG TÂM
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#34303d] mt-1">
              Gắn Kết Âm Vị Vào Từ Ngữ Thực Tế
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Từ vựng được lựa chọn theo tần suất sử dụng cao trong giao tiếp và kỳ thi IELTS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vocab Item 1 */}
            <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-800">patient</h3>
                  <span className="text-xs font-mono text-indigo-600">/ˈpeɪ.ʃənt/</span>
                  <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 font-medium">
                    tính từ (adj)
                  </span>
                </div>
                <AudioButton text="patient" />
              </div>
              <p className="text-sm font-semibold text-slate-700">kiên nhẫn, điềm tĩnh</p>
              <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-600">
                <p className="italic">"A patient learner builds lasting knowledge."</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  (Một người học kiên nhẫn sẽ tích lũy tri thức bền vững.)
                </p>
              </div>
            </div>

            {/* Vocab Item 2 */}
            <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-800">resilient</h3>
                  <span className="text-xs font-mono text-indigo-600">/rɪˈzɪl.jənt/</span>
                  <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 font-medium">
                    tính từ (adj)
                  </span>
                </div>
                <AudioButton text="resilient" />
              </div>
              <p className="text-sm font-semibold text-slate-700">kiên cường, mau hồi phục</p>
              <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-600">
                <p className="italic">"She remains resilient despite the challenge."</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  (Cô ấy vẫn kiên cường bất chấp khó khăn.)
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="button secondary text-xs"
            >
              ← Quay lại Bước 1
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="button primary text-xs px-5 py-2.5"
            >
              Tiếp tục: Bước 3 (Ngữ pháp) →
            </button>
          </div>
        </section>
      )}

      {/* STEP 3: Ngữ pháp trong ngữ cảnh */}
      {currentStep === 3 && (
        <section className="card p-6 sm:p-8 bg-white rounded-3xl border border-[#e8e1ec] shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="eyebrow text-indigo-600 font-bold tracking-wider text-xs uppercase">
              BƯỚC 3: CẤU TRÚC NGỮ PHÁP TRONG NGỮ CẢNH
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#34303d] mt-1">
              Định Danh & Miêu Tả Với Động Từ To Be
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Ngữ pháp 6 phần ForumFlash: Hiểu rõ bản chất câu trước khi áp dụng vào bài tập.
            </p>
          </div>

          {/* Quick 3-structure matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
              <span className="text-[11px] font-bold text-indigo-600 uppercase block mb-1">
                Khẳng định (+)
              </span>
              <p className="font-mono text-xs font-bold text-slate-800">S + am/is/are + Adj/Noun</p>
              <p className="text-xs text-slate-600 mt-2">"Lingora is friendly and gentle."</p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
              <span className="text-[11px] font-bold text-rose-600 uppercase block mb-1">
                Phủ định (-)
              </span>
              <p className="font-mono text-xs font-bold text-slate-800">S + am/is/are + not + Adj/Noun</p>
              <p className="text-xs text-slate-600 mt-2">"It is not stressful at all."</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
              <span className="text-[11px] font-bold text-emerald-600 uppercase block mb-1">
                Nghi vấn (?)
              </span>
              <p className="font-mono text-xs font-bold text-slate-800">Am/Is/Are + S + Adj/Noun?</p>
              <p className="text-xs text-slate-600 mt-2">"Are you ready for the practice?"</p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="button secondary text-xs"
            >
              ← Quay lại Bước 2
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="button primary text-xs px-5 py-2.5"
            >
              Tiếp tục: Bước 4 (Thực hành luyện tập) →
            </button>
          </div>
        </section>
      )}

      {/* STEP 4: Trình chạy Luyện tập Tương tác */}
      {currentStep === 4 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                BƯỚC 4: THỰC HÀNH 3 CẤP ĐỘ
              </span>
              <p className="text-xs text-slate-500">
                Trắc nghiệm ➔ Điền từ ➔ Thu âm giọng nói.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-semibold">
              Bài tập {practiceSubStep + 1} / 3
            </span>
          </div>

          {/* Sub-step 1: Multiple choice */}
          {practiceSubStep === 0 && (
            <MultipleChoiceCard
              id="mcq-lesson-1"
              prompt="Chọn câu hoàn chỉnh diễn tả chính xác trạng thái người học kiên nhẫn:"
              options={[
                'The student are exceptionally patient.',
                'The student is exceptionally patient.',
                'The student being exceptionally patient.',
                'The student be exceptionally patient.'
              ]}
              correctAnswer="The student is exceptionally patient."
              explanation="Chủ ngữ 'The student' là ngôi thứ ba số ít, do đó động từ To Be chia là 'is'."
              hint="Quan sát chủ ngữ số ít hay số nhiều để chọn am, is hay are."
              onAnswer={(_ans, hasSupport) => handleRecordAnswer(hasSupport)}
              onSkip={() => handleSkipQuestion()}
            />
          )}

          {/* Sub-step 2: Fill in the blank */}
          {practiceSubStep === 1 && (
            <FillBlankCard
              id="fb-lesson-1"
              sentenceWithBlank="She is remarkably _____ in her study approach."
              correctWord="patient"
              ipa="/ˈpeɪ.ʃənt/"
              vietnameseMeaning="kiên nhẫn, nhẫn nại"
              hint="Từ có 7 chữ cái bắt đầu bằng 'p', đã học ở Bước 2."
              onAnswer={(_ans, hasSupport) => handleRecordAnswer(hasSupport)}
              onSkip={() => handleSkipQuestion()}
            />
          )}

          {/* Sub-step 3: Speech recorder */}
          {practiceSubStep === 2 && (
            <SpeechRecorderCard
              id="sr-lesson-1"
              targetSentence="The student is exceptionally patient."
              targetIpa="/ðə ˈstjuː.dənt ɪz ɪkˈsep.ʃən.əl.i ˈpeɪ.ʃənt/"
              onRecordComplete={(_blob, hasSupport) => handleRecordAnswer(hasSupport)}
              onFallbackToWrite={() => {
                setActiveFault('Micro không phản hồi - Đã mở luồng gõ văn bản cứu hộ theo hiến pháp');
                handleRecordAnswer(true);
              }}
            />
          )}

          {/* All 3 sub-steps completed */}
          {practiceSubStep >= 3 && (
            <div className="card p-8 bg-white rounded-3xl border border-emerald-200 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold">
                ✓
              </div>
              <h3 className="text-xl font-extrabold text-slate-800">
                Tuyệt vời! Bạn đã hoàn thành toàn bộ phần thực hành
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Mọi tương tác đều được ghi nhận chuẩn xác. Hãy chuyển sang Bước 5 để xem tổng kết tiến độ.
              </p>
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="button primary px-6 py-3 text-xs font-bold"
              >
                Xem báo cáo tổng kết (Bước 5) →
              </button>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="button secondary text-xs"
            >
              ← Quay lại Bước 3
            </button>
            {practiceSubStep < 3 && (
              <button
                type="button"
                onClick={() => handleSkipQuestion()}
                className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-4"
              >
                Bỏ qua câu này (không trừ điểm)
              </button>
            )}
          </div>
        </section>
      )}

      {/* STEP 5: Tổng kết & Ghi nhận tiến độ */}
      {currentStep === 5 && (
        <section className="card p-6 sm:p-8 bg-white rounded-3xl border border-[#e8e1ec] shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
              <span>✦</span> BÀI HỌC HOÀN THÀNH
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Ghi Nhận Tiến Trình Học Tập
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Tiến bộ là kết quả của sự kiên trì từng ngày, không phải sự hoàn hảo tức thì.
            </p>
          </div>

          {/* Stats Invariants Display */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-2">
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-center">
              <span className="text-2xl font-black text-indigo-700 block">
                {practiceStats.completedCount}
              </span>
              <span className="text-xs font-semibold text-slate-600">Câu đã hoàn tất</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 text-center">
              <span className="text-2xl font-black text-amber-700 block">
                {practiceStats.supportedCount}
              </span>
              <span className="text-xs font-semibold text-slate-600">Câu có gợi ý hỗ trợ</span>
              <p className="text-[10px] text-slate-400 mt-1">Minh bạch năng lực</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-2xl font-black text-slate-700 block">
                {practiceStats.skippedCount}
              </span>
              <span className="text-xs font-semibold text-slate-600">Câu đã bỏ qua</span>
              <p className="text-[10px] text-emerald-600 mt-1">Không trừ điểm</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-wrap justify-center gap-3">
            <Link href="/dashboard" className="button primary px-6 py-3 text-xs font-bold">
              Quay lại Bàn học hôm nay →
            </Link>
            <Link href="/roadmap" className="button secondary px-6 py-3 text-xs font-bold">
              Xem Lộ trình 4 Mốc IELTS
            </Link>
          </div>
        </section>
      )}

      {/* Floating QA Fault Simulation Modal */}
      <ModalFaultSimulation
        onSimulate={(faultKey) => {
          setActiveFault(`Đã mô phỏng sự cố: ${faultKey}`);
        }}
      />
    </div>
  );
}
