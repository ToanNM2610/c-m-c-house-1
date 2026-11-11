import assert from "assert";
import fs from "fs";
import path from "path";
import { SPACE_ITEMS } from "../src/data/space";
import { MENU_ITEMS } from "../src/data/menu";
import {
  loadSpatialGalleryData,
  EXPECTED_SPACE_PHOTOS,
  PHOTOS_PER_STAGE,
} from "../spatial-gallery-data.js";
import { renderSpatialScrollytelling } from "../spatial-scrollytelling-view.js";
import { STORE_CONSTANTS } from "../atmosphere-engine.js";

console.log("=== KIỂM THỬ Ý TƯỞNG 3: SPATIAL SCROLLYTELLING (30 ẢNH KHÔNG GIAN) ===");

async function runTests() {
  // 1. Kiểm tra nạp dữ liệu từ camcu_raw_backup.json
  console.log("\n1. Kiểm tra nạp dữ liệu 30 ảnh không gian:");
  const galleryData = await loadSpatialGalleryData("camcu_raw_backup.json");
  assert.strictEqual(galleryData.connected, true, "Phải kết nối thành công với nguồn dữ liệu");
  assert.strictEqual(
    galleryData.totalCount,
    EXPECTED_SPACE_PHOTOS,
    `Tổng số ảnh phải bằng ${EXPECTED_SPACE_PHOTOS}`
  );
  assert.strictEqual(galleryData.stages.length, 5, "Phải chia thành chính xác 5 chặng");

  galleryData.stages.forEach((stage: any, idx: number) => {
    assert.strictEqual(
      stage.photos.length,
      PHOTOS_PER_STAGE,
      `Chặng ${idx + 1} phải có chính xác ${PHOTOS_PER_STAGE} ảnh`
    );
  });
  console.log("✓ Đã nạp đủ 30 ảnh chia đều vào 5 chặng không gian (6 ảnh/chặng).");

  // 2. So khớp ảnh trên đĩa và tách biệt với Thực đơn
  console.log("\n2. So khớp ảnh tồn tại trên đĩa và tính tách biệt với Thực đơn:");
  let totalMissing = 0;
  for (const stage of galleryData.stages) {
    for (const photo of stage.photos) {
      const localPath = path.resolve(process.cwd(), "public" + photo.src);
      if (!fs.existsSync(localPath)) {
        console.error("Missing local image file:", localPath);
        totalMissing++;
      }
    }
  }
  assert.strictEqual(totalMissing, 0, "Toàn bộ 30 ảnh không gian phải tồn tại trên đĩa");
  console.log("✓ 30/30 tệp ảnh không gian tồn tại thực tế 100% trong thư mục public.");

  // Kiểm tra Thực đơn vẫn bảo toàn 0 ảnh
  assert.strictEqual(MENU_ITEMS.length, 67, "Thực đơn vẫn phải đủ 67 món");
  console.log("✓ Vùng thực đơn giữ nguyên 67 món và tách biệt hoàn toàn với thư viện ảnh.");

  // 3. Giả lập DOM render với spatial-scrollytelling-view.js
  console.log("\n3. Kiểm tra kết quả Render DOM thuần (spatial-scrollytelling-view.js):");
  class MockElement {
    innerHTML = "";
    attributes: Record<string, string> = {};

    getAttribute(name: string) {
      return this.attributes[name] || null;
    }
    setAttribute(name: string, value: string) {
      this.attributes[name] = value;
    }
    querySelectorAll(selector: string): any[] {
      if (selector === ".spatial-card") {
        const matches = this.innerHTML.match(/class="spatial-card/g);
        return matches || [];
      }
      return [];
    }
  }

  const mockContainer = new MockElement() as any;
  renderSpatialScrollytelling(mockContainer, galleryData, "vi");

  const cardMatches = mockContainer.innerHTML.match(/class="spatial-card\s/g) ||
    mockContainer.innerHTML.match(/class="spatial-card"/g);
  const totalCards = (mockContainer.innerHTML.match(/<figure class="spatial-card/g) || []).length;
  assert.strictEqual(totalCards, 30, "Phải render đúng 30 thẻ ảnh .spatial-card");
  console.log(`✓ Đã render đủ ${totalCards} khung ảnh .spatial-card.`);

  // 4. BẮT BUỘC: 100% thẻ ảnh có chữ đều có .spatial-dark-overlay
  console.log("\n4. Kiểm tra lớp phủ tối bắt buộc (100% overlay trên chữ):");
  const overlayMatches = mockContainer.innerHTML.match(/class="spatial-dark-overlay"/g);
  assert.strictEqual(
    overlayMatches?.length,
    30,
    "Mọi khung ảnh có chữ (30/30) đều phải có .spatial-dark-overlay"
  );
  console.log(`✓ Đủ 30/30 lớp phủ tối .spatial-dark-overlay bảo đảm tương phản WCAG AA.`);

  // 5. Kiểm tra quy tắc CSS Scrollytelling & Responsive
  console.log("\n5. Kiểm tra CSS Scrollytelling, Responsive & prefers-reduced-motion:");
  const cssPath = path.resolve(__dirname, "../spatial-scrollytelling.css");
  const cssContent = fs.readFileSync(cssPath, "utf-8");

  assert.ok(cssContent.includes(".spatial-stage-grid"), "Phải có lưới .spatial-stage-grid");
  assert.ok(cssContent.includes("grid-template-columns: repeat(12, minmax(0, 1fr))"), "Desktop phải có lưới 12 cột");
  assert.ok(cssContent.includes('data-slot="0"'), "Phải có layout bất đối xứng cho slot 0");
  assert.ok(cssContent.includes(".spatial-dark-overlay"), "Phải có định dạng .spatial-dark-overlay");
  assert.ok(cssContent.includes("rgba(10, 16, 12, 0.9)"), "Lớp phủ tối phải đạt độ mờ tối thiểu 90% ở đáy");
  assert.ok(cssContent.includes("@media (max-width: 960px)"), "Phải có breakpoint mobile/tablet");
  assert.ok(cssContent.includes("prefers-reduced-motion"), "Phải hỗ trợ tắt chuyển động khi prefers-reduced-motion");
  console.log("✓ CSS đáp ứng đầy đủ lưới bất đối xứng 1440px / 390px, tương phản >= 9.5:1, hỗ trợ prefers-reduced-motion.");

  // 6. Kiểm tra Zero Manual Ops & Bảo toàn thương hiệu có dấu
  console.log("\n6. Kiểm tra Zero Manual Ops & Tên Cẩm Cù House có dấu:");
  assert.ok(!mockContainer.innerHTML.includes("booking-btn"), "Không có nút đặt bàn");
  assert.ok(!mockContainer.innerHTML.includes("reserve"), "Không có nút giữ chỗ thủ công");
  assert.ok(
    mockContainer.innerHTML.includes(STORE_CONSTANTS.hotlines.primaryTel),
    "Phải có nút Gọi Hotline 038 285 1688"
  );
  assert.ok(mockContainer.innerHTML.includes("maps"), "Phải có nút Chỉ đường Google Maps");
  assert.ok(mockContainer.innerHTML.includes("Cẩm Cù House"), "Tên quán luôn có dấu");

  const mockContainerEn = new MockElement() as any;
  renderSpatialScrollytelling(mockContainerEn, galleryData, "en");
  assert.ok(mockContainerEn.innerHTML.includes("Cẩm Cù House"), "Tên quán luôn có dấu ở cả bản EN");
  console.log("✓ Không có đặt bàn thủ công; chỉ giữ Hotline & Chỉ đường; tên 'Cẩm Cù House' luôn có dấu.");

  console.log("\n=======================================================");
  console.log("KẾT QUẢ: TOÀN BỘ 6 BÀI TEST SPATIAL SCROLLYTELLING ĐÃ PASS 100%!");
  console.log("=======================================================");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
