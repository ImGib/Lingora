import { BadRequestException, Body, Controller, Get, Headers, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import type { RequestContext } from '../../application/request-context.js';
import { AuthGuard } from '../../http/auth.guard.js';
import { CurrentRequestContext } from '../../http/request-context.decorator.js';
import { ZodValidationPipe } from '../../http/zod-validation.pipe.js';
import { PlacementService } from './placement.service.js';

const startSchema = z.object({ mode: z.enum(['START', 'SKIP']).default('START') }).strict();
const responseSchema = z.object({ itemId: z.uuid(), value: z.string().trim().min(1).max(500) }).strict();

@Controller('v1/placements')
@UseGuards(AuthGuard)
export class PlacementController {
  constructor(private readonly placements: PlacementService) {}

  @Post()
  async start(
    @CurrentRequestContext() context: RequestContext,
    @Headers('idempotency-key') idempotencyKey: string | undefined,
    @Body(new ZodValidationPipe(startSchema)) body: z.infer<typeof startSchema>,
  ) {
    if (!idempotencyKey?.trim()) throw new BadRequestException('Idempotency-Key header is required');
    return { data: await this.placements.start(context.learnerId, idempotencyKey.trim(), body.mode), meta: { requestId: context.requestId } };
  }

  @Get(':placementId')
  async get(@CurrentRequestContext() context: RequestContext,
    @Param('placementId', new ParseUUIDPipe()) placementId: string) {
    return { data: await this.placements.get(context.learnerId, placementId), meta: { requestId: context.requestId } };
  }

  @Get()
  async current(@CurrentRequestContext() context: RequestContext) {
    return { data: await this.placements.current(context.learnerId), meta: { requestId: context.requestId } };
  }

  @Get(':placementId/next')
  async next(@CurrentRequestContext() context: RequestContext,
    @Param('placementId', new ParseUUIDPipe()) placementId: string) {
    return { data: await this.placements.next(context.learnerId, placementId), meta: { requestId: context.requestId } };
  }

  @Post(':placementId/responses')
  async respond(@CurrentRequestContext() context: RequestContext,
    @Param('placementId', new ParseUUIDPipe()) placementId: string,
    @Body(new ZodValidationPipe(responseSchema)) body: z.infer<typeof responseSchema>) {
    return { data: await this.placements.saveResponse(context.learnerId, placementId, body.itemId, body.value), meta: { requestId: context.requestId } };
  }

  @Post(':placementId/complete')
  async complete(@CurrentRequestContext() context: RequestContext,
    @Param('placementId', new ParseUUIDPipe()) placementId: string) {
    return { data: await this.placements.complete(context.learnerId, placementId), meta: { requestId: context.requestId } };
  }
}
