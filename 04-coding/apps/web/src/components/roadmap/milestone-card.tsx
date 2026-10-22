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

interface MilestoneCardProps {
  milestone: Milestone;
}

const knowledgeSections: { key: keyof Milestone['knowledge']; title: string; icon: string }[] = [
  { key: 'pronunciation', title: 'Phát âm & nghe', icon: '♪' },
  { key: 'vocabulary', title: 'Từ vựng', icon: 'Aa' },
  { key: 'grammar', title: 'Ngữ pháp & kỹ năng', icon: '✳' },
];

const testSections: { key: keyof Pick<Milestone['test'], 'listening' | 'reading' | 'writing' | 'speaking'>; title: string }[] = [
  { key: 'listening', title: 'Listening' },
  { key: 'reading', title: 'Reading' },
  { key: 'writing', title: 'Writing' },
  { key: 'speaking', title: 'Speaking' },
];

export function MilestoneCard({ milestone }: MilestoneCardProps) {
  return (
    <div className="roadmap-detail-grid">
      <section className="roadmap-panel roadmap-knowledge" aria-labelledby="roadmap-knowledge-title">
        <div className="roadmap-panel-heading">
          <span className="roadmap-panel-kicker">01 / Học gì</span>
          <h3 id="roadmap-knowledge-title">Nền tảng của chặng này</h3>
          <p>{milestone.summary}</p>
        </div>
        <div className="roadmap-knowledge-grid">
          {knowledgeSections.map(({ key, title, icon }) => (
            <div className="roadmap-knowledge-item" key={key}>
              <div className="roadmap-knowledge-title">
                <span className="roadmap-knowledge-icon" aria-hidden="true">{icon}</span>
                <h4>{title}</h4>
              </div>
              <ul>
                {milestone.knowledge[key].map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="roadmap-panel roadmap-test" aria-labelledby="roadmap-test-title">
        <div className="roadmap-panel-heading">
          <span className="roadmap-panel-kicker">02 / Kiểm tra đầu ra</span>
          <h3 id="roadmap-test-title">{milestone.test.name}</h3>
          <p>Bài đánh giá dự kiến · {milestone.test.duration}</p>
        </div>
        <div className="roadmap-test-list">
          {testSections.map(({ key, title }, index) => (
            <div className="roadmap-test-item" key={key}>
              <span className="roadmap-test-index" aria-hidden="true">0{index + 1}</span>
              <div>
                <h4>{title}</h4>
                <p>{milestone.test[key]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
