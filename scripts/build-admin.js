const fs = require("fs");
const path = require("path");

const sourcePath = "C:\\\\Users\\\\toann\\\\.gemini\\\\antigravity-ide\\\\brain\\\\7cebc38c-d17f-4add-beb7-26799971d502\\\\scratch\\\\admin_clean.tsx";
let content = fs.readFileSync(sourcePath, "utf8");

// 1. Remove internal notes if any
content = content.replace(/Mục 13/g, "Hệ thống");
content = content.replace(/Mục 1 & 13\.1/g, "Thông tin quán");
content = content.replace(/bất biến mục/gi, "thông tin");

// 2. Add 7-day schedule and holiday state to the component
const stateInsertionMarker = 'const [storeOverride, setStoreOverrideState] = useState<StoreOverrideMode>("auto");';
const customStateCode = `const [storeOverride, setStoreOverrideState] = useState<StoreOverrideMode>("auto");

  // Bảng Giờ hoạt động 7 ngày (Mục D13)
  const [schedule7Days, setSchedule7Days] = useState([
    { dayId: "mon", dayName: "Thứ Hai", openTime: "07:00", closeTime: "18:00", isClosed: false },
    { dayId: "tue", dayName: "Thứ Ba", openTime: "07:00", closeTime: "18:00", isClosed: false },
    { dayId: "wed", dayName: "Thứ Tư", openTime: "07:00", closeTime: "18:00", isClosed: false },
    { dayId: "thu", dayName: "Thứ Năm", openTime: "07:00", closeTime: "18:00", isClosed: false },
    { dayId: "fri", dayName: "Thứ Sáu", openTime: "07:00", closeTime: "22:00", isClosed: false },
    { dayId: "sat", dayName: "Thứ Bảy", openTime: "07:00", closeTime: "22:00", isClosed: false },
    { dayId: "sun", dayName: "Chủ Nhật", openTime: "07:00", closeTime: "22:00", isClosed: false },
  ]);

  const updateDaySchedule = (index: number, field: string, value: any) => {
    setSchedule7Days((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Quản lý ngày nghỉ lễ bằng lịch (Mục D13)
  const [holidays, setHolidays] = useState<{ id: string; date: string; name: string }[]>([
    { id: "h1", date: "2026-04-26", name: "Giỗ Tổ Hùng Vương (10/3 Âm lịch)" },
    { id: "h2", date: "2026-04-30", name: "Kỷ niệm Giải phóng miền Nam (30/4)" },
    { id: "h3", date: "2026-05-01", name: "Quốc tế Lao động (1/5)" },
  ]);
  const [newHolidayDate, setNewHolidayDate] = useState("");
  const [newHolidayName, setNewHolidayName] = useState("");
  const [unlockStoreInfo, setUnlockStoreInfo] = useState(false);

  const handleAddHoliday = () => {
    if (!newHolidayDate || !newHolidayName.trim()) return;
    setHolidays((prev) => [
      ...prev,
      { id: Date.now().toString(), date: newHolidayDate, name: newHolidayName.trim() },
    ]);
    setNewHolidayDate("");
    setNewHolidayName("");
  };

  const handleRemoveHoliday = (id: string | number) => {
    setHolidays((prev) => prev.filter((h, i) => h.id !== id && i !== id));
  };`;

content = content.replace(stateInsertionMarker, customStateCode);

// 3. Replace the Settings tab body with the rich 7-day schedule table, calendar picker, locked store info, and forest card
const settingsTarget = `{activeTab === "settings" && (
            <div className="flex flex-col gap-8">
              {/* Store Operational Info Form */}`;

