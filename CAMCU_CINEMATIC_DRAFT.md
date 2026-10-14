# BẢN SOẠN THẢO THIẾT KẾ LẠI TOÀN BỘ WEBSITE CẨM CÙ HOUSE
**Phong cách: "Đại Ngàn Điện Ảnh"** (hiện đại, sắc sảo, cuốn hút từ giây đầu tiên)

## 0. Prompt giao cho Antigravity
```
Bạn là Senior Product Designer kiêm Front-end Engineer chuyên website thương hiệu đạt giải. Thiết kế lại TOÀN BỘ giao diện camcuhouse.online theo bản thảo dưới đây: hình ảnh, chữ, bố cục, hiệu ứng, màu sắc. Làm thẳng trên code hiện tại, KHÔNG tạo nhánh, KHÔNG mở PR, commit nhỏ có tin nhắn rõ ràng (có commit "backup trước khi thiết kế lại"). Tuyệt đối không đổi thông tin quán (mục 1). Làm theo mục 11, mỗi bước đạt tiêu chí mới sang bước sau. Chụp ảnh trước/sau (desktop 1440 + mobile 390, tối + sáng, VN + EN). Ba giây đầu của Trang Chủ phải gây ấn tượng mạnh, tải nhanh, không giật.
```

## 1. Bất biến (KHÔNG được đổi)
- Tên "Cẩm Cù House" (luôn có dấu, cả bản EN); H1 "CẨM CÙ HOUSE"; khẩu hiệu "Chốn Dừng Chân Mộc Mạc Bên Bờ Suối Đá".
- Địa chỉ Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa, Đắk Nông; tọa độ 11.99° N, 107.69° E; độ cao 800m+.
- Giờ: Thứ 2–5: 07:00–18:00; Thứ 6–CN: 07:00–22:00. Hotline 038 285 1688 (Zalo), 077 465 9000; email; Facebook, TikTok, YouTube; link Google Maps.
- 67 món (tên, mô tả, giá, nhãn, danh mục), 30 ảnh không gian, mọi văn bản VN/EN, 4 giá trị "Vì Sao Chọn", các đoạn Câu Chuyện, mọi đánh giá khách (nguyên văn, giữ tên và thông tin kèm theo).
- Route, dữ liệu, tính năng hiện có (VN/EN, sáng/tối, tiếng suối, lọc/tìm thực đơn, lightbox, bản đồ, admin).
- Chỉ đổi cách trình bày; không bịa nội dung, số liệu, khuyến mãi. Thực Đơn không dùng ảnh.

## 2. Ý tưởng chủ đạo
Trailer phim về cao nguyên: rừng tối sâu, sương, ánh lửa củi cam rực, chữ khổng lồ táo bạo, lưới kẻ mảnh như bản vẽ kỹ thuật. Tương phản mạnh giữa **đen rừng** và **cam than hồng**.

Ngôn ngữ thiết kế dùng xuyên suốt:
1. Chữ khổng lồ, ép (condensed), in đậm, cắt cạnh màn hình.
2. Lưới kẻ mảnh 1px lộ ra, có dấu "+" tại giao điểm.
3. Góc vát 14px cho nút, thẻ, nhãn; ảnh sắc cạnh hoặc cắt chéo.
4. Nhãn mono trong ngoặc: `[01]`, `[THỰC ĐƠN]`, `11.99° N · 107.69° E`.
5. Ánh lửa: vầng sáng cam đi theo con trỏ, hạt than hồng bay.
6. Số lớn đánh dấu từng mục (01–05) và độ cao 800m+.

**5 khoảnh khắc "wow" bắt buộc có:**
1. Hero: chữ "CẨM CÙ HOUSE" khổng lồ mọc từng ký tự trên video sương, hạt than bay, vầng sáng theo chuột.
2. Intro: bộ đếm độ cao 0 → 800m rồi hai nửa màn hình tách mở.
3. Câu tuyên ngôn sáng dần từng từ theo cuộn.
4. Mục "4 giá trị" ghim và trượt ngang toàn màn hình.
5. Chân trang: chữ "CẨM CÙ HOUSE" tràn ngang, viền cam, tô đặc khi hover.

