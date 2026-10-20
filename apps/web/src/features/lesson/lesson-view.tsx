'use client';

import { useAuth } from '@clerk/nextjs';
import type { LessonDto, LessonExposureDto } from '@lingora/contracts';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { completeLessonExposure, getLesson, getLessonExposure, startAttempt } from '@/lib/api';

export function LessonView({ lessonId }: { lessonId: string }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonDto | null>(null);
  const [exposure, setExposure] = useState<LessonExposureDto | null>(null);
  const [message, setMessage] = useState('Preparing your lesson…');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    void getToken().then(async (token) => {
      if (!token) throw new Error('Please sign in again.');
      const data = await getLesson(token, lessonId);
      const isExposure = data.activities.length > 0 && data.activities.every((activity) => activity.items.length === 0);
      return { data, exposure: isExposure ? await getLessonExposure(token, lessonId) : null };
    }).then(({ data, exposure }) => {
      setLesson(data);
      setExposure(exposure);
      setMessage('');
    }).catch((error: unknown) => {
      setMessage(error instanceof Error ? error.message : 'Unable to load lesson.');
    });
  }, [getToken, isLoaded, isSignedIn, lessonId]);

  if (!lesson) return <section className="card" aria-live="polite">{message}</section>;
  const text = (value: unknown) => typeof value === 'string' ? value : '';
  async function begin() {
    try {
      setBusy(true);
      setMessage('Opening your practice…');
      const token = await getToken(); if (!token) throw new Error('Please sign in again.');
      const attempt = await startAttempt(token, lessonId);
      router.push(`/attempts/${attempt.id}`);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to start practice.'); }
    finally { setBusy(false); }
  }
  async function finishExposure() {
    try {
      setBusy(true);
      setMessage('Saving your reading progress…');
      const token = await getToken(); if (!token) throw new Error('Please sign in again.');
      setExposure(await completeLessonExposure(token, lessonId));
      setMessage('Reading complete. This does not change your ability state.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to save progress.'); }
    finally { setBusy(false); }
  }
  return (
    <article className="lesson-stack">
      <header className="section-heading">
        <p className="eyebrow">Learning mode · Package v{lesson.packageVersion}</p>
        <h1>{lesson.title}</h1>
        <p>{lesson.summary}</p>
      </header>
      {lesson.activities.map((activity) => (
        <section className="card" key={activity.id}>
          <p className="eyebrow">{activity.type.replaceAll('_', ' ')}</p>
          <h2>{activity.title}</h2>
          {'body' in activity.content && <p>{String(activity.content.body)}</p>}
          {'instruction' in activity.content && <p>{String(activity.content.instruction)}</p>}
          {activity.items.map((item) => (
            <div className="item-prompt" key={item.versionId}>
              <p>{text(item.prompt.text)}</p>
              {Array.isArray(item.prompt.options) && (
                <ul>{item.prompt.options.map((option) => <li key={String(option)}>{String(option)}</li>)}</ul>
              )}
            </div>
          ))}
        </section>
      ))}
      <p className="status" role="status">{message}</p>
      {exposure ? <>
        <p>Reading this lesson records exposure only. You can return to it at any time.</p>
        {exposure.status === 'COMPLETED'
          ? <Link className="button primary" href="/dashboard">Return to dashboard</Link>
          : <button className="button primary" disabled={busy} onClick={() => void finishExposure()}>I have read this lesson</button>}
      </> : <button className="button primary" disabled={busy} onClick={() => void begin()}>Start or resume practice</button>}
    </article>
  );
}
