import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  quarantineCommandSchema,
  learnerContentReportSchema,
  type QuarantineCommandDto,
  type LearnerContentReportDto,
} from '@lingora/contracts';
import { AuthGuard } from '../../http/auth.guard.js';
import { CurrentRequestContext } from '../../http/request-context.decorator.js';
import type { RequestContext } from '../../application/request-context.js';
import { ZodValidationPipe } from '../../http/zod-validation.pipe.js';
import { QuarantineService } from './quarantine.service.js';

@Controller('v1/curriculum')
@UseGuards(AuthGuard)
export class QuarantineController {
  constructor(private readonly quarantine: QuarantineService) {}

  @Post('quarantine')
  async executeQuarantine(
    @Body(new ZodValidationPipe(quarantineCommandSchema)) dto: QuarantineCommandDto,
    @CurrentRequestContext() context: RequestContext,
  ) {
    const data = await this.quarantine.quarantine(dto, context.learnerId);
    return { data, meta: { requestId: context.requestId } };
  }

  @Post('reports')
  async submitReport(
    @Body(new ZodValidationPipe(learnerContentReportSchema)) dto: LearnerContentReportDto,
    @CurrentRequestContext() context: RequestContext,
  ) {
    const data = await this.quarantine.reportIssue(context.learnerId, dto);
    return { data, meta: { requestId: context.requestId } };
  }
}
