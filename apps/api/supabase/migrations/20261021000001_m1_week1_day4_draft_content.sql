BEGIN;

-- Auto-generated DRAFT migration for Day 4: Hỏi và Đáp Thông tin Cá nhân (Ask and Answer Questions)
-- Strict Guardrail: Status is locked to DRAFT. Publication requires human review.

INSERT INTO lessons (id, unit_id, code, title, summary, position, status) VALUES
  ('103bc59c-7505-4d51-aa77-13c2f0540d6f', '3b8e230d-60e9-4181-a185-101b92f711fc', 'LESSON.M1.W1.D4', 'Hỏi và Đáp Thông tin Cá nhân (Ask and Answer Questions)',
   'Làm chủ 3 câu hỏi làm quen kinh điển với ngữ điệu chuẩn xác, quy tắc đảo ngữ với to be và cách phản hồi tự nhiên trong giao tiếp quốc tế.', 4, 'DRAFT')
  ON CONFLICT (code) DO UPDATE SET title = EXCLUDED.title, summary = EXCLUDED.summary;
INSERT INTO competencies (id, code, title, description, status) VALUES
  ('400132f9-639d-4a8c-a9b5-58d636e7cb73', 'M1.PERSONAL.QA', 'Hỏi và đáp thông tin cá nhân',
   'Chủ động đặt và trả lời các câu hỏi làm quen về tên tuổi, quê quán, nghề nghiệp và dạng câu hỏi Yes/No với to be.', 'ACTIVE')
  ON CONFLICT (code) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;
INSERT INTO lesson_competencies (lesson_id, competency_id, role, target_modality) VALUES
  ('103bc59c-7505-4d51-aa77-13c2f0540d6f', '400132f9-639d-4a8c-a9b5-58d636e7cb73', 'TARGET', 'WRITTEN_PRODUCTION')
  ON CONFLICT (lesson_id, competency_id) DO UPDATE SET role = EXCLUDED.role;
