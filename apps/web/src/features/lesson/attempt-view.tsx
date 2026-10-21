'use client';

import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { AttemptDto } from '@lingora/contracts';
import { getAttempt, revealHint, saveResponse, submitAttempt } from '@/lib/api';
import { ContentReportModal } from '../quarantine/content-report-modal';

function speak(text: string) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  }
}

export function AttemptView({ attemptId }: { attemptId: string }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [attempt, setAttempt] = useState<AttemptDto | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [hints, setHints] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('Loading saved work…');
  const [busy, setBusy] = useState(false);
  const [reportingTarget, setReportingTarget] = useState<{ itemVersionId?: string; titleContext?: string } | null>(null);

  const refresh = useCallback(
    async (resetAnswers = true) => {
      const token = await getToken();
      if (!token) throw new Error('Please sign in again.');
      const loaded = await getAttempt(token, attemptId);
      setAttempt(loaded);
      if (resetAnswers) {
        setAnswers(Object.fromEntries(loaded.items.map((item) => [item.id, item.response ?? ''])));
      }
      setMessage('');
    },
    [attemptId, getToken]
  );

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    void refresh().catch((error: unknown) => {
      setMessage(error instanceof Error ? error.message : 'Unable to load work.');
    });
  }, [isLoaded, isSignedIn, refresh]);

  async function save(itemId: string) {
    setBusy(true);
    setMessage('Saving…');
    try {
      const token = await getToken();
      if (!token) throw new Error('Please sign in again.');
      await saveResponse(token, attemptId, itemId, answers[itemId] ?? '');
      await refresh(false);
      setMessage('Saved. You can close this page and return later.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save.');
    } finally {
      setBusy(false);
    }
  }

  async function showHint(itemId: string) {
    setBusy(true);
    setMessage('');
    try {
      const token = await getToken();
      if (!token) throw new Error('Please sign in again.');
      const hint = await revealHint(token, attemptId, itemId);
      setHints((current) => ({ ...current, [itemId]: hint }));
      await refresh(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Hint unavailable.');
    } finally {
      setBusy(false);
    }
  }

  async function submit() {
    setBusy(true);
    setMessage('Checking your responses…');
    try {
      const token = await getToken();
      if (!token) throw new Error('Please sign in again.');
      const storageKey = `lingora-submit-${attemptId}`;
      let key = sessionStorage.getItem(storageKey);
      if (!key) {
        key = crypto.randomUUID();
        sessionStorage.setItem(storageKey, key);
      }
      await submitAttempt(token, attemptId, key);
      await refresh();
      setMessage('Your feedback is ready.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to submit. Your answers are saved.');
    } finally {
      setBusy(false);
    }
  }

  const promptText = (prompt: Record<string, unknown>) => {
    if (typeof prompt.text === 'string' && prompt.text.length > 0) return prompt.text;
    if (typeof prompt.question === 'string' && prompt.question.length > 0) return prompt.question;
    if (typeof prompt.instruction === 'string' && prompt.instruction.length > 0) return prompt.instruction;
    return 'Question';
  };

  return (
    <article className="lesson-stack">
      <header className="section-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Link href="/dashboard" className="button secondary" style={{ minHeight: '36px', padding: '6px 14px', fontSize: '0.82rem' }}>
            ← Về kế hoạch hôm nay
          </Link>
          <p className="eyebrow" style={{ margin: 0 }}>
            02 TIẾP THEO · KIỂM TRA &amp; LUYỆN TẬP
          </p>
        </div>
        <h1>Luyện tập &amp; Kiểm tra Trí nhớ</h1>
        <p>
          Lưu từng câu trả lời trước khi nộp. Các câu làm chưa đúng sẽ được đưa vào hàng đợi ôn tập ngắt quãng (Spaced Review) mà không bị phạt.
        </p>
      </header>

      <div className="study-workspace">
        <div className="study-workspace-main">
      <p className="status" role="status">
        {message}
      </p>

      {attempt?.items.map((item, index) => {
        const pText = promptText(item.prompt);
        const audio = typeof item.prompt.audio === 'string' ? item.prompt.audio : null;
        const passage = typeof item.prompt.passage === 'string' ? item.prompt.passage : null;
        const context = typeof item.prompt.context === 'string' ? item.prompt.context : null;

        return (
          <section className="card" id={`question-${index + 1}`} key={item.id}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
              <p className="eyebrow" style={{ margin: 0 }}>CÂU HỎI {index + 1}</p>
              <button
                type="button"
                className="button secondary"
                style={{ minHeight: '30px', padding: '4px 10px', fontSize: '0.74rem' }}
                onClick={() => setReportingTarget({ itemVersionId: item.versionId, titleContext: pText })}
                title="Báo lỗi câu hỏi này"
              >
                🚩 Báo lỗi
              </button>
            </div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '14px' }}>{pText}</h2>

            {/* Audio player for listening questions */}
            {audio && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  background: 'var(--primary-soft)',
                  borderRadius: '12px',
                  marginBottom: '16px',
                }}
              >
                <button
                  type="button"
                  className="button primary"
                  style={{ minHeight: '40px', padding: '6px 16px' }}
                  onClick={() => speak(audio)}
                >
                  ▶ Phát đoạn nghe
                </button>
                <span style={{ fontSize: '0.84rem', color: 'var(--muted)' }}>
                  Nghe bao nhiêu lần tùy thích. Thử nghe 1 lần trước khi trả lời.
                </span>
              </div>
            )}

            {/* Reading passage or context card */}
            {(passage || context) && (
              <div
                style={{
                  padding: '14px 18px',
                  background: '#f8fafc',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  fontStyle: 'italic',
                  lineHeight: 1.6,
                }}
              >
                {passage || context}
              </div>
            )}

            {/* Choice or Text Input */}
            {item.responseType === 'SINGLE_CHOICE' && Array.isArray(item.prompt.options) ? (
              <fieldset>
                <legend>Chọn phương án chính xác:</legend>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {item.prompt.options.map((option) => (
                    <label
                      className="choice"
                      key={String(option)}
                      style={{
                        padding: '12px 16px',
                        border: '1.5px solid var(--border)',
                        borderRadius: '12px',
                        background: answers[item.id] === option ? 'var(--primary-soft)' : '#ffffff',
                        cursor: attempt.status === 'IN_PROGRESS' && !busy ? 'pointer' : 'default',
                      }}
                    >
                      <input
                        type="radio"
                        name={item.id}
                        value={String(option)}
                        checked={answers[item.id] === option}
                        disabled={attempt.status !== 'IN_PROGRESS' || busy}
                        onChange={() => setAnswers((current) => ({ ...current, [item.id]: String(option) }))}
                      />
                      <span style={{ fontWeight: 600 }}>{String(option)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : (
              <label className="form-stack">
                Câu trả lời của bạn:
                <input
                  value={answers[item.id] ?? ''}
                  disabled={attempt.status !== 'IN_PROGRESS' || busy}
                  placeholder="Gõ câu trả lời của bạn tại đây..."
                  onChange={(event) => setAnswers((current) => ({ ...current, [item.id]: event.target.value }))}
                />
              </label>
            )}

            {attempt.status === 'IN_PROGRESS' && (
              <div className="row-actions" style={{ marginTop: '16px' }}>
                <button
                  type="button"
                  className="button secondary"
                  disabled={busy || !answers[item.id]}
                  onClick={() => void save(item.id)}
                >
                  Lưu câu trả lời
                </button>
                {item.supportPolicy.hintAllowed && (
                  <button
                    type="button"
                    className="button secondary"
                    disabled={busy}
                    onClick={() => void showHint(item.id)}
                  >
                    {item.hintRevealed ? 'Xem lại gợi ý' : '💡 Xem gợi ý'}
                  </button>
                )}
              </div>
            )}

            {hints[item.id] && <p className="hint" style={{ marginTop: '12px' }}>💡 Gợi ý: {hints[item.id]}</p>}

            {attempt.feedback?.items.find((entry) => entry.itemId === item.id) && (
              <p
                className="feedback"
                style={{
                  marginTop: '14px',
                  background: attempt.feedback.items.find((entry) => entry.itemId === item.id)?.correct
                    ? '#f0fdf4'
                    : '#fff6f9',
                  borderLeft: attempt.feedback.items.find((entry) => entry.itemId === item.id)?.correct
                    ? '4px solid #22c55e'
                    : '4px solid #f43f5e',
                }}
              >
                <strong>
                  {attempt.feedback.items.find((entry) => entry.itemId === item.id)?.correct
                    ? '✓ Rất tốt! '
                    : '→ Cần lưu ý: '}
                </strong>
                {attempt.feedback.items.find((entry) => entry.itemId === item.id)?.explanation}
              </p>
            )}
          </section>
        );
      })}

      {attempt?.status === 'IN_PROGRESS' && (
        <button
          type="button"
          className="button primary large"
          disabled={busy || attempt.items.some((item) => !item.response)}
          onClick={() => void submit()}
        >
          Nộp bài và nhận phản hồi chi tiết →
        </button>
      )}

      {attempt?.status === 'EVALUATED' && (
        <div style={{ display: 'flex', gap: '14px' }}>
          <Link className="button primary large" href="/dashboard">
            Khép lại bài học và về Kế hoạch hôm nay →
          </Link>
        </div>
      )}

      {reportingTarget && attempt && (
        <ContentReportModal
          isOpen={Boolean(reportingTarget)}
          onClose={() => setReportingTarget(null)}
          packageVersionId={attempt.packageVersionId}
          itemVersionId={reportingTarget.itemVersionId}
          titleContext={reportingTarget.titleContext}
        />
      )}
        </div>
        <aside className="study-sidebar" aria-label="Question outline">
          <div className="study-sidebar-card">
            <p className="eyebrow">Bài luyện tập</p>
            <h2>Các câu hỏi</h2>
            <p className="study-sidebar-note">{attempt ? `${attempt.items.filter((item) => Boolean(item.response)).length}/${attempt.items.length} câu đã lưu` : 'Đang tải câu hỏi…'}</p>
            {attempt && <ol className="study-outline">
              {attempt.items.map((item, index) => (
                <li key={item.id}><a href={`#question-${index + 1}`}><span>{String(index + 1).padStart(2, '0')}</span>Câu hỏi {index + 1}{item.response ? ' · Đã lưu' : ''}</a></li>
              ))}
            </ol>}
            <p className="study-sidebar-note">Bạn có thể quay lại câu trước khi nộp bài.</p>
          </div>
        </aside>
      </div>
    </article>
  );
}
