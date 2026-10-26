'use client';

import { UserButton, useAuth } from '@clerk/nextjs';
import { HeaderNav } from '@/components/common/header-nav';
import Link from 'next/link';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import type { DashboardDto, GoalInputDto } from '@lingora/contracts';
import { completeBreak, createGoal, generatePlan, getDashboard, overrideBlock, transitionSession } from '@/lib/api';
import { GrowthTreeCard } from './growth-tree-card';
import { TodayActionCard } from './today-action-card';

type PlanBlock = NonNullable<DashboardDto['plan']>['blocks'][number];
type BlockAction = 'skip' | 'defer' | 'replace' | 'explore' | 'complete';

const blockCopy: Record<PlanBlock['type'], { title: string; description: string }> = {
  LESSON: { title: 'Learn something new', description: 'Take in the idea before you practise it.' },
  PRACTICE: { title: 'Try it yourself', description: 'Use what you have learned in a short activity.' },
  BREAK: { title: 'Take a pause', description: 'Rest for a moment before your next step.' },
  REVIEW: { title: 'Refresh your memory', description: 'Revisit a familiar structure at an optimal spaced interval.' },
  VERIFY: { title: 'Check your footing', description: 'A gentle recovery check to regain confidence after time away.' },
  TRANSFER: { title: 'Apply to something new', description: 'See how well your knowledge carries over to novel situations.' },
};

const statusCopy: Record<PlanBlock['status'], string> = {
  PENDING: 'Upcoming', COMPLETED: 'Completed', SKIPPED: 'Skipped', DEFERRED: 'Deferred',
};

function purposeLabel(purpose: GoalInputDto['purpose']): string {
  if (purpose === 'IELTS_ACADEMIC') return 'IELTS Academic';
  if (purpose === 'STUDY_ABROAD') return 'Study abroad';
  return 'Everyday English';
}

function nextActionCopy(type: string): { eyebrow: string; title: string; description: string; cta: string } {
  switch (type) {
    case 'OPEN_TODAY_PLAN': return { eyebrow: 'Ready when you are', title: 'Make room for learning today.', description: 'We will arrange a small sequence around the time you set aside.', cta: 'Prepare my plan' };
    case 'OPEN_LESSON': return { eyebrow: 'Your next step', title: 'Start with the lesson.', description: 'Read the new idea first. You can come back to your plan at any time.', cta: 'Open lesson' };
    case 'START_ACTIVITY': return { eyebrow: 'Your next step', title: 'Put it into practice.', description: 'Try the next activity and save your work as you go.', cta: 'Open activity' };
    case 'RESUME_ATTEMPT': return { eyebrow: 'Saved for you', title: 'Pick up where you left off.', description: 'Your earlier answers are waiting. Take your time to finish.', cta: 'Resume practice' };
    case 'RESUME_SESSION': return { eyebrow: 'Session paused', title: 'Come back at your pace.', description: 'Resume the study session when you are ready.', cta: 'Resume session' };
    case 'VIEW_FEEDBACK': return { eyebrow: 'Feedback ready', title: 'Look at what you learned.', description: 'Review your responses and choose a useful next step.', cta: 'View feedback' };
    case 'TAKE_BREAK': return { eyebrow: 'A moment to rest', title: 'Pause before continuing.', description: 'A short break is part of a sustainable study day.', cta: 'Mark break complete' };
    case 'FINISH_DAY': return { eyebrow: 'Today’s sequence', title: 'You have reached a stopping point.', description: 'Close your session when you are done. Completing a plan is different from proving mastery.', cta: 'Finish study day' };
    default: return { eyebrow: 'Your study day', title: 'A clear next step is coming.', description: 'Your plan will show what to do next.', cta: 'Continue' };
  }
}

function actionHref(action: DashboardDto['nextAction']): string | null {
  if ((action.type === 'RESUME_ATTEMPT' || action.type === 'VIEW_FEEDBACK') && action.target.attemptId) {
    return `/attempts/${action.target.attemptId}`;
  }
  if ((action.type === 'OPEN_LESSON' || action.type === 'START_ACTIVITY') && action.target.lessonId) {
    return `/lessons/${action.target.lessonId}`;
  }
  return null;
}

function friendlyDate(localDate: string | undefined): string {
  if (!localDate) return 'Your study day';
  const date = new Date(`${localDate.slice(0, 10)}T12:00:00`);
  return Number.isNaN(date.getTime()) ? 'Your study day' : new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(date);
}

