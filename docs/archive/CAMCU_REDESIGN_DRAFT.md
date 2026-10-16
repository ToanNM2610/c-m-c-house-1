# CẨM CÙ HOUSE: BẢN THẢO THIẾT KẾ LẠI HOÀN TOÀN

Phạm vi: hình ảnh, chữ, bố cục, hiệu ứng, màu sắc của camcuhouse.online (5 trang + chân trang + intro + chuyển trang). Thiết kế mới thay thế hoàn toàn giao diện "xanh rừng đậm" hiện tại.

## 0. Prompt khởi động (dán vào Antigravity)

```
Bạn là Senior Product Designer kiêm Front-end Engineer. Đọc CAMCU_REDESIGN_DRAFT.md và thiết kế lại TOÀN BỘ giao diện camcuhouse.online đúng theo bản thảo: màu, chữ, hình ảnh, bố cục, hiệu ứng. Làm thẳng trên code hiện tại, KHÔNG tạo nhánh, KHÔNG mở PR, commit nhỏ có tin nhắn rõ ràng (có commit "backup trước khi thiết kế lại"). Tuyệt đối không đổi thông tin quán (mục 1). Làm lần lượt theo mục 12; mỗi bước đạt tiêu chí rồi mới sang bước sau; chụp ảnh trước/sau (desktop 1440 + mobile 390, sáng + tối, VN + EN).
```

## 1. Bất biến (KHÔNG được đổi)

- Tên "Cẩm Cù House" (luôn có dấu, kể cả bản EN); khẩu hiệu "Chốn Dừng Chân Mộc Mạc Bên Bờ Suối Đá"; H1 "CẨM CÙ HOUSE".
- Địa chỉ Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa, Đắk Nông; tọa độ 11.99° N, 107.69° E; độ cao 800m+.
- Giờ: Thứ 2–5: 07:00–18:00; Thứ 6–CN: 07:00–22:00.
- Hotline 038 285 1688 (Zalo), 077 465 9000; email; Facebook, TikTok, YouTube; link Google Maps.
- 67 món (tên, mô tả, giá, nhãn, danh mục), 30 ảnh không gian, mọi văn bản VN/EN, 4 thẻ "Vì Sao Chọn", các đoạn Câu Chuyện, mọi đánh giá khách (giữ nguyên chữ, tên, thông tin kèm theo).
- Route, dữ liệu, tính năng hiện có (VN/EN, sáng/tối, tiếng suối, lọc/tìm thực đơn, lightbox, bản đồ, admin).
- Chỉ đổi cách trình bày. Không bịa thêm nội dung, số liệu, khuyến mãi. Thực Đơn không dùng ảnh.

## 2. Ý tưởng chủ đạo: "KHÓI CỦI & NƯỚC SUỐI"

Website như **cuốn nhật ký hành trình cao nguyên**: giấy kem ấm, mực nâu than, điểm nhấn đỏ bazan. Ba chất liệu: **đất đỏ bazan** (màu chủ đạo), **khói củi** (độ ấm, hạt giấy, ánh sáng sớm), **nước suối** (xanh ngọc đậm, chuyển động chảy).

Nhận diện đồ họa (dùng xuyên suốt):
1. **Đường đồng mức** (contour lines) mảnh: nền các section, vẽ nét khi cuộn, gắn với "độ cao 800m+" và tọa độ.
2. **Hoa Hoya hình sao** nét mảnh: logo, điểm nhấn, vẽ dần (stroke) khi xuất hiện.
3. **Khung vòm** (mái chòi): ảnh chính bo dạng cổng vòm.
4. **Tem tròn xoay**: "CẨM CÙ HOUSE • GIA NGHĨA • ĐẮK NÔNG •" làm điểm nhấn ở hero và chân trang.
5. **Nhãn tọa độ** dạng chữ đơn cách (mono): "11.99° N · 107.69° E".

Cảm xúc: ấm, thật, thủ công, thư thả, đáng tin; không lòe loẹt, không gradient neon.

## 3. Màu sắc

