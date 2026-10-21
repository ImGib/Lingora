import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { UpdateProfileDto } from '@lingora/contracts';
import type { Pool, PoolClient } from 'pg';
import type {
  IdentityRepository,
  LearnerProfile,
} from '../../application/identity/identity-repository.port.js';
import { DATABASE_POOL } from './database.module.js';

type IdentityRow = { learner_id: string };
type ProfileRow = {
  learner_id: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  display_name: string | null;
  native_language: string | null;
  timezone: string;
};

@Injectable()
export class PostgresIdentityRepository implements IdentityRepository {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async resolveOrProvision(provider: string, providerUserId: string): Promise<string> {
    const existing = await this.findIdentity(this.pool, provider, providerUserId);
    if (existing) {
      await this.pool.query(
        `UPDATE identity_accounts SET last_seen_at = now() WHERE provider = $1 AND provider_user_id = $2`,
        [provider, providerUserId],
      );
      return existing;
    }

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const learner = await client.query<{ id: string }>(
        `INSERT INTO learners (status) VALUES ('ACTIVE') RETURNING id`,
      );
      const learnerId = learner.rows[0]?.id;
      if (!learnerId) throw new Error('Learner provisioning did not return an id');

      const account = await client.query<IdentityRow>(
        `INSERT INTO identity_accounts (learner_id, provider, provider_user_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (provider, provider_user_id) DO NOTHING
         RETURNING learner_id`,
        [learnerId, provider, providerUserId],
      );

      if (!account.rows[0]) {
        await client.query('ROLLBACK');
        const winner = await this.findIdentity(this.pool, provider, providerUserId);
        if (!winner) throw new Error('Concurrent identity provisioning could not be resolved');
        return winner;
      }

      await client.query(`INSERT INTO profiles (learner_id) VALUES ($1)`, [learnerId]);
      await client.query('COMMIT');
      return learnerId;
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      throw error;
    } finally {
      client.release();
    }
  }

  async getLearnerProfile(learnerId: string): Promise<LearnerProfile | null> {
    const result = await this.pool.query<ProfileRow>(
      `SELECT l.id AS learner_id, l.status, p.display_name, p.native_language, p.timezone
       FROM learners l
       JOIN profiles p ON p.learner_id = l.id
       WHERE l.id = $1`,
      [learnerId],
    );
    return result.rows[0] ? this.mapProfile(result.rows[0]) : null;
  }

  async hasActiveGoal(learnerId: string): Promise<boolean> {
    const result = await this.pool.query<{ exists: boolean }>(
      `SELECT EXISTS (SELECT 1 FROM learner_goals WHERE learner_id = $1 AND status = 'ACTIVE') AS exists`,
      [learnerId],
    );
    return result.rows[0]?.exists === true;
  }

  async updateProfile(learnerId: string, patch: UpdateProfileDto): Promise<LearnerProfile> {
    const fields: string[] = [];
    const values: unknown[] = [];
    for (const [key, column] of [
      ['displayName', 'display_name'],
      ['nativeLanguage', 'native_language'],
      ['timezone', 'timezone'],
    ] as const) {
      if (key in patch) {
        values.push(patch[key]);
        fields.push(`${column} = $${values.length}`);
      }
    }
    if (fields.length > 0) {
      values.push(learnerId);
      await this.pool.query(
        `UPDATE profiles SET ${fields.join(', ')}, updated_at = now() WHERE learner_id = $${values.length}`,
        values,
      );
    }
    const updated = await this.getLearnerProfile(learnerId);
    if (!updated) throw new NotFoundException('Learner not found');
    return updated;
  }

  private async findIdentity(
    executor: Pick<Pool | PoolClient, 'query'>,
    provider: string,
    providerUserId: string,
  ): Promise<string | null> {
    const result = await executor.query<IdentityRow>(
      `SELECT learner_id FROM identity_accounts WHERE provider = $1 AND provider_user_id = $2`,
      [provider, providerUserId],
    );
    return result.rows[0]?.learner_id ?? null;
  }

  private mapProfile(row: ProfileRow): LearnerProfile {
    return {
      learnerId: row.learner_id,
      status: row.status,
      profile: {
        displayName: row.display_name,
        nativeLanguage: row.native_language,
        timezone: row.timezone,
      },
    };
  }
}
