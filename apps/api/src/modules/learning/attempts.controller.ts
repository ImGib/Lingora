import { Body, Controller, Get, Headers, Param, ParseUUIDPipe, Post, Put, UseGuards, BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import type { RequestContext } from '../../application/request-context.js';
import { AuthGuard } from '../../http/auth.guard.js';
import { CurrentRequestContext } from '../../http/request-context.decorator.js';
import { ZodValidationPipe } from '../../http/zod-validation.pipe.js';
import { AttemptsService } from './attempts.service.js';

const startSchema = z.object({ lessonId: z.uuid() }).strict();
const responseSchema = z.object({ value: z.string().trim().min(1).max(500) }).strict();

@Controller('v1/attempts')
@UseGuards(AuthGuard)
export class AttemptsController {
  constructor(private readonly attempts: AttemptsService) {}

  @Post()
  async start(@CurrentRequestContext() context: RequestContext,
    @Body(new ZodValidationPipe(startSchema)) body: z.infer<typeof startSchema>) {
    return { data: await this.attempts.start(context.learnerId, body.lessonId), meta: { requestId: context.requestId } };
  }

  @Get(':attemptId')
  async get(@CurrentRequestContext() context: RequestContext,
    @Param('attemptId', new ParseUUIDPipe()) attemptId: string) {
    return { data: await this.attempts.get(context.learnerId, attemptId), meta: { requestId: context.requestId } };
  }

  @Put(':attemptId/responses/:itemId')
  async save(@CurrentRequestContext() context: RequestContext,
    @Param('attemptId', new ParseUUIDPipe()) attemptId: string,
    @Param('itemId', new ParseUUIDPipe()) itemId: string,
    @Body(new ZodValidationPipe(responseSchema)) body: z.infer<typeof responseSchema>) {
    return { data: await this.attempts.save(context.learnerId, attemptId, itemId, body.value), meta: { requestId: context.requestId } };
  }

  @Post(':attemptId/items/:itemId/hint')
  async revealHint(@CurrentRequestContext() context: RequestContext,
    @Param('attemptId', new ParseUUIDPipe()) attemptId: string,
    @Param('itemId', new ParseUUIDPipe()) itemId: string) {
    return { data: await this.attempts.revealHint(context.learnerId, attemptId, itemId), meta: { requestId: context.requestId } };
  }

  @Post(':attemptId/submit')
  async submit(@CurrentRequestContext() context: RequestContext,
    @Param('attemptId', new ParseUUIDPipe()) attemptId: string,
    @Headers('idempotency-key') key: string | undefined) {
    if (!key || key.length > 100 || !/^[a-zA-Z0-9_-]+$/.test(key)) throw new BadRequestException('Valid Idempotency-Key required');
    return { data: await this.attempts.submit(context.learnerId, attemptId, key), meta: { requestId: context.requestId } };
  }
}
