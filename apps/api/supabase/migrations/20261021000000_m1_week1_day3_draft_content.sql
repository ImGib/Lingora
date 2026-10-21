BEGIN;

-- Auto-generated DRAFT migration for Day 3: Tên và Chi tiết Chính trong Nghe & Đọc (Name and Key Details)
-- Strict Guardrail: Status is locked to DRAFT. Publication requires human review.

INSERT INTO lessons (id, unit_id, code, title, summary, position, status) VALUES
  ('0f7f8a2f-01c1-45f2-a461-3dd78804074e', '3b8e230d-60e9-4181-a185-101b92f711fc', 'LESSON.M1.W1.D3', 'Tên và Chi tiết Chính trong Nghe & Đọc (Name and Key Details)',
   'Phát triển năng lực nghe nhận diện chi tiết lần đầu, đánh vần tên riêng theo chuẩn IPA, làm chủ trọng âm từ và đọc quét thông tin từ thẻ hồ sơ cá nhân thực tế.', 3, 'DRAFT')
  ON CONFLICT (code) DO UPDATE SET title = EXCLUDED.title, summary = EXCLUDED.summary;
INSERT INTO competencies (id, code, title, description, status) VALUES
  ('41494136-4868-4278-a58a-ad2fe66686ce', 'M1.PERSONAL.LISTEN_DETAILS', 'Nghe hiểu chi tiết thông tin cá nhân',
   'Nắm bắt chính xác tên, quê quán, nghề nghiệp trong một đoạn độc thoại hoặc hội thoại giới thiệu tự nhiên.', 'ACTIVE')
  ON CONFLICT (code) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;
INSERT INTO lesson_competencies (lesson_id, competency_id, role, target_modality) VALUES
  ('0f7f8a2f-01c1-45f2-a461-3dd78804074e', '41494136-4868-4278-a58a-ad2fe66686ce', 'TARGET', 'AURAL_RECOGNITION')
  ON CONFLICT (lesson_id, competency_id) DO UPDATE SET role = EXCLUDED.role;
INSERT INTO competencies (id, code, title, description, status) VALUES
  ('7fe1858d-d052-411c-a3e7-df797293ce1a', 'M1.PERSONAL.READ_DETAILS', 'Đọc hiểu chi tiết thông tin cá nhân',
   'Đọc quét nhanh và xác định đúng tên, quốc gia, nghề nghiệp trên thẻ hồ sơ cá nhân định dạng thực tế.', 'ACTIVE')
  ON CONFLICT (code) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;
INSERT INTO lesson_competencies (lesson_id, competency_id, role, target_modality) VALUES
  ('0f7f8a2f-01c1-45f2-a461-3dd78804074e', '7fe1858d-d052-411c-a3e7-df797293ce1a', 'SUPPORTING', 'WRITTEN_RECOGNITION')
  ON CONFLICT (lesson_id, competency_id) DO UPDATE SET role = EXCLUDED.role;
