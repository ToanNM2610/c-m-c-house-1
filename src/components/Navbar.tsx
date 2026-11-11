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
  ArrowRight,
  ShoppingBag
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import StarHoya from "@/components/ui/StarHoya";
import AtmosphereBar from "@/components/AtmosphereBar";
import { useLanguage } from "@/context/LanguageContext";
import { usePreOrder } from "@/context/PreOrderContext";

export const NAV_ITEMS = [
  { href: "/", num: "01", labelVi: "TRANG CHỦ", labelEn: "HOME" },
  { href: "/cau-chuyen", num: "02", labelVi: "CÂU CHUYỆN", labelEn: "OUR STORY", alias: "/about" },
  { href: "/khong-gian-suoi", num: "03", labelVi: "KHÔNG GIAN SUỐI", labelEn: "STREAM SANCTUARY", alias: "/space" },
  { href: "/thuc-don", num: "04", labelVi: "THỰC ĐƠN", labelEn: "MENU", alias: "/menu" },
  { href: "/chi-duong-lien-he", num: "05", labelVi: "CHỈ ĐƯỜNG & LIÊN HỆ", labelEn: "DIRECTIONS & CONTACT", alias: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { locale, setLocale } = useLanguage();
  const isEn = locale === "en";
  const { totalItems } = usePreOrder();

  // Scroll behavior: auto-hide on scroll down, show on scroll up
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
              setIsVisible(false);
            } else if (currentY < lastScrollY.current - 8) {
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

  // Không hiển thị Navbar khách hàng trên trang Admin
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* 1. Thanh trạng thái khí quyển thời gian thực Cẩm Cù House */}
        <AtmosphereBar />

        {/* 2. Top Navbar Quy Chuẩn: Nền tối sang trọng (#0E100F), chữ sáng (#F3F1EC), điểm nhấn (#E86C3A) */}
        <div className="w-full bg-[#0E100F] text-[#F3F1EC] border-b border-white/10 shadow-lg transition-all duration-300">
          <div
            className={`w-full max-w-[1440px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-4 transition-all duration-300 ${
              isScrolled ? "h-16" : "h-20"
            }`}
          >
            {/* Logo hoa Hoya + CẨM CÙ HOUSE */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="w-9 h-9 rounded-sm border border-[#E86C3A]/40 bg-[#161A18] flex items-center justify-center text-[#E86C3A] group-hover:border-[#E86C3A] transition-colors">
                <StarHoya size={18} strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-[19px] sm:text-[21px] tracking-tight uppercase leading-none text-[#F3F1EC] group-hover:text-[#E86C3A] transition-colors">
                  CẨM CÙ HOUSE
                </span>
                <span className="font-mono text-[9px] tracking-widest uppercase mt-0.5 text-[#E86C3A]">
                  GIA NGHĨA · 11.99° N, 107.69° E
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links: Đúng 5 mục, 1 dòng duy nhất, gạch chân 2px màu cam #E86C3A */}
            <nav className="hidden xl:flex items-center gap-6 2xl:gap-8">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || pathname === item.alias;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap inline-flex items-baseline gap-2 py-2 group relative transition-colors ${
                      isActive
                        ? "text-[#E86C3A] font-bold"
                        : "text-[#F3F1EC] hover:text-[#E86C3A]"
                    }`}
                  >
                    <span className="font-mono text-[12px] font-bold text-[#E86C3A]" aria-hidden="true">
                      [{item.num}]
                    </span>
                    <span className="font-sans text-[13.5px] uppercase tracking-wider font-semibold whitespace-nowrap">
                      {isEn ? item.labelEn : item.labelVi}
                    </span>

                    {/* Badge số món đặt trước trên link thực đơn */}
                    {item.href === "/thuc-don" && totalItems > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 bg-[#E86C3A] text-white text-[10px] font-mono rounded-full font-bold">
                        {totalItems}
                      </span>
                    )}

                    {/* Thanh gạch chân 2px màu cam ở đáy khi active */}
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#E86C3A] transition-transform duration-300 origin-left ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Actions: Khay món, Ngôn ngữ, Giao diện, Gọi ngay & Hamburger */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {/* Khay đặt trước nhanh nếu có món */}
              {totalItems > 0 && (
                <Link
                  href="/chi-duong-lien-he#dat-ban-form"
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B2420] border border-[#E86C3A]/50 rounded-full text-[12px] font-mono text-[#E86C3A] hover:bg-[#E86C3A] hover:text-white transition-all"
                  title="Xem khay món đặt trước"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{totalItems} món</span>
                </Link>
              )}

              {/* VN / EN Switcher */}
              <div
                className="inline-flex items-center rounded-full p-0.5 border border-white/15 bg-[#161A18] text-[11px] font-mono font-bold"
                role="group"
                aria-label="Chọn ngôn ngữ"
              >
                <button
                  type="button"
                  onClick={() => setLocale("vi")}
                  className={`px-2 py-0.5 rounded-full transition-all duration-200 ${
                    !isEn
                      ? "bg-[#E86C3A] text-white shadow-xs font-black"
                      : "text-[#F3F1EC]/70 hover:text-white"
                  }`}
                >
                  VN
                </button>
                <span className="text-[10px] opacity-25 px-0.5">·</span>
                <button
                  type="button"
                  onClick={() => setLocale("en")}
                  className={`px-2 py-0.5 rounded-full transition-all duration-200 ${
                    isEn
                      ? "bg-[#E86C3A] text-white shadow-xs font-black"
                      : "text-[#F3F1EC]/70 hover:text-white"
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Hotline Button */}
              <a
                href="tel:0382851688"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-[#E86C3A] text-white font-sans font-bold text-[13px] uppercase tracking-wider clip-chamfer-14 hover:opacity-90 active:scale-95 transition-all shadow-md"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>0382 851 688</span>
              </a>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="xl:hidden p-2 border border-white/20 rounded-sm text-[#F3F1EC] hover:text-[#E86C3A] hover:border-[#E86C3A] transition-colors"
                aria-label="Mở menu điều hướng"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Fullscreen Mobile Drawer: Nền tối sang trọng #0E100F */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-[#0E100F] text-[#F3F1EC] flex flex-col justify-between p-6 sm:p-10 overflow-y-auto"
          >
            {/* Header trong menu */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <StarHoya size={22} className="text-[#E86C3A]" />
                <span className="font-display font-black text-[22px] tracking-tight uppercase text-[#F3F1EC]">
                  CẨM CÙ HOUSE
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 border border-white/20 hover:border-[#E86C3A] rounded-sm text-[#F3F1EC]"
                aria-label="Đóng menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 5 liên kết chuẩn trên Mobile */}
            <nav className="flex flex-col gap-4 py-8">
              {NAV_ITEMS.map((item, index) => {
                const isActive = pathname === item.href || pathname === item.alias;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="group flex items-baseline gap-3 py-2 border-b border-white/5"
                    >
                      <span className="font-mono text-sm text-[#E86C3A]">[{item.num}]</span>
                      <span
                        className={`font-display font-extrabold text-[clamp(24px,6vw,40px)] uppercase leading-none tracking-tight transition-colors ${
                          isActive
                            ? "text-[#E86C3A]"
                            : "text-[#F3F1EC] group-hover:text-[#E86C3A]"
                        }`}
                      >
                        {isEn ? item.labelEn : item.labelVi}
                      </span>
                      {item.href === "/thuc-don" && totalItems > 0 && (
                        <span className="px-2 py-0.5 bg-[#E86C3A] text-white text-[11px] font-mono rounded-full font-bold ml-2">
                          {totalItems} món
                        </span>
                      )}
                      <ArrowRight className="w-6 h-6 opacity-0 group-hover:opacity-100 text-[#E86C3A] -translate-x-2 group-hover:translate-x-0 transition-all ml-auto" />
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Chân drawer: Gọi · Maps · Zalo */}
            <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-2">
                <a
                  href="tel:0382851688"
                  className="py-3 px-2 bg-[#E86C3A] text-white font-bold text-center font-mono text-[12px] uppercase rounded-sm flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>GỌI</span>
                </a>
                <a
                  href="https://zalo.me/0382851688"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-2 bg-[#161A18] border border-white/15 text-[#F3F1EC] font-bold text-center font-mono text-[12px] uppercase rounded-sm flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#E86C3A]" />
                  <span>ZALO</span>
                </a>
                <a
                  href="https://maps.app.goo.gl/G6aP51qJ6aDabp676"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-2 bg-[#161A18] border border-white/15 text-[#F3F1EC] font-bold text-center font-mono text-[12px] uppercase rounded-sm flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#E86C3A]" />
                  <span>CHỈ ĐƯỜNG</span>
                </a>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#F3F1EC]/60">
                <span>HẺM 437 HÙNG VƯƠNG, GIA NGHĨA</span>
                <span>07:00 – 18:00 (T6-CN: 22:00)</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
