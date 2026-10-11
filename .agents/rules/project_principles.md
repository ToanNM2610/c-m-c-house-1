# Cẩm Cù House: Quy Tắc Dự Án & Nguyên Tắc Vận Hành

Site: camcuhouse.online | Admin: admin.camcuhouse.online

## 1. Nguyên Tắc Cốt Lõi Dự Án
- **Môi trường chạy thật**: Website đang chạy thật. Mỗi giai đoạn triển khai trên một nhánh git riêng (ví dụ: `phase-1-fixes`, `phase-2-hero-intro`), kiểm tra kỹ lưỡng bản xem trước (preview) rồi mới gộp vào `main`.
- **Hệ thống màu sắc nhận diện**:
  - Tông chủ đạo: Mộc mạc, ấm cúng, nền xanh rêu đậm (`#121A15`, `#1B281D`, `#2D4233`).
  - Điểm nhấn: Cam đất (`#CC7755`), kem (`#FDFBF7`), xanh rêu mộc (`#4A5D23`), nâu đất bazan (`#3E2723`).
- **Typography & Khả Năng Tiếp Cận (Accessibility)**:
  - Font tiêu đề: `Playfair Display`, `Lora`, hoặc `Cormorant Garamond`.
  - Font nội dung: `Quicksand` hoặc `Nunito`.
  - Cỡ chữ nội dung tối thiểu: **14px**.
  - Tương phản màu tối thiểu: **4.5:1** (WCAG AA).
  - Tôn trọng thuộc tính hệ thống: `prefers-reduced-motion`.
- **Nguyên tắc "Tự Vận Hành - Ít Người Trực" (Zero Manual Ops)**:
  - **TUYỆT ĐỐI KHÔNG thêm tính năng cần người xử lý thủ công** (không đặt bàn trực tuyến, không nhận đơn/giỏ hàng, không QR gọi món gửi Zalo, không trả lời đánh giá, không phân quyền tài khoản nhân viên).
  - Mọi luồng khách hàng trên web tập trung vào 2 hành động chính: **Gọi Hotline** hoặc **Bấm Chỉ Đường**.
  - Chủ quán chỉ cần dùng điện thoại để thao tác admin tối giản (đổi trạng thái mở/đóng, bật/tắt còn/hết món, sửa giờ phục vụ, đăng thông báo ngắn).
- **Kiểm tra đa kích thước màn hình**:
  - Bắt buộc kiểm tra đáp ứng hoàn hảo trên Desktop 1440px và Mobile 390px.

## 2. Thứ Tự Triển Khai 6 Giai Đoạn
1. **Giai đoạn 1**: Sửa lỗi (Intro, Chuyển trang, Gộp pill đóng cửa, Tab menu cuộn có fade mép, Bản đồ nhúng Contact, Font size >= 14px & Tương phản, Sửa "Dắk" -> "Đắk", Skeleton Space).
2. **Giai đoạn 2**: Hero, intro, chuyển trang (Cảnh parallax nhiều lớp, giọt nước suối, circle reveal).
3. **Giai đoạn 3**: Câu Chuyện + Thực Đơn (4 cảnh cuộn mộc mạc, FLIP tab menu không đặt món).
4. **Giai đoạn 4**: Không Gian Suối (Tham quan 360°, Web Audio tiếng suối).
5. **Giai đoạn 5**: Admin tối giản (Tập trung trên mobile, 1 nguồn trạng thái mở/đóng, công tắc món còn/hết).
6. **Giai đoạn 6**: Hiệu năng, SEO (Lighthouse >= 90, LocalBusiness Schema), bảo mật & bàn giao.
