import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Pool, PoolClient } from 'pg';
import { DATABASE_POOL } from '../../infrastructure/database/database.module.js';

type SessionRow = {
  id: string; learner_id: string; plan_id: string | null; status: 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED' | 'ABANDONED';
  local_date: string; timezone: string; available_minutes: number | null; started_at: Date; ended_at: Date | null;
};

@Injectable()
export class SessionsService {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async ensureActive(client: PoolClient, learnerId: string): Promise<string> {
    await client.query('SELECT id FROM learners WHERE id = $1 FOR UPDATE', [learnerId]);
    const goal = await client.query<{ id: string }>(
      `SELECT id FROM learner_goals WHERE learner_id = $1 AND status = 'ACTIVE'`, [learnerId],
    );
    if (!goal.rows[0]) throw new ConflictException('Set a study goal before starting a session');
    const active = await client.query<SessionRow>(
      `SELECT * FROM sessions WHERE learner_id = $1 AND status IN ('IN_PROGRESS','PAUSED') FOR UPDATE`, [learnerId],
    );
    if (active.rows[0]) {
      if (active.rows[0].status === 'PAUSED') throw new ConflictException('Resume your study session first');
      return active.rows[0].id;
    }
    const created = await client.query<SessionRow>(
      `INSERT INTO sessions (learner_id,plan_id,status,local_date,timezone)
       SELECT $1,
         (SELECT id FROM daily_plans WHERE learner_id = $1 AND local_date = (now() AT TIME ZONE p.timezone)::date LIMIT 1),
         'IN_PROGRESS',(now() AT TIME ZONE p.timezone)::date,p.timezone
       FROM profiles p WHERE p.learner_id = $1 RETURNING *`, [learnerId],
    );
    if (!created.rows[0]) throw new NotFoundException('Learner profile not found');
    return created.rows[0].id;
  }

  async start(learnerId: string) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const id = await this.ensureActive(client, learnerId);
      await client.query('COMMIT');
      return this.get(learnerId, id);
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      throw error;
    } finally { client.release(); }
  }

  async current(learnerId: string) {
    const result = await this.pool.query<SessionRow>(
      `SELECT * FROM sessions WHERE learner_id = $1 AND status IN ('IN_PROGRESS','PAUSED')`, [learnerId],
    );
    return result.rows[0] ? this.map(result.rows[0]) : null;
  }

  async get(learnerId: string, sessionId: string) {
    const result = await this.pool.query<SessionRow>('SELECT * FROM sessions WHERE id = $1 AND learner_id = $2', [sessionId,learnerId]);
    if (!result.rows[0]) throw new NotFoundException('Session not found');
    return this.map(result.rows[0]);
  }

  async transition(learnerId: string, sessionId: string, action: 'pause' | 'resume' | 'complete' | 'abandon') {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await client.query<SessionRow>(
        'SELECT * FROM sessions WHERE id = $1 AND learner_id = $2 FOR UPDATE', [sessionId,learnerId],
      );
      const session = result.rows[0];
      if (!session) throw new NotFoundException('Session not found');
      const from = action === 'resume' ? 'PAUSED' : 'IN_PROGRESS';
      if (session.status !== from) throw new ConflictException('Session cannot make that transition');
      if (action === 'complete' || action === 'abandon') {
        const unfinished = await client.query<{ count: string }>(
          `SELECT count(*)::text AS count FROM attempts WHERE session_id = $1 AND status = 'IN_PROGRESS'`, [sessionId],
        );
        if (unfinished.rows[0]?.count !== '0') throw new ConflictException('Finish or resume the current attempt first');
      }
      const target = { pause: 'PAUSED', resume: 'IN_PROGRESS', complete: 'COMPLETED', abandon: 'ABANDONED' }[action];
      await client.query(
        `UPDATE sessions SET status = $2,ended_at = CASE WHEN $2 IN ('COMPLETED','ABANDONED') THEN now() ELSE NULL END WHERE id = $1`,
        [sessionId,target],
      );
      await client.query('COMMIT');
      return this.get(learnerId, sessionId);
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      throw error;
    } finally { client.release(); }
  }

  private map(row: SessionRow) {
    return { id: row.id, planId: row.plan_id, status: row.status, localDate: row.local_date,
      timezone: row.timezone, availableMinutes: row.available_minutes,
      startedAt: row.started_at.toISOString(), endedAt: row.ended_at?.toISOString() ?? null };
  }
}
