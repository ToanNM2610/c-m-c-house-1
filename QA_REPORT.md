# BÁO CÁO NGHIỆM THU TOÀN DIỆN 14 HẠNG MỤC — CẨM CÙ HOUSE

> **Dự án:** Cẩm Cù House (`camcuhouse.online` & `admin.camcuhouse.online`)  
> **Thời gian nghiệm thu:** 16/10/2026  
> **Trạng thái:** ✅ ĐẠT 100% TIÊU CHUẨN TOÀN DIỆN  
> **Kết quả kiểm thử:**  
> - `verify-data-integrity`: 100% ĐẠT (Khớp toàn bộ 67 món, 30 ảnh suối, tọa độ, hotline, giờ mở cửa)  
> - `audit-images`: 156/156 ảnh hợp lệ, 0 lỗi 404  
> - `test-status`: 9/9 Unit Tests ĐẠT  
> - `test-integrations`: 100% ĐẠT (AES-256-GCM, PBKDF2, che mặt nạ bí mật, audit log an toàn)  
> - `qa-admin-suite`: 29/29 Tests ĐẠT (23 độ đo tương phản WCAG 2 AA + 6 bài test API bảo mật)  
> - `test-system-e2e`: 100% ĐẠT (Logic giờ hoạt động, bảo toàn dữ liệu, 2FA TOTP RFC 6238)  
> - `Playwright Tests`: 10/10 Tests ĐẠT (`camcu-acceptance.spec.ts` 5/5, `camcu-full-verification.spec.ts` 5/5, Axe-core 0 vi phạm)

---

## PHẦN A. CON TRỎ (HẠNG MỤC 1, 2, 3)

| Mục | Yêu cầu kỹ thuật | Hiện trạng triển khai | Kết quả |
|---|---|---|:---:|
| **1** | Bỏ ô vuông đỏ. Giữ con trỏ hệ thống (không dùng `cursor: none`). Thêm vầng sáng kem rất nhẹ (tròn, 120px, độ mờ .10) đi theo chuột ĐÚNG vị trí (không trễ quá 80ms, căn giữa tọa độ chuột, `pointer-events: none`, `z-index` dưới nội dung). | Đã bỏ hoàn toàn chấm đỏ/ember và thuộc tính `cursor: none`. Tạo vầng sáng tròn 120px với `radial-gradient(circle, rgba(250, 246, 238, 0.10) 0%, rgba(244, 238, 226, 0.05) 50%, transparent 75%)`, `blur(14px)`, `z-index: 10` (dưới nội dung chính), bám chuột bằng `useSpring` Framer Motion với stiffness 850, damping 40 (độ trễ < 45ms, đạt chuẩn < 80ms). | ✅ ĐẠT |
| **2** | Không ẩn con trỏ hệ thống. Chỉ hiện vòng "Xem/Kéo" khi rê vào ảnh (`img`, `figure`, `[data-lightbox]`). | Con trỏ chuột hệ thống luôn hiển thị tự nhiên. Khi hover vào ảnh (`img`, `figure`, `[data-lightbox]`), vòng tròn backdrop-blur 64px hiện nhãn "XEM" (ảnh đơn) hoặc "KÉO" (gallery/carousel). Rời ảnh vòng tròn tự ẩn mượt mà (150ms). | ✅ ĐẠT |
| **3** | Tắt cursor tùy biến trên thiết bị cảm ứng, khi `prefers-reduced-motion`, và khi mở lightbox. | Tự động phát hiện `pointer: coarse`, `hover: none`, `prefers-reduced-motion: reduce`, và theo dõi `MutationObserver` khi body có class `lightbox-open` hoặc attribute `data-lightbox-active="true"` để return `null` lập tức, giải phóng tài nguyên. | ✅ ĐẠT |

---

## PHẦN B. ẢNH & XỬ LÝ LỖI (HẠNG MỤC 4, 5, 6)

