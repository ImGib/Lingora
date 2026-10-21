BEGIN;

-- Learner Artifacts v0: Immutable text and audio artifacts for Day 5 / Day 6 production claims.
-- Critical Architectural Invariant: Technical failures (microphone denied, network drop) must NEVER
-- create negative competency evidence. Skipped != Failed, Technical failure != Learner failure.

CREATE TABLE IF NOT EXISTS learner_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id UUID NOT NULL,
  package_version_id UUID NOT NULL REFERENCES learning_package_versions(id),
  activity_id UUID NOT NULL REFERENCES activities(id),
  item_version_id UUID REFERENCES learning_item_versions(id),
  artifact_type VARCHAR(20) NOT NULL CHECK (artifact_type IN ('TEXT', 'AUDIO')),
  text_content TEXT,
  audio_storage_path TEXT,
  duration_ms INT,
  mime_type VARCHAR(50),
  status VARCHAR(30) NOT NULL DEFAULT 'FINALIZED' CHECK (status IN ('FINALIZED', 'TECHNICAL_FALLBACK', 'DELETED')),
  fallback_reason VARCHAR(100) CHECK (fallback_reason IN ('MICROPHONE_DENIED', 'UPLOAD_FAILED', 'CODEC_UNSUPPORTED', 'LEARNER_BYPASS')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learner_artifacts_learner_activity
  ON learner_artifacts (learner_id, activity_id, status);

CREATE INDEX IF NOT EXISTS idx_learner_artifacts_package_version
  ON learner_artifacts (package_version_id);

ALTER TABLE learner_artifacts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE learner_artifacts FROM anon, authenticated;

COMMIT;
