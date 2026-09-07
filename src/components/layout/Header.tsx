"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Menu as MenuIcon, X, Phone, Clock, MapPin, Coffee, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useSpring } from "framer-motion";

const navItemsList = [
  { id: "/", key: "nav.home" },
  { id: "/about", key: "nav.about" },
  { id: "/space", key: "nav.space" },
  { id: "/menu", key: "nav.menu" },
  { id: "/contact", key: "nav.contact" },
];

// Component Magnetic Link tạo lực hút theo con trỏ chuột chuẩn Awwwards
function MagneticLink({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const springConfig = { damping: 15, stiffness: 180, mass: 0.2 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    // Hút nhẹ tối đa 7px
    x.set((clientX - centerX) * 0.25);
    y.set((clientY - centerY) * 0.25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div style={{ x, y }} className="inline-block">
      <Link
        ref={ref}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative cursor-pointer select-none group py-2 px-1 block"
      >
        <span
          className={`text-sm tracking-wide font-medium transition-colors duration-300 ${
            isActive
              ? "text-[#C5A880] font-semibold"
              : "text-[#F4EFEA]/80 group-hover:text-[#F4EFEA]"
          }`}
        >
          {children}
        </span>

        <div
          className={`absolute bottom-0 left-0 h-[2px] bg-[#C5A880] transition-all duration-300 ease-out ${
            isActive ? "w-full" : "w-0 group-hover:w-full"
          }`}
        />
      </Link>
    </motion.div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  // Tự động ẩn khi cuộn xuống, hiện khi cuộn lên (không ẩn khi menu mobile đang mở)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (mobileMenuOpen) {
        setShowHeader(true);
        return;
      }

      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY.current + 5) {
          setShowHeader(false);
        } else if (currentScrollY < lastScrollY.current - 5) {
          setShowHeader(true);
        }
      } else {
        setShowHeader(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen]);

  // Khóa cuộn trang khi drawer mở
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Đóng menu khi thay đổi trang
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Đóng khi nhấn phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Tắt Header khách ở trang Admin
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          showHeader ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        } ${
          isScrolled
            ? "backdrop-blur-md bg-[#1A0F0A]/85 border-b border-[#C5A880]/20 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
            : "bg-transparent border-b border-transparent py-4 sm:py-5"
        } px-4 sm:px-8 md:px-10`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo Thương hiệu */}
          <Link
            href="/"
            className="text-xl sm:text-2xl font-serif text-[#F4EFEA] font-bold tracking-wider cursor-pointer select-none group flex items-center gap-2"
          >
            <span className="group-hover:text-[#C5A880] transition-colors">
              Cẩm Cù House
            </span>
          </Link>

          {/* Desktop Nav với Magnetic Links */}
          <nav className="hidden md:flex gap-8 items-center">
            {navItemsList.map((item) => {
              const isActive = pathname === item.id;
              return (
                <MagneticLink key={item.id} href={item.id} isActive={isActive}>
                  {t(item.key)}
                </MagneticLink>
              );
            })}

            {/* Nút chuyển đổi ngôn ngữ & tiền tệ (Desktop) */}
            <div className="flex items-center gap-2 ml-4 border border-[#C5A880]/35 rounded-full px-3.5 py-1 bg-[#25150E]/70 backdrop-blur-md shadow-sm">
              <button
                onClick={() => setLang("vi")}
                title="Tiếng Việt (VNĐ ₫)"
                className={`text-xs font-medium transition-colors cursor-pointer ${
                  lang === "vi"
                    ? "text-[#C5A880] font-bold"
                    : "text-[#F4EFEA]/60 hover:text-[#F4EFEA]"
                }`}
              >
                🇻🇳 VI
              </button>
              <span className="text-[#C5A880]/40 text-xs">|</span>
              <button
                onClick={() => setLang("en")}
                title="English (USD $)"
                className={`text-xs font-medium transition-colors cursor-pointer ${
                  lang === "en"
                    ? "text-[#C5A880] font-bold"
                    : "text-[#F4EFEA]/60 hover:text-[#F4EFEA]"
                }`}
              >
                🇬🇧 EN
              </button>
            </div>
          </nav>

          {/* Mobile Right Controls: Compact Lang Switch + Nút Hamburger Menu */}
          <div className="flex md:hidden items-center gap-2 sm:gap-2.5 z-50">
            {/* Nút đổi ngôn ngữ thu nhỏ trên thanh Header */}
            <div className="flex items-center border border-[#C5A880]/30 rounded-full px-2 py-0.5 bg-[#25150E]/90 backdrop-blur-md shadow-sm">
              <button
                onClick={() => setLang("vi")}
                title="Tiếng Việt (VNĐ)"
                className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                  lang === "vi"
                    ? "text-[#C5A880] font-bold bg-[#C5A880]/15"
                    : "text-[#F4EFEA]/60 hover:text-[#F4EFEA]"
                }`}
              >
                VI
              </button>
              <span className="text-[#C5A880]/30 text-[10px] mx-0.5">|</span>
              <button
                onClick={() => setLang("en")}
                title="English (USD $)"
                className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                  lang === "en"
                    ? "text-[#C5A880] font-bold bg-[#C5A880]/15"
                    : "text-[#F4EFEA]/60 hover:text-[#F4EFEA]"
                }`}
              >
                EN
              </button>
            </div>

            {/* Nút Hamburger Menu Mobile - Viền vàng Gold, nền tối sang trọng, tương phản cao */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              id="mobile-hamburger-btn"
              className="w-10 h-10 rounded-full bg-[#25150E]/95 backdrop-blur-md border border-[#C5A880]/50 text-[#C5A880] hover:text-[#F4EFEA] hover:border-[#C5A880] active:scale-95 flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.6)] transition-all duration-200 cursor-pointer focus:outline-none z-50"
              aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu điều hướng"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X size={20} className="text-[#C5A880]" strokeWidth={2.4} />
              ) : (
                <MenuIcon size={20} className="text-[#C5A880]" strokeWidth={2.4} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Modal Toàn Diện */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[60] md:hidden">
            {/* Backdrop làm mờ khi mở Drawer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />

            {/* Panel Drawer trượt êm ái từ phải sang */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="absolute top-0 right-0 bottom-0 w-full max-w-[320px] sm:max-w-sm bg-[#160B07] border-l border-[#C5A880]/25 shadow-2xl flex flex-col justify-between p-6 sm:p-7 overflow-y-auto z-[70]"
            >
              {/* Top Section của Drawer */}
              <div>
                {/* Header trong Drawer */}
                <div className="flex items-center justify-between pb-5 border-b border-[#C5A880]/20">
                  <div>
                    <span className="text-xl font-serif text-[#F4EFEA] font-bold tracking-wider block">
                      Cẩm Cù House
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#C5A880] font-mono block mt-0.5">
                      CINEMATIC ECO-SANCTUARY
                    </span>
                  </div>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-9 h-9 rounded-full bg-[#25150E] border border-[#C5A880]/40 text-[#C5A880] hover:text-[#1A0F0A] hover:bg-[#C5A880] flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                    aria-label="Đóng menu"
                  >
                    <X size={18} strokeWidth={2.4} />
                  </button>
                </div>

                {/* Danh sách các liên kết trang */}
                <nav className="flex flex-col gap-1.5 py-6">
                  {navItemsList.map((item, idx) => {
                    const isActive = pathname === item.id;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 * idx, duration: 0.3 }}
                      >
                        <Link
                          href={item.id}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-serif transition-all duration-200 ${
                            isActive
                              ? "bg-[#C5A880]/15 text-[#C5A880] font-semibold border-l-2 border-[#C5A880]"
                              : "text-[#F4EFEA]/85 hover:bg-[#25150E] hover:text-[#F4EFEA]"
                          }`}
                        >
                          <span className="tracking-wide">{t(item.key)}</span>
                          <ArrowRight
                            size={14}
                            className={isActive ? "text-[#C5A880]" : "text-[#F4EFEA]/30"}
                          />
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Chuyển đổi ngôn ngữ & tiền tệ nổi bật bên trong Drawer */}
                <div className="pt-1 pb-5">
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A880]/80 font-mono block mb-2 px-1">
                    {lang === "en" ? "LANGUAGE & CURRENCY" : "NGÔN NGỮ & TIỀN TỆ"}
                  </span>
                  <div className="grid grid-cols-2 gap-2 bg-[#25150E]/80 p-1.5 rounded-xl border border-[#C5A880]/25 shadow-inner">
                    <button
                      onClick={() => setLang("vi")}
                      className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        lang === "vi"
                          ? "bg-[#C5A880] text-[#1A0F0A] font-bold shadow"
                          : "text-[#F4EFEA]/70 hover:text-[#F4EFEA]"
                      }`}
                    >
                      <span>🇻🇳 VI</span>
                      <span className="text-[10px] opacity-80">(VNĐ)</span>
                    </button>
                    <button
                      onClick={() => setLang("en")}
                      className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        lang === "en"
                          ? "bg-[#C5A880] text-[#1A0F0A] font-bold shadow"
                          : "text-[#F4EFEA]/70 hover:text-[#F4EFEA]"
                      }`}
                    >
                      <span>🇬🇧 EN</span>
                      <span className="text-[10px] opacity-80">(USD $)</span>
                    </button>
                  </div>
                </div>

                {/* Nút hành động đặt bàn & xem menu */}
                <div className="space-y-2.5 pt-1">
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 px-4 rounded-xl bg-[#C5A880] hover:bg-[#FFE1B3] text-[#1A0F0A] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(197,168,128,0.3)] transition-all active:scale-[0.98]"
                  >
                    <Coffee size={15} />
                    <span>{t("home.sec5ContactBtn")}</span>
                  </Link>
                  <Link
                    href="/menu"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 rounded-xl border border-[#C5A880]/40 text-[#F4EFEA] hover:bg-[#25150E] text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <span>{t("home.sec5MenuBtn")}</span>
                  </Link>
                </div>
              </div>

              {/* Bottom Footer của Drawer: Thông tin liên hệ nhanh */}
              <div className="pt-6 mt-6 border-t border-[#C5A880]/15 space-y-2 text-[11px] text-[#F4EFEA]/65 font-light">
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="text-[#C5A880] shrink-0" />
                  <span className="truncate">Gia Nghĩa, Đắk Nông</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-[#C5A880] shrink-0" />
                    <span>07:00 - 22:00</span>
                  </div>
                  <a
                    href="tel:0382851688"
                    className="text-[#C5A880] font-mono hover:underline flex items-center gap-1 font-medium"
                  >
                    <Phone size={11} /> 038 285 1688
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
