import { Inject, Injectable } from '@nestjs/common';
import type { MeDataDto, UpdateProfileDto } from '@lingora/contracts';
import {
  IDENTITY_REPOSITORY,
  type IdentityRepository,
} from './identity-repository.port.js';

@Injectable()
export class UpdateProfile {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly identities: IdentityRepository,
  ) {}

  async execute(learnerId: string, patch: UpdateProfileDto): Promise<MeDataDto> {
    const learner = await this.identities.updateProfile(learnerId, patch);
    return {
      id: learner.learnerId,
      profile: learner.profile,
      onboarding: { status: 'INCOMPLETE', nextStep: 'SET_GOAL' },
    };
  }
}
