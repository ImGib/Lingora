'use client';

import React from 'react';

interface IpaFrontViewProps {
  ipa: string;
  className?: string;
}

export function IpaFrontView({ ipa, className = '' }: IpaFrontViewProps) {
  const renderSvgContent = () => {
    switch (ipa) {
      case '/iː/':
        return (
          <>
            <path d="M 14 38 Q 64 16 114 38 Q 64 28 14 38 Z" fill="#f43f5e" />
            <path d="M 14 38 Q 64 60 114 38 Q 64 50 14 38 Z" fill="#e11d48" />
            <path d="M 24 38 Q 64 30 104 38 Q 64 46 24 38 Z" fill="#881337" />
            <rect x="32" y="33" width="64" height="5" rx="2" fill="#ffffff" />
            <rect x="36" y="39" width="56" height="4" rx="2" fill="#f8fafc" opacity="0.9" />
            <path d="M 11 38 L 3 38 M 3 38 L 7 34 M 3 38 L 7 42" stroke="#6d28d9" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 117 38 L 125 38 M 125 38 L 121 34 M 125 38 L 121 42" stroke="#6d28d9" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case '/ɪ/':
        return (
          <>
            <path d="M 26 38 Q 64 16 102 38 Q 64 28 26 38 Z" fill="#f43f5e" />
            <path d="M 26 38 Q 64 62 102 38 Q 64 50 26 38 Z" fill="#e11d48" />
            <ellipse cx="64" cy="38" rx="26" ry="8" fill="#881337" />
            <rect x="44" y="31" width="40" height="4.5" rx="2" fill="#ffffff" />
            <ellipse cx="64" cy="43" rx="16" ry="3.5" fill="#fb7185" />
            <path d="M 64 12 L 64 20 M 64 56 L 64 64" stroke="#0d9488" strokeWidth="2.2" strokeLinecap="round" />
          </>
        );
      case '/eɪ/':
        return (
          <>
            <ellipse cx="48" cy="38" rx="24" ry="15" fill="none" stroke="#a78bfa" strokeWidth="2" strokeDasharray="3 2" />
            <path d="M 48 40 Q 80 24 112 40 Q 80 56 48 40 Z" fill="#f43f5e" opacity="0.92" />
            <ellipse cx="80" cy="40" rx="20" ry="6" fill="#881337" />
            <rect x="64" y="35" width="32" height="4" rx="1.5" fill="#ffffff" />
            <path d="M 38 20 Q 64 8 88 20" stroke="#6d28d9" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <polygon points="90,21 83,17 85,24" fill="#6d28d9" />
          </>
        );
      case '/z/':
        return (
          <>
            <path d="M 20 38 Q 64 18 108 38 Q 64 58 20 38 Z" fill="#f43f5e" />
            <path d="M 28 38 Q 64 30 100 38 Q 64 46 28 38 Z" fill="#881337" />
            <rect x="34" y="33" width="60" height="5" rx="1.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
            <rect x="34" y="38" width="60" height="5" rx="1.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
            <line x1="49" y1="33" x2="49" y2="43" stroke="#cbd5e1" strokeWidth="0.8" />
            <line x1="64" y1="33" x2="64" y2="43" stroke="#cbd5e1" strokeWidth="0.8" />
            <line x1="79" y1="33" x2="79" y2="43" stroke="#cbd5e1" strokeWidth="0.8" />
            <path d="M 11 32 Q 7 38 11 44 M 7 29 Q 1 38 7 47" stroke="#059669" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 117 32 Q 121 38 117 44 M 121 29 Q 127 38 121 47" stroke="#059669" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        );
      case '/m/':
        return (
          <>
            <path d="M 20 38 Q 42 26 64 32 Q 86 26 108 38 Q 64 39 20 38 Z" fill="#f43f5e" />
            <path d="M 20 38 Q 64 52 108 38 Q 64 37 20 38 Z" fill="#e11d48" />
            <line x1="20" y1="38" x2="108" y2="38" stroke="#881337" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M 64 16 L 64 24 M 64 58 L 64 50" stroke="#6d28d9" strokeWidth="2.2" strokeLinecap="round" />
          </>
        );
      default:
        return (
          <>
            <path d="M 24 38 Q 64 20 104 38 Q 64 56 24 38 Z" fill="#f43f5e" />
            <ellipse cx="64" cy="38" rx="24" ry="7" fill="#881337" />
            <rect x="40" y="32" width="48" height="4" rx="1.5" fill="#ffffff" />
          </>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 128 76"
      className={`w-full max-w-[200px] h-auto overflow-visible ${className}`}
      aria-label={`Sơ đồ khẩu hình nhìn thẳng cho âm ${ipa}`}
      role="img"
    >
      <rect width="128" height="76" rx="12" fill="#fdf2f8" opacity="0.65" />
      {renderSvgContent()}
    </svg>
  );
}
