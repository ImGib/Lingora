BEGIN;

-- Auto-generated DRAFT migration for Day 1: Gặp gỡ Lời Giới thiệu Bản thân Đầu tiên (Meet a Simple Introduction)
-- Strict Guardrail: Status is locked to DRAFT. Publication requires human review.

INSERT INTO lessons (id, unit_id, code, title, summary, position, status) VALUES
  ('b152af0b-6799-4ca1-a786-a8abcc20cb30', '3b8e230d-60e9-4181-a185-101b92f711fc', 'LESSON.M1.W1.D1', 'Gặp gỡ Lời Giới thiệu Bản thân Đầu tiên (Meet a Simple Introduction)',
   'Tiếp xúc tự nhiên với đoạn giới thiệu bản thân đời thường, bóc tách 4 trụ cột thông tin, luyện phát âm chuẩn âm đuôi và nắm vững vốn từ vựng nền tảng.', 1, 'DRAFT')
  ON CONFLICT (code) DO UPDATE SET title = EXCLUDED.title, summary = EXCLUDED.summary;
INSERT INTO competencies (id, code, title, description, status) VALUES
  ('7fe1858d-d052-411c-a3e7-df797293ce1a', 'M1.PERSONAL.READ_DETAILS', 'Đọc hiểu chi tiết thông tin cá nhân',
   'Nhận diện và nắm bắt thông tin rõ ràng về tên, quê quán, nghề nghiệp trong một đoạn giới thiệu ngắn.', 'ACTIVE')
  ON CONFLICT (code) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;
INSERT INTO lesson_competencies (lesson_id, competency_id, role, target_modality) VALUES
  ('b152af0b-6799-4ca1-a786-a8abcc20cb30', '7fe1858d-d052-411c-a3e7-df797293ce1a', 'TARGET', 'WRITTEN_RECOGNITION')
  ON CONFLICT (lesson_id, competency_id) DO UPDATE SET role = EXCLUDED.role;
