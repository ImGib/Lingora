import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { LessonDto } from '@lingora/contracts';
import {
  CURRICULUM_REPOSITORY,
  type CurriculumRepository,
} from './curriculum-repository.port.js';

@Injectable()
export class GetPublishedLesson {
  constructor(
    @Inject(CURRICULUM_REPOSITORY) private readonly curriculum: CurriculumRepository,
  ) {}

  async execute(lessonId: string): Promise<LessonDto> {
    const lesson = await this.curriculum.getPublishedLesson(lessonId);
    if (!lesson) throw new NotFoundException('Published lesson not found');
    return lesson;
  }
}
