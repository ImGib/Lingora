# 03-dd — Thiết Kế Chi Tiết & Hợp Đồng Kỹ Thuật (Detail Design & Contracts)

> **VAI TRÒ TRONG KIẾN TRÚC LINGORA:**
> Phase 03 định nghĩa chi tiết logic từng component, đặc tả giao diện sâu, các API endpoint DTO, và hợp đồng dữ liệu trước khi viết code ở `04-coding/`.

## Cấu trúc:
- `screens/`: Đặc tả logic chi tiết cho từng màn hình (IPA Studio 1 âm/viewport, Grammar 6 phần, Lesson Runner state machine).
- `api/`: Đặc tả endpoint HTTP REST, DTO payload, mã phản hồi, và cơ chế Idempotency.
- `contracts/`: Hợp đồng TypeScript kiến trúc (Roadmap interfaces, Lesson interfaces).
