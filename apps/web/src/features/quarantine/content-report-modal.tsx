'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import type { LearnerContentReportDto } from '@lingora/contracts';
import { reportContentIssue } from '@/lib/api';

interface ContentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageVersionId: string;
  activityId?: string | undefined;
  itemVersionId?: string | undefined;
  titleContext?: string | undefined;
}

const CATEGORIES: Array<{
  value: LearnerContentReportDto['issueCategory'];
  label: string;
  description: string;
  icon: string;
}> = [
  {
    value: 'AUDIO_UNPLAYABLE',
    label: 'Lỗi âm thanh',
    description: 'Âm thanh không phát được, bị rè hoặc ngắt quãng',
    icon: '🔊',
  },
  {
    value: 'TYPO_ERROR',
    label: 'Chính tả / Dịch thuật',
    description: 'Từ vựng viết sai, bản dịch tiếng Việt chưa chuẩn hoặc thiếu ngữ cảnh',
    icon: '✍️',
  },
  {
    value: 'CONFUSING_INSTRUCTION',
    label: 'Hướng dẫn khó hiểu',
    description: 'Yêu cầu bài tập mơ hồ, câu hỏi chưa rõ ràng',
    icon: '❓',
  },
  {
    value: 'ACCESSIBILITY_BARRIER',
    label: 'Rào cản tiếp cận',
    description: 'Màu chữ khó nhìn, cỡ chữ quá nhỏ hoặc khó thao tác trên thiết bị',
    icon: '♿',
  },
  {
    value: 'OTHER',
    label: 'Vấn đề khác',
    description: 'Bất kỳ góp ý nào khác về nội dung học tập',
    icon: '📝',
  },
];

export function ContentReportModal({
  isOpen,
  onClose,
  packageVersionId,
  activityId,
  itemVersionId,
  titleContext,
}: ContentReportModalProps) {
  const { getToken } = useAuth();
  const [category, setCategory] = useState<LearnerContentReportDto['issueCategory']>('TYPO_ERROR');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setErrorMessage('');
      setComment('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const token = await getToken();
      if (!token) throw new Error('Vui lòng đăng nhập lại để gửi báo cáo.');

      await reportContentIssue(token, {
        packageVersionId,
        activityId: activityId || undefined,
        itemVersionId: itemVersionId || undefined,
        issueCategory: category,
        comment: comment.trim() || undefined,
      });

      setSuccess(true);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Không thể gửi báo cáo lúc này.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(26, 21, 40, 0.55)',
        backdropFilter: 'blur(4px)',
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 24px 60px rgba(32, 22, 54, 0.22)',
          border: '1px solid #e9e4ee',
          overflow: 'hidden',
          animation: 'fadeInUp 0.2s ease-out',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '22px 26px 18px',
            borderBottom: '1px solid #f1ecf5',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            background: '#faf9fc',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: '#6f5fdf',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              🚩 Đóng góp &amp; Phản ánh Nội dung
            </div>
            <h2
              id="report-modal-title"
              style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#2d263d',
                letterSpacing: '-0.02em',
              }}
            >
              Báo lỗi nội dung bài học
            </h2>
            {titleContext && (
              <p
                style={{
                  margin: '4px 0 0',
                  fontSize: '0.82rem',
                  color: '#6d6778',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '380px',
                }}
              >
                Mục: {titleContext}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng hộp thoại"
            style={{
              background: '#ede8f5',
              border: 0,
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              color: '#554d63',
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        {success ? (
          <div style={{ padding: '36px 28px', textAlign: 'center' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#ecfdf5',
                color: '#059669',
                display: 'grid',
                placeItems: 'center',
                fontSize: '1.8rem',
                margin: '0 auto 16px',
              }}
            >
              ✓
            </div>
            <h3 style={{ margin: '0 0 10px', fontSize: '1.25rem', color: '#065f46' }}>
              Cảm ơn bạn đã phản ánh!
            </h3>
            <p style={{ margin: '0 0 20px', color: '#4b5563', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Báo cáo của bạn đã được ghi nhận vào hệ thống kiểm định chất lượng nội dung. Việc báo
              lỗi không làm ảnh hưởng đến tiến độ hay đánh giá năng lực của bạn.
            </p>
            <button
              type="button"
              className="button primary"
              style={{ minWidth: '140px', padding: '10px 24px' }}
              onClick={onClose}
            >
              Tiếp tục học tập
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '22px 26px 26px' }}>
            {/* Pedagogical Safety Notice */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
                padding: '10px 14px',
                background: '#f5f3ff',
                borderRadius: '12px',
                border: '1px solid #ddd6fe',
                marginBottom: '18px',
                fontSize: '0.8rem',
                color: '#5b21b6',
                lineHeight: 1.5,
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>🛡️</span>
              <div>
                <strong>Bảo toàn tiến độ:</strong> Báo lỗi kỹ thuật hoặc nội dung không bao giờ bị
                tính là làm sai và không phát sinh bằng chứng năng lực tiêu cực.
              </div>
            </div>

            {/* Category Selection */}
            <label
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: '0.86rem',
                marginBottom: '8px',
                color: '#373142',
              }}
            >
              Loại vấn đề gặp phải:
            </label>
            <div style={{ display: 'grid', gap: '8px', marginBottom: '18px' }}>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.value;
                return (
                  <label
                    key={cat.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: `1.5px solid ${isSelected ? '#6f5fdf' : '#e6e1ed'}`,
                      background: isSelected ? '#f5f3ff' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <input
                      type="radio"
                      name="issueCategory"
                      value={cat.value}
                      checked={isSelected}
                      onChange={() => setCategory(cat.value)}
                      style={{ accentColor: '#6f5fdf', width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          color: isSelected ? '#4338ca' : '#2e283b',
                        }}
                      >
                        {cat.label}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#736d7e' }}>{cat.description}</div>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Detailed Comment Input */}
            <label
              htmlFor="report-comment"
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: '0.86rem',
                marginBottom: '6px',
                color: '#373142',
              }}
            >
              Mô tả chi tiết (tùy chọn):
            </label>
            <textarea
              id="report-comment"
              rows={3}
              maxLength={1000}
              placeholder="Ví dụ: Âm thanh câu 2 bị đứt đoạn ở giây thứ 3, hoặc từ 'am' bị dịch nhầm thành..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid #e2dce8',
                fontSize: '0.88rem',
                fontFamily: 'inherit',
                color: '#2e283b',
                resize: 'vertical',
                marginBottom: '16px',
                boxSizing: 'border-box',
              }}
            />

            {errorMessage && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  fontSize: '0.84rem',
                  marginBottom: '14px',
                }}
              >
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="button secondary"
                onClick={onClose}
                disabled={submitting}
                style={{ minHeight: '40px', padding: '8px 18px', fontSize: '0.88rem' }}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="button primary"
                disabled={submitting}
                style={{ minHeight: '40px', padding: '8px 20px', fontSize: '0.88rem' }}
              >
                {submitting ? 'Đang gửi…' : 'Gửi phản ánh'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