| Token | Sáng (mặc định) | Tối ("Đêm bên suối") |
| --- | --- | --- |
| `--paper` (nền) | `#F6EFE2` | `#14110E` |
| `--paper-2` (nền xen kẽ) | `#EDE3D0` | `#1D1814` |
| `--card` | `#FBF7EE` | `#221C17` |
| `--ink` (chữ chính) | `#1F1712` | `#F4ECDD` |
| `--ink-muted` | `#5A4A3F` | `#C7BBA8` |
| `--basalt` (nhấn chính, nút, giá) | `#A8452A` | `#E0764F` |
| `--stream` (xanh suối, nhãn, liên kết) | `#2C5A4A` | `#7FC2A8` |
| `--moss` (nhấn phụ) | `#5E7A3E` | `#9DBB74` |
| `--flower` (vàng hoa chuông, sao) | `#E2AE3B` | `#F0C566` |
| `--charcoal` (khối tối) | `#1C1612` | `#0E0B09` |
| `--line` | `rgba(31,23,18,.14)` | `rgba(244,236,221,.14)` |

- Tỉ lệ: 60% giấy (paper) · 25% chữ/than (ink, charcoal) · 10% bazan · 5% xanh suối + vàng.
- Nút chính: nền `--basalt`, chữ `#FFFFFF` (sáng) / `#1C1612` (tối). Nút phụ: viền 1.5px `--ink`, hover đổ nền `--ink`, chữ `--paper`.
- Khối tối nhịp điệu (hero, trích dẫn đánh giá, chân trang): nền `--charcoal`, chữ kem, đường đồng mức `rgba(244,236,221,.10)`.
- Tương phản chữ ≥ 4.5:1, icon/viền ≥ 3:1, kiểm tra cả hai chế độ. Trạng thái luôn có icon/chữ, không chỉ dựa vào màu.
- Ảnh nền có chữ phải phủ lớp tối `rgba(20,14,10,.45–.65)` cho tương phản.

## 4. Chữ

| Vai trò | Phông | Ghi chú |
| --- | --- | --- |
| Tiêu đề, chữ lớn | **Fraunces** (variable, `opsz` cao, SOFT 50, WONK 0) | weight 500–700, letter-spacing -.02em |
| Nội dung, giao diện | **Be Vietnam Pro** | 400/500/600, thiết kế riêng cho tiếng Việt |
| Nhãn, tọa độ, số liệu nhỏ | **IBM Plex Mono** | 12–13px, viết hoa, letter-spacing .08em |

Tải bằng `next/font`, subset `vietnamese` + `latin-ext`, `display: swap`.

| Cấp | Cỡ | Dòng |
| --- | --- | --- |
| Display XXL (chữ khổng lồ trang trí) | clamp(72px, 16vw, 240px) | 1.02 |
| H1 | clamp(44px, 7vw, 104px) | 1.05 |
| H2 | clamp(32px, 4.5vw, 64px) | 1.1 |
| H3 | 24–30px | 1.2 |
| Nội dung | 17–18px | 1.7 (tối đa 62 ký tự/dòng) |
| Chữ phụ | 15px (tối thiểu 14px) | 1.6 |
| Nhãn mono | 12–13px | viết hoa |

- Số (giá, giờ, chỉ số) dùng `font-variant-numeric: lining-nums tabular-nums`.
- Tiêu đề `text-wrap: balance`; không ngắt giữa "Mộc Mạc", "Cẩm Cù", "Gia Nghĩa" (`&nbsp;`).
- Dấu tiếng Việt: line-height tiêu đề ≥ 1.05; lớp mask hiện chữ có padding-top ≥ .35em, không `overflow:hidden` cắt dấu.
- Nhấn mạnh trong tiêu đề: một cụm chữ nghiêng Fraunces (italic) màu `--basalt`.

## 5. Hình ảnh

**Phong cách ảnh**: ấm, ánh nắng sớm, màu tự nhiên, tăng nhẹ độ ấm; thêm hạt phim (noise SVG ~6%); không lọc nặng. Chỉ dùng 30 ảnh hiện có; mỗi ảnh có `alt` VN/EN.

