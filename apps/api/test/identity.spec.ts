import { describe, expect, it } from 'vitest';
import { updateProfileSchema } from '@lingora/contracts';
import type { UpdateProfileDto } from '@lingora/contracts';
import { GetMe } from '../src/application/identity/get-me.js';
import type {
  IdentityRepository,
  LearnerProfile,
} from '../src/application/identity/identity-repository.port.js';
import { IdentityResolver } from '../src/application/identity/identity-resolver.js';
import { UpdateProfile } from '../src/application/identity/update-profile.js';

class DurableIdentityStore implements IdentityRepository {
  private readonly identities = new Map<string, string>();
  private readonly learners = new Map<string, LearnerProfile>();

  resolveOrProvision(provider: string, providerUserId: string): Promise<string> {
    const key = `${provider}:${providerUserId}`;
    const existing = this.identities.get(key);
    if (existing) return Promise.resolve(existing);
    const learnerId = crypto.randomUUID();
    this.identities.set(key, learnerId);
    this.learners.set(learnerId, {
      learnerId,
      status: 'ACTIVE',
      profile: { displayName: null, nativeLanguage: null, timezone: 'Asia/Ho_Chi_Minh' },
    });
    return Promise.resolve(learnerId);
  }

  getLearnerProfile(learnerId: string): Promise<LearnerProfile | null> {
    return Promise.resolve(this.learners.get(learnerId) ?? null);
  }

  updateProfile(
    learnerId: string,
    patch: UpdateProfileDto,
  ): Promise<LearnerProfile> {
    const current = this.learners.get(learnerId);
    if (!current) throw new Error('missing learner');
    const updated: LearnerProfile = {
      ...current,
      profile: {
        displayName: patch.displayName === undefined ? current.profile.displayName : patch.displayName,
        nativeLanguage:
          patch.nativeLanguage === undefined ? current.profile.nativeLanguage : patch.nativeLanguage,
        timezone: patch.timezone ?? current.profile.timezone,
      },
    };
    this.learners.set(learnerId, updated);
    return Promise.resolve(updated);
  }

  count(): number {
    return this.learners.size;
  }
}

describe('Slice 01A identity', () => {
  it('provisions exactly one learner and resolves the same identity after reconnect', async () => {
    const store = new DurableIdentityStore();
    const firstProcess = new IdentityResolver(store);
    const first = await firstProcess.resolve('CLERK', 'user_same');
    const reconnectedProcess = new IdentityResolver(store);
    const second = await reconnectedProcess.resolve('CLERK', 'user_same');
    expect(second).toBe(first);
    expect(store.count()).toBe(1);
  });

  it('maps different provider identities to different Lingora learners', async () => {
    const store = new DurableIdentityStore();
    const resolver = new IdentityResolver(store);
    const [a, b] = await Promise.all([
      resolver.resolve('CLERK', 'user_a'),
      resolver.resolve('CLERK', 'user_b'),
    ]);
    expect(a).not.toBe(b);
  });

  it('does not duplicate a learner under concurrent first-login requests', async () => {
    const store = new DurableIdentityStore();
    const resolver = new IdentityResolver(store);
    const ids = await Promise.all(
      Array.from({ length: 20 }, () => resolver.resolve('CLERK', 'user_concurrent')),
    );
    expect(new Set(ids).size).toBe(1);
    expect(store.count()).toBe(1);
  });

  it('scopes profile reads and writes to the authenticated learner', async () => {
    const store = new DurableIdentityStore();
    const resolver = new IdentityResolver(store);
    const learnerA = await resolver.resolve('CLERK', 'user_a');
    const learnerB = await resolver.resolve('CLERK', 'user_b');
    const update = new UpdateProfile(store);
    await update.execute(learnerA, { displayName: 'Bao' });
    expect((await new GetMe(store).execute(learnerA)).profile.displayName).toBe('Bao');
    expect((await new GetMe(store).execute(learnerB)).profile.displayName).toBeNull();
  });

  it('rejects client-supplied learner authority and does not leak provider rows', async () => {
    expect(() => updateProfileSchema.parse({ learnerId: crypto.randomUUID() })).toThrow();
    const store = new DurableIdentityStore();
    const learnerId = await new IdentityResolver(store).resolve('CLERK', 'provider-secret-id');
    const dto = await new GetMe(store).execute(learnerId);
    expect(dto).not.toHaveProperty('providerUserId');
    expect(JSON.stringify(dto)).not.toContain('provider-secret-id');
  });
});
