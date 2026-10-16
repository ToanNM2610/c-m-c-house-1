/**
 * CẨM CÙ HOUSE — KIỂM THỬ THUẬT TOÁN TÌM KIẾM TIẾNG VIỆT KHÔNG DẤU & DRIZZLE
 */

import {
  removeVietnameseTones,
  tokenizeQuery,
  matchesVietnameseSearch,
  scoreVietnameseSearch,
  searchMenuItemsLocally,
  searchSpaceItemsLocally,
  searchMenuItemsFromDb,
  searchGalleryItemsFromDb,
} from "../src/lib/search";
import { MENU_ITEMS } from "../src/data/menu";
import { SPACE_ITEMS } from "../src/data/space";

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`✓ PASSED: ${msg}`);
}

async function runTests() {
  console.log("\n========================================================");
  console.log("  CẨM CÙ HOUSE — KIỂM TRA TÌM KIẾM TIẾNG VIỆT KHÔNG DẤU  ");
  console.log("========================================================\n");

  // 1. Kiểm tra xóa dấu tiếng Việt (Accent Stripping)
  console.log("--- 1. Kiểm tra Xóa Dấu Tiếng Việt & Chuẩn Hóa Chuỗi ---");
  assert(removeVietnameseTones("Cà Phê Muối") === "ca phe muoi", "Xóa dấu 'Cà Phê Muối' -> 'ca phe muoi'");
  assert(removeVietnameseTones("CẨM CÙ HOUSE") === "cam cu house", "Xóa dấu chữ hoa 'CẨM CÙ HOUSE' -> 'cam cu house'");
  assert(removeVietnameseTones("Đắk Nông Hùng Vương") === "dak nong hung vuong", "Xử lý đ/Đ và dấu Tây Nguyên chính xác");
  assert(removeVietnameseTones("Trà Ô Long Sữa Nướng") === "tra o long sua nuong", "Xử lý nguyên âm kép Ô, Ư, Ơ");
  assert(removeVietnameseTones("Bạc Xỉu Đá / Nóng") === "bac xiu da / nong", "Bảo toàn ký tự phân cách");

  // Unicode NFD (Tách rời ký tự và dấu)
  const nfdStr = "Cà Phê".normalize("NFD");
  assert(removeVietnameseTones(nfdStr) === "ca phe", "Xử lý hoàn hảo Unicode NFD decomposed");

  // 2. Kiểm tra Phân Tách Từ Khóa (Tokenization)
  console.log("\n--- 2. Kiểm tra Tokenization & Multi-Word Query ---");
  const tokens = tokenizeQuery("  cà phê,  sữa   đá!  ");
  assert(tokens.length === 4, "Tách đúng 4 tokens từ khóa (ca, phe, sua, da)");
  assert(
    tokens[0] === "ca" && tokens[1] === "phe" && tokens[2] === "sua" && tokens[3] === "da",
    "Tokens được chuẩn hóa chữ thường không dấu"
  );

  // 3. Kiểm tra Khớp Không Phụ Thuộc Thứ Tự (AND-Matching)
  console.log("\n--- 3. Kiểm tra Khớp Từ Khóa Đa Hướng (Order-Independent) ---");
  assert(
    matchesVietnameseSearch(["Cà Phê Sữa Tươi"], "sua ca phe"),
    "Tìm 'sua ca phe' khớp được 'Cà Phê Sữa Tươi' (đảo thứ tự từ)"
  );
  assert(
    matchesVietnameseSearch(["Trà Mãng Cầu Đắk Nông"], "mang cau tra"),
    "Tìm 'mang cau tra' khớp được 'Trà Mãng Cầu'"
  );
  assert(
    !matchesVietnameseSearch(["Trà Xanh"], "ca phe"),
    "Từ khóa không có trong tên thì không khớp"
  );

  // 4. Kiểm tra Trọng Số & Điểm Xếp Hạng (Relevance Scoring)
  console.log("\n--- 4. Kiểm tra Điểm Số Liên Quan (Relevance Scoring) ---");
  const scoreExact = scoreVietnameseSearch("Cà Phê", "", "ca-phe", "ca phe");
  const scorePartial = scoreVietnameseSearch("Cà Phê Muối Kem Béo", "", "ca-phe", "ca phe");
  assert(scoreExact > scorePartial, `Khớp chính xác (${scoreExact}) có điểm cao hơn khớp một phần (${scorePartial})`);

  // 5. Kiểm tra Tìm Kiếm Trên Toàn Bộ 67 Món Thực Đơn
  console.log("\n--- 5. Kiểm tra Tìm Kiếm Trên 67 Món Thực Đơn Cẩm Cù House ---");
  const allEmpty = searchMenuItemsLocally(MENU_ITEMS, "");
  assert(allEmpty.length === 67, `Truy vấn rỗng bảo toàn đủ 67 món (Thực tế: ${allEmpty.length})`);

  const coffeeResults = searchMenuItemsLocally(MENU_ITEMS, "ca phe");
  assert(coffeeResults.length >= 9, `Tìm 'ca phe' trả về danh sách cà phê phong phú (Tìm thấy: ${coffeeResults.length} món)`);
  assert(
    coffeeResults.every(
      (item) =>
        removeVietnameseTones(item.name).includes("ca phe") ||
        removeVietnameseTones(item.category).includes("ca-phe") ||
        removeVietnameseTones(item.categoryName).includes("ca phe") ||
        removeVietnameseTones(item.description).includes("ca phe")
    ),
    "Mọi kết quả trả về đều liên quan đến cà phê (Tên, Mô tả hoặc Danh mục)"
  );

  const teaResults = searchMenuItemsLocally(MENU_ITEMS, "tra");
  assert(teaResults.length >= 10, `Tìm 'tra' trả về danh sách trà phong phú (Tìm thấy: ${teaResults.length} món)`);

  const bacXiu = searchMenuItemsLocally(MENU_ITEMS, "bac xiu");
  assert(bacXiu.length > 0 && bacXiu[0].name.toLowerCase().includes("bạc xỉu"), "Tìm 'bac xiu' ra món Bạc Xỉu đầu tiên");

  const banhMi = searchMenuItemsLocally(MENU_ITEMS, "banh mi");
  assert(banhMi.length > 0 && banhMi[0].name.toLowerCase().includes("bánh mì"), "Tìm 'banh mi' ra các món bánh mì thơm ngon");

  // 6. Kiểm tra Tìm Kiếm Trên 30 Góc Không Gian Quán
  console.log("\n--- 6. Kiểm tra Tìm Kiếm Trên 30 Góc Không Gian Sinh Thái ---");
  const spaceEmpty = searchSpaceItemsLocally(SPACE_ITEMS, "");
  assert(spaceEmpty.length === 30, `Truy vấn rỗng bảo toàn đủ 30 ảnh không gian (Thực tế: ${spaceEmpty.length})`);

  const streamResults = searchSpaceItemsLocally(SPACE_ITEMS, "suoi da");
  assert(streamResults.length > 0, `Tìm 'suoi da' tìm thấy góc suối đá (Tìm thấy: ${streamResults.length} ảnh)`);

  const terraceResults = searchSpaceItemsLocally(SPACE_ITEMS, "hien go");
  assert(terraceResults.length > 0, `Tìm 'hien go' tìm thấy hiên gỗ (Tìm thấy: ${terraceResults.length} ảnh)`);

  // 7. Kiểm tra Tích Hợp Drizzle Fallback / Truy Vấn
  console.log("\n--- 7. Kiểm tra Hàm Tìm Kiếm Drizzle ORM (Fallback & Integrity) ---");
  const dbMenuItems = await searchMenuItemsFromDb("matcha");
  assert(dbMenuItems.length > 0, `searchMenuItemsFromDb('matcha') trả về kết quả hợp lệ (${dbMenuItems.length} món)`);

  const dbSpaceItems = await searchGalleryItemsFromDb("suoi");
  assert(dbSpaceItems.length > 0, `searchGalleryItemsFromDb('suoi') trả về kết quả hợp lệ (${dbSpaceItems.length} ảnh)`);

  console.log("\n========================================================");
  console.log("  ✓ TẤT CẢ BÀI TEST TÌM KIẾM TIẾNG VIỆT ĐỀU ĐẠT 100%!   ");
  console.log("========================================================\n");
}

runTests().catch((err) => {
  console.error("Test failed with exception:", err);
  process.exit(1);
});
