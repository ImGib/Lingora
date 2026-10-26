import type { GrammarQuizQuestion } from './grammar-practice-card';

export interface ComprehensivePracticeSet {
  id: string;
  title: string;
  tagline: string;
  milestone: 'MỐC 1 (A1)' | 'MỐC 2 (A2)' | 'MỐC 3 (B1)' | 'MỐC 4 (B2)' | 'TỔNG HỢP';
  bandTarget: string;
  durationMinutes: number;
  totalQuestions: number;
  description: string;
  questions: GrammarQuizQuestion[];
}

/**
 * Ngân Hàng Câu Hỏi Ôn Tập Theo Từng Chuyên Đề (32 Chuyên Đề Đầy Đủ)
 */
export const TOPIC_QUIZ_BANK: Record<string, GrammarQuizQuestion[]> = {
  // 1. To Be Foundation
  'to-be-foundation': [
    {
      id: 'tb-1',
      type: 'multiple-choice',
      prompt: 'Chọn dạng đúng của động từ "To Be" để hoàn thành câu giới thiệu học thuật:',
      sentence: 'The data collected from the 2025 survey _____ extremely reliable for academic research.',
      options: ['is', 'are', 'am', 'being'],
      correctAnswer: 'are',
      explanation: 'Chủ ngữ là "The data" (danh từ số nhiều trong văn phong học thuật, dữ liệu từ cuộc khảo sát) kết hợp với danh từ số nhiều nên động từ To Be chia là "are".',
      hint: 'Chú ý chủ ngữ thực sự của câu đứng trước cụm giới từ "collected from...".',
      bandTarget: 'Band 3.0+',
      difficulty: 'Cơ Bản',
    },
    {
      id: 'tb-2',
      type: 'fill-blank',
      prompt: 'Điền dạng đúng của động từ To Be ở thể phủ định viết tắt hoặc đầy đủ:',
      sentence: 'Despite having extensive experience, he _____ not satisfied with the preliminary laboratory results.',
      correctAnswer: 'is',
      explanation: 'Chủ ngữ "he" là ngôi thứ 3 số ít nên động từ To Be ở hiện tại đơn là "is". Câu mang nghĩa: "Mặc dù có nhiều kinh nghiệm, anh ấy vẫn không hài lòng với kết quả sơ bộ."',
      hint: 'Ngôi thứ 3 số ít (He/She/It) đi kèm To Be nào ở hiện tại?',
      bandTarget: 'Band 3.0+',
      difficulty: 'Cơ Bản',
    },
    {
      id: 'tb-3',
      type: 'error-identification',
      prompt: 'Tìm từ sai ngữ pháp trong 4 phần gạch chân dưới đây:',
      sentence: 'Neither the principal researcher nor his assistants [A: is] [B: convinced] that the hypothesis [C: is] completely [D: sound].',
      options: ['is (chỗ A)', 'convinced', 'is (chỗ C)', 'sound'],
      correctAnswer: 'is (chỗ A)',
      explanation: 'Theo quy tắc phối hợp thì với cấu trúc "Neither... nor...", động từ To Be chia theo danh từ gần nó nhất ("his assistants" - danh từ số nhiều), do đó chỗ A phải sửa thành "are".',
      hint: 'Cấu trúc Neither S1 nor S2: Động từ chia theo S2 gần nhất.',
      bandTarget: 'Band 4.0+',
      difficulty: 'Trung Cấp',
    },
  ],

  // 2. Present Simple
  'present-simple-tense': [
    {
      id: 'ps-1',
      type: 'multiple-choice',
      prompt: 'Chọn đáp án đúng nhất diễn tả quy luật vật lý hiển nhiên trong tự nhiên:',
      sentence: 'Water _____ at 100 degrees Celsius under standard atmospheric pressure.',
      options: ['is boiling', 'boils', 'boiled', 'has boiled'],
      correctAnswer: 'boils',
      explanation: 'Hiện tại đơn (Present Simple) diễn tả sự thật hiển nhiên, chân lý khoa học. Chủ ngữ "Water" là danh từ không đếm được nên động từ thêm "-s" -> "boils".',
      hint: 'Sự thật hiển nhiên vĩnh cửu luôn chia ở thì Hiện Tại Đơn.',
      bandTarget: 'Band 3.0+',
      difficulty: 'Cơ Bản',
    },
    {
      id: 'ps-2',
      type: 'fill-blank',
      prompt: 'Điền dạng đúng của động từ trong ngoặc (analyze):',
      sentence: 'The senior research team regularly _____ (analyze) urban traffic patterns every Monday morning.',
      correctAnswer: 'analyzes',
      explanation: 'Dấu hiệu nhận biết "regularly" và "every Monday morning" chỉ thói quen lặp đi lặp lại. "The senior research team" là danh từ số ít nên chia "analyzes".',
      hint: 'Chủ ngữ số ít, động từ kết thúc bằng "-ze" thêm "-s".',
      bandTarget: 'Band 3.5+',
      difficulty: 'Cơ Bản',
    },
    {
      id: 'ps-3',
      type: 'multiple-choice',
      prompt: 'Trong mệnh đề trạng ngữ chỉ thời gian ở tương lai, thì hiện tại đơn được dùng như thế nào?',
      sentence: 'As soon as the flight _____ in Frankfurt, we will proceed immediately to the conference hall.',
      options: ['will arrive', 'arrives', 'is arriving', 'has arrived'],
      correctAnswer: 'arrives',
      explanation: 'Trong mệnh đề chỉ thời gian bắt đầu bằng "As soon as", "When", "Before", "After", ta dùng Thì Hiện Tại Đơn để thay thế cho tương lai.',
      hint: 'Sau các liên từ thời gian như As soon as, When, Once tuyệt đối không dùng "will".',
      bandTarget: 'Band 4.5+',
      difficulty: 'Trung Cấp',
    },
  ],

  // 3. Present Continuous
  'present-continuous-tense': [
    {
      id: 'pc-1',
      type: 'multiple-choice',
      prompt: 'Chọn thì thích hợp diễn tả xu hướng đang biến chuyển trong xã hội (trends):',
      sentence: 'More and more university graduates _____ remote employment opportunities rather than traditional office jobs.',
      options: ['seek', 'are seeking', 'have sought', 'sought'],
      correctAnswer: 'are seeking',
      explanation: 'Hiện tại tiếp diễn với cụm "More and more..." dùng để mô tả một xu hướng đang gia tăng hoặc biến chuyển trong xã hội (Changing situations).',
      hint: 'Dấu hiệu "More and more" thể hiện xu hướng đang biến chuyển mạnh mẽ.',
      bandTarget: 'Band 4.0+',
      difficulty: 'Trung Cấp',
    },
    {
      id: 'pc-2',
      type: 'multiple-choice',
      prompt: 'Động từ chỉ trạng thái (stative verb) nào KHÔNG được dùng ở thì tiếp diễn trong ngữ cảnh này?',
      sentence: 'Dr. Evelyn _____ that the proposed timeline is unrealistic for this clinical trial.',
      options: ['is believing', 'believes', 'is believing in', 'are believing'],
      correctAnswer: 'believes',
      explanation: 'Động từ "believe" là stative verb (động từ chỉ nhận thức, quan điểm), không dùng ở thì tiếp diễn khi mang nghĩa tin tưởng/cho rằng.',
      hint: 'Các động từ tri giác, niềm tin (believe, understand, know) không chia V-ing mang nghĩa trạng thái.',
      bandTarget: 'Band 4.0+',
      difficulty: 'Cơ Bản',
    },
    {
      id: 'pc-3',
      type: 'fill-blank',
      prompt: 'Chia động từ trong ngoặc (expand) ở thì hiện tại tiếp diễn:',
      sentence: 'Lingora currently _____ (expand) its AI pronunciation database to include 10 more dialects.',
      correctAnswer: 'is expanding',
      explanation: 'Dấu hiệu "currently" diễn tả hành động đang diễn ra tại thời điểm hiện tại. "Lingora" là danh từ riêng số ít -> "is expanding".',
      hint: 'Chủ ngữ số ít đi với is + V-ing.',
      bandTarget: 'Band 3.5+',
      difficulty: 'Cơ Bản',
    },
  ],

  // 4. Present Perfect
  'present-perfect-tense': [
    {
      id: 'pp-1',
      type: 'multiple-choice',
      prompt: 'Chọn giới từ thích hợp cho mốc thời gian trong thì Hiện Tại Hoàn Thành:',
      sentence: 'The government has implemented strict cybersecurity regulations _____ November 2024.',
      options: ['for', 'since', 'in', 'during'],
      correctAnswer: 'since',
      explanation: '"Since" đi kèm với một mốc thời gian xác định trong quá khứ ("November 2024") khi hành động bắt đầu và kéo dài đến hiện tại.',
      hint: '"Since + mốc thời gian", "For + khoảng thời gian".',
      bandTarget: 'Band 4.0+',
      difficulty: 'Cơ Bản',
    },
    {
      id: 'pp-2',
      type: 'multiple-choice',
      prompt: 'Phân biệt "has gone to" và "has been to":',
      sentence: 'Professor Nguyen is not in the department right now; he _____ Tokyo for the renewable energy symposium.',
      options: ['has been to', 'has gone to', 'was in', 'had gone to'],
      correctAnswer: 'has gone to',
      explanation: '"Has gone to" mang nghĩa đã đi đến đó và hiện tại vẫn chưa quay trở lại. Trong khi "has been to" mang nghĩa đã từng đến và đã trở về.',
      hint: 'Hiện tại giáo sư không có mặt ở văn phòng -> ông ấy đang ở Tokyo chưa về.',
      bandTarget: 'Band 4.5+',
      difficulty: 'Trung Cấp',
    },
    {
      id: 'pp-3',
      type: 'fill-blank',
      prompt: 'Điền dạng đúng của động từ (publish) ở thì hiện tại hoàn thành:',
      sentence: 'The research institute _____ (publish) three milestone papers on neural networks so far this year.',
      correctAnswer: 'has published',
      explanation: 'Dấu hiệu "so far this year" diễn tả số lượng kết quả đạt được tính đến thời điểm hiện tại -> dùng Present Perfect: "has published".',
      hint: 'So far = tính tới nay. Chủ ngữ số ít -> has + V3.',
      bandTarget: 'Band 4.0+',
      difficulty: 'Cơ Bản',
    },
  ],

  // 5. Present Perfect Continuous
  'present-perfect-continuous-tense': [
    {
      id: 'ppc-1',
      type: 'multiple-choice',
      prompt: 'Chọn thì đúng nhấn mạnh tính liên tục không ngừng nghỉ của hành động:',
      sentence: 'The software engineers _____ the database architecture for seven straight hours without a break.',
      options: ['optimized', 'are optimizing', 'have been optimizing', 'had optimized'],
      correctAnswer: 'have been optimizing',
      explanation: 'Thì Hiện Tại Hoàn Thành Tiếp Diễn (have/has been V-ing) nhấn mạnh tính liên tục, bền bỉ của hành vi kéo dài suốt "seven straight hours".',
      hint: 'Nhấn mạnh quá trình liên tục (duration) kéo dài suốt nhiều giờ không nghỉ.',
      bandTarget: 'Band 5.0+',
      difficulty: 'Trung Cấp',
    },
    {
      id: 'ppc-2',
      type: 'multiple-choice',
      prompt: 'Hệ quả rõ rệt ở hiện tại xuất phát từ hành động vừa mới xảy ra liên tục:',
      sentence: 'Her voice is completely hoarse because she _____ all afternoon at the academic debate.',
      options: ['has spoken', 'has been speaking', 'spoke', 'is speaking'],
      correctAnswer: 'has been speaking',
      explanation: 'Thì Hiện Tại Hoàn Thành Tiếp Diễn giải thích nguyên nhân cho một kết quả/dấu vết thấy rõ ở hiện tại ("Her voice is hoarse").',
      hint: 'Hành động vừa mới diễn ra liên tục gây ra dấu vết rõ rệt tại hiện tại.',
      bandTarget: 'Band 5.5+',
      difficulty: 'Trung Cấp',
    },
  ],

  // 6. Past Simple
  'past-simple-tense': [
    {
      id: 'pst-1',
      type: 'multiple-choice',
      prompt: 'Chọn thì đúng cho sự kiện đã chấm dứt hoàn toàn tại một thời điểm xác định trong quá khứ:',
      sentence: 'The United Kingdom officially _____ the European Union on January 31, 2020.',
      options: ['leaves', 'has left', 'left', 'had left'],
      correctAnswer: 'left',
      explanation: 'Có mốc thời gian xác định đã kết thúc trong quá khứ ("on January 31, 2020") -> Bắt buộc dùng Quá khứ đơn (Past Simple).',
      hint: 'Mốc thời gian cụ thể trong quá khứ luôn chia Quá khứ đơn.',
      bandTarget: 'Band 3.5+',
      difficulty: 'Cơ Bản',
    },
    {
      id: 'pst-2',
      type: 'fill-blank',
      prompt: 'Điền dạng quá khứ bất quy tắc của động từ (undergo):',
      sentence: 'In 2023, the central hospital _____ (undergo) extensive structural renovations.',
      correctAnswer: 'underwent',
      explanation: 'Động từ bất quy tắc "undergo" có dạng quá khứ là "underwent".',
      hint: 'Quá khứ của go là went -> undergo -> underwent.',
      bandTarget: 'Band 4.0+',
      difficulty: 'Cơ Bản',
    },
  ],

  // 7. Past Continuous
  'past-continuous-tense': [
    {
      id: 'pct-1',
      type: 'multiple-choice',
      prompt: 'Hành động đang diễn ra trong quá khứ thì có một hành động khác xen vào:',
      sentence: 'While the scientists _____ the chemical compound, a sudden power surge disrupted the equipment.',
      options: ['analyzed', 'were analyzing', 'had analyzed', 'are analyzing'],
      correctAnswer: 'were analyzing',
      explanation: 'Hành động dài đang diễn ra dùng Quá khứ tiếp diễn (were analyzing); hành động ngắn xen vào dùng Quá khứ đơn (disrupted).',
      hint: 'Cấu trúc: While + Past Continuous, Past Simple.',
      bandTarget: 'Band 4.5+',
      difficulty: 'Cơ Bản',
    },
    {
      id: 'pct-2',
      type: 'multiple-choice',
      prompt: 'Hai hành động diễn ra song song cùng lúc trong quá khứ:',
      sentence: 'At 8 PM yesterday, while Lan was drafting the literature review, Minh _____ the survey dataset.',
      options: ['was cleaning', 'cleaned', 'has cleaned', 'had cleaned'],
      correctAnswer: 'was cleaning',
      explanation: 'Hai hành động cùng xảy ra song song tại một thời điểm xác định trong quá khứ đều được chia ở Quá khứ tiếp diễn.',
      hint: 'Hai hành động song song trong quá khứ đều dùng Past Continuous.',
      bandTarget: 'Band 4.5+',
      difficulty: 'Trung Cấp',
    },
  ],

  // 8. Past Perfect
  'past-perfect-tense': [
    {
      id: 'pft-1',
      type: 'multiple-choice',
      prompt: 'Chọn thì diễn tả hành động xảy ra trước một hành động khác trong quá khứ:',
      sentence: 'By the time the ambulance arrived, local volunteers _____ the injured passengers.',
      options: ['evacuated', 'had evacuated', 'have evacuated', 'were evacuating'],
      correctAnswer: 'had evacuated',
      explanation: 'Cấu trúc "By the time + S + V(quá khứ đơn), S + had + V3/ed". Hành động sơ tán hoàn tất trước khi xe cấp cứu đến.',
      hint: 'By the time + Quá khứ đơn, vế còn lại chia Quá khứ hoàn thành (had + V3).',
      bandTarget: 'Band 5.0+',
      difficulty: 'Trung Cấp',
    },
    {
      id: 'pft-2',
      type: 'fill-blank',
      prompt: 'Điền dạng đúng của động từ (lose) ở thì Quá khứ hoàn thành:',
      sentence: 'She was unable to board the flight because she _____ (lose) her passport earlier that morning.',
      correctAnswer: 'had lost',
      explanation: 'Việc làm mất hộ chiếu ("earlier that morning") xảy ra trước thời điểm không thể lên máy bay ("was unable"). Dùng "had lost".',
      hint: 'Xảy ra trước một mốc quá khứ: had + V3/ed.',
      bandTarget: 'Band 4.5+',
      difficulty: 'Cơ Bản',
    },
  ],

  // 9. Past Perfect Continuous
  'past-perfect-continuous-tense': [
    {
      id: 'ppct-1',
      type: 'multiple-choice',
      prompt: 'Nhấn mạnh hành động diễn ra liên tục trước một thời điểm trong quá khứ:',
      sentence: 'Prior to winning the championship in 2022, the gymnast _____ for over twelve years.',
      options: ['trained', 'had trained', 'had been training', 'was training'],
      correctAnswer: 'had been training',
      explanation: 'Hành động rèn luyện diễn ra liên tục suốt 12 năm trước mốc vô địch năm 2022. Dùng Quá khứ hoàn thành tiếp diễn để nhấn mạnh quá trình.',
      hint: 'Nhấn mạnh quá trình bền bỉ xảy ra trước một sự kiện trong quá khứ.',
      bandTarget: 'Band 5.5+',
      difficulty: 'Nâng Cao',
    },
  ],

  // 10. Future Simple
  'future-simple-tense': [
    {
      id: 'fs-1',
      type: 'multiple-choice',
      prompt: 'Phân biệt "will" (quyết định ngay lúc nói) và "be going to" (kế hoạch dự định trước):',
      sentence: '"The projector just stopped working!" — "Don\'t worry, I _____ the technical support desk right now."',
      options: ['am calling', 'will call', 'am going to call', 'call'],
      correctAnswer: 'will call',
      explanation: 'Quyết định đưa ra ngay tức thì tại thời điểm nói mà không có kế hoạch từ trước -> Dùng "will + V".',
      hint: 'Quyết định bộc phát ngay thời điểm nói: Dùng Will.',
      bandTarget: 'Band 3.5+',
      difficulty: 'Cơ Bản',
    },
    {
      id: 'fs-2',
      type: 'multiple-choice',
      prompt: 'Dự đoán có bằng chứng cụ thể trước mắt:',
      sentence: 'Look at those dark, heavy clouds rolling over the mountains! It _____ rain heavily.',
      options: ['will', 'is going to', 'shall', 'would'],
      correctAnswer: 'is going to',
      explanation: 'Dự đoán tương lai dựa trên bằng chứng thấy rõ ở hiện tại ("dark, heavy clouds") -> Dùng "be going to".',
      hint: 'Có bằng chứng trực quan cụ thể trước mắt: Be going to.',
      bandTarget: 'Band 4.0+',
      difficulty: 'Cơ Bản',
    },
  ],

  // 11. Future Continuous
  'future-continuous-tense': [
    {
      id: 'fc-1',
      type: 'multiple-choice',
      prompt: 'Diễn tả hành động đang diễn ra tại một thời điểm xác định trong tương lai:',
      sentence: 'This time next week, the delegation _____ their final presentation at the WTO headquarters.',
      options: ['delivers', 'will deliver', 'will be delivering', 'will have delivered'],
      correctAnswer: 'will be delivering',
      explanation: 'Dấu hiệu "This time next week" chỉ thời điểm xác định cụ thể trong tương lai -> Dùng Thì Tương Lai Tiếp Diễn (will be + V-ing).',
      hint: 'This time + thời gian tương lai: Will be + V-ing.',
      bandTarget: 'Band 5.0+',
      difficulty: 'Trung Cấp',
    },
  ],

  // 12. Future Perfect
  'future-perfect-tense': [
    {
      id: 'fpt-1',
      type: 'multiple-choice',
      prompt: 'Hành động sẽ hoàn tất trước một mốc thời gian trong tương lai:',
      sentence: 'By the end of this decade, artificial intelligence _____ profound changes across global healthcare systems.',
      options: ['brings', 'will bring', 'will be bringing', 'will have brought'],
      correctAnswer: 'will have brought',
      explanation: 'Cấu trúc "By + mốc tương lai" (By the end of this decade) chỉ hành động sẽ hoàn tất trước thời điểm đó -> Dùng Tương Lai Hoàn Thành (will have + V3).',
      hint: 'By + mốc tương lai -> Tương Lai Hoàn Thành (will have + V3).',
      bandTarget: 'Band 5.5+',
      difficulty: 'Trung Cấp',
    },
    {
      id: 'fpt-2',
      type: 'fill-blank',
      prompt: 'Điền dạng đúng của động từ (complete) ở thì Tương Lai Hoàn Thành:',
      sentence: 'By next Friday, our development squad _____ (complete) the automated verification pipeline.',
      correctAnswer: 'will have completed',
      explanation: 'Cấu trúc "By next Friday" đi với thì Tương lai hoàn thành: will have + V3/ed.',
      hint: 'By + mốc tương lai -> will have + V3.',
      bandTarget: 'Band 5.0+',
      difficulty: 'Cơ Bản',
    },
  ],

  // 13. Future Perfect Continuous
  'future-perfect-continuous-tense': [
    {
      id: 'fpct-1',
      type: 'multiple-choice',
      prompt: 'Nhấn mạnh khoảng thời gian kéo dài liên tục tính đến một mốc trong tương lai:',
      sentence: 'By December 2026, Professor Clark _____ at Oxford University for exactly 30 years.',
      options: ['will teach', 'will have taught', 'will have been teaching', 'is teaching'],
      correctAnswer: 'will have been teaching',
      explanation: 'Nhấn mạnh tính liên tục của khoảng thời gian 30 năm tính đến mốc "By December 2026" -> Dùng Tương Lai Hoàn Thành Tiếp Diễn.',
      hint: 'By + mốc tương lai + for + khoảng thời gian -> Future Perfect Continuous.',
      bandTarget: 'Band 6.0+',
      difficulty: 'Nâng Cao',
    },
  ],

  // 14. Future in the Past
  'future-in-the-past': [
    {
      id: 'fip-1',
      type: 'multiple-choice',
      prompt: 'Diễn tả dự định trong quá khứ nhưng có thể đã không xảy ra hoặc chưa rõ kết quả:',
      sentence: 'The committee promised that they _____ announce the final scholarship recipients the following week.',
      options: ['will', 'would', 'are going to', 'shall'],
      correctAnswer: 'would',
      explanation: 'Lời hứa diễn ra trong quá khứ ("promised"), tương lai nhìn từ quá khứ chuyển "will" thành "would".',
      hint: 'Tường thuật lại tương lai từ quá khứ: Will -> Would.',
      bandTarget: 'Band 5.5+',
      difficulty: 'Trung Cấp',
    },
  ],

  // 15. The 12-Tense Timeline & Sequence Matrix
  'twelve-tenses-timeline-matrix': [
    {
      id: 'ttm-1',
      type: 'multiple-choice',
      prompt: 'Quy tắc hòa hợp thì khi mệnh đề chính ở quá khứ:',
      sentence: 'The lead investigator explained that the experiment _____ several unexpected anomalies earlier.',
      options: ['encounters', 'has encountered', 'had encountered', 'is encountering'],
      correctAnswer: 'had encountered',
      explanation: 'Mệnh đề chính ở quá khứ ("explained"), sự việc xảy ra trước đó ("earlier") bắt buộc phải lùi về Quá khứ hoàn thành ("had encountered").',
      hint: 'Sự việc xảy ra trước một động từ quá khứ phải lùi về Past Perfect.',
      bandTarget: 'Band 6.0+',
      difficulty: 'Nâng Cao',
    },
  ],

  // 16. Subject-Verb Agreement
  'subject-verb-agreement': [
    {
      id: 'sva-1',
      type: 'multiple-choice',
      prompt: 'Hòa hợp giữa chủ ngữ và động từ với cụm danh từ định lượng:',
      sentence: 'A large percentage of the local population _____ access to clean drinking water.',
      options: ['lacks', 'lack', 'are lacking', 'have lacked'],
      correctAnswer: 'lacks',
      explanation: 'Với "percentage of + danh từ không đếm được (population ở đây đóng vai trò tập thể/khối lượng)", động từ chia số ít "lacks".',
      hint: 'Percentage of + uncountable noun -> Động từ số ít.',
      bandTarget: 'Band 5.5+',
      difficulty: 'Trung Cấp',
    },
    {
      id: 'sva-2',
      type: 'multiple-choice',
      prompt: 'Phân biệt "A number of" và "The number of":',
      sentence: 'The number of applicants submitting portfolios online _____ sharply this quarter.',
      options: ['has increased', 'have increased', 'are increasing', 'were increasing'],
      correctAnswer: 'has increased',
      explanation: '"The number of + N(số nhiều)" đi với động từ số ít (chỉ con số). Trong khi "A number of + N(số nhiều)" đi với động từ số nhiều.',
      hint: 'The number of -> Động từ số ít. A number of -> Động từ số nhiều.',
      bandTarget: 'Band 5.5+',
      difficulty: 'Trung Cấp',
    },
  ],

  // 17. Parts of Speech Order
  'parts-of-speech-order': [
    {
      id: 'pso-1',
      type: 'multiple-choice',
      prompt: 'Chọn trật tự tính từ đúng quy chuẩn OSASCOMP:',
      sentence: 'She purchased a _____ leather briefcase for her corporate interviews.',
      options: [
        'stylish small Italian vintage',
        'vintage stylish Italian small',
        'stylish small vintage Italian',
        'small stylish Italian vintage',
      ],
      correctAnswer: 'stylish small vintage Italian',
      explanation: 'Quy tắc OSASCOMP: Opinion (stylish) -> Size (small) -> Age (vintage) -> Origin (Italian) -> Material (leather).',
      hint: 'OSASCOMP: Ý kiến -> Kích thước -> Tuổi thọ -> Nguồn gốc.',
      bandTarget: 'Band 5.5+',
      difficulty: 'Trung Cấp',
    },
  ],

  // 18. Passive Voice
  'passive-voice': [
    {
      id: 'pv-1',
      type: 'multiple-choice',
      prompt: 'Chọn thể bị động học thuật thích hợp cho văn phong IELTS Writing Task 1/2:',
      sentence: 'Substantial progress _____ in renewable energy storage technologies over the last five years.',
      options: ['has made', 'has been made', 'was made', 'is making'],
      correctAnswer: 'has been made',
      explanation: 'Chủ ngữ "Substantial progress" là đối tượng chịu tác động; dấu hiệu "over the last five years" yêu cầu thì Hiện tại hoàn thành bị động: has been made.',
      hint: 'Hiện tại hoàn thành bị động: has/have been + V3/ed.',
      bandTarget: 'Band 5.5+',
      difficulty: 'Trung Cấp',
    },
    {
      id: 'pv-2',
      type: 'fill-blank',
      prompt: 'Điền dạng bị động với động từ khuyết thiếu (must/deliver):',
      sentence: 'All laboratory reports must _____ (deliver) to the department supervisor before 5 PM.',
      correctAnswer: 'be delivered',
      explanation: 'Bị động của modal verb: Modal + be + V3/ed -> "must be delivered".',
      hint: 'Must + be + V3/ed.',
      bandTarget: 'Band 4.5+',
      difficulty: 'Cơ Bản',
    },
  ],

  // 19. Comparatives & Superlatives
  'comparatives-superlatives': [
    {
      id: 'cs-1',
      type: 'multiple-choice',
      prompt: 'Cấu trúc so sánh kép (The more... the more...):',
      sentence: 'The more demanding the academic curriculum becomes, _____ students must develop their self-discipline.',
      options: ['the more effectively', 'more effectively', 'most effectively', 'the most effectively'],
      correctAnswer: 'the more effectively',
      explanation: 'Cấu trúc so sánh lũy tiến: "The + comparative..., the + comparative...". Vế sau cần "the more effectively".',
      hint: 'The + so sánh hơn..., the + so sánh hơn...',
      bandTarget: 'Band 6.0+',
      difficulty: 'Trung Cấp',
    },
  ],

  // 20. Modal Verbs
  'modal-verbs': [
    {
      id: 'mv-1',
      type: 'multiple-choice',
      prompt: 'Suy đoán logic chắc chắn có căn cứ trong quá khứ:',
      sentence: 'The archaeological site was completely submerged in silt; the ancient tsunami _____ catastrophic devastation.',
      options: ['must have caused', 'should have caused', 'might cause', 'can cause'],
      correctAnswer: 'must have caused',
      explanation: '"Must have + V3" diễn tả suy đoán gần như chắc chắn về một sự việc trong quá khứ dựa trên bằng chứng hiển nhiên ("completely submerged").',
      hint: 'Suy đoán chắc chắn trong quá khứ: Must have + V3.',
      bandTarget: 'Band 6.0+',
      difficulty: 'Nâng Cao',
    },
  ],

  // 21. First & Second Conditionals
  'first-second-conditional': [
    {
      id: 'fsc-1',
      type: 'multiple-choice',
      prompt: 'Câu điều kiện loại 2 giả định điều không có thật ở hiện tại:',
      sentence: 'If municipal governments _____ more in rapid transit, urban traffic congestion would decline substantially.',
      options: ['invest', 'invested', 'will invest', 'had invested'],
      correctAnswer: 'invested',
      explanation: 'Vế chính có "would decline" (would + V) -> Vế if của điều kiện loại 2 chia ở Quá khứ đơn ("invested").',
      hint: 'Điều kiện loại 2: If + S + V(quá khứ đơn), S + would + V.',
      bandTarget: 'Band 5.5+',
      difficulty: 'Trung Cấp',
    },
  ],

  // 22. Third & Mixed Conditionals
  'third-mixed-conditionals': [
    {
      id: 'tmc-1',
      type: 'multiple-choice',
      prompt: 'Câu điều kiện trộn (Giả định quá khứ dẫn đến kết quả hiện tại):',
      sentence: 'If he _____ the safety warnings yesterday, he would not be in the hospital today.',
      options: ['heeded', 'has heeded', 'had heeded', 'would heed'],
      correctAnswer: 'had heeded',
      explanation: 'Điều kiện trộn: Vế if giả định quá khứ (had heeded yesterday) dẫn tới kết quả ở hiện tại (would not be in hospital today).',
      hint: 'Hành động trong quá khứ dùng had + V3, kết quả hiện tại dùng would + V.',
      bandTarget: 'Band 6.5+',
      difficulty: 'Nâng Cao',
    },
  ],

  // 23. Defining Relative Clauses
  'defining-relative-clauses': [
    {
      id: 'drc-1',
      type: 'multiple-choice',
      prompt: 'Đại từ quan hệ đóng vai trò tân ngữ chỉ người trong mệnh đề xác định:',
      sentence: 'The scholar _____ we interviewed yesterday has dedicated forty years to cognitive linguistics.',
      options: ['which', 'whom', 'whose', 'where'],
      correctAnswer: 'whom',
      explanation: '"Whom" làm tân ngữ thay thế cho người ("The scholar") khi phía sau có chủ ngữ "we".',
      hint: 'Thay cho danh từ chỉ người làm tân ngữ: Whom.',
      bandTarget: 'Band 5.0+',
      difficulty: 'Cơ Bản',
    },
  ],

  // 24. Non-defining Relative Clauses
  'non-defining-relative-clauses': [
    {
      id: 'ndrc-1',
      type: 'multiple-choice',
      prompt: 'Quy tắc dấu phẩy và đại từ quan hệ trong mệnh đề không xác định:',
      sentence: 'Professor Alexander Fleming, _____ discovered penicillin in 1928, received the Nobel Prize.',
      options: ['that', 'which', 'who', 'whom'],
      correctAnswer: 'who',
      explanation: 'Trong mệnh đề quan hệ không xác định (có dấu phẩy), tuyệt đối KHÔNG dùng "that". Thay thế cho người làm chủ ngữ dùng "who".',
      hint: 'Có dấu phẩy ngăn cách -> Tuyệt đối không dùng that.',
      bandTarget: 'Band 5.5+',
      difficulty: 'Trung Cấp',
    },
  ],

  // 25. Reduced Relative Clauses
  'reduced-relative-clauses': [
    {
      id: 'rrc-1',
      type: 'multiple-choice',
      prompt: 'Rút gọn mệnh đề quan hệ mang nghĩa bị động:',
      sentence: 'The research methodology _____ by the Cambridge advisory board will be adopted nationwide.',
      options: ['proposing', 'proposed', 'which proposed', 'was proposed'],
      correctAnswer: 'proposed',
      explanation: 'Mệnh đề gốc: "which was proposed by...". Khi rút gọn mệnh đề quan hệ ở thể bị động, ta lược bỏ đại từ và to be, chỉ giữ lại Quá khứ phân từ (V3/ed -> proposed).',
      hint: 'Rút gọn thể bị động: Chỉ giữ lại V3/ed.',
      bandTarget: 'Band 6.0+',
      difficulty: 'Trung Cấp',
    },
  ],

  // 26. Coordinating & Correlative Conjunctions
  'coordinating-correlative-conjunctions': [
    {
      id: 'ccc-1',
      type: 'multiple-choice',
      prompt: 'Cặp liên từ tương quan song hành:',
      sentence: 'The initiative was designed not only to reduce carbon emissions _____ also to stimulate local economic vitality.',
      options: ['and', 'but', 'so', 'or'],
      correctAnswer: 'but',
      explanation: 'Cặp liên từ tương quan cố định: "not only... but also...".',
      hint: 'Not only đi liền với but also.',
      bandTarget: 'Band 4.5+',
      difficulty: 'Cơ Bản',
    },
  ],

  // 27. Subordinating Conjunctions in Complex Sentences
  'subordinating-conjunctions-complex': [
    {
      id: 'scc-1',
      type: 'multiple-choice',
      prompt: 'Chọn liên từ chỉ sự tương phản nhượng bộ trong văn phong học thuật:',
      sentence: '_____ the initial setup costs were substantial, the solar infrastructure achieved profitability within three years.',
      options: ['Despite', 'Although', 'Because', 'Unless'],
      correctAnswer: 'Although',
      explanation: '"Although" theo sau là một mệnh đề hoàn chỉnh (S + V). Trong khi "Despite" theo sau là danh từ hoặc cụm danh từ.',
      hint: 'Theo sau là mệnh đề (S + V) -> Dùng Although.',
      bandTarget: 'Band 5.5+',
      difficulty: 'Trung Cấp',
    },
  ],

  // 28. Transitions & Discourse Markers
  'transitions-discourse-markers': [
    {
      id: 'tdm-1',
      type: 'multiple-choice',
      prompt: 'Chọn từ nối liên kết câu thích hợp trong IELTS Writing Task 2:',
      sentence: 'Traditional fossil fuels are becoming increasingly scarce. _____, investments in renewable energy have surged.',
      options: ['Consequently', 'However', 'Nevertheless', 'Whereas'],
      correctAnswer: 'Consequently',
      explanation: '"Consequently" mang nghĩa "Do đó / Kết quả là", thể hiện mối quan hệ nguyên nhân - kết quả giữa hai câu độc lập.',
      hint: 'Nhiên liệu khan hiếm -> Kết quả là đầu tư năng lượng tái tạo tăng vọt.',
      bandTarget: 'Band 6.5+',
      difficulty: 'Nâng Cao',
    },
  ],

  // 29. Inversion with Negative & Limiting Adverbs
  'inversion-negative-limiting': [
    {
      id: 'inversion-1',
      type: 'multiple-choice',
      prompt: 'Đảo ngữ với trạng từ phủ định đứng đầu câu:',
      sentence: 'Rarely _____ such profound consensus among international climate scientists.',
      options: ['we have witnessed', 'have we witnessed', 'we witnessed', 'did we witnessed'],
      correctAnswer: 'have we witnessed',
      explanation: 'Khi trạng từ phủ định/bán phủ định ("Rarely", "Seldom", "Never") đứng đầu câu, ta đảo trợ động từ lên trước chủ ngữ: Rarely + have + S + V3.',
      hint: 'Đảo ngữ: Trạng từ phủ định + Trợ động từ + Chủ ngữ + Động từ chính.',
      bandTarget: 'Band 7.0+',
      difficulty: 'Nâng Cao',
    },
    {
      id: 'inversion-2',
      type: 'multiple-choice',
      prompt: 'Đảo ngữ với cấu trúc "Not until":',
      sentence: 'Not until the audit was completed _____ the financial irregularities were systemic.',
      options: ['the board realized', 'did the board realize', 'the board had realized', 'had the board realized'],
      correctAnswer: 'did the board realize',
      explanation: 'Cấu trúc: Not until + Clause/Time + Trợ động từ + S + V nguyên thể. Vế đảo ngữ nằm ở vế thứ hai: "did the board realize".',
      hint: 'Not until + mệnh đề 1 + đảo ngữ mệnh đề 2.',
      bandTarget: 'Band 7.0+',
      difficulty: 'Nâng Cao',
    },
  ],

  // 30. Cleft Sentences for Emphasis
  'cleft-sentences-emphasis': [
    {
      id: 'cleft-1',
      type: 'multiple-choice',
      prompt: 'Câu chẻ It-cleft nhấn mạnh đối tượng:',
      sentence: 'It was the relentless dedication of the front-line nurses _____ ensured patient safety during the crisis.',
      options: ['which', 'that', 'whom', 'whose'],
      correctAnswer: 'that',
      explanation: 'Cấu trúc It-cleft chuẩn: "It + is/was + thành phần nhấn mạnh + that + ...". Dù nhấn mạnh người hay vật, từ nối chuẩn mực nhất là "that".',
      hint: 'Cấu trúc câu chẻ: It is/was [X] that [Y].',
      bandTarget: 'Band 7.0+',
      difficulty: 'Nâng Cao',
    },
  ],

  // 31. Subjunctive Mood & Unreal Past
  'subjunctive-mood-unreal-past': [
    {
      id: 'subjunctive-1',
      type: 'multiple-choice',
      prompt: 'Thể giả định trong văn bản học thuật / hành chính:',
      sentence: 'The ethics committee insisted that the experimental protocol _____ submitted for re-evaluation.',
      options: ['is', 'was', 'be', 'should to be'],
      correctAnswer: 'be',
      explanation: 'Thể giả định thức (Subjunctive Mood) sau động từ "insist that": Động từ trong mệnh đề that luôn ở dạng nguyên thể không chia (bare infinitive) -> "be submitted".',
      hint: 'Insist that + S + (should) + V-nguyên thể.',
      bandTarget: 'Band 7.0+',
      difficulty: 'Nâng Cao',
    },
  ],

  // 32. Nominalisation & Academic Parallelism
  'nominalisation-academic-parallelism': [
    {
      id: 'nom-1',
      type: 'multiple-choice',
      prompt: 'Cấu trúc song hành (Parallelism) trong câu học thuật:',
      sentence: 'The educational reform aims at modernizing teaching methodologies, upgrading digital equipment, and _____ student engagement.',
      options: ['to cultivate', 'cultivating', 'cultivation of', 'cultivate'],
      correctAnswer: 'cultivating',
      explanation: 'Cấu trúc song hành: modernizing... upgrading... and cultivating... Tất cả đều phải cùng dạng V-ing theo sau giới từ "at".',
      hint: 'Giữ cấu trúc ngữ pháp tương đồng giữa các vế nối bằng "and".',
      bandTarget: 'Band 6.5+',
      difficulty: 'Nâng Cao',
    },
  ],
};

