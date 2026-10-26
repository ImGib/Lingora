# LINGORA DATABASE ENTITIES & RLS SECURITY (KNOWLEDGE ONLY)

> **Mục đích:** Sổ tay tri thức tinh gọn về cấu trúc thực thể CSDL Postgres/Supabase và chính sách bảo mật RLS, không chứa mã SQL migration.

## 1. THỰC THỂ CỐT LÕI (CORE ENTITIES)

### 1. `users` (Hồ sơ người học)
- **Khóa chính:** `id` (UUID - liên kết 1-1 với Clerk `user_id`)
- **Thuộc tính:** `email` (string), `display_name` (string), `current_milestone` ('A1' | 'A2' | 'B1' | 'B2'), `target_band` (number, vd: 6.5), `created_at` (timestamp)
- **RLS:** Người dùng chỉ có quyền `SELECT` và `UPDATE` bản ghi có `auth.uid() = id`.

### 2. `learning_plans` (Kế hoạch học tập cá nhân hóa)
- **Khóa chính:** `id` (UUID)
- **Quan hệ:** `user_id` (tham chiếu `users.id`)
- **Thuộc tính:** `daily_minutes` (number), `weekly_target_days` (number), `preferred_accent` ('General American' | 'Received Pronunciation'), `status` ('active' | 'paused')

### 3. `gate_evaluations` (Bản ghi thẩm định cổng 100% Mastery)
- **Khóa chính:** `id` (UUID)
- **Quan hệ:** `user_id` (tham chiếu `users.id`)
- **Thuộc tính:** `milestone_gate` ('GATE_1' | 'GATE_2' | 'GATE_3' | 'GATE_4'), `score_percent` (number: 0 - 100), `is_passed` (boolean: chỉ true khi `score_percent === 100`), `acoustic_evidence_url` (string?), `evaluated_at` (timestamp)
- **Bất biến:** Cổng sau chỉ mở khóa khi tồn tại bản ghi của cổng trước có `is_passed = true`.

### 4. `attempt_logs` (Nhật ký thực hành từng bước học)
- **Khóa chính:** `id` (UUID)
- **Thuộc tính:** `user_id`, `lesson_id` (string), `step_index` (number), `has_support` (boolean: true nếu xem gợi ý), `status` ('completed' | 'deferred' | 'skipped'), `user_transcript` (string?), `created_at`
- **Bất biến:** Các bản ghi có `has_support: true` được tách riêng khỏi dữ liệu thẩm định năng lực độc lập.

---

## 2. CHÍNH SÁCH BẢO MẬT HÀNG (ROW LEVEL SECURITY - RLS)

- Mọi bảng trong Supabase BẮT BUỘC bật `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`.
- **Nguyên tắc cô lập người dùng:** Không ai có thể đọc hoặc sửa nhật ký luyện tập hoặc bản ghi âm của người khác (`auth.uid() = user_id`).
- **Tối ưu hóa Index:** Mọi cột khóa ngoại `user_id` bắt buộc có `INDEX` để truy vấn dưới 5ms.
