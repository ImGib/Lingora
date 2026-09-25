import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

describe('Slice 01A migration scope', () => {
  it('creates only identity/profile tables', () => {
    const path = fileURLToPath(new URL('../migrations/0001_foundation_identity.sql', import.meta.url));
    const sql = readFileSync(path, 'utf8');
    const tables = [...sql.matchAll(/CREATE TABLE\s+([a-z_]+)/gi)].map((match) => match[1]);
    expect(tables).toEqual(['learners', 'identity_accounts', 'profiles']);
    expect(sql).not.toMatch(/competenc|evidence|observation|attempt|daily_plan|learning_issue|job/i);
  });

  it('keeps identity tables private from Supabase Data API roles', () => {
    const path = fileURLToPath(new URL('../migrations/0001_foundation_identity.sql', import.meta.url));
    const sql = readFileSync(path, 'utf8');
    for (const table of ['learners', 'identity_accounts', 'profiles']) {
      expect(sql).toContain(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY`);
      expect(sql).toContain(`REVOKE ALL ON TABLE ${table} FROM anon, authenticated`);
    }
    expect(sql).not.toMatch(/CREATE POLICY/i);
  });
});
