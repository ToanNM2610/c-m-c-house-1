# CẨM CÙ HOUSE — TÀI LIỆU HƯỚNG DẪN VẬN HÀNH DÀNH CHO CHỦ QUÁN

> **Địa chỉ trang quản trị:** `admin.camcuhouse.online` (hoặc `camcuhouse.online/admin`)  
> **Tiêu chuẩn bảo mật:** Mật khẩu mạnh $\ge 12$ ký tự + Bảo mật 2 lớp Google Authenticator (TOTP RFC 6238)  
> **Nguyên tắc vận hành:** Mọi thay đổi cấu hình, khóa tích hợp hoặc thực đơn lưu xong có hiệu lực tức thì trên website khách mà không cần triển khai lại code (Zero-redeploy).  
> **Triết lý vận hành:** Tự vận hành - Không xử lý thủ công (Zero Manual Ops). Không thêm tính năng cần người trực (không giỏ hàng/đặt bàn thủ công, không chat tay, không phân quyền nhân viên). Mọi chuyển đổi tập trung vào Gọi Hotline và Chỉ đường Google Maps.

---

## 1. Đăng Nhập & Bảo Mật Quản Trị Viên

1. **Khởi tạo lần đầu:** Hệ thống yêu cầu thiết lập mật khẩu mạnh (tối thiểu 12 ký tự) và kích hoạt bảo mật 2 lớp 2FA qua Google Authenticator.
2. **Đăng nhập thường lệ:** Nhập mật khẩu quản trị viên. Nếu tài khoản đã kích hoạt 2FA, mở ứng dụng **Google Authenticator** trên điện thoại và nhập mã 6 số hiện thời.
3. *Chống tấn công dò mật khẩu:* Nhập sai quá 5 lần liên tiếp hệ thống sẽ tự động tạm khóa 15 phút.
4. *Đổi mật khẩu:* Truy cập mục **Tài Khoản & 2FA** hoặc **Cài Đặt Cửa Hàng**, nhập mật khẩu hiện tại và đặt mật khẩu mới $\ge 12$ ký tự.

---

## 2. Quản Lý Tích Hợp & Khóa Dịch Vụ Ngoài (`/admin/integrations`)

Tất cả các khóa và ID kết nối bên ngoài được quản lý tập trung ngay trong trang Admin:
- **GA4 Measurement ID (`G-XXXXXXXXXX`):** Thẻ theo dõi hành vi khách ghé thăm website. Lưu xong là website công khai tự động gắn thẻ đo lường ngay (sau khi khách bấm Đồng ý Cookie).
- **GA4 Property ID:** Mã số thuộc tính GA4 (dãy số gồm 9–10 chữ số) dùng để trích xuất báo cáo lưu lượng truy cập.
- **Search Console:** Mã xác minh `google-site-verification` (tự động nhúng vào thẻ meta trang chủ) và Property tên miền `sc-domain:camcuhouse.online`.
- **Google Service Account JSON:** Khóa xác thực OAuth2 cho máy chủ để gọi Google Analytics Data API và Search Console API.
- **Google Places API Key & Place ID:** Khóa đồng bộ đánh giá và địa điểm Cẩm Cù House Gia Nghĩa.
- **Link Google Maps / Bản đồ nhúng:** URL bản đồ hiển thị trên trang Chỉ Đường.

**Cơ chế an toàn:**
- Các giá trị bí mật được mã hóa AES-256-GCM với biến môi trường duy nhất.
- Giao diện che an toàn (`••••1234`), máy chủ không bao giờ trả về giá trị bí mật nguyên bản cho trình duyệt.
- Trước khi Lưu hoặc Xóa khóa: bắt buộc nhập lại Mật khẩu hoặc mã 2FA TOTP để xác thực.
- Có nút **"Kiểm tra kết nối"** trực tiếp để kiểm tra tính hợp lệ của từng dịch vụ.

---

## 3. Xem Báo Cáo Google Analytics (`/admin/analytics`)

