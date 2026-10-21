'use client';

import React from 'react';

interface IpaSideViewProps {
  ipa: string;
  className?: string;
}

export function IpaSideView({ ipa, className = '' }: IpaSideViewProps) {
  const renderSvgContent = () => {
    switch (ipa) {
      case '/iː/':
        return (
          <>
            <path d="M 24 22 Q 57 4 104 16 L 104 58" stroke="#94a3b8" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <rect x="24" y="22" width="6" height="10" rx="2" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            <rect x="26" y="44" width="6" height="10" rx="2" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            <path d="M 34 46 Q 54 15 86 26 Q 98 34 98 54" fill="#fda4af" stroke="#e11d48" strokeWidth="2.2" />
            <path d="M 80 16 Q 50 10 16 34" stroke="#059669" strokeWidth="2" strokeDasharray="3 2" fill="none" />
            <polygon points="16,34 22,30 21,37" fill="#059669" />
          </>
        );
      case '/ɪ/':
        return (
          <>
            <path d="M 24 22 Q 57 4 104 16 L 104 58" stroke="#94a3b8" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <rect x="24" y="22" width="6" height="10" rx="2" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            <rect x="26" y="46" width="6" height="10" rx="2" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            <path d="M 35 48 Q 58 26 88 32 Q 98 38 98 54" fill="#fda4af" stroke="#e11d48" strokeWidth="2.2" />
            <circle cx="17" cy="36" r="4.5" fill="#10b981" />
          </>
        );
      case '/eɪ/':
        return (
          <>
            <path d="M 24 22 Q 57 4 104 16 L 104 58" stroke="#94a3b8" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <path d="M 36 50 Q 60 36 88 40" stroke="#a78bfa" strokeWidth="2" strokeDasharray="3 2" fill="none" />
            <path d="M 34 46 Q 56 18 87 27 Q 98 35 98 54" fill="#fda4af" stroke="#e11d48" strokeWidth="2.2" />
            <path d="M 60 36 L 60 23" stroke="#6d28d9" strokeWidth="2.2" strokeLinecap="round" />
            <polygon points="60,19 56,25 64,25" fill="#6d28d9" />
          </>
        );
      case '/z/':
        return (
          <>
            <path d="M 24 22 Q 57 4 104 16 L 104 58" stroke="#94a3b8" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <rect x="24" y="25" width="6" height="8" rx="1.5" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            <rect x="24" y="34" width="6" height="8" rx="1.5" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            <path d="M 31 32 Q 57 25 86 32 Q 98 38 98 54" fill="#fda4af" stroke="#e11d48" strokeWidth="2.2" />
            <circle cx="96" cy="52" r="6" fill="#fef08a" stroke="#d97706" strokeWidth="1.5" />
            <path d="M 87 50 L 105 50 M 89 54 L 103 54" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" />
          </>
        );
      case '/m/':
        return (
          <>
            <path d="M 24 22 Q 57 4 104 16 L 104 58" stroke="#94a3b8" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <circle cx="22" cy="32" r="4.5" fill="#f43f5e" />
            <circle cx="22" cy="38" r="4.5" fill="#e11d48" />
            <path d="M 87 28 Q 58 8 16 12" stroke="#059669" strokeWidth="2.2" strokeDasharray="3 2" fill="none" />
            <polygon points="14,12 20,8 20,16" fill="#059669" />
            <path d="M 32 46 Q 60 38 88 42" fill="#fda4af" stroke="#e11d48" strokeWidth="2.2" />
          </>
        );
      default:
        return (
          <>
            <path d="M 24 22 Q 57 4 104 16 L 104 58" stroke="#94a3b8" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <path d="M 34 46 Q 58 24 88 34" fill="#fda4af" stroke="#e11d48" strokeWidth="2.2" />
          </>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 128 76"
      className={`w-full max-w-[200px] h-auto overflow-visible ${className}`}
      aria-label={`Sơ đồ mặt cắt ngang khoang miệng cho âm ${ipa}`}
      role="img"
    >
      <rect width="128" height="76" rx="12" fill="#eff6ff" opacity="0.65" />
      {renderSvgContent()}
    </svg>
  );
}
