'use client';

import { useAuth } from '@clerk/nextjs';
import type { LessonDto } from '@lingora/contracts';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLesson, startAttempt } from '@/lib/api';

export function LessonView({ lessonId }: { lessonId: string }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonDto | null>(null);
  const [message, setMessage] = useState('Preparing your lesson…');

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    void getToken().then((token) => {
      if (!token) throw new Error('Please sign in again.');
      return getLesson(token, lessonId);
    }).then((data) => {
      setLesson(data);
      setMessage('');
    }).catch((error: unknown) => {
      setMessage(error instanceof Error ? error.message : 'Unable to load lesson.');
    });
  }, [getToken, isLoaded, isSignedIn, lessonId]);

  if (!lesson) return <section className="card" aria-live="polite">{message}</section>;
  const text = (value: unknown) => typeof value === 'string' ? value : '';
  async function begin() {
    try {
      setMessage('Opening your practice…');
      const token = await getToken(); if (!token) throw new Error('Please sign in again.');
      const attempt = await startAttempt(token, lessonId);
      router.push(`/attempts/${attempt.id}`);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to start practice.'); }
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
      <button className="button primary" onClick={() => void begin()}>Start or resume practice</button>
    </article>
  );
}
