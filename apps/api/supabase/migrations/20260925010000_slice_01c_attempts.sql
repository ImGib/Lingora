BEGIN;

CREATE TABLE attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES learners(id) ON DELETE RESTRICT,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE RESTRICT,
  package_version_id uuid NOT NULL REFERENCES learning_package_versions(id) ON DELETE RESTRICT,
  status text NOT NULL CHECK (status IN ('IN_PROGRESS', 'SUBMITTED', 'EVALUATED')),
  evaluator_version text,
  performance_conditions jsonb NOT NULL DEFAULT '{"mode":"LEARNING","timed":false}'::jsonb CHECK (jsonb_typeof(performance_conditions) = 'object'),
  idempotency_key text,
  feedback jsonb CHECK (feedback IS NULL OR jsonb_typeof(feedback) = 'object'),
  created_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz,
  evaluated_at timestamptz,
  UNIQUE (learner_id, idempotency_key),
  CHECK ((status = 'IN_PROGRESS' AND submitted_at IS NULL AND evaluated_at IS NULL)
    OR (status = 'SUBMITTED' AND submitted_at IS NOT NULL AND evaluated_at IS NULL)
    OR (status = 'EVALUATED' AND submitted_at IS NOT NULL AND evaluated_at IS NOT NULL))
);
CREATE INDEX attempts_learner_status_idx ON attempts (learner_id, status, created_at DESC);

CREATE TABLE attempt_items (
  attempt_id uuid NOT NULL REFERENCES attempts(id) ON DELETE RESTRICT,
  item_id uuid NOT NULL REFERENCES learning_items(id) ON DELETE RESTRICT,
  item_version_id uuid NOT NULL REFERENCES learning_item_versions(id) ON DELETE RESTRICT,
  activity_id uuid NOT NULL REFERENCES activities(id) ON DELETE RESTRICT,
  position integer NOT NULL CHECK (position >= 0),
  PRIMARY KEY (attempt_id, item_id),
  UNIQUE (attempt_id, position)
);
CREATE INDEX attempt_items_version_idx ON attempt_items (item_version_id);

CREATE TABLE responses (
  attempt_id uuid NOT NULL,
  item_id uuid NOT NULL,
  value text NOT NULL CHECK (length(value) BETWEEN 1 AND 500),
  first_value text NOT NULL CHECK (length(first_value) BETWEEN 1 AND 500),
  saved_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (attempt_id, item_id),
  FOREIGN KEY (attempt_id, item_id) REFERENCES attempt_items(attempt_id, item_id) ON DELETE RESTRICT
);

CREATE TABLE support_usages (
  attempt_id uuid NOT NULL,
  item_id uuid NOT NULL,
  support_code text NOT NULL CHECK (support_code = 'HINT'),
  revealed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (attempt_id, item_id, support_code),
  FOREIGN KEY (attempt_id, item_id) REFERENCES attempt_items(attempt_id, item_id) ON DELETE RESTRICT
);

DO $$ DECLARE name text; BEGIN
  FOREACH name IN ARRAY ARRAY['attempts','attempt_items','responses','support_usages'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', name);
    EXECUTE format('REVOKE ALL ON TABLE %I FROM anon, authenticated', name);
  END LOOP;
END $$;
COMMIT;
