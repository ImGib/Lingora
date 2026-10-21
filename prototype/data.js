/* Lingora Week 1 Prototype Content — Rich & Empathetic Pedagogical Edition.
 * Inspired by ForumFlash (forumflashstudy.com) 2-step route & Growth Garden.
 * Invariants: Observation != Evidence, Evidence != Mastery, Skipped != Failed, Technical failure != Learner failure. */
window.LINGORA_DATA = (() => {
  const claims = {
    READ: { name: 'Đọc hiểu thông tin cá nhân', desc: 'Hiểu tên, quê quán, nghề nghiệp trong hồ sơ và tin nhắn thực tế.', icon: '📖' },
    LISTEN: { name: 'Nghe hiểu lời giới thiệu', desc: 'Nắm bắt chi tiết và trọng âm trong lời giới thiệu tự nhiên.', icon: '🎧' },
    BE: { name: 'Dùng to be (am / are / is)', desc: 'Phối hợp chính xác to be theo mô hình mảnh ghép Grammar Pieces.', icon: '🧩' },
    QA: { name: 'Hỏi và đáp thông tin cá nhân', desc: 'Làm chủ 3 câu hỏi kinh điển, câu hỏi Yes/No và dạng phủ định.', icon: '💬' },
    WRITE: { name: 'Viết 3–5 câu giới thiệu bản thân', desc: 'Tự viết bài giới thiệu mạch lạc theo khung chuẩn và checklist.', icon: '✍️' },
    SPEAK: { name: 'Ghi âm 20–30 giây giới thiệu', desc: 'Nói tự tin, từ tốn với phát âm rõ ràng, có cơ chế fallback kỹ thuật an toàn.', icon: '🎙️' },
  };

  const days = [
    {
      n: 1,
      stageId: 1,
      stageName: 'Chặng 1: Nền tảng Âm thanh & Mẫu câu Nhận diện (Foundation)',
      title: 'Gặp gỡ Lời Giới thiệu Đầu tiên & Nhập môn IPA',
      intent: 'Làm quen tự nhiên với câu chuyện của Linh & David, bóc tách 4 trụ cột và làm chủ âm IPA căn bản',
      posture: 'Tiếp xúc & Cảm nhận — không chấm điểm',
      mood: 'learning',
      minutes: 15,
      keyPoints: ['4 Trụ cột tự giới thiệu', '5 âm IPA cốt lõi (/iː/, /ɪ/, /eɪ/, /z/, /m/)', '10 từ vựng nền tảng', '3 bẫy tiếng mẹ đẻ'],
      steps: [
        {
          type: 'dialogue',
          core: true,
          title: 'Hội thoại Làm quen Đời thường: Linh & David tại Quán Cà phê',
          context: 'Một buổi sáng mùa thu tại quán cà phê Perfume River ven sông Hương ở Cố đô Huế.',
          turns: [
            {
              speaker: 'Linh',
              role: 'Sinh viên & Barista',
              avatar: '👩‍🎓',
              en: 'Good morning! Welcome to Perfume River Cafe. My name is Linh.',
              vi: 'Chào buổi sáng! Chào mừng quý khách đến với Quán cà phê Sông Hương. Mình tên là Linh.',
              ipa: '/ɡʊd ˈmɔː.nɪŋ! ˈwel.kəm tuː ˈpɜː.fjuːm ˈrɪv.ər kæˈfeɪ. maɪ neɪm ɪz lɪnh/',
              vnGuide: 'Gút MO-nình! WEL-kầm tu PƠ-phium RI-vờ ka-PHÂY. Mai nêim i-zờ Linh.',
              wordBreakdown: [
                { w: 'Good morning', ipa: '/ɡʊd ˈmɔː.nɪŋ/', how: 'gút + MO-nình (nhấn âm MO)' },
                { w: 'Welcome', ipa: '/ˈwel.kəm/', how: 'WEL-kầm (uốn lưỡi L, khép môi M)' },
                { w: 'My name is', ipa: '/maɪ neɪm ɪz/', how: 'mai + nêim + i-zờ (nối âm m sang i thành nêi-mi-zờ)' }
              ]
            },
            {
              speaker: 'David',
              role: 'Du khách từ Úc',
              avatar: '🧑‍🦱',
              en: "Good morning! Nice to meet you, Linh. I'm David, a traveler from Australia.",
              vi: 'Chào buổi sáng! Rất vui được gặp bạn, Linh. Tôi là David, một du khách đến từ nước Úc.',
              ipa: "/ɡʊd ˈmɔː.nɪŋ! naɪs tuː miːt juː, lɪnh. aɪm ˈdeɪ.vɪd, ə ˈtræv.əl.ər frɒm ɒsˈtreɪ.li.ə/",
              vnGuide: 'Gút MO-nình! Nai-sờ tu mi...t diu, Linh. Aim ĐÂY-vịt, ơ TRA-vơ-lờ phrom o-STRÂY-li-ờ.',
              wordBreakdown: [
                { w: 'Nice to meet you', ipa: '/naɪs tuː miːt juː/', how: 'nai(s) + tu + mi...(t) + diu' },
                { w: "I'm David", ipa: '/aɪm ˈdeɪ.vɪd/', how: 'ai-m (khép môi) + ĐÂY-vịt' },
                { w: 'Australia', ipa: '/ɒsˈtreɪ.li.ə/', how: 'o-s + TRÂY (nhấn mạnh) + li-ờ' }
              ]
            },
            {
              speaker: 'Linh',
              role: 'Sinh viên & Barista',
              avatar: '👩‍🎓',
              en: 'Nice to meet you too, David! Are you on vacation in Hue?',
              vi: 'Rất vui được gặp bạn, David! Bạn đang đi du lịch ở Huế phải không?',
              ipa: '/naɪs tuː miːt juː tuː, ˈdeɪ.vɪd! ɑːr juː ɒn vəˈkeɪ.ʃən ɪn hweɪ?/',
              vnGuide: 'Nai-sờ tu mi...t diu tu, ĐÂY-vịt! A(r) diu on vờ-KÂY-shần in Huê ↗?',
              wordBreakdown: [
                { w: 'too', ipa: '/tuː/', how: 'bật nhẹ đầu lưỡi t + u kéo dài = tu...' },
                { w: 'Are you', ipa: '/ɑːr juː/', how: 'a(r) + diu (lên giọng ở cuối câu hỏi)' },
                { w: 'vacation', ipa: '/vəˈkeɪ.ʃən/', how: 'vờ + KÂY (nhấn mạnh) + shần' }
              ]
            },
            {
              speaker: 'David',
              role: 'Du khách từ Úc',
              avatar: '🧑‍🦱',
              en: 'Yes, I am. Your city is beautiful and peaceful. I love it here!',
              vi: 'Đúng vậy. Thành phố của bạn thật đẹp và thanh bình. Tôi rất thích nơi này!',
              ipa: '/jes, aɪ æm. jɔːr ˈsɪt.i ɪz ˈbjuː.tɪ.fəl ænd ˈpiːs.fəl. aɪ lʌv ɪt hɪər!/',
              vnGuide: 'Diét-s, ai am. Do(r) SI-ti i-zờ BIU-ti-phồ en PI...S-phồ. Ai lơ-v ịt hi-ờ!',
              wordBreakdown: [
                { w: 'city', ipa: '/ˈsɪt.i/', how: 'SI-ti (nhấn âm 1 SI)' },
                { w: 'beautiful', ipa: '/ˈbjuː.tɪ.fəl/', how: 'BIU (nhấn mạnh) + ti + phồ (uốn lưỡi L cuối)' },
                { w: 'peaceful', ipa: '/ˈpiːs.fəl/', how: 'PI...S (i dài + xì s) + phồ' }
              ]
            }
          ],
          note: 'Văn hóa quốc tế: Khi người khác nói "Nice to meet you", câu đáp lại tự nhiên và lịch thiệp nhất là "Nice to meet you too!" kèm theo nụ cười ấm áp.'
        },
        {
          type: 'ipa',
          core: true,
          title: 'Nhập môn Bảng Ký hiệu Ngữ âm Quốc tế (IPA) & Công thức Ghép vần 3 Bước',
          intro: 'Đừng lo nếu bạn thấy ký hiệu IPA lạ lẫm! Đánh vần IPA thực ra giống hệt cách bạn ghép vần tiếng Việt hồi lớp 1: [Phụ âm đầu] + [Nguyên âm giữa] + [Âm cuối]. Hãy xem công thức ghép từng mảnh và bấm nghe thử:',
          blendingRules: [
            { step: 'Bước 1: Đọc Nguyên âm chuẩn', desc: 'Nhìn ký hiệu nguyên âm ở giữa (ví dụ /iː/ là "i" kéo dài, /eɪ/ là "ây").' },
            { step: 'Bước 2: Ghép Phụ âm đầu + Nguyên âm', desc: 'Ví dụ /m/ + /iː/ -> đọc liền thành "mi..." (giống ghép chữ M + I trong tiếng Việt).' },
            { step: 'Bước 3: Đóng nhẹ Âm đuôi (Ending Sound)', desc: 'Thêm phụ âm cuối (ví dụ /t/, /m/, /z/) vào ngay sau khi vừa dứt nguyên âm: /m/ + /iː/ + /t/ = /miːt/ (meet).' }
          ],
          phonemes: [
            {
              ipa: '/iː/',
              name: 'Nguyên âm dài /iː/ (Long e)',
              vnApprox: 'Đọc như "i..." ngân dài (2 nhịp)',
              mouth: 'Khóe miệng kéo căng sang hai bên như đang cười tươi, âm ngân dài.',
              blendFormula: '/m/ (m) + /iː/ (i dài) + /t/ (bật nhẹ t) = /miːt/',
              blendParts: [
                { sym: '/m/', label: 'môi khép m', audio: 'm' },
                { sym: '/iː/', label: 'ngân dài i...', audio: 'ee' },
                { sym: '/t/', label: 'bật đầu lưỡi t', audio: 't' }
              ],
              example: 'meet /miːt/ (gặp gỡ)',
              contrast: 'mit /mɪt/ (găng tay)',
              audioWord: 'meet'
            },
            {
              ipa: '/ɪ/',
              name: 'Nguyên âm ngắn /ɪ/ (Short i)',
              vnApprox: 'Đọc dứt khoát giữa "i" và "ê" (1 nhịp ngắn)',
              mouth: 'Môi và cơ miệng thả lỏng hoàn toàn, phát âm gọn và dứt khoát.',
              blendFormula: '/ɪ/ (i-ê ngắn) + /z/ (rung cổ z) = /ɪz/',
              blendParts: [
                { sym: '/ɪ/', label: 'ngắn gọn i-ê', audio: 'ih' },
                { sym: '/z/', label: 'rung cổ zzz', audio: 'z' }
              ],
              example: 'is /ɪz/ (là)',
              contrast: 'ease /iːz/ (thư thái)',
              audioWord: 'is'
            },
            {
              ipa: '/eɪ/',
              name: 'Nguyên âm đôi /eɪ/ (Diphthong)',
              vnApprox: 'Trượt mượt từ "ê" sang "i" (gần giống "ây")',
              mouth: 'Mở miệng phát âm /e/ rồi trượt mượt mà khép dần về /ɪ/.',
              blendFormula: '/n/ (n) + /eɪ/ (ê-i) + /m/ (khép môi m) = /neɪm/',
              blendParts: [
                { sym: '/n/', label: 'đầu lưỡi n', audio: 'n' },
                { sym: '/eɪ/', label: 'trượt ê -> i', audio: 'ay' },
                { sym: '/m/', label: 'ngậm môi m', audio: 'm' }
              ],
              example: 'name /neɪm/ (tên)',
              contrast: 'tiếng Việt "nem"',
              audioWord: 'name'
            },
            {
              ipa: '/z/',
              name: 'Phụ âm rung /z/ (Voiced s)',
              vnApprox: 'Kêu "dờ/giờ" nhẹ trong cổ họng kèm luồng hơi qua kẽ răng',
              mouth: 'Hai hàm răng khép hờ, đầu lưỡi gần chân răng trên, làm rung dây thanh quản ở cổ.',
              blendFormula: '/h/ (h) + /iː/ (i dài) + /z/ (rung z) = /hiːz/ (He\'s)',
              blendParts: [
                { sym: '/h/', label: 'hơi thở h', audio: 'h' },
                { sym: '/iː/', label: 'ngân dài i...', audio: 'he' },
                { sym: '/z/', label: 'rung răng z', audio: 'his' }
              ],
              example: 'is /ɪz/ (rung cổ)',
              contrast: 'it /ɪt/ (bật nhẹ t)',
              audioWord: 'is'
            },
            {
              ipa: '/m/',
              name: 'Âm mũi khép môi /m/ (Bilabial nasal)',
              vnApprox: 'Đọc xong từ thì ngậm hai môi lại ("ừm" nhẹ ở mũi)',
              mouth: 'Hai môi khép chặt ở cuối từ, tạo luồng hơi rung nhẹ qua mũi.',
              blendFormula: '/fr/ (ph-r) + /ɒ/ (o ngắn) + /m/ (ngậm môi m) = /frɒm/',
              blendParts: [
                { sym: '/fr/', label: 'môi răng f-r', audio: 'fr' },
                { sym: '/ɒ/', label: 'tròn miệng o', audio: 'fro' },
                { sym: '/m/', label: 'khép môi m', audio: 'from' }
              ],
              example: 'from /frɒm/ (đến từ)',
              contrast: 'bỏ quên ngậm môi',
              audioWord: 'from'
            }
          ],
          tip: 'Mẹo giải mã ký hiệu IPA: Dấu phẩy trên ˈ (như ˈstjuː.dənt) báo hiệu âm tiết ngay sau nó được đọc TO và CAO hơn (như thêm dấu sắc). Dấu hai chấm ː báo hiệu kéo dài nguyên âm thêm 1 nhịp!'
        },
        {
          type: 'pillars',
          core: true,
          title: 'Bóc tách 4 Trụ cột Thông tin Cá nhân (The 4 Pillars)',
          intro: 'Mọi lời giới thiệu bản thân dù ngắn hay dài đều xoay quanh 4 mảnh ghép cốt lõi sau:',
          pillars: [
            {
              number: 1,
              type: 'Lời chào (Greeting)',
              formal: 'Hello! / Good morning!',
              casual: 'Hi! / Hi there!',
              tip: 'Mở đầu thân thiện tạo thiện cảm ngay giây đầu tiên.'
            },
            {
              number: 2,
              type: 'Tên & Danh tính (Name)',
              formal: 'My name is Linh.',
              casual: "I'm Linh.",
              tip: 'Nói rõ ràng tên mình và chuẩn bị lắng nghe tên người đối diện.'
            },
            {
              number: 3,
              type: 'Quê quán & Nơi đến (Origin)',
              formal: 'I am from Hue, Vietnam.',
              casual: 'I come from Hue.',
              tip: 'Nêu thành phố hoặc đất nước giúp khơi gợi chủ đề trò chuyện thú vị.'
            },
            {
              number: 4,
              type: 'Vai trò & Nghề nghiệp (Role)',
              formal: 'I am a university student.',
              casual: "I'm an IT engineer.",
              tip: 'Bắt buộc dùng mạo từ "a" hoặc "an" trước danh từ số ít chỉ nghề nghiệp.'
            }
          ]
        },
        {
          type: 'words',
          title: 'Kho Từ vựng & Cách Ghép vần IPA Từng Bước',
          words: [
            { en: 'hello', ipa: '/həˈləʊ/', spellSteps: 'hờ + ơ (nhẹ) -> hờ-ơ + l + âu (nhấn mạnh) = hơ-LÂU', syllables: 'hel · LO', stressNote: 'Nhấn âm 2 (LO)', vi: 'xin chào (trang trọng)', collocation: 'Hello, everyone.' },
            { en: 'hi', ipa: '/haɪ/', spellSteps: 'h (hơi thở) + ai (a trượt sang i) = hai', syllables: 'HI (1 âm tiết)', stressNote: 'Âm đơn', vi: 'chào (thân mật)', collocation: 'Hi there, An!' },
            { en: 'name', ipa: '/neɪm/', spellSteps: 'n + ê-i (ây) + m (ngậm môi cuối) = nêim', syllables: 'NAME (1 âm tiết)', stressNote: 'Nhớ khép môi /m/ cuối', vi: 'tên, danh tính', collocation: 'What is your name?' },
            { en: 'from', ipa: '/frɒm/', spellSteps: 'ph-r (liền nhau) + o (ngắn) + m (khép môi) = phrom', syllables: 'FROM (1 âm tiết)', stressNote: 'Khép môi /m/ ở cuối', vi: 'đến từ (xuất xứ)', collocation: 'I am from Vietnam.' },
            { en: 'student', ipa: '/ˈstjuː.dənt/', spellSteps: 'Âm 1: s-t-diu (nhấn mạnh STIU) + Âm 2: đần-t (bật nhẹ t) = STIU-đần(t)', syllables: 'STU · dent', stressNote: 'Nhấn âm 1 (STU)', vi: 'sinh viên, học sinh', collocation: 'university student' },
            { en: 'teacher', ipa: '/ˈtiː.tʃər/', spellSteps: 'Âm 1: t + i dài (nhấn mạnh TI...) + Âm 2: ch + ơ (cong lưỡi r) = TI-chờ(r)', syllables: 'TEA · cher', stressNote: 'Nhấn âm 1 (TEA)', vi: 'giáo viên', collocation: 'English teacher' },
            { en: 'nurse', ipa: '/nɜːs/', spellSteps: 'n + ơ dài (cong lưỡi) + s (xì hơi nhẹ qua kẽ răng) = nơ...s', syllables: 'NURSE (1 âm tiết)', stressNote: 'Kéo dài /ɜː/ + xì nhẹ /s/', vi: 'y tá, điều dưỡng', collocation: 'hospital nurse' },
            { en: 'engineer', ipa: '/ˌen.dʒɪˈnɪər/', spellSteps: 'Âm 1: en + Âm 2: dờ-i (gi) + Âm 3 (NHẤN MẠNH): n + i-ơ = en-gi-NIƠ', syllables: 'en · gi · NEER', stressNote: 'Nhấn mạnh âm 3 (NEER)', vi: 'kỹ sư', collocation: 'software engineer' },
            { en: 'meet', ipa: '/miːt/', spellSteps: 'm + i... (cười căng miệng kéo dài) + t (bật nhẹ đầu lưỡi) = mi...t', syllables: 'MEET (1 âm tiết)', stressNote: 'Ngân dài /iː/ + bật /t/', vi: 'gặp gỡ, làm quen', collocation: 'Nice to meet you.' },
            { en: 'welcome', ipa: '/ˈwel.kəm/', spellSteps: 'Âm 1: gu-eo (uốn lưỡi chữ l -> WEL) + Âm 2: k + ầm (khép môi m) = WEL-kầm', syllables: 'WEL · come', stressNote: 'Nhấn âm 1 (WEL)', vi: 'chào đón, hoan nghênh', collocation: 'Welcome to Vietnam!' }
          ],
          tip: 'Mẹo luyện đọc: Hãy bấm nút 🐢 "Nghe chậm" bên cạnh mỗi từ để nghe máy đọc tách rời từng nhịp và nhẩm ghép theo công thức!'
        },
        {
          type: 'traps',
          title: 'Bí quyết Tránh Bẫy Tiếng Mẹ Đẻ (L1 Interference Traps)',
          intro: '3 thói quen nói tiếng Anh sai phổ biến của người học Việt Nam cần đặc biệt lưu ý:',
          traps: [
            {
              title: 'Quên mạo từ "a / an" trước nghề nghiệp',
              issue: 'Tiếng Việt nói "Tôi là sinh viên" không có mạo từ, nên người học hay nhầm thành "I am student" ❌.',
              fix: 'Tiếng Anh bắt buộc: "I am a student" ✅ hoặc "I am an engineer" ✅.',
              example: 'I am a student.'
            },
            {
              title: 'Bệnh "Nuốt âm đuôi" (Dropping Ending Sounds)',
              issue: 'Tiếng Việt kết thúc bằng nguyên âm hoặc âm khép, nên người Việt hay bỏ quên âm gió /s/, /z/, /t/ cuối từ.',
              fix: 'Hãy chú ý phát âm rõ: "is" /ɪz/ (rung thanh quản), "meet" /miːt/ (bật nhẹ t).',
              example: 'Nice to meet you.'
            },
            {
              title: 'Đọc đều đều thiếu trọng âm (Word Stress)',
              issue: 'Tiếng Việt là ngôn ngữ đơn âm có dấu thanh, không có trọng âm từ.',
              fix: 'Từ có 2 âm tiết trở lên trong tiếng Anh luôn có 1 âm được nhấn to, cao và dài hơn: STU-dent, TEA-cher, nhưng engi-NEER.',
              example: 'Linh is a university student.'
            }
          ]
        },
        {
          type: 'choice',
          core: true,
          title: 'Bài Test IPA 1: Giải mã Khẩu hình, Ghép vần & Trọng âm (5 câu)',
          evidence: { claim: 'LISTEN', mode: 'none' },
          intro: 'Kiểm tra khả năng đọc ký hiệu IPA, nhận diện khẩu hình môi — lưỡi, phân biệt nguyên âm dài/ngắn và dấu trọng âm thực chiến. Bấm nút 🔊 ở từng câu để đối chiếu âm thanh:',
          questions: [
            {
              q: 'Câu 1 (Nhận diện Khẩu hình): Khẩu hình "khóe miệng kéo căng ngang như đang cười tươi, mặt lưỡi nâng cao và ngân dài 2 nhịp (ký hiệu ː)" là của âm IPA nào dưới đây?',
              ipaBadge: '/iː/ vs /ɪ/',
              mouthPreview: '/iː/',
              audio: 'meet',
              options: [
                '/iː/ — Nguyên âm i dài (như trong từ "meet" /miːt/)',
                '/ɪ/ — Nguyên âm i ngắn thả lỏng (như trong từ "is" /ɪz/)',
                '/eɪ/ — Nguyên âm đôi trượt (như trong từ "name" /neɪm/)',
                '/ɜː/ — Nguyên âm ơ dài cong lưỡi (như trong từ "nurse" /nɜːs/)'
              ],
              answer: 0,
              explain: 'Chính xác! Dấu hai chấm (ː) báo hiệu ngân dài 2 nhịp, và âm /iː/ đòi hỏi kéo căng khóe miệng sang hai bên như đang mỉm cười ("meet" /miːt/).'
            },
            {
              q: 'Câu 2 (Công thức Ghép vần 3 Bước): Khi bạn ghép 3 mảnh âm thanh: Phụ âm đầu /n/ + Nguyên âm đôi trượt /eɪ/ (ê->i) + Phụ âm cuối khép môi /m/, bạn sẽ tạo thành từ nào?',
              ipaBadge: '/n/ + /eɪ/ + /m/ = /neɪm/',
              audio: 'name',
              options: [
                'name /neɪm/ (tên gọi)',
                'meet /miːt/ (gặp gỡ)',
                'nice /naɪs/ (tốt đẹp, vui vẻ)',
                'nurse /nɜːs/ (y tá)'
              ],
              answer: 0,
              explain: 'Tuyệt vời! /n/ + /eɪ/ ("nây") + khép hai môi giữ âm /m/ ở cuối tạo thành từ "name" (/neɪm/). Không đọc thành "nem" tiếng Việt!'
            },
            {
              q: 'Câu 3 (Đọc Ký hiệu Trọng âm ˈ): Nhìn phiên âm từ "engineer" là /ˌen.dʒɪˈnɪər/. Dấu phẩy trên (ˈ) cho biết bạn phải đọc NHẤN MẠNH (cao và rõ giọng nhất) vào âm tiết nào?',
              ipaBadge: '/ˌen.dʒɪˈnɪər/',
              audio: 'engineer',
              options: [
                'Âm tiết thứ 3: -NEER (/ˈnɪər/) — đứng ngay sau dấu phẩy trên ˈ',
                'Âm tiết thứ 1: en- (/ˌen/) — đứng sau dấu phẩy dưới ˌ',
                'Âm tiết thứ 2: -gi- (/dʒɪ/) — âm ở giữa',
                'Đọc ngang bằng cả 3 âm tiết như tiếng Việt'
              ],
              answer: 0,
              explain: 'Rất chuẩn! Quy tắc vàng của IPA: Dấu phẩy trên (ˈ) đứng ngay TRƯỚC âm tiết nào thì âm tiết đó nhận trọng âm chính: en-gi-NEER (/ˌen.dʒɪˈnɪər/).'
            },
            {
              q: 'Câu 4 (Kiểm soát Âm Đuôi Ending Sound): Từ "is" có phiên âm là /ɪz/. Sau khi phát âm nguyên âm ngắn /ɪ/, khẩu hình răng và dây thanh cần làm gì để tạo ra âm cuối /z/?',
              ipaBadge: '/ɪz/',
              mouthPreview: '/ɪ/',
              audio: 'is',
              options: [
                'Khép hờ hai hàm răng và làm rung dây thanh cổ họng tạo tiếng "zzz" nhẹ',
                'Ngậm chặt hai môi lại tạo âm /m/',
                'Bật mạnh đầu lưỡi ra tạo âm /t/',
                'Bỏ qua hoàn toàn không phát âm phụ âm cuối'
              ],
              answer: 0,
              explain: 'Chính xác! Âm /z/ là phụ âm hữu thanh: hai hàm răng khép hờ và dây thanh quản rung nhẹ ("zzz") giúp người bản xứ nghe rõ động từ "is" và nối âm mượt mà.'
            },
            {
              q: 'Câu 5 (Phân biệt Cặp Âm Dễ Nhầm — Minimal Pair): Từ nào dưới đây chứa nguyên âm ngắn thả lỏng /ɪ/ (chỉ đọc dứt khoát 1 nhịp, KHÔNG kéo dài)?',
              ipaBadge: 'Phân biệt /ɪ/ (ngắn) & /iː/ (dài)',
              audio: 'is',
              options: [
                'is /ɪz/ (thì, là, ở)',
                'meet /miːt/ (gặp gỡ)',
                'teacher /ˈtiː.tʃər/ (giáo viên)',
                'she /ʃiː/ (cô ấy)'
              ],
              answer: 0,
              explain: 'Chuẩn xác! "is" (/ɪz/) dùng nguyên âm /ɪ/ ngắn thả lỏng 1 nhịp. Ba từ còn lại (meet, teacher, she) đều chứa nguyên âm /iː/ có dấu hai chấm (ː) ngân dài 2 nhịp.'
            }
          ]
        },
        {
          type: 'fill',
          core: true,
          title: 'Bài Test IPA 2: Nhìn Phiên âm IPA — Giải mã & Gõ Từ Tiếng Anh (4 câu)',
          guided: true,
          evidence: { claim: 'READ', mode: 'none' },
          intro: 'Thử thách thực chiến như khi tra từ điển: Bạn hãy nhìn ký hiệu phiên âm IPA, tự ghép vần theo 3 bước (hoặc bấm 🔊 để kiểm tra tai nghe) rồi gõ lại từ tiếng Anh tương ứng vào ô trống:',
          items: [
            {
              prompt: 'Câu 1 — Ghép vần: /m/ (ngậm môi) + /iː/ (i dài cười) + /t/ (bật nhẹ t) ➔ Phiên âm /miːt/ là từ tiếng Anh nào? ___',
              ipaBadge: '/miːt/',
              audio: 'meet',
              accepted: ['meet'],
              hint: 'Từ có 4 chữ cái bắt đầu bằng "m", xuất hiện trong câu "Nice to ___ you".',
              explain: 'Phiên âm /miːt/ chính là từ "meet" (gặp gỡ).'
            },
            {
              prompt: 'Câu 2 — Ghép vần: /n/ + /eɪ/ (trượt ê->i = ây) + /m/ (khép môi m) ➔ Phiên âm /neɪm/ là từ tiếng Anh nào? ___',
              ipaBadge: '/neɪm/',
              audio: 'name',
              accepted: ['name'],
              hint: 'Danh từ có 4 chữ cái nghĩa là "tên gọi" (My ___ is Linh).',
              explain: 'Phiên âm /neɪm/ chính là từ "name" (tên gọi).'
            },
            {
              prompt: 'Câu 3 — Đọc trọng âm âm 1: /ˈstjuː.dənt/ (nhấn mạnh STIU + hạ giọng đần-t) ➔ Đây là từ chỉ nghề nghiệp/vai trò nào? ___',
              ipaBadge: '/ˈstjuː.dənt/',
              audio: 'student',
              accepted: ['student'],
              hint: 'Danh từ chỉ "sinh viên / học sinh" bắt đầu bằng "st...".',
              explain: 'Phiên âm /ˈstjuː.dənt/ chính là từ "student" (sinh viên).'
            },
            {
              prompt: 'Câu 4 — Đọc trọng âm âm 2: /həˈləʊ/ (âm 1 lướt nhẹ hờ-ơ + âm 2 nhấn rõ LÂU) ➔ Đây là lời chào nào? ___',
              ipaBadge: '/həˈləʊ/',
              audio: 'hello',
              accepted: ['hello'],
              hint: 'Lời chào 5 chữ cái bắt đầu bằng chữ H.',
              explain: 'Phiên âm /həˈləʊ/ chính là lời chào "hello" (nhấn trọng âm vào âm thứ 2: hel-LO).'
            }
          ]
        },
        {
          type: 'choice',
          title: 'Kiểm tra Nhanh Sự Thấu hiểu Ngữ cảnh & Ngữ pháp (Check for Understanding)',
          evidence: { claim: 'READ', mode: 'none' },
          intro: 'Hãy trả lời 3 câu hỏi nhanh dưới đây để củng cố kiến thức đã học. Bài tập có gợi ý và không chấm điểm phạt.',
          questions: [
            {
              q: 'Trong đoạn hội thoại mở đầu, Linh sống và làm việc tại thành phố nào?',
              options: ['Hue (Thừa Thiên Huế)', 'Da Nang (Đà Nẵng)', 'Hanoi (Hà Nội)', 'Ho Chi Minh City'],
              answer: 0,
              explain: 'Chính xác! Linh sống và làm barista ở quán cà phê ven sông Hương ở Cố đô Huế: "I am from Hue, Vietnam."'
            },
            {
              q: 'Trong câu: "Hello! I am Linh. I am a student." — trụ cột nào trong 4 trụ cột thông tin đang bị thiếu?',
              options: ['Quê quán / Nơi đến (Origin)', 'Lời chào (Greeting)', 'Tên gọi (Name)', 'Nghề nghiệp / Vai trò (Role)'],
              answer: 0,
              explain: 'Rất chuẩn! Câu trên đã có Lời chào (Hello), Tên (Linh), Nghề nghiệp (a student), nhưng chưa nhắc tới quê quán (ví dụ "I am from Hue").'
            },
            {
              q: 'Chọn câu giới thiệu nghề nghiệp đúng ngữ pháp tiếng Anh, không mắc bẫy tiếng mẹ đẻ:',
              options: ['I am a university student.', 'I am university student.', 'I a student.', 'I is student.'],
              answer: 0,
              explain: 'Tuyệt vời! Danh từ số ít "university student" bắt buộc có mạo từ "a" đi trước, và chủ ngữ "I" đi với động từ to be "am".'
            }
          ]
        },
        {
          type: 'explain',
          title: 'Khép lại Ngày 1 & Chuẩn bị cho Ngày 2',
          body: 'Chúc mừng bạn đã hoàn thành trọn vẹn Ngày 1! Bạn đã nắm vững 4 trụ cột giới thiệu, làm quen với 5 âm IPA quan trọng và nhận diện được 3 bẫy tiếng mẹ đẻ. Hãy thử nhẩm trong đầu 4 thông tin của chính bạn. Ngày mai (Ngày 2), chúng ta sẽ cùng ghép các khối "Grammar Pieces" của động từ To Be để bạn có thể tự tin tự đặt những câu chuẩn xác!'
        }
      ]
    },
    {
      n: 2,
      stageId: 'stage-1',
      stageName: 'Chặng 1 · Nền tảng Ngữ âm IPA, Đại từ Nhân xưng & Động từ To Be',
      title: 'Đại từ Nhân xưng (Subject Pronouns) & Động từ To Be',
      intent: 'Làm chủ hệ thống Đại từ nhân xưng (I, You, He, She, We, They) và cấu trúc To Be (am / are / is) ở cả 3 thể Khẳng định (+), Phủ định (-), Nghi vấn (?)',
      posture: 'Nắm trọn bản chất ngữ pháp — hiểu chức năng, cấu trúc và cách tự phân tích câu',
      mood: 'practice',
      minutes: 15,
      keyPoints: ['Đại từ nhân xưng (I, You, He, She)', 'Chức năng nối của To Be', '3 thể (+) (-) (?) & cách trả lời ngắn', 'Phân tích & sửa lỗi sai'],
      steps: [
        {
          type: 'grammar-pieces',
          core: true,
          title: 'Chuyên đề Ngữ pháp Trọng tâm: Đại từ Nhân xưng (Subject Pronouns) & Động từ To Be',
          intro: 'Một câu giới thiệu chuẩn mực được tạo thành từ 3 khối ghép: [Chủ ngữ] + [To Be] + [Bổ ngữ]. Hãy nắm vững giải thích trọng tâm, chức năng, bảng 3 thể và ví dụ giảng giải dưới đây:',
          coreConcept: {
            summary: 'Trong tiếng Việt, ta có thể nói thẳng "Tôi sinh viên" hoặc "Cô ấy từ Huế". Nhưng trong tiếng Anh, MỌI câu hoàn chỉnh đều bắt buộc phải có Động từ. Khi câu không có hành động chạy nhảy (như eat, go, work), động từ "To Be" (am / are / is — nghĩa là: thì, là, ở) sẽ đóng vai trò làm "cầu nối ngữ pháp" gắn kết Chủ ngữ với thông tin phía sau.',
            goldenRule: 'Chủ ngữ nào đi với To Be nấy — I luôn đi với AM · You/We/They/Số nhiều đi với ARE · He/She/It/Tên 1 người đi với IS.'
          },
          functions: [
            {
              title: '1. Định danh Tên & Nghề nghiệp (Identity & Role)',
              formula: 'S + am / is / are + Tên riêng / a(an) + Nghề nghiệp',
              desc: 'Dùng "To Be" nối chủ ngữ với danh từ chỉ tên gọi hoặc nghề nghiệp (nhớ mạo từ a/an trước nghề số ít).',
              examples: [
                { en: 'I am Linh. I am a student.', vi: 'Tôi là Linh. Tôi là một sinh viên.' },
                { en: 'She is a caring nurse.', vi: 'Cô ấy là một y tá tận tâm.' }
              ]
            },
            {
              title: '2. Chỉ Quê quán & Vị trí (Origin & Location)',
              formula: 'S + am / is / are + from [Nơi chốn] / in [Thành phố]',
              desc: 'Dùng "To Be" đi kèm giới từ "from" (đến từ) hoặc "in/at" (đang ở tại đâu).',
              examples: [
                { en: 'You are from Hue.', vi: 'Bạn đến từ Huế.' },
                { en: 'He is in Da Nang now.', vi: 'Hiện tại anh ấy đang ở Đà Nẵng.' }
              ]
            },
            {
              title: '3. Miêu tả Tính chất & Tuổi tác (Quality & Age)',
              formula: 'S + am / is / are + Tính từ (Adj) / Số tuổi',
              desc: 'Tiếng Việt nói "Thành phố đẹp", nhưng tiếng Anh bắt buộc phải có "is/are" đứng trước tính từ hoặc số tuổi.',
              examples: [
                { en: 'Your city is peaceful.', vi: 'Thành phố của bạn rất thanh bình.' },
                { en: 'She is twenty-five years old.', vi: 'Cô ấy 25 tuổi.' }
              ]
            }
          ],
          subject: 'I / You / He / She',
          be: 'am / are / is',
          complement: 'Linh / a student / from Hue',
          rows: [
            ['I (Tôi — Ngôi thứ 1 số ít)', "am (viết tắt: 'm)", 'I am Linh. / I\'m a university student.'],
            ['You (Bạn / Các bạn — Ngôi thứ 2)', "are (viết tắt: 're)", 'You are my friend. / You\'re from Da Nang.'],
            ['He (Anh ấy — 1 nam) / An', "is (viết tắt: 's)", 'He is An. / He\'s an IT engineer.'],
            ['She (Cô ấy — 1 nữ) / Mai', "is (viết tắt: 's)", 'She is Mai. / She\'s a hospital nurse.']
          ],
          polarityMatrix: [
            {
              polarity: 'affirmative',
              badge: '+ THỂ KHẲNG ĐỊNH',
              title: 'Câu Khẳng Định (Affirmative)',
              formula: 'S + am / are / is + Bổ ngữ (Complement)',
              contractionRule: "Dạng rút gọn tự nhiên khi giao tiếp: I am ➔ I'm · You are ➔ You're · He is ➔ He's · She is ➔ She's.",
              examples: [
                { full: 'I am a student.', short: "I'm a student.", vi: 'Tôi là một sinh viên.' },
                { full: 'She is from Hue.', short: "She's from Hue.", vi: 'Cô ấy đến từ Huế.' }
              ]
            },
            {
              polarity: 'negative',
              badge: '- THỂ PHỦ ĐỊNH',
              title: 'Câu Phủ Định (Negative — Không phải là)',
              formula: 'S + am / are / is + NOT + Bổ ngữ',
              contractionRule: "Đặt 'not' ngay sau To Be. Rút gọn: are not = aren't · is not = isn't. Lưu ý: 'am not' KHÔNG gộp thành amn't, chỉ viết I'm not.",
              examples: [
                { full: 'I am not a teacher.', short: "I'm not a teacher.", vi: 'Tôi không phải là giáo viên.' },
                { full: 'He is not from Hanoi.', short: "He isn't from Hanoi.", vi: 'Anh ấy không phải đến từ Hà Nội.' }
              ]
            },
            {
              polarity: 'interrogative',
              badge: '? THỂ NGHI VẤN',
              title: 'Câu Hỏi Đảo Yes/No (Interrogative)',
              formula: 'Am / Are / Is + S + Bổ ngữ? (Lên giọng ↗)',
              contractionRule: "Đảo Am/Are/Is lên trước Chủ ngữ. Trả lời ngắn: Yes, S + am/are/is (Cấm viết tắt ở Yes!) | No, I'm not / No, S + aren't/isn't.",
              examples: [
                { full: 'Are you on vacation in Hue? ↗', short: "Yes, I am. / No, I'm not.", vi: 'Bạn đang đi nghỉ ở Huế phải không?' },
                { full: 'Is she a doctor? ↗', short: "Yes, she is. / No, she isn't.", vi: 'Cô ấy có phải là bác sĩ không?' }
              ]
            }
          ],
          recognitionTips: [
            {
              step: 'Bước 1',
              title: 'Xác định Ngôi và Số lượng của Chủ ngữ (S) đứng đầu câu',
              detail: 'Nhìn từ đứng trước động từ: Nếu là "I" ➔ chọn ngay "am". Nếu là "You" hoặc nhiều người (We, They, Lan and Mai) ➔ chọn "are". Nếu là "He / She" hoặc tên 1 người riêng lẻ (Mai, An, my teacher) ➔ quy về ngôi thứ 3 số ít ➔ chọn "is".'
            },
            {
              step: 'Bước 2',
              title: 'Quan sát Dấu câu (? / .) và Từ phủ định (not)',
              detail: 'Nếu cuối câu có dấu hỏi (?) và không có từ hỏi Wh- ➔ Đảo "Are / Is" lên đầu câu. Nếu có chữ "not" ➔ Đặt "not" ngay sau am/are/is.'
            },
            {
              step: 'Bước 3',
              title: 'Kiểm tra Mạo từ a / an trước Danh từ Nghề nghiệp số ít',
              detail: 'Nếu phía sau To Be là danh từ nghề nghiệp đếm được số ít (student, nurse, engineer), bắt buộc phải có "a" (trước phụ âm) hoặc "an" (trước nguyên âm u, e, o, a, i).'
            }
          ],
          annotatedExamples: [
            {
              sentence: 'Mai is a caring nurse at the hospital.',
              ipa: '/maɪ ɪz ə ˈkeə.rɪŋ nɜːs æt ðə ˈhɒs.pɪ.təl/',
              meaning: 'Mai là một y tá tận tâm tại bệnh viện.',
              tokens: [
                { text: 'Mai', role: 'Chủ ngữ số ít (= She)' },
                { text: 'is', role: 'Động từ To Be (ngôi 3 số ít)' },
                { text: 'a caring nurse', role: 'Mạo từ a + Cụm danh từ nghề nghiệp' },
                { text: 'at the hospital', role: 'Cụm giới từ chỉ nơi làm việc' }
              ],
              analysis: 'Vì "Mai" là tên một người (tương đương đại từ "She"), ta bắt buộc dùng động từ to be là "is". Cụm "a caring nurse" là danh từ số ít nên có mạo từ "a" đứng đầu.'
            },
            {
              sentence: "He isn't from Hanoi. He's an IT engineer in Da Nang.",
              ipa: '/hiː ˈɪz.ənt frɒm hæˈnɔɪ/ · /hiːz ən ˌaɪˈtiː ˌen.dʒɪˈnɪər/',
              meaning: 'Anh ấy không phải đến từ Hà Nội. Anh ấy là một kỹ sư CNTT tại Đà Nẵng.',
              tokens: [
                { text: 'He', role: 'Chủ ngữ (Ngôi 3 số ít)' },
                { text: "isn't", role: 'To Be phủ định (= is not)' },
                { text: 'from Hanoi.', role: 'Bổ ngữ chỉ quê quán' },
                { text: "He's an IT engineer", role: 'He is + an (trước nguyên âm /aɪ/)' }
              ],
              analysis: 'Câu đầu dùng thể phủ định rút gọn "isn\'t" để bác bỏ thông tin quê quán; câu sau dùng thể khẳng định rút gọn "He\'s" (= He is) kèm mạo từ "an" trước chữ viết tắt "IT" (/aɪ.tiː/).'
            }
          ]
        },
        {
          type: 'pattern',
          core: true,
          title: 'Dạng Viết tắt (Contractions) & Phủ định (Negatives)',
          text: 'Trong giao tiếp đời thường, người bản xứ luôn ưu tiên dùng dạng viết tắt để câu nói mượt mà hơn:',
          rows: [
            ['Khẳng định viết tắt', "I'm / You're / He's / She's", "I'm Linh. You're from Hue. She's a nurse."],
            ['Phủ định đầy đủ', 'am not / are not / is not', 'I am not a teacher. He is not from Hanoi.'],
            ['Phủ định viết tắt', "aren't / isn't", "You aren't late. He isn't from Hanoi."]
          ]
        },
        {
          type: 'fill',
          core: true,
          title: 'Luyện tập Điền Khối Ghép To Be (Guided Form Practice)',
          guided: true,
          evidence: { claim: 'BE', mode: 'none' },
          intro: 'Điền dạng đúng của to be (am, are hoặc is). Bấm xem gợi ý nếu phân vân. Đây là bước luyện cảm giác ngữ pháp, không chấm điểm phạt.',
          items: [
            { prompt: 'Hello! I ___ Linh, and I ___ a university student.', accepted: ['am'], hint: 'Đại từ "I" luôn đi với "am".', explain: 'I am Linh, and I am a university student.' },
            { prompt: 'You ___ from Hue, right?', accepted: ['are'], hint: 'Đại từ "You" luôn đi với "are".', explain: 'You are from Hue, right?' },
            { prompt: 'Mai ___ a caring nurse at the city hospital.', accepted: ['is'], hint: 'Mai là tên một người (tương đương she), đi với "is".', explain: 'Mai is a caring nurse.' },
            { prompt: 'An ___ an IT engineer in Da Nang.', accepted: ['is'], hint: 'An là tên một người (tương đương he), đi với "is".', explain: 'An is an IT engineer.' }
          ]
        },
        {
          type: 'fill',
          title: 'Thử thách Phản biện Bắt Lỗi Sai (Spot the Error)',
          guided: true,
          evidence: { claim: 'BE', mode: 'none' },
          intro: 'Đóng vai người phản biện khắt khe: Phát hiện và sửa lỗi cho 2 câu sai ngữ pháp dưới đây.',
          items: [
            { prompt: 'Câu sai: "He are from Hanoi." -> Gõ lại dạng đúng của từ "are":', accepted: ['is'], hint: 'He là ngôi thứ ba số ít, không đi với are.', explain: 'Chủ ngữ "He" phải đi với "is": He is from Hanoi.' },
            { prompt: 'Câu sai: "I is a student." -> Gõ lại dạng đúng của từ "is":', accepted: ['am'], hint: 'Đại từ "I" luôn đi với "am".', explain: 'Chủ ngữ "I" luôn đi với "am": I am a student.' }
          ]
        },
        {
          type: 'ipa',
          title: 'Ngữ âm Nối âm & Âm Gió của To Be',
          intro: 'Cách người bản xứ ghép vần và nối âm tự nhiên khi phát âm to be:',
          phonemes: [
            {
              ipa: '/aɪm/',
              name: 'Nối âm "I am" -> "I\'m"',
              vnApprox: 'Đọc "ai" rồi ngậm môi lại thành "aim"',
              mouth: 'Phát âm /aɪ/ (ai) rồi khép nhẹ hai môi thành /m/.',
              blendFormula: '/aɪ/ (ai) + /m/ (khép môi m) = /aɪm/',
              blendParts: [
                { sym: '/aɪ/', label: 'mở miệng ai', audio: 'I' },
                { sym: '/m/', label: 'khép môi m', audio: 'I am' }
              ],
              example: "I'm Linh (/aɪm lɪnh/)",
              contrast: 'đọc tách rời từng chữ',
              audioWord: "I'm"
            },
            {
              ipa: '/ʃiːz/',
              name: 'Nối âm "She is" -> "She\'s"',
              vnApprox: 'Chu môi đọc "shi..." rồi rung nhẹ răng "zzz"',
              mouth: 'Chu môi phát âm /ʃiː/ (s nặng + i dài) rồi rung nhẹ âm gió /z/.',
              blendFormula: '/ʃ/ (s nặng chu môi) + /iː/ (i dài) + /z/ (rung z) = /ʃiːz/',
              blendParts: [
                { sym: '/ʃ/', label: 'chu môi sh', audio: 'sh' },
                { sym: '/iː/', label: 'ngân dài i...', audio: 'she' },
                { sym: '/z/', label: 'rung răng z', audio: "she's" }
              ],
              example: "She's a nurse (/ʃiːz ə nɜːs/)",
              contrast: 'bỏ quên âm gió /z/',
              audioWord: "She's"
            }
          ],
          tip: 'Khi nói "She is a nurse", âm /z/ ở cuối từ "is" sẽ tự nhiên nối với âm /ə/ của "a" tạo thành /ʃiː ɪ-zə nɜːs/.'
        },
        {
          type: 'choice',
          core: true,
          title: 'Bài Test IPA: Phản xạ Ghép vần Nối âm & Âm Đuôi To Be (3 câu)',
          evidence: { claim: 'LISTEN', mode: 'none' },
          intro: 'Kiểm tra khả năng nhận diện phiên âm nối âm của "I\'m", "She\'s", "He\'s" và âm gió cuối câu:',
          questions: [
            {
              q: 'Câu 1: Khi người bản xứ nói nhanh cụm viết tắt "I\'m" (/aɪm/), bước khẩu hình cuối cùng là gì?',
              ipaBadge: '/aɪ/ + /m/ = /aɪm/',
              audio: "I'm Linh",
              options: [
                'Khép nhẹ hai môi lại để giữ âm mũi /m/ ("ai-m")',
                'Mở to miệng đọc "ai" rồi dừng lại (bỏ quên âm /m/)',
                'Khép hai hàm răng tạo tiếng xì /s/'
              ],
              answer: 0,
              explain: 'Chính xác! Phiên âm /aɪm/ kết thúc bằng phụ âm /m/, do đó hai môi phải khép nhẹ lại ở cuối.'
            },
            {
              q: 'Câu 2: Cụm viết tắt "She\'s" có phiên âm chuẩn là /ʃiːz/. Âm đầu /ʃ/ và âm cuối /z/ được phát âm thế nào?',
              ipaBadge: '/ʃ/ + /iː/ + /z/ = /ʃiːz/',
              audio: "She's a nurse",
              options: [
                'Đầu từ chu môi tạo âm /ʃ/ (s nặng), cuối từ khép hờ răng rung âm /z/',
                'Đầu từ đọc "xi" nhẹ, cuối từ không có âm gió',
                'Đọc tách rời thành "si - i"'
              ],
              answer: 0,
              explain: 'Rất chuẩn! "She\'s" = /ʃ/ (chu môi) + /iː/ (i dài) + /z/ (rung răng zzz).'
            },
            {
              q: 'Câu 3: Khi nói câu "She is a nurse" liền mạch, âm cuối /z/ của từ "is" (/ɪz/) sẽ nối sang mạo từ "a" (/ə/) tạo thành âm gì?',
              ipaBadge: '/ɪz/ + /ə/ ➔ /ɪ-zə/',
              audio: 'She is a nurse',
              options: [
                '/ɪ-zə/ (nghe mượt như "i-zờ")',
                '/ɪ-tə/ (nghe như "i-tờ")',
                '/ɪ-mə/ (nghe như "i-mờ")'
              ],
              answer: 0,
              explain: 'Tuyệt vời! Phụ âm cuối /z/ của "is" nối mượt sang nguyên âm /ə/ đứng sau thành /ɪ-zə/ ("She is_a nurse").'
            }
          ]
        }
      ]
    },
    {
      n: 3,
      stageId: 'stage-2',
      stageName: 'Chặng 2 · Đánh vần Tên, Phản xạ Hỏi - Đáp & Nghe - Đọc Thực chiến',
      keyPoints: ['Bảng chữ cái A–Z theo IPA', 'Bẫy E /iː/ vs I /aɪ/, G vs J', 'Nghe hiểu & Đọc quét hồ sơ'],
      title: 'Tên và Chi tiết Chính (Nghe & Đọc Hiểu)',
      intent: 'Đánh vần tên riêng qua IPA, nghe lần đầu không hỗ trợ và đọc quét thẻ hồ sơ quốc tế',
      posture: 'Quan sát nghe/đọc lần đầu độc lập',
      mood: 'learning',
      minutes: 18,
      steps: [
        {
          type: 'fill',
          title: 'Bảng Phát âm Chữ cái A–Z & Luyện Nghe Đánh vần Tên',
          guided: true,
          evidence: { claim: 'LISTEN', mode: 'none' },
          audio: 'My name is Tran. T, R, A, N. Tran.',
          intro: 'Để đánh vần được tên của bạn hoặc nghe người nước ngoài đánh vần tên họ, bạn cần biết cách phát âm từng chữ cái theo chuẩn IPA. Hãy bấm vào từng chữ cái bên dưới để nghe và tập đọc theo trước khi điền tên:',
          alphabetGuide: [
            { letter: 'A', ipa: '/eɪ/', tip: 'Đọc là "ây" (trượt từ ê sang i), KHÔNG đọc là "a"', group: 'Nhóm âm /eɪ/ (ây): A, H, J, K' },
            { letter: 'H', ipa: '/eɪtʃ/', tip: 'Đọc là "ây-chờ" (bật nhẹ âm ch ở cuối)', group: 'Nhóm âm /eɪ/ (ây): A, H, J, K' },
            { letter: 'J', ipa: '/dʒeɪ/', tip: 'Đọc là "chây / giây" (tròn môi)', group: 'Nhóm âm /eɪ/ (ây): A, H, J, K' },
            { letter: 'E', ipa: '/iː/', tip: 'Đọc là "i..." kéo dài (như cười tươi), KHÔNG đọc là "e"', group: 'Nhóm âm /iː/ (i dài): B, C, D, E, G, P, T, V' },
            { letter: 'G', ipa: '/dʒiː/', tip: 'Đọc là "gi..." kéo dài (khác với J là "giây")', group: 'Nhóm âm /iː/ (i dài): B, C, D, E, G, P, T, V' },
            { letter: 'T', ipa: '/tiː/', tip: 'Bật đầu lưỡi đọc "ti..." kéo dài', group: 'Nhóm âm /iː/ (i dài): B, C, D, E, G, P, T, V' },
            { letter: 'I', ipa: '/aɪ/', tip: 'Đọc là "ai" (mở rộng miệng), KHÔNG đọc là "i"', group: 'Nhóm nguyên âm & phụ âm tên Việt hay dùng' },
            { letter: 'R', ipa: '/ɑːr/', tip: 'Mở rộng miệng đọc "a..." rồi cuộn đầu lưỡi lên', group: 'Nhóm nguyên âm & phụ âm tên Việt hay dùng' },
            { letter: 'N', ipa: '/en/', tip: 'Đọc là "en" (đầu lưỡi chạm lợi trên ở cuối)', group: 'Nhóm nguyên âm & phụ âm tên Việt hay dùng' },
            { letter: 'L', ipa: '/el/', tip: 'Đọc là "eo" nhưng uốn đầu lưỡi chạm chân răng trên', group: 'Nhóm nguyên âm & phụ âm tên Việt hay dùng' }
          ],
          nameSpellDemos: [
            { name: 'TRAN', letters: ['T /tiː/', 'R /ɑːr/', 'A /eɪ/', 'N /en/'], readAs: 'ti · a(r) · ây · en', audio: 'T. R. A. N. Tran.' },
            { name: 'LINH', letters: ['L /el/', 'I /aɪ/', 'N /en/', 'H /eɪtʃ/'], readAs: 'eo · ai · en · ây-chờ', audio: 'L. I. N. H. Linh.' },
            { name: 'MAI', letters: ['M /em/', 'A /eɪ/', 'I /aɪ/'], readAs: 'em · ây · ai', audio: 'M. A. I. Mai.' }
          ],
          items: [
            {
              prompt: 'Câu 1 — Bấm nút ▶ phía trên (hoặc nút 🔊 bên cạnh) để nghe phát thanh viên đánh vần 4 chữ cái /tiː/ - /ɑːr/ - /eɪ/ - /en/ và gõ lại tên: ___',
              ipaBadge: '/tiː/ · /ɑːr/ · /eɪ/ · /en/',
              audio: 'T. R. A. N. Tran.',
              accepted: ['tran', 'Tran'],
              hint: 'Bốn chữ cái: T (/tiː/) - R (/ɑːr/) - A (/eɪ/) - N (/en/).',
              explain: 'T (/tiː/) - R (/ɑːr/) - A (/eɪ/) - N (/en/) -> Tran.'
            },
            {
              prompt: 'Câu 2 — Nhìn chuỗi phiên âm đánh vần 4 chữ cái: /el/ · /aɪ/ · /en/ · /eɪtʃ/ ("eo · ai · en · ây-chờ"). Đây là tên riêng nào? ___',
              ipaBadge: '/el/ · /aɪ/ · /en/ · /eɪtʃ/',
              audio: 'L. I. N. H. Linh.',
              accepted: ['linh', 'Linh'],
              hint: ' /el/ = L, /aɪ/ = I, /en/ = N, /eɪtʃ/ = H.',
              explain: 'Chuỗi phiên âm /el/ - /aɪ/ - /en/ - /eɪtʃ/ ghép thành tên LINH.'
            },
            {
              prompt: 'Câu 3 — Nhìn chuỗi phiên âm đánh vần 2 chữ cái: /eɪ/ · /en/ ("ây · en"). Đây là tên riêng nào? ___',
              ipaBadge: '/eɪ/ · /en/',
              audio: 'A. N. An.',
              accepted: ['an', 'An'],
              hint: '/eɪ/ là chữ cái đầu tiên trong bảng chữ cái (A), /en/ là chữ N.',
              explain: '/eɪ/ (chữ A) + /en/ (chữ N) ghép thành tên AN.'
            }
          ]
        },
        {
          type: 'choice',
          title: 'Bài Test IPA: Trọng âm Từ Nhiều Âm Tiết & Cặp Chữ Cái Dễ Nhầm (4 câu)',
          evidence: { claim: 'LISTEN', mode: 'none' },
          intro: 'Kiểm tra kỹ năng đọc dấu trọng âm IPA (ˈ) trên từ nhiều âm tiết và phân biệt các cặp chữ cái tiếng Anh hay bị người Việt đọc nhầm (E/I, G/J):',
          audio: 'student. teacher. engineer. Australia.',
          questions: [
            {
              q: 'Câu 1: Nhìn phiên âm /ˈstjuː.dənt/ (student) và /ˈtiː.tʃər/ (teacher), cả hai danh từ chỉ nghề nghiệp 2 âm tiết này đều nhấn trọng âm vào đâu?',
              ipaBadge: '/ˈstjuː.dənt/ & /ˈtiː.tʃər/',
              audio: 'student. teacher.',
              options: [
                'Nhấn vào âm tiết thứ 1 (STU-dent, TEA-cher) vì dấu ˈ đứng ở đầu từ',
                'Nhấn vào âm tiết thứ 2 (stu-DENT, tea-CHER)',
                'Không nhấn âm nào cả'
              ],
              answer: 0,
              explain: 'Chính xác! Danh từ 2 âm tiết trong tiếng Anh đa số nhấn âm 1: /ˈstjuː.dənt/ (STU-dent) và /ˈtiː.tʃər/ (TEA-cher).'
            },
            {
              q: 'Câu 2: Nhìn phiên âm tên quốc gia "Australia" là /ɒsˈtreɪ.li.ə/. Âm tiết nào được đọc cao giọng và nhấn mạnh nhất?',
              ipaBadge: '/ɒsˈtreɪ.li.ə/',
              audio: 'Australia',
              options: [
                'Âm tiết thứ 2: -TRA- (/ˈtreɪ/) — đọc là "o-STRÂY-li-ờ"',
                'Âm tiết thứ 1: Aus- (/ɒs/)',
                'Âm tiết cuối: -lia (/li.ə/)'
              ],
              answer: 0,
              explain: 'Rất chuẩn! Dấu trọng âm ˈ đặt ngay trước /treɪ/, nên ta nhấn mạnh vào âm tiết thứ hai: Aus-TRA-lia (/ɒsˈtreɪ.li.ə/).'
            },
            {
              q: 'Câu 3 (Bẫy Chữ cái E và I): Khi đánh vần tên, nếu người nước ngoài đọc âm "/iː/" (i dài cười tươi), họ đang nói tới chữ cái nào?',
              ipaBadge: 'Phân biệt E (/iː/) & I (/aɪ/)',
              audio: 'E',
              options: [
                'Chữ E (phiên âm là /iː/, còn chữ I được đọc là /aɪ/ "ai")',
                'Chữ I (vì tiếng Việt đọc I là i)',
                'Chữ A (phiên âm là /eɪ/)'
              ],
              answer: 0,
              explain: 'Tuyệt vời! Đây là bẫy kinh điển: Trong tiếng Anh, chữ E đọc là /iː/ ("i"), còn chữ I đọc là /aɪ/ ("ai").'
            },
            {
              q: 'Câu 4 (Bẫy Chữ cái G và J): Làm sao phân biệt chữ G và chữ J khi nghe đánh vần qua điện thoại?',
              ipaBadge: 'G (/dʒiː/) vs J (/dʒeɪ/)',
              audio: 'G. J.',
              options: [
                'Chữ G chứa nguyên âm /iː/ ("gi..."), còn chữ J chứa nguyên âm đôi /eɪ/ ("giây/chây")',
                'Hai chữ đọc giống hệt nhau',
                'Chữ G đọc là "gờ", chữ J đọc là "di"'
              ],
              answer: 0,
              explain: 'Xuất sắc! G = /dʒiː/ (thuộc nhóm âm i dài /iː/), còn J = /dʒeɪ/ (thuộc nhóm âm ây /eɪ/ cùng với A, H, K).'
            }
          ]
        },
        {
          type: 'choice',
          core: true,
          title: 'Nghe Lời Giới thiệu của Mai ở Hải Phòng',
          firstPass: true,
          evidence: { claim: 'LISTEN', mode: 'independent', context: 'mai-intro' },
          audio: "Good morning everyone! My name is Mai. I am twenty-five years old and I come from Hai Phong. I work as a nurse at the children's hospital. Nice to meet all of you!",
          intro: 'Hãy thử nghe lần đầu trước khi trả lời. Bạn có thể nghe lại bao nhiêu lần tuỳ thích — Lingora chỉ ghi nhận trung thực xem bạn có cần dùng hỗ trợ hay không.',
          questions: [
            { q: 'Mai đến từ thành phố nào?', options: ['Huế', 'Hải Phòng', 'Đà Nẵng'], answer: 1, explain: 'Mai nói rõ: "I come from Hai Phong."' },
            { q: 'Nghề nghiệp của Mai là gì?', options: ['Y tá (nurse)', 'Kỹ sư (engineer)', 'Sinh viên (student)'], answer: 0, explain: 'Mai chia sẻ: "I work as a nurse at the children\'s hospital."' }
          ]
        },
        {
          type: 'choice',
          core: true,
          title: 'Đọc Thẻ Hồ sơ Nghề nghiệp Quốc tế (Tom Baker)',
          evidence: { claim: 'READ', mode: 'independent', context: 'profile-card' },
          intro: 'Đọc quét thông tin trên thẻ định danh nhân viên quốc tế và trả lời câu hỏi:',
          passage: {
            kind: 'profile',
            rows: [
              ['Họ và tên', 'Tom Baker'],
              ['Quốc gia', 'Australia (Nước Úc)'],
              ['Nghề nghiệp', 'Chef (Đầu bếp trưởng)'],
              ['Nơi làm việc', 'Sydney Harbour Restaurant']
            ]
          },
          questions: [
            { q: 'Tom Baker làm nghề gì?', options: ['Bác sĩ', 'Đầu bếp (Chef)', 'Kỹ sư'], answer: 1, explain: 'Dòng Nghề nghiệp (Occupation/Role) ghi: Chef (Đầu bếp).' },
            { q: 'Tom Baker đến từ quốc gia nào?', options: ['Việt Nam', 'Australia (Nước Úc)', 'Nước Mỹ'], answer: 1, explain: 'Dòng Quốc gia (Country) ghi rõ: Australia.' }
          ]
        }
      ]
    },
    {
      n: 4,
      stageId: 'stage-2',
      stageName: 'Chặng 2 · Đánh vần Tên, Phản xạ Hỏi - Đáp & Nghe - Đọc Thực chiến',
      keyPoints: ['3 câu hỏi Wh- kinh điển', 'Câu hỏi đảo Yes/No với To Be', 'Ngữ điệu lên (↗) & xuống (↘)'],
      title: 'Hỏi và Đáp Thông tin Cá nhân',
      intent: 'Làm chủ 3 câu hỏi kinh điển, câu hỏi đảo Yes/No và phản xạ hội thoại',
      posture: 'Luyện tập tương tác — bước đệm cho ngày viết và nói',
      mood: 'practice',
      minutes: 15,
      steps: [
        {
          type: 'pillars',
          core: true,
          title: '3 Câu hỏi Kinh điển & Ngữ điệu Xuống (Wh- Questions)',
          intro: 'Khi hỏi thông tin bắt đầu bằng từ để hỏi (What, Where), ngữ điệu ở cuối câu thường đi xuống (Falling intonation ↘):',
          pillars: [
            { number: 1, type: 'Hỏi Tên (Name)', formal: 'What is your name? ↘', casual: "What's your name?", tip: 'Trả lời: My name is... hoặc I am...' },
            { number: 2, type: 'Hỏi Quê quán (Origin)', formal: 'Where are you from? ↘', casual: 'Where do you come from?', tip: 'Trả lời: I am from [City/Country].' },
            { number: 3, type: 'Hỏi Nghề nghiệp (Role)', formal: 'What do you do? ↘', casual: 'What is your job?', tip: 'Trả lời: I am a [Job] / I work in [Field].' }
          ]
        },
        {
          type: 'grammar-pieces',
          core: true,
          title: 'Chuyên đề Ngữ pháp Trọng tâm: Câu hỏi Đảo Yes/No & Câu hỏi Wh- với To Be',
          intro: 'Nắm trọn nguyên lý đảo ngữ To Be để đặt câu hỏi xác nhận (Yes/No) và câu hỏi khai thác thông tin (Wh- Questions):',
          coreConcept: {
            summary: 'Trong tiếng Việt, để hỏi bạn chỉ cần thêm từ "phải không?" ở cuối câu. Nhưng trong tiếng Anh, quy tắc bắt buộc là ĐẢO động từ To Be (Am / Is / Are) nhảy lên ĐẦU CÂU (trước Chủ ngữ S).',
            goldenRule: 'Câu kể: S + be ... ➔ Câu hỏi Yes/No: Be + S ...? (Lên giọng ↗ ở cuối câu) · Câu hỏi Wh-: Wh- + be + S ...? (Xuống giọng ↘ ở cuối câu)'
          },
          functions: [
            {
              title: '1. Xác nhận Đúng / Sai (Yes/No Question)',
              formula: 'Are / Is + S + Noun / Adj / from... ? ↗',
              desc: 'Dùng khi bạn đã có phỏng đoán và chỉ cần người nghe xác nhận Có (Yes) hoặc Không (No). Cuối câu luôn lên giọng (↗).',
              examples: [
                { en: 'Are you a new student? ↗', vi: 'Bạn là học viên mới phải không?' },
                { en: 'Is she from Da Nang? ↗', vi: 'Cô ấy đến từ Đà Nẵng phải không?' }
              ]
            },
            {
              title: '2. Khai thác Thông tin Mới (Wh- Question)',
              formula: 'What / Where / Who + is / are + S ? ↘',
              desc: 'Đặt từ để hỏi (What, Where, Who, How) ở đầu câu, ngay sau đó vẫn là To Be đảo trước Chủ ngữ. Cuối câu xuống giọng (↘).',
              examples: [
                { en: 'Where are you from? ↘', vi: 'Bạn đến từ đâu?' },
                { en: 'What is his job? ↘', vi: 'Công việc của anh ấy là gì?' }
              ]
            },
            {
              title: '3. Phản hồi Ngắn Lịch sự (Short Answers)',
              formula: 'Yes, S + be. / No, S + be + not.',
              desc: 'Trong giao tiếp chuẩn, hạn chế chỉ đáp cộc lốc "Yes" hoặc "No". Hãy lặp lại đại từ + To Be (Lưu ý: trả lời Yes tuyệt đối không viết tắt!).',
              examples: [
                { en: 'Yes, I am. (KHÔNG nói: Yes, I\'m)', vi: 'Đúng vậy, chính là tôi.' },
                { en: 'No, she isn\'t. She is a nurse.', vi: 'Không phải. Cô ấy là y tá.' }
              ]
            }
          ],
          subject: 'you / he / she',
          be: 'Are / Is',
          complement: 'a student? ↗ / from Hue? ↗',
          rows: [
            ['Are you a student? ↗', 'Yes, I am. / No, I\'m not.', 'Hỏi bạn có phải là sinh viên không (Ngôi You -> Trả lời bằng ngôi I)'],
            ['Are you from Vietnam? ↗', 'Yes, I am. / No, I\'m not.', 'Hỏi xuất xứ của người đối diện'],
            ['Is he an engineer? ↗', 'Yes, he is. / No, he isn\'t.', 'Hỏi nghề nghiệp ngôi thứ 3 số ít (He)'],
            ['Is she a nurse? ↗', 'Yes, she is. / No, she isn\'t.', 'Hỏi nghề nghiệp ngôi thứ 3 số ít (She)']
          ],
          polarityMatrix: [
            {
              polarity: 'affirmative',
              badge: '? YES / NO',
              title: 'Câu hỏi Đảo Yes/No (Lên giọng ↗)',
              formula: 'Am / Is / Are + Chủ ngữ (S) + Bổ ngữ?',
              contractionRule: 'Đảo trực tiếp Am/Is/Are lên đầu câu. Không dùng trợ động từ Do/Does khi trong câu đã có To Be.',
              examples: [
                { s: 'Are', be: 'you', c: 'a teacher? ↗', full: 'Are you a teacher?', short: 'Ngữ điệu đi lên ↗', vi: 'Bạn có phải là giáo viên không?' },
                { s: 'Is', be: 'she', c: 'from Hue? ↗', full: 'Is she from Hue?', short: 'Ngữ điệu đi lên ↗', vi: 'Cô ấy đến từ Huế phải không?' }
              ]
            },
            {
              polarity: 'negative',
              badge: '+ / - TRẢ LỜI',
              title: 'Cách Trả lời Ngắn (Short Answers)',
              formula: 'Yes, S + am/is/are. | No, S + am not / isn\'t / aren\'t.',
              contractionRule: 'Bẫy kinh điển: Câu trả lời khẳng định ngắn ("Yes, I am" / "Yes, he is") KHÔNG BAO GIỜ viết tắt thành "Yes, I\'m" hay "Yes, he\'s"!',
              examples: [
                { s: 'Yes,', be: 'I am.', c: '(Chuẩn)', full: 'Yes, I am. / Yes, she is.', short: 'Cấm viết tắt ở Yes!', vi: 'Vâng, đúng vậy.' },
                { s: 'No,', be: "I'm not.", c: '/ No, she isn\'t.', full: "No, I'm not. / No, she isn't.", short: 'Viết tắt tự nhiên ở No', vi: 'Không, không phải.' }
              ]
            },
            {
              polarity: 'interrogative',
              badge: 'WH- QUESTION',
              title: 'Câu hỏi Từ để hỏi Wh- (Xuống giọng ↘)',
              formula: 'What / Where + is / are + Chủ ngữ (S)?',
              contractionRule: 'Có thể viết tắt "is" vào từ để hỏi: What\'s (= What is), Where\'s (= Where is).',
              examples: [
                { s: 'What is', be: 'your name?', c: '↘', full: 'What is your name?', short: "What's your name?", vi: 'Tên của bạn là gì?' },
                { s: 'Where are', be: 'you from?', c: '↘', full: 'Where are you from?', short: 'Không viết tắt Where + are', vi: 'Bạn đến từ đâu?' }
              ]
            }
          ],
          recognitionTips: [
            {
              step: 'Quy tắc 1',
              title: 'Đổi ngôi khi Hỏi "You" — Đáp "I"',
              detail: 'Khi câu hỏi dùng "Are YOU...?" (hỏi trực tiếp bạn), câu trả lời bắt buộc đổi chủ ngữ sang "I" -> "Yes, I am" hoặc "No, I\'m not" (Tuyệt đối không trả lời "Yes, you are").'
            },
            {
              step: 'Quy tắc 2',
              title: 'Phân biệt Câu hỏi Wh- và Yes/No để Chọn Câu Trả lời',
              detail: 'Nếu câu hỏi bắt đầu bằng "Are / Is..." -> Phải trả lời "Yes / No". Nếu câu hỏi bắt đầu bằng "Where / What..." -> Phải trả lời thẳng thông tin (nơi chốn, tên, nghề nghiệp), KHÔNG trả lời Yes/No!'
            },
            {
              step: 'Quy tắc 3',
              title: 'Nhận biết Từ để hỏi (Wh- Words)',
              detail: 'WHAT = Cái gì (tên, nghề nghiệp: What is your name?) · WHERE = Ở đâu (quê quán, vị trí: Where are you from?) · WHO = Ai (Who is she?).'
            }
          ],
          annotatedExamples: [
            {
              sentence: 'Where are you from? — I am from Da Nang.',
              ipa: '/wer ɑːr juː frɒm/ — /aɪ æm frɒm dɑː næŋ/',
              meaning: 'Bạn đến từ đâu? — Tôi đến từ Đà Nẵng.',
              tokens: [
                { text: 'Where', role: 'Từ hỏi nơi chốn (Wh-)' },
                { text: 'are', role: 'To Be đảo lên trước S' },
                { text: 'you', role: 'Chủ ngữ (Ngôi 2)' },
                { text: 'from?', role: 'Giới từ chỉ xuất xứ' }
              ],
              analysis: 'Câu hỏi bắt đầu bằng "Where" (hỏi địa điểm) nên người nghe trả lời trực tiếp bằng "I am from + [Tên thành phố]", tuyệt đối không trả lời Yes/No.'
            },
            {
              sentence: 'Is she a teacher? — No, she isn\'t. She is a nurse.',
              ipa: '/ɪz ʃiː ə ˈtiː.tʃər/ — /nəʊ ʃiː ˈɪz.ənt/',
              meaning: 'Cô ấy là giáo viên phải không? — Không phải. Cô ấy là y tá.',
              tokens: [
                { text: 'Is', role: 'To Be đảo lên đầu câu' },
                { text: 'she', role: 'Chủ ngữ (Ngôi 3 số ít)' },
                { text: 'a teacher?', role: 'Mạo từ a + Danh từ nghề' },
                { text: "No, she isn't.", role: 'Trả lời phủ định ngắn (is + not)' }
              ],
              analysis: 'Vì hỏi về "she" (cô ấy) nên câu trả lời giữ nguyên đại từ "she" và dùng dạng rút gọn phủ định "isn\'t", sau đó cung cấp thêm thông tin đúng ("She is a nurse").'
            }
          ]
        },
        {
          type: 'choice',
          core: true,
          title: 'Ghép Cặp Câu Hỏi và Đáp Phù Hợp',
          evidence: { claim: 'QA', mode: 'none' },
          intro: 'Chọn câu trả lời tự nhiên và chính xác nhất cho từng câu hỏi:',
          questions: [
            { q: 'Người đối diện hỏi: "Where are you from?" — Bạn đáp thế nào?', options: ['I am from Da Nang, Vietnam.', 'My name is An.', 'I am an IT engineer.'], answer: 0, explain: '"Where are you from?" hỏi về nơi xuất xứ quê quán.' },
            { q: 'Người đối diện hỏi: "Are you a teacher?" — Nếu không phải, bạn đáp thế nào?', options: ["No, I'm not. I am a student.", 'Yes, I am a teacher.', 'I am from Hanoi.'], answer: 0, explain: 'Câu trả lời phủ định lịch sự: "No, I\'m not." kèm theo nghề nghiệp thật.' }
          ]
        },
        {
          type: 'fill',
          core: true,
          title: 'Hoàn thành Cuộc Hội thoại Phản xạ',
          guided: true,
          evidence: { claim: 'QA', mode: 'none' },
          intro: 'Điền từ còn thiếu vào chỗ trống để tạo đoạn hội thoại hoàn chỉnh:',
          items: [
            { prompt: 'A: "___ are you from?" — B: "I am from Hue."', accepted: ['where', 'Where'], hint: 'Từ để hỏi nơi chốn (ở đâu).', explain: 'Where are you from?' },
            { prompt: 'A: "___ you a student?" — B: "Yes, I am."', accepted: ['are', 'Are'], hint: 'To be đảo đi với chủ ngữ You.', explain: 'Are you a student?' }
          ]
        }
      ]
    },
    {
      n: 5,
      stageId: 'stage-3',
      stageName: 'Chặng 3 · Thực hành Sản sinh (Viết & Nói), Chuyển giao & Tuần hoàn',
      keyPoints: ['Khung bài viết 5 câu chuẩn', 'Xưởng viết tự giới thiệu', 'Phòng thu nói 20–30 giây'],
      title: 'Xưởng Viết & Ghi Âm Giới Thiệu Bản Thân',
      intent: 'Tự viết bài giới thiệu hoàn chỉnh và ghi âm 20–30 giây có hỗ trợ kỹ thuật an toàn',
      posture: 'Tự đánh giá theo tiêu chí rõ ràng — hỗ trợ kỹ thuật an toàn',
      mood: 'assessment',
      minutes: 20,
      steps: [
        {
          type: 'pattern',
          core: true,
          title: 'Khung Bài Giới Thiệu Bản Thân 5 Câu Chuẩn Mực',
          text: 'Khung bài viết hoàn chỉnh áp dụng 4 trụ cột đã học:',
          rows: [
            ['Câu 1: Lời chào', 'Hello! / Good morning!', 'Mở đầu lịch sự'],
            ['Câu 2: Tên gọi', 'My name is [Tên]. / I am [Tên].', 'Giới thiệu tên'],
            ['Câu 3: Nơi đến', 'I am from [Thành phố], Vietnam.', 'Quê quán xuất xứ'],
            ['Câu 4: Nghề nghiệp', 'I am a [Nghề nghiệp].', 'Nhớ mạo từ a/an'],
            ['Câu 5: Lời chào kết', 'Nice to meet you all!', 'Tạo sự gắn kết']
          ]
        },
        {
          type: 'write',
          core: true,
          title: 'Xưởng Viết: Tự Giới Thiệu Bản Thân (3–5 câu)',
          claim: 'WRITE',
          context: 'self-intro',
          prompt: 'Viết 3–5 câu giới thiệu bản thân bằng tiếng Anh dựa trên khung chuẩn. Bản nháp tự động lưu trên thiết bị của bạn.',
          frame: 'Hello! My name is ___. I am from ___, Vietnam. I am a ___. Nice to meet you!',
          checks: [
            'Có viết hoa chữ cái đầu câu và chữ "I"',
            'Có dấu chấm câu ở cuối mỗi câu',
            'Có mạo từ "a" hoặc "an" trước danh từ nghề nghiệp',
            'Dùng đúng to be: "I am" hoặc "I\'m"',
            'Có lời chào mở đầu và lời kết thân thiện'
          ]
        },
        {
          type: 'speak',
          core: true,
          title: 'Phòng Thu Nói: Ghi Âm 20–30 Giây Lời Giới Thiệu',
          claim: 'SPEAK',
          context: 'self-intro',
          prompt: 'Đọc to bài giới thiệu của bạn. Nói từ tốn, rõ ràng, chú ý âm cuối (/z/, /t/, /m/). Thời lượng lý tưởng là 20–30 giây.',
          targetSeconds: 25,
          minSeconds: 15,
          checks: [
            'Nói với tốc độ vừa phải, không vội vàng',
            'Phát âm rõ âm cuối trong từ "is", "name", "meet"',
            'Nhấn đúng trọng âm trong từ chỉ nghề nghiệp',
            'Đọc đủ các câu đã chuẩn bị'
          ]
        }
      ]
    },
    {
      n: 6,
      stageId: 'stage-3',
      stageName: 'Chặng 3 · Thực hành Sản sinh (Viết & Nói), Chuyển giao & Tuần hoàn',
      keyPoints: ['Đọc tin nhắn Slack quốc tế', 'Đọc thẻ hội nghị công nghệ', 'Viết giới thiệu người thứ 3 (He/She)'],
      title: 'Thử thách Chuyển giao Thực tế',
      intent: 'Đọc tin nhắn Slack của đồng nghiệp quốc tế, thẻ hội nghị và viết giới thiệu người khác',
      posture: 'Chuyển giao sang bối cảnh chưa gặp',
      mood: 'learning',
      minutes: 18,
      steps: [
        {
          type: 'choice',
          core: true,
          title: 'Đọc Tin Nhắn Slack Từ Đồng Nghiệp Quốc Tế (Carlos)',
          evidence: { claim: 'READ', mode: 'independent', transfer: true, context: 'slack-msg' },
          intro: 'Bạn vừa gia nhập kênh làm việc quốc tế và đọc được lời chào của Carlos:',
          passage: {
            kind: 'chat',
            from: 'Carlos Silva (Kênh #general)',
            text: "Hi everyone! I'm Carlos from Sao Paulo, Brazil. I'm a senior UX designer on the mobile team. Excited to work with you all!"
          },
          questions: [
            { q: 'Carlos đến từ quốc gia nào?', options: ['Brazil', 'Australia', 'Vietnam'], answer: 0, explain: 'Carlos viết: "from Sao Paulo, Brazil."' },
            { q: 'Vai trò chuyên môn của Carlos là gì?', options: ['UX Designer (Thiết kế trải nghiệm)', 'Software Engineer', 'Project Manager'], answer: 0, explain: 'Carlos giới thiệu: "senior UX designer on the mobile team."' }
          ]
        },
        {
          type: 'choice',
          core: true,
          title: 'Đọc Thẻ Hội Nghị Quốc Tế (Yuki Tanaka)',
          evidence: { claim: 'READ', mode: 'independent', transfer: true, context: 'conf-badge' },
          intro: 'Quan sát thông tin trên thẻ đeo hội thảo công nghệ:',
          passage: {
            kind: 'profile',
            rows: [
              ['Name', 'Yuki Tanaka'],
              ['City / Country', 'Tokyo, Japan'],
              ['Role', 'Data Scientist'],
              ['Organization', 'AI Research Lab']
            ]
          },
          questions: [
            { q: 'Yuki Tanaka làm việc trong lĩnh vực nào?', options: ['Khoa học dữ liệu (Data Scientist)', 'Y tá bệnh viện', 'Đầu bếp'], answer: 0, explain: 'Dòng Role ghi rõ: Data Scientist.' }
          ]
        },
        {
          type: 'write',
          core: true,
          title: 'Viết Giới Thiệu Một Người Bạn hoặc Đồng Nghiệp (Ngôi He / She)',
          claim: 'WRITE',
          transfer: true,
          context: 'friend-intro',
          prompt: 'Áp dụng những gì đã học để viết 3 câu giới thiệu về một người bạn hoặc nhân vật bạn yêu thích bằng đại từ He hoặc She (ví dụ: "This is Nam. He is from Da Nang. He is an engineer.").',
          frame: 'This is ___. He/She is from ___. He/She is a ___.',
          checks: [
            'Dùng đúng chủ ngữ "He" hoặc "She"',
            'Dùng đúng động từ to be "is"',
            'Có mạo từ "a" hoặc "an" trước nghề nghiệp'
          ]
        }
      ]
    },
    {
      n: 7,
      stageId: 'stage-3',
      stageName: 'Chặng 3 · Thực hành Sản sinh (Viết & Nói), Chuyển giao & Tuần hoàn',
      keyPoints: ['Khu vườn tiến bộ Tuần 1', 'Kiểm tra trí nhớ ngắt quãng', 'Lựa chọn nhịp điệu nghỉ ngơi'],
      title: 'Khu Vườn Tiến Bộ & Tuần Hoàn Kiến Thức',
      intent: 'Nhìn lại hành trình Tuần 1, củng cố tri thức ngắt quãng và lựa chọn nghỉ ngơi không trừng phạt',
      posture: 'Tuần hoàn & Nghỉ ngơi tích cực',
      mood: 'review',
      minutes: 15,
      steps: [
        {
          type: 'explain',
          core: true,
          title: 'Khu Vườn Tiến Bộ: Cây Học Tập Của Bạn',
          body: 'Chúc mừng bạn đã hoàn thành 6 ngày học đầu tiên của Tuần 1! Toàn bộ các mầm cây tri thức của bạn (Ngữ âm IPA, Grammar Pieces To Be, Kỹ năng Đọc - Nghe - Viết - Nói) đã nảy mầm và phát triển thân cành vững chãi trong Khu Vườn Tiến Độ.'
        },
        {
          type: 'choice',
          core: true,
          title: 'Thử Thách Tổng Hợp Tuần 1 (Spaced Retrieval Check)',
          evidence: { claim: 'BE', mode: 'independent', delayed: true, context: 'week1-recap' },
          intro: 'Kiểm tra nhanh trí nhớ ngắt quãng của bạn sau 7 ngày:',
          questions: [
            { q: 'Đại từ "I" đi với dạng to be nào?', options: ['am', 'are', 'is'], answer: 0, explain: 'Chủ ngữ "I" luôn đi với "am".' },
            { q: 'Trong câu: "She is ___ engineer", từ còn thiếu là gì?', options: ['an', 'a', 'the'], answer: 0, explain: '"engineer" bắt đầu bằng nguyên âm /e/, bắt buộc dùng "an".' },
            { q: 'Từ "teacher" có trọng âm rơi vào đâu?', options: ['Âm 1: TEA-cher', 'Âm 2: tea-CHER'], answer: 0, explain: 'Danh từ 2 âm tiết thường nhấn âm đầu: TEA-cher.' }
          ]
        },
        {
          type: 'choice',
          title: 'Lựa Chọn Nhịp Điệu Tiếp Theo (Không Trừng Phạt)',
          evidence: { claim: 'READ', mode: 'none' },
          intro: 'Tại Lingora, nghỉ ngơi hợp lý là một phần của quá trình học. Hãy chọn trạng thái mong muốn của bạn hôm nay:',
          questions: [
            {
              q: 'Bạn muốn làm gì tiếp theo?',
              options: [
                'Nghỉ ngơi hoàn toàn hôm nay để nạp năng lượng (Tốt cho não bộ)',
                'Xem lại các bài viết và bản ghi âm của mình trong trang Tiến độ',
                'Sẵn sàng bước tiếp vào Tuần 2: Thói quen & Đời sống hàng ngày'
              ],
              answer: 0,
              explain: 'Mọi lựa chọn đều được tôn trọng và lưu giữ an toàn. Hệ thống sẽ luôn chờ đón bạn với nhịp điệu phù hợp nhất khi bạn quay lại!'
            }
          ]
        }
      ]
    }
  ];

  const review = {
    READ: [
      {
        type: 'choice',
        title: 'Ôn lại Đọc hiểu Thông tin Cá nhân',
        evidence: { claim: 'READ', mode: 'independent', delayed: true, context: 'spaced-read' },
        intro: 'Đọc nhanh mẩu giới thiệu ngắn dưới đây:',
        passage: { kind: 'chat', from: 'Elena', text: "Hello! I'm Elena from Rome, Italy. I am an architect." },
        questions: [{ q: 'Elena làm nghề gì và đến từ đâu?', options: ['Kiến trúc sư (Architect) đến từ Ý', 'Bác sĩ đến từ Pháp', 'Giáo viên đến từ Úc'], answer: 0, explain: 'Elena là architect (kiến trúc sư) đến từ Rome, Italy.' }]
      }
    ],
    LISTEN: [
      {
        type: 'choice',
        title: 'Ôn lại Nghe hiểu Lời Giới thiệu',
        evidence: { claim: 'LISTEN', mode: 'independent', delayed: true, context: 'spaced-listen' },
        audio: "Hi! My name is Kenji from Osaka, Japan. I'm a graphic designer.",
        intro: 'Nghe đoạn ghi âm và chọn thông tin chính xác:',
        questions: [{ q: 'Kenji đến từ đâu?', options: ['Osaka, Japan (Nhật Bản)', 'Tokyo, Japan', 'Seoul, Korea'], answer: 0, explain: 'Kenji nói: "from Osaka, Japan."' }]
      }
    ],
    BE: [
      {
        type: 'fill',
        title: 'Ôn lại Dùng Động từ To Be',
        evidence: { claim: 'BE', mode: 'independent', delayed: true, context: 'spaced-be' },
        intro: 'Điền dạng to be thích hợp:',
        items: [
          { prompt: 'David and I ___ good friends.', accepted: ['are'], hint: 'Chủ ngữ 2 người (số nhiều) đi với are.', explain: 'David and I are good friends.' },
          { prompt: 'She ___ a talented doctor.', accepted: ['is'], hint: 'Chủ ngữ ngôi thứ ba số ít.', explain: 'She is a talented doctor.' }
        ]
      }
    ],
    QA: [
      {
        type: 'choice',
        title: 'Ôn lại Hỏi và Đáp',
        evidence: { claim: 'QA', mode: 'independent', delayed: true, context: 'spaced-qa' },
        intro: 'Chọn câu đáp lại tự nhiên nhất:',
        questions: [{ q: '"Are you on vacation?"', options: ['Yes, I am. The city is great!', 'My name is An.', 'I am from Vietnam.'], answer: 0, explain: 'Trả lời câu hỏi Yes/No xác nhận kỳ nghỉ.' }]
      }
    ]
  };

  const verify = {
    BE: {
      probe: {
        type: 'choice',
        title: 'Kiểm tra Nhanh Động từ To Be',
        evidence: { claim: 'BE', mode: 'independent', context: 'verify-be' },
        intro: 'Chọn phương án chính xác nhất:',
        questions: [{ q: 'Câu nào dưới đây đúng ngữ pháp?', options: ['He is from Da Nang.', 'He are from Da Nang.', 'He am from Da Nang.'], answer: 0, explain: 'He đi với is.' }]
      },
      recover: {
        type: 'pattern',
        title: 'Nhắc Lại Mảnh Ghép To Be',
        text: 'Ghi nhớ quy tắc: I -> am, You/We/They -> are, He/She/It -> is.',
        rows: [
          ['I', 'am', 'a student'],
          ['You', 'are', 'my friend'],
          ['He / She', 'is', 'a nurse']
        ]
      },
      next: {
        type: 'fill',
        title: 'Luyện tập Ngắn Củng Cố',
        guided: true,
        evidence: { claim: 'BE', mode: 'none' },
        intro: 'Điền từ:',
        items: [{ prompt: 'He ___ an IT engineer.', accepted: ['is'], hint: 'He đi với is.', explain: 'He is an IT engineer.' }]
      }
    }
  };

  const check = [
    {
      type: 'choice',
      title: 'Kiểm tra Ban Đầu: Câu Giới Thiệu Đơn Giản',
      optional: true,
      questions: [
        { q: 'Chọn câu chào hỏi và giới thiệu chuẩn:', options: ['Hello! My name is Linh.', 'Hello! My Linh.', 'Hi! Name Linh.'], answer: 0, explain: 'My name is Linh là câu chuẩn mực.' }
      ]
    },
    {
      type: 'choice',
      title: 'Kiểm tra Ban Đầu: Động từ To Be',
      optional: true,
      questions: [
        { q: 'Điền từ: "I ___ from Vietnam."', options: ['am', 'is', 'are'], answer: 0, explain: 'I đi với am.' }
      ]
    }
  ];

  return { claims, days, review, verify, check };
})();
