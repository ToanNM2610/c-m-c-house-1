"use client";

import { PhoneCall, Navigation, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { trackEvent } from "@/lib/analytics";

/**
 * Thanh liên hệ cố định (mobile) - Section 7.4:
 * Gọi · Zalo · Chỉ đường, cao 56px, an toàn vùng tai thỏ
 */
export default function MobileBottomBar() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  return (
    <aside
      aria-label="Thanh liên hệ nhanh"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#1C1612]/95 backdrop-blur-xl border-t border-[rgba(244,236,221,0.14)] px-3 py-2 shadow-[0_-6px_20px_rgba(0,0,0,0.3)] pb-[calc(env(safe-area-inset-bottom,0px)+8px)]"
    >
      <div className="max-w-md mx-auto grid grid-cols-3 gap-2 h-[44px]">
        {/* Nút 1: Gọi Hotline - Nền bazan */}
        <a
          href="tel:0382851688"
          onClick={() => trackEvent("click_call")}
          className="btn-press-sm flex items-center justify-center gap-1.5 rounded-full bg-[var(--basalt)] text-white shadow-xs text-center font-semibold text-[12px] min-h-[42px]"
          aria-label="Gọi ngay hotline"
        >
          <PhoneCall className="w-3.5 h-3.5 shrink-0" />
          <span>{isEn ? "Call" : "Gọi ngay"}</span>
        </a>

        {/* Nút 2: Nhắn Zalo */}
        <a
          href="https://zalo.me/0382851688"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("click_zalo")}
          className="btn-press-sm flex items-center justify-center gap-1.5 rounded-full bg-[#2A201A] hover:bg-[#342921] text-[#F4ECDD] border border-[rgba(244,236,221,0.14)] text-center font-medium text-[12px] min-h-[42px]"
          aria-label="Nhắn qua Zalo"
        >
          <MessageCircle className="w-3.5 h-3.5 text-blue-300 shrink-0" />
          <span>Zalo</span>
        </a>

        {/* Nút 3: Chỉ đường Google Maps */}
        <a
          href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("click_directions")}
          className="btn-press-sm flex items-center justify-center gap-1.5 rounded-full bg-[#2A201A] hover:bg-[#342921] text-[#F4ECDD] border border-[rgba(244,236,221,0.14)] text-center font-medium text-[12px] min-h-[42px]"
          aria-label="Chỉ đường Google Maps"
        >
          <Navigation className="w-3.5 h-3.5 text-[var(--stream)] shrink-0" />
          <span>{isEn ? "Directions" : "Chỉ đường"}</span>
        </a>
      </div>
    </aside>
  );
}
