"use client";

import React, { useState } from "react";
import { CAMCU_CONFIG } from "@/config/camcuData";

export default function AdminDashboardPage({ initialTab }: { initialTab?: string } = {}) {
  const [activeTab, setActiveTab] = useState<"OPERATIONS" | "STORE_SETTINGS">(
    initialTab === "store" ? "STORE_SETTINGS" : "OPERATIONS"
  );
  const [monThuHours, setMonThuHours] = useState("07:00 – 18:00");
  const [friSunHours, setFriSunHours] = useState("07:00 – 22:00");
  const [holidayNotice, setHolidayNotice] = useState("");
  const [topAnnouncement, setTopAnnouncement] = useState(
    "Chào mừng bạn ghé Cẩm Cù House bên bờ suối đá Gia Nghĩa"
  );
  const [unlockCoreSettings, setUnlockCoreSettings] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] pb-24 pt-32 text-[var(--ink)]">
      {savedToast && (
        <div
          role="status"
          className="chamfer-14 fixed bottom-8 right-8 z-50 border border-[var(--ember)] bg-[#0A0E0C] px-6 py-3.5 text-mono-label font-bold text-[#FF6A2B] shadow-2xl"
        >
          ✓ ĐÃ LƯU CẬP NHẬT HỆ THỐNG
        </div>
      )}

      <div className="mx-auto max-w-[1360px] px-5 lg:px-14">
        <div className="flex flex-col justify-between gap-6 border-b border-[var(--line)] pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-mono-label text-[var(--ember)]">
              [ADMIN.CAMCUHOUSE.ONLINE · QUẢN TRỊ HỆ THỐNG]
            </p>
            <h1 className="text-h2 mt-2">Bảng Điều Khiển Cẩm{"\u00A0"}Cù House</h1>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("OPERATIONS")}
              className={`chamfer-14 min-h-[48px] px-5 text-mono-label font-bold transition-colors ${
                activeTab === "OPERATIONS"
                  ? "bg-[var(--ember)] text-[var(--ember-ink)]"
                  : "border border-[var(--line)] bg-[var(--card)] text-[var(--ink)]"
              }`}
            >
              [01 · GIỜ MỞ CỬA & THÔNG BÁO]
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("STORE_SETTINGS")}
              className={`chamfer-14 min-h-[48px] px-5 text-mono-label font-bold transition-colors ${
                activeTab === "STORE_SETTINGS"
                  ? "bg-[var(--ember)] text-[var(--ember-ink)]"
                  : "border border-[var(--line)] bg-[var(--card)] text-[var(--ink)]"
              }`}
            >
              [02 · CÀI ĐẶT CỬA HÀNG]
            </button>
          </div>
        </div>

        {/* TAB 1: Sửa giờ, ngày nghỉ, thông báo (Mục 13.3) */}
        {activeTab === "OPERATIONS" && (
          <form onSubmit={handleSave} className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="chamfer-14 space-y-6 border border-[var(--line)] bg-[var(--card)] p-8 lg:col-span-7">
              <p className="text-mono-label text-[var(--ember)]">
                [GIỜ HOẠT ĐỘNG & NGÀY NGHỈ]
              </p>

              <div>
                <label className="text-mono-label block text-[var(--mist)]">
                  THỨ 2 – THỨ 5
                </label>
                <input
                  type="text"
                  value={monThuHours}
                  onChange={(e) => setMonThuHours(e.target.value)}
                  className="mt-2 w-full border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-[16px] text-[var(--ink)] focus:border-[var(--ember)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-mono-label block text-[var(--mist)]">
                  THỨ 6 – CHỦ NHẬT
                </label>
                <input
                  type="text"
                  value={friSunHours}
                  onChange={(e) => setFriSunHours(e.target.value)}
                  className="mt-2 w-full border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-[16px] text-[var(--ink)] focus:border-[var(--ember)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-mono-label block text-[var(--mist)]">
                  LỊCH NGHỈ ĐỘT XUẤT / LỄ TẾT (ĐỂ TRỐNG NẾU MỞ BÌNH THƯỜNG)
                </label>
                <input
                  type="text"
                  value={holidayNotice}
                  onChange={(e) => setHolidayNotice(e.target.value)}
                  placeholder="VD: Nghỉ bảo trì suối đá ngày 15/10..."
                  className="mt-2 w-full border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-[16px] text-[var(--ink)] focus:border-[var(--ember)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-mono-label block text-[var(--mist)]">
                  THÔNG BÁO NGẮN TRÊN WEBSITE
                </label>
                <textarea
                  rows={3}
                  value={topAnnouncement}
                  onChange={(e) => setTopAnnouncement(e.target.value)}
                  className="mt-2 w-full border border-[var(--line)] bg-[var(--bg)] p-4 text-[16px] text-[var(--ink)] focus:border-[var(--ember)] focus:outline-none"
                />
              </div>

              <button type="submit" className="btn-ember chamfer-14">
                <span>Lưu Thay Đổi Vận Hành</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <div className="chamfer-14 border border-[var(--line)] bg-[var(--pine)] p-8 text-[#F2EDE4] lg:col-span-5">
              <p className="text-mono-label text-[#A9C4B6]">
                [ĐỒNG BỘ DỮ LIỆU TỰ ĐỘNG]
              </p>
              <h2 className="mt-3 font-[var(--font-display)] text-2xl font-bold">
                Một Nguồn Dữ Liệu Duy Nhất (Mục 13)
              </h2>
              <p className="mt-3 text-[15px] text-[#F2EDE4]/85">
                Khi cập nhật giờ mở cửa tại đây, trạng thái trên Thanh trên
                cùng, Thẻ kính mờ ở Hero, Bảng 7 ngày ở trang Liên Hệ, Chân
                trang và Schema.org SEO sẽ tự động đồng bộ tức thì.
              </p>
            </div>
          </form>
        )}

        {/* TAB 2: Cài Đặt Cửa Hàng - Chỉ sửa Tên, Địa chỉ, Tọa độ, Hotline tại đây (Mục 13.3) */}
        {activeTab === "STORE_SETTINGS" && (
          <form onSubmit={handleSave} className="mt-10">
            <div className="chamfer-14 border border-[var(--line)] bg-[var(--card)] p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-6">
                <div>
                  <p className="text-mono-label text-[var(--ember)]">
                    [CÀI ĐẶT CỬA HÀNG · THÔNG TIN BẤT BIẾN MỤC 1 & 13.1]
                  </p>
                  <p className="mt-1 text-[15px] text-[var(--ink-muted)]">
                    Tên quán, địa chỉ, tọa độ và hotline được khóa mặc định để
                    đảm bảo tính nhất quán trên toàn hệ thống.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setUnlockCoreSettings(!unlockCoreSettings)}
                  className="chamfer-14 border border-[var(--ember)] px-4 py-2 text-mono-label text-[var(--ember)]"
                >
                  {unlockCoreSettings ? "[KHÓA LẠI]" : "[MỞ KHÓA CHỈNH SỬA]"}
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="text-mono-label block text-[var(--mist)]">
                    TÊN THƯƠNG HIỆU (BẤT BIẾN)
                  </label>
                  <input
                    type="text"
                    disabled={!unlockCoreSettings}
                    defaultValue={CAMCU_CONFIG.name}
                    className="mt-2 w-full border border-[var(--line)] bg-[var(--bg)] px-4 py-3 opacity-80 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-mono-label block text-[var(--mist)]">
                    KHẨU HIỆU CHÍNH
                  </label>
                  <input
                    type="text"
                    disabled={!unlockCoreSettings}
                    defaultValue={CAMCU_CONFIG.slogan.vn}
                    className="mt-2 w-full border border-[var(--line)] bg-[var(--bg)] px-4 py-3 opacity-80 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-mono-label block text-[var(--mist)]">
                    ĐỊA CHỈ ĐẦY ĐỦ
                  </label>
                  <input
                    type="text"
                    disabled={!unlockCoreSettings}
                    defaultValue={CAMCU_CONFIG.location.address}
                    className="mt-2 w-full border border-[var(--line)] bg-[var(--bg)] px-4 py-3 opacity-80 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-mono-label block text-[var(--mist)]">
                    TỌA ĐỘ ĐỊA LÝ & ĐỘ CAO
                  </label>
                  <input
                    type="text"
                    disabled={!unlockCoreSettings}
                    defaultValue={`${CAMCU_CONFIG.location.coordinates.display} · ${CAMCU_CONFIG.location.altitude}`}
                    className="mt-2 w-full border border-[var(--line)] bg-[var(--bg)] px-4 py-3 opacity-80 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-mono-label block text-[var(--mist)]">
                    HOTLINE CHÍNH (ZALO) & SỐ PHỤ
                  </label>
                  <input
                    type="text"
                    disabled={!unlockCoreSettings}
                    defaultValue={`${CAMCU_CONFIG.contact.hotlinePrimary} / ${CAMCU_CONFIG.contact.hotlineSecondary}`}
                    className="mt-2 w-full border border-[var(--line)] bg-[var(--bg)] px-4 py-3 opacity-80 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {unlockCoreSettings && (
                <div className="mt-8">
                  <button type="submit" className="btn-ember chamfer-14">
                    <span>Cập Nhật Cài Đặt Cửa Hàng</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
