import { verifyToken } from '@clerk/backend';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Environment } from '../../config/environment.js';
import type { ProviderIdentityVerifier } from '../../application/identity/provider-identity-verifier.port.js';
import { ENVIRONMENT } from '../environment.module.js';

@Injectable()
export class ClerkIdentityVerifier implements ProviderIdentityVerifier {
  constructor(@Inject(ENVIRONMENT) private readonly environment: Environment) {}

  async verify(authorizationHeader: string | undefined): Promise<{ subject: string }> {
    const match = authorizationHeader?.match(/^Bearer\s+(.+)$/i);
    if (!match?.[1]) throw new UnauthorizedException('Authentication required');

    try {
      const payload = await verifyToken(match[1], {
        secretKey: this.environment.CLERK_SECRET_KEY,
        authorizedParties: this.environment.CLERK_AUTHORIZED_PARTIES.split(',').map((party) =>
          party.trim(),
        ),
      });
      if (!payload.sub) throw new Error('Token subject missing');
      return { subject: payload.sub };
    } catch {
      throw new UnauthorizedException('Invalid authentication token');
    }
  }
}
