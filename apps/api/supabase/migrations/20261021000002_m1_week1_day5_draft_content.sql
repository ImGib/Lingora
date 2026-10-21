BEGIN;

-- Auto-generated DRAFT migration for Day 5: Tự Giới thiệu Bản thân: Viết và Ghi âm (Introduce Yourself)
-- Strict Guardrail: Status is locked to DRAFT. Publication requires human review.

INSERT INTO lessons (id, unit_id, code, title, summary, position, status) VALUES
  ('ccc8ea62-27fa-48a2-adeb-834ebe5b06a3', '3b8e230d-60e9-4181-a185-101b92f711fc', 'LESSON.M1.W1.D5', 'Tự Giới thiệu Bản thân: Viết và Ghi âm (Introduce Yourself)',
   'Cột mốc độc lập đầu tiên: Tự viết 3-5 câu giới thiệu bản thân hoàn chỉnh và ghi âm 20-30 giây giọng nói tự tin của chính bạn.', 5, 'DRAFT')
  ON CONFLICT (code) DO UPDATE SET title = EXCLUDED.title, summary = EXCLUDED.summary;
INSERT INTO competencies (id, code, title, description, status) VALUES
  ('dab1cab6-b1b9-4816-a003-b968057fe294', 'M1.PERSONAL.WRITE_INTRO', 'Tự viết 3-5 câu giới thiệu bản thân',
   'Tự sáng tác và viết một đoạn giới thiệu bản thân rõ ràng, mạch lạc gồm lời chào, tên, nơi đến, công việc và sở thích.', 'ACTIVE')
  ON CONFLICT (code) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;
INSERT INTO lesson_competencies (lesson_id, competency_id, role, target_modality) VALUES
  ('ccc8ea62-27fa-48a2-adeb-834ebe5b06a3', 'dab1cab6-b1b9-4816-a003-b968057fe294', 'TARGET', 'WRITTEN_PRODUCTION')
  ON CONFLICT (lesson_id, competency_id) DO UPDATE SET role = EXCLUDED.role;
INSERT INTO competencies (id, code, title, description, status) VALUES
  ('41d63ba0-6b11-4c45-af37-6a7527d627e8', 'M1.PERSONAL.SPEAK_INTRO', 'Nói 20-30 giây giới thiệu bản thân',
   'Tự tin ghi âm một đoạn giới thiệu ngắn 20-30 giây với phát âm rõ ràng, người nghe hiểu được thông tin chính.', 'ACTIVE')
  ON CONFLICT (code) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;
INSERT INTO lesson_competencies (lesson_id, competency_id, role, target_modality) VALUES
  ('ccc8ea62-27fa-48a2-adeb-834ebe5b06a3', '41d63ba0-6b11-4c45-af37-6a7527d627e8', 'TARGET', 'SPOKEN_PRODUCTION')
  ON CONFLICT (lesson_id, competency_id) DO UPDATE SET role = EXCLUDED.role;
