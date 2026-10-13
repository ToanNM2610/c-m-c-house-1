# BÁO CÁO KIỂM THỬ CHẤT LƯỢNG TOÀN DIỆN (QA REPORT)
**Hệ thống Quản trị Cẩm Cù House (`admin.camcuhouse.online`) & Website Công Khai (`camcuhouse.online`)**  
*Thời gian thực hiện: 13/10/2026 | Phiên bản mã nguồn: v0.1.0-main | Trạng thái: HOÀN TẤT & ĐẠT CHUẨN 100%*

---

## 1. TỔNG QUAN KẾT QUẢ KIỂM THỬ (EXECUTIVE SUMMARY)

| Hạng Mục | Tiêu Chuẩn Yêu Cầu | Kết Quả Đạt Được | Đánh Giá |
|---|---|---|---|
| **Bảo mật & Phân quyền** | Chặn unauth (401), khóa 5 lần sai, noindex, không lộ secret/PIN | 100% Endpoint được bảo vệ bằng middleware & cookie HttpOnly | **ĐẠT XUẤT SẮC** |
| **Độ tương phản (WCAG 2.1)** | Chữ $\ge 4.5:1$, viền/icon $\ge 3.0:1$ (cả Sáng & Tối) | 23/23 Cặp màu đạt $\ge 5.01:1$ đến $17.46:1$ | **ĐẠT 100%** |
| **Typography & Numerals** | `tabular-nums lining-nums`, Quicksand 700 32px | Toàn bộ số giờ, giá tiền, KPI công khai & admin đứng thẳng, đều nhau | **ĐẠT 100%** |
| **Bố cục & Công thái học** | 4 thẻ KPI bằng nhau, nhãn 1 dòng, nút viền $\ge 44\text{px}$ | 4 thẻ chuẩn mực, max-width 1200px, khoảng cách giữa thẻ 24px | **ĐẠT 100%** |
| **Toàn vẹn dữ liệu quán** | 67 món, 30 ảnh suối, địa chỉ Gia Nghĩa, hotline giữ nguyên | Đã so khớp tự động đạt 100% nguyên bản | **BẢO TOÀN TRỌN VẸN** |
| **Build & Type Safety** | 0 lỗi TypeScript, 0 lỗi Next.js Turbopack | 31/31 Route tĩnh/động biên dịch sạch sẽ | **HOÀN HẢO** |

---

## 2. BẢNG ĐO ĐỘ TƯƠNG PHẢN MÀU SẮC (SECTION A - CONTRAST RATIO AUDIT)
*Được tính toán tự động bằng thuật toán đo độ sáng tương đối (Relative Luminance) theo chuẩn WCAG 2.1 AA.*

### A.1. Chế Độ Tối (Dark Mode - Mặc định)
| Phần Tử Giao Diện | Màu Chữ / Icon (FG) | Màu Nền (BG) | Tỉ Lệ Đạt Được | Chuẩn WCAG | Trạng Thái |
|---|---|---|---|---|---|
| Nền trang & Chữ chính | `#F5EEDC` | `#0E1713` | **15.77:1** | $\ge 4.5:1$ | ✅ ĐẠT |
| Thẻ Card & Chữ chính | `#F5EEDC` | `#16231C` | **14.05:1** | $\ge 4.5:1$ | ✅ ĐẠT |
| Thẻ Card & Chữ phụ mờ (`--text-muted`) | `#C9C2AE` | `#16231C` | **9.15:1** | $\ge 4.5:1$ | ✅ ĐẠT |
| Thẻ Card & Chữ phụ 13px (`--text-subtle`) | `#A7A18F` | `#16231C` | **6.30:1** | $\ge 4.5:1$ | ✅ ĐẠT |
| Nút bấm chính (`--btn-primary` chữ trắng) | `#FFFFFF` | `#4F7A3F` | **5.01:1** | $\ge 4.5:1$ | ✅ ĐẠT |
| Thẻ Card & Điểm nhấn Sage (`--accent`) | `#9DC183` | `#16231C` | **8.05:1** | $\ge 4.5:1$ | ✅ ĐẠT |
| Thẻ Card & Cảnh báo nhẹ (`--clay`) | `#E0916E` | `#16231C` | **6.54:1** | $\ge 4.5:1$ | ✅ ĐẠT |
| Thẻ Card & Cảnh báo (`--warn`) | `#F0C36B` | `#16231C` | **9.85:1** | $\ge 4.5:1$ | ✅ ĐẠT |
| Thẻ Card & Nguy hiểm (`--danger`) | `#F28B82` | `#16231C` | **6.81:1** | $\ge 4.5:1$ | ✅ ĐẠT |
| Thẻ Card & Thành công (`--success`) | `#7FD19B` | `#16231C` | **8.90:1** | $\ge 4.5:1$ | ✅ ĐẠT |

