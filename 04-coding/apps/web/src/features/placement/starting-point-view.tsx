'use client';

import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { PlacementDto } from '@lingora/contracts';
import { completePlacement, getCurrentPlacement, savePlacementResponse, startPlacement } from '@/lib/api';

function promptText(prompt: Record<string, unknown>): string {
  return typeof prompt.text === 'string' ? prompt.text : 'Read the question and choose an answer.';
}

export function StartingPointView() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [placement, setPlacement] = useState<PlacementDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('Loading your check…');
  const [draft, setDraft] = useState('');

  const refresh = useCallback(async () => {
    const token = await getToken();
    if (!token) throw new Error('Please sign in again.');
    setPlacement(await getCurrentPlacement(token));
    setLoading(false);
    setMessage('');
  }, [getToken]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    void refresh().catch((error: unknown) => {
      setLoading(false);
      setMessage(error instanceof Error ? error.message : 'Unable to load your check.');
    });
  }, [isLoaded, isSignedIn, refresh]);

  const nextItem = placement?.status === 'IN_PROGRESS'
    ? placement.items.find((item) => item.response === null) : undefined;
  const answered = placement?.items.filter((item) => item.response !== null).length ?? 0;

  async function perform(action: (token: string) => Promise<PlacementDto>, success: string) {
    setBusy(true);
    setMessage('');
    try {
      const token = await getToken();
      if (!token) throw new Error('Please sign in again.');
      setPlacement(await action(token));
      setDraft('');
      setMessage(success);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return <>
    <header className="section-heading">
      <p className="eyebrow">Optional · about 3 minutes</p>
      <h1>Find your starting point</h1>
      <p>Try a few short questions before Day 1. You can skip or stop at any time. This check only suggests where to begin; it does not assign a level or mark a weakness.</p>
    </header>
    <p className="status" role="status">{message}</p>
    {!isLoaded ? <p>Loading…</p> : !isSignedIn ? <Link href="/sign-in">Sign in to continue</Link> : loading ? <p>Loading…</p> : <div className="lesson-stack">
      {!placement && <section className="card">
        <h2>Ready when you are</h2>
        <p>Your answers are saved as you go. Skipping sends you to Day 1.</p>
        <div className="row-actions">
          <button className="button primary" disabled={busy} onClick={() => void perform(
            (token) => startPlacement(token, 'START', crypto.randomUUID()), 'Check started.')}>Start check</button>
          <button className="button secondary" disabled={busy} onClick={() => void perform(
            (token) => startPlacement(token, 'SKIP', crypto.randomUUID()), 'You can begin with Day 1.')}>Skip check</button>
        </div>
      </section>}
      {placement?.status === 'IN_PROGRESS' && <section className="card">
        <p className="eyebrow">Question {Math.min(answered + 1, placement.items.length)} of {placement.items.length}</p>
        {nextItem ? <form onSubmit={(event) => {
          event.preventDefault();
          if (!draft.trim()) return;
          void perform((token) => savePlacementResponse(token, placement.id, nextItem.id, draft), 'Answer saved.');
        }}>
          <h2>{promptText(nextItem.prompt)}</h2>
          {nextItem.responseType === 'SINGLE_CHOICE' && Array.isArray(nextItem.prompt.options)
            ? <fieldset><legend>Choose one answer</legend>{nextItem.prompt.options.filter((value): value is string => typeof value === 'string').map((option) =>
              <label className="choice" key={option}><input type="radio" name="answer" value={option} checked={draft === option}
                onChange={() => setDraft(option)} required />{option}</label>)}</fieldset>
            : <label className="form-stack">Your answer<input value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={500} required /></label>}
          <div className="row-actions"><button className="button primary" disabled={busy || !draft.trim()}>Save and continue</button></div>
        </form> : <><h2>All answers saved</h2><p>Finish to see a suggested starting point.</p></>}
        <div className="row-actions"><button className="button secondary" disabled={busy} onClick={() => void perform(
          (token) => completePlacement(token, placement.id), 'Check complete.')}>Finish with saved answers</button></div>
        <p>You can leave this page and return. Missing answers only mean more evidence is needed.</p>
      </section>}
      {placement && placement.status !== 'IN_PROGRESS' && <section className="card">
        <h2>{placement.status === 'SKIPPED' ? 'Start with Day 1' : 'Your suggested start'}</h2>
        <p>{placement.recommendedStart === 'WEEK_1_DAY_2' ? 'The sampled questions were demonstrated. Day 2 is a suggested next step.' : 'Day 1 is a good place to begin.'} You can choose your pace.</p>
        {placement.status === 'COMPLETED' && <ul>{placement.items.map((item) => <li key={item.id}>
          {promptText(item.prompt)} — {item.result === 'ALREADY_DEMONSTRATED' ? 'Already demonstrated' : 'Need more evidence'}
        </li>)}</ul>}
        <Link className="button primary" href="/dashboard">Go to dashboard</Link>
      </section>}
    </div>}
  </>;
}
