# 🤖 Trung Tâm Điều Phối & Giám Sát Đa AI (`AI Coordination Hub`)

**Đường dẫn tài liệu:** `.agents/coordination/README.md`  
**Mục tiêu:** Giúp bạn nắm rõ **AI nào đang làm task gì**, **tiến độ %**, **ngân sách token đã dùng**, và **lệnh bàn giao chính xác** khi làm việc cùng lúc với Antigravity và Codex.

---

## 🚦 Bảng Giám Sát Trạng Thái Đa AI Theo Thời Gian Thực (Live Status Board)

Dữ liệu máy đọc (Machine-readable) được lưu và đồng bộ tại: [`.agents/coordination/tasks-board.json`](tasks-board.json).

| ID Làn | Làn Công Việc & Phạm Vi Thư Mục | AI Đảm Nhiệm | Trạng Thái | Tiến Độ (%) | Mức Sử Dụng Token / Context | Task Hiện Tại Cần Xử Lý |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **WS-01** | **Visual & Background 60fps**<br>`apps/web/src/components/common/` | **Antigravity** | 🟡 `READY_TO_START` | **0%** | 🟢 **42k / 1M** (*An toàn*) | Tích hợp Canvas gradient mesh 60fps & Header Toggle |
| **WS-02** | **Phòng Lab Khẩu Hình IPA**<br>`apps/web/src/components/ipa/` | **Codex (Tab 2)** | ⏳ `UNASSIGNED` | **0%** | ⚪ *Chưa khởi động* | Viết `IpaMouthStudio` (1 âm/viewport) & 2 hình SVG |
| **WS-03** | **Masterclass Ngữ Pháp 6 Phần**<br>`apps/web/src/components/grammar/` | **Codex (Tab 3)** | ⏳ `UNASSIGNED` | **0%** | ⚪ *Chưa khởi động* | Viết `GrammarMasterclass` (6 phần ForumFlash) |
| **WS-04** | **Runner Luyện Tập & QA Hub**<br>`apps/web/src/components/practice/` | **Codex (Tab 4)** | ⏳ `UNASSIGNED` | **0%** | ⚪ *Chưa khởi động* | Trắc nghiệm, Thu âm Micro fallback & Modal `⚙ Giả lập lỗi` |

---

## 💡 Cơ Chế Giám Sát Token & Tránh Tràn Context (Token Burn Management)

1. **Vạch Cảnh Báo Context Window (Traffic Light System):**
   - 🟢 **Xanh lá (< 60% Context):** AI hoạt động ở độ nhạy bén và ghi nhớ tốt nhất.
   - 🟡 **Vàng (60% - 80% Context):** Cần nhắc AI chỉ đọc file cần thiết, không đọc lại toàn bộ repo.
   - 🔴 **Đỏ (> 80% Context):** Nguy cơ "quên" các bất biến sư phạm hoặc lặp lại code cũ. Bạn nên gõ lệnh `/compact` hoặc yêu cầu AI commit code, lưu tóm tắt vào `.agents/memory/` rồi mở phiên chat mới.
2. **Quy Tắc Độc Lập Token:** 
   - Vì mỗi Agent (Antigravity và từng tab Codex) chạy trên các phiên chat (session) độc lập, **token của Agent này không ảnh hưởng đến token của Agent kia**.
   - Dung lượng token không bị lãng phí vì mỗi bên chỉ đọc đúng thư mục con được giao.

---

## 📋 Thẻ Bàn Giao Task Sẵn Cho Codex (Copy-Paste Prompts)

Khi bạn mở một tab mới cho OpenAI Codex, chỉ cần **copy nguyên văn** một trong các thẻ bên dưới:

<details>
<summary>👉 <strong>Bấm để xem Prompt giao việc cho Codex: LÀN 2 (IPA Mouth Studio)</strong></summary>