**Khung ảnh** (dùng đúng 4 kiểu, không thêm):
1. **Vòm**: `border-radius: 999px 999px 28px 28px` (ảnh chính ở hero, Câu Chuyện).
2. **Chữ nhật bo 28px** (lưới ảnh, ảnh thường).
3. **Tròn** (ảnh chi tiết nhỏ, avatar).
4. **Tem ảnh** (khung kem, viền răng cưa mảnh, nhãn tọa độ + tên ảnh dưới ảnh, xoay ±2°) cho ảnh chồng ảnh.

**Xử lý**: skeleton + blur-up (không bao giờ có ô trống); `next/image` WebP/AVIF; đặt sẵn kích thước; ảnh nền trang trí phủ duotone (than + xanh suối) mờ 12%.

**Minh họa vector** (vẽ mới, nét 1.5px): hoa Hoya sao, cành cà phê chín, sóng suối, đường đồng mức, ngọn lửa củi nhỏ. Dùng làm điểm nhấn, không thay thế ảnh.

**Cần chụp/quay thêm (khuyến nghị)**: video hero 10–12 giây lặp (sương sớm trên suối, khói bốc từ ly cà phê), cận cảnh rót cà phê muối, rang củi, hạt cà phê, hoa Hoya macro, 1 ảnh dọc cho vòm hero, ảnh chia sẻ 1200x630.

## 6. Lưới & thành phần cơ bản

- Lưới 12 cột, container tối đa 1280px, lề 20px (mobile) / 48px (desktop); khoảng cách section 120px (desktop) / 72px (mobile).
- Card: nền `--card`, viền 1px `--line`, bo 24px, padding 32px; không khung lồng khung; hover nâng 4px + viền `--basalt` 40%.
- Nút: bo tròn hoàn toàn, cao ≥ 48px, chữ Be Vietnam Pro 600 16px, kèm mũi tên nhỏ; nút từ tính (magnetic) trên desktop.
- Icon nét 1.5px, một màu (`--stream` hoặc `--ink`).
- Đường kẻ mảnh `--line` phân tách thay cho nhiều khung.
- Cursor tùy biến chỉ trên desktop: chấm tròn 12px, phóng thành vòng "Kéo"/"Xem" khi rê vào gallery/ảnh.

## 7. Thành phần dùng chung

1. **Thanh trên cùng** (micro-bar, 13px mono): "● Đang mở cửa · Đóng lúc 18:00 hôm nay · 23°C". Duy nhất một nơi hiển thị trạng thái, đọc từ một nguồn giờ.
2. **Header**: trong suốt đè lên hero (chữ kem), thành nền `--paper` mờ kính khi cuộn; trái: logo hoa Hoya + chữ "Cẩm Cù House" (Fraunces 26px); giữa: 5 liên kết chữ, gạch chân vẽ nét khi hover/đang chọn; phải: VN/EN, đổi sáng/tối (icon mặt trời/trăng), nút **"Gọi ngay"** nền bazan luôn hiện. Ẩn khi cuộn xuống, hiện khi cuộn lên.
3. **Menu mobile**: toàn màn hình nền `--charcoal`, 5 liên kết Fraunces 44px xuất hiện lần lượt, đường đồng mức mờ phía sau, hàng cuối: Gọi · Zalo · Chỉ đường.
4. **Thanh liên hệ cố định (mobile)**: Gọi · Zalo · Chỉ đường, cao 56px, an toàn vùng tai thỏ.
5. **Chân trang**: nền `--charcoal`, đường đồng mức mờ; trên cùng: tem tròn xoay + câu "Chốn Dừng Chân Mộc Mạc Bên Bờ Suối Đá" (Fraunces 40px); 4 cột (thương hiệu + tọa độ · điều hướng · giờ & hotline · địa chỉ & kết nối); chữ khổng lồ "CẨM CÙ HOUSE" cắt nửa dưới, độ mờ .10, trồi lên khi cuộn; hàng cuối: bản quyền · Lên đầu trang · dòng thiết kế.

## 8. Thiết kế từng trang

