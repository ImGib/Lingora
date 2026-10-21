BEGIN;
CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES learners(id) ON DELETE RESTRICT,
  plan_id uuid REFERENCES daily_plans(id) ON DELETE RESTRICT,
  status text NOT NULL CHECK (status IN ('IN_PROGRESS','PAUSED','COMPLETED','ABANDONED')),
  local_date date NOT NULL,
  timezone text NOT NULL,
  available_minutes integer CHECK (available_minutes BETWEEN 1 AND 240),
  context jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(context) = 'object'),
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  CHECK ((status IN ('COMPLETED','ABANDONED')) = (ended_at IS NOT NULL))
);
CREATE INDEX sessions_learner_date_idx ON sessions (learner_id,local_date DESC,started_at DESC);
CREATE UNIQUE INDEX sessions_one_active_idx ON sessions (learner_id) WHERE status IN ('IN_PROGRESS','PAUSED');
ALTER TABLE attempts ADD COLUMN session_id uuid REFERENCES sessions(id) ON DELETE RESTRICT;
ALTER TABLE attempts ADD COLUMN attempt_type text NOT NULL DEFAULT 'PRACTICE'
  CHECK (attempt_type IN ('PRACTICE','REVIEW','TRANSFER','ASSESSMENT'));
CREATE INDEX attempts_session_idx ON attempts (session_id);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE sessions FROM anon, authenticated;
COMMIT;
