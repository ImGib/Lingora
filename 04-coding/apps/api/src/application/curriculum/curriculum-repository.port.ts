import type { LessonDto } from '@lingora/contracts';

export interface CurriculumRepository {
  getPublishedLesson(lessonId: string): Promise<LessonDto | null>;
}

export const CURRICULUM_REPOSITORY = Symbol('CURRICULUM_REPOSITORY');
