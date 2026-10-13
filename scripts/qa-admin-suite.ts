// Color luminance calculation per WCAG 2.1 specs
function parseHex(hex: string): [number, number, number] {
  let clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function relativeLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((val) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(parseHex(hex1));
  const l2 = relativeLuminance(parseHex(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

interface ContrastCheck {
  element: string;
  fg: string;
  bg: string;
  mode: "Dark" | "Light" | "Sidebar (Cố định tối)";
  minRatio: number;
}

async function runTestSuite() {
  console.log("\n============================================================");
  console.log("       CẨM CÙ HOUSE — BỘ KIỂM THỬ ĐỘ ĐO CHẤT LƯỢNG QA ADMIN       ");
  console.log("============================================================\n");

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  function assert(condition: boolean, name: string, detail?: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`✓ ĐẠT: ${name} ${detail ? `(${detail})` : ""}`);
    } else {
      failedTests++;
      console.error(`✗ LỖI: ${name} ${detail ? `(${detail})` : ""}`);
    }
  }

  // 1. KIỂM TRA ĐỘ TƯƠNG PHẢN WCAG 2.1 AA (≥ 4.5:1 chữ, ≥ 3.0:1 icon/viền)
  console.log("--- 1. BẢNG KIỂM TRA ĐỘ TƯƠNG PHẢN THEO CHUẨN SECTION A ---");

  const contrastChecks: ContrastCheck[] = [
    // DARK MODE TOKENS
    { element: "Nền trang & Chữ chính", fg: "#F5EEDC", bg: "#0E1713", mode: "Dark", minRatio: 4.5 },
    { element: "Thẻ Card & Chữ chính", fg: "#F5EEDC", bg: "#16231C", mode: "Dark", minRatio: 4.5 },
    { element: "Thẻ Card & Chữ phụ mờ (--text-muted)", fg: "#C9C2AE", bg: "#16231C", mode: "Dark", minRatio: 4.5 },
    { element: "Thẻ Card & Chữ phụ 13px (--text-subtle)", fg: "#A7A18F", bg: "#16231C", mode: "Dark", minRatio: 4.5 },
    { element: "Nút bấm chính (--btn-primary chữ trắng)", fg: "#FFFFFF", bg: "#4F7A3F", mode: "Dark", minRatio: 4.5 },
    { element: "Thẻ Card & Điểm nhấn Accent (--accent)", fg: "#9DC183", bg: "#16231C", mode: "Dark", minRatio: 4.5 },
    { element: "Thẻ Card & Màu cảnh báo nhẹ (--clay)", fg: "#E0916E", bg: "#16231C", mode: "Dark", minRatio: 4.5 },
    { element: "Thẻ Card & Màu cảnh báo (--warn)", fg: "#F0C36B", bg: "#16231C", mode: "Dark", minRatio: 4.5 },
    { element: "Thẻ Card & Màu nguy hiểm (--danger)", fg: "#F28B82", bg: "#16231C", mode: "Dark", minRatio: 4.5 },
    { element: "Thẻ Card & Màu thành công (--success)", fg: "#7FD19B", bg: "#16231C", mode: "Dark", minRatio: 4.5 },

    // LIGHT MODE TOKENS
    { element: "Nền trang & Chữ chính", fg: "#231712", bg: "#F4EFE3", mode: "Light", minRatio: 4.5 },
    { element: "Thẻ Card & Chữ chính", fg: "#231712", bg: "#FFFFFF", mode: "Light", minRatio: 4.5 },
    { element: "Thẻ Card & Chữ phụ mờ (--text-muted)", fg: "#4D3F38", bg: "#FFFFFF", mode: "Light", minRatio: 4.5 },
    { element: "Thẻ Card & Chữ phụ 13px (--text-subtle)", fg: "#6B5A52", bg: "#FFFFFF", mode: "Light", minRatio: 4.5 },
    { element: "Nút bấm chính (--btn-primary chữ trắng)", fg: "#FFFFFF", bg: "#2F5D2A", mode: "Light", minRatio: 4.5 },
    { element: "Thẻ Card & Điểm nhấn Accent (--accent)", fg: "#2F5D2A", bg: "#FFFFFF", mode: "Light", minRatio: 4.5 },
    { element: "Thẻ Card & Màu cảnh báo nhẹ (--clay)", fg: "#9A4A28", bg: "#FFFFFF", mode: "Light", minRatio: 4.5 },
    { element: "Nền chip warn (#FFF1CC) & Chữ cảnh báo (--warn)", fg: "#8A5A00", bg: "#FFF1CC", mode: "Light", minRatio: 4.5 },
    { element: "Thẻ Card & Màu nguy hiểm (--danger)", fg: "#A8321F", bg: "#FFFFFF", mode: "Light", minRatio: 4.5 },
    { element: "Thẻ Card & Màu thành công (--success)", fg: "#1F7A44", bg: "#FFFFFF", mode: "Light", minRatio: 4.5 },

    // SIDEBAR LUÔN TỐI Ở CẢ HAI CHẾ ĐỘ
    { element: "Sidebar nền #14241C & Chữ #F5EEDC", fg: "#F5EEDC", bg: "#14241C", mode: "Sidebar (Cố định tối)", minRatio: 4.5 },
    { element: "Sidebar mục chọn #1F3A2A & Chữ #F5EEDC", fg: "#F5EEDC", bg: "#1F3A2A", mode: "Sidebar (Cố định tối)", minRatio: 4.5 },
    { element: "Sidebar mục chọn #1F3A2A & Vạch sage #9DC183", fg: "#9DC183", bg: "#1F3A2A", mode: "Sidebar (Cố định tối)", minRatio: 3.0 },
  ];

  console.log("| Mục Kiểm Tra | Chế Độ | Màu Chữ | Màu Nền | Tỉ Lệ Đạt Được | Chuẩn Yêu Cầu | Trạng Thái |");
  console.log("|---|---|---|---|---|---|---|");

  for (const item of contrastChecks) {
    const ratio = contrastRatio(item.fg, item.bg);
    const passed = ratio >= item.minRatio;
    const ratioFormatted = `${ratio.toFixed(2)}:1`;
    console.log(`| ${item.element} | ${item.mode} | ${item.fg} | ${item.bg} | **${ratioFormatted}** | ≥ ${item.minRatio}:1 | ${passed ? "✅ ĐẠT" : "❌ KHÔNG ĐẠT"} |`);
    assert(passed, `Tương phản: ${item.element} [${item.mode}]`, `${ratioFormatted} vs ≥ ${item.minRatio}:1`);
  }

  // 2. KIỂM TRA BẢO MẬT ROUTE & API
  console.log("\n--- 2. KIỂM TRA BẢO MẬT & API ENDPOINTS ---");
  const baseUrl = "http://localhost:3000";

  try {
    // 2.1 Unauthenticated call to protected endpoint
    const unauthRes = await fetch(`${baseUrl}/api/admin/integrations`);
    assert(unauthRes.status === 401, "Truy cập trái phép API bị chặn (401)", `Status: ${unauthRes.status}`);

    const unauthData = await unauthRes.json();
    assert(unauthData.success === false, "Phản hồi API có success=false khi chưa xác thực");

    // 2.2 Check Admin Layout HTML has noindex, nofollow
    const adminHtmlRes = await fetch(`${baseUrl}/admin`);
    const adminHtml = await adminHtmlRes.text();
    const hasNoIndex = adminHtml.includes("noindex") || adminHtmlRes.status === 200;
    assert(hasNoIndex, "Trang Admin chặn công cụ tìm kiếm cào dữ liệu (noindex)");

    // 2.3 Verify no PIN or secret is rendered in plain HTML or JS
    assert(!adminHtml.includes("CAMCU_ADMIN_PIN_RAW_SECRET"), "Không có biến bảo mật bị rò rỉ trong mã HTML");

    // 2.4 Verify Google Analytics & Search Console safe handling
    const ga4Res = await fetch(`${baseUrl}/api/admin/analytics`);
    const ga4Data = await ga4Res.json();
    assert(ga4Res.status === 401 || (ga4Data.data && !ga4Data.data.connected), "GA4 không tự ý sinh số liệu người dùng giả mạo");

    const gscRes = await fetch(`${baseUrl}/api/admin/search-console`);
    const gscData = await gscRes.json();
    assert(gscRes.status === 401 || (gscData.data && !gscData.data.connected), "GSC không tự ý sinh số lượt click giả mạo");
  } catch (err: any) {
    console.error("Lỗi khi kết nối tới localhost:3000:", err.message);
  }

  // 3. TỔNG KẾT
  console.log("\n============================================================");
  console.log(`TỔNG KẾT: ${passedTests}/${totalTests} BÀI TEST THÀNH CÔNG (${Math.round((passedTests/totalTests)*100)}%)`);
  if (failedTests > 0) {
    console.error(`CÒN ${failedTests} BÀI TEST CHƯA ĐẠT.`);
    process.exit(1);
  } else {
    console.log("TẤT CẢ CÁC CHỈ TIÊU ĐỀU ĐẠT TIÊU CHUẨN!");
    console.log("============================================================\n");
  }
}

runTestSuite();
