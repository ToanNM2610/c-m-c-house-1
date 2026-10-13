# CẨM CÙ HOUSE — TÀI LIỆU HƯỚNG DẪN VẬN HÀNH DÀNH CHO CHỦ QUÁN

> **Địa chỉ trang quản trị:** `admin.camcuhouse.online` (hoặc `camcuhouse.online/admin`)  
> **Tiêu chuẩn bảo mật:** Mật khẩu mạnh $\ge 12$ ký tự + Bảo mật 2 lớp Google Authenticator (TOTP)  
> **Nguyên tắc vận hành:** Mọi thay đổi cấu hình, khóa tích hợp hoặc thực đơn lưu xong có hiệu lực tức thì trên website khách mà không cần triển khai lại code (Zero-redeploy).

---

## 1. Đăng Nhập & Bảo Mật Quản Trị Viên

1. **Khởi tạo lần đầu:** Hệ thống yêu cầu thiết lập mật khẩu mạnh (tối thiểu 12 ký tự) và kích hoạt bảo mật 2 lớp 2FA qua Google Authenticator.
2. **Đăng nhập thường lệ:** Nhập mật khẩu quản trị viên. Nếu tài khoản đã kích hoạt 2FA, mở ứng dụng **Google Authenticator** trên điện thoại và nhập mã 6 số hiện thời.
3. *Chống tấn công dò mật khẩu:* Nhập sai quá 5 lần liên tiếp hệ thống sẽ tự động tạm khóa 15 phút.
4. *Đổi mật khẩu:* Truy cập mục **Tài Khoản & Bảo Mật** hoặc **Cài Đặt**, nhập mật khẩu hiện tại và đặt mật khẩu mới $\ge 12$ ký tự.

---

## 2. Quản Lý Tích Hợp & Khóa Dịch Vụ Ngoài (`/admin/integrations`)

Tất cả các khóa và ID kết nối bên ngoài được quản lý tập trung ngay trong trang Admin:
- **GA4 Measurement ID (`G-XXXXXXXXXX`):** Thẻ theo dõi hành vi khách ghé thăm website. Lưu xong là website công khai tự động gắn thẻ đo lường ngay.
- **GA4 Property ID:** Mã số thuộc tính GA4 dùng để trích xuất báo cáo lưu lượng truy cập.
- **Search Console:** Mã xác minh `google-site-verification` (tự động nhúng vào thẻ meta trang chủ) và Property tên miền `sc-domain:camcuhouse.online`.
- **Google Service Account JSON:** Khóa xác thực OAuth2 cho máy chủ để gọi Analytics Data API và Search Console API.
- **Google Places API Key & Place ID:** Khóa đồng bộ đánh giá và địa điểm Cẩm Cù House Gia Nghĩa.
- **Link Google Maps / Bản đồ nhúng:** URL bản đồ hiển thị trên trang Chỉ Đường.

**Cơ chế an toàn:**
- Các giá trị bí mật được mã hóa AES-256-GCM với biến `APP_ENCRYPTION_KEY` duy nhất ở Vercel.
- Giao diện che an toàn (`••••1234`), máy chủ không bao giờ trả về giá trị bí mật nguyên bản cho trình duyệt.
- Trước khi Lưu hoặc Xóa khóa: bắt buộc nhập lại Mật khẩu hoặc mã 2FA TOTP để xác thực.
- Có nút **"Kiểm tra kết nối"** trực tiếp để kiểm tra tính hợp lệ của từng dịch vụ.

---

## 3. Xem Báo Cáo Google Analytics (`/admin/analytics`)

- **Bộ lọc chu kỳ:** Xem theo 7 ngày, 28 ngày hoặc 90 ngày.
- **Số liệu tổng quan:** Tổng người dùng, phiên truy cập, lượt xem trang và số khách đang online thời gian thực.
- **Biểu đồ xu hướng:** Biểu đồ đường trực quan theo ngày.
- **Hành động chuyển đổi trọng tâm (Cẩm Cù Actions):** Lượt bấm Gọi Hotline (`click_call`), Nhắn tin Zalo (`click_zalo`), Tìm đường Maps (`click_directions`), Xem thực đơn (`view_menu`).
- **Nguồn truy cập & Thiết bị:** Phân loại từ Google tìm kiếm, mạng xã hội, trực tiếp; tỷ lệ khách dùng di động hay máy tính.

---

## 4. Xem Báo Cáo Google Search Console (`/admin/search-console`)

- **Hiệu suất tìm kiếm tự nhiên:** Tổng lượt nhấp, lượt hiển thị, CTR và vị trí trung bình trên Google.
- **Top từ khóa tìm kiếm (Top Queries):** Biết chính xác khách tìm cụm từ gì để đến với quán.
- **Gửi Sitemap:** Bấm nút **"Gửi sitemap.xml"** để yêu cầu Google cập nhật cấu trúc trang mới.
- **Kiểm tra lập chỉ mục (URL Inspection):** Trạng thái xuất hiện trên Google của 5 trang chính: Trang Chủ, Câu Chuyện, Không Gian Suối, Thực Đơn, Chỉ Đường.

---

## 5. Đổi Trạng Thái Mở/Đóng Đón Khách (1-2 Chạm)

Tại thanh điều khiển đầu trang hoặc mục **Tổng Quan**:
- **Tự động theo lịch (Khuyên dùng):** Hệ thống tự động tính theo giờ thực tế GMT+7 (T2–T5: 07:00–18:00 | T6–CN: 07:00–22:00).
- **Mở cửa đột xuất:** Bấm **"Mở cửa đột xuất"** khi quán phục vụ ngoài giờ. Chọn thời hạn: `1 giờ`, `2 giờ`, `4 giờ` hoặc `Hôm nay`.
- **Đóng cửa / Nghỉ đột xuất:** Bấm **"Nghỉ đột xuất"** khi thời tiết xấu hoặc bảo trì suối đá. Hết thời gian đã chọn, hệ thống tự động quay về lịch chuẩn.

---

## 6. Báo Tạm Hết Món & Bật Còn Hàng (1 Chạm)

Tại tab **Thực Đơn**:
- Tìm kiếm món hoặc chọn theo danh mục (Cà Phê, Trà Thảo Mộc, Nước Ép, Món Ăn Vặt...).
- Gạt công tắc:
  - **Màu xanh:** Đang phục vụ bình thường.
  - **Màu xám:** Tạm hết hàng (Trên trang khách món sẽ mờ đi và gắn nhãn *"Tạm hết"*).
- **Hoàn tác:** Nút *"Hoàn tác"* xuất hiện trong vài giây nếu bấm nhầm.
- **Xuất / Nhập Excel (CSV):** Bấm **"Xuất CSV"** để sao lưu; bấm **"Nhập CSV"** để cập nhật hàng loạt giá bán.

---

## 7. Tải & Quản Lý Thư Viện Ảnh Quán

Tại tab **Thư Viện Ảnh**:
- Chọn mục **"Tải nhiều ảnh từ máy (Batch)"** để đưa 5–20 ảnh suối đá, hiên gỗ lên cùng lúc.
- Hệ thống tự động tối ưu định dạng WebP sắc nét, tải trang siêu tốc.
- Phân loại đúng không gian: *Bờ Suối Tự Nhiên*, *Hiên Gỗ & Chòi Mộc*, *Góc Check-in*, *Khu Vực Làm Việc*.
