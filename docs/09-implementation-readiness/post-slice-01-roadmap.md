# Lộ trình sau Slice 01F

**Trạng thái:** KẾ HOẠCH TRIỂN KHAI — chưa phải bằng chứng các slice đã hoàn thành.

**Điểm bắt đầu:** Slice 01F còn hai gate live; Vercel Preview chưa được triển khai.

Tài liệu này cụ thể hóa thứ tự đã chốt trong [Slice 01](slice-01-present-simple.md): `02 Vocabulary + review/retention` → `03 Listening + audio + replay/transcript support`. Sau 03, ưu tiên chiều sâu nội dung và kiểm chứng với người học thật trước khi mở thêm năng lực kiến trúc. Các bất biến trong [Learning Constitution](../02-learning-architecture/learning-constitution-v1.md), [Evidence Model](../02-learning-architecture/evidence-model.md) và [Content Authoring](../03-curriculum/content-authoring-publishing-v1.md) vẫn là nguồn chuẩn.

## 0. Đóng Slice 01F và kiểm chứng bản triển khai

**Việc làm:** Kiểm tra lại trên Clerk thật + Supabase thật tình huống gửi `submit` trùng/lặp sau timeout, thử lại cùng idempotency key, đăng nhập hai learner để xác nhận cách ly dữ liệu, và các lỗi xác thực không tạo attempt/evidence. Đối chiếu số bản ghi trước/sau để chắc chắn replay không nhân đôi observation, evidence, state hoặc plan completion; xóa fixture thử nghiệm. Ghi kết quả, commit trạng thái 01F hoàn tất chỉ khi toàn bộ gate qua.

**Bản triển khai:** Tạo Vercel Preview cho hai project `apps/api` và `apps/web` theo [hướng dẫn triển khai](../10-deployment-vercel.md); kiểm tra biến môi trường, migration preflight, CORS/Clerk, đường đi đăng nhập → goal → lesson → feedback → dashboard, refresh/resume và lỗi runtime. Đây là gate phát hành riêng: local/live Supabase thành công chưa chứng minh Preview hoạt động. Chỉ chuyển Production sau khi Preview và rollback path được kiểm chứng.

**Điều kiện ra:** Bảng kết quả từng gate 01F có bằng chứng và không có đường đi bắt buộc bị mock; Preview có URL và báo cáo E2E riêng. Nếu Preview chưa có, vẫn có thể thiết kế 02, nhưng không ghi 01F là fully deployed.

## 1. Slice 02 — Vocabulary + review/retention

Một gói nội dung S1 nhỏ, đã review, có lexeme-sense/chunk cụ thể và bài ôn sau một khoảng thời gian thực. Không đưa mọi từ xuất hiện trong bài vào lịch ôn. Chọn theo tần suất, giá trị cho mục tiêu và tiền đề học tập theo [Competency Model](../02-learning-architecture/competency-model.md). Bắt đầu bằng chính sách lịch ôn đơn giản, có phiên bản; điều chỉnh bằng dữ liệu thực, không tuyên bố một công thức là tối ưu.

| Chặng | Sản phẩm cần có | Gate kiểm chứng |
|---|---|---|
| 02A — Nội dung và hợp đồng | Một package từ vựng có nghĩa/ngữ cảnh rõ, câu mẫu, nhận diện, recall không gợi ý, feedback và item families khác nhau; mã claim/modality và phiên bản nội dung được chốt. | Tài liệu thiết kế + validator/fixture xác nhận nội dung learner-safe, đáp án không lộ, phiên bản bất biến và các cơ hội học/đánh giá được phân biệt. |
| 02B — Vòng học và ôn | API/UI học, lưu câu trả lời, gợi ý, submit, lịch ôn đến hạn và next action `REVIEW`; có thể tiếp tục sau reload/bỏ lỡ ngày. Theo dõi receptive và productive riêng khi bài thực sự đo được hai loại. | Một learner học → quay lại ở thời điểm đến hạn → recall → feedback → lịch/next action cập nhật; retry không tạo bản ghi kép, learner khác không thấy lịch ôn. |
| 02C — Evidence và retention | Observation ghi câu trả lời, ngữ cảnh, hỗ trợ, thời điểm; evidence gắn claim nhận diện/recall và khoảng cách thời gian. Projection phân biệt `UNVERIFIED`, `DUE`, `STALE`, `REFRESHED`, không suy ra `FORGOTTEN` từ một lỗi. | Test clock cố định cho đến hạn/quá hạn, dữ liệu lịch sử không bị sửa, hỗ trợ hạ mức độc lập, sai một lần không tự động xóa năng lực; kiểm chứng E2E sau ngày/giờ giả lập và một lần quay lại thật. |

