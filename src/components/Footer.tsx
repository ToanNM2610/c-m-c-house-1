"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  MapPin, 
  Clock, 
  PhoneCall, 
  Mail, 
  Share2, 
  Navigation,
  ArrowUp
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import RotatingSeal from "@/components/ui/RotatingSeal";
import ContourLines from "@/components/ui/ContourLines";

/**
 * Chân trang (Section 7.5):
 * Nền --charcoal, đường đồng mức mờ; trên cùng tem tròn xoay + câu khẩu hiệu (Fraunces 40px);
 * 4 cột; chữ khổng lồ "CẨM CÙ HOUSE" cắt nửa dưới trồi lên; bản quyền · Lên đầu trang · dòng thiết kế.
 */
export default function Footer() {
  const { locale, dict } = useLanguage();
  const isEn = locale === "en";

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#1C1612] text-[#F4ECDD] pt-16 md:pt-24 pb-8 border-t border-[rgba(244,236,221,0.12)] relative overflow-hidden transition-colors">
      {/* Đường đồng mức mờ nền chân trang (Section 7.5) */}
      <ContourLines opacity={0.09} className="text-[#F4ECDD]" />

      <div className="container-unified relative z-10">
        {/* Trên cùng: Tem tròn xoay + Khẩu hiệu Fraunces 40px (Section 7.5) */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-12 mb-12 border-b border-[rgba(244,236,221,0.12)]">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="font-mono text-[12px] uppercase tracking-widest text-[var(--flower)]">
              {isEn ? "Dak Nong Highlands · Elevation 800m+" : "Cao nguyên Đắk Nông · Độ cao 800m+"}
            </span>
            <h2 className="font-serif text-[26px] sm:text-[34px] md:text-[40px] font-bold text-[#F4ECDD] leading-tight">
              Chốn Dừng Chân <em className="italic text-[var(--basalt)]">Mộc Mạc</em> Bên Bờ Suối Đá
            </h2>
          </div>
          <RotatingSeal size={108} className="text-[#F4ECDD] shrink-0 self-center md:self-auto" />
        </div>

        {/* 4 Cột: 1. Thương hiệu & tọa độ · 2. Điều hướng · 3. Giờ & Hotline · 4. Địa chỉ & Kết nối */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.1fr_1.3fr] gap-10 lg:gap-12 pb-14">
          {/* Cột 1: Thương hiệu + Tọa độ + Độ cao */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="font-serif text-[24px] font-bold text-[#F4ECDD] tracking-tight">
                Cẩm Cù House
              </span>
            </div>
            <p className="text-[15px] text-[#C7BBA8] leading-relaxed max-w-[38ch]">
              {isEn
                ? "An eco-friendly coffee & dining sanctuary nestled beside a cool natural stream in the Dak Nong highlands."
                : "Khu ẩm thực & cà phê sinh thái bên dòng suối mát lành miền cao nguyên Đắk Nông. Chốn dừng chân mộc mạc."}
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#2A201A] rounded-full text-[var(--stream)] font-mono text-[11px] tracking-wider uppercase w-fit border border-[rgba(244,236,221,0.12)]">
              <MapPin className="w-3.5 h-3.5 text-[var(--stream)]" />
              <span>11.99° N · 107.69° E · ĐỘ CAO 800M+</span>
            </div>
          </div>

          {/* Cột 2: Điều hướng */}
          <div className="flex flex-col gap-3.5">
            <span className="font-mono text-[12px] font-bold text-[var(--flower)] tracking-wider uppercase">
              {isEn ? "Navigation" : "Điều hướng"}
            </span>
            <nav className="flex flex-col gap-2.5 text-[15px] text-[#C7BBA8] font-medium">
              <Link href="/" className="hover:text-[var(--basalt)] hover:underline transition-colors w-fit">
                {dict.nav.home}
              </Link>
              <Link href="/about" className="hover:text-[var(--basalt)] hover:underline transition-colors w-fit">
                {dict.nav.about}
              </Link>
              <Link href="/space" className="hover:text-[var(--basalt)] hover:underline transition-colors w-fit">
                {dict.nav.space}
              </Link>
              <Link href="/menu" className="hover:text-[var(--basalt)] hover:underline transition-colors w-fit">
                {dict.nav.menu}
              </Link>
              <Link href="/contact" className="hover:text-[var(--basalt)] hover:underline transition-colors w-fit">
                {dict.nav.contact}
              </Link>
            </nav>
          </div>

          {/* Cột 3: Giờ mở cửa & Hotline */}
          <div className="flex flex-col gap-3.5">
            <span className="font-mono text-[12px] font-bold text-[var(--flower)] tracking-wider uppercase">
              {dict.contact.openingHoursTitle}
            </span>
            <div className="flex flex-col gap-2 text-[15px] text-[#C7BBA8]">
              <div className="flex items-center gap-2 text-[#F4ECDD] font-semibold text-[14px]">
                <Clock className="w-4 h-4 text-[var(--stream)]" />
                <span>{isEn ? "Service Hours" : "Thời gian phục vụ"}</span>
              </div>
              <p className="leading-snug">
                <strong className="text-[#F4ECDD] font-medium">{isEn ? "Mon – Thu:" : "Thứ 2 – 5:"}</strong><br />
                <span className="font-mono text-[14px]">07:00 – 18:00</span>
              </p>
              <p className="leading-snug">
                <strong className="text-[var(--flower)] font-medium">{isEn ? "Fri – Sun:" : "Thứ 6 – CN:"}</strong><br />
                <span className="font-mono text-[14px]">07:00 – 22:00</span>
              </p>
            </div>
          </div>

          {/* Cột 4: Địa chỉ, Hotline, Email & Kết nối */}
          <div className="flex flex-col gap-3.5">
            <span className="font-mono text-[12px] font-bold text-[var(--flower)] tracking-wider uppercase">
              {dict.contact.addressTitle}
            </span>
            <p className="text-[14px] text-[#C7BBA8] leading-relaxed">
              Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa, Đắk Nông
            </p>

            <div className="flex flex-col gap-1 text-[15px]">
              <a href="tel:0382851688" className="hover:text-[var(--basalt)] flex items-center gap-2 text-[#F4ECDD] font-semibold">
                <PhoneCall className="w-4 h-4 text-[var(--basalt)]" />
                <span className="font-mono text-[14px]">038 285 1688 (Zalo)</span>
              </a>
              <a href="tel:0774659000" className="hover:text-[var(--basalt)] flex items-center gap-2 text-[#F4ECDD] font-semibold">
                <PhoneCall className="w-4 h-4 text-[var(--basalt)]" />
                <span className="font-mono text-[14px]">077 465 9000</span>
              </a>
            </div>

            <a 
              href="mailto:thuynhu8788@gmail.com" 
              className="text-[14px] text-[#C7BBA8] hover:text-[var(--basalt)] flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-[var(--stream)]" />
              <span>thuynhu8788@gmail.com</span>
            </a>

            {/* 4 Nút kết nối tròn */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://youtube.com/@Cam_Cu_House"
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube"
                className="w-10 h-10 rounded-full bg-[#2A201A] border border-[rgba(244,236,221,0.14)] flex items-center justify-center text-red-400 hover:bg-[var(--basalt)] hover:text-white transition-all shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@camcuhousedaknong"
                target="_blank"
                rel="noopener noreferrer"
                title="TikTok"
                className="w-10 h-10 rounded-full bg-[#2A201A] border border-[rgba(244,236,221,0.14)] flex items-center justify-center text-[#F4ECDD] hover:bg-[var(--basalt)] hover:text-white transition-all shadow-xs"
              >
                <span className="font-bold text-[11px] font-mono">TT</span>
              </a>
              <a
                href="https://www.facebook.com/share/1DVLMySW8H/"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="w-10 h-10 rounded-full bg-[#2A201A] border border-[rgba(244,236,221,0.14)] flex items-center justify-center text-[#F4ECDD] hover:bg-[var(--basalt)] hover:text-white transition-all shadow-xs"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                target="_blank"
                rel="noopener noreferrer"
                title={dict.common.openGoogleMaps}
                className="w-10 h-10 rounded-full bg-[#2A201A] border border-[rgba(244,236,221,0.14)] flex items-center justify-center text-[var(--stream)] hover:bg-[var(--basalt)] hover:text-white transition-all shadow-xs"
              >
                <Navigation className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Hàng cuối: Bản quyền · Lên đầu trang · Dòng thiết kế (Section 7.5) */}
        <div className="pt-6 border-t border-[rgba(244,236,221,0.12)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#C7BBA8] font-mono">
          <p>© 2026 Cẩm Cù House. Tất cả quyền được bảo lưu.</p>

          {showScrollTop && (
            <button
              type="button"
              onClick={scrollToTop}
              className="btn-press inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2A201A] hover:bg-[#342921] text-[#F4ECDD] transition-all text-[12px] font-semibold border border-[rgba(244,236,221,0.14)] shadow-xs"
            >
              <ArrowUp className="w-3.5 h-3.5 text-[var(--flower)]" />
              <span>{isEn ? "Back to top" : "Lên đầu trang"}</span>
            </button>
          )}

          <p className="text-[var(--stream)]">
            Tâm tình bên dòng suối Đắk Nông
          </p>
        </div>
      </div>

      {/* Chữ khổng lồ "CẨM CÙ HOUSE" cắt nửa dưới, độ mờ .10, trồi lên khi cuộn (Section 7.5) */}
      <div className="w-full overflow-hidden select-none pointer-events-none mt-8 h-[9vw] min-h-[60px] max-h-[120px] relative flex justify-center items-start opacity-[0.10]">
        <p className="font-serif text-center font-bold text-[12vw] leading-none tracking-[0.05em] whitespace-nowrap text-[#F4ECDD] -translate-y-[20%]">
          CẨM CÙ HOUSE
        </p>
      </div>
    </footer>
  );
}
