BEGIN;

-- Auto-generated DRAFT migration for Day 7: Khu Vườn Tiến Bộ: Củng cố Ngắt quãng & Quyền Nghỉ ngơi (Growth Garden & Rest)
-- Strict Guardrail: Status is locked to DRAFT. Publication requires human review.

INSERT INTO lessons (id, unit_id, code, title, summary, position, status) VALUES
  ('9e63477c-b8f5-4000-ae7d-5d24af015b5a', '3b8e230d-60e9-4181-a185-101b92f711fc', 'LESSON.M1.W1.D7', 'Khu Vườn Tiến Bộ: Củng cố Ngắt quãng & Quyền Nghỉ ngơi (Growth Garden & Rest)',
   'Ngày dừng chân không áp lực: Nhìn lại các hạt mầm năng lực đã nảy chồi sau Tuần 1, thử thách củng cố trí nhớ ngắt quãng và lựa chọn nghỉ ngơi trọn vẹn mà không bị phán xét.', 7, 'DRAFT')
  ON CONFLICT (code) DO UPDATE SET title = EXCLUDED.title, summary = EXCLUDED.summary;
INSERT INTO competencies (id, code, title, description, status) VALUES
  ('7fe1858d-d052-411c-a3e7-df797293ce1a', 'M1.PERSONAL.READ_DETAILS', 'Đọc hiểu chi tiết thông tin cá nhân',
   'Củng cố và duy trì khả năng nhận diện các chi tiết thông tin cá nhân cơ bản.', 'ACTIVE')
  ON CONFLICT (code) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;
INSERT INTO lesson_competencies (lesson_id, competency_id, role, target_modality) VALUES
  ('9e63477c-b8f5-4000-ae7d-5d24af015b5a', '7fe1858d-d052-411c-a3e7-df797293ce1a', 'SUPPORTING', 'WRITTEN_RECOGNITION')
  ON CONFLICT (lesson_id, competency_id) DO UPDATE SET role = EXCLUDED.role;