```text
Bạn là Agent phụ trách LÀN 2 trong dự án Lingora (D:\Lingora).
Mục tiêu của bạn: Xây dựng Phòng Lab Khẩu hình IPA chuẩn 1 âm / viewport.
Thư mục làm việc độc quyền của bạn: apps/web/src/components/ipa/ và apps/web/src/components/common/audio-button.tsx
Quy chuẩn bất biến bắt buộc:
1. Mỗi viewport chỉ hiển thị đúng 1 âm IPA qua thanh Tab chọn âm.
2. Render 2 hình vẽ SVG khẩu hình: Nhìn thẳng (Môi, răng) và Mặt cắt ngang (Lưỡi, luồng hơi).
3. Tuyệt đối KHÔNG nhúng chữ text mô tả cứng trong thẻ SVG. Mọi chú thích phải nằm bên ngoài SVG bằng thẻ HTML div.mouth-spec-item để chống tràn viền trên di động.
4. Nút âm thanh hỗ trợ 2 chế độ: Chuẩn (1.0x) và Chậm (0.75x).
Đọc tài liệu đặc tả tại: docs/09-implementation/active-plans/parallel-tasks-codex-matrix.md
Sau khi hoàn thành, hãy chạy: pnpm --filter @lingora/web typecheck để kiểm chứng.
```
</details>

<details>
<summary>👉 <strong>Bấm để xem Prompt giao việc cho Codex: LÀN 3 (Masterclass Ngữ Pháp 6 Phần)</strong></summary>

```text
Bạn là Agent phụ trách LÀN 3 trong dự án Lingora (D:\Lingora).
Mục tiêu của bạn: Xây dựng Chuyên đề Ngữ pháp Masterclass chuẩn 6 phần ForumFlash.
Thư mục làm việc độc quyền của bạn: apps/web/src/components/grammar/
Quy chuẩn bất biến bắt buộc:
1. Hiển thị đủ 6 phần: 1. Khái niệm cốt lõi, 2. Chức năng & Ví dụ thực tế, 3. Mảnh ghép & Bảng chia ngôi, 4. Cấu trúc 3 thể (+/-/?), 5. Dấu hiệu nhận biết, 6. Ví dụ mổ xẻ câu.
2. Phần mổ xẻ câu sử dụng badge màu trực quan: Chủ ngữ [S] xanh lá, Động từ [V] xanh dương, Tân ngữ/Bổ ngữ [O] vàng cam.
Đọc tài liệu đặc tả tại: docs/09-implementation/active-plans/parallel-tasks-codex-matrix.md
Sau khi hoàn thành, hãy chạy: pnpm --filter @lingora/web typecheck để kiểm chứng.
```
</details>

<details>
<summary>👉 <strong>Bấm để xem Prompt giao việc cho Codex: LÀN 4 (Runner Luyện Tập & QA Hub)</strong></summary>

```text
Bạn là Agent phụ trách LÀN 4 trong dự án Lingora (D:\Lingora).
Mục tiêu của bạn: Xây dựng các Card luyện tập tương tác và Hộp thoại Giả lập lỗi cho QA.
Thư mục làm việc độc quyền của bạn: apps/web/src/components/practice/ và apps/web/src/components/common/modal-fault-simulation.tsx
Quy chuẩn bất biến bắt buộc:
1. Nút "Bỏ qua" / "Để sau" gọi onSkip() không trừ điểm (Skipped != Failed).
2. Nút "Gợi ý" đánh dấu hasSupport = true (không tính làm bằng chứng độc lập).
3. SpeechRecorderCard: Kiểm tra quyền mic; nếu bị từ chối, hiển thị thông báo "Đây là lỗi kỹ thuật, không phải lỗi của bạn" và cho chuyển sang làm bài viết.
4. Modal Giả lập lỗi hỗ trợ 4 kịch bản: Mất mic, Lỗi audio, Mất mạng, Nghỉ 3 ngày.
Đọc tài liệu đặc tả tại: docs/09-implementation/active-plans/parallel-tasks-codex-matrix.md
Sau khi hoàn thành, hãy chạy: pnpm --filter @lingora/web typecheck để kiểm chứng.
```
</details>

---

## 🔄 Quy Trình Cập Nhật Tiến Độ Sau Mỗi Task

Sau khi một Agent hoàn thành công việc:
1. Agent chạy lệnh kiểm chứng cục bộ: `pnpm --filter @lingora/web typecheck && pnpm --filter @lingora/web lint`.
2. Agent (hoặc bạn) cập nhật trạng thái `COMPLETED` và tiến độ `100%` vào file [`.agents/coordination/tasks-board.json`](tasks-board.json).
3. Bảng tiến độ trong tài liệu này và Web Hub sẽ tự động phản ánh trạng thái mới nhất!
