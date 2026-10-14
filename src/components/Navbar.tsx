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
  ArrowRight
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import StarHoya from "@/components/ui/StarHoya";
import { useStoreStatus } from "@/lib/openingHours";
import { useLanguage } from "@/context/LanguageContext";

const NAV_ITEMS = [
  { href: "/", num: "01", labelVi: "Trang Chủ", labelEn: "Home" },
  { href: "/about", num: "02", labelVi: "Câu Chuyện", labelEn: "Our Story" },
  { href: "/space", num: "03", labelVi: "Không Gian Suối", labelEn: "Stream Sanctuary" },
  { href: "/menu", num: "04", labelVi: "Thực Đơn", labelEn: "Menu" },
  { href: "/contact", num: "05", labelVi: "Chỉ Đường & Liên Hệ", labelEn: "Directions & Contact" },
];

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

function ScrambleNavLink({
  href,
  num,
  label,
  isActive,
}: {
  href: string;
  num: string;
  label: string;
  isActive: boolean;
}) {
  const [displayText, setDisplayText] = useState(label);
  const isScramblingRef = useRef(false);

  useEffect(() => {
    setDisplayText(label);
  }, [label]);

  const handleMouseEnter = () => {
    if (isScramblingRef.current) return;
    isScramblingRef.current = true;

    const original = label;
    let iterations = 0;
    const maxIterations = 8;
    const interval = setInterval(() => {
      setDisplayText(
        original
          .split("")
          .map((char, index) => {
            if (char === " " || index < Math.floor(iterations / 2)) {
              return original[index];
            }
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join("")
      );

      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(interval);
        setDisplayText(original);
        isScramblingRef.current = false;
      }
    }, 35);
  };

  return (
    <Link
      href={href}
      onMouseEnter={handleMouseEnter}
      className={`group relative py-2 flex items-center gap-1.5 font-mono text-[13px] tracking-wider uppercase transition-colors ${
        isActive ? "text-[var(--ember)] font-bold" : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
      }`}
    >
      <span className="text-[10px] text-[var(--ember)] opacity-70 group-hover:opacity-100">
        [{num}]
      </span>
      <span className="font-sans font-semibold tracking-wide">{displayText}</span>

      {/* Gạch ember vẽ nét khi active/hover */}
      <span
        className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--ember)] transition-transform duration-300 origin-left ${
          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { locale, setLocale, dict } = useLanguage();
  const isEn = locale === "en";
  const storeStatus = useStoreStatus();

  // Scroll behavior: header shrink & auto-hide on scroll down, show on scroll up
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
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

  // Micro-bar status string (Section 7.1)
  const statusString = storeStatus.isOpen
    ? isEn
      ? `OPEN NOW · CLOSES AT ${storeStatus.closingTime} TODAY · 23°C`
      : `ĐANG MỞ CỬA · ĐÓNG LÚC ${storeStatus.closingTime} HÔM NAY · 23°C`
    : isEn
    ? `CLOSED · OPENS AT 07:00 TOMORROW · 23°C`
    : `ĐANG ĐÓNG CỬA · MỞ LÚC 07:00 NGÀY MAI · 23°C`;

  // Không hiển thị Navbar khách hàng trên trang Admin
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      {/* Main Header: Ẩn khi cuộn xuống, hiện khi cuộn lên */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* 1. Thanh trên cùng (micro-bar mono 12px - Section 7.1) */}
        <div className="w-full bg-[var(--bg-2)] text-[var(--ink)] border-b border-[var(--line)] py-1.5 px-4 transition-colors">
          <div className="max-w-[1360px] mx-auto flex items-center justify-between font-mono text-[11px] sm:text-[12px] tracking-wider uppercase">
            <div className="flex items-center gap-2 truncate">
              <span
                className={`w-2 h-2 rounded-full shrink-0 animate-pulse ${
                  storeStatus.isOpen ? "bg-[var(--ember)]" : "bg-[#F28B82]"
                }`}
              />
              <span className="font-bold text-[var(--ink)]">{statusString}</span>
            </div>

            <div className="hidden sm:flex items-center gap-4 text-[var(--ink-muted)]">
              <span>11.99° N · 107.69° E</span>
              <span>·</span>
              <span className="text-[var(--ember)] font-bold">800M+</span>
            </div>
          </div>
        </div>

        {/* 2. Header Content Bar */}
        <div
          className={`w-full transition-all duration-300 ${
            isScrolled
              ? "bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--line)] shadow-lg"
              : "bg-transparent border-b border-[var(--line)]/40"
          }`}
        >
          <div
            className={`w-full max-w-[1360px] mx-auto px-5 sm:px-10 flex items-center justify-between gap-4 transition-all duration-300 ${
              isScrolled ? "h-16" : "h-20"
            }`}
          >
            {/* Logo hoa Hoya + CẨM CÙ HOUSE */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="w-9 h-9 rounded-sm border border-[var(--line)] bg-[var(--card)] flex items-center justify-center text-[var(--ember)] group-hover:border-[var(--ember)] transition-colors">
                <StarHoya size={18} strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-[20px] sm:text-[22px] tracking-tight uppercase text-[var(--ink)] leading-none">
                  CẨM CÙ HOUSE
                </span>
                <span className="font-mono text-[9px] text-[var(--ember)] tracking-widest uppercase mt-0.5">
                  GIA NGHĨA · 800M+
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links with Text Scramble */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <ScrambleNavLink
                  key={item.href}
                  href={item.href}
                  num={item.num}
                  label={isEn ? item.labelEn : item.labelVi}
                  isActive={pathname === item.href}
                />
              ))}
            </nav>

            {/* Actions: Lang switch, Theme toggle, GỌI NGAY Button */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {/* VN / EN Switcher */}
              <button
                type="button"
                onClick={() => setLocale(isEn ? "vi" : "en")}
                className="font-mono text-[12px] font-bold px-2.5 py-1 rounded-sm border border-[var(--line)] hover:border-[var(--ember)] text-[var(--ink)] transition-colors"
                title={isEn ? "Chuyển sang Tiếng Việt" : "Switch to English"}
              >
                {isEn ? "EN" : "VN"}
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Nút GỌI NGAY góc vát 14px (clip-chamfer-14) */}
              <a
                href="tel:0382851688"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--ember)] text-[var(--btn-primary-text)] font-sans font-bold text-[14px] uppercase tracking-wider clip-chamfer-14 hover:opacity-90 active:scale-95 transition-all shadow-md"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{isEn ? "CALL NOW" : "GỌI NGAY"}</span>
              </a>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-[var(--ink)] hover:text-[var(--ember)] border border-[var(--line)] rounded-sm"
                aria-label="Mở menu điều hướng"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Fullscreen Mobile Menu (Section 7.3) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-[var(--bg)] text-[var(--ink)] flex flex-col justify-between p-6 sm:p-10 overflow-y-auto"
          >
            {/* Header trong menu */}
            <div className="flex items-center justify-between pb-6 border-b border-[var(--line)]">
              <div className="flex items-center gap-3">
                <StarHoya size={22} className="text-[var(--ember)]" />
                <span className="font-display font-black text-[22px] tracking-tight uppercase text-[var(--ink)]">
                  CẨM CÙ HOUSE
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 border border-[var(--line)] hover:border-[var(--ember)] rounded-sm text-[var(--ink)]"
                aria-label="Đóng menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 5 liên kết Display 56px trượt lên lần lượt */}
            <nav className="flex flex-col gap-4 py-8">
              {NAV_ITEMS.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="group flex items-baseline gap-3 py-2"
                  >
                    <span className="font-mono text-sm text-[var(--ember)]">[{item.num}]</span>
                    <span
                      className={`font-display font-extrabold text-[clamp(32px,8vw,56px)] uppercase leading-none tracking-tight transition-colors ${
                        pathname === item.href
                          ? "text-[var(--ember)]"
                          : "text-[var(--ink)] group-hover:text-[var(--ember)]"
                      }`}
                    >
                      {isEn ? item.labelEn : item.labelVi}
                    </span>
                    <ArrowRight className="w-6 h-6 opacity-0 group-hover:opacity-100 text-[var(--ember)] -translate-x-2 group-hover:translate-x-0 transition-all ml-auto" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Hàng cuối: Gọi · Zalo · Chỉ đường */}
            <div className="pt-6 border-t border-[var(--line)] flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-2">
                <a
                  href="tel:0382851688"
                  className="py-3 px-2 bg-[var(--ember)] text-[var(--btn-primary-text)] font-bold text-center font-mono text-[12px] uppercase rounded-sm flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>GỌI</span>
                </a>
                <a
                  href="https://zalo.me/0382851688"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-2 bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] font-bold text-center font-mono text-[12px] uppercase rounded-sm flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[var(--ember)]" />
                  <span>ZALO</span>
                </a>
                <a
                  href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-2 bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] font-bold text-center font-mono text-[12px] uppercase rounded-sm flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5 text-[var(--mist)]" />
                  <span>CHỈ ĐƯỜNG</span>
                </a>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--ink-muted)]">
                <span>11.99° N · 107.69° E</span>
                <span>800M+ CAO NGUYÊN</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
