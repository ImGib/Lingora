BEGIN;

-- Auto-generated DRAFT migration for Day 2: Xây dựng Câu Giới thiệu với Mảnh ghép To Be (Build a Simple Introduction)
-- Strict Guardrail: Status is locked to DRAFT. Publication requires human review.

INSERT INTO lessons (id, unit_id, code, title, summary, position, status) VALUES
  ('3f0f6794-4a6c-4dbc-a054-210bcbfa47f8', '3b8e230d-60e9-4181-a185-101b92f711fc', 'LESSON.M1.W1.D2', 'Xây dựng Câu Giới thiệu với Mảnh ghép To Be (Build a Simple Introduction)',
   'Nắm vững quy tắc phối hợp Chủ ngữ và To Be (am, are, is) qua mô hình mảnh ghép Grammar Pieces, dạng viết tắt contractions, thể phủ định và phản biện lỗi sai ngữ pháp thường gặp.', 2, 'DRAFT')
  ON CONFLICT (code) DO UPDATE SET title = EXCLUDED.title, summary = EXCLUDED.summary;
INSERT INTO competencies (id, code, title, description, status) VALUES
  ('81512b32-233f-47b0-a4cf-363a03396fb8', 'M1.PERSONAL.USE_BE', 'Dùng to be cho thông tin cá nhân',
   'Lựa chọn và điền chính xác am, are, is với các đại từ nhân xưng I, you, he, she trong các câu thông tin cá nhân đời thường.', 'ACTIVE')
  ON CONFLICT (code) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;
INSERT INTO lesson_competencies (lesson_id, competency_id, role, target_modality) VALUES
  ('3f0f6794-4a6c-4dbc-a054-210bcbfa47f8', '81512b32-233f-47b0-a4cf-363a03396fb8', 'TARGET', 'WRITTEN_PRODUCTION')
  ON CONFLICT (lesson_id, competency_id) DO UPDATE SET role = EXCLUDED.role;
