'use client';

import { useAuth } from '@clerk/nextjs';
import type { LessonDto, LessonExposureDto } from '@lingora/contracts';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { completeLessonExposure, getLesson, getLessonExposure, startAttempt } from '@/lib/api';
import { ContentReportModal } from '../quarantine/content-report-modal';
import { ArtifactWorkspace } from '../artifacts/artifact-workspace';

function speak(text: string, rate = 0.88) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  }
}

const LETTER_IPA_MAP: Record<string, { ipa: string; vi: string; mouth: string }> = {
  A: { ipa: '/eɪ/', vi: 'ây', mouth: 'trượt ê -> i' },
  B: { ipa: '/biː/', vi: 'bi...', mouth: 'b + i dài' },
  C: { ipa: '/siː/', vi: 'xi...', mouth: 'xì nhẹ s + i dài' },
  D: { ipa: '/diː/', vi: 'đi...', mouth: 'đ + i dài' },
  E: { ipa: '/iː/', vi: 'i...', mouth: 'cười căng miệng i dài' },
  F: { ipa: '/ef/', vi: 'ép-phờ', mouth: 'e + răng chạm môi dưới' },
  G: { ipa: '/dʒiː/', vi: 'gi...', mouth: 'tròn môi gi + i dài' },
  H: { ipa: '/eɪtʃ/', vi: 'ây-chờ', mouth: 'ây + bật ch nhẹ cuối' },
  I: { ipa: '/aɪ/', vi: 'ai', mouth: 'mở miệng a trượt sang i' },
  J: { ipa: '/dʒeɪ/', vi: 'giây', mouth: 'tròn môi gi + ây' },
  K: { ipa: '/keɪ/', vi: 'kây', mouth: 'bật hơi k + ây' },
  L: { ipa: '/el/', vi: 'eo (uốn lưỡi)', mouth: 'e + cong đầu lưỡi' },
  M: { ipa: '/em/', vi: 'em (ngậm môi)', mouth: 'e + khép chặt môi' },
  N: { ipa: '/en/', vi: 'en', mouth: 'e + đầu lưỡi chạm lợi' },
  O: { ipa: '/əʊ/', vi: 'âu', mouth: 'ơ trượt sang u' },
  P: { ipa: '/piː/', vi: 'pi...', mouth: 'bật hơi p + i dài' },
  Q: { ipa: '/kjuː/', vi: 'kiu...', mouth: 'k + diu dài' },
  R: { ipa: '/ɑːr/', vi: 'a...(r)', mouth: 'mở miệng a + cuộn lưỡi' },
  S: { ipa: '/es/', vi: 'ét-sờ', mouth: 'e + xì hơi s' },
  T: { ipa: '/tiː/', vi: 'ti...', mouth: 'bật đầu lưỡi t + i dài' },
  U: { ipa: '/juː/', vi: 'diu...', mouth: 'diu ngân dài' },
  V: { ipa: '/viː/', vi: 'vi...', mouth: 'răng chạm môi rung v' },
  W: { ipa: '/ˈdʌb.əl.juː/', vi: 'đắp-bồ-diu', mouth: 'ĐẮP-bồ-diu' },
  X: { ipa: '/eks/', vi: 'ếch-xờ', mouth: 'e + k + xì s' },
  Y: { ipa: '/waɪ/', vi: 'oai / guai', mouth: 'tròn môi w + ai' },
  Z: { ipa: '/ziː/', vi: 'di...(z)', mouth: 'rung răng z + i dài' },
};

function normalizeLetters(str: string): string[] {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 12)
    .split('');
}

