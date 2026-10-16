"use client";

import React, { useState, useEffect } from "react";
import { Cookie, Check, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function CookieConsent() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Không hiện ở /admin
    if (window.location.pathname.startsWith("/admin")) {
      return;
    }

    const consent = localStorage.getItem("camcu_cookie_consent");
    if (!consent) {
      // Hiện sau 1 giây để không chắn trang khi vừa tải
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleAccept = () => {
    localStorage.setItem("camcu_cookie_consent", "granted");
    document.cookie = "camcu_cookie_consent=granted; path=/; max-age=31536000; SameSite=Lax";
    window.dispatchEvent(new CustomEvent("camcu_cookie_consent_updated"));
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("camcu_cookie_consent", "denied");
    document.cookie = "camcu_cookie_consent=denied; path=/; max-age=31536000; SameSite=Lax";
    window.dispatchEvent(new CustomEvent("camcu_cookie_consent_updated"));
    setVisible(false);
  };

  if (!visible || (pathname && pathname.startsWith("/admin"))) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Thông báo sự chấp thuận cookie"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[9999] p-4 sm:p-5 rounded-2xl bg-[#0F1713]/95 border border-[#FAF6EE]/15 text-[#F4EEE2] shadow-2xl backdrop-blur-xl flex flex-col gap-3.5 animate-fadeIn"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#1F3A2A] border border-[#9DC183]/30 text-[#9DC183] flex items-center justify-center shrink-0 mt-0.5">
          <Cookie className="w-4 h-4" />
        </div>
        <div className="flex-1 text-[13px] leading-relaxed text-[#F4EEE2]/90">
          <span className="font-semibold text-white block mb-0.5">Quyền Riêng Tư &amp; Cookie</span>
          Chúng tôi sử dụng cookie để phân tích lưu lượng ẩn danh qua Google Analytics và cải thiện trải nghiệm của bạn.
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-1">
        <button
          type="button"
          onClick={handleDecline}
          className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold text-[#F4EEE2]/75 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          Từ chối
        </button>
        <button
          type="button"
          onClick={handleAccept}
          className="min-h-[44px] inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[var(--ember)] text-white text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Đồng ý</span>
        </button>
      </div>
    </div>
  );
}
