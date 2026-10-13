"use client";

import { useState, useEffect, useRef } from "react";
import Footer from "@/components/Footer";
import ContourLines from "@/components/ui/ContourLines";
import { MENU_ITEMS, MENU_CATEGORIES, MenuItem } from "@/data/menu";
import { useLanguage } from "@/context/LanguageContext";
import {
  Droplets,
  Sprout,
  PhoneCall,
  Navigation,
  Search,
  X,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

import {
  getSharedData,
  KEYS,
} from "@/lib/syncStore";
import {
  CAMCU_MENU_OVERRIDES_KEY,
  getStoredData,
} from "@/utils/storage";

export default function MenuPage() {
  const { locale, dict } = useLanguage();
  const isEn = locale === "en";

  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    trackEvent("view_menu");
    // 1. Hydrate immediately from LocalStorage & Shared Cookie to survive F5
    const storedOverrides = getStoredData<Record<string, { inStock: boolean; price?: number }>>(
      CAMCU_MENU_OVERRIDES_KEY,
      {}
    );
    const disabledIds = getSharedData<string[]>(KEYS.DISABLED_MENU_IDS, []);

    setMenuItems((prev) =>
      prev.map((item) => {
        const ov = storedOverrides[item.id];
        const isExplicitlyDisabled = disabledIds.includes(item.id);
        return {
          ...item,
          inStock: isExplicitlyDisabled ? false : ov ? ov.inStock : item.inStock ?? true,
          price: ov && typeof ov.price === "number" ? ov.price : item.price,
        };
      })
    );

    const handleSync = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail?.key === KEYS.DISABLED_MENU_IDS) {
        const currentDisabled: string[] = custom.detail.value || [];
        setMenuItems((prev) =>
          prev.map((item) => ({
            ...item,
            inStock: !currentDisabled.includes(item.id),
          }))
        );
      }
    };
    window.addEventListener("camcu_sync_update", handleSync);

    // 2. Fetch server updates
    async function loadMenu() {
      try {
        const res = await fetch("/api/admin/menu");
        if (res.ok) {
          const data = await res.json();
          if (data.items && Array.isArray(data.items)) {
            const currentStored = getStoredData<Record<string, { inStock: boolean; price?: number }>>(
              CAMCU_MENU_OVERRIDES_KEY,
              {}
            );
            const merged = data.items.map((item: MenuItem) => {
              const ov = currentStored[item.id] || (data.overrides ? data.overrides[item.id] : null);
              return {
                ...item,
                inStock: ov ? ov.inStock : item.inStock ?? true,
                price: ov && typeof ov.price === "number" ? ov.price : item.price,
              };
            });
            setMenuItems(merged);
          }
        }
      } catch (err) {
        console.error("Lỗi đồng bộ thực đơn từ máy chủ:", err);
      }
    }
    loadMenu();

    return () => {
      window.removeEventListener("camcu_sync_update", handleSync);
    };
  }, []);

  function removeVietnameseTones(str: string): string {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  }

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    if (!matchesCategory) return false;
    if (!searchQuery.trim()) return true;
    const cleanQuery = removeVietnameseTones(searchQuery.trim());
    const cleanName = removeVietnameseTones(item.name);
    const cleanDesc = removeVietnameseTones(item.description || "");
    return cleanName.includes(cleanQuery) || cleanDesc.includes(cleanQuery);
  });

  const getCategoryCount = (catId: string) => {
    if (catId === "all") return menuItems.length;
    return menuItems.filter((i) => i.category === catId).length;
  };

  const signatureItem = menuItems.find((i) => i.id === "c5") || menuItems[0];
  const isSignatureOutOfStock = signatureItem?.inStock === false;

  const validCategories = MENU_CATEGORIES.filter((c) => c.id !== "all");

  const scrollToCategory = (catId: string) => {
    setActiveCategory("all");
    const el = document.getElementById(`cat-${catId}`);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[var(--paper)] text-[var(--ink)] min-h-screen selection:bg-[var(--basalt)] selection:text-white transition-colors overflow-x-hidden">
      <main className="overflow-x-hidden">
        {/* =========================================================================
            8.4.1 ĐẦU TRANG (H1 KHÔNG CÓ DẤU CHẤM • ĐẦU DÒNG + 3 BADGE MONO)
           ========================================================================= */}
        <section className="relative pt-32 sm:pt-40 pb-12 sm:pb-16 border-b border-[var(--line)] overflow-hidden">
          <ContourLines opacity={0.07} className="text-[var(--ink)]" />

          <div className="container-unified relative z-10 flex flex-col items-center text-center">
            {/* Nhãn mono */}
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--basalt)] font-bold mb-3">
              {isEn ? "ARTISANAL HIGHLAND RECIPES" : "ẨM THỰC CAO NGUYÊN"}
            </span>

            {/* H1: Thực Đơn Mộc Mạc, Thức Uống Xanh & Món Ăn Lành (không có dấu • đầu dòng per Section 8.4.1) */}
            <h1 className="font-serif text-[clamp(32px,5.5vw,64px)] font-bold text-[var(--ink)] tracking-tight leading-[1.08] text-balance max-w-4xl mb-4">
              Thực Đơn Mộc Mạc, Thức Uống Xanh &amp; Món Ăn Lành
            </h1>

            <p className="text-[16px] sm:text-[18px] text-[var(--ink-muted)] leading-[1.7] max-w-2xl mb-8">
              {dict.menu.subtitle}
            </p>

            {/* 3 Badge mono (Section 8.4.1) */}
            <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl font-mono text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider text-[var(--ink)]">
              <span className="px-4 py-2 rounded-full bg-[var(--card)] border border-[var(--line)] shadow-xs flex items-center gap-2">
                <Droplets className="w-3.5 h-3.5 text-[var(--stream)]" />
                <span>100% NGUYÊN LIỆU TƯƠI SẠCH</span>
              </span>
              <span className="px-4 py-2 rounded-full bg-[var(--card)] border border-[var(--line)] shadow-xs flex items-center gap-2">
                <Sprout className="w-3.5 h-3.5 text-[var(--basalt)]" />
                <span>ROBUSTA RANG CỦI MỘC</span>
              </span>
              <span className="px-4 py-2 rounded-full bg-[var(--card)] border border-[var(--line)] shadow-xs flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--stream)]" />
                <span>GIÁ BÌNH DÂN 20K–45K</span>
              </span>
            </div>
          </div>
        </section>

        {/* Thanh lọc dính trên Mobile (Section 8.4.6) */}
        <div className="lg:hidden sticky top-16 z-30 w-full bg-[var(--paper)]/95 backdrop-blur-md border-b border-[var(--line)] py-3 px-4 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {MENU_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              const catLabel = dict.menu.categories[cat.id] || cat.name;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id);
                    if (cat.id !== "all") {
                      scrollToCategory(cat.id);
                    }
                  }}
                  className={`btn-press-sm shrink-0 px-3.5 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-[var(--ink)] text-[var(--paper)] font-bold shadow-xs"
                      : "bg-[var(--card)] text-[var(--ink-muted)] border border-[var(--line)]"
                  }`}
                >
                  {catLabel} ({getCategoryCount(cat.id)})
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            8.4.2 BỐ CỤC "TỜ THỰC ĐƠN GIẤY": CỘT TRÁI DÍNH + CỘT PHẢI DANH SÁCH (TỐI ĐA 760PX)
           ========================================================================= */}
        <section className="container-unified py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16">
            {/* ================= CỘT TRÁI DÍNH (DESKTOP) ================= */}
            <aside className="hidden lg:flex flex-col gap-6 w-[280px] shrink-0 sticky top-28 self-start">
              {/* Ô tìm kiếm không dấu */}
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder={dict.menu.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full min-h-[46px] pl-10 pr-10 py-2.5 bg-[var(--card)] text-[var(--ink)] placeholder-[var(--ink-muted)]/60 rounded-full font-mono text-[12px] border border-[var(--line)] focus:outline-none focus:border-[var(--basalt)] transition-colors shadow-xs"
                />
                <Search className="w-4 h-4 text-[var(--ink-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] hover:text-[var(--ink)] p-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Mục lục danh mục có số 01–08 (Section 8.4.2) */}
              <div className="card-accent rounded-[24px] p-5 border border-[var(--line)] shadow-xs bg-[var(--paper-2)]">
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--stream)] block mb-3 pb-2 border-b border-[var(--line)]">
                  MỤC LỤC THỰC ĐƠN
                </span>

                <nav className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveCategory("all")}
                    className={`flex items-center justify-between py-2 px-3 rounded-lg text-left font-serif text-[15px] transition-colors ${
                      activeCategory === "all"
                        ? "bg-[var(--card)] text-[var(--basalt)] font-bold shadow-xs"
                        : "text-[var(--ink)] hover:text-[var(--basalt)]"
                    }`}
                  >
                    <span>Tất Cả Món</span>
                    <span className="font-mono text-xs text-[var(--ink-muted)]">
                      {menuItems.length}
                    </span>
                  </button>

                  {validCategories.map((cat, idx) => {
                    const isCurrent = activeCategory === cat.id;
                    const count = getCategoryCount(cat.id);
                    const catLabel = dict.menu.categories[cat.id] || cat.name;
                    const catNum = String(idx + 1).padStart(2, "0");

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => scrollToCategory(cat.id)}
                        className={`flex items-center justify-between py-2 px-3 rounded-lg text-left font-serif text-[15px] transition-colors ${
                          isCurrent
                            ? "bg-[var(--card)] text-[var(--basalt)] font-bold shadow-xs"
                            : "text-[var(--ink)] hover:text-[var(--basalt)]"
                        }`}
                      >
                        <span className="truncate">
                          <span className="font-mono text-[11px] text-[var(--ink-muted)] mr-2">
                            {catNum}
                          </span>
                          {catLabel}
                        </span>
                        <span className="font-mono text-xs text-[var(--ink-muted)] shrink-0 ml-2">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Hotline nhanh */}
              <div className="card-unified p-5 rounded-[24px] text-center flex flex-col items-center gap-2">
                <span className="font-mono text-[11px] text-[var(--ink-muted)] uppercase tracking-wider">
                  GỌI MÓN TRƯỚC
                </span>
                <a
                  href="tel:0382851688"
                  className="font-mono font-bold text-[16px] text-[var(--basalt)] hover:underline flex items-center gap-1.5"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>038 285 1688</span>
                </a>
              </div>
            </aside>

            {/* ================= CỘT PHẢI: DANH SÁCH THEO NHÓM (TỐI ĐA 760PX) ================= */}
            <div className="flex-1 w-full max-w-[760px] flex flex-col gap-14 mx-auto lg:mx-0">
              {/* ================= 8.4.3 MÓN ĐƯỢC YÊU THÍCH NHẤT ================= */}
              {signatureItem && (
                <div className="card-accent rounded-[28px] p-8 sm:p-10 border border-[var(--line)] shadow-lg bg-[var(--paper-2)] relative overflow-hidden flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-4">
                    {/* Tem tròn "SIGNATURE" */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--basalt)] text-white font-mono text-[11px] font-bold tracking-widest uppercase shadow-xs">
                      <Sparkles className="w-3 h-3 text-white" />
                      <span>SIGNATURE</span>
                    </div>

                    {isSignatureOutOfStock && (
                      <span className="px-3 py-1 rounded-full bg-rose-950/80 text-rose-200 font-mono text-[11px] font-bold uppercase">
                        TẠM HẾT HÔM NAY
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pt-1">
                    {/* Tên món Fraunces 40px */}
                    <h2 className="font-serif text-[clamp(28px,4vw,40px)] font-bold text-[var(--ink)] leading-tight">
                      {signatureItem.name}
                    </h2>

                    {/* Giá Fraunces/Be Vietnam Pro 700 màu bazan */}
                    <span className="font-sans font-bold text-[24px] sm:text-[28px] text-[var(--basalt)] shrink-0 tabular-nums">
                      {signatureItem.price.toLocaleString("vi-VN")}đ
                    </span>
                  </div>

                  {/* Mô tả */}
                  <p className="text-[16px] sm:text-[17px] text-[var(--ink-muted)] leading-[1.7]">
                    {signatureItem.description || dict.menu.signatureDesc}
                  </p>

                  {/* Nút Gọi hotline */}
                  <div className="pt-2">
                    <a
                      href="tel:0382851688"
                      className="btn-primary min-h-[46px] px-7 text-[14px] font-semibold"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Gọi Hotline: 038 285 1688</span>
                    </a>
                  </div>
                </div>
              )}

              {/* ================= 8.4.4 NHÓM MÓN (TIÊU ĐỀ FRAUNCES 48PX, ĐƯỜNG CHẤM DẪN, GIỮ ĐỦ 67 MÓN) ================= */}
              <div className="flex flex-col gap-14">
                {validCategories.map((cat, catIdx) => {
                  const catItems = filteredItems.filter((i) => i.category === cat.id);
                  if (catItems.length === 0) return null;
                  const catLabel = dict.menu.categories[cat.id] || cat.name;
                  const catNumber = String(catIdx + 1).padStart(2, "0");

                  return (
                    <section
                      key={cat.id}
                      id={`cat-${cat.id}`}
                      className="flex flex-col gap-6 pt-4 scroll-mt-28"
                    >
                      {/* Tiêu đề nhóm Fraunces 48px + số thứ tự */}
                      <div className="flex items-baseline justify-between pb-3 border-b-2 border-[var(--line)]">
                        <div className="flex items-baseline gap-3">
                          <span className="font-mono text-sm font-bold text-[var(--basalt)]">
                            {catNumber}
                          </span>
                          <h3 className="font-serif text-[clamp(30px,4.5vw,48px)] font-bold text-[var(--ink)] tracking-tight leading-none">
                            {catLabel}
                          </h3>
                        </div>
                        <span className="font-mono text-xs text-[var(--ink-muted)] uppercase tracking-wider">
                          {catItems.length} MÓN
                        </span>
                      </div>

                      {/* Danh sách 1 cột (độ rộng tối đa 760px để dễ đọc per Section 8.4.4) */}
                      <div className="flex flex-col gap-3">
                        {catItems.map((item) => {
                          const isOutOfStock = item.inStock === false;

                          return (
                            <div
                              key={item.id}
                              className={`flex flex-col py-2.5 px-3 rounded-xl transition-colors hover:bg-[var(--paper-2)]/50 ${
                                isOutOfStock ? "opacity-45" : ""
                              }`}
                            >
                              {/* Hàng 1: Tên món 18px 600 · đường chấm dẫn · giá (Be Vietnam Pro 700 17px, bazan) */}
                              <div className="flex items-baseline justify-between w-full">
                                <div className="flex items-center gap-2 shrink-0 max-w-[70%]">
                                  <span
                                    className={`text-[17px] sm:text-[18px] font-semibold leading-snug ${
                                      isOutOfStock
                                        ? "line-through text-[var(--ink-muted)]"
                                        : "text-[var(--ink)]"
                                    }`}
                                  >
                                    {item.name}
                                  </span>

                                  {/* Tem nhỏ Signature / Mới */}
                                  {isOutOfStock ? (
                                    <span className="px-2 py-0.5 rounded-full bg-rose-950/70 text-rose-200 border border-rose-800 font-mono text-[10px] font-bold">
                                      TẠM HẾT
                                    </span>
                                  ) : (
                                    item.tag && (
                                      <span className="px-2 py-0.5 rounded-full bg-[var(--basalt)]/12 text-[var(--basalt)] border border-[var(--basalt)]/25 font-mono text-[10px] font-bold">
                                        {item.tag}
                                      </span>
                                    )
                                  )}
                                </div>

                                {/* Đường chấm dẫn (Section 8.4.4) */}
                                <div className="menu-leader-dots" />

                                {/* Giá: Be Vietnam Pro 700 17px, màu bazan */}
                                <span className="font-sans font-bold text-[17px] text-[var(--basalt)] shrink-0 tabular-nums">
                                  {item.price.toLocaleString("vi-VN")}đ
                                </span>
                              </div>

                              {/* Dòng dưới mô tả 15px muted */}
                              {item.description && (
                                <p className="text-[14px] sm:text-[15px] text-[var(--ink-muted)] leading-relaxed mt-1 pr-6 font-medium">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>

              {/* ================= 8.4.5 CAM KẾT TỪ BẾP & QUẦY BAR CẨM CÙ (KHỐI CHARCOAL, 2 NÚT) ================= */}
              <section className="rounded-[28px] p-8 sm:p-10 bg-[#1C1612] text-[#F4ECDD] border border-[rgba(244,236,221,0.14)] shadow-xl relative overflow-hidden flex flex-col gap-5">
                <ContourLines opacity={0.08} className="text-[#F4ECDD]" />

                <div className="relative z-10 flex flex-col gap-3">
                  <span className="font-mono text-[11px] font-bold text-[var(--flower)] uppercase tracking-widest">
                    CAM KẾT TỪ BẾP &amp; QUẦY BAR CẨM CÙ
                  </span>

                  <h3 className="font-serif text-[24px] sm:text-[28px] font-bold text-[#F4ECDD] leading-tight">
                    Nguyên Liệu Tươi Sạch Mỗi Ngày, Tùy Chỉnh Theo Khẩu Vị
                  </h3>

                  <p className="text-[15px] sm:text-[16px] text-[#C7BBA8] leading-relaxed">
                    Tất cả thức uống đều hỗ trợ điều chỉnh độ ngọt và lượng đá theo yêu cầu riêng của quý khách. Cà phê rang củi hoàn toàn nguyên chất, phục vụ chu đáo tận bàn ven bờ suối đá mát lành.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[rgba(244,236,221,0.12)]">
                    <a
                      href="tel:0382851688"
                      className="btn-primary min-h-[46px] px-7 text-[14px] font-semibold"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Gọi Hotline: 038 285 1688</span>
                    </a>

                    <a
                      href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary min-h-[46px] px-7 text-[14px] font-semibold !border-[rgba(244,236,221,0.3)] !text-[#F4ECDD] hover:!bg-[#F4ECDD] hover:!text-[#1C1612]"
                    >
                      <Navigation className="w-4 h-4 text-[var(--stream)]" />
                      <span>Chỉ đường ghé quán</span>
                    </a>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