### 8.1 Trang Chủ
1. **Hero** (toàn màn hình, nền video/ảnh + lớp tối): trái dưới: nhãn tọa độ mono, H1 "CẨM CÙ HOUSE" cỡ H1 và dòng "Chốn Dừng Chân Mộc Mạc Bên Bờ Suối Đá" Fraunces nghiêng màu `--flower`; mô tả 18px; 2 nút (Khám Phá Góc Suối chính / Xem Thực Đơn phụ). Phải: ảnh chính trong **khung vòm** nghiêng nhẹ + **tem tròn xoay**. Dưới cùng: thanh pill kính mờ: trạng thái · giờ hôm nay · Hotline · Chỉ đường. Chữ khổng lồ "CẨM CÙ" (Display XXL, mờ .12) nằm giữa các lớp parallax.
2. **Dải chữ chạy** (marquee, nền bazan, chữ kem mono): "ROBUSTA RANG CỦI · SUỐI ĐÁ · 800M+ · 100% ĐỀ XUẤT HÀI LÒNG · GIÁ BÌNH DÂN 20K–45K · NGUYÊN LIỆU XANH SẠCH ·" (tốc độ tăng theo tốc độ cuộn).
3. **Giới thiệu "Nơi thời gian lắng lại cùng tiếng suối róc rách"**: 2 cột bất đối xứng (5/7): trái chữ + nút "Đọc trọn vẹn câu chuyện →"; phải 2 ảnh chồng (một vòm, một **tem ảnh**). Dưới: 3 chỉ số khổng lồ (Fraunces 96px, đếm số) "800m+ / 100% / 0 khói bụi" kèm nhãn mono.
4. **Vì Sao Chọn Cẩm Cù House?**: 4 thẻ **xếp chồng dính** (sticky stack): mỗi thẻ chiếm gần nguyên chiều rộng, số thứ tự 01–04 lớn, tiêu đề H3, mô tả, nhãn mono; khi cuộn thẻ sau trượt đè lên thẻ trước; mỗi thẻ một màu nền (paper-2, stream tối, bazan, charcoal).
5. **Góc Check-in & Thư Thái Tự Nhiên**: **gallery kéo ngang** (pin + cuộn ngang theo thanh cuộn), 4 ảnh vòm lớn so le cao thấp, tên ảnh dạng tem dưới ảnh, con trỏ "Kéo"; link "Xem toàn bộ 30+ góc ảnh →".
6. **Cảm nhận khách**: khối `--charcoal`: điểm 4.9 + sao vàng khổng lồ; **một trích dẫn lớn** (Fraunces 36px) chuyển tự động mỗi 7s với tên, nhãn Local Guide, thông tin "Dùng tại chỗ · giá/người", "Đề xuất" (nguyên văn); dải avatar tròn bên dưới để chọn; nút "Xem tất cả đánh giá trên Google Maps". Giữ đủ mọi đánh giá, giữ nguyên chữ.
7. **Chào đón bạn ghé thăm** (CTA cuối): chữ Display lớn "Ghé Cẩm Cù House Thưởng Thức Cà Phê Bên Bờ Suối" trên nền ảnh vòm, 3 gạch tiện ích, nút Hotline + Chỉ đường.

### 8.2 Câu Chuyện
1. **Mở đầu**: nền giấy, đường đồng mức lớn vẽ dần; nhãn "Tâm tình từ cao nguyên"; H1 "Câu Chuyện Cẩm Cù / Chốn Bình Yên Giữa Đất Ngàn" căn lề trái; 3 badge dạng chữ mono có gạch dưới.
2. **Chương 01, 02, 03** (mỗi chương: số lớn "01" Fraunces 160px mờ; bố cục chia đôi **dính**: ảnh vòm cố định một bên, chữ cuộn bên kia; chương lẻ ảnh trái, chương chẵn ảnh phải). Chương hoa Hoya: hoa Hoya sao vẽ nét khi vào khung. Câu trích in nghiêng Fraunces 28px có vạch dọc bazan.
3. **Đoạn chữ lớn "Dưới bóng rừng Tây Nguyên…"**: chữ 40px, mỗi từ sáng dần theo cuộn (từ chưa sáng vẫn ≥ 3:1), nền `--charcoal`, hoa chuông vàng làm điểm sáng.
4. **Lời hẹn ước**: chữ Display, hai nút, tem tròn xoay.

