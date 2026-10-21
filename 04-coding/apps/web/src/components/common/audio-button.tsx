'use client';

import { useEffect, useRef, useState } from 'react';

export interface AudioButtonProps {
  text: string;
  audioSrc?: string;
  lang?: string;
  className?: string;
}

export function AudioButton({ text, audioSrc, lang = 'en-US', className = '' }: AudioButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [playingRate, setPlayingRate] = useState<1 | 0.75 | null>(null);
  const [error, setError] = useState('');

  useEffect(() => () => {
    audioRef.current?.pause();
    if (utteranceRef.current && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  function play(rate: 1 | 0.75) {
    audioRef.current?.pause();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setError('');
    setPlayingRate(rate);

    if (audioSrc) {
      const audio = new Audio(audioSrc);
      audioRef.current = audio;
      audio.playbackRate = rate;
      audio.onended = () => setPlayingRate(null);
      audio.onerror = () => {
        setPlayingRate(null);
        setError('Không phát được âm thanh. Hãy thử lại.');
      };
      void audio.play().catch(() => {
        setPlayingRate(null);
        setError('Trình duyệt chưa cho phép phát âm thanh. Hãy thử lại.');
      });
      return;
    }

    if (!('speechSynthesis' in window) || !text.trim()) {
      setPlayingRate(null);
      setError('Trình duyệt này chưa hỗ trợ phát âm thanh.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.onend = () => setPlayingRate(null);
    utterance.onerror = () => {
      setPlayingRate(null);
      setError('Không phát được âm thanh. Hãy thử lại.');
    };
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className={`ipa-audio-actions ${className}`.trim()} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
      <button type="button" className="button secondary" onClick={() => play(1)} aria-label={`Nghe chuẩn ${text}`} aria-pressed={playingRate === 1}>
        🔊 Chuẩn (1.0x)
      </button>
      <button type="button" className="button secondary" onClick={() => play(0.75)} aria-label={`Nghe chậm ${text}`} aria-pressed={playingRate === 0.75}>
        🐢 Chậm (0.75x)
      </button>
      {error && <span role="status" className="small muted">{error}</span>}
    </div>
  );
}
