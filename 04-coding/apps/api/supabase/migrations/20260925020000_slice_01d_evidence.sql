BEGIN;
CREATE TABLE observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL,
  item_id uuid NOT NULL,
  item_version_id uuid NOT NULL REFERENCES learning_item_versions(id) ON DELETE RESTRICT,
  produced_value text NOT NULL,
  first_value text NOT NULL,
  revised boolean NOT NULL,
  result_code text NOT NULL CHECK (result_code IN ('CORRECT_TARGET_FORM','MISSING_THIRD_PERSON_MARKING','OTHER_RESPONSE')),
  correct boolean NOT NULL,
  used_support boolean NOT NULL,
  evaluator_version text NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (attempt_id, item_id),
  FOREIGN KEY (attempt_id, item_id) REFERENCES responses(attempt_id, item_id) ON DELETE RESTRICT
);
CREATE INDEX observations_attempt_idx ON observations (attempt_id);

CREATE TABLE evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  observation_id uuid NOT NULL UNIQUE REFERENCES observations(id) ON DELETE RESTRICT,
  learner_id uuid NOT NULL REFERENCES learners(id) ON DELETE RESTRICT,
  competency_id uuid NOT NULL REFERENCES competencies(id) ON DELETE RESTRICT,
  learning_claim text NOT NULL,
  modality text NOT NULL,
  direction text NOT NULL CHECK (direction IN ('POSITIVE','NEGATIVE')),
  strength smallint NOT NULL CHECK (strength BETWEEN 1 AND 3),
  independence smallint NOT NULL CHECK (independence BETWEEN 1 AND 3),
  confidence text NOT NULL CHECK (confidence IN ('HIGH','MODERATE')),
  source text NOT NULL CHECK (source = 'DETERMINISTIC_GRAMMAR'),
  trust_tier text NOT NULL CHECK (trust_tier IN ('HUMAN_AUTHORED','AI_ASSISTED','IMPORTED','ADAPTED')),
  authored_difficulty text NOT NULL DEFAULT 'FOUNDATION',
  policy_version text NOT NULL,
  valid boolean NOT NULL DEFAULT true,
  occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX evidence_learner_competency_idx ON evidence (learner_id, competency_id, occurred_at DESC);

CREATE TABLE competency_states (
  learner_id uuid NOT NULL REFERENCES learners(id) ON DELETE RESTRICT,
  competency_id uuid NOT NULL REFERENCES competencies(id) ON DELETE RESTRICT,
  learning_claim text NOT NULL,
  modality text NOT NULL,
  label text NOT NULL CHECK (label IN ('UNKNOWN','EMERGING','DEVELOPING','FUNCTIONAL')),
  confidence text NOT NULL CHECK (confidence IN ('LOW','MODERATE')),
  evidence_count integer NOT NULL CHECK (evidence_count >= 0),
  policy_version text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (learner_id, competency_id, learning_claim, modality)
);

DO $$ DECLARE name text; BEGIN
  FOREACH name IN ARRAY ARRAY['observations','evidence','competency_states'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', name);
    EXECUTE format('REVOKE ALL ON TABLE %I FROM anon, authenticated', name);
  END LOOP;
END $$;
COMMIT;
