BEGIN;

CREATE TABLE curriculum_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  version integer NOT NULL CHECK (version > 0),
  status text NOT NULL CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  UNIQUE (code, version),
  CHECK ((status = 'PUBLISHED') = (published_at IS NOT NULL))
);

CREATE TABLE programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  curriculum_version_id uuid NOT NULL REFERENCES curriculum_versions(id) ON DELETE RESTRICT,
  code text NOT NULL,
  title text NOT NULL,
  status text NOT NULL CHECK (status IN ('ACTIVE', 'ARCHIVED')),
  UNIQUE (curriculum_version_id, code)
);
CREATE INDEX programs_curriculum_version_id_idx ON programs (curriculum_version_id);

CREATE TABLE stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES programs(id) ON DELETE RESTRICT,
  code text NOT NULL,
  title text NOT NULL,
  position integer NOT NULL CHECK (position >= 0),
  UNIQUE (program_id, code), UNIQUE (program_id, position)
);
CREATE INDEX stages_program_id_idx ON stages (program_id);

CREATE TABLE tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES programs(id) ON DELETE RESTRICT,
  code text NOT NULL,
  title text NOT NULL,
  UNIQUE (program_id, code)
);
CREATE INDEX tracks_program_id_idx ON tracks (program_id);

CREATE TABLE stage_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id uuid NOT NULL REFERENCES stages(id) ON DELETE RESTRICT,
  track_id uuid NOT NULL REFERENCES tracks(id) ON DELETE RESTRICT,
  position integer NOT NULL CHECK (position >= 0),
  UNIQUE (stage_id, track_id)
);
CREATE INDEX stage_tracks_stage_id_idx ON stage_tracks (stage_id);
CREATE INDEX stage_tracks_track_id_idx ON stage_tracks (track_id);

CREATE TABLE modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_track_id uuid NOT NULL REFERENCES stage_tracks(id) ON DELETE RESTRICT,
  code text NOT NULL,
  title text NOT NULL,
  position integer NOT NULL CHECK (position >= 0),
  UNIQUE (stage_track_id, code), UNIQUE (stage_track_id, position)
);
CREATE INDEX modules_stage_track_id_idx ON modules (stage_track_id);

CREATE TABLE units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES modules(id) ON DELETE RESTRICT,
  code text NOT NULL,
  title text NOT NULL,
  position integer NOT NULL CHECK (position >= 0),
  UNIQUE (module_id, code), UNIQUE (module_id, position)
);
CREATE INDEX units_module_id_idx ON units (module_id);

CREATE TABLE lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL REFERENCES units(id) ON DELETE RESTRICT,
  code text NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  position integer NOT NULL CHECK (position >= 0),
  status text NOT NULL CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  UNIQUE (unit_id, code), UNIQUE (unit_id, position)
);
CREATE INDEX lessons_unit_id_idx ON lessons (unit_id);

CREATE TABLE competencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL CHECK (status IN ('ACTIVE', 'ARCHIVED')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE competency_relations (
  source_competency_id uuid NOT NULL REFERENCES competencies(id) ON DELETE RESTRICT,
  target_competency_id uuid NOT NULL REFERENCES competencies(id) ON DELETE RESTRICT,
  relation_type text NOT NULL CHECK (relation_type IN ('PREREQUISITE', 'SUPPORTS')),
  PRIMARY KEY (source_competency_id, target_competency_id, relation_type),
  CHECK (source_competency_id <> target_competency_id)
);
CREATE INDEX competency_relations_target_idx ON competency_relations (target_competency_id);

CREATE TABLE lesson_competencies (
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE RESTRICT,
  competency_id uuid NOT NULL REFERENCES competencies(id) ON DELETE RESTRICT,
  role text NOT NULL CHECK (role IN ('TARGET', 'PREREQUISITE', 'SUPPORTING')),
  target_modality text NOT NULL,
  PRIMARY KEY (lesson_id, competency_id, role)
);
CREATE INDEX lesson_competencies_competency_idx ON lesson_competencies (competency_id);

CREATE TABLE learning_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE RESTRICT,
  code text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX learning_packages_lesson_id_idx ON learning_packages (lesson_id);

CREATE TABLE learning_package_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_package_id uuid NOT NULL REFERENCES learning_packages(id) ON DELETE RESTRICT,
  version integer NOT NULL CHECK (version > 0),
  status text NOT NULL CHECK (status IN ('DRAFT', 'READY', 'PUBLISHED', 'ARCHIVED', 'QUARANTINED')),
  provenance text NOT NULL CHECK (provenance IN ('HUMAN_AUTHORED', 'AI_ASSISTED', 'AI_GENERATED', 'IMPORTED', 'ADAPTED')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (learning_package_id, version),
  CHECK ((status = 'PUBLISHED') = (published_at IS NOT NULL))
);
CREATE INDEX learning_package_versions_package_id_idx ON learning_package_versions (learning_package_id);
CREATE UNIQUE INDEX learning_package_versions_one_published_idx
  ON learning_package_versions (learning_package_id) WHERE status = 'PUBLISHED';

CREATE TABLE activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_package_version_id uuid NOT NULL REFERENCES learning_package_versions(id) ON DELETE RESTRICT,
  code text NOT NULL,
  activity_type text NOT NULL CHECK (activity_type IN ('INSTRUCTION', 'RECOGNITION', 'CONTROLLED_PRACTICE', 'INDEPENDENT_CHECK', 'REFLECTION')),
  title text NOT NULL,
  position integer NOT NULL CHECK (position >= 0),
  content jsonb NOT NULL CHECK (jsonb_typeof(content) = 'object'),
  UNIQUE (learning_package_version_id, code), UNIQUE (learning_package_version_id, position)
);
CREATE INDEX activities_package_version_id_idx ON activities (learning_package_version_id);

