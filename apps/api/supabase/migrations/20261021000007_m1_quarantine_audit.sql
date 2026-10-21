BEGIN;

-- Content Quarantine v0: Authoritative isolation of unhealthy content and learner issue reports.
-- Invariant: Quarantined content cannot be selected by any attempt, exposure or planner runner.
-- Existing evidence associated with quarantined items is flagged for review without penalizing learners.

CREATE TABLE IF NOT EXISTS content_quarantine_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type VARCHAR(30) NOT NULL CHECK (target_type IN ('PACKAGE_VERSION', 'ITEM_VERSION')),
  target_id UUID NOT NULL,
  reason VARCHAR(50) NOT NULL CHECK (reason IN ('CONFUSING_INSTRUCTION', 'BROKEN_AUDIO', 'INCORRECT_ANSWER_KEY', 'ACCESSIBILITY_VIOLATION', 'LEARNER_REPORTED')),
  details TEXT,
  quarantined_by VARCHAR(100) NOT NULL DEFAULT 'SYSTEM_COMMAND',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quarantine_target
  ON content_quarantine_records (target_type, target_id);

CREATE TABLE IF NOT EXISTS learner_content_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id UUID NOT NULL,
  package_version_id UUID NOT NULL REFERENCES learning_package_versions(id),
  activity_id UUID REFERENCES activities(id),
  item_version_id UUID REFERENCES learning_item_versions(id),
  issue_category VARCHAR(50) NOT NULL CHECK (issue_category IN ('AUDIO_UNPLAYABLE', 'TYPO_ERROR', 'CONFUSING_INSTRUCTION', 'ACCESSIBILITY_BARRIER', 'OTHER')),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learner_reports_package
  ON learner_content_reports (package_version_id, issue_category);

ALTER TABLE content_quarantine_records ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE content_quarantine_records FROM anon, authenticated;

ALTER TABLE learner_content_reports ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE learner_content_reports FROM anon, authenticated;

COMMIT;
