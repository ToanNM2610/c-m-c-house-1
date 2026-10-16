# CẨM CÙ HOUSE: BẢN SOẠN THẢO HỆ THỐNG WEBSITE HOÀN CHỈNH

Tài liệu này mô tả **toàn bộ hệ thống** (website công khai + quản trị + dữ liệu + vận hành). Giao diện chi tiết xem `CAMCU_MASTER_PROMPT.md` và `CAMCU_DESIGN_BRIEF.md`. Nếu mâu thuẫn, tài liệu này quyết định về kiến trúc và dữ liệu; hai file kia quyết định về giao diện.

## 1. Nguyên tắc & ràng buộc

1. **Không đổi thông tin quán**: tên "Cẩm Cù House" (luôn có dấu, kể cả bản EN), địa chỉ Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa, Đắk Nông; tọa độ 11.99° N, 107.69° E; giờ Thứ 2–5: 07:00–18:00, Thứ 6–CN: 07:00–22:00; hotline 038 285 1688 (Zalo), 077 465 9000; email; mạng xã hội; 67 món (tên, mô tả, giá, nhãn, danh mục); 30 ảnh không gian; mọi văn bản VN/EN. Chỉ chuyển dữ liệu sang hệ thống mới, **không sửa nội dung**.
2. **Tự vận hành**: quán không có người trực web. Không đặt bàn, không đặt món, không giỏ hàng, không trả lời đánh giá trên web. Khách chỉ Gọi / Zalo / Chỉ đường.
3. Chỉ một tài khoản chủ quán. Không phân quyền nhân viên.
4. Thực Đơn công khai **không dùng ảnh**.
5. Làm thẳng trên code hiện tại, không nhánh, không PR; có commit "backup trước khi làm lại hệ thống".
6. Mọi thao tác của chủ quán phải làm được trên điện thoại trong ≤ 3 lần chạm.

## 2. Kiến trúc tổng thể

```
Khách ──► camcuhouse.online ──┐
                              ├─► Next.js (App Router, TypeScript) trên Vercel
Chủ quán ► admin.camcuhouse.online ─┘      │
                                           ├─► Postgres (Neon) qua Drizzle ORM
                                           ├─► Object storage (Vercel Blob) cho ảnh
                                           ├─► Google Places API (đồng bộ đánh giá, cron)
                                           └─► Vercel Analytics, Sentry, Cron
```

- **Một ứng dụng, hai host**: middleware đọc `host`; `admin.*` rewrite sang nhóm route `(admin)` có **layout riêng hoàn toàn** (không header, thanh trạng thái, chuyển trang của site công khai). `www`/gốc dùng nhóm `(public)`. Admin không bao giờ link sang route công khai bằng đường dẫn tương đối.
- **Render**: trang công khai dùng ISR + `revalidateTag`; khi chủ quán lưu thay đổi, gọi revalidate đúng tag (`menu`, `gallery`, `settings`, `reviews`, `announcement`). Trạng thái mở/đóng tính ở client mỗi phút từ dữ liệu giờ (không chờ ISR).
- **i18n**: `next-intl`, route `/` (VN mặc định) và `/en`, `hreflang`, nút đổi ngôn ngữ giữ nguyên trang đang xem.

## 3. Công nghệ chốt

| Lớp | Lựa chọn |
| --- | --- |
| Framework | Next.js App Router + TypeScript (giữ phiên bản đang dùng, nâng lên bản ổn định mới nhất nếu không phá vỡ) |
| DB | Postgres (Neon) + Drizzle ORM + migration có phiên bản |
| Xác thực | Auth.js (credentials) + TOTP 2FA, cookie httpOnly/secure/sameSite=lax |
| Ảnh | Vercel Blob + `next/image`; sinh `blurDataURL`; nén phía client trước khi tải |
| Kiểm tra dữ liệu | Zod ở mọi server action/API |
| Giao diện | CSS variables (tokens) + Tailwind; font bằng `next/font` (Playfair Display, Quicksand; subset vietnamese + latin-ext) |
| Chuyển động | GSAP 3.12.5 + Lenis (npm), Framer Motion hoặc View Transitions cho chuyển trang |
| Quan sát | Vercel Analytics (sự kiện: bấm Gọi, Zalo, Chỉ đường), Sentry, kiểm tra uptime |
| Kiểm thử | Vitest (đơn vị), Playwright (e2e + ảnh chụp), Lighthouse CI |
| Sao lưu | Neon point-in-time restore + xuất JSON hằng tuần vào Blob (cron) |

