import { Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { GetPublishedLesson } from '../../application/curriculum/get-published-lesson.js';
import type { RequestContext } from '../../application/request-context.js';
import { AuthGuard } from '../../http/auth.guard.js';
import { CurrentRequestContext } from '../../http/request-context.decorator.js';
import { LessonExposureService } from './lesson-exposure.service.js';

@Controller('v1/lessons')
@UseGuards(AuthGuard)
export class LessonsController {
  constructor(private readonly getPublishedLesson: GetPublishedLesson,
    private readonly exposures: LessonExposureService) {}

  @Get(':lessonId/exposure')
  async exposure(@Param('lessonId', new ParseUUIDPipe()) lessonId: string,
    @CurrentRequestContext() context: RequestContext) {
    return { data: await this.exposures.get(context.learnerId, lessonId), meta: { requestId: context.requestId } };
  }

  @Post(':lessonId/exposure/complete')
  async completeExposure(@Param('lessonId', new ParseUUIDPipe()) lessonId: string,
    @CurrentRequestContext() context: RequestContext) {
    return { data: await this.exposures.complete(context.learnerId, lessonId), meta: { requestId: context.requestId } };
  }

  @Get(':lessonId')
  async get(
    @Param('lessonId', new ParseUUIDPipe()) lessonId: string,
    @CurrentRequestContext() context: RequestContext,
  ) {
    return {
      data: await this.getPublishedLesson.execute(lessonId),
      meta: { requestId: context.requestId },
    };
  }
}
