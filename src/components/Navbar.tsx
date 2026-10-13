"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PhoneCall, 
  Menu as MenuIcon, 
  X, 
  Navigation,
  MessageCircle,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import StarHoya from "@/components/ui/StarHoya";
import ContourLines from "@/components/ui/ContourLines";
import { useStoreStatus } from "@/lib/openingHours";
import { useLanguage } from "@/context/LanguageContext";
import { getStoreStatusI18n } from "@/lib/translations";

const NAV_ITEMS = [
  { href: "/", labelVi: "Trang Chủ", labelEn: "Home" },
  { href: "/about", labelVi: "Câu Chuyện", labelEn: "Our Story" },
  { href: "/space", labelVi: "Không Gian Suối", labelEn: "Stream Sanctuary" },
  { href: "/menu", labelVi: "Thực Đơn", labelEn: "Menu" },
  { href: "/contact", labelVi: "Chỉ Đường & Liên Hệ", labelEn: "Directions & Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { locale, setLocale, dict } = useLanguage();
  const isEn = locale === "en";
  const storeStatus = useStoreStatus();
  const i18nStatus = getStoreStatusI18n(storeStatus, locale);

  // Scroll behavior: scroll progress bar 2px (basalt), header shrink & auto-hide on scroll down, show on scroll up
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const progress = maxScroll > 0 ? Math.min(Math.max(currentY / maxScroll, 0), 1) : 0;
          setScrollProgress(progress);

          setIsScrolled(currentY > 30);

          if (currentY > 120) {
            if (currentY > lastScrollY.current + 8) {
              // Scrolling down -> hide
              setIsVisible(false);
            } else if (currentY < lastScrollY.current - 8) {
              // Scrolling up -> show
              setIsVisible(true);
            }
          } else {
            setIsVisible(true);
          }

          lastScrollY.current = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer upon route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const getDotColor = () => {
    if (storeStatus.badgeType === "open") return "bg-[#5E7A3E]"; // Moss green
    if (storeStatus.badgeType === "closing_soon") return "bg-[#E2AE3B]"; // Flower yellow
    return "bg-[#A8452A]"; // Basalt red
  };

  // Micro-bar status string (Section 7.1)
  const statusString = storeStatus.isOpen
    ? isEn
      ? `Open now · Closes at ${storeStatus.closingTime} today · 23°C`
      : `Đang mở cửa · Đóng lúc ${storeStatus.closingTime} hôm nay · 23°C`
    : isEn
    ? `Closed · Opens at 07:00 tomorrow · 23°C`
    : `Đang đóng cửa · Mở lúc 07:00 ngày mai · 23°C`;

  // Không hiển thị Navbar khách hàng trên trang Admin
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      {/* 1. Thanh tiến độ cuộn 2px màu bazan (Section 9) */}
      <div
        className="fixed top-0 left-0 right-0 h-[2px] z-[60] bg-[var(--basalt)] origin-left pointer-events-none transition-transform duration-75"
        style={{ transform: `scaleX(${scrollProgress})` }}
        aria-hidden="true"
      />

      {/* 2. Main Header: Trong suốt ở hero, thành nền --paper mờ kính khi cuộn, ẩn khi cuộn xuống, hiện khi cuộn lên */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* 1. Thanh trên cùng (micro-bar, 13px mono - Section 7.1) */}
        <div className="w-full bg-[var(--paper-2)]/90 backdrop-blur-sm text-[var(--ink)] border-b border-[var(--line)] py-1.5 px-4 transition-colors">
          <div className="max-w-[1280px] mx-auto flex items-center justify-center gap-2 font-mono text-[12px] sm:text-[13px] tracking-wider uppercase text-center truncate">
            <span className={`w-2 h-2 rounded-full shrink-0 animate-pulse ${getDotColor()}`} />
            <span className="font-semibold text-[var(--ink)]">{statusString}</span>
            <span className="hidden sm:inline text-[var(--line)]">·</span>
            <span className="hidden sm:inline text-[var(--ink-muted)]">11.99° N · 107.69° E</span>
          </div>
        </div>

        {/* 2. Header Content Bar */}
        <div
          className={`w-full transition-all duration-300 ${
            isScrolled
              ? "bg-[var(--paper)]/95 backdrop-blur-md shadow-xs border-b border-[var(--line)]"
              : "bg-[var(--paper)]/80 backdrop-blur-sm border-b border-[var(--line)]/50"
          }`}
        >
          <div
            className={`w-full max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between gap-3 sm:gap-6 transition-all duration-300 ${
              isScrolled ? "h-16" : "h-16 sm:h-20"
            }`}
          >
            {/* Brand Logo: Logo hoa Hoya + chữ "Cẩm Cù House" (Fraunces 26px - Section 7.2) */}
            <Link href="/" className="flex items-center gap-3 shrink-0 min-w-0 group btn-press-sm">
              <div className="w-10 h-10 rounded-full bg-[var(--paper-2)] border border-[var(--line)] flex items-center justify-center text-[var(--basalt)] group-hover:rotate-45 transition-transform duration-500 shadow-xs shrink-0">
                <StarHoya size={22} strokeWidth={1.8} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-serif text-[22px] sm:text-[26px] font-bold text-[var(--ink)] tracking-tight group-hover:text-[var(--basalt)] transition-colors truncate leading-tight">
                  Cẩm Cù House
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - 5 liên kết chữ, gạch chân vẽ nét khi hover/đang chọn (Section 7.2) */}
            <nav className="hidden lg:flex items-center gap-7 shrink-0">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                const label = isEn ? item.labelEn : item.labelVi;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative py-1 text-[15px] font-medium transition-colors group ${
                      isActive
                        ? "text-[var(--basalt)] font-semibold"
                        : "text-[var(--ink)] hover:text-[var(--basalt)]"
                    }`}
                  >
                    <span>{label}</span>
                    {/* Gạch chân vẽ nét khi hover/đang chọn */}
                    <span
                      className={`absolute -bottom-1 left-0 w-full h-[2px] bg-[var(--basalt)] rounded-full transition-transform duration-300 origin-left ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Phải: VN/EN, đổi sáng/tối, nút "Gọi ngay" nền bazan luôn hiện (Section 7.2) */}
            <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
              <ThemeToggle />

              {/* Bilingual Switcher: VN | EN */}
              <div className="inline-flex items-center bg-[var(--card)] rounded-full p-0.5 text-xs font-mono font-bold text-[var(--ink-muted)] border border-[var(--line)] shadow-xs">
                <button
                  type="button"
                  onClick={() => setLocale("vi")}
                  className={`px-2.5 sm:px-3 py-1 rounded-full transition-all duration-200 text-[11px] sm:text-xs font-semibold ${
                    locale === "vi"
                      ? "bg-[var(--paper-2)] text-[var(--ink)] font-bold shadow-xs"
                      : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                  }`}
                  aria-label="Tiếng Việt"
                >
                  VN
                </button>
                <button
                  type="button"
                  onClick={() => setLocale("en")}
                  className={`px-2.5 sm:px-3 py-1 rounded-full transition-all duration-200 text-[11px] sm:text-xs font-semibold ${
                    locale === "en"
                      ? "bg-[var(--paper-2)] text-[var(--ink)] font-bold shadow-xs"
                      : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                  }`}
                  aria-label="English"
                >
                  EN
                </button>
              </div>

              {/* Nút "Gọi ngay" nền bazan luôn hiện */}
              <a
                href="tel:0382851688"
                className="btn-primary hidden sm:inline-flex py-2 px-5 min-h-[42px] text-[14px] font-semibold"
                aria-label="Gọi ngay cho Cẩm Cù House"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{isEn ? "Call Now" : "Gọi ngay"}</span>
              </a>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="btn-press lg:hidden w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full bg-[var(--card)] text-[var(--ink)] hover:bg-[var(--paper-2)] transition-colors border border-[var(--line)] shrink-0"
                aria-label="Mở menu điều hướng"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-[var(--basalt)]" /> : <MenuIcon className="w-5 h-5 text-[var(--ink)]" />}
              </button>
            </div>
          </div>
        </div>

        {/* 3. Menu mobile toàn màn hình nền --charcoal, 5 liên kết Fraunces 44px, đường đồng mức mờ (Section 7.3) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden fixed inset-0 z-[100] bg-[#1C1612] text-[#F4ECDD] px-6 py-6 sm:py-8 flex flex-col justify-between overflow-y-auto"
            >
              {/* Nền đường đồng mức mờ */}
              <ContourLines opacity={0.12} className="text-[#F4ECDD]" />

              {/* Header inside mobile menu */}
              <div className="flex items-center justify-between border-b border-[rgba(244,236,221,0.14)] pb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2A201A] border border-[rgba(244,236,221,0.14)] flex items-center justify-center text-[var(--flower)]">
                    <StarHoya size={22} strokeWidth={1.8} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-[22px] font-bold text-[#F4ECDD] tracking-tight">
                      Cẩm Cù House
                    </span>
                    <span className="font-mono text-[11px] text-[rgba(244,236,221,0.7)] uppercase tracking-wider">
                      11.99° N · 107.69° E
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-press w-10 h-10 rounded-full bg-[#2A201A] text-[#F4ECDD] flex items-center justify-center border border-[rgba(244,236,221,0.14)] transition-all"
                  aria-label="Đóng menu"
                >
                  <X className="w-5 h-5 text-[var(--basalt)]" />
                </button>
              </div>

              {/* 5 liên kết Fraunces 44px xuất hiện lần lượt */}
              <nav className="flex flex-col gap-4 py-8 my-auto relative z-10">
                {NAV_ITEMS.map((item, idx) => {
                  const isActive = pathname === item.href;
                  const label = isEn ? item.labelEn : item.labelVi;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 * idx, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-baseline justify-between py-2 font-serif text-[34px] sm:text-[44px] font-bold leading-tight transition-all ${
                          isActive
                            ? "text-[var(--basalt)] translate-x-2"
                            : "text-[#F4ECDD] hover:text-[var(--flower)]"
                        }`}
                      >
                        <span>{label}</span>
                        <span className="font-mono text-[13px] text-[rgba(244,236,221,0.5)] font-normal tracking-widest">
                          0{idx + 1}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Hàng cuối: Gọi · Zalo · Chỉ đường (Section 7.3) */}
              <div className="flex flex-col gap-4 pt-4 border-t border-[rgba(244,236,221,0.14)] relative z-10">
                <div className="flex items-center justify-between font-mono text-[12px] text-[rgba(244,236,221,0.7)]">
                  <span>800M+ ĐẮK NÔNG</span>
                  <span className="text-[var(--flower)]">{storeStatus.isOpen ? "● ĐANG MỞ CỬA" : "● ĐÃ ĐÓNG CỬA"}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <a
                    href="tel:0382851688"
                    className="btn-primary flex items-center justify-center gap-1.5 py-3 rounded-full text-xs font-semibold"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Gọi điện</span>
                  </a>
                  <a
                    href="https://zalo.me/0382851688"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-3 rounded-full text-xs font-semibold bg-[#2A201A] text-[#F4ECDD] border border-[rgba(244,236,221,0.14)] hover:bg-[#342921]"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-blue-300" />
                    <span>Zalo</span>
                  </a>
                  <a
                    href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-3 rounded-full text-xs font-semibold bg-[#2A201A] text-[#F4ECDD] border border-[rgba(244,236,221,0.14)] hover:bg-[#342921]"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[var(--stream)]" />
                    <span>Chỉ đường</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
