"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Menu as MenuIcon, X } from "lucide-react";
import { motion, useSpring } from "framer-motion";

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

  // Tự động ẩn khi cuộn xuống, hiện khi cuộn lên
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY.current + 5 && !mobileMenuOpen) {
          // Đang cuộn xuống -> Ẩn
          setShowHeader(false);
        } else if (currentScrollY < lastScrollY.current - 5) {
          // Đang cuộn lên -> Hiện
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

  // Tắt Header khách ở trang Admin
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        showHeader ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      } ${
        isScrolled
          ? "backdrop-blur-md bg-[#1A0F0A]/75 border-b border-[#C5A880]/15 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent border-b border-transparent py-5"
      } px-6 sm:px-10`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-serif text-[#F4EFEA] font-bold tracking-wider cursor-pointer select-none group flex items-center gap-2"
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

          {/* Nút chuyển đổi ngôn ngữ */}
          <div className="flex items-center gap-2 ml-4 border border-[#C5A880]/30 rounded-full px-3 py-1 bg-[#25150E]/60 backdrop-blur-sm shadow-sm">
            <button
              onClick={() => setLang("vi")}
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

        {/* Mobile menu button and language switch */}
        <div className="flex md:hidden items-center gap-3">
          <div className="flex items-center gap-1.5 border border-[#C5A880]/30 rounded-full px-2.5 py-1 bg-[#25150E]/80">
            <button
              onClick={() => setLang("vi")}
              className={`text-xs font-medium ${
                lang === "vi" ? "text-[#C5A880] font-bold" : "text-[#F4EFEA]/60"
              }`}
            >
              VI
            </button>
            <span className="text-[#C5A880]/40 text-xs">|</span>
            <button
              onClick={() => setLang("en")}
              className={`text-xs font-medium ${
                lang === "en" ? "text-[#C5A880] font-bold" : "text-[#F4EFEA]/60"
              }`}
            >
              EN
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#F4EFEA]/80 hover:text-[#F4EFEA] rounded-lg focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-[#C5A880]/20 flex flex-col gap-3 pb-2 animate-in fade-in slide-in-from-top-2 duration-300 backdrop-blur-xl bg-[#1A0F0A]/95 rounded-2xl p-4 mt-3 border border-[#C5A880]/15">
          {navItemsList.map((item) => {
            const isActive = pathname === item.id;
            return (
              <Link
                key={item.id}
                href={item.id}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? "bg-[#2E180E] text-[#C5A880] font-semibold"
                    : "text-[#F4EFEA]/80 hover:bg-[#25150E] hover:text-[#F4EFEA]"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