Nếu hệ thống hiện tại đã dùng một DB/Auth/Storage tương đương và chạy ổn, **giữ và chuyển dần** thay vì thay mới; báo cáo lựa chọn ở Giai đoạn 0.

## 4. Mô hình dữ liệu

- `settings` (1 dòng): tên quán, mô tả ngắn, địa chỉ, tọa độ, hotline1, hotline2, zalo, email, link Facebook/TikTok/YouTube, link Google Maps, múi giờ `Asia/Ho_Chi_Minh`.
- `opening_hours`: `weekday (0–6)`, `open_time`, `close_time`, `is_closed`.
- `closures`: `date_from`, `date_to`, `reason_vi`, `reason_en` (nghỉ lễ/đột xuất).
- `status_override`: `mode` (`auto` | `open` | `closed` | `closing_early`), `until` (thời điểm tự hết hạn, bắt buộc với chế độ thủ công).
- `announcement`: `text_vi`, `text_en`, `is_active`, `link` (tối đa 1 thông báo đang bật).
- `menu_categories`: `id`, `slug`, `name_vi`, `name_en`, `sort`.
- `menu_items`: `id`, `category_id`, `name_vi`, `name_en`, `desc_vi`, `desc_en`, `price` (số nguyên VNĐ), `badges[]` (`signature`, `new`), `is_available`, `is_featured`, `sort`, `updated_at`.
- `media_assets`: `id`, `url`, `width`, `height`, `blur_data_url`, `alt_vi`, `alt_en`, `bytes`, `created_at`.
- `gallery_items`: `asset_id`, `category` (bờ suối / hiên gỗ & chòi mộc / check-in & cảnh quan / bàn ghế làm việc & đọc sách), `title_vi`, `title_en`, `caption_vi`, `caption_en`, `sort`, `is_published`.
- `reviews`: `source` (`google`), `external_id`, `author`, `rating`, `text`, `published_at`, `source_url`, `synced_at`.
- `content_blocks`: `page`, `key`, `value_vi`, `value_en` (toàn bộ chữ cố định của 5 trang: tiêu đề, mô tả, 4 thẻ "Vì Sao Chọn", câu chuyện, cam kết…).
- `admin_users`: `email`, `password_hash`, `totp_secret`, `last_login`.

## 5. Hệ thống trạng thái mở/đóng (một nguồn duy nhất)

- Hàm `getStatus(now)` ở `lib/status.ts`, dùng cho **mọi nơi**: thanh trên cùng, chip hero, trang Liên Hệ, chân trang, banner admin.
- Thứ tự ưu tiên: `status_override` còn hiệu lực → `closures` → `opening_hours`.
- Trả về `{ state: 'open' | 'closing_soon' | 'closed', label_vi, label_en, closes_at, opens_at }`. `closing_soon` khi còn ≤ 30 phút.
- Chế độ thủ công luôn có `until`; hết hạn tự quay về `auto`.
- Có test đơn vị cho: sát giờ mở/đóng, qua nửa đêm, Thứ 6–CN, ngày nghỉ, override hết hạn, múi giờ.
- Hiển thị: một thanh trên cùng 13px duy nhất; các nơi khác chỉ hiện giờ, không lặp chữ "Đã đóng cửa".

## 6. Website công khai

Routes: `/`, `/about` (Câu Chuyện), `/space` (Không Gian Suối), `/menu` (Thực Đơn), `/contact` (Chỉ Đường & Liên Hệ), `/en/...`, `/sitemap.xml`, `/robots.txt`, `404` và `500` thiết kế theo thương hiệu.

- Nội dung lấy từ `content_blocks`, `menu_*`, `gallery_items`, `reviews`, `settings`; không còn chữ cố định rải trong component.
- **Thực Đơn**: lọc theo danh mục + tìm kiếm không dấu (không phân biệt "ca phe" / "cà phê") ở client; 67 món; không ảnh; món `is_available = false` hiện nhãn "Tạm hết" và làm mờ.
- **Không Gian Suối**: ảnh từ `gallery_items`, lọc theo danh mục, lightbox, skeleton, tải lười; tham quan 360° là giai đoạn mở rộng.
- **Đánh giá**: chỉ hiển thị từ bảng `reviews`. Nhãn "Đánh giá từ Google Maps" chỉ hiện khi dữ liệu được đồng bộ từ Google; nếu chủ quán nhập tay thì dùng nhãn "Lời khách ghé quán". Điểm sao và số lượt tính từ dữ liệu thật; không có dữ liệu thì ẩn mục.
- **Liên Hệ**: nút Gọi `tel:`, Zalo, Chỉ đường; bản đồ nhúng tải khi vào khung nhìn, lọc tối ở chế độ tối.
- **Sự kiện đo lường**: `click_call`, `click_zalo`, `click_directions`, `view_menu`.
- Giao diện, chuyển động, intro, chuyển trang: theo `CAMCU_MASTER_PROMPT.md`.

