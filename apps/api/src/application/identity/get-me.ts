import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { MeDataDto } from '@lingora/contracts';
import {
  IDENTITY_REPOSITORY,
  type IdentityRepository,
} from './identity-repository.port.js';

@Injectable()
export class GetMe {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly identities: IdentityRepository,
  ) {}

  async execute(learnerId: string): Promise<MeDataDto> {
    const learner = await this.identities.getLearnerProfile(learnerId);
    if (!learner) throw new NotFoundException('Learner not found');
    return {
      id: learner.learnerId,
      profile: learner.profile,
      onboarding: { status: 'INCOMPLETE', nextStep: 'SET_GOAL' },
    };
  }
}
