"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { href: "/", labelKey: "nav.home" },
  { href: "/about", labelKey: "nav.about" },
  { href: "/space", labelKey: "nav.space" },
  { href: "/menu", labelKey: "nav.menu" },
  { href: "/contact", labelKey: "nav.contact" },
];

export default function Header() {
  const pathname = usePathname() || "";
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isAdmin = pathname.startsWith("/portal-camcu-2610") || pathname.startsWith("/wp-admin");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (isAdmin) return null;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#0C0D0B]/95 border-b border-[#222520] shadow-md"
          : "bg-[#0C0D0B]/80 border-b border-[#222520]/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        {/* LOGO BÊN TRÁI */}
        <Link href="/" className="group flex flex-col justify-center">
          <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#FDFBF7] group-hover:text-[#C88A4B] transition-colors duration-200">
            Cẩm Cù House
          </span>
          <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#C88A4B] -mt-1 hidden sm:block">
            Coffee &amp; Food • Gia Nghĩa
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
                    ? "text-[#C88A4B] font-semibold"
                    : "text-[#FDFBF7]/75 hover:text-[#FDFBF7]"
                }`}
              >
                {t(item.labelKey)}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C88A4B] rounded-full"
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
          <div className="inline-flex items-center p-1 rounded-full bg-[#1A1D17] border border-[#222520] text-xs font-medium">
            <button
              onClick={() => setLang("vi")}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                lang === "vi"
                  ? "bg-[#C88A4B] text-[#0C0D0B] font-bold"
                  : "text-[#FDFBF7]/60 hover:text-[#FDFBF7]"
              }`}
            >
              VN
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                lang === "en"
                  ? "bg-[#C88A4B] text-[#0C0D0B] font-bold"
                  : "text-[#FDFBF7]/60 hover:text-[#FDFBF7]"
              }`}
            >
              EN
            </button>
          </div>

          {/* Nút CTA viền mỏng thanh lịch */}
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#C88A4B]/70 text-[#C88A4B] hover:bg-[#C88A4B] hover:text-[#0C0D0B] text-xs sm:text-sm font-medium transition-all duration-200 shadow-xs"
          >
            <span>{t("nav.viewMenu")}</span>
          </Link>
        </div>

        {/* NÚT TOGGLE MENU MOBILE */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setLang(lang === "vi" ? "en" : "vi")}
            className="px-2.5 py-1 rounded-full bg-[#1A1D17] border border-[#222520] text-xs font-semibold text-[#C88A4B]"
          >
            {lang === "vi" ? "EN" : "VN"}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="w-10 h-10 rounded-full bg-[#1A1D17] border border-[#222520] flex items-center justify-center text-[#FDFBF7]"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER (KHÔNG DÙNG CSS BLUR) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-[#0C0D0B] border-b border-[#222520] px-6 py-6 shadow-xl"
          >
            <nav className="flex flex-col gap-4">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-base font-medium py-2 border-b border-[#222520]/60 flex items-center justify-between ${
                      isActive
                        ? "text-[#C88A4B] font-bold"
                        : "text-[#FDFBF7]/80 hover:text-[#C88A4B]"
                    }`}
                  >
                    <span>{t(item.labelKey)}</span>
                    <ArrowRight size={16} className="text-[#C88A4B]" />
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 pt-4 flex flex-col gap-3">
              <Link
                href="/menu"
                className="w-full py-3 rounded-full border border-[#C88A4B] text-[#C88A4B] text-center text-sm font-medium flex items-center justify-center gap-2"
              >
                <span>{t("nav.viewMenu")}</span>
              </Link>
              <a
                href="tel:0382851688"
                className="w-full py-3 rounded-full bg-[#2D4A3E] text-[#FDFBF7] text-center text-sm font-medium flex items-center justify-center gap-2"
              >
                <span>Hotline: 038 285 1688</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