## 7. Trang quản trị (admin.camcuhouse.online)

Layout riêng, ưu tiên mobile. Mục:

1. **Tổng quan**: trạng thái hiện tại, ô chọn "Tự động / Mở / Đóng / Đóng sớm" (có giờ hết hạn), số lượt bấm Gọi/Zalo/Chỉ đường 7 ngày (từ Analytics), thông báo đang bật, lối tắt "Tạo thông báo", "Báo tạm hết món". Chỉ số liệu thật.
2. **Thực Đơn**: danh sách 67 món, tìm kiếm, lọc danh mục, công tắc Còn/Hết (xanh/xám, hoàn tác 10 giây), sửa tên/mô tả/giá/nhãn (VN + EN), thêm/xóa/kéo thả thứ tự, nhập/xuất CSV.
3. **Thư Viện Ảnh**: tải nhiều ảnh (kéo thả, nén tự động, sinh blur), gắn danh mục, sửa tên/mô tả (VN + EN), kéo thả thứ tự, ẩn/hiện, xóa (xác nhận).
4. **Cài Đặt Cửa Hàng**: giờ từng ngày, ngày nghỉ, thông tin liên hệ, mạng xã hội, một thông báo đầu trang (bật/tắt).
5. **Nội dung trang** (chỉ sửa chữ, không sửa bố cục): các `content_blocks`, có xem trước.
6. **Tài khoản & bảo mật**: đổi mật khẩu, bật/đặt lại 2FA, mã khôi phục.

Quy tắc chung: lưu = đăng ngay + `revalidateTag`; mọi form dùng Zod; thông báo thành công/lỗi rõ ràng; không hiện số liệu mẫu; không link công khai gây 404; `noindex, nofollow`.

## 8. Bề mặt API / Server actions

- Công khai (cache): `GET /api/status`, `GET /api/menu`, `GET /api/gallery`, `GET /api/reviews`, `GET /api/health`.
- Quản trị (cần phiên + 2FA): `menu.*` (tạo/sửa/xóa/đổi thứ tự/đổi trạng thái), `gallery.*` (tải lên/sửa/xóa/sắp xếp), `settings.update`, `hours.update`, `closures.*`, `override.set`, `announcement.set`, `content.update`, `export.json`.
- Mọi API có giới hạn tần suất; mọi đầu vào qua Zod; lỗi trả mã và thông điệp thống nhất.

## 9. Đồng bộ đánh giá Google

- Cron hằng ngày gọi Google Places API (Place Details), lưu vào `reviews`; khóa API đặt trong biến môi trường, giới hạn theo domain/IP.
- API lỗi hoặc hết hạn mức: giữ dữ liệu cũ, không xóa, ghi lỗi vào Sentry.
- Chỉ hiển thị nội dung có nguồn thật; không tự viết, không sửa chữ của khách.

## 10. Bảo mật

- Mật khẩu băm (argon2/bcrypt), 2FA TOTP bắt buộc, khóa tạm sau 5 lần sai, phiên hết hạn 7 ngày, đăng xuất mọi thiết bị.
- CSP, `X-Frame-Options`, `Referrer-Policy`, HSTS; CSRF cho server actions; kiểm tra loại và dung lượng ảnh (tối đa 10 MB, chỉ jpg/png/webp/avif).
- Bí mật chỉ ở biến môi trường Vercel; không commit khóa; `.env.example` đầy đủ.
- Không để lộ liên kết admin ở website công khai; `robots.txt` chặn admin; admin `noindex`.

## 11. SEO & chia sẻ

- `generateMetadata` từng trang (VN + EN), canonical, `hreflang`; sửa lỗi chính tả mô tả chia sẻ.
- Ảnh chia sẻ 1200x630 tạo bằng `opengraph-image` cho từng trang; `twitter:card = summary_large_image`.
- Schema.org: `Restaurant/CafeOrCoffeeShop` (địa chỉ, tọa độ, giờ mở, điện thoại), `Menu`, `AggregateRating` (chỉ khi có dữ liệu thật).
- Từ khóa địa phương trong tiêu đề/mô tả: quán cà phê Gia Nghĩa, cà phê view suối Đắk Nông.
- `sitemap.xml` tự cập nhật; liên kết Google Business Profile ở Liên Hệ.

