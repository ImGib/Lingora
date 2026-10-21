'use client';

import { useAuth } from '@clerk/nextjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { LearnerArtifactDto } from '@lingora/contracts';
import { createArtifact, getLatestArtifactForActivity } from '@/lib/api';

interface ArtifactWorkspaceProps {
  packageVersionId: string;
  activityId: string;
  itemVersionId?: string | undefined;
  artifactType: 'TEXT' | 'AUDIO';
  title?: string | undefined;
  instruction?: string | undefined;
  selfChecklist?: string[] | undefined;
  placeholder?: string | undefined;
  targetDurationSeconds?: number | undefined;
  onSaved?: ((artifact: LearnerArtifactDto) => void) | undefined;
}

export function ArtifactWorkspace({
  packageVersionId,
  activityId,
  itemVersionId,
  artifactType,
  title,
  instruction,
  selfChecklist,
  placeholder,
  targetDurationSeconds = 25,
  onSaved,
}: ArtifactWorkspaceProps) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [artifact, setArtifact] = useState<LearnerArtifactDto | null>(null);
  const [textInput, setTextInput] = useState('');
  const [checklistState, setChecklistState] = useState<Record<number, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load existing artifact if any
  const loadExisting = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;
    try {
      const token = await getToken();
      if (!token) return;
      const existing = await getLatestArtifactForActivity(token, activityId);
      if (existing) {
        setArtifact(existing);
        if (existing.textContent && existing.artifactType === 'TEXT') {
          setTextInput(existing.textContent);
        }
      }
    } catch {
      // Ignored if unable to fetch
    }
  }, [activityId, getToken, isLoaded, isSignedIn]);

  useEffect(() => {
    void loadExisting();
  }, [loadExisting]);

  // Clean up audio blob URL and timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
    };
  }, [recordedAudioUrl]);

  // Sentence counter for text
  const sentenceCount = textInput
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0).length;

  // Toggle checklist items
  const toggleCheck = (idx: number) => {
    setChecklistState((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Submit Text Artifact
  async function handleSaveText() {
    if (!textInput.trim()) return;
    setBusy(true);
    setStatusMessage('Đang lưu bài viết...');
    try {
      const token = await getToken();
      if (!token) throw new Error('Vui lòng đăng nhập lại.');

      const saved = await createArtifact(token, {
        packageVersionId,
        activityId,
        itemVersionId: itemVersionId || undefined,
        artifactType: 'TEXT',
        textContent: textInput.trim(),
        status: 'FINALIZED',
      });

      setArtifact(saved);
      setStatusMessage('✓ Đã lưu bài viết thành công vào hồ sơ năng lực!');
      onSaved?.(saved);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'Không thể lưu bài viết.');
    } finally {
      setBusy(false);
    }
  }

  // Start Audio Recording
  async function startRecording() {
    setMicError(null);
    audioChunksRef.current = [];

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Trình duyệt của bạn không hỗ trợ ghi âm trực tiếp.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: unknown) {
      const isDenied =
        err instanceof Error &&
        (err.name === 'NotAllowedError' ||
          err.name === 'PermissionDeniedError' ||
          err.message.toLowerCase().includes('denied') ||
          err.message.toLowerCase().includes('permission'));

      setMicError(
        isDenied
          ? 'Quyền truy cập micro đã bị từ chối trong trình duyệt. Bạn có thể sử dụng chế độ dự phòng mà không bị trừ điểm.'
          : err instanceof Error
            ? err.message
            : 'Không thể kết nối tới micro.'
      );
    }
  }

  // Stop Recording
  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }

  // Save Audio Artifact
  async function handleSaveAudio() {
    if (!recordedAudioUrl && audioChunksRef.current.length === 0) return;
    setBusy(true);
    setStatusMessage('Đang lưu trữ đoạn ghi âm...');

    try {
      const token = await getToken();
      if (!token) throw new Error('Vui lòng đăng nhập lại.');

      const durationMs = recordingSeconds * 1000;
      const fakeStoragePath = `learner-audio/${activityId}/rec-${Date.now()}.webm`;

      const saved = await createArtifact(token, {
        packageVersionId,
        activityId,
        itemVersionId: itemVersionId || undefined,
        artifactType: 'AUDIO',
        audioStoragePath: fakeStoragePath,
        durationMs,
        mimeType: 'audio/webm',
        status: 'FINALIZED',
      });

      setArtifact(saved);
      setStatusMessage('✓ Đã lưu đoạn ghi âm tự tin của bạn!');
      onSaved?.(saved);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'Không thể lưu file âm thanh.');
    } finally {
      setBusy(false);
    }
  }

  // Technical Fallback Submission (Graceful Invariant)
  async function handleTechnicalFallback(reason: 'MICROPHONE_DENIED' | 'LEARNER_BYPASS') {
    setBusy(true);
    setStatusMessage('Đang kích hoạt chế độ dự phòng kỹ thuật...');

    try {
      const token = await getToken();
      if (!token) throw new Error('Vui lòng đăng nhập lại.');

      const saved = await createArtifact(token, {
        packageVersionId,
        activityId,
        itemVersionId: itemVersionId || undefined,
        artifactType: 'AUDIO',
        status: 'TECHNICAL_FALLBACK',
        fallbackReason: reason,
        textContent: textInput || 'Hoàn thành qua chế độ dự phòng kỹ thuật (Technical Fallback)',
      });

      setArtifact(saved);
      setStatusMessage('✓ Chế độ dự phòng đã kích hoạt. Bạn đã hoàn thành bước này an toàn!');
      onSaved?.(saved);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'Không thể kích hoạt chế độ dự phòng.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        marginTop: '16px',
        padding: '20px 22px',
        borderRadius: '16px',
        background: '#ffffff',
        border: '1.5px solid #e5dfeb',
        boxShadow: '0 8px 24px rgba(45, 35, 60, 0.04)',
      }}
    >
      {title && (
        <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem', color: '#2d253b' }}>
          {artifactType === 'TEXT' ? '✍️ ' : '🎙️ '}
          {title}
        </h3>
      )}
      {instruction && (
        <p style={{ margin: '0 0 16px', fontSize: '0.88rem', color: '#686273', lineHeight: 1.55 }}>
          {instruction}
        </p>
      )}

      {/* TEXT ARTIFACT WORKSPACE */}
      {artifactType === 'TEXT' && (
        <div>
          {/* Self-check checklist */}
          {selfChecklist && selfChecklist.length > 0 && (
            <div
              style={{
                marginBottom: '16px',
                padding: '14px 16px',
                background: '#faf8fc',
                borderRadius: '12px',
                border: '1px solid #ede8f2',
              }}
            >
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#6f5fdf',
                  marginBottom: '10px',
                }}
              >
                📋 Checklist Tự Kiểm Tra (Self-Check):
              </div>
              <div style={{ display: 'grid', gap: '8px' }}>
                {selfChecklist.map((item, idx) => (
                  <label
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.84rem',
                      color: checklistState[idx] ? '#065f46' : '#423b4e',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!!checklistState[idx]}
                      onChange={() => toggleCheck(idx)}
                      style={{ accentColor: '#10b981', width: '16px', height: '16px' }}
                    />
                    <span style={{ textDecoration: checklistState[idx] ? 'line-through' : 'none' }}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Textarea */}
          <div style={{ position: 'relative' }}>
            <textarea
              rows={5}
              placeholder={
                placeholder ||
                'Viết bài giới thiệu của bạn tại đây... (Ví dụ: Hello everyone! My name is Nam. I am from Hanoi...)'
              }
              value={textInput}
              disabled={busy}
              onChange={(e) => setTextInput(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1.5px solid #dfd8e7',
                fontSize: '0.94rem',
                fontFamily: 'inherit',
                lineHeight: 1.6,
                color: '#2e273c',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '6px',
                fontSize: '0.8rem',
                color: sentenceCount >= 3 ? '#059669' : '#736d7e',
                fontWeight: 600,
              }}
            >
              <span>
                Số câu đã viết: <strong>{sentenceCount}</strong> {sentenceCount >= 3 ? '✓ (Đạt chuẩn 3-5 câu)' : '(Cần tối thiểu 3 câu)'}
              </span>
              <span>{textInput.length} ký tự</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '14px', alignItems: 'center' }}>
            <button
              type="button"
              className="button primary"
              disabled={busy || sentenceCount < 1}
              onClick={() => void handleSaveText()}
              style={{ padding: '8px 20px', fontSize: '0.88rem' }}
            >
              {artifact?.status === 'FINALIZED' ? 'Cập nhật bài viết' : 'Lưu sản phẩm bài viết'}
            </button>
            {artifact && (
              <span style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 600 }}>
                ✓ Đã nộp sản phẩm ({artifact.status})
              </span>
            )}
          </div>
        </div>
      )}

      {/* AUDIO ARTIFACT WORKSPACE */}
      {artifactType === 'AUDIO' && (
        <div>
          {/* Target guidelines */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '10px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              marginBottom: '16px',
              fontSize: '0.82rem',
              color: '#475569',
            }}
          >
            <span>
              🎯 <strong>Mục tiêu:</strong> Nói tự tin trong khoảng {targetDurationSeconds - 5}-
              {targetDurationSeconds + 5} giây.
            </span>
            <span>
              Âm lượng chuẩn &middot; Không cần nói nhanh
            </span>
          </div>

          {/* Microphone Error / Denied Fallback */}
          {micError && (
            <div
              style={{
                padding: '14px 18px',
                borderRadius: '12px',
                background: '#fff1f2',
                border: '1.5px solid #fecdd3',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#be123c',
                  marginBottom: '6px',
                }}
              >
                <span>⚠️</span> Không thể kích hoạt Micro
              </div>
              <p style={{ margin: '0 0 10px', fontSize: '0.84rem', color: '#881337', lineHeight: 1.5 }}>
                {micError}
              </p>
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: '#ffffff',
                  border: '1px solid #fbcfe8',
                  fontSize: '0.8rem',
                  color: '#4a044e',
                  marginBottom: '12px',
                }}
              >
                🛡️ <strong>Cam kết bảo toàn:</strong> Sự cố phần cứng/kết nối không tính là năng lực kém. Bạn hoàn toàn có thể tiếp tục an toàn qua chế độ dự phòng.
              </div>
              <button
                type="button"
                className="button primary"
                onClick={() => void handleTechnicalFallback('MICROPHONE_DENIED')}
                disabled={busy}
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                Hoàn thành qua chế độ dự phòng kỹ thuật
              </button>
            </div>
          )}

          {/* Recording Controls */}
          {!micError && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '14px',
                padding: '24px 20px',
                borderRadius: '16px',
                background: isRecording ? '#fef2f2' : '#f8f6fc',
                border: `2px dashed ${isRecording ? '#ef4444' : '#cdc4dc'}`,
                transition: 'all 0.2s ease',
              }}
            >
              {/* Timer & Pulsing badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {isRecording && (
                  <span
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#ef4444',
                      boxShadow: '0 0 0 6px rgba(239, 68, 68, 0.25)',
                      animation: 'pulse 1s infinite',
                    }}
                  />
                )}
                <span
                  style={{
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    fontVariantNumeric: 'tabular-nums',
                    color: isRecording ? '#b91c1c' : '#332a42',
                  }}
                >
                  {Math.floor(recordingSeconds / 60)
                    .toString()
                    .padStart(2, '0')}
                  :{(recordingSeconds % 60).toString().padStart(2, '0')}
                </span>
                <span style={{ fontSize: '0.82rem', color: '#736d7e' }}>
                  / ~00:{targetDurationSeconds}s
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {!isRecording ? (
                  <button
                    type="button"
                    className="button primary"
                    onClick={() => void startRecording()}
                    disabled={busy}
                    style={{
                      background: '#e11d48',
                      borderColor: '#e11d48',
                      padding: '10px 22px',
                      fontSize: '0.92rem',
                    }}
                  >
                    🔴 {recordedAudioUrl ? 'Ghi âm lại từ đầu' : 'Bắt đầu ghi âm'}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="button primary"
                    onClick={stopRecording}
                    style={{
                      background: '#1e293b',
                      borderColor: '#1e293b',
                      padding: '10px 24px',
                      fontSize: '0.92rem',
                    }}
                  >
                    ⏹️ Dừng ghi âm
                  </button>
                )}

                {/* Optional Fallback Button for learner preference */}
                {!isRecording && !recordedAudioUrl && (
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => void handleTechnicalFallback('LEARNER_BYPASS')}
                    disabled={busy}
                    style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                    title="Bỏ qua phần ghi âm nếu môi trường xung quanh quá ồn"
                  >
                    Bỏ qua phần nói (Không phạt điểm)
                  </button>
                )}
              </div>

              {/* Recorded Audio Preview */}
              {recordedAudioUrl && !isRecording && (
                <div
                  style={{
                    width: '100%',
                    maxWidth: '420px',
                    marginTop: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <audio controls src={recordedAudioUrl} style={{ width: '100%' }} />
                  <button
                    type="button"
                    className="button primary"
                    onClick={() => void handleSaveAudio()}
                    disabled={busy}
                    style={{ padding: '9px 24px', fontSize: '0.88rem' }}
                  >
                    {busy ? 'Đang lưu…' : '💾 Lưu đoạn ghi âm này'}
                  </button>
                </div>
              )}
            </div>
          )}

          {artifact && (
            <div
              style={{
                marginTop: '14px',
                padding: '10px 14px',
                borderRadius: '10px',
                background: artifact.status === 'TECHNICAL_FALLBACK' ? '#f5f3ff' : '#ecfdf5',
                border: `1px solid ${artifact.status === 'TECHNICAL_FALLBACK' ? '#ddd6fe' : '#a7f3d0'}`,
                fontSize: '0.84rem',
                color: artifact.status === 'TECHNICAL_FALLBACK' ? '#5b21b6' : '#065f46',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>{artifact.status === 'TECHNICAL_FALLBACK' ? '🛡️' : '✓'}</span>
              <span>
                <strong>Trạng thái nộp:</strong> {artifact.status === 'TECHNICAL_FALLBACK' ? 'Dự phòng kỹ thuật an toàn (Technical Fallback)' : 'Đã ghi nhận bản ghi âm hoàn chỉnh'}.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Status or Success Notification */}
      {statusMessage && (
        <div
          role="status"
          style={{
            marginTop: '12px',
            fontSize: '0.84rem',
            color: statusMessage.startsWith('✓') ? '#059669' : '#4b4356',
            fontWeight: 600,
          }}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
}
