import type { Metadata } from 'next';
import { HeaderNav } from '@/components/common/header-nav';
import { RoadmapInteractiveView } from '@/components/roadmap/roadmap-interactive-view';

export const metadata: Metadata = {
  title: 'Lộ trình IELTS 0 đến 6.5 | Lingora',
  description: 'Khám phá bốn mốc học từ nền tảng A1 đến IELTS Academic 6.5, với kiến thức và bài kiểm tra rõ ràng ở mỗi chặng.',
};

export default function RoadmapPage() {
  return (
    <main className="page-shell">
      <HeaderNav />
      <RoadmapInteractiveView />
    </main>
  );
}