## 3. Màu sắc
| Token | Tối (mặc định) | Sáng |
| --- | --- | --- |
| `--bg` | `#0A0E0C` | `#F2EDE4` |
| `--bg-2` | `#101714` | `#E8E1D4` |
| `--pine` (khối xanh rừng) | `#123A2B` | `#1C4A38` |
| `--card` | `#131B17` | `#FBF8F2` |
| `--ink` | `#F2EDE4` | `#0A0E0C` |
| `--ink-muted` | `rgba(242,237,228,.70)` | `rgba(10,14,12,.72)` |
| `--ember` (nhấn, nút, giá) | `#FF6A2B` | `#C23B0B` |
| `--mist` (nhãn) | `#A9C4B6` | `#2F6B53` |
| `--gold` (sao) | `#E9B949` | `#9A6B00` |
| `--line` | `rgba(242,237,228,.14)` | `rgba(10,14,12,.16)` |

- Tỉ lệ 70% nền · 20% chữ · 8% ember · 2% mist/vàng. Ember chỉ dùng cho nút chính, giá, số lớn, gạch nhấn, vầng sáng.
- Nút chính: nền ember, chữ `#0A0E0C` (tối) / `#FFFFFF` (sáng). Nút phụ: viền 1px ink, hover quét nền từ trái sang.
- Tương phản chữ ≥ 4.5:1, icon/viền ≥ 3:1, kiểm tra cả hai chế độ. Chữ trên ảnh/video có lớp phủ tối .45–.65.

## 4. Chữ
| Vai trò | Phông |
| --- | --- |
| Tiêu đề, chữ khổng lồ | **Bricolage Grotesque** (wdth 75–100), weight 700–800, viết hoa ở Display |
| Cụm nhấn trong tiêu đề | **Fraunces** italic, màu ember (một cụm mỗi tiêu đề) |
| Nội dung, giao diện | **Be Vietnam Pro** 400/500/600 |
| Nhãn, số, tọa độ | **JetBrains Mono** 12–13px, viết hoa |

Tải bằng `next/font`, subset `vietnamese` + `latin-ext`, `display: swap`.

| Cấp | Cỡ |
| --- | --- |
| Display | clamp(64px, 17vw, 280px), dòng .95 |
| H1 | clamp(44px, 8vw, 120px) |
| H2 | clamp(32px, 5vw, 72px) |
| H3 | 24–32px |
| Nội dung | 17–18px / 1.7 (≤ 62 ký tự/dòng) |
| Chữ phụ | 15px (tối thiểu 14px) |

- Số dùng `lining-nums tabular-nums`; tiêu đề `text-wrap: balance`; không ngắt giữa "Mộc Mạc", "Cẩm Cù", "Gia Nghĩa" (`&nbsp;`).
- Mask hiện chữ có padding-top ≥ .4em, không cắt dấu ("CẨM", "CÙ", "Đắk Nông").

## 5. Hình ảnh
- Phong cách: tương phản cao, bóng sâu, vùng sáng ấm, hạt phim 5%; ảnh tràn viền (full-bleed) là chủ đạo. Chỉ dùng 30 ảnh hiện có, `alt` VN/EN.
- Khung: chữ nhật sắc cạnh hoặc cắt chéo (clip-path, góc vát 14–24px); viền 1px và dấu "+" ở 4 góc cho ảnh nổi bật; nhãn mono dưới ảnh `[03/30] Tên ảnh`.
- Hiệu ứng ảnh: hiện bằng clip-path chéo; hover phóng 1.05 + phủ ember 15% + hiện tên.
- Skeleton/blur-up mọi ảnh, không bao giờ có ô trống; WebP/AVIF, đặt sẵn kích thước.
- Video hero 10–12 giây lặp (sương trên suối, khói ly cà phê, nắng xuyên tán lá), ≤ 4MB, có ảnh poster; chưa có thì dùng ảnh hero + Ken Burns + hạt sương canvas.
- Nên quay/chụp thêm: video hero, cận cảnh rót cà phê muối, rang củi, hạt cà phê, hoa Hoya macro, ảnh chia sẻ 1200x630.

