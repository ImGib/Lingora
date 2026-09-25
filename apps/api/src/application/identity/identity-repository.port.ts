import type { ProfileDto, UpdateProfileDto } from '@lingora/contracts';

export type LearnerProfile = Readonly<{
  learnerId: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  profile: ProfileDto;
}>;

export interface IdentityRepository {
  resolveOrProvision(provider: string, providerUserId: string): Promise<string>;
  getLearnerProfile(learnerId: string): Promise<LearnerProfile | null>;
  updateProfile(learnerId: string, patch: UpdateProfileDto): Promise<LearnerProfile>;
}

export const IDENTITY_REPOSITORY = Symbol('IDENTITY_REPOSITORY');
