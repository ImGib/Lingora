BEGIN;

-- Auto-generated DRAFT migration for Day 6: Chuyển giao sang Tình huống Mới (Transfer to New Situations)
-- Strict Guardrail: Status is locked to DRAFT. Publication requires human review.

INSERT INTO lessons (id, unit_id, code, title, summary, position, status) VALUES
  ('24b9924d-155d-4d64-a656-44618eec2e20', '3b8e230d-60e9-4181-a185-101b92f711fc', 'LESSON.M1.W1.D6', 'Chuyển giao sang Tình huống Mới (Transfer to New Situations)',
   'Thử thách năng lực trong bối cảnh hoàn toàn mới: Tin nhắn trò chuyện thực tế của Carlos, nghe bài phát biểu của Yuki và tự giới thiệu một người bạn bằng ngôi thứ ba.', 6, 'DRAFT')
  ON CONFLICT (code) DO UPDATE SET title = EXCLUDED.title, summary = EXCLUDED.summary;
INSERT INTO competencies (id, code, title, description, status) VALUES
  ('d25a6f45-aa15-4392-addb-e66cebc22512', 'M1.PERSONAL.TRANSFER', 'Chuyển giao năng lực giới thiệu sang bối cảnh mới',
   'Hiểu và sử dụng linh hoạt các cấu trúc giới thiệu bản thân trong tin nhắn công việc, hội thảo và khi nói về người khác (he/she).', 'ACTIVE')
  ON CONFLICT (code) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;
INSERT INTO lesson_competencies (lesson_id, competency_id, role, target_modality) VALUES
  ('24b9924d-155d-4d64-a656-44618eec2e20', 'd25a6f45-aa15-4392-addb-e66cebc22512', 'TARGET', 'WRITTEN_PRODUCTION')
  ON CONFLICT (lesson_id, competency_id) DO UPDATE SET role = EXCLUDED.role;
