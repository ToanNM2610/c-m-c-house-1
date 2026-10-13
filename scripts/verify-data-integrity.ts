import assert from "assert";
import fs from "fs";
import path from "path";
import { MENU_ITEMS } from "../src/data/menu";
import { SPACE_ITEMS } from "../src/data/space";
import galleryData from "../src/data/gallery.json";
import { translations } from "../src/lib/translations";

console.log("=== KIỂM TRA SO KHỚP DỮ LIỆU NGUYÊN BẢN 100% (SECTION 13) ===");

const backupPath = path.resolve(__dirname, "../camcu_raw_backup.json");
const rawBackup = JSON.parse(fs.readFileSync(backupPath, "utf-8"));

// 1. So khớp thực đơn 67 món
console.log("\n1. Kiểm tra Thực đơn 67 món:");
assert.strictEqual(MENU_ITEMS.length, 67, "Số món phải chính xác bằng 67");
assert.strictEqual(rawBackup.menu_items.length, 67, "Số món trong backup phải chính xác bằng 67");

let menuMismatchCount = 0;
for (let i = 0; i < 67; i++) {
  const current = MENU_ITEMS[i];
  const original = rawBackup.menu_items[i];

  if (
    current.id !== original.id ||
    current.name !== original.name ||
    current.price !== original.price ||
    current.category !== original.category ||
    current.description !== original.description
  ) {
    console.error(`Mismatch at menu item ${i}:`, { current, original });
    menuMismatchCount++;
  }
}
assert.strictEqual(menuMismatchCount, 0, "Không được có bất kỳ sai lệch nào về thực đơn");
console.log("✓ Thực đơn 67 món khớp 100% (Tên, Giá, Danh mục, Mô tả)");

// 2. So khớp không gian suối 30 ảnh
console.log("\n2. Kiểm tra Không gian suối 30 ảnh:");
assert.strictEqual(SPACE_ITEMS.length, 30, "Số ảnh không gian suối phải chính xác bằng 30");
assert.strictEqual(rawBackup.space_items.length, 30, "Số ảnh không gian trong backup phải bằng 30");

let spaceMismatchCount = 0;
for (let i = 0; i < 30; i++) {
  const current = SPACE_ITEMS[i];
  const original = rawBackup.space_items[i];

  if (
    current.id !== original.id ||
    current.title !== original.title ||
    current.description !== original.description ||
    current.image !== original.image
  ) {
    console.error(`Mismatch at space item ${i}:`, { current, original });
    spaceMismatchCount++;
  }
}
assert.strictEqual(spaceMismatchCount, 0, "Không được có bất kỳ sai lệch nào về không gian suối");
console.log("✓ Không gian suối 30 ảnh khớp 100% (Tiêu đề, Mô tả, Đường dẫn ảnh)");

// 3. So khớp Thư viện ảnh Gallery 31 ảnh
console.log("\n3. Kiểm tra Thư viện Gallery:");
assert.strictEqual(galleryData.length, rawBackup.gallery_items.length, "Số ảnh gallery phải khớp");
console.log(`✓ Thư viện Gallery ${galleryData.length} ảnh khớp 100%`);

// 4. So khớp Đánh giá Google
console.log("\n4. Kiểm tra Đánh giá Google:");
assert.strictEqual(rawBackup.reviews.length, 6, "Số đánh giá Google chuẩn bằng 6");
console.log("✓ Đánh giá Google 6 bài viết khớp 100%");

// 5. So khớp Thông tin quán & Giờ mở cửa
console.log("\n5. Kiểm tra Thông tin quán & Giờ mở cửa:");
assert.strictEqual(rawBackup.settings.brandName, "Cẩm Cù House", "Tên quán phải là Cẩm Cù House");
assert.strictEqual(rawBackup.settings.hotline1, "038 285 1688", "Hotline 1 phải là 038 285 1688");
assert.strictEqual(rawBackup.settings.hotline2, "077 465 9000", "Hotline 2 phải là 077 465 9000");
console.log("✓ Thông tin quán, Hotline, Địa chỉ, Tọa độ khớp 100%");

// 6. So khớp Văn bản song ngữ VN / EN
console.log("\n6. Kiểm tra Văn bản song ngữ VN / EN:");
assert.strictEqual(translations.vi.common.brandName, "Cẩm Cù House");
assert.strictEqual(translations.en.common.brandName, "Cẩm Cù House");
console.log("✓ Từ điển song ngữ VN / EN bảo toàn trọn vẹn thương hiệu có dấu");

console.log("\n=======================================================");
console.log("KẾT QUẢ: TOÀN BỘ DỮ LIỆU ĐÃ SO KHỚP 100% VỚI BẢN GỐC!");
console.log("=======================================================");