/**
 * 4 Bộ Đề Ôn Tập Tổng Hợp (Comprehensive Practice Exam Sets)
 */
export const COMPREHENSIVE_PRACTICE_SETS: ComprehensivePracticeSet[] = [
  {
    id: 'set-foundation-a1-a2',
    title: 'Đề 1: Tổng Ôn Nền Tảng Ngữ Pháp A1 - A2',
    tagline: 'Khảo sát và củng cố toàn diện động từ To Be, Hiện tại đơn, Quá khứ đơn và cấu trúc câu cơ bản',
    milestone: 'MỐC 1 (A1)',
    bandTarget: 'Band 3.0 - 4.5',
    durationMinutes: 15,
    totalQuestions: 6,
    description: 'Thích hợp cho học viên củng cố chắc chắn gốc ngữ pháp, tránh các lỗi sai về chia ngôi và mốc thời gian.',
    questions: [
      TOPIC_QUIZ_BANK['to-be-foundation']![0]!,
      TOPIC_QUIZ_BANK['present-simple-tense']![0]!,
      TOPIC_QUIZ_BANK['present-continuous-tense']![0]!,
      TOPIC_QUIZ_BANK['past-simple-tense']![0]!,
      TOPIC_QUIZ_BANK['future-simple-tense']![0]!,
      TOPIC_QUIZ_BANK['to-be-foundation']![2]!,
    ],
  },
  {
    id: 'set-all-tenses-mastery',
    title: 'Đề 2: Chuyên Đề 14 Thì & Trục Thời Gian Hoàn Chỉnh',
    tagline: 'Bài kiểm tra chuyên sâu 14 thì tiếng Anh từ đơn, tiếp diễn, hoàn thành đến tương lai trong quá khứ',
    milestone: 'TỔNG HỢP',
    bandTarget: 'Band 4.5 - 6.5',
    durationMinutes: 25,
    totalQuestions: 10,
    description: 'Bao quát toàn bộ 14 chuyên đề về các thì, phân biệt dứt điểm các cặp thì hay nhầm lẫn trong bài thi.',
    questions: [
      TOPIC_QUIZ_BANK['present-simple-tense']![2]!,
      TOPIC_QUIZ_BANK['present-continuous-tense']![1]!,
      TOPIC_QUIZ_BANK['present-perfect-tense']![0]!,
      TOPIC_QUIZ_BANK['present-perfect-continuous-tense']![0]!,
      TOPIC_QUIZ_BANK['past-continuous-tense']![0]!,
      TOPIC_QUIZ_BANK['past-perfect-tense']![0]!,
      TOPIC_QUIZ_BANK['past-perfect-continuous-tense']![0]!,
      TOPIC_QUIZ_BANK['future-continuous-tense']![0]!,
      TOPIC_QUIZ_BANK['future-perfect-tense']![0]!,
      TOPIC_QUIZ_BANK['future-in-the-past']![0]!,
    ],
  },
  {
    id: 'set-complex-structures-b1',
    title: 'Đề 3: Cấu Trúc Câu Phức, Mệnh Đề & Bị Động B1',
    tagline: 'Luyện tập các điểm ngữ pháp tạo bước ngoặt để nâng điểm IELTS Writing & Speaking',
    milestone: 'MỐC 3 (B1)',
    bandTarget: 'Band 5.5 - 6.5',
    durationMinutes: 20,
    totalQuestions: 8,
    description: 'Tập trung vào câu bị động học thuật, mệnh đề quan hệ rút gọn, câu điều kiện loại 2-3 và liên từ phụ thuộc.',
    questions: [
      TOPIC_QUIZ_BANK['subject-verb-agreement']![1]!,
      TOPIC_QUIZ_BANK['passive-voice']![0]!,
      TOPIC_QUIZ_BANK['first-second-conditional']![0]!,
      TOPIC_QUIZ_BANK['third-mixed-conditionals']![0]!,
      TOPIC_QUIZ_BANK['non-defining-relative-clauses']![0]!,
      TOPIC_QUIZ_BANK['reduced-relative-clauses']![0]!,
      TOPIC_QUIZ_BANK['subordinating-conjunctions-complex']![0]!,
      TOPIC_QUIZ_BANK['modal-verbs']![0]!,
    ],
  },
  {
    id: 'set-academic-advanced-b2',
    title: 'Đề 4: Đột Phá Ngữ Pháp Học Thuật Band 7.0+ IELTS',
    tagline: 'Chinh phục Đảo ngữ, Câu chẻ, Giả định thức và Danh từ hóa phục vụ bài thi Band cao',
    milestone: 'MỐC 4 (B2)',
    bandTarget: 'Band 7.0 - 8.0+',
    durationMinutes: 20,
    totalQuestions: 6,
    description: 'Dành riêng cho mục tiêu điểm số cao, biến đổi cấu trúc câu phong phú và chính xác tuyệt đối.',
    questions: [
      TOPIC_QUIZ_BANK['inversion-negative-limiting']![0]!,
      TOPIC_QUIZ_BANK['inversion-negative-limiting']![1]!,
      TOPIC_QUIZ_BANK['cleft-sentences-emphasis']![0]!,
      TOPIC_QUIZ_BANK['subjunctive-mood-unreal-past']![0]!,
      TOPIC_QUIZ_BANK['nominalisation-academic-parallelism']![0]!,
      TOPIC_QUIZ_BANK['twelve-tenses-timeline-matrix']![0]!,
    ],
  },
];

/**
 * Trợ thủ lấy danh sách câu hỏi cho 1 chuyên đề
 */
export function getQuizForTopic(topicId: string): GrammarQuizQuestion[] {
  return TOPIC_QUIZ_BANK[topicId] || [];
}