INSERT INTO learning_packages (id, lesson_id, code) VALUES
  ('085afc18-7945-4fab-ae97-15ff2a9d04e2', '103bc59c-7505-4d51-aa77-13c2f0540d6f', 'PACKAGE.M1.W1.D4')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_package_versions (id, learning_package_id, version, status, provenance) VALUES
  ('d3e6ac9c-6e83-4001-a557-ac83e274837d', '085afc18-7945-4fab-ae97-15ff2a9d04e2', 1, 'DRAFT', 'AI_ASSISTED')
  ON CONFLICT (learning_package_id, version) DO UPDATE SET status = 'DRAFT';
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('b2b15529-66c3-46d8-aa81-e71d916d719c', 'd3e6ac9c-6e83-4001-a557-ac83e274837d', 'ACT.M1.W1.D4.PATTERNS_EXPLORE', 'INSTRUCTION',
   'Ba Cặp Hỏi - Đáp Kinh điển & Ngữ điệu Wh- / Yes-No (Core Q&A Pairs)', 1, '{"body":"Khi mới gặp gỡ một người bạn quốc tế, đây là 3 câu hỏi mở đầu giúp bạn bắt chuyện tự nhiên nhất:","opportunityType":"EXPOSURE","modality":"WRITTEN_RECOGNITION","reviewStatus":"DRAFT","pairs":[{"question":"What''s your name? ↘","answer":"I''m Linh. / My name is Linh.","note":"What''s = What is. Câu hỏi Wh- hạ giọng nhẹ ở cuối câu (Falling intonation)."},{"question":"Where are you from? ↘","answer":"I''m from Hue, Vietnam.","note":"Where hỏi về địa điểm, quê quán xuất xứ."},{"question":"What do you do? ↘","answer":"I''m an engineer. / I''m a student.","note":"Cách hỏi nghề nghiệp lịch thiệp, phổ biến nhất của người bản xứ."}],"inversionRule":"Quy tắc đảo ngữ: Câu trần thuật nói ''You are a student'', nhưng câu hỏi đảo to be lên trước: ''Are you a student? ↗'' (ngữ điệu lên giọng ở cuối câu)."}')
  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('196a12cb-530c-4160-a77c-0c6f822fc0fd', 'd3e6ac9c-6e83-4001-a557-ac83e274837d', 'ACT.M1.W1.D4.QA_MATCH', 'INDEPENDENT_CHECK',
   'Ghép Nối Câu Trả lời Phù hợp trong Bối cảnh (Situational Matching)', 2, '{"instruction":"Chọn câu phản hồi phù hợp và lịch sự nhất cho từng câu hỏi giao tiếp đời thường.","opportunityType":"INDEPENDENT_EVIDENCE","modality":"WRITTEN_RECOGNITION","reviewStatus":"DRAFT"}')
  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('77b40872-76f5-4f89-a904-09ccf24bdefe', 'FAMILY.M1.W1.QA_MATCH', 'Pairing origin question with place response',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('2834e62d-6ecb-4722-a7cd-a5e494b9dec1', '77b40872-76f5-4f89-a904-09ccf24bdefe', 'ITEM.M1.W1.D4.WHERE_FROM')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('44458194-457f-4bca-a129-32f38ccbcb27', '2834e62d-6ecb-4722-a7cd-a5e494b9dec1', 1, 'DRAFT', 'EVALUATION', 'INDEPENDENT',
   'SINGLE_CHOICE', '{"text":"A: ''Excuse me, where are you from?'' -> B phản hồi thế nào?","question":"A: ''Excuse me, where are you from?'' -> B phản hồi thế nào?","options":["I''m from Can Tho, Vietnam.","I''m a primary teacher.","I am twenty years old."]}', '{"accepted":["I''m from Can Tho, Vietnam."],"matchMode":"EXACT"}',
   '{"explanation":"Câu hỏi ''Where are you from?'' hỏi về nơi chốn/quê quán, phản hồi đúng là ''I''m from Can Tho, Vietnam.''"}', '{"hintAllowed":false}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('196a12cb-530c-4160-a77c-0c6f822fc0fd', '44458194-457f-4bca-a129-32f38ccbcb27', 1)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('44458194-457f-4bca-a129-32f38ccbcb27', '400132f9-639d-4a8c-a9b5-58d636e7cb73', 'QA_ORIGIN_INDEPENDENT', 'WRITTEN_RECOGNITION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('77b40872-76f5-4f89-a904-09ccf24bdefe', 'FAMILY.M1.W1.QA_MATCH', 'Pairing occupation question with job response',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('58b0dab4-06d5-44e0-aaeb-d75295f470e4', '77b40872-76f5-4f89-a904-09ccf24bdefe', 'ITEM.M1.W1.D4.WHAT_DO')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('4fd93cb5-8f0d-4d76-a004-95c7a64d875c', '58b0dab4-06d5-44e0-aaeb-d75295f470e4', 1, 'DRAFT', 'EVALUATION', 'INDEPENDENT',
   'SINGLE_CHOICE', '{"text":"A: ''And what do you do, Linh?'' -> B phản hồi thế nào?","question":"A: ''And what do you do, Linh?'' -> B phản hồi thế nào?","options":["I''m a university student.","I''m fine, thank you.","I live in Hue."]}', '{"accepted":["I''m a university student."],"matchMode":"EXACT"}',
   '{"explanation":"''What do you do?'' là câu hỏi chuẩn về nghề nghiệp, phản hồi là ''I''m a university student.''"}', '{"hintAllowed":false}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('196a12cb-530c-4160-a77c-0c6f822fc0fd', '4fd93cb5-8f0d-4d76-a004-95c7a64d875c', 2)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('4fd93cb5-8f0d-4d76-a004-95c7a64d875c', '400132f9-639d-4a8c-a9b5-58d636e7cb73', 'QA_JOB_INDEPENDENT', 'WRITTEN_RECOGNITION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('77b40872-76f5-4f89-a904-09ccf24bdefe', 'FAMILY.M1.W1.QA_MATCH', 'Pairing name question with identity response',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('b397e9eb-8cfa-4258-a331-c6078071e68d', '77b40872-76f5-4f89-a904-09ccf24bdefe', 'ITEM.M1.W1.D4.WHATS_NAME')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('78363f67-9a01-4066-a8aa-09cd778580e7', 'b397e9eb-8cfa-4258-a331-c6078071e68d', 1, 'DRAFT', 'EVALUATION', 'INDEPENDENT',
   'SINGLE_CHOICE', '{"text":"A: ''Hi, what''s your name?'' -> B phản hồi thế nào?","question":"A: ''Hi, what''s your name?'' -> B phản hồi thế nào?","options":["I''m Nam. Nice to meet you!","Yes, I am a doctor.","I am very good."]}', '{"accepted":["I''m Nam. Nice to meet you!"],"matchMode":"EXACT"}',
   '{"explanation":"''What''s your name?'' hỏi về tên, câu trả lời tự nhiên và lịch thiệp là ''I''m Nam. Nice to meet you!''"}', '{"hintAllowed":false}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('196a12cb-530c-4160-a77c-0c6f822fc0fd', '78363f67-9a01-4066-a8aa-09cd778580e7', 3)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('78363f67-9a01-4066-a8aa-09cd778580e7', '400132f9-639d-4a8c-a9b5-58d636e7cb73', 'QA_NAME_INDEPENDENT', 'WRITTEN_RECOGNITION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('e8c18130-1064-4244-a178-2972a908014f', 'd3e6ac9c-6e83-4001-a557-ac83e274837d', 'ACT.M1.W1.D4.QUESTIONS_FILL', 'INDEPENDENT_CHECK',
   'Tự Điền Động từ To Be trong Câu Hỏi & Phủ định (Inversions & Negatives)', 3, '{"instruction":"Tự điền dạng đúng của to be không có gợi ý. Hãy chú ý vị trí đứng đầu câu trong câu hỏi và từ ''not'' trong câu phủ định.","opportunityType":"INDEPENDENT_EVIDENCE","modality":"WRITTEN_PRODUCTION","reviewStatus":"DRAFT"}')
  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('987a9941-9de5-42bf-aea2-f7332edf5529', 'FAMILY.M1.W1.BE_QUESTION_FILL', 'Inverted be question with you',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('34e6d63f-ef37-4a6e-ae5b-de4ecc6cefe7', '987a9941-9de5-42bf-aea2-f7332edf5529', 'ITEM.M1.W1.D4.ARE_YOU_STUDENT')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('773f3d1e-75bf-4725-a10a-1c41a4125345', '34e6d63f-ef37-4a6e-ae5b-de4ecc6cefe7', 1, 'DRAFT', 'EVALUATION', 'INDEPENDENT',
   'SHORT_TEXT', '{"text":"___ you a student at this university?"}', '{"accepted":["are","Are"],"matchMode":"CASE_INSENSITIVE"}',
   '{"explanation":"Câu hỏi Yes/No với chủ ngữ ''you'' đảo ''Are'' lên đầu câu: ''Are you a student...?''"}', '{"hintAllowed":false}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('e8c18130-1064-4244-a178-2972a908014f', '773f3d1e-75bf-4725-a10a-1c41a4125345', 1)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('773f3d1e-75bf-4725-a10a-1c41a4125345', '400132f9-639d-4a8c-a9b5-58d636e7cb73', 'BE_QUESTION_INDEPENDENT', 'WRITTEN_PRODUCTION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('987a9941-9de5-42bf-aea2-f7332edf5529', 'FAMILY.M1.W1.BE_QUESTION_FILL', 'Wh- question with third person she',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('389460dc-8d79-48a8-ae99-06485c3e7dfc', '987a9941-9de5-42bf-aea2-f7332edf5529', 'ITEM.M1.W1.D4.WHERE_IS_SHE')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('554dac1a-bcd8-4f6f-ab16-63e2ca2d8ddc', '389460dc-8d79-48a8-ae99-06485c3e7dfc', 1, 'DRAFT', 'EVALUATION', 'INDEPENDENT',
   'SHORT_TEXT', '{"text":"Where ___ she from originally?"}', '{"accepted":["is","Is"],"matchMode":"CASE_INSENSITIVE"}',
   '{"explanation":"Với chủ ngữ ngôi thứ 3 số ít ''she'', to be tương ứng là ''is'': ''Where is she from...?''"}', '{"hintAllowed":false}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('e8c18130-1064-4244-a178-2972a908014f', '554dac1a-bcd8-4f6f-ab16-63e2ca2d8ddc', 2)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('554dac1a-bcd8-4f6f-ab16-63e2ca2d8ddc', '400132f9-639d-4a8c-a9b5-58d636e7cb73', 'BE_QUESTION_INDEPENDENT', 'WRITTEN_PRODUCTION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('987a9941-9de5-42bf-aea2-f7332edf5529', 'FAMILY.M1.W1.BE_QUESTION_FILL', 'Negative be sentence with first person',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('c5cd4a5a-1ea1-4485-a770-6a4dabdfa1f6', '987a9941-9de5-42bf-aea2-f7332edf5529', 'ITEM.M1.W1.D4.I_AM_NOT')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('67052f6a-4087-43bb-ab04-4c0a0a53fc60', 'c5cd4a5a-1ea1-4485-a770-6a4dabdfa1f6', 1, 'DRAFT', 'EVALUATION', 'INDEPENDENT',
   'SHORT_TEXT', '{"text":"I ___ not a tourist; I live and work here."}', '{"accepted":["am","Am"],"matchMode":"CASE_INSENSITIVE"}',
   '{"explanation":"Câu phủ định với chủ ngữ ''I'' dùng ''am not'': ''I am not a tourist...''"}', '{"hintAllowed":false}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('e8c18130-1064-4244-a178-2972a908014f', '67052f6a-4087-43bb-ab04-4c0a0a53fc60', 3)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('67052f6a-4087-43bb-ab04-4c0a0a53fc60', '400132f9-639d-4a8c-a9b5-58d636e7cb73', 'BE_QUESTION_INDEPENDENT', 'WRITTEN_PRODUCTION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;

COMMIT;
