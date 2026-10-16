"use client";

import { useState, useEffect, useRef } from "react";
import Footer from "@/components/Footer";
import { MENU_ITEMS, MENU_CATEGORIES, MenuItem } from "@/data/menu";
import { useLanguage } from "@/context/LanguageContext";
import {
  PhoneCall,
  Navigation,
  Search,
  X,
  Compass,
  Sparkles
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { getSharedData, KEYS } from "@/lib/syncStore";
import { CAMCU_MENU_OVERRIDES_KEY, getStoredData } from "@/utils/storage";
import PageDarkHero from "@/components/layout/PageDarkHero";
import { searchMenuItemsLocally } from "@/lib/search";

export default function MenuPage() {
  const { locale, dict } = useLanguage();
  const isEn = locale === "en";

  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    trackEvent("view_menu");
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

    // Ctrl+K to focus search input
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("camcu_sync_update", handleSync);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const filteredItems = searchMenuItemsLocally(menuItems, searchQuery, activeCategory);

  const getCategoryCount = (catId: string) => {
    if (catId === "all") return menuItems.length;
    return menuItems.filter((i) => i.category === catId).length;
  };

  const signatureItem = menuItems.find((i) => i.id === "c5") || menuItems[0];
  const validCategories = MENU_CATEGORIES.filter((c) => c.id !== "all");

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    const el = document.getElementById(`cat-${catId}`);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[var(--bg)] min-h-screen text-[var(--ink)] selection:bg-[var(--ember)] selection:text-[#0A0E0C] transition-colors overflow-x-hidden">
      <main className="overflow-x-hidden">
        {/* =========================================================================
            1. ĐẦU TRANG: HERO TỐI (SECTION 8.4.1)
           ========================================================================= */}
        <PageDarkHero
          badges={
            isEn
              ? ["[67 CURATED ITEMS]", "[AFFORDABLE 20K–45K]", "[CLEAN GREEN INGREDIENTS]"]
              : ["[67 MÓN CHỌN LỌC]", "[GIÁ BÌNH DÂN 20K–45K]", "[NGUYÊN LIỆU XANH SẠCH]"]
          }
          h1Main={isEn ? "RUSTIC MENU," : "THỰC ĐƠN MỘC MẠC,"}
          h1Accent={isEn ? "Green Drinks & Wholesome Bites" : "Thức Uống Xanh & Món Ăn Lành"}
          subtitle={
            isEn
              ? "67 curated items: highland artisanal coffee, herbal tea, fresh smoothies, cold-pressed juices and nourishing breakfast by Gia Nghia rock stream."
              : "67 món cà phê mộc Tây Nguyên, trà thảo mộc, sinh tố, nước ép nguyên chất và điểm tâm lành mạnh bên bờ suối đá Gia Nghĩa."
          }
          backgroundImage="/uploads/gallery/1788250253551-943009233.jpg"
        />

        {/* =========================================================================
            2. MÓN ĐƯỢC YÊU THÍCH NHẤT: KHUNG --PINE GÓC VÁT (SECTION 8.4.3)
           ========================================================================= */}
        {signatureItem && (
          <section className="w-full max-w-[1360px] mx-auto px-5 sm:px-10 py-12">
            <div className="p-8 sm:p-12 bg-[var(--pine)] text-[#F2EDE4] border border-[var(--line-on-dark)] clip-chamfer-14 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col gap-4 max-w-2xl relative z-10">
                <span className="font-mono text-[12px] font-bold uppercase tracking-widest" style={{ color: "var(--mist-on-dark)" }}>
                  {isEn ? "[MOST LOVED SIGNATURE AT CẨM CÙ]" : "[SIGNATURE MÓN YÊU THÍCH NHẤT TẠI CẨM CÙ]"}
                </span>

                <h2 className="font-display font-black text-[clamp(36px,5.5vw,64px)] uppercase tracking-tight leading-tight" style={{ color: "#F2EDE4" }}>
                  {signatureItem.name}
                </h2>

                <p className="text-[16px] leading-relaxed" style={{ color: "rgba(242, 237, 228, 0.85)" }}>
                  {signatureItem.description}
                </p>

                <div className="flex items-center gap-4 pt-2">
                  <span className="font-mono font-bold text-[28px] sm:text-[34px] tabular-nums" style={{ color: "#F2EDE4" }}>
                    {signatureItem.price.toLocaleString("vi-VN")}đ
                  </span>
                  {signatureItem.inStock === false && (
                    <span className="font-mono text-xs uppercase px-2.5 py-1 bg-red-900/60 text-red-200 border border-red-500/40 font-bold">
                      {isEn ? "SOLD OUT" : "TẠM HẾT"}
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0 relative z-10">
                <a
                  href="tel:0382851688"
                  className="px-8 py-4 bg-[var(--ember-on-dark)] text-[#0A0E0C] font-mono text-[13px] font-bold uppercase tracking-wider clip-chamfer-14 hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-[#0A0E0C]" />
                  <span style={{ color: "#0A0E0C" }}>{isEn ? "CALL HOTLINE FOR WELCOME" : "GỌI HOTLINE ĐÓN TIẾP"}</span>
                </a>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            3. BỐ CỤC 2 VÙNG: CỘT TRÁI DÍNH & CỘT PHẢI DANH SÁCH (SECTION 8.4.2)
           ========================================================================= */}
        <section className="w-full max-w-[1360px] mx-auto px-5 sm:px-10 pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* CỘT TRÁI DÍNH (4 cols): Ô tìm kiếm Ctrl+K & Mục lục 01–08 */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-6">
              {/* Ô tìm kiếm bảng lệnh kiểu Ctrl+K */}
              <div className="relative">
                <div className="relative flex items-center">
                  <Search className="absolute left-3.5 w-4 h-4 text-[var(--ink-muted)] pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isEn ? "Search menu without tones..." : "Tìm món không dấu (Ctrl+K)..."}
                    className="w-full pl-10 pr-20 py-3.5 bg-[var(--card)] border border-[var(--line)] text-[14px] text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:border-[var(--ember)] font-sans transition-colors rounded-sm"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 p-1 text-[var(--ink-muted)] hover:text-[var(--ink)]"
                      aria-label={isEn ? "Clear search" : "Xóa tìm kiếm"}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="absolute right-3 font-mono text-[10px] text-[var(--ink-muted)] border border-[var(--line)] px-1.5 py-0.5 rounded-sm">
                      CTRL K
                    </span>
                  )}
                </div>
              </div>

              {/* Mục lục danh mục đánh số 01–08 */}
              <div className="bg-[var(--card)] border border-[var(--line)] clip-chamfer-14 p-5 flex flex-col gap-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--ink-muted)] font-bold pb-2 border-b border-[var(--line)] block">
                  {isEn ? "CATEGORIES DIRECTORY" : "MỤC LỤC DANH MỤC"}
                </span>

                <button
                  type="button"
                  onClick={() => setActiveCategory("all")}
                  className={`w-full py-2.5 px-3 flex items-center justify-between font-mono text-[13px] uppercase tracking-wider transition-colors text-left rounded-sm ${
                    activeCategory === "all"
                      ? "bg-[var(--ember)] text-[var(--ember-ink)] font-bold"
                      : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--bg-2)]"
                  }`}
                >
                  <span>{isEn ? "[ALL 67 ITEMS]" : "[TẤT CẢ 67 MÓN]"}</span>
                  <span className="tabular-nums">({menuItems.length})</span>
                </button>

                {validCategories.map((cat, idx) => {
                  const isCatActive = activeCategory === cat.id;
                  const count = getCategoryCount(cat.id);
                  const numStr = String(idx + 1).padStart(2, "0");

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => scrollToCategory(cat.id)}
                      className={`w-full py-2.5 px-3 flex items-center justify-between font-mono text-[13px] uppercase tracking-wider transition-colors text-left rounded-sm ${
                        isCatActive
                          ? "bg-[var(--ember)] text-[var(--ember-ink)] font-bold"
                          : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--bg-2)]"
                      }`}
                    >
                      <span>
                        [{numStr}] {isEn && dict.menu.categories?.[cat.id] ? dict.menu.categories[cat.id] : cat.name}
                      </span>
                      <span className="tabular-nums">({count})</span>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* CỘT PHẢI (8 cols): Danh sách món theo nhóm (SECTION 8.4.4) */}
            <div className="lg:col-span-8 flex flex-col gap-14">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--line)] font-mono text-[12px] uppercase text-[var(--ink-muted)]">
                <span className="font-bold text-[var(--ember)]">
                  {isEn ? `SHOWING: ${filteredItems.length} / ${menuItems.length} ITEMS` : `HIỂN THỊ: ${filteredItems.length} / ${menuItems.length} MÓN`}
                </span>
                <span>{isEn ? "[CURATED MENU]" : "[THỰC ĐƠN CHỌN LỌC]"}</span>
              </div>

              {validCategories.map((cat, catIdx) => {
                const groupItems = filteredItems.filter((i) => i.category === cat.id);
                if (groupItems.length === 0) return null;

                const catNum = String(catIdx + 1).padStart(2, "0");

                return (
                  <div key={cat.id} id={`cat-${cat.id}`} className="flex flex-col gap-6 scroll-mt-28">
                    {/* Tiêu đề nhóm */}
                    <div className="flex items-baseline justify-between pb-3 border-b-2 border-[var(--ink)]">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-[14px] text-[var(--ember)] font-bold">
                          [{catNum}]
                        </span>
                        <h3 className="font-display font-black text-[28px] sm:text-[36px] uppercase tracking-tight text-[var(--ink)]">
                          {isEn && dict.menu.categories?.[cat.id] ? dict.menu.categories[cat.id] : cat.name}
                        </h3>
                      </div>
                      <span className="font-mono text-[12px] text-[var(--ink-muted)] tabular-nums">
                        {groupItems.length} {isEn ? "ITEMS" : "MÓN"}
                      </span>
                    </div>

                    {/* Danh sách từng món là một hàng kẻ mảnh (Section 8.4.4) */}
                    <div className="divide-y divide-[var(--line)]">
                      {groupItems.map((item) => {
                        const isOutOfStock = item.inStock === false;

                        return (
                          <article
                            key={item.id}
                            className={`group relative overflow-hidden px-3 py-5 transition-colors duration-200 hover:bg-[var(--card)]/70 ${
                              isOutOfStock ? "opacity-45" : ""
                            }`}
                          >
                            <div
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-y-0 left-0 w-0 bg-gradient-to-r from-[var(--ember)]/10 to-transparent transition-all duration-300 group-hover:w-full"
                            />

                            {/* Hàng trên: Tên món 20px/600 + Đường chấm dẫn + Giá 18px/700 ember */}
                            <div className="relative z-10 flex items-baseline justify-between">
                              <div className="flex flex-wrap items-center gap-2.5 pr-2">
                                <h3
                                  className={`text-[20px] font-semibold leading-snug text-[var(--ink)] ${
                                    isOutOfStock ? "line-through text-[var(--ink-muted)]" : ""
                                  }`}
                                >
                                  {item.name}
                                </h3>

                                {/* Tag */}
                                {item.tag && !isOutOfStock && (
                                  <span className="text-mono-label border border-[var(--ember)] px-2 py-0.5 text-[var(--ember)]">
                                    [{item.tag}]
                                  </span>
                                )}
                                {isOutOfStock && (
                                  <span className="text-mono-label border border-[var(--line)] px-2 py-0.5">
                                    {isEn ? "[SOLD OUT]" : "[TẠM HẾT]"}
                                  </span>
                                )}
                              </div>

                              {/* Đường chấm dẫn giữa tên món và giá */}
                              <span aria-hidden="true" className="menu-dotted-leader" />

                              {/* Giá tiền: JetBrains Mono 700 18px ember, trượt -6px khi hover */}
                              <span className="shrink-0 font-[var(--font-mono)] text-[18px] font-bold tabular-nums text-[var(--ember)] transition-transform duration-200 group-hover:-translate-x-[6px]">
                                {item.price.toLocaleString("vi-VN")}đ
                              </span>
                            </div>

                            {/* Dòng 2: Mô tả món 15px */}
                            {item.description && (
                              <p className="text-[14px] sm:text-[15px] text-[var(--ink-muted)] leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {filteredItems.length === 0 && (
                <div className="p-12 text-center border border-[var(--line)] clip-chamfer-14 bg-[var(--card)] flex flex-col items-center gap-3">
                  <span className="font-mono text-[13px] text-[var(--ink-muted)] uppercase">
                    {isEn ? `NO ITEMS FOUND MATCHING “${searchQuery}”` : `KHÔNG TÌM THẤY MÓN PHÙ HỢP VỚI TỪ KHÓA “${searchQuery}”`}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("all");
                    }}
                    className="font-mono text-xs uppercase text-[var(--ember)] hover:underline font-bold"
                  >
                    {isEn ? "CLEAR FILTERS TO VIEW ALL 67 ITEMS" : "XÓA BỘ LỌC ĐỂ XEM TOÀN BỘ 67 MÓN"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. CAM KẾT TỪ BẾP & QUẦY BAR CẨM CÙ: BĂNG NGANG EMBER (SECTION 8.4.5)
           ========================================================================= */}
        <section className="w-full bg-[var(--ember)] text-[var(--ember-ink)] py-16 px-5 sm:px-10 border-t border-[var(--line)]">
          <div className="w-full max-w-[1360px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex flex-col gap-2 max-w-2xl">
              <span className="font-mono text-[12px] uppercase tracking-widest font-bold" style={{ color: "var(--ember-ink)" }}>
                {isEn ? "[PLEDGE FROM CẨM CÙ KITCHEN & BAR]" : "[CAM KẾT TỪ BẾP & QUẦY BAR CẨM CÙ]"}
              </span>
              <h3 className="font-display font-black text-[28px] sm:text-[38px] uppercase tracking-tight leading-tight" style={{ color: "var(--ember-ink)" }}>
                {isEn ? "FRESH NATURAL INGREDIENTS DAILY" : "NGUYÊN LIỆU XANH TƯƠI MỖI NGÀY"}
              </h3>
              <p className="text-[15px] sm:text-[16px] font-medium leading-relaxed" style={{ color: "var(--ember-ink)" }}>
                {isEn
                  ? "We do not use artificial preservatives or chemical flavors. Wood-fired pure coffee, early-harvested tea and wholesome hot breakfast served with sincere heart."
                  : "Chúng tôi không sử dụng chất bảo quản hay hương liệu công nghiệp. Cà phê rang củi mộc, trà hái sớm và điểm tâm nóng hổi phục vụ tận tâm."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <a
                href="tel:0382851688"
                className="px-6 py-3.5 bg-[#0A0E0C] text-[#F2EDE4] font-mono text-[12px] font-bold uppercase tracking-wider clip-chamfer-14 hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-[var(--ember-on-dark,#FF6A2B)]" />
                <span>{isEn ? "CALL HOTLINE FOR WELCOME" : "GỌI HOTLINE ĐÓN TIẾP"}</span>
              </a>

              <a
                href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-transparent border-2 border-current text-[var(--ember-ink)] font-mono text-[12px] font-bold uppercase tracking-wider clip-chamfer-14 hover:bg-[#0A0E0C] hover:text-[#F2EDE4] transition-all flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>{isEn ? "DIRECTIONS TO CAFE" : "CHỈ ĐƯỜNG TỚI QUÁN"}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
