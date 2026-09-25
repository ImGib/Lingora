BEGIN;
CREATE TABLE learner_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES learners(id) ON DELETE RESTRICT,
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  purpose text NOT NULL CHECK (purpose IN ('IELTS_ACADEMIC','STUDY_ABROAD','GENERAL_ENGLISH')),
  target_band numeric(2,1) CHECK (target_band BETWEEN 0 AND 9),
  deadline date,
  study_minutes_per_day integer NOT NULL CHECK (study_minutes_per_day BETWEEN 5 AND 240),
  status text NOT NULL CHECK (status IN ('ACTIVE','ARCHIVED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (learner_id, version)
);
CREATE UNIQUE INDEX learner_goals_one_active_idx ON learner_goals (learner_id) WHERE status = 'ACTIVE';

CREATE TABLE daily_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES learners(id) ON DELETE RESTRICT,
  goal_id uuid NOT NULL REFERENCES learner_goals(id) ON DELETE RESTRICT,
  local_date date NOT NULL,
  timezone text NOT NULL,
  policy_version text NOT NULL,
  curriculum_version_id uuid NOT NULL REFERENCES curriculum_versions(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (learner_id, local_date)
);
CREATE INDEX daily_plans_learner_idx ON daily_plans (learner_id, local_date DESC);

CREATE TABLE plan_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES daily_plans(id) ON DELETE RESTRICT,
  position integer NOT NULL CHECK (position > 0),
  block_type text NOT NULL CHECK (block_type IN ('LESSON','PRACTICE','BREAK')),
  lesson_id uuid REFERENCES lessons(id) ON DELETE RESTRICT,
  status text NOT NULL CHECK (status IN ('PENDING','COMPLETED','SKIPPED','DEFERRED')),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (plan_id, position)
);
CREATE INDEX plan_blocks_plan_idx ON plan_blocks (plan_id, position);

ALTER TABLE attempts ADD COLUMN plan_block_id uuid REFERENCES plan_blocks(id) ON DELETE RESTRICT;

DO $$ DECLARE name text; BEGIN
  FOREACH name IN ARRAY ARRAY['learner_goals','daily_plans','plan_blocks'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', name);
    EXECUTE format('REVOKE ALL ON TABLE %I FROM anon, authenticated', name);
  END LOOP;
END $$;
COMMIT;
