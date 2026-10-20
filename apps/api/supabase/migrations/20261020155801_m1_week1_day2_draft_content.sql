BEGIN;

-- Guided form practice remains draft until teaching, answer, accessibility,
-- feedback, and learner-readiness review pass. It creates no competency evidence.
INSERT INTO lessons (id, unit_id, code, title, summary, position, status) VALUES
  ('62000000-0000-4000-8000-000000000001', '61000000-0000-4000-8000-000000000004',
   'LESSON.M1.W1.D2', 'Build a Simple Introduction',
   'Practice I am, you are and she is with short personal facts.', 2, 'DRAFT');
INSERT INTO competencies (id, code, title, description, status) VALUES
  ('62000000-0000-4000-8000-000000000002', 'M1.PERSONAL.USE_BE',
   'Use be for personal facts',
   'Choose or write am, are and is with I, you, he and she in simple personal facts.', 'ACTIVE');
INSERT INTO lesson_competencies (lesson_id, competency_id, role, target_modality) VALUES
  ('62000000-0000-4000-8000-000000000001', '62000000-0000-4000-8000-000000000002',
   'TARGET', 'WRITTEN_PRODUCTION');

INSERT INTO learning_packages (id, lesson_id, code) VALUES
  ('62000000-0000-4000-8000-000000000003', '62000000-0000-4000-8000-000000000001',
   'PACKAGE.M1.W1.D2');
INSERT INTO learning_package_versions
  (id, learning_package_id, version, status, provenance) VALUES
  ('62000000-0000-4000-8000-000000000004', '62000000-0000-4000-8000-000000000003',
   1, 'DRAFT', 'AI_ASSISTED');
INSERT INTO activities
  (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('62000000-0000-4000-8000-000000000005', '62000000-0000-4000-8000-000000000004',
   'ACT.M1.W1.D2.EXAMPLE', 'INSTRUCTION', 'Notice the form', 1,
   '{"body":"I am Linh. You are my friend. She is An. The verb changes with the person: I am, you are, he or she is.","opportunityType":"EXPOSURE","modality":"WRITTEN","reviewStatus":"DRAFT"}'),
  ('62000000-0000-4000-8000-000000000006', '62000000-0000-4000-8000-000000000004',
   'ACT.M1.W1.D2.GUIDED', 'CONTROLLED_PRACTICE', 'Complete three personal facts', 2,
   '{"instruction":"Type am, are or is. You may use a hint. This is guided practice, not a test.","opportunityType":"GUIDED_PRACTICE","modality":"WRITTEN_PRODUCTION","reviewStatus":"DRAFT"}'),
  ('62000000-0000-4000-8000-000000000007', '62000000-0000-4000-8000-000000000004',
   'ACT.M1.W1.D2.REFLECT', 'REFLECTION', 'Say the pattern to yourself', 3,
   '{"body":"Read the three sentences again. Notice which form follows I, you and she.","opportunityType":"REFLECTION","modality":"WRITTEN","reviewStatus":"DRAFT"}');

INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('62000000-0000-4000-8000-000000000008', 'FAMILY.M1.BE.GUIDED_PERSONAL',
   'Supported selection of be forms in familiar personal facts', '{"strongEvidenceRepeatLimit":0}');
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('62000000-0000-4000-8000-000000000009', '62000000-0000-4000-8000-000000000008', 'ITEM.M1.BE.GUIDED.I'),
  ('62000000-0000-4000-8000-000000000010', '62000000-0000-4000-8000-000000000008', 'ITEM.M1.BE.GUIDED.YOU'),
  ('62000000-0000-4000-8000-000000000011', '62000000-0000-4000-8000-000000000008', 'ITEM.M1.BE.GUIDED.SHE');
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('62000000-0000-4000-8000-000000000012', '62000000-0000-4000-8000-000000000009',
   1, 'DRAFT', 'PRACTICE', 'NONE', 'SHORT_TEXT',
   '{"text":"I ___ Linh."}', '{"accepted":["am"]}',
   '{"explanation":"Use am after I: I am Linh."}',
   '{"hintAllowed":true,"hint":"I goes with am."}', 'AI_ASSISTED'),
  ('62000000-0000-4000-8000-000000000013', '62000000-0000-4000-8000-000000000010',
   1, 'DRAFT', 'PRACTICE', 'NONE', 'SHORT_TEXT',
   '{"text":"You ___ from Hue."}', '{"accepted":["are"]}',
   '{"explanation":"Use are after you: You are from Hue."}',
   '{"hintAllowed":true,"hint":"You goes with are."}', 'AI_ASSISTED'),
  ('62000000-0000-4000-8000-000000000014', '62000000-0000-4000-8000-000000000011',
   1, 'DRAFT', 'PRACTICE', 'NONE', 'SHORT_TEXT',
   '{"text":"She ___ a student."}', '{"accepted":["is"]}',
   '{"explanation":"Use is after she: She is a student."}',
   '{"hintAllowed":true,"hint":"She goes with is."}', 'AI_ASSISTED');
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('62000000-0000-4000-8000-000000000006', '62000000-0000-4000-8000-000000000012', 1),
  ('62000000-0000-4000-8000-000000000006', '62000000-0000-4000-8000-000000000013', 2),
  ('62000000-0000-4000-8000-000000000006', '62000000-0000-4000-8000-000000000014', 3);
INSERT INTO learning_item_competencies
  (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('62000000-0000-4000-8000-000000000012', '62000000-0000-4000-8000-000000000002',
   'GUIDED_BE_PERSONAL_FACT', 'WRITTEN_PRODUCTION'),
  ('62000000-0000-4000-8000-000000000013', '62000000-0000-4000-8000-000000000002',
   'GUIDED_BE_PERSONAL_FACT', 'WRITTEN_PRODUCTION'),
  ('62000000-0000-4000-8000-000000000014', '62000000-0000-4000-8000-000000000002',
   'GUIDED_BE_PERSONAL_FACT', 'WRITTEN_PRODUCTION');

COMMIT;