INSERT INTO learning_packages (id, lesson_id, code) VALUES
  ('f606f314-df10-435f-a55a-f9350110dfe4', '24b9924d-155d-4d64-a656-44618eec2e20', 'PACKAGE.M1.W1.D6')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_package_versions (id, learning_package_id, version, status, provenance) VALUES
  ('3caead97-592c-4190-aa0d-3ddd3b8e7b59', 'f606f314-df10-435f-a55a-f9350110dfe4', 1, 'DRAFT', 'AI_ASSISTED')
  ON CONFLICT (learning_package_id, version) DO UPDATE SET status = 'DRAFT';
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('4a4b29e5-e9d8-4b21-abc9-1347883a1e25', '3caead97-592c-4190-aa0d-3ddd3b8e7b59', 'ACT.M1.W1.D6.READ_CARLOS', 'INDEPENDENT_CHECK',
   'Đọc Tin nhắn Làm quen trong Nhóm Dự án (Team Chat Transfer)', 1, '{"instruction":"Đọc tin nhắn chào mừng thành viên mới từ Carlos trong nhóm chat công việc và trả lời câu hỏi.","opportunityType":"INDEPENDENT_EVIDENCE","modality":"WRITTEN_RECOGNITION","reviewStatus":"DRAFT","chatContext":{"sender":"Carlos Mendoza","avatar":"engineer","time":"09:15 AM","channel":"#general-introductions"}}')
  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('7e777f54-7fd1-4743-abe6-7fad64fcff71', 'FAMILY.M1.W1.READ_TRANSFER', 'Transfer reading comprehension to informal chat format',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('6a1d9512-74be-45cc-aaa1-7e7175492c20', '7e777f54-7fd1-4743-abe6-7fad64fcff71', 'ITEM.M1.W1.D6.CARLOS_LIVE')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('34790fda-f296-44a7-a5ab-7ace36a81a74', '6a1d9512-74be-45cc-aaa1-7e7175492c20', 1, 'DRAFT', 'EVALUATION', 'TRANSFER',
   'SINGLE_CHOICE', '{"text":"Hiện tại Carlos đang sinh sống và làm việc ở đâu?","question":"Hiện tại Carlos đang sinh sống và làm việc ở đâu?","options":["Hà Nội, Việt Nam","Guadalajara, Mexico","Tokyo, Nhật Bản"],"passage":"Carlos Mendoza: ''Hey everyone! I am Carlos. I am originally from Guadalajara, Mexico, but currently I live and work in Hanoi on the new metro project. I am a civil engineer. Really excited to be here!''"}', '{"accepted":["Hà Nội, Việt Nam"],"matchMode":"EXACT"}',
   '{"explanation":"Carlos đến từ Mexico, nhưng hiện tại sống và làm việc ở Hà Nội: ''...currently I live and work in Hanoi...''"}', '{"hintAllowed":false}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('4a4b29e5-e9d8-4b21-abc9-1347883a1e25', '34790fda-f296-44a7-a5ab-7ace36a81a74', 1)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('34790fda-f296-44a7-a5ab-7ace36a81a74', 'd25a6f45-aa15-4392-addb-e66cebc22512', 'READ_TRANSFER_INDEPENDENT', 'WRITTEN_RECOGNITION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('7e777f54-7fd1-4743-abe6-7fad64fcff71', 'FAMILY.M1.W1.READ_TRANSFER', 'Transfer reading comprehension to informal chat format',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('cb270e39-56b6-4f62-a400-870bbb94ef2d', '7e777f54-7fd1-4743-abe6-7fad64fcff71', 'ITEM.M1.W1.D6.CARLOS_JOB')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('5ab23403-acc8-4ad9-a646-a0d8c894a3e1', 'cb270e39-56b6-4f62-a400-870bbb94ef2d', 1, 'DRAFT', 'EVALUATION', 'TRANSFER',
   'SINGLE_CHOICE', '{"text":"Chuyên môn nghề nghiệp của Carlos là gì?","question":"Chuyên môn nghề nghiệp của Carlos là gì?","options":["Kỹ sư xây dựng (Civil engineer)","Kiến trúc sư phần mềm (Software architect)","Bếp trưởng (Chef)"],"passage":"Carlos Mendoza: ''...I live and work in Hanoi on the new metro project. I am a civil engineer. Really excited to be here!''"}', '{"accepted":["Kỹ sư xây dựng (Civil engineer)"],"matchMode":"EXACT"}',
   '{"explanation":"''I am a civil engineer'' có nghĩa là kỹ sư xây dựng."}', '{"hintAllowed":false}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('4a4b29e5-e9d8-4b21-abc9-1347883a1e25', '5ab23403-acc8-4ad9-a646-a0d8c894a3e1', 2)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('5ab23403-acc8-4ad9-a646-a0d8c894a3e1', 'd25a6f45-aa15-4392-addb-e66cebc22512', 'READ_TRANSFER_INDEPENDENT', 'WRITTEN_RECOGNITION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('e240017a-65ae-4d7b-ae18-bba13603c51c', '3caead97-592c-4190-aa0d-3ddd3b8e7b59', 'ACT.M1.W1.D6.LISTEN_YUKI', 'INDEPENDENT_CHECK',
   'Nghe Lời Chào tại Hội thảo Quốc tế (Conference Speech Transfer)', 2, '{"instruction":"Lắng nghe bài giới thiệu mở đầu của Yuki tại hội thảo giao lưu giáo dục.","opportunityType":"INDEPENDENT_EVIDENCE","modality":"AURAL_RECOGNITION","reviewStatus":"DRAFT","audioTranscript":"Good morning distinguished colleagues! My name is Yuki Tanaka. I am from Osaka, Japan. I am a high school Japanese teacher and currently an exchange instructor in Da Nang. It is a genuine honor to meet all of you."}')
  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('0eab7b0d-17c6-483d-a4b0-30a78e4b7350', 'FAMILY.M1.W1.LISTEN_TRANSFER', 'Transfer listening comprehension to novel voice and facts',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('8d0fe9d4-0b65-4280-a19a-5e65d46d65ad', '0eab7b0d-17c6-483d-a4b0-30a78e4b7350', 'ITEM.M1.W1.D6.YUKI_JOB')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('95ed66b7-dd79-4133-a40b-1aab0f202815', '8d0fe9d4-0b65-4280-a19a-5e65d46d65ad', 1, 'DRAFT', 'EVALUATION', 'TRANSFER',
   'SINGLE_CHOICE', '{"text":"Nghề nghiệp và vai trò hiện tại của Yuki là gì?","question":"Nghề nghiệp và vai trò hiện tại của Yuki là gì?","options":["Giáo viên tiếng Nhật (Japanese teacher)","Bác sĩ khoa nhi (Pediatrician)","Nhiếp ảnh gia (Photographer)"],"audio":"My name is Yuki Tanaka. I am from Osaka, Japan. I am a high school Japanese teacher..."}', '{"accepted":["Giáo viên tiếng Nhật (Japanese teacher)"],"matchMode":"EXACT"}',
   '{"explanation":"Yuki nói: ''I am a high school Japanese teacher'' -> Giáo viên tiếng Nhật."}', '{"hintAllowed":false}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('e240017a-65ae-4d7b-ae18-bba13603c51c', '95ed66b7-dd79-4133-a40b-1aab0f202815', 1)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('95ed66b7-dd79-4133-a40b-1aab0f202815', 'd25a6f45-aa15-4392-addb-e66cebc22512', 'LISTEN_TRANSFER_INDEPENDENT', 'AURAL_RECOGNITION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('0eab7b0d-17c6-483d-a4b0-30a78e4b7350', 'FAMILY.M1.W1.LISTEN_TRANSFER', 'Transfer listening comprehension to novel voice and facts',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('74b8669c-e974-486e-ad67-0062b84beb09', '0eab7b0d-17c6-483d-a4b0-30a78e4b7350', 'ITEM.M1.W1.D6.YUKI_CITY')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('aa435b4b-fad5-45ab-a938-3e115d6ff5a9', '74b8669c-e974-486e-ad67-0062b84beb09', 1, 'DRAFT', 'EVALUATION', 'TRANSFER',
   'SINGLE_CHOICE', '{"text":"Yuki đến từ thành phố nào ở Nhật Bản?","question":"Yuki đến từ thành phố nào ở Nhật Bản?","options":["Osaka","Tokyo","Kyoto"],"audio":"My name is Yuki Tanaka. I am from Osaka, Japan."}', '{"accepted":["Osaka"],"matchMode":"EXACT"}',
   '{"explanation":"Yuki nói rõ: ''I am from Osaka, Japan.''"}', '{"hintAllowed":false}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('e240017a-65ae-4d7b-ae18-bba13603c51c', 'aa435b4b-fad5-45ab-a938-3e115d6ff5a9', 2)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('aa435b4b-fad5-45ab-a938-3e115d6ff5a9', 'd25a6f45-aa15-4392-addb-e66cebc22512', 'LISTEN_TRANSFER_INDEPENDENT', 'AURAL_RECOGNITION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('e89dc8f5-ee15-40a1-aa7a-ea838f6246ac', '3caead97-592c-4190-aa0d-3ddd3b8e7b59', 'ACT.M1.W1.D6.WRITE_FRIEND', 'INDEPENDENT_CHECK',
   'Chuyển giao Viết: Giới thiệu một Người bạn bằng Ngôi thứ Ba (Third-Person Intro)', 3, '{"instruction":"Viết 3 câu giới thiệu một người bạn, đồng nghiệp hoặc người thân. Sử dụng ngôi thứ ba ''He is...'' hoặc ''She is...''.","opportunityType":"INDEPENDENT_EVIDENCE","modality":"WRITTEN_PRODUCTION","reviewStatus":"DRAFT","frame":"This is my friend, [Tên]. He/She is from [Quê quán]. He/She is a [Nghề nghiệp].","thirdPersonNote":"Chú ý: Khi chuyển từ bản thân sang người khác, ''I am'' chuyển thành ''He is'' hoặc ''She is''."}')
  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('0da10987-a0f3-4007-a10c-9dcd58b1c983', 'FAMILY.M1.W1.WRITE_TRANSFER', 'Transfer written production to third person he/she',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('dbc45b29-c35b-48b5-a531-c7c4fac1d4a2', '0da10987-a0f3-4007-a10c-9dcd58b1c983', 'ITEM.M1.W1.D6.FRIEND_INTRO_ARTIFACT')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('3735bb98-6fc3-4ab4-a911-97b8be084337', 'dbc45b29-c35b-48b5-a531-c7c4fac1d4a2', 1, 'DRAFT', 'EVALUATION', 'TRANSFER',
   'SHORT_TEXT', '{"text":"Viết 3 câu giới thiệu một người bạn bằng He is hoặc She is:","instruction":"Viết 3 câu giới thiệu một người bạn bằng He is hoặc She is.","minSentences":3}', '{"accepted":["ARTIFACT_FRIEND_INTRO_SUBMISSION"],"matchMode":"CASE_INSENSITIVE"}',
   '{"explanation":"Bài viết chuyển giao ngôi thứ ba của bạn được ghi nhận vào hồ sơ năng lực."}', '{"hintAllowed":false}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('e89dc8f5-ee15-40a1-aa7a-ea838f6246ac', '3735bb98-6fc3-4ab4-a911-97b8be084337', 1)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('3735bb98-6fc3-4ab4-a911-97b8be084337', 'd25a6f45-aa15-4392-addb-e66cebc22512', 'WRITE_TRANSFER_INDEPENDENT', 'WRITTEN_PRODUCTION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;

COMMIT;
