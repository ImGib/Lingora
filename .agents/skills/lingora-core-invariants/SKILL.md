---
name: lingora-core-invariants
description: Bất biến sư phạm và quy tắc nghiệp vụ cốt lõi của Lingora (Skipped != Failed, Support != Independent, Fault Tolerance). Tự động nạp cho mọi Agent để không cần giải thích lại.
---

# LINGORA CORE PEDAGOGICAL INVARIANTS

Khi viết bất kỳ component, service, hoặc handler nào trong Lingora, mọi Agent BẮT BUỘC tuân thủ các bất biến sau mà không cần hỏi lại:

1. **`Skipped != Failed`:**
   - Khi học viên bấm nút "Bỏ qua", "Để sau", hoặc "Nghỉ hôm nay" $\rightarrow$ Đây là hành vi điều phối nhịp độ học hợp lệ.
   - Tuyệt đối KHÔNG trừ điểm, KHÔNG tính là lỗi sai, KHÔNG hiển thị màu đỏ cảnh báo.

2. **`Support != Independent Evidence`:**
   - Khi học viên bấm xem "Gợi ý (Hint)", "Xem lời thoại (Transcript)" $\rightarrow$ Hệ thống gán cờ `has_support: true`.
   - Kết quả này chỉ được tính là Luyện tập (Practice), KHÔNG ĐƯỢC tính vào Bằng chứng năng lực độc lập (Mastery Evidence).

3. **`Technical Failure != Learner Failure`:**
   - Khi micro bị từ chối quyền, rớt mạng, hoặc file âm thanh bị lỗi $\rightarrow$ Hiển thị thông báo êm dịu: *"Đây là lỗi kỹ thuật, không phải lỗi của bạn"*.
   - Luôn cung cấp luồng cứu hộ: Cho phép gõ bài viết thay thế cho thu âm nói.

4. **`Growth Garden != Streak Punishment`:**
   - Khi học viên vắng mặt 3–7 ngày quay lại $\rightarrow$ Tuyệt đối KHÔNG reset cây tiến độ về 0.
   - Hiển thị lời chào mừng quay lại êm dịu và đề xuất ôn tập nhẹ 5 phút (`Verify before Recovery`).