INSERT INTO learning_packages (id, lesson_id, code) VALUES
  ('1ee1eec9-da6e-46a8-ac2f-e68895fbc4e5', '0f7f8a2f-01c1-45f2-a461-3dd78804074e', 'PACKAGE.M1.W1.D3')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_package_versions (id, learning_package_id, version, status, provenance) VALUES
  ('68027afc-7b27-4454-a25b-7957e3c4e36c', '1ee1eec9-da6e-46a8-ac2f-e68895fbc4e5', 1, 'DRAFT', 'AI_ASSISTED')
  ON CONFLICT (learning_package_id, version) DO UPDATE SET status = 'DRAFT';
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('ddd5cafa-1766-4e5f-a8a2-e290318198eb', '68027afc-7b27-4454-a25b-7957e3c4e36c', 'ACT.M1.W1.D3.SPELLING_ACOUSTIC', 'CONTROLLED_PRACTICE',
   'Bảng Ngữ Âm Chữ Cái IPA & Luyện Nghe Đánh Vần Tên (Acoustic Spelling & Stress)', 1, '{"instruction":"Nghe phát thanh viên đánh vần từng chữ cái trong tên riêng và gõ lại. Luyện tập có gợi ý.","opportunityType":"GUIDED_PRACTICE","modality":"AURAL_RECOGNITION","reviewStatus":"DRAFT","alphabetTip":"Các chữ cái hay bị nhầm lẫn trong phát âm: A /eɪ/ khác E /iː/; G /dʒiː/ khác J /dʒeɪ/; H phát âm là /eɪtʃ/.","pronunciationTip":"Trọng âm từ đóng vai trò quyết định để người bản xứ nhận ra từ: STU-dent (nhấn âm 1), TEA-cher (nhấn âm 1), nhưng engi-NEER (nhấn âm 3)."}')
  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('e8d4f787-e63b-4c53-a66b-875981ad5716', 'FAMILY.M1.W1.SPELL_GUIDED', 'Supported letter recognition and spelling of short names',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('70b7b4e7-5f58-408a-ae2e-fe286412bbd0', 'e8d4f787-e63b-4c53-a66b-875981ad5716', 'ITEM.M1.W1.D3.SPELL_TRAN')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('934dc355-147a-422b-ab5a-201714f00cdd', '70b7b4e7-5f58-408a-ae2e-fe286412bbd0', 1, 'DRAFT', 'PRACTICE', 'NONE',
   'SHORT_TEXT', '{"text":"Nghe và gõ lại tên: ___","question":"Nghe và gõ lại tên: ___","audio":"My name is Tran. T, R, A, N. Tran."}', '{"accepted":["tran","Tran"],"matchMode":"CASE_INSENSITIVE"}',
   '{"explanation":"Bốn chữ cái được đánh vần rõ ràng: T - R - A - N -> Tran."}', '{"hintAllowed":true,"hint":"Gồm 4 chữ cái, bắt đầu bằng chữ T."}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('ddd5cafa-1766-4e5f-a8a2-e290318198eb', '934dc355-147a-422b-ab5a-201714f00cdd', 1)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('934dc355-147a-422b-ab5a-201714f00cdd', '41494136-4868-4278-a58a-ad2fe66686ce', 'LISTEN_SPELLING_GUIDED', 'AURAL_RECOGNITION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('e8d4f787-e63b-4c53-a66b-875981ad5716', 'FAMILY.M1.W1.SPELL_GUIDED', 'Supported word stress recognition',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('a15c03a8-0a32-4f7a-a6dc-30dba144a8a8', 'e8d4f787-e63b-4c53-a66b-875981ad5716', 'ITEM.M1.W1.D3.STRESS_STUDENT')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('54941d26-eddb-42c8-a5db-a8e3adcb6d7f', 'a15c03a8-0a32-4f7a-a6dc-30dba144a8a8', 1, 'DRAFT', 'PRACTICE', 'NONE',
   'SINGLE_CHOICE', '{"text":"Từ ''student'' có trọng âm rơi vào âm tiết nào?","question":"Từ ''student'' có trọng âm rơi vào âm tiết nào?","options":["Âm tiết thứ nhất: STU-dent","Âm tiết thứ hai: stu-DENT"],"audio":"student. student."}', '{"accepted":["Âm tiết thứ nhất: STU-dent"],"matchMode":"EXACT"}',
   '{"explanation":"Trong tiếng Anh, danh từ 2 âm tiết thường nhấn âm đầu: STU-dent (/ˈstjuː.dənt/)."}', '{"hintAllowed":true,"hint":"Âm đầu được phát âm to và cao hơn âm sau."}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('ddd5cafa-1766-4e5f-a8a2-e290318198eb', '54941d26-eddb-42c8-a5db-a8e3adcb6d7f', 2)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('54941d26-eddb-42c8-a5db-a8e3adcb6d7f', '41494136-4868-4278-a58a-ad2fe66686ce', 'LISTEN_SPELLING_GUIDED', 'AURAL_RECOGNITION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('058bc026-51f2-47c2-a45a-222ba0829593', '68027afc-7b27-4454-a25b-7957e3c4e36c', 'ACT.M1.W1.D3.LISTEN_MAI', 'INDEPENDENT_CHECK',
   'Nghe Lời Giới thiệu của Mai ở Hải Phòng (First-Pass Listening)', 2, '{"instruction":"Hãy thử nghe lần đầu trước khi chọn đáp án. Nghe lại bao nhiêu lần tùy thích — hệ thống chỉ ghi nhận trung thực xem bạn có cần dùng hỗ trợ hay không.","opportunityType":"INDEPENDENT_EVIDENCE","modality":"AURAL_RECOGNITION","reviewStatus":"DRAFT","audioTranscript":"Good morning everyone! My name is Mai. I am twenty-five years old and I come from Hai Phong, a dynamic coastal city in northern Vietnam. I work as a nurse at the children''s hospital. Nice to meet all of you!"}')
  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('79b0f5f3-6d13-4724-aef1-080641acf5b7', 'FAMILY.M1.W1.LISTEN_INDEPENDENT', 'Independent identification of hometown/origin from spoken introduction',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('611a8144-a66a-443d-ab10-c47c481688b4', '79b0f5f3-6d13-4724-aef1-080641acf5b7', 'ITEM.M1.W1.D3.MAI_FROM')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('c0426305-5d9a-47f7-a53b-a8f3de916026', '611a8144-a66a-443d-ab10-c47c481688b4', 1, 'DRAFT', 'EVALUATION', 'INDEPENDENT',
   'SINGLE_CHOICE', '{"text":"Mai đến từ thành phố nào?","question":"Mai đến từ thành phố nào?","options":["Huế","Hải Phòng","Đà Nẵng"],"audio":"Good morning everyone! My name is Mai. I come from Hai Phong."}', '{"accepted":["Hải Phòng"],"matchMode":"EXACT"}',
   '{"explanation":"Mai nói rõ: ''I come from Hai Phong, a dynamic coastal city...''"}', '{"hintAllowed":false}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('058bc026-51f2-47c2-a45a-222ba0829593', 'c0426305-5d9a-47f7-a53b-a8f3de916026', 1)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('c0426305-5d9a-47f7-a53b-a8f3de916026', '41494136-4868-4278-a58a-ad2fe66686ce', 'LISTEN_HOMETOWN_INDEPENDENT', 'AURAL_RECOGNITION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('79b0f5f3-6d13-4724-aef1-080641acf5b7', 'FAMILY.M1.W1.LISTEN_INDEPENDENT', 'Independent identification of occupation from spoken introduction',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('9e2137df-a1cc-480c-a622-d05461c80dd3', '79b0f5f3-6d13-4724-aef1-080641acf5b7', 'ITEM.M1.W1.D3.MAI_JOB')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('c722a4dd-7fd9-4522-a1d8-c0796314f1ab', '9e2137df-a1cc-480c-a622-d05461c80dd3', 1, 'DRAFT', 'EVALUATION', 'INDEPENDENT',
   'SINGLE_CHOICE', '{"text":"Nghề nghiệp của Mai là gì?","question":"Nghề nghiệp của Mai là gì?","options":["Y tá (Nurse)","Sinh viên (Student)","Giáo viên (Teacher)"],"audio":"I work as a nurse at the children''s hospital."}', '{"accepted":["Y tá (Nurse)"],"matchMode":"EXACT"}',
   '{"explanation":"Mai chia sẻ: ''I work as a nurse at the children''s hospital'' (nurse = y tá)."}', '{"hintAllowed":false}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('058bc026-51f2-47c2-a45a-222ba0829593', 'c722a4dd-7fd9-4522-a1d8-c0796314f1ab', 2)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('c722a4dd-7fd9-4522-a1d8-c0796314f1ab', '41494136-4868-4278-a58a-ad2fe66686ce', 'LISTEN_JOB_INDEPENDENT', 'AURAL_RECOGNITION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('abd02ab2-157e-4d65-aed3-1e916bc6e039', '68027afc-7b27-4454-a25b-7957e3c4e36c', 'ACT.M1.W1.D3.READ_TOM', 'INDEPENDENT_CHECK',
   'Đọc Thẻ Hồ sơ Nghề nghiệp Quốc tế (Profile Card Reading)', 3, '{"instruction":"Đọc quét nhanh tấm thẻ đeo định danh quốc tế dưới đây và trả lời 2 câu hỏi.","opportunityType":"INDEPENDENT_EVIDENCE","modality":"WRITTEN_RECOGNITION","reviewStatus":"DRAFT","cardData":{"fullName":"Tom Baker","country":"Australia","occupation":"Chef (Head Chef)","organization":"Sydney Harbour Restaurant"}}')
  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('2bf0d5e0-a5b3-4548-a582-9cc9e6da70d3', 'FAMILY.M1.W1.READ_PROFILE_INDEPENDENT', 'Independent reading comprehension of formatted professional profile card',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('324591d1-3622-4bc6-a4d3-7899e35ad5d7', '2bf0d5e0-a5b3-4548-a582-9cc9e6da70d3', 'ITEM.M1.W1.D3.TOM_JOB')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('bf62b682-4aa0-43bd-a4b6-d250d2348799', '324591d1-3622-4bc6-a4d3-7899e35ad5d7', 1, 'DRAFT', 'EVALUATION', 'INDEPENDENT',
   'SINGLE_CHOICE', '{"text":"Nghề nghiệp của Tom Baker là gì?","question":"Nghề nghiệp của Tom Baker là gì?","options":["Đầu bếp (Chef)","Kỹ sư phần mềm (Engineer)","Y tá (Nurse)"],"context":"Name: Tom Baker | Country: Australia | Role: Head Chef | Place: Sydney Harbour Restaurant"}', '{"accepted":["Đầu bếp (Chef)"],"matchMode":"EXACT"}',
   '{"explanation":"Dòng Role/Occupation ghi: Head Chef (Bếp trưởng)."}', '{"hintAllowed":false}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('abd02ab2-157e-4d65-aed3-1e916bc6e039', 'bf62b682-4aa0-43bd-a4b6-d250d2348799', 1)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('bf62b682-4aa0-43bd-a4b6-d250d2348799', '41494136-4868-4278-a58a-ad2fe66686ce', 'READ_PROFILE_JOB', 'WRITTEN_RECOGNITION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('2bf0d5e0-a5b3-4548-a582-9cc9e6da70d3', 'FAMILY.M1.W1.READ_PROFILE_INDEPENDENT', 'Independent reading comprehension of formatted professional profile card',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('87437d72-f59e-4f24-ac75-0ebff41a79f5', '2bf0d5e0-a5b3-4548-a582-9cc9e6da70d3', 'ITEM.M1.W1.D3.TOM_COUNTRY')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('b65886c6-7360-49ca-a9f6-b6c4f15cd7df', '87437d72-f59e-4f24-ac75-0ebff41a79f5', 1, 'DRAFT', 'EVALUATION', 'INDEPENDENT',
   'SINGLE_CHOICE', '{"text":"Tom Baker đến từ quốc gia nào?","question":"Tom Baker đến từ quốc gia nào?","options":["Australia (Nước Úc)","United States (Nước Mỹ)","United Kingdom (Nước Anh)"],"context":"Name: Tom Baker | Country: Australia | Role: Head Chef | Place: Sydney Harbour Restaurant"}', '{"accepted":["Australia (Nước Úc)"],"matchMode":"EXACT"}',
   '{"explanation":"Dòng Country ghi: Australia (Nước Úc)."}', '{"hintAllowed":false}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('abd02ab2-157e-4d65-aed3-1e916bc6e039', 'b65886c6-7360-49ca-a9f6-b6c4f15cd7df', 2)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('b65886c6-7360-49ca-a9f6-b6c4f15cd7df', '41494136-4868-4278-a58a-ad2fe66686ce', 'READ_PROFILE_COUNTRY', 'WRITTEN_RECOGNITION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;

COMMIT;
