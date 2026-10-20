import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Pool, PoolClient } from 'pg';
import { evaluateStartingPoint } from '../../domain/placement/starting-point-policy.js';
import { DATABASE_POOL } from '../../infrastructure/database/database.module.js';

type PlacementRow = {
  id: string;
  status: 'IN_PROGRESS' | 'SKIPPED' | 'COMPLETED';
  placement_version_id: string;
  version: number;
  policy_version: string;
  recommended_start: string | null;
  started_at: Date;
  completed_at: Date | null;
};

type ItemRow = {
  id: string;
  code: string;
  position: number;
  claim_code: string;
  modality: string;
  response_type: 'SINGLE_CHOICE' | 'SHORT_TEXT';
  prompt: Record<string, unknown>;
  answer_definition: { accepted?: unknown };
  value: string | null;
  correct: boolean | null;
};

@Injectable()
export class PlacementService {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async start(learnerId: string, idempotencyKey: string, mode: 'START' | 'SKIP') {
    const previous = await this.findByIdempotencyKey(learnerId, idempotencyKey);
    if (previous) return this.get(learnerId, previous);

    if (mode === 'START') {
      const active = await this.pool.query<{ id: string }>(
        "SELECT id FROM placements WHERE learner_id = $1 AND status = 'IN_PROGRESS'",
        [learnerId],
      );
      if (active.rows[0]) return this.get(learnerId, active.rows[0].id);
    }

    const terminal = mode === 'SKIP';
    let result;
    try {
      result = await this.pool.query<{ id: string }>(
        `INSERT INTO placements
          (learner_id,placement_version_id,status,idempotency_key,recommended_start,completed_at)
         SELECT $1,id,$2,$3,$4,$5 FROM placement_versions
         WHERE code = 'M1.STARTING_POINT' AND status = 'PUBLISHED'
         ORDER BY version DESC LIMIT 1 RETURNING id`,
        [learnerId, terminal ? 'SKIPPED' : 'IN_PROGRESS', idempotencyKey,
          terminal ? 'WEEK_1_DAY_1' : null, terminal ? new Date() : null],
      );
    } catch (error) {
      if ((error as { code?: string }).code !== '23505') throw error;
      const retry = await this.findByIdempotencyKey(learnerId, idempotencyKey);
      if (retry) return this.get(learnerId, retry);
      const active = await this.current(learnerId);
      if (mode === 'START' && active?.status === 'IN_PROGRESS') return active;
      throw new ConflictException('Starting Point Check changed; please retry');
    }
    const id = result.rows[0]?.id;
    if (!id) throw new ConflictException('No published Starting Point Check is available');
    return this.get(learnerId, id);
  }

  async get(learnerId: string, placementId: string) {
    const placement = await this.getPlacement(this.pool, learnerId, placementId);
    const items = await this.getItems(this.pool, placement.id, placement.placement_version_id);
    return this.mapPlacement(placement, items);
  }

  async current(learnerId: string) {
    const result = await this.pool.query<{ id: string }>(
      `SELECT id FROM placements WHERE learner_id = $1
       ORDER BY (status = 'IN_PROGRESS') DESC, started_at DESC, id DESC LIMIT 1`,
      [learnerId],
    );
    return result.rows[0] ? this.get(learnerId, result.rows[0].id) : null;
  }

  async next(learnerId: string, placementId: string) {
    const placement = await this.getPlacement(this.pool, learnerId, placementId);
    if (placement.status !== 'IN_PROGRESS') return { placement: this.mapPlacement(placement, []), item: null };
    const result = await this.pool.query<ItemRow>(
      `SELECT pi.id,pi.code,pi.position,pi.claim_code,pi.modality,pi.response_type,pi.prompt,
              pi.answer_definition,NULL::text AS value,NULL::boolean AS correct
       FROM placement_items pi
       LEFT JOIN placement_responses pr ON pr.placement_id = $1 AND pr.placement_item_id = pi.id
       WHERE pi.placement_version_id = $2 AND pr.placement_item_id IS NULL
       ORDER BY pi.position LIMIT 1`,
      [placementId, placement.placement_version_id],
    );
    return { placement: this.mapPlacement(placement, []), item: result.rows[0] ? this.publicItem(result.rows[0]) : null };
  }

