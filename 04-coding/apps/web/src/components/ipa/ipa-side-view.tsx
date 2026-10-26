'use client';

import React from 'react';

interface IpaSideViewProps {
  ipa: string;
  className?: string;
  isVoiced?: boolean;
}

export function IpaSideView({ ipa, className = '', isVoiced }: IpaSideViewProps) {
  // Phân loại âm vào các nhóm cơ chế mặt cắt giải phẫu khoang miệng
  const getSideViewCategory = (symbol: string): string => {
    // 1. Thoát khí khoang mũi (Vòm mềm hạ xuống)
    if (symbol === '/m/' || symbol === '/n/' || symbol === '/ŋ/') return 'nasal';
    // 2. Đầu lưỡi kẹp giữa răng
    if (symbol === '/θ/' || symbol === '/ð/') return 'dental';
    // 3. Răng cắn môi dưới
    if (symbol === '/f/' || symbol === '/v/') return 'labiodental';
    // 4. Đầu lưỡi chạm/sát gờ nướu trên
    if (['/t/', '/d/', '/s/', '/z/', '/l/'].includes(symbol)) return 'alveolar';
    // 5. Thân lưỡi cong sát vòm cứng (Sau nướu)
    if (['/ʃ/', '/ʒ/', '/tʃ/', '/dʒ/', '/r/'].includes(symbol)) return 'postalveolar';
    // 6. Cuống lưỡi nâng cao chạm vòm mềm (Velar)
    if (['/k/', '/g/', '/uː/', '/ʊ/'].includes(symbol)) return 'velar_high';
    // 7. Thân lưỡi nâng cao phía trước (Front high)
    if (['/iː/', '/ɪ/', '/j/'].includes(symbol)) return 'front_high';
    // 8. Lưỡi trượt đôi (Diphthongs)
    if (['/eɪ/', '/aɪ/', '/ɔɪ/', '/aʊ/', '/əʊ/', '/eə/', '/ɪə/', '/ʊə/'].includes(symbol)) return 'diphthong';
    // 9. Lưỡi mở thấp hoặc tầm trung
    return 'open_low';
  };

  const category = getSideViewCategory(ipa);

  const renderSideAnatomy = () => {
    switch (category) {
      // 1. Âm Mũi: Vòm mềm hạ xuống để hơi đi lên mũi (/m/, /n/, /ŋ/)
      case 'nasal':
        return (
          <g>
            {/* Vòm miệng trên + Khoang mũi mở thông */}
            <path d="M 28 26 Q 60 8 108 20 L 108 38 Q 96 34 86 38" stroke="#94a3b8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 40 16 Q 80 4 126 14" stroke="#6366f1" strokeWidth="2" strokeDasharray="3 3" fill="none" />
            <polygon points="126,14 120,9 120,18" fill="#6366f1" />
            
            {/* Răng trên & dưới */}
            <rect x="28" y="26" width="6" height="11" rx="1.5" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            <rect x="30" y="52" width="6" height="11" rx="1.5" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            
            {/* Lưỡi ngậm khép miệng (hoặc chặn ở răng) */}
            <path d="M 36 54 Q 60 40 88 44 Q 102 52 102 70" fill="#fda4af" stroke="#e11d48" strokeWidth="2.2" />
            
            {/* Vòm mềm hạ xuống mở lối thoát lên mũi */}
            <path d="M 86 38 Q 90 48 88 56" stroke="#94a3b8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            
            {/* Mũi tên luồng hơi rung lên mũi */}
            <path d="M 98 70 Q 94 48 70 20 Q 50 14 26 12" stroke="#0d9488" strokeWidth="2.4" strokeDasharray="3 2" fill="none" strokeLinecap="round" />
            <polygon points="26,12 32,8 32,16" fill="#0d9488" />
          </g>
        );

      // 2. Đầu lưỡi kẹp giữa 2 hàm răng (/θ/, /ð/)
      case 'dental':
        return (
          <g>
            {/* Vòm miệng trên */}
            <path d="M 28 26 Q 64 10 114 22 L 114 70" stroke="#94a3b8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Hai hàm răng */}
            <rect x="30" y="26" width="6" height="11" rx="1.5" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            <rect x="32" y="50" width="6" height="11" rx="1.5" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            {/* Lưỡi thè ra giữa 2 răng */}
            <path d="M 20 40 Q 24 36 34 38 Q 66 32 94 40 Q 108 50 108 70" fill="#fda4af" stroke="#e11d48" strokeWidth="2.2" />
            {/* Luồng hơi xì qua kẽ răng - lưỡi */}
            <path d="M 88 64 Q 60 38 10 40" stroke="#f43f5e" strokeWidth="2.4" strokeDasharray="3 2" fill="none" strokeLinecap="round" />
            <polygon points="10,40 18,36 17,44" fill="#f43f5e" />
          </g>
        );

      // 3. Răng trên cắn môi dưới (/f/, /v/)
      case 'labiodental':
        return (
          <g>
            {/* Vòm miệng trên */}
            <path d="M 28 26 Q 64 10 114 22 L 114 70" stroke="#94a3b8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Răng trên chạm thẳng vào đệm môi dưới */}
            <rect x="28" y="26" width="6" height="13" rx="1.5" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            <ellipse cx="28" cy="46" rx="6" ry="8" fill="#fb7185" stroke="#e11d48" strokeWidth="1.5" />
            {/* Lưỡi thả lỏng bên trong */}
            <path d="M 40 54 Q 68 38 96 44 Q 108 52 108 70" fill="#fda4af" stroke="#e11d48" strokeWidth="2.2" />
            {/* Luồng hơi xì qua khe răng - môi */}
            <path d="M 84 62 Q 54 36 14 38" stroke="#f43f5e" strokeWidth="2.4" strokeDasharray="3 2" fill="none" strokeLinecap="round" />
            <polygon points="14,38 22,34 21,42" fill="#f43f5e" />
          </g>
        );

      // 4. Đầu lưỡi chạm/sát gờ nướu trên (/t/, /d/, /s/, /z/, /l/)
      case 'alveolar':
        return (
          <g>
            {/* Vòm miệng trên với gờ nướu rõ ràng */}
            <path d="M 28 26 Q 42 20 64 12 Q 94 14 114 24 L 114 70" stroke="#94a3b8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <rect x="28" y="26" width="6" height="11" rx="1.5" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            <rect x="30" y="52" width="6" height="11" rx="1.5" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            {/* Đầu lưỡi nâng lên chạm sát gờ nướu sau răng cửa */}
            <path d="M 36 28 Q 42 34 50 36 Q 78 34 98 44 Q 108 52 108 70" fill="#fda4af" stroke="#e11d48" strokeWidth="2.2" />
            <circle cx="36" cy="28" r="3.5" fill="#10b981" />
            {/* Mũi tên luồng hơi nén/xì tại nướu */}
            <path d="M 88 64 Q 66 38 16 34" stroke="#10b981" strokeWidth="2.4" strokeDasharray="3 2" fill="none" strokeLinecap="round" />
            <polygon points="16,34 24,30 23,38" fill="#10b981" />
          </g>
        );

      // 5. Thân lưỡi cong sát vòm cứng (/ʃ/, /ʒ/, /tʃ/, /dʒ/, /r/)
      case 'postalveolar':
        return (
          <g>
            {/* Vòm miệng trên */}
            <path d="M 28 26 Q 64 10 114 22 L 114 70" stroke="#94a3b8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <rect x="28" y="26" width="6" height="11" rx="1.5" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            <rect x="30" y="52" width="6" height="11" rx="1.5" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            {/* Thân lưỡi vồng cao hình thìa tạo khe hẹp sau nướu */}
            <path d="M 38 46 Q 58 18 88 28 Q 108 42 108 70" fill="#fda4af" stroke="#e11d48" strokeWidth="2.2" />
            {/* Luồng hơi xoáy ma sát */}
            <path d="M 88 64 Q 70 30 16 38" stroke="#6366f1" strokeWidth="2.4" strokeDasharray="3 2" fill="none" strokeLinecap="round" />
            <polygon points="16,38 24,34 23,42" fill="#6366f1" />
          </g>
        );

      // 6. Cuống lưỡi nâng cao chạm vòm mềm (/k/, /g/, /uː/, /ʊ/)
      case 'velar_high':
        return (
          <g>
            {/* Vòm miệng trên */}
            <path d="M 28 26 Q 64 10 114 22 L 114 70" stroke="#94a3b8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <rect x="28" y="26" width="6" height="11" rx="1.5" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            <rect x="30" y="52" width="6" height="11" rx="1.5" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            {/* Cuống lưỡi vồng rất cao ở phía sau họng */}
            <path d="M 36 50 Q 64 42 86 16 Q 106 32 108 70" fill="#fda4af" stroke="#e11d48" strokeWidth="2.2" />
            <circle cx="86" cy="18" r="4.5" fill="#f59e0b" />
            {/* Luồng hơi nén ở cuống họng */}
            <path d="M 104 68 Q 98 42 70 36 L 16 38" stroke="#f59e0b" strokeWidth="2.4" strokeDasharray="3 2" fill="none" strokeLinecap="round" />
            <polygon points="16,38 24,34 23,42" fill="#f59e0b" />
          </g>
        );

      // 7. Thân lưỡi nâng cao phía trước (/iː/, /ɪ/, /j/)
      case 'front_high':
        return (
          <g>
            {/* Vòm miệng trên */}
            <path d="M 28 26 Q 64 10 114 22 L 114 70" stroke="#94a3b8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <rect x="28" y="26" width="6" height="11" rx="1.5" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            <rect x="30" y="52" width="6" height="11" rx="1.5" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            {/* Thân lưỡi nâng cao sát vòm cứng */}
            <path d="M 36 44 Q 58 14 90 26 Q 106 36 108 70" fill="#fda4af" stroke="#e11d48" strokeWidth="2.2" />
            {/* Luồng hơi thanh thoát mượt mà */}
            <path d="M 88 64 Q 60 14 16 34" stroke="#059669" strokeWidth="2.4" strokeDasharray="3 2" fill="none" strokeLinecap="round" />
            <polygon points="16,34 24,30 23,38" fill="#059669" />
          </g>
        );

      // 8. Lưỡi trượt đôi (Diphthongs: /eɪ/, /aɪ/, /ɔɪ/...)
      case 'diphthong':
        return (
          <g>
            {/* Vòm miệng trên */}
            <path d="M 28 26 Q 64 10 114 22 L 114 70" stroke="#94a3b8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <rect x="28" y="26" width="6" height="11" rx="1.5" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            <rect x="30" y="52" width="6" height="11" rx="1.5" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            {/* Vị trí ban đầu mờ */}
            <path d="M 36 50 Q 64 36 94 40" stroke="#c084fc" strokeWidth="2" strokeDasharray="3 2" fill="none" />
            {/* Vị trí lưỡi trượt lên cao */}
            <path d="M 34 44 Q 56 16 88 24 Q 106 34 108 70" fill="#fda4af" stroke="#e11d48" strokeWidth="2.2" />
            {/* Mũi tên trượt nâng dần */}
            <path d="M 60 36 L 60 22" stroke="#9333ea" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="60,18 55,24 65,24" fill="#9333ea" />
          </g>
        );

      // 9. Lưỡi mở thấp hoặc trung bình (/ɑː/, /æ/, /ʌ/, /ɜː/, /ə/...)
      default:
        return (
          <g>
            {/* Vòm miệng trên */}
            <path d="M 28 26 Q 64 10 114 22 L 114 70" stroke="#94a3b8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <rect x="28" y="26" width="6" height="11" rx="1.5" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            <rect x="30" y="52" width="6" height="11" rx="1.5" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            {/* Lưỡi nằm thấp dưới sàn miệng */}
            <path d="M 36 52 Q 62 38 90 44 Q 106 50 108 70" fill="#fda4af" stroke="#e11d48" strokeWidth="2.2" />
            {/* Luồng hơi thông thoáng */}
            <path d="M 88 64 Q 60 26 16 36" stroke="#0284c7" strokeWidth="2.4" strokeDasharray="3 2" fill="none" strokeLinecap="round" />
            <polygon points="16,36 24,32 23,40" fill="#0284c7" />
          </g>
        );
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <svg
        viewBox="0 0 160 100"
        className={`w-full max-w-[240px] h-auto overflow-visible drop-shadow-sm ${className}`}
        aria-label={`Sơ đồ mặt cắt giải phẫu cho âm ${ipa}`}
        role="img"
      >
        <defs>
          {/* Đốm rung dây thanh quản */}
          <radialGradient id="vocalCordGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Nền khung mềm mại */}
        <rect width="160" height="100" rx="16" fill="#f0f9ff" opacity="0.6" stroke="#bae6fd" strokeWidth="1" />

        {renderSideAnatomy()}

        {/* Vị trí Dây thanh quản ở đáy cổ họng */}
        <g>
          <circle cx="106" cy="74" r={isVoiced ? 8 : 4.5} fill={isVoiced ? 'url(#vocalCordGlow)' : '#94a3b8'} opacity={isVoiced ? 0.9 : 0.6} />
          {isVoiced && (
            <path d="M 96 74 Q 106 68 116 74 M 98 78 Q 106 72 114 78" stroke="#d97706" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          )}
        </g>
      </svg>
    </div>
  );
}
