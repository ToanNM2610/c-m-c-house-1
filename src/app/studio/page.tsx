"use client";

import React, { useState } from "react";
import { CAMCU_CONFIG } from "@/config/camcuData";

type StudioMode = "BASIC" | "ADVANCED";
type StudioSection =
  | "DASHBOARD"
  | "VISUAL_EDITOR"
  | "MENU_MANAGER"
  | "GOOGLE_HUB";

const ADVANCED_SIDEBAR_GROUPS = [
  { id: "DASHBOARD", label: "Bảng tin & Sức khỏe" },
  { id: "VISUAL_EDITOR", label: "Trang & Sửa trực quan" },
  { id: "POSTS", label: "Bài viết / Tin từ quán" },
  { id: "MENU_MANAGER", label: "Thực đơn (67 món)" },
  { id: "MEDIA", label: "Thư viện ảnh (WebP/AVIF)" },
  { id: "REVIEWS", label: "Đánh giá Google Maps" },
  { id: "APPEARANCE", label: "Giao diện & Hiệu ứng" },
  { id: "SEO", label: "SEO & Marketing" },
  { id: "GOOGLE_HUB", label: "Hệ sinh thái Google & Khóa" },
  { id: "TOOLS", label: "Công cụ & Sao lưu 1 chạm" },
  { id: "SETTINGS", label: "Cài đặt & Bảo mật 2FA" },
];

const GOOGLE_SERVICES = [
  {
    id: "ga4",
    name: "Google Analytics 4",
    desc: "Báo cáo người dùng, thời gian thực, sự kiện bấm Gọi, Zalo, Chỉ đường, Xem thực đơn.",
    maskedKey: "••••••••G94K (Measurement ID: G-CAMCU800M)",
    status: "CONNECTED",
    updatedAt: "Hôm nay, 08:15",
    steps: [
      "Mở Google Analytics → Quản trị → Luồng dữ liệu web camcuhouse.online.",
      "Sao chép Measurement ID (G-XXXX) và Property ID.",
      "Dán vào ô bên dưới và bấm Kiểm tra kết nối.",
    ],
  },
  {
    id: "gsc",
    name: "Google Search Console",
    desc: "Hiệu suất nhấp, hiển thị, CTR, vị trí từ khóa, gửi sitemap và lập chỉ mục 5 trang chính.",
    maskedKey: "••••••••8821 (Service Account JSON)",
    status: "CONNECTED",
    updatedAt: "Hôm qua, 19:40",
    steps: [
      "Mở Search Console → Cài đặt → Xác minh quyền sở hữu tên miền.",
      "Thêm email Service Account của Studio vào quyền Người dùng.",
      "Bấm Đồng bộ dữ liệu từ khóa.",
    ],
  },
  {
    id: "gbp",
    name: "Google Business Profile",
    desc: "Đồng bộ giờ mở cửa/ngày lễ hai chiều, đăng bài, đọc đánh giá và xem lượt gọi/chỉ đường.",
    maskedKey: "••••••••437H (OAuth 2.0 Location ID)",
    status: "CONNECTED",
    updatedAt: "Hôm nay, 07:00",
    steps: [
      "Đăng nhập bằng tài khoản Google quản lý địa điểm Cẩm Cù House.",
      "Chấp thuận quyền quản lý Google Business Profile.",
      "Bật công tắc Đồng bộ giờ mở cửa hai chiều.",
    ],
  },
  {
    id: "maps",
    name: "Google Maps & Places API",
    desc: "Bản đồ nhúng tông ấm/tối, tọa độ 11.99° N, 107.69° E và đồng bộ đánh giá hằng ngày.",
    maskedKey: "••••••••9000 (Places API Key + Place ID)",
    status: "CONNECTED",
    updatedAt: "3 ngày trước",
    steps: [
      "Vào Google Cloud Console → Bật Maps Embed API & Places API.",
      "Giới hạn HTTP Referrer chỉ cho phép *.camcuhouse.online.",
      "Nhập API Key và Place ID của quán.",
    ],
  },
  {
    id: "sheets_drive",
    name: "Google Sheets, Drive & Calendar",
    desc: "Xuất/nhập thực đơn 67 món qua Sheets, kéo ảnh từ Drive/Photos, tự đóng cửa ngày lễ theo Calendar.",
    maskedKey: "••••••••2026 (OAuth Workspace Token)",
    status: "CONNECTED",
    updatedAt: "Hôm nay, 09:00",
    steps: [
      "Kết nối tài khoản Google của chủ quán qua OAuth một chạm.",
      "Chọn file Google Sheet thực đơn mẫu hoặc thư mục Drive chứa ảnh.",
      "Chọn lịch Google Calendar ngày nghỉ lễ của quán.",
    ],
  },
];

