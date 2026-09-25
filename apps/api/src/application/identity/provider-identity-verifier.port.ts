export interface ProviderIdentityVerifier {
  verify(authorizationHeader: string | undefined): Promise<{ subject: string }>;
}

export const PROVIDER_IDENTITY_VERIFIER = Symbol('PROVIDER_IDENTITY_VERIFIER');