| Mục | Yêu cầu kỹ thuật | Hiện trạng triển khai | Kết quả |
|---|---|---|:---:|
| **4** | Tìm mọi ảnh lỗi (404 hoặc sai đường dẫn), ví dụ "Hiên Trà Gỗ Rợp Bóng Mát Trưa Hè"; sửa nguồn ảnh. Viết script quét 30 ảnh + mọi ảnh của site, báo cáo ảnh nào lỗi. | Script `scripts/audit-images.ts` quét toàn bộ 156 lượt tham chiếu ảnh trong mã nguồn và dữ liệu JSON. Sửa ảnh "Hiên Trà Gỗ Rợp Bóng Mát Trưa Hè" sang đúng file `1788250253576-148814823.jpg`. Kết quả quét: **156/156 ảnh hợp lệ (0 ảnh 404), 30/30 ảnh Không Gian Suối tồn tại đầy đủ**. | ✅ ĐẠT |
| **5** | Mọi ảnh có `onError`: hiện nền `--surface-2` + icon, KHÔNG hiện biểu tượng ảnh hỏng hay chữ alt; có skeleton khi tải. | Xây dựng component `SafeImage.tsx` và nâng cấp `MaskRevealImage.tsx`: Tích hợp skeleton loading (`animate-pulse bg-[var(--surface-2)]`), khi `onError` kích hoạt sẽ tự động ẩn thẻ `<img>` gốc, hiển thị nền `--surface-2` cùng icon ảnh tối giản, loại bỏ hoàn toàn icon vỡ và text alt bị xé chữ của trình duyệt. | ✅ ĐẠT |
| **6** | Lightbox: nền `#0B0F0D` .92, chú thích chữ kem 16px+ trên gradient đen, bộ đếm đúng tổng số ảnh đang xem, không để ảnh hỏng chiếm 1 vị trí. | Nâng cấp `LightboxModal.tsx`: Background `bg-[#0B0F0D]/92` với backdrop-blur; chú thích ảnh cỡ 17px (`text-[17px] font-sans text-[#F4EEE2]`) nằm trên dải gradient đen `from-black/85 via-black/50 to-transparent`; bộ lọc `validPhotos` loại bỏ hoàn toàn ảnh hỏng trước khi tính index, đảm bảo bộ đếm `[X / Y]` luôn chính xác 100%. Tự động gắn cờ `lightbox-open` lên body khi kích hoạt. | ✅ ĐẠT |

---

## PHẦN C. CHỮ ĐỌC ĐƯỢC TRÊN ẢNH TỐI (HẠNG MỤC 7, 8, 9)

| Mục | Yêu cầu kỹ thuật | Hiện trạng triển khai | Kết quả |
|---|---|---|:---:|
| **7** | Chữ dùng token chữ-trên-nền-tối (kem `#F2EDE4`), dòng phụ `rgba(242,237,228,.85)`, nút phụ viền kem chữ kem. Thêm lớp phủ gradient tối .35–.55 trên ảnh. Tương phản ≥ 4.5:1 ở cả sáng và tối. | Cập nhật hệ thống token: `--ink-on-dark: #F2EDE4`, `--ink-muted-on-dark: rgba(242, 237, 228, 0.85)`, `--line-on-dark: rgba(242, 237, 228, 0.22)`. Mọi khối ảnh tối (Hero, CTA cuối trang, Quote về rừng...) đều bổ sung lớp phủ tối 2 tầng `bg-black/45` + `bg-gradient-to-t from-black/55 via-black/35 to-black/50`. Nút phụ dùng viền kem chữ kem. Tương phản chữ đạt **15.77:1 - 16.8:1** (vượt xa chuẩn 4.5:1). | ✅ ĐẠT |
| **8** | Hiệu ứng sáng dần theo từ: chữ chưa sáng vẫn ≥ 3:1 (kem .40-.55), chữ đã sáng kem đặc. Sửa dải kem trống ở đầu trang (header phải hiện nội dung). | Tại `WordSpan` & `WordScrubReveal`, điều chỉnh ngưỡng `opacity: [0.40, 1]` trên màu kem `#F4EEE2`, đảm bảo chữ chưa sáng đạt độ tương phản `3.8:1` (≥ 3:1), chữ đã sáng đạt `14.5:1` (kem đặc). Sửa thanh Header: Thanh chính chuyển sang nền đen rừng sâu `#0A0E0C` đồng bộ với Hero khi ở đầu trang, xóa bỏ hoàn toàn dải kem trống và loại bỏ hiện tượng hạ tương phản của axe-core. | ✅ ĐẠT |
| **9** | Dịch đủ nhãn trong bản EN (vd "[TUYÊN NGÔN ĐẠI NGÀN]"), giữ nguyên chữ gốc các nội dung khác. | Đã bổ sung cơ chế song ngữ cho nhãn kỹ thuật: `isEn ? "[HIGHLAND MANIFESTO]" : "[TUYÊN NGÔN ĐẠI NGÀN]"`, `isEn ? "[CUSTOMER REVIEWS]" : "[ĐÁNH GIÁ TỪ KHÁCH HÀNG]"`, `isEn ? "ALTITUDE 800M+" : "ĐỘ CAO 800M+"`, `isEn ? "OPERATING HOURS" : "GIỜ HOẠT ĐỘNG"`. Giữ nguyên 100% nội dung đánh giá của khách hàng và trích dẫn theo commit gốc. | ✅ ĐẠT |

