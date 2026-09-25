import { LessonView } from '@/features/lesson/lesson-view';

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  return <main className="page-shell narrow"><LessonView lessonId={lessonId} /></main>;
}
