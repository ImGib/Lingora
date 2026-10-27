'use client';

import React, { useState, useRef, useEffect } from 'react';
import { getIpaPhonemes } from '@/lib/api';
import { IpaMouthStudio, type PhonemeSpec } from './ipa-mouth-studio';

export interface FullIpaSoundItem extends PhonemeSpec {
  category: 'monophthong' | 'diphthong' | 'consonant';
  subCategory?: string;
}

const RAW_44_IPA_PHONEMES: FullIpaSoundItem[] = [
  // 1. Monophthongs (12 âm)
  {
    symbol: '/iː/',
    label: 'Âm i dài',
    category: 'monophthong',
    subCategory: 'Nguyên âm dài',
    tag: 'Khẩu hình Căng ngang (Cười tươi)',
    mouthDesc: 'Kéo căng 2 khóe miệng sang ngang như đang mỉm cười',
    tongueDesc: 'Thân lưỡi nâng cao sát vòm miệng trên',
    voiceDesc: 'Rung dây thanh · Ngân dài 2 nhịp (i...)',
    frontCaption: '↔ Căng ngang 2 bên khóe miệng như đang cười',
    sideCaption: 'Lưỡi nâng cao sát vòm · Ngân dài 2 nhịp',
    sampleWord: 'see',
    sampleIpa: '/siː/',
    sampleMeaning: 'nhìn thấy'
  },
  {
    symbol: '/ɪ/',
    label: 'Âm i ngắn',
    category: 'monophthong',
    subCategory: 'Nguyên âm ngắn',
    tag: 'Khẩu hình Thả lỏng (Mở hờ tự nhiên)',
    mouthDesc: 'Môi mở hờ tự nhiên, KHÔNG kéo căng sang hai bên',
    tongueDesc: 'Lưỡi hạ thấp hơn /iː/ một chút, cơ lưỡi thả lỏng',
    voiceDesc: 'Rung dây thanh · Phát âm cực gọn 1 nhịp',
    frontCaption: '↕ Môi mở hờ thả lỏng · Đọc dứt khoát 1 nhịp',
    sideCaption: 'Lưỡi ở tầm giữa · Thả lỏng cơ hàm',
    sampleWord: 'sit',
    sampleIpa: '/sɪt/',
    sampleMeaning: 'ngồi'
  },
  {
    symbol: '/e/',
    label: 'Âm e ngắn',
    category: 'monophthong',
    subCategory: 'Nguyên âm ngắn',
    tag: 'Khẩu hình Mở vừa tự nhiên',
    mouthDesc: 'Môi mở rộng vừa phải hơn /ɪ/, khóe miệng hơi giãn',
    tongueDesc: 'Lưỡi nằm ở vị trí trung tâm giữa khoang miệng',
    voiceDesc: 'Rung dây thanh · Phát âm gọn ghẽ, dứt khoát',
    frontCaption: '↕ Môi mở vừa phải, hàm dưới hạ nhẹ',
    sideCaption: 'Thân lưỡi ở tầm trung, không nâng quá cao',
    sampleWord: 'bed',
    sampleIpa: '/bed/',
    sampleMeaning: 'chiếc giường'
  },
  {
    symbol: '/æ/',
    label: 'Âm e bẹt (a bẹt)',
    category: 'monophthong',
    subCategory: 'Nguyên âm ngắn',
    tag: 'Khẩu hình Mở rộng tối đa & Căng khóe miệng',
    mouthDesc: 'Hạ quai hàm sâu xuống dưới, khóe miệng kéo rộng sang 2 bên',
    tongueDesc: 'Thân lưỡi nằm sát sàn miệng, đầu lưỡi chạm chân răng dưới',
    voiceDesc: 'Rung dây thanh · Âm thanh lai giữa "a" và "e"',
    frontCaption: '↕ Mở hàm cực rộng kết hợp căng khóe miệng',
    sideCaption: 'Lưỡi hạ phẳng xuống sàn miệng',
    sampleWord: 'cat',
    sampleIpa: '/kæt/',
    sampleMeaning: 'con mèo'
  },
  {
    symbol: '/ɑː/',
    label: 'Âm a dài',
    category: 'monophthong',
    subCategory: 'Nguyên âm dài',
    tag: 'Khẩu hình Mở dọc sâu (Như khám họng)',
    mouthDesc: 'Hạ hàm mở miệng rộng theo chiều dọc như khi bác sĩ bảo "A"',
    tongueDesc: 'Lưỡi hạ thấp và kéo nhẹ về phía sau khoang miệng',
    voiceDesc: 'Rung dây thanh · Ngân dài trầm ấm trong cuống họng',
    frontCaption: '↕ Mở sâu theo chiều dọc, thả lỏng môi',
    sideCaption: 'Gốc lưỡi kéo nhẹ về phía cuống họng',
    sampleWord: 'car',
    sampleIpa: '/kɑːr/',
    sampleMeaning: 'xe hơi'
  },
  {
    symbol: '/ɒ/',
    label: 'Âm o ngắn',
    category: 'monophthong',
    subCategory: 'Nguyên âm ngắn',
    tag: 'Khẩu hình Tròn môi nhẹ & Mở rộng',
    mouthDesc: 'Môi hơi tròn nhẹ, hàm hạ xuống khá sâu',
    tongueDesc: 'Gốc lưỡi hạ thấp ở đáy miệng',
    voiceDesc: 'Rung dây thanh · Phát âm dứt khoát 1 nhịp',
    frontCaption: '⭕ Môi tròn nhẹ, hàm dưới hạ sâu',
    sideCaption: 'Khoang miệng mở thoáng, cuống lưỡi thả lỏng',
    sampleWord: 'pot',
    sampleIpa: '/pɒt/',
    sampleMeaning: 'cái nồi'
  },
  {
    symbol: '/ɔː/',
    label: 'Âm o dài',
    category: 'monophthong',
    subCategory: 'Nguyên âm dài',
    tag: 'Khẩu hình Chu tròn môi & Đẩy về trước',
    mouthDesc: 'Môi chu tròn rõ rệt, đẩy nhẹ về phía trước',
    tongueDesc: 'Phần sau của lưỡi nâng cao về phía vòm mềm',
    voiceDesc: 'Rung dây thanh · Âm ngân sâu, dày dặn',
    frontCaption: '⭕ Môi chu tròn rõ rệt như huýt sáo',
    sideCaption: 'Gốc lưỡi nâng cao, âm thanh thoát ra tròn vành',
    sampleWord: 'door',
    sampleIpa: '/dɔːr/',
    sampleMeaning: 'cánh cửa'
  },
  {
    symbol: '/ʊ/',
    label: 'Âm u ngắn',
    category: 'monophthong',
    subCategory: 'Nguyên âm ngắn',
    tag: 'Khẩu hình Tròn môi hờ thả lỏng',
    mouthDesc: 'Môi hơi tròn nhưng cơ môi hoàn toàn thả lỏng',
    tongueDesc: 'Cuống lưỡi nâng nhẹ, không căng cứng',
    voiceDesc: 'Rung dây thanh · Phát âm bật nhanh, dứt khoát',
    frontCaption: '○ Môi hơi cong tròn tự nhiên, không chu chặt',
    sideCaption: 'Thân lưỡi nâng vừa phải, giữ độ thả lỏng',
    sampleWord: 'good',
    sampleIpa: '/ɡʊd/',
    sampleMeaning: 'tốt, hay'
  },
  {
    symbol: '/uː/',
    label: 'Âm u dài',
    category: 'monophthong',
    subCategory: 'Nguyên âm dài',
    tag: 'Khẩu hình Chu môi chặt & Đẩy tới trước',
    mouthDesc: 'Hai môi chu tròn thu nhỏ khẩu hình như thổi nến',
    tongueDesc: 'Cuống lưỡi nâng rất cao sát vòm miệng mềm',
    voiceDesc: 'Rung dây thanh · Ngân dài 2 nhịp đều đặn',
    frontCaption: '● Môi chu nhọn tròn nhỏ như đang huýt sáo',
    sideCaption: 'Gốc lưỡi nâng cao tối đa, ngân dài',
    sampleWord: 'moon',
    sampleIpa: '/muːn/',
    sampleMeaning: 'mặt trăng'
  },
  {
    symbol: '/ʌ/',
    label: 'Âm á ngắn',
    category: 'monophthong',
    subCategory: 'Nguyên âm ngắn',
    tag: 'Khẩu hình Thả lỏng mở hờ (Như âm ă)',
    mouthDesc: 'Miệng mở hờ tự nhiên theo chiều dọc, môi thả lỏng',
    tongueDesc: 'Lưỡi nằm thấp ở giữa miệng, không chạm răng',
    voiceDesc: 'Rung dây thanh · Phát âm bật dứt khoát',
    frontCaption: '↕ Môi thả lỏng, hạ hàm nhẹ nhàng',
    sideCaption: 'Cơ lưỡi hoàn toàn thư giãn ở giữa miệng',
    sampleWord: 'cup',
    sampleIpa: '/kʌp/',
    sampleMeaning: 'chiếc tách'
  },
  {
    symbol: '/ɜː/',
    label: 'Âm ơ dài (Cong lưỡi)',
    category: 'monophthong',
    subCategory: 'Nguyên âm dài',
    tag: 'Khẩu hình Thả lỏng & Cong đầu lưỡi nhẹ',
    mouthDesc: 'Môi mở hờ vừa phải, cơ mặt hoàn toàn thư giãn',
    tongueDesc: 'Thân lưỡi hơi cong nhẹ lên phía vòm họng',
    voiceDesc: 'Rung dây thanh · Âm ngân dài, có độ dày trầm',
    frontCaption: '— Miệng mở hờ thăng bằng, cơ mặt thư thái',
    sideCaption: 'Đầu lưỡi cuộn nhẹ hướng lên trên, ngân đều',
    sampleWord: 'bird',
    sampleIpa: '/bɜːrd/',
    sampleMeaning: 'con chim'
  },
  {
    symbol: '/ə/',
    label: 'Âm Schwa (Âm ơ nhẹ)',
    category: 'monophthong',
    subCategory: 'Nguyên âm ngắn',
    tag: 'Khẩu hình Thư giãn tuyệt đối (Âm phổ biến nhất)',
    mouthDesc: 'Môi, hàm và mặt hoàn toàn không dùng lực',
    tongueDesc: 'Lưỡi đặt tự nhiên ở tâm khoang miệng',
    voiceDesc: 'Rung dây thanh · Âm cực nhẹ, lướt qua trong tích tắc',
    frontCaption: '≈ Miệng mở tự nhiên như lúc đang thở',
    sideCaption: 'Toàn bộ cơ quan phát âm ở trạng thái nghỉ',
    sampleWord: 'teacher',
    sampleIpa: '/ˈtiːtʃər/',
    sampleMeaning: 'giáo viên'
  },

  // 2. Diphthongs (8 âm)
  {
    symbol: '/eɪ/',
    label: 'Âm đôi /eɪ/ (ây)',
    category: 'diphthong',
    subCategory: 'Nguyên âm đôi',
    tag: 'Khẩu hình Trượt đôi (Mở vừa ➔ Khép cười)',
    mouthDesc: 'Bắt đầu mở vừa đọc /e/ (ê), rồi trượt khép dần sang /ɪ/ (i)',
    tongueDesc: 'Lưỡi lướt mượt từ vị trí giữa miệng lên cao',
    voiceDesc: 'Nguyên âm đôi trượt mượt (ê ↷ i = ây)',
    frontCaption: '1. Mở vừa đọc /e/ ↷ 2. Khép cười sang /ɪ/',
    sideCaption: 'Thân lưỡi trượt nâng dần từ giữa lên cao',
    sampleWord: 'name',
    sampleIpa: '/neɪm/',
    sampleMeaning: 'tên gọi'
  },
  {
    symbol: '/aɪ/',
    label: 'Âm đôi /aɪ/ (ai)',
    category: 'diphthong',
    subCategory: 'Nguyên âm đôi',
    tag: 'Khẩu hình Mở rộng ➔ Khép dẹp mỉm cười',
    mouthDesc: 'Mở rộng miệng phát âm /ɑː/, sau đó khép dần môi sang /ɪ/',
    tongueDesc: 'Lưỡi di chuyển từ đáy khoang miệng vút lên vòm trên',
    voiceDesc: 'Rung dây thanh · Âm thứ nhất chiếm 70% thời lượng',
    frontCaption: '1. Mở sâu âm /a/ ↷ 2. Mỉm cười khép âm /i/',
    sideCaption: 'Lưỡi trượt từ sàn miệng lên sát răng trên',
    sampleWord: 'my',
    sampleIpa: '/maɪ/',
    sampleMeaning: 'của tôi'
  },
  {
    symbol: '/ɔɪ/',
    label: 'Âm đôi /ɔɪ/ (oi)',
    category: 'diphthong',
    subCategory: 'Nguyên âm đôi',
    tag: 'Khẩu hình Tròn môi ➔ Mở dẹt mỉm cười',
    mouthDesc: 'Bắt đầu với môi tròn âm /ɔː/, sau đó nhích khóe miệng sang /ɪ/',
    tongueDesc: 'Lưỡi nâng từ vị trí cuống họng trượt dần lên trước',
    voiceDesc: 'Rung dây thanh · Chuyển động môi rõ nét từ tròn sang dẹt',
    frontCaption: '1. Môi tròn /o/ ↷ 2. Khóe miệng kéo dẹt /i/',
    sideCaption: 'Lưỡi lướt từ sau ra trước miệng',
    sampleWord: 'boy',
    sampleIpa: '/bɔɪ/',
    sampleMeaning: 'cậu bé'
  },
  {
    symbol: '/aʊ/',
    label: 'Âm đôi /aʊ/ (ao)',
    category: 'diphthong',
    subCategory: 'Nguyên âm đôi',
    tag: 'Khẩu hình Mở rộng ➔ Thu tròn chu môi',
    mouthDesc: 'Mở hàm rộng phát âm /ɑː/, rồi nhanh chóng thu tròn môi sang /ʊ/',
    tongueDesc: 'Lưỡi từ vị trí phẳng dưới đáy co dần về phía sau',
    voiceDesc: 'Rung dây thanh · Âm lướt từ thoáng sang gọn',
    frontCaption: '1. Mở to đọc /a/ ↷ 2. Chu tròn môi /u/',
    sideCaption: 'Lưỡi co lùi về phía sau khoang miệng',
    sampleWord: 'cow',
    sampleIpa: '/kaʊ/',
    sampleMeaning: 'con bò'
  },
  {
    symbol: '/əʊ/',
    label: 'Âm đôi /əʊ/ (âu)',
    category: 'diphthong',
    subCategory: 'Nguyên âm đôi',
    tag: 'Khẩu hình Mở hờ ➔ Thu nhỏ tròn môi',
    mouthDesc: 'Bắt đầu từ âm schwa /ə/ nhẹ, rồi hơi chúm môi lại thành /ʊ/',
    tongueDesc: 'Lưỡi dịch chuyển nhẹ nhàng từ vị trí trung lập ra sau',
    voiceDesc: 'Rung dây thanh · Âm điệu tròn trịa, ấm áp',
    frontCaption: '1. Môi hờ tự nhiên ↷ 2. Chúm tròn môi nhẹ',
    sideCaption: 'Thân lưỡi nâng nhẹ về phía sau khoang miệng',
    sampleWord: 'go',
    sampleIpa: '/ɡəʊ/',
    sampleMeaning: 'đi'
  },
  {
    symbol: '/ɪə/',
    label: 'Âm đôi /ɪə/ (ia)',
    category: 'diphthong',
    subCategory: 'Nguyên âm đôi',
    tag: 'Khẩu hình Cười nhẹ ➔ Mở hờ thả lỏng',
    mouthDesc: 'Bắt đầu với âm /ɪ/ dẹt môi, sau đó thả lỏng hàm sang /ə/',
    tongueDesc: 'Lưỡi hạ từ cao xuống vị trí thư giãn tự nhiên',
    voiceDesc: 'Rung dây thanh · Âm trượt mềm mại',
    frontCaption: '1. Cười nhẹ với /i/ ↷ 2. Thả lỏng toàn bộ sang /ơ/',
    sideCaption: 'Lưỡi hạ nhẹ từ trên vòm miệng xuống trung tâm',
    sampleWord: 'here',
    sampleIpa: '/hɪər/',
    sampleMeaning: 'ở đây'
  },
  {
    symbol: '/eə/',
    label: 'Âm đôi /eə/ (e-ơ)',
    category: 'diphthong',
    subCategory: 'Nguyên âm đôi',
    tag: 'Khẩu hình Mở vừa ➔ Mở hờ thả lỏng',
    mouthDesc: 'Bắt đầu từ âm /e/, hạ hàm nhẹ và lướt mượt sang /ə/',
    tongueDesc: 'Lưỡi giữ ở tầm giữa, hơi co nhẹ về sau',
    voiceDesc: 'Rung dây thanh · Âm thanh mềm, ngân nhẹ',
    frontCaption: '1. Mở vừa đọc /e/ ↷ 2. Thả lỏng cơ hàm sang /ơ/',
    sideCaption: 'Thân lưỡi nằm ngang ổn định trong khoang miệng',
    sampleWord: 'hair',
    sampleIpa: '/heər/',
    sampleMeaning: 'mái tóc'
  },
  {
    symbol: '/ʊə/',
    label: 'Âm đôi /ʊə/ (u-ơ)',
    category: 'diphthong',
    subCategory: 'Nguyên âm đôi',
    tag: 'Khẩu hình Hơi chu môi ➔ Thả lỏng tự nhiên',
    mouthDesc: 'Khởi đầu từ âm /ʊ/ tròn môi nhẹ, rồi mở thả lỏng cơ sang /ə/',
    tongueDesc: 'Lưỡi dịch chuyển từ sau tiến nhẹ về trung tâm',
    voiceDesc: 'Rung dây thanh · Âm lướt dịu dàng',
    frontCaption: '1. Môi tròn nhẹ /u/ ↷ 2. Miệng mở thở tự nhiên /ơ/',
    sideCaption: 'Lưỡi từ sau tiến về giữa khoang miệng',
    sampleWord: 'cure',
    sampleIpa: '/kjʊər/',
    sampleMeaning: 'chữa lành'
  },

  // 3. Consonants (24 âm)
  {
    symbol: '/p/',
    label: 'Phụ âm /p/ (Bật môi vô thanh)',
    category: 'consonant',
    subCategory: 'Âm vô thanh',
    tag: 'Khẩu hình Mím môi nén hơi & Bật mạnh',
    mouthDesc: 'Hai môi mím chặt chặn luồng hơi, sau đó mở bật dứt khoát',
    tongueDesc: 'Lưỡi thả lỏng, không tham gia cản hơi',
    voiceDesc: 'KHÔNG rung thanh quản · Chỉ có luồng gió bật ra (phụt)',
    frontCaption: '👄 Mím chặt 2 môi nén hơi rồi bật tung',
    sideCaption: 'Luồng gió mạnh bật ra làm bay tờ giấy trước miệng',
    sampleWord: 'pen',
    sampleIpa: '/pen/',
    sampleMeaning: 'cây bút'
  },
  {
    symbol: '/b/',
    label: 'Phụ âm /b/ (Bật môi hữu thanh)',
    category: 'consonant',
    subCategory: 'Âm hữu thanh',
    tag: 'Khẩu hình Mím môi bật & Rung cổ',
    mouthDesc: 'Hai môi mím lại chặn hơi rồi mở ra bật âm "bờ"',
    tongueDesc: 'Lưỡi thả lỏng tự nhiên dưới sàn miệng',
    voiceDesc: 'Rung mạnh dây thanh quản khi bật môi',
    frontCaption: '👄 Mím môi và rung dây thanh quản ở cổ',
    sideCaption: 'Áp suất hơi kết hợp độ rung dây thanh',
    sampleWord: 'bed',
    sampleIpa: '/bed/',
    sampleMeaning: 'cái giường'
  },
  {
    symbol: '/t/',
    label: 'Phụ âm /t/ (Bật đầu lưỡi vô thanh)',
    category: 'consonant',
    subCategory: 'Âm vô thanh',
    tag: 'Khẩu hình Đầu lưỡi chạm nướu trên & Bật gió',
    mouthDesc: 'Môi hé nhẹ tự nhiên, hai hàm răng mở hờ',
    tongueDesc: 'Đầu lưỡi áp chặt vào nướu sau răng cửa trên rồi giật bật xuống',
    voiceDesc: 'KHÔNG rung thanh quản · Luồng hơi xì bật tách sắc bén',
    frontCaption: '🦷 Răng hé mở, đầu lưỡi tì vào chân răng trên',
    sideCaption: 'Đầu lưỡi giật nhanh giải phóng luồng hơi bị nén',
    sampleWord: 'tea',
    sampleIpa: '/tiː/',
    sampleMeaning: 'trà'
  },
  {
    symbol: '/d/',
    label: 'Phụ âm /d/ (Bật đầu lưỡi hữu thanh)',
    category: 'consonant',
    subCategory: 'Âm hữu thanh',
    tag: 'Khẩu hình Đầu lưỡi gõ nướu & Rung cổ',
    mouthDesc: 'Miệng mở hờ tự nhiên',
    tongueDesc: 'Đầu lưỡi chạm nướu trên rồi hạ xuống phát âm',
    voiceDesc: 'Rung mạnh dây thanh quản khi bật âm',
    frontCaption: '👅 Đầu lưỡi gõ nhẹ nướu trên và rung thanh quản',
    sideCaption: 'Rung cuống họng tạo âm đờ gọn ghẽ',
    sampleWord: 'did',
    sampleIpa: '/dɪd/',
    sampleMeaning: 'đã làm'
  },
  {
    symbol: '/tʃ/',
    label: 'Phụ âm /tʃ/ (Chu môi bật gió vô thanh)',
    category: 'consonant',
    subCategory: 'Âm vô thanh',
    tag: 'Khẩu hình Chu môi tròn & Bật mạnh hơi',
    mouthDesc: 'Môi hơi chu tròn đẩy về phía trước như phát âm "ch"',
    tongueDesc: 'Đầu lưỡi chạm nướu răng trên rồi rút nhanh về sau',
    voiceDesc: 'KHÔNG rung cổ · Tiếng gió bật nổ dứt khoát',
    frontCaption: '👄 Chu môi tròn, đầu lưỡi bật khỏi nướu răng',
    sideCaption: 'Luồng gió thoát mạnh qua khe hẹp giữa lưỡi và vòm miệng',
    sampleWord: 'chin',
    sampleIpa: '/tʃɪn/',
    sampleMeaning: 'cái cằm'
  },
  {
    symbol: '/dʒ/',
    label: 'Phụ âm /dʒ/ (Chu môi bật rung hữu thanh)',
    category: 'consonant',
    subCategory: 'Âm hữu thanh',
    tag: 'Khẩu hình Chu môi & Rung mạnh cổ họng',
    mouthDesc: 'Môi chu tròn hướng về phía trước',
    tongueDesc: 'Đầu lưỡi chạm nướu rồi hạ xuống đồng thời tạo rung',
    voiceDesc: 'Rung rất mạnh dây thanh quản (âm "d/gi" dày dặn)',
    frontCaption: '👄 Chu tròn môi và cảm nhận cổ họng rung mạnh',
    sideCaption: 'Sự phối hợp giữa đầu lưỡi và rung thanh quản',
    sampleWord: 'joy',
    sampleIpa: '/dʒɔɪ/',
    sampleMeaning: 'niềm vui'
  },
  {
    symbol: '/k/',
    label: 'Phụ âm /k/ (Bật cuống lưỡi vô thanh)',
    category: 'consonant',
    subCategory: 'Âm vô thanh',
    tag: 'Khẩu hình Nâng cuống họng nén hơi & Bật khẹc',
    mouthDesc: 'Miệng mở tự nhiên',
    tongueDesc: 'Cuống lưỡi nâng áp chặt vào vòm mềm ngắt hơi rồi bật ra',
    voiceDesc: 'KHÔNG rung cổ · Âm bật khô giòn từ sâu trong họng',
    frontCaption: '↕ Miệng mở vừa, chặn hơi ở đáy họng',
    sideCaption: 'Cuống lưỡi chặn kín ngắt hơi rồi bật nổ',
    sampleWord: 'cat',
    sampleIpa: '/kæt/',
    sampleMeaning: 'con mèo'
  },
  {
    symbol: '/ɡ/',
    label: 'Phụ âm /ɡ/ (Bật cuống lưỡi hữu thanh)',
    category: 'consonant',
    subCategory: 'Âm hữu thanh',
    tag: 'Khẩu hình Cuống lưỡi bật & Rung cổ họng',
    mouthDesc: 'Miệng mở vừa phải',
    tongueDesc: 'Cuống lưỡi nâng chạm vòm mềm chặn hơi rồi hạ nhanh',
    voiceDesc: 'Rung mạnh dây thanh quản khi âm phát ra',
    frontCaption: '🗣 Rung cuống họng rõ rệt khi bật âm "gờ"',
    sideCaption: 'Cuống lưỡi chạm nhả khỏi vòm miệng mềm',
    sampleWord: 'get',
    sampleIpa: '/ɡet/',
    sampleMeaning: 'nhận được'
  },
  {
    symbol: '/f/',
    label: 'Phụ âm /f/ (Răng cắn môi dưới vô thanh)',
    category: 'consonant',
    subCategory: 'Âm vô thanh',
    tag: 'Khẩu hình Răng trên chạm môi dưới & Thổi hơi',
    mouthDesc: 'Răng cửa trên chạm nhẹ vào mặt trong của lòng môi dưới',
    tongueDesc: 'Lưỡi ở vị trí tự nhiên',
    voiceDesc: 'KHÔNG rung cổ · Hơi xì rít nhẹ qua kẽ răng và môi',
    frontCaption: '🦷 Răng cửa trên cắn nhẹ vành môi dưới',
    sideCaption: 'Luồng gió thổi đều qua kẽ hẹp răng-môi',
    sampleWord: 'fish',
    sampleIpa: '/fɪʃ/',
    sampleMeaning: 'con cá'
  },
  {
    symbol: '/v/',
    label: 'Phụ âm /v/ (Răng cắn môi dưới hữu thanh)',
    category: 'consonant',
    subCategory: 'Âm hữu thanh',
    tag: 'Khẩu hình Răng trên chạm môi dưới & Rung môi',
    mouthDesc: 'Răng cửa trên chạm nhẹ lòng môi dưới giống /f/',
    tongueDesc: 'Lưỡi ở trạng thái tự nhiên',
    voiceDesc: 'Rung mạnh dây thanh quản, làm tê nhẹ vành môi dưới',
    frontCaption: '🦷 Răng trên chạm môi dưới và làm rung tê môi',
    sideCaption: 'Dây thanh rung truyền độ rung đến bờ môi dưới',
    sampleWord: 'van',
    sampleIpa: '/væn/',
    sampleMeaning: 'xe tải nhỏ'
  },
  {
    symbol: '/θ/',
    label: 'Phụ âm /θ/ (Thè lưỡi cắn nhẹ vô thanh)',
    category: 'consonant',
    subCategory: 'Âm vô thanh',
    tag: 'Khẩu hình Đặt đầu lưỡi giữa hai hàm răng & Thổi hơi',
    mouthDesc: 'Hai hàm răng mở nhẹ, để lộ đầu lưỡi',
    tongueDesc: 'Đầu lưỡi hơi đưa ra ngoài kẹp nhẹ giữa hai hàm răng',
    voiceDesc: 'KHÔNG rung cổ · Thổi luồng gió mịn qua khe giữa lưỡi và răng',
    frontCaption: '👅 Đầu lưỡi đặt nhẹ giữa hai rìa răng cửa',
    sideCaption: 'Luồng hơi trượt mượt trên lưng lưỡi ra ngoài',
    sampleWord: 'think',
    sampleIpa: '/θɪŋk/',
    sampleMeaning: 'suy nghĩ'
  },
  {
    symbol: '/ð/',
    label: 'Phụ âm /ð/ (Thè lưỡi cắn nhẹ hữu thanh)',
    category: 'consonant',
    subCategory: 'Âm hữu thanh',
    tag: 'Khẩu hình Kẹp đầu lưỡi & Rung thanh quản',
    mouthDesc: 'Hai hàm răng hé mở, đầu lưỡi kẹp nhẹ giữa hai rìa răng',
    tongueDesc: 'Đầu lưỡi tì nhẹ vào rìa răng cửa trên',
    voiceDesc: 'Rung mạnh dây thanh quản, gây rung tê ở đầu lưỡi',
    frontCaption: '👅 Kẹp nhẹ đầu lưỡi và cảm nhận rung tê ở lưỡi',
    sideCaption: 'Dây thanh quản phát âm rung truyền lên răng-lưỡi',
    sampleWord: 'this',
    sampleIpa: '/ðɪs/',
    sampleMeaning: 'cái này'
  },
  {
    symbol: '/s/',
    label: 'Phụ âm /s/ (Xì kẽ răng vô thanh)',
    category: 'consonant',
    subCategory: 'Âm vô thanh',
    tag: 'Khẩu hình Hai hàm răng khép gần sát & Xì gió',
    mouthDesc: 'Môi hơi giãn sang 2 bên như đang cười nhẹ',
    tongueDesc: 'Đầu lưỡi nâng sát chân răng cửa trên nhưng KHÔNG chạm vào',
    voiceDesc: 'KHÔNG rung thanh quản · Tiếng xì sắc lạnh như tiếng rắn',
    frontCaption: '🦷 Răng khép hờ gần chạm, xì gió "sss" sắc nét',
    sideCaption: 'Hơi luồn qua rãnh hẹp giữa đầu lưỡi và ngạc cứng',
    sampleWord: 'see',
    sampleIpa: '/siː/',
    sampleMeaning: 'nhìn thấy'
  },
  {
    symbol: '/z/',
    label: 'Phụ âm /z/ (Xì kẽ răng hữu thanh)',
    category: 'consonant',
    subCategory: 'Âm hữu thanh',
    tag: 'Khẩu hình Khép hờ Răng & Rung cổ họng',
    mouthDesc: 'Môi hé nhẹ tự nhiên để lộ hai hàm răng',
    tongueDesc: 'Hai hàm răng khép gần chạm nhau, đầu lưỡi sát chân răng trên',
    voiceDesc: 'Rung mạnh dây thanh quản ở cổ + luồng hơi xì qua kẽ răng (zzz)',
    frontCaption: '🦷 Hai hàm răng khép hờ · Xì hơi rung "zzz"',
    sideCaption: '〰 Đầu lưỡi sát răng cửa · Rung thanh quản',
    sampleWord: 'is',
    sampleIpa: '/ɪz/',
    sampleMeaning: 'thì, là'
  },
  {
    symbol: '/ʃ/',
    label: 'Phụ âm /ʃ/ (Suỵt gió vô thanh)',
    category: 'consonant',
    subCategory: 'Âm vô thanh',
    tag: 'Khẩu hình Chu môi phễu & Thổi gió suỵt',
    mouthDesc: 'Hai môi chu tròn mở rộng như phễu đẩy về trước',
    tongueDesc: 'Thân lưỡi nâng cao sát vòm ngạc nhưng không chạm',
    voiceDesc: 'KHÔNG rung thanh quản · Luồng gió suỵt dày như bảo giữ im lặng',
    frontCaption: '👄 Môi chu phễu, tạo tiếng suỵt "shhh" êm dày',
    sideCaption: 'Khoang miệng rộng, hơi thoát qua khoảng vòm miệng cao',
    sampleWord: 'she',
    sampleIpa: '/ʃiː/',
    sampleMeaning: 'cô ấy'
  },
  {
    symbol: '/ʒ/',
    label: 'Phụ âm /ʒ/ (Suỵt gió hữu thanh)',
    category: 'consonant',
    subCategory: 'Âm hữu thanh',
    tag: 'Khẩu hình Chu môi phễu & Rung dây thanh',
    mouthDesc: 'Môi chu phễu như âm /ʃ/',
    tongueDesc: 'Lưỡi cong nhẹ nâng cao hướng về vòm ngạc',
    voiceDesc: 'Rung rất mạnh dây thanh quản (như tiếng cánh ong vo ve)',
    frontCaption: '👄 Môi chu phễu và rung mạnh cổ họng',
    sideCaption: 'Độ rung sâu tạo nên âm điệu sang trọng đặc trưng',
    sampleWord: 'vision',
    sampleIpa: '/ˈvɪʒ.ən/',
    sampleMeaning: 'tầm nhìn'
  },
  {
    symbol: '/h/',
    label: 'Phụ âm /h/ (Thở hơi vô thanh)',
    category: 'consonant',
    subCategory: 'Âm vô thanh',
    tag: 'Khẩu hình Mở miệng tự nhiên & Thở hắt hơi',
    mouthDesc: 'Môi mở hờ thư thái theo hình dáng nguyên âm đứng sau nó',
    tongueDesc: 'Lưỡi nằm thả lỏng hoàn toàn',
    voiceDesc: 'KHÔNG rung cổ · Tiếng thở hắt nhẹ như phà hơi vào gương',
    frontCaption: '≈ Miệng mở nhẹ như đang thở dài tự nhiên',
    sideCaption: 'Luồng hơi ấm thoát êm dịu từ thanh quản',
    sampleWord: 'hat',
    sampleIpa: '/hæt/',
    sampleMeaning: 'chiếc mũ'
  },
  {
    symbol: '/m/',
    label: 'Phụ âm /m/ (Ngậm môi âm mũi)',
    category: 'consonant',
    subCategory: 'Âm mũi',
    tag: 'Khẩu hình Ngậm khép 2 môi (Âm mũi)',
    mouthDesc: 'Hai môi khép chạm nhẹ vào nhau ở cuối từ',
    tongueDesc: 'Lưỡi thả lỏng hoàn toàn bên trong khoang miệng',
    voiceDesc: 'Rung dây thanh, luồng hơi đi lên qua khoang mũi ("ừm")',
    frontCaption: '👄 Hai môi ngậm khép nhẹ vào nhau',
    sideCaption: '👃 Luồng hơi rung thoát ra qua khoang mũi',
    sampleWord: 'my',
    sampleIpa: '/maɪ/',
    sampleMeaning: 'của tôi'
  },
  {
    symbol: '/n/',
    label: 'Phụ âm /n/ (Đầu lưỡi chặn âm mũi)',
    category: 'consonant',
    subCategory: 'Âm mũi',
    tag: 'Khẩu hình Đầu lưỡi dán chặt nướu trên',
    mouthDesc: 'Miệng mở hờ tự nhiên',
    tongueDesc: 'Đầu lưỡi áp dính hoàn toàn vào nướu răng cửa trên chặn hơi',
    voiceDesc: 'Rung dây thanh · Luồng hơi thoát ra đằng mũi ("ừn")',
    frontCaption: '👅 Đầu lưỡi dán sát ngạc trên chặn kín miệng',
    sideCaption: '👃 Hơi rung dội lên khoang mũi tạo âm êm',
    sampleWord: 'now',
    sampleIpa: '/naʊ/',
    sampleMeaning: 'bây giờ'
  },
  {
    symbol: '/ŋ/',
    label: 'Phụ âm /ŋ/ (Cuống lưỡi chặn âm mũi)',
    category: 'consonant',
    subCategory: 'Âm mũi',
    tag: 'Khẩu hình Cuống lưỡi dán vòm mềm',
    mouthDesc: 'Miệng mở khá rộng',
    tongueDesc: 'Phần cuống lưỡi nâng áp chặt vào vòm miệng mềm ngắt lối miệng',
    voiceDesc: 'Rung dây thanh · Âm ngân thoát qua mũi như âm "ng" tiếng Việt',
    frontCaption: '↕ Miệng mở tự nhiên, chặn hơi ở đáy họng',
    sideCaption: '👃 Toàn bộ luồng rung thoát ra ngách mũi',
    sampleWord: 'sing',
    sampleIpa: '/sɪŋ/',
    sampleMeaning: 'hát'
  },
  {
    symbol: '/l/',
    label: 'Phụ âm /l/ (Âm cạnh lưỡi)',
    category: 'consonant',
    subCategory: 'Âm bán nguyên âm / lướt',
    tag: 'Khẩu hình Đầu lưỡi chạm nướu & Hơi tràn 2 bên',
    mouthDesc: 'Miệng mở hờ tự nhiên',
    tongueDesc: 'Đầu lưỡi chạm chắc vào nướu sau răng trên, 2 mép lưỡi hạ',
    voiceDesc: 'Rung dây thanh · Luồng hơi lướt êm qua 2 bên rìa mép lưỡi',
    frontCaption: '👅 Đầu lưỡi đặt ở chân răng cửa trên',
    sideCaption: 'Hơi trôi sang hai bên mạn sườn lưỡi',
    sampleWord: 'leg',
    sampleIpa: '/leɡ/',
    sampleMeaning: 'cái chân'
  },
  {
    symbol: '/r/',
    label: 'Phụ âm /r/ (Âm cuộn lưỡi)',
    category: 'consonant',
    subCategory: 'Âm bán nguyên âm / lướt',
    tag: 'Khẩu hình Chu môi & Cong đầu lưỡi vào trong',
    mouthDesc: 'Môi hơi chu tròn đẩy nhẹ ra phía trước',
    tongueDesc: 'Đầu lưỡi cong cuộn ngược về phía sau vòm họng nhưng KHÔNG chạm',
    voiceDesc: 'Rung dây thanh · Âm thanh trầm, ấm và uốn lượn',
    frontCaption: '👄 Môi hơi chúm nhẹ, đầu lưỡi uốn cong',
    sideCaption: 'Đầu lưỡi lơ lửng không chạm bất kỳ điểm nào trên vòm',
    sampleWord: 'red',
    sampleIpa: '/red/',
    sampleMeaning: 'màu đỏ'
  },
  {
    symbol: '/w/',
    label: 'Phụ âm /w/ (Âm lướt tròn môi)',
    category: 'consonant',
    subCategory: 'Âm bán nguyên âm / lướt',
    tag: 'Khẩu hình Chu môi nhọn như huýt sáo rồi mở ra',
    mouthDesc: 'Bắt đầu từ vị trí chu tròn môi nhỏ như âm /uː/ rồi mở nhanh',
    tongueDesc: 'Cuống lưỡi nâng cao về phía vòm mềm rồi thả lỏng',
    voiceDesc: 'Rung dây thanh · Âm lướt chuyển tiếp sống động',
    frontCaption: '○ Môi chúm tròn cực nhỏ rồi bung mở',
    sideCaption: 'Sự phối hợp giữa cơ môi và cuống họng',
    sampleWord: 'wet',
    sampleIpa: '/wet/',
    sampleMeaning: 'ẩm ướt'
  },
  {
    symbol: '/j/',
    label: 'Phụ âm /j/ (Âm lướt dẹt môi)',
    category: 'consonant',
    subCategory: 'Âm bán nguyên âm / lướt',
    tag: 'Khẩu hình Kéo dẹp khóe miệng như âm /iː/',
    mouthDesc: 'Hai khóe miệng giãn sang bên như cười rồi trượt sang nguyên âm kế',
    tongueDesc: 'Thân lưỡi nâng cao sát vòm cứng',
    voiceDesc: 'Rung dây thanh · Lướt nhanh tạo âm "d-i" mềm mại',
    frontCaption: '↔ Khóe miệng căng ngang rồi trượt mượt',
    sideCaption: 'Lưng lưỡi dâng cao gần chạm ngạc cứng',
    sampleWord: 'yes',
    sampleIpa: '/jes/',
    sampleMeaning: 'vâng, có'
  }
];