function MouthArticulationDiagram({ ipa, fallbackMouth }: { ipa: string; fallbackMouth: string }) {
  const isSpread = ipa.includes('iː');
  const isShortI = ipa === '/ɪ/';
  const isGlide = ipa.includes('eɪ') || ipa.includes('aɪ');
  const isBuzzZ = ipa.includes('z');
  const isNasalM = ipa === '/m/' || ipa.endsWith('m/');

  const tag = isSpread
    ? 'Khẩu hình Căng ngang (Cười tươi)'
    : isShortI
      ? 'Khẩu hình Thả lỏng (Mở hờ tự nhiên)'
      : isGlide
        ? 'Khẩu hình Trượt đôi (Mở vừa ➔ Khép dần)'
        : isBuzzZ
          ? 'Khẩu hình Khép hờ Răng & Rung cổ họng'
          : isNasalM
            ? 'Khẩu hình Ngậm khép 2 môi (Âm mũi)'
            : 'Khẩu hình Chuẩn Quốc tế';

  const lips = isSpread
    ? 'Kéo căng 2 khóe miệng sang ngang như đang mỉm cười'
    : isShortI
      ? 'Môi mở hờ tự nhiên, KHÔNG kéo căng sang hai bên'
      : isGlide
        ? 'Bắt đầu mở vừa đọc âm đầu, rồi trượt khép dần sang âm cuối'
        : isBuzzZ
          ? 'Môi hé nhẹ tự nhiên để lộ hai hàm răng khép hờ'
          : isNasalM
            ? 'Hai môi khép chạm nhẹ vào nhau ở cuối từ'
            : fallbackMouth;

  const tongue = isSpread
    ? 'Thân lưỡi nâng cao sát vòm miệng trên'
    : isShortI
      ? 'Lưỡi ở tầm giữa khoang miệng, cơ lưỡi thả lỏng'
      : isGlide
        ? 'Lưỡi lướt mượt từ vị trí giữa miệng nâng dần lên cao'
        : isBuzzZ
          ? 'Hai hàm răng gần chạm nhau, đầu lưỡi đặt sát chân răng trên'
          : 'Lưỡi thả lỏng tự nhiên bên trong khoang miệng';

  const voice = isSpread
    ? 'Rung dây thanh · Ngân dài 2 nhịp'
    : isShortI
      ? 'Rung dây thanh · Phát âm cực gọn 1 nhịp'
      : isGlide
        ? 'Rung dây thanh · Trượt liền mạch 2 nguyên âm'
        : isBuzzZ
          ? 'Rung dây thanh cổ họng + luồng hơi xì qua kẽ răng (zzz)'
          : 'Rung dây thanh, luồng hơi ngân nhẹ qua mũi (ừm)';

  const frontCaption = isSpread
    ? '↔ Căng ngang 2 bên như đang cười'
    : isShortI
      ? '↕ Môi mở hờ thả lỏng · Đọc gọn 1 nhịp'
      : isGlide
        ? '1. Mở vừa đọc /e/ ↷ 2. Khép cười sang /ɪ/'
        : isBuzzZ
          ? '🦷 Hai hàm răng khép hờ · Xì hơi rung "zzz"'
          : '👄 Hai môi ngậm khép nhẹ vào nhau';

  const sideCaption = isBuzzZ
    ? '〰 Đầu lưỡi sát răng cửa · Rung thanh quản'
    : isNasalM
      ? '👃 Luồng hơi rung thoát ra qua khoang mũi'
      : 'Lưỡi nâng cao · Rung dây thanh quản';

  return (
    <div className="ipa-mouth-studio">
      <div className="mouth-studio-top">
        <span className="mouth-spec-badge">🎯 {tag}</span>
        <span className="mouth-studio-sub">Sơ đồ Khẩu hình Trực quan</span>
      </div>
      <div className="mouth-panels-grid">
        <div className="mouth-diagram-panel front-panel">
          <div className="mouth-panel-header">1. NHÌN THẲNG (MÔI &amp; RĂNG)</div>
          <svg viewBox="0 0 128 70" className="mouth-panel-svg" aria-hidden="true">
            {isSpread && (
              <g>
                <path d="M 14 38 Q 64 16 114 38 Q 64 28 14 38 Z" fill="#f43f5e" />
                <path d="M 14 38 Q 64 60 114 38 Q 64 50 14 38 Z" fill="#e11d48" />
                <path d="M 24 38 Q 64 30 104 38 Q 64 46 24 38 Z" fill="#881337" />
                <rect x="32" y="33" width="64" height="5" rx="2" fill="#ffffff" />
                <path d="M 11 38 L 3 38 M 117 38 L 125 38" stroke="#6d28d9" strokeWidth="2.4" strokeLinecap="round" />
              </g>
            )}
            {isShortI && (
              <g>
                <path d="M 26 38 Q 64 16 102 38 Q 64 28 26 38 Z" fill="#f43f5e" />
                <path d="M 26 38 Q 64 62 102 38 Q 64 50 26 38 Z" fill="#e11d48" />
                <ellipse cx="64" cy="38" rx="26" ry="8" fill="#881337" />
                <rect x="44" y="31" width="40" height="4.5" rx="2" fill="#ffffff" />
              </g>
            )}
            {isGlide && !isSpread && (
              <g>
                <ellipse cx="48" cy="38" rx="22" ry="13" fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeDasharray="3 2" />
                <path d="M 48 40 Q 80 24 112 40 Q 80 56 48 40 Z" fill="#f43f5e" opacity="0.92" />
                <ellipse cx="80" cy="40" rx="20" ry="6" fill="#881337" />
                <rect x="64" y="35" width="32" height="4" rx="1.5" fill="#ffffff" />
              </g>
            )}
            {isBuzzZ && !isSpread && (
              <g>
                <path d="M 20 38 Q 64 18 108 38 Q 64 58 20 38 Z" fill="#f43f5e" />
                <rect x="34" y="33" width="60" height="5" rx="1.5" fill="#ffffff" />
                <rect x="34" y="38" width="60" height="5" rx="1.5" fill="#f8fafc" />
              </g>
            )}
            {isNasalM && !isGlide && (
              <g>
                <path d="M 20 38 Q 42 26 64 32 Q 86 26 108 38 Q 64 39 20 38 Z" fill="#f43f5e" />
                <path d="M 20 38 Q 64 52 108 38 Q 64 37 20 38 Z" fill="#e11d48" />
                <line x1="20" y1="38" x2="108" y2="38" stroke="#881337" strokeWidth="2.4" strokeLinecap="round" />
              </g>
            )}
          </svg>
          <div className="mouth-panel-caption">{frontCaption}</div>
        </div>
        <div className="mouth-diagram-panel side-panel">
          <div className="mouth-panel-header">2. MẶT CẮT NGANG (LƯỠI &amp; HƠI)</div>
          <svg viewBox="0 0 128 70" className="mouth-panel-svg" aria-hidden="true">
            <path d="M 24 22 Q 57 4 104 16 L 104 58" stroke="#94a3b8" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <rect x="24" y="22" width="6" height="9" rx="2" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            <rect x="26" y="42" width="6" height="9" rx="2" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            <path d="M 34 46 Q 56 22 87 30 Q 98 38 98 54" fill="#fda4af" stroke="#e11d48" strokeWidth="2.2" />
            <circle cx="96" cy="52" r="5" fill="#fef08a" stroke="#d97706" strokeWidth="1.5" />
          </svg>
          <div className="mouth-panel-caption">{sideCaption}</div>
        </div>
      </div>
      <div className="mouth-specs-list">
        <div className="mouth-spec-item">
          <span className="spec-ico">👄</span>
          <div>
            <strong>Độ mở môi:</strong> <span>{lips}</span>
          </div>
        </div>
        <div className="mouth-spec-item">
          <span className="spec-ico">👅</span>
          <div>
            <strong>Lưỡi &amp; Răng:</strong> <span>{tongue}</span>
          </div>
        </div>
        <div className="mouth-spec-item">
          <span className="spec-ico">〰️</span>
          <div>
            <strong>Dây thanh &amp; Hơi:</strong> <span>{voice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface WordBreakdownItem {
  w: string;
  ipa: string;
  how: string;
}

interface DialogueTurn {
  speaker: string;
  role?: string;
  avatar?: string;
  en: string;
  vi?: string;
  ipa?: string;
  vnGuide?: string;
  wordBreakdown?: WordBreakdownItem[];
}

interface BlendPart {
  sym: string;
  label: string;
  audio?: string;
}

interface IpaPhoneme {
  ipa: string;
  name: string;
  vnApprox?: string;
  mouth: string;
  blendFormula?: string;
  blendParts?: BlendPart[];
  example: string;
  contrast?: string;
  audioWord?: string;
}

interface BlendingRule {
  step: string;
  desc: string;
}

interface PillarItem {
  number?: number;
  type: string;
  formal: string;
  casual: string;
  tip: string;
}

interface VocabItem {
  en: string;
  ipa?: string;
  spellSteps?: string;
  syllables?: string;
  stressNote?: string;
  vi: string;
  pos?: string;
  example?: string;
  collocation?: string;
}

interface TrapItem {
  title: string;
  issue?: string;
  viIssue?: string;
  fix: string;
  example?: string;
}

interface BlueprintStep {
  step: string;
  pattern: string;
}

interface GrammarCoreConcept {
  summary: string;
  goldenRule?: string;
}

interface GrammarFunctionItem {
  title: string;
  formula: string;
  desc: string;
  examples?: Array<{ en: string; vi: string }>;
}

interface GrammarPolarityItem {
  polarity: string;
  badge: string;
  title: string;
  formula: string;
  contractionRule: string;
  examples?: Array<{ full: string; short: string; vi: string }>;
}

interface GrammarRecognitionTip {
  step: string;
  title: string;
  detail: string;
}

interface GrammarAnnotatedExample {
  sentence: string;
  ipa?: string;
  meaning: string;
  tokens?: Array<{ text: string; role: string }>;
  analysis: string;
}

export function LessonView({ lessonId }: { lessonId: string }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonDto | null>(null);
  const [exposure, setExposure] = useState<LessonExposureDto | null>(null);
  const [message, setMessage] = useState('Preparing your lesson…');
  const [busy, setBusy] = useState(false);
  const [revealedVi, setRevealedVi] = useState<Record<string, boolean>>({});
  const [customSpellName, setCustomSpellName] = useState('Linh');
  const [activeIpaIdx, setActiveIpaIdx] = useState<Record<string, number>>({});
  const [reportingTarget, setReportingTarget] = useState<{ activityId?: string; titleContext?: string } | null>(null);

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
      const token = await getToken();
      if (!token) throw new Error('Please sign in again.');
      const attempt = await startAttempt(token, lessonId);
      router.push(`/attempts/${attempt.id}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to start practice.');
    } finally {
      setBusy(false);
    }
  }

  async function finishExposure() {
    try {
      setBusy(true);
      setMessage('Saving your reading progress…');
      const token = await getToken();
      if (!token) throw new Error('Please sign in again.');
      setExposure(await completeLessonExposure(token, lessonId));
      setMessage('Reading complete. This does not change your ability state.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save progress.');
    } finally {
      setBusy(false);
    }
  }

  const toggleVi = (key: string) => {
    setRevealedVi((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <article className="lesson-stack">
      <header className="section-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Link href="/dashboard" className="button secondary" style={{ minHeight: '36px', padding: '6px 14px', fontSize: '0.82rem' }}>
            ← Về kế hoạch hôm nay
          </Link>
          <p className="eyebrow" style={{ margin: 0 }}>
            01 ĐANG HỌC · HỌC KIẾN THỨC
          </p>
        </div>
        <h1>{lesson.title}</h1>
        <p>{lesson.summary}</p>
      </header>

      <div className="study-workspace">
        <div className="study-workspace-main">
      {lesson.activities.map((activity, actIdx) => {
        const content = activity.content;
        const dialogue = Array.isArray(content.dialogue) ? (content.dialogue as DialogueTurn[]) : null;
        const phonemes = Array.isArray(content.phonemes) ? (content.phonemes as IpaPhoneme[]) : null;
        const blendingRules = Array.isArray(content.blendingRules) ? (content.blendingRules as BlendingRule[]) : null;
        const pillars = Array.isArray(content.pillars) ? (content.pillars as PillarItem[]) : null;
        const vocabulary = Array.isArray(content.vocabulary) ? (content.vocabulary as VocabItem[]) : null;
        const traps = Array.isArray(content.traps) ? (content.traps as TrapItem[]) : null;
        const pieces = Array.isArray(content.pieces) ? (content.pieces as Array<Record<string, string>>) : null;
        const coreConcept =
          content.coreConcept && typeof content.coreConcept === 'object'
            ? (content.coreConcept as GrammarCoreConcept)
            : null;
        const grammarFunctions = Array.isArray(content.functions)
          ? (content.functions as GrammarFunctionItem[])
          : null;
        const polarityMatrix = Array.isArray(content.polarityMatrix)
          ? (content.polarityMatrix as GrammarPolarityItem[])
          : null;
        const recognitionTips = Array.isArray(content.recognitionTips)
          ? (content.recognitionTips as GrammarRecognitionTip[])
          : null;
        const annotatedExamples = Array.isArray(content.annotatedExamples)
          ? (content.annotatedExamples as GrammarAnnotatedExample[])
          : null;
        const blueprint = Array.isArray(content.blueprint) ? (content.blueprint as BlueprintStep[]) : null;

        return (
          <section className="card" id={`activity-${actIdx + 1}`} key={activity.id}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
              <p className="eyebrow" style={{ margin: 0 }}>
                {activity.type.replaceAll('_', ' ')} · BƯỚC {actIdx + 1}
              </p>
              <button
                type="button"
                className="button secondary"
                style={{ minHeight: '30px', padding: '4px 10px', fontSize: '0.74rem' }}
                onClick={() => setReportingTarget({ activityId: activity.id, titleContext: activity.title })}
                title="Báo lỗi nội dung bài học"
              >
                🚩 Báo lỗi
              </button>
            </div>
            <h2>{activity.title}</h2>

            {'body' in content && typeof content.body === 'string' && <p style={{ lineHeight: 1.65 }}>{content.body}</p>}
            {'instruction' in content && typeof content.instruction === 'string' && (
              <p style={{ lineHeight: 1.65, color: 'var(--muted)' }}>{content.instruction}</p>
            )}

            {/* Structured Introduction Blueprint (Day 5 & Scaffolding) */}
            {blueprint && (
              <div style={{ display: 'grid', gap: '10px', margin: '16px 0' }}>
                {blueprint.map((b, bIdx) => (
                  <div
                    key={bIdx}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: '#f8fafc',
                      border: '1.5px solid #e2e8f0',
                    }}
                  >
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#6f5fdf', marginBottom: '4px' }}>
                      {b.step}
                    </div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 600, color: '#1e293b' }}>
                      {b.pattern}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Authoring or Pacing Tips */}
            {('authoringTip' in content || 'pacingTip' in content) && (
              <div
                style={{
                  margin: '14px 0',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: '#fefce8',
                  border: '1px solid #fef08a',
                  fontSize: '0.85rem',
                  color: '#854d0e',
                  lineHeight: 1.5,
                }}
              >
                💡 <strong>Mẹo nhỏ:</strong>{' '}
                {(content.authoringTip as string) || (content.pacingTip as string)}
              </div>
            )}

            {/* 1. Dialogue Component with Audio, Slow Mode & Word-by-Word Blending */}
            {dialogue && (
              <div className="dialogue-box">
                <div className="ipa-reading-tip-banner">
                  <span className="ico">💡</span>
                  <div>
                    <strong>Làm sao để tự đánh vần được dòng phiên âm IPA bên dưới?</strong>
                    <span>
                      Bạn có thể <strong>bấm trực tiếp vào từng từ tiếng Anh</strong> trong câu để nghe máy phát âm chậm từ đó, đọc theo dòng <em>🗣️ Đọc theo nhịp</em>, hoặc xem công thức ghép từng cụm từ bên dưới!
                    </span>
                  </div>
                </div>
                {dialogue.map((turn, tIdx) => {
                  const viKey = `turn-${activity.id}-${tIdx}`;
                  const tokens = turn.en.split(/\s+/);
                  return (
                    <div className={`dialogue-turn ${turn.speaker === 'Linh' ? 'turn-a' : 'turn-b'}`} key={tIdx}>
                      <div className="turn-avatar" aria-hidden="true">
                        {turn.avatar || '👤'}
                      </div>
                      <div className={`turn-content ${turn.wordBreakdown && turn.wordBreakdown.length > 0 ? 'turn-split-grid' : ''}`}>
                        <div className="turn-col-main">
                          <div className="turn-meta">
                            <strong>{turn.speaker}</strong> {turn.role && <span className="muted">({turn.role})</span>}
                          </div>
                          <p className="turn-en" lang="en">
                            {tokens.map((tok, wIdx) => {
                              const clean = tok.replace(/[^a-zA-Z']/g, '');
                              if (!clean) return <span key={wIdx}>{tok} </span>;
                              return (
                                <span key={wIdx}>
                                  <button
                                    type="button"
                                    className="clickable-word"
                                    onClick={() => speak(clean, 0.55)}
                                    title={`Bấm để nghe chậm từ "${clean}"`}
                                  >
                                    {tok}
                                  </button>{' '}
                                </span>
                              );
                            })}
                          </p>
                          {turn.ipa && <p className="turn-ipa">🔤 IPA: {turn.ipa}</p>}
                          {turn.vnGuide && (
                            <p className="turn-vn-guide">
                              🗣️ <strong>Đọc theo nhịp (IN HOA = nhấn mạnh):</strong> <span>{turn.vnGuide}</span>
                            </p>
                          )}
                          <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              className="button secondary"
                              style={{ minHeight: '36px', padding: '6px 12px', fontSize: '0.8rem' }}
                              onClick={() => speak(turn.en, 0.88)}
                            >
                              🔊 Nghe chuẩn
                            </button>
                            <button
                              type="button"
                              className="button secondary"
                              style={{ minHeight: '36px', padding: '6px 12px', fontSize: '0.8rem' }}
                              onClick={() => speak(turn.en, 0.55)}
                            >
                              🐢 Nghe chậm
                            </button>
                            {turn.vi && (
                              <button
                                type="button"
                                className="button secondary"
                                style={{ minHeight: '36px', padding: '6px 12px', fontSize: '0.8rem' }}
                                onClick={() => toggleVi(viKey)}
                              >
                                {revealedVi[viKey] ? 'Ẩn nghĩa' : 'Xem nghĩa TV'}
                              </button>
                            )}
                          </div>
                          {turn.vi && revealedVi[viKey] && (
                            <p className="turn-vi">{turn.vi}</p>
                          )}
                        </div>
                        {turn.wordBreakdown && turn.wordBreakdown.length > 0 && (
                          <div className="turn-breakdown-list">
                            <div className="breakdown-panel-title">🧩 Bóc tách &amp; Cách ghép vần cụm từ:</div>
                            {turn.wordBreakdown.map((wb, wbIdx) => (
                              <div className="turn-breakdown-item" key={wbIdx}>
                                <button
                                  type="button"
                                  className="breakdown-play-chip"
                                  onClick={() => speak(wb.w, 0.55)}
                                >
                                  🔊 <strong>{wb.w}</strong> <code>{wb.ipa}</code>
                                </button>
                                <span className="breakdown-how">👉 {wb.how}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. Interactive IPA Soundboard & Blending Guide */}
            {blendingRules && (
              <div className="ipa-blend-rules">
                <div className="blend-rules-title">
                  🧭 QUY TẮC ĐÁNH VẦN IPA 3 BƯỚC (GIỐNG ĐÁNH VẦN TIẾNG VIỆT LỚP 1)
                </div>
                <div className="blend-rules-grid">
                  {blendingRules.map((r, rIdx) => (
                    <div className="blend-rule-step" key={rIdx}>
                      <span className="blend-rule-num">{rIdx + 1}</span>
                      <div>
                        <strong>{r.step}</strong>
                        <p className="small muted" style={{ margin: '3px 0 0' }}>{r.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {phonemes && phonemes.length > 0 && (() => {
              const totalP = phonemes.length;
              const curIdx = Math.min(Math.max(0, activeIpaIdx[activity.id] || 0), totalP - 1);
              const ph = phonemes[curIdx] || phonemes[0]!;
              const cleanWord: string = ph.audioWord || ph.example.split(' ')[0] || ph.example;
              return (
                <div className="ipa-single-stage">
                  <div className="ipa-tabs-bar" role="tablist" aria-label="Chọn âm IPA để xem khẩu hình">
                    <div className="ipa-tabs-list">
                      {phonemes.map((item, idx) => {
                        const isAct = idx === curIdx;
                        const exWord = item.audioWord || item.example.split(' ')[0] || item.example;
                        return (
                          <button
                            key={idx}
                            type="button"
                            role="tab"
                            aria-selected={isAct}
                            className={`ipa-tab-pill ${isAct ? 'active' : ''}`}
                            onClick={() => {
                              setActiveIpaIdx((prev) => ({ ...prev, [activity.id]: idx }));
                              speak(exWord, 0.85);
                            }}
                          >
                            <span className="ipa-tab-num">{idx + 1}/{totalP}</span>
                            <strong className="ipa-tab-sym">{item.ipa}</strong>
                            <span className="ipa-tab-word">{exWord}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="ipa-tabs-arrows">
                      <button
                        type="button"
                        className="button secondary"
                        style={{ minHeight: '34px', padding: '5px 12px', fontSize: '0.8rem' }}
                        disabled={curIdx === 0}
                        onClick={() => setActiveIpaIdx((prev) => ({ ...prev, [activity.id]: Math.max(0, curIdx - 1) }))}
                      >
                        ← Âm trước
                      </button>
                      <span className="small muted" style={{ fontWeight: 700 }}>
                        Âm {curIdx + 1} / {totalP}
                      </span>
                      <button
                        type="button"
                        className="button secondary"
                        style={{ minHeight: '34px', padding: '5px 12px', fontSize: '0.8rem' }}
                        disabled={curIdx === totalP - 1}
                        onClick={() => setActiveIpaIdx((prev) => ({ ...prev, [activity.id]: Math.min(totalP - 1, curIdx + 1) }))}
                      >
                        Âm tiếp theo →
                      </button>
                    </div>
                  </div>

                  <div className="ipa-card ipa-spotlight-card" role="tabpanel">
                    <div className="ipa-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <span className="ipa-symbol">{ph.ipa}</span>
                        <div>
                          <strong className="ipa-spotlight-title">{ph.name}</strong>
                          {ph.vnApprox && <span className="ipa-vn-badge">🗣️ {ph.vnApprox}</span>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="button secondary"
                          style={{ minHeight: '36px', padding: '6px 12px', fontSize: '0.82rem' }}
                          onClick={() => speak(cleanWord, 0.88)}
                          aria-label={`Nghe chuẩn âm ${ph.ipa}`}
                        >
                          🔊 Nghe chuẩn &quot;{cleanWord}&quot;
                        </button>
                        <button
                          type="button"
                          className="button secondary"
                          style={{ minHeight: '36px', padding: '6px 12px', fontSize: '0.82rem' }}
                          onClick={() => speak(cleanWord, 0.55)}
                          aria-label={`Nghe chậm âm ${ph.ipa}`}
                        >
                          🐢 Nghe chậm (0.55x)
                        </button>
                      </div>
                    </div>

                    <div className="ipa-spotlight-grid">
                      <div className="ipa-spotlight-left">
                        <MouthArticulationDiagram ipa={ph.ipa} fallbackMouth={ph.mouth} />
                      </div>
                      <div className="ipa-spotlight-right">
                        {ph.blendParts && ph.blendParts.length > 0 && (
                          <div className="ipa-blend-box">
                            <div className="ipa-blend-label">
                              🧩 Bước thực hành: Bấm từng mảnh âm để đánh vần rồi ghép lại
                            </div>
                            <div className="ipa-blend-parts">
                              {ph.blendParts.map((bp, bpIdx) => (
                                <span key={bpIdx} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                  {bpIdx > 0 && <span className="blend-operator">+</span>}
                                  <button
                                    type="button"
                                    className="blend-chip"
                                    onClick={() => speak(bp.audio || cleanWord, 0.55)}
                                  >
                                    <span className="blend-chip-sym">{bp.sym}</span>
                                    <span className="blend-chip-desc">{bp.label}</span>
                                  </button>
                                </span>
                              ))}
                              <span className="blend-operator">➔</span>
                              <button
                                type="button"
                                className="blend-result-chip"
                                onClick={() => speak(cleanWord, 0.85)}
                              >
                                🔗 Ghép: <strong>{cleanWord}</strong> 🔊
                              </button>
                            </div>
                            {ph.blendFormula && (
                              <div className="ipa-blend-formula">
                                Công thức: <code>{ph.blendFormula}</code>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="ipa-examples-box">
                          <div className="small muted" style={{ fontWeight: 700, marginBottom: '6px' }}>
                            🎧 Nghe từ mẫu &amp; đối chiếu cặp âm dễ nhầm:
                          </div>
                          <div className="ipa-examples">
                            <span
                              className="chip learning"
                              onClick={() => speak(cleanWord, 0.85)}
                              role="button"
                              tabIndex={0}
                              title="Bấm để nghe"
                            >
                              Từ mẫu: {ph.example} 🔊
                            </span>
                            {ph.contrast && (
                              <span
                                className="chip review"
                                onClick={() => ph.contrast && speak(ph.contrast.split(' ')[0] || ph.contrast, 0.85)}
                                role="button"
                                tabIndex={0}
                                title="Bấm để nghe"
                              >
                                Đối chiếu: {ph.contrast} 🔊
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="ipa-spotlight-pager-foot">
                          <span className="small muted">
                            💡 Mẹo: Bấm các nút âm phía trên để chuyển nhanh giữa{' '}
                            <strong>{phonemes.map((x) => x.ipa).join(', ')}</strong> ngay trên cùng 1 khung nhìn.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {phonemes && (() => {
              const letters = normalizeLetters(customSpellName);
              const spellAudio = letters.length ? `${letters.join('. ')}. ${customSpellName}.` : '';
              const summaryIpa = letters.map((ch) => LETTER_IPA_MAP[ch]?.ipa || ch).join(' - ');
              const summaryVi = letters.map((ch) => LETTER_IPA_MAP[ch]?.vi || ch).join(' · ');
              return (
                <div className="custom-name-speller">
                  <div className="speller-studio-grid">
                    <div className="speller-left-col">
                      <div className="speller-head">
                        <div>
                          <span className="eyebrow" style={{ display: 'inline-block', marginBottom: '2px' }}>
                            🔤 MÁY ĐÁNH VẦN IPA TƯƠNG TÁC
                          </span>
                          <h4 style={{ margin: 0, fontSize: '1.05rem' }}>
                            Thử đánh vần Tên của bạn (hoặc từ bất kỳ)
                          </h4>
                          <p style={{ margin: '2px 0 0', fontSize: '0.84rem', color: 'var(--muted)' }}>
                            Gõ tên bạn vào ô dưới đây để tách từng chữ cái sang IPA và xem cách đọc tiếng Việt tương đương:
                          </p>
                        </div>
                      </div>
                      <div className="speller-input-row">
                        <input
                          type="text"
                          className="speller-input"
                          value={customSpellName}
                          onChange={(e) => setCustomSpellName(e.target.value)}
                          placeholder="Gõ tên của bạn (VD: Minh, Huong...)"
                          maxLength={15}
                        />
                        {letters.length > 0 && (
                          <button
                            type="button"
                            className="button secondary"
                            style={{ minHeight: '36px', padding: '6px 12px', fontSize: '0.8rem' }}
                            onClick={() => speak(spellAudio, 0.6)}
                          >
                            🔊 Nghe đánh vần &ldquo;{letters.join('-')}&rdquo;
                          </button>
                        )}
                      </div>
                      <div className="speller-quick-picks">
                        <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Thử nhanh:</span>
                        {['Linh', 'Minh', 'Huong', 'Nam', 'Trang'].map((n) => (
                          <button
                            key={n}
                            type="button"
                            className={`chip-btn ${customSpellName.toLowerCase() === n.toLowerCase() ? 'active' : ''}`}
                            onClick={() => {
                              setCustomSpellName(n);
                              const l = normalizeLetters(n);
                              if (l.length) speak(`${l.join('. ')}. ${n}.`, 0.6);
                            }}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                      {letters.length > 0 && (
                        <div className="spell-summary-bar" style={{ marginTop: '10px' }}>
                          <div>
                            <strong>Chuỗi IPA:</strong> <code>{summaryIpa}</code>
                          </div>
                          <div>
                            <strong>Đọc nối từng chữ cái:</strong>{' '}
                            <span className="spell-vi-highlight">{summaryVi}</span>{' '}
                            <span style={{ color: 'var(--muted)' }}>➔ &ldquo;{customSpellName}&rdquo;</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="speller-right-col">
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '8px' }}>
                        👇 Bấm vào từng thẻ chữ cái để nghe phát âm chậm &amp; xem khẩu hình:
                      </div>
                      <div className="spell-letters-flow">
                        {letters.map((ch, idx) => {
                          const info = LETTER_IPA_MAP[ch] || { ipa: `/${ch}/`, vi: ch, mouth: '' };
                          return (
                            <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                              {idx > 0 && <span className="spell-plus">+</span>}
                              <button
                                type="button"
                                className="spell-letter-card"
                                onClick={() => speak(ch, 0.55)}
                              >
                                <span className="spell-letter-char">{ch}</span>
                                <span className="spell-letter-ipa">{info.ipa}</span>
                                <span className="spell-letter-vi">🗣️ &ldquo;{info.vi}&rdquo;</span>
                                <span className="spell-letter-mouth">{info.mouth}</span>
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 3. The 4 Pillars Framework Cards */}
            {pillars && (
              <div className="pillars-grid">
                {pillars.map((pil, pilIdx) => (
                  <div className="pillar-card" key={pilIdx}>
                    <div className="pillar-num">{pil.number || pilIdx + 1}</div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 6px', fontSize: '1.02rem' }}>{pil.type}</h3>
                      <p className="pillar-formal" lang="en">
                        <strong>Chuẩn mực:</strong> {pil.formal}{' '}
                        <button
                          type="button"
                          className="icon-btn-inline"
                          onClick={() => speak(pil.formal)}
                          aria-label={`Nghe câu ${pil.formal}`}
                        >
                          🔊
                        </button>
                      </p>
                      <p className="pillar-casual" lang="en">
                        <strong>Thân mật:</strong> {pil.casual}{' '}
                        <button
                          type="button"
                          className="icon-btn-inline"
                          onClick={() => speak(pil.casual)}
                          aria-label={`Nghe câu ${pil.casual}`}
                        >
                          🔊
                        </button>
                      </p>
                      <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: 'var(--muted)' }}>
                        💡 {pil.tip}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Vocabulary Bank with Step-by-Step IPA Blending & Slow Audio */}
            {vocabulary && (
              <div className="words-grid">
                {vocabulary.map((w, wIdx) => (
                  <div className="word-card word-card-enhanced" key={wIdx}>
                    <div className="word-top-row">
                      <div className="word-main-info">
                        <strong style={{ fontSize: '1.15rem' }}>{w.en}</strong>
                        {w.ipa && <code className="word-ipa-badge">{w.ipa}</code>}
                        {w.syllables && <span className="word-syllable-chip">{w.syllables}</span>}
                        {w.stressNote && <span className="word-stress-chip">{w.stressNote}</span>}
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="button secondary"
                          style={{ minHeight: '36px', padding: '5px 10px', fontSize: '0.8rem' }}
                          onClick={() => speak(w.en, 0.88)}
                          aria-label={`Nghe chuẩn từ ${w.en}`}
                        >
                          🔊 Chuẩn
                        </button>
                        <button
                          type="button"
                          className="button secondary"
                          style={{ minHeight: '36px', padding: '5px 10px', fontSize: '0.8rem' }}
                          onClick={() => speak(w.en, 0.55)}
                          aria-label={`Nghe chậm từ ${w.en}`}
                        >
                          🐢 Chậm
                        </button>
                      </div>
                    </div>
                    <div className="word-meaning-row">
                      <p className="word-vi" style={{ margin: 0 }}>🇻🇳 <strong>Nghĩa:</strong> {w.vi}</p>
                      {w.collocation && <p className="word-colloc" style={{ margin: 0 }}>💬 <em>Cụm từ:</em> {w.collocation}</p>}
                    </div>
                    {w.spellSteps && (
                      <div className="word-spell-guide">
                        <span className="spell-guide-tag">🧩 Cách đánh vần IPA:</span>
                        <span className="spell-guide-formula">{w.spellSteps}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 5. ForumFlash-Style 6-Part Grammar Masterclass & Grammar Pieces */}
            {pieces && (
              <div className="grammar-masterclass" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '14px' }}>
                {coreConcept && (
                  <div className="gm-section gm-core-concept">
                    <div className="gm-sec-badge">1. GIẢI THÍCH TRỌNG TÂM (CORE CONCEPT)</div>
                    <p className="gm-core-summary">{coreConcept.summary}</p>
                    {coreConcept.goldenRule && (
                      <div className="gm-golden-rule">
                        <strong>💡 Quy tắc Vàng cần nhớ:</strong> <span>{coreConcept.goldenRule}</span>
                      </div>
                    )}
                  </div>
                )}

                {grammarFunctions && grammarFunctions.length > 0 && (
                  <div className="gm-section">
                    <div className="gm-sec-badge">2. CHỨC NĂNG GIAO TIẾP &amp; VÍ DỤ THỰC TẾ</div>
                    <div className="gm-fn-grid">
                      {grammarFunctions.map((fn, fnIdx) => (
                        <div className="gm-fn-card" key={fnIdx}>
                          <div className="gm-fn-title">{fn.title}</div>
                          <code className="gm-fn-formula">{fn.formula}</code>
                          <p className="gm-fn-desc">{fn.desc}</p>
                          {fn.examples && fn.examples.length > 0 && (
                            <div className="gm-fn-examples">
                              {fn.examples.map((ex, exIdx) => (
                                <div className="gm-fn-ex-row" key={exIdx}>
                                  <div>
                                    <strong lang="en">{ex.en}</strong> <span>— {ex.vi}</span>
                                  </div>
                                  <button
                                    type="button"
                                    className="icon-btn-inline"
                                    onClick={() => speak(ex.en.replace(/[↗↘]/g, ''), 0.85)}
                                    title="Nghe câu mẫu"
                                  >
                                    🔊
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="gm-section">
                  <div className="gm-sec-badge">3. MÔ HÌNH MẢNH GHÉP (GRAMMAR PIECES) &amp; BẢNG CHIA NGÔI</div>
                  <div className="grammar-visual" style={{ margin: '12px 0 16px' }}>
                    <div className="grammar-pieces">
                      <span className="grammar-piece subject">
                        <small>CHỦ NGỮ (S)</small>
                        <b>I / You / He / She / We / They</b>
                      </span>
                      <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>+</span>
                      <span className="grammar-piece verb">
                        <small>ĐỘNG TỪ TO BE (V)</small>
                        <b>am / are / is</b>
                      </span>
                      <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-mint)' }}>+</span>
                      <span className="grammar-piece complement">
                        <small>BỔ NGỮ (COMPLEMENT)</small>
                        <b>a student / from Hue</b>
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {pieces.map((p, pIdx) => (
                      <div
                        key={pIdx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                          gap: '10px',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          fontSize: '0.88rem',
                        }}
                      >
                        <div><strong>Chủ ngữ:</strong> {p.subject}</div>
                        <div><strong>To Be:</strong> <code>{p.be}</code></div>
                        <div><strong>Bổ ngữ:</strong> {p.complement}</div>
                        <div><strong>Ví dụ:</strong> <em lang="en">{p.example}</em></div>
                      </div>
                    ))}
                  </div>
                </div>

                {polarityMatrix && polarityMatrix.length > 0 && (
                  <div className="gm-section">
                    <div className="gm-sec-badge">4. CẤU TRÚC 3 THỂ: KHẲNG ĐỊNH (+) · PHỦ ĐỊNH (-) · NGHI VẤN (?)</div>
                    <div className="gm-polarity-grid">
                      {polarityMatrix.map((pol, polIdx) => (
                        <div className={`gm-polarity-card pol-${pol.polarity}`} key={polIdx}>
                          <div className="gm-pol-head">
                            <span className="gm-pol-badge">{pol.badge}</span>
                            <h4>{pol.title}</h4>
                          </div>
                          <div className="gm-pol-formula">
                            <code>{pol.formula}</code>
                          </div>
                          <p className="gm-pol-rule">
                            📌 <strong>Lưu ý rút gọn:</strong> {pol.contractionRule}
                          </p>
                          {pol.examples && pol.examples.length > 0 && (
                            <div className="gm-pol-examples">
                              {pol.examples.map((ex, exIdx) => (
                                <div className="gm-pol-ex-item" key={exIdx}>
                                  <div className="gm-pol-ex-top">
                                    <strong lang="en">{ex.full}</strong>
                                    <button
                                      type="button"
                                      className="icon-btn-inline"
                                      onClick={() => speak(ex.full.replace(/[↗↘]/g, ''), 0.85)}
                                      title="Nghe câu"
                                    >
                                      🔊
                                    </button>
                                  </div>
                                  <div className="gm-pol-ex-sub">
                                    <span>Dạng rút gọn / Ghi chú:</span> <code>{ex.short}</code>
                                  </div>
                                  <div className="gm-pol-ex-vi">🇻🇳 {ex.vi}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {recognitionTips && recognitionTips.length > 0 && (
                  <div className="gm-section">
                    <div className="gm-sec-badge">5. CÁCH PHÂN TÍCH &amp; MẸO NHẬN BIẾT NHANH KHI LÀM BÀI</div>
                    <div className="gm-tips-list">
                      {recognitionTips.map((tip, tipIdx) => (
                        <div className="gm-tip-card" key={tipIdx}>
                          <span className="gm-tip-step">{tip.step}</span>
                          <div>
                            <strong>{tip.title}</strong>
                            <p>{tip.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {annotatedExamples && annotatedExamples.length > 0 && (
                  <div className="gm-section">
                    <div className="gm-sec-badge">6. VÍ DỤ GIẢNG GIẢI — MỔ XẺ THÀNH PHẦN CÂU CHI TIẾT</div>
                    <div className="gm-annotated-list">
                      {annotatedExamples.map((item, annIdx) => (
                        <div className="gm-annotated-card" key={annIdx}>
                          <div className="gm-ann-header">
                            <div>
                              <strong className="gm-ann-sentence" lang="en">{item.sentence}</strong>
                              {item.ipa && <code className="word-ipa-badge" style={{ marginLeft: '8px' }}>{item.ipa}</code>}
                              <div className="gm-ann-meaning">🇻🇳 {item.meaning}</div>
                            </div>
                            <button
                              type="button"
                              className="button secondary"
                              style={{ minHeight: '34px', padding: '5px 10px', fontSize: '0.8rem' }}
                              onClick={() => speak(item.sentence, 0.85)}
                            >
                              🔊 Nghe câu
                            </button>
                          </div>
                          {item.tokens && item.tokens.length > 0 && (
                            <div className="gm-ann-tokens">
                              {item.tokens.map((tk, tkIdx) => (
                                <span key={tkIdx} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                  {tkIdx > 0 && <span className="gm-token-plus">+</span>}
                                  <span className="gm-token-chip">
                                    <b lang="en">{tk.text}</b>
                                    <span>{tk.role}</span>
                                  </span>
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="gm-ann-analysis">
                            🔍 <strong>Giảng giải phân tích:</strong> {item.analysis}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 6. Pronunciation Traps & L1 Warnings */}
            {traps && (
              <div className="traps-list">
                {traps.map((tr, trIdx) => (
                  <div className="trap-box" key={trIdx}>
                    <div className="trap-badge">⚠️ {tr.title}</div>
                    <p className="trap-issue">
                      <strong>Bẫy thường gặp:</strong> {tr.issue || tr.viIssue}
                    </p>
                    <div className="trap-fix">
                      <strong>Cách sửa chuẩn:</strong> {tr.fix}{' '}
                      {tr.example && (
                        <button
                          type="button"
                          className="icon-btn-inline"
                          onClick={() => speak(tr.example ?? '')}
                          aria-label={`Nghe câu mẫu ${tr.example}`}
                        >
                          🔊
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Interactive Items within this activity */}
            {activity.items.map((item, itemIdx) => {
              const promptText = text(item.prompt.text) || text(item.prompt.question);
              return (
                <div className="item-prompt" key={item.versionId}>
                  <p style={{ fontWeight: 700, margin: '0 0 10px' }}>
                    Câu hỏi {itemIdx + 1}: {promptText}
                  </p>
                  {Array.isArray(item.prompt.options) && (
                    <div style={{ display: 'grid', gap: '8px', margin: '10px 0' }}>
                      {item.prompt.options.map((option) => (
                        <div
                          key={String(option)}
                          style={{
                            padding: '10px 14px',
                            background: '#ffffff',
                            border: '1px solid var(--border)',
                            borderRadius: '10px',
                            fontSize: '0.92rem',
                          }}
                        >
                          {String(option)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {/* Written Production Artifact Workspace (e.g. Day 5 Writing Studio) */}
            {(activity.code.includes('WRITE') || content.modality === 'WRITTEN_PRODUCTION') && (
              <ArtifactWorkspace
                packageVersionId={lesson.packageVersionId}
                activityId={activity.id}
                itemVersionId={activity.items[0]?.versionId}
                artifactType="TEXT"
                title={activity.title}
                instruction={text(content.instruction)}
                selfChecklist={Array.isArray(content.selfChecklist) ? (content.selfChecklist as string[]) : undefined}
                placeholder="Hello everyone! My name is... I am from... I am a..."
              />
            )}

            {/* Spoken Production Artifact Workspace (e.g. Day 5 Speaking Studio) */}
            {(activity.code.includes('SPEAK') || content.modality === 'SPOKEN_PRODUCTION') && (
              <ArtifactWorkspace
                packageVersionId={lesson.packageVersionId}
                activityId={activity.id}
                itemVersionId={activity.items[0]?.versionId}
                artifactType="AUDIO"
                title={activity.title}
                instruction={text(content.instruction)}
                targetDurationSeconds={25}
              />
            )}
          </section>
        );
      })}

      <p className="status" role="status">{message}</p>

      {exposure ? (
        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f0fdf9, #ffffff)', border: '1.5px solid var(--accent-mint)' }}>
          <h3 style={{ margin: '0 0 8px' }}>Hoàn thành phần Học kiến thức</h3>
          <p style={{ color: 'var(--muted)', margin: '0 0 18px' }}>
            Đọc bài học này giúp bạn ghi nhận thời gian tiếp xúc. Bằng chứng năng lực độc lập sẽ được ghi nhận khi bạn làm bài kiểm tra.
          </p>
          {exposure.status === 'COMPLETED' ? (
            <Link className="button primary" href="/dashboard">
              Trở về Kế hoạch hôm nay
            </Link>
          ) : (
            <button className="button primary" disabled={busy} onClick={() => void finishExposure()}>
              Tôi đã đọc và hiểu bài học này
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <button className="button primary large" disabled={busy} onClick={() => void begin()}>
            02 BẮT ĐẦU BÀI KIỂM TRA & LUYỆN TẬP →
          </button>
          <Link href="/dashboard" className="button secondary large">
            Để sau và về hôm nay
          </Link>
        </div>
      )}

      {reportingTarget && (
        <ContentReportModal
          isOpen={Boolean(reportingTarget)}
          onClose={() => setReportingTarget(null)}
          packageVersionId={lesson.packageVersionId}
          activityId={reportingTarget.activityId}
          titleContext={reportingTarget.titleContext}
        />
      )}
        </div>
        <aside className="study-sidebar" aria-label="Lesson outline">
          <div className="study-sidebar-card">
            <p className="eyebrow">Trong bài này</p>
            <h2>Lộ trình bài học</h2>
            <ol className="study-outline">
              {lesson.activities.map((activity, index) => (
                <li key={activity.id}><a href={`#activity-${index + 1}`}><span>{String(index + 1).padStart(2, '0')}</span>{activity.title}</a></li>
              ))}
            </ol>
            <p className="study-sidebar-note">Bạn có thể quay lại từng phần trước khi tiếp tục.</p>
          </div>
        </aside>
      </div>
    </article>
  );
}
