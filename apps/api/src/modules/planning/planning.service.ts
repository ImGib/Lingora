import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Pool } from 'pg';
import { DATABASE_POOL } from '../../infrastructure/database/database.module.js';

const LESSON_ID = '10000000-0000-4000-8000-000000000008';
const POLICY_VERSION = 'PLAN_01_V1';

type GoalRow = { id: string; version: number; purpose: string; target_band: string | null; deadline: string | null; study_minutes_per_day: number; status: string };
type PlanRow = { id: string; local_date: string; timezone: string; policy_version: string; goal_id: string };
type BlockRow = { id: string; position: number; block_type: 'LESSON' | 'PRACTICE' | 'BREAK'; lesson_id: string | null; status: 'PENDING' | 'COMPLETED' | 'SKIPPED' | 'DEFERRED' };
type AttemptRow = { id: string; status: string; lesson_id: string };
type ActiveSessionRow = { id: string; status: 'IN_PROGRESS' | 'PAUSED' };

@Injectable()
export class PlanningService {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async getGoal(learnerId: string) {
    const result = await this.pool.query<GoalRow>(
      `SELECT id,version,purpose,target_band,deadline,study_minutes_per_day,status
       FROM learner_goals WHERE learner_id = $1 AND status = 'ACTIVE'`, [learnerId],
    );
    return result.rows[0] ? this.mapGoal(result.rows[0]) : null;
  }