const PHONEME_PEDAGOGICAL_META: Record<string, { isVoiced: boolean; isLong?: boolean; vietnameseTip: string }> = {
  '/iː/': { isVoiced: true, isLong: true, vietnameseTip: 'Người Việt hay đọc ngắn như chữ "i" trong "ti vi". Hãy kéo căng 2 khóe miệng sang ngang như đang cười tươi và ngân dài 2 nhịp.' },
  '/ɪ/': { isVoiced: true, isLong: false, vietnameseTip: 'Đừng đọc thành "i" hay "ê". Hãy thả lỏng hoàn toàn cơ miệng và hàm, phát âm cực dứt khoát nửa nhịp.' },
  '/e/': { isVoiced: true, isLong: false, vietnameseTip: 'Mở rộng miệng vừa phải hơn âm "e" tiếng Việt, phát âm dứt khoát không kéo dài.' },
  '/æ/': { isVoiced: true, isLong: false, vietnameseTip: 'Âm "a bẹt" huyền thoại. Hạ cằm thật sâu, khóe miệng kéo rộng sang hai bên, phát âm lai giữa "a" và "e".' },
  '/ɑː/': { isVoiced: true, isLong: true, vietnameseTip: 'Mở rộng miệng tròn, lưỡi hạ thật thấp và sâu ở cuống họng, ngân dài "a..." trầm và ấm.' },
  '/ɒ/': { isVoiced: true, isLong: false, vietnameseTip: 'Khẩu hình tròn môi nhẹ, hàm hạ sâu, phát âm dứt khoát gọn gàng (như trong box, hot).' },
  '/ɔː/': { isVoiced: true, isLong: true, vietnameseTip: 'Chu môi tròn hẳn thành hình ống, ngân dài "o..." sâu trong cuống họng 2 nhịp.' },
  '/ʊ/': { isVoiced: true, isLong: false, vietnameseTip: 'Đừng chu mỏ đọc thành "u" tiếng Việt. Môi mở hờ thả lỏng, phát âm cực gọn nửa nhịp (như trong book, put).' },
  '/uː/': { isVoiced: true, isLong: true, vietnameseTip: 'Chu môi thật tròn và đưa ra phía trước, ngân dài âm "u..." căng tròn 2 nhịp (như trong food, blue).' },
  '/ʌ/': { isVoiced: true, isLong: false, vietnameseTip: 'Âm "á" ngắn nhẹ. Miệng mở tự nhiên, lưỡi thả lỏng ở giữa, phát âm gọn dứt khoát (như trong cup, love).' },
  '/ɜː/': { isVoiced: true, isLong: true, vietnameseTip: 'Môi hơi mở, đầu lưỡi hơi cong nhẹ hướng lên vòm trên, ngân dài âm "ơ..." sâu trong cuống họng (như trong bird, girl).' },
  '/ə/': { isVoiced: true, isLong: false, vietnameseTip: 'Âm Schwa phổ biến nhất tiếng Anh. Thả lỏng toàn bộ cơ mặt, đọc thật nhẹ và ngắn (như trong about, teacher).' },
  '/eɪ/': { isVoiced: true, vietnameseTip: 'Tránh đọc thành âm "ây" phẳng của tiếng Việt. Bắt đầu từ /e/ rồi lướt mượt khép dần sang /ɪ/ (như trong day, make).' },
  '/aɪ/': { isVoiced: true, vietnameseTip: 'Mở rộng miệng đọc /a/ rồi trượt khép mượt sang /ɪ/, tạo thành âm "ai" sang trọng (như trong time, my).' },
  '/ɔɪ/': { isVoiced: true, vietnameseTip: 'Chu tròn môi đọc /ɔː/ rồi trượt dẹt sang /ɪ/ (như trong boy, choice).' },
  '/aʊ/': { isVoiced: true, vietnameseTip: 'Mở rộng miệng /a/ rồi chu môi trượt sang /ʊ/, không đọc thành "ao" cụt ngủn (như trong now, sound).' },
  '/əʊ/': { isVoiced: true, vietnameseTip: 'Bắt đầu từ âm /ə/ thả lỏng rồi chu tròn môi về /ʊ/, không đọc thành âm "ô" thuần (như trong go, home).' },
  '/ɪə/': { isVoiced: true, vietnameseTip: 'Đọc âm /ɪ/ rồi thả lỏng lướt về /ə/, tạo thành âm "ia" nhẹ nhàng (như trong here, near).' },
  '/eə/': { isVoiced: true, vietnameseTip: 'Đọc âm /e/ mở vừa rồi lướt về /ə/ (như trong hair, care).' },
  '/ʊə/': { isVoiced: true, vietnameseTip: 'Chu môi nhẹ đọc /ʊ/ rồi thả lỏng trượt về /ə/ (như trong tourist, poor).' },
  '/p/': { isVoiced: false, vietnameseTip: 'Âm vô thanh: Ngậm chặt 2 môi rồi bật mạnh luồng hơi ra, cổ họng KHÔNG được rung (đặt tờ giấy trước miệng sẽ bay).' },
  '/b/': { isVoiced: true, vietnameseTip: 'Âm hữu thanh: Ngậm 2 môi và bật ra đồng thời làm RUNG mạnh dây thanh quản ở cổ.' },
  '/t/': { isVoiced: false, vietnameseTip: 'Đầu lưỡi chạm gờ nướu trên rồi giật bật mạnh luồng hơi xuống, cổ họng không rung (tránh đọc thành chữ "th" hay "t" tiếng Việt).' },
  '/d/': { isVoiced: true, vietnameseTip: 'Vị trí lưỡi giống /t/ nhưng phải RUNG cổ họng thật rõ ràng, đặc biệt ở cuối từ (need, bad).' },
  '/tʃ/': { isVoiced: false, vietnameseTip: 'Chu môi nhẹ, đầu lưỡi chạm gờ nướu rồi bật mạnh xì hơi (như trong church, watch), không rung cổ.' },
  '/dʒ/': { isVoiced: true, vietnameseTip: 'Khẩu hình giống /tʃ/ nhưng bắt buộc phải RUNG mạnh cổ họng (như trong judge, job, age).' },
  '/k/': { isVoiced: false, vietnameseTip: 'Nâng cuống lưỡi chạm vòm mềm chặn hơi rồi bật dứt khoát tiếng "khạc" hơi nhẹ, cổ họng không rung (cat, like).' },
  '/ɡ/': { isVoiced: true, vietnameseTip: 'Vị trí giống /k/ nhưng chặn hơi rồi bật ra kèm RUNG mạnh dây thanh quản (go, big).' },
  '/f/': { isVoiced: false, vietnameseTip: 'Răng cửa trên chạm nhẹ môi dưới, đẩy luồng hơi xì qua kẽ răng, cổ họng không rung (coffee, laugh).' },
  '/v/': { isVoiced: true, vietnameseTip: 'Răng cửa trên cắn môi dưới như /f/ nhưng phải RUNG mạnh cổ họng (voice, leave).' },
  '/θ/': { isVoiced: false, vietnameseTip: 'Cực kỳ quan trọng: Thè đầu lưỡi ra giữa 2 hàm răng, thổi luồng hơi xì qua mặt lưỡi, không rung cổ (think, tooth). Tuyệt đối không đọc thành "th" hay "t".' },
  '/ð/': { isVoiced: true, vietnameseTip: 'Đặt lưỡi giữa 2 răng giống /θ/ nhưng phải RUNG cổ họng (this, that, mother).' },
  '/s/': { isVoiced: false, vietnameseTip: 'Khép 2 hàm răng gần nhau, đẩy luồng hơi xì rít mỏng qua kẽ răng (see, rice), cổ không rung.' },
  '/z/': { isVoiced: true, vietnameseTip: 'Khép răng xì hơi giống /s/ nhưng phải RUNG mạnh thanh quản (zoo, easy, buzz).' },
  '/ʃ/': { isVoiced: false, vietnameseTip: 'Âm "s nặng": Chu môi đưa về phía trước, thân lưỡi vồng cao xì hơi mạnh như đang ra hiệu "Suỵt!" (she, wash).' },
  '/ʒ/': { isVoiced: true, vietnameseTip: 'Khẩu hình giống /ʃ/ nhưng rung mạnh cổ họng (vision, measure, pleasure).' },
  '/h/': { isVoiced: false, vietnameseTip: 'Mở miệng tự nhiên, thở hắt một luồng hơi nhẹ từ cuống họng ra ngoài như tiếng thở dài (hat, home).' },
  '/m/': { isVoiced: true, vietnameseTip: 'Ngậm khép 2 môi, rung thanh quản cho luồng hơi thoát ra qua đường mũi (man, time).' },
  '/n/': { isVoiced: true, vietnameseTip: 'Đầu lưỡi dán chặt lên gờ nướu trên, hơi thoát qua mũi (no, sun).' },
  '/ŋ/': { isVoiced: true, vietnameseTip: 'Cuống lưỡi nâng cao bịt kín vòm mềm, hơi rung thoát qua mũi (sing, long, ring).' },
  '/l/': { isVoiced: true, vietnameseTip: 'Đầu lưỡi chạm nướu trên, luồng hơi thoát ra 2 bên mép lưỡi. Khi đứng cuối từ (Dark L: milk, feel) hãy giữ nguyên đầu lưỡi ở nướu.' },
  '/r/': { isVoiced: true, vietnameseTip: 'Chu môi nhẹ, đầu lưỡi uốn cong về phía sau nhưng KHÔNG được chạm vào vòm miệng (red, run).' },
  '/w/': { isVoiced: true, vietnameseTip: 'Chu môi tròn thật nhỏ đưa ra trước rồi mở bung mượt mà (we, water).' },
  '/j/': { isVoiced: true, vietnameseTip: 'Nâng thân lưỡi sát vòm cứng, lướt nhanh tạo âm "d-i" mềm mại (yes, you, young).' }
};

