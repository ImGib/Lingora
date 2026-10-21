BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE learners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE', 'SUSPENDED', 'DELETED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE identity_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES learners(id) ON DELETE RESTRICT,
  provider text NOT NULL CHECK (provider ~ '^[A-Z][A-Z0-9_]{1,31}$'),
  provider_user_id text NOT NULL CHECK (length(provider_user_id) BETWEEN 1 AND 255),
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT identity_accounts_provider_subject_key UNIQUE (provider, provider_user_id),
  CONSTRAINT identity_accounts_learner_provider_key UNIQUE (learner_id, provider)
);

CREATE INDEX identity_accounts_learner_id_idx ON identity_accounts (learner_id);

CREATE TABLE profiles (
  learner_id uuid PRIMARY KEY REFERENCES learners(id) ON DELETE RESTRICT,
  display_name text NULL CHECK (display_name IS NULL OR length(display_name) BETWEEN 1 AND 80),
  native_language text NULL CHECK (native_language IS NULL OR length(native_language) BETWEEN 2 AND 35),
  timezone text NOT NULL DEFAULT 'Asia/Ho_Chi_Minh'
    CHECK (length(timezone) BETWEEN 1 AND 100),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Slice 01A exposes no direct browser-to-Supabase data path. Keep the public
-- schema tables unreachable to Data API roles; NestJS remains the authority.
ALTER TABLE learners ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE learners FROM anon, authenticated;
REVOKE ALL ON TABLE identity_accounts FROM anon, authenticated;
REVOKE ALL ON TABLE profiles FROM anon, authenticated;

COMMIT;
