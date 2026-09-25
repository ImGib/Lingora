import 'reflect-metadata';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import pg from 'pg';
import request from 'supertest';
import { Module, UnauthorizedException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ApiExceptionFilter } from '../dist/http/api-exception.filter.js';
import { AuthGuard } from '../dist/http/auth.guard.js';
import { IdentityResolver } from '../dist/application/identity/identity-resolver.js';
import { PROVIDER_IDENTITY_VERIFIER } from '../dist/application/identity/provider-identity-verifier.port.js';
import { CURRICULUM_REPOSITORY } from '../dist/application/curriculum/curriculum-repository.port.js';
import { GetPublishedLesson } from '../dist/application/curriculum/get-published-lesson.js';
import { LessonsController } from '../dist/modules/curriculum/lessons.controller.js';
import { AttemptsController } from '../dist/modules/learning/attempts.controller.js';
import { PlanningController } from '../dist/modules/planning/planning.controller.js';
import { PostgresIdentityRepository } from '../dist/infrastructure/database/postgres-identity.repository.js';
import { PostgresCurriculumRepository } from '../dist/infrastructure/database/postgres-curriculum.repository.js';
import { PlanningService } from '../dist/modules/planning/planning.service.js';
import { AttemptsService } from '../dist/modules/learning/attempts.service.js';

const connectionString = process.env.TEST_DATABASE_URL;
if (!connectionString) throw new Error('TEST_DATABASE_URL must point to a disposable PostgreSQL database.');

const schema = `slice01_verify_${randomBytes(6).toString('hex')}`;
const migrations = join(dirname(fileURLToPath(import.meta.url)), '..', 'supabase', 'migrations');
const admin = new pg.Pool({ connectionString, max: 2 });
let pool;
let app;
let schemaCreated = false;
const rolesCreated = [];

