"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import { MENU_ITEMS, MenuItem } from "@/data/menu";
import { useLanguage } from "@/context/LanguageContext";
import EditorialBotanicalMenu from "@/components/EditorialBotanicalMenu";
import { PhoneCall, Navigation } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { getSharedData, KEYS } from "@/lib/syncStore";
import { CAMCU_MENU_OVERRIDES_KEY, getStoredData } from "@/utils/storage";
import PageDarkHero from "@/components/layout/PageDarkHero";

export default function MenuPage() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);

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

    return () => {
      window.removeEventListener("camcu_sync_update", handleSync);
    };
  }, []);

  const signatureItem = menuItems.find((i) => i.id === "c5") || menuItems[0];

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
            3. THỰC ĐƠN TẠP CHÍ THỰC VẬT HỌC 67 MÓN (EDITORIAL BOTANICAL MONOGRAPH)
           ========================================================================= */}
        <EditorialBotanicalMenu initialItems={menuItems} />

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
