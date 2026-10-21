import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import type { RequestContext } from '../../application/request-context.js';
import { AuthGuard } from '../../http/auth.guard.js';
import { CurrentRequestContext } from '../../http/request-context.decorator.js';
import { ZodValidationPipe } from '../../http/zod-validation.pipe.js';
import { PlanningService } from './planning.service.js';

const goalSchema = z.object({
  purpose: z.enum(['IELTS_ACADEMIC','STUDY_ABROAD','GENERAL_ENGLISH']),
  targetBand: z.number().min(0).max(9).multipleOf(0.5).nullable().optional(),
  deadline: z.iso.date().nullable().optional(),
  studyMinutesPerDay: z.number().int().min(5).max(240),
}).strict();
const overrideSchema = z.object({ action: z.enum(['skip','defer','replace','explore']) }).strict();

@Controller('v1')
@UseGuards(AuthGuard)
export class PlanningController {
  constructor(private readonly planning: PlanningService) {}

  @Get('goals/current')
  async goal(@CurrentRequestContext() context: RequestContext) {
    return { data: await this.planning.getGoal(context.learnerId), meta: { requestId: context.requestId } };
  }

  @Post('goals')
  async setGoal(@CurrentRequestContext() context: RequestContext,
    @Body(new ZodValidationPipe(goalSchema)) body: z.infer<typeof goalSchema>) {
    return { data: await this.planning.setGoal(context.learnerId, body), meta: { requestId: context.requestId } };
  }

  @Get('plans/today')
  async today(@CurrentRequestContext() context: RequestContext) {
    return { data: await this.planning.getToday(context.learnerId), meta: { requestId: context.requestId } };
  }

  @Post('plans/today/generate')
  async generate(@CurrentRequestContext() context: RequestContext) {
    return { data: await this.planning.generate(context.learnerId), meta: { requestId: context.requestId } };
  }

  @Post('plans/blocks/:blockId/override')
  async override(@CurrentRequestContext() context: RequestContext,
    @Param('blockId', new ParseUUIDPipe()) blockId: string,
    @Body(new ZodValidationPipe(overrideSchema)) body: z.infer<typeof overrideSchema>) {
    return { data: await this.planning.overrideBlock(context.learnerId, blockId, body.action), meta: { requestId: context.requestId } };
  }

  @Post('plans/blocks/:blockId/complete')
  async completeBreak(@CurrentRequestContext() context: RequestContext,
    @Param('blockId', new ParseUUIDPipe()) blockId: string) {
    return { data: await this.planning.completeBreak(context.learnerId, blockId), meta: { requestId: context.requestId } };
  }

  @Get('dashboard')
  async dashboard(@CurrentRequestContext() context: RequestContext) {
    return { data: await this.planning.dashboard(context.learnerId), meta: { requestId: context.requestId } };
  }

  @Get('resume')
  async resume(@CurrentRequestContext() context: RequestContext) {
    const dashboard = await this.planning.dashboard(context.learnerId);
    return { data: { nextAction: dashboard.nextAction }, meta: { requestId: context.requestId } };
  }

  @Get('competencies/:competencyId/state')
  async state(@CurrentRequestContext() context: RequestContext,
    @Param('competencyId', new ParseUUIDPipe()) competencyId: string) {
    return { data: await this.planning.competencyState(context.learnerId, competencyId), meta: { requestId: context.requestId } };
  }
}
