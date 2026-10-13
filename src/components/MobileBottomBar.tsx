"use client";

import { PhoneCall, Navigation, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { trackEvent } from "@/lib/analytics";

export default function MobileBottomBar() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  return (
    <aside
      aria-label="Thanh liên hệ nhanh"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#16231A]/95 dark:bg-[#101813]/95 backdrop-blur-lg border-t border-[#3E5C46]/40 px-3 py-2 shadow-[0_-8px_24px_rgba(0,0,0,0.3)] transition-all"
    >
      <div className="max-w-md mx-auto grid grid-cols-3 gap-2">
        {/* Nút 1: Gọi Hotline */}
        <a
          href="tel:0382851688"
          onClick={() => trackEvent("click_call")}
          className="btn-press-sm flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#3E5C46] hover:bg-[#2D4233] text-white shadow-md active:scale-95 transition-all text-center min-h-[44px]"
        >
          <PhoneCall className="w-4 h-4 text-emerald-200 mb-0.5 animate-bounce" />
          <span className="text-[11px] font-bold tracking-tight">
            {isEn ? "Call Now" : "Gọi Ngay"}
          </span>
        </a>

        {/* Nút 2: Chỉ đường Google Maps */}
        <a
          href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("click_directions")}
          className="btn-press-sm flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white/10 hover:bg-white/20 text-[#F5F4EE] border border-white/15 active:scale-95 transition-all text-center min-h-[44px]"
        >
          <Navigation className="w-4 h-4 text-teal-300 mb-0.5" />
          <span className="text-[11px] font-semibold tracking-tight">
            {isEn ? "Directions" : "Chỉ Đường"}
          </span>
        </a>

        {/* Nút 3: Nhắn Zalo */}
        <a
          href="https://zalo.me/0382851688"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("click_zalo")}
          className="btn-press-sm flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#0068FF]/20 hover:bg-[#0068FF]/30 text-blue-200 border border-[#0068FF]/40 active:scale-95 transition-all text-center min-h-[44px]"
        >
          <MessageCircle className="w-4 h-4 text-blue-300 mb-0.5" />
          <span className="text-[11px] font-semibold tracking-tight">
            Zalo
          </span>
        </a>
      </div>
    </aside>
  );
}