- **Bộ lọc chu kỳ:** Xem theo 7 ngày, 28 ngày hoặc 90 ngày.
- **Số liệu tổng quan:** Tổng người dùng, phiên truy cập, lượt xem trang và số khách đang online thời gian thực.
- **Biểu đồ xu hướng:** Biểu đồ đường trực quan theo ngày.
- **Hành động chuyển đổi trọng tâm (Cẩm Cù Actions):**
  - `click_call`: Khách bấm gọi Hotline quán.
  - `click_zalo`: Khách bấm mở Zalo liên hệ.
  - `click_directions`: Khách bấm xem đường đi Google Maps.
  - `view_menu`: Khách lướt xem thực đơn.
- **Nguồn truy cập & Thiết bị:** Phân loại từ Google tìm kiếm, mạng xã hội, trực tiếp; tỷ lệ khách dùng di động hay máy tính.
- *Lưu ý:* Khi chưa nạp file Service Account JSON, trang báo trạng thái "Chưa kết nối" an toàn, không sinh số liệu giả.

---

## 4. Xem Báo Cáo Google Search Console (`/admin/search-console`)

- **Hiệu suất tìm kiếm tự nhiên:** Tổng lượt nhấp, lượt hiển thị, CTR và vị trí trung bình trên Google.
- **Top từ khóa tìm kiếm (Top Queries):** Biết chính xác khách tìm cụm từ gì (vd: "cà phê suối gia nghĩa", "quán cafe đẹp đắk nông"...) để đến với quán.
- **Gửi Sitemap:** Bấm nút **"Gửi sitemap.xml"** để yêu cầu Google cập nhật cấu trúc trang mới.
- **Kiểm tra lập chỉ mục (URL Inspection):** Trạng thái xuất hiện trên Google của 5 trang chính: Trang Chủ, Câu Chuyện, Không Gian Suối, Thực Đơn, Chỉ Đường.

---

## 5. Đổi Trạng Thái Mở/Đóng Đón Khách (1-2 Chạm)

Tại thanh điều khiển đầu trang hoặc mục **Tổng Quan**:
- **Tự động theo lịch (Khuyên dùng):** Hệ thống tự động tính theo giờ thực tế GMT+7:
  - Thứ Hai – Thứ Năm: `07:00 – 18:00`
  - Thứ Sáu – Chủ Nhật: `07:00 – 22:00`
- **Mở cửa đột xuất:** Bấm **"Mở cửa đột xuất"** khi quán phục vụ ngoài giờ. Chọn thời hạn: `1 giờ`, `2 giờ`, `4 giờ` hoặc `Hôm nay`.
- **Đóng cửa / Nghỉ đột xuất:** Bấm **"Nghỉ đột xuất"** khi thời tiết xấu hoặc bảo trì suối đá. Hết thời gian đã chọn, hệ thống tự động quay về lịch chuẩn.

---

## 6. Báo Tạm Hết Món & Bật Còn Hàng (1 Chạm)

Tại tab **Quản Lý Thực Đơn**:
- Tìm kiếm món hoặc chọn theo danh mục (Cà Phê, Trà Thảo Mộc, Nước Ép, Món Ăn Vặt...).
- Gạt công tắc:
  - **Màu xanh:** Đang phục vụ bình thường.
  - **Màu xám:** Tạm hết hàng (Trên trang khách món sẽ mờ đi và gắn nhãn *"Tạm hết"*).
- **Hoàn tác:** Nút *"Hoàn tác"* xuất hiện trong vài giây nếu bấm nhầm.
- **Xuất / Nhập CSV:** Bấm **"Xuất CSV"** để sao lưu 67 món; bấm **"Nhập CSV"** để cập nhật hàng loạt giá bán hoặc trạng thái phục vụ.

---

## 7. Tải & Quản Lý Thư Viện Ảnh Quán