CREATE TABLE item_families (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  construct text NOT NULL,
  exposure_policy jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(exposure_policy) = 'object')
);

CREATE TABLE learning_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_family_id uuid NOT NULL REFERENCES item_families(id) ON DELETE RESTRICT,
  code text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX learning_items_item_family_id_idx ON learning_items (item_family_id);

CREATE TABLE learning_item_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_item_id uuid NOT NULL REFERENCES learning_items(id) ON DELETE RESTRICT,
  version integer NOT NULL CHECK (version > 0),
  status text NOT NULL CHECK (status IN ('DRAFT', 'READY', 'PUBLISHED', 'ARCHIVED', 'QUARANTINED')),
  purpose text NOT NULL CHECK (purpose IN ('PRACTICE', 'ASSESSMENT', 'BENCHMARK')),
  evidence_eligibility text NOT NULL CHECK (evidence_eligibility IN ('NONE', 'FORMATIVE', 'SUMMATIVE')),
  response_type text NOT NULL CHECK (response_type IN ('SINGLE_CHOICE', 'SHORT_TEXT')),
  prompt jsonb NOT NULL CHECK (jsonb_typeof(prompt) = 'object'),
  answer_definition jsonb NOT NULL CHECK (jsonb_typeof(answer_definition) = 'object'),
  feedback_definition jsonb NOT NULL CHECK (jsonb_typeof(feedback_definition) = 'object'),
  support_policy jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(support_policy) = 'object'),
  provenance text NOT NULL CHECK (provenance IN ('HUMAN_AUTHORED', 'AI_ASSISTED', 'AI_GENERATED', 'IMPORTED', 'ADAPTED')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (learning_item_id, version),
  CHECK ((status = 'PUBLISHED') = (published_at IS NOT NULL))
);
CREATE INDEX learning_item_versions_item_id_idx ON learning_item_versions (learning_item_id);

CREATE TABLE activity_items (
  activity_id uuid NOT NULL REFERENCES activities(id) ON DELETE RESTRICT,
  learning_item_version_id uuid NOT NULL REFERENCES learning_item_versions(id) ON DELETE RESTRICT,
  position integer NOT NULL CHECK (position >= 0),
  PRIMARY KEY (activity_id, learning_item_version_id),
  UNIQUE (activity_id, position)
);
CREATE INDEX activity_items_item_version_idx ON activity_items (learning_item_version_id);

CREATE TABLE learning_item_competencies (
  learning_item_version_id uuid NOT NULL REFERENCES learning_item_versions(id) ON DELETE RESTRICT,
  competency_id uuid NOT NULL REFERENCES competencies(id) ON DELETE RESTRICT,
  learning_claim text NOT NULL,
  modality text NOT NULL,
  PRIMARY KEY (learning_item_version_id, competency_id, learning_claim, modality)
);
CREATE INDEX learning_item_competencies_competency_idx ON learning_item_competencies (competency_id);

-- Reproducible Slice 01B definition/content seed.
INSERT INTO curriculum_versions (id, code, version, status, published_at) VALUES
  ('10000000-0000-4000-8000-000000000001', 'CURRICULUM.LINGORA', 1, 'PUBLISHED', now());