## 12. Hiệu năng, truy cập, quan sát

- Mục tiêu mobile: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95, CLS < 0.05, LCP < 2.5s, JS ban đầu hợp lý (tải lười intro, 360°, bản đồ, GSAP nặng).
- Ảnh WebP/AVIF, `srcset`, đặt sẵn kích thước, skeleton; font có `display: swap`.
- Tương phát ≥ 4.5:1 ở **cả chế độ tối và sáng**; `prefers-reduced-motion`; vùng bấm ≥ 44px; điều hướng bàn phím; `alt` đúng.
- Sentry cho lỗi trình duyệt và máy chủ; uptime check cho `/api/health`; cảnh báo khi cron đồng bộ lỗi.

## 13. Di chuyển dữ liệu (không đổi nội dung)

1. Trích toàn bộ dữ liệu hiện có (thực đơn, ảnh, chữ các trang, giờ, liên hệ, đánh giá) ra file JSON gốc trước khi sửa.
2. Viết script `seed` nạp vào DB **nguyên văn**, không chỉnh sửa chữ/giá/dấu.
3. Kiểm tra bằng test so khớp: số món = 67, số ảnh = 30, từng tên/giá/mô tả khớp 100% với file gốc, văn bản VN/EN khớp.
4. Chụp ảnh trước/sau của 5 trang (desktop 1440 + mobile 390, tối + sáng, VN + EN) để đối chiếu.
5. Chỉ chuyển sang đọc từ DB khi bước 3 đạt 100%.

## 14. Kiểm thử

- Đơn vị: `getStatus`, định dạng giá, tìm kiếm không dấu, validate Zod.
- E2E (Playwright): đổi trạng thái mở/đóng trong admin → web cập nhật; bật/tắt món → thực đơn cập nhật; tải ảnh → xuất hiện đúng danh mục; đổi VN/EN; đổi sáng/tối; chuyển trang; tìm kiếm thực đơn; đăng nhập 2FA; truy cập admin khi chưa đăng nhập bị chặn.
- Ảnh chụp so sánh: 5 trang × 2 chế độ × 2 ngôn ngữ × 2 kích thước.
- Lighthouse CI chạy mỗi lần đẩy lên `main`; không đạt ngưỡng thì báo lỗi.

## 15. Lộ trình giao việc (mỗi giai đoạn đạt tiêu chí mới sang tiếp)

| GĐ | Nội dung | Tiêu chí nghiệm thu |
| --- | --- | --- |
| 0 | Kiểm tra hiện trạng, sao lưu, xuất dữ liệu gốc, báo cáo lựa chọn công nghệ | Có file JSON gốc + báo cáo; commit backup |
| 1 | Nền tảng: DB, migration, seed, tách `(public)`/`(admin)` theo host, `getStatus` | Test so khớp dữ liệu 100%; admin không còn header công khai; hết 404 |
| 2 | Hệ thiết kế: tokens, font, thành phần dùng chung, chế độ sáng/tối | Tương phản đạt ở cả hai chế độ; không còn cỡ chữ/màu tự đặt |
| 3 | 5 trang công khai theo thiết kế + i18n | Nội dung khớp bản gốc; không ô trống, không cắt dấu; VN/EN đúng |
| 4 | Admin hoàn chỉnh (mục 7) + 2FA | Chủ quán làm đủ việc chính trên mobile; thay đổi hiện ngay trên web |
| 5 | Đồng bộ đánh giá Google + sự kiện đo lường | Dữ liệu thật; lỗi API không làm hỏng trang |
| 6 | Chuyển động, intro, chuyển trang, cuộn | Theo `CAMCU_MASTER_PROMPT.md`; reduced-motion hoạt động |
| 7 | SEO, hiệu năng, bảo mật, kiểm thử, bàn giao | Lighthouse đạt ngưỡng; e2e xanh; tài liệu hướng dẫn |

## 16. Ngoài phạm vi

Đặt bàn, đặt món, thanh toán, giỏ hàng, tài khoản khách, blog, đa chi nhánh, ứng dụng di động, chatbot. Tham quan 360° là hạng mục mở rộng sau Giai đoạn 7 nếu có ảnh 360.
