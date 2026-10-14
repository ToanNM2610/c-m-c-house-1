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
            1. ĐẦU TRANG: H1 + 3 BADGE MONO (SECTION 8.4.1)
           ========================================================================= */}
        <section className="relative pt-36 sm:pt-44 pb-14 border-b border-[var(--line)] bg-[#0A0E0C] text-[#F2EDE4]">
          <div className="w-full max-w-[1360px] mx-auto px-5 sm:px-10">
            <div className="flex flex-col gap-4 max-w-4xl">
              <div className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-widest text-[var(--ember)]">
                <Compass className="w-3.5 h-3.5 text-[var(--ember)]" />
                <span>[04] THỰC ĐƠN ĐẠI NGÀN · 67 MÓN NGUYÊN BẢN</span>
              </div>

              {/* H1 Không dấu chấm đầu dòng */}
              <h1 className="font-display font-black text-[clamp(36px,6vw,84px)] uppercase tracking-tight text-[var(--ink)] leading-none text-balance">
                THỰC ĐƠN MỘC MẠC, <span className="font-serif italic font-normal text-[var(--ember)] lowercase">thức uống xanh &amp; món ăn lành</span>
              </h1>

              <p className="text-[16px] sm:text-[18px] text-[var(--ink-muted)] max-w-2xl leading-relaxed">
                {dict.menu.subtitle}
              </p>

              {/* 3 Badge Mono */}
              <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-[var(--line)] font-mono text-[12px] uppercase tracking-wider text-[var(--mist)]">
                <span className="px-3 py-1 bg-[var(--bg-2)] border border-[var(--line)]">
                  [100% NƯỚC SUỐI NGUỒN TỰ NHIÊN]
                </span>
                <span className="px-3 py-1 bg-[var(--bg-2)] border border-[var(--line)]">
                  [NGUYÊN LIỆU TƯƠI MỖI NGÀY]
                </span>
                <span className="px-3 py-1 bg-[var(--bg-2)] border border-[var(--line)]">
                  [KHÔNG HƯƠNG LIỆU CÔNG NGHIỆP]
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. MÓN ĐƯỢC YÊU THÍCH NHẤT: KHUNG --PINE GÓC VÁT (SECTION 8.4.3)
           ========================================================================= */}
        {signatureItem && (
          <section className="w-full max-w-[1360px] mx-auto px-5 sm:px-10 py-12">
            <div className="p-8 sm:p-12 bg-[var(--pine)] text-[#F2EDE4] border border-[var(--line)] clip-chamfer-14 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col gap-4 max-w-2xl relative z-10">
                <span className="font-mono text-[12px] text-[var(--ember)] font-bold uppercase tracking-widest">
                  [SIGNATURE MÓN YÊU THÍCH NHẤT TẠI CẨM CÙ]
                </span>

                <h2 className="font-display font-black text-[clamp(36px,5.5vw,64px)] uppercase tracking-tight text-white leading-tight">
                  {signatureItem.name}
                </h2>

                <p className="text-[16px] text-white/80 leading-relaxed">
                  {signatureItem.description}
                </p>

                <div className="flex items-center gap-4 pt-2">
                  <span className="font-mono font-bold text-[28px] sm:text-[34px] text-[var(--ember)] tabular-nums">
                    {signatureItem.price.toLocaleString("vi-VN")}đ
                  </span>
                  {signatureItem.inStock === false && (
                    <span className="font-mono text-xs uppercase px-2.5 py-1 bg-red-900/60 text-red-200 border border-red-500/40 font-bold">
                      TẠM HẾT
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0 relative z-10">
                <a
                  href="tel:0382851688"
                  className="px-8 py-4 bg-[var(--ember)] text-[#0A0E0C] font-mono text-[13px] font-bold uppercase tracking-wider clip-chamfer-14 hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>GỌI HOTLINE ĐÓN TIẾP</span>
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
                      aria-label="Xóa tìm kiếm"
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
                  MỤC LỤC DANH MỤC
                </span>

                <button
                  type="button"
                  onClick={() => setActiveCategory("all")}
                  className={`w-full py-2.5 px-3 flex items-center justify-between font-mono text-[13px] uppercase tracking-wider transition-colors text-left rounded-sm ${
                    activeCategory === "all"
                      ? "bg-[var(--ember)] text-[#0A0E0C] font-bold"
                      : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--bg-2)]"
                  }`}
                >
                  <span>[TẤT CẢ 67 MÓN]</span>
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
                          ? "bg-[var(--ember)] text-[#0A0E0C] font-bold"
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
                        {groupItems.length} MÓN
                      </span>
                    </div>

                    {/* Danh sách từng món là một hàng kẻ mảnh (Section 8.4.4) */}
                    <div className="divide-y divide-[var(--line)]">
                      {groupItems.map((item) => {
                        const isOutOfStock = item.inStock === false;

                        return (
                          <div
                            key={item.id}
                            className={`group py-4 px-2 flex flex-col gap-1.5 transition-all hover:bg-[var(--card)]/50 rounded-sm ${
                              isOutOfStock ? "opacity-45" : ""
                            }`}
                          >
                            {/* Dòng 1: Tên món · Khoảng trống · Giá tiền */}
                            <div className="flex items-baseline justify-between gap-4">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[17px] sm:text-[19px] font-semibold tracking-tight text-[var(--ink)] ${
                                    isOutOfStock ? "line-through text-[var(--ink-muted)]" : ""
                                  }`}
                                >
                                  {item.name}
                                </span>

                                {/* Tag */}
                                {item.tag && (
                                  <span className="font-mono text-[10px] text-[var(--ember)] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-[var(--ember)]/15 border border-[var(--ember)]/30 rounded-xs">
                                    {item.tag}
                                  </span>
                                )}
                                {isOutOfStock && (
                                  <span className="font-mono text-[10px] text-red-400 uppercase font-bold tracking-wider px-1.5 py-0.5 bg-red-950/40 border border-red-500/30 rounded-xs">
                                    TẠM HẾT
                                  </span>
                                )}
                              </div>

                              {/* Giá tiền: JetBrains Mono 700 18px ember, trượt 6px khi hover */}
                              <div className="shrink-0 font-mono font-bold text-[17px] sm:text-[18px] text-[var(--ember)] tabular-nums group-hover:translate-x-1.5 transition-transform duration-300">
                                {item.price.toLocaleString("vi-VN")}đ
                              </div>
                            </div>

                            {/* Dòng 2: Mô tả món 15px */}
                            {item.description && (
                              <p className="text-[14px] sm:text-[15px] text-[var(--ink-muted)] leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {filteredItems.length === 0 && (
                <div className="p-12 text-center border border-[var(--line)] clip-chamfer-14 bg-[var(--card)] flex flex-col items-center gap-3">
                  <span className="font-mono text-[13px] text-[var(--ink-muted)] uppercase">
                    KHÔNG TÌM THẤY MÓN PHÙ HỢP VỚI TỪ KHÓA &ldquo;{searchQuery}&rdquo;
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("all");
                    }}
                    className="font-mono text-xs uppercase text-[var(--ember)] hover:underline font-bold"
                  >
                    XÓA BỘ LỌC ĐỂ XEM TOÀN BỘ 67 MÓN
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. CAM KẾT TỪ BẾP & QUẦY BAR CẨM CÙ: BĂNG NGANG EMBER (SECTION 8.4.5)
           ========================================================================= */}
        <section className="w-full bg-[var(--ember)] text-[#0A0E0C] py-16 px-5 sm:px-10 border-t border-[#0A0E0C]">
          <div className="w-full max-w-[1360px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex flex-col gap-2 max-w-2xl">
              <span className="font-mono text-[12px] uppercase tracking-widest font-bold">
                [CAM KẾT TỪ BẾP &amp; QUẦY BAR CẨM CÙ]
              </span>
              <h3 className="font-display font-black text-[28px] sm:text-[38px] uppercase tracking-tight leading-tight">
                NGUYÊN LIỆU XANH TƯƠI MỖI NGÀY
              </h3>
              <p className="text-[15px] sm:text-[16px] font-medium leading-relaxed">
                Chúng tôi không sử dụng chất bảo quản hay hương liệu công nghiệp. Cà phê rang củi mộc, trà hái sớm và điểm tâm nóng hổi phục vụ tận tâm.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <a
                href="tel:0382851688"
                className="px-6 py-3.5 bg-[#0A0E0C] text-[#F2EDE4] font-mono text-[12px] font-bold uppercase tracking-wider clip-chamfer-14 hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-[var(--ember)]" />
                <span>GỌI HOTLINE ĐÓN TIẾP</span>
              </a>

              <a
                href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-transparent border-2 border-[#0A0E0C] text-[#0A0E0C] font-mono text-[12px] font-bold uppercase tracking-wider clip-chamfer-14 hover:bg-[#0A0E0C] hover:text-[#F2EDE4] transition-all flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>CHỈ ĐƯỜNG TỚI QUÁN</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