  async setGoal(learnerId: string, input: { purpose: 'IELTS_ACADEMIC' | 'STUDY_ABROAD' | 'GENERAL_ENGLISH'; targetBand?: number | null | undefined; deadline?: string | null | undefined; studyMinutesPerDay: number }) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SELECT id FROM learners WHERE id = $1 FOR UPDATE', [learnerId]);
      const latest = await client.query<{ version: number }>('SELECT version FROM learner_goals WHERE learner_id = $1 ORDER BY version DESC LIMIT 1', [learnerId]);
      await client.query("UPDATE learner_goals SET status = 'ARCHIVED' WHERE learner_id = $1 AND status = 'ACTIVE'", [learnerId]);
      const result = await client.query<GoalRow>(
        `INSERT INTO learner_goals (learner_id,version,purpose,target_band,deadline,study_minutes_per_day,status)
         VALUES ($1,$2,$3,$4,$5,$6,'ACTIVE') RETURNING id,version,purpose,target_band,deadline,study_minutes_per_day,status`,
        [learnerId,(latest.rows[0]?.version ?? 0)+1,input.purpose,input.targetBand ?? null,input.deadline ?? null,input.studyMinutesPerDay],
      );
      await client.query('COMMIT');
      return this.mapGoal(result.rows[0]!);
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      throw error;
    } finally { client.release(); }
  }

  async generate(learnerId: string) {
    const goal = await this.getGoal(learnerId);
    if (!goal) throw new ConflictException('Set a study goal first');
    const profile = await this.pool.query<{ timezone: string }>('SELECT timezone FROM profiles WHERE learner_id = $1', [learnerId]);
    const timezone = profile.rows[0]?.timezone ?? 'Asia/Ho_Chi_Minh';
    const localDate = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const created = await client.query<PlanRow>(
        `INSERT INTO daily_plans (learner_id,goal_id,local_date,timezone,policy_version,curriculum_version_id)
         SELECT $1,$2,$3,$4,$5,id FROM curriculum_versions WHERE code = 'CURRICULUM.LINGORA' AND status = 'PUBLISHED'
         ORDER BY version DESC LIMIT 1
         ON CONFLICT (learner_id,local_date) DO NOTHING
         RETURNING id,local_date,timezone,policy_version,goal_id`,
        [learnerId,goal.id,localDate,timezone,POLICY_VERSION],
      );
      if (created.rows[0]) {
        await client.query(
          `INSERT INTO plan_blocks (plan_id,position,block_type,lesson_id,status) VALUES
           ($1,1,'LESSON',$2,'PENDING'),($1,2,'PRACTICE',$2,'PENDING'),($1,3,'BREAK',NULL,'PENDING')`,
          [created.rows[0].id,LESSON_ID],
        );
      }
      await client.query('COMMIT');
      return this.getToday(learnerId);
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      throw error;
    } finally { client.release(); }
  }

  async getToday(learnerId: string) {
    const result = await this.pool.query<PlanRow>(
      `SELECT dp.id,dp.local_date::text,dp.timezone,dp.policy_version,dp.goal_id FROM daily_plans dp
       WHERE dp.learner_id = $1 AND dp.local_date = (now() AT TIME ZONE dp.timezone)::date`, [learnerId],
    );
    const plan = result.rows[0];
    if (!plan) return null;
    const blocks = await this.pool.query<BlockRow>(
      'SELECT id,position,block_type,lesson_id,status FROM plan_blocks WHERE plan_id = $1 ORDER BY position', [plan.id],
    );
    return { id: plan.id, localDate: plan.local_date, timezone: plan.timezone,
      policyVersion: plan.policy_version, goalId: plan.goal_id,
      blocks: blocks.rows.map((block) => ({ id: block.id, position: block.position, type: block.block_type,
        lessonId: block.lesson_id, status: block.status })) };
  }

  async overrideBlock(learnerId: string, blockId: string, action: 'skip' | 'defer' | 'replace' | 'explore') {
    const block = await this.pool.query<{ id: string; status: string; block_type: string; replaced_from: string | null }>(
      `SELECT pb.id,pb.status,pb.block_type,pb.replaced_from FROM plan_blocks pb JOIN daily_plans dp ON dp.id = pb.plan_id
       WHERE pb.id = $1 AND dp.learner_id = $2`, [blockId,learnerId],
    );
    if (!block.rows[0]) throw new NotFoundException('Plan block not found');
    if (block.rows[0].status !== 'PENDING') throw new ConflictException('Block cannot be changed');
    if (action === 'replace') {
      if (block.rows[0].block_type === 'BREAK' || block.rows[0].replaced_from) throw new ConflictException('No alternative block is available');
      await this.pool.query(
        `UPDATE plan_blocks SET block_type = CASE block_type WHEN 'LESSON' THEN 'PRACTICE' ELSE 'LESSON' END,
         replaced_from = block_type,last_override = 'REPLACE',updated_at = now() WHERE id = $1`, [blockId],
      );
      return this.dashboard(learnerId);
    }
    if (action === 'explore') {
      await this.pool.query(
        `UPDATE plan_blocks SET last_override = 'EXPLORE',explored_at = now(),updated_at = now() WHERE id = $1`, [blockId],
      );
      const dashboard = await this.dashboard(learnerId);
      return { ...dashboard, nextAction: { ...dashboard.nextAction, type: 'OPEN_LESSON',
        target: { lessonId: LESSON_ID }, reasonCodes: ['LEARNER_EXPLORE'], planBlockId: null } };
    }
    if (action === 'skip' || action === 'defer') {
      await this.pool.query('UPDATE plan_blocks SET status = $2,last_override = $3,updated_at = now() WHERE id = $1',
        [blockId,action === 'skip' ? 'SKIPPED' : 'DEFERRED',action.toUpperCase()]);
    }
    return this.dashboard(learnerId);
  }

  async completeBreak(learnerId: string, blockId: string) {
    const result = await this.pool.query(
      `UPDATE plan_blocks pb SET status = 'COMPLETED',updated_at = now()
       FROM daily_plans dp WHERE pb.id = $1 AND pb.plan_id = dp.id AND dp.learner_id = $2
         AND pb.block_type = 'BREAK' AND pb.status = 'PENDING' RETURNING pb.id`, [blockId,learnerId],
    );
    if (!result.rowCount) throw new ConflictException('Break cannot be completed');
    return this.dashboard(learnerId);
  }

  async dashboard(learnerId: string) {
    const goal = await this.getGoal(learnerId);
    const plan = goal ? await this.getToday(learnerId) : null;
    const active = await this.pool.query<AttemptRow>(
      `SELECT id,status,lesson_id FROM attempts WHERE learner_id = $1 AND status = 'IN_PROGRESS'
       ORDER BY created_at DESC LIMIT 1`, [learnerId],
    );
    const session = await this.pool.query<ActiveSessionRow>(
      `SELECT id,status FROM sessions WHERE learner_id = $1 AND status IN ('IN_PROGRESS','PAUSED')`, [learnerId],
    );
    const latest = await this.pool.query<AttemptRow>(
      `SELECT id,status,lesson_id FROM attempts WHERE learner_id = $1 AND status = 'EVALUATED'
       ORDER BY evaluated_at DESC LIMIT 1`, [learnerId],
    );
    const state = await this.pool.query<{ label: string; confidence: string }>(
      `SELECT label,confidence FROM competency_states WHERE learner_id = $1
       AND competency_id = '20000000-0000-4000-8000-000000000003'
       AND learning_claim = 'INDEPENDENTLY_PRODUCE_REGULAR_3PS'`, [learnerId],
    );
    const pending = plan?.blocks.find((block) => block.status === 'PENDING');
    let type = 'FINISH_DAY'; let target: Record<string,string> = {}; let reasonCode = 'PLAN_COMPLETE';
    if (!goal) { type = 'SET_GOAL'; reasonCode = 'GOAL_MISSING'; }
    else if (session.rows[0]?.status === 'PAUSED') { type = 'RESUME_SESSION'; target = { sessionId: session.rows[0].id }; reasonCode = 'SESSION_PAUSED'; }
    else if (active.rows[0]) { type = 'RESUME_ATTEMPT'; target = { attemptId: active.rows[0].id }; reasonCode = 'ATTEMPT_IN_PROGRESS'; }
    else if (!plan) { type = 'OPEN_TODAY_PLAN'; reasonCode = 'PLAN_NOT_GENERATED'; }
    else if (pending?.type === 'BREAK') { type = 'TAKE_BREAK'; reasonCode = 'BREAK_SCHEDULED'; }
    else if (pending) {
      type = pending.type === 'PRACTICE' ? 'START_ACTIVITY' : 'OPEN_LESSON';
      target = { lessonId: pending.lessonId ?? LESSON_ID };
      reasonCode = pending.type === 'PRACTICE' ? 'MORE_EVIDENCE_NEEDED' : 'LESSON_AVAILABLE';
    } else if (latest.rows[0]) { type = 'VIEW_FEEDBACK'; target = { attemptId: latest.rows[0].id }; reasonCode = 'FEEDBACK_READY'; }
    if (type === 'FINISH_DAY' && session.rows[0]) target = { sessionId: session.rows[0].id };
    return { goal, plan, session: session.rows[0] ?? null,
      competency: state.rows[0] ?? { label: 'UNKNOWN', confidence: 'LOW' },
      nextAction: { type, target, reasonCodes: [reasonCode], planBlockId: pending?.id ?? null,
        decisionTrace: { policyVersion: POLICY_VERSION, goalVersion: goal?.goalVersion ?? null,
          curriculumVersion: 1, evidenceState: state.rows[0]?.label ?? 'UNKNOWN' } } };
  }

  async competencyState(learnerId: string, competencyId: string) {
    const competency = await this.pool.query<{ id: string; code: string; title: string }>(
      'SELECT id,code,title FROM competencies WHERE id = $1 AND status = $2', [competencyId,'ACTIVE'],
    );
    if (!competency.rows[0]) throw new NotFoundException('Competency not found');
    const states = await this.pool.query<{ learning_claim: string; modality: string; label: string; confidence: string; evidence_count: number; policy_version: string }>(
      `SELECT learning_claim,modality,label,confidence,evidence_count,policy_version
       FROM competency_states WHERE learner_id = $1 AND competency_id = $2`, [learnerId,competencyId],
    );
    return { competency: competency.rows[0], claims: states.rows.map((state) => ({
      learningClaim: state.learning_claim, modality: state.modality, label: state.label,
      confidence: state.confidence, evidenceCount: state.evidence_count, policyVersion: state.policy_version,
    })) };
  }

  private mapGoal(row: GoalRow) {
    return { id: row.id, goalVersion: row.version, targetVersion: row.version, purpose: row.purpose,
      targetBand: row.target_band === null ? null : Number(row.target_band),
      deadline: row.deadline, studyMinutesPerDay: row.study_minutes_per_day };
  }
}
