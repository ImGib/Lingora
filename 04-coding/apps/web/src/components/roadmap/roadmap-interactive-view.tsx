'use client';

import React, { useState } from 'react';

export interface RoadLesson {
  id: string;
  order: number;
  title: string;
  focus: string;
  duration: string;
  skill: 'Phát âm' | 'Ngữ pháp' | 'Từ vựng' | 'Đọc hiểu' | 'Viết' | 'Nói' | 'Tổng ôn';
  icon: string;
  summary: string;
}

export interface RoadGate {
  gateNumber: number;
  id: string;
  title: string;
  subtitle: string;
  criterion: string;
  targetScore: string;
  duration: string;
  testName: string;
  lessons: RoadLesson[];
}

export interface WorldSpec {
  worldId: number;
  level: string;
  title: string;
  band: string;
  badge: string;
  duration: string;
  themeColor: string;
  summary: string;
  outcome: string;
  gates: RoadGate[];
}

export const WORLDS_DATA: WorldSpec[] = [
  // WORLD 1: A1 (Band 0.0 -> 3.0)
  {
    worldId: 1,
    level: 'A1',
    title: 'Xây Nền Vững',
    band: '0.0 → 3.0',
    badge: '🌱',
    duration: '30 ngày',
    themeColor: '#10b981',
    summary: 'Làm quen với khẩu hình âm tiếng Anh, khung câu To Be và giao tiếp bản thân.',
    outcome: 'Tự giới thiệu ngắn, đọc quét thông tin cơ bản và phát âm chuẩn 44 âm IPA.',
    gates: [
      {
        gateNumber: 1,
        id: 'W1-G1',
        title: 'Gate 1: Khẩu hình & Mảnh ghép Bản thân',
        subtitle: 'Xây dựng phản xạ nhận diện âm vị và câu giới thiệu cá nhân.',
        criterion: 'Đạt chính xác đúng 100% tuyệt đối (Mastery 100% - Không chấp nhận sai sót)',
        targetScore: '100% Tuyệt Đối (Mastery)',
        duration: '20 phút kiểm tra',
        testName: 'Cổng 1: Đánh vần & Nhận diện âm chuẩn',
        lessons: [
          {
            id: 'W1-L1',
            order: 1,
            title: '44 Âm IPA & Cặp âm tối thiểu (/iː/ vs /ɪ/, /e/ vs /æ/)',
            focus: 'Khẩu hình trực diện & mặt cắt cơ lưỡi',
            duration: '20 phút',
            skill: 'Phát âm',
            icon: '👄',
            summary: 'Phân biệt nguyên âm căng vs thả lỏng, đảm bảo phát âm đúng ngay từ ngày đầu.'
          },
          {
            id: 'W1-L2',
            order: 2,
            title: 'Động từ To Be & Dạng rút gọn (I am ➔ I\'m, You are ➔ You\'re)',
            focus: 'Cấu trúc 6 bước ForumFlash & Khung câu khẳng định',
            duration: '20 phút',
            skill: 'Ngữ pháp',
            icon: '⚡',
            summary: 'Nắm chắc bản chất kết nối chủ ngữ với To Be mà không dịch thô từng từ.'
          },
          {
            id: 'W1-L3',
            order: 3,
            title: '100 Từ vựng cốt lõi: Tên, Tuổi, Quốc gia, Nghề nghiệp',
            focus: 'Đọc lướt danh thiếp & Điền biểu mẫu quốc tế',
            duration: '20 phút',
            skill: 'Từ vựng',
            icon: '📚',
            summary: 'Tự tin điền form đăng ký quốc tế và giới thiệu thông tin chính xác.'
          }
        ]
      },
      {
        gateNumber: 2,
        id: 'W1-G2',
        title: 'Gate 2: Thì Hiện Tại Đơn & Nhịp sống Hàng ngày',
        subtitle: 'Thiết lập phản xạ chia động từ và diễn đạt thói quen cá nhân.',
        criterion: 'Đạt chính xác đúng 100% tuyệt đối (Mastery 100% - Không chấp nhận sai sót)',
        targetScore: '100% Tuyệt Đối (Mastery)',
        duration: '25 phút kiểm tra',
        testName: 'Cổng 2: Phản xạ Thì Hiện Tại Đơn & Giới từ',
        lessons: [
          {
            id: 'W1-L4',
            order: 4,
            title: 'Hiện tại đơn: 3 Thể (+ Khẳng định, - Phủ định, ? Nghi vấn)',
            focus: 'Mượn trợ động từ Do / Does & Giữ nguyên động từ',
            duration: '25 phút',
            skill: 'Ngữ pháp',
            icon: '⚡',
            summary: 'Xóa bỏ phản xạ nhầm lẫn giữa To Be và Động từ thường khi đặt câu.'
          },
          {
            id: 'W1-L5',
            order: 5,
            title: '100 Từ vựng nhịp sống & Giới từ thời gian (in, on, at)',
            focus: 'Hỏi giờ, lịch trình sinh hoạt và ngày trong tuần',
            duration: '20 phút',
            skill: 'Từ vựng',
            icon: '📚',
            summary: 'Sử dụng chuẩn xác giới từ thời gian trong các mốc biểu đồ sinh hoạt.'
          },
          {
            id: 'W1-L6',
            order: 6,
            title: 'Quy tắc thanh quản đuôi -s/es (/s/, /z/, /ɪz/)',
            focus: 'Phân biệt âm vô thanh & hữu thanh khi chia ngôi số ít',
            duration: '20 phút',
            skill: 'Phát âm',
            icon: '👄',
            summary: 'Nói chuẩn âm đuôi tự nhiên, không rơi vào lỗi thiếu âm gió cuối từ.'
          }
        ]
      },
      {
        gateNumber: 3,
        id: 'W1-G3',
        title: 'Gate 3: Hỏi đáp Tương tác & Đọc quét Cơ bản',
        subtitle: 'Tự tin đặt câu hỏi tương tác hai chiều và xử lý văn bản thực tế ngắn.',
        criterion: 'Đạt chính xác đúng 100% tuyệt đối (Mastery 100% - Không chấp nhận sai sót)',
        targetScore: '100% Tuyệt Đối (Mastery)',
        duration: '25 phút kiểm tra',
        testName: 'Cổng 3: Giao tiếp Tương tác & Đọc quét',
        lessons: [
          {
            id: 'W1-L7',
            order: 7,
            title: 'Câu hỏi Wh- (What, Where, Who, When) & Ngữ điệu Yes/No',
            focus: 'Hạ giọng câu hỏi Wh- & lên giọng cuối câu Yes/No',
            duration: '20 phút',
            skill: 'Ngữ pháp',
            icon: '⚡',
            summary: 'Duy trì cuộc đối thoại chủ động bằng cách hỏi lại bạn đồng hành.'
          },
          {
            id: 'W1-L8',
            order: 8,
            title: 'Kỹ năng Đọc quét (Scanning) danh thiếp, hóa đơn & thông báo',
            focus: 'Đọc tìm thông tin cụ thể trong đoạn văn ngắn 50 từ',
            duration: '25 phút',
            skill: 'Đọc hiểu',
            icon: '📖',
            summary: 'Tìm thông tin mục tiêu mà không cần dịch từng từ đơn lẻ trong bài.'
          },
          {
            id: 'W1-L9',
            order: 9,
            title: 'Thu âm giọng nói: Giới thiệu bản thân 30s liền mạch',
            focus: 'Micro recording, phát âm tròn vành rõ chữ và ngữ điệu tự tin',
            duration: '20 phút',
            skill: 'Nói',
            icon: '🎤',
            summary: 'Cột mốc âm thanh đầu tiên lưu giữ vào hồ sơ học tập của bạn.'
          }
        ]
      },
      {
        gateNumber: 4,
        id: 'W1-G4',
        title: 'Gate 4: Cổng Tổng duyệt Chuyển giao Mốc A1',
        subtitle: 'Khảo thí toàn diện 4 kỹ năng trước khi chính thức mở khóa Mốc A2.',
        criterion: 'Hoàn thành bài Mini Progress Test với điểm số >= 75% cho cả 4 kỹ năng',
        targetScore: '100% Tuyệt Đối (Mastery)',
        duration: '25 phút kiểm tra toàn diện',
        testName: 'CỔNG TỔNG DUYỆT A1 (Final Gate)',
        lessons: [
          {
            id: 'W1-L10',
            order: 10,
            title: 'Tự viết đoạn hồ sơ profile 5 câu hoàn chỉnh',
            focus: 'Liên kết câu bằng And, But, Because trong giới hạn câu đơn',
            duration: '25 phút',
            skill: 'Viết',
            icon: '✍️',
            summary: 'Viết đoạn văn ngắn không mắc lỗi chia ngôi và chấm câu cơ bản.'
          },
          {
            id: 'W1-L11',
            order: 11,
            title: 'Tổng ôn phản xạ 4 kỹ năng & Chiến thuật làm bài thi mốc',
            focus: 'Làm quen áp lực thời gian và quy trình nộp bài chấm điểm',
            duration: '30 phút',
            skill: 'Tổng ôn',
            icon: '🏆',
            summary: 'Tự tin bước vào phòng thi Cổng Tổng Duyệt với tâm thế vững vàng.'
          }
        ]
      }
    ]
  },

  // WORLD 2: A2 (Band 3.0 -> 4.5)
  {
    worldId: 2,
    level: 'A2',
    title: 'Tăng Tốc Phản Xạ',
    band: '3.0 → 4.5',
    badge: '🌿',
    duration: '30 ngày',
    themeColor: '#0d9488',
    summary: 'Dùng tiếng Anh trong tình huống đời thường, viết email và kể lại trải nghiệm.',
    outcome: 'Làm chủ quá khứ đơn, động từ khuyết thiếu, viết email 60-80 từ và phỏng vấn 90s.',
    gates: [
      {
        gateNumber: 1,
        id: 'W2-G1',
        title: 'Gate 1: Quá khứ đơn & Kể chuyện trải nghiệm',
        subtitle: 'Làm chủ 60 động từ bất quy tắc và 3 quy tắc phát âm đuôi -ed.',
        criterion: 'Đạt chính xác đúng 100% tuyệt đối (Mastery 100% - Không chấp nhận sai sót)',
        targetScore: '100% Tuyệt Đối (Mastery)',
        duration: '30 phút kiểm tra',
        testName: 'Cổng 1: Past Tense Mastery & Pronunciation',
        lessons: [
          { id: 'W2-L1', order: 1, title: '60 Động từ bất quy tắc thông dụng nhất', focus: 'Nhóm âm chuyển đổi V1 -> V2', duration: '25 phút', skill: 'Ngữ pháp', icon: '⚡', summary: 'Ghi nhớ theo vần điệu âm thanh.' },
          { id: 'W2-L2', order: 2, title: 'Quy tắc thanh quản đuôi -ed (/t/, /d/, /ɪd/)', focus: 'Nguyên âm & phụ âm rung', duration: '20 phút', skill: 'Phát âm', icon: '👄', summary: 'Loại bỏ hoàn toàn lỗi đọc -ed sai chuẩn.' },
          { id: 'W2-L3', order: 3, title: 'Từ vựng kỳ nghỉ & Kể lại chuyến đi cuối tuần', focus: 'Time markers: yesterday, last week, ago', duration: '20 phút', skill: 'Từ vựng', icon: '📚', summary: 'Diễn đạt chuỗi hành động trong quá khứ.' }
        ]
      },
      {
        gateNumber: 2,
        id: 'W2-G2',
        title: 'Gate 2: Thì Tương lai, Động từ khuyết thiếu & So sánh',
        subtitle: 'Làm chủ Will vs Be going to, Can/Could/Should và cấu trúc so sánh hơn/nhất.',
        criterion: 'Đạt chính xác đúng 100% tuyệt đối (Mastery 100% - Không chấp nhận sai sót)',
        targetScore: '100% Tuyệt Đối (Mastery)',
        duration: '35 phút kiểm tra',
        testName: 'Cổng 2: Modals & Comparative Structures',
        lessons: [
          { id: 'W2-L4', order: 4, title: 'Tương lai: Will (quyết định tức thì) vs Be going to (kế hoạch)', focus: 'Ngữ cảnh sử dụng tự nhiên', duration: '25 phút', skill: 'Ngữ pháp', icon: '⚡', summary: 'Chọn đúng thể tương lai trong hội thoại.' },
          { id: 'W2-L5', order: 5, title: 'Động từ khuyết thiếu: Can, Could, Should, Must', focus: 'Mức độ lịch sự và tính bắt buộc', duration: '20 phút', skill: 'Ngữ pháp', icon: '⚡', summary: 'Đưa ra lời khuyên và yêu cầu nhã nhặn.' },
          { id: 'W2-L6', order: 6, title: 'Cấu trúc so sánh hơn và so sánh nhất tính từ ngắn/dài', focus: 'Biến đổi đuôi -er/-est & more/most', duration: '25 phút', skill: 'Ngữ pháp', icon: '⚡', summary: 'So sánh giá cả, địa điểm và chất lượng.' }
        ]
      },
      {
        gateNumber: 3,
        id: 'W2-G3',
        title: 'Gate 3: Viết Email Chức năng & Hội thoại Đời thường',
        subtitle: 'Nghe hiểu đặt phòng, chỉ đường và soạn thảo email 60-80 từ.',
        criterion: 'Viết email 60-80 từ chuẩn cấu trúc & Nghe hiểu đạt >= 80%',
        targetScore: '100% Tuyệt Đối (Mastery)',
        duration: '35 phút kiểm tra',
        testName: 'Cổng 3: Functional Email & Listening Check',
        lessons: [
          { id: 'W2-L7', order: 7, title: 'Cấu trúc Email chuẩn: Chào hỏi, Lý do, Chi tiết & Kết thư', focus: 'Formality & Linking words', duration: '25 phút', skill: 'Viết', icon: '✍️', summary: 'Viết email xin nghỉ hoặc hỏi thông tin.' },
          { id: 'W2-L8', order: 8, title: 'Nghe hội thoại mua sắm, đặt phòng khách sạn & hỏi đường', focus: 'Listening for key numbers & details', duration: '25 phút', skill: 'Đọc hiểu', icon: '📖', summary: 'Ghi chú nhanh thông tin quan trọng.' }
        ]
      },
      {
        gateNumber: 4,
        id: 'W2-G4',
        title: 'Gate 4: Cổng Tổng duyệt Vượt Mốc A2',
        subtitle: 'Sát hạch toàn diện 4 kỹ năng 40 phút để bước vào giai đoạn Pre-IELTS.',
        criterion: 'Vượt qua Milestone Test A2 với điểm số >= 75% cả 4 kỹ năng',
        targetScore: '100% Tuyệt Đối (Mastery)',
        duration: '40 phút kiểm tra',
        testName: 'CỔNG TỔNG DUYỆT A2 (Milestone Test A2)',
        lessons: [
          { id: 'W2-L9', order: 9, title: 'Phỏng vấn nói 3 câu hỏi liên tiếp 90 giây', focus: 'Fluency & Coherence', duration: '25 phút', skill: 'Nói', icon: '🎤', summary: 'Tập phản xạ không ngập ngừng quá 3 giây.' },
          { id: 'W2-L10', order: 10, title: 'Chiến thuật đọc hiểu bài đánh giá dài 200 từ', focus: 'Gạch chân keyword & loại trừ đáp án', duration: '30 phút', skill: 'Tổng ôn', icon: '🏆', summary: 'Tối ưu tốc độ làm bài thi mốc.' }
        ]
      }
    ]
  },

  // WORLD 3: B1 (Band 4.5 -> 5.5)
  {
    worldId: 3,
    level: 'B1',
    title: 'Bước Vào IELTS',
    band: '4.5 → 5.5',
    badge: '🪵',
    duration: '30 ngày',
    themeColor: '#6366f1',
    summary: 'Đọc và nghe thông tin học thuật ngắn, mệnh đề quan hệ, bị động và viết đoạn nghị luận.',
    outcome: 'Xử lý các dạng bài IELTS cơ bản, viết đoạn văn 120 từ có dẫn chứng và nói Part 1-2.',
    gates: [
      {
        gateNumber: 1,
        id: 'W3-G1',
        title: 'Gate 1: Mệnh đề quan hệ & Câu bị động học thuật',
        subtitle: 'Nâng cấp câu đơn lên câu phức học thuật chuẩn tiêu chí IELTS Grammar Range.',
        criterion: 'Đạt chính xác đúng 100% tuyệt đối (Mastery 100% - Không chấp nhận sai sót)',
        targetScore: '100% Tuyệt Đối (Mastery)',
        duration: '40 phút kiểm tra',
        testName: 'Cổng 1: Academic Complex Sentences Check',
        lessons: [
          { id: 'W3-L1', order: 1, title: 'Mệnh đề quan hệ xác định & không xác định (Who, Which, That)', focus: 'Dấu phẩy và đại từ thay thế', duration: '30 phút', skill: 'Ngữ pháp', icon: '⚡', summary: 'Bổ nghĩa thông tin mà không ngắt câu.' },
          { id: 'W3-L2', order: 2, title: 'Câu bị động trong báo cáo khoa học & mô tả quy trình', focus: 'Passive voice across 4 tenses', duration: '25 phút', skill: 'Ngữ pháp', icon: '⚡', summary: 'Tạo văn phong khách quan trong Writing.' },
          { id: 'W3-L3', order: 3, title: '200 Từ học thuật AWL Sublist 1-2', focus: 'Word family: Noun, Verb, Adj, Adv', duration: '25 phút', skill: 'Từ vựng', icon: '📚', summary: 'Ứng dụng từ vựng học thuật chính xác.' }
        ]
      },
      {
        gateNumber: 2,
        id: 'W3-G2',
        title: 'Gate 2: Câu điều kiện, Cấu trúc Nhượng bộ & Lập luận',
        subtitle: 'Sử dụng thuần thục điều kiện loại 1-2, Although, However, In contrast.',
        criterion: 'Đạt chính xác đúng 100% tuyệt đối (Mastery 100% - Không chấp nhận sai sót)',
        targetScore: '100% Tuyệt Đối (Mastery)',
        duration: '45 phút kiểm tra',
        testName: 'Cổng 2: Concession & Cohesion Test',
        lessons: [
          { id: 'W3-L4', order: 4, title: 'Câu điều kiện loại 1 & 2 trong tranh luận quan điểm', focus: 'Hypothetical situations & Solutions', duration: '30 phút', skill: 'Ngữ pháp', icon: '⚡', summary: 'Đưa ra giả thuyết và giải pháp khả thi.' },
          { id: 'W3-L5', order: 5, title: 'Từ nối học thuật: Therefore, Furthermore, In contrast, Despite', focus: 'Punctuation & Cohesion score', duration: '25 phút', skill: 'Ngữ pháp', icon: '⚡', summary: 'Gắn kết các luận điểm logic chặt chẽ.' }
        ]
      },
      {
        gateNumber: 3,
        id: 'W3-G3',
        title: 'Gate 3: IELTS Listening Section 1-2 & Speaking Part 1-2',
        subtitle: 'Làm quen dạng bài điền biểu mẫu, bản đồ và nói độc thoại Part 2.',
        criterion: 'Điền đúng >= 15/20 câu Listening & Bài nói Part 2 đủ 2 phút',
        targetScore: '100% Tuyệt Đối (Mastery)',
        duration: '50 phút kiểm tra',
        testName: 'Cổng 3: Pre-IELTS Listening & Speaking',
        lessons: [
          { id: 'W3-L6', order: 6, title: 'Chiến thuật gắn nhãn bản đồ & sơ đồ (Map Labeling)', focus: 'Prepositions of place & direction', duration: '30 phút', skill: 'Đọc hiểu', icon: '📖', summary: 'Không bị lạc phương hướng khi nghe băng.' },
          { id: 'W3-L7', order: 7, title: 'IELTS Speaking Part 2: Lập dàn ý 1 phút với mô hình 5W1H', focus: 'Organizing notes & maintaining flow', duration: '30 phút', skill: 'Nói', icon: '🎤', summary: 'Nói trôi chảy 2 phút không cạn ý.' }
        ]
      },
      {
        gateNumber: 4,
        id: 'W3-G4',
        title: 'Gate 4: Cổng Tổng duyệt Mốc B1 (Pre-IELTS Exam)',
        subtitle: 'Bài thi thử nghiệm chuẩn hóa 60 phút để bước vào chặng chạy nước rút 6.5.',
        criterion: 'Đạt Band tương đương >= 5.0 ở bài thi Pre-IELTS Exam',
        targetScore: '100% Tuyệt Đối (Mastery)',
        duration: '60 phút kiểm tra',
        testName: 'CỔNG TỔNG DUYỆT B1 (Pre-IELTS Exam)',
        lessons: [
          { id: 'W3-L8', order: 8, title: 'IELTS Reading: True/False/Not Given & Matching Headings', focus: 'Paraphrasing & Trap identification', duration: '35 phút', skill: 'Đọc hiểu', icon: '📖', summary: 'Phân biệt rõ ràng False và Not Given.' },
          { id: 'W3-L9', order: 9, title: 'IELTS Writing: Đoạn nghị luận 120 từ có ví dụ dẫn chứng', focus: 'Point - Explanation - Example', duration: '35 phút', skill: 'Viết', icon: '✍️', summary: 'Hoàn thành bài viết học thuật mạch lạc.' }
        ]
      }
    ]
  },

  // WORLD 4: B2 (Band 5.5 -> 6.5+)
  {
    worldId: 4,
    level: 'B2',
    title: 'Về Đích 6.5+',
    band: '5.5 → 6.5+',
    badge: '🍎',
    duration: '30 ngày',
    themeColor: '#7c3aed',
    summary: 'Chiến thuật thi đấu toàn diện, Writing Task 1-2, Speaking Part 1-3 và Mock Test 160 phút.',
    outcome: 'Làm chủ đề thi IELTS Academic hoàn chỉnh, đạt mục tiêu chứng chỉ quốc tế 6.5+.',
    gates: [
      {
        gateNumber: 1,
        id: 'W4-G1',
        title: 'Gate 1: Skimming, Scanning & Matching Headings Nâng cao',
        subtitle: 'Xử lý bài đọc học thuật 700-900 từ dưới áp lực 20 phút mỗi Passage.',
        criterion: 'Đạt chính xác đúng 100% tuyệt đối (Mastery 100% - Không chấp nhận sai sót)',
        targetScore: '100% Tuyệt Đối (Mastery)',
        duration: '60 phút kiểm tra',
        testName: 'Cổng 1: Advanced Academic Reading Check',
        lessons: [
          { id: 'W4-L1', order: 1, title: 'Skimming cấu trúc đoạn văn: Topic & Concluding sentence', focus: 'Speed reading 250 wpm', duration: '30 phút', skill: 'Đọc hiểu', icon: '📖', summary: 'Nắm bắt ý chính cả đoạn trong 40 giây.' },
          { id: 'W4-L2', order: 2, title: 'Bẫy từ đồng nghĩa (Paraphrase) trong câu hỏi Matching Information', focus: 'Synonym table & Antonyms', duration: '30 phút', skill: 'Đọc hiểu', icon: '📖', summary: 'Phát hiện câu trả lời ngụy trang tinh vi.' }
        ]
      },
      {
        gateNumber: 2,
        id: 'W4-G2',
        title: 'Gate 2: IELTS Writing Task 1 (Biểu đồ) & Task 2 (Cấu trúc P.E.E.L)',
        subtitle: 'Viết bài mô tả dữ liệu 150 từ và bài luận nghị luận 250 từ chuẩn Band 6.5.',
        criterion: 'Hoàn thành cả Task 1 và Task 2 đạt tiêu chí Task Achievement & Lexical Resource',
        targetScore: '100% Tuyệt Đối (Mastery)',
        duration: '60 phút kiểm tra',
        testName: 'Cổng 2: Full Academic Writing Test',
        lessons: [
          { id: 'W4-L3', order: 3, title: 'Task 1: Biểu đồ đường, cột & bảng số liệu (Overview + 2 Body)', focus: 'Trend vocabulary & Comparisons', duration: '35 phút', skill: 'Viết', icon: '✍️', summary: 'Cách viết Overview sắc bén nâng điểm Task 1.' },
          { id: 'W4-L4', order: 4, title: 'Task 2: Cấu trúc đoạn P.E.E.L (Point, Explanation, Evidence, Link)', focus: 'Developing ideas in depth', duration: '40 phút', skill: 'Viết', icon: '✍️', summary: 'Không để ý tưởng bị cụt hoặc lan man.' }
        ]
      },
      {
        gateNumber: 3,
        id: 'W4-G3',
        title: 'Gate 3: IELTS Listening Section 3-4 & Speaking Part 3 Phản biện',
        subtitle: 'Nghe bài giảng học thuật độc thoại và thảo luận trừu tượng xã hội.',
        criterion: 'Đạt chính xác đúng 100% tuyệt đối (Mastery 100% - Không chấp nhận sai sót)',
        targetScore: '100% Tuyệt Đối (Mastery)',
        duration: '50 phút kiểm tra',
        testName: 'Cổng 3: Academic Listening & Speaking Part 3',
        lessons: [
          { id: 'W4-L5', order: 5, title: 'Listening Section 4: Nghe bài giảng khoa học tốc độ tự nhiên', focus: 'Signposting language & Note taking', duration: '35 phút', skill: 'Đọc hiểu', icon: '📖', summary: 'Bắt nhịp từ chuyển hướng bài giảng.' },
          { id: 'W4-L6', order: 6, title: 'Speaking Part 3: Kỹ thuật phản biện 2 mặt của vấn đề xã hội', focus: 'On the one hand... whereas on the other hand', duration: '35 phút', skill: 'Nói', icon: '🎤', summary: 'Kéo dài câu trả lời học thuật tự nhiên.' }
        ]
      },
      {
        gateNumber: 4,
        id: 'W4-G4',
        title: 'Gate 4: Cổng Tốt nghiệp IELTS 6.5 (Full Mock Test)',
        subtitle: 'Bài thi thử nghiệm chuẩn hóa 160 phút tương đương đề thi thật của IDP / BC.',
        criterion: 'Đạt Overall Band >= 6.5 (không kỹ năng nào dưới 5.5)',
        targetScore: '100% Tuyệt Đối (Mastery)',
        duration: '160 phút thi toàn diện',
        testName: 'CỔNG TỐT NGHIỆP: FULL IELTS ACADEMIC MOCK TEST',
        lessons: [
          { id: 'W4-L7', order: 7, title: 'Chiến thuật phân bổ thể lực và thời gian 160 phút thi liên tục', focus: 'Pacing & Mental endurance', duration: '40 phút', skill: 'Tổng ôn', icon: '🏆', summary: 'Giữ sự tỉnh táo tối đa đến phút cuối cùng.' },
          { id: 'W4-L8', order: 8, title: 'Kiểm tra lỗi sai ngữ pháp, chính tả và từ loại phổ biến', focus: 'Proofreading checklist', duration: '30 phút', skill: 'Viết', icon: '✍️', summary: 'Cứu từ 0.5 đến 1.0 band nhờ soát lỗi.' }
        ]
      }
    ]
  }
];