export function DashboardView() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [purpose, setPurpose] = useState<GoalInputDto['purpose']>('IELTS_ACADEMIC');
  const [targetBand, setTargetBand] = useState('');
  const [deadline, setDeadline] = useState('');
  const [minutes, setMinutes] = useState(20);

  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Please sign in again.');
      const data = await getDashboard(token);
      setDashboard(data);
      setMessage('');
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unable to load your plan.';
      setLoadError(errMsg);
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setLoading(false);
      return;
    }
    void refresh();
  }, [isLoaded, isSignedIn, refresh]);

  async function saveGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const token = await getToken(); if (!token) throw new Error('Please sign in again.');
      await createGoal(token, { purpose, targetBand: targetBand ? Number(targetBand) : null,
        deadline: deadline || null, studyMinutesPerDay: minutes });
      await generatePlan(token);
      await refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to save your goal.'); }
    finally { setBusy(false); }
  }

  async function createPlan() {
    setBusy(true); setMessage('Preparing today’s plan…');
    try {
      const token = await getToken(); if (!token) throw new Error('Please sign in again.');
      await generatePlan(token);
      await refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to prepare your plan.'); }
    finally { setBusy(false); }
  }

  async function changeBlock(blockId: string, action: BlockAction) {
    setBusy(true); setMessage('Updating today’s plan…');
    try {
      const token = await getToken(); if (!token) throw new Error('Please sign in again.');
      setDashboard(action === 'complete' ? await completeBreak(token, blockId) : await overrideBlock(token, blockId, action));
      setMessage('Plan updated. This does not change your ability state.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to update your plan.'); }
    finally { setBusy(false); }
  }

  async function changeSession(action: 'pause' | 'resume' | 'complete') {
    if (!dashboard?.session) return;
    setBusy(true); setMessage('Updating your study session…');
    try {
      const token = await getToken(); if (!token) throw new Error('Please sign in again.');
      await transitionSession(token, dashboard.session.id, action);
      await refresh();
      setMessage(action === 'pause' ? 'Session paused. Your saved answers are ready when you return.' : 'Session updated.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to update your session.'); }
    finally { setBusy(false); }
  }

  const plan = dashboard?.plan;
  const action = dashboard?.nextAction;
  const next = action ? nextActionCopy(action.type) : null;
  const href = action ? actionHref(action) : null;
  const completed = plan?.blocks.filter((block) => block.status === 'COMPLETED').length ?? 0;
  const settled = plan?.blocks.filter((block) => block.status !== 'PENDING').length ?? 0;
  const breakBlockId = action?.type === 'TAKE_BREAK' ? action.planBlockId : null;

  return (
    <div className="dashboard-page">
      <header className="px-6 py-4 max-w-7xl mx-auto w-full">
        <HeaderNav />
      </header>

      <div className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-kicker"><span className="kicker-line" /> YOUR LEARNING SPACE</p>
            <h1>A little progress,<br /><span>every day.</span></h1>
            <p>Follow a calm plan, keep your place, and learn at a pace you can sustain.</p>
          </div>
          <div className="dashboard-date-card">
            <span className="dashboard-date-dot" />
            <span>{friendlyDate(plan?.localDate)}</span>
          </div>
        </header>

        <p className="dashboard-live-status" role="status">{message}</p>

        {!isLoaded || (isSignedIn && loading && !dashboard) ? (
          <section className="dashboard-empty is-loading" aria-busy="true">
            <div className="dashboard-spinner" aria-hidden="true" />
            <h2>Getting things ready…</h2>
            <p>Your study space is loading.</p>
          </section>
        ) : !isSignedIn ? (
          <section className="dashboard-empty">
            <h2>Welcome back when you’re ready.</h2>
            <p>Sign in to see your saved plan.</p>
            <Link className="button primary" href="/sign-in">Sign in</Link>
          </section>
        ) : loadError && !dashboard ? (
          <section className="dashboard-empty">
            <h2>We couldn’t load your plan.</h2>
            <p>{loadError}</p>
            <button className="button secondary" onClick={() => void refresh()}>
              Try again
            </button>
          </section>
        ) : !dashboard ? (
          <section className="dashboard-empty is-loading" aria-busy="true">
            <div className="dashboard-spinner" aria-hidden="true" />
            <h2>Getting things ready…</h2>
            <p>Your study space is loading.</p>
          </section>
        ) : !dashboard.goal ? (
          <div className="dashboard-onboarding">
            <section className="dashboard-onboarding-intro">
              <div className="onboarding-top-row">
                <p className="dashboard-kicker">01 / BEGIN HERE</p>
                <img className="onboarding-mascot" src="/mascot.jpg" alt="" width={68} height={68} />
              </div>
              <h2>Make this plan yours.</h2>
              <p>Choose a purpose and a daily amount of time that feels realistic. You can begin small.</p>
              <div className="onboarding-note">
                <span className="note-sparkle">✦</span>
                <span>Your starting point check is optional. Skipping it never counts as a failure.</span>
              </div>
              <Link href="/starting-point">Explore the optional check <span aria-hidden="true">↗</span></Link>
            </section>
            <form className="dashboard-goal-form" onSubmit={(event) => void saveGoal(event)}>
              <h3>Your study rhythm</h3>
              <label>
                What are you learning for?
                <select value={purpose} onChange={(event) => setPurpose(event.target.value as GoalInputDto['purpose'])}>
                  <option value="IELTS_ACADEMIC">IELTS Academic</option>
                  <option value="STUDY_ABROAD">Study abroad</option>
                  <option value="GENERAL_ENGLISH">Everyday English</option>
                </select>
              </label>
              <label>
                Minutes you can study each day
                <input type="number" min="5" max="240" value={minutes} onChange={(event) => setMinutes(Number(event.target.value))} required />
              </label>
              <div className="dashboard-form-row">
                <label>
                  Target band <span>(optional)</span>
                  <input type="number" min="0" max="9" step="0.5" value={targetBand} onChange={(event) => setTargetBand(event.target.value)} />
                </label>
                <label>
                  Deadline <span>(optional)</span>
                  <input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
                </label>
              </div>
              <button className="button primary" disabled={busy}>
                Save goal and make my plan <span aria-hidden="true">→</span>
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="dashboard-overview">
              <TodayActionCard
                initialMode={dashboard.goal.studyMinutesPerDay <= 10 ? 'light_5' : 'standard_20'}
                title={next?.title}
                description={next?.description}
                ctaText={next?.cta}
                ctaHref={href}
                onActionClick={
                  action?.type === 'RESUME_SESSION'
                    ? () => void changeSession('resume')
                    : action?.type === 'OPEN_TODAY_PLAN'
                    ? () => void createPlan()
                    : breakBlockId
                    ? () => void changeBlock(breakBlockId, 'complete')
                    : action?.type === 'FINISH_DAY' && dashboard.session
                    ? () => void changeSession('complete')
                    : undefined
                }
                isBusy={busy}
                activeBlockType={action?.type}
              />

              <aside className="dashboard-rhythm-card" aria-label="Study rhythm">
                <div className="rhythm-header">
                  <span>YOUR RHYTHM</span>
                  <span className="rhythm-flower" aria-hidden="true">✳</span>
                </div>
                <p className="rhythm-number">{dashboard.goal.studyMinutesPerDay}<span> min / day</span></p>
                <p>A steady amount you chose for your learning days.</p>
                <div className="rhythm-divider" />
                <dl>
                  <div>
                    <dt>Learning for</dt>
                    <dd>{purposeLabel(dashboard.goal.purpose)}</dd>
                  </div>
                  {dashboard.goal.targetBand !== null && (
                    <div>
                      <dt>Target band</dt>
                      <dd>{dashboard.goal.targetBand}</dd>
                    </div>
                  )}
                  {dashboard.goal.deadline && (
                    <div>
                      <dt>By</dt>
                      <dd>{dashboard.goal.deadline}</dd>
                    </div>
                  )}
                </dl>
              </aside>
            </div>

            <div className="dashboard-lower-grid">
              <section className="dashboard-plan-card" aria-labelledby="plan-title">
                <div className="dashboard-section-head">
                  <div>
                    <p className="dashboard-kicker"><span className="kicker-line" /> 02 / TODAY’S PATH</p>
                    <h2 id="plan-title">Your plan, step by step.</h2>
                    <p>One manageable action at a time. Adjustments stay in your control.</p>
                  </div>
                  {plan && (
                    <div className="plan-count">
                      <strong>{settled}</strong>
                      <span>of {plan.blocks.length}<br />steps settled</span>
                    </div>
                  )}
                </div>
                {plan ? (
                  <>
                    <progress className="plan-progress" value={settled} max={Math.max(plan.blocks.length, 1)} aria-label="Today's plan steps settled" />
                    <ol className="plan-steps">
                      {plan.blocks.map((block, index) => (
                        <li className={`plan-step plan-step-${block.status.toLowerCase()} ${action?.planBlockId === block.id ? 'plan-step-current' : ''}`} key={block.id}>
                          <div className="plan-step-rail">
                            <span className="plan-step-number">{String(index + 1).padStart(2, '0')}</span>
                            <span className="plan-step-line" />
                          </div>
                          <div className="plan-step-body">
                            <div className="plan-step-heading">
                              <div>
                                <p className="plan-step-type">{block.type.toLowerCase()} {action?.planBlockId === block.id ? '· up next' : ''}</p>
                                <h3>{blockCopy[block.type].title}</h3>
                              </div>
                              <span className={`plan-status plan-status-${block.status.toLowerCase()}`}>
                                {block.status === 'PENDING' && action?.planBlockId === block.id ? 'Up next' : statusCopy[block.status]}
                              </span>
                            </div>
                            <p>{blockCopy[block.type].description}</p>
                            {block.status === 'PENDING' && (
                              block.type === 'BREAK' ? (
                                action?.type === 'TAKE_BREAK' && action.planBlockId === block.id && (
                                  <button className="plan-inline-action" disabled={busy} onClick={() => void changeBlock(block.id, 'complete')}>
                                    Mark break complete <span aria-hidden="true">→</span>
                                  </button>
                                )
                              ) : (
                                <details className="plan-adjust">
                                  <summary>Adjust this step <span aria-hidden="true">⌄</span></summary>
                                  <div className="plan-adjust-grid">
                                    <button disabled={busy} onClick={() => void changeBlock(block.id, 'skip')}>
                                      <strong>Skip</strong>
                                      <small>Leave it out today</small>
                                    </button>
                                    <button disabled={busy} onClick={() => void changeBlock(block.id, 'defer')}>
                                      <strong>Defer</strong>
                                      <small>Come back later</small>
                                    </button>
                                    <button disabled={busy} onClick={() => void changeBlock(block.id, 'replace')}>
                                      <strong>Replace</strong>
                                      <small>Switch lesson and practice</small>
                                    </button>
                                    <button disabled={busy} onClick={() => void changeBlock(block.id, 'explore')}>
                                      <strong>Explore</strong>
                                      <small>Open this topic freely</small>
                                    </button>
                                  </div>
                                </details>
                              )
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                    <p className="plan-footnote">
                      {completed} completed · Skipping or deferring is a planning choice, never a failure. Finishing a step does not mean mastery.
                    </p>
                  </>
                ) : (
                  <div className="plan-empty">
                    <span className="plan-empty-icon" aria-hidden="true">✦</span>
                    <h3>A fresh plan starts here.</h3>
                    <p>We will put together a short path from the goal you saved.</p>
                    <button className="button primary" disabled={busy} onClick={() => void createPlan()}>
                      Prepare today’s plan
                    </button>
                  </div>
                )}
              </section>

              <aside className="dashboard-side-stack">
                <GrowthTreeCard completedCount={completed} totalCount={plan?.blocks.length || 7} />
                <section className="dashboard-evidence-card" aria-labelledby="evidence-title">
                  <p className="dashboard-kicker">03 / LEARNING SIGNAL</p>
                  <h2 id="evidence-title">What we know so far</h2>
                  <div className="evidence-state">
                    <span className="evidence-orbit" aria-hidden="true">✳</span>
                    <div>
                      <span>Current evidence</span>
                      <strong>{dashboard.competency.label.toLowerCase()}</strong>
                    </div>
                  </div>
                  <p>
                    {dashboard.competency.label === 'UNKNOWN'
                      ? 'We are still gathering evidence. Your plan can continue without an ability label.'
                      : `This signal has ${dashboard.competency.confidence.toLowerCase()} confidence based on the work recorded so far.`}
                  </p>
                  <span className="evidence-caption">Progress through a plan and evidence of ability are different things.</span>
                </section>

                <section className="dashboard-quick-actions-card" aria-label="Tiện ích và khám phá nhanh">
                  <div className="quick-actions-header">
                    <p className="dashboard-kicker">TIỆN ÍCH &amp; KHÁM PHÁ</p>
                    <span className="quick-actions-badge">2 lối tắt</span>
                  </div>
                  <div className="quick-actions-list">
                    <Link href="/starting-point" className="quick-action-item">
                      <div className="quick-action-icon bg-indigo-50 text-indigo-600" aria-hidden="true">🎯</div>
                      <div className="quick-action-text">
                        <div className="quick-action-title-row">
                          <h4>Kiểm tra đầu vào</h4>
                          <span className="quick-action-arrow" aria-hidden="true">↗</span>
                        </div>
                        <p>Bài kiểm tra ngắn gọn, tùy chọn để xác định xuất phát điểm.</p>
                      </div>
                    </Link>

                    <Link href="/prototype" className="quick-action-item">
                      <div className="quick-action-icon bg-emerald-50 text-emerald-600" aria-hidden="true">🚀</div>
                      <div className="quick-action-text">
                        <div className="quick-action-title-row">
                          <h4>Trải nghiệm Tuần 1</h4>
                          <span className="quick-action-arrow" aria-hidden="true">↗</span>
                        </div>
                        <p>Khám phá trọn vẹn luồng học 7 ngày, audio và ôn tập ngắt quãng.</p>
                      </div>
                    </Link>
                  </div>
                </section>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
