'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { MilestoneCard, type Milestone } from './milestone-card';

const milestones: [Milestone, ...Milestone[]] = [
  {
    number: 1,
    level: 'A1',
    title: 'Xây nền vững',
    band: '0.0 → 3.0',
    duration: '30 ngày',
    summary: 'Làm quen với âm tiếng Anh, câu đơn và giao tiếp về bản thân.',
    outcome: 'Tự giới thiệu ngắn và nhận diện thông tin quen thuộc.',
    knowledge: {
      pronunciation: ['44 âm IPA, học từng âm một', 'Phân biệt cặp âm gần nhau và âm cuối /s/, /t/, /d/'],
      vocabulary: ['300 từ cơ bản về bản thân, gia đình và sinh hoạt', 'Đọc số, tên riêng và thông tin cá nhân'],
      grammar: ['Động từ to be và thì hiện tại đơn', 'Cấu trúc câu khẳng định, phủ định, nghi vấn cơ bản'],
    },
    test: {
      name: 'Mini Progress Test',
      duration: '25 phút',
      listening: '10 câu nhận diện âm vị, số điện thoại và tên đánh vần.',
      reading: '10 câu đọc danh thiếp, bảng biểu và đoạn ngắn khoảng 50 từ.',
      writing: 'Sắp xếp câu và tự viết phần giới thiệu dài 3–5 câu.',
      speaking: 'Đọc đoạn ngắn và thu âm khoảng 30 giây, chú ý âm cuối.',
    },
  },
  {
    number: 2,
    level: 'A2',
    title: 'Tăng tốc phản xạ',
    band: '3.0 → 4.5',
    duration: '30 ngày',
    summary: 'Dùng tiếng Anh trong tình huống đời thường và kể lại trải nghiệm.',
    outcome: 'Theo dõi hội thoại quen thuộc, viết email và trả lời phỏng vấn ngắn.',
    knowledge: {
      pronunciation: ['Nghe hội thoại mua sắm, đặt phòng và chỉ đường', 'Luyện nhịp câu, trọng âm từ và phản xạ trả lời'],
      vocabulary: ['500 từ theo tình huống thường gặp', 'Từ vựng trong email, chuyến đi và dịch vụ'],
      grammar: ['Quá khứ đơn với 60 động từ bất quy tắc thông dụng', 'Tương lai, động từ khuyết thiếu và so sánh'],
    },
    test: {
      name: 'Milestone Test A2',
      duration: '40 phút',
      listening: '15 câu về hội thoại đời thường; điền 1–2 từ hoặc chọn đáp án.',
      reading: '15 câu từ email hoặc bài đánh giá khoảng 200 từ.',
      writing: 'Viết email 60–80 từ kể về kỳ nghỉ cuối tuần.',
      speaking: 'Trả lời ba câu hỏi liên tiếp trong bài phỏng vấn khoảng 90 giây.',
    },
  },
  {
    number: 3,
    level: 'B1',
    title: 'Bước vào IELTS',
    band: '4.5 → 5.5',
    duration: '30 ngày',
    summary: 'Đọc và nghe thông tin học thuật ngắn, diễn đạt ý có dẫn chứng.',
    outcome: 'Viết đoạn nghị luận và xử lý các dạng bài IELTS đầu tiên.',
    knowledge: {
      pronunciation: ['Nghe IELTS Listening Section 1–2', 'Luyện nói Part 1 và độc thoại ngắn Part 2'],
      vocabulary: ['600 từ học thuật AWL', 'Từ nối và cách diễn đạt lập luận'],
      grammar: ['Mệnh đề quan hệ, bị động và điều kiện loại 1–2', 'Cấu trúc nhượng bộ và câu phức'],
    },
    test: {
      name: 'Pre-IELTS Exam',
      duration: '60 phút',
      listening: '20 câu điền biểu mẫu và gắn nhãn bản đồ ở Section 1–2.',
      reading: '20 câu Matching Headings và True / False / Not Given.',
      writing: 'Viết đoạn nghị luận khoảng 120 từ có dẫn chứng và câu phức.',
      speaking: 'Trả lời Part 1, sau đó nói về một trải nghiệm trong Part 2.',
    },
  },
  {
    number: 4,
    level: 'B2',
    title: 'Về đích 6.5',
    band: '5.5 → 6.5+',
    duration: '30 ngày',
    summary: 'Kết hợp chiến thuật làm bài và khả năng diễn đạt học thuật độc lập.',
    outcome: 'Sẵn sàng thử sức với một bài thi IELTS Academic đầy đủ.',
    knowledge: {
      pronunciation: ['Nghe bốn Section từ hội thoại đến bài giảng', 'Luyện Speaking Part 1–3 và phản biện quan điểm'],
      vocabulary: ['1.500 từ học thuật AWL theo đặc tả lộ trình', 'Từ vựng cho biểu đồ, lập luận và chủ đề xã hội'],
      grammar: ['Skimming, scanning và phân tích đề', 'Writing Task 1 bốn đoạn; Task 2 theo cấu trúc P.E.E.L'],
    },
    test: {
      name: 'Full IELTS Academic Mock Test',
      duration: 'khoảng 160 phút',
      listening: '40 câu qua bốn Section, mục tiêu từ 26/40 câu đúng.',
      reading: '40 câu qua ba bài đọc, mục tiêu từ 27/40 câu đúng.',
      writing: 'Task 1 tối thiểu 150 từ và Task 2 tối thiểu 250 từ.',
      speaking: 'Phỏng vấn và thảo luận Part 1–3 trong 11–14 phút.',
    },
  },
];

