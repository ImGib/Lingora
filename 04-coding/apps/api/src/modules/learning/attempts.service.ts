import { ConflictException, Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import type { Pool, PoolClient } from 'pg';
import { DATABASE_POOL } from '../../infrastructure/database/database.module.js';
import { EVALUATOR_VERSION, EVIDENCE_POLICY_VERSION, evaluateGrammar, projectState } from '../../domain/learning/grammar-evaluator.js';
import { PlanningService } from '../planning/planning.service.js';
import { SessionsService } from './sessions.service.js';

type AttemptRow = { id: string; lesson_id: string; package_version_id: string; session_id: string | null; status: 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED'; idempotency_key: string | null; feedback: { items: FeedbackItem[] } | null };
type ItemRow = { item_id: string; item_version_id: string; response_type: 'SINGLE_CHOICE' | 'SHORT_TEXT'; prompt: Record<string, unknown>; support_policy: Record<string, unknown>; answer_definition: { accepted?: string[] }; feedback_definition: { explanation?: string }; evidence_eligibility: 'NONE' | 'FORMATIVE' | 'SUMMATIVE'; provenance: string; item_family_id: string; value: string | null; first_value: string | null; used_support: boolean; competency_id: string | null; learning_claim: string | null; modality: string | null };
type FeedbackItem = { itemId: string; code: string; correct: boolean; explanation: string };

@Injectable()
export class AttemptsService {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool, private readonly planning: PlanningService,
    private readonly sessions: SessionsService) {}

  async start(learnerId: string, lessonId: string) {
    if (!await this.planning.getGoal(learnerId)) throw new ConflictException('Set a study goal before starting a lesson');
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1),hashtext($2))', [learnerId,lessonId]);
      const existing = await client.query<AttemptRow>(
        `SELECT * FROM attempts WHERE learner_id = $1 AND lesson_id = $2 AND status = 'IN_PROGRESS' ORDER BY created_at DESC LIMIT 1`,
        [learnerId, lessonId],
      );
      if (existing.rows[0]) {
        await client.query('COMMIT');
        return this.get(learnerId, existing.rows[0].id);
      }
      const created = await client.query<AttemptRow>(
        `INSERT INTO attempts (learner_id, lesson_id, package_version_id, status)
         SELECT $1, l.id, lpv.id, 'IN_PROGRESS' FROM lessons l
         JOIN learning_packages lp ON lp.lesson_id = l.id
         JOIN learning_package_versions lpv ON lpv.learning_package_id = lp.id
         WHERE l.id = $2 AND l.status = 'PUBLISHED' AND lpv.status = 'PUBLISHED'
         ORDER BY lpv.version DESC LIMIT 1
         RETURNING *`, [learnerId, lessonId],
      );
      const attempt = created.rows[0];
      if (!attempt) throw new NotFoundException('Published lesson unavailable');
      await client.query(
        `INSERT INTO attempt_items (attempt_id, item_id, item_version_id, activity_id, position)
         SELECT $1, liv.learning_item_id, liv.id, a.id, row_number() OVER (ORDER BY a.position, ai.position)
         FROM activities a JOIN activity_items ai ON ai.activity_id = a.id
         JOIN learning_item_versions liv ON liv.id = ai.learning_item_version_id
         WHERE a.learning_package_version_id = $2 AND liv.status = 'PUBLISHED' AND liv.purpose <> 'BENCHMARK'`,
        [attempt.id, attempt.package_version_id],
      );
      const count = await client.query<{ total: string }>('SELECT count(*)::text AS total FROM attempt_items WHERE attempt_id = $1', [attempt.id]);
      if (count.rows[0]?.total === '0') throw new UnprocessableEntityException('Published package has no answerable items');
      const sessionId = await this.sessions.ensureActive(client, learnerId);
      await client.query(
        `UPDATE attempts SET plan_block_id = (
           SELECT pb.id FROM plan_blocks pb JOIN daily_plans dp ON dp.id = pb.plan_id
           WHERE dp.learner_id = $2 AND dp.local_date = (now() AT TIME ZONE dp.timezone)::date
             AND pb.lesson_id = $3 AND pb.status = 'PENDING' ORDER BY pb.position LIMIT 1
         ) WHERE id = $1`, [attempt.id,learnerId,lessonId],
      );
      await client.query('UPDATE attempts SET session_id = $2 WHERE id = $1', [attempt.id,sessionId]);
      await client.query('COMMIT');
      return this.get(learnerId, attempt.id);
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      throw error;
    } finally { client.release(); }
  }

  async get(learnerId: string, attemptId: string) {
    const attempt = await this.findAttempt(this.pool, learnerId, attemptId);
    const items = await this.items(this.pool, attemptId);
    return {
      id: attempt.id, lessonId: attempt.lesson_id, packageVersionId: attempt.package_version_id, sessionId: attempt.session_id,
      status: attempt.status,
      items: items.map((item) => ({
        id: item.item_id, versionId: item.item_version_id, responseType: item.response_type,
        prompt: item.prompt, supportPolicy: { hintAllowed: item.support_policy.hintAllowed === true },
        response: item.value, hintRevealed: item.used_support,
      })),
      feedback: attempt.status === 'EVALUATED' ? attempt.feedback : null,
    };
  }

  async save(learnerId: string, attemptId: string, itemId: string, value: string) {
    return this.withLockedAttempt(learnerId, attemptId, async (client, attempt) => {
      this.requireInProgress(attempt);
      const result = await client.query<{ response_type: string; prompt: { options?: string[] } }>(
        `SELECT liv.response_type, liv.prompt FROM attempt_items ai
         JOIN learning_item_versions liv ON liv.id = ai.item_version_id
         WHERE ai.attempt_id = $1 AND ai.item_id = $2`, [attemptId, itemId],
      );
      const item = result.rows[0];
      if (!item) throw new NotFoundException('Item not in this attempt');
      const normalized = value.trim();
      if (!normalized || normalized.length > 500 ||
        (item.response_type === 'SINGLE_CHOICE' && !item.prompt.options?.includes(normalized))) {
        throw new UnprocessableEntityException('Response does not match item format');
      }
      await client.query(
        `INSERT INTO responses (attempt_id, item_id, value, first_value) VALUES ($1,$2,$3,$3)
         ON CONFLICT (attempt_id, item_id) DO UPDATE SET value = EXCLUDED.value, saved_at = now()`,
        [attemptId, itemId, normalized],
      );
      return { itemId, value: normalized, saved: true };
    });
  }

  async revealHint(learnerId: string, attemptId: string, itemId: string) {
    return this.withLockedAttempt(learnerId, attemptId, async (client, attempt) => {
      this.requireInProgress(attempt);
      const result = await client.query<{ support_policy: { hintAllowed?: boolean; hint?: string } }>(
        `SELECT liv.support_policy FROM attempt_items ai JOIN learning_item_versions liv ON liv.id = ai.item_version_id
         WHERE ai.attempt_id = $1 AND ai.item_id = $2`, [attemptId, itemId],
      );
      const policy = result.rows[0]?.support_policy;
      if (!policy) throw new NotFoundException('Item not in this attempt');
      if (!policy.hintAllowed || !policy.hint) throw new ConflictException('Hint unavailable for this item');
      await client.query(
        `INSERT INTO support_usages (attempt_id, item_id, support_code) VALUES ($1,$2,'HINT') ON CONFLICT DO NOTHING`,
        [attemptId, itemId],
      );
      return { itemId, hint: policy.hint, revealed: true };
    });
  }

  async submit(learnerId: string, attemptId: string, key: string) {
    const submitted = await this.withLockedAttempt(learnerId, attemptId, async (client, attempt) => {
      if (attempt.status === 'EVALUATED') {
        if (attempt.idempotency_key !== key) throw new ConflictException('Attempt already submitted');
        return { attemptId, status: 'EVALUATED', feedback: attempt.feedback, replayed: true };
      }
      this.requireInProgress(attempt);
      const items = await this.items(client, attemptId);
      if (items.length === 0 || items.some((item) => !item.value)) {
        throw new UnprocessableEntityException('Answer every item before submitting');
      }
      const usedKey = await client.query<{ id: string }>(
        'SELECT id FROM attempts WHERE learner_id = $1 AND idempotency_key = $2', [learnerId, key],
      );
      if (usedKey.rows[0]) throw new ConflictException('Idempotency key belongs to another attempt');
      await client.query(
        `UPDATE attempts SET status = 'SUBMITTED', submitted_at = now(), idempotency_key = $2 WHERE id = $1`,
        [attemptId, key],
      );
      const feedback: FeedbackItem[] = [];
      for (const item of items) {
        const result = evaluateGrammar(item.value!, item.answer_definition.accepted ?? [], item.feedback_definition.explanation ?? 'Review this form.');
        feedback.push({ itemId: item.item_id, code: result.code, correct: result.correct, explanation: result.explanation });
        const observation = await client.query<{ id: string }>(
          `INSERT INTO observations (attempt_id,item_id,item_version_id,produced_value,first_value,revised,result_code,correct,used_support,evaluator_version)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
          [attemptId,item.item_id,item.item_version_id,item.value,item.first_value,item.first_value !== item.value,result.code,result.correct,item.used_support,EVALUATOR_VERSION],
        );
        if (item.evidence_eligibility === 'NONE' || item.provenance === 'AI_GENERATED' || !item.competency_id || !item.learning_claim || !item.modality) continue;
        const direction = result.correct ? 'POSITIVE' : 'NEGATIVE';
        const independence = item.used_support || item.first_value !== item.value ? 1 : 3;
        const priorExposure = await client.query<{ count: string }>(
          `SELECT count(*)::text AS count FROM evidence e
           JOIN observations o ON o.id = e.observation_id
           JOIN learning_item_versions liv ON liv.id = o.item_version_id
           JOIN learning_items li ON li.id = liv.learning_item_id
           WHERE e.learner_id = $1 AND li.item_family_id = $2`, [learnerId,item.item_family_id],
        );
        const previouslyExposed = Number(priorExposure.rows[0]?.count ?? '0') > 0;
        const strength = result.correct ? (independence === 1 || previouslyExposed ? 1 : item.response_type === 'SHORT_TEXT' ? 3 : 2) : 2;
        await client.query(
          `INSERT INTO evidence (observation_id,learner_id,competency_id,learning_claim,modality,direction,strength,independence,confidence,source,trust_tier,policy_version)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'HIGH','DETERMINISTIC_GRAMMAR',$9,$10)`,
          [observation.rows[0]!.id,learnerId,item.competency_id,item.learning_claim,item.modality,direction,strength,independence,item.provenance,EVIDENCE_POLICY_VERSION],
        );
        const history = await client.query<{ direction: 'POSITIVE' | 'NEGATIVE'; strength: number; independence: number; item_family_id: string }>(
          `SELECT e.direction,e.strength,e.independence,li.item_family_id FROM evidence e
           JOIN observations o ON o.id = e.observation_id
           JOIN learning_item_versions liv ON liv.id = o.item_version_id
           JOIN learning_items li ON li.id = liv.learning_item_id
           WHERE e.learner_id = $1 AND e.competency_id = $2 AND e.learning_claim = $3 AND e.modality = $4 AND e.valid = true
           ORDER BY e.occurred_at`, [learnerId,item.competency_id,item.learning_claim,item.modality],
        );
        const state = projectState(history.rows);
        await client.query(
          `INSERT INTO competency_states (learner_id,competency_id,learning_claim,modality,label,confidence,evidence_count,policy_version)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
           ON CONFLICT (learner_id,competency_id,learning_claim,modality)
           DO UPDATE SET label=EXCLUDED.label,confidence=EXCLUDED.confidence,evidence_count=EXCLUDED.evidence_count,
             policy_version=EXCLUDED.policy_version,updated_at=now()`,
          [learnerId,item.competency_id,item.learning_claim,item.modality,state.label,state.confidence,history.rows.length,EVIDENCE_POLICY_VERSION],
        );
      }
      const result = { items: feedback };
      await client.query(
        `UPDATE attempts SET status = 'EVALUATED', evaluator_version = $2, feedback = $3::jsonb, evaluated_at = now() WHERE id = $1`,
        [attemptId,EVALUATOR_VERSION,JSON.stringify(result)],
      );
      await client.query(
        `UPDATE plan_blocks SET status = 'COMPLETED',updated_at = now()
         WHERE id = (SELECT plan_block_id FROM attempts WHERE id = $1) AND status = 'PENDING'`, [attemptId],
      );
      return { attemptId, status: 'EVALUATED', feedback: result, replayed: false };
    });
    return { ...submitted, nextAction: (await this.planning.dashboard(learnerId)).nextAction };
  }

  private async items(executor: Pick<Pool | PoolClient, 'query'>, attemptId: string): Promise<ItemRow[]> {
    const result = await executor.query<ItemRow>(
      `SELECT ai.item_id,ai.item_version_id,liv.response_type,liv.prompt,liv.support_policy,
              liv.answer_definition,liv.feedback_definition,liv.evidence_eligibility,liv.provenance,
              li.item_family_id,r.value,r.first_value,(su.item_id IS NOT NULL) AS used_support,
              lic.competency_id,lic.learning_claim,lic.modality
       FROM attempt_items ai JOIN learning_item_versions liv ON liv.id = ai.item_version_id
       JOIN learning_items li ON li.id = ai.item_id
       LEFT JOIN responses r ON r.attempt_id = ai.attempt_id AND r.item_id = ai.item_id
       LEFT JOIN support_usages su ON su.attempt_id = ai.attempt_id AND su.item_id = ai.item_id AND su.support_code = 'HINT'
       LEFT JOIN learning_item_competencies lic ON lic.learning_item_version_id = ai.item_version_id
       WHERE ai.attempt_id = $1 ORDER BY ai.position`, [attemptId],
    );
    return result.rows;
  }

  private async findAttempt(executor: Pick<Pool | PoolClient, 'query'>, learnerId: string, attemptId: string, lock = false): Promise<AttemptRow> {
    const result = await executor.query<AttemptRow>(
      `SELECT id,lesson_id,package_version_id,session_id,status,idempotency_key,feedback FROM attempts WHERE id = $1 AND learner_id = $2${lock ? ' FOR UPDATE' : ''}`,
      [attemptId,learnerId],
    );
    if (!result.rows[0]) throw new NotFoundException('Attempt not found');
    return result.rows[0];
  }

  private requireInProgress(attempt: AttemptRow): void {
    if (attempt.status !== 'IN_PROGRESS') throw new ConflictException('Attempt is no longer editable');
  }

  private async withLockedAttempt<T>(learnerId: string, attemptId: string, work: (client: PoolClient, attempt: AttemptRow) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const attempt = await this.findAttempt(client, learnerId, attemptId, true);
      if (attempt.session_id && attempt.status === 'IN_PROGRESS') {
        const session = await client.query<{ status: string }>('SELECT status FROM sessions WHERE id = $1', [attempt.session_id]);
        if (session.rows[0]?.status === 'PAUSED') throw new ConflictException('Resume your study session first');
      }
      const result = await work(client, attempt);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      throw error;
    } finally { client.release(); }
  }
}
