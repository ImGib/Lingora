BEGIN;

-- Day 1 is authored as a draft. Publication needs content, audio, accessibility,
-- evidence-opportunity, and beginner-usability review before learner delivery.
INSERT INTO tracks (id, program_id, code, title) VALUES
  ('61000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002',
   'TRACK.M1.COMMUNICATION', 'Beginner Communication');
INSERT INTO stage_tracks (id, stage_id, track_id, position) VALUES
  ('61000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000003',
   '61000000-0000-4000-8000-000000000001', 2);
INSERT INTO modules (id, stage_track_id, code, title, position) VALUES
  ('61000000-0000-4000-8000-000000000003', '61000000-0000-4000-8000-000000000002',
   'MODULE.M1.WEEK_1', 'Me and My English', 1);
INSERT INTO units (id, module_id, code, title, position) VALUES
  ('61000000-0000-4000-8000-000000000004', '61000000-0000-4000-8000-000000000003',
   'UNIT.M1.INTRODUCTIONS', 'Introductions', 1);
INSERT INTO lessons (id, unit_id, code, title, summary, position, status) VALUES
  ('61000000-0000-4000-8000-000000000005', '61000000-0000-4000-8000-000000000004',
   'LESSON.M1.W1.D1', 'Meet a Simple Introduction',
   'Read and notice a short introduction. No answers are scored on Day 1.', 1, 'DRAFT');

INSERT INTO competencies (id, code, title, description, status) VALUES
  ('61000000-0000-4000-8000-000000000006', 'M1.PERSONAL.READ_DETAILS',
   'Read basic personal details',
   'Understand explicitly stated name, place and role in a short beginner introduction.', 'ACTIVE');
INSERT INTO lesson_competencies (lesson_id, competency_id, role, target_modality) VALUES
  ('61000000-0000-4000-8000-000000000005', '61000000-0000-4000-8000-000000000006',
   'TARGET', 'WRITTEN_RECOGNITION');

INSERT INTO learning_packages (id, lesson_id, code) VALUES
  ('61000000-0000-4000-8000-000000000007', '61000000-0000-4000-8000-000000000005',
   'PACKAGE.M1.W1.D1');
INSERT INTO learning_package_versions
  (id, learning_package_id, version, status, provenance) VALUES
  ('61000000-0000-4000-8000-000000000008', '61000000-0000-4000-8000-000000000007',
   1, 'DRAFT', 'AI_ASSISTED');
INSERT INTO activities
  (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('61000000-0000-4000-8000-000000000009', '61000000-0000-4000-8000-000000000008',
   'ACT.M1.W1.D1.MEANING', 'INSTRUCTION', 'Meet Linh', 1,
   '{"body":"Hello. My name is Linh. I am from Hue. I am a student.","opportunityType":"EXPOSURE","modality":"WRITTEN","reviewStatus":"DRAFT"}'),
  ('61000000-0000-4000-8000-000000000010', '61000000-0000-4000-8000-000000000008',
   'ACT.M1.W1.D1.NOTICE', 'INSTRUCTION', 'Notice three details', 2,
   '{"body":"Linh tells us her name, that she is from Hue, and that she is a student. Read the introduction again and notice those three details.","opportunityType":"EXPOSURE","modality":"WRITTEN","reviewStatus":"DRAFT"}'),
  ('61000000-0000-4000-8000-000000000011', '61000000-0000-4000-8000-000000000008',
   'ACT.M1.W1.D1.SECOND_PROFILE', 'REFLECTION', 'Meet An', 3,
   '{"body":"Hi. I am An. I am from Da Nang. Notice the name and place. You do not need to answer a test today.","opportunityType":"EXPOSURE","modality":"WRITTEN","reviewStatus":"DRAFT"}');

COMMIT;
