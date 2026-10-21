/* Lingora Week 1 clickable prototype.
 * Static, local-only: state lives in localStorage. No backend, no auth.
 * Mirrors product rules: Unknown != Weak, Skipped != Failed, technical failure != learner failure,
 * completion != mastery, verify before recovery. */
(() => {
  'use strict';
  const D = window.LINGORA_DATA;
  const KEY = 'lingora-prototype-v1';
  const app = document.getElementById('app');

  const fresh = () => ({
    onboarded: false, minutes: 30, mode: 'normal', simDay: 1, welcomeBack: 0,
    check: null, currentDay: 1, completedDays: [], partialDays: [], restDays: [],
    inProgress: null, evidence: [], artifacts: [], drafts: {}, dueReviews: [], misses: {},
    interventions: [], plans: {}, flags: { micDenied: false, uploadFail: false, noAudio: false },
  });
  let S = load();
  let R = null; // active runner (lesson / review / verify / check)
  let protoInspectedStage = null;
  const REC = { stream: null, mr: null, chunks: [], timer: null, started: 0 };

  function load() {
    try { return { ...fresh(), ...(JSON.parse(localStorage.getItem(KEY)) || {}) }; } catch { return fresh(); }
  }
  const save = () => localStorage.setItem(KEY, JSON.stringify(S));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const day = (n) => D.days.find((d) => d.n === Number(n));
  const norm = (s) => String(s || '').trim().toLowerCase().replace(/[.!?,]+$/g, '');

  let toastTimer;
  function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
  }

  /* ---------------- Audio (speech synthesis stands in for recorded audio) ---------------- */
  function speak(text, onEnd, rate = 0.85) {
    if (S.flags.noAudio || !('speechSynthesis' in window)) return false;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = rate;
    const v = speechSynthesis.getVoices().find((x) => /^en[-_]US/i.test(x.lang));
    if (v) u.voice = v;
    u.onend = onEnd || null;
    speechSynthesis.speak(u);
    return true;
  }

  const LETTER_IPA = {
    A: { ipa: '/eɪ/', vi: 'ây', mouth: 'trượt ê -> i' },
    B: { ipa: '/biː/', vi: 'bi...', mouth: 'b + i dài' },
    C: { ipa: '/siː/', vi: 'xi...', mouth: 'xì nhẹ s + i dài' },
    D: { ipa: '/diː/', vi: 'đi...', mouth: 'đ + i dài' },
    E: { ipa: '/iː/', vi: 'i...', mouth: 'cười căng miệng i dài' },
    F: { ipa: '/ef/', vi: 'ép-phờ', mouth: 'e + răng trên chạm môi dưới thổi nhẹ' },
    G: { ipa: '/dʒiː/', vi: 'gi...', mouth: 'tròn môi gi + i dài' },
    H: { ipa: '/eɪtʃ/', vi: 'ây-chờ', mouth: 'ây + bật ch nhẹ cuối' },
    I: { ipa: '/aɪ/', vi: 'ai', mouth: 'mở miệng a trượt sang i' },
    J: { ipa: '/dʒeɪ/', vi: 'giây', mouth: 'tròn môi gi + ây' },
    K: { ipa: '/keɪ/', vi: 'kây', mouth: 'bật hơi k + ây' },
    L: { ipa: '/el/', vi: 'eo (uốn lưỡi)', mouth: 'e + cong đầu lưỡi chạm lợi trên' },
    M: { ipa: '/em/', vi: 'em (ngậm môi)', mouth: 'e + khép chặt hai môi' },
    N: { ipa: '/en/', vi: 'en', mouth: 'e + đầu lưỡi chạm lợi trên' },
    O: { ipa: '/əʊ/', vi: 'âu', mouth: 'ơ trượt sang u tròn môi' },
    P: { ipa: '/piː/', vi: 'pi...', mouth: 'mím môi bật hơi p + i dài' },
    Q: { ipa: '/kjuː/', vi: 'kiu...', mouth: 'k + diu dài' },
    R: { ipa: '/ɑːr/', vi: 'a...(r)', mouth: 'mở rộng miệng a + cuộn lưỡi r' },
    S: { ipa: '/es/', vi: 'ét-sờ', mouth: 'e + xì hơi qua kẽ răng s' },
    T: { ipa: '/tiː/', vi: 'ti...', mouth: 'bật đầu lưỡi t + i dài' },
    U: { ipa: '/juː/', vi: 'diu...', mouth: 'diu ngân dài' },
    V: { ipa: '/viː/', vi: 'vi...', mouth: 'răng trên chạm môi dưới rung v + i dài' },
    W: { ipa: '/ˈdʌb.əl.juː/', vi: 'đắp-bồ-diu', mouth: '3 âm tiết: ĐẮP-bồ-diu' },
    X: { ipa: '/eks/', vi: 'ếch-xờ', mouth: 'e + k + xì hơi s' },
    Y: { ipa: '/waɪ/', vi: 'oai / guai', mouth: 'tròn môi w + ai' },
    Z: { ipa: '/ziː/', vi: 'di...(z)', mouth: 'rung kẽ răng z + i dài' },
  };

  function normalizeAsciiLetters(str) {
    return (str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toUpperCase()
      .replace(/[^A-Z]/g, '');
  }

  function renderMouthDiagram(ipa) {
    const configs = {
      '/iː/': {
        tag: 'Khẩu hình Căng ngang (Cười tươi)',
        lips: 'Kéo căng 2 khóe miệng sang ngang như đang mỉm cười',
        tongue: 'Thân lưỡi nâng cao sát vòm miệng trên',
        voice: 'Rung dây thanh · Ngân dài 2 nhịp',
        frontCaption: '↔ Căng ngang 2 bên như đang cười',
        sideCaption: 'Lưỡi nâng cao sát vòm · Ngân dài i...',
        frontSvg: `
          <path d="M 14 38 Q 64 16 114 38 Q 64 28 14 38 Z" fill="#f43f5e"/>
          <path d="M 14 38 Q 64 60 114 38 Q 64 50 14 38 Z" fill="#e11d48"/>
          <path d="M 24 38 Q 64 30 104 38 Q 64 46 24 38 Z" fill="#881337"/>
          <rect x="32" y="33" width="64" height="5" rx="2" fill="#ffffff"/>
          <rect x="36" y="39" width="56" height="4" rx="2" fill="#f8fafc" opacity="0.9"/>
          <path d="M 11 38 L 3 38 M 3 38 L 7 34 M 3 38 L 7 42" stroke="#6d28d9" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M 117 38 L 125 38 M 125 38 L 121 34 M 125 38 L 121 42" stroke="#6d28d9" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        `,
        sideSvg: `
          <path d="M 24 22 Q 57 4 104 16 L 104 58" stroke="#94a3b8" stroke-width="2.6" fill="none" stroke-linecap="round"/>
          <rect x="24" y="22" width="6" height="10" rx="2" fill="#ffffff" stroke="#64748b" stroke-width="1"/>
          <rect x="26" y="44" width="6" height="10" rx="2" fill="#ffffff" stroke="#64748b" stroke-width="1"/>
          <path d="M 34 46 Q 54 15 86 26 Q 98 34 98 54" fill="#fda4af" stroke="#e11d48" stroke-width="2.2"/>
          <path d="M 80 16 Q 50 10 16 34" stroke="#059669" stroke-width="2" stroke-dasharray="3 2" fill="none"/>
          <polygon points="16,34 22,30 21,37" fill="#059669"/>
        `
      },
      '/ɪ/': {
        tag: 'Khẩu hình Thả lỏng (Mở hờ tự nhiên)',
        lips: 'Môi mở hờ tự nhiên, KHÔNG kéo căng sang hai bên',
        tongue: 'Lưỡi hạ thấp hơn /iː/ một chút, cơ lưỡi thả lỏng',
        voice: 'Rung dây thanh · Phát âm cực gọn 1 nhịp',
        frontCaption: '↕ Môi mở hờ thả lỏng · Đọc gọn 1 nhịp',
        sideCaption: 'Lưỡi ở tầm giữa · Phát âm dứt khoát',
        frontSvg: `
          <path d="M 26 38 Q 64 16 102 38 Q 64 28 26 38 Z" fill="#f43f5e"/>
          <path d="M 26 38 Q 64 62 102 38 Q 64 50 26 38 Z" fill="#e11d48"/>
          <ellipse cx="64" cy="38" rx="26" ry="8" fill="#881337"/>
          <rect x="44" y="31" width="40" height="4.5" rx="2" fill="#ffffff"/>
          <ellipse cx="64" cy="43" rx="16" ry="3.5" fill="#fb7185"/>
          <path d="M 64 12 L 64 20 M 64 56 L 64 64" stroke="#0d9488" stroke-width="2.2" stroke-linecap="round"/>
        `,
        sideSvg: `
          <path d="M 24 22 Q 57 4 104 16 L 104 58" stroke="#94a3b8" stroke-width="2.6" fill="none" stroke-linecap="round"/>
          <rect x="24" y="22" width="6" height="10" rx="2" fill="#ffffff" stroke="#64748b" stroke-width="1"/>
          <rect x="26" y="46" width="6" height="10" rx="2" fill="#ffffff" stroke="#64748b" stroke-width="1"/>
          <path d="M 35 48 Q 58 26 88 32 Q 98 38 98 54" fill="#fda4af" stroke="#e11d48" stroke-width="2.2"/>
          <circle cx="17" cy="36" r="4.5" fill="#10b981"/>
        `
      },
      '/eɪ/': {
        tag: 'Khẩu hình Trượt đôi (Mở vừa ➔ Khép cười)',
        lips: 'Bắt đầu mở vừa đọc /e/ (ê), rồi trượt khép dần sang /ɪ/ (i)',
        tongue: 'Lưỡi lướt mượt từ vị trí giữa miệng lên cao',
        voice: 'Nguyên âm đôi trượt mượt (ê ↷ i = ây)',
        frontCaption: '1. Mở vừa đọc /e/ ↷ 2. Khép cười sang /ɪ/',
        sideCaption: 'Thân lưỡi trượt nâng dần từ giữa lên cao',
        frontSvg: `
          <ellipse cx="48" cy="38" rx="24" ry="15" fill="none" stroke="#a78bfa" stroke-width="2" stroke-dasharray="3 2"/>
          <path d="M 48 40 Q 80 24 112 40 Q 80 56 48 40 Z" fill="#f43f5e" opacity="0.92"/>
          <ellipse cx="80" cy="40" rx="20" ry="6" fill="#881337"/>
          <rect x="64" y="35" width="32" height="4" rx="1.5" fill="#ffffff"/>
          <path d="M 38 20 Q 64 8 88 20" stroke="#6d28d9" stroke-width="2.2" fill="none" stroke-linecap="round"/>
          <polygon points="90,21 83,17 85,24" fill="#6d28d9"/>
        `,
        sideSvg: `
          <path d="M 24 22 Q 57 4 104 16 L 104 58" stroke="#94a3b8" stroke-width="2.6" fill="none" stroke-linecap="round"/>
          <path d="M 36 50 Q 60 36 88 40" stroke="#a78bfa" stroke-width="2" stroke-dasharray="3 2" fill="none"/>
          <path d="M 34 46 Q 56 18 87 27 Q 98 35 98 54" fill="#fda4af" stroke="#e11d48" stroke-width="2.2"/>
          <path d="M 60 36 L 60 23" stroke="#6d28d9" stroke-width="2.2" stroke-linecap="round"/>
          <polygon points="60,19 56,25 64,25" fill="#6d28d9"/>
        `
      },
      '/z/': {
        tag: 'Khẩu hình Khép hờ Răng & Rung cổ họng',
        lips: 'Môi hé nhẹ tự nhiên để lộ hai hàm răng',
        tongue: 'Hai hàm răng khép gần chạm nhau, đầu lưỡi sát chân răng trên',
        voice: 'Rung mạnh dây thanh quản ở cổ + luồng hơi xì qua kẽ răng (zzz)',
        frontCaption: '🦷 Hai hàm răng khép hờ · Xì hơi rung "zzz"',
        sideCaption: '〰 Đầu lưỡi sát răng cửa · Rung thanh quản',
        frontSvg: `
          <path d="M 20 38 Q 64 18 108 38 Q 64 58 20 38 Z" fill="#f43f5e"/>
          <path d="M 28 38 Q 64 30 100 38 Q 64 46 28 38 Z" fill="#881337"/>
          <rect x="34" y="33" width="60" height="5" rx="1.5" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.8"/>
          <rect x="34" y="38" width="60" height="5" rx="1.5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="0.8"/>
          <line x1="49" y1="33" x2="49" y2="43" stroke="#cbd5e1" stroke-width="0.8"/>
          <line x1="64" y1="33" x2="64" y2="43" stroke="#cbd5e1" stroke-width="0.8"/>
          <line x1="79" y1="33" x2="79" y2="43" stroke="#cbd5e1" stroke-width="0.8"/>
          <path d="M 11 32 Q 7 38 11 44 M 7 29 Q 1 38 7 47" stroke="#059669" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M 117 32 Q 121 38 117 44 M 121 29 Q 127 38 121 47" stroke="#059669" stroke-width="2" fill="none" stroke-linecap="round"/>
        `,
        sideSvg: `
          <path d="M 24 22 Q 57 4 104 16 L 104 58" stroke="#94a3b8" stroke-width="2.6" fill="none" stroke-linecap="round"/>
          <rect x="24" y="25" width="6" height="8" rx="1.5" fill="#ffffff" stroke="#64748b" stroke-width="1"/>
          <rect x="24" y="34" width="6" height="8" rx="1.5" fill="#ffffff" stroke="#64748b" stroke-width="1"/>
          <path d="M 31 32 Q 57 25 86 32 Q 98 38 98 54" fill="#fda4af" stroke="#e11d48" stroke-width="2.2"/>
          <circle cx="96" cy="52" r="6" fill="#fef08a" stroke="#d97706" stroke-width="1.5"/>
          <path d="M 87 50 L 105 50 M 89 54 L 103 54" stroke="#b45309" stroke-width="1.5" stroke-linecap="round"/>
        `
      },
      '/m/': {
        tag: 'Khẩu hình Ngậm khép 2 môi (Âm mũi)',
        lips: 'Hai môi khép chạm nhẹ vào nhau ở cuối từ',
        tongue: 'Lưỡi thả lỏng hoàn toàn bên trong khoang miệng',
        voice: 'Rung dây thanh, luồng hơi đi lên qua khoang mũi ("ừm")',
        frontCaption: '👄 Hai môi ngậm khép nhẹ vào nhau',
        sideCaption: '👃 Luồng hơi rung thoát ra qua khoang mũi',
        frontSvg: `
          <path d="M 20 38 Q 42 26 64 32 Q 86 26 108 38 Q 64 39 20 38 Z" fill="#f43f5e"/>
          <path d="M 20 38 Q 64 52 108 38 Q 64 37 20 38 Z" fill="#e11d48"/>
          <line x1="20" y1="38" x2="108" y2="38" stroke="#881337" stroke-width="2.4" stroke-linecap="round"/>
          <path d="M 64 16 L 64 24 M 64 58 L 64 50" stroke="#6d28d9" stroke-width="2.2" stroke-linecap="round"/>
        `,
        sideSvg: `
          <path d="M 24 22 Q 57 4 104 16 L 104 58" stroke="#94a3b8" stroke-width="2.6" fill="none" stroke-linecap="round"/>
          <circle cx="22" cy="32" r="4.5" fill="#f43f5e"/>
          <circle cx="22" cy="38" r="4.5" fill="#e11d48"/>
          <path d="M 87 28 Q 58 8 16 12" stroke="#059669" stroke-width="2.2" stroke-dasharray="3 2" fill="none"/>
          <polygon points="14,12 20,8 20,16" fill="#059669"/>
          <path d="M 32 46 Q 60 38 88 42" fill="#fda4af" stroke="#e11d48" stroke-width="2.2"/>
        `
      },
      '/aɪm/': {
        tag: 'Khẩu hình Mở rộng /aɪ/ ➔ Khép môi /m/',
        lips: 'Bước 1 mở rộng miệng đọc "ai", Bước 2 khép chặt hai môi thành "m"',
        tongue: 'Lưỡi nâng lên theo âm /ɪ/ rồi hạ nghỉ khi môi khép',
        voice: 'Rung liên tục nối mượt từ nguyên âm sang âm mũi /m/',
        frontCaption: 'Mở miệng "ai" ➔ Khép hai môi giữ âm "m"',
        sideCaption: 'Đóng môi ở cuối + Hơi rung lên mũi',
        frontSvg: `
          <ellipse cx="44" cy="38" rx="20" ry="15" fill="none" stroke="#f43f5e" stroke-width="2.2" stroke-dasharray="3 2"/>
          <line x1="70" y1="38" x2="112" y2="38" stroke="#881337" stroke-width="4" stroke-linecap="round"/>
          <path d="M 44 18 Q 68 8 91 26" stroke="#6d28d9" stroke-width="2.2" fill="none"/>
        `,
        sideSvg: `
          <path d="M 24 22 Q 57 4 104 16 L 104 58" stroke="#94a3b8" stroke-width="2.6" fill="none" stroke-linecap="round"/>
          <circle cx="22" cy="32" r="4.5" fill="#f43f5e"/>
          <circle cx="22" cy="38" r="4.5" fill="#e11d48"/>
          <path d="M 87 28 Q 58 8 16 12" stroke="#059669" stroke-width="2.2" stroke-dasharray="3 2" fill="none"/>
          <path d="M 32 46 Q 60 38 88 42" fill="#fda4af" stroke="#e11d48" stroke-width="2.2"/>
        `
      },
      '/ʃiːz/': {
        tag: 'Khẩu hình Chu môi /ʃ/ ➔ Cười /iː/ ➔ Rung /z/',
        lips: 'Chu tròn môi thổi "sh", kéo ngang cười "i...", giữ răng khép rung "z"',
        tongue: 'Nâng cao gần vòm miệng, kết thúc đầu lưỡi sát răng cửa',
        voice: 'Hơi gió /ʃ/ chuyển sang rung dây thanh /iːz/',
        frontCaption: '◯ Chu môi "sh" ➔ Cười ngang "i...z"',
        sideCaption: 'Nối mượt 3 chuyển động lưỡi & răng',
        frontSvg: `
          <circle cx="38" cy="38" r="13" fill="#f43f5e" opacity="0.88"/>
          <circle cx="38" cy="38" r="5" fill="#881337"/>
          <path d="M 64 38 Q 88 24 112 38 Q 88 52 64 38 Z" fill="#e11d48"/>
          <rect x="72" y="35" width="32" height="5" rx="1.5" fill="#ffffff"/>
        `,
        sideSvg: `
          <path d="M 24 22 Q 57 4 104 16 L 104 58" stroke="#94a3b8" stroke-width="2.6" fill="none" stroke-linecap="round"/>
          <path d="M 31 34 Q 57 18 86 30 Q 98 38 98 54" fill="#fda4af" stroke="#e11d48" stroke-width="2.2"/>
          <circle cx="96" cy="52" r="5.5" fill="#fef08a" stroke="#d97706" stroke-width="1.5"/>
        `
      }
    };

    const cfg = configs[ipa] || configs['/iː/'];
    return `<div class="ipa-mouth-studio">
      <div class="mouth-studio-top">
        <span class="mouth-spec-badge">🎯 ${esc(cfg.tag)}</span>
        <span class="mouth-studio-sub">Sơ đồ Khẩu hình Trực quan</span>
      </div>
      <div class="mouth-panels-grid">
        <div class="mouth-diagram-panel front-panel">
          <div class="mouth-panel-header">1. NHÌN THẲNG (MÔI &amp; RĂNG)</div>
          <svg viewBox="0 0 128 70" class="mouth-panel-svg" aria-hidden="true">
            ${cfg.frontSvg}
          </svg>
          <div class="mouth-panel-caption">${esc(cfg.frontCaption)}</div>
        </div>
        <div class="mouth-diagram-panel side-panel">
          <div class="mouth-panel-header">2. MẶT CẮT NGANG (LƯỠI &amp; HƠI)</div>
          <svg viewBox="0 0 128 70" class="mouth-panel-svg" aria-hidden="true">
            ${cfg.sideSvg}
          </svg>
          <div class="mouth-panel-caption">${esc(cfg.sideCaption)}</div>
        </div>
      </div>
      <div class="mouth-specs-list">
        <div class="mouth-spec-item"><span class="spec-ico">👄</span><div><strong>Độ mở môi:</strong> <span>${esc(cfg.lips)}</span></div></div>
        <div class="mouth-spec-item"><span class="spec-ico">👅</span><div><strong>Lưỡi &amp; Răng:</strong> <span>${esc(cfg.tongue)}</span></div></div>
        <div class="mouth-spec-item"><span class="spec-ico">〰️</span><div><strong>Dây thanh &amp; Hơi:</strong> <span>${esc(cfg.voice)}</span></div></div>
      </div>
    </div>`;
  }

  function renderNameSpellerWidget(s) {
    const rawName = s.customSpellName !== undefined ? s.customSpellName : 'Linh';
    const letters = normalizeAsciiLetters(rawName).slice(0, 12).split('');
    const spellAudioText = letters.length ? `${letters.join('. ')}. ${rawName}.` : '';
    const cardsHtml = letters.length
      ? letters.map((ch) => {
          const info = LETTER_IPA[ch] || { ipa: `/${ch}/`, vi: ch, mouth: '' };
          return `<button type="button" class="spell-letter-card" data-act="say-slow" data-text="${ch}" title="Bấm để nghe chữ ${ch}">
            <span class="spell-letter-char">${ch}</span>
            <span class="spell-letter-ipa">${info.ipa}</span>
            <span class="spell-letter-vi">🗣️ "${info.vi}"</span>
            <span class="spell-letter-mouth">${info.mouth}</span>
          </button>`;
        }).join('<span class="spell-plus" aria-hidden="true">+</span>')
      : '<p class="small muted" style="margin:0">Hãy gõ chữ cái từ A–Z (ví dụ: Minh, Huong, Nam, Trang) để xem công thức đánh vần.</p>';

    const summaryRead = letters.map((ch) => LETTER_IPA[ch]?.vi || ch).join(' · ');
    const summaryIpa = letters.map((ch) => LETTER_IPA[ch]?.ipa || ch).join(' - ');

    return `<div class="custom-name-speller">
      <div class="speller-studio-grid">
        <div class="speller-left-col">
          <div class="speller-head">
            <div>
              <span class="kicker" style="margin-bottom:2px;display:inline-block">🔤 MÁY ĐÁNH VẦN IPA TƯƠNG TÁC</span>
              <h4>Thử đánh vần Tên của bạn (hoặc từ bất kỳ)</h4>
              <p class="small muted" style="margin:2px 0 0">Gõ tên bạn vào ô dưới đây để tách từng chữ cái sang IPA và xem cách đọc tiếng Việt tương đương:</p>
            </div>
          </div>
          <div class="speller-input-row">
            <label class="sr-only" for="custom-spell-input">Nhập tên để xem cách đánh vần IPA</label>
            <input id="custom-spell-input" type="text" class="speller-input" data-spell-name="1" value="${esc(rawName)}" placeholder="Gõ tên của bạn (VD: Minh, Huong...)" maxlength="15" autocomplete="off" spellcheck="false" />
            ${letters.length ? `<button type="button" class="btn soft sm" data-act="say-slow" data-text="${esc(spellAudioText)}">🔊 Nghe đánh vần "${esc(letters.join('-'))}"</button>` : ''}
          </div>
          <div class="speller-quick-picks">
            <span class="small muted">Thử nhanh:</span>
            ${['Linh', 'Minh', 'Huong', 'Nam', 'Trang'].map((n) => `<button type="button" class="chip-btn ${rawName.toLowerCase() === n.toLowerCase() ? 'active' : ''}" data-act="pick-spell-name" data-name="${n}">${n}</button>`).join('')}
          </div>
          ${letters.length ? `<div class="spell-summary-bar" id="spell-summary-bar" style="margin-top:10px">
            <div><strong>Chuỗi IPA:</strong> <code>${summaryIpa}</code></div>
            <div><strong>Đọc nối từng chữ cái:</strong> <span class="spell-vi-highlight">${summaryRead}</span> <span class="muted">➔ "${esc(rawName)}"</span></div>
          </div>` : ''}
        </div>
        <div class="speller-right-col">
          <div class="small muted" style="font-weight:700;margin-bottom:8px">👇 Bấm vào từng thẻ chữ cái để nghe phát âm chậm &amp; xem khẩu hình:</div>
          <div class="spell-letters-flow" id="spell-letters-flow">${cardsHtml}</div>
        </div>
      </div>
    </div>`;
  }

  /* ---------------- Evidence & learner state (qualitative, no percentages) ---------------- */
  function addEvidence(e) {
    S.evidence.push({ ...e, simDay: S.simDay, at: Date.now() });
    if (!e.independent) return;
    const m = (S.misses[e.claim] ||= { n: 0, suspected: false });
    if (e.correct) { m.n = 0; m.suspected = false; } else { m.n += 1; if (m.n >= 2) m.suspected = true; }
  }

  function claimState(c) {
    const ev = S.evidence.filter((e) => e.claim === c);
    const ind = ev.filter((e) => e.independent && e.correct);
    const contexts = new Set(ind.map((e) => e.context)).size;
    const transfer = ind.some((e) => e.transfer);
    const delayed = ind.some((e) => e.delayed);
    const last = ev.length ? Math.max(...ev.map((e) => e.simDay)) : null;
    let key, label, why;
    if (!ev.length) { key = 'unknown'; label = 'Chưa biết'; why = 'Chưa có bằng chứng. “Chưa biết” không có nghĩa là yếu.'; }
    else if (!ind.length) {
      key = 'unknown'; label = 'Chưa đủ bằng chứng';
      why = ev.some((e) => !e.independent) ? 'Mới có bài làm có hỗ trợ — chưa cho thấy bạn làm được một mình.' : 'Các lần làm độc lập chưa đúng. Cần thêm cơ hội trước khi kết luận điều gì.';
    } else if (S.simDay - last > 7) { key = 'refresh'; label = 'Cần làm mới'; why = 'Bằng chứng đã cũ. Điều này không có nghĩa là bạn đã quên — chỉ là cần kiểm tra lại.'; }
    else if (delayed && transfer && contexts >= 2) { key = 'consistent'; label = 'Ổn định dần'; why = 'Làm được độc lập, ở nhiều ngữ cảnh, với nội dung mới và sau vài ngày.'; }
    else if (contexts >= 2 || transfer) { key = 'developing'; label = 'Đang phát triển'; why = 'Làm được độc lập ở hơn một ngữ cảnh. Một lần kiểm tra lại sau vài ngày sẽ giúp chắc hơn.'; }
    else { key = 'started'; label = 'Bắt đầu có tín hiệu'; why = 'Có một ngữ cảnh làm độc lập. Cần thêm ngữ cảnh mới và kiểm tra lại sau vài ngày.'; }
    if ((c === 'WRITE' || c === 'SPEAK') && ind.length && ind.every((e) => e.kind === 'selfcheck')) why += ' Dựa trên tự đánh giá — chưa có người chấm.';
    return { key, label, why, ev, dims: { independent: ind.length > 0, breadth: contexts >= 2, transfer, delayed }, suspected: S.misses[c]?.suspected, misses: S.misses[c]?.n || 0 };
  }

  /* ---------------- Planner v1 (prototype) ---------------- */
  const TYPE = {
    LEARN: { label: 'Học mới', mood: 'learning', icon: '📘' }, RESUME: { label: 'Tiếp tục', mood: 'learning', icon: '⏯️' },
    REVIEW: { label: 'Ôn tập', mood: 'review', icon: '🔁' }, VERIFY: { label: 'Kiểm tra ngắn', mood: 'recovery', icon: '🔍' },
    BREAK: { label: 'Nghỉ', mood: 'break', icon: '☕' }, FINISH: { label: 'Khép lại', mood: 'break', icon: '🌙' },
  };

  function nextLessonDay() {
    for (let n = S.currentDay; n <= 7; n++) if (!S.completedDays.includes(n)) return day(n);
    for (let n = 1; n <= 7; n++) if (!S.completedDays.includes(n)) return day(n);
    return null;
  }
  const coreMinutes = (d) => Math.max(6, Math.round(d.minutes * d.steps.filter((s) => s.core).length / d.steps.length));

  function generatePlan() {
    const short = S.mode === 'short';
    const old = S.plans[S.simDay];
    const prev = Object.fromEntries((old?.blocks || []).map((b) => [b.id, b.status]));
    const b = [];
    const ip = S.inProgress && S.inProgress.kind === 'lesson' ? S.inProgress : null;
    if (ip) {
      const d = day(ip.id);
      b.push({ id: `resume-${d.n}`, type: 'RESUME', title: `Tiếp tục Ngày ${d.n}: ${d.title}`, reason: `Bạn đang làm dở ở bước ${ip.idx + 1}. Bài làm đã được lưu, không có gì bị mất.`, minutes: short ? coreMinutes(d) : d.minutes, route: `#/run/lesson/${d.n}` });
    }
    const due = S.dueReviews.filter((r) => !r.done && r.dueDay <= S.simDay);
    const cap = short ? 1 : 2;
    due.slice(0, cap).forEach((r) => b.push({ id: `review-${r.claim}-${r.dueDay}`, type: 'REVIEW', title: `Ôn lại: ${D.claims[r.claim].name}`, reason: `Đến hạn kiểm tra lại sau ${S.simDay - r.createdDay} ngày, bằng câu mới — để xem bạn còn nhớ không.`, minutes: 3, route: `#/run/review/${r.claim}` }));
    const sus = Object.keys(S.misses).find((c) => S.misses[c].suspected && D.verify[c]);
    if (sus) b.push({ id: `verify-${sus}`, type: 'VERIFY', title: `Kiểm tra ngắn: ${D.claims[sus].name}`, reason: 'Có 2 lần liên tiếp chưa đúng khi làm độc lập. Kiểm tra ngắn trước — vài lỗi chưa đủ để kết luận là bạn gặp khó.', minutes: 4, route: `#/run/verify/${sus}` });
    if (!ip) {
      const d = nextLessonDay();
      if (d) {
        let reason = `Tiếp theo trong tuần: ${d.intent.toLowerCase()}.`;
        if (S.check && !S.check.skipped && d.n === S.check.recommended && !S.completedDays.length) reason = 'Điểm bắt đầu gợi ý từ bài kiểm tra đầu vào. Bạn vẫn có thể chọn ngày khác trong Lộ trình.';
        if (d.n === 7) reason = 'Ngày nhẹ: tự chọn ôn tập, bù bài hoặc nghỉ. Nghỉ không bị trừ gì cả.';
        if (short && d.n !== 7) reason = `Ngày ngắn: chỉ phần cốt lõi của Ngày ${d.n}. Phần còn lại có thể làm sau.`;
        b.push({ id: `learn-${d.n}`, type: 'LEARN', title: `Ngày ${d.n}: ${d.title}`, reason, minutes: short ? coreMinutes(d) : d.minutes, route: `#/run/lesson/${d.n}` });
      }
    }
    if (!short && b.length >= 2) b.push({ id: 'break', type: 'BREAK', title: 'Nghỉ 5 phút', reason: 'Đứng dậy, uống nước, nhìn ra xa. Nghỉ ngắn giúp phần sau tập trung hơn.', minutes: 5 });
    b.push({ id: 'finish', type: 'FINISH', title: 'Khép lại ngày học', reason: 'Xem nhanh điều đã làm hôm nay và hẹn ngày mai.', minutes: 1, route: '#/done' });
    S.plans[S.simDay] = {
      mode: S.mode,
      blocks: b.map((x) => ({ ...x, status: prev[x.id] || 'PENDING' })),
      trace: { mode: S.mode, inProgress: !!ip, due: due.length, deferredReviews: Math.max(0, due.length - cap), suspected: sus || null, weekDay: S.currentDay, returning: S.welcomeBack, policy: 'planner-v1 (prototype)' },
    };
    save();
  }
  const plan = () => { if (!S.plans[S.simDay] || S.plans[S.simDay].mode !== S.mode) generatePlan(); return S.plans[S.simDay]; };

  function completeBlockByRoute(route) {
    const p = S.plans[S.simDay];
    if (!p) return;
    p.blocks.filter((b) => b.route === route && b.status !== 'COMPLETED').forEach((b) => { b.status = 'COMPLETED'; });
  }

  /* ---------------- Views ---------------- */
  const mascot = (cls = '') => `<img class="${cls}" src="assets/mascot.jpg" alt="" width="380" height="380" />`;

  function viewWelcome() {
    return `<section class="view hero" aria-labelledby="welcome-title">
      <div class="hero-content-col">
        <div class="hero-pill-badge">✨ Tuần 1 · Me &amp; My English · Lộ trình 3 Chặng Chuẩn Quốc tế</div>
        <h1 id="welcome-title">Học tiếng Anh từng bước, <span>nhẹ nhàng mà chắc chắn.</span></h1>
        <p class="hero-lede">Mỗi ngày một mục tiêu rõ ràng: từ <strong>Khẩu hình IPA trực quan</strong>, <strong>Chuyên đề Ngữ pháp 6 phần</strong> đến <strong>Phản xạ Nghe – Nói – Viết thực chiến</strong>. Không áp lực điểm số, không phán xét.</p>
        <div class="hero-feature-pills">
          <span class="hero-feat-tag">👄 Sơ đồ khẩu hình 1 âm/màn hình</span>
          <span class="hero-feat-tag">🧩 Ngữ pháp 6 phần chuyên sâu</span>
          <span class="hero-feat-tag">🌱 Cây tiến độ bằng chứng thực</span>
        </div>
        <fieldset class="hero-time-fieldset">
          <legend>⏱ Mỗi ngày bạn muốn dành khoảng bao nhiêu thời gian?</legend>
          <div class="choice-grid">
            ${[[15, 'Ngày ngắn · Chỉ học phần cốt lõi'], [30, 'Phiên tiêu chuẩn · Đầy đủ & thoải mái'], [60, 'Chuyên sâu · Thư thả luyện kỹ từng âm']].map(([m, t]) => `
              <div class="pick"><input type="radio" name="minutes" id="min-${m}" value="${m}" ${S.minutes === m ? 'checked' : ''} data-minutes="${m}" />
              <label for="min-${m}"><strong>${m} phút / ngày</strong><span>${t}</span></label></div>`).join('')}
          </div>
        </fieldset>
        <div class="row hero-cta-row">
          <button class="btn primary lg" id="skip-check" data-act="skip-check">🚀 Bắt đầu ngay từ Ngày 1 <span class="arrow">→</span></button>
          <button class="btn soft lg" id="start-check" data-act="go-check">🧭 Làm bài kiểm tra đầu vào (5 câu tuỳ chọn)</button>
        </div>
        <div class="promise">
          <div><strong>🛡️ Không gắn nhãn “yếu”</strong>“Chưa biết” chỉ là chưa học tới, không bao giờ trừ điểm phạt.</div>
          <div><strong>🌿 Bỏ qua không phải thất bại</strong>Nghỉ ngơi, để sau hay chọn ngày ngắn đều được hệ thống tôn trọng.</div>
          <div><strong>🎙️ An toàn lỗi kỹ thuật</strong>Micro hoặc âm thanh lỗi đều có phương án thay thế, không tính sai.</div>
        </div>
      </div>
      <div class="hero-art">
        <div class="hero-art-card">
          ${mascot()}
          <div class="hero-floating-card top-left">
            <span>🔤 IPA Studio</span>
            <strong>/iː/ vs /ɪ/ · Khẩu hình trực quan</strong>
          </div>
          <div class="hero-floating-card bottom-right">
            <span>🧩 Grammar Masterclass</span>
            <strong>To Be (+) (-) (?) &amp; Mổ xẻ câu</strong>
          </div>
        </div>
      </div>
    </section>`;
  }

  function viewCheckIntro() {
    return `<section class="view runner" aria-labelledby="check-title">
      <div class="card feature step-card">
        <div class="kicker">Kiểm tra đầu vào · tuỳ chọn</div>
        <h1 id="check-title" style="font-size:1.8rem">5 câu ngắn, khoảng 5 phút</h1>
        <p>Bài này chỉ xem những gì bạn <strong>đã thể hiện được</strong> ở vài kỹ năng của Tuần 1, để gợi ý chỗ bắt đầu. Bạn có thể bỏ qua từng câu.</p>
        <div class="stack">
          <div class="notice"><span class="ico">ℹ️</span><p>Không có điểm tổng, không có “trình độ”, không dự đoán IELTS. Câu bỏ qua hoặc chưa đúng chỉ có nghĩa là <em>cần thêm bằng chứng</em>.</p></div>
          <div class="notice cream"><span class="ico">🌱</span><p>Nếu bỏ qua cả bài, bạn bắt đầu từ Ngày 1. Mọi kỹ năng ở trạng thái “Chưa biết” — không phải “yếu”.</p></div>
        </div>
        <div class="runner-foot">
          <button class="btn ghost" data-act="skip-check" id="check-skip-all">Bỏ qua bài kiểm tra</button><span class="spacer"></span>
          <a class="btn primary" href="#/run/check/start" id="check-begin">Bắt đầu <span class="arrow">→</span></a>
        </div>
      </div>
    </section>`;
  }

  function viewCheckResult() {
    const c = S.check;
    if (!c) { location.hash = '#/check'; return ''; }
    const rows = Object.entries(D.claims).map(([k, cl]) => {
      const r = c.results?.[k];
      const [cls, label, note] = r === 'demo' ? ['developing', 'Đã thể hiện', 'Bạn đã làm đúng câu này một mình. Đây là một tín hiệu, chưa phải kết luận.']
        : r === 'saved' ? ['unknown', 'Cần thêm bằng chứng', 'Câu bạn viết đã được lưu nhưng không chấm. Tuần 1 sẽ có cơ hội viết đầy đủ hơn.']
        : r === 'none' ? ['unknown', 'Chưa kiểm tra', 'Bài kiểm tra ngắn không có phần nói. Ngày 5 sẽ có.']
        : ['unknown', 'Cần thêm bằng chứng', 'Câu này bị bỏ qua, chưa đúng, hoặc có dùng hỗ trợ. Không có nghĩa là yếu.'];
      return `<article class="card claim"><div class="claim-top"><span class="claim-ico" aria-hidden="true">${cl.icon}</span><div><h3>${esc(cl.name)}</h3><span class="state ${cls}">${label}</span></div></div><p class="muted small" style="margin:0">${note}</p></article>`;
    }).join('');
    return `<section class="view stack" aria-labelledby="result-title">
      <div class="card feature result-hero">
        <div>
          <div class="kicker">Kết quả kiểm tra đầu vào</div>
          <h1 id="result-title" style="font-size:1.9rem">Gợi ý: bắt đầu từ Ngày ${c.recommended}</h1>
          <p class="muted">${c.recommended > 1 ? 'Bạn đã thể hiện được phần đọc, ngữ pháp và hỏi đáp cơ bản, nên có thể bắt đầu ở Ngày 3. Ngày 1–2 vẫn mở bất cứ lúc nào.' : 'Bắt đầu từ Ngày 1 là lựa chọn an toàn. Những kỹ năng chưa thể hiện sẽ được bổ sung bằng chứng dần dần.'}</p>
          <div class="row">
            <button class="btn primary" data-act="accept-start" data-day="${c.recommended}" id="accept-rec">Theo gợi ý · Ngày ${c.recommended} <span class="arrow">→</span></button>
            ${c.recommended > 1 ? '<button class="btn" data-act="accept-start" data-day="1" id="start-day1">Tôi muốn bắt đầu từ Ngày 1</button>' : ''}
          </div>
        </div>
        ${mascot()}
      </div>
      <h2>Theo từng kỹ năng</h2>
      <div class="claims">${rows}</div>
    </section>`;
  }

  function stateChip(c) { const s = claimState(c); return `<span class="state ${s.key}">${s.label}</span>`; }

  function renderTreeSvg(stage) {
    const s = Number(stage) || 1;
    let content = '';
    if (s === 1) {
      content = `
        <g id="stage-1-seed" class="tree-stage-group">
          <ellipse cx="160" cy="148" rx="28" ry="12" fill="url(#pMagicAura)" opacity="0.65" filter="url(#pSoftGlow)"></ellipse>
          <!-- Delicate glowing taproots -->
          <path d="M 160 154 C 157 166 163 176 159 186" stroke="url(#pRootGrad)" stroke-width="2.2" stroke-linecap="round" fill="none" stroke-dasharray="4 2"></path>
          <path d="M 159 163 C 150 169 144 175 140 182" stroke="url(#pRootGrad)" stroke-width="1.6" stroke-linecap="round" fill="none" stroke-dasharray="3 2"></path>
          <path d="M 161 167 C 169 172 174 177 177 183" stroke="url(#pRootGrad)" stroke-width="1.5" stroke-linecap="round" fill="none" stroke-dasharray="3 2"></path>
          <!-- Cradled soil mound -->
          <path d="M 138 149 Q 160 142 182 149 Q 160 154 138 149 Z" fill="#432818" opacity="0.85"></path>
          <!-- Luminous Golden Acorn Seed -->
          <g transform="translate(160, 142) rotate(-10)">
            <ellipse cx="0" cy="2" rx="11" ry="14" fill="url(#pSeedGrad)" filter="url(#pDropShadow)"></ellipse>
            <path d="M -11 -2 C -11 -10 11 -10 11 -2 C 7 1 -7 1 -11 -2 Z" fill="#78350f"></path>
            <path d="M 0 -10 L 0 -15" stroke="#78350f" stroke-width="2.2" stroke-linecap="round"></path>
            <ellipse cx="-3.5" cy="1" rx="3" ry="5.5" fill="#fef9c3" opacity="0.55" transform="rotate(-12 -3.5 1)"></ellipse>
          </g>
          <!-- Tiny emerald life-spark emerging -->
          <path d="M 162 128 C 164 121 171 119 173 123 C 170 127 165 129 162 128 Z" fill="url(#pLeafLight)" filter="url(#pSoftGlow)"></path>
          <circle cx="163" cy="120" r="2.5" fill="#ffffff" filter="url(#pSoftGlow)"></circle>
          <path d="M 152 118 L 150 113 M 163 113 L 163 107 M 174 118 L 177 113" stroke="#fbbf24" stroke-width="1.6" stroke-linecap="round" opacity="0.8"></path>
        </g>`;
    } else if (s === 2) {
      content = `
        <g id="stage-2-sprout" class="tree-stage-group">
          <ellipse cx="160" cy="148" rx="34" ry="12" fill="url(#pMagicAura)" opacity="0.5"></ellipse>
          <path d="M 160 154 C 154 166 146 177 140 186 M 160 154 C 166 167 174 178 180 186 M 160 154 L 160 188" stroke="url(#pRootGrad)" stroke-width="2" stroke-linecap="round" fill="none"></path>
          <!-- Graceful S-curve tender stem -->
          <path d="M 160 150 C 156 134 165 116 160 96" stroke="url(#pStemGrad)" stroke-width="4.5" stroke-linecap="round" fill="none" filter="url(#pDropShadow)"></path>
          <!-- Left unfurling leaf -->
          <g transform="translate(159, 104) rotate(-8)">
            <path d="M 0 0 C -14 -18 -38 -14 -42 2 C -34 16 -12 14 0 0 Z" fill="url(#pLeafMid)" filter="url(#pDropShadow)"></path>
            <path d="M 0 0 C -14 -6 -28 -5 -38 2" stroke="#a7f3d0" stroke-width="1.3" stroke-linecap="round" fill="none" opacity="0.85"></path>
          </g>
          <!-- Right unfurling leaf -->
          <g transform="translate(161, 98) rotate(6)">
            <path d="M 0 0 C 14 -20 40 -16 44 0 C 36 16 14 14 0 0 Z" fill="url(#pLeafLight)" filter="url(#pDropShadow)"></path>
            <path d="M 0 0 C 15 -7 29 -6 40 0" stroke="#ffffff" stroke-width="1.3" stroke-linecap="round" fill="none" opacity="0.85"></path>
          </g>
          <!-- Center heart bud -->
          <path d="M 160 97 C 155 86 160 78 160 78 C 160 78 165 86 160 97 Z" fill="#6ee7b7"></path>
          <!-- Shimmering morning dewdrop -->
          <circle cx="126" cy="108" r="3" fill="#e0f2fe" filter="url(#pSoftGlow)"></circle>
          <circle cx="125" cy="107" r="1.2" fill="#ffffff"></circle>
          <circle cx="160" cy="73" r="2.5" fill="#fef08a" filter="url(#pSoftGlow)"></circle>
        </g>`;
    } else if (s === 3) {
      content = `
        <g id="stage-3-sapling" class="tree-stage-group">
          <path d="M 160 154 C 150 167 138 178 128 187 M 160 154 C 170 167 182 178 192 187 M 160 156 L 160 189" stroke="url(#pRootGrad)" stroke-width="2.4" stroke-linecap="round" fill="none"></path>
          <!-- Tapered woody young trunk -->
          <path d="M 154 151 C 156 128 158 102 158 72 L 162 72 C 162 102 164 128 166 151 Z" fill="url(#pTrunkGrad)" filter="url(#pDropShadow)"></path>
          <!-- Side shoots -->
          <path d="M 158 118 Q 142 110 132 98" stroke="url(#pTrunkGrad)" stroke-width="3.8" stroke-linecap="round" fill="none"></path>
          <path d="M 162 108 Q 178 100 188 88" stroke="url(#pTrunkGrad)" stroke-width="3.8" stroke-linecap="round" fill="none"></path>
          <!-- Left branch leaf cluster -->
          <g transform="translate(132, 98)">
            <ellipse cx="-8" cy="-4" rx="18" ry="11" transform="rotate(-22 -8 -4)" fill="url(#pLeafDeep)"></ellipse>
            <ellipse cx="2" cy="-9" rx="15" ry="9.5" transform="rotate(-10 2 -9)" fill="url(#pLeafMid)"></ellipse>
            <path d="M 4 2 Q -6 -4 -18 -7" stroke="#6ee7b7" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.7"></path>
          </g>
          <!-- Right branch leaf cluster -->
          <g transform="translate(188, 88)">
            <ellipse cx="8" cy="-4" rx="18" ry="11" transform="rotate(22 8 -4)" fill="url(#pLeafDeep)"></ellipse>
            <ellipse cx="-2" cy="-9" rx="15" ry="9.5" transform="rotate(10 -2 -9)" fill="url(#pLeafLight)"></ellipse>
            <path d="M -4 2 Q 6 -4 18 -7" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.7"></path>
          </g>
          <!-- Top sapling crown -->
          <g transform="translate(160, 68)">
            <ellipse cx="0" cy="0" rx="26" ry="18" fill="url(#pLeafMid)" filter="url(#pDropShadow)"></ellipse>
            <ellipse cx="-8" cy="-5" rx="18" ry="12" fill="url(#pLeafLight)"></ellipse>
            <ellipse cx="10" cy="-3" rx="16" ry="11" fill="url(#pLeafLight)" opacity="0.9"></ellipse>
            <circle cx="0" cy="-22" r="2.8" fill="#fef08a" filter="url(#pSoftGlow)"></circle>
          </g>
        </g>`;
    } else if (s === 4) {
      content = `
        <g id="stage-4-branching" class="tree-stage-group">
          <path d="M 160 154 C 146 168 130 179 118 188 M 160 154 C 174 168 190 179 202 188 M 155 158 C 152 172 148 182 144 189 M 165 158 C 168 172 172 182 176 189" stroke="url(#pRootGrad)" stroke-width="2.6" stroke-linecap="round" fill="none"></path>
          <!-- Back shadow foliage -->
          <ellipse cx="118" cy="84" rx="26" ry="19" fill="url(#pLeafDeep)"></ellipse>
          <ellipse cx="202" cy="82" rx="26" ry="19" fill="url(#pLeafDeep)"></ellipse>
          <ellipse cx="160" cy="58" rx="34" ry="24" fill="url(#pLeafDeep)"></ellipse>
          <!-- Sculpted Organic Trunk & 3 Boughs -->
          <path d="M 151 151 C 153 128 155 108 156 92 L 164 92 C 165 108 167 128 169 151 Z" fill="url(#pTrunkGrad)" filter="url(#pDropShadow)"></path>
          <path d="M 158 104 C 144 96 128 88 114 78" stroke="url(#pTrunkGrad)" stroke-width="5.5" stroke-linecap="round" fill="none"></path>
          <path d="M 162 102 C 176 94 192 86 206 76" stroke="url(#pTrunkGrad)" stroke-width="5.5" stroke-linecap="round" fill="none"></path>
          <path d="M 160 96 L 160 58" stroke="url(#pTrunkGrad)" stroke-width="5" stroke-linecap="round" fill="none"></path>
          <!-- Mid & Highlight Foliage Clouds -->
          <ellipse cx="112" cy="78" rx="24" ry="17" fill="url(#pLeafMid)" filter="url(#pDropShadow)"></ellipse>
          <ellipse cx="120" cy="72" rx="17" ry="12" fill="url(#pLeafLight)"></ellipse>
          <ellipse cx="208" cy="76" rx="24" ry="17" fill="url(#pLeafMid)" filter="url(#pDropShadow)"></ellipse>
          <ellipse cx="200" cy="70" rx="17" ry="12" fill="url(#pLeafLight)"></ellipse>
          <ellipse cx="160" cy="54" rx="32" ry="22" fill="url(#pLeafMid)" filter="url(#pDropShadow)"></ellipse>
          <ellipse cx="154" cy="47" rx="22" ry="15" fill="url(#pLeafLight)"></ellipse>
          <ellipse cx="170" cy="49" rx="18" ry="12" fill="#a7f3d0" opacity="0.75"></ellipse>
          <!-- Subtle blossom buds -->
          <circle cx="102" cy="72" r="3" fill="#fbcfe8"></circle>
          <circle cx="216" cy="70" r="3" fill="#fbcfe8"></circle>
          <circle cx="160" cy="36" r="3.5" fill="#fef08a" filter="url(#pSoftGlow)"></circle>
        </g>`;
    } else if (s === 5) {
      content = `
        <g id="stage-5-canopy" class="tree-stage-group">
          <path d="M 160 154 C 142 169 124 180 110 189 M 160 154 C 178 169 196 180 210 189 M 152 158 C 147 173 141 183 136 190 M 168 158 C 173 173 179 183 184 190" stroke="url(#pRootGrad)" stroke-width="2.8" stroke-linecap="round" fill="none"></path>
          <!-- Deep Background Canopy Silhouette -->
          <ellipse cx="160" cy="64" rx="68" ry="42" fill="url(#pLeafDeep)" filter="url(#pDropShadow)"></ellipse>
          <ellipse cx="106" cy="76" rx="34" ry="25" fill="url(#pLeafDeep)"></ellipse>
          <ellipse cx="214" cy="74" rx="34" ry="25" fill="url(#pLeafDeep)"></ellipse>
          <!-- Sturdy Flared Trunk & Branches (peeking through canopy) -->
          <path d="M 147 152 C 151 128 154 106 155 86 L 165 86 C 166 106 169 128 173 152 Z" fill="url(#pTrunkGrad)" filter="url(#pDropShadow)"></path>
          <path d="M 156 146 L 158 105" stroke="#b45309" stroke-width="1.5" stroke-linecap="round" opacity="0.5"></path>
          <path d="M 157 98 C 138 88 120 78 104 68" stroke="url(#pTrunkGrad)" stroke-width="6.5" stroke-linecap="round" fill="none"></path>
          <path d="M 163 96 C 182 86 200 76 216 66" stroke="url(#pTrunkGrad)" stroke-width="6.5" stroke-linecap="round" fill="none"></path>
          <path d="M 160 90 L 160 48" stroke="url(#pTrunkGrad)" stroke-width="5.5" stroke-linecap="round" fill="none"></path>
          <!-- Lush Mid Canopy Volumes -->
          <ellipse cx="108" cy="70" rx="32" ry="23" fill="url(#pLeafMid)"></ellipse>
          <ellipse cx="212" cy="68" rx="32" ry="23" fill="url(#pLeafMid)"></ellipse>
          <ellipse cx="160" cy="52" rx="44" ry="30" fill="url(#pLeafMid)"></ellipse>
          <ellipse cx="134" cy="74" rx="28" ry="20" fill="url(#pLeafMid)"></ellipse>
          <ellipse cx="186" cy="72" rx="28" ry="20" fill="url(#pLeafMid)"></ellipse>
          <!-- Sunlit Top Canopy Billows -->
          <ellipse cx="136" cy="46" rx="26" ry="18" fill="url(#pLeafLight)"></ellipse>
          <ellipse cx="184" cy="45" rx="26" ry="18" fill="url(#pLeafLight)"></ellipse>
          <ellipse cx="104" cy="62" rx="20" ry="14" fill="url(#pLeafLight)"></ellipse>
          <ellipse cx="216" cy="60" rx="20" ry="14" fill="url(#pLeafLight)"></ellipse>
          <ellipse cx="160" cy="36" rx="24" ry="16" fill="#a7f3d0"></ellipse>
          <!-- Fragrant White-Pink Blossoms -->
          <g transform="translate(114, 56)"><circle cx="0" cy="0" r="4.5" fill="#fdf2f8"/><circle cx="0" cy="0" r="2" fill="#f472b6"/></g>
          <g transform="translate(148, 36)"><circle cx="0" cy="0" r="5" fill="#fdf2f8"/><circle cx="0" cy="0" r="2.2" fill="#fbbf24"/></g>
          <g transform="translate(196, 52)"><circle cx="0" cy="0" r="4.5" fill="#fdf2f8"/><circle cx="0" cy="0" r="2" fill="#f472b6"/></g>
          <g transform="translate(168, 66)"><circle cx="0" cy="0" r="4" fill="#fdf2f8"/><circle cx="0" cy="0" r="1.8" fill="#fbbf24"/></g>
        </g>`;
    } else {
      content = `
        <g id="stage-6-harvest" class="tree-stage-group">
          <!-- Radiant Golden Mastery Halo behind crown -->
          <circle cx="160" cy="58" r="76" fill="url(#pMagicAura)" opacity="0.75"></circle>
          <path d="M 160 154 C 138 170 118 181 104 190 M 160 154 C 182 170 202 181 216 190 M 150 158 C 144 174 138 184 132 190 M 170 158 C 176 174 182 184 188 190" stroke="url(#pRootGrad)" stroke-width="3" stroke-linecap="round" fill="none"></path>
          <!-- Majestic Deep Crown -->
          <ellipse cx="160" cy="62" rx="74" ry="45" fill="url(#pLeafDeep)" filter="url(#pDropShadow)"></ellipse>
          <ellipse cx="100" cy="74" rx="36" ry="26" fill="url(#pLeafDeep)"></ellipse>
          <ellipse cx="220" cy="72" rx="36" ry="26" fill="url(#pLeafDeep)"></ellipse>
          <!-- Ancient Strong Trunk & Boughs -->
          <path d="M 144 152 C 149 126 153 104 154 84 L 166 84 C 167 104 171 126 176 152 Z" fill="url(#pTrunkGrad)" filter="url(#pDropShadow)"></path>
          <path d="M 155 146 C 157 128 158 112 158 95" stroke="#d97706" stroke-width="1.8" stroke-linecap="round" opacity="0.55" fill="none"></path>
          <path d="M 156 96 C 134 86 114 75 96 64" stroke="url(#pTrunkGrad)" stroke-width="7" stroke-linecap="round" fill="none"></path>
          <path d="M 164 94 C 186 84 206 73 224 62" stroke="url(#pTrunkGrad)" stroke-width="7" stroke-linecap="round" fill="none"></path>
          <path d="M 160 88 L 160 44" stroke="url(#pTrunkGrad)" stroke-width="6" stroke-linecap="round" fill="none"></path>
          <!-- Layered Lush Emerald & Mint Canopy -->
          <ellipse cx="102" cy="68" rx="34" ry="24" fill="url(#pLeafMid)"></ellipse>
          <ellipse cx="218" cy="66" rx="34" ry="24" fill="url(#pLeafMid)"></ellipse>
          <ellipse cx="160" cy="48" rx="48" ry="32" fill="url(#pLeafMid)"></ellipse>
          <ellipse cx="132" cy="72" rx="30" ry="22" fill="url(#pLeafMid)"></ellipse>
          <ellipse cx="188" cy="70" rx="30" ry="22" fill="url(#pLeafMid)"></ellipse>
          <ellipse cx="132" cy="42" rx="28" ry="19" fill="url(#pLeafLight)"></ellipse>
          <ellipse cx="188" cy="41" rx="28" ry="19" fill="url(#pLeafLight)"></ellipse>
          <ellipse cx="98" cy="58" rx="22" ry="15" fill="url(#pLeafLight)"></ellipse>
          <ellipse cx="222" cy="56" rx="22" ry="15" fill="url(#pLeafLight)"></ellipse>
          <ellipse cx="160" cy="32" rx="26" ry="17" fill="#a7f3d0"></ellipse>
          <!-- 6 Jewels of Harvest (Golden & Ruby Botanical Fruits with Leaflets) -->
          <g transform="translate(94, 68)" filter="url(#pDropShadow)">
            <circle cx="0" cy="0" r="6.5" fill="url(#pGoldFruitGrad)"/><circle cx="-2" cy="-2" r="2" fill="#ffffff" opacity="0.9"/>
          </g>
          <g transform="translate(120, 44)" filter="url(#pDropShadow)">
            <circle cx="0" cy="0" r="7" fill="url(#pRubyFruitGrad)"/><circle cx="-2" cy="-2" r="2.2" fill="#ffffff" opacity="0.9"/>
          </g>
          <g transform="translate(160, 24)" filter="url(#pDropShadow)">
            <circle cx="0" cy="0" r="8" fill="url(#pGoldFruitGrad)"/><circle cx="-2.4" cy="-2.4" r="2.5" fill="#ffffff" opacity="0.95"/>
            <path d="M 0 -15 L 2 -10 L 7 -10 L 3 -7 L 4.5 -2 L 0 -5 L -4.5 -2 L -3 -7 L -7 -10 L -2 -10 Z" fill="#fbbf24"/>
          </g>
          <g transform="translate(200, 42)" filter="url(#pDropShadow)">
            <circle cx="0" cy="0" r="7" fill="url(#pRubyFruitGrad)"/><circle cx="-2" cy="-2" r="2.2" fill="#ffffff" opacity="0.9"/>
          </g>
          <g transform="translate(226, 66)" filter="url(#pDropShadow)">
            <circle cx="0" cy="0" r="6.5" fill="url(#pGoldFruitGrad)"/><circle cx="-2" cy="-2" r="2" fill="#ffffff" opacity="0.9"/>
          </g>
          <g transform="translate(160, 66)" filter="url(#pDropShadow)">
            <circle cx="0" cy="0" r="7.5" fill="url(#pRubyFruitGrad)"/><circle cx="-2.2" cy="-2.2" r="2.2" fill="#ffffff" opacity="0.9"/>
          </g>
          <!-- Celebratory Fireflies -->
          <circle cx="84" cy="36" r="2" fill="#fbbf24" filter="url(#pSoftGlow)"></circle>
          <circle cx="236" cy="34" r="2" fill="#fbbf24" filter="url(#pSoftGlow)"></circle>
          <circle cx="128" cy="16" r="1.8" fill="#fde047"></circle>
          <circle cx="192" cy="16" r="1.8" fill="#fde047"></circle>
        </g>`;
    }

    return `<svg viewBox="0 0 320 205" fill="none" class="growth-tree-svg" aria-hidden="true">
      <defs>
        <linearGradient id="pSkyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ecfdf5"/>
          <stop offset="55%" stop-color="#f8fafc"/>
          <stop offset="100%" stop-color="#ffffff"/>
        </linearGradient>
        <radialGradient id="pSunGlow" cx="50%" cy="28%" r="58%">
          <stop offset="0%" stop-color="#fef3c7" stop-opacity="0.9"/>
          <stop offset="45%" stop-color="#d1fae5" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="pMagicAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fde68a" stop-opacity="0.75"/>
          <stop offset="55%" stop-color="#6ee7b7" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="pHillBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#d1fae5" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#ecfdf5" stop-opacity="0.1"/>
        </linearGradient>
        <linearGradient id="pLeafDeep" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#059669"/>
          <stop offset="100%" stop-color="#064e3b"/>
        </linearGradient>
        <linearGradient id="pLeafMid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#34d399"/>
          <stop offset="100%" stop-color="#059669"/>
        </linearGradient>
        <linearGradient id="pLeafLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#a7f3d0"/>
          <stop offset="100%" stop-color="#10b981"/>
        </linearGradient>
        <linearGradient id="pStemGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#34d399"/>
          <stop offset="100%" stop-color="#059669"/>
        </linearGradient>
        <linearGradient id="pTrunkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#b45309"/>
          <stop offset="45%" stop-color="#78350f"/>
          <stop offset="100%" stop-color="#451a03"/>
        </linearGradient>
        <linearGradient id="pRootGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#6ee7b7" stop-opacity="0.85"/>
          <stop offset="100%" stop-color="#34d399" stop-opacity="0.15"/>
        </linearGradient>
        <linearGradient id="pPotBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="55%" stop-color="#f5f3ff"/>
          <stop offset="100%" stop-color="#e9d5ff"/>
        </linearGradient>
        <linearGradient id="pPotRim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="50%" stop-color="#faf5ff"/>
          <stop offset="100%" stop-color="#ede9fe"/>
        </linearGradient>
        <linearGradient id="pSoilGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#6c4731"/>
          <stop offset="100%" stop-color="#361f12"/>
        </linearGradient>
        <radialGradient id="pSeedGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="45%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#92400e"/>
        </radialGradient>
        <radialGradient id="pGoldFruitGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#fffbeb"/>
          <stop offset="35%" stop-color="#fde047"/>
          <stop offset="75%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#b45309"/>
        </radialGradient>
        <radialGradient id="pRubyFruitGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#ffe4e6"/>
          <stop offset="35%" stop-color="#fb7185"/>
          <stop offset="80%" stop-color="#e11d48"/>
          <stop offset="100%" stop-color="#881337"/>
        </radialGradient>
        <filter id="pSoftGlow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="3.5" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
        <filter id="pDropShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#064e3b" flood-opacity="0.14"/>
        </filter>
      </defs>

      <!-- Sanctuary Sky & Sunbeams -->
      <rect width="320" height="205" rx="18" fill="url(#pSkyGrad)"/>
      <circle cx="160" cy="58" r="88" fill="url(#pSunGlow)"/>
      <!-- Soft distant botanical hills -->
      <path d="M 0 155 Q 75 132 165 148 T 320 142 L 320 205 L 0 205 Z" fill="url(#pHillBack)"/>
      <path d="M 0 166 Q 110 146 215 158 T 320 154 L 320 205 L 0 205 Z" fill="#d1fae5" opacity="0.35"/>

      <!-- Floating light spores -->
      <g class="tree-dust-particles" opacity="0.75">
        <circle cx="56" cy="52" r="2" fill="#34d399"/>
        <circle cx="262" cy="46" r="1.8" fill="#fbbf24"/>
        <circle cx="78" cy="96" r="2.2" fill="#6ee7b7"/>
        <circle cx="244" cy="88" r="2.2" fill="#34d399"/>
        <circle cx="118" cy="30" r="1.5" fill="#fbbf24"/>
        <circle cx="204" cy="28" r="1.5" fill="#a7f3d0"/>
      </g>

      <!-- Artisan Terrarium Ceramic Planter -->
      <g id="pot-group">
        <ellipse cx="160" cy="193" rx="84" ry="7.5" fill="#1e1b2e" opacity="0.09"/>
        <!-- Planter Lower Base -->
        <path d="M 92 153 L 105 184 C 107.5 189 113 192 120 192 L 200 192 C 207 192 212.5 189 215 184 L 228 153 Z" fill="url(#pPotBody)" stroke="#d8b4fe" stroke-width="1.4"/>
        <!-- Decorative Gold & Lavender Inlay Band -->
        <path d="M 99 169 Q 160 175 221 169" stroke="#ddd6fe" stroke-width="2" fill="none"/>
        <path d="M 102 175 Q 160 181 218 175" stroke="#fde68a" stroke-width="1.2" fill="none" opacity="0.8"/>
        <!-- Planter Lip / Rim -->
        <rect x="86" y="145" width="148" height="10" rx="5" fill="url(#pPotRim)" stroke="#d8b4fe" stroke-width="1.4"/>
        <!-- Rich Soil Bed & Moss Cushions -->
        <path d="M 92 150 Q 160 141 228 150 Q 160 158 92 150 Z" fill="url(#pSoilGrad)"/>
        <ellipse cx="116" cy="150" rx="14" ry="3.5" fill="#10b981" opacity="0.55"/>
        <ellipse cx="202" cy="151" rx="16" ry="3.5" fill="#059669" opacity="0.5"/>
        <circle cx="142" cy="151" r="1.3" fill="#d6d3d1" opacity="0.6"/>
        <circle cx="178" cy="149" r="1.5" fill="#fde68a" opacity="0.5"/>
      </g>

      <!-- Stage Botanical Growth -->
      <g class="tree-anim-fade-in">${content}</g>
    </svg>`;
  }

  function viewToday() {
    const p = plan();
    const pending = p.blocks.find((b) => b.status === 'PENDING');
    const settled = p.blocks.filter((b) => b.status !== 'PENDING').length;
    const t = p.trace;
    const isResume = (b) => b.type === 'RESUME' || (S.inProgress && b.route === `#/run/lesson/${S.inProgress.id}`);
    const cta = (b) => b.type === 'BREAK' ? 'Đã nghỉ xong' : b.type === 'FINISH' ? 'Khép lại ngày' : isResume(b) ? 'Tiếp tục' : 'Bắt đầu';
    const next = pending ? `
      <section class="card feature next-card" aria-labelledby="next-title">
        <div class="kicker">Việc tiếp theo</div>
        <h2 id="next-title">${esc(pending.title)}</h2>
        <p>${esc(pending.reason)}</p>
        <div class="next-meta"><span class="chip">${TYPE[pending.type].icon} ${TYPE[pending.type].label}</span><span class="chip">⏱ ~${pending.minutes} phút</span></div>
        <button class="btn primary" data-act="block-go" data-id="${pending.id}" id="next-action-btn">${cta(pending)} <span class="arrow">→</span></button>
        <details><summary>Vì sao hệ thống chọn việc này?</summary><ul>
          <li>Thời lượng hôm nay: ${t.mode === 'short' ? 'ngày ngắn (~15 phút)' : 'phiên thường'}</li>
          <li>Bài đang làm dở: ${t.inProgress ? 'có — ưu tiên tiếp tục' : 'không'}</li>
          <li>Bài ôn đến hạn: ${t.due}${t.deferredReviews ? ` (${t.deferredReviews} để sang ngày khác, không dồn lại)` : ''}</li>
          <li>Nghi có khó khăn: ${t.suspected ? esc(D.claims[t.suspected].name) + ' — cần kiểm tra trước khi kết luận' : 'không'}</li>
          <li>Vị trí trong tuần: Ngày ${Math.min(t.weekDay, 7)}</li>
          <li>Chính sách: ${t.policy}</li></ul></details>
      </section>` : `
      <section class="card feature next-card"><div class="kicker">Hôm nay</div><h2>Xong việc hôm nay rồi 🌙</h2><p>Bạn có thể dừng ở đây, hoặc mở Lộ trình để khám phá thêm. Khám phá thêm không bắt buộc.</p>
        <a class="btn primary" href="#/roadmap" id="explore-btn">Mở Lộ trình <span class="arrow">→</span></a></section>`;

    const statusText = { PENDING: 'Chưa làm', COMPLETED: 'Đã xong', SKIPPED: 'Đã bỏ qua', DEFERRED: 'Để sau' };
    const items = p.blocks.map((b) => {
      const cur = pending && b.id === pending.id;
      const ty = TYPE[b.type];
      const canAdjust = b.status === 'PENDING' && !['BREAK', 'FINISH'].includes(b.type);
      return `<li class="plan-item ${cur ? 'current' : ''} ${b.status !== 'PENDING' ? 'done' : ''}">
        <span class="plan-ico" style="background:var(--mood-${ty.mood})" aria-hidden="true">${ty.icon}</span>
        <div><h3>${esc(b.title)}</h3><p>${ty.label} · ~${b.minutes} phút${cur ? ' · <strong>tiếp theo</strong>' : ''}</p></div>
        <div class="plan-actions">
          ${b.status === 'PENDING' ? `${canAdjust ? `<button class="btn ghost sm" data-act="block-skip" data-id="${b.id}" aria-label="Bỏ qua: ${esc(b.title)}">Bỏ qua</button><button class="btn ghost sm" data-act="block-defer" data-id="${b.id}" aria-label="Để sau: ${esc(b.title)}">Để sau</button>` : ''}<button class="btn soft sm" data-act="block-go" data-id="${b.id}">${cta(b)}</button>` : `<span class="status ${b.status.toLowerCase()}">${statusText[b.status]}</span>`}
        </div></li>`;
    }).join('');

    const strip = D.days.map((d) => {
      const done = S.completedDays.includes(d.n);
      const cur = !done && nextLessonDay()?.n === d.n;
      const rec = S.check?.recommended > 1 && d.n < S.check.recommended && !done;
      return `<a href="#/run/lesson/${d.n}" class="${done ? 'done' : ''} ${cur ? 'current' : ''} ${rec ? 'skipped-rec' : ''}" aria-label="Ngày ${d.n}: ${esc(d.title)}${done ? ', đã xong' : cur ? ', hôm nay' : ''}"><strong>${d.n}</strong>${done ? '✓' : cur ? 'Hôm nay' : 'Ngày'}</a>`;
    }).join('');

    const wb = S.welcomeBack ? `<section class="card welcome-back" aria-live="polite">${mascot()}<div><h2>Chào mừng bạn quay lại!</h2>
      <p style="margin:0">Bạn đã nghỉ ${S.welcomeBack} ngày — không sao cả. Hôm nay mình bắt đầu bằng <strong>ngày ngắn</strong>: ôn nhẹ rồi tiếp tục từ chỗ cũ. Không có bài nào bị dồn lại, và không có gì bị tính là thất bại.</p></div></section>` : '';

    const stages = [
      { id: 1, name: 'Hạt giống', dayTag: 'Ngày 1', icon: '🌱', kicker: 'NGÀY 1 · KHỞI ĐẦU TỰ TIN', focus: 'Gieo mầm 4 trụ cột thông tin cá nhân', desc: 'Làm quen bạn đồng hành Linh, nhận diện cấu trúc Tên - Tuổi - Quốc gia - Nghề nghiệp.' },
      { id: 2, name: 'Nảy mầm', dayTag: 'Ngày 2', icon: '🌿', kicker: 'NGÀY 2 · MẢNH GHÉP CĂN BẢN', focus: 'Grammar Pieces: Động từ To Be & Dạng rút gọn', desc: 'Hiểu sâu cách gắn kết chủ ngữ với am / are / is, nhận diện các dạng viết tắt I\'m, you\'re, he\'s.' },
      { id: 3, name: 'Thân cành', dayTag: 'Ngày 3', icon: '🪵', kicker: 'NGÀY 3 · NGHE & ĐỌC QUÉT', focus: 'Đánh vần tên quốc tế & Đọc lướt hồ sơ', desc: 'Lắng nghe Mai đánh vần tên và đọc quét thẻ hồ sơ quốc tế của Tom Baker.' },
      { id: 4, name: 'Phân nhánh', dayTag: 'Ngày 4', icon: '🪴', kicker: 'NGÀY 4 · TƯƠNG TÁC HAI CHIỀU', focus: 'Làm chủ 3 câu hỏi Wh- & Câu hỏi đảo Yes/No', desc: 'Phản xạ hỏi đáp với What / Where / Who và ngữ điệu câu hỏi Yes/No tự nhiên.' },
      { id: 5, name: 'Ra lá', dayTag: 'Ngày 5', icon: '🍃', kicker: 'NGÀY 5 · HIỆN THỰC HOÁ KẾT QUẢ', focus: 'Tự viết profile & Thu âm giọng nói đầu tiên', desc: 'Tự tay viết 3-5 câu giới thiệu bản thân và ghi âm giọng nói tiếng Anh đầu tiên làm kỷ niệm.' },
      { id: 6, name: 'Kết trái', dayTag: 'Ngày 6–7', icon: '🍎', kicker: 'NGÀY 6 & 7 · CHUYỂN GIAO & HOÀN THÀNH', focus: 'Chuyển giao tình huống thực tế & Thu hoạch Tuần 1', desc: 'Tự tin nhắn tin làm quen Carlos và giới thiệu đồng nghiệp. Hoàn thiện toàn bộ Tuần 1.' }
    ];
    const completedCount = S.completedDays.length;
    const naturalStageIdx = Math.min(5, Math.max(0, Math.floor((completedCount / 7) * 6)));
    const activeStageIdx = protoInspectedStage !== null ? protoInspectedStage - 1 : naturalStageIdx;
    const curStage = stages[activeStageIdx] || stages[0];
    const isPreviewing = protoInspectedStage !== null && protoInspectedStage !== (naturalStageIdx + 1);
    const nutrientPercent = Math.min(100, Math.max(8, (completedCount / 7) * 100));

    const treeCard = `
      <section class="card growth-tree-card-v2" aria-label="Cây tiến độ học tập">
        <div class="growth-tree-header">
          <div>
            <div class="growth-tree-kicker-row">
              <span class="growth-tree-dot" aria-hidden="true"></span>
              <p class="growth-tree-kicker">CÂY TIẾN ĐỘ · KHU VƯỜN TRI THỨC</p>
            </div>
            <h2 class="growth-tree-title">Hành trình gieo mầm Tuần 1</h2>
          </div>
          <div class="growth-tree-header-badge">
            <span class="growth-stage-pill"><span class="growth-stage-pill-ico">${curStage.icon}</span> GĐ ${curStage.id}: ${esc(curStage.name)}</span>
          </div>
        </div>

        <div class="growth-tree-visual-container">
          <div class="growth-tree-stage-ribbon">
            <span class="ribbon-stage-num">Mốc 0${curStage.id}/06</span>
            <span class="ribbon-stage-state ${activeStageIdx < naturalStageIdx ? 'done' : activeStageIdx === naturalStageIdx ? 'current' : 'preview'}">
              ${activeStageIdx < naturalStageIdx ? '✓ Đã đạt được' : activeStageIdx === naturalStageIdx ? '● Đang nuôi dưỡng' : '👁 Xem trước cột mốc'}
            </span>
          </div>
          <div class="growth-tree-illustration-shell">${renderTreeSvg(curStage.id)}</div>
          <div class="growth-tree-caption-overlay">
            <div class="growth-tree-caption-top">
              <span class="growth-tree-caption-tag">${esc(curStage.kicker)}</span>
            </div>
            <h3 class="growth-tree-caption-focus">${esc(curStage.focus)}</h3>
            <p class="growth-tree-caption-desc">${esc(curStage.desc)}</p>
          </div>
        </div>

        <div class="growth-tree-nutrient-bar-wrap">
          <div class="growth-tree-nutrient-info">
            <span class="growth-tree-nutrient-label">
              <span class="water-drop-icon" aria-hidden="true">💧</span> Dưỡng chất tích luỹ: <strong>${completedCount}/7 ngày</strong>
            </span>
            <span class="growth-tree-nutrient-status">${completedCount >= 7 ? 'Trái chín mọng 🌟' : naturalStageIdx === 0 ? 'Mới gieo mầm 🌱' : `GĐ ${naturalStageIdx + 1} đang vươn lên`}</span>
          </div>
          <div class="growth-tree-track-rail" role="progressbar" aria-valuenow="${completedCount}" aria-valuemin="0" aria-valuemax="7" aria-label="Dưỡng chất tích luỹ theo ngày">
            <div class="growth-tree-track-fill" style="width:${nutrientPercent}%"></div>
            <div class="growth-tree-track-ticks" aria-hidden="true">
              ${[1, 2, 3, 4, 5, 6, 7].map((d) => `<span class="track-tick ${completedCount >= d ? 'filled' : ''}"></span>`).join('')}
            </div>
          </div>
        </div>

        <div class="growth-tree-steps-container">
          <div class="growth-tree-steps-header">
            <span class="steps-header-title">6 CỘT MỐC PHÁT TRIỂN · <small>Chạm để xem chi tiết</small></span>
            ${isPreviewing ? `<button type="button" class="growth-tree-back-current" data-act="reset-tree-stage">Quay lại mốc hiện tại ↩</button>` : ''}
          </div>
          <ol class="growth-tree-step-pills" role="list">
            ${stages.map((st, i) => {
              const isDone = i < naturalStageIdx;
              const isCurrent = i === naturalStageIdx;
              const isSelected = i === activeStageIdx;
              const stateText = isDone ? 'Đã mở' : isCurrent ? 'Hiện tại' : st.dayTag;
              return `<li class="growth-tree-step-pill-wrapper">
                <button type="button" class="growth-tree-step-btn ${isDone ? 'is-done' : ''} ${isCurrent ? 'is-current' : ''} ${isSelected ? 'is-selected' : ''}" data-act="inspect-tree-stage" data-stage="${st.id}" aria-pressed="${isSelected}" title="Mốc ${st.id}: ${esc(st.name)} (${esc(st.dayTag)})">
                  <span class="step-btn-top">
                    <span class="step-btn-badge">${isDone ? '✓' : `0${st.id}`}</span>
                    <span class="step-btn-icon" aria-hidden="true">${st.icon}</span>
                  </span>
                  <span class="step-btn-name">${esc(st.name)}</span>
                  <span class="step-btn-sub">${esc(stateText)}</span>
                </button>
              </li>`;
            }).join('')}
          </ol>
        </div>

        <p class="growth-tree-footnote">
          <span aria-hidden="true">🌿</span> Cây lớn dần theo nhịp học đều đặn của bạn. Dù nghỉ vài hôm cây vẫn đợi bạn tưới nước, không héo tàn hay phạt điểm.
        </p>
      </section>`;

    return `<div class="view stack">
      ${wb}
      <div class="today-head"><div><div class="kicker">Ngày ${S.simDay} · Tuần 1</div><h1>Hôm nay mình học gì nhé?</h1>
        <p class="muted" style="margin:0">Một việc rõ ràng mỗi lần. Bạn luôn có quyền điều chỉnh.</p></div>
        <span class="spacer"></span>
        <div class="mode-switch" role="group" aria-label="Thời lượng hôm nay">
          <button data-act="mode" data-mode="short" aria-pressed="${S.mode === 'short'}" id="mode-short">Ngày ngắn · 15′</button>
          <button data-act="mode" data-mode="normal" aria-pressed="${S.mode === 'normal'}" id="mode-normal">Phiên thường · ${S.minutes >= 60 ? 60 : 30}′</button>
        </div></div>
      <div class="today-grid">
        <div class="stack">${next}
          <section class="card" aria-labelledby="plan-title"><div class="row" style="margin-bottom:12px"><h2 id="plan-title" style="margin:0">Kế hoạch hôm nay</h2><span class="spacer"></span><span class="muted small">${settled}/${p.blocks.length} bước đã xử lý</span></div>
            <ol class="plan-list">${items}</ol>
            <p class="muted small" style="margin:14px 0 0">Bỏ qua hay để sau là lựa chọn sắp xếp thời gian, không phải thất bại. Hoàn thành một bước không có nghĩa là đã thành thạo.</p></section>
          <section class="card today-curriculum-overview">
            <div class="row" style="justify-content:space-between;align-items:center;margin-bottom:10px">
              <div>
                <div class="kicker" style="margin-bottom:2px">BỨC TRANH TOÀN CẢNH TUẦN 1</div>
                <h2 style="margin:0;font-size:1.18rem">Lộ trình 3 Chặng · Chọn học bất kỳ ngày nào</h2>
              </div>
              <a href="#/roadmap" class="btn soft sm">Xem chi tiết 3 Chặng →</a>
            </div>
            <div class="today-stage-mini-grid">
              <a href="#/run/lesson/1" class="today-stage-mini-card">
                <span class="mini-stg-tag">CHẶNG 1 · NGÀY 1–2</span>
                <strong>Khẩu hình IPA &amp; To Be</strong>
                <span>5 nguyên âm cốt lõi + Đại từ &amp; To Be 3 thể (+/-/?)</span>
              </a>
              <a href="#/run/lesson/3" class="today-stage-mini-card">
                <span class="mini-stg-tag">CHẶNG 2 · NGÀY 3–4</span>
                <strong>Đánh vần Tên &amp; Hỏi Đáp</strong>
                <span>Bảng chữ cái A–Z IPA + Câu hỏi Wh- &amp; Yes/No</span>
              </a>
              <a href="#/run/lesson/5" class="today-stage-mini-card">
                <span class="mini-stg-tag">CHẶNG 3 · NGÀY 5–7</span>
                <strong>Viết, Nói &amp; Chuyển giao</strong>
                <span>Xưởng viết 5 câu, Phòng thu 30s &amp; Tin nhắn quốc tế</span>
              </a>
            </div>
          </section>
        </div>
        <aside class="stack">
          ${treeCard}
          <section class="card"><h3>Tuần 1 · Me &amp; My English</h3><p class="muted small">Mục tiêu: giới thiệu bản thân và hiểu một lời giới thiệu đơn giản.</p><div class="week-strip">${strip}</div></section>
          <section class="card"><div class="row"><h3 style="margin:0">Tín hiệu học tập</h3><span class="spacer"></span><a href="#/progress" class="small">Chi tiết</a></div>
            <ul class="ev-list" style="margin-top:12px">${Object.entries(D.claims).map(([k, c]) => `<li style="justify-content:space-between;align-items:center"><span>${c.icon} ${esc(c.name)}</span>${stateChip(k)}</li>`).join('')}</ul></section>
          ${!S.check ? `<section class="card"><h3>Kiểm tra đầu vào</h3><p class="muted small">Tuỳ chọn, 5 câu. Giúp gợi ý chỗ bắt đầu.</p><a class="btn soft sm" href="#/check" id="open-check">Mở bài kiểm tra</a></section>` : ''}
        </aside>
      </div></div>`;
  }

  function viewRoadmap() {
    const weeks = [
      ['1', 'Me & My English', 'Giới thiệu bản thân & Phản xạ thông tin cá nhân'],
      ['2', 'My Daily Life', 'Kể về thói quen hằng ngày (Simple Present)'],
      ['3', 'People Around Me', 'Mô tả gia đình, bạn bè & đồng nghiệp'],
      ['4', 'Needs & Integration', 'Thử thách thực chiến “Gặp bạn học mới”']
    ];
    const stageMeta = [
      {
        id: 'stage-1',
        badge: 'CHẶNG 1 · NGÀY 1–2',
        title: 'Nền tảng Ngữ âm IPA, Đại từ Nhân xưng & Động từ To Be',
        desc: 'Làm chủ khẩu hình 5 nguyên âm cốt lõi, đánh vần từ vựng 100% có IPA và nắm trọn cấu trúc To Be (Khẳng định · Phủ định · Nghi vấn).',
        days: [1, 2]
      },
      {
        id: 'stage-2',
        badge: 'CHẶNG 2 · NGÀY 3–4',
        title: 'Đánh vần Tên Riêng, Phản xạ Hỏi - Đáp Wh-/Yes-No & Nghe - Đọc Thực chiến',
        desc: 'Phân biệt các cặp chữ cái dễ nhầm (E/I, G/J), nghe hiểu lần đầu độc lập và phản xạ 3 câu hỏi kinh điển với ngữ điệu lên/xuống chuẩn.',
        days: [3, 4]
      },
      {
        id: 'stage-3',
        badge: 'CHẶNG 3 · NGÀY 5–7',
        title: 'Thực hành Sản sinh (Viết & Nói), Chuyển giao Bối cảnh Mới & Tuần hoàn',
        desc: 'Tự viết đoạn giới thiệu 5 câu, thu âm 20–30 giây, đọc hiểu tin nhắn Slack quốc tế và củng cố trí nhớ ngắt quãng.',
        days: [5, 6, 7]
      }
    ];
    const renderDayCard = (d) => {
      const done = S.completedDays.includes(d.n);
      const ip = S.inProgress?.kind === 'lesson' && S.inProgress.id === d.n;
      const cur = !done && nextLessonDay()?.n === d.n;
      const status = ip
        ? '<span class="status">Đang làm dở</span>'
        : done
          ? `<span class="status done">${S.partialDays.includes(d.n) ? 'Xong phần cốt lõi' : S.restDays.includes(d.n) ? 'Đã nghỉ' : 'Đã xong'}</span>`
          : cur
            ? '<span class="status" style="background:var(--primary-soft);color:var(--primary-strong)">Tiếp theo</span>'
            : '';
      const keyPointsHtml = Array.isArray(d.keyPoints) && d.keyPoints.length
        ? `<div class="road-keypoints">${d.keyPoints.map((kp) => `<span class="road-kp-tag">✓ ${esc(kp)}</span>`).join('')}</div>`
        : '';
      return `<article class="card road-day ${cur ? 'current' : ''}">
        <span class="road-num" style="background:var(--mood-${d.mood})">${d.n}</span>
        <div>
          <div class="row" style="gap:8px"><h3 style="margin:0">Ngày ${d.n}: ${esc(d.title)}</h3>${status}</div>
          <p class="muted small" style="margin:4px 0 8px">${esc(d.intent)} · ~${d.minutes} phút · <b>${d.steps.length} học phần</b></p>
          ${keyPointsHtml}
          <div style="margin-top:8px"><span class="chip ${d.mood}">${esc(d.posture)}</span></div>
        </div>
        <a class="btn ${cur || ip ? 'primary' : ''} sm" href="#/run/lesson/${d.n}" id="open-day-${d.n}">${ip ? 'Tiếp tục' : done ? 'Mở lại' : cur ? 'Bắt đầu' : 'Khám phá'}</a>
      </article>`;
    };
    const groupedHtml = stageMeta.map((stg) => {
      const stgDays = D.days.filter((d) => stg.days.includes(d.n));
      const doneCount = stgDays.filter((d) => S.completedDays.includes(d.n)).length;
      return `<section class="roadmap-stage-group">
        <div class="roadmap-stage-header">
          <div>
            <span class="roadmap-stage-badge">${esc(stg.badge)}</span>
            <h2 class="roadmap-stage-title">${esc(stg.title)}</h2>
            <p class="roadmap-stage-desc">${esc(stg.desc)}</p>
          </div>
          <div class="roadmap-stage-stat">
            <strong>${doneCount}/${stgDays.length}</strong>
            <span>ngày hoàn tất</span>
          </div>
        </div>
        <div class="road">${stgDays.map(renderDayCard).join('')}</div>
      </section>`;
    }).join('');
    return `<section class="view" aria-labelledby="road-title">
      <div class="kicker">Lộ trình 28 ngày · Phân chia theo Chặng Năng lực</div>
      <h1 id="road-title">Bốn tuần, bốn mục tiêu giao tiếp — Chia chặng rõ ràng</h1>
      <p class="muted">Lộ trình được chia thành các <strong>Chặng học (Learning Stages)</strong> từ Nền tảng Ngữ âm &amp; Ngữ pháp ➔ Phản xạ Hỏi Đáp ➔ Thực hành Sản sinh &amp; Chuyển giao. Bạn có thể mở bất kỳ ngày nào để xem trước hoặc ôn tập.</p>
      <div class="week-goal">${weeks.map(([n, t, g]) => `<div class="${n === '1' ? 'on' : 'off'}"><strong>Tuần ${n}</strong><br />${t}<br /><span class="muted">${g}</span>${n !== '1' ? '<br /><em class="muted">Ngoài phạm vi prototype</em>' : ''}</div>`).join('')}</div>
      <div class="roadmap-stages-wrap">${groupedHtml}</div>
    </section>`;
  }

  function viewProgress() {
    const dimNames = [['independent', 'Làm độc lập'], ['breadth', 'Nhiều ngữ cảnh'], ['transfer', 'Nội dung mới'], ['delayed', 'Sau vài ngày']];
    const condLabel = (e) => [e.independent ? 'độc lập' : 'có hỗ trợ', e.support?.includes('replay') ? 'có nghe lại' : '', e.support?.includes('transcript') ? 'xem lời thoại' : '', e.firstPass ? 'nghe lần đầu' : '', e.transfer ? 'nội dung mới' : '', e.delayed ? 'sau vài ngày' : '', e.kind === 'selfcheck' ? 'tự đánh giá' : ''].filter(Boolean).join(' · ');
    const cards = Object.entries(D.claims).map(([k, c]) => {
      const s = claimState(k);
      return `<article class="card claim">
        <div class="claim-top"><span class="claim-ico" aria-hidden="true">${c.icon}</span><div><h3>${esc(c.name)}</h3><span class="state ${s.key}">${s.label}</span></div></div>
        <p class="muted small" style="margin:0">${esc(s.why)}</p>
        <div><div class="signal" aria-hidden="true">${dimNames.map(([d]) => `<i class="${s.dims[d] ? 'on' : ''}"></i>`).join('')}</div>
          <p class="small muted" style="margin:6px 0 0">${dimNames.map(([d, n]) => `${s.dims[d] ? '✓' : '○'} ${n}`).join(' · ')}</p></div>
        ${s.suspected ? '<div class="notice warn"><span class="ico">🔍</span><p>Có 2 lần liên tiếp chưa đúng. Đây là <strong>nghi vấn</strong>, chưa phải kết luận — kế hoạch sẽ có một bài kiểm tra ngắn.</p></div>' : s.misses === 1 ? '<p class="small muted" style="margin:0">1 lần chưa đúng gần đây — chưa đủ để kết luận gì.</p>' : ''}
        ${s.ev.length ? `<details><summary>Xem ${s.ev.length} quan sát</summary><ul class="ev-list" style="margin-top:8px">${s.ev.slice(-8).reverse().map((e) => `<li><span class="dot ${!e.independent ? 'sup' : e.correct ? 'ok' : 'no'}" aria-hidden="true"></span><span><strong>Ngày ${e.simDay}</strong> · ${esc(e.label || '')} — ${e.correct ? 'đúng' : 'chưa đúng'} (${condLabel(e)})</span></li>`).join('')}</ul></details>` : ''}
      </article>`;
    }).join('');
    const arts = S.artifacts.length ? S.artifacts.slice().reverse().map((a) => `<div class="artifact"><span class="claim-ico" aria-hidden="true">${a.type === 'audio' ? '🎙️' : '✍️'}</span><div><strong>${esc(a.title)}</strong> <span class="chip">v${a.version}</span><div class="small muted">${a.type === 'audio' ? `Bản ghi ${a.duration}s · chỉ bạn xem được` : esc(a.text.slice(0, 80)) + (a.text.length > 80 ? '…' : '')}${a.note ? ' · ' + esc(a.note) : ''}</div></div></div>`).join('') : '<p class="muted small">Chưa có bài viết hay bản ghi nào. Ngày 5 sẽ có.</p>';
    return `<section class="view stack" aria-labelledby="progress-title">
      <div><div class="kicker">Tiến độ</div><h1 id="progress-title">Bạn đang ở đâu — nói thật lòng</h1>
        <p class="muted">Đi hết kế hoạch và có bằng chứng năng lực là hai chuyện khác nhau. Lingora hiển thị cả hai, và không dùng phần trăm hay điểm số tổng.</p></div>
      <div class="two-col">
        <section class="card"><h2>Tiến độ kế hoạch</h2><div class="stat">${S.completedDays.length}<span class="muted" style="font-size:1rem"> / 7 ngày của Tuần 1</span></div>
          <p class="muted small">Hoàn thành ngày học cho thấy bạn đều đặn — rất đáng quý — nhưng không có nghĩa là đã thành thạo.</p>
          ${S.interventions.length ? `<p class="small"><strong>Hỗ trợ đã thử:</strong> ${S.interventions.map((i) => `${esc(D.claims[i.claim].name)} — ${esc(i.result)}`).join('; ')}</p>` : ''}</section>
        <section class="card"><h2>Bài làm của bạn</h2><div class="stack" style="gap:8px">${arts}</div></section>
      </div>
      <h2>Bằng chứng theo kỹ năng</h2>
      <div class="claims">${cards}</div>
    </section>`;
  }

  function viewDone() {
    const today = S.evidence.filter((e) => e.simDay === S.simDay);
    const p = S.plans[S.simDay];
    const done = p ? p.blocks.filter((b) => b.status === 'COMPLETED' && b.type !== 'FINISH').length : 0;
    return `<section class="view runner"><div class="card feature step-card" style="text-align:center">
      ${mascot()}<h1 style="font-size:1.8rem">Khép lại ngày ${S.simDay}</h1>
      <p class="muted">Bạn đã làm ${done} việc trong kế hoạch và tạo ${today.length} quan sát mới. Cảm ơn bạn đã dành thời gian cho mình hôm nay.</p>
      <div class="notice mint" style="text-align:left"><span class="ico">🌿</span><p>Ngày mai kế hoạch sẽ tự điều chỉnh theo những gì bạn đã làm — kể cả khi bạn nghỉ vài hôm.</p></div>
      <div class="runner-foot" style="justify-content:center"><a class="btn" href="#/progress">Xem tiến độ</a><button class="btn primary" data-sim="nextDay" id="done-next-day">Sang ngày mới (giả lập) <span class="arrow">→</span></button></div>
    </div></section>`;
  }

  /* ---------------- Runner ---------------- */
  function startRun(kind, id) {
    let steps, title, posture = '', mood = 'learning', short = false;
    if (kind === 'lesson') {
      const d = day(id); if (!d) return null;
      short = S.mode === 'short' && d.n !== 7;
      steps = short ? d.steps.filter((s) => s.core) : d.steps;
      title = `Ngày ${d.n}: ${d.title}`; posture = d.posture; mood = d.mood;
    } else if (kind === 'review') { steps = D.review[id]; title = `Ôn lại: ${D.claims[id].name}`; posture = 'Kiểm tra lại sau vài ngày'; mood = 'review'; }
    else if (kind === 'verify') { const v = D.verify[id]; steps = [v.probe, { ...v.recover, when: 'failed' }, ...(v.next ? [{ ...v.next, when: 'failed' }] : [])]; title = `Kiểm tra ngắn: ${D.claims[id].name}`; posture = 'Xác minh trước khi kết luận'; mood = 'recovery'; }
    else if (kind === 'check') { steps = D.check; title = 'Kiểm tra đầu vào'; posture = 'Tuỳ chọn · có thể bỏ qua từng câu'; mood = 'assessment'; }
    if (!steps) return null;
    let idx = 0;
    if (kind === 'lesson' && S.inProgress?.kind === 'lesson' && S.inProgress.id === Number(id) && S.inProgress.short === short) idx = Math.min(S.inProgress.idx, steps.length - 1);
    R = { kind, id: kind === 'lesson' ? Number(id) : id, title, posture, mood, short, steps, idx, st: {}, evStart: S.evidence.length, verifyFailed: false, finished: false, totalSteps: kind === 'lesson' ? day(id).steps.length : steps.length };
    if (kind === 'lesson') persistProgress();
    return R;
  }
  const st = () => (R.st[R.idx] ||= { answers: {}, hints: {}, plays: 0, checked: false, transcript: false, audioFailed: false, rec: 'idle' });
  const routeOf = () => `#/run/${R.kind}/${R.kind === 'check' ? 'start' : R.id}`;
  function persistProgress() { if (R.kind === 'lesson') { S.inProgress = { kind: 'lesson', id: R.id, idx: R.idx, short: R.short }; save(); } }

  function stepDone(step, s) {
    switch (step.type) {
      case 'choice': case 'fill': return s.checked;
      case 'write': return !!(s.saved || s.later);
      case 'record': return s.rec === 'saved' || !!s.later || !!s.altSaved;
      case 'light': return false;
      default: return true;
    }
  }

  function player(step, s) {
    if (!step.audio) return '';
    if (s.audioFailed) return `<div class="notice warn" role="alert"><span class="ico">🔇</span><div><p><strong>Âm thanh không phát được.</strong> Đây là lỗi kỹ thuật, không phải lỗi của bạn — lần này sẽ không được tính là bằng chứng nghe.</p><p>Lời thoại: “${esc(step.audio)}”</p><button class="btn sm" data-act="retry-audio">Thử phát lại</button></div></div>`;
    return `<div class="player"><button class="play-btn" data-act="play" aria-label="Phát đoạn nghe">▶</button><div class="wave" aria-hidden="true">${'<i></i>'.repeat(14)}</div>
      <div class="small"><strong>${s.plays ? `Đã nghe ${s.plays} lần` : 'Chưa nghe'}</strong><br /><span class="muted">${step.firstPass ? 'Thử nghe một lần trước khi trả lời' : 'Nghe bao nhiêu lần cũng được'}</span></div>
      <span class="spacer"></span>${s.transcript ? '' : `<button class="btn ghost sm" data-act="transcript">Xem lời thoại</button>`}</div>
      ${s.transcript ? `<p class="reveal">📝 “${esc(step.audio)}” <span class="chip">đã dùng hỗ trợ</span></p>` : ''}`;
  }

  function passage(p) {
    if (!p) return '';
    if (p.kind === 'profile') return `<div class="profile" role="table" aria-label="Hồ sơ">${p.rows.map(([a, b]) => `<div role="cell">${esc(a)}</div><div role="cell">${esc(b)}</div>`).join('')}</div>`;
    if (p.kind === 'chat') return `<div class="chat"><div class="who">💬 Tin nhắn từ ${esc(p.from)}</div><div class="bubble" lang="en">${esc(p.text)}</div></div>`;
    return `<p class="plain" lang="en">${esc(p.text)}</p>`;
  }

  function condChips(step, s) {
    const ev = step.evidence; const chips = [];
    if (!ev || ev.mode === 'none') chips.push('<span class="chip practice">Luyện tập — không tạo bằng chứng</span>');
    else if (s.audioFailed) chips.push('<span class="chip">Không tính: lỗi âm thanh</span>');
    else {
      const sup = s.transcript || Object.values(s.hints).some(Boolean);
      chips.push(sup ? '<span class="chip assessment">Ghi nhận: có hỗ trợ</span>' : '<span class="chip ok">Ghi nhận: tự làm</span>');
      if (step.audio) chips.push(s.plays <= 1 && !s.transcript ? '<span class="chip learning">Nghe lần đầu</span>' : `<span class="chip">Nghe ${s.plays} lần</span>`);
      if (ev.transfer) chips.push('<span class="chip review">Nội dung chưa gặp</span>');
      if (ev.delayed) chips.push('<span class="chip review">Sau vài ngày</span>');
    }
    return chips.join('');
  }

  function stepIconsForHead(type) {
    const m = {
      dialogue: '💬', ipa: '👄', pillars: '🏛️', words: '📚', traps: '⚠️',
      'grammar-pieces': '🧩', choice: '✅', fill: '✍️', write: '📝',
      record: '🎙️', speak: '🎙️', pattern: '📐', explain: '🌱', light: '☁️'
    };
    return m[type] || '✨';
  }

  function renderStep(step, s) {
    const stepMetaMap = {
      dialogue: { badge: 'HỘI THOẠI MẪU · NGHE & ĐÁNH VẦN', tone: 'learning' },
      ipa: { badge: 'PHÒNG LAB KHẨU HÌNH IPA (1 ÂM / MÀN HÌNH)', tone: 'learning' },
      pillars: { badge: 'KHUNG MẪU CÂU GIAO TIẾP CỐT LÕI', tone: 'learning' },
      words: { badge: 'TỪ VỰNG TRỌNG TÂM · 100% CÓ PHIÊN ÂM IPA', tone: 'learning' },
      traps: { badge: 'CẢNH BÁO BẪY TIẾNG MẸ ĐẺ (L1 TRANSFER)', tone: 'recovery' },
      'grammar-pieces': { badge: 'CHUYÊN ĐỀ NGỮ PHÁP 6 PHẦN CHUYÊN SÂU', tone: 'practice' },
      choice: { badge: 'BÀI TẬP PHẢN XẠ TRẮC NGHIỆM', tone: 'assessment' },
      fill: { badge: 'THỰC HÀNH ĐIỀN TỪ & ĐÁNH VẦN', tone: 'practice' },
      write: { badge: 'XƯỞNG VIẾT CÁ NHÂN HÓA (WRITING STUDIO)', tone: 'assessment' },
      record: { badge: 'PHÒNG THU PHẢN XẠ NÓI (SPEAKING STUDIO)', tone: 'assessment' },
      speak: { badge: 'PHÒNG THU PHẢN XẠ NÓI (SPEAKING STUDIO)', tone: 'assessment' },
      pattern: { badge: 'BẢNG QUY TẮC & MẪU CÂU TỔNG HỢP', tone: 'review' },
      explain: { badge: 'TỔNG KẾT & CỦNG CỐ TRI THỨC', tone: 'review' },
      light: { badge: 'NHỊP ĐIỆU LINH HOẠT · KHÔNG ÁP LỰC', tone: 'break' }
    };
    const sm = stepMetaMap[step.type] || { badge: 'HOẠT ĐỘNG HỌC TẬP', tone: 'learning' };
    const head = `<div class="step-card-top-bar">
      <span class="step-type-pill ${sm.tone}">${stepIconsForHead(step.type)} ${sm.badge}</span>
      <span class="step-counter-pill">Học phần ${R.idx + 1} / ${R.steps.length}${step.core ? ' · ★ Cốt lõi' : ''}</span>
    </div>
    <h2 id="step-title">${esc(step.title)}</h2>`;
    switch (step.type) {
      case 'dialogue':
        return `${head}${step.context ? `<p class="muted small">${esc(step.context)}</p>` : ''}
          <div class="ipa-reading-tip-banner">
            <span class="ico">💡</span>
            <div>
              <strong>Làm sao để đọc được dòng phiên âm IPA bên dưới?</strong>
              <span>Bạn có thể <strong>bấm trực tiếp vào bất kỳ từ tiếng Anh nào</strong> trong câu để nghe phát âm chậm của riêng từ đó, xem dòng <em>🗣️ Đọc theo nhịp</em>, hoặc bấm <strong>🔍 Cách đánh vần cụm từ</strong> để xem cách ghép từng âm!</span>
            </div>
          </div>
          <div class="dialogue-box">${step.turns.map((t, ti) => {
            const clickableWords = t.en.split(/\s+/).map((tok) => {
              const cleanWord = tok.replace(/[^a-zA-Z']/g, '');
              if (!cleanWord) return esc(tok);
              return `<button type="button" class="clickable-word" data-act="say-slow" data-text="${esc(cleanWord)}" title="Bấm để nghe chậm từ &quot;${esc(cleanWord)}&quot;">${esc(tok)}</button>`;
            }).join(' ');
            const showBreakdown = s.breakdownTurns?.[ti] !== false;
            return `
            <div class="dialogue-turn ${t.speaker === 'Linh' ? 'turn-a' : 'turn-b'}">
              <div class="turn-avatar" aria-hidden="true">${esc(t.avatar || '👤')}</div>
              <div class="turn-content ${t.wordBreakdown?.length && showBreakdown ? 'turn-split-grid' : ''}">
                <div class="turn-col-main">
                  <div class="turn-meta"><strong>${esc(t.speaker)}</strong> <span class="muted small">(${esc(t.role || '')})</span></div>
                  <p class="turn-en" lang="en">${clickableWords}</p>
                  ${t.ipa ? `<p class="turn-ipa small muted" title="Ký hiệu phiên âm quốc tế IPA">🔤 IPA: ${esc(t.ipa)}</p>` : ''}
                  ${t.vnGuide ? `<p class="turn-vn-guide">🗣️ <strong>Đọc theo nhịp (IN HOA = nhấn mạnh):</strong> <span>${esc(t.vnGuide)}</span></p>` : ''}
                  <div class="row" style="margin-top:8px;gap:8px;flex-wrap:wrap">
                    <button class="btn soft sm" data-act="say" data-text="${esc(t.en)}">🔊 Nghe chuẩn</button>
                    <button class="btn ghost sm" data-act="say-slow" data-text="${esc(t.en)}" title="Nghe máy đọc chậm từng chữ">🐢 Nghe chậm</button>
                    ${t.wordBreakdown?.length ? `<button class="btn ghost sm" data-act="toggle-breakdown-turn" data-idx="${ti}">${showBreakdown ? 'Ẩn cách đánh vần' : '🔍 Cách đánh vần cụm từ'}</button>` : ''}
                    ${t.vi ? `<button class="btn ghost sm" data-act="toggle-vi-turn" data-idx="${ti}">${s.viTurns?.[ti] ? 'Ẩn nghĩa' : 'Xem nghĩa TV'}</button>` : ''}
                  </div>
                  ${t.vi ? `<p class="turn-vi" id="vi-turn-${ti}" style="display:${s.viTurns?.[ti] ? 'block' : 'none'}">${esc(t.vi)}</p>` : ''}
                </div>
                ${t.wordBreakdown?.length ? `<div class="turn-breakdown-list" style="display:${showBreakdown ? 'grid' : 'none'}">
                  <div class="breakdown-panel-title">🧩 Bóc tách &amp; Cách ghép vần cụm từ:</div>
                  ${t.wordBreakdown.map((wb) => `<div class="turn-breakdown-item">
                    <button type="button" class="breakdown-play-chip" data-act="say-slow" data-text="${esc(wb.w)}">🔊 <strong>${esc(wb.w)}</strong> <code>${esc(wb.ipa)}</code></button>
                    <span class="breakdown-how">👉 ${esc(wb.how)}</span>
                  </div>`).join('')}
                </div>` : ''}
              </div>
            </div>`;
          }).join('')}</div>
          ${step.note ? `<div class="notice" style="margin-top:16px"><span class="ico">💡</span><p>${esc(step.note)}</p></div>` : ''}`;

      case 'ipa': {
        const totalP = step.phonemes.length;
        const pIdx = Math.min(Math.max(0, s.ipaIdx || 0), totalP - 1);
        const p = step.phonemes[pIdx];
        const cleanWord = p.audioWord || p.example.split(' ')[0];
        return `${head}<p class="muted">${esc(step.intro || 'Bấm chọn từng âm bên dưới để quan sát khẩu hình cỡ lớn và luyện ghép vần ngay trên 1 màn hình (không cần cuộn trang):')}</p>
          ${step.blendingRules ? `<div class="ipa-blend-rules">
            <div class="blend-rules-title">🧭 QUY TẮC ĐÁNH VẦN IPA 3 BƯỚC (GIỐNG ĐÁNH VẦN TIẾNG VIỆT LỚP 1)</div>
            <div class="blend-rules-grid">
              ${step.blendingRules.map((r, ri) => `<div class="blend-rule-step">
                <span class="blend-rule-num">${ri + 1}</span>
                <div>
                  <strong>${esc(r.step)}</strong>
                  <p class="small muted" style="margin:3px 0 0">${esc(r.desc)}</p>
                </div>
              </div>`).join('')}
            </div>
          </div>` : ''}

          <div class="ipa-single-stage">
            <div class="ipa-tabs-bar" role="tablist" aria-label="Chọn âm IPA để xem khẩu hình">
              <div class="ipa-tabs-list">
                ${step.phonemes.map((item, idx) => {
                  const isAct = idx === pIdx;
                  const exWord = item.audioWord || item.example.split(' ')[0];
                  return `<button type="button" role="tab" aria-selected="${isAct}" class="ipa-tab-pill ${isAct ? 'active' : ''}" data-act="select-ipa-tab" data-idx="${idx}">
                    <span class="ipa-tab-num">${idx + 1}/${totalP}</span>
                    <strong class="ipa-tab-sym">${esc(item.ipa)}</strong>
                    <span class="ipa-tab-word">${esc(exWord)}</span>
                  </button>`;
                }).join('')}
              </div>
              <div class="ipa-tabs-arrows">
                <button type="button" class="btn ghost sm" data-act="prev-ipa-tab" ${pIdx === 0 ? 'disabled' : ''}>← Âm trước</button>
                <span class="small muted" style="font-weight:700">Âm ${pIdx + 1} / ${totalP}</span>
                <button type="button" class="btn soft sm" data-act="next-ipa-tab" ${pIdx === totalP - 1 ? 'disabled' : ''}>Âm tiếp theo →</button>
              </div>
            </div>

            <div class="ipa-card ipa-spotlight-card" role="tabpanel">
              <div class="ipa-header">
                <div>
                  <span class="ipa-symbol">${esc(p.ipa)}</span>
                  <div>
                    <strong class="ipa-spotlight-title">${esc(p.name)}</strong>
                    ${p.vnApprox ? `<span class="ipa-vn-badge">🗣️ ${esc(p.vnApprox)}</span>` : ''}
                  </div>
                </div>
                <div class="ipa-audio-actions">
                  <button class="btn primary sm" data-act="say" data-text="${esc(cleanWord)}" aria-label="Nghe chuẩn ${esc(p.ipa)}">🔊 Nghe chuẩn "${esc(cleanWord)}"</button>
                  <button class="btn soft sm" data-act="say-slow" data-text="${esc(cleanWord)}" aria-label="Nghe chậm ${esc(p.ipa)}">🐢 Nghe chậm (0.55x)</button>
                </div>
              </div>

              <div class="ipa-spotlight-grid">
                <div class="ipa-spotlight-left">
                  ${renderMouthDiagram(p.ipa)}
                </div>
                <div class="ipa-spotlight-right">
                  ${p.blendParts ? `<div class="ipa-blend-box">
                    <div class="ipa-blend-label">🧩 Bước thực hành: Bấm từng mảnh âm để đánh vần rồi ghép lại</div>
                    <div class="ipa-blend-parts">
                      ${p.blendParts.map((bp) => `<button type="button" class="blend-chip" data-act="say-slow" data-text="${esc(bp.audio || cleanWord)}" title="Bấm để nghe âm ${esc(bp.sym)}">
                        <span class="blend-chip-sym">${esc(bp.sym)}</span>
                        <span class="blend-chip-desc">${esc(bp.label)}</span>
                      </button>`).join('<span class="blend-operator" aria-hidden="true">+</span>')}
                      <span class="blend-operator" aria-hidden="true">➔</span>
                      <button type="button" class="blend-result-chip" data-act="say" data-text="${esc(cleanWord)}">
                        🔗 Ghép: <strong>${esc(cleanWord)}</strong> 🔊
                      </button>
                    </div>
                    ${p.blendFormula ? `<div class="ipa-blend-formula">Công thức: <code>${esc(p.blendFormula)}</code></div>` : ''}
                  </div>` : ''}

                  <div class="ipa-examples-box">
                    <div class="small muted" style="font-weight:700;margin-bottom:6px">🎧 Nghe từ mẫu &amp; đối chiếu cặp âm dễ nhầm:</div>
                    <div class="ipa-examples">
                      <button type="button" class="chip learning clickable-chip" data-act="say" data-text="${esc(cleanWord)}" title="Bấm để nghe từ mẫu">Từ mẫu: ${esc(p.example)} 🔊</button>
                      ${p.contrast ? `<button type="button" class="chip review clickable-chip" data-act="say" data-text="${esc(p.contrast.split(' ')[0])}" title="Bấm để nghe từ đối chiếu">Đối chiếu: ${esc(p.contrast)} 🔊</button>` : ''}
                    </div>
                  </div>

                  <div class="ipa-spotlight-pager-foot">
                    <span class="small muted">💡 Mẹo: Bạn có thể bấm các nút âm phía trên để chuyển nhanh giữa <strong>${step.phonemes.map((x) => x.ipa).join(', ')}</strong> ngay trên cùng 1 khung nhìn.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          ${renderNameSpellerWidget(s)}
          ${step.tip ? `<div class="notice mint" style="margin-top:18px"><span class="ico">🎯</span><p>${esc(step.tip)}</p></div>` : ''}`;
      }

      case 'pillars':
        return `${head}<p class="muted">${esc(step.intro || '4 Trụ cột thông tin cốt lõi trong bất kỳ câu giới thiệu bản thân nào:')}</p>
          <div class="pillars-grid">${step.pillars.map((pil) => `
            <div class="pillar-card">
              <div class="pillar-num">${esc(pil.number || pil.num)}</div>
              <div>
                <h3>${esc(pil.type)}</h3>
                <p class="pillar-formal" lang="en"><strong>Chuẩn mực:</strong> ${esc(pil.formal)} <button class="icon-btn-inline" data-act="say" data-text="${esc(pil.formal)}" aria-label="Nghe câu chuẩn mực">🔊</button></p>
                <p class="pillar-casual" lang="en"><strong>Thân mật:</strong> ${esc(pil.casual)} <button class="icon-btn-inline" data-act="say" data-text="${esc(pil.casual)}" aria-label="Nghe câu thân mật">🔊</button></p>
                <p class="small muted" style="margin-top:6px">💡 ${esc(pil.tip)}</p>
              </div>
            </div>`).join('')}</div>`;

      case 'traps':
        return `${head}<p class="muted">${esc(step.intro || '3 Bẫy ngữ âm và thói quen tiếng mẹ đẻ người học Việt Nam thường mắc phải:')}</p>
          <div class="traps-list">${step.traps.map((tr) => `
            <div class="trap-box">
              <div class="trap-badge">⚠️ ${esc(tr.title)}</div>
              <p class="trap-issue"><strong>Bẫy thường gặp:</strong> ${esc(tr.issue || tr.viIssue)}</p>
              <div class="trap-fix"><strong>Cách sửa chuẩn:</strong> ${esc(tr.fix)} ${tr.example ? `<button class="icon-btn-inline" data-act="say" data-text="${esc(tr.example)}">🔊</button>` : ''}</div>
            </div>`).join('')}</div>`;

      case 'grammar-pieces': {
        const coreConceptHtml = step.coreConcept ? `
          <div class="gm-section gm-core-concept">
            <div class="gm-sec-badge">1. GIẢI THÍCH TRỌNG TÂM (CORE CONCEPT)</div>
            <p class="gm-core-summary">${esc(step.coreConcept.summary || '')}</p>
            ${step.coreConcept.goldenRule ? `<div class="gm-golden-rule"><strong>💡 Quy tắc Vàng cần nhớ:</strong> <span>${esc(step.coreConcept.goldenRule)}</span></div>` : ''}
          </div>` : '';

        const functionsHtml = Array.isArray(step.functions) && step.functions.length ? `
          <div class="gm-section">
            <div class="gm-sec-badge">2. CHỨC NĂNG GIAO TIẾP &amp; VÍ DỤ THỰC TẾ</div>
            <div class="gm-fn-grid">
              ${step.functions.map((fn) => {
                const examples = Array.isArray(fn.examples) && fn.examples.length
                  ? fn.examples
                  : (fn.exampleEn ? [{ en: fn.exampleEn, vi: fn.exampleVi || '' }] : []);
                return `
                <div class="gm-fn-card">
                  <div class="gm-fn-title">${esc(fn.title || fn.name || '')}</div>
                  ${fn.formula ? `<code class="gm-fn-formula">${esc(fn.formula)}</code>` : ''}
                  <p class="gm-fn-desc">${esc(fn.desc || '')}</p>
                  <div class="gm-fn-examples">
                    ${examples.map((ex) => {
                      const enStr = String(ex.en || '');
                      return `
                      <div class="gm-fn-ex-row">
                        <div>
                          <strong lang="en">${esc(enStr)}</strong>
                          <span>— ${esc(ex.vi || '')}</span>
                        </div>
                        <button type="button" class="icon-btn-inline" data-act="say" data-text="${esc(enStr.replace(/[↗↘]/g, ''))}" title="Nghe câu mẫu">🔊</button>
                      </div>`;
                    }).join('')}
                  </div>
                </div>`;
              }).join('')}
            </div>
          </div>` : '';

        const piecesTableHtml = `
          <div class="gm-section">
            <div class="gm-sec-badge">3. MÔ HÌNH MẢNH GHÉP (GRAMMAR PIECES) &amp; BẢNG CHIA NGÔI</div>
            <div class="grammar-visual" style="margin:12px 0 16px">
              <div class="grammar-pieces" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
                <span class="card" style="border:2px solid var(--primary);padding:10px 16px;border-radius:12px;background:#f5f3ff"><small style="display:block;font-size:0.7rem;font-weight:700;color:var(--primary-strong)">CHỦ NGỮ (S)</small><b style="font-size:1.1rem">${esc(step.subject || 'I / He / She / You')}</b></span>
                <i style="font-style:normal;font-weight:800;font-size:1.4rem;color:var(--primary)">+</i>
                <span class="card" style="border:2px solid var(--mint);padding:10px 16px;border-radius:12px;background:#f0fdf9"><small style="display:block;font-size:0.7rem;font-weight:700;color:#0d9488">ĐỘNG TỪ TO BE (V)</small><b style="font-size:1.1rem">${esc(step.be || 'am / is / are')}</b></span>
                <i style="font-style:normal;font-weight:800;font-size:1.4rem;color:var(--mint)">+</i>
                <span class="card" style="border:2px solid var(--peach);padding:10px 16px;border-radius:12px;background:#fff8f1"><small style="display:block;font-size:0.7rem;font-weight:700;color:#d97706">BỔ NGỮ (COMPLEMENT)</small><b style="font-size:1.1rem">${esc(step.complement || 'a student / from Hue')}</b></span>
              </div>
            </div>
            <table class="pattern">
              <thead><tr><th>Thành phần 1</th><th>Thành phần 2</th><th>Giải nghĩa &amp; Ghi chú Ngôi</th></tr></thead>
              <tbody>${(step.rows || []).map((r) => `<tr>${r.map((c, idx) => `<td ${idx < 2 ? 'lang="en"' : ''}>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>
            </table>
            <button class="btn soft sm" data-act="say" data-text="${esc((step.rows || []).map((r) => `${r[0] || ''} ${r[1] || ''}`.replace(/[↗↘]/g, '')).join('. '))}" style="margin-top:10px">🔊 Nghe phát âm bảng câu mẫu</button>
          </div>`;

        const polarityHtml = Array.isArray(step.polarityMatrix) && step.polarityMatrix.length ? `
          <div class="gm-section">
            <div class="gm-sec-badge">4. CẤU TRÚC 3 THỂ: KHẲNG ĐỊNH (+) · PHỦ ĐỊNH (-) · NGHI VẤN (?)</div>
            <div class="gm-polarity-grid">
              ${step.polarityMatrix.map((pol) => `
                <div class="gm-polarity-card pol-${esc(pol.polarity || pol.kind || 'affirmative')}">
                  <div class="gm-pol-head">
                    <span class="gm-pol-badge">${esc(pol.badge || '')}</span>
                    <h4>${esc(pol.title || pol.badge || '')}</h4>
                  </div>
                  <div class="gm-pol-formula"><code>${esc(pol.formula || '')}</code></div>
                  <p class="gm-pol-rule">📌 <strong>Lưu ý rút gọn:</strong> ${esc(pol.contractionRule || pol.contraction || '')}</p>
                  <div class="gm-pol-examples">
                    ${(pol.examples || []).map((ex) => {
                      const fullStr = String(ex.full || ex.en || '');
                      return `
                      <div class="gm-pol-ex-item">
                        <div class="gm-pol-ex-top">
                          <strong lang="en">${esc(fullStr)}</strong>
                          <button type="button" class="icon-btn-inline" data-act="say" data-text="${esc(fullStr.replace(/[↗↘]/g, ''))}" title="Nghe câu">🔊</button>
                        </div>
                        ${ex.short ? `<div class="gm-pol-ex-sub"><span>Dạng rút gọn / Ghi chú:</span> <code>${esc(ex.short)}</code></div>` : ''}
                        <div class="gm-pol-ex-vi">🇻🇳 ${esc(ex.vi || '')}</div>
                      </div>`;
                    }).join('')}
                  </div>
                </div>`).join('')}
            </div>
          </div>` : '';

        const recognitionHtml = Array.isArray(step.recognitionTips) && step.recognitionTips.length ? `
          <div class="gm-section">
            <div class="gm-sec-badge">5. CÁCH PHÂN TÍCH &amp; MẸO NHẬN BIẾT NHANH KHI LÀM BÀI</div>
            <div class="gm-tips-list">
              ${step.recognitionTips.map((tip, idx) => {
                if (typeof tip === 'string') {
                  return `<div class="gm-tip-card"><span class="gm-tip-step">Bước ${idx + 1}</span><div><p>${esc(tip)}</p></div></div>`;
                }
                return `
                <div class="gm-tip-card">
                  <span class="gm-tip-step">${esc(tip.step || `Bước ${idx + 1}`)}</span>
                  <div>
                    <strong>${esc(tip.title || '')}</strong>
                    <p>${esc(tip.detail || '')}</p>
                  </div>
                </div>`;
              }).join('')}
            </div>
          </div>` : '';

        const annotatedHtml = Array.isArray(step.annotatedExamples) && step.annotatedExamples.length ? `
          <div class="gm-section">
            <div class="gm-sec-badge">6. VÍ DỤ GIẢNG GIẢI — MỔ XẺ THÀNH PHẦN CÂU CHI TIẾT</div>
            <div class="gm-annotated-list">
              ${step.annotatedExamples.map((item) => {
                const tokens = item.tokens || item.segments || [];
                return `
                <div class="gm-annotated-card">
                  <div class="gm-ann-header">
                    <div>
                      <strong class="gm-ann-sentence" lang="en">${esc(item.sentence || '')}</strong>
                      ${item.ipa ? `<code class="word-ipa-badge" style="margin-left:8px">${esc(item.ipa)}</code>` : ''}
                      ${item.meaning ? `<div class="gm-ann-meaning">🇻🇳 ${esc(item.meaning)}</div>` : ''}
                    </div>
                    <button type="button" class="btn soft sm" data-act="say" data-text="${esc(item.sentence || '')}">🔊 Nghe câu</button>
                  </div>
                  <div class="gm-ann-tokens">
                    ${tokens.map((tk) => `
                      <div class="gm-token-chip">
                        <b lang="en">${esc(tk.text || '')}</b>
                        <span>${esc(tk.role || '')}${tk.note ? ` (${esc(tk.note)})` : ''}</span>
                      </div>`).join('<span class="gm-token-plus">+</span>')}
                  </div>
                  <div class="gm-ann-analysis">🔍 <strong>Giảng giải phân tích:</strong> ${esc(item.analysis || '')}</div>
                </div>`;
              }).join('')}
            </div>
          </div>` : '';

        return `${head}<p class="muted">${esc(step.intro || 'Mô hình ghép khối câu ngữ pháp & phân tích chuyên sâu:')}</p>
          <div class="grammar-masterclass">
            ${coreConceptHtml}
            ${functionsHtml}
            ${piecesTableHtml}
            ${polarityHtml}
            ${recognitionHtml}
            ${annotatedHtml}
          </div>`;
      }

      case 'read':
        return `${head}<p class="passage-en" lang="en">${esc(step.text)}</p>
          <div class="row"><button class="btn soft sm" data-act="say" data-text="${esc(step.text)}">🔊 Nghe</button><button class="btn ghost sm" data-act="toggle-vi" aria-expanded="${!!s.vi}">${s.vi ? 'Ẩn nghĩa' : 'Xem nghĩa tiếng Việt'}</button></div>
          ${s.vi ? `<p class="reveal">${esc(step.vi)}</p>` : ''}${step.note ? `<div class="notice" style="margin-top:16px"><span class="ico">💡</span><p>${esc(step.note)}</p></div>` : ''}`;
      case 'notice': {
        let html = esc(step.text);
        step.marks.forEach((m) => { html = html.replace(esc(m.phrase), `<span class="mark ${m.tone}">${esc(m.phrase)}<sup>${esc(m.label)}</sup></span>`); });
        return `${head}<p class="passage-en" lang="en">${html}</p><div class="row">${step.marks.map((m) => `<span class="chip ${m.tone}">${esc(m.label)}: ${esc(m.phrase)}</span>`).join('')}</div>
          <p class="muted small" style="margin-top:14px">Chỉ cần để ý. Không có câu hỏi ở bước này.</p>`;
      }
      case 'words':
        return `${head}<div class="words">${step.words.map((w) => {
          const cleanEn = w.audioText || w.en.split(' ')[0];
          return `<div class="word word-card-enhanced">
            <div class="word-top-row">
              <div class="word-main-info">
                <strong lang="en" class="word-en-title">${esc(w.en)}</strong>
                ${w.ipa ? `<code class="word-ipa-badge">${esc(w.ipa)}</code>` : ''}
                ${w.syllables ? `<span class="word-syllable-chip" title="Chia âm tiết">${esc(w.syllables)}</span>` : ''}
                ${w.stressNote ? `<span class="word-stress-chip">${esc(w.stressNote)}</span>` : ''}
              </div>
              <div class="word-audio-btns">
                <button class="btn soft sm" data-act="say" data-text="${esc(cleanEn)}" aria-label="Nghe chuẩn từ ${esc(w.en)}">🔊 Chuẩn</button>
                <button class="btn ghost sm" data-act="say-slow" data-text="${esc(cleanEn)}" aria-label="Nghe chậm từ ${esc(w.en)}">🐢 Chậm</button>
              </div>
            </div>
            <div class="word-meaning-row">
              <span class="word-vi-text">🇻🇳 <strong>Nghĩa:</strong> ${esc(w.vi)}</span>
              ${w.collocation ? `<span class="word-collocation">💬 <em>Ví dụ:</em> "${esc(w.collocation)}" <button type="button" class="icon-btn-inline" data-act="say" data-text="${esc(w.collocation)}" title="Nghe câu ví dụ">🔊</button></span>` : ''}
            </div>
            ${w.spellSteps ? `<div class="word-spell-guide">
              <span class="spell-guide-tag">🧩 Cách đánh vần IPA:</span>
              <span class="spell-guide-formula">${esc(w.spellSteps)}</span>
            </div>` : ''}
          </div>`;
        }).join('')}</div>
          ${step.tip ? `<div class="notice warn" style="margin-top:16px"><span class="ico">💡</span><p>${esc(step.tip)}</p></div>` : ''}`;
      case 'pattern':
        return `${head}<table class="pattern"><tbody>${step.rows.map((r) => `<tr>${r.map((c) => `<td lang="en">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>
          <button class="btn soft sm" data-act="say" data-text="${esc(step.text)}" style="margin-top:8px">🔊 Nghe cả ba câu</button>`;
      case 'explain':
        return `${head}<div class="notice mint"><span class="ico">🧠</span><p>${esc(step.body)}</p></div>`;
      case 'choice': {
        const allAnswered = step.questions.every((_, qi) => s.answers[qi] !== undefined);
        const qs = `<div class="choice-questions-grid ${step.questions.length > 1 ? 'multi-q' : ''}">${step.questions.map((q, qi) => `<div class="quiz-q-card" role="group" aria-labelledby="qtitle-${R.idx}-${qi}">
          <div class="quiz-q-header">
            <h3 class="quiz-q-title" id="qtitle-${R.idx}-${qi}">${esc(q.q)}</h3>
            ${(q.ipaBadge || q.audio) ? `<div class="quiz-q-tools">
              ${q.ipaBadge ? `<code class="word-ipa-badge">${esc(q.ipaBadge)}</code>` : ''}
              ${q.audio ? `<button type="button" class="btn soft sm" data-act="say" data-text="${esc(q.audio)}">🔊 Nghe</button><button type="button" class="btn ghost sm" data-act="say-slow" data-text="${esc(q.audio)}">🐢 Chậm</button>` : ''}
            </div>` : ''}
          </div>
          ${q.mouthPreview ? `<div class="quiz-mouth-preview">${renderMouthDiagram(q.mouthPreview)}</div>` : ''}
          <div class="opts">${q.options.map((o, oi) => {
            const cls = s.checked ? (oi === q.answer ? 'correct' : s.answers[qi] === oi ? 'missed' : '') : '';
            return `<div class="opt ${cls}"><input type="radio" id="q${R.idx}-${qi}-${oi}" name="q${R.idx}-${qi}" data-q="${qi}" value="${oi}" ${s.answers[qi] === oi ? 'checked' : ''} ${s.checked ? 'disabled' : ''} /><label for="q${R.idx}-${qi}-${oi}">${esc(o)}</label></div>`;
          }).join('')}</div>
          ${s.checked && q.explain ? `<p class="fb ${s.answers[qi] === q.answer ? 'ok' : ''}">${s.answers[qi] === q.answer ? '✓ ' : '→ '}${esc(q.explain)}</p>` : ''}
        </div>`).join('')}</div>`;
        return `${head}${step.intro ? `<p class="muted">${esc(step.intro)}</p>` : ''}${player(step, s)}${passage(step.passage)}${qs}
          <div style="margin-top:16px">${s.checked ? feedback(step, s) : `<button class="btn primary" data-act="check" ${allAnswered ? '' : 'disabled'}>Kiểm tra</button>`}</div>`;
      }
      case 'fill': {
        const alphaHtml = step.alphabetGuide ? `
          <div class="alphabet-trainer-box">
            <div class="alphabet-trainer-header">
              <strong>🔤 Bảng Quy tắc Đánh vần Chữ cái Tiếng Anh (IPA Alphabet)</strong>
              <span class="small muted">Bấm vào từng chữ cái để nghe phát âm chuẩn:</span>
            </div>
            <div class="alphabet-grid">
              ${step.alphabetGuide.map((ag) => `<button type="button" class="alphabet-card" data-act="say-slow" data-text="${esc(ag.letter)}">
                <div class="alphabet-card-top">
                  <span class="alphabet-letter">${esc(ag.letter)}</span>
                  <code class="alphabet-ipa">${esc(ag.ipa)}</code>
                  <span class="alphabet-play-ico">🔊</span>
                </div>
                <p class="alphabet-tip">${esc(ag.tip)}</p>
              </button>`).join('')}
            </div>
            ${step.nameSpellDemos ? `<div class="name-spell-demos">
              <div class="small" style="font-weight:700;margin-bottom:8px">🎧 Ví dụ cách đánh vần tên người Việt sang tiếng Anh:</div>
              <div class="name-demos-grid">
                ${step.nameSpellDemos.map((nd) => `<div class="name-demo-card">
                  <div class="row" style="justify-content:space-between">
                    <strong>Tên: ${esc(nd.name)}</strong>
                    <button type="button" class="btn soft sm" data-act="say-slow" data-text="${esc(nd.audio)}">🔊 Nghe đánh vần</button>
                  </div>
                  <div class="name-demo-letters">${nd.letters.map((l) => `<span class="chip">${esc(l)}</span>`).join(' - ')}</div>
                  <div class="small muted">🗣️ Đọc từng chữ: <strong>${esc(nd.readAs)}</strong></div>
                </div>`).join('')}
              </div>
            </div>` : ''}
            ${renderNameSpellerWidget(s)}
          </div>` : '';

        const rows = `<div class="fill-rows-grid ${step.items.length > 1 ? 'multi-fill' : ''}">${step.items.map((it, i) => {
          const ok = s.checked && it.accepted.includes(norm(s.answers[i]));
          const parts = esc(it.prompt).split('___');
          return `<div class="fill-row">
            ${(it.ipaBadge || it.audio) ? `<div class="fill-row-toolbar">
              ${it.ipaBadge ? `<code class="word-ipa-badge">${esc(it.ipaBadge)}</code>` : ''}
              ${it.audio ? `<div class="row" style="gap:6px"><button type="button" class="btn soft sm" data-act="say" data-text="${esc(it.audio)}">🔊 Nghe chuẩn</button><button type="button" class="btn ghost sm" data-act="say-slow" data-text="${esc(it.audio)}">🐢 Nghe chậm</button></div>` : ''}
            </div>` : ''}
            <div class="fill-sentence" lang="en">${parts[0]}<label class="sr-only" for="f${R.idx}-${i}">Chỗ trống ${i + 1}</label><input class="fill-input ${parts[0].includes(':') ? 'wide' : ''} ${s.checked ? (ok ? 'correct' : 'missed') : ''}" id="f${R.idx}-${i}" data-fill="${i}" value="${esc(s.answers[i] || '')}" autocomplete="off" autocapitalize="off" spellcheck="false" ${s.checked ? 'disabled' : ''} />${parts[1] || ''}</div>
            ${step.guided && it.hint && !s.checked ? (s.hints[i] ? `<span class="hint">💡 ${esc(it.hint)}</span>` : `<button class="btn ghost sm" data-act="hint" data-i="${i}">Gợi ý</button>`) : ''}
            ${s.checked ? `<p class="fb ${ok ? 'ok' : ''}">${ok ? '✓ ' : '→ '}${esc(it.explain)}</p>` : ''}</div>`;
        }).join('')}</div>`;
        const all = step.items.every((_, i) => norm(s.answers[i]));
        return `${head}${step.intro ? `<p class="muted">${esc(step.intro)}</p>` : ''}${alphaHtml}${player(step, s)}${rows}
          <div style="margin-top:16px">${s.checked ? feedback(step, s) : `<button class="btn primary" data-act="check" ${all ? '' : 'disabled'}>Kiểm tra</button>`}</div>`;
      }
      case 'write': {
        const key = `${R.kind}-${R.id}-${R.idx}`;
        const text = s.text ?? S.drafts[key] ?? '';
        s.text = text;
        return `${head}<p>${esc(step.prompt)}</p>
          ${step.frame ? (s.frame ? `<div class="frame" lang="en">${esc(step.frame)}</div><p class="small muted">Đã xem khung câu — bài này sẽ được ghi nhận là có hỗ trợ.</p>` : `<button class="btn ghost sm" data-act="frame">Xem khung câu gợi ý</button>`) : ''}
          <label class="sr-only" for="write-${key}">Bài viết của bạn</label>
          <textarea id="write-${key}" data-write="${key}" lang="en" placeholder="Viết bằng tiếng Anh…">${esc(text)}</textarea>
          <div class="write-meta"><span id="wc">${counts(text)}</span><span class="spacer"></span><span class="save-state" id="save-state">Đã lưu trên thiết bị</span></div>
          ${step.checks.length ? `<fieldset><legend style="font-size:.95rem">Tự kiểm tra trước khi nộp</legend><div class="checklist">${step.checks.map((c, i) => `<label><input type="checkbox" data-check="${i}" ${s.checks?.[i] ? 'checked' : ''} /> ${esc(c)}</label>`).join('')}</div></fieldset>` : ''}
          ${s.saved ? `<div class="notice mint" role="status"><span class="ico">✅</span><p>Đã lưu phiên bản v${s.version}. Bài viết không bị chấm tự động. ${step.checkOnly ? '' : 'Bạn có thể sửa và nộp phiên bản mới — phiên bản cũ vẫn được giữ.'}</p></div>`
            : `<div class="row"><button class="btn primary" data-act="save-write" ${text.trim() ? '' : 'disabled'} id="save-write">Nộp bài viết</button>${step.skippable ? '' : '<button class="btn ghost" data-act="later">Để sau</button>'}</div>`}`;
      }
      case 'record': return head + renderRecorder(step, s);
      case 'light':
        return `${head}<p class="muted">Ngày 7 là ngày nhẹ. Bất kỳ lựa chọn nào cũng hợp lệ.</p>
          ${step.gardenSummary ? `<div class="card" style="margin:16px 0;background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:16px;">
            <h3 style="margin-top:0">🌱 Cột mốc sau 1 tuần</h3>
            <ul style="margin:0;padding-left:20px;line-height:1.6">
              ${step.gardenSummary.map((g) => `<li><strong>${esc(g.day)}:</strong> ${esc(g.text)}</li>`).join('')}
            </ul>
          </div>` : ''}
          <div class="light-opts">
          <button data-act="light" data-choice="review" id="light-review"><span class="em">🔁</span><strong>Ôn tập ngắn</strong><span>${S.dueReviews.some((r) => !r.done) ? 'Có bài ôn đang chờ.' : 'Vài câu mới để giữ nhịp.'}</span></button>
          <button data-act="light" data-choice="catchup" id="light-catchup"><span class="em">🧩</span><strong>Bù bài còn thiếu</strong><span>${D.days.filter((d) => d.n < 7 && !S.completedDays.includes(d.n)).length ? 'Quay lại ngày chưa xong.' : 'Bạn không thiếu bài nào.'}</span></button>
          <button data-act="light" data-choice="rest" id="light-rest"><span class="em">☁️</span><strong>Nghỉ hôm nay</strong><span>Nghỉ là một phần của việc học.</span></button></div>`;
      default: return head;
    }
  }

  function feedback(step, s) {
    const total = step.type === 'choice' ? step.questions.length : step.items.length;
    const ok = step.type === 'choice' ? step.questions.filter((q, i) => s.answers[i] === q.answer).length : step.items.filter((it, i) => it.accepted.includes(norm(s.answers[i]))).length;
    const msg = ok === total ? 'Làm tốt lắm.' : ok === 0 ? 'Chưa đúng lần này — không sao, đây là một phần của việc học.' : 'Có câu đúng, có câu chưa.';
    return `<div class="feedback" role="status"><h3>${msg}</h3>
      <p class="small muted" style="margin:0">${ok < total ? 'Một lần chưa đúng không có nghĩa là yếu. Bạn sẽ gặp lại điều này ở một ngữ cảnh khác.' : 'Một lần đúng là một tín hiệu tốt, chưa phải là thành thạo.'}</p>
      <div class="cond">${condChips(step, s)}</div></div>`;
  }

  function counts(t) {
    const sentences = t.split(/[.!?]+/).map((x) => x.trim()).filter((x) => x.split(/\s+/).length >= 2).length;
    const words = t.trim() ? t.trim().split(/\s+/).length : 0;
    return `${sentences} câu · ${words} từ`;
  }

  function renderRecorder(step, s) {
    const checks = `<fieldset><legend style="font-size:.95rem">Nghe lại và tự kiểm tra</legend><div class="checklist">${step.checks.map((c, i) => `<label><input type="checkbox" data-check="${i}" ${s.checks?.[i] ? 'checked' : ''} /> ${esc(c)}</label>`).join('')}</div></fieldset>`;
    const privacy = '<p class="small muted">🔒 Bản ghi chỉ bạn nghe được. Bạn có thể xoá bất cứ lúc nào. Không có chấm phát âm tự động.</p>';
    if (s.rec === 'denied') return `<p>${esc(step.prompt)}</p><div class="notice warn" role="alert"><span class="ico">🎙️</span><div>
        <p><strong>Không truy cập được micro.</strong> Đây là vấn đề kỹ thuật, không phải lỗi của bạn — không có gì bị tính là chưa đạt.</p>
        <div class="row"><button class="btn sm" data-act="rec-start">Thử lại</button><button class="btn sm" data-act="later">Để sau</button><button class="btn ghost sm" data-act="rec-alt">Viết thay lần này</button></div></div></div>
        ${s.alt ? `<label class="sr-only" for="alt-text">Viết lời giới thiệu thay cho ghi âm</label><textarea id="alt-text" data-alt="1" lang="en" placeholder="Viết lời giới thiệu bạn định nói…" style="margin-top:14px">${esc(s.altText || '')}</textarea>
          <p class="small muted">Phần viết thay được lưu như bài viết, không tính là bằng chứng nói.</p>${s.altSaved ? '<div class="notice mint"><span class="ico">✅</span><p>Đã lưu. Bài ghi âm vẫn được giữ chỗ trong kế hoạch.</p></div>' : '<button class="btn primary" data-act="alt-save">Lưu phần viết</button>'}` : ''}`;
    if (s.rec === 'recording') return `<p>${esc(step.prompt)}</p><div class="recorder"><button class="rec-btn on" data-act="rec-stop" aria-label="Dừng ghi âm">■</button>
        <div class="rec-time" id="rec-time" aria-live="off">0:00</div><div class="rec-range" aria-hidden="true"><i id="rec-bar" style="width:0%"></i></div><p class="small muted">Đang ghi… Vùng xanh là 20–30 giây. Tự dừng ở 30 giây.</p></div>`;
    if (['recorded', 'uploadFailed', 'saved'].includes(s.rec)) return `<p>${esc(step.prompt)}</p><div class="recorder">
        <p style="margin:0"><strong>Bản ghi ${s.duration} giây</strong> ${s.duration < 20 ? '<span class="chip assessment">hơi ngắn — mục tiêu 20–30 giây</span>' : '<span class="chip ok">đúng độ dài</span>'}</p>
        ${s.url ? `<audio controls src="${s.url}"></audio>` : '<p class="small muted">(Bản nghe lại chỉ có trong phiên này.)</p>'}</div>
        ${checks}
        ${s.rec === 'uploadFailed' ? `<div class="notice warn" role="alert"><span class="ico">☁️</span><div><p><strong>Tải lên chưa thành công.</strong> Bản ghi vẫn còn trên máy bạn — không mất gì, và không bị tính là chưa đạt.</p><div class="row"><button class="btn sm" data-act="rec-save">Thử lại</button><button class="btn ghost sm" data-act="later">Để sau</button></div></div></div>` : ''}
        ${s.rec === 'saved' ? `<div class="notice mint" role="status"><span class="ico">✅</span><p>Đã lưu bản ghi v${s.version}. Bạn có thể ghi lại để tạo phiên bản mới.</p></div>` : ''}
        ${s.rec !== 'uploadFailed' ? `<div class="row"><button class="btn" data-act="rec-reset">Ghi lại</button>${s.rec === 'recorded' ? '<button class="btn primary" data-act="rec-save" id="rec-save">Lưu bản ghi</button>' : ''}</div>` : ''}${privacy}`;
    return `<p>${esc(step.prompt)}</p><div class="recorder"><button class="rec-btn" data-act="rec-start" aria-label="Bắt đầu ghi âm" id="rec-start">🎙</button>
      <p style="margin:14px 0 0"><strong>Nhấn để ghi âm</strong></p><p class="small muted">Mục tiêu 20–30 giây. Nói chậm, rõ là đủ.</p></div>${privacy}
      <button class="btn ghost sm" data-act="later">Để sau</button>`;
  }

  function viewRunner() {
    if (R.finished) return viewRunDone();
    const step = R.steps[R.idx]; const s = st();
    const done = stepDone(step, s);
    const kindLabel = { lesson: 'Bài học', review: 'Ôn tập', verify: 'Kiểm tra ngắn', check: 'Kiểm tra đầu vào' }[R.kind];
    const bars = R.steps.map((_, i) => `<span class="${i < R.idx ? 'on' : i === R.idx ? 'now' : ''}"></span>`).join('');
    const stepIcons = {
      dialogue: '💬',
      ipa: '🔤',
      pillars: '🏛️',
      words: '📚',
      traps: '⚠️',
      'grammar-pieces': '🧩',
      choice: '✅',
      fill: '✍️',
      write: '📝',
      record: '🎙️',
      speak: '🎙️',
      pattern: '📐',
      explain: '🌱',
      light: '☁️'
    };
    const outlineHtml = R.steps.map((stItem, i) => {
      const isCur = i === R.idx;
      const isPast = i < R.idx;
      const canJump = R.kind === 'lesson';
      return `<li>
        <button type="button" class="runner-step-nav-btn ${isCur ? 'is-current' : ''} ${isPast ? 'is-done' : ''}" ${canJump ? `data-act="jump-step" data-idx="${i}"` : 'disabled'}>
          <span class="step-nav-num">${isPast ? '✓' : i + 1}</span>
          <span class="step-nav-title">${stepIcons[stItem.type] || '•'} ${esc(stItem.title)}</span>
        </button>
      </li>`;
    }).join('');

    const dayQuickJump = R.kind === 'lesson' ? `
      <div class="runner-day-switcher" role="navigation" aria-label="Chuyển nhanh giữa 7 ngày trong tuần">
        <span class="day-switcher-label">📅 Chuyển nhanh Ngày học:</span>
        <div class="day-switcher-pills">
          ${D.days.map((dItem) => {
            const isCurDay = dItem.n === R.id;
            const isDoneDay = S.completedDays.includes(dItem.n);
            return `<a href="#/run/lesson/${dItem.n}" class="day-switch-pill ${isCurDay ? 'active' : ''} ${isDoneDay ? 'done' : ''}" title="Ngày ${dItem.n}: ${esc(dItem.title)}">
              <span>Ngày ${dItem.n}</span>${isDoneDay ? ' ✓' : ''}
            </a>`;
          }).join('')}
        </div>
      </div>` : '';

    return `<section class="view runner" aria-labelledby="step-title">
      ${dayQuickJump}
      <div class="runner-head"><button class="btn ghost sm" data-act="exit" id="runner-exit">← ${R.kind === 'lesson' ? 'Lưu &amp; về Hôm nay' : 'Thoát'}</button>
        <div class="grow"><div class="kicker">${kindLabel}${R.short ? ` · ngày ngắn (${R.steps.length}/${R.totalSteps} bước cốt lõi)` : ''}</div><h1 style="font-size:1.35rem;margin:0">${esc(R.title)}</h1>
          <div class="steps-bar" role="progressbar" aria-label="Bước trong bài" aria-valuemin="1" aria-valuemax="${R.steps.length}" aria-valuenow="${R.idx + 1}">${bars}</div></div>
        <span class="chip ${R.mood}">${esc(R.posture)}</span></div>
      <div class="runner-workspace">
        <aside class="runner-sidebar" aria-label="Mục lục bước học &amp; Ghi chú nhanh">
          <div class="card runner-outline-card">
            <div class="outline-header">
              <span class="kicker" style="margin:0">MỤC LỤC BÀI HỌC</span>
              <span class="muted small">Bước ${R.idx + 1}/${R.steps.length}</span>
            </div>
            <ol class="runner-step-nav-list">${outlineHtml}</ol>
            <div class="runner-sidebar-nav-actions">
              ${R.idx > 0 ? '<button class="btn ghost sm" data-act="back">← Bước trước</button>' : '<span></span>'}
              ${step.type === 'light' ? '' : `<button class="btn primary sm" data-act="next" ${done ? '' : 'disabled'}>${R.idx === R.steps.length - 1 ? 'Hoàn thành' : 'Tiếp theo →'}</button>`}
            </div>
          </div>
          <div class="card runner-ipa-cheat-card">
            <div class="kicker" style="margin-bottom:6px">🧭 MẸO GIẢI MÃ KÝ HIỆU IPA</div>
            <ul class="ipa-cheat-list">
              <li><code>ˈ</code> <strong>Dấu phẩy trên:</strong> Đọc TO &amp; CAO giọng âm ngay sau nó (như thêm dấu sắc).</li>
              <li><code>ː</code> <strong>Dấu hai chấm:</strong> Ngân dài nguyên âm thêm 1 nhịp (VD: <code>/iː/</code> = <em>i...</em>).</li>
              <li><code>.</code> <strong>Dấu chấm giữa:</strong> Ranh giới tách các âm tiết trong từ dài.</li>
              <li><code>/z/ /t/ /m/</code> <strong>Âm cuối:</strong> Luôn khép nhẹ môi hoặc bật nhẹ lưỡi ở cuối từ.</li>
            </ul>
          </div>
        </aside>
        <div class="runner-main-col">
          <article class="card step-card">${renderStep(step, s)}</article>
          <div class="runner-foot">
            ${R.idx > 0 ? '<button class="btn ghost" data-act="back" id="step-back">← Quay lại</button>' : ''}
            ${step.skippable && !done ? '<button class="btn ghost" data-act="skip-item" id="skip-item">Bỏ qua câu này</button>' : ''}
            <span class="spacer"></span><span class="muted small">Bước ${R.idx + 1}/${R.steps.length}</span>
            ${step.type === 'light' ? '' : `<button class="btn primary" data-act="next" id="step-next" ${done ? '' : 'disabled'}>${R.idx === R.steps.length - 1 ? 'Hoàn thành' : 'Tiếp tục'} <span class="arrow">→</span></button>`}
          </div>
        </div>
      </div></section>`;
  }

  function viewRunDone() {
    const ev = S.evidence.slice(R.evStart);
    const ind = ev.filter((e) => e.independent).length;
    const extra = R.doneNote ? `<div class="notice mint" style="text-align:left"><span class="ico">🔍</span><p>${esc(R.doneNote)}</p></div>` : '';
    return `<section class="view runner"><div class="card feature step-card" style="text-align:center">
      ${mascot()}<div class="kicker" style="justify-content:center">Đã xong</div><h1 style="font-size:1.7rem">${esc(R.title)}</h1>
      <p class="muted">${ev.length ? `Bài này tạo ${ev.length} quan sát (${ind} tự làm, ${ev.length - ind} có hỗ trợ).` : 'Bài này là tiếp xúc hoặc luyện tập — không tạo bằng chứng năng lực, và điều đó hoàn toàn bình thường.'}</p>
      ${extra}
      <p class="small muted">Hoàn thành một bài không có nghĩa là đã thành thạo. Lingora sẽ kiểm tra lại sau vài ngày, với nội dung mới.</p>
      <div class="runner-foot" style="justify-content:center"><a class="btn" href="#/progress">Xem tiến độ</a><a class="btn primary" href="#/today" id="run-done-today">Về Hôm nay <span class="arrow">→</span></a></div>
    </div></section>`;
  }

  /* ---------------- Runner actions ---------------- */
  function checkStep() {
    const step = R.steps[R.idx]; const s = st();
    s.checked = true;
    const ev = step.evidence;
    const record = ev && ev.mode !== 'none' && !s.audioFailed;
    if (step.type === 'choice') {
      step.questions.forEach((q, qi) => {
        const correct = s.answers[qi] === q.answer;
        if (R.kind === 'verify' && !correct && !step.when) R.verifyFailed = true;
        if (record) addEvidence({ claim: ev.claim, correct, independent: !s.transcript, firstPass: step.audio ? s.plays <= 1 && !s.transcript : null, support: [s.plays > 1 && 'replay', s.transcript && 'transcript'].filter(Boolean), transfer: !!ev.transfer, delayed: !!ev.delayed, context: ev.context, label: step.title });
      });
    } else {
      step.items.forEach((it, i) => {
        const correct = it.accepted.includes(norm(s.answers[i]));
        if (R.kind === 'verify' && !correct && !step.when) R.verifyFailed = true;
        if (record) addEvidence({ claim: ev.claim, correct, independent: !s.hints[i], support: s.hints[i] ? ['hint'] : [], transfer: !!ev.transfer, delayed: !!ev.delayed, context: ev.context, label: step.title });
      });
    }
    save(); render();
  }

  function goNext() {
    stopRecorder();
    let i = R.idx + 1;
    while (i < R.steps.length && R.steps[i].when === 'failed' && !R.verifyFailed) i++;
    if (i >= R.steps.length) return finishRun();
    R.idx = i; persistProgress(); render(); focusMain();
  }

  function finishRun() {
    const route = routeOf();
    if (R.kind === 'lesson') {
      const n = R.id;
      if (!S.completedDays.includes(n)) S.completedDays.push(n);
      if (R.short) { if (!S.partialDays.includes(n)) S.partialDays.push(n); } else S.partialDays = S.partialDays.filter((x) => x !== n);
      if (n >= S.currentDay) S.currentDay = n + 1;
      ({ 2: ['BE'], 3: ['READ', 'LISTEN'], 4: ['QA'] }[n] || []).forEach((c) => {
        if (!S.dueReviews.some((r) => r.claim === c && !r.done)) S.dueReviews.push({ claim: c, createdDay: S.simDay, dueDay: S.simDay + 2, done: false });
      });
      S.inProgress = null;
    } else if (R.kind === 'review') {
      S.dueReviews.filter((r) => r.claim === R.id && r.dueDay <= S.simDay).forEach((r) => { r.done = true; });
    } else if (R.kind === 'verify') {
      if (!R.verifyFailed) { S.misses[R.id] = { n: 0, suspected: false }; R.doneNote = 'Không xác nhận khó khăn — có thể lần trước chỉ là nhầm lẫn. Không có nhãn “yếu” nào được tạo.'; }
      else {
        const lastNew = S.evidence.slice(R.evStart).filter((e) => e.context === 'recover-new');
        const result = lastNew.length ? (lastNew.every((e) => e.correct) ? 'có vẻ hiệu quả, sẽ kiểm tra lại sau' : 'chưa rõ, sẽ thử cách khác') : 'chưa rõ';
        S.interventions.push({ claim: R.id, result, simDay: S.simDay });
        S.misses[R.id] = { n: 0, suspected: false };
        S.dueReviews.push({ claim: R.id, createdDay: S.simDay, dueDay: S.simDay + 2, done: false });
        R.doneNote = `Đã thử một mẹo nhỏ và một câu mới. Kết quả: ${result}. Lingora sẽ kiểm tra lại sau 2 ngày.`;
      }
    } else if (R.kind === 'check') {
      finishCheck(); return;
    }
    completeBlockByRoute(route);
    R.finished = true; save(); render(); focusMain();
  }

  function finishCheck() {
    const results = {};
    ['READ', 'LISTEN', 'BE', 'QA'].forEach((c) => {
      const e = S.evidence.slice(R.evStart).filter((x) => x.claim === c && x.context === 'check');
      results[c] = e.length && e.every((x) => x.correct && x.independent) ? 'demo' : 'need';
    });
    results.WRITE = S.artifacts.some((a) => a.context === 'check') ? 'saved' : 'need';
    results.SPEAK = 'none';
    const recommended = ['READ', 'BE', 'QA'].every((c) => results[c] === 'demo') ? 3 : 1;
    S.check = { skipped: false, results, recommended };
    R = null; save(); location.hash = '#/check/result';
  }

  function exitRun() {
    stopRecorder();
    if (R && !R.finished && R.kind === 'lesson') { persistProgress(); toast('Đã lưu. Bạn có thể tiếp tục bất cứ lúc nào, trên bất kỳ thiết bị nào.'); generatePlan(); }
    R = null; location.hash = S.onboarded ? '#/today' : '#/welcome';
  }

  /* ---------------- Recorder ---------------- */
  async function startRecorder() {
    const s = st();
    if (S.flags.micDenied || !navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { s.rec = 'denied'; render(); return; }
    try { REC.stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch { s.rec = 'denied'; render(); return; }
    REC.chunks = []; REC.mr = new MediaRecorder(REC.stream);
    REC.mr.ondataavailable = (e) => REC.chunks.push(e.data);
    REC.mr.onstop = () => {
      if (s.url) URL.revokeObjectURL(s.url);
      s.url = URL.createObjectURL(new Blob(REC.chunks, { type: REC.mr.mimeType || 'audio/webm' }));
      s.duration = Math.max(1, Math.round((Date.now() - REC.started) / 1000));
      s.rec = 'recorded'; REC.stream?.getTracks().forEach((t) => t.stop()); REC.stream = null; render();
    };
    REC.started = Date.now(); REC.mr.start(); s.rec = 'recording'; render();
    REC.timer = setInterval(() => {
      const sec = (Date.now() - REC.started) / 1000;
      const t = document.getElementById('rec-time'); const bar = document.getElementById('rec-bar');
      if (t) t.textContent = `0:${String(Math.floor(sec)).padStart(2, '0')}`;
      if (bar) bar.style.width = `${Math.min(100, (sec / 30) * 100)}%`;
      if (sec >= 30) stopRecorder();
    }, 250);
  }
  function stopRecorder() {
    clearInterval(REC.timer); REC.timer = null;
    if (REC.mr && REC.mr.state === 'recording') REC.mr.stop();
    else if (REC.stream) { REC.stream.getTracks().forEach((t) => t.stop()); REC.stream = null; }
  }

  function saveArtifact(a) {
    const version = S.artifacts.filter((x) => x.key === a.key).length + 1;
    S.artifacts.push({ ...a, version, simDay: S.simDay, at: Date.now() });
    return version;
  }

  /* ---------------- Events ---------------- */
  document.addEventListener('click', async (ev) => {
    const simBtn = ev.target.closest('[data-sim]');
    if (simBtn) return simulate(simBtn.dataset.sim);
    const el = ev.target.closest('[data-act]');
    if (!el) return;
    const act = el.dataset.act;
    const s = R && !R.finished ? st() : null;
    const step = R && !R.finished ? R.steps[R.idx] : null;
    switch (act) {
      case 'go-check': S.onboarded = true; save(); location.hash = '#/check'; break;
      case 'skip-check':
        S.onboarded = true; S.check = { skipped: true, recommended: 1 }; S.currentDay = 1; S.plans = {}; save();
        toast('Bắt đầu từ Ngày 1. Mọi kỹ năng ở trạng thái “Chưa biết” — không phải “yếu”.'); location.hash = '#/today'; break;
      case 'accept-start': S.currentDay = Number(el.dataset.day); S.plans = {}; save(); location.hash = '#/today'; break;
      case 'mode': S.mode = el.dataset.mode; generatePlan(); render(); break;
      case 'block-go': case 'block-skip': case 'block-defer': {
        const b = plan().blocks.find((x) => x.id === el.dataset.id); if (!b) break;
        if (act === 'block-skip') { b.status = 'SKIPPED'; toast('Đã bỏ qua. Đây là lựa chọn của bạn, không phải thất bại.'); }
        else if (act === 'block-defer') { b.status = 'DEFERRED'; toast('Đã để sau. Việc này sẽ quay lại vào ngày khác.'); }
        else if (b.type === 'BREAK') { b.status = 'COMPLETED'; toast('Nghỉ xong rồi. Sẵn sàng cho phần tiếp theo.'); }
        else if (b.type === 'FINISH') { b.status = 'COMPLETED'; save(); location.hash = '#/done'; return; }
        else { save(); location.hash = b.route; return; }
        save(); render(); break;
      }
      case 'exit': exitRun(); break;
      case 'back': stopRecorder(); R.idx = Math.max(0, R.idx - 1); persistProgress(); render(); break;
      case 'jump-step': {
        if (R && R.kind === 'lesson') {
          stopRecorder();
          const targetIdx = Number(el.dataset.idx);
          if (!Number.isNaN(targetIdx) && targetIdx >= 0 && targetIdx < R.steps.length) {
            R.idx = targetIdx;
            persistProgress();
            render();
            focusMain();
          }
        }
        break;
      }
      case 'next': goNext(); break;
      case 'skip-item': goNext(); break;
      case 'check': checkStep(); break;
      case 'say': if (!speak(el.dataset.text)) toast('Không phát được âm thanh — đây là lỗi kỹ thuật, không phải lỗi của bạn.'); break;
      case 'say-slow': if (!speak(el.dataset.text, null, 0.55)) toast('Không phát được âm thanh — đây là lỗi kỹ thuật, không phải lỗi của bạn.'); break;
      case 'select-ipa-tab': {
        if (s && step?.phonemes) {
          s.ipaIdx = Math.min(Math.max(0, Number(el.dataset.idx) || 0), step.phonemes.length - 1);
          render();
          const ph = step.phonemes[s.ipaIdx];
          if (ph) speak(ph.audioWord || ph.example.split(' ')[0]);
        }
        break;
      }
      case 'prev-ipa-tab': {
        if (s && step?.phonemes) {
          s.ipaIdx = Math.max(0, (s.ipaIdx || 0) - 1);
          render();
        }
        break;
      }
      case 'next-ipa-tab': {
        if (s && step?.phonemes) {
          s.ipaIdx = Math.min(step.phonemes.length - 1, (s.ipaIdx || 0) + 1);
          render();
        }
        break;
      }
      case 'toggle-vi': s.vi = !s.vi; render(); break;
      case 'toggle-vi-turn': {
        s.viTurns ||= {};
        const idx = el.dataset.idx;
        s.viTurns[idx] = !s.viTurns[idx];
        render();
        break;
      }
      case 'toggle-breakdown-turn': {
        s.breakdownTurns ||= {};
        const idx = el.dataset.idx;
        s.breakdownTurns[idx] = s.breakdownTurns[idx] === false;
        render();
        break;
      }
      case 'pick-spell-name': {
        if (s) {
          s.customSpellName = el.dataset.name;
          render();
          const letters = normalizeAsciiLetters(el.dataset.name).slice(0, 12).split('');
          if (letters.length) speak(`${letters.join('. ')}. ${el.dataset.name}.`, null, 0.6);
        }
        break;
      }
      case 'hint': s.hints[el.dataset.i] = true; render(); break;
      case 'transcript': s.transcript = true; render(); break;
      case 'retry-audio': s.audioFailed = false; render(); break;
      case 'play': {
        s.plays += 1;
        const ok = speak(step.audio, () => el.classList.remove('playing'));
        if (!ok) { s.audioFailed = true; render(); break; }
        el.classList.add('playing');
        const meta = el.parentElement.querySelector('.small strong'); if (meta) meta.textContent = `Đã nghe ${s.plays} lần`;
        break;
      }
      case 'frame': s.frame = true; render(); break;
      case 'save-write': {
        const key = `${R.kind}-${R.id}-${R.idx}`;
        const text = s.text || '';
        s.version = saveArtifact({ key, type: 'text', title: step.title, text, claim: step.claim, context: step.context, note: s.frame ? 'có xem khung câu' : '' });
        s.saved = true; delete S.drafts[key];
        const ticked = Object.values(s.checks || {}).filter(Boolean).length;
        const sentences = text.split(/[.!?]+/).map((x) => x.trim()).filter((x) => x.split(/\s+/).length >= 2).length;
        if (!step.checkOnly && step.checks.length && ticked >= step.checks.length - 1 && sentences >= 3) {
          addEvidence({ claim: step.claim, correct: true, independent: !s.frame, kind: 'selfcheck', transfer: !!step.transfer, context: step.context, label: step.title, support: s.frame ? ['frame'] : [] });
          if (step.transfer) addEvidence({ claim: 'BE', correct: true, independent: !s.frame, kind: 'selfcheck', transfer: true, context: 'friend-intro', label: step.title, support: [] });
        }
        save(); render(); break;
      }
      case 'later': s.later = true; stopRecorder(); toast('Đã để sau. Việc này vẫn được giữ chỗ — không bị tính là chưa đạt.'); render(); break;
      case 'rec-start': await startRecorder(); break;
      case 'rec-stop': stopRecorder(); break;
      case 'rec-reset': if (s.url) URL.revokeObjectURL(s.url); Object.assign(s, { rec: 'idle', url: null, duration: 0 }); render(); break;
      case 'rec-save':
        if (S.flags.uploadFail) { s.rec = 'uploadFailed'; render(); break; }
        s.version = saveArtifact({ key: `${R.kind}-${R.id}-${R.idx}`, type: 'audio', title: step.title, duration: s.duration, claim: step.claim, context: step.context });
        s.rec = 'saved';
        if (Object.values(s.checks || {}).filter(Boolean).length >= step.checks.length - 1 && s.duration >= 15) addEvidence({ claim: 'SPEAK', correct: true, independent: true, kind: 'selfcheck', context: step.context, label: step.title, support: [] });
        save(); render(); break;
      case 'rec-alt': s.alt = true; render(); break;
      case 'alt-save':
        saveArtifact({ key: `${R.kind}-${R.id}-${R.idx}-alt`, type: 'text', title: 'Viết thay cho ghi âm', text: s.altText || '', claim: 'WRITE', context: 'speak-alt', note: 'không tính là bằng chứng nói' });
        s.altSaved = true; save(); render(); break;
      case 'light': {
        const choice = el.dataset.choice;
        if (!S.completedDays.includes(7)) S.completedDays.push(7);
        if (choice === 'rest') S.restDays.push(7);
        S.inProgress = null; S.currentDay = 8; completeBlockByRoute(routeOf()); save();
        if (choice === 'rest') { R.title = 'Ngày 7: Nghỉ'; R.doneNote = 'Nghỉ là một phần của việc học. Ngày nghỉ không làm giảm bất kỳ tín hiệu nào của bạn.'; R.finished = true; render(); break; }
        if (choice === 'review') { const due = S.dueReviews.find((r) => !r.done); R = null; location.hash = `#/run/review/${due ? due.claim : 'BE'}`; break; }
        const miss = D.days.find((d) => d.n < 7 && !S.completedDays.includes(d.n));
        R = null; if (miss) location.hash = `#/run/lesson/${miss.n}`; else { toast('Bạn không thiếu bài nào. Hãy nghỉ ngơi nhé!'); location.hash = '#/today'; }
        break;
      }
      case 'inspect-tree-stage':
        protoInspectedStage = Number(el.dataset.stage);
        render();
        break;
      case 'reset-tree-stage':
        protoInspectedStage = null;
        render();
        break;
      default: break;
    }
  });

  document.addEventListener('input', (ev) => {
    const t = ev.target;
    if (t.dataset.minutes) return;
    if (!R || R.finished) return;
    const s = st();
    if (t.dataset.fill !== undefined) {
      s.answers[t.dataset.fill] = t.value;
      const step = R.steps[R.idx];
      const btn = document.querySelector('[data-act="check"]');
      if (btn) btn.disabled = !step.items.every((_, i) => norm(s.answers[i]));
    } else if (t.dataset.write) {
      s.text = t.value; s.saved = false;
      const ss = document.getElementById('save-state'); ss.textContent = 'Đang lưu…'; ss.classList.add('saving');
      clearTimeout(t._t); t._t = setTimeout(() => { S.drafts[t.dataset.write] = t.value; save(); ss.textContent = 'Đã lưu trên thiết bị'; ss.classList.remove('saving'); }, 500);
      document.getElementById('wc').textContent = counts(t.value);
      const btn = document.getElementById('save-write');
      if (btn) btn.disabled = !t.value.trim();
      else if (!document.getElementById('save-write')) { /* edited after save: re-render to show submit button */ clearTimeout(t._r); t._r = setTimeout(() => { const pos = t.selectionStart; render(); const n = document.querySelector('[data-write]'); if (n) { n.focus(); n.setSelectionRange(pos, pos); } }, 50); }
    } else if (t.dataset.alt) { s.altText = t.value; }
    else if (t.dataset.spellName) {
      s.customSpellName = t.value;
      const pos = t.selectionStart;
      render();
      const inp = document.getElementById('custom-spell-input');
      if (inp) { inp.focus(); try { inp.setSelectionRange(pos, pos); } catch {} }
    }
  });

  document.addEventListener('change', (ev) => {
    const t = ev.target;
    if (t.dataset.minutes) { S.minutes = Number(t.value); S.mode = S.minutes <= 15 ? 'short' : 'normal'; save(); return; }
    if (t.dataset.flag) { S.flags[t.dataset.flag] = t.checked; save(); toast(t.checked ? 'Đã bật giả lập lỗi.' : 'Đã tắt giả lập lỗi.'); return; }
    if (!R || R.finished) return;
    const s = st();
    if (t.dataset.q !== undefined) {
      s.answers[t.dataset.q] = Number(t.value);
      const step = R.steps[R.idx];
      const btn = document.querySelector('[data-act="check"]');
      if (btn) btn.disabled = !step.questions.every((_, qi) => s.answers[qi] !== undefined);
    } else if (t.dataset.check !== undefined) { (s.checks ||= {})[t.dataset.check] = t.checked; }
  });

  function simulate(kind) {
    if (kind === 'reset') { if (!confirm('Xoá toàn bộ dữ liệu prototype?')) return; localStorage.removeItem(KEY); S = fresh(); R = null; location.hash = '#/welcome'; render(); return; }
    stopRecorder(); R = null;
    if (kind === 'nextDay') { S.simDay += 1; S.welcomeBack = 0; toast(`Sang ngày ${S.simDay}. Kế hoạch đã được lập lại.`); }
    if (kind === 'absent') { S.simDay += 4; S.welcomeBack = 3; S.mode = 'short'; toast('Giả lập: bạn vừa quay lại sau 3 ngày nghỉ.'); }
    delete S.plans[S.simDay]; save();
    if (location.hash !== '#/today') location.hash = '#/today'; else render();
  }

  document.getElementById('proto-toggle').addEventListener('click', (e) => {
    const body = document.getElementById('proto-body'); const open = body.hidden;
    body.hidden = !open; e.currentTarget.setAttribute('aria-expanded', String(open));
  });

  /* ---------------- Router ---------------- */
  function focusMain() { app.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  function render() {
    const [a, b, c] = (location.hash.replace(/^#\/?/, '') || '').split('/');
    let html;
    if (!S.onboarded && !['welcome', 'check', 'run'].includes(a)) { location.hash = '#/welcome'; return; }
    if (a === 'run') {
      if (!R || R.kind !== b || String(R.id) !== String(b === 'check' ? R.id : c)) {
        if (!startRun(b, b === 'check' ? 'start' : c)) { location.hash = '#/today'; return; }
      }
      html = viewRunner();
    } else {
      if (R) { stopRecorder(); R = null; }
      html = a === 'welcome' ? viewWelcome() : a === 'check' ? (b === 'result' ? viewCheckResult() : viewCheckIntro())
        : a === 'roadmap' ? viewRoadmap() : a === 'progress' ? viewProgress() : a === 'done' ? viewDone() : viewToday();
    }
    app.innerHTML = html;
    document.getElementById('topbar').classList.toggle('hidden-nav', a === 'welcome');
    document.querySelectorAll('[data-nav]').forEach((n) => n.toggleAttribute('aria-current', n.dataset.nav === (a || 'today')) || (n.dataset.nav === (a || 'today') && n.setAttribute('aria-current', 'page')));
    document.querySelectorAll('[data-nav]').forEach((n) => { if (n.dataset.nav === (a || 'today')) n.setAttribute('aria-current', 'page'); else n.removeAttribute('aria-current'); });
    document.getElementById('sim-day').textContent = `Ngày giả lập: ${S.simDay}`;
    Object.entries(S.flags).forEach(([k, v]) => { const i = document.querySelector(`[data-flag="${k}"]`); if (i) i.checked = v; });
  }

  window.addEventListener('hashchange', () => { render(); focusMain(); });
  if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => {};
  render();

  /* ---------------- Interactive Live Particle & Acoustic Wave Background ---------------- */
  (function initLiveBackground() {
    const cvs = document.getElementById('bg-interactive-canvas');
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };
    const palette = [
      'rgba(139, 124, 246, 0.42)', // Lavender
      'rgba(243, 168, 196, 0.44)', // Blush
      'rgba(52, 211, 153, 0.38)',  // Mint
      'rgba(246, 200, 159, 0.42)', // Peach
      'rgba(109, 92, 232, 0.35)'   // Indigo
    ];

    const particles = [];
    const COUNT = 38;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      cvs.width = Math.floor(w * dpr);
      cvs.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticles() {
      particles.length = 0;
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.55,
          vy: (Math.random() - 0.5) * 0.55 - 0.15,
          r: 2.2 + Math.random() * 4.2,
          color: palette[i % palette.length],
          phase: Math.random() * Math.PI * 2,
          speed: 0.015 + Math.random() * 0.02
        });
      }
    }

    resize();
    createParticles();
    window.addEventListener('resize', () => { resize(); createParticles(); });

    window.addEventListener('mousemove', (e) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
      mouse.active = true;
    }, { passive: true });

    window.addEventListener('mouseleave', () => { mouse.active = false; });

    let tick = 0;
    function stepFrame() {
      tick += 0.012;
      ctx.clearRect(0, 0, w, h);

      if (mouse.active) {
        mouse.x += (mouse.tx - mouse.x) * 0.08;
        mouse.y += (mouse.ty - mouse.y) * 0.08;
        // Soft interactive spotlight halo following cursor
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, 220);
        grad.addColorStop(0, 'rgba(139, 124, 246, 0.11)');
        grad.addColorStop(0.5, 'rgba(243, 168, 196, 0.06)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 220, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw gentle flowing sine wave ribbon in background
      ctx.save();
      ctx.beginPath();
      for (let x = 0; x <= w; x += 24) {
        const y = h * 0.52 + Math.sin(x * 0.0035 + tick) * 38 + Math.cos(x * 0.002 - tick * 0.7) * 22;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(139, 124, 246, 0.12)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Update & draw particles + constellation links
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.phase += p.speed;
        p.x += p.vx + Math.sin(p.phase) * 0.22;
        p.y += p.vy + Math.cos(p.phase) * 0.18;

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        // Gentle repulsion/attraction to cursor
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 160 && dist > 1) {
            p.x -= (dx / dist) * 0.45;
            p.y -= (dy / dist) * 0.45;
          }
        }

        // Connect nearby particles with subtle constellation threads
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 18500) {
            const alpha = (1 - distSq / 18500) * 0.14;
            ctx.strokeStyle = `rgba(124, 92, 232, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        const pulseR = p.r + Math.sin(p.phase) * 0.8;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, pulseR), 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(stepFrame);
    }

    if (!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      requestAnimationFrame(stepFrame);
    }
  })();
})();