### 8.3 Không Gian Suối
1. **Đầu trang**: H1 "Không Gian Sinh Thái, Bên Bờ Suối Đá" (một khối, không ngắt giữa cụm); khối chỉ số bên phải kiểu "thẻ thông tin": 22°C–26°C, Đá Bazan Cổ.
2. **Thanh lọc** dính: 5 chip chữ mono, chip đang chọn nền `--ink` chữ `--paper`; cuộn ngang trên mobile.
3. **Lưới ảnh bento** 12 cột (ô 1×1, 2×1, 1×2, 2×2 xen kẽ); tên ảnh tối đa 2 dòng nằm trên lớp gradient tối đáy ảnh; hover: ảnh phóng 1.04, hiện nhãn danh mục; lọc bằng FLIP .45s; skeleton khi tải; hàng cuối tự căn.
4. **Xem ảnh toàn màn hình**: nền charcoal, ảnh lớn, mũi tên, vuốt, ← → Esc, số "03 / 30", chú thích mono.
5. **Thanh Âm Suối** (thanh nổi dưới màn hình): nút phát tròn bazan, sóng âm vẽ bằng canvas, mặc định tắt, nhớ lựa chọn.
6. **Bảo Tồn Dòng Nước Suối**: khối nền `--stream` tối, 3 cam kết dạng cột có icon nét mảnh, 2 nút.

### 8.4 Thực Đơn (chỉ chữ, KHÔNG ảnh)
1. **Đầu trang**: H1 "Thực Đơn Mộc Mạc, Thức Uống Xanh & Món Ăn Lành" (không có dấu • đầu dòng) + 3 badge mono.
2. **Bố cục "tờ thực đơn giấy"**: desktop chia 2 vùng: **cột trái dính** (mục lục danh mục có số 01–08, scrollspy tự sáng, ô tìm kiếm không dấu); **cột phải** danh sách theo nhóm.
3. **Món được yêu thích nhất**: một khung chữ nền `--paper-2`, **tem tròn** "SIGNATURE", tên món Fraunces 40px, mô tả, giá, nút Gọi hotline.
4. **Nhóm món**: tiêu đề nhóm Fraunces 48px + số thứ tự; mỗi dòng: tên món 18px 600 · **đường chấm dẫn** · giá (Be Vietnam Pro 700 17px, màu bazan); dòng dưới mô tả 15px muted; nhãn Signature/Mới là tem nhỏ; món "Tạm hết" làm mờ + gạch. Một cột, độ rộng tối đa 760px để dễ đọc; giữ đủ 67 món.
5. **Cam Kết Từ Bếp & Quầy Bar Cẩm Cù**: khối charcoal ngang, 2 nút.
6. Mobile: mục lục thành thanh chip cuộn ngang dính trên đầu.

### 8.5 Chỉ Đường & Liên Hệ
1. **Đầu trang**: H1 "Từ Gia Nghĩa, Cẩm Cù House Chờ Đón Bạn"; tọa độ mono; địa chỉ đầy đủ cỡ Fraunces 32px ngay dưới.
2. **Bố cục 2 cột**: trái **bản đồ lớn** (bo 28px, lọc màu ấm ở chế độ sáng, lọc tối ở chế độ tối) + nút "Mở Google Maps" bazan; phải: **Giờ mở cửa** (bảng 7 ngày, hôm nay có nền `--flower` 20% và nhãn "Hôm nay"), **Hotline** (2 số cỡ lớn, nút sao chép + Zalo), **Kênh truyền thông** (Facebook, TikTok, YouTube dạng 3 nút tròn).
3. **Cách đến quán**: các bước đánh số 1–3 theo nội dung hiện có (đường bê tông, bãi đỗ xe, lối vào Hẻm 437), đường nét đứt nối các bước.
4. **CTA cuối**: Display "Hẹn gặp bạn bên bờ suối", Hotline + Chỉ đường.

## 9. Chuyển động

**Intro (1 lần/phiên, ≤ 4 giây, có "Bỏ qua" + Esc)**: nền charcoal; đường đồng mức vẽ nét từ giữa ra; hoa Hoya sao vẽ nét rồi nở; chữ "CẨM CÙ HOUSE" hiện từng chữ (mask đủ chỗ cho dấu); bộ đếm là **độ cao 0 → 800m** thay cho %; kết thúc: ảnh hero mở ra từ khung vòm lớn dần phủ toàn màn hình. Phát `camcu:intro-done`.

