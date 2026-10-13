import assert from "assert";
import { getStatus } from "../src/lib/status";

console.log("=== RUNNING UNIT TESTS FOR getStatus(now) ===");

// 1. Test Monday normal open (e.g. 10:00 VN time on Monday)
// 2026-10-12 was a Monday. 10:00 AM VN time = 03:00 UTC
{
  const mon10am = new Date("2026-10-12T03:00:00Z");
  const res = getStatus(mon10am);
  assert.strictEqual(res.state, "open", "Monday 10:00 should be open");
  assert.strictEqual(res.closes_at, "18:00", "Monday closes at 18:00");
  console.log("✓ Test 1 Passed: Monday 10:00 AM is open (closes at 18:00)");
}

// 2. Test Monday near closing (e.g. 17:45 VN time on Monday = 15 mins remaining)
// 17:45 VN = 10:45 UTC
{
  const mon545pm = new Date("2026-10-12T10:45:00Z");
  const res = getStatus(mon545pm);
  assert.strictEqual(res.state, "closing_soon", "Monday 17:45 should be closing_soon");
  assert.strictEqual(res.minutes_remaining, 15, "Should have 15 minutes remaining");
  console.log("✓ Test 2 Passed: Sát giờ đóng cửa (còn 15 phút)");
}

// 3. Test Monday after closing (e.g. 19:00 VN time on Monday)
// 19:00 VN = 12:00 UTC
{
  const mon7pm = new Date("2026-10-12T12:00:00Z");
  const res = getStatus(mon7pm);
  assert.strictEqual(res.state, "closed", "Monday 19:00 should be closed");
  console.log("✓ Test 3 Passed: Monday 19:00 is closed");
}

// 4. Test Friday open late until 22:00 (e.g. 20:30 VN time on Friday)
// 2026-10-16 was a Friday. 20:30 VN = 13:30 UTC
{
  const fri830pm = new Date("2026-10-16T13:30:00Z");
  const res = getStatus(fri830pm);
  assert.strictEqual(res.state, "open", "Friday 20:30 should still be open");
  assert.strictEqual(res.closes_at, "22:00", "Friday closes at 22:00");
  console.log("✓ Test 4 Passed: Thứ 6 mở đến 22:00 (20:30 vẫn mở)");
}

// 5. Test Friday near closing (e.g. 21:50 VN time on Friday = 10 mins remaining)
// 21:50 VN = 14:50 UTC
{
  const fri950pm = new Date("2026-10-16T14:50:00Z");
  const res = getStatus(fri950pm);
  assert.strictEqual(res.state, "closing_soon", "Friday 21:50 should be closing_soon");
  assert.strictEqual(res.minutes_remaining, 10, "Should have 10 minutes remaining");
  console.log("✓ Test 5 Passed: Thứ 6 sát giờ đóng (21:50 còn 10 phút)");
}

// 6. Test past midnight (e.g. 01:30 VN time)
// 01:30 VN = 18:30 UTC previous day
{
  const pastMidnight = new Date("2026-10-12T18:30:00Z");
  const res = getStatus(pastMidnight);
  assert.strictEqual(res.state, "closed", "Past midnight should be closed");
  console.log("✓ Test 6 Passed: Qua nửa đêm (01:30 sáng) đã đóng cửa");
}

// 7. Test Closure / Holiday
{
  const testDate = new Date("2026-10-12T03:00:00Z"); // Monday 10am normally open
  const closures = [
    { date_from: "2026-10-10", date_to: "2026-10-15", reason_vi: "Nghỉ bảo trì suối đá" }
  ];
  const res = getStatus(testDate, { closures });
  assert.strictEqual(res.state, "closed", "Should be closed during closure range");
  assert.strictEqual(res.label_vi, "Nghỉ bảo trì suối đá");
  console.log("✓ Test 7 Passed: Ngày nghỉ đột xuất / bảo trì bờ suối");
}

// 8. Test Override active vs expired
{
  const now = new Date("2026-10-12T15:00:00Z"); // 22:00 VN (normally closed)
  // Active override until 23:00 VN
  const activeOverride = {
    mode: "open" as const,
    until: "2026-10-12T16:00:00Z", // 23:00 VN
  };
  const resActive = getStatus(now, { override: activeOverride });
  assert.strictEqual(resActive.state, "open", "Override should force open");
  console.log("✓ Test 8 Passed: Override mở cửa đột xuất có hiệu lực");

  // Expired override (until was 21:00 VN)
  const expiredOverride = {
    mode: "open" as const,
    until: "2026-10-12T14:00:00Z", // 21:00 VN
  };
  const resExpired = getStatus(now, { override: expiredOverride });
  assert.strictEqual(resExpired.state, "closed", "Expired override should fallback to auto (closed)");
  console.log("✓ Test 9 Passed: Override hết hạn tự động quay về lịch chuẩn (auto)");
}

console.log("\nALL 9 UNIT TESTS PASSED WITH 100% SUCCESS!");
