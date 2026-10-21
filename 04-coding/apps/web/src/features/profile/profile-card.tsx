'use client';

import { useAuth } from '@clerk/nextjs';
import type { MeDataDto } from '@lingora/contracts';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { getMe, updateProfile } from '@/lib/api';

export function ProfileCard() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [me, setMe] = useState<MeDataDto | null>(null);
  const [message, setMessage] = useState('Loading your profile…');

  const load = useCallback(async () => {
    const token = await getToken();
    if (!token) throw new Error('Please sign in to continue.');
    const response = await getMe(token);
    setMe(response.data);
    setMessage('');
  }, [getToken]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setMessage('Please sign in to continue.');
      return;
    }
    void load().catch((error: unknown) =>
      setMessage(error instanceof Error ? error.message : 'Unable to load profile.'),
    );
  }, [isLoaded, isSignedIn, load]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (name: string) => {
      const entry = form.get(name);
      return typeof entry === 'string' ? entry.trim() : '';
    };
    setMessage('Saving…');
    try {
      const token = await getToken();
      if (!token) throw new Error('Please sign in again.');
      const response = await updateProfile(token, {
        displayName: value('displayName') || null,
        nativeLanguage: value('nativeLanguage') || null,
        timezone: value('timezone'),
      });
      setMe(response.data);
      setMessage('Profile saved. Your next step will be goal setup.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save profile.');
    }
  }

  if (!me) return <section className="card" aria-live="polite">{message}</section>;

  return (
    <section className="card">
      <form onSubmit={submit} className="form-stack">
        <label>Display name<input name="displayName" defaultValue={me.profile.displayName ?? ''} maxLength={80} /></label>
        <label>Native language<input name="nativeLanguage" defaultValue={me.profile.nativeLanguage ?? ''} placeholder="vi" maxLength={35} /></label>
        <label>Timezone<input name="timezone" defaultValue={me.profile.timezone} required maxLength={100} /></label>
        <button className="button primary" type="submit">Save profile</button>
        <p className="status" aria-live="polite">{message || `Next step: ${me.onboarding.nextStep}`}</p>
      </form>
    </section>
  );
}
