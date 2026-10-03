"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MENU_ITEMS, MENU_CATEGORIES, MenuItem } from "@/data/menu";
import { useLanguage } from "@/context/LanguageContext";
import {
  Sparkles,
  Droplets,
  Sprout,
  PhoneCall,
  Navigation,
  CheckCircle2,
  Plus,
  Search,
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
  const [, setIsSyncing] = useState(false);

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
      setIsSyncing(true);
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
      } finally {
        setIsSyncing(false);
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
    <div className="bg-[#F9F8F3] dark:bg-[#121A15] min-h-screen text-[#1B281D] dark:text-[#F5F4EE] font-sans selection:bg-[#3E5C46] selection:text-white transition-colors duration-200">
      <Navbar />

      <main className="pt-20">
        {/* Top Atmospheric Intro Header */}
        <section className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8 pt-8 pb-12 bg-gradient-to-b from-stone-100/50 to-[#F9F8F3] dark:from-[#16231A] dark:to-[#121A15] transition-colors duration-200">
          <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
            {/* Botanical badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 dark:bg-[#1E2B22] text-[#3E5C46] dark:text-[#88B795] text-xs font-semibold shadow-sm mb-5 border border-stone-200 dark:border-stone-700/60">
              <Sprout className="w-4 h-4 text-[#3E5C46] dark:text-[#88B795]" />
              <span>{dict.menu.badge}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#3E5C46] dark:text-[#F5F4EE] font-bold max-w-3xl mb-3 tracking-tight">
              {dict.menu.title}
            </h1>
            <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 max-w-2xl leading-relaxed mb-6">
              {dict.menu.subtitle}
            </p>

            {/* Quick Trust Indicators Bento Snippet */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-2xl">
              <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#1E2B22] border border-stone-200/70 dark:border-stone-700/60 shadow-sm text-xs font-bold text-[#3E5C46] dark:text-[#88B795]">
                <Droplets className="w-4 h-4 text-[#396663] dark:text-teal-400" />
                <span>{dict.menu.pureSpring}</span>
              </div>
              <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#1E2B22] border border-stone-200/70 dark:border-stone-700/60 shadow-sm text-xs font-bold text-[#3E5C46] dark:text-[#88B795]">
                <Sprout className="w-4 h-4 text-[#614633] dark:text-amber-400" />
                <span>{dict.menu.dailyFresh}</span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#1E2B22] border border-stone-200/70 dark:border-stone-700/60 shadow-sm text-xs font-bold text-[#3E5C46] dark:text-[#88B795]">
                <CheckCircle2 className="w-4 h-4 text-[#3E5C46] dark:text-emerald-400" />
                <span>{dict.menu.noAdditives}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky Dynamic Filter Navigation */}
        <div className="sticky top-20 z-40 w-full bg-[#F9F8F3]/95 dark:bg-[#121A15]/95 backdrop-blur-md py-3 px-4 sm:px-6 lg:px-8 border-y border-stone-200/80 dark:border-stone-800/80 shadow-[0_4px_16px_rgba(37,51,38,0.03)] transition-colors duration-200">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
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
                    className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-[#3E5C46] text-white shadow-sm"
                        : "bg-stone-100 dark:bg-[#1E2B22] text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-white/10 hover:text-stone-900 dark:hover:text-white border border-stone-200/60 dark:border-stone-700/60"
                    }`}
                  >
                    {categoryLabel} ({count})
                  </button>
                );
              })}
            </div>

            {/* Quick Search */}
            <div className="relative shrink-0 sm:w-56">
              <input
                type="text"
                placeholder={dict.menu.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-[#1E2B22] text-stone-800 dark:text-stone-100 rounded-full text-xs border border-stone-200 dark:border-stone-700/60 focus:outline-none focus:ring-2 focus:ring-[#3E5C46] shadow-inner"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Main Menu Grid Layout */}
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-10 flex flex-col gap-10">
          {/* Spotlight Story Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 shadow-sm transition-colors duration-200">
            <div className="lg:col-span-5 rounded-2xl overflow-hidden aspect-[4/3] relative">
              <img
                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80"
                alt="Cà phê muối Đắk Nông"
                className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
                  isSignatureOutOfStock ? "grayscale-[40%] opacity-80" : ""
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-4 justify-between">
                <span className="text-white font-serif text-lg font-bold">
                  {dict.menu.signatureTitle}
                </span>
                {isSignatureOutOfStock && (
                  <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-xs font-bold shadow-md">
                    {dict.common.soldOut}
                  </span>
                )}
              </div>
            </div>
            <div className="lg:col-span-7 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-[#614633] dark:text-[#D1A684] font-bold">
                  {dict.menu.signatureTag}
                </span>
                {isSignatureOutOfStock && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold">
                    {dict.common.soldOutToday}
                  </span>
                )}
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E5C46] dark:text-[#F5F4EE]">
                {dict.menu.signatureHeading}
              </h2>
              <p className="text-base text-stone-700 dark:text-stone-300 leading-relaxed">
                {dict.menu.signatureDesc}
              </p>
              <div className="pt-2 flex items-center gap-3">
                <a
                  href="tel:0382851688"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3E5C46] text-white text-xs sm:text-sm font-semibold hover:bg-[#2D4233] transition-colors shadow-sm"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>
                    {isEn ? "Call Hotline to Order: 038 285 1688" : "Gọi Hotline Gọi Món: 038 285 1688"}
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Menu Items List */}
          <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 shadow-sm transition-colors duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-stone-200 dark:border-stone-700/60 gap-2">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3E5C46] dark:text-[#F5F4EE]">
                {dict.menu.menuListHeading} ({filteredItems.length} {isEn ? "items" : "món"})
              </h3>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                {dict.menu.menuListSubheading}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
              {filteredItems.map((item) => {
                const isOutOfStock = item.inStock === false;
                return (
                  <div
                    key={item.id}
                    className={`flex items-start justify-between py-2.5 border-b border-dotted border-stone-200 dark:border-stone-700/50 group px-2 rounded-xl transition-all ${
                      isOutOfStock
                        ? "opacity-60 bg-stone-100/60 dark:bg-stone-900/40 grayscale-[30%]"
                        : "hover:bg-stone-50 dark:hover:bg-white/5"
                    }`}
                  >
                    <div className="flex flex-col min-w-0 pr-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm font-bold transition-colors ${
                            isOutOfStock
                              ? "text-stone-500 line-through"
                              : "text-[#1B281D] dark:text-[#F5F4EE] group-hover:text-[#3E5C46] dark:group-hover:text-[#88B795]"
                          }`}
                        >
                          {item.name}
                        </span>
                        {isOutOfStock ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[10px] font-bold">
                            {dict.common.soldOut}
                          </span>
                        ) : (
                          item.tag && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#3E5C46] dark:text-emerald-300 text-[10px] font-bold">
                              {item.tag}
                            </span>
                          )
                        )}
                      </div>
                      {item.description && (
                        <span className="text-xs text-stone-600 dark:text-stone-400 line-clamp-1 mt-0.5">
                          {item.description}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 pt-0.5">
                      <span className="font-serif text-sm font-bold text-[#614633] dark:text-[#D1A684]">
                        {item.price.toLocaleString("vi-VN")}đ
                      </span>
                      {isOutOfStock ? (
                        <button
                          type="button"
                          disabled
                          title={dict.common.soldOut}
                          className="w-7 h-7 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 flex items-center justify-center cursor-not-allowed"
                        >
                          <span className="text-xs font-bold">✕</span>
                        </button>
                      ) : (
                        <a
                          href="tel:0382851688"
                          title={isEn ? "Call to order" : "Gọi đặt món"}
                          className="w-7 h-7 rounded-full bg-stone-100 dark:bg-[#16231A] text-[#3E5C46] dark:text-[#88B795] flex items-center justify-center hover:bg-[#3E5C46] hover:text-white dark:hover:bg-[#88B795] dark:hover:text-[#121A15] transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Commitment & Hotline Banner */}
          <section className="w-full rounded-2xl bg-stone-100/80 dark:bg-[#16231A] p-8 sm:p-10 border border-stone-200/70 dark:border-stone-800/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-200">
            <div className="flex flex-col gap-2 max-w-xl text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-[#3E5C46] dark:text-[#F5F4EE] font-bold font-serif text-xl">
                <span>🌿</span>
                <span>
                  {isEn ? "Commitment from Cam Cu Kitchen & Bar" : "Cam Kết Từ Bếp & Quầy Bar Cẩm Cù"}
                </span>
              </div>
              <p className="text-base text-stone-700 dark:text-stone-300 leading-relaxed">
                {isEn
                  ? "Fresh daily local produce • Customizable sweetness and ice levels for your perfect beverage experience."
                  : "Nguyên liệu tươi sạch mỗi ngày • Hỗ trợ điều chỉnh độ ngọt và đá theo khẩu vị riêng của quý khách để có trải nghiệm vừa ý nhất."}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs font-semibold text-stone-800 dark:text-stone-300">
                <span className="flex items-center gap-1 text-[#3E5C46] dark:text-[#88B795]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isEn ? "Custom sweetness to taste" : "Giảm ngọt theo khẩu vị"}
                </span>
                <span className="flex items-center gap-1 text-[#3E5C46] dark:text-[#88B795]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isEn ? "Table service right beside stream" : "Phục vụ tại bàn sát dòng suối"}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <a
                href="tel:0382851688"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#3E5C46] text-white text-xs sm:text-sm font-semibold hover:bg-[#2D4233] shadow-md transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>
                  {isEn ? "Call Hotline: 038 285 1688" : "Gọi Hotline: 038 285 1688"}
                </span>
              </a>
              <a
                href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white dark:bg-[#1E2B22] text-[#3E5C46] dark:text-[#88B795] text-xs sm:text-sm font-semibold border border-stone-200 dark:border-stone-700/60 hover:bg-stone-50 dark:hover:bg-white/10 transition-colors"
              >
                <Navigation className="w-4 h-4" />
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