## 6. Lưới & thành phần
- Lưới 12 cột, container 1360px, lề 20px (mobile) / 56px (desktop); section cách nhau 128px (desktop) / 80px (mobile).
- Thẻ: nền `--card`, viền 1px, góc vát 14px, padding 32px, không khung lồng khung; hover viền ember + vầng sáng.
- Nút: góc vát, cao ≥ 52px, chữ 600 16px + mũi tên →, từ tính (magnetic) trên desktop.
- Icon nét 1.5px một màu. Đường kẻ mảnh thay cho khung.
- Cursor (desktop): chấm 10px + vầng sáng ember 160px đi trễ; rê vào ảnh hiện vòng "XEM"/"KÉO". Grain toàn trang 4%.

## 7. Thành phần dùng chung
1. **Thanh trên cùng** (mono 12px): `● ĐANG MỞ CỬA · ĐÓNG LÚC 18:00 HÔM NAY · 23°C`. Chỉ một nơi hiển thị trạng thái, đọc từ một nguồn giờ.
2. **Header**: trong suốt đè hero, thành nền mờ kính khi cuộn; logo hoa Hoya + "CẨM CÙ HOUSE"; 5 liên kết có số `01 Trang Chủ`… (hover: xáo chữ 0.3s, gạch ember vẽ nét); VN/EN, đổi sáng/tối, nút **GỌI NGAY** ember. Ẩn khi cuộn xuống, hiện khi cuộn lên.
3. **Menu mobile**: toàn màn hình, 5 liên kết Display 56px trượt lên lần lượt; dưới cùng Gọi · Zalo · Chỉ đường.
4. **Thanh liên hệ cố định mobile**: Gọi · Zalo · Chỉ đường, cao 56px.
5. **Chỉ báo cuộn** (desktop): vạch dọc mảnh bên phải + số mục `02/07`.
6. **Chân trang**: nền `--bg-2`; chữ "CẨM CÙ HOUSE" tràn ngang viền ember; 4 cột kẻ ô (thương hiệu + tọa độ · điều hướng · giờ & hotline · địa chỉ & kết nối); hàng cuối: bản quyền · Lên đầu trang ↑ · dòng thiết kế. Không có link Quản Trị Viên công khai.

## 8. Thiết kế từng trang

### 8.1 Trang Chủ
1. **Hero** (toàn màn hình): video/ảnh phủ tối; chữ Display "CẨM CÙ HOUSE" tràn ngang ở đáy, mọc từng ký tự mờ → nét; nhãn tọa độ; "Chốn Dừng Chân Mộc Mạc *Bên Bờ Suối Đá*" (cụm cuối Fraunces italic ember); mô tả; 2 nút (Khám Phá Góc Suối / Xem Thực Đơn 50+ Món). Bên phải: thẻ kính mờ góc vát (trạng thái mở cửa, giờ hôm nay, nhiệt độ, Gọi + Chỉ đường). Vầng ánh lửa theo chuột, chỉ báo "CUỘN".
2. **Dải chữ chạy** (nền ember, chữ đen mono, hai chiều ngược nhau): ROBUSTA RANG CỦI · SUỐI ĐÁ · 800M+ · 100% ĐỀ XUẤT HÀI LÒNG · GIÁ BÌNH DÂN 20K–45K · NGUYÊN LIỆU XANH SẠCH.
3. **Tuyên ngôn** "Nơi thời gian lắng lại cùng tiếng suối róc rách": cỡ H2, từng từ sáng dần theo cuộn; 2 ảnh cắt chéo parallax; nút "Đọc trọn vẹn câu chuyện →".
4. **Chỉ số**: 3 ô kẻ lưới, số Display 160px viền ember rồi tô đặc khi đếm: `800m+` · `100%` · `0 khói bụi`.
5. **Vì Sao Chọn Cẩm Cù House**: mục ghim ngang, 4 panel toàn màn hình trượt ngang theo cuộn; mỗi panel số 01–04 khổng lồ (outline ember), tiêu đề H1, mô tả, nhãn mono, ảnh cắt chéo; nền xen `--bg` / `--pine`.
6. **Góc Check-in & Thư Thái Tự Nhiên**: lưới bento 12 cột (ô 2×2, 1×1, 1×2 so le); link "Xem toàn bộ 30+ góc ảnh →".
7. **Cảm nhận khách**: điểm 4.9 khổng lồ + sao vàng; hai hàng thẻ kính mờ chạy ngược chiều, dừng khi rê chuột/chạm; giữ nguyên chữ, tên, thông tin kèm theo; nút "Xem tất cả đánh giá trên Google Maps →".
8. **CTA cuối**: nền ảnh toàn màn hình, Display "GHÉ CẨM CÙ HOUSE", địa chỉ, 3 tiện ích, nút Hotline + Chỉ đường.

