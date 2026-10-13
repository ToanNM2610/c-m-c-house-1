/**
 * Comprehensive System Verification Suite for Cẩm Cù House
 * Covers Section 14 (Kiểm thử) and Section 15 (Tiêu chí nghiệm thu Phase 0-7)
 */

import { getStatus } from "../src/lib/status";
import { MENU_ITEMS, MENU_CATEGORIES } from "../src/data/menu";
import { generateTotpSecret, generateTotpCode, verifyTotpCode } from "../src/lib/totp";
import rawBackupData from "../src/data/backup/camcu_raw_backup.json";

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`✓ PASSED: ${msg}`);
}

async function runSystemVerification() {
  console.log("\n========================================================");
  console.log("  CẨM CÙ HOUSE — TỔNG HỢP KIỂM TRA HỆ THỐNG TOÀN DIỆN  ");
  console.log("========================================================\n");

  // 1. Kiểm tra Single Source of Truth cho getStatus
  console.log("--- 1. Kiểm tra Logic Trạng Thái Hoạt Động (lib/status.ts) ---");
  const mon10am = new Date("2026-10-12T10:00:00+07:00");
  const status1 = getStatus(mon10am);
  assert(status1.state === "open", "Thứ Hai 10h sáng phải Đang Mở Cửa");

  const mon19pm = new Date("2026-10-12T19:00:00+07:00");
  const status2 = getStatus(mon19pm);
  assert(status2.state === "closed", "Thứ Hai 19h tối phải Đã Đóng Cửa");

  const fri20pm = new Date("2026-10-16T20:30:00+07:00");
  const status3 = getStatus(fri20pm);
  assert(status3.state === "open", "Thứ Sáu 20h30 phải Đang Mở Cửa (mở đến 22h)");

  // 2. Bảo toàn dữ liệu 100%
  console.log("\n--- 2. Kiểm tra Bảo Toàn Dữ Liệu Quán (Section 1 & 13) ---");
  assert(MENU_ITEMS.length === 67, `Số lượng món thực đơn = 67 (Hiện tại: ${MENU_ITEMS.length})`);
  assert(MENU_CATEGORIES.length === 8, `Số lượng danh mục thực đơn = 8 (Hiện tại: ${MENU_CATEGORIES.length})`);
  assert(rawBackupData.space_items.length === 30, `Số lượng ảnh không gian = 30 (Hiện tại: ${rawBackupData.space_items.length})`);
  assert(rawBackupData.reviews.length === 6, `Số lượng đánh giá xác minh = 6 (Hiện tại: ${rawBackupData.reviews.length})`);
  assert(rawBackupData.settings.brandName === "Cẩm Cù House", "Tên quán luôn có dấu: 'Cẩm Cù House'");
  assert(rawBackupData.settings.hotline1 === "038 285 1688", "Hotline 1 Zalo: 038 285 1688");
  assert(rawBackupData.settings.hotline2 === "077 465 9000", "Hotline 2: 077 465 9000");
  assert(rawBackupData.settings.coordinates.display === "11.99° N, 107.69° E", "Tọa độ: 11.99° N, 107.69° E");

  // 3. Kiểm tra Thuật toán 2FA TOTP RFC 6238
  console.log("\n--- 3. Kiểm tra Bảo Mật Xác Thực 2 Lớp TOTP (RFC 6238) ---");
  const secret = generateTotpSecret();
  assert(secret.length >= 16, `Khóa TOTP Base32 sinh đủ độ dài chuẩn an toàn (Độ dài: ${secret.length})`);
  const code = generateTotpCode(secret);
  assert(/^\d{6}$/.test(code), `Mã TOTP phải là chuỗi 6 chữ số: ${code}`);
  const isValid = verifyTotpCode(secret, code);
  assert(isValid, "Mã TOTP vừa sinh phải được xác thực thành công");
  const isInvalid = verifyTotpCode(secret, "000000");
  assert(!isInvalid, "Mã TOTP giả mạo (000000) bị chặn chính xác");

  console.log("\n========================================================");
  console.log("  ✓ TẤT CẢ CÁC BÀI TEST HỆ THỐNG ĐÃ ĐẠT 100% TIÊU CHÍ!  ");
  console.log("========================================================\n");
}

runSystemVerification().catch((err) => {
  console.error("Lỗi trong quá trình kiểm thử:", err);
  process.exit(1);
});