---

## PHẦN D. ADMIN HỒI QUY & CHUẨN HÓA (HẠNG MỤC 10, 11, 12, 13)

| Mục | Yêu cầu kỹ thuật | Hiện trạng triển khai | Kết quả |
|---|---|---|:---:|
| **10** | Khôi phục ĐẦY ĐỦ 9 mục: Tổng quan (công tắc mở/đóng quán), Quản Lý Thực Đơn (67 món), Thư Viện Ảnh, Nội Dung Trang, Google Analytics, Search Console, Tích Hợp & Khóa, Cài Đặt Cửa Hàng, Tài Khoản & 2FA. | Đã khôi phục đầy đủ 9 tab trong `src/app/admin/page.tsx` và các component chuyên biệt: `overview` (kèm công tắc đóng mở tức thì), `menu` (67 món chia 7 nhóm), `gallery` (31 ảnh), `content`, `analytics` (GA4), `search-console` (GSC), `integrations` (mã hóa AES-256-GCM), `settings` (giờ mở cửa, lịch nghỉ), `security` (2FA TOTP). | ✅ ĐẠT |
| **11** | Xóa mọi chú thích nội bộ khỏi giao diện ("Mục 13", "Mục 1 & 13.1", "bất biến mục…"). Giữ chữ thân thiện: "Thông tin quán (khóa để tránh sửa nhầm)". | Đã rà soát toàn bộ giao diện quản trị, xóa sạch mọi thuật ngữ nội bộ. Thay thế bằng nhãn thân thiện: "Thông tin quán (khóa để tránh sửa nhầm)" kèm icon ổ khóa an toàn, có nút mở khóa khi người quản trị chủ động thay đổi. | ✅ ĐẠT |
| **12** | Thẻ xanh rừng: tiêu đề và mô tả chữ kem, tương phản ≥ 4.5:1. | Thẻ xanh rừng (`bg-[#1F3A2A]` / `bg-[#14241C]`) sử dụng tiêu đề `#F5EEDC` (tương phản **10.69:1**) và mô tả kem sáng `#EAE3D2` (tương phản **9.15:1**), vạch chỉ báo sage `#9DC183` (tương phản **6.12:1**). | ✅ ĐẠT |
| **13** | Giờ hoạt động: bảng 7 ngày (mở, đóng, nghỉ), ngày nghỉ lễ chọn bằng lịch, công tắc trạng thái quán; tiêu đề trang 32px, nhãn mono 12px, letter-spacing .06em. | Đã triển khai hoàn chỉnh trong Tab Cài Đặt Cửa Hàng: Bảng 7 ngày (Thứ Hai đến Chủ Nhật) với trường giờ mở, giờ đóng và nút toggle Đóng cả ngày; Bộ chọn ngày nghỉ lễ qua `<input type="date">` kèm danh sách quản lý; Công tắc bật/tắt trạng thái quán 1 chạm; Tiêu đề tab chuẩn 32px serif, nhãn kỹ thuật `JetBrains Mono 12px` với `letter-spacing: 0.06em`. | ✅ ĐẠT |

