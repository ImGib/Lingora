# LINGORA KNOWLEDGE VAULT (SỔ TAY TRI THỨC & KIẾN TRÚC TINH GỌN)

> **Triết lý:** Các tệp tri thức không mã nguồn (Code-free Knowledge & Architecture Files) giúp AI Agent và kỹ sư tra cứu sự thật nghiệp vụ, quy chuẩn thiết kế, luồng dữ liệu và cây phân cấp component trong **vài chục tokens** thay vì đọc hàng nghìn dòng code JSX/CSS/SVG.

---

## 1. Mục lục Sổ tay Tri Thức Nghiệp Vụ:
1. [grammar-matrix.md](file:///D:/Lingora/.agents/knowledge/grammar-matrix.md): Danh mục 32 chuyên đề ngữ pháp, công thức và dấu hiệu nhận biết (Zero code).
2. [ipa-44-phonemes.md](file:///D:/Lingora/.agents/knowledge/ipa-44-phonemes.md): Hệ thống 44 âm vị tiếng Anh, phân loại nguyên âm đơn/đôi, 8 cặp đối kháng phụ âm và nguyên lý lướt âm (Zero SVG).
3. [ielts-roadmap-gates.md](file:///D:/Lingora/.agents/knowledge/ielts-roadmap-gates.md): Lộ trình 4 mốc (A1 -> B2/6.5+), danh sách bài học bắt buộc và bất biến khóa cổng 100% Mastery.
4. [pedagogy-and-business-rules.md](file:///D:/Lingora/.agents/knowledge/pedagogy-and-business-rules.md): 4 bất biến sư phạm cốt lõi (Skipped != Failed, Support != Independent, Technical Failure, Growth Garden) và xác thực Clerk.
5. [ui-tokens-compact.md](file:///D:/Lingora/.agents/knowledge/ui-tokens-compact.md): Bảng mã màu hex Soft Study Companion, chuẩn WCAG 2.1 AA, touch target 44px và bất biến Background Singleton.
6. [database-models.md](file:///D:/Lingora/.agents/knowledge/database-models.md): Mô hình thực thể và chính sách bảo mật RLS Supabase.

---

## 2. Mục lục Bản Đồ Cấu Trúc Web & Component Tree:
7. [web-architecture-map.md](file:///D:/Lingora/.agents/knowledge/web-architecture-map.md): Bản đồ kiến trúc chi tiết 11 routes Next.js 15 App Router, mô tả cây phân cấp component, luồng dữ liệu, state holder và các bất biến giao diện riêng biệt cho từng trang.

---

## 3. Hệ thống 3 Lớp Lệnh Truy Xuất Siêu Tốc (3-Tier Fast Retrieval):

```bash
# ==============================================================
# LỚP 1: Tra cứu Tri thức nghiệp vụ & Sư phạm (<50 tokens)
# ==============================================================
pnpm know "future perfect"         # Tra cứu công thức & dấu hiệu thì
pnpm know "monophthongs"           # Tra cứu phân loại 12 nguyên âm đơn
pnpm know "gate 1"                 # Tra cứu tiêu chuẩn 100% Mastery mốc 1
pnpm know "Skipped"                # Tra cứu bất biến Skipped != Failed

# ==============================================================
# LỚP 2: Tra cứu Kiến trúc Web & Cây Component (<50 tokens)
# ==============================================================
pnpm web tree                      # Xem sơ đồ cây tổng quan toàn bộ ứng dụng
pnpm web ipa                       # Xem cấu trúc trang Lab IPA (cột trái, cột phải, state)
pnpm web roadmap                   # Xem cấu trúc trang Lộ trình & Level road
pnpm web dashboard                 # Xem cấu trúc trang Dashboard & Side stack 380px
pnpm web component AudioButton     # Xem nơi định nghĩa & danh sách các trang đang nhúng

# ==============================================================
# LỚP 3: Tra cứu Biểu tượng Mã nguồn & Type (<50 tokens)
# ==============================================================
pnpm scout RoadmapInteractiveView  # Tìm vị trí file & dòng chính xác
node .agents/scripts/code-scout.mjs show GrammarCatalog  # Xem 25 dòng code định nghĩa
pnpm scout:index                   # Tự động quét & làm mới toàn bộ chỉ mục
```
