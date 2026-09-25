'use client';

import { useAuth } from '@clerk/nextjs';
import type { LessonDto } from '@lingora/contracts';
import { useEffect, useState } from 'react';
import { getLesson } from '@/lib/api';

export function LessonView({ lessonId }: { lessonId: string }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
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
    </article>
  );
}