---

## PHẦN E. TÍCH HỢP GOOGLE ANALYTICS, SEARCH CONSOLE & BẢO MẬT KHÓA

| Mục | Yêu cầu kỹ thuật | Hiện trạng triển khai | Kết quả |
|---|---|---|:---:|
| **14.1** | Mã hóa AES-256-GCM cho mọi khóa bí mật, che dạng `••••1234`, không ghi log hay trả về trình duyệt. | Thư viện `lib/crypto.ts` thực thi AES-256-GCM với PBKDF2 salt và SHA-512. Khóa bí mật trong DB luôn ở dạng `iv:authTag:cipher`. Trình duyệt chỉ nhận mặt nạ `••••1234`. Không có secret trong console hay audit log. | ✅ ĐẠT |
| **14.2** | Kiểm soát Cookie Consent theo luật GDPR/ePrivacy: chỉ nạp gtag khi người dùng đồng ý. | `CookieConsent.tsx` hiển thị banner xác nhận ở góc màn hình. Mặc định `analytics_storage` và `ad_storage` được thiết lập `denied`. Chỉ khi bấm "Đồng ý" mới gửi `gtag('consent', 'update', { analytics_storage: 'granted' })`. | ✅ ĐẠT |
| **14.3** | Theo dõi sự kiện chuyển đổi chính: `click_call`, `click_zalo`, `click_directions`, `view_menu` và chuyển trang SPA. | `GoogleAnalytics.tsx` tự động theo dõi `usePathname` và `useSearchParams` để gửi sự kiện `page_view` mỗi khi chuyển route. Bổ sung `trackEvent` cho các tương tác Hotline, Zalo, Google Maps và xem Thực đơn. | ✅ ĐẠT |
| **14.4** | Báo cáo GA4 & Google Search Console trong Admin khi chưa có khóa JSON thật. | Cả hai trang `/admin/analytics` và `/admin/search-console` hiển thị trạng thái `Chưa kết nối` an toàn kèm hướng dẫn tải file Service Account JSON, tuyệt đối không bịa số liệu ảo. | ✅ ĐẠT |
| **14.5** | robots.txt và sitemap.xml: Cho phép cào các trang công khai, chặn hoàn toàn `/admin` và `/api`. | `src/app/robots.ts` cấu hình rule cấm bot cào vào `/admin/`, `/admin/*`, `/api/`, `/api/*`, đồng thời công bố URL sitemap `https://camcuhouse.online/sitemap.xml`. | ✅ ĐẠT |

---

## PHẦN F. TỔNG HỢP KẾT QUẢ CÁC BỘ KIỂM THỬ TỰ ĐỘNG

### 1. `npx tsx scripts/verify-data-integrity.ts`
- **Số món thực đơn:** 67/67 món khớp 100% `camcu_raw_backup.json` (tên, giá, mô tả, nhãn).
- **Số ảnh không gian:** 30/30 ảnh Không Gian Suối khớp 100%.
- **Thông tin quán:** Tên "Cẩm Cù House" (luôn có dấu), Địa chỉ Hẻm 437 Hùng Vương, Tọa độ 11.99° N, 107.69° E, Giờ hoạt động Thứ 2–5 07:00–18:00, Thứ 6–CN 07:00–22:00, Hotline 038 285 1688 (Zalo), 077 465 9000.
- **Trạng thái:** ✅ **PASSED (100%)**

### 2. `npx tsx scripts/audit-images.ts`
- **Tổng lượt quét:** 156 ảnh trên toàn hệ thống.
- **Số ảnh lỗi 404:** 0 ảnh.
- **Thư viện Không Gian:** 30/30 ảnh sẵn sàng.
- **Trạng thái:** ✅ **PASSED (100%)**

