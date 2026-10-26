'use client';

import React from 'react';

interface IpaFrontViewProps {
  ipa: string;
  className?: string;
  isVoiced?: boolean;
}

export function IpaFrontView({ ipa, className = '', isVoiced }: IpaFrontViewProps) {
  // Phân loại âm vào 8 cơ chế khẩu hình mặt trước thực tế
  const getFrontViewCategory = (symbol: string): string => {
    // 1. Răng trên cắn môi dưới
    if (symbol === '/f/' || symbol === '/v/') return 'labiodental';
    // 2. Đầu lưỡi thè giữa hai răng
    if (symbol === '/θ/' || symbol === '/ð/') return 'dental';
    // 3. Ngậm khép 2 môi
    if (symbol === '/p/' || symbol === '/b/' || symbol === '/m/') return 'bilabial';
    // 4. Khép răng xì hơi / chu môi ma sát
    if (['/s/', '/z/', '/ʃ/', '/ʒ/', '/tʃ/', '/dʒ/'].includes(symbol)) return 'sibilant';
    // 5. Chu tròn môi
    if (['/uː/', '/ʊ/', '/ɔː/', '/ɒ/', '/əʊ/', '/oʊ/', '/w/', '/ɔɪ/'].includes(symbol)) return 'rounded';
    // 6. Căng ngang khóe miệng như cười
    if (['/iː/', '/ɪ/', '/e/', '/eɪ/'].includes(symbol)) return 'spread';
    // 7. Mở rộng hàm tự nhiên
    if (['/ɑː/', '/æ/', '/ʌ/', '/ɜː/', '/ə/', '/aɪ/', '/aʊ/', '/eə/', '/ɪə/', '/ʊə/'].includes(symbol)) return 'open';
    // 8. Răng nướu & vòm mềm
    return 'alveolar_velar';
  };

  const category = getFrontViewCategory(ipa);

  const renderVisuals = () => {
    switch (category) {
      // 1. Răng trên cắn nhẹ môi dưới (/f/, /v/)
      case 'labiodental':
        return (
          <g>
            {/* Vòm môi trên */}
            <path d="M 24 42 Q 80 20 136 42 Q 80 34 24 42 Z" fill="url(#lipUpperGrad)" />
            {/* Khoang miệng tối */}
            <path d="M 36 44 Q 80 38 124 44 Q 80 62 36 44 Z" fill="#4c0519" opacity="0.9" />
            {/* Hàm răng trên lộ rõ cắn xuống môi dưới */}
            <rect x="44" y="38" width="72" height="13" rx="3" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
            <line x1="62" y1="38" x2="62" y2="51" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="80" y1="38" x2="80" y2="51" stroke="#cbd5e1" strokeWidth="1.2" />
            <line x1="98" y1="38" x2="98" y2="51" stroke="#cbd5e1" strokeWidth="1" />
            {/* Môi dưới cuộn vào chạm chân răng trên */}
            <path d="M 30 49 Q 80 43 130 49 Q 80 72 30 49 Z" fill="url(#lipLowerGrad)" />
            {/* Luồng hơi xì qua kẽ răng - môi dưới */}
            <path d="M 60 55 Q 80 64 100 55" stroke="#f43f5e" strokeWidth="2.4" strokeDasharray="3 3" fill="none" strokeLinecap="round" />
            <path d="M 80 57 L 80 68" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      // 2. Đầu lưỡi kẹp thè giữa hai hàm răng (/θ/, /ð/)
      case 'dental':
        return (
          <g>
            {/* Môi trên */}
            <path d="M 28 40 Q 80 24 132 40 Q 80 34 28 40 Z" fill="url(#lipUpperGrad)" />
            {/* Răng trên */}
            <rect x="42" y="36" width="76" height="11" rx="2.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
            <line x1="61" y1="36" x2="61" y2="47" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="80" y1="36" x2="80" y2="47" stroke="#cbd5e1" strokeWidth="1.2" />
            <line x1="99" y1="36" x2="99" y2="47" stroke="#cbd5e1" strokeWidth="1" />
            {/* Đầu lưỡi thè ra giữa 2 hàm răng */}
            <path d="M 52 45 Q 80 42 108 45 Q 80 58 52 45 Z" fill="#fb7185" stroke="#e11d48" strokeWidth="1.6" />
            <ellipse cx="80" cy="50" rx="14" ry="4" fill="#f43f5e" opacity="0.6" />
            {/* Răng dưới nằm sau lưỡi */}
            <rect x="48" y="52" width="64" height="9" rx="2" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" opacity="0.9" />
            {/* Môi dưới */}
            <path d="M 28 46 Q 80 42 132 46 Q 80 72 28 46 Z" fill="url(#lipLowerGrad)" />
            {/* Ký hiệu luồng hơi thoát qua 2 bên lưỡi */}
            <path d="M 44 47 L 34 47" stroke="#0d9488" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M 116 47 L 126 47" stroke="#0d9488" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        );

      // 3. Ngậm khép 2 môi (/p/, /b/, /m/)
      case 'bilabial':
        return (
          <g>
            {/* Môi trên áp chặt vào môi dưới */}
            <path d="M 22 47 Q 51 34 80 40 Q 109 34 138 47 Q 80 44 22 47 Z" fill="url(#lipUpperGrad)" />
            <path d="M 22 47 Q 80 50 138 47 Q 80 72 22 47 Z" fill="url(#lipLowerGrad)" />
            {/* Đường giao tiếp xúc giữa 2 môi */}
            <path d="M 26 47 Q 80 49 134 47" stroke="#881337" strokeWidth="3" strokeLinecap="round" />
            {/* Áp lực nén hơi bên trong */}
            <circle cx="80" cy="48" r="16" fill="#f43f5e" opacity="0.25" />
            {/* Mũi tên nén hoặc thoát khí */}
            {ipa === '/m/' ? (
              // Thoát khí qua mũi
              <g>
                <path d="M 72 26 L 72 16 M 88 26 L 88 16" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 68 18 L 72 14 L 76 18 M 84 18 L 88 14 L 92 18" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>
            ) : (
              // Bật bung hơi 2 môi (/p/, /b/)
              <g>
                <path d="M 80 34 L 80 26 M 80 60 L 80 68" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 76 28 L 80 24 L 84 28 M 76 66 L 80 70 L 84 66" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>
            )}
          </g>
        );

      // 4. Khép răng xì hơi / chu môi sibilants (/s/, /z/, /ʃ/, /ʒ/, /tʃ/, /dʒ/)
      case 'sibilant':
        return (
          <g>
            {/* Môi trên mở hé */}
            <path d="M 26 40 Q 80 26 134 40 Q 80 36 26 40 Z" fill="url(#lipUpperGrad)" />
            {/* Khoang miệng tối hẹp */}
            <ellipse cx="80" cy="48" rx="46" ry="12" fill="#4c0519" />
            {/* Hai hàm răng khép gần sát nhau tạo khe hẹp */}
            <rect x="38" y="38" width="84" height="9" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <rect x="40" y="48" width="80" height="9" rx="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            {/* Khe xì hơi hẹp ở giữa */}
            <line x1="38" y1="47.5" x2="122" y2="47.5" stroke="#64748b" strokeWidth="1.5" />
            {/* Môi dưới */}
            <path d="M 26 48 Q 80 44 134 48 Q 80 72 26 48 Z" fill="url(#lipLowerGrad)" />
            {/* Sóng âm thanh xì rít ma sát (Zzz/Sss) */}
            <path d="M 12 43 Q 18 48 12 53 Q 6 58 12 63" stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 148 43 Q 142 48 148 53 Q 154 58 148 63" stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        );

      // 5. Chu tròn môi (/uː/, /ʊ/, /ɔː/, /w/...)
      case 'rounded':
        return (
          <g>
            {/* Môi chu tròn tạo thành hình tròn/oval trung tâm */}
            <ellipse cx="80" cy="48" rx="42" ry="32" fill="url(#lipLowerGrad)" />
            <ellipse cx="80" cy="48" rx="34" ry="24" fill="url(#lipUpperGrad)" />
            {/* Lỗ mở tròn ở giữa môi */}
            <ellipse cx="80" cy="48" rx="16" ry="14" fill="#4c0519" />
            {/* Đầu lưỡi lấp ló sâu bên trong */}
            <ellipse cx="80" cy="53" rx="10" ry="5" fill="#fb7185" />
            {/* Mũi tên co tròn môi hướng vào tâm */}
            <path d="M 44 48 L 52 48" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 116 48 L 108 48" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 80 24 L 80 30" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 80 72 L 80 66" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );

      // 6. Căng ngang khóe miệng như cười (/iː/, /ɪ/, /e/, /eɪ/)
      case 'spread':
        return (
          <g>
            {/* Môi trên kéo dẹt sang 2 bên */}
            <path d="M 14 47 Q 80 20 146 47 Q 80 35 14 47 Z" fill="url(#lipUpperGrad)" />
            {/* Khoang miệng dẹt ngang */}
            <ellipse cx="80" cy="48" rx="54" ry="10" fill="#4c0519" />
            {/* Răng trên lộ toàn bộ */}
            <rect x="34" y="41" width="92" height="7.5" rx="2" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
            {/* Răng dưới */}
            <rect x="40" y="49" width="80" height="6.5" rx="2" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" opacity="0.9" />
            {/* Môi dưới kéo căng dẹt */}
            <path d="M 14 48 Q 80 43 146 48 Q 80 70 14 48 Z" fill="url(#lipLowerGrad)" />
            {/* Mũi tên kéo khóe miệng sang 2 bên (Cười tươi) */}
            <g stroke="#6366f1" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 12 48 L 2 48 M 2 48 L 7 43 M 2 48 L 7 53" />
              <path d="M 148 48 L 158 48 M 158 48 L 153 43 M 158 48 L 153 53" />
            </g>
          </g>
        );

      // 7. Mở rộng hàm tự nhiên (/ɑː/, /æ/, /ʌ/, /ɜː/, /ə/...)
      case 'open':
        return (
          <g>
            {/* Môi trên mở cao */}
            <path d="M 22 36 Q 80 14 138 36 Q 80 28 22 36 Z" fill="url(#lipUpperGrad)" />
            {/* Khoang miệng mở rất rộng theo chiều dọc */}
            <ellipse cx="80" cy="50" rx="46" ry="24" fill="#4c0519" />
            {/* Răng trên */}
            <rect x="42" y="30" width="76" height="8" rx="2" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
            {/* Thân lưỡi nằm thấp ở đáy miệng */}
            <path d="M 46 56 Q 80 46 114 56 Q 80 72 46 56 Z" fill="#fb7185" stroke="#e11d48" strokeWidth="1.6" />
            {/* Môi dưới hạ sâu xuống */}
            <path d="M 22 56 Q 80 48 138 56 Q 80 86 22 56 Z" fill="url(#lipLowerGrad)" />
            {/* Mũi tên hạ cằm mở rộng theo chiều dọc */}
            <path d="M 80 8 L 80 18 M 76 14 L 80 18 L 84 14" stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 80 88 L 80 96 M 76 92 L 80 96 L 84 92" stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        );

      // 8. Răng nướu & vòm họng (/t/, /d/, /n/, /l/, /k/, /g/, /ŋ/...)
      default:
        return (
          <g>
            {/* Môi trên */}
            <path d="M 24 38 Q 80 22 136 38 Q 80 32 24 38 Z" fill="url(#lipUpperGrad)" />
            {/* Khoang miệng mở vừa */}
            <ellipse cx="80" cy="48" rx="46" ry="16" fill="#4c0519" />
            {/* Răng trên */}
            <rect x="42" y="34" width="76" height="8" rx="2" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
            {/* Đầu lưỡi nâng lên chạm gờ nướu */}
            <path d="M 52 50 Q 80 34 108 50 Q 80 62 52 50 Z" fill="#fb7185" stroke="#e11d48" strokeWidth="1.6" />
            {/* Môi dưới */}
            <path d="M 24 50 Q 80 44 136 50 Q 80 74 24 50 Z" fill="url(#lipLowerGrad)" />
            {/* Mũi tên nâng đầu lưỡi */}
            <path d="M 80 58 L 80 44 M 76 48 L 80 44 L 84 48" stroke="#6366f1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        );
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <svg
        viewBox="0 0 160 100"
        className={`w-full max-w-[240px] h-auto overflow-visible drop-shadow-sm ${className}`}
        aria-label={`Sơ đồ khẩu hình nhìn thẳng cho âm ${ipa}`}
        role="img"
      >
        <defs>
          {/* Gradient Môi trên */}
          <linearGradient id="lipUpperGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>

          {/* Gradient Môi dưới */}
          <linearGradient id="lipLowerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>

          {/* Hiệu ứng hào quang nếu là âm hữu thanh */}
          {isVoiced && (
            <filter id="voicedGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          )}
        </defs>

        {/* Nền khung mềm mại */}
        <rect width="160" height="100" rx="16" fill="#fff1f2" opacity="0.6" stroke="#fecdd3" strokeWidth="1" />

        {renderVisuals()}
      </svg>
    </div>
  );
}
