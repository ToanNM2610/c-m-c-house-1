"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import StaggerText, { StaggerParagraph } from "@/components/motion/StaggerText";
import { MENU_ITEMS, MENU_CATEGORIES, MenuItem } from "@/data/menu";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets,
  Sprout,
  PhoneCall,
  Navigation,
  CheckCircle2,
  Search,
  X,
} from "lucide-react";

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

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = !searchQuery.trim() || item.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesCategory && matchesSearch;
  });

  const getCategoryCount = (catId: string) => {
    if (catId === "all") return menuItems.length;
    return menuItems.filter((i) => i.category === catId).length;
  };

  const signatureItem = menuItems.find((i) => i.id === "c5");
  const isSignatureOutOfStock = signatureItem?.inStock === false;

  return (
    <div className="bg-[var(--bg)] min-h-screen text-[var(--text)] font-sans selection:bg-[var(--surface-2)] selection:text-[var(--text)] transition-colors duration-200">
      <main className="pt-24 sm:pt-28">
        {/* Top Atmospheric Intro Header */}
        <section className="relative w-full overflow-hidden pt-6 sm:pt-8 pb-10">
          <div className="container-unified flex flex-col items-center text-center">
            {/* Botanical badge */}
            <div className="badge-unified inline-flex items-center gap-2 mb-4">
              <Sprout className="w-3.5 h-3.5 text-[var(--accent-green)]" />
              <span>{dict.menu.badge}</span>
            </div>

            <StaggerText
              as="h1"
              lines={[dict.menu.title]}
              stagger={0.1}
              className="font-serif text-[clamp(36px,5vw,60px)] text-[var(--text)] font-bold max-w-[900px] mb-3 tracking-tight leading-tight text-balance"
            />
            <div className="max-w-2xl mb-6">
              <StaggerParagraph
                text={dict.menu.subtitle}
                className="text-[15px] sm:text-[16px] font-medium text-[var(--text-muted)] leading-relaxed max-w-[65ch]"
                delay={0.15}
              />
            </div>

            {/* Quick Trust Indicators 3 Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-2xl">
              <div className="card-unified !p-3 flex items-center justify-center gap-2 text-[13px] font-semibold text-[var(--accent-green)]">
                <Droplets className="w-4 h-4 text-[var(--accent-green)]" />
                <span>{dict.menu.pureSpring}</span>
              </div>
              <div className="card-unified !p-3 flex items-center justify-center gap-2 text-[13px] font-semibold text-[var(--accent-clay)]">
                <Sprout className="w-4 h-4 text-[var(--accent-clay)]" />
                <span>{dict.menu.dailyFresh}</span>
              </div>
              <div className="col-span-2 sm:col-span-1 card-unified !p-3 flex items-center justify-center gap-2 text-[13px] font-semibold text-[var(--accent-green)]">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent-green)]" />
                <span>{dict.menu.noAdditives}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky Dynamic Filter Navigation */}
        <div className="sticky top-16 sm:top-20 z-40 w-full bg-[var(--bg)]/95 backdrop-blur-md py-3.5 border-y border-[var(--border)] shadow-sm">
          <div className="container-unified flex flex-col gap-3">
            {/* Row 1: Search Bar (44px min-h) */}
            <div className="w-full flex items-center justify-between gap-3">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder={dict.menu.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full min-h-[44px] pl-10 pr-10 py-2.5 bg-[var(--surface-2)] text-[var(--text)] placeholder-[var(--text-muted)]/60 rounded-full text-sm border border-[var(--border)] focus:outline-none focus:border-[var(--accent-clay)] transition-colors"
                />
                <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] p-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <span className="hidden sm:inline-block text-[13px] text-[var(--text-muted)] font-medium whitespace-nowrap">
                {filteredItems.length} {isEn ? "items found" : "món phù hợp"}
              </span>
            </div>

            {/* Row 2: Category Tabs with Smooth Edge Fading */}
            <div className="relative w-full overflow-hidden mask-gradient-x">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1">
                {MENU_CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  const count = getCategoryCount(cat.id);
                  const categoryLabel = dict.menu.categories[cat.id] || cat.name;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      type="button"
                      className={`btn-press-sm shrink-0 min-h-[44px] px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-[var(--accent-clay)] text-[#1B120E] shadow-sm font-bold"
                          : "bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] border border-[var(--border)]"
                      }`}
                    >
                      <span>
                        {categoryLabel} ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Menu Layout */}
        <div className="container-unified py-10 flex flex-col gap-8">
          {/* Spotlight Story Card: Món được yêu thích nhất - một khung chữ nền --surface-2, KHÔNG ảnh */}
          {signatureItem && (
            <div className="w-full card-accent flex flex-col gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="badge-unified">
                  {dict.menu.signatureTag}
                </span>
                {isSignatureOutOfStock && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-950/60 text-rose-300 text-xs font-semibold border border-rose-800">
                    {dict.common.soldOutToday}
                  </span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <h3 className="font-serif text-[clamp(24px,3vw,32px)] font-bold text-[var(--text)]">
                  {signatureItem.name}
                </h3>
                <span className="text-[20px] font-bold text-[var(--accent-clay)] tabular-nums font-sans">
                  {signatureItem.price.toLocaleString("vi-VN")}đ
                </span>
              </div>
              <p className="text-[15px] sm:text-[16px] font-medium text-[var(--text-muted)] leading-relaxed max-w-3xl">
                {signatureItem.description || dict.menu.signatureDesc}
              </p>
              <div className="pt-2 flex items-center gap-3">
                <a
                  href="tel:0382851688"
                  className="btn-primary min-h-[44px] px-6 text-sm font-bold shadow-md"
                >
                  <PhoneCall className="w-4 h-4 text-[#1B120E]" />
                  <span>
                    {isEn ? "Call Hotline: 038 285 1688" : "Gọi Hotline: 038 285 1688"}
                  </span>
                </a>
              </div>
            </div>
          )}

          {/* Menu Items List - 2 cột desktop, 1 cột mobile, tiêu đề nhóm Playfair 28px */}
          <div className="card-unified">
            {activeCategory === "all" ? (
              // Grouped view by category with Playfair 28px headings
              <div className="flex flex-col gap-10">
                {MENU_CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
                  const catItems = filteredItems.filter((item) => item.category === cat.id);
                  if (catItems.length === 0) return null;
                  const catLabel = dict.menu.categories[cat.id] || cat.name;

                  return (
                    <div key={cat.id} className="flex flex-col gap-4">
                      {/* Tiêu đề nhóm Playfair 28px */}
                      <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                        <h3 className="font-serif text-[28px] font-bold text-[var(--text)]">
                          {catLabel}
                        </h3>
                        <span className="text-[13px] font-semibold text-[var(--accent-green)]">
                          {catItems.length} {isEn ? "items" : "món"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2">
                        {catItems.map((item, idx) => {
                          const isOutOfStock = item.inStock === false;
                          const isAlternate = idx % 2 === 1;
                          return (
                            <div
                              key={item.id}
                              className={`flex flex-col px-3.5 py-2.5 rounded-xl transition-colors border border-transparent ${
                                isAlternate ? "bg-[var(--surface-2)]/40 hover:bg-[var(--surface-2)]/70" : "bg-transparent hover:bg-[var(--surface-2)]/30"
                              } ${isOutOfStock ? "opacity-50" : ""}`}
                            >
                              <div className="flex items-baseline justify-between gap-2 w-full">
                                <div className="flex items-center gap-2 shrink-0">
                                  <span
                                    className={`text-[17px] sm:text-[18px] font-semibold transition-colors leading-snug ${
                                      isOutOfStock
                                        ? "text-[var(--text-muted)] line-through"
                                        : "text-[var(--text)] group-hover:text-[var(--accent-clay)]"
                                    }`}
                                  >
                                    {item.name}
                                  </span>
                                  {isOutOfStock ? (
                                    <span className="px-2 py-0.5 rounded-full bg-rose-950/60 text-rose-300 border border-rose-800 text-[10px] font-bold">
                                      {dict.common.soldOut}
                                    </span>
                                  ) : (
                                    item.tag && (
                                      <span className="px-2 py-0.5 rounded-full bg-[var(--accent-clay)]/15 text-[var(--accent-clay)] border border-[var(--accent-clay)]/30 text-[10px] font-bold">
                                        {item.tag}
                                      </span>
                                    )
                                  )}
                                </div>

                                {/* Đường chấm dẫn nối tên và giá */}
                                <div className="flex-1 border-b-2 border-dotted border-[var(--border)] mx-2.5 self-center min-w-[20px]" />

                                {/* Giá bên phải cam 17px */}
                                <span className="text-[17px] font-bold text-[var(--accent-clay)] shrink-0 font-sans tabular-nums">
                                  {item.price.toLocaleString("vi-VN")}đ
                                </span>
                              </div>

                              {item.description && (
                                <p className="text-[14px] sm:text-[15px] font-medium text-[var(--text-muted)] leading-relaxed mt-1 pr-6">
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
              </div>
            ) : (
              // Single category view with Playfair 28px heading
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                  <h3 className="font-serif text-[28px] font-bold text-[var(--text)]">
                    {dict.menu.categories[activeCategory] || activeCategory}
                  </h3>
                  <span className="text-[13px] font-semibold text-[var(--accent-green)]">
                    {filteredItems.length} {isEn ? "items" : "món"}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2">
                  {filteredItems.map((item, idx) => {
                    const isOutOfStock = item.inStock === false;
                    const isAlternate = idx % 2 === 1;
                    return (
                      <div
                        key={item.id}
                        className={`flex flex-col px-3.5 py-2.5 rounded-xl transition-colors border border-transparent ${
                          isAlternate ? "bg-[var(--surface-2)]/40 hover:bg-[var(--surface-2)]/70" : "bg-transparent hover:bg-[var(--surface-2)]/30"
                        } ${isOutOfStock ? "opacity-50" : ""}`}
                      >
                        <div className="flex items-baseline justify-between gap-2 w-full">
                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`text-[17px] sm:text-[18px] font-semibold transition-colors leading-snug ${
                                isOutOfStock
                                  ? "text-[var(--text-muted)] line-through"
                                  : "text-[var(--text)] group-hover:text-[var(--accent-clay)]"
                              }`}
                            >
                              {item.name}
                            </span>
                            {isOutOfStock ? (
                              <span className="px-2 py-0.5 rounded-full bg-rose-950/60 text-rose-300 border border-rose-800 text-[10px] font-bold">
                                {dict.common.soldOut}
                              </span>
                            ) : (
                              item.tag && (
                                <span className="px-2 py-0.5 rounded-full bg-[var(--accent-clay)]/15 text-[var(--accent-clay)] border border-[var(--accent-clay)]/30 text-[10px] font-bold">
                                  {item.tag}
                                </span>
                              )
                            )}
                          </div>

                          {/* Đường chấm dẫn nối tên và giá */}
                          <div className="flex-1 border-b-2 border-dotted border-[var(--border)] mx-2.5 self-center min-w-[20px]" />

                          {/* Giá bên phải cam 17px */}
                          <span className="text-[17px] font-bold text-[var(--accent-clay)] shrink-0 font-sans tabular-nums">
                            {item.price.toLocaleString("vi-VN")}đ
                          </span>
                        </div>

                        {item.description && (
                          <p className="text-[14px] sm:text-[15px] font-medium text-[var(--text-muted)] leading-relaxed mt-1 pr-6">
                            {item.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Commitment & Hotline Banner: khung ngang có 2 nút (Gọi Hotline cam, Ghé Thăm Trực Tiếp viền) */}
          <section className="card-unified flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-xl text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-[var(--text)] font-bold font-serif text-[20px] sm:text-[22px]">
                <span>🌿</span>
                <span>
                  {isEn ? "Commitment from Cẩm Cù Kitchen & Bar" : "Cam Kết Từ Bếp & Quầy Bar Cẩm Cù"}
                </span>
              </div>
              <p className="text-[15px] sm:text-[16px] font-medium text-[var(--text-muted)] leading-relaxed">
                {isEn
                  ? "Fresh daily local produce • Customizable sweetness and ice levels for your perfect beverage experience."
                  : "Nguyên liệu tươi sạch mỗi ngày • Hỗ trợ điều chỉnh độ ngọt và đá theo khẩu vị riêng của quý khách để có trải nghiệm vừa ý nhất."}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-[13px] font-medium text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5 text-[var(--accent-green)]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isEn ? "Custom sweetness to taste" : "Giảm ngọt theo khẩu vị"}
                </span>
                <span className="flex items-center gap-1.5 text-[var(--accent-green)]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isEn ? "Table service right beside stream" : "Phục vụ tại bàn sát dòng suối"}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <a
                href="tel:0382851688"
                className="btn-primary min-h-[44px] px-6 text-sm font-bold shadow-md w-full sm:w-auto whitespace-nowrap text-center"
              >
                <PhoneCall className="w-4 h-4 text-[#1B120E]" />
                <span>
                  {isEn ? "Call Hotline: 038 285 1688" : "Gọi Hotline: 038 285 1688"}
                </span>
              </a>
              <a
                href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary min-h-[44px] px-6 text-sm font-semibold w-full sm:w-auto whitespace-nowrap text-center"
              >
                <Navigation className="w-4 h-4 text-[var(--accent-green)]" />
                <span>{isEn ? "Visit in Person" : "Ghé Thăm Trực Tiếp"}</span>
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