try {
  for (const role of ['anon', 'authenticated']) {
    const result = await admin.query('SELECT 1 FROM pg_roles WHERE rolname = $1', [role]);
    if (result.rowCount === 0) {
      await admin.query(`CREATE ROLE ${role} NOLOGIN`);
      rolesCreated.push(role);
    }
  }
  await admin.query(`CREATE SCHEMA "${schema}"`);
  schemaCreated = true;
  pool = new pg.Pool({ connectionString, max: 5, options: `-c search_path=${schema},public` });
  assert.equal((await pool.query('SELECT current_schema() AS name')).rows[0].name, schema);
  for (const name of (await readdir(migrations)).filter((name) => name.endsWith('.sql')).sort()) {
    await pool.query(await readFile(join(migrations, name), 'utf8'));
  }

  const privileges = await admin.query(
    `SELECT c.relname,c.relrowsecurity,
      has_table_privilege('anon',c.oid,'SELECT') AS anon_select,
      has_table_privilege('authenticated',c.oid,'SELECT') AS authenticated_select
     FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = $1 AND c.relkind = 'r'`, [schema],
  );
  assert.ok(privileges.rows.length >= 20);
  assert.ok(privileges.rows.every((row) => row.relrowsecurity && !row.anon_select && !row.authenticated_select));

  const identities = new PostgresIdentityRepository(pool);
  const learnerA = await identities.resolveOrProvision('CLERK', `slice01-a-${schema}`);
  const learnerB = await identities.resolveOrProvision('CLERK', `slice01-b-${schema}`);
  assert.equal(await identities.resolveOrProvision('CLERK', `slice01-a-${schema}`), learnerA);
  assert.notEqual(learnerA, learnerB);
  assert.equal(await identities.hasActiveGoal(learnerA), false);
  await identities.updateProfile(learnerA, { displayName: 'Test learner', timezone: 'Asia/Ho_Chi_Minh' });
  assert.equal((await identities.getLearnerProfile(learnerA)).profile.displayName, 'Test learner');

  const lessonId = '10000000-0000-4000-8000-000000000008';
  const lesson = await new PostgresCurriculumRepository(pool).getPublishedLesson(lessonId);
  assert.equal(lesson.packageVersion, 2);
  assert.deepEqual(lesson.activities.map((activity) => activity.type),
    ['INSTRUCTION','RECOGNITION','CONTROLLED_PRACTICE','INDEPENDENT_CHECK','REFLECTION']);
  assert.equal(lesson.activities.flatMap((activity) => activity.items).length, 3);
  assert.doesNotMatch(JSON.stringify(lesson), /accepted|answer_definition|For she, add -s/);

  const planning = new PlanningService(pool);
  const attempts = new AttemptsService(pool, planning);
  assert.equal((await planning.dashboard(learnerA)).nextAction.type, 'SET_GOAL');
  const goal = await planning.setGoal(learnerA, { purpose: 'IELTS_ACADEMIC', studyMinutesPerDay: 20 });
  assert.equal(goal.goalVersion, 1);
  assert.equal(await identities.hasActiveGoal(learnerA), true);
  const plan = await planning.generate(learnerA);
  assert.equal(plan.blocks.length, 3);
  assert.equal((await planning.dashboard(learnerA)).nextAction.type, 'OPEN_LESSON');

  const attempt = await attempts.start(learnerA, lessonId);
  assert.equal((await attempts.start(learnerA, lessonId)).id, attempt.id);
  assert.equal(attempt.packageVersionId, lesson.packageVersionId);
  assert.doesNotMatch(JSON.stringify(attempt), /accepted|answer_definition|For she, add -s/);
  await assert.rejects(attempts.get(learnerB, attempt.id));
  await assert.rejects(attempts.save(learnerB, attempt.id, attempt.items[0].id, 'works'));
  await assert.rejects(attempts.revealHint(learnerA, attempt.id, attempt.items[2].id));
  await attempts.save(learnerA, attempt.id, attempt.items[0].id, 'work');
  await attempts.save(learnerA, attempt.id, attempt.items[0].id, 'works');
  await attempts.save(learnerA, attempt.id, attempt.items[1].id, 'plays');
  assert.match((await attempts.revealHint(learnerA, attempt.id, attempt.items[1].id)).hint, /add -s/);
  await attempts.save(learnerA, attempt.id, attempt.items[2].id, 'reads');
  assert.equal((await attempts.get(learnerA, attempt.id)).feedback, null);

  const submitted = await attempts.submit(learnerA, attempt.id, 'submit-first');
  assert.equal(submitted.status, 'EVALUATED');
  assert.equal(submitted.feedback.items.length, 3);
  assert.equal(submitted.replayed, false);
  assert.equal((await attempts.submit(learnerA, attempt.id, 'submit-first')).replayed, true);
  await assert.rejects(attempts.submit(learnerA, attempt.id, 'another-key'));
  await assert.rejects(attempts.save(learnerA, attempt.id, attempt.items[0].id, 'work'));
  const observations = await pool.query('SELECT revised,used_support FROM observations WHERE attempt_id = $1 ORDER BY item_id', [attempt.id]);
  assert.equal(observations.rowCount, 3);
  assert.equal(observations.rows.filter((row) => row.revised).length, 1);
  assert.equal(observations.rows.filter((row) => row.used_support).length, 1);
  const evidence = await pool.query('SELECT independence FROM evidence WHERE learner_id = $1 ORDER BY independence', [learnerA]);
  assert.deepEqual(evidence.rows.map((row) => row.independence), [1,1,3]);
  const state = await planning.competencyState(learnerA, '20000000-0000-4000-8000-000000000003');
  assert.ok(state.claims.every((claim) => claim.label === 'EMERGING'));
  assert.equal((await planning.dashboard(learnerA)).nextAction.type, 'START_ACTIVITY');

  const second = await attempts.start(learnerA, lessonId);
  await assert.rejects(attempts.submit(learnerA, second.id, 'submit-incomplete'));
  assert.equal((await attempts.get(learnerA, second.id)).status, 'IN_PROGRESS');
  assert.equal((await pool.query('SELECT count(*)::int AS n FROM observations WHERE attempt_id = $1', [second.id])).rows[0].n, 0);
  const pending = (await planning.getToday(learnerA)).blocks.find((block) => block.status === 'PENDING' && block.type === 'PRACTICE');
  const replaced = await planning.overrideBlock(learnerA, pending.id, 'replace');
  assert.equal(replaced.plan.blocks.find((block) => block.id === pending.id).type, 'LESSON');
  const explored = await planning.overrideBlock(learnerA, pending.id, 'explore');
  assert.deepEqual(explored.nextAction.reasonCodes, ['LEARNER_EXPLORE']);
  assert.equal((await planning.getToday(learnerA)).blocks.find((block) => block.id === pending.id).status, 'PENDING');

  await assert.rejects(attempts.start(learnerB, lessonId));
  await planning.setGoal(learnerB, { purpose: 'STUDY_ABROAD', studyMinutesPerDay: 15 });
  class HttpModule {}
  Module({
    controllers: [LessonsController, AttemptsController, PlanningController],
    providers: [
      AuthGuard, GetPublishedLesson,
      { provide: AttemptsService, useValue: attempts },
      { provide: PlanningService, useValue: planning },
      { provide: CURRICULUM_REPOSITORY, useValue: new PostgresCurriculumRepository(pool) },
      { provide: PROVIDER_IDENTITY_VERIFIER, useValue: {
        verify: async (header) => {
          if (header === 'Bearer learner-a') return { subject: 'a' };
          if (header === 'Bearer learner-b') return { subject: 'b' };
          throw new UnauthorizedException();
        },
      } },
      { provide: IdentityResolver, useValue: { resolve: async (_provider, subject) => subject === 'a' ? learnerA : learnerB } },
    ],
  })(HttpModule);
  app = await NestFactory.create(HttpModule, { logger: false });
  app.useGlobalFilters(new ApiExceptionFilter());
  await app.init();
  const http = request(app.getHttpServer());
  await http.get('/v1/dashboard').expect(401);
  const lessonHttp = await http.get(`/v1/lessons/${lessonId}`).set('Authorization','Bearer learner-a').expect(200);
  assert.equal(lessonHttp.body.data.packageVersion, 2);
  assert.doesNotMatch(JSON.stringify(lessonHttp.body), /accepted|answer_definition/);
  const startedHttp = await http.post('/v1/attempts').set('Authorization','Bearer learner-b').send({ lessonId }).expect(201);
  const attemptB = startedHttp.body.data;
  await http.get(`/v1/attempts/${attemptB.id}`).set('Authorization','Bearer learner-a').expect(404);
  await http.post(`/v1/attempts/${attemptB.id}/submit`).set('Authorization','Bearer learner-b')
    .set('Idempotency-Key','http-incomplete').expect(422);
  for (const [index, value] of ['works','plays','reads'].entries()) {
    await http.put(`/v1/attempts/${attemptB.id}/responses/${attemptB.items[index].id}`)
      .set('Authorization','Bearer learner-b').send({ value }).expect(200);
  }
  const httpSubmitted = await http.post(`/v1/attempts/${attemptB.id}/submit`)
    .set('Authorization','Bearer learner-b').set('Idempotency-Key','http-submit').expect(201);
  assert.equal(httpSubmitted.body.data.status, 'EVALUATED');
  const httpReplay = await http.post(`/v1/attempts/${attemptB.id}/submit`)
    .set('Authorization','Bearer learner-b').set('Idempotency-Key','http-submit').expect(201);
  assert.equal(httpReplay.body.data.replayed, true);

  console.log('Slice 01 verification passed: PostgreSQL migrations/RLS, identity, content, goal/plan, attempts, idempotency, lineage, overrides, ownership and HTTP contracts.');
} finally {
  if (app) await app.close();
  if (pool) await pool.end();
  if (schemaCreated) await admin.query(`DROP SCHEMA "${schema}" CASCADE`);
  for (const role of rolesCreated.reverse()) await admin.query(`DROP ROLE ${role}`);
  await admin.end();
}
