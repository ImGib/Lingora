'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { GrammarMasterclass, type GrammarMasterclassProps } from './grammar-masterclass';
import { COMPREHENSIVE_PRACTICE_SETS, type ComprehensivePracticeSet } from './grammar-quiz-bank';
import { GrammarPracticeCard } from './grammar-practice-card';
import { Badge, Input } from '@/components/ui';

export interface GrammarTopicItem {
  id: string;
  milestone: 'MỐC 1 (A1)' | 'MỐC 2 (A2)' | 'MỐC 3 (B1)' | 'MỐC 4 (B2)';
  category: 'Các Thì' | 'Cấu Trúc Câu' | 'Mệnh Đề & Liên Từ' | 'Học Thuật Nâng Cao';
  bandTarget: string;
  shortDesc: string;
  masterclass: GrammarMasterclassProps;
}

export const GRAMMAR_TOPICS_CATALOG: GrammarTopicItem[] = [
  {
    "id": "to-be-foundation",
    "milestone": "MỐC 1 (A1)",
    "category": "Cấu Trúc Câu",
    "bandTarget": "Band 0.0 - 3.0",
    "shortDesc": "Động từ To Be, đại từ nhân xưng & định danh thực thể trong tiếng Anh",
    "masterclass": {
      "title": "Động từ To Be & Định Danh Thực Thể",
      "tagline": "Cột mốc đầu tiên để hình thành câu chuẩn ngữ pháp trong mọi tình huống giao tiếp",
      "coreConcept": "To Be (am / is / are) đóng vai trò là \"dấu bằng (=)\" kết nối chủ ngữ với một danh từ (nghề nghiệp, tên gọi) hoặc tính từ (trạng thái, cảm xúc). Trong tiếng Anh, không bao giờ để câu trống động từ.",
      "functions": [
        {
          "title": "1. Định danh nghề nghiệp, tên tuổi & nguồn gốc",
          "explanation": "Dùng To Be khi giới thiệu bản thân hoặc người khác.",
          "exampleEn": "She is an architect from Hanoi.",
          "exampleVi": "Cô ấy là một kiến trúc sư đến từ Hà Nội."
        },
        {
          "title": "2. Miêu tả trạng thái, tính chất & cảm xúc",
          "explanation": "Kết hợp To Be với tính từ để mô tả đặc điểm của đối tượng.",
          "exampleEn": "The instructions are remarkably clear.",
          "exampleVi": "Những chỉ dẫn này đặc biệt rõ ràng."
        },
        {
          "title": "3. Định vị không gian và vị trí",
          "explanation": "Chỉ ra địa điểm mà chủ thể đang hiện diện.",
          "exampleEn": "The books are on the second shelf.",
          "exampleVi": "Những cuốn sách đang ở trên ngăn kệ thứ hai."
        }
      ],
      "tableHeaders": [
        "Đại từ",
        "To Be (Khẳng định)",
        "To Be (Phủ định)",
        "Ví dụ thực tế"
      ],
      "tableRows": [
        [
          "I",
          "am ('m)",
          "am not",
          "I am ready to learn."
        ],
        [
          "He / She / It",
          "is ('s)",
          "is not (isn't)",
          "She is confident today."
        ],
        [
          "You / We / They",
          "are ('re)",
          "are not (aren't)",
          "They are at the library."
        ]
      ],
      "tableNote": "Lưu ý: Không viết tắt \"am not\" thành một từ trong văn phong viết chuẩn.",
      "structures": [
        {
          "form": "affirmative",
          "label": "Khẳng định (+)",
          "formula": "S + am / is / are + Noun / Adj",
          "example": "Lingora is designed for thoughtful learners."
        },
        {
          "form": "negative",
          "label": "Phủ định (-)",
          "formula": "S + am / is / are + not + Noun / Adj",
          "example": "Making mistakes is not a sign of failure here."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "Am / Is / Are + S + Noun / Adj?",
          "example": "Are you comfortable with the learning pace?"
        }
      ],
      "detectionClues": [
        "Câu không có động từ hành động (run, eat, learn...) mà chỉ có tính từ hoặc danh từ.",
        "Các từ chỉ trạng thái: happy, ready, patient, confident, calm.",
        "Các câu hỏi xác nhận danh tính hoặc tình trạng: \"Who is that?\", \"Are you okay?\"."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "The calm learner is exceptionally resilient.",
          "meaning": "Người học điềm tĩnh thì kiên cường một cách khác biệt.",
          "tokens": [
            {
              "word": "The calm learner",
              "role": "subject",
              "label": "Chủ ngữ [S]",
              "explanation": "Cụm danh từ chỉ người học điềm tĩnh"
            },
            {
              "word": "is",
              "role": "verb",
              "label": "Động từ [V]",
              "explanation": "Động từ to be số ít"
            },
            {
              "word": "exceptionally resilient",
              "role": "complement",
              "label": "Bổ ngữ [C]",
              "explanation": "Cụm tính từ miêu tả tính kiên cường"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "present-simple-routines",
    "milestone": "MỐC 1 (A1)",
    "category": "Các Thì",
    "bandTarget": "Band 0.0 - 3.0",
    "shortDesc": "Thì Hiện tại đơn: Thói quen sinh hoạt, chân lý hiển nhiên và thời gian biểu",
    "masterclass": {
      "title": "Thì Hiện Tại Đơn (Present Simple & Daily Habits)",
      "tagline": "Nền tảng diễn đạt thói quen hàng ngày, chân lý hiển nhiên và thời gian biểu",
      "coreConcept": "Thì Hiện tại đơn mô tả các hành động mang tính quy luật, lặp đi lặp lại như một thói quen hoặc chân lý khoa học bất biến. Quy tắc cốt lõi là sự phối hợp chủ ngữ - động từ: thêm đuôi -s/-es khi chủ ngữ là ngôi thứ ba số ít (He/She/It).",
      "functions": [
        {
          "title": "1. Thói quen và hành động lặp lại hàng ngày",
          "explanation": "Diễn tả những hoạt động quen thuộc diễn ra đều đặn theo chu kỳ.",
          "exampleEn": "I practice speaking English for 30 minutes every morning.",
          "exampleVi": "Tôi luyện nói tiếng Anh 30 phút vào mỗi buổi sáng."
        },
        {
          "title": "2. Chân lý khoa học & Quy luật tự nhiên",
          "explanation": "Những sự thật khách quan luôn đúng trong mọi thời đại.",
          "exampleEn": "Water boils at 100 degrees Celsius.",
          "exampleVi": "Nước sôi ở nhiệt độ 100 độ C."
        },
        {
          "title": "3. Lịch trình, thời khóa biểu cố định",
          "explanation": "Các sự kiện diễn ra theo giờ cố định của phương tiện công cộng hay lớp học.",
          "exampleEn": "The evening webinar starts at 8:00 PM.",
          "exampleVi": "Buổi hội thảo trực tuyến buổi tối bắt đầu lúc 8 giờ tối."
        }
      ],
      "tableHeaders": [
        "Chủ ngữ",
        "Động từ khẳng định",
        "Trợ động từ phủ định",
        "Quy tắc chia"
      ],
      "tableRows": [
        [
          "I / You / We / They",
          "V-bare (work, study)",
          "do not (don't) + V-bare",
          "Giữ nguyên động từ nguyên mẫu"
        ],
        [
          "He / She / It",
          "V-s / V-es (works, watches)",
          "does not (doesn't) + V-bare",
          "Thêm -s hoặc -es (đuôi o, s, z, ch, x, sh)"
        ]
      ],
      "tableNote": "Khi câu đã có trợ động từ \"does/doesn't\", động từ chính LUÔN trở về dạng nguyên mẫu (V-bare).",
      "structures": [
        {
          "form": "affirmative",
          "label": "Khẳng định (+)",
          "formula": "S + V(s/es) + Object",
          "example": "Consistent practice builds undeniable speaking confidence."
        },
        {
          "form": "negative",
          "label": "Phủ định (-)",
          "formula": "S + do / does + not + V-bare + Object",
          "example": "He does not skip pronunciation drills on weekdays."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "Do / Does + S + V-bare + Object?",
          "example": "Do you record your practice audio every single day?"
        }
      ],
      "detectionClues": [
        "Trạng từ chỉ tần suất: always, usually, often, sometimes, rarely, never.",
        "Cụm từ thời gian lặp lại: every day, every week, on Mondays, once a month.",
        "Các động từ chỉ sở thích hoặc nhận thức: like, love, believe, know, understand."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "Consistent practice builds undeniable speaking confidence.",
          "meaning": "Luyện tập kiên định xây dựng sự tự tin nói không thể chối từ.",
          "tokens": [
            {
              "word": "Consistent practice",
              "role": "subject",
              "label": "Chủ ngữ [S]",
              "explanation": "Cụm danh từ số ít"
            },
            {
              "word": "builds",
              "role": "verb",
              "label": "Động từ [V-s]",
              "explanation": "Hiện tại đơn chia theo ngôi số ít"
            },
            {
              "word": "undeniable speaking confidence",
              "role": "object",
              "label": "Tân ngữ [O]",
              "explanation": "Sự tự tin nói"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "present-continuous-action",
    "milestone": "MỐC 1 (A1)",
    "category": "Các Thì",
    "bandTarget": "Band 0.0 - 3.0",
    "shortDesc": "Thì Hiện tại tiếp diễn: Hành động đang xảy ra tại thời điểm nói và xu thế tạm thời",
    "masterclass": {
      "title": "Thì Hiện Tại Tiếp Diễn (Present Continuous)",
      "tagline": "Mô tả chuyển động đang diễn ra ngay lúc nói và các xu thế phát triển tạm thời",
      "coreConcept": "Thì Hiện tại tiếp diễn diễn tả sự vận động đang diễn ra ngay tại thời điểm nói, hoặc một hành động tạm thời kéo dài xung quanh hiện tại. Cấu trúc luôn gồm 2 thành phần bất khả phân: Trợ động từ Be (am/is/are) và Động từ thêm đuôi -ing (V-ing).",
      "functions": [
        {
          "title": "1. Hành động đang xảy ra ngay khoảnh khắc nói",
          "explanation": "Sự việc người nói và người nghe có thể trực tiếp quan sát thấy.",
          "exampleEn": "Listen! The speaker is articulating the final consonants.",
          "exampleVi": "Hãy lắng nghe! Diễn giả đang phát âm rõ các phụ âm cuối."
        },
        {
          "title": "2. Tình huống tạm thời đang phát triển",
          "explanation": "Một quá trình đang diễn ra xung quanh thời điểm nói dù không nhất thiết ngay lúc này.",
          "exampleEn": "I am taking an intensive phonetics course this month.",
          "exampleVi": "Tôi đang tham gia một khóa học ngữ âm tăng cường trong tháng này."
        }
      ],
      "tableHeaders": [
        "Chủ ngữ",
        "Dạng Be tương ứng",
        "Động từ chính (V-ing)",
        "Ví dụ"
      ],
      "tableRows": [
        [
          "I",
          "am ('m)",
          "studying, speaking",
          "I am listening to the native sample."
        ],
        [
          "He / She / It",
          "is ('s)",
          "practicing, recording",
          "She is adjusting her tongue position."
        ],
        [
          "You / We / They",
          "are ('re)",
          "improving, collaborating",
          "They are reviewing their error logs."
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Khẳng định (+)",
          "formula": "S + am / is / are + V-ing",
          "example": "The student is making remarkable progress in pronunciation."
        },
        {
          "form": "negative",
          "label": "Phủ định (-)",
          "formula": "S + am / is / are + not + V-ing",
          "example": "They are not guessing words without phonetic transcription."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "Am / Is / Are + S + V-ing?",
          "example": "Are you listening closely to the pitch variation?"
        }
      ],
      "detectionClues": [
        "Trạng từ chỉ thời điểm: now, right now, at the moment, at present, currently.",
        "Câu mệnh lệnh thu hút chú ý: Look!, Listen!, Watch out!, Be quiet!."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "The candidate is articulating each consonant with great clarity.",
          "meaning": "Thí sinh đang phát âm từng phụ âm với độ rõ ràng vượt trội.",
          "tokens": [
            {
              "word": "The candidate",
              "role": "subject",
              "label": "Chủ ngữ [S]",
              "explanation": "Thí sinh"
            },
            {
              "word": "is articulating",
              "role": "verb",
              "label": "Động từ [Be + V-ing]",
              "explanation": "Hiện tại tiếp diễn"
            },
            {
              "word": "each consonant",
              "role": "object",
              "label": "Tân ngữ [O]",
              "explanation": "Từng phụ âm"
            },
            {
              "word": "with great clarity",
              "role": "adverb",
              "label": "Trạng từ [Adv]",
              "explanation": "Rõ ràng"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "nouns-articles-quantifiers",
    "milestone": "MỐC 1 (A1)",
    "category": "Cấu Trúc Câu",
    "bandTarget": "Band 0.0 - 3.0",
    "shortDesc": "Danh từ đếm được, không đếm được, Mạo từ A/An/The & Lượng từ",
    "masterclass": {
      "title": "Danh Từ, Mạo Từ & Lượng Từ Căn Bản",
      "tagline": "Phân loại thực thể chính xác, sử dụng đúng A/An/The và lượng từ số lượng",
      "coreConcept": "Danh từ trong tiếng Anh chia thành Đếm được (Countable - có số ít và số nhiều) và Không đếm được (Uncountable - không thêm -s, không đi trực tiếp với A/An). Mạo từ \"The\" dùng cho đối tượng đã xác định, còn \"A/An\" dùng cho đối tượng mới nhắc lần đầu.",
      "functions": [
        {
          "title": "1. Phân biệt A và An theo phiên âm mở đầu",
          "explanation": "Dùng \"An\" trước danh từ phát âm bắt đầu bằng nguyên âm âm thanh (an hour, an apple), không phải chữ cái viết.",
          "exampleEn": "She spent an hour listening to phonetic pairs.",
          "exampleVi": "Cô ấy dành một tiếng đồng hồ để nghe các cặp âm."
        },
        {
          "title": "2. Sử dụng The cho đối tượng duy nhất hoặc đã xác định",
          "explanation": "Khi cả người nói và người nghe đều biết rõ đối tượng nào.",
          "exampleEn": "The sun rises in the east.",
          "exampleVi": "Mặt trời mọc ở hướng đông."
        },
        {
          "title": "3. Định lượng với Much, Many, Few, Little",
          "explanation": "Many/Few đi với danh từ đếm được; Much/Little đi với danh từ không đếm được.",
          "exampleEn": "She gave me much encouragement and few distractions.",
          "exampleVi": "Cô ấy cho tôi nhiều lời động viên và rất ít sự xao nhãng."
        }
      ],
      "tableHeaders": [
        "Loại lượng từ",
        "Đi với danh từ đếm được",
        "Đi với danh từ không đếm được",
        "Ý nghĩa"
      ],
      "tableRows": [
        [
          "Số lượng nhiều",
          "Many / A lot of (books)",
          "Much / A lot of (water)",
          "Nhiều"
        ],
        [
          "Số lượng ít (tích cực)",
          "A few (a few friends)",
          "A little (a little time)",
          "Một vài, có một chút đủ dùng"
        ],
        [
          "Số lượng ít (tiêu cực)",
          "Few (few mistakes)",
          "Little (little patience)",
          "Hầu như không có, rất hiếm"
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Khẳng định (+)",
          "formula": "A / An / The + Adjective + Noun",
          "example": "An articulate speaker commands immediate respect."
        },
        {
          "form": "negative",
          "label": "Phủ định (-)",
          "formula": "There are not many errors in this transcription.",
          "example": "There is not much noise in this acoustic studio."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "How many [Countable Noun] / How much [Uncountable Noun] + ... ?",
          "example": "How many phonemes did you review today?"
        }
      ],
      "detectionClues": [
        "Danh từ không đếm được phổ biến: information, advice, equipment, furniture, homework, bread, water, knowledge.",
        "Mạo từ \"The\" trước nhạc cụ (the piano), thứ tự (the first), so sánh nhất (the best)."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "The dedicated mentor shared invaluable advice with the students.",
          "meaning": "Người hướng dẫn tận tâm đã chia sẻ lời khuyên vô giá với các sinh viên.",
          "tokens": [
            {
              "word": "The dedicated mentor",
              "role": "subject",
              "label": "Chủ ngữ [The + Adj + N]",
              "explanation": "Đối tượng đã xác định"
            },
            {
              "word": "shared",
              "role": "verb",
              "label": "Động từ [V]",
              "explanation": "Chia sẻ"
            },
            {
              "word": "invaluable advice",
              "role": "object",
              "label": "Tân ngữ [Uncountable N]",
              "explanation": "Lời khuyên (không đếm được)"
            },
            {
              "word": "with the students",
              "role": "adverb",
              "label": "Cụm giới từ [Prep + N]",
              "explanation": "Với các sinh viên"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "pronouns-possessives",
    "milestone": "MỐC 1 (A1)",
    "category": "Cấu Trúc Câu",
    "bandTarget": "Band 0.0 - 3.0",
    "shortDesc": "Đại từ nhân xưng, Đại từ tân ngữ & Tính từ / Đại từ sở hữu",
    "masterclass": {
      "title": "Đại Từ Nhân Xưng & Sở Hữu (Pronouns & Possessives)",
      "tagline": "Tránh lặp từ, xác định chủ quyền và làm chủ hệ thống đại từ tiếng Anh",
      "coreConcept": "Đại từ thay thế cho danh từ để câu văn không bị trùng lặp. Cần phân biệt rõ: Đại từ chủ ngữ (đứng đầu câu thực hiện hành động), Đại từ tân ngữ (đứng sau động từ nhận tác động), Tính từ sở hữu (phải có danh từ đi kèm: my book) và Đại từ sở hữu (đứng độc lập: mine).",
      "functions": [
        {
          "title": "1. Thay thế chủ ngữ và tân ngữ",
          "explanation": "Dùng He/She/They thay cho tên riêng và Him/Her/Them sau động từ/giới từ.",
          "exampleEn": "The coach listened to him patiently.",
          "exampleVi": "Huấn luyện viên lắng nghe anh ấy một cách kiên nhẫn."
        },
        {
          "title": "2. Phân biệt Tính từ sở hữu vs Đại từ sở hữu",
          "explanation": "My/Your/Their + Noun; còn Mine/Yours/Theirs đứng một mình.",
          "exampleEn": "This microphone is mine; your microphone is on the table.",
          "exampleVi": "Chiếc micro này là của tôi; micro của bạn ở trên bàn."
        }
      ],
      "tableHeaders": [
        "Đại từ chủ ngữ",
        "Đại từ tân ngữ",
        "Tính từ sở hữu (+ Noun)",
        "Đại từ sở hữu (độc lập)"
      ],
      "tableRows": [
        [
          "I",
          "me",
          "my (my voice)",
          "mine"
        ],
        [
          "You",
          "you",
          "your (your accent)",
          "yours"
        ],
        [
          "He / She / It",
          "him / her / it",
          "his / her / its",
          "his / hers / -"
        ],
        [
          "We / They",
          "us / them",
          "our / their",
          "ours / theirs"
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Tính từ sở hữu (+)",
          "formula": "Subject + Verb + Possessive Adj + Noun",
          "example": "Every learner values their dedicated practice time."
        },
        {
          "form": "negative",
          "label": "Phủ định (-)",
          "formula": "This recorded sample is not mine.",
          "example": "She did not bring her headphones today."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "Whose + Noun + is this? / Is this yours?",
          "example": "Whose pronunciation guide is on the desk?"
        }
      ],
      "detectionClues": [
        "Sau giới từ (to, for, with, about) LUÔN dùng đại từ tân ngữ (me, him, her, us, them).",
        "Không bao giờ viết \"its'\" hay nhầm lẫn \"its\" (sở hữu) với \"it's\" (viết tắt của it is)."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "She compared her recording with theirs.",
          "meaning": "Cô ấy đã so sánh bản ghi âm của mình với bản của họ.",
          "tokens": [
            {
              "word": "She",
              "role": "subject",
              "label": "Đại từ chủ ngữ [S]",
              "explanation": "Ngôi thứ 3 số ít"
            },
            {
              "word": "compared",
              "role": "verb",
              "label": "Động từ [V]",
              "explanation": "So sánh"
            },
            {
              "word": "her recording",
              "role": "object",
              "label": "Tính từ sở hữu + Danh từ",
              "explanation": "Bản thu của cô ấy"
            },
            {
              "word": "with theirs",
              "role": "adverb",
              "label": "Giới từ + Đại từ sở hữu",
              "explanation": "Với bản của họ"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "prepositions-place-time",
    "milestone": "MỐC 1 (A1)",
    "category": "Cấu Trúc Câu",
    "bandTarget": "Band 0.0 - 3.0",
    "shortDesc": "Giới từ thời gian và không gian: In, On, At & Quy tắc tam giác kích thước",
    "masterclass": {
      "title": "Giới Từ Thời Gian & Nơi Chốn: In, On, At",
      "tagline": "Quy tắc hình phễu kinh điển từ khái quát rộng lớn đến chính xác cụ thể",
      "coreConcept": "Quy tắc tam giác ngược: \"IN\" dùng cho không gian lớn và khoảng thời gian dài (năm, thế kỷ, đất nước, thành phố). \"ON\" dùng cho bề mặt và ngày cụ thể (thứ trong tuần, ngày tháng, trên đường phố). \"AT\" dùng cho điểm chính xác và thời khắc cụ thể (giờ phút, địa chỉ số nhà, tại một địa điểm xác định).",
      "functions": [
        {
          "title": "1. Thời gian: IN (tháng, năm) -> ON (ngày, thứ) -> AT (giờ)",
          "explanation": "In 2026, in December -> On Monday, on my birthday -> At 8:30 AM, at midnight.",
          "exampleEn": "The workshop begins at 9:00 AM on Friday in October.",
          "exampleVi": "Hội thảo bắt đầu lúc 9:00 sáng vào thứ Sáu trong tháng Mười."
        },
        {
          "title": "2. Nơi chốn: IN (quốc gia, phòng kín) -> ON (mặt phẳng, đường) -> AT (địa chỉ, điểm đến)",
          "explanation": "In Vietnam, in the room -> On Oxford Street, on the table -> At 123 Main Street, at the station.",
          "exampleEn": "We met at the library on Second Avenue in Da Nang.",
          "exampleVi": "Chúng tôi gặp nhau tại thư viện trên đại lộ Hai ở Đà Nẵng."
        }
      ],
      "tableHeaders": [
        "Giới từ",
        "Về mặt Thời Gian",
        "Về mặt Nơi Chốn",
        "Ví dụ"
      ],
      "tableRows": [
        [
          "IN (Lớn nhất / Khái quát)",
          "Thế kỷ, năm, mùa, tháng, các buổi trong ngày",
          "Quốc gia, thành phố, không gian kín 3D",
          "In 2026, in Hanoi"
        ],
        [
          "ON (Vừa phải / Cụ thể hơn)",
          "Thứ trong tuần, ngày tháng cụ thể, ngày lễ",
          "Bề mặt phẳng, tầng nhà, tên đường, phương tiện công cộng",
          "On Monday, on the bus"
        ],
        [
          "AT (Chính xác nhất / Điểm mốc)",
          "Giờ cụ thể, thời điểm đặc biệt (at noon, at night)",
          "Số nhà cụ thể, địa điểm chức năng",
          "At 7:00 PM, at home"
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Khẳng định (+)",
          "formula": "S + V + Preposition (In / On / At) + Time / Place",
          "example": "The live phonetic stream starts at 8:00 PM on Sunday."
        },
        {
          "form": "negative",
          "label": "Phủ định (-)",
          "formula": "Classes are not held at night on public holidays.",
          "example": "We do not practice in noisy environments."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "Where + ... at? / When + ... in/on?",
          "example": "Are you staying at home on Saturday morning?"
        }
      ],
      "detectionClues": [
        "Ngoại lệ thời gian: at night, at noon, at midnight (dù là buổi nhưng dùng AT).",
        "Phương tiện di chuyển: lên xe có thể đứng đi lại được dùng ON (on a train, on a bus); xe nhỏ ngồi thu mình dùng IN (in a car)."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "The learners gathered at the lab in the morning.",
          "meaning": "Những người học đã tập trung tại phòng lab vào buổi sáng.",
          "tokens": [
            {
              "word": "The learners",
              "role": "subject",
              "label": "Chủ ngữ [S]",
              "explanation": "Người học"
            },
            {
              "word": "gathered",
              "role": "verb",
              "label": "Động từ [V]",
              "explanation": "Tập hợp lại"
            },
            {
              "word": "at the lab",
              "role": "adverb",
              "label": "Giới từ nơi chốn [At]",
              "explanation": "Tại phòng thí nghiệm"
            },
            {
              "word": "in the morning",
              "role": "adverb",
              "label": "Giới từ thời gian [In]",
              "explanation": "Vào buổi sáng"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "past-simple-storytelling",
    "milestone": "MỐC 2 (A2)",
    "category": "Các Thì",
    "bandTarget": "Band 3.0 - 4.5",
    "shortDesc": "Thì Quá khứ đơn & Kỹ thuật thuật lại trải nghiệm cá nhân",
    "masterclass": {
      "title": "Thì Quá Khứ Đơn (Past Simple & Storytelling)",
      "tagline": "Kỹ năng then chốt để kể lại chuỗi sự kiện, hành trình cá nhân và kinh nghiệm quá khứ",
      "coreConcept": "Thì Quá khứ đơn dùng để diễn tả một hành động đã bắt đầu, đã kết thúc hoàn toàn tại một thời điểm xác định trong quá khứ và không còn tiếp diễn ở hiện tại.",
      "functions": [
        {
          "title": "1. Kể lại chuỗi sự kiện trong quá khứ",
          "explanation": "Các hành động xảy ra nối tiếp nhau trong một câu chuyện.",
          "exampleEn": "He woke up, checked his study goals, and smiled.",
          "exampleVi": "Anh ấy thức dậy, kiểm tra mục tiêu học tập, và mỉm cười."
        },
        {
          "title": "2. Diễn tả một thói quen cũ đã chấm dứt",
          "explanation": "Một trạng thái hoặc hoạt động thường xuyên trong quá khứ.",
          "exampleEn": "We practiced speaking every single evening last month.",
          "exampleVi": "Chúng tôi đã luyện nói vào mỗi buổi tối tháng trước."
        }
      ],
      "tableHeaders": [
        "Dạng động từ",
        "Quy tắc / Trợ động từ",
        "Dạng phủ định",
        "Ví dụ"
      ],
      "tableRows": [
        [
          "Có quy tắc (Regular)",
          "Thêm -ed (played, waited)",
          "did not + V-bare",
          "She walked to school yesterday."
        ],
        [
          "Bất quy tắc (Irregular)",
          "Bảng V2 (went, saw, took)",
          "did not + V-bare",
          "They went abroad in 2024."
        ],
        [
          "Động từ To Be",
          "was (I/He/She/It), were (You/We/They)",
          "wasn't / weren't",
          "He was very patient."
        ]
      ],
      "tableNote": "Khi đã có trợ động từ \"did\", động từ chính BẮT BUỘC trở về nguyên mẫu (V-bare).",
      "structures": [
        {
          "form": "affirmative",
          "label": "Khẳng định (+)",
          "formula": "S + V-ed / V2",
          "example": "I completed my milestone test yesterday."
        },
        {
          "form": "negative",
          "label": "Phủ định (-)",
          "formula": "S + did not (didn't) + V-bare",
          "example": "She did not rush through the practice session."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "Did + S + V-bare?",
          "example": "Did you review your pronunciation before recording?"
        }
      ],
      "detectionClues": [
        "Trạng từ thời gian quá khứ: yesterday, last night, last week, ago (two days ago).",
        "Các mốc năm đã qua: in 2020, in the 19th century, when I was a child."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "The dedicated student discovered the power of quiet focus.",
          "meaning": "Người sinh viên tận tâm đã khám phá ra sức mạnh của sự tập trung yên ả.",
          "tokens": [
            {
              "word": "The dedicated student",
              "role": "subject",
              "label": "Chủ ngữ [S]",
              "explanation": "Sinh viên tận tâm"
            },
            {
              "word": "discovered",
              "role": "verb",
              "label": "Động từ [V2]",
              "explanation": "Động từ quá khứ có quy tắc"
            },
            {
              "word": "the power of quiet focus",
              "role": "object",
              "label": "Tân ngữ [O]",
              "explanation": "Sức mạnh của sự tập trung"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "past-continuous-parallel",
    "milestone": "MỐC 2 (A2)",
    "category": "Các Thì",
    "bandTarget": "Band 3.0 - 4.5",
    "shortDesc": "Thì Quá khứ tiếp diễn: Hành động đang xảy ra trong quá khứ & Hành động cắt ngang",
    "masterclass": {
      "title": "Thì Quá Khứ Tiếp Diễn & Hành Động Cắt Ngang",
      "tagline": "Tạo bối cảnh sống động, kết hợp When & While để kể chuyện nhiều tầng lớp",
      "coreConcept": "Thì Quá khứ tiếp diễn (was/were + V-ing) diễn tả hành động đang diễn ra tại một thời điểm xác định trong quá khứ, hoặc đang làm bối cảnh thì một hành động ngắn khác cắt ngang (chia ở Quá khứ đơn với When).",
      "functions": [
        {
          "title": "1. Hành động đang xảy ra tại một thời điểm chính xác trong quá khứ",
          "explanation": "Lúc 8:00 tối qua tôi đang làm gì.",
          "exampleEn": "At 8:00 PM yesterday, I was recording my pronunciation exercise.",
          "exampleVi": "Lúc 8:00 tối qua, tôi đang thu âm bài tập phát âm của mình."
        },
        {
          "title": "2. Phối hợp While (hành động dài) và When (hành động ngắn cắt ngang)",
          "explanation": "Hành động dài đang xảy ra (chia Quá khứ tiếp diễn), hành động ngắn chen vào (chia Quá khứ đơn).",
          "exampleEn": "While I was practicing the vowel chart, my mentor called.",
          "exampleVi": "Trong khi tôi đang luyện bảng nguyên âm thì người hướng dẫn gọi điện đến."
        }
      ],
      "tableHeaders": [
        "Chủ ngữ",
        "To Be quá khứ",
        "Động từ chính (V-ing)",
        "Ví dụ"
      ],
      "tableRows": [
        [
          "I / He / She / It",
          "was",
          "studying, speaking",
          "She was practicing at noon."
        ],
        [
          "You / We / They",
          "were",
          "improving, discussing",
          "They were analyzing the acoustic waves."
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Khẳng định (+)",
          "formula": "S + was / were + V-ing",
          "example": "The student was practicing intonation when the timer rang."
        },
        {
          "form": "negative",
          "label": "Phủ định (-)",
          "formula": "S + was / were + not + V-ing",
          "example": "We were not guessing random sounds without the IPA chart."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "Was / Were + S + V-ing?",
          "example": "What were you doing at this exact time yesterday?"
        }
      ],
      "detectionClues": [
        "Thời điểm cụ thể trong quá khứ: at 9 PM yesterday, at this time last year.",
        "Liên từ thời gian: When (+ Quá khứ đơn), While / As (+ Quá khứ tiếp diễn)."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "While the tutor was demonstrating mouth posture, the student was observing closely.",
          "meaning": "Trong khi giáo viên minh họa khẩu hình miệng, học viên chăm chú quan sát.",
          "tokens": [
            {
              "word": "While the tutor was demonstrating mouth posture",
              "role": "adverb",
              "label": "Mệnh đề While [Past Continuous]",
              "explanation": "Hành động nền"
            },
            {
              "word": "the student",
              "role": "subject",
              "label": "Chủ ngữ chính [S]",
              "explanation": "Học viên"
            },
            {
              "word": "was observing",
              "role": "verb",
              "label": "Động từ [Past Continuous]",
              "explanation": "Hành động song song"
            },
            {
              "word": "closely",
              "role": "adverb",
              "label": "Trạng từ [Adv]",
              "explanation": "Chăm chú"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "future-intentions",
    "milestone": "MỐC 2 (A2)",
    "category": "Các Thì",
    "bandTarget": "Band 3.0 - 4.5",
    "shortDesc": "Tương lai đơn Will & Be Going To: Kế hoạch và dự đoán",
    "masterclass": {
      "title": "Thì Tương Lai: Will & Be Going To",
      "tagline": "Làm chủ nghệ thuật lập kế hoạch, đưa ra quyết định tức thì và dự đoán tương lai",
      "coreConcept": "Tiếng Anh phân biệt rõ ràng giữa quyết định tự phát nảy sinh ngay lúc nói (Will) và kế hoạch, dự định đã được chuẩn bị từ trước hoặc dự đoán có dấu hiệu hiện hữu (Be going to).",
      "functions": [
        {
          "title": "1. Quyết định tự phát ngay lúc nói (Will)",
          "explanation": "Đưa ra phản hồi tức thì, lời hứa hoặc lời đề nghị giúp đỡ.",
          "exampleEn": "Hold on, I will help you adjust the microphone setting.",
          "exampleVi": "Chờ chút, tôi sẽ giúp bạn điều chỉnh cài đặt micro."
        },
        {
          "title": "2. Kế hoạch, dự định đã sắp xếp trước (Be going to)",
          "explanation": "Mục tiêu hoặc lịch trình đã được lên kế hoạch từ trước thời điểm nói.",
          "exampleEn": "We are going to complete the A2 gate evaluation this weekend.",
          "exampleVi": "Chúng tôi dự định sẽ hoàn thành bài đánh giá mốc A2 vào cuối tuần này."
        }
      ],
      "tableHeaders": [
        "Cấu trúc tương lai",
        "Công thức",
        "Ngữ cảnh sử dụng",
        "Ví dụ"
      ],
      "tableRows": [
        [
          "Will + V-bare",
          "S + will + V-bare",
          "Quyết định tức thì, lời hứa, đề xuất",
          "I will review this lesson tonight."
        ],
        [
          "Be going to + V-bare",
          "S + am/is/are + going to + V-bare",
          "Kế hoạch đã định, dự đoán có căn cứ",
          "She is going to take IELTS in December."
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Khẳng định (+)",
          "formula": "S + will / (am/is/are) going to + V-bare",
          "example": "The determined team will achieve their educational milestone this quarter."
        },
        {
          "form": "negative",
          "label": "Phủ định (-)",
          "formula": "S + will not (won't) / (am/is/are) not going to + V-bare",
          "example": "We will not compromise on authentic audio quality."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "Will + S + V-bare? / Are + S + going to + V-bare?",
          "example": "Are you going to practice shadow speaking today?"
        }
      ],
      "detectionClues": [
        "Từ chỉ tương lai: tomorrow, next week, soon, in the near future.",
        "Động từ chỉ ý định nảy sinh: I promise, I think, I hope, maybe (thường dùng Will)."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "The determined team will achieve their educational milestone this quarter.",
          "meaning": "Đội ngũ kiên định sẽ đạt được mốc giáo dục của mình trong quý này.",
          "tokens": [
            {
              "word": "The determined team",
              "role": "subject",
              "label": "Chủ ngữ [S]",
              "explanation": "Đội ngũ quyết tâm"
            },
            {
              "word": "will achieve",
              "role": "verb",
              "label": "Động từ tương lai [Will + V]",
              "explanation": "Sẽ đạt được"
            },
            {
              "word": "their educational milestone",
              "role": "object",
              "label": "Tân ngữ [O]",
              "explanation": "Mốc giáo dục"
            },
            {
              "word": "this quarter",
              "role": "adverb",
              "label": "Trạng từ [Adv]",
              "explanation": "Trong quý này"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "future-in-the-past",
    "milestone": "MỐC 2 (A2)",
    "category": "Các Thì",
    "bandTarget": "Band 3.0 - 4.5",
    "shortDesc": "Tương lai trong quá khứ (Future in the Past): Was/Were going to & Would",
    "masterclass": {
      "title": "Tương Lai Trong Quá Khứ (Future in the Past)",
      "tagline": "Kể lại những dự định, kế hoạch đã từng ấp ủ trước một mốc thời gian xưa",
      "coreConcept": "Tương lai trong quá khứ dùng để diễn tả một sự việc đã được lên kế hoạch hoặc dự tính sẽ xảy ra sau một thời điểm trong quá khứ (thường dùng was/were going to cho dự định chưa thành hoặc bị gián đoạn, và would + V-bare khi lùi thì từ will trong câu gián tiếp).",
      "functions": [
        {
          "title": "1. Kế hoạch trong quá khứ bị thay đổi hoặc gián đoạn",
          "explanation": "Dùng was/were going to để nói về dự định cũ nhưng thực tế không diễn ra như tính toán.",
          "exampleEn": "I was going to take the gate evaluation yesterday, but my internet was unstable.",
          "exampleVi": "Tôi đã định làm bài thi cổng hôm qua, nhưng mạng internet bị chập chờn."
        },
        {
          "title": "2. Thuật lại lời hứa hoặc suy nghĩ tương lai từ góc nhìn quá khứ",
          "explanation": "Lùi \"will\" thành \"would\" trong mệnh đề phụ sau thought, knew, promised.",
          "exampleEn": "She promised that she would practice the vowel chart every day.",
          "exampleVi": "Cô ấy đã hứa rằng cô ấy sẽ luyện bảng nguyên âm mỗi ngày."
        }
      ],
      "tableHeaders": [
        "Dạng cấu trúc",
        "Công thức",
        "Sắc thái ngữ nghĩa",
        "Ví dụ"
      ],
      "tableRows": [
        [
          "Was/Were going to",
          "S + was/were going to + V-bare",
          "Dự định trong quá khứ (thường chưa thành)",
          "He was going to call you."
        ],
        [
          "Would + V-bare",
          "S + would + V-bare",
          "Lời hứa, dự đoán từ góc nhìn quá khứ",
          "I knew they would succeed."
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Khẳng định (+)",
          "formula": "S + was / were going to + V-bare (+ but...)",
          "example": "We were going to record earlier, but we decided to calibrate the room acoustics first."
        },
        {
          "form": "negative",
          "label": "Phủ định (-)",
          "formula": "S + was / were not going to + V-bare",
          "example": "She was not going to take the exam until her mentor approved her acoustic clarity."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "Were you going to mention the pronunciation score yesterday?",
          "example": "Did they think that the gate test would be so rigorous?"
        }
      ],
      "detectionClues": [
        "Cụm từ gián đoạn: was going to... but, were planning to... however.",
        "Động từ tư duy trong quá khứ: thought that... would, promised that... would."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "The candidate was going to submit the recording, but she noticed a vowel distortion.",
          "meaning": "Thí sinh đã định nộp bản thu âm, nhưng cô ấy phát hiện ra một chỗ méo nguyên âm.",
          "tokens": [
            {
              "word": "The candidate",
              "role": "subject",
              "label": "Chủ ngữ [S]",
              "explanation": "Thí sinh"
            },
            {
              "word": "was going to submit",
              "role": "verb",
              "label": "Tương lai trong quá khứ",
              "explanation": "was going to + V-bare"
            },
            {
              "word": "the recording",
              "role": "object",
              "label": "Tân ngữ [O]",
              "explanation": "Bản thu"
            },
            {
              "word": "but she noticed a vowel distortion",
              "role": "adverb",
              "label": "Vế liên từ tương phản",
              "explanation": "Hành động can thiệp"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "comparatives-superlatives",
    "milestone": "MỐC 2 (A2)",
    "category": "Cấu Trúc Câu",
    "bandTarget": "Band 3.0 - 4.5",
    "shortDesc": "So sánh hơn & So sánh nhất: Đối chiếu dữ liệu và tính chất",
    "masterclass": {
      "title": "So Sánh Hơn & So Sánh Nhất (Comparatives & Superlatives)",
      "tagline": "Kỹ năng đối chiếu thuộc tính, mô tả dữ liệu và phân tích sự khác biệt",
      "coreConcept": "Cấu trúc so sánh giúp ta cân đo đong đếm thuộc tính giữa hai hoặc nhiều thực thể. Nguyên tắc cơ bản dựa vào độ dài của tính từ/trạng từ: ngắn (thêm -er/-est) và dài (dùng more/most), kèm các trường hợp biến đổi đặc biệt.",
      "functions": [
        {
          "title": "1. So sánh hơn giữa hai thực thể",
          "explanation": "Chỉ ra đối tượng nào có thuộc tính vượt trội hơn.",
          "exampleEn": "Targeted phonetic feedback is more effective than unguided repetition.",
          "exampleVi": "Phản hồi ngữ âm trọng tâm hiệu quả hơn việc lặp lại không có định hướng."
        },
        {
          "title": "2. So sánh nhất trong một tập thể",
          "explanation": "Xác định đối tượng giữ vị trí số một về đặc tính.",
          "exampleEn": "She is the most consistent learner in our study group.",
          "exampleVi": "Cô ấy là người học kiên định nhất trong nhóm học tập của chúng tôi."
        }
      ],
      "tableHeaders": [
        "Dạng tính từ",
        "So sánh hơn (+ than)",
        "So sánh nhất (+ the ...)",
        "Quy tắc đặc thù"
      ],
      "tableRows": [
        [
          "Ngắn (1 âm tiết)",
          "adj + -er (faster, calmer)",
          "the + adj + -est (the fastest)",
          "Gấp đôi phụ âm cuối (big -> bigger)"
        ],
        [
          "Dài (>= 2 âm tiết)",
          "more + adj (more focused)",
          "the most + adj (the most focused)",
          "Giữ nguyên tính từ gốc"
        ],
        [
          "Bất quy tắc",
          "better / worse / farther",
          "the best / worst / farthest",
          "good -> better -> best"
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Khẳng định (+)",
          "formula": "S1 + Be + more Adj / Adj-er + than + S2",
          "example": "Targeted feedback is significantly more effective than blind repetition."
        },
        {
          "form": "negative",
          "label": "Phủ định so sánh bằng (-)",
          "formula": "S1 + Be + not as + Adj + as + S2",
          "example": "Passive listening is not as productive as active vocalization."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "Is + S1 + more Adj / Adj-er + than + S2?",
          "example": "Is natural speech rhythm more important than individual word speed?"
        }
      ],
      "detectionClues": [
        "Từ nối so sánh \"than\" trong câu so sánh hơn.",
        "Mạo từ \"the\" đứng trước tính từ so sánh nhất."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "Targeted feedback is significantly more effective than unguided repetition.",
          "meaning": "Phản hồi trúng đích thì hiệu quả hơn đáng kể so với việc lặp đi lặp lại vô định hướng.",
          "tokens": [
            {
              "word": "Targeted feedback",
              "role": "subject",
              "label": "Chủ ngữ [S]",
              "explanation": "Phản hồi đúng trọng tâm"
            },
            {
              "word": "is",
              "role": "verb",
              "label": "Động từ nối [V]",
              "explanation": "To be"
            },
            {
              "word": "significantly more effective",
              "role": "complement",
              "label": "Bổ ngữ [C]",
              "explanation": "So sánh hơn"
            },
            {
              "word": "than unguided repetition",
              "role": "adverb",
              "label": "Vế so sánh [Adv]",
              "explanation": "So với lặp lại thiếu định hướng"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "modal-verbs-advice",
    "milestone": "MỐC 2 (A2)",
    "category": "Cấu Trúc Câu",
    "bandTarget": "Band 3.0 - 4.5",
    "shortDesc": "Động từ khuyết thiếu: Can, Could, Should, Must & Have to",
    "masterclass": {
      "title": "Động Từ Khuyết Thiếu (Modal Verbs: Can, Should, Must)",
      "tagline": "Thể hiện sắc thái khả năng, lời khuyên và nghĩa vụ bắt buộc trong giao tiếp",
      "coreConcept": "Động từ khuyết thiếu không đứng một mình mà bổ nghĩa cho động từ chính đứng sau. Chúng không bao giờ chia theo ngôi số ít (không thêm -s/-es) và động từ theo sau luôn ở dạng nguyên thể không to (V-bare).",
      "functions": [
        {
          "title": "1. Diễn tả khả năng và năng lực (Can / Could)",
          "explanation": "Nói về những gì một người có thể làm được hoặc khả năng sự việc xảy ra.",
          "exampleEn": "You can record your voice directly in the browser with one tap.",
          "exampleVi": "Bạn có thể ghi âm giọng nói của mình trực tiếp trên trình duyệt chỉ với một lần chạm."
        },
        {
          "title": "2. Đưa ra lời khuyên hữu ích (Should / Ought to)",
          "explanation": "Gợi ý giải pháp tốt nhất cho người học mà không mang tính ép buộc.",
          "exampleEn": "Learners should review the tongue position before producing vowels.",
          "exampleVi": "Người học nên xem lại vị trí lưỡi trước khi phát âm các nguyên âm."
        },
        {
          "title": "3. Nghĩa vụ bắt buộc và điều kiện tiên quyết (Must / Have to)",
          "explanation": "Quy tắc bắt buộc phải tuân theo hoặc điều kiện không thể bỏ qua.",
          "exampleEn": "Every candidate must achieve 100% mastery to pass the milestone gate.",
          "exampleVi": "Mỗi thí sinh bắt buộc phải đạt độ chuẩn 100% để vượt qua cánh cổng mốc."
        }
      ],
      "tableHeaders": [
        "Modal Verb",
        "Sắc thái biểu đạt",
        "Dạng phủ định",
        "Lưu ý quan trọng"
      ],
      "tableRows": [
        [
          "Can / Could",
          "Năng lực, khả năng, sự xin phép",
          "cannot (can't) / couldn't",
          "Could lịch sự hơn Can trong câu hỏi"
        ],
        [
          "Should",
          "Lời khuyên, sự khuyến nghị",
          "should not (shouldn't)",
          "Đồng nghĩa với ought to"
        ],
        [
          "Must / Have to",
          "Nghĩa vụ, điều bắt buộc",
          "must not (mustn't) / don't have to",
          "Mustn't = Cấm; Don't have to = Không cần thiết"
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Khẳng định (+)",
          "formula": "S + Modal Verb + V-bare + Object",
          "example": "Disciplined students can conquer challenging pronunciation barriers systematically."
        },
        {
          "form": "negative",
          "label": "Phủ định (-)",
          "formula": "S + Modal Verb + not + V-bare + Object",
          "example": "Learners must not guess phonetic stress arbitrarily."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "Modal Verb + S + V-bare + Object?",
          "example": "Can you discern the subtle difference between /i:/ and /ɪ/?"
        }
      ],
      "detectionClues": [
        "Theo sau trực tiếp bởi động từ nguyên mẫu không \"to\" (V-bare).",
        "Không bao giờ chia đuôi -s/es dù chủ ngữ là He/She/It."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "Disciplined students can conquer challenging pronunciation barriers systematically.",
          "meaning": "Những học viên kỷ luật có thể chinh phục các rào cản phát âm đầy thử thách một cách có hệ thống.",
          "tokens": [
            {
              "word": "Disciplined students",
              "role": "subject",
              "label": "Chủ ngữ [S]",
              "explanation": "Học viên kỷ luật"
            },
            {
              "word": "can conquer",
              "role": "verb",
              "label": "Động từ khuyết thiếu [Modal + V]",
              "explanation": "Có thể chinh phục"
            },
            {
              "word": "challenging pronunciation barriers",
              "role": "object",
              "label": "Tân ngữ [O]",
              "explanation": "Rào cản khó"
            },
            {
              "word": "systematically",
              "role": "adverb",
              "label": "Trạng từ phương thức [Adv]",
              "explanation": "Một cách bài bản"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "there-is-are-dummy",
    "milestone": "MỐC 2 (A2)",
    "category": "Cấu Trúc Câu",
    "bandTarget": "Band 3.0 - 4.5",
    "shortDesc": "Cấu trúc There is / There are & Chủ ngữ giả It / There",
    "masterclass": {
      "title": "There Is / There Are & Chủ Ngữ Giả (Dummy Subjects)",
      "tagline": "Xác lập sự tồn tại của sự vật và diễn đạt ý niệm thời tiết, khoảng cách, thời gian",
      "coreConcept": "There is / There are dùng để thông báo về sự hiện diện hoặc tồn tại của người, vật tại một địa điểm hay thời gian nào đó mà không cần chỉ định ai sở hữu nó. Ngoài ra, \"It\" được dùng làm chủ ngữ giả cho thời tiết, nhiệt độ, khoảng cách và thời gian.",
      "functions": [
        {
          "title": "1. Tuyên bố sự tồn tại của sự vật",
          "explanation": "There is + Danh từ số ít / không đếm được; There are + Danh từ số nhiều.",
          "exampleEn": "There are 44 phonemes in the International Phonetic Alphabet.",
          "exampleVi": "Có 44 âm vị trong Bảng Ký Hiệu Ngữ Âm Quốc Tế."
        },
        {
          "title": "2. Chủ ngữ giả \"It\" chỉ thời gian, thời tiết và nhận định",
          "explanation": "It is important to articulate final consonants clearly.",
          "exampleEn": "It is important to articulate final consonants clearly.",
          "exampleVi": "Điều quan trọng là phải phát âm rõ ràng các phụ âm cuối."
        }
      ],
      "tableHeaders": [
        "Dạng cấu trúc",
        "Loại danh từ đi kèm",
        "Dạng phủ định",
        "Ví dụ"
      ],
      "tableRows": [
        [
          "There is ('s)",
          "Số ít hoặc Không đếm được",
          "There isn't / There is no...",
          "There is a new lesson available."
        ],
        [
          "There are",
          "Số nhiều đếm được",
          "There aren't / There are no...",
          "There are several mouth models to inspect."
        ],
        [
          "It is (Chủ ngữ giả)",
          "Tính từ đánh giá + To-V",
          "It isn't...",
          "It is easy to make mistakes at first."
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Khẳng định (+)",
          "formula": "There is / are + Noun Phrase (+ Place / Time)",
          "example": "There are two distinct dental fricative sounds in English."
        },
        {
          "form": "negative",
          "label": "Phủ định (-)",
          "formula": "There is / are + not + any + Noun / There is no + Noun",
          "example": "There is no shortcut to natural auditory discrimination."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "Is / Are there + any + Noun?",
          "example": "Are there any questions regarding vowel openness?"
        }
      ],
      "detectionClues": [
        "Động từ to be chia theo danh từ ĐỨNG SAU: There is a book, nhưng There are three books."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "There are forty-four essential phonemes in the standard inventory.",
          "meaning": "Có 44 âm vị cốt lõi trong hệ thống chuẩn.",
          "tokens": [
            {
              "word": "There",
              "role": "subject",
              "label": "Chủ ngữ giả [Dummy S]",
              "explanation": "Chỉ sự tồn tại"
            },
            {
              "word": "are",
              "role": "verb",
              "label": "Động từ to be [V]",
              "explanation": "Chia theo số nhiều"
            },
            {
              "word": "forty-four essential phonemes",
              "role": "complement",
              "label": "Danh từ số nhiều",
              "explanation": "44 âm vị"
            },
            {
              "word": "in the standard inventory",
              "role": "adverb",
              "label": "Cụm giới từ địa điểm [Prep]",
              "explanation": "Trong hệ thống chuẩn"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "basic-conjunctions-linking",
    "milestone": "MỐC 2 (A2)",
    "category": "Mệnh Đề & Liên Từ",
    "bandTarget": "Band 3.0 - 4.5",
    "shortDesc": "Liên từ kết hợp & Liên từ phụ thuộc: FANBOYS, Because, Although, So",
    "masterclass": {
      "title": "Liên Từ Kết Nối Câu (Conjunctions & Linking Words)",
      "tagline": "Cột mốc chuyển từ câu đơn sang câu ghép và câu phức mượt mà",
      "coreConcept": "Liên từ là keo dán gắn kết các từ, cụm từ và mệnh đề lại với nhau. Liên từ đẳng lập (For, And, Nor, But, Or, Yet, So - FANBOYS) nối các thành phần ngang hàng; Liên từ phụ thuộc (Because, Although, Even though, Since) kết nối mệnh đề phụ chỉ nguyên nhân/nhượng bộ với mệnh đề chính.",
      "functions": [
        {
          "title": "1. Nối ý tương phản và bổ sung (And, But, Yet)",
          "explanation": "Dùng \"and\" để bổ sung thông tin; dùng \"but / yet\" để diễn tả sự đối lập.",
          "exampleEn": "She practiced diligently, but she felt nervous before the test.",
          "exampleVi": "Cô ấy đã luyện tập chăm chỉ, nhưng cô ấy vẫn cảm thấy lo lắng trước bài thi."
        },
        {
          "title": "2. Diễn tả nguyên nhân và kết quả (Because, So, Since)",
          "explanation": "\"Because\" đứng trước nguyên nhân; \"So\" đứng trước hệ quả.",
          "exampleEn": "He isolated the vowel sounds because they were challenging.",
          "exampleVi": "Anh ấy cô lập các nguyên âm bởi vì chúng đầy thử thách."
        }
      ],
      "tableHeaders": [
        "Mục đích kết nối",
        "Liên từ phổ biến",
        "Vị trí dấu phẩy",
        "Ví dụ"
      ],
      "tableRows": [
        [
          "Bổ sung / Liệt kê",
          "and, also, as well as",
          "Nối 2 mệnh đề độc lập cần dấu phẩy trước and",
          "He listened, and he repeated."
        ],
        [
          "Đối lập / Tương phản",
          "but, yet, although, however",
          "Although đứng đầu mệnh đề phụ, phẩy giữa câu",
          "Although tired, he reviewed his log."
        ],
        [
          "Nguyên nhân - Hệ quả",
          "because, since, so, therefore",
          "Không dùng because và so trong cùng một câu",
          "It was late, so they wrapped up."
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Mệnh đề nhượng bộ (+)",
          "formula": "Although / Even though + Clause 1, Clause 2",
          "example": "Although the pronunciation test is demanding, every learner can pass with 100% accuracy."
        },
        {
          "form": "negative",
          "label": "Phủ định (-)",
          "formula": "Clause 1, so + Subject + did not / cannot + V-bare",
          "example": "The audio was muffled, so we could not verify the fricative sound."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "Did you record again because you noticed an error?",
          "example": "Will you review the lecture or will you take the quiz directly?"
        }
      ],
      "detectionClues": [
        "Lỗi cấm kỵ: TUYỆT ĐỐI không dùng \"Although... but...\" trong cùng 1 câu.",
        "Tương tự, KHÔNG BAO GIỜ dùng \"Because... so...\" trong cùng 1 câu."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "Although the task required patience, the students persevered with calm enthusiasm.",
          "meaning": "Dù nhiệm vụ đòi hỏi sự kiên nhẫn, các sinh viên vẫn bền bỉ với lòng nhiệt thành điềm tĩnh.",
          "tokens": [
            {
              "word": "Although the task required patience",
              "role": "adverb",
              "label": "Mệnh đề nhượng bộ [Subordinate]",
              "explanation": "Mệnh đề phụ bắt đầu bằng Although"
            },
            {
              "word": "the students",
              "role": "subject",
              "label": "Chủ ngữ chính [S]",
              "explanation": "Các sinh viên"
            },
            {
              "word": "persevered",
              "role": "verb",
              "label": "Động từ chính [V]",
              "explanation": "Kiên trì"
            },
            {
              "word": "with calm enthusiasm",
              "role": "adverb",
              "label": "Trạng từ phương thức [Adv]",
              "explanation": "Với sự hào hứng điềm tĩnh"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "passive-voice-b1",
    "milestone": "MỐC 3 (B1)",
    "category": "Học Thuật Nâng Cao",
    "bandTarget": "Band 4.5 - 5.5",
    "shortDesc": "Câu bị động (Passive Voice) nâng tầm viết luận khách quan",
    "masterclass": {
      "title": "Câu Bị Động & Giọng Văn Học Thuật Khách Quan",
      "tagline": "Vũ khí tối quan trọng cho IELTS Writing Task 1 & Task 2",
      "coreConcept": "Câu bị động chuyển trọng tâm từ \"người thực hiện hành động\" sang \"đối tượng chịu tác động\" hoặc \"kết quả của hành động\". Đây là phong cách viết khách quan, trang trọng của giới học thuật.",
      "functions": [
        {
          "title": "1. Nhấn mạnh vào kết quả hoặc đối tượng chịu tác động",
          "explanation": "Khi chủ thể thực hiện hành động không quan trọng hoặc ai cũng biết.",
          "exampleEn": "Over 10,000 data points were analyzed systematically.",
          "exampleVi": "Hơn 10.000 điểm dữ liệu đã được phân tích một cách có hệ thống."
        },
        {
          "title": "2. Miêu tả quy trình sản xuất hoặc biểu đồ (Task 1)",
          "explanation": "Mô tả các bước công nghệ hoặc dây chuyền tự nhiên.",
          "exampleEn": "The raw materials are sorted before being processed.",
          "exampleVi": "Các nguyên liệu thô được phân loại trước khi đưa vào chế biến."
        }
      ],
      "tableHeaders": [
        "Thì ngữ pháp",
        "Cấu trúc Bị động",
        "Ví dụ câu"
      ],
      "tableRows": [
        [
          "Hiện tại đơn",
          "am / is / are + V3/ed",
          "English is spoken worldwide."
        ],
        [
          "Quá khứ đơn",
          "was / were + V3/ed",
          "The report was submitted on time."
        ],
        [
          "Hiện tại hoàn thành",
          "have / has been + V3/ed",
          "The policy has been updated recently."
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Khẳng định (+)",
          "formula": "S + Be + V3/ed (+ by Agent)",
          "example": "Valuable feedback was provided gently by the mentor."
        },
        {
          "form": "negative",
          "label": "Phủ định (-)",
          "formula": "S + Be + not + V3/ed",
          "example": "Sensitive learner identities are not shared publicly."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "Be + S + V3/ed?",
          "example": "Was the recording reviewed before submission?"
        }
      ],
      "detectionClues": [
        "Sự xuất hiện của cụm \"by + tác nhân\" (by researchers, by the committee).",
        "Cấu trúc cố định Be + Động từ phân từ 2 (V3/V-ed)."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "Crucial learning evidence was recorded with full user privacy.",
          "meaning": "Bằng chứng học tập cốt lõi đã được ghi nhận với quyền riêng tư trọn vẹn.",
          "tokens": [
            {
              "word": "Crucial learning evidence",
              "role": "subject",
              "label": "Chủ ngữ [S]",
              "explanation": "Bằng chứng học tập chịu tác động"
            },
            {
              "word": "was recorded",
              "role": "verb",
              "label": "Động từ Bị Động",
              "explanation": "was + V3/ed"
            },
            {
              "word": "with full user privacy",
              "role": "adverb",
              "label": "Trạng từ phương thức",
              "explanation": "Với đầy đủ quyền riêng tư"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "present-perfect-bridge",
    "milestone": "MỐC 3 (B1)",
    "category": "Các Thì",
    "bandTarget": "Band 4.5 - 5.5",
    "shortDesc": "Thì Hiện tại hoàn thành: Kết nối quá khứ và tác động hiện tại",
    "masterclass": {
      "title": "Thì Hiện Tại Hoàn Thành (Present Perfect Bridge)",
      "tagline": "Cầu nối giữa trải nghiệm quá khứ và kết quả thực tiễn ở thời điểm hiện tại",
      "coreConcept": "Thì Hiện tại hoàn thành dùng khi một hành động diễn ra trong quá khứ nhưng thời điểm cụ thể không quan trọng, hoặc kết quả, tác động của nó vẫn đang hiện hữu rõ ràng ở hiện tại.",
      "functions": [
        {
          "title": "1. Trải nghiệm tích lũy từ quá khứ đến hiện tại",
          "explanation": "Nhấn mạnh kinh nghiệm hoặc những điều đã từng làm tính đến nay.",
          "exampleEn": "I have completed three full mock tests this month.",
          "exampleVi": "Tôi đã hoàn thành ba bài thi thử đầy đủ trong tháng này."
        },
        {
          "title": "2. Hành động vừa mới diễn ra có hệ quả ngay lúc này",
          "explanation": "Sự việc mới hoàn tất, kết quả tác động trực tiếp lên thực tại.",
          "exampleEn": "The examiner has just released the official evaluation rubric.",
          "exampleVi": "Giám khảo vừa mới công bố thang tiêu chí chấm điểm chính thức."
        }
      ],
      "tableHeaders": [
        "Chủ ngữ",
        "Trợ động từ Have/Has",
        "Quá khứ phân từ (V3/ed)",
        "Ví dụ thực tế"
      ],
      "tableRows": [
        [
          "I / You / We / They",
          "have ('ve)",
          "achieved, mastered, spoken",
          "We have unlocked all foundational gates."
        ],
        [
          "He / She / It",
          "has ('s)",
          "improved, recorded, completed",
          "He has submitted his audio sample."
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Khẳng định (+)",
          "formula": "S + have / has + V3/ed",
          "example": "The learner has unlocked substantial fluency through regular phonemic drills."
        },
        {
          "form": "negative",
          "label": "Phủ định (-)",
          "formula": "S + have / has + not + V3/ed",
          "example": "They have not encountered any audio playback distortions."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "Have / Has + S + V3/ed?",
          "example": "Have you verified your mouth shape before the gate assessment?"
        }
      ],
      "detectionClues": [
        "Từ nhận biết đặc trưng: just, already, yet, recently, lately.",
        "Mốc thời gian với \"since\" hoặc khoảng thời gian với \"for\"."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "The learner has unlocked substantial fluency through regular phonemic drills.",
          "meaning": "Người học đã khai mở sự lưu loát đáng kể thông qua các bài luyện âm vị đều đặn.",
          "tokens": [
            {
              "word": "The learner",
              "role": "subject",
              "label": "Chủ ngữ [S]",
              "explanation": "Người học"
            },
            {
              "word": "has unlocked",
              "role": "verb",
              "label": "Động từ Hiện Tại Hoàn Thành [has + V3]",
              "explanation": "Đã mở khóa thành công"
            },
            {
              "word": "substantial fluency",
              "role": "object",
              "label": "Tân ngữ [O]",
              "explanation": "Sự lưu loát đáng kể"
            },
            {
              "word": "through regular phonemic drills",
              "role": "adverb",
              "label": "Trạng từ phương thức [Adv]",
              "explanation": "Qua bài tập luyện âm vị"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "present-perfect-continuous",
    "milestone": "MỐC 3 (B1)",
    "category": "Các Thì",
    "bandTarget": "Band 4.5 - 5.5",
    "shortDesc": "Thì Hiện tại hoàn thành tiếp diễn: Nhấn mạnh tính liên tục và sự bền bỉ của hành động",
    "masterclass": {
      "title": "Hiện Tại Hoàn Thành Tiếp Diễn (Emphasis on Duration)",
      "tagline": "Nhấn mạnh tính liên tục, sự hao tốn công sức và vết tích để lại ở hiện tại",
      "coreConcept": "Khác với Hiện tại hoàn thành đơn (chú trọng vào KẾT QUẢ hoặc SỐ LẦN hoàn thành), Hiện tại hoàn thành tiếp diễn (have/has been + V-ing) nhấn mạnh vào QUÁ TRÌNH kéo dài liên tục, công sức và dấu vết rõ ràng còn lưu lại ngay lúc này.",
      "functions": [
        {
          "title": "1. Nhấn mạnh tính liên tục không ngắt quãng",
          "explanation": "Hành động kéo dài suốt một khoảng thời gian đến tận hiện tại.",
          "exampleEn": "She has been practicing her speech rhythm all morning.",
          "exampleVi": "Cô ấy đã luyện nhịp điệu bài nói của mình suốt cả buổi sáng."
        },
        {
          "title": "2. Giải thích dấu vết hiện tại bằng hành động vừa mới dừng lại",
          "explanation": "Vết tích có thể nhìn thấy rõ ở hiện tại do hành động kéo dài gây ra.",
          "exampleEn": "My throat is a bit tired because I have been recording for two hours.",
          "exampleVi": "Cổ họng tôi hơi mỏi vì tôi đã liên tục thu âm suốt hai tiếng đồng hồ."
        }
      ],
      "tableHeaders": [
        "Tiêu chí so sánh",
        "Hiện Tại Hoàn Thành Đơn",
        "Hiện Tại Hoàn Thành Tiếp Diễn"
      ],
      "tableRows": [
        [
          "Trọng tâm",
          "Kết quả, thành tựu (Đã làm được cái gì)",
          "Quá trình, thời lượng (Đã tốn bao nhiêu thời gian)"
        ],
        [
          "Câu hỏi đặc trưng",
          "How many / How much?",
          "How long? (Đã làm bao lâu rồi?)"
        ],
        [
          "Công thức",
          "have / has + V3/ed",
          "have / has been + V-ing"
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Khẳng định (+)",
          "formula": "S + have / has been + V-ing + (for / since ...)",
          "example": "He has been refining his vowel articulation for three consecutive weeks."
        },
        {
          "form": "negative",
          "label": "Phủ định (-)",
          "formula": "S + have / has not been + V-ing",
          "example": "They have not been practicing the diphthongs regularly this month."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "How long + have / has + S + been + V-ing?",
          "example": "How long have you been studying English phonetics?"
        }
      ],
      "detectionClues": [
        "Cụm từ thời lượng: all day, all morning, for the past two hours, how long."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "The candidate has been polishing her intonation patterns all afternoon.",
          "meaning": "Thí sinh đã liên tục trau chuốt các mẫu ngữ điệu suốt cả buổi chiều.",
          "tokens": [
            {
              "word": "The candidate",
              "role": "subject",
              "label": "Chủ ngữ [S]",
              "explanation": "Thí sinh"
            },
            {
              "word": "has been polishing",
              "role": "verb",
              "label": "Động từ HTHT Tiếp Diễn",
              "explanation": "has been + V-ing"
            },
            {
              "word": "her intonation patterns",
              "role": "object",
              "label": "Tân ngữ [O]",
              "explanation": "Mẫu ngữ điệu"
            },
            {
              "word": "all afternoon",
              "role": "adverb",
              "label": "Trạng từ chỉ thời lượng [Adv]",
              "explanation": "Suốt buổi chiều"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "past-perfect-chronology",
    "milestone": "MỐC 3 (B1)",
    "category": "Các Thì",
    "bandTarget": "Band 4.5 - 5.5",
    "shortDesc": "Thì Quá khứ hoàn thành: Xác định thứ tự trước - sau của 2 hành động quá khứ",
    "masterclass": {
      "title": "Thì Quá Khứ Hoàn Thành (Past Perfect Chronology)",
      "tagline": "Xác lập thứ tự diễn tiến trước - sau trong quá khứ một cách tường minh",
      "coreConcept": "Khi có hai hành động cùng xảy ra trong quá khứ, hành động nào xảy ra TRƯỚC sẽ chia ở Quá khứ hoàn thành (had + V3/ed), hành động nào xảy ra SAU sẽ chia ở Quá khứ đơn (V2/ed).",
      "functions": [
        {
          "title": "1. Hành động hoàn tất trước một mốc thời gian quá khứ",
          "explanation": "Trước một thời điểm quá khứ, sự việc đã xong xuôi.",
          "exampleEn": "By 10:00 PM last night, she had finished all pronunciation tasks.",
          "exampleVi": "Trước 10 giờ tối qua, cô ấy đã hoàn thành tất cả nhiệm vụ phát âm."
        },
        {
          "title": "2. Phối hợp Before / After / By the time",
          "explanation": "Before + Quá khứ đơn, Had + V3/ed; After + Had + V3/ed, Quá khứ đơn.",
          "exampleEn": "After the teacher had explained the mouth model, the students recorded their audio.",
          "exampleVi": "Sau khi giáo viên đã giải thích mô hình miệng, các sinh viên mới thu âm giọng nói."
        }
      ],
      "tableHeaders": [
        "Liên từ thời gian",
        "Mệnh đề đi kèm",
        "Mệnh đề còn lại",
        "Ví dụ"
      ],
      "tableRows": [
        [
          "Before (Trước khi)",
          "Quá khứ đơn (Hành động sau)",
          "Quá khứ hoàn thành (Hành động trước)",
          "Before the test started, he had reviewed all notes."
        ],
        [
          "After (Sau khi)",
          "Quá khứ hoàn thành (Hành động trước)",
          "Quá khứ đơn (Hành động sau)",
          "After they had finished dinner, they practiced."
        ],
        [
          "By the time (Vào lúc)",
          "Quá khứ đơn (Mốc quá khứ)",
          "Quá khứ hoàn thành (Đã xong trước đó)",
          "By the time she arrived, the webinar had ended."
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Khẳng định (+)",
          "formula": "S + had + V3/ed",
          "example": "She had verified her audio settings before she submitted the final test."
        },
        {
          "form": "negative",
          "label": "Phủ định (-)",
          "formula": "S + had not (hadn't) + V3/ed",
          "example": "The team had not encountered that acoustic distortion until yesterday."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "Had + S + V3/ed + before + Past Simple?",
          "example": "Had you ever practiced phonetic shadowing before joining Lingora?"
        }
      ],
      "detectionClues": [
        "Các từ nối thứ tự: By the time, before, after, as soon as, prior to."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "The student had already mastered the consonant chart before taking the gate test.",
          "meaning": "Sinh viên đã làm chủ bảng phụ âm trước khi bước vào bài kiểm tra cổng.",
          "tokens": [
            {
              "word": "The student",
              "role": "subject",
              "label": "Chủ ngữ [S]",
              "explanation": "Sinh viên"
            },
            {
              "word": "had already mastered",
              "role": "verb",
              "label": "Động từ Quá khứ hoàn thành",
              "explanation": "had + V3"
            },
            {
              "word": "the consonant chart",
              "role": "object",
              "label": "Tân ngữ [O]",
              "explanation": "Bảng phụ âm"
            },
            {
              "word": "before taking the gate test",
              "role": "adverb",
              "label": "Trạng từ thời gian [Adv]",
              "explanation": "Trước khi thi cổng"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "past-perfect-continuous",
    "milestone": "MỐC 3 (B1)",
    "category": "Các Thì",
    "bandTarget": "Band 4.5 - 5.5",
    "shortDesc": "Thì Quá khứ hoàn thành tiếp diễn: Quá trình liên tục kéo dài trước một sự kiện quá khứ",
    "masterclass": {
      "title": "Quá Khứ Hoàn Thành Tiếp Diễn (Past Perfect Continuous)",
      "tagline": "Nhấn mạnh tính bền bỉ kéo dài của hành động cho đến khi một sự việc quá khứ khác diễn ra",
      "coreConcept": "Thì Quá khứ hoàn thành tiếp diễn (had been + V-ing) diễn tả một hành động đã bắt đầu và diễn ra liên tục suốt một khoảng thời gian trong quá khứ trước khi một hành động/thời điểm khác trong quá khứ chen vào, hoặc dùng để giải thích nguyên nhân của một trạng thái trong quá khứ.",
      "functions": [
        {
          "title": "1. Nhấn mạnh khoảng thời gian kéo dài liên tục trước mốc quá khứ",
          "explanation": "Hành động diễn ra liên tục cho đến khi một sự việc khác xảy đến.",
          "exampleEn": "He had been practicing the dental fricative for two hours before he felt satisfied.",
          "exampleVi": "Anh ấy đã liên tục luyện âm xát răng suốt hai tiếng đồng hồ trước khi cảm thấy hài lòng."
        },
        {
          "title": "2. Giải thích nguyên nhân của một trạng thái hoặc kết quả quá khứ",
          "explanation": "Lý do dẫn đến cảm giác hoặc tình trạng ở quá khứ.",
          "exampleEn": "Her throat was sore because she had been recording continuously without water.",
          "exampleVi": "Cổ họng cô ấy bị rát vì cô ấy đã liên tục thu âm mà không uống nước."
        }
      ],
      "tableHeaders": [
        "Chủ ngữ",
        "Trợ động từ cố định",
        "Động từ chính (V-ing)",
        "Ví dụ"
      ],
      "tableRows": [
        [
          "Tất cả các ngôi (I/He/She/We/They)",
          "had been",
          "practicing, analyzing, listening",
          "They had been collaborating for months before launch."
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Khẳng định (+)",
          "formula": "S + had been + V-ing + (for + time) + before + Past Simple",
          "example": "The linguist had been studying regional pitch variations for years before publishing the paper."
        },
        {
          "form": "negative",
          "label": "Phủ định (-)",
          "formula": "S + had not been + V-ing",
          "example": "The student had not been sleeping well because she had been cramming for the test."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "Had + S + been + V-ing + before + Past Simple?",
          "example": "How long had you been practicing before you noticed the vocal fatigue?"
        }
      ],
      "detectionClues": [
        "Cụm thời gian kéo dài trong quá khứ: for + khoảng thời gian + before + Quá khứ đơn.",
        "Kết quả để lại trong quá khứ: was exhausted, was breathless, was sore."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "The candidate had been practicing intonation contours for hours before the mentor arrived.",
          "meaning": "Thí sinh đã liên tục luyện các đường nét ngữ điệu suốt hàng giờ trước khi người hướng dẫn đến.",
          "tokens": [
            {
              "word": "The candidate",
              "role": "subject",
              "label": "Chủ ngữ [S]",
              "explanation": "Thí sinh"
            },
            {
              "word": "had been practicing",
              "role": "verb",
              "label": "Quá khứ hoàn thành tiếp diễn",
              "explanation": "had been + V-ing"
            },
            {
              "word": "intonation contours",
              "role": "object",
              "label": "Tân ngữ [O]",
              "explanation": "Đường nét ngữ điệu"
            },
            {
              "word": "for hours before the mentor arrived",
              "role": "adverb",
              "label": "Cụm trạng từ thời gian kép",
              "explanation": "Khoảng thời gian liên tục trước khi mentor đến"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "future-continuous",
    "milestone": "MỐC 3 (B1)",
    "category": "Các Thì",
    "bandTarget": "Band 4.5 - 5.5",
    "shortDesc": "Thì Tương lai tiếp diễn: Hành động đang diễn ra tại thời điểm xác định trong tương lai",
    "masterclass": {
      "title": "Thì Tương Lai Tiếp Diễn (Future Continuous: Will Be + V-ing)",
      "tagline": "Hình dung chuyển động đang diễn ra tại một thời khắc xác định trong tương lai",
      "coreConcept": "Thì Tương lai tiếp diễn (will be + V-ing) dùng để diễn tả một hành động sẽ đang diễn ra tại một thời điểm hoặc một khoảng thời gian cụ thể trong tương lai. Nó cũng dùng để hỏi lịch trình một cách lịch sự.",
      "functions": [
        {
          "title": "1. Hành động đang xảy ra tại một thời điểm xác định trong tương lai",
          "explanation": "Vào đúng giờ này ngày mai, sự việc sẽ đang trong tiến trình.",
          "exampleEn": "At 10:00 AM tomorrow, I will be presenting my phonetic findings to the cohort.",
          "exampleVi": "Lúc 10:00 sáng mai, tôi sẽ đang thuyết trình các phát hiện ngữ âm của mình trước nhóm."
        },
        {
          "title": "2. Hỏi thăm kế hoạch một cách lịch sự, nhã nhặn",
          "explanation": "Tránh tạo áp lực cho người nghe so với câu hỏi trực tiếp.",
          "exampleEn": "Will you be using the acoustic lab studio this afternoon?",
          "exampleVi": "Chiều nay bạn có dự định sử dụng phòng lab âm học không?"
        }
      ],
      "tableHeaders": [
        "Chủ ngữ",
        "Cấu trúc Khẳng định",
        "Cấu trúc Phủ định",
        "Ví dụ"
      ],
      "tableRows": [
        [
          "Tất cả các ngôi (I / You / He / She / They)",
          "will be + V-ing",
          "will not (won't) be + V-ing",
          "She will be studying at 8 PM tonight."
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Khẳng định (+)",
          "formula": "S + will be + V-ing + (at + specific future time)",
          "example": "By this time tomorrow, the cohort will be analyzing their acoustic test charts."
        },
        {
          "form": "negative",
          "label": "Phủ định (-)",
          "formula": "S + will not (won't) be + V-ing",
          "example": "We won't be holding any live webinars during the milestone review week."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "Will + S + be + V-ing?",
          "example": "What will you be doing at 8:00 PM this evening?"
        }
      ],
      "detectionClues": [
        "Mốc thời gian xác định trong tương lai: at this time tomorrow, at 9 AM next Monday, at this moment next year.",
        "Hai hành động song song tương lai: While S + V (hiện tại đơn), S + will be + V-ing."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "At nine tomorrow morning, the researcher will be calibrating the speech analyzer.",
          "meaning": "Lúc 9 giờ sáng mai, nhà nghiên cứu sẽ đang hiệu chỉnh máy phân tích giọng nói.",
          "tokens": [
            {
              "word": "At nine tomorrow morning",
              "role": "adverb",
              "label": "Trạng từ thời điểm tương lai [Adv]",
              "explanation": "Thời điểm cụ thể tương lai"
            },
            {
              "word": "the researcher",
              "role": "subject",
              "label": "Chủ ngữ [S]",
              "explanation": "Nhà nghiên cứu"
            },
            {
              "word": "will be calibrating",
              "role": "verb",
              "label": "Động từ Tương lai tiếp diễn",
              "explanation": "will be + V-ing"
            },
            {
              "word": "the speech analyzer",
              "role": "object",
              "label": "Tân ngữ [O]",
              "explanation": "Máy phân tích giọng nói"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "relative-clauses-cohesion",
    "milestone": "MỐC 3 (B1)",
    "category": "Mệnh Đề & Liên Từ",
    "bandTarget": "Band 4.5 - 5.5",
    "shortDesc": "Mệnh đề quan hệ: Nối câu mạch lạc và tăng điểm Cohesion",
    "masterclass": {
      "title": "Mệnh Đề Quan Hệ (Relative Clauses: Who, Which, That, Where)",
      "tagline": "Gắn kết ý tưởng mạch lạc, tạo câu phức học thuật và nâng band điểm Cohesion",
      "coreConcept": "Mệnh đề quan hệ bổ nghĩa cho danh từ đứng trước nó, giúp gộp hai câu đơn thành một câu phức tinh gọn mà không làm ngắt quãng dòng suy nghĩ của người đọc. Đây là tiêu chí then chốt để đạt band 6.0+ tiêu chí Grammatical Range.",
      "functions": [
        {
          "title": "1. Bổ nghĩa cho người (Who / Whom / Whose)",
          "explanation": "Cung cấp thông tin nhận diện về đối tượng người được nhắc đến.",
          "exampleEn": "The mentor who reviewed my spoken responses offered actionable advice.",
          "exampleVi": "Người hướng dẫn, người đã xem xét bài nói của tôi, đã đưa ra lời khuyên rất hữu ích."
        },
        {
          "title": "2. Bổ nghĩa cho sự vật hoặc hiện tượng (Which / That)",
          "explanation": "Mô tả chi tiết phương pháp, công cụ hoặc khái niệm khoa học.",
          "exampleEn": "The interactive vowel chart which Lingora provides makes phonetics tangible.",
          "exampleVi": "Bảng nguyên âm tương tác mà Lingora cung cấp giúp ngữ âm trở nên dễ hình dung."
        }
      ],
      "tableHeaders": [
        "Đại từ quan hệ",
        "Đối tượng thay thế",
        "Vai trò ngữ pháp",
        "Ví dụ"
      ],
      "tableRows": [
        [
          "Who",
          "Người",
          "Chủ ngữ hoặc tân ngữ",
          "The student who scored 8.0 on speaking."
        ],
        [
          "Which",
          "Sự vật, sự việc, hiện tượng",
          "Chủ ngữ hoặc tân ngữ",
          "The technique which saved my pronunciation."
        ],
        [
          "That",
          "Người hoặc vật (mệnh đề xác định)",
          "Chủ ngữ hoặc tân ngữ",
          "The lessons that require 100% mastery."
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Khẳng định (+)",
          "formula": "Noun + [Relative Pronoun + Clause] + Main Verb",
          "example": "Students who adopt deliberate practice methods achieve effortless clarity."
        },
        {
          "form": "negative",
          "label": "Phủ định trong mệnh đề quan hệ (-)",
          "formula": "Noun + [who / which + do not / did not + V-bare] + Main Verb",
          "example": "Learners who do not rush through foundational gates develop superior stamina."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "Is the mentor who recorded this tutorial available for consultation?",
          "example": "Is the curriculum that focuses on phonetics suitable for total beginners?"
        }
      ],
      "detectionClues": [
        "Vị trí: Đứng ngay sau danh từ mà nó bổ nghĩa.",
        "Sự hiện diện của các đại từ liên kết: who, whom, which, that, whose, where, when."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "Students who adopt deliberate practice methods achieve effortless clarity.",
          "meaning": "Những học viên áp dụng các phương pháp luyện tập có chủ đích sẽ đạt được sự rõ ràng nhẹ nhàng.",
          "tokens": [
            {
              "word": "Students who adopt deliberate practice methods",
              "role": "subject",
              "label": "Chủ ngữ phức [S + Clause]",
              "explanation": "Cụm danh từ mở rộng"
            },
            {
              "word": "achieve",
              "role": "verb",
              "label": "Động từ chính [V]",
              "explanation": "Động từ chính"
            },
            {
              "word": "effortless clarity",
              "role": "object",
              "label": "Tân ngữ [O]",
              "explanation": "Sự rõ ràng"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "reported-speech-indirect",
    "milestone": "MỐC 3 (B1)",
    "category": "Cấu Trúc Câu",
    "bandTarget": "Band 4.5 - 5.5",
    "shortDesc": "Câu gián tiếp (Reported Speech): Quy tắc lùi thì, chuyển đổi đại từ và trạng từ",
    "masterclass": {
      "title": "Câu Gián Tiếp & Thuật Lại Lời Nói (Reported Speech)",
      "tagline": "Kỹ năng tường thuật thông tin, đối thoại và trích dẫn trong văn phong học thuật",
      "coreConcept": "Câu gián tiếp dùng để thuật lại lời nói của người khác mà không giữ nguyên từng từ như trong dấu ngoặc kép. Ba quy tắc vàng khi chuyển đổi: 1) Lùi thì; 2) Đổi đại từ tương ứng; 3) Đổi trạng từ chỉ thời gian và nơi chốn.",
      "functions": [
        {
          "title": "1. Thuật lại câu trần thuật (Statements)",
          "explanation": "Dùng say (that) hoặc tell someone (that).",
          "exampleEn": "She said that she had passed the A1 milestone test.",
          "exampleVi": "Cô ấy nói rằng cô ấy đã vượt qua bài kiểm tra mốc A1."
        },
        {
          "title": "2. Thuật lại câu hỏi (Wh-questions & Yes/No questions)",
          "explanation": "Dùng ask / wonder. Chuyển trật tự câu hỏi về trật tự câu khẳng định (S + V).",
          "exampleEn": "The mentor asked me if I was satisfied with my audio recording.",
          "exampleVi": "Người hướng dẫn hỏi tôi liệu tôi có hài lòng với bản ghi âm của mình không."
        }
      ],
      "tableHeaders": [
        "Câu trực tiếp (Direct)",
        "Câu gián tiếp (Reported)",
        "Biến đổi ngữ pháp"
      ],
      "tableRows": [
        [
          "Hiện tại đơn (is / am / are)",
          "Quá khứ đơn (was / were)",
          "Lùi một thì về quá khứ"
        ],
        [
          "Quá khứ đơn (saw / took)",
          "Quá khứ hoàn thành (had seen / had taken)",
          "Lùi về Quá khứ hoàn thành"
        ],
        [
          "Now / Today / Tomorrow",
          "Then / That day / The following day",
          "Chuyển đổi trạng từ thời gian"
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Thuật lại khẳng định (+)",
          "formula": "S + said (that) / told + Object + (that) + S + Past Verb",
          "example": "The examiner stated that pronunciation clarity carried substantial weight."
        },
        {
          "form": "negative",
          "label": "Thuật lại lời khuyên không làm gì (-)",
          "formula": "S + advised + Object + not to + V-bare",
          "example": "The tutor advised the learner not to rush through phonetic drills."
        },
        {
          "form": "interrogative",
          "label": "Thuật lại câu hỏi Yes/No (?)",
          "formula": "S + asked + Object + if / whether + S + Past Verb",
          "example": "She asked whether the microphone setting was optimal for the test."
        }
      ],
      "detectionClues": [
        "Động từ tường thuật: said, told, explained, confirmed, stated, asked.",
        "Cú pháp câu hỏi gián tiếp KHÔNG đảo ngữ."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "The instructor explained that acoustic resonance was crucial for long vowels.",
          "meaning": "Giảng viên đã giải thích rằng độ vang âm học đóng vai trò thiết yếu cho các nguyên âm dài.",
          "tokens": [
            {
              "word": "The instructor",
              "role": "subject",
              "label": "Chủ ngữ [S]",
              "explanation": "Giảng viên"
            },
            {
              "word": "explained",
              "role": "verb",
              "label": "Động từ tường thuật",
              "explanation": "Đã giải thích"
            },
            {
              "word": "that acoustic resonance was crucial for long vowels",
              "role": "object",
              "label": "Mệnh đề danh từ",
              "explanation": "Nội dung tường thuật"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "gerunds-and-infinitives",
    "milestone": "MỐC 3 (B1)",
    "category": "Cấu Trúc Câu",
    "bandTarget": "Band 4.5 - 5.5",
    "shortDesc": "Danh động từ (V-ing) & Động từ nguyên thể (To-V): Phân biệt ngữ nghĩa",
    "masterclass": {
      "title": "Danh Động Từ & Động Từ Nguyên Thể (Gerunds vs Infinitives)",
      "tagline": "Làm chủ quy tắc chọn V-ing hay To-V sau các động từ và giới từ tiếng Anh",
      "coreConcept": "Sau một động từ, động từ thứ hai có thể ở dạng V-ing (Gerund) hoặc To-V (Infinitive). Nguyên tắc chung: V-ing thường mang nghĩa trải nghiệm thực tế hoặc thói quen đã qua; To-V thường mang tính mục đích hoặc hướng tới tương lai. Ngoài ra, sau MỌI GIỚI TỪ bắt buộc phải là V-ing.",
      "functions": [
        {
          "title": "1. Động từ luôn đi với V-ing (Enjoy, Avoid, Practice, Consider, Suggest)",
          "explanation": "Chỉ các hành động trải nghiệm, né tránh hoặc đề xuất.",
          "exampleEn": "She enjoys practicing pronunciation with acoustic feedback.",
          "exampleVi": "Cô ấy thích thú việc luyện phát âm với phản hồi âm học."
        },
        {
          "title": "2. Động từ luôn đi với To-V (Decide, Plan, Hope, Promise, Refuse)",
          "explanation": "Chỉ mục tiêu, quyết định và kỳ vọng tương lai.",
          "exampleEn": "They decided to master the 44 phonemes within one month.",
          "exampleVi": "Họ quyết định làm chủ 44 âm vị trong vòng một tháng."
        }
      ],
      "tableHeaders": [
        "Động từ chính",
        "Đi với V-ing",
        "Đi với To-V",
        "Sự khác biệt nghĩa"
      ],
      "tableRows": [
        [
          "Stop",
          "Stop smoking (Bỏ thuốc lá hẳn)",
          "Stop to smoke (Dừng lại để hút thuốc)",
          "Chấm dứt thói quen vs Dừng tạm thời để làm gì"
        ],
        [
          "Remember",
          "Remember meeting (Nhớ đã gặp)",
          "Remember to meet (Nhớ phải gặp)",
          "Hồi ức quá khứ vs Nhiệm vụ tương lai"
        ],
        [
          "Try",
          "Try doing (Thử cách mới)",
          "Try to do (Nỗ lực gắng sức)",
          "Thử nghiệm vs Cố gắng hết sức"
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Mục đích với To-V (+)",
          "formula": "Subject + Verb + to + V-bare",
          "example": "Learners aim to achieve 100% mastery before progressing."
        },
        {
          "form": "negative",
          "label": "Phủ định với V-ing (-)",
          "formula": "Subject + avoid / prevent + V-ing",
          "example": "We avoid guessing pronunciation without checking phonetic transcripts."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "Do you prefer practicing alone or studying in a group?",
          "example": "Would you like to review the dental fricative video again?"
        }
      ],
      "detectionClues": [
        "Sau TẤT CẢ các giới từ (in, on, at, about, with, without, of, for, by...) LUÔN LUÔN là V-ing."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "Dedicated students commit to practicing daily without compromising accuracy.",
          "meaning": "Những sinh viên tận tâm cam kết luyện tập mỗi ngày mà không làm tổn hại đến sự chính xác.",
          "tokens": [
            {
              "word": "Dedicated students",
              "role": "subject",
              "label": "Chủ ngữ [S]",
              "explanation": "Sinh viên tận tâm"
            },
            {
              "word": "commit to practicing",
              "role": "verb",
              "label": "Động từ + to + V-ing",
              "explanation": "Cam kết luyện tập"
            },
            {
              "word": "daily",
              "role": "adverb",
              "label": "Trạng từ [Adv]",
              "explanation": "Hàng ngày"
            },
            {
              "word": "without compromising accuracy",
              "role": "adverb",
              "label": "Giới từ without + V-ing",
              "explanation": "Không giảm độ chính xác"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "future-perfect",
    "milestone": "MỐC 4 (B2)",
    "category": "Các Thì",
    "bandTarget": "Band 5.5 - 6.5+",
    "shortDesc": "Thì Tương lai hoàn thành: Sự việc hoàn tất trước một thời điểm hoặc hành động tương lai",
    "masterclass": {
      "title": "Thì Tương Lai Hoàn Thành (Future Perfect: Will Have + V3/ed)",
      "tagline": "Vũ khí mạnh mẽ để cam kết mục tiêu, dự báo kỳ hạn và lập luận lộ trình",
      "coreConcept": "Thì Tương lai hoàn thành (will have + V3/ed) dùng để diễn tả một hành động sẽ hoàn tất TRƯỚC một mốc thời gian hoặc một hành động khác trong tương lai. Đây là thì rất hay xuất hiện trong IELTS Writing Task 1 (dự báo biểu đồ) và Task 2 (đặt mục tiêu chính sách).",
      "functions": [
        {
          "title": "1. Hành động hoàn tất trước một thời điểm tương lai xác định",
          "explanation": "Đi kèm với \"By + mốc thời gian tương lai\" (By 2030, By next week).",
          "exampleEn": "By December 2026, the Lingora project will have published over 50 interactive labs.",
          "exampleVi": "Trước tháng 12 năm 2026, dự án Lingora sẽ hoàn thành xuất bản hơn 50 phòng lab tương tác."
        },
        {
          "title": "2. Phối hợp với mệnh đề hiện tại đơn (By the time + S + V-s/es)",
          "explanation": "Hành động trong mệnh đề By the time chia hiện tại đơn; mệnh đề chính chia Tương lai hoàn thành.",
          "exampleEn": "By the time you sit the IELTS exam, you will have mastered all 44 phonemes.",
          "exampleVi": "Vào lúc bạn bước vào kỳ thi IELTS, bạn sẽ đã làm chủ trọn vẹn 44 âm vị."
        }
      ],
      "tableHeaders": [
        "Mốc thời gian tương lai",
        "Công thức Tương lai hoàn thành",
        "Dạng phủ định",
        "Ví dụ thực tế"
      ],
      "tableRows": [
        [
          "By + Năm / Tháng tương lai",
          "S + will have + V3/ed",
          "will not (won't) have + V3/ed",
          "By next month, I will have finished Level 2."
        ],
        [
          "By the time + Hiện tại đơn",
          "S + will have + V3/ed",
          "will not (won't) have + V3/ed",
          "By the time classes resume, we will have built the module."
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Khẳng định (+)",
          "formula": "S + will have + V3/ed + by + [Future Point]",
          "example": "By next Friday, the learner will have completed all three foundational gate tests."
        },
        {
          "form": "negative",
          "label": "Phủ định (-)",
          "formula": "S + will not (won't) have + V3/ed",
          "example": "We will not have finalized the cohort grades until the third assessor verifies the recordings."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "Will + S + have + V3/ed + by + [Future Point]?",
          "example": "Will you have achieved 100% mastery by the end of this sprint?"
        }
      ],
      "detectionClues": [
        "Dấu hiệu kinh điển: By + thời gian tương lai (by tomorrow, by 2030, by next week).",
        "Liên từ thời gian: By the time S + V (hiện tại đơn), S + will have + V3/ed."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "By the end of the semester, dedicated candidates will have achieved flawless articulatory precision.",
          "meaning": "Trước khi học kỳ kết thúc, các thí sinh tận tâm sẽ đã đạt được độ chuẩn xác phát âm hoàn hảo.",
          "tokens": [
            {
              "word": "By the end of the semester",
              "role": "adverb",
              "label": "Trạng từ thời điểm tương lai [By + Time]",
              "explanation": "Mốc hạn định"
            },
            {
              "word": "dedicated candidates",
              "role": "subject",
              "label": "Chủ ngữ [S]",
              "explanation": "Thí sinh tận tâm"
            },
            {
              "word": "will have achieved",
              "role": "verb",
              "label": "Động từ Tương lai hoàn thành",
              "explanation": "will have + V3"
            },
            {
              "word": "flawless articulatory precision",
              "role": "object",
              "label": "Tân ngữ [O]",
              "explanation": "Độ chính xác phát âm không tì vết"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "future-perfect-continuous",
    "milestone": "MỐC 4 (B2)",
    "category": "Các Thì",
    "bandTarget": "Band 5.5 - 6.5+",
    "shortDesc": "Thì Tương lai hoàn thành tiếp diễn: Nhấn mạnh thời lượng kéo dài tính đến một mốc tương lai",
    "masterclass": {
      "title": "Tương Lai Hoàn Thành Tiếp Diễn (Future Perfect Continuous)",
      "tagline": "Nhấn mạnh sự bền bỉ không ngừng nghỉ và cột mốc thời lượng đáng tự hào",
      "coreConcept": "Thì Tương lai hoàn thành tiếp diễn (will have been + V-ing) dùng để nhấn mạnh tính liên tục của một hành động đã diễn ra và sẽ kéo dài cho đến một mốc thời điểm cụ thể trong tương lai. Thì này luôn đi kèm với cụm từ chỉ thời lượng (for + khoảng thời gian) tính đến mốc đó.",
      "functions": [
        {
          "title": "1. Nhấn mạnh kỷ niệm hoặc thời lượng tích lũy tính đến mốc tương lai",
          "explanation": "Tính xem một hành động đã duy trì được bao lâu tính tới thời điểm đó.",
          "exampleEn": "By next month, she will have been teaching phonetics for exactly ten years.",
          "exampleVi": "Tính đến tháng tới, cô ấy sẽ đã và đang giảng dạy ngữ âm được tròn 10 năm."
        },
        {
          "title": "2. Nêu bật sự kiên trì bền bỉ trong các bài luận học thuật",
          "explanation": "Nhấn mạnh nỗ lực không ngừng nghỉ của một tập thể hoặc cá nhân.",
          "exampleEn": "By graduation, the students will have been practicing deliberate speech daily for three years.",
          "exampleVi": "Tính đến lúc tốt nghiệp, các sinh viên sẽ đã duy trì việc luyện nói có chủ đích mỗi ngày suốt 3 năm."
        }
      ],
      "tableHeaders": [
        "Chủ ngữ",
        "Cấu trúc hoàn thành tiếp diễn",
        "Cụm thời lượng bắt buộc",
        "Ví dụ"
      ],
      "tableRows": [
        [
          "Tất cả các ngôi",
          "will have been + V-ing",
          "for + [khoảng thời gian]",
          "By 2028, we will have been developing this lab for five years."
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Khẳng định (+)",
          "formula": "By [Future Time], S + will have been + V-ing + (for + duration)",
          "example": "By this autumn, the team will have been refining acoustic algorithms for two full years."
        },
        {
          "form": "negative",
          "label": "Phủ định (-)",
          "formula": "S + will not (won't) have been + V-ing",
          "example": "He will not have been working here long enough to qualify for sabbatical leave by then."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "How long + will + S + have been + V-ing + by [Future Point]?",
          "example": "How long will you have been preparing for IELTS by the time you take the actual test?"
        }
      ],
      "detectionClues": [
        "Sự kết hợp giữa 2 yếu tố: \"By + mốc tương lai\" VÀ \"for + khoảng thời gian\".",
        "Nếu không có \"for + thời lượng\", người ta thường dùng Tương lai hoàn thành đơn."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "By next spring, the linguist will have been researching vowel shifts for a decade.",
          "meaning": "Tính đến mùa xuân tới, nhà ngôn ngữ học sẽ đã và đang nghiên cứu sự dịch chuyển nguyên âm suốt một thập kỷ.",
          "tokens": [
            {
              "word": "By next spring",
              "role": "adverb",
              "label": "Trạng từ mốc tương lai",
              "explanation": "Thời điểm đo lường"
            },
            {
              "word": "the linguist",
              "role": "subject",
              "label": "Chủ ngữ [S]",
              "explanation": "Nhà ngôn ngữ học"
            },
            {
              "word": "will have been researching",
              "role": "verb",
              "label": "Tương lai hoàn thành tiếp diễn",
              "explanation": "will have been + V-ing"
            },
            {
              "word": "vowel shifts",
              "role": "object",
              "label": "Tân ngữ [O]",
              "explanation": "Sự dịch chuyển nguyên âm"
            },
            {
              "word": "for a decade",
              "role": "adverb",
              "label": "Cụm thời lượng [For + Period]",
              "explanation": "Suốt một thập kỷ"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "tenses-timeline-mastery",
    "milestone": "MỐC 4 (B2)",
    "category": "Các Thì",
    "bandTarget": "Band 5.5 - 6.5+",
    "shortDesc": "Bản đồ ma trận 12 thì & Quy tắc phối thì (Sequence of Tenses)",
    "masterclass": {
      "title": "Bản Đồ Ma Trận 12 Thì & Quy Tắc Phối Thì (Sequence of Tenses)",
      "tagline": "Làm chủ toàn phổ 12 thì tiếng Anh trên một trục không - thời gian duy nhất",
      "coreConcept": "Tiếng Anh có chính xác 12 thì cơ bản, tạo bởi tích của 3 Chiều Thời Gian (Past - Quá khứ, Present - Hiện tại, Future - Tương lai) và 4 Thể Thức (Simple - Đơn, Continuous - Tiếp diễn, Perfect - Hoàn thành, Perfect Continuous - Hoàn thành tiếp diễn). Quy tắc phối thì (Sequence of Tenses) chỉ ra cách các thì liên kết hài hòa trong câu phức.",
      "functions": [
        {
          "title": "1. Quy tắc trục thời gian: Đơn vs Tiếp diễn vs Hoàn thành vs Hoàn thành tiếp diễn",
          "explanation": "Đơn (sự thật, thói quen) -> Tiếp diễn (đang diễn ra) -> Hoàn thành (xong trước mốc) -> HT tiếp diễn (kéo dài liên tục đến mốc).",
          "exampleEn": "Understanding the 4 aspects across 3 timelines prevents 95% of grammatical confusion.",
          "exampleVi": "Thấu hiểu 4 thể thức trên 3 trục thời gian giúp loại bỏ 95% sự nhầm lẫn ngữ pháp."
        },
        {
          "title": "2. Quy tắc phối thì kinh điển trong câu phức",
          "explanation": "Mệnh đề chính ở Hiện tại -> Mệnh đề phụ dùng thì bất kỳ theo ngữ cảnh; Mệnh đề chính ở Quá khứ -> Mệnh đề phụ BẮT BUỘC lùi về quá khứ.",
          "exampleEn": "She told me that she was studying (not: is studying) phonetics.",
          "exampleVi": "Cô ấy đã bảo với tôi rằng cô ấy đang học ngữ âm."
        }
      ],
      "tableHeaders": [
        "Thể thức / Trục thời gian",
        "Quá khứ (Past)",
        "Hiện tại (Present)",
        "Tương lai (Future)"
      ],
      "tableRows": [
        [
          "Đơn (Simple)",
          "V2/ed (did, played)",
          "V(s/es) (do, plays)",
          "will + V-bare (will play)"
        ],
        [
          "Tiếp diễn (Continuous)",
          "was/were + V-ing",
          "am/is/are + V-ing",
          "will be + V-ing"
        ],
        [
          "Hoàn thành (Perfect)",
          "had + V3/ed",
          "have/has + V3/ed",
          "will have + V3/ed"
        ],
        [
          "Hoàn thành tiếp diễn (Perf. Cont.)",
          "had been + V-ing",
          "have/has been + V-ing",
          "will have been + V-ing"
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Phối thì Quá khứ (+)",
          "formula": "Main Clause (Past) + Subordinate Clause (Past / Past Perfect)",
          "example": "The examiner observed that the student had practiced the vowel chart with great discipline."
        },
        {
          "form": "negative",
          "label": "Phối thì Tương lai (-)",
          "formula": "When S + V (Present Simple), S + will not + V-bare",
          "example": "When the timer expires, the submission portal will not accept additional takes."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn tổng hợp (?)",
          "formula": "Had you realized that all 12 tenses stem from only four core aspects?",
          "example": "Can you map any given sentence onto the 3x4 timeline grid effortlessly?"
        }
      ],
      "detectionClues": [
        "Nhận biết Thể: Đơn = sự thật; Tiếp diễn = đang diễn ra; Hoàn thành = có liên kết mốc thời gian; Hoàn thành tiếp diễn = nhấn mạnh thời lượng kéo dài.",
        "Tuyệt đối không dùng Will / Would trong mệnh đề chỉ thời gian (sau when, before, after, as soon as, until)."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "When researchers analyze temporal acoustic shifts, they discover that phonemic precision governs natural speech rhythm.",
          "meaning": "Khi các nhà nghiên cứu phân tích sự dịch chuyển âm học theo thời gian, họ phát hiện ra rằng độ chuẩn xác âm vị chi phối nhịp điệu nói tự nhiên.",
          "tokens": [
            {
              "word": "When researchers analyze temporal acoustic shifts",
              "role": "adverb",
              "label": "Mệnh đề thời gian [Present Simple]",
              "explanation": "Sự thật khoa học"
            },
            {
              "word": "they",
              "role": "subject",
              "label": "Chủ ngữ chính [S]",
              "explanation": "Họ"
            },
            {
              "word": "discover",
              "role": "verb",
              "label": "Động từ chính [V]",
              "explanation": "Hiện tại đơn"
            },
            {
              "word": "that phonemic precision governs natural speech rhythm",
              "role": "object",
              "label": "Mệnh đề That chân lý bất biến",
              "explanation": "Quy luật tự nhiên"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "conditionals-critical",
    "milestone": "MỐC 4 (B2)",
    "category": "Học Thuật Nâng Cao",
    "bandTarget": "Band 5.5 - 6.5+",
    "shortDesc": "Câu điều kiện hỗn hợp & Giả định luận chứng IELTS 6.5+",
    "masterclass": {
      "title": "Câu Điều Kiện Nâng Cao & Tư Duy Luận Chứng",
      "tagline": "Lập luận đa chiều, dự báo kịch bản và đào sâu nguyên nhân kết quả",
      "coreConcept": "Câu điều kiện kết nối tiền đề (Mệnh đề If) và hệ quả (Mệnh đề chính). Trong IELTS Writing & Speaking 6.5+, câu điều kiện giúp bài nói thể hiện tư duy giả định phức hợp sắc sảo.",
      "functions": [
        {
          "title": "1. Đưa ra giải pháp chính sách (Condition 1 & 2)",
          "explanation": "Dự báo nếu chính quyền hành động thì kết quả tương lai sẽ ra sao.",
          "exampleEn": "If governments invest in renewable energy, emissions will decrease.",
          "exampleVi": "Nếu các chính phủ đầu tư vào năng lượng tái tạo, lượng khí thải sẽ giảm."
        },
        {
          "title": "2. Phản biện quá khứ & Giả định ngược thực tế (Condition 3)",
          "explanation": "Nhìn nhận lại nếu một tiền đề thay đổi trong quá khứ.",
          "exampleEn": "Had the early warning been issued, the impact would have been minimized.",
          "exampleVi": "Nếu cảnh báo sớm được đưa ra, tác động hẳn đã được giảm thiểu tối đa."
        }
      ],
      "tableHeaders": [
        "Loại điều kiện",
        "Mệnh đề If",
        "Mệnh đề chính",
        "Ý nghĩa"
      ],
      "tableRows": [
        [
          "Loại 1 (Thực tế)",
          "If + Hiện tại đơn",
          "S + will + V-bare",
          "Có thể xảy ra ở hiện tại/tương lai"
        ],
        [
          "Loại 2 (Giả định nay)",
          "If + Quá khứ đơn (were)",
          "S + would + V-bare",
          "Trái với thực tế ở hiện tại"
        ],
        [
          "Loại 3 (Giả định xưa)",
          "If + Had + V3/ed",
          "S + would have + V3/ed",
          "Trái với sự thật trong quá khứ"
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Điều kiện loại 2 (+)",
          "formula": "If + S + V2/were, S + would + V-bare",
          "example": "If every learner had access to gentle guidance, fluency would come naturally."
        },
        {
          "form": "negative",
          "label": "Phủ định (-)",
          "formula": "If + S + did not + V-bare, S + would not + V-bare",
          "example": "If we did not isolate pronunciation first, natural rhythm would not emerge."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "What would happen if + S + V2/were?",
          "example": "What would you prioritize if you prepared for IELTS in 6 months?"
        }
      ],
      "detectionClues": [
        "Từ nối điều kiện: If, unless (if not), provided that, as long as.",
        "Động từ khiếm khuyết trong mệnh đề chính: would, could, might."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "If candidates master phonemic awareness, their speech will resonate effortlessly.",
          "meaning": "Nếu thí sinh làm chủ nhận thức âm vị, lời nói của họ sẽ ngân vang tự nhiên không gắng gượng.",
          "tokens": [
            {
              "word": "If candidates master phonemic awareness",
              "role": "adverb",
              "label": "Mệnh đề If [Adv]",
              "explanation": "Mệnh đề điều kiện chỉ tiền đề"
            },
            {
              "word": "their speech",
              "role": "subject",
              "label": "Chủ ngữ chính [S]",
              "explanation": "Giọng nói của họ"
            },
            {
              "word": "will resonate",
              "role": "verb",
              "label": "Động từ chính [V]",
              "explanation": "will + V-bare ngân vang"
            },
            {
              "word": "effortlessly",
              "role": "adverb",
              "label": "Trạng từ [Adv]",
              "explanation": "Một cách tự nhiên không gắng gượng"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "subjunctive-mood",
    "milestone": "MỐC 4 (B2)",
    "category": "Học Thuật Nâng Cao",
    "bandTarget": "Band 5.5 - 6.5+",
    "shortDesc": "Thể giả định học thuật (Subjunctive Mood): Đưa ra khuyến nghị và yêu cầu cấp thiết",
    "masterclass": {
      "title": "Thể Giả Định Trong Văn Phong Học Thuật (Subjunctive Mood)",
      "tagline": "Cấu trúc trang trọng đỉnh cao thể hiện tính cấp thiết, mệnh lệnh và khuyến nghị chính sách",
      "coreConcept": "Thể giả định xuất hiện sau các động từ hoặc tính từ chỉ sự yêu cầu, đề xuất, cấp bách (demand, suggest, recommend, insist, vital, essential, imperative). Trong mệnh đề \"that\", động từ LUÔN ở dạng nguyên thể không chia (V-bare) với mọi chủ ngữ (kể cả He/She/It), hoặc dùng \"should + V-bare\".",
      "functions": [
        {
          "title": "1. Khuyến nghị chính sách hoặc giải pháp (IELTS Writing Task 2)",
          "explanation": "Dùng sau \"recommend that\", \"suggest that\".",
          "exampleEn": "Experts recommend that the government invest heavily in early education.",
          "exampleVi": "Các chuyên gia khuyến nghị rằng chính phủ nên đầu tư mạnh vào giáo dục sớm."
        },
        {
          "title": "2. Nêu bật tính cấp thiết của hành động",
          "explanation": "Dùng sau \"It is essential / crucial / imperative that...\".",
          "exampleEn": "It is imperative that every candidate review the acoustic feedback rubric.",
          "exampleVi": "Điều cấp thiết là mọi thí sinh đều phải xem lại quy chuẩn phản hồi âm học."
        }
      ],
      "tableHeaders": [
        "Từ gợi ý giả định",
        "Cấu trúc mệnh đề That",
        "Dạng động từ",
        "Ví dụ"
      ],
      "tableRows": [
        [
          "suggest, recommend, demand, insist",
          "S1 + suggest that + S2 + (should) V-bare",
          "V-bare (không chia -s/es/ed)",
          "We recommend that he be present."
        ],
        [
          "essential, vital, crucial, imperative",
          "It is vital that + S + (should) V-bare",
          "V-bare (To Be giữ nguyên dạng be)",
          "It is vital that accuracy remain top priority."
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Khẳng định (+)",
          "formula": "It is essential that + S + (should) + V-bare",
          "example": "It is essential that each student verify their microphone before recording."
        },
        {
          "form": "negative",
          "label": "Phủ định (-)",
          "formula": "S1 + insist that + S2 + not + V-bare",
          "example": "The guidelines demand that assessors not overlook subtle vowel distortions."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "Do you recommend that we submit the phonetic portfolio this week?",
          "example": "Is it necessary that the test take place in a quiet environment?"
        }
      ],
      "detectionClues": [
        "Động từ theo sau chủ ngữ số ít nhưng KHÔNG THÊM -S (That he be, that she go).",
        "Các tính từ báo hiệu: crucial, essential, imperative, mandatory, urgent, vital."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "Pedagogical leaders insist that linguistic accuracy remain the foundation of fluency.",
          "meaning": "Các nhà lãnh đạo sư phạm nhấn mạnh rằng độ chính xác ngôn ngữ phải luôn là nền tảng của sự lưu loát.",
          "tokens": [
            {
              "word": "Pedagogical leaders",
              "role": "subject",
              "label": "Chủ ngữ chính [S]",
              "explanation": "Lãnh đạo sư phạm"
            },
            {
              "word": "insist",
              "role": "verb",
              "label": "Động từ chính [V]",
              "explanation": "Nhấn mạnh, đòi hỏi"
            },
            {
              "word": "that linguistic accuracy remain the foundation of fluency",
              "role": "object",
              "label": "Mệnh đề giả định [Subjunctive Clause]",
              "explanation": "remain ở dạng V-bare dù chủ ngữ số ít"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "inversion-emphasis",
    "milestone": "MỐC 4 (B2)",
    "category": "Học Thuật Nâng Cao",
    "bandTarget": "Band 5.5 - 6.5+",
    "shortDesc": "Đảo ngữ học thuật (Inversion): Điểm nhấn trang trọng và nâng cao band",
    "masterclass": {
      "title": "Cấu Trúc Đảo Ngữ Học Thuật (Inversion for Emphasis)",
      "tagline": "Vũ khí tối thượng bứt phá điểm Grammatical Range & Accuracy trong IELTS 6.5 - 8.0",
      "coreConcept": "Đảo ngữ là kỹ thuật đưa trợ động từ lên trước chủ ngữ khi các từ phủ định hoặc hạn định (Not only, Rarely, Seldom, Under no circumstances) đứng ở đầu câu, nhằm tạo sắc thái trang trọng, thuyết phục và nhấn mạnh tối đa ý đồ của tác giả.",
      "functions": [
        {
          "title": "1. Nhấn mạnh mối tương quan song hành tích cực",
          "explanation": "Dùng cụm Not only... but also... để nêu bật hai lợi ích song song cùng lúc.",
          "exampleEn": "Not only does deliberate practice refine pronunciation, but it also bolsters self-confidence.",
          "exampleVi": "Luyện tập có chủ đích không những mài giũa phát âm mà còn củng cố sự tự tin bên trong."
        },
        {
          "title": "2. Nhấn mạnh sự hiếm hoi, tính phi thường",
          "explanation": "Dùng Rarely hoặc Seldom ở đầu câu để nhấn mạnh một hiện tượng hiếm thấy.",
          "exampleEn": "Rarely have researchers observed such profound phonetic adaptation in adults.",
          "exampleVi": "Hiếm khi các nhà nghiên cứu quan sát thấy sự thích ứng ngữ âm sâu sắc đến thế ở người trưởng thành."
        },
        {
          "title": "3. Nhấn mạnh tính tuyệt đối không thỏa hiệp",
          "explanation": "Dùng Under no circumstances để diễn đạt nguyên tắc bắt buộc không thể vi phạm.",
          "exampleEn": "Under no circumstances should linguistic accuracy be sacrificed for sheer speed.",
          "exampleVi": "Trong bất kỳ hoàn cảnh nào, độ chính xác ngôn ngữ cũng không được hy sinh vì tốc độ đơn thuần."
        }
      ],
      "tableHeaders": [
        "Cụm từ đảo ngữ đầu câu",
        "Công thức đảo trợ động từ",
        "Sắc thái học thuật",
        "Ví dụ thực chiến"
      ],
      "tableRows": [
        [
          "Not only... but also...",
          "Not only + Trợ động từ + S + V, but S + also + V",
          "Nhấn mạnh 2 vế tích cực song hành",
          "Not only did he pass the gate, but he also achieved 100% mastery."
        ],
        [
          "Rarely / Seldom",
          "Rarely + Trợ động từ + S + V",
          "Nhấn mạnh sự hiếm thấy",
          "Rarely do adult learners experience zero pronunciation anxiety."
        ],
        [
          "Under no circumstances",
          "Under no circumstances + Trợ động từ + S + V",
          "Nguyên tắc nghiêm ngặt, tuyệt đối",
          "Under no circumstances should you skip pronunciation self-reflection."
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Đảo ngữ Not only (+)",
          "formula": "Not only + Aux (do/does/did/can) + S + V, but S + also + V",
          "example": "Not only does phonemic analysis dismantle anxiety, but it also accelerates lasting fluency."
        },
        {
          "form": "negative",
          "label": "Đảo ngữ tuyệt đối cấm đoán (-)",
          "formula": "Under no circumstances + Aux + S + V",
          "example": "Under no circumstances should pedagogical integrity be compromised."
        },
        {
          "form": "interrogative",
          "label": "Đảo ngữ điều kiện giả định (?)",
          "formula": "Had + S + V3/ed, S + would have + V3/ed",
          "example": "Had they followed the acoustic feedback, the vowel distortion would not have persisted."
        }
      ],
      "detectionClues": [
        "Câu bắt đầu bằng các phó từ phủ định hoặc hạn định: Not only, Never before, Rarely, Seldom, Hardly, Under no circumstances, Only after, Only when.",
        "Trợ động từ đứng TRƯỚC chủ ngữ giống như câu hỏi nhưng kết thúc bằng dấu chấm (.)."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "Not only does phonemic analysis dismantle anxiety, but it also accelerates lasting fluency.",
          "meaning": "Phân tích âm vị không chỉ hóa giải nỗi âu lo mà còn đẩy nhanh sự lưu loát bền vững.",
          "tokens": [
            {
              "word": "Not only does phonemic analysis dismantle anxiety",
              "role": "adverb",
              "label": "Vế Đảo Ngữ [Inverted Clause]",
              "explanation": "Cấu trúc đảo trợ động từ does lên trước chủ ngữ"
            },
            {
              "word": "but it also accelerates lasting fluency",
              "role": "verb",
              "label": "Vế Chính [Main Clause]",
              "explanation": "Mệnh đề song hành"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "cleft-sentences",
    "milestone": "MỐC 4 (B2)",
    "category": "Học Thuật Nâng Cao",
    "bandTarget": "Band 5.5 - 6.5+",
    "shortDesc": "Câu chẻ nhấn mạnh (Cleft Sentences: It is/was... that): Tiêu điểm lập luận",
    "masterclass": {
      "title": "Câu Chẻ Nhấn Mạnh (Cleft Sentences for Laser Focus)",
      "tagline": "Kỹ thuật định hướng sự chú ý của độc giả vào điểm mấu chốt quan trọng nhất",
      "coreConcept": "Câu chẻ (Cleft Sentence) chia tách một câu đơn thành hai mệnh đề để làm nổi bật thành phần trọng tâm (Chủ ngữ, Tân ngữ hoặc Trạng ngữ). Cấu trúc kinh điển nhất là \"It is / was + [Thành phần nhấn mạnh] + that + [Phần còn lại của câu]\".",
      "functions": [
        {
          "title": "1. Nhấn mạnh Chủ ngữ thực hiện hành động",
          "explanation": "Khẳng định chính đối tượng này chứ không phải ai khác tạo ra thành quả.",
          "exampleEn": "It was the relentless phonemic practice that transformed her accent.",
          "exampleVi": "Chính việc luyện tập âm vị bền bỉ mới là điều làm thay đổi hoàn toàn chất giọng của cô ấy."
        },
        {
          "title": "2. Nhấn mạnh Trạng ngữ thời gian hoặc nơi chốn",
          "explanation": "Làm nổi bật điều kiện bối cảnh đặc thù.",
          "exampleEn": "It was only after recording ten takes that he recognized the pitch difference.",
          "exampleVi": "Chỉ sau khi ghi âm tới 10 lần thì anh ấy mới nhận ra sự khác biệt về cao độ."
        }
      ],
      "tableHeaders": [
        "Dạng câu chẻ",
        "Thành phần nhấn mạnh",
        "Công thức",
        "Ví dụ"
      ],
      "tableRows": [
        [
          "It-cleft (Chủ ngữ)",
          "Danh từ / Cụm danh từ",
          "It is / was + Noun + that / who + V",
          "It is deliberate practice that yields mastery."
        ],
        [
          "It-cleft (Trạng ngữ)",
          "Thời gian, địa điểm, phương thức",
          "It is / was + Adverbial + that + S + V",
          "It was in the acoustic lab that they discovered the shift."
        ],
        [
          "Wh-cleft",
          "Hành động hoặc Ý niệm",
          "What S + V + is / was + Noun / Clause",
          "What matters most is phonemic precision."
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Nhấn mạnh It-cleft (+)",
          "formula": "It is / was + [Focus] + that + Clause",
          "example": "It is unwavering consistency that unlocks effortless natural fluency."
        },
        {
          "form": "negative",
          "label": "Phủ định vế đối chiếu (-)",
          "formula": "It is not + [Focus A] + but + [Focus B] + that + Clause",
          "example": "It is not native talent but systematic reflection that guarantees success."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "Was it the dental fricative that caused the lowest acoustic score?",
          "example": "Is it the mouth shape or the breath control that requires calibration?"
        }
      ],
      "detectionClues": [
        "Bắt đầu bằng \"It is / It was\" theo sau là danh từ/trạng từ và liên từ \"that/who\".",
        "Nếu bỏ \"It is ... that\" đi, các từ còn lại vẫn ghép thành một câu hoàn chỉnh về ngữ pháp."
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "It was systematic phonetic training that eradicated persistent pronunciation errors.",
          "meaning": "Chính sự đào tạo ngữ âm có hệ thống đã triệt tiêu hoàn toàn các lỗi phát âm dai dẳng.",
          "tokens": [
            {
              "word": "It was",
              "role": "subject",
              "label": "Cụm mở đầu câu chẻ",
              "explanation": "Kỹ thuật chẻ câu"
            },
            {
              "word": "systematic phonetic training",
              "role": "subject",
              "label": "Trọng tâm nhấn mạnh [Focus]",
              "explanation": "Đào tạo ngữ âm có hệ thống"
            },
            {
              "word": "that eradicated persistent pronunciation errors",
              "role": "verb",
              "label": "Mệnh đề That hoàn tất",
              "explanation": "Đã xóa bỏ các lỗi phát âm dai dẳng"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "reduced-relative-clauses",
    "milestone": "MỐC 4 (B2)",
    "category": "Học Thuật Nâng Cao",
    "bandTarget": "Band 5.5 - 6.5+",
    "shortDesc": "Rút gọn mệnh đề quan hệ & Cụm phân từ (Participle Clauses)",
    "masterclass": {
      "title": "Rút Gọn Mệnh Đề Quan Hệ (Participle Clauses)",
      "tagline": "Kỹ thuật nén thông tin, tối ưu hóa độ súc tích cho bài viết học thuật điểm cao",
      "coreConcept": "Rút gọn mệnh đề quan hệ giúp bài viết trở nên chuyên nghiệp và tinh tế. Quy tắc: Nếu mệnh đề ở thể chủ động -> rút thành V-ing (Present Participle); Nếu mệnh đề ở thể bị động -> rút thành V3/ed (Past Participle); Nếu có số thứ tự (the first, the only) -> rút thành To-V.",
      "functions": [
        {
          "title": "1. Rút gọn chủ động với V-ing",
          "explanation": "The students who participate -> The students participating in the program.",
          "exampleEn": "Candidates preparing for the examination should practice daily.",
          "exampleVi": "Các thí sinh chuẩn bị cho kỳ thi nên luyện tập hàng ngày."
        },
        {
          "title": "2. Rút gọn bị động với V3/ed",
          "explanation": "The method which was designed by mentors -> The method designed by mentors.",
          "exampleEn": "The phonetic data gathered during the trial confirmed the hypothesis.",
          "exampleVi": "Dữ liệu ngữ âm được thu thập trong cuộc thử nghiệm đã xác nhận giả thuyết."
        }
      ],
      "tableHeaders": [
        "Dạng câu đầy đủ",
        "Dạng rút gọn",
        "Loại phân từ",
        "Ví dụ"
      ],
      "tableRows": [
        [
          "Who / Which + Chủ động",
          "V-ing (bỏ đại từ và trợ động từ)",
          "Hiện tại phân từ (Present Participle)",
          "The girl sitting in the corner..."
        ],
        [
          "Who / Which + Bị động (Be + V3)",
          "V3/ed (bỏ đại từ và Be)",
          "Quá khứ phân từ (Past Participle)",
          "The feedback provided by tutors..."
        ],
        [
          "The first / The only + Who/Which",
          "To-V (bỏ đại từ)",
          "Động từ nguyên thể có To",
          "The only student to pass on the first try..."
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Rút gọn chủ động (+)",
          "formula": "Noun + V-ing + (Object) + Main Verb",
          "example": "Learners adopting acoustic feedback protocols advance twice as fast."
        },
        {
          "form": "negative",
          "label": "Rút gọn bị động (+)",
          "formula": "Noun + V3/ed + (by Agent) + Main Verb",
          "example": "Audio files recorded in high definition preserve crucial phonetic frequencies."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn (?)",
          "formula": "Are the samples submitted yesterday being evaluated right now?",
          "example": "Did you review the advice given by the pronunciation specialist?"
        }
      ],
      "detectionClues": [
        "Danh từ đứng cạnh V-ing hoặc V3/ed mà KHÔNG có to be đứng giữa.",
        "Mệnh đề phân từ đứng đầu câu có dấu phẩy: \"Having completed the test, she rested.\""
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "Students utilizing deliberate practice frameworks achieve effortless vocal projection.",
          "meaning": "Những sinh viên vận dụng các khung luyện tập có chủ đích đạt được sự phóng giọng nhẹ nhàng.",
          "tokens": [
            {
              "word": "Students utilizing deliberate practice frameworks",
              "role": "subject",
              "label": "Chủ ngữ nén [Noun + V-ing Phrase]",
              "explanation": "Rút gọn từ Students who utilize..."
            },
            {
              "word": "achieve",
              "role": "verb",
              "label": "Động từ chính [V]",
              "explanation": "Đạt được"
            },
            {
              "word": "effortless vocal projection",
              "role": "object",
              "label": "Tân ngữ [O]",
              "explanation": "Sự phóng giọng tự nhiên"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "advanced-modals-deduction",
    "milestone": "MỐC 4 (B2)",
    "category": "Học Thuật Nâng Cao",
    "bandTarget": "Band 5.5 - 6.5+",
    "shortDesc": "Động từ khuyết thiếu suy đoán trong quá khứ (Past Modals of Deduction)",
    "masterclass": {
      "title": "Suy Đoán Quá Khứ (Must have, Can't have, Could have V3)",
      "tagline": "Phân tích suy luận logic, giải mã nguyên nhân và đánh giá chứng cứ lịch sử",
      "coreConcept": "Khi suy đoán về sự việc đã xảy ra trong quá khứ dựa trên bằng chứng hiện tại, ta dùng Modal Verbs kết hợp với have + V3/ed: \"Must have V3\" (Chắc chắn đã xảy ra, 99%), \"Can't / Couldn't have V3\" (Không thể nào đã xảy ra, 99%), \"Could / Might / May have V3\" (Có thể đã xảy ra, 50%).",
      "functions": [
        {
          "title": "1. Suy đoán chắc chắn về quá khứ (Must have V3)",
          "explanation": "Bằng chứng hiện tại rất rõ ràng khiến ta tin chắc điều đó đã xảy ra.",
          "exampleEn": "Her pronunciation is so natural; she must have practiced extensively.",
          "exampleVi": "Phát âm của cô ấy tự nhiên đến vậy; chắc chắn cô ấy đã luyện tập rất nhiều."
        },
        {
          "title": "2. Bác bỏ khả năng trong quá khứ (Can't have V3)",
          "explanation": "Bằng chứng khẳng định sự việc không thể nào diễn ra như thế.",
          "exampleEn": "He can't have recorded this in a noisy room; the waveform is pristine.",
          "exampleVi": "Anh ấy không thể nào thu âm đoạn này trong phòng ồn được; sóng âm trong vắt."
        },
        {
          "title": "3. Chỉ trích hoặc tiếc nuối trong quá khứ (Should have V3)",
          "explanation": "Lẽ ra nên làm điều gì đó trong quá khứ nhưng đã không làm.",
          "exampleEn": "We should have double-checked the microphone levels before beginning.",
          "exampleVi": "Lẽ ra chúng ta nên kiểm tra lại mức âm lượng micro trước khi bắt đầu."
        }
      ],
      "tableHeaders": [
        "Modal trong quá khứ",
        "Mức độ chắc chắn",
        "Ý nghĩa biểu đạt",
        "Ví dụ"
      ],
      "tableRows": [
        [
          "Must have + V3/ed",
          "99% Chắc chắn",
          "Chắc hẳn là đã xảy ra",
          "She must have noticed the subtle pitch shift."
        ],
        [
          "Can't / Couldn't have + V3/ed",
          "99% Chắc chắn phủ định",
          "Không thể nào đã xảy ra",
          "They couldn't have skipped the foundational gate."
        ],
        [
          "Should have + V3/ed",
          "Trách cứ / Hối tiếc",
          "Lẽ ra đã nên làm (nhưng không làm)",
          "You should have rested before the milestone test."
        ],
        [
          "May / Might / Could have + V3/ed",
          "50% Suy đoán dự trù",
          "Có thể đã xảy ra (chưa rõ thực hư)",
          "He might have misread the phonetic transcription."
        ]
      ],
      "structures": [
        {
          "form": "affirmative",
          "label": "Suy đoán khẳng định (+)",
          "formula": "S + must have + V3/ed",
          "example": "The candidate must have calibrated her voice carefully before the speech exam."
        },
        {
          "form": "negative",
          "label": "Bác bỏ hoàn toàn (-)",
          "formula": "S + can't / couldn't have + V3/ed",
          "example": "The acoustic analyzer couldn't have misidentified the formants."
        },
        {
          "form": "interrogative",
          "label": "Nghi vấn suy đoán (?)",
          "formula": "Could + S + have + V3/ed?",
          "example": "Could the learner have misinterpreted the vowel length rule?"
        }
      ],
      "detectionClues": [
        "Theo sau modal verb là \"have + V3/ed\" (không bao giờ dùng has dù chủ ngữ là he/she/it).",
        "Có câu tiền đề đưa ra bằng chứng hiện tại: \"The lights are off; they must have left.\""
      ],
      "sentenceBreakdowns": [
        {
          "sentence": "The candidate must have analyzed native spectrograms to achieve such acoustic precision.",
          "meaning": "Thí sinh chắc hẳn đã phân tích biểu đồ phổ bản ngữ để đạt được độ chính xác âm học như vậy.",
          "tokens": [
            {
              "word": "The candidate",
              "role": "subject",
              "label": "Chủ ngữ [S]",
              "explanation": "Thí sinh"
            },
            {
              "word": "must have analyzed",
              "role": "verb",
              "label": "Suy đoán quá khứ [Must have + V3]",
              "explanation": "Chắc hẳn đã phân tích"
            },
            {
              "word": "native spectrograms",
              "role": "object",
              "label": "Tân ngữ [O]",
              "explanation": "Biểu đồ phổ giọng bản ngữ"
            },
            {
              "word": "to achieve such acoustic precision",
              "role": "adverb",
              "label": "Cụm chỉ mục đích [To-Infinitive]",
              "explanation": "Để đạt độ chuẩn xác âm học"
            }
          ]
        }
      ]
    }
  }
];

export function GrammarCatalog() {
  const [catalogViewMode, setCatalogViewMode] = useState<'masterclass' | 'comprehensive-tests'>('masterclass');
  const [activeTestSetId, setActiveTestSetId] = useState<string>('set-all-tenses-mastery');
  const [activeTopicId, setActiveTopicId] = useState<string>('to-be-foundation');
  const [selectedMilestone, setSelectedMilestone] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  const activeTopicItemRef = useRef<HTMLButtonElement | null>(null);
  const readingPaneRef = useRef<HTMLDivElement | null>(null);

  const filteredTopics = useMemo(() => {
    return GRAMMAR_TOPICS_CATALOG.filter((t) => {
      // Filter milestone
      if (selectedMilestone !== 'all' && !t.milestone.includes(selectedMilestone)) {
        return false;
      }
      // Filter category
      if (selectedCategory !== 'all' && t.category !== selectedCategory) {
        return false;
      }
      // Filter search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = t.masterclass.title.toLowerCase().includes(query);
        const matchDesc = t.shortDesc.toLowerCase().includes(query);
        const matchTagline = t.masterclass.tagline.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchTagline) return false;
      }
      return true;
    });
  }, [selectedMilestone, selectedCategory, searchQuery]);

  const activeTopic: GrammarTopicItem = useMemo(() => {
    const found = filteredTopics.find((t) => t.id === activeTopicId);
    if (found) return found;
    return filteredTopics[0] ?? GRAMMAR_TOPICS_CATALOG[0]!;
  }, [filteredTopics, activeTopicId]);

  const currentIndex = useMemo(() => {
    return filteredTopics.findIndex((t) => t.id === activeTopic.id);
  }, [filteredTopics, activeTopic.id]);

  const handlePrevTopic = () => {
    if (currentIndex > 0) {
      const prev = filteredTopics[currentIndex - 1];
      if (prev) {
        setActiveTopicId(prev.id);
        readingPaneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleNextTopic = () => {
    if (currentIndex < filteredTopics.length - 1) {
      const next = filteredTopics[currentIndex + 1];
      if (next) {
        setActiveTopicId(next.id);
        readingPaneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleSelectTopic = (id: string, isFromMobile = false) => {
    setActiveTopicId(id);
    if (isFromMobile) {
      setIsMobileDrawerOpen(false);
      readingPaneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Keep active topic scrolled into view inside sidebar
  useEffect(() => {
    if (activeTopicItemRef.current) {
      activeTopicItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeTopic.id]);

  // Keyboard navigation: ArrowLeft and ArrowRight to navigate topics
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
        handlePrevTopic();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextTopic();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredTopics]);

  const activeTestSet = useMemo(() => {
    return (
      COMPREHENSIVE_PRACTICE_SETS.find((s) => s.id === activeTestSetId) ||
      COMPREHENSIVE_PRACTICE_SETS[0]!
    );
  }, [activeTestSetId]);

  const tensesTotal = GRAMMAR_TOPICS_CATALOG.filter((t) => t.category === 'Các Thì').length;
  const hasPrevTopic = currentIndex > 0;
  const hasNextTopic = currentIndex < filteredTopics.length - 1;
  const prevTopicTitle = hasPrevTopic ? filteredTopics[currentIndex - 1]?.masterclass.title : undefined;
  const nextTopicTitle = hasNextTopic ? filteredTopics[currentIndex + 1]?.masterclass.title : undefined;

  return (
    <div className="space-y-4">
      {/* Primary Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200/90 pt-1 mb-2">
        <div className="flex items-center gap-1 sm:gap-6 -mb-px overflow-x-auto scrollbar-none w-full sm:w-auto">
          {/* Tab 1: Bài giảng */}
          <button
            type="button"
            onClick={() => setCatalogViewMode('masterclass')}
            className={`pb-3 pt-2 px-2.5 sm:px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all min-h-[44px] shrink-0 ${
              catalogViewMode === 'masterclass'
                ? 'border-indigo-600 text-indigo-950 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <svg
              className={`w-4 h-4 shrink-0 ${
                catalogViewMode === 'masterclass' ? 'text-indigo-600' : 'text-slate-400'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span className="hidden sm:inline">32 Chuyên Đề Bài Giảng</span>
            <span className="sm:hidden">32 Bài Giảng</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                catalogViewMode === 'masterclass'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              ForumFlash
            </span>
          </button>

          {/* Tab 2: Luyện đề */}
          <button
            type="button"
            onClick={() => setCatalogViewMode('comprehensive-tests')}
            className={`pb-3 pt-2 px-2.5 sm:px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all min-h-[44px] shrink-0 ${
              catalogViewMode === 'comprehensive-tests'
                ? 'border-indigo-600 text-indigo-950 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <svg
              className={`w-4 h-4 shrink-0 ${
                catalogViewMode === 'comprehensive-tests' ? 'text-indigo-600' : 'text-slate-400'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="hidden sm:inline">Phòng Luyện Đề Thực Chiến</span>
            <span className="sm:hidden">Luyện Đề (4 Bộ)</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                catalogViewMode === 'comprehensive-tests'
                  ? 'bg-teal-100 text-teal-800'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              4 Bộ đề • 110+ câu
            </span>
          </button>
        </div>

        {/* Right side helper info */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 pb-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-600 font-semibold border border-slate-200/70 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            100% Không Phạt Lỗi (Skipped != Failed)
          </span>
        </div>
      </div>

      {catalogViewMode === 'comprehensive-tests' ? (
        <div className="space-y-6">
          {/* List of 4 Exam Sets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMPREHENSIVE_PRACTICE_SETS.map((set) => {
              const isSelected = set.id === activeTestSetId;
              return (
                <button
                  key={set.id}
                  type="button"
                  onClick={() => setActiveTestSetId(set.id)}
                  className={`text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between min-h-[140px] relative overflow-hidden group ${
                    isSelected
                      ? 'bg-gradient-to-b from-teal-50/80 to-white border-teal-500 ring-2 ring-teal-500/25 shadow-md scale-[1.01]'
                      : 'bg-white border-slate-200/90 hover:border-teal-300 hover:shadow-xs'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1 text-[10px] font-bold">
                      <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200/60 uppercase">
                        {set.milestone}
                      </span>
                      <span className="text-slate-400 font-medium">
                        ⏱ {set.durationMinutes}p • {set.totalQuestions} câu
                      </span>
                    </div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-teal-900 leading-snug">
                      {set.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {set.tagline}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-2">
                    <span className="font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60 text-[10px]">
                      {set.bandTarget}
                    </span>
                    <span className={`text-xs font-black flex items-center gap-1 ${isSelected ? 'text-teal-700' : 'text-slate-400 group-hover:text-teal-600'}`}>
                      <span>{isSelected ? 'Đang làm' : 'Bắt đầu'}</span>
                      <span>→</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Test Card */}
          <GrammarPracticeCard
            title={activeTestSet.title}
            description={activeTestSet.description}
            topicTitle={activeTestSet.tagline}
            questions={activeTestSet.questions}
          />
        </div>
      ) : (
        <>
          {/* Mobile Sticky Quick Topic Bar (Dành riêng cho màn hình nhỏ, loại bỏ cuộn thừa) */}
      <div className="lg:hidden sticky top-2 z-30 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between gap-2">
        <button
          onClick={handlePrevTopic}
          disabled={!hasPrevTopic}
          aria-label="Chuyên đề trước"
          className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-700 disabled:opacity-30 hover:bg-slate-100 transition-all shrink-0"
        >
          ←
        </button>

        <button
          onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
          className="flex-1 text-center px-2 py-1.5 rounded-xl hover:bg-slate-50 transition-all flex flex-col items-center min-w-0"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 truncate max-w-full">
            {activeTopic.milestone} • {currentIndex + 1}/{filteredTopics.length}
          </span>
          <span className="font-extrabold text-xs text-slate-800 truncate max-w-full flex items-center gap-1">
            {activeTopic.masterclass.title} <span className="text-[10px] text-slate-400">▾</span>
          </span>
        </button>

        <button
          onClick={handleNextTopic}
          disabled={!hasNextTopic}
          aria-label="Chuyên đề sau"
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-600 text-white disabled:opacity-30 hover:bg-indigo-700 transition-all shrink-0"
        >
          →
        </button>
      </div>

      {/* Mobile Drawer / Popup danh sách chuyên đề khi nhấp vào "Chọn chuyên đề" */}
      {isMobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex flex-col justify-end p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">Danh Mục Chuyên Đề ({filteredTopics.length})</h3>
                <p className="text-[11px] text-slate-500">Chạm để nhảy ngay tới bài học</p>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs"
                aria-label="Đóng danh mục"
              >
                ✕
              </button>
            </div>

            {/* Mobile Filters */}
            <div className="p-3 border-b border-slate-100 space-y-2 bg-slate-50/50">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                placeholder="Tìm thì, câu bị động..."
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
              <div className="flex gap-1 overflow-x-auto pb-1 text-[11px]">
                {['all', 'A1', 'A2', 'B1', 'B2'].map((ms) => (
                  <button
                    key={ms}
                    onClick={() => setSelectedMilestone(ms)}
                    className={`px-2.5 py-1 rounded-lg font-bold shrink-0 ${
                      selectedMilestone === ms ? 'bg-indigo-600 text-white' : 'bg-white border text-slate-600'
                    }`}
                  >
                    {ms === 'all' ? 'Tất cả' : ms}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Topic Scroll List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-slate-100">
              {filteredTopics.map((topic) => {
                const isActive = topic.id === activeTopic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => handleSelectTopic(topic.id, true)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between gap-2 min-h-[44px] ${
                      isActive ? 'bg-indigo-50 border border-indigo-300 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                        <span>{topic.milestone}</span>
                        <span>•</span>
                        <span>{topic.category}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-800 truncate">{topic.masterclass.title}</div>
                    </div>
                    {isActive ? (
                      <span className="text-xs text-indigo-600 font-bold shrink-0">Đang xem</span>
                    ) : (
                      <span className="text-xs text-slate-300 shrink-0">→</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Layout Master-Detail: Cột Trái Danh Mục (Sticky) & Cột Phải Bài Giảng */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CỘT TRÁI: Topic Sidebar (Desktop Sticky Navigation) */}
        {isSidebarOpen && (
          <aside className="hidden lg:flex lg:col-span-4 xl:col-span-3.5 sticky top-4 max-h-[calc(100vh-2rem)] flex-col bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 space-y-3.5 overflow-hidden">
            {/* Header Sidebar: Title & Search */}
            <div className="space-y-3 pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                    Chuyên Đề Ngữ Pháp
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {filteredTopics.length} bài
                  </span>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 p-1"
                  title="Thu gọn thanh danh mục để xem toàn màn hình"
                >
                  ◀ Ẩn
                </button>
              </div>

              {/* Standardized Search Bar */}
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                placeholder="Tìm thì, bị động, mệnh đề..."
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />

              {/* Milestone Filter Segmented Bar */}
              <div className="grid grid-cols-5 p-1 bg-slate-100 rounded-xl gap-1 text-[11px] font-bold">
                {['all', 'A1', 'A2', 'B1', 'B2'].map((ms) => (
                  <button
                    key={ms}
                    type="button"
                    onClick={() => setSelectedMilestone(ms)}
                    className={`py-1 rounded-lg text-center transition-all ${
                      selectedMilestone === ms
                        ? 'bg-white text-indigo-950 shadow-2xs font-black'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {ms === 'all' ? 'Tất cả' : ms}
                  </button>
                ))}
              </div>

              {/* Category Pills with Dot Badges */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
                {[
                  { key: 'all', label: 'Tất cả', dot: 'bg-slate-400' },
                  { key: 'Các Thì', label: `14 Thì (${tensesTotal})`, dot: 'bg-emerald-500' },
                  { key: 'Cấu Trúc Câu', label: 'Cấu Trúc', dot: 'bg-indigo-500' },
                  { key: 'Mệnh Đề & Liên Từ', label: 'Mệnh Đề', dot: 'bg-violet-500' },
                  { key: 'Học Thuật Nâng Cao', label: 'Nâng Cao', dot: 'bg-amber-500' },
                ].map((cat) => {
                  const isCatActive = selectedCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                        isCatActive
                          ? 'bg-slate-900 text-white shadow-2xs font-extrabold'
                          : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Topic List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {filteredTopics.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Không tìm thấy bài học nào phù hợp.
                </div>
              ) : (
                filteredTopics.map((topic) => {
                  const isActive = topic.id === activeTopic.id;
                  return (
                    <button
                      key={topic.id}
                      ref={isActive ? activeTopicItemRef : undefined}
                      onClick={() => handleSelectTopic(topic.id)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all duration-150 flex flex-col gap-1 min-h-[50px] relative ${
                        isActive
                          ? 'border-indigo-500/80 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500/20'
                          : 'border-transparent bg-white hover:bg-slate-50/90 hover:border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 text-[10px]">
                        <span className={`font-black uppercase tracking-wider ${isActive ? 'text-indigo-700' : 'text-slate-400'}`}>
                          {topic.milestone}
                        </span>
                        <span className="font-semibold text-slate-400 text-[10px]">
                          {topic.bandTarget}
                        </span>
                      </div>
                      <h3
                        className={`font-extrabold text-xs leading-snug line-clamp-1 ${
                          isActive ? 'text-indigo-950 font-black' : 'text-slate-800'
                        }`}
                      >
                        {topic.masterclass.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-1 leading-normal">
                        {topic.shortDesc}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </aside>
        )}

        {/* CỘT PHẢI: Reading Pane (Nội dung chi tiết bài học Masterclass) */}
        <main
          ref={readingPaneRef}
          className={`${
            isSidebarOpen ? 'lg:col-span-8 xl:col-span-8.5' : 'lg:col-span-12'
          } space-y-4 min-w-0`}
        >
          {/* Top Bar for Reader when Sidebar is closed */}
          {!isSidebarOpen && (
            <div className="hidden lg:flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-1.5"
              >
                <span>▶</span>
                <span>Hiện danh mục ({filteredTopics.length} chuyên đề)</span>
              </button>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span>Chuyên đề: <strong className="text-slate-800">{activeTopic.masterclass.title}</strong></span>
              </div>
            </div>
          )}

          {/* Masterclass Content */}
          <GrammarMasterclass
            {...activeTopic.masterclass}
            topicId={activeTopic.id}
            milestone={activeTopic.milestone}
            category={activeTopic.category}
            bandTarget={activeTopic.bandTarget}
            currentIndex={currentIndex}
            totalCount={filteredTopics.length}
            onPrevTopic={handlePrevTopic}
            onNextTopic={handleNextTopic}
            hasPrevTopic={hasPrevTopic}
            hasNextTopic={hasNextTopic}
            prevTopicTitle={prevTopicTitle}
            nextTopicTitle={nextTopicTitle}
          />
        </main>
      </div>
        </>
      )}
    </div>
  );
}