**Giới hạn:** Không tạo SRS đại trà, gamification, điểm mastery giả, hay bảng lexeme/knowledge riêng chỉ vì mô hình lý thuyết có khái niệm đó. Thêm persistence chuyên biệt khi lịch ôn, trạng thái hoặc truy vấn thực sự cần; ghi migration và quyết định tương ứng. Việc ôn không được chiếm toàn bộ daily plan. Spacing và retrieval là hướng thiết kế có cơ sở nghiên cứu, nhưng khoảng cách/lịch cụ thể cần được kiểm chứng trong Lingora ([Cepeda et al., 2006](https://pubmed.ncbi.nlm.nih.gov/16719566/), [Mawson & Kang, 2025](https://pubmed.ncbi.nlm.nih.gov/40564553/)).

**Definition of Done 02:** Có đường đi web → API → PostgreSQL → evidence/state → next action chạy với người học thật; ít nhất một lần delayed recall có nguồn và thời điểm kiểm chứng; test domain, contract, integration, security, accessibility và E2E cho các tình huống trên đều qua.

## 2. Slice 03 — Listening + audio + replay/transcript

Dùng competency `LISTEN.EXPLICIT_TIME` và flow đã [VALIDATED](../03-curriculum/vertical-slices/listening.md). Audio, transcript và câu hỏi là đối tượng có phiên bản riêng. Mục tiêu đầu tiên là nhận biết thời gian tường minh trong audio ngắn; không dùng kết quả nghe để tuyên bố năng lực nói.

| Chặng | Sản phẩm cần có | Gate kiểm chứng |
|---|---|---|
| 03A — Asset và delivery | Một audio package S1 được review, metadata giọng/tốc độ/độ dài, transcript và câu hỏi tách phiên bản; kiểm tra file đọc được, thời lượng/âm lượng và căn chỉnh transcript. | Asset hỏng hoặc thiếu chặn `READY`; link audio có quyền truy cập đúng, không lộ đáp án/transcript trước mốc cho phép; attempt pin đúng phiên bản. |
| 03B — Trải nghiệm nghe | UI audio thân thiện bàn phím/thiết bị di động, trạng thái first listen, replay, pause, đổi tốc độ, segment, hint, transcript excerpt/full reveal; support event được lưu. | Refresh/resume giữ đúng trạng thái; lỗi mạng/playback có retry và không tính là learner failure; kiểm tra accessibility và trình duyệt thật. |
| 03C — Đánh giá và evidence | Trả lời trước/sau hỗ trợ được phân biệt; observation ghi first pass, số replay, transcript reveal, ngữ cảnh audio và điều kiện kỹ thuật. Feedback tập trung vào nghe hiểu; một item khác giọng/ngữ cảnh làm thử transfer, một lần sau đó làm delayed verification. | Success sau transcript không trở thành independent listening evidence; lỗi audio không tạo negative evidence; kiểm tra một flow E2E và cách ly learner/asset. |

**Definition of Done 03:** Learner nghe và trả lời trên browser thật, dùng replay/transcript có dấu vết, nhận feedback/next action đúng; first-pass, supported, transfer và delayed evidence giữ ý nghĩa riêng. Có kiểm tra quyền truy cập audio, phiên bản, vận hành và chi phí lưu trữ theo gate phát hành nội dung.

## 3. Mốc dừng sau 01–03 — chất lượng trước mở rộng

Đo với một nhóm người học nhỏ, có sự đồng ý phù hợp: tỷ lệ hoàn thành/resume, lỗi nội dung và thiết bị, mức dùng hint/replay, recall đến hạn, evidence đủ/thiếu theo claim, điểm rơi bỏ học, và next action có thể giải thích. Không lấy số attempt hay streak làm thước đo năng lực. Bổ sung công cụ Content Health tối thiểu để nhận báo lỗi, xem phiên bản bị ảnh hưởng, chặn/quarantine nội dung lỗi và xử lý evidence liên quan khi cần; làm sâu thêm nội dung S1 và accessibility. Chỉ thêm bảng, job hoặc service mới khi một nhu cầu thực tế được chứng minh bằng dữ liệu/gate thất bại và có ADR/migration.

**Điều kiện ra:** Báo cáo ngắn về người học thật, các lỗi quan trọng đã được xử lý, nội dung 01–03 đủ chất lượng để tiếp tục, cùng quyết định rõ ràng slice kế tiếp và nguyên nhân. Nếu chưa đạt, lặp lại nội dung/policy/UX trong 01–03.

## 4. Các slice sau mốc dừng

Giữ thứ tự dự kiến: `04 Writing + artifact versions + async AI evaluation` → `05 Speaking + audio upload + ASR + async evaluation` → `06 Placement` → `07 Reading` → `08 Checkpoint / Exam Mode`. Trước mỗi slice, viết một implementation brief tương đương 02/03: outcome, content/claim, nguồn sự thật, schema/API/UI tối thiểu, riêng tư/chi phí, gate kiểm chứng và rollback. Chỉ khởi công khi kết quả mốc dừng cho thấy giá trị học tập và khả năng vận hành đủ rõ; kế hoạch này không coi các subsystem đó đã được phê duyệt triển khai.

## Thứ tự công việc gần nhất

1. Đóng hai gate live của 01F và ghi bằng chứng.
2. Triển khai và kiểm chứng Preview; quyết định Production theo gate phát hành.
3. Viết implementation brief/fixture cho 02A, rồi làm lần lượt 02A → 02B → 02C.
4. Kiểm chứng 02 với delayed recall; làm 03A → 03B → 03C.
5. Dừng mở rộng, đo với người học thật và quyết định có tiếp tục 04 hay cải thiện 01–03.
