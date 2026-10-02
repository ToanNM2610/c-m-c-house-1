"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  PhoneCall, 
  User, 
  Menu as MenuIcon, 
  X, 
  MapPin, 
  Sparkles 
} from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Trang Chủ" },
  { href: "/about", label: "Giới Thiệu" },
  { href: "/space", label: "Không Gian Suối" },
  { href: "/menu", label: "Thực Đơn" },
  { href: "/contact", label: "Chỉ Đường & Liên Hệ" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<"VN" | "EN">("VN");

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#F9F8F3]/95 backdrop-blur-md border-b border-stone-200/80 shadow-[0_2px_12px_rgba(37,51,38,0.04)] transition-all">
      <div className="h-20 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 rounded-full bg-[#3E5C46]/10 flex items-center justify-center text-[#3E5C46] group-hover:bg-[#3E5C46] group-hover:text-white transition-all duration-300 shadow-sm">
            <Sparkles className="w-5 h-5 text-current animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#3E5C46] tracking-tight group-hover:text-[#2D4233] transition-colors">
              Cẩm Cù House
            </span>
            <span className="text-[11px] sm:text-xs text-stone-600 font-medium tracking-wide">
              coffee &amp; Food • Gia Nghĩa
            </span>
          </div>
          {/* Quick Hours Pill */}
          <div className="hidden xl:flex items-center gap-1.5 ml-2 px-3 py-1 bg-stone-100 rounded-full text-stone-600 text-xs border border-stone-200/60 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-[#396663]" />
            <span>07h - 22h</span>
          </div>
        </Link>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-stone-100/90 rounded-full border border-stone-200/70 shadow-inner">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-[#3E5C46] text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions Deck */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Toggle */}
          <div className="hidden sm:inline-flex items-center bg-stone-100 rounded-full p-0.5 text-xs font-semibold text-stone-600 border border-stone-200/60">
            <button
              type="button"
              onClick={() => setLang("VN")}
              className={`px-2.5 py-1 rounded-full transition-all ${
                lang === "VN"
                  ? "bg-white text-[#3E5C46] shadow-sm font-bold"
                  : "hover:text-stone-900"
              }`}
            >
              VN
            </button>
            <button
              type="button"
              onClick={() => setLang("EN")}
              className={`px-2.5 py-1 rounded-full transition-all ${
                lang === "EN"
                  ? "bg-white text-[#3E5C46] shadow-sm font-bold"
                  : "hover:text-stone-900"
              }`}
            >
              EN
            </button>
          </div>

          {/* Hotline CTA */}
          <a
            href="tel:0382851688"
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-[#3E5C46] text-white text-xs sm:text-sm font-semibold hover:bg-[#2D4233] transition-all shadow-[0_4px_14px_rgba(62,92,70,0.25)] hover:-translate-y-0.5 shrink-0"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span className="hidden sm:inline">Gọi Hotline:</span>
            <span>038 285 1688</span>
          </a>

          {/* Admin link */}
          <Link
            href="/admin"
            title="Quản trị viên"
            className="w-9 h-9 rounded-full bg-[#3E5C46] hover:bg-[#2D4233] text-white flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105"
          >
            <User className="w-4 h-4" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full bg-stone-100 text-stone-800 hover:bg-stone-200 transition-colors border border-stone-200"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#F9F8F3] border-b border-stone-200 px-6 py-5 flex flex-col gap-3 shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 text-xs text-stone-600">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#396663]" />
                07:00 - 22:00
              </span>
              <span className="flex items-center gap-1 font-semibold text-[#3E5C46]">
                <MapPin className="w-3.5 h-3.5" />
                Gia Nghĩa, Đắk Nông
              </span>
            </div>

            <div className="flex flex-col gap-1.5 pt-2">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-[#3E5C46] text-white"
                        : "text-stone-800 hover:bg-stone-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row gap-2">
              <a
                href="tel:0382851688"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#3E5C46] text-white text-sm font-semibold shadow-md"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Gọi Hotline: 038 285 1688</span>
              </a>
              <a
                href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-stone-100 text-[#3E5C46] text-sm font-semibold hover:bg-stone-200"
              >
                <MapPin className="w-4 h-4 text-[#396663]" />
                <span>Mở Google Maps</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
