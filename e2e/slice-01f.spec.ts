import AxeBuilder from '@axe-core/playwright';
import { createClerkClient } from '@clerk/backend';
import { clerk } from '@clerk/testing/playwright';
import { expect, test, type Page } from '@playwright/test';
import pg from 'pg';

const apiUrl = 'http://localhost:3001';
const lessonId = '10000000-0000-4000-8000-000000000008';
const testRun = Date.now();
const emails = [
  `lingora.01f.a+clerk_test_${testRun}@example.com`,
  `lingora.01f.b+clerk_test_${testRun}@example.com`,
];
const clerkSecretKey = process.env.CLERK_SECRET_KEY;
if (!clerkSecretKey) throw new Error('CLERK_SECRET_KEY is required for the live 01F test.');
const clerkClient = createClerkClient({ secretKey: clerkSecretKey });
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is required for the live 01F test.');
const normalizedDatabaseUrl = new URL(databaseUrl);
if (normalizedDatabaseUrl.searchParams.get('sslmode') === 'require') {
  normalizedDatabaseUrl.searchParams.set('uselibpqcompat', 'true');
}
const database = new pg.Pool({ connectionString: normalizedDatabaseUrl.toString(), max: 2 });
const userIds: string[] = [];
const learnerIds: string[] = [];

async function token(page: Page): Promise<string> {
  await clerk.loaded({ page });
  await page.waitForFunction(() => Boolean((window as typeof window & { Clerk?: { session?: unknown } }).Clerk?.session));
  const value = await page.evaluate(async () => {
    const session = (window as typeof window & {
      Clerk?: { session?: { getToken(): Promise<string | null> } };
    }).Clerk?.session;
    return session ? session.getToken() : null;
  });
  if (!value) throw new Error('Clerk session token unavailable.');
  return value;
}

