'use client';

import React, { useState } from 'react';

export interface Milestone {
  number: number;
  level: string;
  title: string;
  band: string;
  duration: string;
  summary: string;
  outcome: string;
  knowledge: {
    pronunciation: string[];
    vocabulary: string[];
    grammar: string[];
  };
  test: {
    name: string;
    duration: string;
    listening: string;
    reading: string;
    writing: string;
    speaking: string;
  };
}

export interface MandatoryLesson {
  id: string;
  num: string;
  title: string;
  focus: string;
  duration: string;
  skill: 'Phát âm' | 'Ngữ pháp' | 'Từ vựng' | 'Đọc hiểu' | 'Viết' | 'Nói';
  summary: string;
}

export interface GateSpec {
  gateNumber: number;
  id: string;
  title: string;
  subtitle: string;
  passingCriterion: string;
  duration: string;
  testName: string;
  targetScore: string;
  lessons: MandatoryLesson[];
}

export const MILESTONE_GATES: Record<number, GateSpec[]> = {
  // MỐC 1: A1 (Band 0.0 -> 3.0)
  1: [
    {
      gateNumber: 1,
      id: 'A1-G1',
      title: 'Gate 1: Khẩu hình & Mảnh ghép Bản thân',
      subtitle: 'Xây dựng phản xạ nhận diện âm vị và câu giới thiệu thông tin căn bản.',
      passingCriterion: 'Đạt đúng chính xác 100% tuyệt đối (Mastery 100% - Không chấp nhận sai sót)',
      duration: '20 phút kiểm tra',
      testName: 'Cổng 1: Đánh vần & Nhận diện âm chuẩn',
      targetScore: '100% Tuyệt Đối (Mastery)',
      lessons: [
        {
          id: 'A1-L1',
          num: '01',
          title: '44 Âm IPA & Cặp âm tối thiểu (/iː/ vs /ɪ/, /e/ vs /æ/)',
          focus: 'Khẩu hình trực diện & mặt cắt chuyển động lưỡi',
          duration: '20 phút',
          skill: 'Phát âm',
          summary: 'Phân biệt nguyên âm căng vs thả lỏng, đảm bảo phát âm đúng ngay từ ngày đầu.'
        },
        {
          id: 'A1-L2',
          num: '02',
          title: 'Động từ To Be & Dạng rút gọn (I am ➔ I\'m, You are ➔ You\'re)',
          focus: 'Cấu trúc 6 bước ForumFlash & Khung câu khẳng định',
          duration: '20 phút',
          skill: 'Ngữ pháp',
          summary: 'Nắm chắc bản chất kết nối chủ ngữ với To Be mà không dịch thô từng từ.'
        },
        {
          id: 'A1-L3',
          num: '03',
          title: '100 Từ vựng cốt lõi: Tên, Tuổi, Quốc gia, Nghề nghiệp',
          focus: 'Đọc lướt danh thiếp & Điền biểu mẫu',
          duration: '20 phút',
          skill: 'Từ vựng',
          summary: 'Tự tin điền form đăng ký quốc tế và giới thiệu thông tin chính xác.'
        }
      ]
    },
    {
      gateNumber: 2,
      id: 'A1-G2',
      title: 'Gate 2: Thì Hiện Tại Đơn & Nhịp sống Hàng ngày',
      subtitle: 'Thiết lập phản xạ chia động từ và diễn đạt thói quen cá nhân.',
      passingCriterion: 'Đạt đúng chính xác 100% tuyệt đối (Mastery 100% - Không chấp nhận sai sót)',
      duration: '25 phút kiểm tra',
      testName: 'Cổng 2: Phản xạ Thì Hiện Tại Đơn & Giới từ',
      targetScore: '100% Tuyệt Đối (Mastery)',
      lessons: [
        {
          id: 'A1-L4',
          num: '04',
          title: 'Hiện tại đơn: 3 Thể (+ Khẳng định, - Phủ định, ? Nghi vấn)',
          focus: 'Mượn trợ động từ Do / Does & Nguyên tắc giữ nguyên động từ',
          duration: '25 phút',
          skill: 'Ngữ pháp',
          summary: 'Xóa bỏ phản xạ nhầm lẫn giữa To Be và Động từ thường khi đặt câu phủ định.'
        },
        {
          id: 'A1-L5',
          num: '05',
          title: '100 Từ vựng nhịp sống & Giới từ thời gian (in, on, at)',
          focus: 'Phản xạ hỏi giờ, lịch trình sinh hoạt và ngày trong tuần',
          duration: '20 phút',
          skill: 'Từ vựng',
          summary: 'Sử dụng chuẩn xác giới từ thời gian trong các mốc biểu đồ sinh hoạt.'
        },
        {
          id: 'A1-L6',
          num: '06',
          title: 'Quy tắc thanh quản đuôi -s/es (/s/, /z/, /ɪz/)',
          focus: 'Phân biệt âm vô thanh & hữu thanh khi phát âm ngôi thứ 3 số ít',
          duration: '20 phút',
          skill: 'Phát âm',
          summary: 'Nói chuẩn âm đuôi tự nhiên, không rơi vào lỗi thiếu âm gió cuối từ.'
        }
      ]
    },
    {
      gateNumber: 3,
      id: 'A1-G3',
      title: 'Gate 3: Hỏi đáp Tương tác & Đọc quét Cơ bản',
      subtitle: 'Tự tin đặt câu hỏi tương tác hai chiều và xử lý văn bản thực tế ngắn.',
      passingCriterion: 'Đạt đúng chính xác 100% tuyệt đối (Mastery 100% - Không chấp nhận sai sót)',
      duration: '25 phút kiểm tra',
      testName: 'Cổng 3: Giao tiếp Tương tác & Đọc quét',
      targetScore: '100% Tuyệt Đối (Mastery)',
      lessons: [
        {
          id: 'A1-L7',
          num: '07',
          title: 'Câu hỏi Wh- (What, Where, Who, When) & Ngữ điệu lên giọng Yes/No',
          focus: 'Kỹ thuật Intonation hạ giọng câu hỏi Wh- & lên giọng Yes/No',
          duration: '20 phút',
          skill: 'Ngữ pháp',
          summary: 'Duy trì cuộc đối thoại chủ động bằng cách hỏi lại bạn đồng hành.'
        },
        {
          id: 'A1-L8',
          num: '08',
          title: 'Kỹ năng Đọc quét (Scanning) danh thiếp, hóa đơn & bảng thông báo',
          focus: 'Đọc tìm thông tin cụ thể trong đoạn văn ngắn 50 từ',
          duration: '25 phút',
          skill: 'Đọc hiểu',
          summary: 'Tìm thông tin mục tiêu mà không cần dịch từng từ đơn lẻ trong bài.'
        },
        {
          id: 'A1-L9',
          num: '09',
          title: 'Thu âm giọng nói: Giới thiệu bản thân 30s liền mạch',
          focus: 'Micro recording, phát âm tròn vành rõ chữ và ngữ điệu tự tin',
          duration: '20 phút',
          skill: 'Nói',
          summary: 'Cột mốc âm thanh đầu tiên lưu giữ vào hồ sơ học tập của bạn.'
        }
      ]
    },
    {
      gateNumber: 4,
      id: 'A1-G4',
      title: 'Gate 4: Cổng Tổng duyệt Chuyển giao Mốc A1',
      subtitle: 'Khảo thí toàn diện 4 kỹ năng trước khi chính thức mở khóa Mốc A2.',
      passingCriterion: 'Đạt đúng chính xác 100% tuyệt đối (Mastery 100% - Không chấp nhận sai sót)',
      duration: '25 phút kiểm tra toàn diện',
      testName: 'CỔNG TỔNG DUYỆT A1 (Final Gate)',
      targetScore: '100% Tuyệt Đối (Mastery)',
      lessons: [
        {
          id: 'A1-L10',
          num: '10',
          title: 'Tự viết đoạn hồ sơ profile 5 câu hoàn chỉnh',
          focus: 'Liên kết câu bằng And, But, Because trong giới hạn câu đơn',
          duration: '25 phút',
          skill: 'Viết',
          summary: 'Viết đoạn văn ngắn không mắc lỗi chia ngôi và chấm câu cơ bản.'
        },
        {
          id: 'A1-L11',
          num: '11',
          title: 'Tổng ôn phản xạ 4 kỹ năng & Chiến thuật làm bài thi mốc',
          focus: 'Làm quen áp lực thời gian và quy trình nộp bài chấm điểm máy',
          duration: '30 phút',
          skill: 'Đọc hiểu',
          summary: 'Tự tin bước vào phòng thi Cổng Tổng Duyệt với tâm thế vững vàng.'
        }
      ]
    }
  ],

  // MỐC 2: A2 (Band 3.0 -> 4.5)
  2: [
    {
      gateNumber: 1,
      id: 'A2-G1',
      title: 'Gate 1: Quá khứ đơn & Kể chuyện trải nghiệm',
      subtitle: 'Làm chủ 60 động từ bất quy tắc và 3 quy tắc phát âm đuôi -ed.',
      passingCriterion: 'Đạt đúng chính xác 100% tuyệt đối (Mastery 100% - Không chấp nhận sai sót)',
      duration: '30 phút kiểm tra',
      testName: 'Cổng 1: Past Tense Mastery & Pronunciation',
      targetScore: '100% Tuyệt Đối (Mastery)',
      lessons: [
        { id: 'A2-L1', num: '01', title: '60 Động từ bất quy tắc thông dụng nhất', focus: 'Nhóm âm chuyển đổi V1 -> V2', duration: '25 phút', skill: 'Ngữ pháp', summary: 'Ghi nhớ theo vần điệu âm thanh.' },
        { id: 'A2-L2', num: '02', title: 'Quy tắc thanh quản đuôi -ed (/t/, /d/, /ɪd/)', focus: 'Nguyên âm & phụ âm rung', duration: '20 phút', skill: 'Phát âm', summary: 'Loại bỏ hoàn toàn lỗi đọc -ed sai chuẩn.' },
        { id: 'A2-L3', num: '03', title: 'Từ vựng kỳ nghỉ & Kể lại chuyến đi cuối tuần', focus: 'Time markers: yesterday, last week, ago', duration: '20 phút', skill: 'Từ vựng', summary: 'Diễn đạt chuỗi hành động trong quá khứ.' }
      ]
    },
    {
      gateNumber: 2,
      id: 'A2-G2',
      title: 'Gate 2: Thì Tương lai, Động từ khuyết thiếu & So sánh',
      subtitle: 'Làm chủ Will vs Be going to, Can/Could/Should và cấu trúc so sánh hơn/nhất.',
      passingCriterion: 'Đạt đúng chính xác 100% tuyệt đối (Mastery 100% - Không chấp nhận sai sót)',
      duration: '35 phút kiểm tra',
      testName: 'Cổng 2: Modals & Comparative Structures',
      targetScore: '100% Tuyệt Đối (Mastery)',
      lessons: [
        { id: 'A2-L4', num: '04', title: 'Tương lai: Will (quyết định tức thì) vs Be going to (kế hoạch)', focus: 'Ngữ cảnh sử dụng tự nhiên', duration: '25 phút', skill: 'Ngữ pháp', summary: 'Chọn đúng thể tương lai trong hội thoại.' },
        { id: 'A2-L5', num: '05', title: 'Động từ khuyết thiếu: Can, Could, Should, Must', focus: 'Mức độ lịch sự và tính bắt buộc', duration: '20 phút', skill: 'Ngữ pháp', summary: 'Đưa ra lời khuyên và yêu cầu nhã nhặn.' },
        { id: 'A2-L6', num: '06', title: 'Cấu trúc so sánh hơn và so sánh nhất tính từ ngắn/dài', focus: 'Quy tắc biến đổi đuôi -er/-est & more/most', duration: '25 phút', skill: 'Ngữ pháp', summary: 'So sánh giá cả, địa điểm và chất lượng.' }
      ]
    },
    {
      gateNumber: 3,
      id: 'A2-G3',
      title: 'Gate 3: Viết Email Chức năng & Hội thoại Đời thường',
      subtitle: 'Nghe hiểu đặt phòng, chỉ đường và soạn thảo email 60-80 từ.',
      passingCriterion: 'Viết email 60-80 từ chuẩn cấu trúc & Nghe hiểu hội thoại thực tế đạt >= 80%',
      duration: '35 phút kiểm tra',
      testName: 'Cổng 3: Functional Email & Listening Check',
      targetScore: '100% Tuyệt Đối (Mastery)',
      lessons: [
        { id: 'A2-L7', num: '07', title: 'Cấu trúc Email chuẩn: Chào hỏi, Lý do, Chi tiết & Kết thư', focus: 'Formality & Linking words', duration: '25 phút', skill: 'Viết', summary: 'Viết email xin nghỉ hoặc hỏi thông tin.' },
        { id: 'A2-L8', num: '08', title: 'Nghe hội thoại mua sắm, đặt phòng khách sạn & hỏi đường', focus: 'Listening for key numbers & details', duration: '25 phút', skill: 'Đọc hiểu', summary: 'Ghi chú nhanh thông tin quan trọng.' }
      ]
    },
    {
      gateNumber: 4,
      id: 'A2-G4',
      title: 'Gate 4: Cổng Tổng duyệt Vượt Mốc A2',
      subtitle: 'Sát hạch toàn diện 4 kỹ năng 40 phút để bước vào giai đoạn Pre-IELTS.',
      passingCriterion: 'Đạt đúng chính xác 100% tuyệt đối (Mastery 100% - Không chấp nhận sai sót)',
      duration: '40 phút kiểm tra',
      testName: 'CỔNG TỔNG DUYỆT A2 (Milestone Test A2)',
      targetScore: '100% Tuyệt Đối (Mastery)',
      lessons: [
        { id: 'A2-L9', num: '09', title: 'Phỏng vấn nói 3 câu hỏi liên tiếp 90 giây', focus: 'Fluency & Coherence', duration: '25 phút', skill: 'Nói', summary: 'Tập phản xạ không ngập ngừng quá 3 giây.' },
        { id: 'A2-L10', num: '10', title: 'Chiến thuật đọc hiểu bài đánh giá dài 200 từ', focus: 'Gạch chân keyword & loại trừ đáp án', duration: '30 phút', skill: 'Đọc hiểu', summary: 'Tối ưu tốc độ làm bài thi mốc.' }
      ]
    }
  ],

  // MỐC 3: B1 (Band 4.5 -> 5.5)
  3: [
    {
      gateNumber: 1,
      id: 'B1-G1',
      title: 'Gate 1: Mệnh đề quan hệ & Câu bị động học thuật',
      subtitle: 'Nâng cấp câu đơn lên câu phức học thuật chuẩn tiêu chí IELTS Grammar Range.',
      passingCriterion: 'Đạt đúng chính xác 100% tuyệt đối (Mastery 100% - Không chấp nhận sai sót)',
      duration: '40 phút kiểm tra',
      testName: 'Cổng 1: Academic Complex Sentences Check',
      targetScore: '100% Tuyệt Đối (Mastery)',
      lessons: [
        { id: 'B1-L1', num: '01', title: 'Mệnh đề quan hệ xác định & không xác định (Who, Which, That, Where)', focus: 'Cách dùng dấu phẩy và đại từ thay thế', duration: '30 phút', skill: 'Ngữ pháp', summary: 'Bổ nghĩa thông tin mà không ngắt câu.' },
        { id: 'B1-L2', num: '02', title: 'Câu bị động trong báo cáo khoa học & mô tả quy trình', focus: 'Forming passive across 4 tenses', duration: '25 phút', skill: 'Ngữ pháp', summary: 'Tạo văn phong khách quan trong Writing.' },
        { id: 'B1-L3', num: '03', title: '200 Từ học thuật AWL Sublist 1-2', focus: 'Word family: Noun, Verb, Adj, Adv', duration: '25 phút', skill: 'Từ vựng', summary: 'Ứng dụng từ vựng học thuật chính xác ngữ cảnh.' }
      ]
    },
    {
      gateNumber: 2,
      id: 'B1-G2',
      title: 'Gate 2: Câu điều kiện, Cấu trúc Nhượng bộ & Lập luận',
      subtitle: 'Sử dụng thuần thục điều kiện loại 1-2, Although, However, In contrast.',
      passingCriterion: 'Đạt đúng chính xác 100% tuyệt đối (Mastery 100% - Không chấp nhận sai sót)',
      duration: '45 phút kiểm tra',
      testName: 'Cổng 2: Concession & Cohesion Test',
      targetScore: '100% Tuyệt Đối (Mastery)',
      lessons: [
        { id: 'B1-L4', num: '04', title: 'Câu điều kiện loại 1 & 2 trong tranh luận quan điểm', focus: 'Hypothetical situations & Solutions', duration: '30 phút', skill: 'Ngữ pháp', summary: 'Đưa ra giả thuyết và giải pháp khả thi.' },
        { id: 'B1-L5', num: '05', title: 'Từ nối học thuật: Therefore, Furthermore, In contrast, Despite', focus: 'Punctuation & Cohesion score', duration: '25 phút', skill: 'Ngữ pháp', summary: 'Gắn kết các luận điểm logic chặt chẽ.' }
      ]
    },
    {
      gateNumber: 3,
      id: 'B1-G3',
      title: 'Gate 3: IELTS Listening Section 1-2 & Speaking Part 1-2',
      subtitle: 'Làm quen dạng bài điền biểu mẫu, bản đồ và nói độc thoại Part 2.',
      passingCriterion: 'Đạt đúng chính xác 100% tuyệt đối (Mastery 100% - Không chấp nhận sai sót)',
      duration: '50 phút kiểm tra',
      testName: 'Cổng 3: Pre-IELTS Listening & Speaking',
      targetScore: '100% Tuyệt Đối (Mastery)',
      lessons: [
        { id: 'B1-L6', num: '06', title: 'Chiến thuật gắn nhãn bản đồ & sơ đồ (Map Labeling)', focus: 'Prepositions of place & direction', duration: '30 phút', skill: 'Đọc hiểu', summary: 'Không bị lạc phương hướng khi nghe băng.' },
        { id: 'B1-L7', num: '07', title: 'IELTS Speaking Part 2: Lập dàn ý 1 phút với mô hình 5W1H', focus: 'Organizing notes & maintaining flow', duration: '30 phút', skill: 'Nói', summary: 'Nói trôi chảy 2 phút không cạn ý.' }
      ]
    },
    {
      gateNumber: 4,
      id: 'B1-G4',
      title: 'Gate 4: Cổng Tổng duyệt Mốc B1 (Pre-IELTS Exam)',
      subtitle: 'Bài thi thử nghiệm chuẩn hóa 60 phút để bước vào chặng chạy nước rút 6.5.',
      passingCriterion: 'Đạt đúng chính xác 100% tuyệt đối (Mastery 100% - Không chấp nhận sai sót)',
      duration: '60 phút kiểm tra',
      testName: 'CỔNG TỔNG DUYỆT B1 (Pre-IELTS Exam)',
      targetScore: '100% Tuyệt Đối (Mastery)',
      lessons: [
        { id: 'B1-L8', num: '08', title: 'IELTS Reading: True/False/Not Given & Matching Headings', focus: 'Paraphrasing & Trap identification', duration: '35 phút', skill: 'Đọc hiểu', summary: 'Phân biệt rõ ràng False và Not Given.' },
        { id: 'B1-L9', num: '09', title: 'IELTS Writing: Đoạn nghị luận 120 từ có ví dụ dẫn chứng', focus: 'Point - Explanation - Example', duration: '35 phút', skill: 'Viết', summary: 'Hoàn thành bài viết học thuật mạch lạc.' }
      ]
    }
  ],

  // MỐC 4: B2 (Band 5.5 -> 6.5+)
  4: [
    {
      gateNumber: 1,
      id: 'B2-G1',
      title: 'Gate 1: Skimming, Scanning & Matching Headings Nâng cao',
      subtitle: 'Xử lý bài đọc học thuật 700-900 từ dưới áp lực 20 phút mỗi Passage.',
      passingCriterion: 'Đạt đúng chính xác 100% tuyệt đối (Mastery 100% - Không chấp nhận sai sót)',
      duration: '60 phút kiểm tra',
      testName: 'Cổng 1: Advanced Academic Reading Check',
      targetScore: '100% Tuyệt Đối (Mastery)',
      lessons: [
        { id: 'B2-L1', num: '01', title: 'Skimming cấu trúc đoạn văn: Topic sentence & Concluding sentence', focus: 'Speed reading 250 wpm', duration: '30 phút', skill: 'Đọc hiểu', summary: 'Nắm bắt ý chính cả đoạn trong 40 giây.' },
        { id: 'B2-L2', num: '02', title: 'Bẫy từ đồng nghĩa (Paraphrase) trong câu hỏi Matching Information', focus: 'Synonym table & Antonyms', duration: '30 phút', skill: 'Đọc hiểu', summary: 'Phát hiện câu trả lời ngụy trang tinh vi.' }
      ]
    },
    {
      gateNumber: 2,
      id: 'B2-G2',
      title: 'Gate 2: IELTS Writing Task 1 (Biểu đồ) & Task 2 (Cấu trúc P.E.E.L)',
      subtitle: 'Viết bài mô tả dữ liệu 150 từ và bài luận nghị luận 250 từ chuẩn Band 6.5.',
      passingCriterion: 'Đạt đúng chính xác 100% tuyệt đối (Mastery 100% - Không chấp nhận sai sót)',
      duration: '60 phút kiểm tra',
      testName: 'Cổng 2: Full Academic Writing Test',
      targetScore: '100% Tuyệt Đối (Mastery)',
      lessons: [
        { id: 'B2-L3', num: '03', title: 'Task 1: Biểu đồ đường, cột & bảng số liệu (Overview + 2 Body)', focus: 'Trend vocabulary & Comparisons', duration: '35 phút', skill: 'Viết', summary: 'Cách viết Overview sắc bén nâng điểm Task 1.' },
        { id: 'B2-L4', num: '04', title: 'Task 2: Cấu trúc đoạn P.E.E.L (Point, Explanation, Evidence, Link)', focus: 'Developing ideas in depth', duration: '40 phút', skill: 'Viết', summary: 'Không để ý tưởng bị cụt hoặc lan man.' }
      ]
    },
    {
      gateNumber: 3,
      id: 'B2-G3',
      title: 'Gate 3: IELTS Listening Section 3-4 & Speaking Part 3 Phản biện',
      subtitle: 'Nghe bài giảng học thuật độc thoại và thảo luận trừu tượng xã hội.',
      passingCriterion: 'Đạt đúng chính xác 100% tuyệt đối (Mastery 100% - Không chấp nhận sai sót)',
      duration: '50 phút kiểm tra',
      testName: 'Cổng 3: Academic Listening & Speaking Part 3',
      targetScore: '100% Tuyệt Đối (Mastery)',
      lessons: [
        { id: 'B2-L5', num: '05', title: 'Listening Section 4: Nghe bài giảng khoa học tốc độ tự nhiên', focus: 'Signposting language & Note taking', duration: '35 phút', skill: 'Đọc hiểu', summary: 'Bắt nhịp từ chuyển hướng bài giảng.' },
        { id: 'B2-L6', num: '06', title: 'Speaking Part 3: Kỹ thuật phản biện 2 mặt của vấn đề xã hội', focus: 'On the one hand... whereas on the other hand', duration: '35 phút', skill: 'Nói', summary: 'Kéo dài câu trả lời học thuật tự nhiên.' }
      ]
    },
    {
      gateNumber: 4,
      id: 'B2-G4',
      title: 'Gate 4: Cổng Tốt nghiệp IELTS 6.5 (Full Mock Test)',
      subtitle: 'Bài thi thử nghiệm chuẩn hóa 160 phút tương đương đề thi thật của IDP / BC.',
      passingCriterion: 'Đạt đúng chính xác 100% tuyệt đối (Mastery 100% - Không chấp nhận sai sót)',
      duration: '160 phút thi toàn diện',
      testName: 'CỔNG TỐT NGHIỆP: FULL IELTS ACADEMIC MOCK TEST',
      targetScore: '100% Tuyệt Đối (Mastery)',
      lessons: [
        { id: 'B2-L7', num: '07', title: 'Chiến thuật phân bổ thể lực và thời gian 160 phút thi liên tục', focus: 'Pacing & Mental endurance', duration: '40 phút', skill: 'Đọc hiểu', summary: 'Giữ sự tỉnh táo tối đa đến phút cuối cùng.' },
        { id: 'B2-L8', num: '08', title: 'Kiểm tra lỗi sai ngữ pháp, chính tả và từ loại phổ biến', focus: 'Proofreading checklist', duration: '30 phút', skill: 'Viết', summary: 'Cứu từ 0.5 đến 1.0 band nhờ soát lỗi.' }
      ]
    }
  ]
};

