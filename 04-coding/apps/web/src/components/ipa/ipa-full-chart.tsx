'use client';

import React, { useState } from 'react';
import { PhonemeSpec, IpaMouthStudio } from './ipa-mouth-studio';
import { AudioButton } from '@/components/common/audio-button';

export interface FullIpaSoundItem extends PhonemeSpec {
  category: 'monophthong' | 'diphthong' | 'consonant';
  subCategory?: string;
}

export const ALL_44_IPA_PHONEMES: FullIpaSoundItem[] = [
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

export function IpaFullChart() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('/iː/');
  const [tabFilter, setTabFilter] = useState<'all' | 'monophthong' | 'diphthong' | 'consonant'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredPhonemes = ALL_44_IPA_PHONEMES.filter((p) => {
    const matchesTab = tabFilter === 'all' || p.category === tabFilter;
    const matchesSearch =
      !searchTerm ||
      p.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sampleWord.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const selectedPhoneme =
    ALL_44_IPA_PHONEMES.find((p) => p.symbol === selectedSymbol) ?? ALL_44_IPA_PHONEMES[0];

  return (
    <div className="space-y-10">
      {/* Detail 1-phoneme Viewport (Strict 1 phoneme/viewport invariant) */}
      <section className="bg-slate-50/70 p-4 sm:p-6 rounded-3xl border border-indigo-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">
              Chi tiết khẩu hình âm đang chọn
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            1 Âm / 1 Màn hình hiển thị chuẩn xác
          </span>
        </div>

        {selectedPhoneme && <IpaMouthStudio phonemes={[selectedPhoneme]} />}
      </section>

      {/* 44-Phoneme Chart Navigation Grid */}
      <section className="card p-6 sm:p-8 bg-white rounded-3xl border border-[#e8e1ec] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-extrabold text-[#34303d] tracking-tight">
              Bảng Tổng Hợp 44 Âm IPA Chuẩn Quốc Tế
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Nhấp vào bất kỳ âm nào để mở khẩu hình trực quan và nghe audio song tốc.
            </p>
          </div>

          {/* Search box */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              placeholder="Tìm âm (/æ/, see, e...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-slate-50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-6 pb-6">
          <button
            onClick={() => setTabFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tabFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả 44 âm ({ALL_44_IPA_PHONEMES.length})
          </button>
          <button
            onClick={() => setTabFilter('monophthong')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tabFilter === 'monophthong'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Nguyên âm đơn (12)
          </button>
          <button
            onClick={() => setTabFilter('diphthong')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tabFilter === 'diphthong'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Nguyên âm đôi (8)
          </button>
          <button
            onClick={() => setTabFilter('consonant')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tabFilter === 'consonant'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Phụ âm (24)
          </button>
        </div>

        {/* Phonemes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {filteredPhonemes.map((p) => {
            const isSelected = p.symbol === selectedSymbol;
            return (
              <div
                key={p.symbol}
                onClick={() => setSelectedSymbol(p.symbol)}
                className={`cursor-pointer p-3 rounded-2xl border text-center transition-all flex flex-col justify-between items-center group ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 shadow-md ring-2 ring-indigo-500/30 -translate-y-0.5'
                    : 'border-slate-200/80 bg-white hover:border-indigo-300 hover:bg-slate-50/80'
                }`}
              >
                <span className="text-xs text-slate-400 font-mono tracking-tight self-end">
                  {p.subCategory ? p.subCategory.split(' ')[1] ?? '' : ''}
                </span>

                <div className="my-1.5">
                  <span
                    className={`text-xl sm:text-2xl font-black font-mono block ${
                      isSelected ? 'text-indigo-700' : 'text-slate-800 group-hover:text-indigo-600'
                    }`}
                  >
                    {p.symbol}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 block truncate max-w-[90px]">
                    {p.sampleWord}
                  </span>
                </div>

                <div
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 pt-1.5 border-t border-slate-100 w-full flex justify-center"
                >
                  <AudioButton text={p.sampleWord} className="scale-75 origin-center" />
                </div>
              </div>
            );
          })}
        </div>

        {filteredPhonemes.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs">
            Không tìm thấy âm vị nào phù hợp với từ khóa "{searchTerm}".
          </div>
        )}
      </section>
    </div>
  );
}