**Chuyển trang** (duy nhất): tấm bazan trồi lên theo **hình vòm** từ đáy màn hình, hiện tên trang Fraunces 64px + tọa độ mono, rồi vòm trượt lên mở trang mới; ≤ 1.1s; cuộn về đầu; Back giữ vị trí; dự phòng cross-fade .3s.

**Cuộn**: Lenis (1.1s); thanh tiến độ 2px màu bazan; header ẩn/hiện; chữ tiêu đề hiện theo dòng (mask trượt lên, stagger .06s); ảnh vòm "lớn dần" (clip-path) khi vào khung; parallax lớp (.15/.3/.5); đường đồng mức vẽ nét theo cuộn; chữ khổng lồ trôi ngược chiều; marquee đổi tốc độ theo vận tốc cuộn; thẻ xếp chồng dính; gallery ngang pin; số đếm khi vào khung; chữ sáng dần từng từ (scrub).

**Tương tác nhỏ**: gạch chân vẽ nét; nút từ tính; tem tròn xoay chậm (20s/vòng), xoay nhanh khi hover; chuyển sáng/tối bằng vòng tròn mở từ nút; skeleton shimmer; toast nhỏ khi sao chép số điện thoại.

**Quy tắc**: chỉ animate `transform`/`opacity`/`clip-path`; không animation > 1s ngoài intro/hero; `prefers-reduced-motion` tắt parallax, scrub, marquee, xoay; mobile giảm parallax 50%, tắt cursor, đơn giản hóa pin ngang thành cuộn vuốt.

## 10. Chế độ tối ("Đêm bên suối")

Dùng bảng màu cột "Tối"; ảnh giảm sáng 8%; đường đồng mức sáng `rgba(244,236,221,.10)`; khối `--charcoal` đậm hơn nền; chuyển đổi bằng vòng tròn mở. Mặc định theo `prefers-color-scheme`, nhớ lựa chọn.

## 11. Responsive, truy cập, hiệu năng

- Mốc: 390 / 768 / 1024 / 1440. Mobile: 1 cột, vòm ảnh thu nhỏ, bento còn 2 cột, thanh liên hệ cố định.
- Vùng bấm ≥ 48px; vòng focus rõ ràng; điều hướng bàn phím đủ; `alt` đúng; đọc màn hình đúng thứ tự.
- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95, CLS < 0.05, LCP < 2.5s. Tải lười video, 3D/WebGL, GSAP nặng; video hero có ảnh poster; font preload tối thiểu.

## 12. Lộ trình giao việc

| Bước | Nội dung | Nghiệm thu |
| --- | --- | --- |
| 1 | Backup, tokens màu/chữ/khoảng cách, font, chế độ sáng/tối, khung ảnh, nút, tem, minh họa | Tương phản đạt cả hai chế độ; không còn màu/cỡ chữ tự đặt |
| 2 | Header, menu mobile, thanh trên cùng, chân trang, thanh liên hệ | Một nguồn trạng thái; không lặp "Đã đóng cửa" |
| 3 | Trang Chủ + Câu Chuyện | Nội dung khớp 100% bản gốc; không cắt dấu |
| 4 | Không Gian Suối + Thực Đơn (chỉ chữ) | 67 món/30 ảnh đủ; lọc, tìm, lightbox chạy tốt; không ô trống |
| 5 | Chỉ Đường & Liên Hệ + bản đồ | Giờ hôm nay đúng; nút Gọi/Zalo/Chỉ đường hoạt động |
| 6 | Intro, chuyển trang, hiệu ứng cuộn, cursor | Đúng mục 9; reduced-motion hoạt động; 60fps trên mobile tầm trung |
| 7 | Kiểm tra: console sạch, liên kết không 404, axe-core, Lighthouse, chính tả, so khớp nội dung trước/sau | Báo cáo QA_REPORT.md, sửa hết lỗi Nặng và Vừa |