INSERT INTO learning_packages (id, lesson_id, code) VALUES
  ('38b3b7bd-89ab-4dea-ad44-093fd24754f5', 'b152af0b-6799-4ca1-a786-a8abcc20cb30', 'PACKAGE.M1.W1.D1')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_package_versions (id, learning_package_id, version, status, provenance) VALUES
  ('5e74ebe5-489c-45a9-ac30-2dcf23ef5d3a', '38b3b7bd-89ab-4dea-ad44-093fd24754f5', 1, 'DRAFT', 'AI_ASSISTED')
  ON CONFLICT (learning_package_id, version) DO UPDATE SET status = 'DRAFT';
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('c1f105c8-adfb-40f0-aef6-dbdef589c227', '5e74ebe5-489c-45a9-ac30-2dcf23ef5d3a', 'ACT.M1.W1.D1.MEET_LINH_DIALOGUE', 'INSTRUCTION',
   'Gặp gỡ Linh ở Cố đô Huế & Hội thoại Làm quen Đời thường', 1, '{"body":"Chào mừng bạn đến với ngày đầu tiên trên hành trình học tiếng Anh cùng Lingora! Hãy cùng lắng nghe và quan sát một cuộc gặp gỡ thân thiện tại quán cà phê ven sông Hương ở Cố đô Huế giữa bạn Linh (sinh viên đại học kiêm barista) và David (du khách đến từ nước Úc).","opportunityType":"EXPOSURE","modality":"WRITTEN_RECOGNITION","reviewStatus":"DRAFT","storyContext":"Một buổi sáng mùa thu tại quán cà phê Perfume River. David bước vào và Linh nở nụ cười chào đón.","dialogue":[{"speaker":"Linh","role":"Sinh viên & Barista","avatar":"👩‍🎓","en":"Good morning! Welcome to Perfume River Cafe. My name is Linh.","vi":"Chào buổi sáng! Chào mừng bạn đến với Quán cà phê Sông Hương. Mình tên là Linh.","ipa":"/ɡʊd ˈmɔː.nɪŋ! ˈwel.kəm tuː ˈpɜː.fjuːm ˈrɪv.ər kæˈfeɪ. maɪ neɪm ɪz lɪnh/"},{"speaker":"David","role":"Du khách từ Úc","avatar":"🧑‍🦱","en":"Good morning! Nice to meet you, Linh. I''m David, a traveler from Australia.","vi":"Chào buổi sáng! Rất vui được gặp bạn, Linh. Tôi là David, một du khách đến từ nước Úc.","ipa":"/ɡʊd ˈmɔː.nɪŋ! naɪs tuː miːt juː, lɪnh. aɪm ˈdeɪ.vɪd, ə ˈtræv.əl.ər frɒm ɒsˈtreɪ.li.ə/"},{"speaker":"Linh","role":"Sinh viên & Barista","avatar":"👩‍🎓","en":"Nice to meet you too, David! Are you on vacation in Hue?","vi":"Rất vui được gặp bạn, David! Bạn đang đi du lịch ở Huế phải không?","ipa":"/naɪs tuː miːt juː tuː, ˈdeɪ.vɪd! ɑːr juː ɒn vəˈkeɪ.ʃən ɪn hweɪ?/"},{"speaker":"David","role":"Du khách từ Úc","avatar":"🧑‍🦱","en":"Yes, I am. Your city is beautiful and peaceful. I love it here!","vi":"Đúng vậy. Thành phố của bạn thật đẹp và thanh bình. Tôi rất thích nơi này!","ipa":"/jes, aɪ æm. jɔːr ˈsɪt.i ɪz ˈbjuː.tɪ.fəl ænd ˈpiːs.fəl. aɪ lʌv ɪt hɪər!/"}],"culturalNote":"Ở môi trường quốc tế, câu ''Nice to meet you'' luôn được nói kèm theo nụ cười ấm áp và giao tiếp bằng ánh mắt (eye contact). Khi người khác nói ''Nice to meet you'', câu đáp lại chuẩn mực và lịch thiệp nhất là ''Nice to meet you too!''."}')
  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('cc395b6a-0bad-476f-a325-2f885df9582b', '5e74ebe5-489c-45a9-ac30-2dcf23ef5d3a', 'ACT.M1.W1.D1.PILLARS_FRAMEWORK', 'INSTRUCTION',
   'Bóc tách 4 Trụ cột Thông tin Cá nhân (The 4 Pillars Framework)', 2, '{"body":"Bất kỳ lời giới thiệu bản thân nào trong tiếng Anh — từ cuộc gặp gỡ bạn bè đến phỏng vấn hay giao lưu quốc tế — đều được xây dựng dựa trên 4 trụ cột cốt lõi sau:","opportunityType":"EXPOSURE","modality":"WRITTEN_RECOGNITION","reviewStatus":"DRAFT","pillars":[{"number":1,"type":"Lời chào (Greeting)","formal":"Hello / Good morning / Good afternoon","casual":"Hi / Hi there / Hey","tip":"Mở đầu lịch thiệp tạo thiện cảm ngay từ giây đầu tiên."},{"number":2,"type":"Tên & Danh tính (Name)","formal":"My name is Linh.","casual":"I''m Linh.","tip":"Trong giao tiếp quốc tế, nói rõ tên mình và lắng nghe tên người đối diện."},{"number":3,"type":"Quê quán & Xuất xứ (Hometown / Origin)","formal":"I am from Hue, Vietnam.","casual":"I come from Hue.","tip":"Cung cấp thành phố hoặc quốc gia giúp mở ra chủ đề trò chuyện thú vị."},{"number":4,"type":"Nghề nghiệp & Vai trò (Role / Occupation)","formal":"I am a university student.","casual":"I work in IT / I''m an engineer.","tip":"Nhớ dùng mạo từ ''a'' hoặc ''an'' trước danh từ số ít chỉ nghề nghiệp."}],"contrastSection":{"title":"So sánh 2 phong cách giới thiệu","linhExample":"Linh (Trang trọng, lịch thiệp): ''Hello! My name is Linh. I am from Hue. I am a student.''","anExample":"An (Thân mật, bạn bè): ''Hi there! I''m An. I''m from Da Nang. I''m an IT engineer.''"}}')
  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('64cc0c2e-ee07-4918-a13b-f0105b479b4f', '5e74ebe5-489c-45a9-ac30-2dcf23ef5d3a', 'ACT.M1.W1.D1.VOCAB_MASTERCLASS', 'INSTRUCTION',
   'Kho Từ vựng & Ngữ âm Cốt lõi (Vocabulary Bank with IPA)', 3, '{"body":"10 từ vựng và cụm từ căn bản nhất cho ngày đầu tiên. Mỗi từ đều có phiên âm quốc tế (IPA), loại từ, nghĩa tiếng Việt và câu ví dụ thực tế:","opportunityType":"EXPOSURE","modality":"WRITTEN_RECOGNITION","reviewStatus":"DRAFT","vocabulary":[{"en":"hello","ipa":"/həˈləʊ/","pos":"interjection","vi":"xin chào (lịch sự, phổ biến nhất)","example":"Hello! Welcome to our team.","collocation":"Hello everyone / Hello there"},{"en":"hi","ipa":"/haɪ/","pos":"interjection","vi":"chào (thân mật, gần gũi)","example":"Hi, An! How are you?","collocation":"Hi there"},{"en":"name","ipa":"/neɪm/","pos":"noun","vi":"tên, danh tính","example":"My name is Linh.","collocation":"first name / full name"},{"en":"from","ipa":"/frɒm/","pos":"preposition","vi":"đến từ (nguồn gốc, quê quán)","example":"I am from Hue, Vietnam.","collocation":"be from / come from"},{"en":"student","ipa":"/ˈstjuː.dənt/","pos":"noun","vi":"học sinh, sinh viên (nhấn âm 1)","example":"Linh is a university student.","collocation":"university student / college student"},{"en":"teacher","ipa":"/ˈtiː.tʃər/","pos":"noun","vi":"giáo viên (nhấn âm 1)","example":"He is an English teacher.","collocation":"high school teacher"},{"en":"nurse","ipa":"/nɜːs/","pos":"noun","vi":"y tá, điều dưỡng (âm dài /ɜː/)","example":"Mai is a nurse at the hospital.","collocation":"hospital nurse"},{"en":"engineer","ipa":"/ˌen.dʒɪˈnɪər/","pos":"noun","vi":"kỹ sư (nhấn âm 3: -neer)","example":"An is an IT engineer.","collocation":"software engineer / civil engineer"},{"en":"meet","ipa":"/miːt/","pos":"verb","vi":"gặp gỡ, làm quen (âm /iː/ kéo dài)","example":"Nice to meet you, David.","collocation":"meet someone for the first time"},{"en":"welcome","ipa":"/ˈwel.kəm/","pos":"verb / interjection","vi":"chào đón, hoan nghênh (nhấn âm 1)","example":"Welcome to Vietnam!","collocation":"warm welcome / welcome to"}]}')
  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('02b204eb-e96e-42b3-aa46-30bd1842b765', '5e74ebe5-489c-45a9-ac30-2dcf23ef5d3a', 'ACT.M1.W1.D1.PRONUNCIATION_TRAPS', 'INSTRUCTION',
   'Bí quyết Ngữ âm & Cảnh báo Bẫy Tiếng Mẹ Đẻ (Pronunciation & L1 Traps)', 4, '{"body":"Người học tiếng Anh tại Việt Nam thường gặp 3 rào cản ngữ âm và thói quen ngôn ngữ kinh điển. Hiểu rõ những điều này sẽ giúp bạn nói tự tin và chuẩn xác hơn rất nhiều:","opportunityType":"EXPOSURE","modality":"WRITTEN_RECOGNITION","reviewStatus":"DRAFT","traps":[{"title":"Bẫy 1: Quên mạo từ ''a / an'' trước danh từ nghề nghiệp số ít","viIssue":"Tiếng Việt nói: ''Tôi là sinh viên'' (không có mạo từ). Do đó, người học thường nói nhầm: ''I am student'' ❌.","fix":"Trong tiếng Anh, danh từ đếm được số ít chỉ nghề nghiệp BẮT BUỘC phải có mạo từ: ''I am a student'' ✅ hoặc ''I am an engineer'' ✅ (dùng ''an'' khi từ bắt đầu bằng nguyên âm E, U, I, O, A).","status":"CRITICAL"},{"title":"Bẫy 2: ''Nuốt âm đuôi'' (Dropping Ending Sounds)","viIssue":"Tiếng Việt là ngôn ngữ đơn âm tiết, từ kết thúc bằng nguyên âm hoặc phụ âm khép. Người Việt thường quên phát âm âm gió hoặc âm bật ở cuối từ tiếng Anh.","fix":"Hãy chú ý phát âm rõ ràng: ''name'' /neɪm/ (khép môi âm /m/), ''is'' /ɪz/ (rung nhẹ âm /z/), ''meet'' /miːt/ (bật nhẹ đầu lưỡi âm /t/).","status":"PHONETIC"},{"title":"Bẫy 3: Đọc sai trọng âm từ (Word Stress)","viIssue":"Đọc đều đều các âm tiết như tiếng Việt khiến người bản xứ khó nhận diện từ.","fix":"Ghi nhớ quy tắc đòn bẩy: Âm có trọng âm đọc to hơn, cao hơn và dài hơn một chút: ''STU-dent'' (nhấn âm 1), ''TEA-cher'' (nhấn âm 1), nhưng ''engi-NEER'' (nhấn mạnh vào âm 3: -neer).","status":"RHYTHM"}]}')
  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('5de2d5d2-551f-42b7-a3ca-43635c33c136', '5e74ebe5-489c-45a9-ac30-2dcf23ef5d3a', 'ACT.M1.W1.D1.CHECK_UNDERSTANDING', 'CONTROLLED_PRACTICE',
   'Kiểm tra Nhanh Sự Thấu hiểu (Interactive Comprehension Check)', 5, '{"instruction":"Hãy trả lời 3 câu hỏi kiểm tra nhanh dưới đây để củng cố kiến thức đã học. Bài kiểm tra có gợi ý và không chấm điểm phạt.","opportunityType":"GUIDED_PRACTICE","modality":"WRITTEN_RECOGNITION","reviewStatus":"DRAFT"}')
  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('a840a59d-5486-418c-a919-5a11b3e8ac6e', 'FAMILY.M1.W1.D1.CHECK_PILLARS', 'Guided identification of personal facts from dialogue exposure',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('c00ccc21-c7a2-48c7-a1de-7d38d3689881', 'a840a59d-5486-418c-a919-5a11b3e8ac6e', 'ITEM.M1.W1.D1.CHECK_HOMETOWN')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('59d4526b-1ec9-45c0-af9e-afc08daccae0', 'c00ccc21-c7a2-48c7-a1de-7d38d3689881', 1, 'DRAFT', 'PRACTICE', 'NONE',
   'SINGLE_CHOICE', '{"text":"Trong đoạn hội thoại mở đầu, Linh đến từ thành phố nào của Việt Nam?","options":["Hue (Thừa Thiên Huế)","Da Nang (Đà Nẵng)","Hanoi (Hà Nội)","Ho Chi Minh City (TP. Hồ Chí Minh)"]}', '{"accepted":["Hue (Thừa Thiên Huế)"],"matchMode":"CASE_INSENSITIVE"}',
   '{"explanation":"Chính xác! Linh sống và làm việc tại quán cà phê gần sông Hương ở Cố đô Huế: ''I am from Hue, Vietnam.''"}', '{"hintAllowed":true,"hint":"Quán cà phê nằm cạnh sông Hương (Perfume River)."}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('5de2d5d2-551f-42b7-a3ca-43635c33c136', '59d4526b-1ec9-45c0-af9e-afc08daccae0', 1)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('59d4526b-1ec9-45c0-af9e-afc08daccae0', '7fe1858d-d052-411c-a3e7-df797293ce1a', 'GUIDED_PILLARS_IDENTIFICATION', 'WRITTEN_RECOGNITION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('a840a59d-5486-418c-a919-5a11b3e8ac6e', 'FAMILY.M1.W1.D1.CHECK_PILLARS', 'Guided identification of personal facts from dialogue exposure',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('bfcfad3c-b2ef-4fde-a73d-953aedddca3a', 'a840a59d-5486-418c-a919-5a11b3e8ac6e', 'ITEM.M1.W1.D1.CHECK_MISSING_PILLAR')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('80a90587-4bab-4c7f-ac29-5b88d79513ec', 'bfcfad3c-b2ef-4fde-a73d-953aedddca3a', 1, 'DRAFT', 'PRACTICE', 'NONE',
   'SINGLE_CHOICE', '{"text":"Quan sát câu giới thiệu sau: ''Hello! I am Linh. I am a student.'' Trong 4 trụ cột thông tin cá nhân, trụ cột nào đang bị thiếu?","options":["Quê quán / Xuất xứ (Hometown / Origin)","Lời chào (Greeting)","Tên gọi (Name)","Nghề nghiệp / Vai trò (Role)"]}', '{"accepted":["Quê quán / Xuất xứ (Hometown / Origin)"],"matchMode":"CASE_INSENSITIVE"}',
   '{"explanation":"Rất chuẩn! Câu trên đã có Lời chào (''Hello''), Tên (''I am Linh'') và Nghề nghiệp (''I am a student''), nhưng chưa nói nơi đến (ví dụ ''I am from Hue'')."}', '{"hintAllowed":true,"hint":"Câu giới thiệu này chưa nhắc tới quê quán hay thành phố nơi Linh sinh sống."}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('5de2d5d2-551f-42b7-a3ca-43635c33c136', '80a90587-4bab-4c7f-ac29-5b88d79513ec', 2)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('80a90587-4bab-4c7f-ac29-5b88d79513ec', '7fe1858d-d052-411c-a3e7-df797293ce1a', 'GUIDED_PILLARS_IDENTIFICATION', 'WRITTEN_RECOGNITION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO item_families (id, code, construct, exposure_policy) VALUES
  ('a840a59d-5486-418c-a919-5a11b3e8ac6e', 'FAMILY.M1.W1.D1.CHECK_PILLARS', 'Guided identification of personal facts from dialogue exposure',
   '{"strongEvidenceRepeatLimit":0}')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_items (id, item_family_id, code) VALUES
  ('c38126b6-54c9-4ced-a2ca-a8541d937bba', 'a840a59d-5486-418c-a919-5a11b3e8ac6e', 'ITEM.M1.W1.D1.CHECK_ARTICLE_TRAP')
  ON CONFLICT (code) DO NOTHING;
INSERT INTO learning_item_versions
  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,
   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES
  ('e3862e03-8e83-455e-a434-b78c83c7837a', 'c38126b6-54c9-4ced-a2ca-a8541d937bba', 1, 'DRAFT', 'PRACTICE', 'NONE',
   'SINGLE_CHOICE', '{"text":"Chọn câu giới thiệu nghề nghiệp đúng ngữ pháp và không mắc bẫy tiếng mẹ đẻ:","options":["I am a university student.","I am university student.","I a student.","I is student."]}', '{"accepted":["I am a university student."],"matchMode":"CASE_INSENSITIVE"}',
   '{"explanation":"Tuyệt vời! Danh từ số ít chỉ nghề nghiệp ''university student'' bắt buộc phải có mạo từ ''a'' đi trước, và chủ ngữ ''I'' đi với động từ to be ''am''."}', '{"hintAllowed":true,"hint":"Tiếng Anh luôn cần mạo từ ''a'' hoặc ''an'' trước danh từ số ít chỉ nghề nghiệp."}', 'AI_ASSISTED')
  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;
INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES
  ('5de2d5d2-551f-42b7-a3ca-43635c33c136', 'e3862e03-8e83-455e-a434-b78c83c7837a', 3)
  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;
INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES
  ('e3862e03-8e83-455e-a434-b78c83c7837a', '7fe1858d-d052-411c-a3e7-df797293ce1a', 'GUIDED_PILLARS_IDENTIFICATION', 'WRITTEN_RECOGNITION')
  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;
INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES
  ('6d6661e8-8de4-46f9-abb0-22b3f909b591', '5e74ebe5-489c-45a9-ac30-2dcf23ef5d3a', 'ACT.M1.W1.D1.REFLECTION_SUMMARY', 'REFLECTION',
   'Suy ngẫm & Sẵn sàng cho Ngày 2 (Learner Reflection)', 6, '{"body":"Chúc mừng bạn đã hoàn thành ngày học đầu tiên! Hôm nay, bạn đã tiếp xúc với câu chuyện của Linh, hiểu rõ 4 trụ cột giới thiệu, học 10 từ vựng cốt lõi và nắm được 3 bẫy phát âm thường gặp. Hãy thử tự nhẩm trong đầu 4 thông tin của chính mình. Ngày mai (Ngày 2), chúng ta sẽ cùng ghép từng mảnh ngữ pháp ''To Be'' để bạn có thể tự tin tự viết và nói những câu này một cách chuẩn xác!","opportunityType":"EXPOSURE","modality":"WRITTEN_RECOGNITION","reviewStatus":"DRAFT"}')
  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;

COMMIT;
