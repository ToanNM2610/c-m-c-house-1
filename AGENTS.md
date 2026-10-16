<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Quy tắc làm việc, dự án Cẩm Cù House (camcu-cafe)

Site: camcuhouse.online | Admin: admin.camcuhouse.online

1. Làm thẳng trên nhánh hiện tại. KHÔNG tạo nhánh mới, KHÔNG mở PR. Commit nhỏ, tin nhắn rõ (feat:/fix:/chore:).
2. KHÔNG đổi thông tin quán và chữ nội dung: tên Cẩm Cù House (luôn có dấu, cả bản EN), địa chỉ Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa, Đắk Nông; tọa độ 11.99° N, 107.69° E; giờ Thứ 2–5 07:00–18:00, Thứ 6–CN 07:00–22:00; hotline 038 285 1688 (Zalo), 077 465 9000; 67 món (tên, mô tả, giá, nhãn, danh mục); 30 ảnh không gian; mọi tiêu đề và đoạn chữ VN/EN. Nguồn so khớp: camcu_raw_backup.json.
3. Không thêm đặt bàn, đặt món, giỏ hàng. Thực Đơn không dùng ảnh.
4. Không bịa nội dung, số liệu, đánh giá. Chưa có dữ liệu thật thì ghi "Chưa kết nối", không dùng số giả.
5. Không đưa ghi chú nội bộ ("Mục 13", "bất biến mục…") ra giao diện.
6. Khóa bí mật (GA/GSC/API) chỉ lưu mã hóa AES-256-GCM, hiển thị dạng che, không bao giờ trả đầy đủ về trình duyệt, không ghi log. Không có PIN hay mật khẩu mặc định nào hiển thị trên giao diện hoặc nằm trong code.
7. Mỗi việc: đọc file liên quan trước, sửa nhỏ nhất đủ dùng, rồi chạy lệnh kiểm tra tương ứng (mục 6). Báo cáo 5 dòng: đã sửa gì, file nào, lệnh đã chạy, kết quả, việc còn lại.
8. Chữ phải đọc được: tương phản ≥ 4.5:1 ở cả chế độ sáng và tối; chữ trên ảnh luôn có lớp phủ tối; không chữ nhỏ hơn 14px (trừ nhãn 12px viết hoa).
9. Chỉ animate transform/opacity/clip-path; tôn trọng prefers-reduced-motion; cuộn mượt không khựng.
10. Không xóa tính năng đang chạy. Nếu thấy một tính năng bị mất so với commit cũ thì báo ngay, không tự bỏ qua.

## Nguyên Tắc Vận Hành & Thiết Kế Bổ Sung
- **Hệ thống màu sắc**: Nền kem sáng `#FAF6EE` / card `#FFFFFF` (light mode), Nền xanh rêu đen đậm `#0A0E0C`, `#121A15`, `#1B281D` (dark mode); điểm nhấn cam đất / đất nung `#8D361D`, kem `#F4EEE2`, xanh rêu `#4A5D23`, nâu `#3E2723`.
- **Typography & Accessibility**: Font tiêu đề Playfair/Lora/Cormorant Garamond. Font nội dung Quicksand/Nunito. Chữ nội dung tối thiểu 14px, tương phản tối thiểu 4.5:1. Tôn trọng `prefers-reduced-motion`.
- **Tự vận hành - Không xử lý thủ công (Zero Manual Ops)**: KHÔNG thêm tính năng cần người xử lý thủ công (không đặt bàn, không nhận đơn/giỏ hàng, không QR gọi món gửi Zalo, không trả lời đánh giá, không phân quyền nhân viên).
- **Hành động chính của khách**: Gọi Hotline (`tel:0382851688`) hoặc Chỉ đường (Google Maps).
- **Kiểm tra thiết bị**: Bắt buộc kiểm tra desktop 1440px và mobile 390px.
