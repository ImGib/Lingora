import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GetPublishedLesson } from '../../application/curriculum/get-published-lesson.js';
import type { RequestContext } from '../../application/request-context.js';
import { AuthGuard } from '../../http/auth.guard.js';
import { CurrentRequestContext } from '../../http/request-context.decorator.js';

@Controller('v1/lessons')
@UseGuards(AuthGuard)
export class LessonsController {
  constructor(private readonly getPublishedLesson: GetPublishedLesson) {}

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
