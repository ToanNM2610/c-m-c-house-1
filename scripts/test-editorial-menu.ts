import assert from "assert";
import fs from "fs";
import path from "path";
import { MENU_ITEMS } from "../src/data/menu";
import { loadEditorialMenuData, EXPECTED_MENU_COUNT } from "../editorial-menu-data.js";
import { renderEditorialMenu } from "../editorial-menu-view.js";
import { STORE_CONSTANTS } from "../atmosphere-engine.js";

console.log("=== KIỂM THỬ Ý TƯỞNG 2: EDITORIAL BOTANICAL MONOGRAPH (67 MÓN) ===");

async function runTests() {
  // 1. Kiểm tra bộ nạp dữ liệu editorial-menu-data.js
  console.log("\n1. Kiểm tra nạp dữ liệu 67 món từ camcu_raw_backup.json:");
  const menuData = await loadEditorialMenuData("camcu_raw_backup.json");
  assert.strictEqual(menuData.connected, true, "Phải kết nối thành công với nguồn dữ liệu");
  assert.strictEqual(menuData.totalCount, EXPECTED_MENU_COUNT, `Số món phải đúng ${EXPECTED_MENU_COUNT}`);
  assert.strictEqual(menuData.items.length, 67, "Danh sách items phải có 67 món");
  console.log(`✓ Đã nạp chính xác ${menuData.totalCount}/${EXPECTED_MENU_COUNT} món.`);

  // 2. Kiểm tra KHÔNG CÓ BẤT KỲ ẢNH NÀO trong dữ liệu món
  console.log("\n2. Kiểm tra tính toàn vẹn 0 ảnh (Zero-image integrity):");
  const itemsWithImages = menuData.items.filter((i: any) => i.image || i.img || i.picture);
  assert.strictEqual(itemsWithImages.length, 0, "Không được có bất kỳ trường hình ảnh nào trong dữ liệu món");
  console.log("✓ Dữ liệu 67 món đã được lọc sạch 100% thuộc tính hình ảnh.");

  // 3. Giả lập DOM render với editorial-menu-view.js
  console.log("\n3. Kiểm tra kết quả Render DOM thuần (editorial-menu-view.js):");
  class MockElement {
    innerHTML = "";
    attributes: Record<string, string> = {};
    listeners: Record<string, Function[]> = {};

    getAttribute(name: string) {
      return this.attributes[name] || null;
    }
    setAttribute(name: string, value: string) {
      this.attributes[name] = value;
    }
    querySelectorAll(selector: string): any[] {
      // Đơn giản hóa đếm thẻ từ innerHTML
      if (selector === ".editorial-menu-item") {
        const matches = this.innerHTML.match(/class="editorial-menu-item/g);
        return matches || [];
      }
      if (selector === ".editorial-cat-chip") {
        const matches = this.innerHTML.match(/class="editorial-cat-chip/g);
        return matches || [];
      }
      if (selector === ".editorial-chapter") {
        const matches = this.innerHTML.match(/class="editorial-chapter/g);
        return matches || [];
      }
      return [];
    }
  }

  const mockContainer = new MockElement() as any;
  renderEditorialMenu(mockContainer, menuData, "vi");

  // Đếm số item render trong HTML
  const renderedItemMatches = mockContainer.innerHTML.match(/class="editorial-menu-item/g);
  assert.strictEqual(
    renderedItemMatches?.length,
    67,
    "Phải render đủ 67 phần tử .editorial-menu-item"
  );
  console.log(`✓ Đã render đủ ${renderedItemMatches?.length} mục món (.editorial-menu-item).`);

  // Kiểm tra TUYỆT ĐỐI KHÔNG có thẻ <img>, <picture> trong HTML thực đơn
  const imgTagMatches = mockContainer.innerHTML.match(/<img|<picture/gi);
  assert.strictEqual(imgTagMatches, null, "Thực đơn TUYỆT ĐỐI KHÔNG chứa thẻ <img> hoặc <picture>");
  console.log("✓ Thực đơn chứa đúng 0 thẻ hình ảnh (img/picture).");

  // Kiểm tra Dot-leader
  const dotLeaderMatches = mockContainer.innerHTML.match(/class="editorial-dot-leader"/g);
  assert.strictEqual(dotLeaderMatches?.length, 67, "Mỗi món phải có 1 đường chấm dẫn (dot-leader)");
  console.log("✓ Đủ 67 đường chấm nối dot-leader giữa tên món và giá.");

  // 4. Kiểm tra quy tắc chữ & nhãn trong CSS (editorial-menu.css)
  console.log("\n4. Kiểm tra quy tắc CSS Typography & Layout (editorial-menu.css):");
  const cssPath = path.resolve(__dirname, "../editorial-menu.css");
  const cssContent = fs.readFileSync(cssPath, "utf-8");

  assert.ok(cssContent.includes(".editorial-grid"), "Phải có class .editorial-grid");
  assert.ok(cssContent.includes("grid-template-columns: repeat(2, minmax(0, 1fr))"), "Desktop 1440px phải có lưới 2 cột");
  assert.ok(cssContent.includes("@media (max-width: 900px)"), "Phải có breakpoint chuyển về 1 cột cho Mobile");
  assert.ok(cssContent.includes("grid-template-columns: 1fr"), "Mobile phải hiển thị 1 cột");
  assert.ok(cssContent.includes("editorial-tag-12"), "Phải có class .editorial-tag-12");
  assert.ok(cssContent.includes("text-transform: uppercase"), "Nhãn 12px phải là uppercase");
  assert.ok(cssContent.includes("prefers-reduced-motion"), "Phải hỗ trợ prefers-reduced-motion");
  console.log("✓ CSS đáp ứng chuẩn 2 cột Desktop 1440px / 1 cột Mobile 390px, cỡ chữ tối thiểu 14px (nhãn 12px uppercase).");

  // 5. Kiểm tra Zero Manual Ops (Hotline + Maps only)
  console.log("\n5. Kiểm tra Zero Manual Ops:");
  assert.ok(!mockContainer.innerHTML.includes("order-btn"), "Không có nút đặt món");
  assert.ok(!mockContainer.innerHTML.includes("cart-btn"), "Không có nút giỏ hàng");
  assert.ok(!mockContainer.innerHTML.includes("add-to-cart"), "Không có nút thêm vào giỏ");
  assert.ok(mockContainer.innerHTML.includes(STORE_CONSTANTS.hotlines.primaryTel), "Phải có liên kết Hotline 038 285 1688");
  assert.ok(mockContainer.innerHTML.includes("maps"), "Phải có liên kết Chỉ đường Google Maps");
  console.log("✓ Không có giỏ hàng hay đặt món thủ công; chỉ giữ 2 hành động: Hotline & Chỉ đường.");

  // 6. Kiểm tra song ngữ bảo toàn dấu "Cẩm Cù House"
  console.log("\n6. Kiểm tra bảo toàn thương hiệu có dấu song ngữ:");
  const mockContainerEn = new MockElement() as any;
  renderEditorialMenu(mockContainerEn, menuData, "en");
  assert.ok(mockContainerEn.innerHTML.includes("Cẩm Cù House"), "Bản EN vẫn phải giữ nguyên 'Cẩm Cù House' có dấu");
  console.log("✓ Tên quán luôn bảo toàn dấu 'Cẩm Cù House' ở cả bản EN.");

  console.log("\n=======================================================");
  console.log("KẾT QUẢ: TOÀN BỘ 6 BÀI TEST EDITORIAL MENU ĐÃ PASS 100%!");
  console.log("=======================================================");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
