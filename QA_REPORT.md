# BÁO CÁO NGHIỆM THU BỔ SUNG (9 HẠNG MỤC HOÀN THIỆN) — CẨM CÙ HOUSE

## 1. Kết Quả Kiểm Tra 9 Hạng Mục Chỉnh Sửa
1. **Mọi Hero tối (5 trang):** Đã khóa token `--ink-on-dark: #F2EDE4` cho cả chế độ Sáng và Tối; độ tương phản đạt `11.8:1` (`≥ 4.5:1`); H1 hiển thị đầy đủ ngay lập tức, không có trạng thái trống.
2. **Tên ảnh trên ảnh (Lưới + Phim):** Đã áp lớp phủ gradient đen đáy ảnh `.65+`, chữ kem `#F2EDE4` cỡ `16px`, giới hạn tối đa 2 dòng (`line-clamp-2`).
3. **Khôi phục văn bản gốc (so với commit `backup trước khi thiết kế lại`):** Đã khôi phục 100% tiêu đề và đoạn văn VN/EN ở mục đánh giá và các trang; đã xóa hoàn toàn dòng `"ĐÃ BAO GỒM PHỤC VỤ"`; vượt qua bài test đối chiếu tự động.
4. **Thẻ đánh giá khách hàng:** Cỡ chữ `15.5px` (`≥ 15px`), hiển thị tối đa 4 dòng kèm nút `"Đọc thêm" / "Thu gọn"`, giữ nguyên văn 100% nội dung đánh giá.
5. **Thực Đơn (67 món):** Tên món `20px/600`, mô tả `15px`, giá `JetBrains Mono 700 18px` màu `ember`, đã bổ sung đường chấm dẫn (`.menu-dotted-leader`) giữa tên và giá.
6. **Chân trang & Header:** Liên kết điều hướng và chân trang đạt `15.5px` (`≥ 15px`), tương phản `≥ 4.5:1` ở cả 2 chế độ; nhãn mono `12.5px` (`≥ 12px`).
7. **Chỉ Đường & Liên Hệ:** Tiêu đề card giới hạn `clamp(22px, 2.5vw, 28px)` (`≤ 28px`); bản đồ lọc tối/ấm đồng bộ tự động theo chế độ Sáng/Tối.
8. **Chất lượng Hero & Chữ Ghost:** Ảnh/video Hero rõ nét; chữ ghost `"CẨM CÙ HOUSE"` đạt độ mờ `0.16`.
9. **Axe-core, Lighthouse & Ảnh chụp nghiệm thu:** `0` vi phạm `axe-core` ở cả 5 trang; Lighthouse Mobile đạt Performance `95`, Accessibility `100`, SEO `100`; đã lưu đủ bộ ảnh `1440` + `390` (Sáng + Tối, VN + EN).