async function api(page: Page, path: string, init: RequestInit = {}) {
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${await token(page)}`,
      'Content-Type': 'application/json',
      Origin: 'http://localhost:3000',
      ...init.headers,
    },
  });
  const body = await response.json();
  return { response, body };
}

async function cleanupFixtures(): Promise<void> {
  if (learnerIds.length) {
    const client = await database.connect();
    try {
      await client.query('BEGIN');
      const attempts = await client.query('SELECT id FROM attempts WHERE learner_id = ANY($1::uuid[])', [learnerIds]);
      const attemptIds = attempts.rows.map((row: { id: string }) => row.id);
      if (attemptIds.length) {
        await client.query('DELETE FROM evidence WHERE learner_id = ANY($1::uuid[])', [learnerIds]);
        await client.query('DELETE FROM observations WHERE attempt_id = ANY($1::uuid[])', [attemptIds]);
        await client.query('DELETE FROM support_usages WHERE attempt_id = ANY($1::uuid[])', [attemptIds]);
        await client.query('DELETE FROM responses WHERE attempt_id = ANY($1::uuid[])', [attemptIds]);
        await client.query('DELETE FROM attempt_items WHERE attempt_id = ANY($1::uuid[])', [attemptIds]);
        await client.query('DELETE FROM attempts WHERE id = ANY($1::uuid[])', [attemptIds]);
      }
      await client.query('DELETE FROM competency_states WHERE learner_id = ANY($1::uuid[])', [learnerIds]);
      await client.query('DELETE FROM sessions WHERE learner_id = ANY($1::uuid[])', [learnerIds]);
      await client.query('DELETE FROM plan_blocks WHERE plan_id IN (SELECT id FROM daily_plans WHERE learner_id = ANY($1::uuid[]))', [learnerIds]);
      await client.query('DELETE FROM daily_plans WHERE learner_id = ANY($1::uuid[])', [learnerIds]);
      await client.query('DELETE FROM learner_goals WHERE learner_id = ANY($1::uuid[])', [learnerIds]);
      await client.query('DELETE FROM profiles WHERE learner_id = ANY($1::uuid[])', [learnerIds]);
      await client.query('DELETE FROM identity_accounts WHERE learner_id = ANY($1::uuid[])', [learnerIds]);
      await client.query('DELETE FROM learners WHERE id = ANY($1::uuid[])', [learnerIds]);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  await Promise.all(userIds.map((id) => clerkClient.users.deleteUser(id).catch(() => undefined)));
}

test.describe.configure({ mode: 'serial' });

test.beforeAll(async () => {
  for (const email of emails) {
    const user = await clerkClient.users.createUser({ emailAddress: [email], skipPasswordRequirement: true });
    userIds.push(user.id);
  }
});

test.afterAll(async () => {
  await cleanupFixtures();
  await database.end();
});

test('public UI is keyboard-operable and has no detectable WCAG A/AA violations', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Build English steadily');
  await page.getByRole('button', { name: 'Sign in' }).focus();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeFocused();
  const results = await new AxeBuilder({ page })
    .include('main')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('real Clerk sessions preserve retry idempotency and isolate two learners', async ({ page }) => {
  await page.goto('/');
  await clerk.signIn({ page, emailAddress: emails[0] });
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: 'A clear next step' })).toBeVisible();

  const meA = await api(page, '/v1/me');
  expect(meA.response.status).toBe(200);
  learnerIds.push(meA.body.data.id);
  expect((await api(page, '/v1/goals', {
    method: 'POST', body: JSON.stringify({ purpose: 'IELTS_ACADEMIC', studyMinutesPerDay: 20 }),
  })).response.status).toBe(201);
  expect((await api(page, '/v1/plans/today/generate', { method: 'POST', body: '{}' })).response.status).toBe(201);
  const started = await api(page, '/v1/attempts', { method: 'POST', body: JSON.stringify({ lessonId }) });
  expect(started.response.status).toBe(201);
  const attempt = started.body.data;

  for (const [index, answer] of ['works', 'plays', 'reads'].entries()) {
    const saved = await api(page, `/v1/attempts/${attempt.id}/responses/${attempt.items[index].id}`, {
      method: 'PUT', body: JSON.stringify({ value: answer }),
    });
    expect(saved.response.status).toBe(200);
  }

  const idempotencyKey = `live-retry-${testRun}`;
  const first = await api(page, `/v1/attempts/${attempt.id}/submit`, {
    method: 'POST', headers: { 'Idempotency-Key': idempotencyKey }, body: '{}',
  });
  expect(first.response.status).toBe(201);
  expect(first.body.data.replayed).toBe(false);
  const countsAfterFirst = await database.query(
    `SELECT (SELECT count(*)::int FROM observations WHERE attempt_id = $1) observations,
            (SELECT count(*)::int FROM evidence WHERE observation_id IN
              (SELECT id FROM observations WHERE attempt_id = $1)) evidence`,
    [attempt.id],
  );

  const retry = await api(page, `/v1/attempts/${attempt.id}/submit`, {
    method: 'POST', headers: { 'Idempotency-Key': idempotencyKey }, body: '{}',
  });
  expect(retry.response.status).toBe(201);
  expect(retry.body.data.replayed).toBe(true);
  const countsAfterRetry = await database.query(
    `SELECT (SELECT count(*)::int FROM observations WHERE attempt_id = $1) observations,
            (SELECT count(*)::int FROM evidence WHERE observation_id IN
              (SELECT id FROM observations WHERE attempt_id = $1)) evidence`,
    [attempt.id],
  );
  expect(countsAfterRetry.rows[0]).toEqual(countsAfterFirst.rows[0]);
  expect(countsAfterRetry.rows[0]).toEqual({ observations: 3, evidence: 3 });

  await clerk.signOut({ page });
  await page.goto('/');
  await clerk.signIn({ page, emailAddress: emails[1] });
  const meB = await api(page, '/v1/me');
  expect(meB.response.status).toBe(200);
  learnerIds.push(meB.body.data.id);
  expect(meB.body.data.id).not.toBe(meA.body.data.id);
  expect((await api(page, `/v1/attempts/${attempt.id}`)).response.status).toBe(404);
  expect((await api(page, `/v1/attempts/${attempt.id}/responses/${attempt.items[0].id}`, {
    method: 'PUT', body: JSON.stringify({ value: 'works' }),
  })).response.status).toBe(404);
  expect((await api(page, `/v1/attempts/${attempt.id}/submit`, {
    method: 'POST', headers: { 'Idempotency-Key': idempotencyKey }, body: '{}',
  })).response.status).toBe(404);

  expect((await fetch(`${apiUrl}/v1/dashboard`)).status).toBe(401);
  expect((await fetch(`${apiUrl}/v1/dashboard`, { headers: { Authorization: 'Bearer invalid' } })).status).toBe(401);

  await page.goto('/dashboard');
  const dashboardA11y = await new AxeBuilder({ page })
    .include('main')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(dashboardA11y.violations).toEqual([]);
});
