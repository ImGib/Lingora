BEGIN;

-- Reading a published, item-free package is engagement, not an assessed attempt.
CREATE TABLE lesson_exposures (
  learner_id uuid NOT NULL REFERENCES learners(id) ON DELETE RESTRICT,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE RESTRICT,
  package_version_id uuid NOT NULL REFERENCES learning_package_versions(id) ON DELETE RESTRICT,
  completed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (learner_id, package_version_id)
);
CREATE INDEX lesson_exposures_learner_lesson_idx
  ON lesson_exposures (learner_id, lesson_id, completed_at DESC);

ALTER TABLE lesson_exposures ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE lesson_exposures FROM anon, authenticated;

COMMIT;