### 8.2 Câu Chuyện
1. Mở đầu tối: H1 "CÂU CHUYỆN CẨM CÙ" tràn ngang + "Chốn Bình Yên *Giữa Đất Ngàn*"; mô tả; 3 badge mono.
2. **Chương 01 / 02 / 03**: nửa màn hình dính (sticky): ảnh full-bleed cắt chéo cố định một bên, chữ cuộn bên kia; số chương Display outline; câu trích italic 32px vạch ember; chương lẻ ảnh trái, chẵn ảnh phải.
3. **Cảnh chữ lớn "Dưới bóng rừng Tây Nguyên…"**: nền ảnh phủ tối, chữ 56px sáng dần từng từ, từ chưa sáng vẫn ≥ 3:1.
4. **Lời hẹn ước**: Display + 2 nút, nền `--pine`.

### 8.3 Không Gian Suối
1. H1 "KHÔNG GIAN SINH THÁI, BÊN BỜ SUỐI ĐÁ" (không ngắt giữa cụm) + thẻ chỉ số 22°C–26°C · Đá Bazan Cổ.
2. Chuyển chế độ `[LƯỚI] [PHIM]` + thanh lọc 5 chip dính trên cùng.
3. **Lưới**: bento 30 ảnh, tên tối đa 2 dòng trên gradient đáy ảnh, lọc FLIP .45s, skeleton.
4. **Phim**: trình chiếu toàn màn hình, ảnh tràn viền, chuyển bằng cuộn/vuốt/phím ← →, số `[03/30]`, Esc quay lại.
5. **Thanh Âm Suối**: thanh nổi dưới màn hình, nút phát ember, sóng âm canvas, mặc định tắt.
6. **Bảo Tồn Dòng Nước Suối**: khối `--pine`, 3 cam kết dạng cột kẻ lưới, 2 nút.

### 8.4 Thực Đơn (chỉ chữ, KHÔNG ảnh)
1. H1 "THỰC ĐƠN MỘC MẠC, *Thức Uống Xanh & Món Ăn Lành*" (không dấu • đầu dòng) + 3 badge mono.
2. Desktop 2 vùng: **cột trái dính** (mục lục danh mục đánh số 01–08, mục đang xem sáng ember, ô tìm kiếm kiểu bảng lệnh Ctrl+K, tìm không dấu); **cột phải** danh sách theo nhóm.
3. **Món được yêu thích nhất**: khung `--pine` góc vát, nhãn `[SIGNATURE]`, tên món Display 64px, mô tả, giá ember, nút Gọi hotline.
4. **Mỗi món là một hàng kẻ mảnh**: tên 20px 600 · khoảng trống · giá (JetBrains Mono 700 18px, ember); dòng dưới mô tả 15px; hover: hàng sáng nhẹ, vầng ember chạy ngang, giá trượt 6px; món "Tạm hết" mờ + gạch. Giữ đủ 67 món.
5. **Cam Kết Từ Bếp & Quầy Bar Cẩm Cù**: băng ngang ember chữ đen, 2 nút.
6. Mobile: mục lục thành chip cuộn ngang dính trên đầu, một cột.

### 8.5 Chỉ Đường & Liên Hệ
1. H1 "TỪ GIA NGHĨA, CẨM CÙ HOUSE *Chờ Đón Bạn*"; địa chỉ đầy đủ cỡ H3; tọa độ mono.
2. Hai cột: trái **bản đồ lớn** (lọc tối đồng bộ chế độ, nút "Mở Google Maps" ember); phải: **Hotline** số 64px (gọi, sao chép, Zalo), **Giờ mở cửa** (bảng 7 ngày kẻ mảnh, hôm nay nền ember 14% + nhãn `HÔM NAY`), **Kênh truyền thông** (Facebook, TikTok, YouTube).
3. **Cách đến quán**: các bước 01–03 theo nội dung hiện có (đường bê tông, bãi đỗ xe, lối vào Hẻm 437), nét đứt nối các bước.
4. **CTA cuối**: Display "HẸN GẶP BẠN BÊN BỜ SUỐI", Hotline + Chỉ đường.

