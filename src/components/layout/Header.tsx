"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Menu, X, Phone, Calendar, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { href: "/", labelVi: "Trang chủ", labelEn: "Home" },
  { href: "/about", labelVi: "Giới thiệu", labelEn: "About" },
  { href: "/space", labelVi: "Không gian", labelEn: "Space" },
  { href: "/menu", labelVi: "Thực đơn", labelEn: "Menu" },
  { href: "/contact", labelVi: "Liên hệ", labelEn: "Contact" },
];

export default function Header() {
  const pathname = usePathname() || "";
  const { lang, setLang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/wp-admin");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Đóng mobile menu khi chuyển trang
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (isAdmin) return null;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#FDFBF7]/95 shadow-sm border-b border-[#EAE6DF]"
          : "bg-[#FDFBF7]/85 border-b border-[#EAE6DF]/60"
      } backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        {/* LOGO BÊN TRÁI */}
        <Link
          href="/"
          className="group flex flex-col justify-center"
        >
          <span className="font-serif text-2xl sm:text-3xl font-bold text-[#2D4A3E] tracking-tight group-hover:text-[#C88A4B] transition-colors duration-200">
            Cẩm Cù House
          </span>
          <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#C88A4B] -mt-1 hidden sm:block">
            Coffee &amp; Botanical Sanctuary
          </span>
        </Link>

        {/* MENU ĐIỀU HƯỚNG TRUNG TÂM (DESKTOP) */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-1 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-[#2D4A3E] font-semibold"
                    : "text-[#222222]/80 hover:text-[#2D4A3E]"
                }`}
              >
                {lang === "en" ? item.labelEn : item.labelVi}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2D4A3E] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CỤM BÊN PHẢI: BỘ CHỌN NGÔN NGỮ & NÚT CTA */}
        <div className="hidden md:flex items-center gap-4">
          {/* Bộ chọn ngôn ngữ [VN | EN] */}
          <div className="inline-flex items-center p-1 rounded-full bg-[#EAE6DF]/60 border border-[#EAE6DF] text-xs font-medium">
            <button
              onClick={() => setLang("vi")}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                lang === "vi"
                  ? "bg-[#2D4A3E] text-white shadow-xs font-semibold"
                  : "text-[#222222]/70 hover:text-[#2D4A3E]"
              }`}
            >
              VN
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                lang === "en"
                  ? "bg-[#2D4A3E] text-white shadow-xs font-semibold"
                  : "text-[#222222]/70 hover:text-[#2D4A3E]"
              }`}
            >
              EN
            </button>
          </div>

          {/* Nút CTA góc phải: "Xem Menu" bo tròn viền xanh #2D4A3E */}
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#2D4A3E] text-[#2D4A3E] hover:bg-[#2D4A3E] hover:text-white text-xs sm:text-sm font-medium transition-all duration-200 shadow-xs hover:shadow-sm"
          >
            <span>{lang === "en" ? "Explore Menu" : "Xem Menu"}</span>
          </Link>
        </div>

        {/* NÚT TOGGLE MENU MOBILE */}
        <div className="flex md:hidden items-center gap-3">
          {/* Nút đổi ngôn ngữ mobile */}
          <button
            onClick={() => setLang(lang === "vi" ? "en" : "vi")}
            className="px-2.5 py-1 rounded-full bg-[#EAE6DF]/70 text-xs font-semibold text-[#2D4A3E]"
          >
            {lang === "vi" ? "EN" : "VN"}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="w-10 h-10 rounded-full bg-[#EAE6DF]/60 border border-[#EAE6DF] flex items-center justify-center text-[#2D4A3E]"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-[#FDFBF7] border-b border-[#EAE6DF] px-6 py-6 shadow-xl"
          >
            <nav className="flex flex-col gap-4">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-base font-medium py-2 border-b border-[#EAE6DF]/50 flex items-center justify-between ${
                      isActive
                        ? "text-[#2D4A3E] font-bold"
                        : "text-[#222222]/80 hover:text-[#2D4A3E]"
                    }`}
                  >
                    <span>{lang === "en" ? item.labelEn : item.labelVi}</span>
                    <ArrowRight size={16} className="text-[#C88A4B]" />
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 pt-4 flex flex-col gap-3">
              <Link
                href="/menu"
                className="w-full py-3 rounded-full border border-[#2D4A3E] text-[#2D4A3E] text-center text-sm font-medium shadow-xs flex items-center justify-center gap-2"
              >
                <span>{lang === "en" ? "Explore Menu" : "Xem Menu"}</span>
              </Link>

              <a
                href="tel:0382851688"
                className="w-full py-3 rounded-full border border-[#2D4A3E] text-[#2D4A3E] text-center text-sm font-medium flex items-center justify-center gap-2"
              >
                <Phone size={16} />
                <span>Hotline: 038 285 1688</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
