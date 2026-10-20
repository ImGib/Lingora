BEGIN;

CREATE TABLE placement_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  version integer NOT NULL CHECK (version > 0),
  status text NOT NULL CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  policy_version text NOT NULL,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (code, version),
  CHECK ((status = 'PUBLISHED') = (published_at IS NOT NULL))
);

CREATE TABLE placement_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  placement_version_id uuid NOT NULL REFERENCES placement_versions(id) ON DELETE RESTRICT,
  code text NOT NULL,
  position integer NOT NULL CHECK (position > 0),
  claim_code text NOT NULL,
  modality text NOT NULL,
  response_type text NOT NULL CHECK (response_type IN ('SINGLE_CHOICE', 'SHORT_TEXT')),
  prompt jsonb NOT NULL CHECK (jsonb_typeof(prompt) = 'object'),
  answer_definition jsonb NOT NULL CHECK (jsonb_typeof(answer_definition) = 'object'),
  UNIQUE (placement_version_id, code),
  UNIQUE (placement_version_id, position)
);
CREATE INDEX placement_items_version_idx ON placement_items (placement_version_id, position);

CREATE TABLE placements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES learners(id) ON DELETE RESTRICT,
  placement_version_id uuid NOT NULL REFERENCES placement_versions(id) ON DELETE RESTRICT,
  status text NOT NULL CHECK (status IN ('IN_PROGRESS', 'SKIPPED', 'COMPLETED')),
  idempotency_key text NOT NULL,
  recommended_start text,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (learner_id, idempotency_key),
  CHECK ((status = 'IN_PROGRESS' AND completed_at IS NULL AND recommended_start IS NULL)
    OR (status IN ('SKIPPED', 'COMPLETED') AND completed_at IS NOT NULL AND recommended_start IS NOT NULL))
);
CREATE UNIQUE INDEX placements_one_active_per_learner_idx
  ON placements (learner_id) WHERE status = 'IN_PROGRESS';
CREATE INDEX placements_learner_recent_idx ON placements (learner_id, started_at DESC);

CREATE TABLE placement_responses (
  placement_id uuid NOT NULL REFERENCES placements(id) ON DELETE RESTRICT,
  placement_item_id uuid NOT NULL REFERENCES placement_items(id) ON DELETE RESTRICT,
  value text NOT NULL CHECK (length(value) BETWEEN 1 AND 500),
  correct boolean,
  saved_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (placement_id, placement_item_id)
);

INSERT INTO placement_versions (id, code, version, status, policy_version, published_at) VALUES
  ('51000000-0000-4000-8000-000000000001', 'M1.STARTING_POINT', 1, 'PUBLISHED', 'STARTING_POINT_V1', now());

INSERT INTO placement_items
  (id, placement_version_id, code, position, claim_code, modality, response_type, prompt, answer_definition)
VALUES
  ('51000000-0000-4000-8000-000000000002', '51000000-0000-4000-8000-000000000001',
   'PERSONAL.VOCAB.NAME', 1, 'UNDERSTAND_PERSONAL_DETAIL_NAME', 'WRITTEN_RECOGNITION', 'SINGLE_CHOICE',
   '{"text":"Hi, I am Linh. What is her name?","options":["Linh","Mai","Nam"]}', '{"accepted":["Linh"]}'),
  ('51000000-0000-4000-8000-000000000003', '51000000-0000-4000-8000-000000000001',
   'GRAMMAR.BE.I', 2, 'USE_BE_FOR_PERSONAL_FACT', 'WRITTEN_PRODUCTION', 'SHORT_TEXT',
   '{"text":"Complete: I ___ a student."}', '{"accepted":["am"]}'),
  ('51000000-0000-4000-8000-000000000004', '51000000-0000-4000-8000-000000000001',
   'READING.PERSONAL.CITY', 3, 'UNDERSTAND_PERSONAL_DETAIL_CITY', 'WRITTEN_RECOGNITION', 'SINGLE_CHOICE',
   '{"text":"An is from Hue. Where is An from?","options":["Hue","Hanoi","Da Nang"]}', '{"accepted":["Hue"]}');

DO $$ DECLARE name text; BEGIN
  FOREACH name IN ARRAY ARRAY['placement_versions','placement_items','placements','placement_responses'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', name);
    EXECUTE format('REVOKE ALL ON TABLE %I FROM anon, authenticated', name);
  END LOOP;
END $$;

COMMIT;
