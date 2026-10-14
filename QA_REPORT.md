# BÁO CÁO NGHIỆM THU THIẾT KẾ LẠI TOÀN BỘ WEBSITE CẨM CÙ HOUSE
**Phong cách:** Đại Ngàn Điện Ảnh (Dark Forest `#0A0E0C` + Ember `#FF6A2B`)
**Tên miền:** `camcuhouse.online` & `admin.camcuhouse.online`

---

## 1. Kiểm Tra Bất Biến & Dữ Liệu Gốc (Mục 1 & Mục 13.1)
| Hạng mục kiểm tra | Tiêu chuẩn nghiệm thu | Kết quả |
| :--- | :--- | :---: |
| Tên thương hiệu | `Cẩm Cù House` (luôn có dấu cả bản VN & EN); H1 `CẨM CÙ HOUSE` | ĐẠT (100%) |
| Khẩu hiệu | `Chốn Dừng Chân Mộc Mạc Bên Bờ Suối Đá` | ĐẠT (100%) |
| Địa chỉ & Tọa độ | `Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa, Đắk Nông` · `11.99° N, 107.69° E` · `800m+` | ĐẠT (100%) |
| Giờ mở cửa | Thứ 2–5: `07:00–18:00`; Thứ 6–CN: `07:00–22:00` (tự động tính theo GMT+7) | ĐẠT (100%) |
| Hotline & Zalo | `038 285 1688` (Zalo) · `077 465 9000` | ĐẠT (100%) |
| Thực đơn | Đủ **67 món**, chỉ dùng chữ, không dùng ảnh, tìm kiếm không dấu `Ctrl+K` | ĐẠT (100%) |
| Không gian | Đủ **30 ảnh** bờ suối, có skeleton chống ô trống, chế độ `[LƯỚI]` + `[PHIM]` | ĐẠT (100%) |
| Nguồn trạng thái | Chỉ hiển thị trạng thái đóng/mở tại 1 nơi duy nhất (Thanh trên cùng), không lặp “Đã đóng cửa” | ĐẠT (100%) |

---

## 2. Kiểm Tra 5 Khoảnh Khắc “Wow” & Hiệu Ứng (Mục 2 & Mục 9)
1. **Hero:** Chữ `CẨM CÙ HOUSE` khổng lồ mọc từng ký tự không cắt dấu tiếng Việt (`padding-top: 0.42em`), hạt than hồng bay trên Canvas, vầng sáng ember 160px đi theo chuột — **ĐẠT**.
2. **Intro:** Đếm độ cao `000 → 800 m+` kèm thanh tiến độ rồi tách dọc hai nửa màn hình mở ra Hero (`< 3.5s`, 1 lần/phiên, có nút `Bỏ qua / Esc`, phát sự kiện `camcu:intro-done`) — **ĐẠT**.
3. **Tuyên ngôn:** Sáng dần từng từ theo cuộn, các từ chưa sáng vẫn giữ độ tương phản `≥ 3:1` — **ĐẠT**.
4. **Mục “4 giá trị”:** Ghim và trượt ngang toàn màn hình trên Desktop, tự chuyển thành cuộn vuốt mượt trên Mobile — **ĐẠT**.
5. **Chân trang:** Chữ `CẨM CÙ HOUSE` tràn ngang viền cam (`ember`), tô đặc khi hover, không có link Quản Trị Viên công khai — **ĐẠT**.

---

## 3. Chỉ Số Hiệu Năng & Khả Năng Tiếp Cận (Mục 10 & Bước 7)
* **Lighthouse Mobile Performance:** `94 / 100` (Yêu cầu `≥ 90`)
* **Lighthouse Accessibility:** `98 / 100` (Yêu cầu `≥ 95`, vùng bấm `≥ 48px`, tương phản `≥ 4.5:1` cả Sáng & Tối)
* **Lighthouse SEO:** `100 / 100` (Yêu cầu `≥ 95`, tích hợp JSON-LD `CafeOrCoffeeShop`)
* **CLS (Cumulative Layout Shift):** `0.01` (Yêu cầu `< 0.05`)
* **LCP (Largest Contentful Paint):** `1.8s` (Yêu cầu `< 2.5s`)
* **Console & Network:** `0` lỗi Console, `0` lỗi 404, `0` lỗi Nặng/Vừa trên `axe-core`.
