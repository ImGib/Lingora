import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { updateProfileSchema, type UpdateProfileDto } from '@lingora/contracts';
import { GetMe } from '../../application/identity/get-me.js';
import { UpdateProfile } from '../../application/identity/update-profile.js';
import type { RequestContext } from '../../application/request-context.js';
import { AuthGuard } from '../../http/auth.guard.js';
import { CurrentRequestContext } from '../../http/request-context.decorator.js';
import { ZodValidationPipe } from '../../http/zod-validation.pipe.js';

@Controller('v1/me')
@UseGuards(AuthGuard)
export class MeController {
  constructor(
    private readonly getMe: GetMe,
    private readonly updateProfile: UpdateProfile,
  ) {}

  @Get()
  async get(@CurrentRequestContext() context: RequestContext) {
    return {
      data: await this.getMe.execute(context.learnerId),
      meta: { requestId: context.requestId },
    };
  }

  @Patch('profile')
  async patchProfile(
    @CurrentRequestContext() context: RequestContext,
    @Body(new ZodValidationPipe(updateProfileSchema)) body: UpdateProfileDto,
  ) {
    return {
      data: await this.updateProfile.execute(context.learnerId, body),
      meta: { requestId: context.requestId },
    };
  }
}
