'use client';

import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { DashboardDto, GoalInputDto } from '@lingora/contracts';
import { completeBreak, createGoal, generatePlan, getDashboard, overrideBlock } from '@/lib/api';

export function DashboardView() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardDto | null>(null);
  const [message, setMessage] = useState('Preparing your study day…');
  const [busy, setBusy] = useState(false);
  const [purpose, setPurpose] = useState<GoalInputDto['purpose']>('IELTS_ACADEMIC');
  const [targetBand, setTargetBand] = useState('');
  const [deadline, setDeadline] = useState('');
  const [minutes, setMinutes] = useState(20);

  const refresh = useCallback(async () => {
    const token = await getToken();
    if (!token) throw new Error('Please sign in again.');
    setDashboard(await getDashboard(token));
    setMessage('');
  }, [getToken]);
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    void refresh().catch((error: unknown) => setMessage(error instanceof Error ? error.message : 'Unable to load dashboard.'));
  }, [isLoaded, isSignedIn, refresh]);

  async function saveGoal(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const token = await getToken(); if (!token) throw new Error('Please sign in again.');
      await createGoal(token, { purpose, targetBand: targetBand ? Number(targetBand) : null,
        deadline: deadline || null, studyMinutesPerDay: minutes });
      await generatePlan(token); await refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to save goal.'); }
    finally { setBusy(false); }
  }

  async function createPlan() {
    setBusy(true); setMessage('');
    try { const token = await getToken(); if (!token) throw new Error('Please sign in again.');
      await generatePlan(token); await refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to prepare plan.'); }
    finally { setBusy(false); }
  }

  async function changeBlock(blockId: string, action: 'skip' | 'defer' | 'replace' | 'explore' | 'complete') {
    setBusy(true); setMessage('Updating today’s plan…');
    try { const token = await getToken(); if (!token) throw new Error('Please sign in again.');
      setDashboard(action === 'complete' ? await completeBreak(token, blockId) : await overrideBlock(token, blockId, action));
      setMessage('Plan updated. This does not change your ability state.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to update plan.'); }
    finally { setBusy(false); }
  }

  const action = dashboard?.nextAction;
  const href = action?.type === 'RESUME_ATTEMPT' || action?.type === 'VIEW_FEEDBACK'
    ? `/attempts/${action.target.attemptId}`
    : action?.type === 'OPEN_LESSON' || action?.type === 'START_ACTIVITY'
      ? `/lessons/${action.target.lessonId}` : null;

  return <>
    <header className="section-heading"><p className="eyebrow">Your study day</p><h1>A clear next step</h1>
      <p>Small steps count. Your ability label reflects only the evidence gathered so far.</p></header>
    <p className="status" role="status">{message}</p>
    {dashboard && !dashboard.goal && <form className="card form-stack" onSubmit={(event) => void saveGoal(event)}>
      <h2>Set a study goal</h2>
      <label>Purpose<select value={purpose} onChange={(event) => setPurpose(event.target.value as GoalInputDto['purpose'])}>
        <option value="IELTS_ACADEMIC">IELTS Academic</option><option value="STUDY_ABROAD">Study abroad</option><option value="GENERAL_ENGLISH">General English</option>
      </select></label>
      <label>Target band, if known<input type="number" min="0" max="9" step="0.5" value={targetBand} onChange={(event) => setTargetBand(event.target.value)} /></label>
      <label>Deadline, if known<input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} /></label>
      <label>Minutes you can study each day<input type="number" min="5" max="240" value={minutes} onChange={(event) => setMinutes(Number(event.target.value))} required /></label>
      <button className="button primary" disabled={busy}>Save goal and make today’s plan</button>
    </form>}
    {dashboard?.goal && <div className="lesson-stack">
      <section className="card"><p className="eyebrow">Next action · {action?.reasonCodes.join(', ')}</p>
        <h2>{action?.type.replaceAll('_', ' ')}</h2>
        {href ? <Link className="button primary" href={href}>Continue</Link> : action?.type === 'OPEN_TODAY_PLAN'
          ? <button className="button primary" onClick={() => void createPlan()} disabled={busy}>Prepare today’s plan</button>
          : <p>Return when you are ready for the next study day.</p>}
      </section>
      <section className="card"><h2>Today’s sequence</h2>
        {dashboard.plan ? <ol>{dashboard.plan.blocks.map((block) => <li key={block.id}>
          {block.type.toLowerCase()} — {block.status.toLowerCase()}
          {block.status === 'PENDING' && <span className="row-actions">
            {block.type === 'BREAK' ? <button className="button secondary" disabled={busy} onClick={() => void changeBlock(block.id, 'complete')}>Finish break</button> : <>
              <button className="button secondary" disabled={busy} onClick={() => void changeBlock(block.id, 'skip')}>Skip</button>
              <button className="button secondary" disabled={busy} onClick={() => void changeBlock(block.id, 'defer')}>Defer</button>
              <button className="button secondary" disabled={busy} onClick={() => void changeBlock(block.id, 'replace')}>Replace</button>
              <button className="button secondary" disabled={busy} onClick={() => void changeBlock(block.id, 'explore')}>Explore</button>
            </>}
          </span>}
        </li>)}</ol> : <p>Your plan is ready to create.</p>}
        <p>Finishing a block records progress through today’s plan. It does not mean mastery.</p>
      </section>
      <section className="card"><h2>Current evidence</h2><p>{dashboard.competency.label.toLowerCase()} · {dashboard.competency.confidence.toLowerCase()} confidence</p></section>
    </div>}
  </>;
}
