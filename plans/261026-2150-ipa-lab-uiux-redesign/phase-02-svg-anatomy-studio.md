# Pha 2: Nâng Cấp Hệ Thống SVG Giải Phẫu 8 Nhóm Cơ & Studio Khẩu Hình

## 1. Mục tiêu
Thay thế các hình SVG thô sơ fallback bằng hệ thống giải phẫu vector chi tiết bao phủ 8 cơ chế phát âm thực tế:
1. Nhóm cười căng ngang (`Spread / Stretched`: `/iː/`, `/ɪ/`, `/e/`, `/eɪ/`)
2. Nhóm chu tròn môi (`Rounded / Pursed`: `/uː/`, `/ʊ/`, `/ɔː/`, `/ɒ/`, `/w/`)
3. Nhóm mở rộng hàm tự nhiên (`Open / Neutral`: `/ɑː/`, `/æ/`, `/ʌ/`, `/ɜː/`, `/ə/`)
4. Nhóm cắn môi dưới (`Labiodental`: `/f/`, `/v/`)
5. Nhóm kẹp thè lưỡi giữa răng (`Dental / Interdental`: `/θ/`, `/ð/`)
6. Nhóm khép răng xì hơi (`Alveolar Sibilants & Affricates`: `/s/`, `/z/`, `/ʃ/`, `/ʒ/`, `/tʃ/`, `/dʒ/`)
7. Nhóm ngậm môi âm mũi & bật môi (`Bilabials`: `/p/`, `/b/`, `/m/`)
8. Nhóm cuống lưỡi vòm mềm (`Velar Plosives & Nasal`: `/k/`, `/g/`, `/ŋ/`)

Mỗi hình vẽ có:
- Đường nét viền mềm mại, gradient sắc nét.
- Luồng hơi phát ra (airflow dashed arrows).
- Đốm sáng rung thanh quản (vocal cord resonance indicator).
- Nhãn chỉ dẫn ngoài SVG bằng HTML thuần (tuân thủ Invariant `lingora-ui-tokens`).

## 2. File sửa đổi
- `04-coding/apps/web/src/components/ipa/ipa-front-view.tsx`
- `04-coding/apps/web/src/components/ipa/ipa-side-view.tsx`
- `04-coding/apps/web/src/components/ipa/ipa-mouth-studio.tsx`