export const ALL_44_IPA_PHONEMES: FullIpaSoundItem[] = RAW_44_IPA_PHONEMES.map((item) => {
  const meta = PHONEME_PEDAGOGICAL_META[item.symbol];
  return {
    ...item,
    isVoiced: meta?.isVoiced ?? true,
    isLong: meta?.isLong,
    vietnameseTip: meta?.vietnameseTip,
  };
});

type TabFilter = 'all' | 'monophthong' | 'diphthong' | 'consonant_voiced' | 'consonant_voiceless';

export function IpaFullChart() {
  const [phonemes, setPhonemes] = useState<FullIpaSoundItem[]>(ALL_44_IPA_PHONEMES);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('/iː/');
  const [tabFilter, setTabFilter] = useState<TabFilter>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFloatingJump, setShowFloatingJump] = useState<boolean>(false);

  useEffect(() => {
    getIpaPhonemes()
      .then((data) => {
        if (data && data.length > 0) {
          setPhonemes(data as unknown as FullIpaSoundItem[]);
        }
      })
      .catch((err) => {
        console.warn('Could not load dynamic phonemes from DB, using cached chart:', err);
      });
  }, []);

  const studioRef = useRef<HTMLDivElement>(null);
  const activePillRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredPhonemes = phonemes.filter((p) => {
    let matchesTab = true;
    if (tabFilter === 'monophthong') matchesTab = p.category === 'monophthong';
    else if (tabFilter === 'diphthong') matchesTab = p.category === 'diphthong';
    else if (tabFilter === 'consonant_voiced') matchesTab = p.category === 'consonant' && p.isVoiced === true;
    else if (tabFilter === 'consonant_voiceless') matchesTab = p.category === 'consonant' && p.isVoiced === false;

    const matchesSearch =
      !searchTerm ||
      p.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sampleWord.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const selectedPhoneme =
    phonemes.find((p) => p.symbol === selectedSymbol) ?? phonemes[0];

  const currentIdx = filteredPhonemes.findIndex((p) => p.symbol === selectedSymbol);

  const handlePrev = () => {
    if (filteredPhonemes.length === 0) return;
    const nextIdx = currentIdx <= 0 ? filteredPhonemes.length - 1 : currentIdx - 1;
    const item = filteredPhonemes[nextIdx];
    if (item) {
      setSelectedSymbol(item.symbol);
    }
  };

  const handleNext = () => {
    if (filteredPhonemes.length === 0) return;
    const nextIdx = currentIdx >= filteredPhonemes.length - 1 ? 0 : currentIdx + 1;
    const item = filteredPhonemes[nextIdx];
    if (item) {
      setSelectedSymbol(item.symbol);
    }
  };

  const handleSelectPhoneme = (symbol: string, shouldScroll = false) => {
    setSelectedSymbol(symbol);
    if (shouldScroll && studioRef.current) {
      studioRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const playQuickAudio = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(word);
      u.lang = 'en-US';
      u.rate = 1;
      window.speechSynthesis.speak(u);
    }
  };

  // Keyboard navigation: ArrowLeft and ArrowRight to navigate sounds effortlessly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx, filteredPhonemes]);

  // Keep active pill scrolled into view horizontally
  useEffect(() => {
    if (activePillRef.current) {
      activePillRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [selectedSymbol]);

  // IntersectionObserver to show floating jump button when scrolled down past the studio
  useEffect(() => {
    const studioEl = studioRef.current;
    if (!studioEl || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setShowFloatingJump(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0.1 }
    );

    observer.observe(studioEl);
    return () => observer.disconnect();
  }, []);

  const getCardTheme = (p: FullIpaSoundItem, isSelected: boolean) => {
    if (p.category === 'monophthong') {
      if (p.isLong) {
        return {
          cardClass: isSelected
            ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-400/50 -translate-y-0.5'
            : 'border-amber-200/90 bg-amber-50/30 hover:border-amber-400 hover:bg-amber-50/60',
          symbolClass: isSelected ? 'text-amber-800' : 'text-amber-950',
          badgeText: '⏱️ Dài',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
          pillBg: isSelected ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-800 border-amber-200',
        };
      }
      return {
        cardClass: isSelected
          ? 'border-sky-500 bg-sky-50 shadow-md ring-2 ring-sky-400/50 -translate-y-0.5'
          : 'border-sky-200/90 bg-sky-50/30 hover:border-sky-400 hover:bg-sky-50/60',
        symbolClass: isSelected ? 'text-sky-800' : 'text-sky-950',
        badgeText: '⚡ Ngắn',
        badgeClass: 'bg-sky-100 text-sky-800 border-sky-200',
        pillBg: isSelected ? 'bg-sky-500 text-white' : 'bg-sky-50 text-sky-800 border-sky-200',
      };
    }
    if (p.category === 'diphthong') {
      return {
        cardClass: isSelected
          ? 'border-purple-500 bg-purple-50 shadow-md ring-2 ring-purple-400/50 -translate-y-0.5'
          : 'border-purple-200/90 bg-purple-50/30 hover:border-purple-400 hover:bg-purple-50/60',
        symbolClass: isSelected ? 'text-purple-800' : 'text-purple-950',
        badgeText: '↷ Đôi',
        badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
        pillBg: isSelected ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-800 border-purple-200',
      };
    }
    if (p.isVoiced) {
      return {
        cardClass: isSelected
          ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-400/50 -translate-y-0.5'
          : 'border-emerald-200/90 bg-emerald-50/30 hover:border-emerald-400 hover:bg-emerald-50/60',
        symbolClass: isSelected ? 'text-emerald-800' : 'text-emerald-950',
        badgeText: '⚡ Rung',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        pillBg: isSelected ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 border-emerald-200',
      };
    }
    return {
      cardClass: isSelected
        ? 'border-rose-500 bg-rose-50 shadow-md ring-2 ring-rose-400/50 -translate-y-0.5'
        : 'border-rose-200/90 bg-rose-50/30 hover:border-rose-400 hover:bg-rose-50/60',
      symbolClass: isSelected ? 'text-rose-800' : 'text-rose-950',
      badgeText: '💨 Hơi',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
      pillBg: isSelected ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-800 border-rose-200',
    };
  };

  return (
    <div className="space-y-6">
      <div ref={studioRef} className="scroll-mt-4">
        {/* Responsive Master-Detail Grid: Side-by-side on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: 44-Phoneme Navigator Panel (Desktop: lg:col-span-5) */}
          <section className="order-2 lg:order-1 lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 md:p-6 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:flex lg:flex-col">
            {/* Panel Header */}
            <div className="border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div>
                  <h2 className="text-lg md:text-xl font-extrabold text-[#34303d] tracking-tight">
                    Bảng 44 Âm IPA
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Màu sắc sư phạm trực quan phân nhóm âm vị
                  </p>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                  {filteredPhonemes.length} / 44 âm
                </span>
              </div>

              {/* Search Box */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm âm (/æ/, see, cat...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-slate-50 transition-colors"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                    aria-label="Xóa tìm kiếm"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Filter Tabs */}
              <div className="flex flex-wrap gap-1.5 pt-3">
                {[
                  { id: 'all', label: 'Tất cả (44)' },
                  { id: 'monophthong', label: 'Nguyên âm đơn (12)' },
                  { id: 'diphthong', label: 'Nguyên âm đôi (8)' },
                  { id: 'consonant_voiced', label: 'Phụ âm rung (15)' },
                  { id: 'consonant_voiceless', label: 'Phụ âm hơi (9)' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setTabFilter(tab.id as TabFilter)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      tabFilter === tab.id
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Phonemes Grid (Scrollable in Desktop sticky container) */}
            <div className="lg:overflow-y-auto lg:flex-1 pr-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {filteredPhonemes.map((p) => {
                  const isSelected = p.symbol === selectedSymbol;
                  const theme = getCardTheme(p, isSelected);

                  return (
                    <div
                      key={p.symbol}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectPhoneme(p.symbol, true)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelectPhoneme(p.symbol, true);
                        }
                      }}
                      aria-label={`Âm ${p.symbol}, ví dụ ${p.sampleWord}`}
                      className={`cursor-pointer p-3 rounded-2xl border text-center transition-all flex flex-col justify-between items-center group relative min-h-[96px] select-none ${theme.cardClass}`}
                    >
                      {/* Top Badges */}
                      <div className="w-full flex items-center justify-between text-[10px] font-bold">
                        <span className={`px-1.5 py-0.2 rounded-md border ${theme.badgeClass}`}>
                          {theme.badgeText}
                        </span>
                        <span className="text-slate-400 font-mono text-[9px]">
                          {p.subCategory ? p.subCategory.split(' ')[0] : ''}
                        </span>
                      </div>

                      {/* Center Symbol & Word */}
                      <div className="my-1">
                        <span className={`text-xl sm:text-2xl font-black font-mono block ${theme.symbolClass}`}>
                          {p.symbol}
                        </span>
                        <span className="text-xs font-bold text-slate-700 block truncate max-w-[95px] mt-0.5">
                          {p.sampleWord}
                        </span>
                      </div>

                      {/* Quick Listen Audio Button */}
                      <div className="w-full flex items-center justify-between pt-1 border-t border-slate-200/50 text-[10px] text-slate-400">
                        <span className="truncate">{p.sampleMeaning}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playQuickAudio(p.sampleWord, e);
                          }}
                          title={`Nghe phát âm ${p.sampleWord}`}
                          aria-label={`Nghe phát âm ${p.sampleWord}`}
                          className="h-5 w-5 rounded-full hover:bg-white/80 flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-colors"
                        >
                          🔊
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredPhonemes.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Không tìm thấy âm vị nào phù hợp với từ khóa &quot;{searchTerm}&quot;.
                </div>
              )}
            </div>
          </section>

          {/* RIGHT COLUMN: Active Mouth Studio & In-Studio Quick Bar (Desktop: lg:col-span-7) */}
          <section className="order-1 lg:order-2 lg:col-span-7 space-y-4 lg:sticky lg:top-4">
            
            {/* Quick Nav Ribbon (Zero-scroll switcher right above studio) */}
            <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-3 md:p-4">
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">
                    Chọn âm nhanh (Không cần cuộn trang)
                  </span>
                </div>
                
                {/* Prev / Next Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Âm trước (Phím mũi tên trái)"
                    title="Âm trước (Phím ←)"
                    className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors flex items-center gap-1 min-h-[32px]"
                  >
                    ← Trước
                  </button>
                  <span className="text-[11px] font-mono font-bold text-slate-500 px-1">
                    {currentIdx >= 0 ? currentIdx + 1 : 1}/{filteredPhonemes.length}
                  </span>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Âm tiếp theo (Phím mũi tên phải)"
                    title="Âm tiếp theo (Phím →)"
                    className="px-2.5 py-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1 min-h-[32px]"
                  >
                    Tiếp →
                  </button>
                </div>
              </div>

              {/* Horizontal Quick Phonemes Strip */}
              <div
                ref={scrollContainerRef}
                className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1"
                role="tablist"
                aria-label="Thanh chọn âm nhanh"
              >
                {filteredPhonemes.map((p) => {
                  const isSelected = p.symbol === selectedSymbol;
                  const theme = getCardTheme(p, isSelected);

                  return (
                    <button
                      key={p.symbol}
                      ref={isSelected ? activePillRef : null}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => handleSelectPhoneme(p.symbol, false)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 min-h-[36px] ${
                        isSelected
                          ? `${theme.pillBg} shadow-sm ring-2 ring-indigo-400/50 scale-105`
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                      }`}
                    >
                      <span>{p.symbol}</span>
                      <span
                        className={`text-[10px] font-sans opacity-80 ${
                          isSelected ? 'text-white' : 'text-slate-400'
                        }`}
                      >
                        {p.sampleWord}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed 1-phoneme Mouth Studio */}
            <div className="bg-slate-50/70 p-1 sm:p-2 rounded-3xl border border-indigo-100/70 shadow-sm">
              {selectedPhoneme && (
                <IpaMouthStudio
                  phonemes={[selectedPhoneme]}
                  activeSymbol={selectedPhoneme.symbol}
                  hideTabs={true}
                  headerExtra={
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
                        {selectedPhoneme.subCategory ?? selectedPhoneme.label}
                      </span>
                    </div>
                  }
                />
              )}
            </div>
          </section>

        </div>
      </div>

      {/* FLOATING QUICK-RETURN PILL (Appears on mobile when scrolled down) */}
      {showFloatingJump && (
        <div className="fixed bottom-6 right-6 z-40 lg:hidden">
          <button
            type="button"
            onClick={() => studioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-full shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-105"
            aria-label="Cuộn lên xem khẩu hình âm đang chọn"
          >
            <span>🔬 Khẩu hình:</span>
            <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded">{selectedSymbol}</span>
            <span>↑</span>
          </button>
        </div>
      )}
    </div>
  );
}