interface MilestoneCardProps {
  milestone: Milestone;
}

export function MilestoneCard({ milestone }: MilestoneCardProps) {
  const gates = MILESTONE_GATES[milestone.number] ?? MILESTONE_GATES[1]!;
  
  // Track passed gates for this milestone. Default: Gate 1 is passed, Gate 2 is active, Gate 3 & 4 are locked.
  const [passedGates, setPassedGates] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false,
  });

  const [activeGateIndex, setActiveGateIndex] = useState(1); // Default to Gate 2 (in progress)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  const currentGate = gates[activeGateIndex] ?? gates[0]!;

  // Check if a gate is accessible
  const isGateUnlocked = (gateIdx: number) => {
    if (gateIdx === 0) return true; // Gate 1 is always unlocked
    // Gate N is unlocked ONLY IF Gate N-1 is passed!
    return Boolean(passedGates[gateIdx]); // previous gate number
  };

  const isCurrentGatePassed = Boolean(passedGates[currentGate.gateNumber]);
  const isCurrentGateUnlocked = isGateUnlocked(activeGateIndex);

  const handleSelectGate = (idx: number) => {
    const unlocked = isGateUnlocked(idx);
    if (!unlocked) {
      const prevGateNum = idx; // Gate 2 requires Gate 1, Gate 3 requires Gate 2...
      showToast(`🔒 Cổng này đang bị khóa! Bạn bắt buộc phải vượt qua Gate ${prevGateNum} trước thì mới được vào Gate ${idx + 1}.`);
      return;
    }
    setActiveGateIndex(idx);
  };

  const handleSimulatePassGate = (gateNum: number) => {
    setPassedGates((prev) => {
      const updated = { ...prev, [gateNum]: true };
      return updated;
    });
    showToast(`🎉 Chúc mừng! Bạn đã thi đỗ Gate ${gateNum}. Gate ${gateNum + 1} đã được MỞ KHÓA thành công!`);
    if (gateNum < gates.length) {
      setActiveGateIndex(gateNum); // Advance to newly unlocked gate
    }
  };

  const handleResetGates = () => {
    setPassedGates({ 1: true, 2: false, 3: false, 4: false });
    setActiveGateIndex(1);
    showToast('🔄 Đã đặt lại trạng thái các Gate về ban đầu (Gate 1 Đã Pass, Gate 2 Đang học, Gate 3-4 Khóa).');
  };

  return (
    <div className="roadmap-gates-container">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl border border-indigo-400/40 flex items-center gap-3 animate-fade-in">
          <span className="text-base">🔔</span>
          <p className="flex-1 m-0 leading-relaxed font-medium">{toastMessage}</p>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Sequential Gate Rail Header */}
      <div className="roadmap-gates-header">
        <div className="roadmap-gates-title-group">
          <span className="eyebrow text-indigo-600 font-bold uppercase tracking-wider text-xs block mb-1">
            HỆ THỐNG CỔNG KIỂM SOÁT TUẦN TỰ (STRICT SEQUENTIAL GATES)
          </span>
          <h3>Lộ trình chi tiết từng Gate &amp; Bài học bắt buộc</h3>
          <p>
            Chưa thi đỗ Gate trước thì <strong>KHÔNG THỂ vào Gate sau</strong>. Mỗi Gate có danh sách bài học bắt buộc và bài thi sát hạch chuẩn hóa.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetGates}
          className="button secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
          title="Đặt lại tiến trình mô phỏng các Gate"
        >
          <span>🔄</span> Đặt lại mô phỏng
        </button>
      </div>

      {/* Sequential 4-Gate Visual Rail */}
      <div className="roadmap-gate-track" role="tablist" aria-label="Danh sách 4 Cổng kiểm soát tiến độ">
        {gates.map((g, idx) => {
          const isPassed = Boolean(passedGates[g.gateNumber]);
          const isUnlocked = isGateUnlocked(idx);
          const isCurrentActive = idx === activeGateIndex;

          let badgeClass = 'locked';
          let badgeText = 'Khóa 🔒';
          let nodeClass = 'is-locked';

          if (isPassed) {
            badgeClass = 'passed';
            badgeText = 'Đã Pass ✓';
            nodeClass = 'is-passed';
          } else if (isUnlocked) {
            badgeClass = 'active';
            badgeText = 'Đang học ●';
            nodeClass = 'is-active';
          }

          if (isCurrentActive) {
            nodeClass += ' ring-2 ring-indigo-600 shadow-md';
          }

          return (
            <button
              key={g.id}
              type="button"
              role="tab"
              aria-selected={isCurrentActive}
              onClick={() => handleSelectGate(idx)}
              className={`roadmap-gate-node ${nodeClass}`}
              title={isUnlocked ? `Mở xem Gate ${g.gateNumber}` : `Khóa: Cần pass Gate ${idx} trước`}
            >
              <div className="gate-node-top">
                <span className={`gate-node-badge ${badgeClass}`}>
                  {badgeText}
                </span>
                <span className="gate-node-icon" aria-hidden="true">
                  {isPassed ? '🏆' : isUnlocked ? '⚡' : '🔒'}
                </span>
              </div>
              <h4 className="gate-node-title">Gate {g.gateNumber}</h4>
              <p className="gate-node-sub truncate max-w-[200px]">{g.title.split(': ')[1] ?? g.title}</p>
              
              {!isUnlocked && (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md mt-2 block w-fit border border-amber-200/60">
                  Cần đỗ Gate {idx}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Detailed Gate Panel */}
      <div className="gate-detail-shell">
        <div className="gate-detail-header">
          <div>
            <span className="gate-detail-kicker">
              CỘNG SỐ 0{currentGate.gateNumber} / MỐC {milestone.level} ({milestone.title})
            </span>
            <h3>{currentGate.title}</h3>
            <p>{currentGate.subtitle}</p>
          </div>

          <div className="text-right flex flex-col items-end gap-1">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
              isCurrentGatePassed
                ? 'bg-emerald-100 text-emerald-800'
                : isCurrentGateUnlocked
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-slate-100 text-slate-500'
            }`}>
              {isCurrentGatePassed ? '✓ ĐÃ VƯỢT QUA CỔNG' : isCurrentGateUnlocked ? '● ĐANG TRONG TIẾN TRÌNH' : '🔒 ĐANG BỊ KHÓA'}
            </span>
            <span className="text-xs text-slate-500 font-medium">Thời lượng: {currentGate.duration}</span>
          </div>
        </div>

        {/* Passing Rule Requirement Box */}
        <div className={`gate-pass-rule-card ${isCurrentGatePassed ? 'is-passed' : ''}`}>
          <span className="gate-pass-rule-icon" aria-hidden="true">
            {isCurrentGatePassed ? '🎉' : '⚠️'}
          </span>
          <div className="gate-pass-rule-text">
            <h5>BẤT BIẾN QUA CỔNG (CHUẨN 100% TUYỆT ĐỐI): {currentGate.passingCriterion}</h5>
            <p>
              {isCurrentGatePassed
                ? 'Bạn đã hoàn thành mọi bài học bắt buộc và vượt qua bài thi sát hạch của Gate này. Cổng kế tiếp đã sẵn sàng.'
                : 'Học viên phải học đủ các bài học bắt buộc bên dưới và thi đạt ĐÚNG CHÍNH XÁC 100% TUYỆT ĐỐI thì hệ thống mới tự động gỡ khóa cho Gate tiếp theo. Sai 1 câu cũng phải làm lại.'}
            </p>
          </div>
        </div>

        {/* List of Mandatory Lessons */}
        <div className="gate-lessons-section">
          <div className="gate-lessons-title">
            <h4>Danh sách bài học BẮT BUỘC trong Gate này ({currentGate.lessons.length} bài)</h4>
            <span className="gate-mandatory-badge">Mandatory 100%</span>
          </div>

          <div className="gate-lessons-grid">
            {currentGate.lessons.map((lesson) => (
              <div key={lesson.id} className="gate-lesson-row group">
                <div className="gate-lesson-left">
                  <span className="gate-lesson-num">{lesson.num}</span>
                  <div className="gate-lesson-info">
                    <h5>{lesson.title}</h5>
                    <p>{lesson.summary}</p>
                  </div>
                </div>

                <div className="gate-lesson-meta">
                  <span className="gate-skill-pill">{lesson.skill}</span>
                  <span className="gate-duration-pill">{lesson.duration}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                    Bắt buộc
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gate Exit Test & Simulation Box */}
        <div className="gate-test-action-box">
          <div className="gate-test-action-left">
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-300 block mb-1">
              BÀI KIỂM SOÁT ĐẦU RA (EXIT TEST GATE 0{currentGate.gateNumber})
            </span>
            <h4>{currentGate.testName}</h4>
            <p>
              Tiêu chuẩn đạt: <strong>{currentGate.targetScore}</strong> · Thời gian: {currentGate.duration}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {isCurrentGatePassed ? (
              <span className="gate-test-btn has-passed">
                ✓ ĐÃ THI ĐỖ CỔNG NÀY
              </span>
            ) : isCurrentGateUnlocked ? (
              <button
                type="button"
                onClick={() => handleSimulatePassGate(currentGate.gateNumber)}
                className="gate-test-btn can-take"
                title="Bấm để thi thử và mở khóa Gate tiếp theo"
              >
                <span>⚡</span> Thi thử đỗ Gate để mở tiếp →
              </button>
            ) : (
              <span className="gate-test-btn is-locked">
                <span>🔒</span> Cần đỗ Gate trước
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