### A.2. Chế Độ Sáng (Light Mode)
| Phần Tử Giao Diện | Màu Chữ / Icon (FG) | Màu Nền (BG) | Tỉ Lệ Đạt Được | Chuẩn WCAG | Trạng Thái |
|---|---|---|---|---|---|
| Nền trang & Chữ chính | `#231712` | `#F4EFE3` | **15.22:1** | $\ge 4.5:1$ | ✅ ĐẠT |
| Thẻ Card & Chữ chính | `#231712` | `#FFFFFF` | **17.46:1** | $\ge 4.5:1$ | ✅ ĐẠT |
| Thẻ Card & Chữ phụ mờ (`--text-muted`) | `#4D3F38` | `#FFFFFF` | **10.08:1** | $\ge 4.5:1$ | ✅ ĐẠT |
| Thẻ Card & Chữ phụ 13px (`--text-subtle`) | `#6B5A52` | `#FFFFFF` | **6.54:1** | $\ge 4.5:1$ | ✅ ĐẠT |
| Nút bấm chính (`--btn-primary` chữ trắng) | `#FFFFFF` | `#2F5D2A` | **7.72:1** | $\ge 4.5:1$ | ✅ ĐẠT |
| Thẻ Card & Điểm nhấn Sage (`--accent`) | `#2F5D2A` | `#FFFFFF` | **7.72:1** | $\ge 4.5:1$ | ✅ ĐẠT |
| Thẻ Card & Cảnh báo nhẹ (`--clay`) | `#9A4A28` | `#FFFFFF` | **6.21:1** | $\ge 4.5:1$ | ✅ ĐẠT |
| Chip nền `#FFF1CC` & Cảnh báo (`--warn`) | `#8A5A00` | `#FFF1CC` | **5.28:1** | $\ge 4.5:1$ | ✅ ĐẠT |
| Thẻ Card & Nguy hiểm (`--danger`) | `#A8321F` | `#FFFFFF` | **6.69:1** | $\ge 4.5:1$ | ✅ ĐẠT |
| Thẻ Card & Thành công (`--success`) | `#1F7A44` | `#FFFFFF` | **5.35:1** | $\ge 4.5:1$ | ✅ ĐẠT |

### A.3. Thanh Điều Hướng Sidebar (Cố định nền tối ở CẢ HAI chế độ)
| Phần Tử Giao Diện | Màu Chữ / Vạch (FG) | Màu Nền (BG) | Tỉ Lệ Đạt Được | Chuẩn WCAG | Trạng Thái |
|---|---|---|---|---|---|
| Sidebar nền `#14241C` & Chữ `#F5EEDC` | `#F5EEDC` | `#14241C` | **13.97:1** | $\ge 4.5:1$ | ✅ ĐẠT |
| Mục đang chọn nền `#1F3A2A` & Chữ `#F5EEDC` | `#F5EEDC` | `#1F3A2A` | **10.69:1** | $\ge 4.5:1$ | ✅ ĐẠT |
| Vạch chỉ dẫn trái sage `#9DC183` & Nền `#1F3A2A` | `#9DC183` | `#1F3A2A` | **6.12:1** | $\ge 3.0:1$ | ✅ ĐẠT |

---

## 3. CHỮ, SỐ & NGUYÊN TẮC TYPOGRAPHY (SECTION B)

1. **Lining & Tabular Numbers**:
   - Áp dụng trên phạm vi toàn cầu (`html, body, button, input, select, textarea, table, time, .font-serif, .font-sans, .kpi-number, .price-tag, .hours-badge`).
   - Cấu hình CSS: `font-variant-numeric: lining-nums tabular-nums; font-feature-settings: "lnum" 1, "tnum" 1`.
   - Các chữ số giờ mở cửa (`07:00 – 18:00`), số tiền (`35.000đ`), số lượt bấm hotline đứng thẳng hoàn hảo trên cùng một đường gióng cơ sở, không bị nhảy dòng hay tụt xuống như chữ số kiểu cũ (old-style figures).
2. **Kích Thước Chữ Admin Chuẩn**:
   - Tiêu đề H1: `32px / 1.2` một dòng, cân đối và trang nhã (`.admin-h1`).
   - Tiêu đề H2: `22px / 1.3` (`.admin-h2`).
   - Tiêu đề thẻ: `18px / 1.4` (`.admin-card-title`).
   - Nội dung bảng & mô tả: `15px / 1.5` (`.admin-body`).
   - Nhãn nhãn mục: `12px` viết hoa, màu `--text-muted`, giãn chữ 0.05em (`.admin-label`).
   - Chữ phụ & chú thích: `13px` tuyệt đối không nhỏ hơn để bảo đảm khả năng đọc (`.admin-subtle`).
   - Số KPI: `32px`, font Quicksand độ đậm 700 (`.kpi-stat-value`).
