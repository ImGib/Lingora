import { Inject, Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { randomUUID } from 'node:crypto';
import { IdentityResolver } from '../application/identity/identity-resolver.js';
import {
  PROVIDER_IDENTITY_VERIFIER,
  type ProviderIdentityVerifier,
} from '../application/identity/provider-identity-verifier.port.js';
import type { AuthenticatedRequest } from './authenticated-request.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(PROVIDER_IDENTITY_VERIFIER)
    private readonly verifier: ProviderIdentityVerifier,
    private readonly identityResolver: IdentityResolver,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const identity = await this.verifier.verify(request.header('authorization'));
    const learnerId = await this.identityResolver.resolve('CLERK', identity.subject);
    (request as AuthenticatedRequest).requestContext = {
      learnerId,
      requestId: randomUUID(),
    };
    return true;
  }
}
