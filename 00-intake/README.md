# 00-intake — Nguồn Tri Thức Thô & Ranh Giới Nghiệp Vụ (Raw SoT)

> **VAI TRÒ TRONG KIẾN TRÚC LINGORA:**
> Thư mục này là **Nguồn Chân Lý Thượng Nguồn (Upstream Source of Truth - P0)**. Mọi Agent khi cần tra cứu tiêu chuẩn khung CEFR, âm vị IPA, mục tiêu IELTS 6.5 hoặc bất biến sư phạm phải đọc từ đây.

## Cấu trúc thư mục:
```text
00-intake/
├── README.md               ← File hướng dẫn này
├── glossary.md             ← Thuật ngữ sư phạm & kỹ thuật chuẩn
├── sot/                    ← Source of Truth chính thức
│   ├── cefr-ielts-mapping.md     ← Khung đối chiếu CEFR A1-B2 sang IELTS 6.5
│   ├── ipa-44-phonemes.md        ← Chuẩn 44 âm vị quốc tế (vowels & consonants)
│   └── pedagogical-invariants.md ← 4 bất biến sư phạm Lingora (Skipped!=Failed...)
└── knowledge/              ← Tri thức trích xuất & tài liệu nghiên cứu
    └── README.md
```

## Quy tắc cho AI Agent:
1. **Chỉ Đọc (Read-Only):** Agent không được tự ý sửa đổi các file trong `sot/` trừ khi có chỉ thị trực tiếp từ người dùng.
2. **Không tự suy đoán:** Mọi quy tắc về chấm điểm, gợi ý (`has_support`), hoặc chia mốc lộ trình phải trích dẫn trực tiếp từ các file trong `00-intake/sot/`.