INSERT INTO learning_packages (id, lesson_id, code) VALUES
  ('05a45df4-5959-49e9-aba8-c4319a5687fe', 'ccc8ea62-27fa-48a2-adeb-834ebe5b06a3', 'PACKAGE.M1.W1.D5')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_package_versions (id, learning_package_id, version, status, provenance) VALUES
  ('a6f0c266-4e6e-42cc-abb9-8007a4045715', '05a45df4-5959-49e9-aba8-c4319a5687fe', 1, 'DRAFT', 'AI_ASSISTED')
  ON CONFLICT (learning_package_id, version) DO UPDATE SET status = 'DRAFT';
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('790cad0a-d6b7-48fd-a66f-b75c43b00bbf', 'a6f0c266-4e6e-42cc-abb9-8007a4045715', 'ACT.M1.W1.D5.STUDIO_GUIDE', 'INSTRUCTION',
   'Khung Gợi ý Bài Giới thiệu Chuẩn mực (Structured Introduction Blueprint)', 1, '{"body":"Hôm nay bạn sẽ tự tạo ra sản phẩm ngôn ngữ của riêng mình! Hãy tham khảo khung cấu trúc 5 bước tự nhiên dưới đây:","opportunityType":"EXPOSURE","modality":"WRITTEN_RECOGNITION","reviewStatus":"DRAFT","blueprint":[{"step":"1. Lời chào & Tên","pattern":"Hello everyone! My name is [Tên của bạn]. / I''m [Tên của bạn]."},{"step":"2. Xuất xứ & Nơi sống","pattern":"I am from [Quê hương], but now I live in [Thành phố hiện tại]."},{"step":"3. Nghề nghiệp / Vai trò","pattern":"I am a [student / teacher / nurse / engineer / developer / designer]."},{"step":"4. Sở thích cá nhân","pattern":"In my free time, I really enjoy [reading books / listening to music / cooking / running]."},{"step":"5. Lời kết lịch thiệp","pattern":"Nice to meet you all! / It''s great to be here."}],"authoringTip":"Đừng cố dùng từ ngữ quá phức tạp. Hãy dùng những từ đơn giản, chính xác mà bạn phát âm tự tin nhất."}')
  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('3a733c04-9995-41bd-a1a8-6ad7dfdfb93f', 'a6f0c266-4e6e-42cc-abb9-8007a4045715', 'ACT.M1.W1.D5.WRITE_WORKSPACE', 'INDEPENDENT_CHECK',
   'Không gian Viết: 3-5 Câu về Chính Bạn (Writing Studio)', 2, '{"instruction":"Tự viết ít nhất 3-5 câu giới thiệu bản thân vào ô bên dưới. Hãy đọc kỹ checklist tự soát trước khi nộp.","opportunityType":"INDEPENDENT_EVIDENCE","modality":"WRITTEN_PRODUCTION","reviewStatus":"DRAFT","selfChecklist":["Có lời chào mở đầu và tên của tôi","Có quê hương hoặc nơi tôi đang sống","Dùng đúng động từ to be (am / is / are) và mạo từ a/an","Có ít nhất 3 câu do chính tôi tự viết","Dấu chấm câu và viết hoa đầu câu chuẩn xác"]}')
  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('d42c0355-ed9e-41f1-a849-8da4a3fc9fc2', 'FAMILY.M1.W1.WRITE_INTRO_STUDIO', 'Independent written production of a personalized introduction artifact',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('0926c7b9-71de-4050-a9c5-67f446f53fd0', 'd42c0355-ed9e-41f1-a849-8da4a3fc9fc2', 'ITEM.M1.W1.D5.WRITE_SELF_ARTIFACT')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('d2bf1f82-5262-4298-a38a-4dd6d5cf91d5', '0926c7b9-71de-4050-a9c5-67f446f53fd0', 1, 'DRAFT', 'EVALUATION', 'INDEPENDENT',
   'SHORT_TEXT', '{"text":"Tự viết 3-5 câu giới thiệu bản thân bằng tiếng Anh vào ô bên dưới:","instruction":"Tự viết 3-5 câu giới thiệu bản thân.","placeholder":"Hello! My name is... I am from... I am a...","minSentences":3,"maxSentences":6}', '{"accepted":["ARTIFACT_WRITING_SUBMISSION"],"matchMode":"CASE_INSENSITIVE"}',
   '{"explanation":"Bài viết của bạn được lưu trữ an toàn trong kho bằng chứng học tập định tính."}', '{"hintAllowed":false}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('3a733c04-9995-41bd-a1a8-6ad7dfdfb93f', 'd2bf1f82-5262-4298-a38a-4dd6d5cf91d5', 1)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('d2bf1f82-5262-4298-a38a-4dd6d5cf91d5', 'dab1cab6-b1b9-4816-a003-b968057fe294', 'WRITE_INTRO_INDEPENDENT', 'WRITTEN_PRODUCTION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('dd35d14f-56d7-44f0-a355-feb541067939', 'a6f0c266-4e6e-42cc-abb9-8007a4045715', 'ACT.M1.W1.D5.SPEAKING_STUDIO', 'INDEPENDENT_CHECK',
   'Phòng Ghi âm Giọng nói: 20-30 Giây Tự tin (Speaking Studio)', 3, '{"instruction":"Hít một hơi thật sâu, mỉm cười và nhấn nút ghi âm để nói lời giới thiệu vừa viết. Nếu micro bị chặn hoặc gặp lỗi mạng, bạn có thể chọn bỏ qua mà không bị tính lỗi.","opportunityType":"INDEPENDENT_EVIDENCE","modality":"SPOKEN_PRODUCTION","reviewStatus":"DRAFT","pacingTip":"Tốc độ nói lý tưởng là từ tốn, khoảng 1 từ mỗi giây. Nói rõ âm cuối (ending sounds: /z/, /t/, /m/)."}')
  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('6d36a8ce-71bd-4d1c-ad55-ea8b935177bd', 'FAMILY.M1.W1.SPEAK_INTRO_STUDIO', 'Independent spoken delivery of personal introduction audio artifact',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('0e7055ce-e32a-4989-a5a8-bad070e4f098', '6d36a8ce-71bd-4d1c-ad55-ea8b935177bd', 'ITEM.M1.W1.D5.SPEAK_SELF_ARTIFACT')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('a350b606-abc7-4f96-af2e-979c902bbd2e', '0e7055ce-e32a-4989-a5a8-bad070e4f098', 1, 'DRAFT', 'EVALUATION', 'INDEPENDENT',
   'SHORT_TEXT', '{"text":"Ghi âm 20-30 giây lời giới thiệu của bạn:","instruction":"Ghi âm 20-30 giây lời giới thiệu của bạn.","targetDurationSeconds":25,"fallbackAvailable":true}', '{"accepted":["ARTIFACT_AUDIO_SUBMISSION"],"matchMode":"CASE_INSENSITIVE"}',
   '{"explanation":"File ghi âm giọng nói của bạn được bảo mật trong tài khoản để bạn tự so sánh tiến bộ sau mỗi tuần."}', '{"hintAllowed":false}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('dd35d14f-56d7-44f0-a355-feb541067939', 'a350b606-abc7-4f96-af2e-979c902bbd2e', 1)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('a350b606-abc7-4f96-af2e-979c902bbd2e', 'dab1cab6-b1b9-4816-a003-b968057fe294', 'SPEAK_INTRO_INDEPENDENT', 'SPOKEN_PRODUCTION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;

COMMIT;
