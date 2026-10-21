# reports — Quy Chuẩn Báo Cáo Cơ Học & Lưu Vết Kiểm Thử (Reporting Protocol)

> **MỤC TIÊU TỐI ƯU TOKEN (Lấy cảm hứng từ TDC PRJ_FOLDER):**
> Tuyệt đối KHÔNG in hàng trăm dòng kết quả build, log typecheck lỗi hay dữ liệu thô vào cửa sổ chat với AI. Toàn bộ bằng chứng cơ học phải được ghi thành file trong thư mục `reports/`. AI chỉ đọc file tóm tắt báo cáo khi cần sửa lỗi.

---

## 1. Cấu Trúc Phân Loại Báo Cáo
```text
reports/
├── README.md               ← Hướng dẫn này
├── typecheck/              ← Kết quả chạy tsc / pnpm typecheck
│   └── 261021-gate-audit.log
├── token-audits/           ← Kết quả kiểm tra độ dài ngữ cảnh (audit-context)
│   └── 261021-skills-budget.md
├── reviews/                ← Kết quả code review / pedagogic review
│   └── 261021-ipa-studio-review.md
└── benchmarks/             ← Thống kê lượng token đã tiêu thụ theo phiên
```

---

## 2. Quy Tắc Báo Cáo Cho AI Agent
1. **Chỉ tóm tắt khi báo cáo người dùng:**
   - Khi chạy lệnh kiểm chứng, Agent ghi toàn bộ log thô vào `reports/{category}/{YYMMDD}-{name}.log`.
   - Trong hội thoại, Agent chỉ đưa ra thông điệp ngắn gọn:
     ```text
     Gate Typecheck: PASS (0 errors).
     Báo cáo chi tiết lưu tại: reports/typecheck/261021-gate.log
     ```
2. **Khi gặp lỗi (Debugging):**
   - Không nạp lại toàn bộ file log $> 5.000$ dòng.
   - Chỉ lọc trích xuất 3 đến 5 dòng lỗi cốt lõi (file, dòng, mã lỗi TS) để đưa vào prompt sửa lỗi.