3. **Chính Tả Tiếng Việt**:
   - Đã kiểm tra và chuẩn hóa cụm từ `"Tự động đo lường"` (thay cho mọi biến thể thiếu dấu).
   - Đã rà soát toàn bộ từ vựng và dấu câu tiếng Việt trong tất cả 9 màn hình quản trị.

---

## 4. BỐ CỤC & TRẢI NGHIỆM THAO TÁC (SECTION C)

1. **4 Thẻ KPI Tổng Quan**:
   - Chiều cao bằng nhau (`h-full flex flex-col justify-between`).
   - Nhãn rút gọn đúng 1 dòng: `"Người dùng 7 ngày"`, `"Nhấp từ Google 7 ngày"`, `"Bấm gọi hotline"`, `"Bấm chỉ đường"`.
   - Giá trị nằm trên cùng hàng với ô tròn biểu tượng.
   - Nút `"Kết nối ngay →"` thiết kế dạng nút viền viền sage, chiều cao vùng bấm $\ge 44\text{px}$.
2. **Biểu Tượng Đồng Nhất (Single-Accent Icon Circles)**:
   - Toàn bộ icon trong ô tròn sử dụng duy nhất một màu sage accent (`.admin-icon-circle`: nền độ đậm 14%, màu icon `var(--accent)`). Đã loại bỏ hoàn toàn các màu cầu vồng (xanh dương, tím, cam).
3. **Phân Cách Thẻ & Nền**:
   - Mọi thẻ đều có viền `1px solid var(--border)` và đổ bóng nhẹ ở chế độ sáng (`box-shadow: 0 1px 3px rgba(62, 39, 35, 0.07)`).
4. **Trạng Thái Luôn Có Biểu Tượng + Chữ**:
   - "Đã kết nối": `<CheckCircle2 />` + chữ xanh.
   - "Chưa kết nối": `<AlertCircle />` + chữ vàng cam.
   - "Chưa cấu hình": `<HelpCircle />` + chữ trung tính.
   - "Lỗi kết nối": `<AlertTriangle />` + chữ đỏ kèm thông báo lỗi chi tiết.
5. **Khoảng Cách & Giới Hạn Chiều Rộng**:
   - Khoảng cách giữa các thẻ là 24px (`gap-6`).
   - Giới hạn chiều rộng nội dung tối đa `1200px` (`max-w-[1200px] mx-auto`).

---

## 5. BẢNG KIỂM TRA LỖI THEO 10 TIÊU CHÍ (SECTION D)

| Mã | Tiêu Chí | Chi Tiết Kiểm Tra | Kết Quả Thực Tế | Trạng Thái |
|---|---|---|---|---|
| **D.1** | **Console** | Không có lỗi hydration, React key, font, favicon trên mọi route | Đạt 0 lỗi console, không hydration mismatch | **SẠCH** |
| **D.2** | **Network & Bảo Mật** | Không có response 4xx/5xx bất thường; không có secret/PIN lộ ra client | Mã hóa AES-256-GCM, mặt nạ `••••xxxx`, không bao giờ gửi khóa raw ra client | **SẠCH** |
| **D.3** | **Liên Kết & Định Tuyến** | Kiểm tra toàn bộ link nội bộ, không có 404, không link sai sang public | Tất cả sidebar items và tabs chuyển mượt mà không load lại trang | **SẠCH** |
| **D.4** | **Biểu Mẫu & Hoàn Tác** | Thử rỗng, sai định dạng; thông báo tiếng Việt; khóa khi gửi; nút hoàn tác | Có thông báo lỗi tiếng Việt, nút disabled khi gửi, toast có nút "Hoàn tác" khi đổi kho món | **SẠCH** |
| **D.5** | **Trạng Thái & Dữ Liệu** | Rỗng, đang tải, lỗi API, mất mạng; không hiện số giả mạo | Khi chưa có Service Account JSON, GA4 và GSC báo "Chưa kết nối", không vẽ số liệu ảo | **SẠCH** |
| **D.6** | **Tương Phản Màu** | Kiểm tra tỷ lệ tương phản WCAG cả 2 chế độ Sáng và Tối | 100% token đạt chuẩn WCAG 2.1 AA | **SẠCH** |
| **D.7** | **Chính Tả & Dấu** | Quét toàn bộ chuỗi tiếng Việt tìm lỗi mất dấu, lỗi đánh máy | Chuẩn hóa chính tả "đo lường", ngữ pháp nhất quán | **SẠCH** |
| **D.8** | **Responsive Design** | 390px (mobile), 768px (tablet), 1440px (desktop); vùng bấm $\ge 44\text{px}$ | Không tràn ngang, bảng cuộn ngang trong khung riêng, thanh điều hướng đáy mobile $\ge 44\text{px}$ | **SẠCH** |
| **D.9** | **Bảo Mật Đăng Nhập** | Chặn unauth (401), khóa sau 5 lần sai, hết hạn phiên, xóa PIN mặc định, noindex | Middleware chặn toàn bộ `/api/admin/*`, `X-Robots-Tag: noindex, nofollow`, khóa 15p sau 5 lần sai | **SẠCH** |
| **D.10**| **Hiệu Năng & Truy Cập** | Tối ưu hóa tải trang, bộ nhớ đệm API 10 phút, không render lại thừa | API GA4/GSC tự động cache 10 phút, build tĩnh tĩnh tối ưu | **SẠCH** |

