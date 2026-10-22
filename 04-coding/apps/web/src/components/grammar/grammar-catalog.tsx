'use client';

import React, { useState } from 'react';
import { GrammarMasterclass, GrammarMasterclassProps } from './grammar-masterclass';

export interface GrammarTopicItem {
  id: string;
  milestone: 'MỐC 1 (A1)' | 'MỐC 2 (A2)' | 'MỐC 3 (B1)' | 'MỐC 4 (B2)';
  bandTarget: string;
  shortDesc: string;
  masterclass: GrammarMasterclassProps;
}

export const GRAMMAR_TOPICS_CATALOG: GrammarTopicItem[] = [
  {
    id: 'to-be-foundation',
    milestone: 'MỐC 1 (A1)',
    bandTarget: 'Band 0.0 - 3.0',
    shortDesc: 'Động từ To Be, đại từ nhân xưng & định danh thực thể trong tiếng Anh',
    masterclass: {
      title: 'Động từ To Be & Định Danh Thực Thể',
      tagline: 'Cột mốc đầu tiên để hình thành câu chuẩn ngữ pháp trong mọi tình huống giao tiếp',
      coreConcept:
        'To Be (am / is / are) đóng vai trò là "dấu bằng (=)" kết nối chủ ngữ với một danh từ (nghề nghiệp, tên gọi) hoặc tính từ (trạng thái, cảm xúc). Trong tiếng Anh, không bao giờ để câu trống động từ.',
      functions: [
        {
          title: '1. Định danh nghề nghiệp, tên tuổi & nguồn gốc',
          explanation: 'Dùng To Be khi giới thiệu bản thân hoặc người khác.',
          exampleEn: 'She is an architect from Hanoi.',
          exampleVi: 'Cô ấy là một kiến trúc sư đến từ Hà Nội.'
        },
        {
          title: '2. Miêu tả trạng thái, tính chất & cảm xúc',
          explanation: 'Kết hợp To Be với tính từ để mô tả đặc điểm của đối tượng.',
          exampleEn: 'The instructions are remarkably clear.',
          exampleVi: 'Những chỉ dẫn này đặc biệt rõ ràng.'
        },
        {
          title: '3. Định vị không gian và vị trí',
          explanation: 'Chỉ ra địa điểm mà chủ thể đang hiện diện.',
          exampleEn: 'The books are on the second shelf.',
          exampleVi: 'Những cuốn sách đang ở trên ngăn kệ thứ hai.'
        }
      ],
      tableHeaders: ['Đại từ', 'To Be (Khẳng định)', 'To Be (Phủ định)', 'Ví dụ thực tế'],
      tableRows: [
        ['I', 'am (\'m)', 'am not', 'I am ready to learn.'],
        ['He / She / It', 'is (\'s)', 'is not (isn\'t)', 'She is confident today.'],
        ['You / We / They', 'are (\'re)', 'are not (aren\'t)', 'They are at the library.']
      ],
      tableNote: 'Lưu ý: Không viết tắt "am not" thành một từ trong văn phong viết chuẩn.',
      structures: [
        {
          form: 'affirmative',
          label: 'Khẳng định (+)',
          formula: 'S + am / is / are + Noun / Adj',
          example: 'Lingora is designed for thoughtful learners.'
        },
        {
          form: 'negative',
          label: 'Phủ định (-)',
          formula: 'S + am / is / are + not + Noun / Adj',
          example: 'Making mistakes is not a sign of failure here.'
        },
        {
          form: 'interrogative',
          label: 'Nghi vấn (?)',
          formula: 'Am / Is / Are + S + Noun / Adj?',
          example: 'Are you comfortable with the learning pace?'
        }
      ],
      detectionClues: [
        'Câu không có động từ hành động (run, eat, learn...) mà chỉ có tính từ hoặc danh từ.',
        'Các từ chỉ trạng thái: happy, ready, patient, confident, calm.',
        'Các câu hỏi xác nhận danh tính hoặc tình trạng: "Who is that?", "Are you okay?".'
      ],
      sentenceBreakdowns: [
        {
          sentence: 'The calm learner is exceptionally resilient.',
          meaning: 'Người học điềm tĩnh thì kiên cường một cách khác biệt.',
          tokens: [
            { word: 'The calm learner', role: 'subject', label: 'Chủ ngữ [S]', explanation: 'Cụm danh từ chỉ người học điềm tĩnh' },
            { word: 'is', role: 'verb', label: 'Động từ [V]', explanation: 'Động từ to be số ít' },
            { word: 'exceptionally resilient', role: 'complement', label: 'Bổ ngữ [C]', explanation: 'Cụm tính từ miêu tả tính kiên cường' }
          ]
        },
        {
          sentence: 'Daily reflection is the secret of mastery.',
          meaning: 'Chiêm nghiệm mỗi ngày chính là bí quyết của sự tinh thông.',
          tokens: [
            { word: 'Daily reflection', role: 'subject', label: 'Chủ ngữ [S]', explanation: 'Sự chiêm nghiệm hàng ngày' },
            { word: 'is', role: 'verb', label: 'Động từ [V]', explanation: 'Động từ to be làm dấu nối' },
            { word: 'the secret of mastery', role: 'complement', label: 'Bổ ngữ [C]', explanation: 'Cụm danh từ bổ nghĩa bí quyết tinh thông' }
          ]
        }
      ]
    }
  },
  {
    id: 'past-simple-storytelling',
    milestone: 'MỐC 2 (A2)',
    bandTarget: 'Band 3.0 - 4.5',
    shortDesc: 'Thì Quá khứ đơn & Kỹ thuật thuật lại trải nghiệm cá nhân',
    masterclass: {
      title: 'Thì Quá Khứ Đơn (Past Simple & Storytelling)',
      tagline: 'Kỹ năng then chốt để kể lại chuỗi sự kiện, hành trình cá nhân và kinh nghiệm quá khứ',
      coreConcept:
        'Thì Quá khứ đơn dùng để diễn tả một hành động đã bắt đầu, đã kết thúc hoàn toàn tại một thời điểm xác định trong quá khứ và không còn tiếp diễn ở hiện tại.',
      functions: [
        {
          title: '1. Kể lại chuỗi sự kiện trong quá khứ',
          explanation: 'Các hành động xảy ra nối tiếp nhau trong một câu chuyện.',
          exampleEn: 'He woke up, checked his study goals, and smiled.',
          exampleVi: 'Anh ấy thức dậy, kiểm tra mục tiêu học tập, và mỉm cười.'
        },
        {
          title: '2. Diễn tả một thói quen cũ đã chấm dứt',
          explanation: 'Một trạng thái hoặc hoạt động thường xuyên trong quá khứ.',
          exampleEn: 'We practiced speaking every single evening last month.',
          exampleVi: 'Chúng tôi đã luyện nói vào mỗi buổi tối tháng trước.'
        }
      ],
      tableHeaders: ['Dạng động từ', 'Quy tắc / Trợ động từ', 'Dạng phủ định', 'Ví dụ'],
      tableRows: [
        ['Có quy tắc (Regular)', 'Thêm -ed (played, waited)', 'did not + V-bare', 'She walked to school yesterday.'],
        ['Bất quy tắc (Irregular)', 'Bảng V2 (went, saw, took)', 'did not + V-bare', 'They went abroad in 2024.'],
        ['Động từ To Be', 'was (I/He/She/It), were (You/We/They)', 'wasn\'t / weren\'t', 'He was very patient.']
      ],
      tableNote: 'Khi đã có trợ động từ "did", động từ chính BẮT BUỘC trở về nguyên mẫu (V-bare).',
      structures: [
        {
          form: 'affirmative',
          label: 'Khẳng định (+)',
          formula: 'S + V-ed / V2',
          example: 'I completed my milestone test yesterday.'
        },
        {
          form: 'negative',
          label: 'Phủ định (-)',
          formula: 'S + did not (didn\'t) + V-bare',
          example: 'She did not rush through the practice session.'
        },
        {
          form: 'interrogative',
          label: 'Nghi vấn (?)',
          formula: 'Did + S + V-bare?',
          example: 'Did you review your pronunciation before recording?'
        }
      ],
      detectionClues: [
        'Trạng từ thời gian quá khứ: yesterday, last night, last week, ago (two days ago).',
        'Các mốc năm đã qua: in 2020, in the 19th century, when I was a child.'
      ],
      sentenceBreakdowns: [
        {
          sentence: 'The dedicated student discovered the power of quiet focus.',
          meaning: 'Người sinh viên tận tâm đã khám phá ra sức mạnh của sự tập trung yên ả.',
          tokens: [
            { word: 'The dedicated student', role: 'subject', label: 'Chủ ngữ [S]', explanation: 'Sinh viên tận tâm' },
            { word: 'discovered', role: 'verb', label: 'Động từ [V2]', explanation: 'Động từ quá khứ có quy tắc' },
            { word: 'the power of quiet focus', role: 'object', label: 'Tân ngữ [O]', explanation: 'Sức mạnh của sự tập trung' }
          ]
        }
      ]
    }
  },
  {
    id: 'passive-voice-b1',
    milestone: 'MỐC 3 (B1)',
    bandTarget: 'Band 4.5 - 5.5',
    shortDesc: 'Câu bị động (Passive Voice) nâng tầm viết luận khách quan',
    masterclass: {
      title: 'Câu Bị Động & Giọng Văn Học Thuật Khách Quan',
      tagline: 'Vũ khí tối quan trọng cho IELTS Writing Task 1 & Task 2',
      coreConcept:
        'Câu bị động chuyển trọng tâm từ "người thực hiện hành động" sang "đối tượng chịu tác động" hoặc "kết quả của hành động". Đây là phong cách viết khách quan, trang trọng của giới học thuật.',
      functions: [
        {
          title: '1. Nhấn mạnh vào kết quả hoặc đối tượng chịu tác động',
          explanation: 'Khi chủ thể thực hiện hành động không quan trọng hoặc ai cũng biết.',
          exampleEn: 'Over 10,000 data points were analyzed systematically.',
          exampleVi: 'Hơn 10.000 điểm dữ liệu đã được phân tích một cách có hệ thống.'
        },
        {
          title: '2. Miêu tả quy trình sản xuất hoặc biểu đồ (Task 1)',
          explanation: 'Mô tả các bước công nghệ hoặc dây chuyền tự nhiên.',
          exampleEn: 'The raw materials are sorted before being processed.',
          exampleVi: 'Các nguyên liệu thô được phân loại trước khi đưa vào chế biến.'
        }
      ],
      tableHeaders: ['Thì ngữ pháp', 'Cấu trúc Bị động', 'Ví dụ câu'],
      tableRows: [
        ['Hiện tại đơn', 'am / is / are + V3/ed', 'English is spoken worldwide.'],
        ['Quá khứ đơn', 'was / were + V3/ed', 'The report was submitted on time.'],
        ['Hiện tại hoàn thành', 'have / has been + V3/ed', 'The policy has been updated recently.']
      ],
      structures: [
        {
          form: 'affirmative',
          label: 'Khẳng định (+)',
          formula: 'S + Be + V3/ed (+ by Agent)',
          example: 'Valuable feedback was provided gently by the mentor.'
        },
        {
          form: 'negative',
          label: 'Phủ định (-)',
          formula: 'S + Be + not + V3/ed',
          example: 'Sensitive learner identities are not shared publicly.'
        },
        {
          form: 'interrogative',
          label: 'Nghi vấn (?)',
          formula: 'Be + S + V3/ed?',
          example: 'Was the recording reviewed before submission?'
        }
      ],
      detectionClues: [
        'Sự xuất hiện của cụm "by + tác nhân" (by researchers, by the committee).',
        'Cấu trúc cố định Be + Động từ phân từ 2 (V3/V-ed).',
        'Chủ ngữ thường là sự vật, dữ liệu, đồ vật, hiện tượng không tự hành động được.'
      ],
      sentenceBreakdowns: [
        {
          sentence: 'Crucial learning evidence was recorded with full user privacy.',
          meaning: 'Bằng chứng học tập cốt lõi đã được ghi nhận với quyền riêng tư trọn vẹn.',
          tokens: [
            { word: 'Crucial learning evidence', role: 'subject', label: 'Chủ ngữ [S]', explanation: 'Bằng chứng học tập chịu tác động' },
            { word: 'was recorded', role: 'verb', label: 'Động từ Bị Động', explanation: 'was + V3/ed' },
            { word: 'with full user privacy', role: 'adverb', label: 'Trạng từ phương thức', explanation: 'Với đầy đủ quyền riêng tư' }
          ]
        }
      ]
    }
  },
  {
    id: 'conditionals-critical',
    milestone: 'MỐC 4 (B2)',
    bandTarget: 'Band 5.5 - 6.5+',
    shortDesc: 'Câu điều kiện hỗn hợp & Giả định luận chứng IELTS 6.5+',
    masterclass: {
      title: 'Câu Điều Kiện Nâng Cao & Tư Duy Luận Chứng',
      tagline: 'Lập luận đa chiều, dự báo kịch bản và đào sâu nguyên nhân kết quả',
      coreConcept:
        'Câu điều kiện kết nối tiền đề (Mệnh đề If) và hệ quả (Mệnh đề chính). Trong IELTS Writing & Speaking 6.5+, câu điều kiện giúp bài nói thể hiện tư duy giả định phức hợp sắc sảo.',
      functions: [
        {
          title: '1. Đưa ra giải pháp chính sách (Condition 1 & 2)',
          explanation: 'Dự báo nếu chính quyền hành động thì kết quả tương lai sẽ ra sao.',
          exampleEn: 'If governments invest in renewable energy, emissions will decrease.',
          exampleVi: 'Nếu các chính phủ đầu tư vào năng lượng tái tạo, lượng khí thải sẽ giảm.'
        },
        {
          title: '2. Phản biện quá khứ & Giả định ngược thực tế (Condition 3)',
          explanation: 'Nhìn nhận lại nếu một tiền đề thay đổi trong quá khứ.',
          exampleEn: 'Had the early warning been issued, the impact would have been minimized.',
          exampleVi: 'Nếu cảnh báo sớm được đưa ra, tác động hẳn đã được giảm thiểu tối đa.'
        }
      ],
      tableHeaders: ['Loại điều kiện', 'Mệnh đề If', 'Mệnh đề chính', 'Ý nghĩa'],
      tableRows: [
        ['Loại 1 (Thực tế)', 'If + Hiện tại đơn', 'S + will + V-bare', 'Có thể xảy ra ở hiện tại/tương lai'],
        ['Loại 2 (Giả định nay)', 'If + Quá khứ đơn (were)', 'S + would + V-bare', 'Trái với thực tế ở hiện tại'],
        ['Loại 3 (Giả định xưa)', 'If + Had + V3/ed', 'S + would have + V3/ed', 'Trái với sự thật trong quá khứ']
      ],
      structures: [
        {
          form: 'affirmative',
          label: 'Điều kiện loại 2 (+)',
          formula: 'If + S + V2/were, S + would + V-bare',
          example: 'If every learner had access to gentle guidance, fluency would come naturally.'
        },
        {
          form: 'negative',
          label: 'Phủ định (-)',
          formula: 'If + S + did not + V-bare, S + would not + V-bare',
          example: 'If we did not isolate pronunciation first, natural rhythm would not emerge.'
        },
        {
          form: 'interrogative',
          label: 'Nghi vấn (?)',
          formula: 'What would happen if + S + V2/were?',
          example: 'What would you prioritize if you prepared for IELTS in 6 months?'
        }
      ],
      detectionClues: [
        'Từ nối điều kiện: If, unless (if not), provided that, as long as.',
        'Động từ khiếm khuyết trong mệnh đề chính: would, could, might.'
      ],
      sentenceBreakdowns: [
        {
          sentence: 'If candidates master phonemic awareness, their speech will resonate effortlessly.',
          meaning: 'Nếu thí sinh làm chủ nhận thức âm vị, lời nói của họ sẽ ngân vang tự nhiên không gắng gượng.',
          tokens: [
            { word: 'If candidates master phonemic awareness', role: 'adverb', label: 'Mệnh đề If [Adv]', explanation: 'Mệnh đề điều kiện chỉ tiền đề' },
            { word: 'their speech', role: 'subject', label: 'Chủ ngữ chính [S]', explanation: 'Giọng nói của họ' },
            { word: 'will resonate', role: 'verb', label: 'Động từ chính [V]', explanation: 'will + V-bare ngân vang' },
            { word: 'effortlessly', role: 'adverb', label: 'Trạng từ [Adv]', explanation: 'Một cách tự nhiên không gắng gượng' }
          ]
        }
      ]
    }
  }
];