INSERT INTO programs (id, curriculum_version_id, code, title, status) VALUES
  ('10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'PROGRAM.IELTS_ACADEMIC', 'English to IELTS Academic', 'ACTIVE');
INSERT INTO stages (id, program_id, code, title, position) VALUES
  ('10000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000002', 'STAGE.S1', 'English Foundation', 1);
INSERT INTO tracks (id, program_id, code, title) VALUES
  ('10000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000002', 'TRACK.GRAMMAR', 'Grammar');
INSERT INTO stage_tracks (id, stage_id, track_id, position) VALUES
  ('10000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000004', 1);
INSERT INTO modules (id, stage_track_id, code, title, position) VALUES
  ('10000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000005', 'MODULE.FOUNDATION_GRAMMAR', 'Foundation Grammar', 1);
INSERT INTO units (id, module_id, code, title, position) VALUES
  ('10000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000006', 'UNIT.DAILY_ROUTINE', 'Daily Routine', 1);
INSERT INTO lessons (id, unit_id, code, title, summary, position, status) VALUES
  ('10000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000007', 'LESSON.PRESENT_SIMPLE.THIRD_PERSON', 'Talk About Another Person''s Routine', 'Notice and produce regular third-person singular forms in familiar routines.', 1, 'PUBLISHED');

INSERT INTO competencies (id, code, title, description, status) VALUES
  ('20000000-0000-4000-8000-000000000001', 'GRAM.PRESENT_SIMPLE.MEANING', 'Present Simple meaning', 'Connect habitual and routine meaning with Present Simple.', 'ACTIVE'),
  ('20000000-0000-4000-8000-000000000002', 'GRAM.PRESENT_SIMPLE.AFFIRMATIVE', 'Present Simple affirmative', 'Form affirmative Present Simple clauses.', 'ACTIVE'),
  ('20000000-0000-4000-8000-000000000003', 'GRAM.PRESENT_SIMPLE.THIRD_PERSON', 'Third-person singular', 'Select and produce regular third-person singular forms.', 'ACTIVE');
INSERT INTO competency_relations VALUES
  ('20000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000002', 'SUPPORTS'),
  ('20000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000003', 'PREREQUISITE');
INSERT INTO lesson_competencies VALUES
  ('10000000-0000-4000-8000-000000000008', '20000000-0000-4000-8000-000000000003', 'TARGET', 'WRITTEN_PRODUCTION');

INSERT INTO learning_packages (id, lesson_id, code) VALUES
  ('30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000008', 'PACKAGE.PRESENT_SIMPLE_3PS');
INSERT INTO learning_package_versions (id, learning_package_id, version, status, provenance, published_at) VALUES
  ('30000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000001', 1, 'PUBLISHED', 'HUMAN_AUTHORED', now());
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('30000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000002', 'ACT.NOTICE', 'INSTRUCTION', 'Notice the change', 1, '{"body":"Compare: I work every day. She works every day."}'),
  ('30000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000002', 'ACT.RECOGNIZE', 'RECOGNITION', 'Choose the routine form', 2, '{"instruction":"Choose the form that completes the sentence."}'),
  ('30000000-0000-4000-8000-000000000005', '30000000-0000-4000-8000-000000000002', 'ACT.INDEPENDENT', 'INDEPENDENT_CHECK', 'Produce the form', 3, '{"instruction":"Type the verb form without a hint."}'),
  ('30000000-0000-4000-8000-000000000006', '30000000-0000-4000-8000-000000000002', 'ACT.REFLECT', 'REFLECTION', 'Quick reflection', 4, '{"body":"What changes when the subject is he, she, or it?"}');

INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('40000000-0000-4000-8000-000000000001', 'FAMILY.3PS.REGULAR_ROUTINE', 'Regular third-person singular in familiar routine contexts', '{"strongEvidenceRepeatLimit":1}');
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('40000000-0000-4000-8000-000000000002', '40000000-0000-4000-8000-000000000001', 'ITEM.3PS.RECOGNIZE.WORK'),
  ('40000000-0000-4000-8000-000000000003', '40000000-0000-4000-8000-000000000001', 'ITEM.3PS.PRODUCE.READ');
INSERT INTO learning_item_versions (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type, prompt, answer_definition, feedback_definition, support_policy, provenance, published_at) VALUES
  ('40000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000002', 1, 'PUBLISHED', 'PRACTICE', 'FORMATIVE', 'SINGLE_CHOICE', '{"text":"Mai ___ at a café every day.","options":["work","works"]}', '{"accepted":["works"]}', '{"explanation":"With Mai (she), add -s: works."}', '{"hintAllowed":true}', 'HUMAN_AUTHORED', now()),
  ('40000000-0000-4000-8000-000000000005', '40000000-0000-4000-8000-000000000003', 1, 'PUBLISHED', 'ASSESSMENT', 'FORMATIVE', 'SHORT_TEXT', '{"text":"Every evening, Nam ___ a book. (read)"}', '{"accepted":["reads"]}', '{"explanation":"Nam is he, so read becomes reads."}', '{"hintAllowed":false}', 'HUMAN_AUTHORED', now());
INSERT INTO activity_items VALUES
  ('30000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000004', 1),
  ('30000000-0000-4000-8000-000000000005', '40000000-0000-4000-8000-000000000005', 1);
INSERT INTO learning_item_competencies VALUES
  ('40000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000003', 'RECOGNIZE_REGULAR_3PS', 'WRITTEN_RECOGNITION'),
  ('40000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000003', 'INDEPENDENTLY_PRODUCE_REGULAR_3PS', 'WRITTEN_PRODUCTION');

DO $$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'curriculum_versions','programs','stages','tracks','stage_tracks','modules','units','lessons',
    'competencies','competency_relations','lesson_competencies','learning_packages',
    'learning_package_versions','activities','item_families','learning_items',
    'learning_item_versions','activity_items','learning_item_competencies'
  ] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
    EXECUTE format('REVOKE ALL ON TABLE %I FROM anon, authenticated', table_name);
  END LOOP;
END $$;

COMMIT;
