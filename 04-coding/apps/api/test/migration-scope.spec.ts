import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

describe('Slice 01A migration scope', () => {
  it('creates only identity/profile tables', () => {
    const path = fileURLToPath(new URL('../supabase/migrations/20260924000000_slice_01a_foundation_identity.sql', import.meta.url));
    const sql = readFileSync(path, 'utf8');
    const tables = [...sql.matchAll(/CREATE TABLE\s+([a-z_]+)/gi)].map((match) => match[1]);
    expect(tables).toEqual(['learners', 'identity_accounts', 'profiles']);
    expect(sql).not.toMatch(/competenc|evidence|observation|attempt|daily_plan|learning_issue|job/i);
  });

  it('keeps identity tables private from Supabase Data API roles', () => {
    const path = fileURLToPath(new URL('../supabase/migrations/20260924000000_slice_01a_foundation_identity.sql', import.meta.url));
    const sql = readFileSync(path, 'utf8');
    for (const table of ['learners', 'identity_accounts', 'profiles']) {
      expect(sql).toContain(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY`);
      expect(sql).toContain(`REVOKE ALL ON TABLE ${table} FROM anon, authenticated`);
    }
    expect(sql).not.toMatch(/CREATE POLICY/i);
  });
});

describe('M1 Starting Point migration security', () => {
  it('keeps diagnostic content and learner responses behind the NestJS boundary', () => {
    const path = fileURLToPath(new URL('../supabase/migrations/20260926052857_m1_starting_point_check.sql', import.meta.url));
    const sql = readFileSync(path, 'utf8');
    for (const table of ['placement_versions', 'placement_items', 'placements', 'placement_responses']) {
      expect(sql).toContain(`ALTER TABLE %I ENABLE ROW LEVEL SECURITY`);
      expect(sql).toContain(`REVOKE ALL ON TABLE %I FROM anon, authenticated`);
      expect(sql).toContain(`'${table}'`);
    }
    expect(sql).not.toMatch(/CREATE POLICY/i);
    expect(sql).toContain("status IN ('IN_PROGRESS', 'SKIPPED', 'COMPLETED')");
    expect(sql).toContain('placements_one_active_per_learner_idx');
  });
});

describe('M1 exposure progress migration security', () => {
  it('keeps reading progress private and separate from evidence', () => {
    const path = fileURLToPath(new URL('../supabase/migrations/20261020155214_m1_exposure_progress.sql', import.meta.url));
    const sql = readFileSync(path, 'utf8');
    expect(sql).toContain('CREATE TABLE lesson_exposures');
    expect(sql).toContain('ALTER TABLE lesson_exposures ENABLE ROW LEVEL SECURITY');
    expect(sql).toContain('REVOKE ALL ON TABLE lesson_exposures FROM anon, authenticated');
    expect(sql).not.toMatch(/INSERT INTO (observations|evidence|competency_states)/i);
  });
});

describe('M1 learner artifacts migration security', () => {
  it('keeps artifacts private from public roles and isolates technical fallback', () => {
    const path = fileURLToPath(new URL('../supabase/migrations/20261021000005_m1_learner_artifacts.sql', import.meta.url));
    const sql = readFileSync(path, 'utf8');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS learner_artifacts');
    expect(sql).toContain('ALTER TABLE learner_artifacts ENABLE ROW LEVEL SECURITY');
    expect(sql).toContain('REVOKE ALL ON TABLE learner_artifacts FROM anon, authenticated');
    expect(sql).toContain("status VARCHAR(30) NOT NULL DEFAULT 'FINALIZED'");
    expect(sql).toContain("'TECHNICAL_FALLBACK'");
    expect(sql).toContain("'MICROPHONE_DENIED'");
    expect(sql).not.toMatch(/INSERT INTO (observations|evidence|competency_states)/i);
  });
});

describe('M1 planner due and block types migration', () => {
  it('extends plan_blocks with due_at, estimated_minutes and candidate types', () => {
    const path = fileURLToPath(new URL('../supabase/migrations/20261021000006_m1_planner_due_and_block_types.sql', import.meta.url));
    const sql = readFileSync(path, 'utf8');
    expect(sql).toContain('ALTER TABLE plan_blocks');
    expect(sql).toContain('ADD COLUMN IF NOT EXISTS due_at TIMESTAMPTZ');
    expect(sql).toContain('ADD COLUMN IF NOT EXISTS estimated_minutes INT');
    expect(sql).toContain("'REVIEW'");
    expect(sql).toContain("'VERIFY'");
    expect(sql).toContain("'TRANSFER'");
  });
});

describe('M1 quarantine audit migration security', () => {
  it('secures quarantine records and learner issue reports with RLS', () => {
    const path = fileURLToPath(new URL('../supabase/migrations/20261021000007_m1_quarantine_audit.sql', import.meta.url));
    const sql = readFileSync(path, 'utf8');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS content_quarantine_records');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS learner_content_reports');
    expect(sql).toContain('ALTER TABLE content_quarantine_records ENABLE ROW LEVEL SECURITY');
    expect(sql).toContain('REVOKE ALL ON TABLE content_quarantine_records FROM anon, authenticated');
    expect(sql).toContain('ALTER TABLE learner_content_reports ENABLE ROW LEVEL SECURITY');
    expect(sql).toContain('REVOKE ALL ON TABLE learner_content_reports FROM anon, authenticated');
  });
});