export function GrammarCatalog() {
  const [activeTopicId, setActiveTopicId] = useState<string>('to-be-foundation');
  const [selectedMilestone, setSelectedMilestone] = useState<string>('all');

  const filteredTopics = GRAMMAR_TOPICS_CATALOG.filter((t) => {
    if (selectedMilestone === 'all') return true;
    return t.milestone.includes(selectedMilestone);
  });

  const activeTopic =
    GRAMMAR_TOPICS_CATALOG.find((t) => t.id === activeTopicId) ?? GRAMMAR_TOPICS_CATALOG[0];

  return (
    <div className="space-y-10">
      {/* Topic Selector Tabs */}
      <section className="card p-6 bg-white rounded-3xl border border-[#e8e1ec] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#34303d] tracking-tight">
              Thư Viện Masterclass Ngữ Pháp ForumFlash
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Học theo cấu trúc 6 phần: Bản chất ➔ Chức năng ➔ Chia ngôi ➔ 3 Thể ➔ Dấu hiệu ➔ Mổ xẻ câu.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedMilestone('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedMilestone === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setSelectedMilestone('A1')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedMilestone === 'A1'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              A1 (0-3.0)
            </button>
            <button
              onClick={() => setSelectedMilestone('A2')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedMilestone === 'A2'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              A2 (3.0-4.5)
            </button>
            <button
              onClick={() => setSelectedMilestone('B1')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedMilestone === 'B1'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              B1 (4.5-5.5)
            </button>
            <button
              onClick={() => setSelectedMilestone('B2')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedMilestone === 'B2'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              B2 (5.5-6.5+)
            </button>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-6">
          {filteredTopics.map((topic) => {
            const isActive = topic.id === activeTopicId;
            return (
              <button
                key={topic.id}
                onClick={() => setActiveTopicId(topic.id)}
                className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-slate-200/80 bg-white hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-indigo-700">
                      {topic.milestone}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {topic.bandTarget}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-800 leading-snug line-clamp-2">
                    {topic.masterclass.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {topic.shortDesc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100/80 flex items-center justify-between text-xs font-bold">
                  <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>
                    {isActive ? 'Đang đọc' : 'Nhấp để xem'}
                  </span>
                  <span className="text-indigo-500">→</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected Masterclass Article */}
      {activeTopic && (
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              NỘI DUNG MASTERCLASS ĐANG XEM
            </span>
            <span className="text-xs text-indigo-600 font-semibold">
              Chuẩn 6 phần ForumFlash đầy đủ
            </span>
          </div>
          <GrammarMasterclass {...activeTopic.masterclass} />
        </section>
      )}
    </div>
  );
}
