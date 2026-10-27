BEGIN;

-- Roadmap Worlds & Gates
CREATE TABLE IF NOT EXISTS roadmap_worlds (
  world_id integer PRIMARY KEY,
  level text NOT NULL,
  title text NOT NULL,
  band text NOT NULL,
  badge text NOT NULL,
  duration text NOT NULL,
  theme_color text NOT NULL,
  summary text NOT NULL,
  outcome text NOT NULL,
  gates jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 44 International Phonetic Alphabet (IPA) Phonemes
CREATE TABLE IF NOT EXISTS ipa_phonemes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL UNIQUE,
  label text NOT NULL,
  category text NOT NULL,
  sub_category text,
  tag text NOT NULL,
  mouth_desc text NOT NULL,
  tongue_desc text NOT NULL,
  voice_desc text NOT NULL,
  front_caption text NOT NULL,
  side_caption text NOT NULL,
  sample_word text NOT NULL,
  sample_ipa text NOT NULL,
  sample_meaning text NOT NULL,
  vietnamese_tip text,
  is_voiced boolean NOT NULL DEFAULT false,
  is_long boolean NOT NULL DEFAULT false,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ipa_phonemes_cat_pos_idx ON ipa_phonemes (category, position);

-- Grammar Topics & Masterclasses (6-Part ForumFlash)
CREATE TABLE IF NOT EXISTS grammar_topics (
  id text PRIMARY KEY,
  milestone text NOT NULL,
  category text NOT NULL,
  band_target text NOT NULL,
  short_desc text NOT NULL,
  masterclass jsonb NOT NULL,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS grammar_topics_milestone_idx ON grammar_topics (milestone, position);

-- Grammar Practice Quiz Bank
CREATE TABLE IF NOT EXISTS grammar_quizzes (
  id text PRIMARY KEY,
  topic_id text NOT NULL,
  title text NOT NULL,
  milestone text NOT NULL,
  mc_items jsonb NOT NULL,
  fill_blank_items jsonb NOT NULL,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS grammar_quizzes_topic_idx ON grammar_quizzes (topic_id);

-- 7-Stage Growth Garden (Dashboard Tree Progress)
CREATE TABLE IF NOT EXISTS growth_stages (
  id integer PRIMARY KEY,
  name text NOT NULL,
  day_tag text NOT NULL,
  icon text NOT NULL,
  kicker text NOT NULL,
  focus text NOT NULL,
  description text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS & Grants for Public Learning Resources
ALTER TABLE roadmap_worlds ENABLE ROW LEVEL SECURITY;
ALTER TABLE ipa_phonemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_stages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read for roadmap' AND tablename = 'roadmap_worlds') THEN
    CREATE POLICY "Public read for roadmap" ON roadmap_worlds FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read for ipa_phonemes' AND tablename = 'ipa_phonemes') THEN
    CREATE POLICY "Public read for ipa_phonemes" ON ipa_phonemes FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read for grammar_topics' AND tablename = 'grammar_topics') THEN
    CREATE POLICY "Public read for grammar_topics" ON grammar_topics FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read for grammar_quizzes' AND tablename = 'grammar_quizzes') THEN
    CREATE POLICY "Public read for grammar_quizzes" ON grammar_quizzes FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read for growth_stages' AND tablename = 'growth_stages') THEN
    CREATE POLICY "Public read for growth_stages" ON growth_stages FOR SELECT USING (true);
  END IF;
END $$;

GRANT SELECT ON TABLE roadmap_worlds TO anon, authenticated;
GRANT SELECT ON TABLE ipa_phonemes TO anon, authenticated;
GRANT SELECT ON TABLE grammar_topics TO anon, authenticated;
GRANT SELECT ON TABLE grammar_quizzes TO anon, authenticated;
GRANT SELECT ON TABLE growth_stages TO anon, authenticated;

COMMIT;
