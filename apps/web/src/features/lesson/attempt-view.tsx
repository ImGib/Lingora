'use client';

import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { AttemptDto } from '@lingora/contracts';
import { getAttempt, revealHint, saveResponse, submitAttempt } from '@/lib/api';

export function AttemptView({ attemptId }: { attemptId: string }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [attempt, setAttempt] = useState<AttemptDto | null>(null);
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [hints, setHints] = useState<Record<string,string>>({});
  const [message, setMessage] = useState('Loading saved work…');
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const token = await getToken(); if (!token) throw new Error('Please sign in again.');
    const loaded = await getAttempt(token, attemptId);
    setAttempt(loaded);
    setAnswers(Object.fromEntries(loaded.items.map((item) => [item.id, item.response ?? ''])));
    setMessage('');
  }, [attemptId, getToken]);
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    void refresh().catch((error: unknown) => setMessage(error instanceof Error ? error.message : 'Unable to load work.'));
  }, [isLoaded, isSignedIn, refresh]);

  async function save(itemId: string) {
    setBusy(true); setMessage('Saving…');
    try {
      const token = await getToken(); if (!token) throw new Error('Please sign in again.');
      await saveResponse(token, attemptId, itemId, answers[itemId] ?? '');
      await refresh(); setMessage('Saved. You can close this page and return later.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to save.'); }
    finally { setBusy(false); }
  }

  async function showHint(itemId: string) {
    setBusy(true); setMessage('');
    try { const token = await getToken(); if (!token) throw new Error('Please sign in again.');
      const hint = await revealHint(token, attemptId, itemId);
      setHints((current) => ({ ...current, [itemId]: hint })); await refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Hint unavailable.'); }
    finally { setBusy(false); }
  }

  async function submit() {
    setBusy(true); setMessage('Checking your responses…');
    try {
      const token = await getToken(); if (!token) throw new Error('Please sign in again.');
      const storageKey = `lingora-submit-${attemptId}`;
      let key = sessionStorage.getItem(storageKey);
      if (!key) { key = crypto.randomUUID(); sessionStorage.setItem(storageKey, key); }
      await submitAttempt(token, attemptId, key);
      await refresh(); setMessage('Your feedback is ready.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to submit. Your answers are saved.'); }
    finally { setBusy(false); }
  }

  return <article className="lesson-stack">
    <header className="section-heading"><p className="eyebrow">Learning mode · saved practice</p>
      <h1>Try the routine forms</h1><p>Save each response before submitting. Your first answer and any hint use are kept with this attempt.</p></header>
    <p className="status" role="status">{message}</p>
    {attempt?.items.map((item, index) => <section className="card" key={item.id}>
      <p className="eyebrow">Question {index + 1}</p><h2>{typeof item.prompt.text === 'string' ? item.prompt.text : ''}</h2>
      {item.responseType === 'SINGLE_CHOICE' && Array.isArray(item.prompt.options)
        ? <fieldset><legend>Choose one answer</legend>{item.prompt.options.map((option) =>
          <label className="choice" key={String(option)}><input type="radio" name={item.id} value={String(option)}
            checked={answers[item.id] === option} disabled={attempt.status !== 'IN_PROGRESS' || busy}
            onChange={() => setAnswers((current) => ({ ...current, [item.id]: String(option) }))} />{String(option)}</label>)}</fieldset>
        : <label className="form-stack">Your verb form<input value={answers[item.id] ?? ''}
            disabled={attempt?.status !== 'IN_PROGRESS' || busy}
            onChange={(event) => setAnswers((current) => ({ ...current, [item.id]: event.target.value }))} /></label>}
      {attempt.status === 'IN_PROGRESS' && <div className="row-actions">
        <button className="button secondary" disabled={busy || !answers[item.id]} onClick={() => void save(item.id)}>Save response</button>
        {item.supportPolicy.hintAllowed && <button className="button secondary" disabled={busy} onClick={() => void showHint(item.id)}>
          {item.hintRevealed ? 'Show hint again' : 'Reveal hint'}</button>}
      </div>}
      {hints[item.id] && <p className="hint">Hint: {hints[item.id]}</p>}
      {attempt.feedback?.items.find((entry) => entry.itemId === item.id) && <p className="feedback">
        {attempt.feedback.items.find((entry) => entry.itemId === item.id)?.correct ? 'Good form. ' : 'Keep practising. '}
        {attempt.feedback.items.find((entry) => entry.itemId === item.id)?.explanation}</p>}
    </section>)}
    {attempt?.status === 'IN_PROGRESS' && <button className="button primary" disabled={busy || attempt.items.some((item) => !item.response)} onClick={() => void submit()}>Submit saved responses</button>}
    {attempt?.status === 'EVALUATED' && <Link className="button primary" href="/dashboard">Return to today’s plan</Link>}
  </article>;
}
