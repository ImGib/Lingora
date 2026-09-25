import { AttemptView } from '@/features/lesson/attempt-view';

export default async function AttemptPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params;
  return <main className="page-shell narrow"><AttemptView attemptId={attemptId} /></main>;
}