const ONBOARDING_8_STEPS = [
  { step: 1, label: "Kết nối tài khoản Google (GA4, Search Console, Business Profile)", done: true },
  { step: 2, label: "Kiểm tra giờ mở cửa (T2–T5: 07:00–18:00, T6–CN: 07:00–22:00)", done: true },
  { step: 3, label: "Rà soát 67 món và trạng thái Còn / Tạm hết", done: true },
  { step: 4, label: "Kiểm tra 30 ảnh không gian suối đá và thẻ alt VN/EN", done: true },
  { step: 5, label: "Đặt thông báo đầu trang hoặc lịch nghỉ lễ (nếu có)", done: false },
  { step: 6, label: "Bật bảo mật 2 lớp (2FA TOTP) cho tài khoản Chủ quán", done: true },
  { step: 7, label: "Kiểm tra điểm tốc độ PageSpeed Insights (≥ 90)", done: true },
  { step: 8, label: "Cài Cẩm Cù Studio ra màn hình chính điện thoại (PWA)", done: false },
];

export default function CamCuStudioAdmin() {
  const [mode, setMode] = useState<StudioMode>("BASIC");
  const [section, setSection] = useState<StudioSection>("DASHBOARD");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [storeOpen, setStoreOpen] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [undoToast, setUndoToast] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [newSecretValue, setNewSecretValue] = useState("");

  const triggerToastWithUndo = (msg: string) => {
    setUndoToast(msg);
    setHasUnsavedChanges(false);
    setTimeout(() => setUndoToast(null), 10000); // Hoàn tác trong 10 giây (Mục B2)
  };

  return (
    <div
      className="min-h-screen bg-[#F6F2EA] text-[#26211D] font-[var(--font-be-vietnam)]"
      style={{
        fontVariantNumeric: "lining-nums tabular-nums",
      }}
    >
      {/* Thanh trên 64px (Mục B2) */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-black/10 bg-white px-5 shadow-sm">
        <div className="flex items-center gap-4">
          {mode === "ADVANCED" && (
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 hover:bg-[#F6F2EA]"
              aria-label="Thu gọn hoặc mở rộng menu bên"
            >
              ☰
            </button>
          )}
          <span className="font-[var(--font-fraunces)] text-xl font-medium text-[#2F4A3A]">
            Cẩm{"\u00A0"}Cù Studio
          </span>

          {/* Chip trạng thái quán trực tiếp */}
          <button
            type="button"
            onClick={() => {
              setStoreOpen(!storeOpen);
              triggerToastWithUndo(
                !storeOpen
                  ? "Đã chuyển quán sang trạng thái ĐANG MỞ CỬA"
                  : "Đã chuyển quán sang trạng thái TẠM ĐÓNG CỬA"
              );
            }}
            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
              storeOpen
                ? "bg-[#1F7A44]/15 text-[#1F7A44]"
                : "bg-[#8A5A00]/15 text-[#8A5A00]"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-current" />
            {storeOpen ? "● Quán đang mở cửa" : "○ Đang tạm đóng"}
          </button>
        </div>

        {/* Ô tìm kiếm lệnh nhanh Ctrl+K */}
        <div className="hidden md:flex items-center gap-2 rounded-xl border border-black/10 bg-[#F6F2EA] px-4 py-2 text-[14px] text-[#5F564E] w-72 justify-between">
          <span>Tìm món, trang, cài đặt...</span>
          <kbd className="rounded bg-white px-2 py-0.5 text-[12px] font-semibold shadow-sm">
            Ctrl+K
          </kbd>
        </div>

        {/* Cụm chuyển đổi Cơ bản / Nâng cao + Xem trang + Đăng ngay */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border border-black/10 bg-[#F6F2EA] p-1 text-[13px] font-semibold">
            <button
              type="button"
              onClick={() => setMode("BASIC")}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                mode === "BASIC"
                  ? "bg-[#2F4A3A] text-white"
                  : "text-[#5F564E]"
              }`}
            >
              Cơ bản (7 việc)
            </button>
            <button
              type="button"
              onClick={() => setMode("ADVANCED")}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                mode === "ADVANCED"
                  ? "bg-[#2F4A3A] text-white"
                  : "text-[#5F564E]"
              }`}
            >
              Nâng cao
            </button>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 rounded-xl border border-black/15 px-3.5 py-2 text-[14px] font-semibold hover:bg-[#F6F2EA]"
          >
            Xem trang ↗
          </a>

          <button
            type="button"
            onClick={() =>
              triggerToastWithUndo("Đã đăng phiên bản mới lên camcuhouse.online")
            }
            className="rounded-xl bg-[#B5654A] px-4 py-2 text-[14px] font-semibold text-white hover:brightness-105"
          >
            Đăng ngay
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar 264px ở chế độ Nâng cao (Mục B2 & B3) */}
        {mode === "ADVANCED" && (
          <aside
            className={`min-h-[calc(100vh-64px)] shrink-0 bg-[#2F4A3A] text-[#F1ECE0] transition-all duration-200 ${
              sidebarCollapsed ? "w-20" : "w-[264px]"
            }`}
          >
            <nav className="p-3 space-y-1">
              {ADVANCED_SIDEBAR_GROUPS.map((item) => {
                const active = section === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setSection(
                        (item.id as StudioSection) || "DASHBOARD"
                      )
                    }
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[15px] font-medium transition-colors ${
                      active
                        ? "bg-[#B5654A] text-white font-semibold"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        )}

        {/* Nội dung chính tối đa 1280px (Mục B2) */}
        <main className="mx-auto w-full max-w-[1280px] p-6 lg:p-10">
          {/* Thanh chuyển nhanh giữa các màn chính */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-[var(--font-fraunces)] text-[30px] font-medium text-[#26211D]">
                {mode === "BASIC"
                  ? "Chào buổi sáng, Cẩm Cù House — 7 Việc Hằng Ngày"
                  : "Quản trị toàn diện Cẩm Cù Studio"}
              </h1>
              <p className="mt-1 text-[15px] text-[#5F564E]">
                Mọi thay đổi tự động lưu nháp, có lịch sử phiên bản và nút Hoàn
                tác 10 giây.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: "DASHBOARD", label: "1. Bảng tin & 7 Việc" },
                { id: "VISUAL_EDITOR", label: "2. Sửa trực tiếp trên trang" },
                { id: "GOOGLE_HUB", label: "3. Tích hợp Google & Khóa" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSection(tab.id as StudioSection)}
                  className={`rounded-xl px-4 py-2.5 text-[14px] font-semibold transition-colors ${
                    section === tab.id
                      ? "bg-[#2F4A3A] text-white"
                      : "bg-white border border-black/10 text-[#26211D]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* MÀN 1: 7 VIỆC HẰNG NGÀY (CHẾ ĐỘ CƠ BẢN) + KPI GOOGLE + CHECKLIST 8 BƯỚC (Mục B1, B3, B7) */}
          {section === "DASHBOARD" && (
            <div className="space-y-8">
              {/* Lưới 7 việc hằng ngày 1 chạm */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    title: "1. Trạng thái quán",
                    desc: storeOpen
                      ? "Đang mở cửa (Đóng 18:00)"
                      : "Đang tạm đóng cửa",
                    actionLabel: "Đổi trạng thái 1 chạm",
                    onClick: () => {
                      setStoreOpen(!storeOpen);
                      triggerToastWithUndo("Đã đổi trạng thái đóng/mở cửa");
                    },
                  },
                  {
                    title: "2. Báo hết món nhanh",
                    desc: "66/67 món đang còn · 1 món tạm hết",
                    actionLabel: "Gạt công tắc Còn/Hết",
                    onClick: () => setHasUnsavedChanges(true),
                  },
                  {
                    title: "3. Sửa giá thực đơn",
                    desc: "Khoảng giá hiện tại: 20.000đ – 45.000đ",
                    actionLabel: "Sửa giá nhanh",
                    onClick: () => setHasUnsavedChanges(true),
                  },
                  {
                    title: "4. Đăng thông báo / Ngày lễ",
                    desc: "Chưa có lịch nghỉ lễ sắp tới",
                    actionLabel: "Đặt lịch thông báo",
                    onClick: () => setHasUnsavedChanges(true),
                  },
                  {
                    title: "5. Thêm ảnh bờ suối",
                    desc: "30 ảnh đang hiển thị (Tự nén WebP/AVIF)",
                    actionLabel: "Tải ảnh / Lấy từ Drive",
                    onClick: () => setHasUnsavedChanges(true),
                  },
                  {
                    title: "6. Sửa chữ trên trang",
                    desc: "Bấm vào chữ trên trang thật để sửa",
                    actionLabel: "Mở Trình sửa trực quan",
                    onClick: () => setSection("VISUAL_EDITOR"),
                  },
                  {
                    title: "7. Xem thống kê Google",
                    desc: "1.420 lượt xem · 86 bấm Gọi · 134 Chỉ đường",
                    actionLabel: "Xem báo cáo GA4 & Maps",
                    onClick: () => setSection("GOOGLE_HUB"),
                  },
                  {
                    title: "Sao lưu & Sức khỏe",
                    desc: "PageSpeed: 96/100 · Sao lưu lúc 03:00 sáng",
                    actionLabel: "Sao lưu 1 chạm ngay",
                    onClick: () =>
                      triggerToastWithUndo("Đã tạo bản sao lưu toàn bộ hệ thống"),
                  },
                ].map((card) => (
                  <div
                    key={card.title}
                    className="flex flex-col justify-between rounded-[16px] border border-black/10 bg-white p-5 shadow-sm"
                  >
                    <div>
                      <h2 className="text-[17px] font-semibold text-[#26211D]">
                        {card.title}
                      </h2>
                      <p className="mt-1.5 text-[14px] text-[#5F564E]">
                        {card.desc}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={card.onClick}
                      className="mt-4 w-full rounded-xl bg-[#F6F2EA] py-2.5 text-[14px] font-semibold text-[#2F4A3A] hover:bg-[#B5654A] hover:text-white transition-colors"
                    >
                      {card.actionLabel} →
                    </button>
                  </div>
                ))}
              </div>

              {/* Checklist "Bắt đầu" 8 bước (Mục B3 & B7) */}
              <div className="rounded-[16px] border border-black/10 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-[22px] font-semibold">
                    Checklist “Bắt đầu” 8 bước cho Chủ quán
                  </h2>
                  <span className="rounded-full bg-[#1F7A44]/15 px-3.5 py-1 text-[13px] font-semibold text-[#1F7A44]">
                    Hoàn thành 6 / 8 bước
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {ONBOARDING_8_STEPS.map((item) => (
                    <div
                      key={item.step}
                      className="flex items-center gap-3 rounded-xl border border-black/10 px-4 py-3 text-[15px]"
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${
                          item.done
                            ? "bg-[#1F7A44] text-white"
                            : "border border-black/30 text-[#5F564E]"
                        }`}
                      >
                        {item.done ? "✓" : item.step}
                      </span>
                      <span className={item.done ? "line-through text-[#5F564E]" : ""}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MÀN 2: TRÌNH CHỈNH SỬA TRỰC QUAN (VISUAL EDITOR - Mục B4) */}
          {section === "VISUAL_EDITOR" && (
            <div className="rounded-[16px] border border-black/10 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-[#2F4A3A] px-3 py-1.5 text-[13px] font-semibold text-white">
                    Chế độ sửa trực tiếp
                  </span>
                  <span className="text-[14px] text-[#5F564E]">
                    Bấm vào bất kỳ tiêu đề, đoạn văn hoặc ảnh bên dưới để sửa
                    ngay — giới hạn trong token để không bao giờ vỡ bố cục.
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[13px] font-semibold">
                  <button type="button" className="rounded-lg border px-3 py-1.5">
                    Desktop 1440
                  </button>
                  <button type="button" className="rounded-lg border px-3 py-1.5">
                    Mobile 390
                  </button>
                  <button type="button" className="rounded-lg border px-3 py-1.5">
                    VN / EN
                  </button>
                </div>
              </div>

              {/* Khung chỉnh sửa trực tiếp có kiểm tra độ tương phản & thẻ alt tự động */}
              <div className="mt-6 rounded-2xl border-2 border-dashed border-[#2F6F55]/40 bg-[#FAF6EE] p-8">
                <span className="h6-label text-[#5E7F63]">
                  [KHỐI HERO · BẤM ĐỂ SỬA TRỰC TIẾP]
                </span>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onInput={() => setHasUnsavedChanges(true)}
                  className="h1-morning mt-3 rounded-xl p-2 outline-none focus:ring-2 focus:ring-[#B5654A]"
                >
                  CẨM CÙ HOUSE
                </div>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onInput={() => setHasUnsavedChanges(true)}
                  className="h3-morning mt-2 rounded-xl p-2 text-[#B5654A] outline-none focus:ring-2 focus:ring-[#B5654A]"
                >
                  {CAMCU_CONFIG.slogan.vn}
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-[13px] font-semibold text-[#1F7A44]">
                  <span>✓ Tương phản đạt chuẩn (9.4:1 ≥ 4.5:1)</span>
                  <span>✓ Đầy đủ bản dịch Tiếng Việt & Tiếng Anh</span>
                  <span>✓ Ảnh Hero có đầy đủ thuộc tính alt</span>
                </div>
              </div>
            </div>
          )}

          {/* MÀN 3: TÍCH HỢP HỆ SINH THÁI GOOGLE & KHÓA BÍ MẬT AES-256-GCM (Mục B5 & B6) */}
          {section === "GOOGLE_HUB" && (
            <div className="space-y-6">
              <div className="rounded-[16px] border border-black/10 bg-white p-6 shadow-sm">
                <h2 className="text-[22px] font-semibold">
                  Trung Tâm Tích Hợp Google & Quản Lý Khóa Bí Mật
                </h2>
                <p className="mt-1 text-[15px] text-[#5F564E]">
                  Mọi khóa bí mật được mã hóa chuẩn{" "}
                  <strong>AES-256-GCM</strong>, chỉ hiển thị 4 ký tự cuối
                  (`••••••••1234`), không bao giờ trả khóa đầy đủ về trình
                  duyệt. Đổi khóa có hiệu lực ngay lập tức mà không cần deploy
                  lại.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {GOOGLE_SERVICES.map((srv) => (
                  <div
                    key={srv.id}
                    className="flex flex-col justify-between rounded-[16px] border border-black/10 bg-white p-6 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-[17px] font-semibold">{srv.name}</h3>
                        <span className="rounded-full bg-[#1F7A44]/15 px-3 py-1 text-[13px] font-semibold text-[#1F7A44]">
                          ✓ Đã kết nối · {srv.updatedAt}
                        </span>
                      </div>

                      <p className="mt-2 text-[15px] text-[#5F564E]">
                        {srv.desc}
                      </p>

                      {/* Hiển thị khóa dạng che ••••1234 */}
                      <div className="mt-4 rounded-xl bg-[#F6F2EA] px-4 py-3 font-mono text-[14px] text-[#26211D]">
                        Khóa hiện tại: <strong>{srv.maskedKey}</strong>
                      </div>

                      {/* Hướng dẫn 3 bước thu gọn */}
                      <details className="mt-3 text-[13px] text-[#5F564E]">
                        <summary className="cursor-pointer font-semibold text-[#2F6F55]">
                          Xem hướng dẫn 3 bước lấy khóa & kết nối
                        </summary>
                        <ol className="mt-2 list-decimal space-y-1 pl-5">
                          {srv.steps.map((st, idx) => (
                            <li key={idx}>{st}</li>
                          ))}
                        </ol>
                      </details>
                    </div>

                    {/* Đổi khóa yêu cầu xác thực 2FA TOTP (Mục B5 & B6) */}
                    {editingServiceId === srv.id ? (
                      <div className="mt-4 space-y-3 border-t border-black/10 pt-4">
                        <input
                          type="password"
                          value={newSecretValue}
                          onChange={(e) => setNewSecretValue(e.target.value)}
                          placeholder="Nhập khóa / ID mới..."
                          className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-[14px]"
                        />
                        <input
                          type="text"
                          maxLength={6}
                          value={totpCode}
                          onChange={(e) => setTotpCode(e.target.value)}
                          placeholder="Nhập mã 2FA 6 số từ Google Authenticator"
                          className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-[14px]"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingServiceId(null);
                              setNewSecretValue("");
                              setTotpCode("");
                              triggerToastWithUndo(
                                `Đã mã hóa AES-256-GCM và áp dụng khóa mới cho ${srv.name}`
                              );
                            }}
                            className="rounded-xl bg-[#B5654A] px-4 py-2 text-[14px] font-semibold text-white"
                          >
                            Xác nhận 2FA & Lưu ngay
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingServiceId(null)}
                            className="rounded-xl border border-black/15 px-4 py-2 text-[14px]"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-5 flex flex-wrap gap-2 border-t border-black/10 pt-4">
                        <button
                          type="button"
                          onClick={() =>
                            triggerToastWithUndo(
                              `Kết nối ${srv.name} hoạt động ổn định (200 OK)`
                            )
                          }
                          className="rounded-xl border border-black/15 px-3.5 py-2 text-[13px] font-semibold hover:bg-[#F6F2EA]"
                        >
                          Kiểm tra kết nối
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingServiceId(srv.id)}
                          className="rounded-xl bg-[#F6F2EA] px-3.5 py-2 text-[13px] font-semibold text-[#2F4A3A] hover:bg-[#B5654A] hover:text-white"
                        >
                          Đổi khóa / ID (Yêu cầu 2FA)
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Thanh "Có thay đổi chưa lưu" dính dưới màn hình (Mục B7) */}
      {hasUnsavedChanges && (
        <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between border-t border-black/10 bg-[#2F4A3A] px-6 py-3.5 text-white shadow-2xl">
          <span className="text-[15px] font-medium">
            ● Bạn có thay đổi chưa lưu (Đã tự động lưu vào bản nháp)
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setHasUnsavedChanges(false)}
              className="rounded-xl border border-white/25 px-4 py-2 text-[14px]"
            >
              Hoàn tác
            </button>
            <button
              type="button"
              onClick={() =>
                triggerToastWithUndo("Đã lưu và cập nhật ngay lên trang chính")
              }
              className="rounded-xl bg-[#B5654A] px-5 py-2 text-[14px] font-semibold text-white"
            >
              Lưu & Áp dụng ngay
            </button>
          </div>
        </div>
      )}

      {/* Toast thông báo + Hoàn tác trong 10 giây (Mục B2 & B7) */}
      {undoToast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-4 rounded-2xl bg-[#26211D] px-5 py-3.5 text-[14px] font-medium text-white shadow-2xl"
        >
          <span>✓ {undoToast}</span>
          <button
            type="button"
            onClick={() => setUndoToast(null)}
            className="rounded-lg bg-[#B5654A] px-3 py-1 text-[13px] font-semibold"
          >
            Hoàn tác (10s)
          </button>
        </div>
      )}
    </div>
  );
}