export function RoadmapInteractiveView() {
  const [activeWorldId, setActiveWorldId] = useState<number>(1);
  
  // Track passed gates per world.
  // In World 1: Gate 1 is passed by default, Gate 2 is in-progress, Gate 3-4 are locked.
  // In World 2, 3, 4: Locked until previous world is finished, but user can inspect.
  const [passedGates, setPassedGates] = useState<Record<string, boolean>>({
    'W1-G1': true,
  });

  const [selectedStation, setSelectedStation] = useState<{
    type: 'lesson' | 'gate';
    data: RoadLesson | RoadGate;
    gateNumber: number;
    isLocked: boolean;
    isPassed: boolean;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const activeWorld = WORLDS_DATA.find((w) => w.worldId === activeWorldId) ?? WORLDS_DATA[0]!;

  // Strict Sequential Gate Logic: Gate N is unlocked ONLY IF Gate N-1 is passed!
  const isGatePassed = (worldId: number, gateNum: number) => {
    return Boolean(passedGates[`W${worldId}-G${gateNum}`]);
  };

  const isGateUnlocked = (worldId: number, gateNum: number) => {
    if (gateNum === 1) return true; // Gate 1 of active world is always accessible
    // Gate N requires Gate N-1 of this world to be passed!
    return isGatePassed(worldId, gateNum - 1);
  };

  const isLessonUnlocked = (worldId: number, gateNum: number) => {
    return isGateUnlocked(worldId, gateNum);
  };

  // Simulate passing a gate
  const handleSimulatePassGate = (worldId: number, gateNum: number) => {
    const gateKey = `W${worldId}-G${gateNum}`;
    setPassedGates((prev) => ({ ...prev, [gateKey]: true }));
    showToast(`🎉 Chúc mừng! Bạn đã thi đỗ Gate ${gateNum}. Cổng tiếp theo và các bài học tương ứng đã được MỞ KHÓA thành công!`);
  };

  const handleResetProgress = () => {
    setPassedGates({ 'W1-G1': true });
    setSelectedStation(null);
    showToast('🔄 Đã đặt lại toàn bộ tiến trình lộ trình về trạng thái gốc.');
  };

  return (
    <div className="roadmap-forumflash-layout">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl border border-indigo-400/40 flex items-center gap-3 animate-fade-in">
          <span className="text-base">🔔</span>
          <p className="flex-1 m-0 leading-relaxed font-medium">{toastMessage}</p>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Main Intro */}
      <header className="roadmap-main-header">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="eyebrow text-indigo-600 font-extrabold uppercase tracking-wider text-xs">
            LỘ TRÌNH THỰC HỌC CHUẨN FORUMFLASH (WORLD &amp; LEVEL-ROAD)
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#231b34] tracking-tight">
          Con đường chinh phục <span>IELTS 0 đến 6.5.</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Mỗi Mốc là một <strong>World (Thế giới)</strong> độc lập. Trên mỗi <strong>Level-Road</strong>, bạn phải học tuần tự từng bài học bắt buộc và <strong>vượt qua Gate sát hạch</strong> thì mới được phép mở khóa trạm tiếp theo.
        </p>
      </header>

      {/* 2-Column ForumFlash Architecture: world-sidebar + level-road */}
      <div className="forumflash-grid">
        
        {/* 1. WORLD-SIDEBAR (Sidebar Thế Giới) */}
        <aside className="world-sidebar" aria-label="Danh sách các Thế giới học tập">
          <div className="world-sidebar-header">
            <span className="sidebar-kicker">4 THẾ GIỚI MỐC</span>
            <button
              type="button"
              onClick={handleResetProgress}
              className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 transition-colors"
              title="Đặt lại mô phỏng"
            >
              🔄 Reset
            </button>
          </div>

          <div className="world-list" role="tablist">
            {WORLDS_DATA.map((w) => {
              const isActive = w.worldId === activeWorldId;
              const passedCount = w.gates.filter((g) => isGatePassed(w.worldId, g.gateNumber)).length;
              const progressPct = Math.round((passedCount / w.gates.length) * 100);

              return (
                <button
                  key={w.worldId}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveWorldId(w.worldId);
                    setSelectedStation(null);
                  }}
                  className={`world-card ${isActive ? 'is-active' : ''}`}
                >
                  <div className="world-card-top">
                    <span className="world-badge">{w.badge}</span>
                    <span className="world-level-tag">{w.level} · Band {w.band}</span>
                  </div>

                  <h3 className="world-card-title">{w.title}</h3>
                  <p className="world-card-sub">{w.duration} tham khảo</p>

                  <div className="world-progress-wrap">
                    <div className="world-progress-bar">
                      <div className="world-progress-fill" style={{ width: `${progressPct}%` }} />
                    </div>
                    <span className="world-progress-text">{passedCount}/{w.gates.length} Gates đỗ ({progressPct}%)</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Simulation Box */}
          <div className="world-sidebar-footer">
            <span className="text-[11px] font-bold text-slate-700 block mb-1">
              ⚡ Mô phỏng mở khóa Gate:
            </span>
            <p className="text-[11px] text-slate-500 leading-normal mb-2.5">
              Bấm để thi đỗ Gate hiện tại và chứng kiến trạm dừng tiếp theo mở khóa ngay trên con đường.
            </p>
            {activeWorld.gates.map((g) => {
              const passed = isGatePassed(activeWorld.worldId, g.gateNumber);
              const unlocked = isGateUnlocked(activeWorld.worldId, g.gateNumber);

              if (passed) return null;
              if (!unlocked) return null;

              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => handleSimulatePassGate(activeWorld.worldId, g.gateNumber)}
                  className="w-full text-xs font-bold py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <span>⚡</span> Đỗ Gate {g.gateNumber} để mở đường
                </button>
              );
            })}
          </div>
        </aside>

        {/* 2. LEVEL-ROAD (Con Đường Level Trực Quan) */}
        <section className="level-road-container" aria-label="Con đường bài học và các cổng sát hạch">
          
          {/* Active World Hero Banner */}
          <div className="level-road-banner">
            <div className="level-road-banner-left">
              <span className="level-road-tag">
                THẾ GIỚI 0{activeWorld.worldId} · CEFR {activeWorld.level} · BAND {activeWorld.band}
              </span>
              <h2>{activeWorld.title}</h2>
              <p>{activeWorld.outcome}</p>
            </div>
            <div className="level-road-badge-pill">
              <span className="text-3xl">{activeWorld.badge}</span>
              <div>
                <strong className="block text-sm font-black text-slate-800">4 GATES TUẦN TỰ</strong>
                <span className="text-xs text-slate-500 font-medium">Bắt buộc pass từng cổng</span>
              </div>
            </div>
          </div>

          {/* THE LEVEL-ROAD (Winding / Progressive Node Path) */}
          <div className="level-road">
            {activeWorld.gates.map((gate, gIdx) => {
              const gatePassed = isGatePassed(activeWorld.worldId, gate.gateNumber);
              const gateUnlocked = isGateUnlocked(activeWorld.worldId, gate.gateNumber);

              return (
                <div key={gate.id} className={`gate-cluster ${gatePassed ? 'is-passed' : gateUnlocked ? 'is-active' : 'is-locked'}`}>
                  
                  {/* Gate Section Kicker */}
                  <div className="gate-cluster-header">
                    <div className="flex items-center gap-2">
                      <span className={`gate-cluster-dot ${gatePassed ? 'bg-emerald-500' : gateUnlocked ? 'bg-indigo-600 animate-ping' : 'bg-slate-300'}`} />
                      <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                        CHẶNG {gate.gateNumber}: {gate.title}
                      </span>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      gatePassed
                        ? 'bg-emerald-100 text-emerald-800'
                        : gateUnlocked
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {gatePassed ? '✓ Đã Vượt Qua' : gateUnlocked ? '● Đang Học' : '🔒 Đang Khóa'}
                    </span>
                  </div>

                  {/* Connecting Rail Line */}
                  <div className="gate-cluster-body">
                    
                    {/* Lessons along this section of the road */}
                    <div className="lessons-road-segment">
                      {gate.lessons.map((lesson, lIdx) => {
                        const isUnlocked = gateUnlocked;
                        const isPassed = gatePassed;

                        return (
                          <div
                            key={lesson.id}
                            onClick={() => {
                              if (!isUnlocked) {
                                showToast(`🔒 Bài học này đang bị khóa! Bạn bắt buộc phải thi đỗ Gate trước đó.`);
                                return;
                              }
                              setSelectedStation({
                                type: 'lesson',
                                data: lesson,
                                gateNumber: gate.gateNumber,
                                isLocked: !isUnlocked,
                                isPassed: isPassed,
                              });
                            }}
                            className={`road-station-node group ${
                              isPassed
                                ? 'is-passed'
                                : isUnlocked
                                ? 'is-unlocked'
                                : 'is-locked'
                            }`}
                          >
                            <div className="road-station-rail-marker">
                              <span className="road-station-icon">{lesson.icon}</span>
                            </div>

                            <div className="road-station-content">
                              <div className="road-station-meta">
                                <span className="road-station-order">Bài {String(lesson.order).padStart(2, '0')}</span>
                                <span className="road-station-skill">{lesson.skill}</span>
                                <span className="road-station-duration">{lesson.duration}</span>
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                  Bắt buộc
                                </span>
                              </div>
                              <h4 className="road-station-title">{lesson.title}</h4>
                              <p className="road-station-focus">{lesson.focus}</p>
                            </div>

                            <span className="road-station-arrow" aria-hidden="true">
                              {isPassed ? '✓' : isUnlocked ? '➔' : '🔒'}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* GATE CHECKPOINT BARRIER NODE */}
                    <div
                      onClick={() => {
                        if (!gateUnlocked) {
                          showToast(`🔒 CỔNG SÁT HẠCH ĐANG KHÓA! Bạn bắt buộc phải vượt qua Gate ${gate.gateNumber - 1} trước.`);
                          return;
                        }
                        setSelectedStation({
                          type: 'gate',
                          data: gate,
                          gateNumber: gate.gateNumber,
                          isLocked: !gateUnlocked,
                          isPassed: gatePassed,
                        });
                      }}
                      className={`gate-checkpoint-barrier ${
                        gatePassed
                          ? 'is-passed'
                          : gateUnlocked
                          ? 'is-unlocked'
                          : 'is-locked'
                      }`}
                    >
                      <div className="gate-barrier-badge">
                        <span className="gate-barrier-icon">{gatePassed ? '🏆' : gateUnlocked ? '🛡️' : '🔒'}</span>
                        <div>
                          <span className="gate-barrier-kicker">CỔNG KIỂM SOÁT BẮT BUỘC · GATE 0{gate.gateNumber}</span>
                          <h4 className="gate-barrier-title">{gate.testName}</h4>
                          <p className="gate-barrier-rule">
                            Tiêu chuẩn: <strong>{gate.targetScore}</strong> · {gate.duration}
                          </p>
                        </div>
                      </div>

                      <div className="gate-barrier-action">
                        {gatePassed ? (
                          <span className="px-3 py-1.5 bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm">
                            ✓ ĐÃ ĐỖ CỔNG
                          </span>
                        ) : gateUnlocked ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSimulatePassGate(activeWorld.worldId, gate.gateNumber);
                            }}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                          >
                            <span>⚡</span> Thi đỗ để mở tiếp →
                          </button>
                        ) : (
                          <span className="px-3 py-1.5 bg-slate-200 text-slate-500 font-bold text-xs rounded-xl flex items-center gap-1">
                            <span>🔒</span> Khóa nghiêm ngặt
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* STATION INSPECTOR MODAL / DRAWER */}
          {selectedStation && (
            <div className="station-inspector-overlay" onClick={() => setSelectedStation(null)}>
              <div className="station-inspector-card" onClick={(e) => e.stopPropagation()}>
                <div className="inspector-header">
                  <div>
                    <span className="eyebrow text-indigo-600 font-black text-xs uppercase">
                      {selectedStation.type === 'lesson' ? 'CHI TIẾT BÀI HỌC BẮT BUỘC' : 'CHI TIẾT CỔNG SÁT HẠCH GATE'}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-1">
                      {selectedStation.type === 'lesson'
                        ? (selectedStation.data as RoadLesson).title
                        : (selectedStation.data as RoadGate).title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedStation(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="inspector-body">
                  {selectedStation.type === 'lesson' ? (
                    <>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs">
                          {(selectedStation.data as RoadLesson).skill}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold text-xs">
                          ⏱️ {(selectedStation.data as RoadLesson).duration}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs">
                          Bắt buộc 100%
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        {(selectedStation.data as RoadLesson).summary}
                      </p>
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 mb-5">
                        🎯 <strong>Trọng tâm thực chiến:</strong> {(selectedStation.data as RoadLesson).focus}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs mb-4">
                        🎯 <strong>BẤT BIẾN QUA CỔNG (CHUẨN 100% TUYỆT ĐỐI):</strong> Yêu cầu phải làm ĐÚNG 100%. Sai dù chỉ 1 câu cũng bắt buộc ôn luyện và làm lại đến khi đạt 100% mới mở Gate sau. — {(selectedStation.data as RoadGate).criterion}. Chưa pass thì toàn bộ Gate sau sẽ bị khóa cứng.
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-slate-500 block">Thời lượng:</span>
                          <strong className="text-slate-800 text-sm">{(selectedStation.data as RoadGate).duration}</strong>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-slate-500 block">Điểm cần đạt:</span>
                          <strong className="text-emerald-700 text-sm">{(selectedStation.data as RoadGate).targetScore}</strong>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="inspector-footer">
                  {selectedStation.isLocked ? (
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-4 py-2.5 rounded-xl w-full text-center block">
                      🔒 Trạm này đang bị khóa. Bạn phải thi đỗ Gate trước đó!
                    </span>
                  ) : selectedStation.type === 'gate' ? (
                    <button
                      type="button"
                      onClick={() => {
                        handleSimulatePassGate(activeWorld.worldId, selectedStation.gateNumber);
                        setSelectedStation(null);
                      }}
                      className="button primary w-full text-xs py-2.5 flex items-center justify-center gap-2"
                    >
                      <span>⚡</span> Thi đỗ Gate này để mở tiếp con đường
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        showToast(`Đã mở bài học: ${(selectedStation.data as RoadLesson).title}`);
                        setSelectedStation(null);
                      }}
                      className="button primary w-full text-xs py-2.5 flex items-center justify-center gap-2"
                    >
                      <span>🚀</span> Bắt đầu bài học này ngay
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

        </section>

      </div>
    </div>
  );
}
