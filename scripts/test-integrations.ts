import { encryptSecret, decryptSecret, maskSecret, hashPassword, verifyPassword } from "../src/lib/crypto";
import {
  getAllIntegrations,
  saveIntegration,
  getDecryptedIntegrationValue,
  deleteIntegration,
  logIntegrationAudit,
  getIntegrationAuditLogs,
  verifyAdminCredentials,
} from "../src/data/store";
import { getPublicIntegrations } from "../src/lib/integrations";

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`✓ PASSED: ${msg}`);
}

async function runTests() {
  console.log("\n========================================================");
  console.log("  CẨM CÙ HOUSE — KIỂM TRA TÍCH HỢP & BẢO MẬT KHÓA       ");
  console.log("========================================================\n");

  // 1. Kiểm tra mã hóa AES-256-GCM
  console.log("--- 1. Kiểm tra AES-256-GCM Encryption & Masking ---");
  const testSecret = "AIzaSyD-SecretGoogleKey-99881234";
  const encrypted = encryptSecret(testSecret);
  assert(encrypted !== testSecret, "Bí mật được mã hóa khác giá trị gốc");
  assert(encrypted.split(":").length === 3, "Định dạng mã hóa gồm 3 phần iv:authTag:cipher");

  const decrypted = decryptSecret(encrypted);
  assert(decrypted === testSecret, "Giải mã khôi phục chính xác 100% bí mật");

  const masked = maskSecret(testSecret);
  assert(masked === "••••1234", `Mặt nạ bí mật đúng dạng ••••1234 (Kết quả: ${masked})`);

  const shortMask = maskSecret("abc");
  assert(shortMask === "••••", "Chuỗi ngắn che hoàn toàn ••••");

  // 2. Kiểm tra Hash & Verify mật khẩu
  console.log("\n--- 2. Kiểm tra Hash Mật Khẩu (PBKDF2) ---");
  const pwd = "CamCuHouse2026!SecureKey";
  const hashed = hashPassword(pwd);
  assert(hashed.length === 128, "Hash PBKDF2 có độ dài 128 hex ký tự (SHA-512)");
  assert(verifyPassword(pwd, hashed), "Xác thực đúng mật khẩu thành công");
  assert(!verifyPassword("WrongPassword123!", hashed), "Mật khẩu sai bị từ chối");

  // 3. Kiểm tra Lưu / Lấy / Xóa Integration Settings
  console.log("\n--- 3. Kiểm tra Store Integration Settings & Audit Log ---");
  await saveIntegration("ga4_measurement_id", "G-TEST123456", "admin_tester");
  await saveIntegration("google_places_api_key", "AIzaSyPlacesKey-5678", "Google Places Key", true);

  const all = await getAllIntegrations();
  const ga = all.find((i) => i.key === "ga4_measurement_id");
  assert(!!ga && ga.value === "G-TEST123456", "GA ID công khai lưu và trả về chính xác");
  assert(ga?.isSecret === false, "GA ID được đánh dấu isSecret = false");

  const places = all.find((i) => i.key === "google_places_api_key");
  assert(!!places && places.isSecret === true, "Places API key được đánh dấu isSecret = true");
  assert(places?.value !== "AIzaSyPlacesKey-5678", "Giá trị bí mật trong DB được mã hóa AES-256-GCM, không phải plaintext");

  const decryptedPlaces = await getDecryptedIntegrationValue("google_places_api_key");
  assert(decryptedPlaces === "AIzaSyPlacesKey-5678", "Server giải mã được giá trị gốc trong nội bộ");
  assert(maskSecret(decryptedPlaces) === "••••5678", "Client nhận mặt nạ ••••5678 an toàn");

  // 4. Kiểm tra Public Integrations (Website công khai)
  console.log("\n--- 4. Kiểm tra Public Integrations Cho Layout Công Khai ---");
  const pub = await getPublicIntegrations();
  assert(pub.ga4MeasurementId === "G-TEST123456", "Public integrations lấy được GA ID");

  // 5. Kiểm tra Nhật Ký Kiểm Toán (Audit Log)
  console.log("\n--- 5. Kiểm tra Nhật Ký Kiểm Toán (Không lưu secret) ---");
  logIntegrationAudit("admin_tester", "update", "google_places_api_key", "127.0.0.1");
  const logs = getIntegrationAuditLogs();
  assert(logs.length > 0, "Ghi nhận được nhật ký kiểm toán");
  assert(logs[0].keyName === "google_places_api_key", "Nhật ký lưu đúng key");
  assert(JSON.stringify(logs).indexOf("AIzaSyPlacesKey-5678") === -1, "TUYỆT ĐỐI không có giá trị bí mật trong audit log");

  // 6. Kiểm tra Test Kết Nối & Xử Lý Lỗi Google APIs
  console.log("\n--- 6. Kiểm tra Xử Lý Lỗi & Test Kết Nối Khóa ---");
  const { testIntegrationConnection, fetchGa4Analytics, fetchSearchConsoleData } = await import("../src/lib/google-apis");

  await deleteIntegration("ga4_measurement_id");
  const gaInvalid = await testIntegrationConnection("ga4_measurement_id");
  assert(gaInvalid.success === false, "Kiểm tra GA ID trống báo lỗi rõ ràng");

  await saveIntegration("ga4_measurement_id", "G-INVALID123", "GA4 Measurement ID", false);
  const gaValidFormat = await testIntegrationConnection("ga4_measurement_id");
  assert(gaValidFormat.success === true, "GA ID đúng định dạng G-XXXXXXXXXX được xác nhận hợp lệ");

  const badJsonTest = await testIntegrationConnection("google_service_account_json");
  assert(badJsonTest.success === false, "Service account rỗng/sai JSON báo lỗi an toàn, không crash server");

  // 7. Kiểm tra GA4 & Search Console khi chưa có Service Account
  console.log("\n--- 7. Kiểm tra GA4 & GSC khi Chưa Cấu Hình Service Account ---");
  const gaData = await fetchGa4Analytics(7);
  assert(gaData.connected === false, "GA4 Analytics trả về connected=false an toàn khi chưa có JSON");
  assert(gaData.overview.totalUsers === 0, "Không hiển thị số liệu người dùng giả mạo");

  const gscData = await fetchSearchConsoleData(7);
  assert(gscData.connected === false, "GSC trả về connected=false an toàn khi chưa có JSON");
  assert(gscData.overview.totalClicks === 0, "GSC không hiển thị số liệu clicks giả mạo");

  // Dọn dẹp
  await deleteIntegration("ga4_measurement_id");
  await deleteIntegration("google_places_api_key");

  console.log("\n========================================================");
  console.log("  ✓ TẤT CẢ KIỂM THỬ TÍCH HỢP & BẢO MẬT ĐỀU ĐẠT 100%!   ");
  console.log("========================================================\n");
}

runTests().catch((e) => {
  console.error("Test failed:", e);
  process.exit(1);
});
