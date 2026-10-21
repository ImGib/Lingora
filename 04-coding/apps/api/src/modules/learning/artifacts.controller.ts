import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { createArtifactSchema, type CreateArtifactDto } from '@lingora/contracts';
import { AuthGuard } from '../../http/auth.guard.js';
import { CurrentRequestContext } from '../../http/request-context.decorator.js';
import type { RequestContext } from '../../application/request-context.js';
import { ZodValidationPipe } from '../../http/zod-validation.pipe.js';
import { ArtifactsService } from './artifacts.service.js';

@Controller('v1/artifacts')
@UseGuards(AuthGuard)
export class ArtifactsController {
  constructor(private readonly artifacts: ArtifactsService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createArtifactSchema)) dto: CreateArtifactDto,
    @CurrentRequestContext() context: RequestContext,
  ) {
    const data = await this.artifacts.create(context.learnerId, dto);
    return { data, meta: { requestId: context.requestId } };
  }

  @Get(':activityId')
  async getForActivity(
    @Param('activityId', new ParseUUIDPipe()) activityId: string,
    @CurrentRequestContext() context: RequestContext,
  ) {
    const data = await this.artifacts.getLatestForActivity(context.learnerId, activityId);
    return { data, meta: { requestId: context.requestId } };
  }

  @Delete(':artifactId')
  async delete(
    @Param('artifactId', new ParseUUIDPipe()) artifactId: string,
    @CurrentRequestContext() context: RequestContext,
  ) {
    await this.artifacts.delete(context.learnerId, artifactId);
    return { data: { success: true }, meta: { requestId: context.requestId } };
  }
}