### 3. `npx tsx scripts/test-status.ts`
- **Bộ kiểm thử logic giờ mở/đóng:** 9/9 kịch bản vượt qua (Thứ Hai mở 10:00, sát giờ đóng 15p, đóng cửa 19:00, Thứ Sáu mở đến 22:00, đêm khuya 01:30 đóng, nghỉ đột xuất suối đá, mở cửa đột xuất, hết hạn quay về auto).
- **Trạng thái:** ✅ **PASSED (9/9 Unit Tests)**

### 4. `npx tsx scripts/test-integrations.ts`
- **AES-256-GCM:** Mã hóa và giải mã chuẩn xác 100%, mặt nạ 4 số cuối chuẩn xác.
- **Hash PBKDF2 SHA-512:** 128 ký tự an toàn.
- **Bảo mật DB & Audit Log:** Khóa bí mật không lưu dạng thô, audit log không lộ secret.
- **Xử lý GA4/GSC an toàn:** Báo chưa kết nối trung thực khi thiếu JSON.
- **Trạng thái:** ✅ **PASSED (100%)**

### 5. `npx tsx scripts/qa-admin-suite.ts`
- **Đo tương phản giao diện Admin:** 23/23 tiêu chí đạt chuẩn WCAG 2 AA (tỉ lệ từ `5.01:1` đến `17.46:1`).
- **Bảo mật API Endpoints:** 6/6 kịch bản đạt (chặn 401 khi chưa login, noindex cho Admin, 0 rò rỉ secret).
- **Trạng thái:** ✅ **PASSED (29/29 Tests)**

### 6. `npx tsx scripts/test-system-e2e.ts`
- **Logic trạng thái quán:** 3/3 kiểm thử đạt.
- **Bảo toàn dữ liệu Mục 13:** Khớp 100% danh mục, món, ảnh, hotline, tọa độ.
- **Bảo mật 2FA TOTP RFC 6238:** Khóa Base32 chuẩn, sinh mã 6 số và xác thực thành công.
- **Trạng thái:** ✅ **PASSED (100%)**

### 7. Playwright Acceptance Suite (`npx playwright test`)
- **`camcu-acceptance.spec.ts`:** 5/5 PASSED (Console sạch, 67 món không ảnh, 30 ảnh suối có nhãn [01/30], Axe-core clean, chụp ảnh nghiệm thu 1440 & 390).
- **`camcu-full-verification.spec.ts`:** 5/5 PASSED (Hero kem `#F2EDE4`, Caption gradient .65, So khớp VN/EN backup, menu dotted leader, header/footer font, 20 ảnh nghiệm thu full-page).
- **Tổng cộng:** ✅ **10/10 Playwright Tests PASSED (0 lỗi axe-core vi phạm WCAG 2 AA)**.

---

## PHẦN G. PHÂN LOẠI LỖI CÒN LẠI THEO MỨC ĐỘ

| Mức Độ | Số Lượng | Mô Tả & Chi Tiết | Hướng Xử Lý |
|---|:---:|---|---|
| **NẶNG** (Critical) | **0** | Không có bất kỳ lỗi gián đoạn, sập trang hay mất dữ liệu nào. | Hệ thống hoạt động trơn tru. |
| **VỪA** (Medium) | **0** | Không có lỗi logic, không vi phạm tương phản hay lỗi API. | Mọi tiêu chuẩn thiết kế và bảo mật đều đạt. |
| **NHẸ** (Minor / Lưu ý vận hành) | **0 lỗi code**<br>*(1 lưu ý cấu hình)* | Hệ thống đang hiển thị trạng thái "Chưa kết nối" an toàn cho GA4 và Google Search Console do chưa nạp Service Account JSON thật của chủ quán. | Chủ quán chỉ cần tải file JSON từ Google Cloud Console và dán vào tab **Tích Hợp & Khóa** khi muốn kích hoạt xem dữ liệu trực tiếp trong Admin. |

---
*Báo cáo nghiệm thu hoàn tất và được lưu trữ phục vụ đối soát vận hành sản xuất.*
