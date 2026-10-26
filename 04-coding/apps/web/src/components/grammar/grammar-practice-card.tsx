'use client';

import React, { useState } from 'react';
import { Button, Card, Badge, Input } from '@/components/ui';

export type QuizQuestionType = 'multiple-choice' | 'fill-blank' | 'error-identification';

export interface GrammarQuizQuestion {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  sentence?: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  hint: string;
  bandTarget?: string;
  difficulty?: 'Cơ Bản' | 'Trung Cấp' | 'Nâng Cao';
}

export interface GrammarPracticeCardProps {
  title?: string;
  description?: string;
  topicTitle?: string;
  questions: GrammarQuizQuestion[];
  onComplete?: (results: {
    correct: number;
    total: number;
    supported: number;
    skipped: number;
  }) => void;
}

export function GrammarPracticeCard({
  title = 'Đề Ôn Tập & Luyện Tập Thực Chiến',
  description = 'Kiểm tra mức độ thấu hiểu và vận dụng chính xác ngữ pháp trong ngữ cảnh thực tế.',
  topicTitle,
  questions,
  onComplete,
}: GrammarPracticeCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});
  const [hintsUsed, setHintsUsed] = useState<Record<string, boolean>>({});
  const [skippedQuestions, setSkippedQuestions] = useState<Record<string, boolean>>({});
  const [fillInput, setFillInput] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  const currentQ = questions[currentIndex] ?? questions[0];

  if (!questions || questions.length === 0 || !currentQ) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
        <p className="text-sm font-semibold text-slate-600">Đang cập nhật thêm đề ôn tập cho chuyên đề này.</p>
      </div>
    );
  }

  const qId = currentQ.id;
  const isSubmitted = !!submittedQuestions[qId];
  const isSkipped = !!skippedQuestions[qId];
  const isHintUsed = !!hintsUsed[qId];
  const currentAnswer = userAnswers[qId] || '';

  const isCorrect =
    currentQ.type === 'fill-blank'
      ? currentAnswer.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase()
      : currentAnswer === currentQ.correctAnswer;

  // Handle Multiple Choice / Error ID selection
  const handleSelectOption = (opt: string) => {
    if (isSubmitted || isSkipped) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: opt }));
  };

  // Submit Answer
  const handleSubmitAnswer = () => {
    let answerToSubmit = currentAnswer;
    if (currentQ.type === 'fill-blank') {
      if (!fillInput.trim()) return;
      answerToSubmit = fillInput.trim();
      setUserAnswers((prev) => ({ ...prev, [qId]: answerToSubmit }));
    } else {
      if (!currentAnswer) return;
    }

    setSubmittedQuestions((prev) => ({ ...prev, [qId]: true }));

    // Check if all answered
    const nextSubmittedCount = Object.keys(submittedQuestions).length + 1;
    if (nextSubmittedCount >= questions.length && onComplete) {
      calculateAndNotifyResults();
    }
  };

  // Use Hint (Support != Independent)
  const handleUseHint = () => {
    setHintsUsed((prev) => ({ ...prev, [qId]: true }));
  };

  // Skip Question (Skipped != Failed)
  const handleSkip = () => {
    setSkippedQuestions((prev) => ({ ...prev, [qId]: true }));
    if (currentIndex < questions.length - 1) {
      goToQuestion(currentIndex + 1);
    } else {
      setShowSummary(true);
    }
  };

  const calculateAndNotifyResults = () => {
    let correct = 0;
    let supported = 0;
    let skipped = 0;

    questions.forEach((q) => {
      const ans = userAnswers[q.id];
      const isAnsCorrect =
        q.type === 'fill-blank'
          ? (ans || '').trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
          : ans === q.correctAnswer;

      if (skippedQuestions[q.id]) {
        skipped++;
      } else if (isAnsCorrect) {
        if (hintsUsed[q.id]) {
          supported++;
        } else {
          correct++;
        }
      }
    });

    if (onComplete) {
      onComplete({
        correct,
        total: questions.length,
        supported,
        skipped,
      });
    }
  };

  // Navigation between questions
  const goToQuestion = (idx: number) => {
    setCurrentIndex(idx);
    const nextQ = questions[idx];
    if (nextQ && nextQ.type === 'fill-blank') {
      setFillInput(userAnswers[nextQ.id] || '');
    }
  };

  // Reset practice
  const handleReset = () => {
    setCurrentIndex(0);
    setUserAnswers({});
    setSubmittedQuestions({});
    setHintsUsed({});
    setSkippedQuestions({});
    setFillInput('');
    setShowSummary(false);
  };

  // Summary Metrics
  const correctCount = questions.filter((q) => {
    const ans = userAnswers[q.id];
    const match =
      q.type === 'fill-blank'
        ? (ans || '').trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
        : ans === q.correctAnswer;
    return match && !hintsUsed[q.id] && !skippedQuestions[q.id];
  }).length;

  const supportedCount = questions.filter((q) => {
    const ans = userAnswers[q.id];
    const match =
      q.type === 'fill-blank'
        ? (ans || '').trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
        : ans === q.correctAnswer;
    return match && hintsUsed[q.id] && !skippedQuestions[q.id];
  }).length;

  const skippedCount = Object.keys(skippedQuestions).length;
  const answeredTotal = Object.keys(submittedQuestions).length;

  return (
    <Card variant="default" className="p-5 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="teal">Luyện Đề Thực Chiến</Badge>
            {topicTitle && (
              <span className="text-xs font-semibold text-slate-500">
                Chuyên đề: <strong className="text-slate-800">{topicTitle}</strong>
              </span>
            )}
            {currentQ.difficulty && (
              <Badge variant="amber">{currentQ.difficulty}</Badge>
            )}
          </div>
          <h4 className="text-lg font-black text-slate-800 mt-1">{title}</h4>
          <p className="text-xs text-slate-500">{description}</p>
        </div>

        {/* Question Selector Dots */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {questions.map((q, idx) => {
            const isDone = !!submittedQuestions[q.id];
            const isQSkip = !!skippedQuestions[q.id];
            const isCurrent = idx === currentIndex;
            const isQCorrect =
              q.type === 'fill-blank'
                ? (userAnswers[q.id] || '').trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
                : userAnswers[q.id] === q.correctAnswer;

            let dotColor = 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200';
            if (isDone) {
              dotColor = isQCorrect
                ? 'bg-emerald-500 text-white border-emerald-600'
                : 'bg-rose-500 text-white border-rose-600';
            } else if (isQSkip) {
              dotColor = 'bg-slate-300 text-slate-700 border-slate-400';
            }

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  setShowSummary(false);
                  goToQuestion(idx);
                }}
                className={`h-7 w-7 rounded-lg text-xs font-bold border transition-all flex items-center justify-center min-h-[32px] min-w-[32px] ${dotColor} ${
                  isCurrent ? 'ring-2 ring-indigo-600 ring-offset-1 font-black scale-105' : ''
                }`}
                title={`Câu ${idx + 1}`}
                aria-label={`Chuyển tới câu ${idx + 1}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUMMARY VIEW */}
      {showSummary ? (
        <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-5 animate-in fade-in duration-200">
          <div className="text-center space-y-2">
            <span className="text-3xl">🎯</span>
            <h5 className="text-base font-bold text-slate-900">Kết Quả Luyện Đề Ngữ Pháp</h5>
            <p className="text-xs text-slate-500">
              Đã hoàn thành {answeredTotal} / {questions.length} câu hỏi ôn tập.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-2xl font-black text-emerald-700">{correctCount}</span>
              <p className="text-xs font-bold text-emerald-800 mt-1">Đúng Độc Lập</p>
              <p className="text-[10px] text-emerald-600">Không cần xem gợi ý</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-2xl font-black text-amber-700">{supportedCount}</span>
              <p className="text-xs font-bold text-amber-800 mt-1">Đúng Có Hỗ Trợ</p>
              <p className="text-[10px] text-amber-600">Đã mở xem gợi ý</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-center">
              <span className="text-2xl font-black text-slate-700">{skippedCount}</span>
              <p className="text-xs font-bold text-slate-800 mt-1">Bỏ Qua / Tạm Dừng</p>
              <p className="text-[10px] text-slate-500">Không bị trừ điểm</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-700 hover:bg-slate-50 text-xs transition-all min-h-[44px]"
            >
              🔄 Làm Lại Đề Này
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSummary(false);
                goToQuestion(0);
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 font-bold text-white hover:bg-indigo-700 text-xs transition-all min-h-[44px]"
            >
              👀 Xem Lại Chi Tiết Từng Câu
            </button>
          </div>
        </div>
      ) : (
        /* QUESTION ACTIVE VIEW */
        <div className="space-y-5">
          {/* Question Banner */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold text-indigo-600">
              Câu hỏi {currentIndex + 1} / {questions.length}
            </span>
            {currentQ.bandTarget && (
              <span className="font-semibold text-slate-400">Mục tiêu: {currentQ.bandTarget}</span>
            )}
          </div>

          {/* Prompt */}
          <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100/80">
            <h5 className="text-base font-bold text-slate-900 leading-snug">{currentQ.prompt}</h5>
            {currentQ.sentence && (
              <div className="mt-3 p-3.5 rounded-xl bg-white border border-slate-200/90 font-mono text-xs sm:text-sm text-slate-800 leading-relaxed shadow-2xs">
                {currentQ.sentence}
              </div>
            )}
          </div>

          {/* Question Body: Type-Specific */}
          {currentQ.type === 'multiple-choice' && currentQ.options && (
            <div className="grid grid-cols-1 gap-2.5">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = currentAnswer === opt;
                let optionClasses =
                  'border-slate-200 bg-white text-slate-800 hover:border-indigo-300 hover:bg-indigo-50/20';

                if (isSubmitted) {
                  if (opt === currentQ.correctAnswer) {
                    optionClasses = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold';
                  } else if (isSelected && !isCorrect) {
                    optionClasses = 'border-rose-400 bg-rose-50 text-rose-950';
                  } else {
                    optionClasses = 'border-slate-200 bg-slate-50/50 text-slate-400';
                  }
                } else if (isSelected) {
                  optionClasses = 'border-indigo-600 bg-indigo-50/60 text-indigo-950 font-bold ring-2 ring-indigo-600/20';
                }

                return (
                  <button
                    key={oIdx}
                    type="button"
                    disabled={isSubmitted || isSkipped}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 min-h-[44px] ${optionClasses}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                    {isSubmitted && opt === currentQ.correctAnswer && (
                      <span className="text-emerald-700 font-black text-xs shrink-0">✔ Đáp án đúng</span>
                    )}
                    {isSubmitted && isSelected && !isCorrect && (
                      <span className="text-rose-600 font-bold text-xs shrink-0">✖ Đã chọn</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {currentQ.type === 'error-identification' && currentQ.options && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-500">
                Chọn phần gạch chân bị sai ngữ pháp và cần sửa đổi:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = currentAnswer === opt;
                  let optionClasses =
                    'border-slate-200 bg-white text-slate-800 hover:border-indigo-300 hover:bg-indigo-50/20';

                  if (isSubmitted) {
                    if (opt === currentQ.correctAnswer) {
                      optionClasses = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optionClasses = 'border-rose-400 bg-rose-50 text-rose-950';
                    } else {
                      optionClasses = 'border-slate-200 bg-slate-50/50 text-slate-400';
                    }
                  } else if (isSelected) {
                    optionClasses = 'border-indigo-600 bg-indigo-50/60 text-indigo-950 font-bold ring-2 ring-indigo-600/20';
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={isSubmitted || isSkipped}
                      onClick={() => handleSelectOption(opt)}
                      className={`text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 min-h-[44px] ${optionClasses}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="font-semibold">{opt}</span>
                      </div>
                      {isSubmitted && opt === currentQ.correctAnswer && (
                        <span className="text-emerald-700 font-black text-xs">Vị trí sai</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentQ.type === 'fill-blank' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitAnswer();
              }}
              className="space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <Input
                  value={isSubmitted ? currentAnswer : fillInput}
                  disabled={isSubmitted || isSkipped}
                  onChange={(e) => setFillInput(e.target.value)}
                  placeholder="Nhập từ hoặc dạng đúng của động từ vào đây..."
                  className="flex-1"
                />
                {!isSubmitted && !isSkipped && (
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={!fillInput.trim()}
                    className="shrink-0"
                  >
                    Kiểm Tra
                  </Button>
                )}
              </div>
              {isSubmitted && (
                <div className="p-3 rounded-xl bg-slate-100 text-xs flex items-center justify-between">
                  <span className="text-slate-600">Đáp án chuẩn: <strong className="text-emerald-700 font-mono text-sm">{currentQ.correctAnswer}</strong></span>
                  <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                    {isCorrect ? '✔ Bạn đã điền chính xác' : '✖ Chưa chính xác'}
                  </span>
                </div>
              )}
            </form>
          )}

          {/* Hint Section */}
          {isHintUsed && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 space-y-1 animate-in fade-in">
              <span className="font-bold flex items-center gap-1.5 text-amber-800">
                <span>💡 Gợi ý nhận diện:</span>
                <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">(has_support: true)</span>
              </span>
              <p className="leading-relaxed">{currentQ.hint}</p>
            </div>
          )}

          {/* Explanation when submitted */}
          {isSubmitted && (
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 text-xs text-slate-800 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-black text-[10px] uppercase">
                  Giải Thích Chi Tiết
                </span>
                <span className="font-bold text-slate-700">Tại sao chọn đáp án này?</span>
              </div>
              <p className="leading-relaxed text-slate-700">{currentQ.explanation}</p>
            </div>
          )}

          {/* Action Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {!isHintUsed && !isSubmitted && !isSkipped && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUseHint}
                  leftIcon={<span>💡</span>}
                  className="border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                >
                  <span>Xem gợi ý</span>
                </Button>
              )}

              {!isSubmitted && !isSkipped && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  title="Chuyển câu tiếp theo mà không bị phạt điểm"
                >
                  Bỏ qua câu này
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2 justify-end">
              {currentIndex > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => goToQuestion(currentIndex - 1)}
                >
                  ← Câu trước
                </Button>
              )}

              {!isSubmitted && !isSkipped && currentQ.type !== 'fill-blank' && (
                <Button
                  variant="primary"
                  size="md"
                  disabled={!currentAnswer}
                  onClick={handleSubmitAnswer}
                >
                  Kiểm Tra Đáp Án
                </Button>
              )}

              {(isSubmitted || isSkipped) && currentIndex < questions.length - 1 && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => goToQuestion(currentIndex + 1)}
                  rightIcon={<span>→</span>}
                >
                  <span>Câu tiếp theo</span>
                </Button>
              )}

              {(isSubmitted || isSkipped) && currentIndex === questions.length - 1 && (
                <Button
                  variant="success"
                  size="md"
                  onClick={() => setShowSummary(true)}
                  rightIcon={<span>🏁</span>}
                >
                  <span>Xem tổng kết đề</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
