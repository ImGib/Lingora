import { Module } from '@nestjs/common';
import { GetMe } from '../../application/identity/get-me.js';
import {
  IDENTITY_REPOSITORY,
} from '../../application/identity/identity-repository.port.js';
import { IdentityResolver } from '../../application/identity/identity-resolver.js';
import {
  PROVIDER_IDENTITY_VERIFIER,
} from '../../application/identity/provider-identity-verifier.port.js';
import { AuthGuard } from '../../http/auth.guard.js';
import { ClerkIdentityVerifier } from '../../infrastructure/auth/clerk-identity-verifier.js';
import { PostgresIdentityRepository } from '../../infrastructure/database/postgres-identity.repository.js';
import { UpdateProfile } from '../../application/identity/update-profile.js';
import { MeController } from './me.controller.js';

@Module({
  controllers: [MeController],
  providers: [
    GetMe,
    UpdateProfile,
    IdentityResolver,
    AuthGuard,
    { provide: IDENTITY_REPOSITORY, useClass: PostgresIdentityRepository },
    { provide: PROVIDER_IDENTITY_VERIFIER, useClass: ClerkIdentityVerifier },
  ],
})
export class IdentityModule {}