INSERT INTO learning_packages (id, lesson_id, code) VALUES
  ('41772208-5111-451d-a577-ecc8470692a9', '3f0f6794-4a6c-4dbc-a054-210bcbfa47f8', 'PACKAGE.M1.W1.D2')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_package_versions (id, learning_package_id, version, status, provenance) VALUES
  ('d0e74eef-b9e3-4be3-a7e3-c304c4facec5', '41772208-5111-451d-a577-ecc8470692a9', 1, 'DRAFT', 'AI_ASSISTED')
  ON CONFLICT (learning_package_id, version) DO UPDATE SET status = 'DRAFT';
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('c0602cf9-8ed7-4501-a35b-60af6f22cfa8', 'd0e74eef-b9e3-4be3-a7e3-c304c4facec5', 'ACT.M1.W1.D2.GRAMMAR_PIECES', 'INSTRUCTION',
   'Mô hình Mảnh Ghép Ngữ Pháp (Grammar Pieces: Subject + Verb + Complement)', 1, '{"body":"Một câu giới thiệu tiếng Anh chuẩn mực được tạo thành từ 3 khối ghép cơ bản: [Chủ ngữ] + [To Be] + [Bổ ngữ thông tin]. Động từ to be biến đổi nhịp nhàng theo chủ ngữ:","opportunityType":"EXPOSURE","modality":"WRITTEN_RECOGNITION","reviewStatus":"DRAFT","pieces":[{"subject":"I (Tôi)","be":"am (viết tắt: ''m)","complement":"Linh / a student / from Hue","example":"I am Linh. (I''m Linh.)"},{"subject":"You (Bạn)","be":"are (viết tắt: ''re)","complement":"my friend / from Da Nang","example":"You are my friend. (You''re my friend.)"},{"subject":"He / She (Anh ấy / Cô ấy)","be":"is (viết tắt: ''s)","complement":"An / a nurse / a teacher","example":"She is a nurse. (She''s a nurse.)"}],"contractions":[{"full":"I am","short":"I''m","ipa":"/aɪm/","example":"I''m Linh."},{"full":"You are","short":"You''re","ipa":"/jʊər/","example":"You''re from Hue."},{"full":"He is","short":"He''s","ipa":"/hiːz/","example":"He''s an engineer."},{"full":"She is","short":"She''s","ipa":"/ʃiːz/","example":"She''s a nurse."}],"negatives":[{"rule":"Thêm ''not'' ngay sau to be: [Subject] + [Be] + not + [Complement]","example":"I am not a student. I am a teacher."},{"rule":"Dạng phủ định rút gọn: isn''t (= is not), aren''t (= are not)","example":"He isn''t from Hanoi. They aren''t late."}],"grammarTip":"Hãy ghi nhớ mẹo nhẩm nhanh: I đi với am; He/She/Tên một người đi với is; You/We/They/Nhiều người đi với are."}')
  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('61c7cd8c-a6ed-45b0-aa18-e8573211379f', 'd0e74eef-b9e3-4be3-a7e3-c304c4facec5', 'ACT.M1.W1.D2.GUIDED_PRACTICE', 'CONTROLLED_PRACTICE',
   'Luyện tập Có Hướng dẫn (Guided Form Practice)', 2, '{"instruction":"Điền dạng đúng của to be (am, are hoặc is). Bạn có thể bấm xem gợi ý nếu chưa chắc chắn. Đây là bài luyện tập tạo cảm giác ngôn ngữ, không chấm điểm phạt.","opportunityType":"GUIDED_PRACTICE","modality":"WRITTEN_PRODUCTION","reviewStatus":"DRAFT"}')
  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('b7eac49e-f6ef-4c42-a35f-7d429b47f2f5', 'FAMILY.M1.BE.GUIDED_PERSONAL', 'Supported selection of be forms in familiar personal facts',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('ffcdff59-e0f3-412e-abe5-7c0d04d4af7b', 'b7eac49e-f6ef-4c42-a35f-7d429b47f2f5', 'ITEM.M1.BE.GUIDED.I_LINH')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('9a083c29-f4dd-4ca4-a8a2-595b1f38d7fa', 'ffcdff59-e0f3-412e-abe5-7c0d04d4af7b', 1, 'DRAFT', 'PRACTICE', 'NONE',
   'SHORT_TEXT', '{"text":"Hello! I ___ Linh and I ___ a university student."}', '{"accepted":["am"],"matchMode":"CASE_INSENSITIVE"}',
   '{"explanation":"Chủ ngữ là đại từ ngôi thứ nhất ''I'', luôn đi với ''am'': ''I am Linh and I am a university student.''"}', '{"hintAllowed":true,"hint":"Đại từ ''I'' (tôi) luôn kết hợp với ''am''."}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('61c7cd8c-a6ed-45b0-aa18-e8573211379f', '9a083c29-f4dd-4ca4-a8a2-595b1f38d7fa', 1)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('9a083c29-f4dd-4ca4-a8a2-595b1f38d7fa', '81512b32-233f-47b0-a4cf-363a03396fb8', 'GUIDED_BE_PERSONAL_FACT', 'WRITTEN_PRODUCTION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('b7eac49e-f6ef-4c42-a35f-7d429b47f2f5', 'FAMILY.M1.BE.GUIDED_PERSONAL', 'Supported selection of be forms in familiar personal facts',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('e494af98-91dd-42a9-a2db-1a6f4b45fc00', 'b7eac49e-f6ef-4c42-a35f-7d429b47f2f5', 'ITEM.M1.BE.GUIDED.YOU_FRIEND')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('00363fd4-39ed-4d87-a33f-ae43b882231a', 'e494af98-91dd-42a9-a2db-1a6f4b45fc00', 1, 'DRAFT', 'PRACTICE', 'NONE',
   'SHORT_TEXT', '{"text":"You ___ from Hue, right?"}', '{"accepted":["are"],"matchMode":"CASE_INSENSITIVE"}',
   '{"explanation":"Chủ ngữ ''You'' luôn kết hợp với động từ to be ''are'': ''You are from Hue, right?''"}', '{"hintAllowed":true,"hint":"Đại từ ''You'' luôn đi cùng ''are''."}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('61c7cd8c-a6ed-45b0-aa18-e8573211379f', '00363fd4-39ed-4d87-a33f-ae43b882231a', 2)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('00363fd4-39ed-4d87-a33f-ae43b882231a', '81512b32-233f-47b0-a4cf-363a03396fb8', 'GUIDED_BE_PERSONAL_FACT', 'WRITTEN_PRODUCTION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('b7eac49e-f6ef-4c42-a35f-7d429b47f2f5', 'FAMILY.M1.BE.GUIDED_PERSONAL', 'Supported selection of be forms in familiar personal facts',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('7834524e-c051-4793-a972-3a7afbc8ddf7', 'b7eac49e-f6ef-4c42-a35f-7d429b47f2f5', 'ITEM.M1.BE.GUIDED.SHE_NURSE')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('f6d33f4f-1a5a-40e9-aa6d-5265fc4608bd', '7834524e-c051-4793-a972-3a7afbc8ddf7', 1, 'DRAFT', 'PRACTICE', 'NONE',
   'SHORT_TEXT', '{"text":"Mai ___ a kind nurse at the city hospital."}', '{"accepted":["is"],"matchMode":"CASE_INSENSITIVE"}',
   '{"explanation":"''Mai'' là danh từ riêng số ít chỉ một người (tương đương she), đi với ''is'': ''Mai is a kind nurse.''"}', '{"hintAllowed":true,"hint":"Tên riêng số ít của một người tương đương với he/she, đi với ''is''."}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('61c7cd8c-a6ed-45b0-aa18-e8573211379f', 'f6d33f4f-1a5a-40e9-aa6d-5265fc4608bd', 3)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('f6d33f4f-1a5a-40e9-aa6d-5265fc4608bd', '81512b32-233f-47b0-a4cf-363a03396fb8', 'GUIDED_BE_PERSONAL_FACT', 'WRITTEN_PRODUCTION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('b7eac49e-f6ef-4c42-a35f-7d429b47f2f5', 'FAMILY.M1.BE.GUIDED_PERSONAL', 'Supported selection of be forms in familiar personal facts',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('1325f509-4881-432f-a7dd-ac22138a48bb', 'b7eac49e-f6ef-4c42-a35f-7d429b47f2f5', 'ITEM.M1.BE.GUIDED.HE_ENGINEER')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('d1f17116-e8d8-4931-a8cc-3120bc382015', '1325f509-4881-432f-a7dd-ac22138a48bb', 1, 'DRAFT', 'PRACTICE', 'NONE',
   'SHORT_TEXT', '{"text":"An ___ an IT engineer in Da Nang."}', '{"accepted":["is"],"matchMode":"CASE_INSENSITIVE"}',
   '{"explanation":"''An'' là danh từ riêng một người (tương đương he), đi với ''is'': ''An is an IT engineer.''"}', '{"hintAllowed":true,"hint":"An là ngôi thứ ba số ít, đi với ''is''."}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('61c7cd8c-a6ed-45b0-aa18-e8573211379f', 'd1f17116-e8d8-4931-a8cc-3120bc382015', 4)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('d1f17116-e8d8-4931-a8cc-3120bc382015', '81512b32-233f-47b0-a4cf-363a03396fb8', 'GUIDED_BE_PERSONAL_FACT', 'WRITTEN_PRODUCTION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('366af4d7-d9f8-4bdc-a2d4-a381894d44fa', 'd0e74eef-b9e3-4be3-a7e3-c304c4facec5', 'ACT.M1.W1.D2.SPOT_ERROR', 'CONTROLLED_PRACTICE',
   'Thử thách Phản biện Bắt Lỗi Sai (Spot the Error Challenge)', 3, '{"instruction":"Đóng vai người phản biện: Tìm và chọn phương án sửa lỗi chính xác cho câu sai.","opportunityType":"GUIDED_PRACTICE","modality":"WRITTEN_PRODUCTION","reviewStatus":"DRAFT"}')
  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('b7eac49e-f6ef-4c42-a35f-7d429b47f2f5', 'FAMILY.M1.BE.GUIDED_PERSONAL', 'Supported selection of be forms in familiar personal facts',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('189670ec-0765-4cc8-ad47-967d876f9688', 'b7eac49e-f6ef-4c42-a35f-7d429b47f2f5', 'ITEM.M1.BE.GUIDED.ERROR_HE_ARE')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('67e353b0-e490-4148-ade9-ccf7fb53c905', '189670ec-0765-4cc8-ad47-967d876f9688', 1, 'DRAFT', 'PRACTICE', 'NONE',
   'SHORT_TEXT', '{"text":"Câu sai: ''He are from Hanoi.'' -> Viết lại dạng đúng của từ ''are'':"}', '{"accepted":["is"],"matchMode":"CASE_INSENSITIVE"}',
   '{"explanation":"Chủ ngữ ''He'' là ngôi thứ 3 số ít, không thể dùng ''are''. Dạng đúng là: ''He is from Hanoi.''"}', '{"hintAllowed":true,"hint":"Chuyển ''are'' thành dạng to be đi với ''He''."}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('366af4d7-d9f8-4bdc-a2d4-a381894d44fa', '67e353b0-e490-4148-ade9-ccf7fb53c905', 1)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('67e353b0-e490-4148-ade9-ccf7fb53c905', '81512b32-233f-47b0-a4cf-363a03396fb8', 'GUIDED_BE_PERSONAL_FACT', 'WRITTEN_PRODUCTION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('b7eac49e-f6ef-4c42-a35f-7d429b47f2f5', 'FAMILY.M1.BE.GUIDED_PERSONAL', 'Supported selection of be forms in familiar personal facts',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('2019fdd2-e63e-412c-ace7-5890415a3934', 'b7eac49e-f6ef-4c42-a35f-7d429b47f2f5', 'ITEM.M1.BE.GUIDED.ERROR_I_IS')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('61562e7d-dce5-4eea-a51a-e32e0da17860', '2019fdd2-e63e-412c-ace7-5890415a3934', 1, 'DRAFT', 'PRACTICE', 'NONE',
   'SHORT_TEXT', '{"text":"Câu sai: ''I is a university student.'' -> Viết lại dạng đúng của từ ''is'':"}', '{"accepted":["am"],"matchMode":"CASE_INSENSITIVE"}',
   '{"explanation":"Đại từ ''I'' luôn kết hợp với ''am''. Dạng đúng: ''I am a university student.''"}', '{"hintAllowed":true,"hint":"Chủ ngữ I luôn đi với am."}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('366af4d7-d9f8-4bdc-a2d4-a381894d44fa', '61562e7d-dce5-4eea-a51a-e32e0da17860', 2)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('61562e7d-dce5-4eea-a51a-e32e0da17860', '81512b32-233f-47b0-a4cf-363a03396fb8', 'GUIDED_BE_PERSONAL_FACT', 'WRITTEN_PRODUCTION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('d3084162-ace5-4bb7-a4d2-3e63f688a859', 'd0e74eef-b9e3-4be3-a7e3-c304c4facec5', 'ACT.M1.W1.D2.PHONETICS_NOTE', 'REFLECTION',
   'Ngữ âm IPA & Hiện tượng Nối âm Tự nhiên (Pronunciation & Linking)', 4, '{"body":"Đọc to 3 câu hoàn chỉnh: 1. I am Linh (/aɪ æm lɪŋ/) -> I''m Linh (/aɪm lɪŋ/). 2. You are my friend (/juː ɑːr maɪ frend/) -> You''re my friend (/jʊər maɪ frend/). 3. She is a nurse (/ʃiː ɪz ə nɜːs/) -> Nối âm: /ʃiː ɪ-zə nɜːs/. Chú ý âm cuối /z/ trong từ ''is'' rung nhẹ ở cổ họng và nối mượt sang mạo từ ''a''.","opportunityType":"EXPOSURE","modality":"WRITTEN_RECOGNITION","reviewStatus":"DRAFT"}')
  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;

COMMIT;
