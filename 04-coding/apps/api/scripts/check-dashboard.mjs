#!/usr/bin/env node
import 'reflect-metadata';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import pg from 'pg';
import { normalizeDatabaseUrl } from '../dist/infrastructure/database/database.module.js';
import { PostgresIdentityRepository } from '../dist/infrastructure/database/postgres-identity.repository.js';
import { PlanningService } from '../dist/modules/planning/planning.service.js';

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)), quiet: true });

if (!process.env.DATABASE_URL) {
  console.error('[dashboard predeploy] DATABASE_URL is required.');
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: normalizeDatabaseUrl(process.env.DATABASE_URL),
  connectionTimeoutMillis: 5000,
  max: 1,
});

try {
  // A valid UUID with no learner record checks the dashboard's empty state
  // without creating or changing learner data in the deployment database.
  const unknownLearnerId = '00000000-0000-4000-8000-000000000000';
  const identities = new PostgresIdentityRepository(pool);
  assert.equal(await identities.getLearnerProfile(unknownLearnerId), null);
  await pool.query('SELECT learner_id FROM identity_accounts WHERE provider = $1 AND provider_user_id = $2',
    ['CLERK', '__dashboard_predeploy__']);
  await pool.query('SELECT id,position,block_type,lesson_id,status,due_at,estimated_minutes FROM plan_blocks WHERE plan_id = $1',
    [unknownLearnerId]);
  const dashboard = await new PlanningService(pool).dashboard(unknownLearnerId);
  assert.equal(dashboard.nextAction.type, 'SET_GOAL');
  assert.equal(dashboard.goal, null);
  console.log('[dashboard predeploy] Database connection and dashboard queries passed.');
} catch (error) {
  console.error(`[dashboard predeploy] Failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  await pool.end();
}