Tại tab **Thư Viện Ảnh**:
- Chọn mục **"Tải nhiều ảnh từ máy (Batch)"** để đưa 5–20 ảnh suối đá, hiên gỗ lên cùng lúc.
- Hệ thống tự động tối ưu định dạng WebP sắc nét, tải trang siêu tốc.
- Phân loại đúng không gian: *Bờ Suối Tự Nhiên*, *Hiên Gỗ & Chòi Mộc*, *Góc Check-in*, *Khu Vực Làm Việc*.
- Sắp xếp thứ tự hiển thị bằng thao tác kéo thả hoặc chọn số thứ tự.

---

## 8. Cấu Hình Lịch Giờ 7 Ngày & Chọn Ngày Nghỉ Lễ

Tại tab **Cài Đặt Cửa Hàng**:
- **Bảng giờ 7 ngày:** Từng ngày trong tuần (Thứ Hai đến Chủ Nhật) có ô nhập `Giờ mở`, `Giờ đóng` và nút bật/tắt `Đóng cả ngày`.
- **Lịch ngày nghỉ lễ:** Chọn ngày nghỉ trực tiếp qua bộ chọn lịch `<input type="date">`, thêm ghi chú ngày lễ (ví dụ: *Nghỉ Tết Nguyên Đán*, *Bảo trì bờ suối*).
- **Thông tin quán an toàn:** Khung thông tin quán cố định (Tên quán, Địa chỉ, Hotline, Tọa độ) được mặc định khóa an toàn với nhãn *"Thông tin quán (khóa để tránh sửa nhầm)"* để tránh vô tình sửa sai dữ liệu chuẩn. Bấm icon mở khóa khi thực sự cần thay đổi.

---

## 9. Hướng Dẫn Cung Cấp Khóa Kết Nối Dịch Vụ Google

Để kích hoạt đầy đủ tính năng đo lường, chủ quán chuẩn bị các thông tin sau và dán vào tab **Tích Hợp & Khóa**:

1. **Google Analytics 4:**
   - **Measurement ID:** Vào *Google Analytics* -> *Quản trị* -> *Luồng dữ liệu (Data Streams)* -> Sao chép mã có dạng `G-XXXXXXXXXX`.
   - **Property ID:** Dãy số 9–10 chữ số nằm ở góc trên trang Quản trị GA4.
2. **Google Service Account JSON:**
   - Vào *Google Cloud Console* -> *IAM & Quản trị* -> *Tài khoản dịch vụ (Service Accounts)*.
   - Tạo tài khoản dịch vụ, gán quyền *Viewer* trên GA4 và *Đọc* trên Search Console.
   - Tạo Khóa dạng JSON (Key -> Add Key -> JSON), tải file về máy và mở sao chép nội dung dán vào ô nhập.
3. **Google Search Console Verification:**
   - Mã xác minh HTML tag (chuỗi ký tự trong thẻ meta verification).
4. **Google Places API Key & Place ID:**
   - API Key từ Google Cloud (bật *Places API*).
   - Place ID của Cẩm Cù House tại Nghĩa Trung, Gia Nghĩa từ trang *Place ID Finder* của Google.

---

## 10. Nguyên Tắc Vận Hành "Zero Manual Ops"

Website Cẩm Cù House được thiết kế theo mô hình **Tự Vận Hành 100%**:
1. **Không nhận đơn hay thanh toán trực tuyến:** Menu công khai minh bạch giá và thành phần để khách tham khảo trước.
2. **Không nhận đặt bàn tự động:** Quán phục vụ theo hình thức đón khách trực tiếp theo không gian suối đá tự nhiên.
3. **Kênh liên hệ duy nhất:** Nếu khách cần đặt đoàn đông hoặc hỏi đường, website hướng dẫn trực tiếp bấm **Gọi Hotline** (`038 285 1688`) hoặc **Chat Zalo** (`038 285 1688`) để chủ quán xử lý trực tiếp.
4. **Chỉ đường chính xác:** Nút Chỉ Đường liên kết trực tiếp ứng dụng Google Maps với tọa độ chính xác `11.99° N, 107.69° E`.
