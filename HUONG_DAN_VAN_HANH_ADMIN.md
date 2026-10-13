# CẨM CÙ HOUSE — TÀI LIỆU HƯỚNG DẪN VẬN HÀNH DÀNH CHO CHỦ QUÁN

> **Địa chỉ trang quản trị:** `admin.camcuhouse.online` (hoặc `camcuhouse.online/admin`)  
> **Mã PIN mặc định ban đầu:** `2610`  
> **Nguyên tắc vận hành:** Thao tác trên điện thoại $\le 3$ lần chạm. Mọi thay đổi lưu = áp dụng ngay lập tức lên website khách.

---

## 1. Đăng Nhập & Bảo Mật 2 Lớp (TOTP 2FA)

1. Nhập mã PIN 4 số trên màn hình số lớn (mặc định: `2610`).
2. Nếu đã bật **Bảo mật 2 lớp (2FA)**: mở ứng dụng **Google Authenticator** trên điện thoại, nhập mã 6 số hiện thời.
3. *Lưu ý an toàn:* Nhập sai quá 5 lần liên tiếp hệ thống sẽ tạm khóa 15 phút để chống dò mã.

---

## 2. Đổi Trạng Thái Mở/Đóng Đón Khách (1-2 Chạm)

Tại thanh điều khiển đầu trang hoặc mục **Tổng Quan**:
- **Tự động theo lịch (Khuyên dùng):** Hệ thống tự động tính theo giờ thực tế GMT+7 (T2–T5: 07:00–18:00 | T6–CN: 07:00–22:00).
- **Mở cửa đột xuất:** Bấm **"Mở cửa đột xuất"** khi quán phục vụ ngoài giờ. Chọn thời hạn: `1 giờ`, `2 giờ`, `4 giờ` hoặc `Hôm nay`.
- **Đóng cửa / Nghỉ đột xuất:** Bấm **"Nghỉ đột xuất"** khi mưa bão hoặc quán bảo trì suối. Hết giờ chọn, hệ thống tự động quay về lịch chuẩn mà không cần chủ quán nhớ bật lại.

---

## 3. Báo Tạm Hết Món & Bật Còn Hàng (1 Chạm)

Tại tab **Thực Đơn**:
- Tìm món hoặc chọn nhóm (Cà Phê, Trà Thảo Mộc, Nước Ép, Điểm Tâm...).
- Gạt công tắc:
  - **Màu xanh:** Đang phục vụ bình thường.
  - **Màu xám:** Tạm hết hàng (Trên trang khách món sẽ mờ đi và hiện nhãn *"Tạm hết"*).
- **Hoàn tác:** Có nút *"Hoàn tác"* hiện trong 10 giây ở góc dưới màn hình nếu bấm nhầm.
- **Xuất / Nhập Excel (CSV):** Bấm **"Xuất CSV"** để tải file danh sách 67 món; bấm **"Nhập CSV"** để cập nhật nhanh giá bán từ máy tính.

---

## 4. Tải Nhiều Ảnh Vào Thư Viện Không Gian Suối

Tại tab **Thư Viện Ảnh**:
- Chọn mục **"Tải nhiều ảnh từ máy (Batch)"**.
- Bấm **"Chọn nhiều ảnh từ thiết bị"** hoặc kéo thả cùng lúc 5–20 ảnh chụp quán.
- Hệ thống tự động nén dung lượng WebP nhẹ nhàng, giữ màu sắc suối đá trong trẻo.
- Chọn chuyên mục tương ứng:
  - *Bờ Suối Tự Nhiên* (hiện vào tab bờ suối trang `/space`).
  - *Hiên Gỗ & Chòi Mộc*.
  - *Góc Check-in & Cảnh Quan*.
  - *Bàn Ghế Làm Việc / Đọc Sách*.
- Bấm **"Lưu Tất Cả Vào Thư Viện"**.

---

## 5. Đăng Bản Tin & Thông Báo Thanh Đầu Trang

- **Bản tin quán:** Tại mục **Tổng Quan**, bấm **"+ Tạo Tin Mới"** → Nhập tiêu đề, nội dung, loại tin (Sự kiện đêm suối / Món ngon đặc sản / Thông báo) → Bấm **"Đăng Bản Tin"**.
- **Chữ chạy đầu website:** Vào tab **Cài Đặt Cửa Hàng** → Bật công tắc *"Thông Báo Thanh Đầu Trang"* → Nhập nội dung (VD: *"🌿 Chào mừng bạn ghé chơi bên bờ suối Cẩm Cù..."*).

---

## 6. Sơ Đồ Kiến Trúc Hệ Thống & Luồng Dữ Liệu

```
Khách Hàng (Desktop / Mobile)
   │
   ▼
camcuhouse.online (Next.js App Router trên Vercel)
   │  ├── Single-source status: getStatus(now) [T2-T5: 07-18h | T6-CN: 07-22h]
   │  ├── ISR revalidateTag: menu, gallery, settings, reviews, content
   │  └── Bắt sự kiện: click_call, click_zalo, click_directions, view_menu
   │
Chủ Quán (Điện thoại / Laptop)
   │
   ▼
admin.camcuhouse.online (Tách biệt layout hoàn toàn)
   │  ├── Auth.js + TOTP 2FA + Khóa 5 lần sai
   │  ├── 6 mục: Tổng quan, Thực đơn (67 món), Thư viện, Cài đặt, Nội dung, Bảo mật
   │  └── Postgres (Neon) qua Drizzle ORM + Object Storage
```

---

## 7. Danh Sách Việc Chủ Quán Cần Cung Cấp Khi Triển Khai Thực Tế

1. **Google Cloud Places API Key & Place ID:** Cung cấp vào biến môi trường `GOOGLE_PLACES_API_KEY` và `GOOGLE_PLACE_ID` để tự động cập nhật đánh giá 5 sao từ Google Maps.
2. **Neon Postgres Database URL:** Cung cấp vào `DATABASE_URL` để lưu trữ dữ liệu vĩnh viễn trên đám mây.
3. **Cấu hình DNS Tên Miền:**
   - Trỏ `camcuhouse.online` về Vercel (`cname.vercel-dns.com`).
   - Trỏ `admin.camcuhouse.online` về cùng dự án Vercel.