const richSettingsCode = `{activeTab === "settings" && (
            <div className="flex flex-col gap-8">
              {/* Tiêu đề trang 32px & Nhãn mono 12px (Mục D13) */}
              <div className="flex flex-col gap-1 border-b border-stone-200 dark:border-stone-700/60 pb-4">
                <span className="font-mono text-[12px] uppercase tracking-[0.06em] text-[var(--accent)] font-semibold">
                  [HỆ THỐNG CÀI ĐẶT & VẬN HÀNH QUÁN]
                </span>
                <h1 className="font-serif text-[32px] font-bold text-[#1B281D] dark:text-[#F4EEE2] leading-tight">
                  Cài Đặt Cửa Hàng & Lịch Hoạt Động
                </h1>
                <p className="text-xs text-stone-500">
                  Quản lý giờ mở cửa 7 ngày, lịch nghỉ lễ, thông tin thương hiệu và mật khẩu quản trị.
                </p>
              </div>

              {/* Store Operational Info Form */}
              <form
                onSubmit={handleSaveSettings}
                className="p-6 sm:p-8 bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm rounded-2xl border border-stone-200 dark:border-stone-700/60 shadow-sm flex flex-col gap-6"
              >
                <div className="pb-3 border-b border-stone-200 flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#3E5C46]">
                      Giờ Mở Cửa & Trạng Thái Hoạt Động
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Cập nhật giờ mở cửa 7 ngày, lịch nghỉ lễ và công tắc trạng thái tức thì.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#3E5C46] text-white text-xs font-bold hover:bg-[#2D4233] transition-all shadow-md cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Lưu Cài Đặt</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Công tắc trạng thái quán 1 chạm (Mục D10 & D13) */}
                  <div className="md:col-span-2 p-5 bg-stone-50 dark:bg-[#16231A] rounded-2xl border border-stone-200 dark:border-stone-700/60 flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-mono text-[12px] uppercase tracking-[0.06em] font-bold text-[#1B281D] dark:text-[#F4EEE2]">
                          CÔNG TẮC TRẠNG THÁI QUÁN (1 NGUỒN DUY NHẤT)
                        </span>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Đồng bộ toàn bộ website khách hàng: thanh đầu trang, thẻ giờ mở cửa và chip Hero.
                        </p>
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#3E5C46] dark:text-[#9DC183] self-start sm:self-auto">
                        Hiện tại: {storeStatus.shortBadge}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleStoreOverrideChange("auto")}
                        className={\`min-h-[44px] p-3 rounded-xl border text-left transition-all flex flex-col gap-1 cursor-pointer \${
                          storeOverride === "auto"
                            ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/20"
                            : "bg-white dark:bg-[#1E2B22] border-stone-200 dark:border-stone-700/60 text-stone-600 dark:text-stone-300 hover:bg-stone-100"
                        }\`}
                      >
                        <span className="text-xs font-bold">⏱ Tự động theo lịch</span>
                        <span className="text-[10px] text-stone-500 font-normal">T2–T5: 18h | T6–CN: 22h</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStoreOverrideChange("force_open")}
                        className={\`min-h-[44px] p-3 rounded-xl border text-left transition-all flex flex-col gap-1 cursor-pointer \${
                          storeOverride === "force_open"
                            ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/20"
                            : "bg-white dark:bg-[#1E2B22] border-stone-200 dark:border-stone-700/60 text-stone-600 dark:text-stone-300 hover:bg-stone-100"
                        }\`}
                      >
                        <span className="text-xs font-bold">🟢 Mở cửa đón khách</span>
                        <span className="text-[10px] text-stone-500 font-normal">Đón khách ngoài giờ</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStoreOverrideChange("force_closed")}
                        className={\`min-h-[44px] p-3 rounded-xl border text-left transition-all flex flex-col gap-1 cursor-pointer \${
                          storeOverride === "force_closed"
                            ? "bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-900 dark:text-rose-200 font-bold ring-2 ring-rose-500/20"
                            : "bg-white dark:bg-[#1E2B22] border-stone-200 dark:border-stone-700/60 text-stone-600 dark:text-stone-300 hover:bg-stone-100"
                        }\`}
                      >
                        <span className="text-xs font-bold">🔴 Nghỉ đột xuất / Đóng cửa</span>
                        <span className="text-[10px] text-stone-500 font-normal">Nghỉ lễ, thời tiết xấu</span>
                      </button>
                    </div>
                  </div>

                  {/* BẢNG 7 NGÀY HOẠT ĐỘNG (Mục D13) */}
                  <div className="md:col-span-2 p-5 bg-stone-50 dark:bg-[#16231A] rounded-2xl border border-stone-200 dark:border-stone-700/60 flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700/60 pb-3">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#1B281D] dark:text-[#F4EEE2]">
                          Lịch Hoạt Động 7 Ngày Trong Tuần (Mở, Đóng, Nghỉ)
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Tùy chỉnh giờ mở cửa, đóng cửa và ngày nghỉ định kỳ cho từng thứ trong tuần.
                        </p>
                      </div>
                      <span className="font-mono text-[12px] tracking-[0.06em] text-[var(--accent)] font-semibold uppercase">
                        BẢNG 7 NGÀY
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-stone-200 dark:border-stone-700/60 text-stone-500 font-mono uppercase tracking-[0.06em] text-[11px]">
                            <th className="py-2.5 px-3">Thứ Trong Tuần</th>
                            <th className="py-2.5 px-3">Giờ Mở Cửa</th>
                            <th className="py-2.5 px-3">Giờ Đóng Cửa</th>
                            <th className="py-2.5 px-3 text-center">Trạng Thái Ngày</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200/60 dark:divide-stone-700/40">
                          {schedule7Days.map((day, idx) => (
                            <tr key={day.dayId} className="hover:bg-stone-100/50 dark:hover:bg-stone-800/30 transition-colors">
                              <td className="py-3 px-3 font-semibold text-stone-800 dark:text-stone-200">
                                {day.dayName}
                              </td>
                              <td className="py-3 px-3">
                                <input
                                  type="time"
                                  disabled={day.isClosed}
                                  value={day.openTime}
                                  onChange={(e) => updateDaySchedule(idx, "openTime", e.target.value)}
                                  className="px-2.5 py-1.5 bg-white dark:bg-[#1E2B22] rounded-lg border border-stone-200 dark:border-stone-700/60 text-xs disabled:opacity-40"
                                />
                              </td>
                              <td className="py-3 px-3">
                                <input
                                  type="time"
                                  disabled={day.isClosed}
                                  value={day.closeTime}
                                  onChange={(e) => updateDaySchedule(idx, "closeTime", e.target.value)}
                                  className="px-2.5 py-1.5 bg-white dark:bg-[#1E2B22] rounded-lg border border-stone-200 dark:border-stone-700/60 text-xs disabled:opacity-40"
                                />
                              </td>
                              <td className="py-3 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => updateDaySchedule(idx, "isClosed", !day.isClosed)}
                                  className={\`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer \${
                                    day.isClosed
                                      ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300"
                                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300"
                                  }\`}
                                >
                                  {day.isClosed ? "● Nghỉ ngày này" : "✓ Mở cửa đón khách"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* QUẢN LÝ NGÀY NGHỈ LỄ CHỌN BẰNG LỊCH (Mục D13) */}
                  <div className="md:col-span-2 p-5 bg-stone-50 dark:bg-[#16231A] rounded-2xl border border-stone-200 dark:border-stone-700/60 flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700/60 pb-3">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#1B281D] dark:text-[#F4EEE2]">
                          Lịch Nghỉ Lễ & Ngày Đóng Cửa Đột Xuất (Chọn Bằng Lịch)
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Chọn ngày cụ thể trên lịch để hệ thống tự động thông báo và đóng cửa website vào ngày này.
                        </p>
                      </div>
                      <span className="font-mono text-[12px] tracking-[0.06em] text-[var(--accent)] font-semibold uppercase">
                        LỊCH NGHỈ LỄ
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                      <div className="sm:col-span-4 flex flex-col gap-1">
                        <label className="text-[11px] font-mono uppercase tracking-[0.06em] text-stone-600 dark:text-stone-400 font-semibold">
                          Chọn ngày nghỉ trên lịch
                        </label>
                        <input
                          type="date"
                          value={newHolidayDate}
                          onChange={(e) => setNewHolidayDate(e.target.value)}
                          className="px-3.5 py-2.5 bg-white dark:bg-[#1E2B22] rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 text-stone-800 dark:text-stone-200 cursor-pointer"
                        />
                      </div>
                      <div className="sm:col-span-6 flex flex-col gap-1">
                        <label className="text-[11px] font-mono uppercase tracking-[0.06em] text-stone-600 dark:text-stone-400 font-semibold">
                          Tên dịp nghỉ lễ / Lý do đóng cửa
                        </label>
                        <input
                          type="text"
                          value={newHolidayName}
                          onChange={(e) => setNewHolidayName(e.target.value)}
                          placeholder="VD: Nghỉ lễ Giỗ Tổ Hùng Vương, Nghỉ bảo trì suối đá..."
                          className="px-3.5 py-2.5 bg-white dark:bg-[#1E2B22] rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 text-stone-800 dark:text-stone-200"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <button
                          type="button"
                          onClick={handleAddHoliday}
                          className="w-full py-2.5 px-4 bg-[#3E5C46] text-white rounded-xl text-xs font-bold hover:bg-[#2D4233] transition-all cursor-pointer shadow-sm"
                        >
                          + Thêm Lịch
                        </button>
                      </div>
                    </div>

                    {holidays.length > 0 ? (
                      <div className="flex flex-wrap gap-2.5 pt-2">
                        {holidays.map((h, i) => (
                          <div
                            key={h.id || i}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 text-xs font-semibold"
                          >
                            <span>📅 {h.date}:</span>
                            <span>{h.name}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveHoliday(h.id || i)}
                              className="ml-1 text-rose-600 hover:text-rose-800 dark:text-rose-400 cursor-pointer font-bold"
                              aria-label={\`Xóa ngày nghỉ \${h.name}\`}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-stone-400 italic">Chưa có ngày nghỉ lễ nào được lên lịch.</p>
                    )}
                  </div>

                  {/* THÔNG TIN QUÁN (KHÓA ĐỂ TRÁNH SỬA NHẦM) - Mục D11 */}
                  <div className="md:col-span-2 p-5 bg-stone-50 dark:bg-[#16231A] rounded-2xl border border-stone-200 dark:border-stone-700/60 flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-700/60 pb-3">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#1B281D] dark:text-[#F4EEE2]">
                          Thông tin quán (khóa để tránh sửa nhầm)
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Tên thương hiệu, địa chỉ, tọa độ và hotline được bảo vệ để đảm bảo tính nhất quán toàn hệ thống.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUnlockStoreInfo(!unlockStoreInfo)}
                        className="px-4 py-2 rounded-xl border border-[var(--accent)] text-[var(--accent)] text-xs font-bold hover:bg-[var(--accent)] hover:text-white transition-all cursor-pointer"
                      >
                        {unlockStoreInfo ? "🔒 Khóa Lại" : "🔓 Mở Khóa Chỉnh Sửa"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-mono uppercase tracking-[0.06em] text-stone-600 dark:text-stone-400 font-semibold block mb-1">
                          Tên Thương Hiệu
                        </label>
                        <input
                          type="text"
                          disabled={!unlockStoreInfo}
                          defaultValue="Cẩm Cù House"
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E2B22] rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase tracking-[0.06em] text-stone-600 dark:text-stone-400 font-semibold block mb-1">
                          Khẩu Hiệu Quán
                        </label>
                        <input
                          type="text"
                          disabled={!unlockStoreInfo}
                          defaultValue="Chốn Dừng Chân Mộc Mạc Bên Bờ Suối Đá"
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E2B22] rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[11px] font-mono uppercase tracking-[0.06em] text-stone-600 dark:text-stone-400 font-semibold block mb-1">
                          Địa Chỉ Đầy Đủ
                        </label>
                        <input
                          type="text"
                          disabled={!unlockStoreInfo}
                          value={settings.address}
                          onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E2B22] rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase tracking-[0.06em] text-stone-600 dark:text-stone-400 font-semibold block mb-1">
                          Tọa Độ & Độ Cao
                        </label>
                        <input
                          type="text"
                          disabled={!unlockStoreInfo}
                          defaultValue="11.99° N · 107.69° E · Độ cao 800m+"
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E2B22] rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase tracking-[0.06em] text-stone-600 dark:text-stone-400 font-semibold block mb-1">
                          Hotline / Zalo
                        </label>
                        <input
                          type="text"
                          disabled={!unlockStoreInfo}
                          value={settings.hotline1}
                          onChange={(e) => setSettings({ ...settings, hotline1: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E2B22] rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* THẺ XANH RỪNG: TIÊU ĐỀ VÀ MÔ TẢ CHỮ KEM TƯƠNG PHẢN >= 4.5:1 (Mục D12) */}
                  <div className="md:col-span-2 p-6 rounded-2xl bg-[#1F3A2A] border border-[#3E5C46]/80 text-[#F4EEE2] shadow-lg flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E8C77A] animate-pulse" />
                      <span className="font-mono text-[12px] uppercase tracking-[0.06em] text-[#E8C77A] font-bold">
                        ĐỒNG BỘ DỮ LIỆU TỰ ĐỘNG
                      </span>
                    </div>
                    <h3 className="font-serif text-[22px] font-bold text-[#F4EEE2] leading-snug">
                      Một Nguồn Dữ Liệu Duy Nhất Toàn Hệ Thống
                    </h3>
                    <p className="text-[15px] text-[rgba(244,238,226,0.88)] leading-relaxed max-w-3xl">
                      Mọi thay đổi về Giờ mở cửa, Lịch nghỉ lễ, Trạng thái quán và Thông báo đầu trang tại đây sẽ tự động đồng bộ tức thì lên Thanh trên cùng, Thẻ kính mờ ở Hero, Bảng 7 ngày trang Liên Hệ, Chân trang website và dữ liệu có cấu trúc Schema.org SEO của Google.
                    </p>
                  </div>`;

// Replace from settingsTarget to before admin password change form
const passwordFormMarker = '{/* Admin Password Change Form */}';
const targetIndex = content.indexOf(settingsTarget);
const passwordIndex = content.indexOf(passwordFormMarker);

if (targetIndex !== -1 && passwordIndex !== -1) {
  content = content.substring(0, targetIndex) + richSettingsCode + '\n                </div>\n              </form>\n\n              ' + content.substring(passwordIndex);
  console.log("Successfully replaced settings tab with rich 7-day schedule, calendar picker, locked info, and forest card!");
} else {
  console.error("Could not find markers for settings tab replacement!", { targetIndex, passwordIndex });
  process.exit(1);
}

const outputPath = path.resolve(__dirname, "../src/app/admin/page.tsx");
fs.writeFileSync(outputPath, content, "utf8");
console.log("Updated src/app/admin/page.tsx successfully!");
