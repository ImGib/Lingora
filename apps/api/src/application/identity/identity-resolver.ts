import { Inject, Injectable } from '@nestjs/common';
import {
  IDENTITY_REPOSITORY,
  type IdentityRepository,
} from './identity-repository.port.js';

@Injectable()
export class IdentityResolver {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly identities: IdentityRepository,
  ) {}

  resolve(provider: 'CLERK', providerUserId: string): Promise<string> {
    return this.identities.resolveOrProvision(provider, providerUserId);
  }
}