  async saveResponse(learnerId: string, placementId: string, itemId: string, value: string) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const placement = await this.getPlacement(client, learnerId, placementId, true);
      if (placement.status !== 'IN_PROGRESS') throw new ConflictException('Starting Point Check is already closed');
      const result = await client.query(
        `INSERT INTO placement_responses (placement_id,placement_item_id,value,correct)
         SELECT $1,pi.id,$3,NULL FROM placement_items pi
         WHERE pi.id = $2 AND pi.placement_version_id = $4
         ON CONFLICT (placement_id,placement_item_id)
         DO UPDATE SET value = EXCLUDED.value,correct = NULL,saved_at = now()
         RETURNING placement_item_id`,
        [placementId, itemId, value.trim(), placement.placement_version_id],
      );
      if (!result.rowCount) throw new NotFoundException('Starting Point item not found');
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      throw error;
    } finally {
      client.release();
    }
    return this.get(learnerId, placementId);
  }

  async complete(learnerId: string, placementId: string) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const placement = await this.getPlacement(client, learnerId, placementId, true);
      if (placement.status !== 'IN_PROGRESS') {
        await client.query('COMMIT');
        return this.get(learnerId, placementId);
      }
      const items = await this.getItems(client, placement.id, placement.placement_version_id);
      const evaluated = evaluateStartingPoint(
        items.map((item) => ({
          id: item.id,
          claimCode: item.claim_code,
          modality: item.modality,
          accepted: this.acceptedAnswers(item),
        })),
        items.filter((item) => item.value !== null).map((item) => ({ itemId: item.id, value: item.value! })),
      );
      for (const claim of evaluated.coverage) {
        await client.query(
          'UPDATE placement_responses SET correct = $3 WHERE placement_id = $1 AND placement_item_id = $2',
          [placementId, claim.itemId, claim.correct],
        );
      }
      await client.query(
        `UPDATE placements SET status = 'COMPLETED',recommended_start = $2,completed_at = now(),updated_at = now()
         WHERE id = $1`,
        [placementId, evaluated.recommendedStart],
      );
      await client.query('COMMIT');
      return this.get(learnerId, placementId);
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      throw error;
    } finally {
      client.release();
    }
  }

  private async findByIdempotencyKey(learnerId: string, key: string): Promise<string | null> {
    const result = await this.pool.query<{ id: string }>(
      'SELECT id FROM placements WHERE learner_id = $1 AND idempotency_key = $2',
      [learnerId, key],
    );
    return result.rows[0]?.id ?? null;
  }

  private async getPlacement(
    connection: Pick<Pool, 'query'> | Pick<PoolClient, 'query'>,
    learnerId: string,
    placementId: string,
    lock = false,
  ): Promise<PlacementRow> {
    const result = await connection.query<PlacementRow>(
      `SELECT p.id,p.status,p.placement_version_id,pv.version,pv.policy_version,
              p.recommended_start,p.started_at,p.completed_at
       FROM placements p JOIN placement_versions pv ON pv.id = p.placement_version_id
       WHERE p.id = $1 AND p.learner_id = $2${lock ? ' FOR UPDATE OF p' : ''}`,
      [placementId, learnerId],
    );
    if (!result.rows[0]) throw new NotFoundException('Starting Point Check not found');
    return result.rows[0];
  }

  private async getItems(
    connection: Pick<Pool, 'query'> | Pick<PoolClient, 'query'>,
    placementId: string,
    versionId: string,
  ): Promise<ItemRow[]> {
    const result = await connection.query<ItemRow>(
      `SELECT pi.id,pi.code,pi.position,pi.claim_code,pi.modality,pi.response_type,pi.prompt,
              pi.answer_definition,pr.value,pr.correct
       FROM placement_items pi
       LEFT JOIN placement_responses pr ON pr.placement_id = $1 AND pr.placement_item_id = pi.id
       WHERE pi.placement_version_id = $2 ORDER BY pi.position`,
      [placementId, versionId],
    );
    return result.rows;
  }

  private acceptedAnswers(item: ItemRow): string[] {
    const accepted = item.answer_definition.accepted;
    if (!Array.isArray(accepted) || !accepted.every((value) => typeof value === 'string')) {
      throw new ConflictException(`Invalid answer definition for ${item.code}`);
    }
    return accepted;
  }

  private publicItem(item: ItemRow) {
    return { id: item.id, code: item.code, position: item.position, claimCode: item.claim_code,
      modality: item.modality, responseType: item.response_type, prompt: item.prompt, response: item.value };
  }

  private mapPlacement(placement: PlacementRow, items: ItemRow[]) {
    return {
      id: placement.id,
      status: placement.status,
      version: placement.version,
      policyVersion: placement.policy_version,
      recommendedStart: placement.recommended_start,
      startedAt: placement.started_at,
      completedAt: placement.completed_at,
      items: items.map((item) => ({
        ...this.publicItem(item),
        result: item.correct === null ? null : item.correct ? 'ALREADY_DEMONSTRATED' : 'NEED_MORE_EVIDENCE',
      })),
    };
  }
}