export function RoadmapInteractiveView() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const milestone = milestones[activeIndex] ?? milestones[0];

  function selectFromKeyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number;
    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (index + 1) % milestones.length;
        break;
      case 'ArrowLeft':
        nextIndex = (index - 1 + milestones.length) % milestones.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = milestones.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    setActiveIndex(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div className="roadmap-page">
      <style>{`
        .roadmap-page { max-width: 1240px; margin: 0 auto; padding: 64px 0 100px; }
        .roadmap-intro { max-width: 790px; }
        .roadmap-eyebrow { display: inline-flex; align-items: center; gap: 9px; padding: 8px 13px; border: 1px solid #d9d1fa; border-radius: 999px; background: #f4f0ff; color: #493b9b; font-size: .75rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
        .roadmap-eyebrow::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: #10b981; }
        .roadmap-intro h1 { margin: 24px 0 18px; color: #29243a; font-size: clamp(2.7rem, 6vw, 5rem); line-height: 1.06; letter-spacing: -.055em; }
        .roadmap-intro h1 span { color: #6959d1; }
        .roadmap-intro p { max-width: 650px; margin: 0; color: #625d6b; font-size: clamp(1rem, 1.7vw, 1.2rem); line-height: 1.7; }
        .roadmap-overview { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin: 32px 0 44px; color: #5d566b; font-size: .9rem; }
        .roadmap-overview strong { color: #4536a5; }
        .roadmap-overview span + span::before { content: '•'; margin-right: 12px; color: #b8aec8; }
        .roadmap-section-label { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; color: #625d6b; font-size: .82rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
        .roadmap-section-label::after { content: ''; height: 1px; flex: 1; background: #ddd7e8; }
        .roadmap-tabs { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-bottom: 26px; }
        .roadmap-tab { position: relative; min-width: 0; padding: 20px; border: 1px solid #e4dfeb; border-radius: 20px; background: rgba(255,255,255,.9); color: #353041; text-align: left; cursor: pointer; box-shadow: 0 8px 24px rgba(67,47,93,.04); transition: border-color .2s, background .2s, transform .2s, box-shadow .2s; }
        .roadmap-tab:hover { border-color: #a99beb; transform: translateY(-2px); }
        .roadmap-tab[aria-selected='true'] { border-color: #8271e5; background: #f4f1ff; box-shadow: 0 12px 32px rgba(88,70,174,.12); }
        .roadmap-tab:focus-visible { outline: 3px solid #8fd8c5; outline-offset: 3px; }
        .roadmap-tab-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 20px; }
        .roadmap-tab-number { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 10px; background: #eeebf7; color: #5b4cc1; font-size: .78rem; font-weight: 800; }
        .roadmap-tab[aria-selected='true'] .roadmap-tab-number { background: #6f5fdf; color: #fff; }
        .roadmap-tab-level { color: #6255ae; font-size: .75rem; font-weight: 800; letter-spacing: .07em; }
        .roadmap-tab-title { display: block; font-size: 1.08rem; font-weight: 800; letter-spacing: -.025em; }
        .roadmap-tab-band { display: block; margin-top: 5px; color: #6c6577; font-size: .88rem; font-weight: 650; }
        .roadmap-feature { overflow: hidden; border: 1px solid #ded7f2; border-radius: 26px; background: linear-gradient(115deg, #f2efff 0%, #fff 62%, #eefaf6 100%); box-shadow: 0 20px 55px rgba(70,54,103,.07); }
        .roadmap-feature-main { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 32px 36px; }
        .roadmap-feature-kicker { color: #6255ae; font-size: .76rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
        .roadmap-feature h2 { margin: 8px 0 7px; color: #302746; font-size: clamp(1.8rem, 3vw, 2.7rem); letter-spacing: -.04em; }
        .roadmap-feature p { margin: 0; color: #5e596a; line-height: 1.6; }
        .roadmap-band { flex: none; min-width: 160px; padding: 18px 24px; border: 1px solid #d8d0fb; border-radius: 18px; background: #fff; text-align: center; }
        .roadmap-band span { display: block; color: #706a7c; font-size: .72rem; font-weight: 750; letter-spacing: .08em; text-transform: uppercase; }
        .roadmap-band strong { display: block; margin-top: 5px; color: #5849bf; font-size: 1.35rem; white-space: nowrap; }
        .roadmap-feature-footer { display: flex; gap: 10px; flex-wrap: wrap; padding: 14px 36px; border-top: 1px solid #e7e1f0; background: rgba(255,255,255,.56); color: #504a5b; font-size: .85rem; }
        .roadmap-feature-footer strong { color: #43369c; }
        .roadmap-detail-grid { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); gap: 20px; margin-top: 22px; }
        .roadmap-panel { min-width: 0; padding: 30px; border: 1px solid #e5e0eb; border-radius: 24px; background: rgba(255,255,255,.95); box-shadow: 0 12px 38px rgba(70,54,103,.05); }
        .roadmap-panel-heading { padding-bottom: 21px; border-bottom: 1px solid #ede9f0; }
        .roadmap-panel-kicker { color: #6255b5; font-size: .75rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
        .roadmap-panel h3 { margin: 9px 0 6px; color: #302746; font-size: 1.45rem; letter-spacing: -.03em; }
        .roadmap-panel-heading p { margin: 0; color: #6b6576; font-size: .9rem; line-height: 1.55; }
        .roadmap-knowledge-grid { display: grid; gap: 0; }
        .roadmap-knowledge-item { padding: 20px 0; border-bottom: 1px solid #f0edf3; }
        .roadmap-knowledge-item:last-child { padding-bottom: 0; border-bottom: 0; }
        .roadmap-knowledge-title { display: flex; align-items: center; gap: 11px; }
        .roadmap-knowledge-icon { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 10px; background: #f0ecff; color: #5b4bbf; font-size: .82rem; font-weight: 800; }
        .roadmap-panel h4 { margin: 0; color: #383145; font-size: .96rem; }
        .roadmap-knowledge-item ul { display: grid; gap: 7px; margin: 10px 0 0 43px; padding: 0; list-style: none; color: #625d6b; font-size: .88rem; line-height: 1.5; }
        .roadmap-knowledge-item li::before { content: '✓'; margin-right: 8px; color: #078b67; font-weight: 800; }
        .roadmap-test-list { display: grid; }
        .roadmap-test-item { display: flex; gap: 16px; padding: 18px 0; border-bottom: 1px solid #f0edf3; }
        .roadmap-test-item:last-child { padding-bottom: 0; border-bottom: 0; }
        .roadmap-test-index { flex: none; color: #a499b8; font-size: .78rem; font-weight: 800; }
        .roadmap-test-item p { margin: 6px 0 0; color: #625d6b; font-size: .88rem; line-height: 1.5; }
        .roadmap-note { max-width: 850px; margin: 26px auto 0; color: #716b79; font-size: .81rem; line-height: 1.6; text-align: center; }
        @media (max-width: 900px) { .roadmap-tabs { grid-template-columns: repeat(2, minmax(0, 1fr)); } .roadmap-detail-grid { grid-template-columns: 1fr; } }
        @media (max-width: 560px) { .roadmap-page { padding-top: 44px; } .roadmap-overview { margin-bottom: 32px; } .roadmap-tabs { gap: 8px; } .roadmap-tab { padding: 14px; border-radius: 16px; } .roadmap-tab-top { margin-bottom: 14px; } .roadmap-tab-title { font-size: .94rem; } .roadmap-tab-band { font-size: .78rem; } .roadmap-feature-main { align-items: flex-start; flex-direction: column; padding: 24px; } .roadmap-band { width: 100%; } .roadmap-feature-footer { padding: 14px 24px; } .roadmap-panel { padding: 23px; } }
        @media (prefers-reduced-motion: reduce) { .roadmap-tab { transition: none; } }
      `}</style>
      <header className="roadmap-intro">
        <span className="roadmap-eyebrow">Lộ trình học rõ ràng</span>
        <h1>Từ những bước đầu đến <span>IELTS 6.5.</span></h1>
        <p>Bốn mốc học giúp bạn nhìn thấy điều cần học, cách luyện tập và bài kiểm tra đầu ra ở mỗi chặng. Chọn một mốc để khám phá.</p>
      </header>

      <div className="roadmap-overview" aria-label="Tổng quan lộ trình">
        <span><strong>4 mốc</strong> từ A1 đến B2</span>
        <span><strong>30 ngày</strong> tham khảo mỗi mốc</span>
        <span><strong>4 kỹ năng</strong> ở mỗi bài kiểm tra</span>
      </div>

      <section aria-label="Khám phá các mốc học">
        <div className="roadmap-section-label">Chọn mốc học</div>
        <div className="roadmap-tabs" role="tablist" aria-label="Bốn mốc trong lộ trình IELTS">
          {milestones.map((item, index) => (
            <button
              key={item.number}
              ref={(node) => { tabRefs.current[index] = node; }}
              id={`roadmap-tab-${item.number}`}
              className="roadmap-tab"
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-controls="roadmap-tab-panel"
              tabIndex={index === activeIndex ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => selectFromKeyboard(event, index)}
            >
              <span className="roadmap-tab-top">
                <span className="roadmap-tab-number">{String(item.number).padStart(2, '0')}</span>
                <span className="roadmap-tab-level">{item.level}</span>
              </span>
              <span className="roadmap-tab-title">{item.title}</span>
              <span className="roadmap-tab-band">Band {item.band}</span>
            </button>
          ))}
        </div>

        <div id="roadmap-tab-panel" role="tabpanel" aria-labelledby={`roadmap-tab-${milestone.number}`} tabIndex={0}>
          <div className="roadmap-feature">
            <div className="roadmap-feature-main">
              <div>
                <span className="roadmap-feature-kicker">Mốc {milestone.number} / {milestone.level} · {milestone.duration} tham khảo</span>
                <h2>{milestone.title}</h2>
                <p>{milestone.outcome}</p>
              </div>
              <div className="roadmap-band"><span>Dải band mục tiêu</span><strong>{milestone.band}</strong></div>
            </div>
            <div className="roadmap-feature-footer"><strong>Kiểm tra đầu ra:</strong> {milestone.test.name} · {milestone.test.duration}</div>
          </div>
          <MilestoneCard milestone={milestone} />
        </div>
      </section>

      <p className="roadmap-note">Thời lượng và band là định hướng tham khảo. Việc chuyển mốc dựa trên bằng chứng học tập và nhu cầu của từng người; bạn có thể ôn lại hoặc học vượt khi phù hợp.</p>
    </div>
  );
}
