"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Menu as MenuIcon, X } from "lucide-react";

const navItemsList = [
  { id: "/", key: "nav.home" },
  { id: "/about", key: "nav.about" },
  { id: "/space", key: "nav.space" },
  { id: "/menu", key: "nav.menu" },
  { id: "/posts", key: "nav.stories" },
  { id: "/contact", key: "nav.contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Tắt Header khách ở trang Admin
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md bg-[#1A0F0A]/90 border-b border-[#C5A880]/20 px-6 py-4 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link 
          href="/"
          className="text-2xl font-serif text-[#F4EFEA] font-bold tracking-wider cursor-pointer select-none group"
        >
          <span className="group-hover:text-[#C5A880] transition-colors">Cẩm Cù House</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {navItemsList.map((item) => {
            const isActive = pathname === item.id;
            return (
              <Link 
                key={item.id} 
                href={item.id}
                className="relative cursor-pointer select-none group py-2"
              >
                <span className={`text-sm tracking-wide font-medium transition-colors duration-300 ${isActive ? "text-[#C5A880] font-semibold" : "text-[#F4EFEA]/80 group-hover:text-[#F4EFEA]"}`}>
                  {t(item.key)}
                </span>
                
                <div 
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#C5A880] transition-all duration-300 ease-out ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </Link>
            );
          })}
          
          <div className="flex items-center gap-2 ml-4 border border-[#C5A880]/30 rounded-full px-3 py-1 bg-[#25150E]/80 shadow-sm">
            <button 
              onClick={() => setLang("vi")}
              className={`text-xs font-medium transition-colors cursor-pointer ${lang === "vi" ? "text-[#C5A880] font-bold" : "text-[#F4EFEA]/60 hover:text-[#F4EFEA]"}`}
            >
              🇻🇳 VI
            </button>
            <span className="text-[#C5A880]/40 text-xs">|</span>
            <button 
              onClick={() => setLang("en")}
              className={`text-xs font-medium transition-colors cursor-pointer ${lang === "en" ? "text-[#C5A880] font-bold" : "text-[#F4EFEA]/60 hover:text-[#F4EFEA]"}`}
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
              className={`text-xs font-medium ${lang === "vi" ? "text-[#C5A880] font-bold" : "text-[#F4EFEA]/60"}`}
            >
              VI
            </button>
            <span className="text-[#C5A880]/40 text-xs">|</span>
            <button 
              onClick={() => setLang("en")}
              className={`text-xs font-medium ${lang === "en" ? "text-[#C5A880] font-bold" : "text-[#F4EFEA]/60"}`}
            >
              EN
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#F4EFEA]/80 hover:text-[#F4EFEA] rounded-lg focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-[#C5A880]/20 flex flex-col gap-3 pb-2 animate-in fade-in slide-in-from-top-2 duration-300">
          {navItemsList.map((item) => {
            const isActive = pathname === item.id;
            return (
              <Link 
                key={item.id} 
                href={item.id}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  isActive ? "bg-[#2E180E] text-[#C5A880] font-semibold" : "text-[#F4EFEA]/80 hover:bg-[#25150E] hover:text-[#F4EFEA]"
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