INSERT INTO learning_packages (id, lesson_id, code) VALUES
  ('9830de68-392e-4747-a63c-09ff61ea83e5', '9e63477c-b8f5-4000-ae7d-5d24af015b5a', 'PACKAGE.M1.W1.D7')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_package_versions (id, learning_package_id, version, status, provenance) VALUES
  ('bf2a87fa-34e1-47ce-ac36-b4629f01b445', '9830de68-392e-4747-a63c-09ff61ea83e5', 1, 'DRAFT', 'AI_ASSISTED')
  ON CONFLICT (learning_package_id, version) DO UPDATE SET status = 'DRAFT';
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('1dff8017-f73b-40f4-abcc-7e9d83f87afe', 'bf2a87fa-34e1-47ce-ac36-b4629f01b445', 'ACT.M1.W1.D7.MILESTONE_GARDEN', 'REFLECTION',
   'Khu Vườn Tiến Bộ: 6 Giai Đoạn Phát Triển Của Cây (Growth Tree Stages)', 1, '{"body":"Chúc mừng bạn đã đồng hành trọn vẹn Tuần 1! Theo mô hình Cây Tiến Độ, bạn đã từng bước gieo mầm và nuôi dưỡng cây ngôn ngữ của chính mình:","opportunityType":"EXPOSURE","modality":"WRITTEN_RECOGNITION","reviewStatus":"DRAFT","stages":[{"stage":"01. Hạt giống","desc":"Gieo mầm ngày đầu: Tiếp xúc với Linh và 4 trụ cột thông tin cá nhân."},{"stage":"02. Nảy mầm","desc":"Nắm vững mảnh ghép Grammar Pieces to be (am / are / is) và dạng rút gọn."},{"stage":"03. Thân cành","desc":"Lắng nghe Mai đánh vần tên và đọc quét thẻ hồ sơ quốc tế của Tom Baker."},{"stage":"04. Phân nhánh","desc":"Làm chủ 3 câu hỏi kinh điển Wh- và câu hỏi đảo Yes/No với ngữ điệu chuẩn."},{"stage":"05. Ra lá","desc":"Tự tay viết 3-5 câu và thu âm giọng nói tiếng Anh đầu tiên làm kỷ niệm."},{"stage":"06. Kết trái","desc":"Chuyển giao thành công sang tin nhắn của Carlos và giới thiệu đồng nghiệp."}]}')
  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('23c865b2-9258-4600-ab3a-5015f60bcd20', 'bf2a87fa-34e1-47ce-ac36-b4629f01b445', 'ACT.M1.W1.D7.SPACED_RETRIEVAL', 'CONTROLLED_PRACTICE',
   'Thử Thách Nhớ Lâu Nhẹ Nhàng (Spaced Retrieval Check)', 2, '{"instruction":"3 câu hỏi trắc nghiệm nhẹ nhàng giúp củng cố kiến thức vào trí nhớ dài hạn. Không chấm điểm phạt.","opportunityType":"GUIDED_PRACTICE","modality":"WRITTEN_RECOGNITION","reviewStatus":"DRAFT"}')
  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('54815d8d-3b28-47b3-a404-c1461ef8a094', 'FAMILY.M1.W1.RECAP_CHECK', 'Spaced retrieval of subject-verb agreement',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('e6ab749a-8f0f-4bb2-af59-5e26fd1cae9f', '54815d8d-3b28-47b3-a404-c1461ef8a094', 'ITEM.M1.W1.D7.RECAP_BE')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('2ebf2df0-ec88-45d9-a02a-18c089c47e1a', 'e6ab749a-8f0f-4bb2-af59-5e26fd1cae9f', 1, 'DRAFT', 'PRACTICE', 'NONE',
   'SINGLE_CHOICE', '{"text":"Đại từ ''I'' (tôi) luôn kết hợp với dạng to be nào ở thì hiện tại?","question":"Đại từ ''I'' (tôi) luôn kết hợp với dạng to be nào ở thì hiện tại?","options":["am","are","is"]}', '{"accepted":["am"],"matchMode":"EXACT"}',
   '{"explanation":"Chính xác! Đại từ ''I'' luôn đi với ''am'': ''I am Linh.''"}', '{"hintAllowed":true,"hint":"I luôn đi cùng am."}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('23c865b2-9258-4600-ab3a-5015f60bcd20', '2ebf2df0-ec88-45d9-a02a-18c089c47e1a', 1)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('2ebf2df0-ec88-45d9-a02a-18c089c47e1a', '7fe1858d-d052-411c-a3e7-df797293ce1a', 'RECAP_BE_SELECTION', 'WRITTEN_RECOGNITION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('54815d8d-3b28-47b3-a404-c1461ef8a094', 'FAMILY.M1.W1.RECAP_CHECK', 'Spaced retrieval of indefinite article selection',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('a7fb3282-a2ef-4e37-a855-eed2df3532d8', '54815d8d-3b28-47b3-a404-c1461ef8a094', 'ITEM.M1.W1.D7.RECAP_ARTICLE')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('eea172d9-0b42-467a-af5c-a50df27e1a8e', 'a7fb3282-a2ef-4e37-a855-eed2df3532d8', 1, 'DRAFT', 'PRACTICE', 'NONE',
   'SINGLE_CHOICE', '{"text":"Trong câu: ''An is ___ IT engineer in Da Nang'', từ còn thiếu là:","question":"Trong câu: ''An is ___ IT engineer in Da Nang'', từ còn thiếu là:","options":["an","a","the"]}', '{"accepted":["an"],"matchMode":"EXACT"}',
   '{"explanation":"Từ ''IT engineer'' bắt đầu bằng nguyên âm, do đó bắt buộc dùng mạo từ ''an''."}', '{"hintAllowed":true,"hint":"Từ bắt đầu bằng nguyên âm (I, E, O, A, U) dùng ''an''."}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('23c865b2-9258-4600-ab3a-5015f60bcd20', 'eea172d9-0b42-467a-af5c-a50df27e1a8e', 2)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('eea172d9-0b42-467a-af5c-a50df27e1a8e', '7fe1858d-d052-411c-a3e7-df797293ce1a', 'RECAP_ARTICLE_SELECTION', 'WRITTEN_RECOGNITION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('54815d8d-3b28-47b3-a404-c1461ef8a094', 'FAMILY.M1.W1.RECAP_CHECK', 'Spaced retrieval of word stress rule',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('6d5b6710-087a-48b9-aead-23ae52d04c6f', '54815d8d-3b28-47b3-a404-c1461ef8a094', 'ITEM.M1.W1.D7.RECAP_STRESS')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('0967ec2e-1b75-4f8f-a6cd-8233cfd22cff', '6d5b6710-087a-48b9-aead-23ae52d04c6f', 1, 'DRAFT', 'PRACTICE', 'NONE',
   'SINGLE_CHOICE', '{"text":"Từ ''teacher'' (giáo viên) có trọng âm rơi vào âm tiết nào?","question":"Từ ''teacher'' (giáo viên) có trọng âm rơi vào âm tiết nào?","options":["Âm tiết 1: TEA-cher","Âm tiết 2: tea-CHER"]}', '{"accepted":["Âm tiết 1: TEA-cher"],"matchMode":"EXACT"}',
   '{"explanation":"Danh từ 2 âm tiết trong tiếng Anh đa số nhấn vào âm đầu: TEA-cher (/ˈtiː.tʃər/)."}', '{"hintAllowed":true,"hint":"Âm đầu đọc to và cao hơn âm sau."}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('23c865b2-9258-4600-ab3a-5015f60bcd20', '0967ec2e-1b75-4f8f-a6cd-8233cfd22cff', 3)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('0967ec2e-1b75-4f8f-a6cd-8233cfd22cff', '7fe1858d-d052-411c-a3e7-df797293ce1a', 'RECAP_STRESS_SELECTION', 'WRITTEN_RECOGNITION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('d526e462-00e1-4014-af25-07be08572a2a', 'bf2a87fa-34e1-47ce-ac36-b4629f01b445', 'ACT.M1.W1.D7.REST_OPTIONS', 'REFLECTION',
   'Quyền Nghỉ ngơi Không Phạt: Hôm nay Bạn Muốn Làm gì?', 3, '{"body":"Tại Lingora, nghỉ ngơi là một phần thiết yếu của quá trình củng cố trí nhớ dài hạn (memory consolidation). Bạn có 3 lựa chọn hoàn toàn bình đẳng:","opportunityType":"EXPOSURE","modality":"WRITTEN_RECOGNITION","reviewStatus":"DRAFT","options":[{"title":"1. Nghỉ ngơi hoàn toàn (Full Rest)","desc":"Tạm gác bài học sang một bên, tận hưởng một ngày nghỉ thư thái cùng gia đình và bạn bè. Chuỗi học tập và điểm số của bạn không bị trừ bất kỳ điểm nào (Skipped != Failed)."},{"title":"2. Nghe lại thư giãn (Relaxed Listening)","desc":"Mở lại các đoạn ghi âm giọng đọc của Linh, Mai hoặc Carlos để tai làm quen thụ động như nghe nhạc."},{"title":"3. Xem trước Tuần 2 (Sneak Peek Week 2)","desc":"Chuẩn bị tâm thế khám phá chủ đề ''Nhịp điệu Một Ngày của Bạn'' (Daily Routines, Habits, and Time)."}]}')
  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;

COMMIT;