## 9. Hiệu ứng
**Intro** (1 lần/phiên, ≤ 3.5s, "Bỏ qua" + Esc, phát `camcu:intro-done`): màn hình đen → đường kẻ ember vẽ ngang → "CẨM CÙ HOUSE" hiện ký tự mờ → nét → bộ đếm mono **000 → 800 m** cùng vạch tiến độ → hai nửa màn hình tách dọc mở ra hero.

**Chuyển trang**: 5 cột dọc (pine / ember / bg) quét lên theo thứ tự (stagger .06s), giữa hiện số trang + tên trang Display; ≤ 1s; cuộn về đầu; Back giữ vị trí; dự phòng cross-fade .3s.

**Cuộn**: Lenis (1.1s); chữ khổng lồ mọc ký tự; chữ sáng dần theo từ; ảnh hiện bằng clip-path chéo; parallax (.15/.3/.5); mục ghim ngang; đếm số; marquee tăng tốc theo vận tốc cuộn; đường lưới và dấu "+" hiện dần.

**Tương tác**: vầng ánh lửa theo chuột; nút từ tính + quét nền; xáo chữ ở menu; thẻ nghiêng 4° theo chuột; đổi sáng/tối bằng vòng tròn mở từ nút; toast khi sao chép số.

**Quy tắc**: chỉ animate `transform`/`opacity`/`clip-path`; không animation > 1s ngoài intro/hero; `prefers-reduced-motion` tắt parallax, scrub, marquee, xáo chữ, vầng sáng; mobile giảm parallax 50%, tắt cursor/tilt, mục ghim ngang thành cuộn vuốt.

## 10. Chế độ sáng, responsive, hiệu năng
- Sáng: nền `#F2EDE4`, chữ đen rừng, ember đậm `#C23B0B`; hero và khối `--pine` giữ tối để giữ chất điện ảnh.
- Mốc 390 / 768 / 1024 / 1440; mobile 1 cột, bento 2 cột, chữ Display co theo `vw`.
- Vùng bấm ≥ 48px, vòng focus rõ, bàn phím đầy đủ, `alt` đúng.
- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95, CLS < 0.05, LCP < 2.5s. Video hero tải sau poster, tắt khi `saveData`; tải lười intro/GSAP/bản đồ.

## 11. Lộ trình giao việc
| Bước | Nội dung | Nghiệm thu |
| --- | --- | --- |
| 1 | Backup, tokens màu/chữ/lưới, font, sáng/tối, nút/thẻ góc vát, cursor, grain | Tương phản đạt cả hai chế độ; không còn giá trị tự đặt |
| 2 | Header, menu mobile, thanh trên cùng, chân trang, thanh liên hệ, chỉ báo cuộn | Một nguồn trạng thái; không lặp "Đã đóng cửa" |
| 3 | Trang Chủ + Câu Chuyện | Nội dung khớp 100%; không cắt dấu; 60fps |
| 4 | Không Gian Suối (Lưới + Phim) + Thực Đơn (chỉ chữ) | Đủ 67 món/30 ảnh; lọc, tìm, xem ảnh tốt; không ô trống |
| 5 | Chỉ Đường & Liên Hệ | Giờ hôm nay đúng; Gọi/Zalo/Chỉ đường hoạt động |
| 6 | Intro, chuyển trang, hiệu ứng cuộn, tương tác | Đúng mục 9; reduced-motion hoạt động; mượt trên mobile tầm trung |
| 7 | Kiểm tra: console sạch, không 404, axe-core, Lighthouse, chính tả, so khớp nội dung trước/sau | QA_REPORT.md, sửa hết lỗi Nặng và Vừa |

Trang quản trị (admin.camcuhouse.online) dùng lại token màu và chữ ở mục 3–4.

## 12. Cần chủ quán xác nhận / cung cấp
- Nguồn các đánh giá đang hiển thị (Google hay nhập tay); nhãn "Đánh giá được xác minh trên Google Maps" chỉ giữ khi dữ liệu thật sự lấy từ Google.
- Video hero và ảnh chụp thêm (mục 5).
- Đồng ý chuyển phong cách sang "điện ảnh tối + cam lửa", góc vát, chữ khổng lồ.
