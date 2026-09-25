import { Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import type { RequestContext } from '../../application/request-context.js';
import { AuthGuard } from '../../http/auth.guard.js';
import { CurrentRequestContext } from '../../http/request-context.decorator.js';
import { SessionsService } from './sessions.service.js';

@Controller('v1/sessions')
@UseGuards(AuthGuard)
export class SessionsController {
  constructor(private readonly sessions: SessionsService) {}

  @Get('current')
  async current(@CurrentRequestContext() context: RequestContext) {
    return { data: await this.sessions.current(context.learnerId), meta: { requestId: context.requestId } };
  }

  @Post()
  async start(@CurrentRequestContext() context: RequestContext) {
    return { data: await this.sessions.start(context.learnerId), meta: { requestId: context.requestId } };
  }

  @Get(':sessionId')
  async get(@CurrentRequestContext() context: RequestContext,
    @Param('sessionId', new ParseUUIDPipe()) sessionId: string) {
    return { data: await this.sessions.get(context.learnerId, sessionId), meta: { requestId: context.requestId } };
  }

  @Post(':sessionId/pause')
  async pause(@CurrentRequestContext() context: RequestContext,
    @Param('sessionId', new ParseUUIDPipe()) sessionId: string) {
    return { data: await this.sessions.transition(context.learnerId, sessionId, 'pause'), meta: { requestId: context.requestId } };
  }

  @Post(':sessionId/resume')
  async resume(@CurrentRequestContext() context: RequestContext,
    @Param('sessionId', new ParseUUIDPipe()) sessionId: string) {
    return { data: await this.sessions.transition(context.learnerId, sessionId, 'resume'), meta: { requestId: context.requestId } };
  }

  @Post(':sessionId/complete')
  async complete(@CurrentRequestContext() context: RequestContext,
    @Param('sessionId', new ParseUUIDPipe()) sessionId: string) {
    return { data: await this.sessions.transition(context.learnerId, sessionId, 'complete'), meta: { requestId: context.requestId } };
  }

  @Post(':sessionId/abandon')
  async abandon(@CurrentRequestContext() context: RequestContext,
    @Param('sessionId', new ParseUUIDPipe()) sessionId: string) {
    return { data: await this.sessions.transition(context.learnerId, sessionId, 'abandon'), meta: { requestId: context.requestId } };
  }
}