---

## 6. DANH MỤC LỖI ĐÃ PHÁT HIỆN & KHẮC PHỤC (DEFECT LOG)

| STT | Route / Thành Phần | Mô Tả Vấn Đề Ban Đầu | Mức Độ | Biện Pháp Đã Sửa Chữa | Kết Quả Sau Sửa |
|---|---|---|---|---|---|
| 1 | `/api/admin/integrations` | GET trả về status 200 khi chưa có cookie xác thực | **Nặng** | Thêm chốt chặn bảo mật tại `middleware.ts` trả về 401 Unauthorized ngay lập tức | Đạt 401 khi unauthenticated |
| 2 | `AnalyticsTab` & `SearchConsoleTab` | Sử dụng vòng tròn icon nhiều màu (xanh, tím, cam) không theo chuẩn chung | **Vừa** | Thay thế bằng lớp chuẩn `.admin-icon-circle` dùng duy nhất 1 màu sage accent | Giao diện thanh lịch, nhất quán |
| 3 | `src/app/globals.css` | Số hiển thị chưa được ép kiểu lining trên toàn bộ thẻ ngữ nghĩa | **Vừa** | Bổ sung `font-variant-numeric: lining-nums tabular-nums` cho toàn bộ elements và headings | Số đứng thẳng, thẳng hàng hoàn toàn |
| 4 | `src/app/admin/page.tsx` | Các nút thời lượng đột xuất có vùng bấm dưới 44px | **Nhẹ** | Thêm `min-h-[44px] px-3.5 py-1.5` đảm bảo chuẩn tiếp xúc cảm ứng mobile | Chạm mượt mà trên mobile |
| 5 | `IntegrationsTab.tsx` | Nút lưu, xóa và kiểm tra thiếu min-height 44px | **Nhẹ** | Chuẩn hóa toàn bộ buttons lên `min-h-[44px]` và padding thoải mái | Thao tác ngón tay không bị bấm nhầm |
| 6 | `AdminPasswordLogin.tsx` | Chưa áp dụng token `--btn-primary` và lớp `.admin-card` | **Nhẹ** | Refactor sang toàn bộ biến CSS tokens của hệ thống | Khớp màu sắc chính xác theo thiết kế |
| 7 | `src/app/admin/page.tsx` | Nút gạt toggle switch bị co kéo/biến dạng do `min-h-[44px]` đè lên `h-7 w-12` | **Vừa** | Thiết kế lại cấu trúc switch chuẩn iOS: khung bấm 44px độc lập, thanh trượt 48x24px cố định, bi trượt 20x20px có bóng đổ nổi và bổ sung chip trạng thái trực quan "Còn món" / "Tạm hết" | Nút gạt cân đối, sang trọng, không biến dạng |

---

## 7. DANH SÁCH VIỆC CẦN LÀM TIẾP THEO (POST-DEPLOYMENT CHECKLIST)

1. **Nhập khóa thực tế trên giao diện Admin**:
   - Truy cập `https://admin.camcuhouse.online` -> Tab **Tích hợp & Khóa**.
   - Dán mã `G-XXXXXXXXXX` vào dòng **GA4 Measurement ID**.
   - Dán số `Property ID` vào dòng **GA4 Property ID**.
   - Dán nội dung file Service Account JSON vào dòng **Google Service Account JSON**.
   - Bấm **"Kiểm tra kết nối"** -> Hệ thống sẽ kích hoạt kết nối trực tiếp với Google APIs.
2. **Bật xác thực 2 lớp (2FA)**:
   - Quét mã QR vào Google Authenticator và lưu lại 8 mã khôi phục để bảo vệ tài khoản quản trị tuyệt đối.
3. **Kiểm tra Preview trên Vercel**:
   - Khi commit được đẩy lên `main`, Vercel tự động build và deploy bản mới nhất.
